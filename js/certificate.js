/**
 * CampusConnect — Digital Participation Certificate Module
 * Renders authentic certificates and provides verification lookup.
 */

const CertificateEngine = (() => {

  /**
   * Generates and downloads a certificate as PNG
   */
  function generateCertificateCanvas(certData, canvasId = 'certCanvas') {
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = 1600;
    canvas.height = 1100;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    ctx.strokeStyle = '#101B3F';
    ctx.lineWidth = 18;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 4;
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

    // Header Seal / University Branding
    try {
      const logoImg = new Image();
      logoImg.src = 'assets/images/logo.png';
      if (logoImg.complete && logoImg.naturalWidth !== 0) {
        ctx.drawImage(logoImg, canvas.width / 2 - 45, 68, 90, 81);
      }
    } catch (e) {}

    ctx.fillStyle = '#101B3F';
    ctx.font = '800 30px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SRI CHANDRASEKHARENDRA SARASWATHI VISWA MAHAVIDYALAYA', canvas.width / 2, 175);

    ctx.fillStyle = '#4169E1';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillText('SCSVMV DEEMED TO BE UNIVERSITY &bull; EVENTS PLATFORM', canvas.width / 2, 210);

    // Certificate Title
    ctx.fillStyle = '#101B3F';
    ctx.font = 'bold 50px Montserrat, sans-serif';
    ctx.fillText('CERTIFICATE OF PARTICIPATION', canvas.width / 2, 290);

    ctx.fillStyle = '#475569';
    ctx.font = 'italic 24px Inter, sans-serif';
    ctx.fillText('This certificate is proudly awarded to', canvas.width / 2, 360);

    // Recipient Name
    ctx.fillStyle = '#101B3F';
    ctx.font = '800 62px Montserrat, sans-serif';
    ctx.fillText(certData.recipient_name || 'Participant Name', canvas.width / 2, 450);

    // Underline
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 380, 480);
    ctx.lineTo(canvas.width / 2 + 380, 480);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#334155';
    ctx.font = '24px Inter, sans-serif';
    const regNote = certData.reg_number ? ` (Register No: ${certData.reg_number})` : '';
    ctx.fillText(`for active and successful participation in the university event${regNote}:`, canvas.width / 2, 540);

    // Event Title
    ctx.fillStyle = '#7957D5';
    ctx.font = 'bold 38px Montserrat, sans-serif';
    ctx.fillText(`"${certData.event_title || 'Campus Event'}"`, canvas.width / 2, 620);

    // Date & Location
    ctx.fillStyle = '#64748B';
    ctx.font = '22px Inter, sans-serif';
    const instName = certData.institution || (window.CampusConfig ? window.CampusConfig.get('institutionName') : 'SCSVMV University');
    ctx.fillText(`Conducted on ${certData.issue_date || '2026-05-01'} | ${instName}`, canvas.width / 2, 690);

    // Verification ID Box
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(canvas.width / 2 - 280, 750, 560, 50);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(canvas.width / 2 - 280, 750, 560, 50);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`Certificate ID: ${certData.certificate_id || 'CC-CERT-2026-0000'}`, canvas.width / 2, 782);

    // Signatures
    const sigY = 940;

    // Left Signature
    ctx.strokeStyle = '#101B3F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, sigY);
    ctx.lineTo(520, sigY);
    ctx.stroke();

    ctx.fillStyle = '#101B3F';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('Event Coordinator', 385, sigY + 35);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Faculty Committee', 385, sigY + 60);

    // Right Signature
    ctx.beginPath();
    ctx.moveTo(canvas.width - 520, sigY);
    ctx.lineTo(canvas.width - 250, sigY);
    ctx.stroke();

    ctx.fillStyle = '#101B3F';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('Dean / Administrator', canvas.width - 385, sigY + 35);
    ctx.fillStyle = '#64748B';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Academic Affairs', canvas.width - 385, sigY + 60);

    return canvas;
  }

  /**
   * Downloads certificate as image file
   */
  function downloadCertificate(certData) {
    const canvas = generateCertificateCanvas(certData);
    const link = document.createElement('a');
    link.download = `Certificate_${certData.certificate_id || 'EVENTS'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  /**
   * Opens Print window for Certificate
   */
  function printCertificate(certData) {
    const canvas = generateCertificateCanvas(certData);
    const imgData = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${certData.recipient_name}</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff; }
            img { max-width: 95%; height: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            @media print { img { width: 100%; box-shadow: none; } }
          </style>
        </head>
        <body onload="window.print()">
          <img src="${imgData}" alt="Certificate" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  /**
   * Looks up and verifies certificate by ID
   */
  function verify(certificateId) {
    if (!certificateId || !certificateId.trim()) {
      return { ok: false, msg: 'Please enter a Certificate ID.' };
    }

    const cleanId = certificateId.trim().toLowerCase();
    if (!window.DB) return { ok: false, msg: 'Database unavailable.' };

    const certificates = window.DB.getAll('certificates') || [];
    const found = certificates.find(c => c.certificate_id.toLowerCase() === cleanId);

    if (!found) {
      return {
        ok: false,
        msg: `No certificate found matching ID "${certificateId}". Please ensure the ID is entered correctly.`
      };
    }

    return {
      ok: true,
      certificate: found,
      msg: 'Certificate Authenticity Verified!'
    };
  }

  return {
    generateCertificateCanvas,
    downloadCertificate,
    printCertificate,
    verify
  };
})();

window.CertificateEngine = CertificateEngine;
