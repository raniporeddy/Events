/**
 * CampusConnect — QR Code Attendance Engine
 * Generates secure, unique QR code passes and provides scanning & validation tools.
 */

const AttendanceSystem = (() => {

  /**
   * Generates a QR Code into a container element
   * @param {string} containerId - Element ID to render QR inside
   * @param {string} qrData - Data payload (e.g. Ticket ID)
   * @param {number} size - Dimension in pixels
   */
  function renderQRCode(containerId, qrData, size = 180) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // If QRCode.js library is loaded
    if (typeof QRCode !== 'undefined') {
      new QRCode(container, {
        text: qrData,
        width: size,
        height: size,
        colorDark: '#101B3F',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      // Fallback: Generate via modern SVG or QR API
      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}&color=10-27-63`;
      img.alt = `QR Code: ${qrData}`;
      img.style.borderRadius = '8px';
      img.style.maxWidth = '100%';
      container.appendChild(img);
    }
  }

  /**
   * Marks attendance for a participant by Ticket ID
   */
  function processCheckIn(ticketId, scannedBy = 'Organizer') {
    if (!ticketId || !ticketId.trim()) {
      return { ok: false, msg: 'Please provide a valid Ticket or Registration ID.' };
    }

    if (!window.DB) {
      return { ok: false, msg: 'Database module unavailable.' };
    }

    const result = window.DB.markAttendanceByTicket(ticketId.trim(), scannedBy);
    return result;
  }

  /**
   * Initializes HTML5 Camera Scanner if on attendance-scanner.html
   */
  function startCameraScanner(containerId, onScanSuccess) {
    if (typeof Html5QrcodeScanner === 'undefined') {
      console.warn('Html5QrcodeScanner library not loaded yet.');
      return null;
    }

    const scanner = new Html5QrcodeScanner(containerId, {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true
    }, false);

    scanner.render((decodedText) => {
      if (onScanSuccess) {
        onScanSuccess(decodedText);
      }
    }, (error) => {
      // Ignore frame errors during scanning
    });

    return scanner;
  }

  return {
    renderQRCode,
    processCheckIn,
    startCameraScanner
  };
})();

window.AttendanceSystem = AttendanceSystem;
