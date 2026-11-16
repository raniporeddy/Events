/**
 * EVENTS — AI Event Assistant Chatbot Engine
 * Name: EVENTS AI ASSISTANT
 * Answers questions using real platform event data, recommends events, explains registration & certificates.
 */

const EventsChatbot = (() => {
  let isChatOpen = false;
  let chatHistory = [];

  const SUGGESTED_QUESTIONS = [
    'What events are happening this week?',
    'Show upcoming technical events.',
    'Are there any hackathons?',
    'How can I register for an event?',
    'Which events have available seats?',
    'Show industry-related events.',
    'How can I download my certificate?',
    'Where can I find my registered events?'
  ];

  function init() {
    if (document.getElementById('eventsChatbotToggle')) return;
    renderChatbotDOM();
    bindEvents();
  }

  function renderChatbotDOM() {
    // 1. Floating Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'eventsChatbotToggle';
    toggleBtn.className = 'events-chatbot-toggle';
    toggleBtn.setAttribute('title', 'Chat with EVENTS AI Assistant');
    toggleBtn.setAttribute('aria-label', 'Chat with EVENTS AI Assistant');
    toggleBtn.innerHTML = `
      <div class="chatbot-pulse"></div>
      <i class="fas fa-robot"></i>
    `;
    document.body.appendChild(toggleBtn);

    // 2. Chatbot Window
    const chatWin = document.createElement('div');
    chatWin.id = 'eventsChatbotWindow';
    chatWin.className = 'events-chatbot-window';
    chatWin.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">
            <i class="fas fa-sparkles"></i>
            <span class="chatbot-online-indicator"></span>
          </div>
          <div>
            <div class="chatbot-title">EVENTS AI ASSISTANT</div>
            <div class="chatbot-subtitle"><i class="fas fa-bolt" style="color:#F59E0B"></i> Active Event Intelligence</div>
          </div>
        </div>
        <div class="chatbot-header-actions">
          <button class="chatbot-control-btn" id="chatbotMinimizeBtn" title="Minimize Window"><i class="fas fa-minus"></i></button>
          <button class="chatbot-control-btn" id="chatbotClearBtn" title="Clear Conversation"><i class="fas fa-trash-alt"></i></button>
          <button class="chatbot-control-btn" id="chatbotCloseBtn" title="Close"><i class="fas fa-times"></i></button>
        </div>
      </div>

      <div class="chatbot-body" id="chatbotMessages">
        <!-- Messages rendered dynamically -->
      </div>

      <div class="chatbot-chips-bar" id="chatbotChipsBar">
        <!-- Suggested chips rendered dynamically -->
      </div>

      <div class="chatbot-footer">
        <form id="chatbotForm" onsubmit="EventsChatbot.handleUserSubmit(event)" class="chatbot-input-wrap">
          <input type="text" id="chatbotInput" class="chatbot-input" placeholder="Ask about events, workshops, registration..." autocomplete="off">
          <button type="submit" class="chatbot-send-btn" id="chatbotSendBtn" title="Send message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(chatWin);

    // Initial greeting
    addBotMessage(
      "Hello! Welcome to Events. I can help you discover upcoming events, workshops, hackathons, seminars, and industry programs. What are you looking for today?"
    );
    renderChips();
  }

  function bindEvents() {
    const toggleBtn = document.getElementById('eventsChatbotToggle');
    const closeBtn = document.getElementById('chatbotCloseBtn');
    const minimizeBtn = document.getElementById('chatbotMinimizeBtn');
    const clearBtn = document.getElementById('chatbotClearBtn');

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        const chatWin = document.getElementById('eventsChatbotWindow');
        chatWin.classList.toggle('minimized');
      });
    }
    clearBtn.addEventListener('click', () => {
      document.getElementById('chatbotMessages').innerHTML = '';
      addBotMessage(
        "Conversation reset. How can I assist you with university events, registrations, or certificates today?"
      );
      renderChips();
    });
  }

  function toggleChat() {
    if (isChatOpen) closeChat();
    else openChat();
  }

  function openChat() {
    const chatWin = document.getElementById('eventsChatbotWindow');
    chatWin.classList.add('active');
    chatWin.classList.remove('minimized');
    isChatOpen = true;
    document.getElementById('eventsChatbotToggle').innerHTML = '<i class="fas fa-times"></i>';
    setTimeout(() => {
      document.getElementById('chatbotInput').focus();
    }, 150);
  }

  function closeChat() {
    const chatWin = document.getElementById('eventsChatbotWindow');
    chatWin.classList.remove('active');
    isChatOpen = false;
    document.getElementById('eventsChatbotToggle').innerHTML = `
      <div class="chatbot-pulse"></div>
      <i class="fas fa-robot"></i>
    `;
  }

  function renderChips() {
    const bar = document.getElementById('chatbotChipsBar');
    if (!bar) return;
    bar.innerHTML = SUGGESTED_QUESTIONS.map(q => `
      <button type="button" class="chatbot-chip-btn" onclick="EventsChatbot.askQuestion('${escapeHtml(q)}')"><i class="fas fa-comment-dots" style="font-size:0.75rem;margin-right:5px;opacity:0.8"></i>${q}</button>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  function addUserMessage(text) {
    const container = document.getElementById('chatbotMessages');
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg user';
    msgEl.innerHTML = `
      <div class="chat-msg-avatar"><i class="fas fa-user"></i></div>
      <div class="chat-bubble">${escapeText(text)}</div>
    `;
    container.appendChild(msgEl);
    scrollToBottom();
  }

  function addBotMessage(text, cardsHtml = '') {
    const container = document.getElementById('chatbotMessages');
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';
    msgEl.innerHTML = `
      <div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="chat-bubble">
        <div>${text}</div>
        ${cardsHtml}
      </div>
    `;
    container.appendChild(msgEl);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const container = document.getElementById('chatbotMessages');
    const indicator = document.createElement('div');
    indicator.id = 'chatTypingIndicator';
    indicator.className = 'chat-msg bot';
    indicator.innerHTML = `
      <div class="chat-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="chat-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    container.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();
  }

  function scrollToBottom() {
    const container = document.getElementById('chatbotMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function escapeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async function handleUserSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('chatbotInput');
    const query = input.value.trim();
    if (!query) return;

    input.value = '';
    askQuestion(query);
  }

  async function askQuestion(query) {
    addUserMessage(query);
    showTypingIndicator();

    // 1. Try backend AI endpoint if reachable
    let answered = false;
    const apiBase = (window.CampusConfig && typeof window.CampusConfig.get === 'function' && window.CampusConfig.get('apiBase'))
      || window.API_BASE_URL
      || ((window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
          ? 'http://localhost:3000/api'
          : 'https://events-i8r7.onrender.com/api');

    try {
      const resp = await fetch(`${apiBase}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.ok && data.reply) {
          removeTypingIndicator();
          addBotMessage(data.reply, data.cardsHtml || '');
          answered = true;
        }
      }
    } catch (err) {
      // Backend not running or offline, proceed to rule-based event intelligence
    }

    if (!answered) {
      setTimeout(() => {
        removeTypingIndicator();
        const response = processQueryWithRealData(query);
        addBotMessage(response.text, response.cardsHtml);
      }, 450);
    }
  }

  /**
   * Smart rule-based query processor utilizing real application database records.
   */
  function processQueryWithRealData(query) {
    const q = query.toLowerCase().trim();
    const allEvents = (window.DB ? window.DB.getAll('events') : []);
    const approvedEvents = allEvents.filter(e => e.approval === 'approved' || !e.approval);

    // 1. Hackathons
    if (q.includes('hackathon')) {
      const hacks = approvedEvents.filter(e => 
        e.category.toLowerCase().includes('hackathon') ||
        e.title.toLowerCase().includes('hackathon')
      );
      if (hacks.length) {
        return {
          text: `We have <strong>${hacks.length} hackathon(s)</strong> available for registration:`,
          cardsHtml: renderEventPills(hacks)
        };
      }
      return {
        text: "Currently, no hackathons are scheduled. Would you like to check out technical workshops or symposiums instead?",
        cardsHtml: renderCategoryLinks(['Workshops', 'Technical Symposium'])
      };
    }

    // 2. Events this week
    if (q.includes('this week') || q.includes('upcoming') || q.includes('soon')) {
      const sorted = [...approvedEvents].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
      if (sorted.length) {
        return {
          text: `Here are the top upcoming events happening on campus:`,
          cardsHtml: renderEventPills(sorted)
        };
      }
      return { text: "No upcoming events found on the schedule right now.", cardsHtml: '' };
    }

    // 3. Technical Events & Symposiums
    if (q.includes('technical') || q.includes('symposium') || q.includes('tech')) {
      const tech = approvedEvents.filter(e => 
        e.category.toLowerCase().includes('technical') ||
        e.category.toLowerCase().includes('symposium') ||
        (e.tags && e.tags.toLowerCase().includes('ai')) ||
        (e.tags && e.tags.toLowerCase().includes('cloud'))
      ).slice(0, 3);
      return {
        text: `Here are our featured technical symposiums and technology programs:`,
        cardsHtml: renderEventPills(tech.length ? tech : approvedEvents.slice(0, 2))
      };
    }

    // 4. Workshops
    if (q.includes('workshop')) {
      const workshops = approvedEvents.filter(e => e.category.toLowerCase().includes('workshop')).slice(0, 3);
      return {
        text: `Here are the hands-on technical workshops available:`,
        cardsHtml: renderEventPills(workshops)
      };
    }

    // 5. Industry / Placement / Company
    if (q.includes('industry') || q.includes('placement') || q.includes('company') || q.includes('internship') || q.includes('job') || q.includes('recruit')) {
      const ind = approvedEvents.filter(e => 
        e.category.toLowerCase().includes('placement') ||
        e.category.toLowerCase().includes('industry') ||
        e.category.toLowerCase().includes('internship') ||
        e.organizer_type === 'company'
      );
      if (ind.length) {
        return {
          text: `Here are the company-sponsored recruitment drives and internship sessions:`,
          cardsHtml: renderEventPills(ind)
        };
      }
      return {
        text: "You can find corporate drives in our Placement and Industry Connect categories.",
        cardsHtml: `<div style="margin-top:0.5rem"><a href="events.html?cat=Placement+Activities" class="btn btn-secondary btn-xs"><i class="fas fa-briefcase"></i> Browse Placement Drives</a></div>`
      };
    }

    // 6. Available Seats
    if (q.includes('available seat') || q.includes('seat') || q.includes('capacity') || q.includes('open')) {
      const openSeats = approvedEvents.filter(e => (e.registered_count || 0) < (e.max_participants || 100)).slice(0, 3);
      return {
        text: `The following events currently have open seats available for registration:`,
        cardsHtml: renderEventPills(openSeats)
      };
    }

    // 7. How to register
    if (q.includes('how can i register') || q.includes('how to register') || q.includes('registration process')) {
      return {
        text: `<strong>Registering for an event is fast and simple:</strong><br>
        1. Browse our catalog on the <a href="events.html" style="color:var(--secondary);font-weight:600">Events Page</a>.<br>
        2. Click <strong>View Details</strong> on your chosen event.<br>
        3. Click <strong>Register for Event</strong> to generate your instant digital pass.<br>
        4. Your pass includes a unique QR code for venue gate check-in!`,
        cardsHtml: `<div style="margin-top:0.6rem"><a href="events.html" class="btn btn-primary btn-xs"><i class="fas fa-calendar-alt"></i> Browse Events Catalog</a></div>`
      };
    }

    // 8. How to download certificate
    if (q.includes('certificate') || q.includes('credential')) {
      return {
        text: `<strong>Participation Certificates:</strong><br>
        &bull; When your QR pass is scanned at the event door, a digital certificate is automatically generated.<br>
        &bull; You can download your official PNG/PDF certificate from your <a href="profile.html" style="color:var(--secondary);font-weight:600">Student Profile</a>.<br>
        &bull; Anyone can verify certificate authenticity on our public <a href="verify-certificate.html" style="color:var(--secondary);font-weight:600">Verification Portal</a>!`,
        cardsHtml: `<div style="margin-top:0.6rem;display:flex;gap:0.4rem"><a href="verify-certificate.html" class="btn btn-outline btn-xs"><i class="fas fa-shield-alt"></i> Verify Certificate</a><a href="profile.html" class="btn btn-secondary btn-xs"><i class="fas fa-user"></i> My Certificates</a></div>`
      };
    }

    // 9. My registered events
    if (q.includes('my registered') || q.includes('my event') || q.includes('my pass') || q.includes('ticket')) {
      const user = (window.Auth && window.Auth.getCurrentUser ? window.Auth.getCurrentUser() : null);
      if (!user) {
        return {
          text: `Please <a href="auth.html" style="color:var(--secondary);font-weight:600">Sign In</a> to view your registered events and access your live QR tickets.`,
          cardsHtml: `<div style="margin-top:0.5rem"><a href="auth.html" class="btn btn-primary btn-xs"><i class="fas fa-sign-in-alt"></i> Sign In / Register</a></div>`
        };
      }
      const allRegs = (window.DB ? window.DB.getAll('registrations') : []);
      const myRegs = allRegs.filter(r => r.user_id === user.id || (r.email && r.email.toLowerCase() === user.email.toLowerCase()));
      if (myRegs.length) {
        return {
          text: `You have <strong>${myRegs.length} active registration(s)</strong>:`,
          cardsHtml: myRegs.map(r => `
            <div class="chat-event-pill">
              <strong>${r.event_title}</strong>
              <div class="pill-meta">Ticket: <code>${r.ticket_id}</code> &bull; Status: ${r.status.toUpperCase()}</div>
              <a href="profile.html" class="btn-pill"><i class="fas fa-qrcode"></i> View Pass</a>
            </div>
          `).join('')
        };
      }
      return {
        text: `You haven't registered for any events yet. Check out our upcoming catalog to reserve your first ticket!`,
        cardsHtml: `<div style="margin-top:0.5rem"><a href="events.html" class="btn btn-primary btn-xs"><i class="fas fa-calendar-alt"></i> Browse Events</a></div>`
      };
    }

    // 10. Default contextual response
    // Search by title or tag keywords
    const matches = approvedEvents.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.tags && e.tags.toLowerCase().includes(q))
    ).slice(0, 3);

    if (matches.length) {
      return {
        text: `Here are events matching "<strong>${escapeText(query)}</strong>":`,
        cardsHtml: renderEventPills(matches)
      };
    }

    return {
      text: `I'm here to help you navigate Events! You can ask about hackathons, workshops, placement activities, how to register, or check available seats. What would you like to explore?`,
      cardsHtml: `<div style="margin-top:0.5rem;display:flex;gap:0.4rem;flex-wrap:wrap"><a href="events.html" class="btn btn-primary btn-xs"><i class="fas fa-calendar-alt"></i> View All Events</a><a href="calendar.html" class="btn btn-outline btn-xs"><i class="fas fa-calendar-day"></i> Open Calendar</a></div>`
    };
  }

  function renderEventPills(events) {
    if (!events || !events.length) return '';
    return events.map(ev => {
      const avail = Math.max(0, (ev.max_participants || 100) - (ev.registered_count || 0));
      return `
        <div class="chat-event-pill">
          <strong>${ev.title}</strong>
          <div class="pill-meta">
            <i class="fas fa-calendar-day"></i> ${ev.date} &bull; <i class="fas fa-map-marker-alt"></i> ${ev.venue}
            <br>
            <span style="color:var(--secondary);font-weight:600">${ev.category}</span> &bull; 
            <span style="color:${avail > 0 ? '#10B981' : '#EF4444'}">${avail > 0 ? avail + ' seats left' : 'Waitlist only'}</span>
          </div>
          <a href="event-details.html?id=${ev.id}" class="btn-pill">View Details <i class="fas fa-arrow-right"></i></a>
        </div>
      `;
    }).join('');
  }

  function renderCategoryLinks(cats) {
    return `<div style="display:flex;gap:0.4rem;margin-top:0.5rem;flex-wrap:wrap">
      ${cats.map(c => `<a href="events.html?cat=${encodeURIComponent(c)}" class="btn btn-outline btn-xs">${c}</a>`).join('')}
    </div>`;
  }

  return {
    init,
    toggleChat,
    openChat,
    closeChat,
    askQuestion,
    handleUserSubmit
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', EventsChatbot.init);
} else {
  EventsChatbot.init();
}

window.EventsChatbot = EventsChatbot;
