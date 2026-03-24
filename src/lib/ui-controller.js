import { UI_STATES } from './config.js';

export class UIController {
  constructor() {
    this.elements = {
      nfcWarning: document.getElementById('nfcWarning'),
      chargeBtn: document.getElementById('chargeBtn'),
      chargeManualBtn: document.getElementById('chargeManualBtn'),
      writeBtn: document.getElementById('writeBtn'),
      amountInput: document.getElementById('amount'),
      merchantAddress: document.getElementById('merchantAddress'),
      nwcString: document.getElementById('nwcString'),
      statusFeedback: document.getElementById('statusFeedback')
    };

    this.currentState = UI_STATES.IDLE;
  }

  escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return String(unsafe);
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  disableNFCSupport() {
    this.elements.nfcWarning.style.display = 'block';
    this.elements.chargeBtn.disabled = true;
    this.elements.writeBtn.disabled = true;
    this.elements.chargeBtn.innerHTML = 'NFC no soportado 😔';
    this.elements.writeBtn.innerHTML = 'NFC no soportado 😔';
  }

  transitionState(newState, payload = {}) {
    this.currentState = newState;
    console.log(`UI State Transition: ${newState}`);

    switch (newState) {
      case UI_STATES.IDLE:
        this.elements.chargeBtn.disabled = false;
        this.elements.chargeManualBtn.disabled = false;
        this.elements.writeBtn.disabled = false;
        
        // Restore buttons text
        if (!this.elements.chargeBtn.innerHTML.includes('NFC no soportado')) {
          this.elements.chargeBtn.innerHTML = '<span style="font-size: 1.5rem">📱</span> Escanear anillo para Cobrar';
          this.elements.writeBtn.innerHTML = '<span style="font-size: 1.5rem">✍️</span> Escribir en el Anillo';
        }
        this.elements.chargeManualBtn.innerHTML = '<span style="font-size: 1.2rem">⌨️</span> Pegar NWC manualmente';
        break;

      case UI_STATES.SCANNING:
        this.elements.chargeBtn.disabled = true;
        this.elements.chargeManualBtn.disabled = true;
        this.elements.chargeBtn.innerHTML = '🔄 Escaneando...';
        this.showStatus(payload.message || 'Acercá el anillo NFC...', 'scanning');
        break;

      case UI_STATES.CONNECTING_WALLET:
        this.showStatus('🔄 Conectando con la billetera del cliente...', 'scanning');
        break;

      case UI_STATES.REQUESTING_INVOICE:
        this.showStatus('🎫 Generando invoice para el comercio...', 'scanning');
        break;

      case UI_STATES.PAYING:
        this.showStatus('⚡ Ejecutando pago Lightning... Por favor espera.', 'scanning');
        break;

      case UI_STATES.SUCCESS:
        this.showStatus(`
          <strong>✅ ¡Pago Recibido con Éxito!</strong><br><br>
          <strong>Monto:</strong> ${payload.amount} sats<br>
          <strong>Recibo (Preimage):</strong><br><span style="font-size:0.75rem; word-break: break-all;">${this.escapeHtml(payload.preimage)}</span>
        `, 'success');
        this.elements.amountInput.value = '';
        this.transitionState(UI_STATES.IDLE);
        break;

      case UI_STATES.ERROR:
        this.showStatus(`❌ <strong>Error en el proceso:</strong><br>${this.escapeHtml(payload.error)}`, 'error');
        this.transitionState(UI_STATES.IDLE);
        break;
    }
  }

  showStatus(message, type = 'scanning') {
    this.elements.statusFeedback.className = `status-${type}`;
    this.elements.statusFeedback.innerHTML = message;
  }
}
