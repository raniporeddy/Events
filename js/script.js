/**
 * CampusConnect — Global SaaS UI Scripts
 * Handles Dark Mode, Header Navigation, Notifications, Toast Notifications, and Common Dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (Dark / Light Mode)
  initTheme();

  // 2. Initialize Top Header & Nav
  initHeader();

  // 3. Initialize Notification Bell
  initNotificationBell();

  // 4. Close Dropdowns on Click Outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu-wrap')) {
      const uPanel = document.getElementById('userDropdownPanel');
      if (uPanel) uPanel.classList.remove('open');
    }
    if (!e.target.closest('.notif-bell-wrap')) {
      const nPanel = document.getElementById('notifDropdownMenu');
      if (nPanel) nPanel.classList.remove('open');
    }
  });
});

/* ─── THEME MANAGER ─── */
function initTheme() {
  const saved = localStorage.getItem('campusconnect_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('campusconnect_theme', next);
  updateThemeIcon(next);
  showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    if (window.Icons) window.Icons.render(btn);
  }
}

/* ─── HEADER & USER STATUS ─── */
function initHeader() {
  const session = (window.Auth && window.Auth.getSession) ? window.Auth.getSession() : null;
  const userSlot = document.getElementById('headerUserSlot') || document.getElementById('headerUserMenu');
  const roleLinkSlot = document.getElementById('headerRoleLinkSlot');

  const inSubdir = window.location.pathname.includes('/admin/') ||
                   window.location.pathname.includes('/faculty/') ||
                   window.location.pathname.includes('/company/');
  const rootPrefix = inSubdir ? '../' : '';

  if (roleLinkSlot && session) {
    let dashboardUrl = `${rootPrefix}profile.html`;
    let dashboardLabel = 'Student Portal';
    let dashboardIcon = 'fa-user-graduate';

    if (session.role === 'admin') {
      dashboardUrl = `${rootPrefix}admin/dashboard.html`;
      dashboardLabel = 'Admin Portal';
      dashboardIcon = 'fa-user-shield';
    } else if (session.role === 'faculty') {
      dashboardUrl = `${rootPrefix}faculty/dashboard.html`;
      dashboardLabel = 'Faculty Portal';
      dashboardIcon = 'fa-chalkboard-teacher';
    } else if (session.role === 'company') {
      dashboardUrl = `${rootPrefix}company/dashboard.html`;
      dashboardLabel = 'Industry Portal';
      dashboardIcon = 'fa-building';
    }

    roleLinkSlot.innerHTML = `
      <li>
        <a href="${dashboardUrl}" class="nav-portal-link active">
          <i class="fas ${dashboardIcon}"></i> ${dashboardLabel}
        </a>
      </li>
    `;
  }

  if (userSlot) {
    if (session) {
      const initials = (session.name || 'User').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      let roleUrl = `${rootPrefix}profile.html`;
      if (session.role === 'admin') roleUrl = `${rootPrefix}admin/dashboard.html`;
      else if (session.role === 'faculty') roleUrl = `${rootPrefix}faculty/dashboard.html`;
      else if (session.role === 'company') roleUrl = `${rootPrefix}company/dashboard.html`;

      userSlot.innerHTML = `
        <div class="user-menu-wrap">
          <button class="user-profile-btn" onclick="toggleUserDropdown(event)">
            <div class="user-nav-avatar">${initials}</div>
            <div class="user-nav-info">
              <div class="user-nav-name">${session.name}</div>
              <div class="user-nav-role-badge">${session.role}</div>
            </div>
            <i class="fas fa-chevron-down" style="font-size:0.75rem;color:var(--text-muted);margin-left:2px;"></i>
          </button>

          <div class="user-dropdown-panel" id="userDropdownPanel">
            <div style="padding:0.6rem 0.85rem;border-bottom:1px solid var(--border);margin-bottom:0.3rem;">
              <div style="font-weight:700;font-size:0.88rem;color:var(--text);">${session.name}</div>
              <div style="font-size:0.78rem;color:var(--text-muted);">${session.email}</div>
            </div>
            <a href="${roleUrl}"><i class="fas fa-tachometer-alt"></i> My Dashboard</a>
            <a href="${rootPrefix}profile.html"><i class="fas fa-user-circle"></i> My Profile & Passes</a>
            ${session.role === 'admin' ? `<a href="${rootPrefix}admin/system-settings.html"><i class="fas fa-cog"></i> System Settings</a>` : ''}
            <a href="${rootPrefix}verify-certificate.html"><i class="fas fa-certificate"></i> Verify Certificate</a>
            <div class="divider"></div>
            <button class="logout-btn" onclick="Auth.logout()"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
          </div>
        </div>
      `;
    } else {
      userSlot.innerHTML = `
        <a href="${rootPrefix}auth.html" class="btn btn-outline btn-sm"><i class="fas fa-sign-in-alt"></i> Sign In</a>
        <a href="${rootPrefix}auth.html?mode=register" class="btn btn-primary btn-sm"><i class="fas fa-user-plus"></i> Register</a>
      `;
    }
  }
  if (window.Icons) window.Icons.render();
}

function toggleUserDropdown(e) {
  e.stopPropagation();
  const panel = document.getElementById('userDropdownPanel');
  if (panel) panel.classList.toggle('open');
}

/* ─── NOTIFICATION BELL ─── */
function initNotificationBell() {
  const session = window.Auth && window.Auth.getSession ? window.Auth.getSession() : null;
  const listEl = document.getElementById('notifDropdownList');
  const badgeEl = document.getElementById('notifBadgePill');

  if (!window.DB) return;
  const allNotifs = window.DB.getAll('notifications') || [];
  const myNotifs = allNotifs.filter(n =>
    n.user_id === 'all' || (session && (n.user_id === session.userId || n.user_id === session.email))
  );

  const unreadCount = myNotifs.filter(n => !n.read).length;

  if (badgeEl) {
    if (unreadCount > 0) {
      badgeEl.textContent = unreadCount;
      badgeEl.style.display = 'block';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  if (listEl) {
    if (myNotifs.length === 0) {
      listEl.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-muted);font-size:0.85rem;"><i class="fas fa-bell-slash" style="font-size:1.5rem;display:block;margin-bottom:0.5rem;opacity:0.5;"></i>No notifications yet</div>`;
      return;
    }

    listEl.innerHTML = myNotifs.slice(0, 6).map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <div class="notif-item-icon" style="background:var(--secondary-light);color:var(--secondary);">
          <i class="fas ${n.type === 'certificate' ? 'fa-certificate' : (n.type === 'registration' ? 'fa-ticket-alt' : 'fa-bell')}"></i>
        </div>
        <div class="notif-item-body">
          <strong>${n.title}</strong>
          <span>${n.message}</span>
        </div>
      </div>
    `).join('');
  }
}

function toggleNotifDropdown(e) {
  e.stopPropagation();
  const panel = document.getElementById('notifDropdownMenu');
  if (panel) {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      const session = window.Auth && window.Auth.getSession ? window.Auth.getSession() : null;
      if (session && window.DB) {
        window.DB.markNotificationsRead(session.userId);
        const badge = document.getElementById('notifBadgePill');
        if (badge) badge.style.display = 'none';
      }
    }
  }
  if (window.Icons) window.Icons.render();
}

/* ─── TOAST NOTIFICATIONS ─── */
function showToast(message, type = 'info') {
  let container = document.getElementById('appToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'appToastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';

  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  if (window.Icons) window.Icons.render(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ─── TOAST GLOBAL API ─── */
window.Toast = {
  show: (message, type = 'info') => showToast(message, type),
  success: (message) => showToast(message, 'success'),
  error: (message) => showToast(message, 'error'),
  warning: (message) => showToast(message, 'warning'),
  info: (message) => showToast(message, 'info')
};

/* ─── FORMATTING HELPERS ─── */
function formatDate(dStr) {
  if (!dStr) return '—';
  try {
    const d = new Date(dStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dStr;
  }
}

function formatTime(tStr) {
  if (!tStr) return '';
  const [h, m] = tStr.split(':');
  if (!h) return tStr;
  const hour = Number(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m || '00'} ${ampm}`;
}

window.showToast = showToast;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.toggleTheme = toggleTheme;
window.toggleNotifDropdown = toggleNotifDropdown;
window.toggleUserDropdown = toggleUserDropdown;
