import { NFCService } from './lib/nfc-service.js';
import { PaymentService } from './lib/payment-service.js';

// Inicializar servicios
const nfcService = new NFCService();
const paymentService = new PaymentService();

// Referencias a elementos UI
const elements = {
    nfcWarning: document.getElementById('nfcWarning'),
    chargeBtn: document.getElementById('chargeBtn'),
    writeBtn: document.getElementById('writeBtn'),
    amountInput: document.getElementById('amount'),
    merchantAddress: document.getElementById('merchantAddress'),
    nwcString: document.getElementById('nwcString'),
    statusFeedback: document.getElementById('statusFeedback')
};

// Utilidad para mostrar notificaciones de estado
function showStatus(message, type = 'scanning') {
    elements.statusFeedback.className = `status-${type}`;
    elements.statusFeedback.innerHTML = message;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (!nfcService.isSupported()) {
        elements.nfcWarning.style.display = 'block';

        // Deshabilitar botones para evitar errores
        elements.chargeBtn.disabled = true;
        elements.writeBtn.disabled = true;

        // Cambiar el texto a un emoji triste
        elements.chargeBtn.innerHTML = 'NFC no soportado 😔';
        elements.writeBtn.innerHTML = 'NFC no soportado 😔';
    }
});

// ==========================================
// FLUJO: COBRAR (Leer Anillo y Pagar)
// ==========================================
elements.chargeBtn.addEventListener('click', async () => {
    const amount = parseInt(elements.amountInput.value);
    const merchant = elements.merchantAddress.value.trim();

    if (!amount || amount <= 0) {
        showStatus('⚠️ Ingresá un monto válido para cobrar.', 'error');
        return;
    }

    if (!merchant || !merchant.includes('@')) {
        showStatus('⚠️ Ingresá una Lightning Address válida.', 'error');
        return;
    }

    try {
        // 1. Iniciar Escaneo
        elements.chargeBtn.disabled = true;
        elements.chargeBtn.innerHTML = '🔄 Escaneando...';
        showStatus(`<strong>Acercá el anillo</strong> del cliente al reverso del teléfono para cobrar ${amount} sats.<br><br>⏱️ Esperando...`, 'scanning');

        // 2. Leer NWC del Anillo
        const nwcUri = await nfcService.readNWC();
        showStatus('✅ ¡Anillo detectado! Solicitando cobro a la billetera...', 'scanning');

        // 3. Procesar Pago Lightning
        const result = await paymentService.processNFCPayment(nwcUri, merchant, amount);

        // 4. Éxito
        showStatus(`
      <strong>✅ ¡Pago Recibido con Éxito!</strong><br><br>
      <strong>Monto:</strong> ${amount} sats<br>
      <strong>Recibo (Preimage):</strong><br><span style="font-size:0.75rem; word-break: break-all;">${result.preimage}</span>
    `, 'success');

        // Reiniciar input
        elements.amountInput.value = '';

    } catch (error) {
        showStatus(`❌ <strong>Error en el proceso:</strong><br>${error.message || error}`, 'error');
    } finally {
        // Restaurar botón
        if (nfcService.isSupported()) {
            elements.chargeBtn.disabled = false;
            elements.chargeBtn.innerHTML = '<span style="font-size: 1.5rem">📱</span> Escanear anillo para Cobrar';
        }
    }
});

// ==========================================
// FLUJO: CONFIGURAR ANILLO (Escribir NWC)
// ==========================================
elements.writeBtn.addEventListener('click', async () => {
    const nwc = elements.nwcString.value.trim();

    if (!nwc || !nwc.startsWith('nostr+walletconnect://')) {
        showStatus('⚠️ Ingresá una URI válida (debe empezar con nostr+walletconnect://)', 'error');
        return;
    }

    try {
        elements.writeBtn.disabled = true;
        elements.writeBtn.innerHTML = '🔄 Escribiendo...';

        showStatus('<strong>Acercá el anillo</strong> al reverso de tu teléfono para vincularlo a tu billetera...<br><br>⏱️ Esperando...', 'scanning');

        await nfcService.writeNWC(nwc);

        showStatus('✅ <strong>¡Anillo configurado con éxito!</strong><br>Ya podés usarlo para pagar.', 'success');
        elements.nwcString.value = ''; // Limpiar input por seguridad

    } catch (error) {
        showStatus(`❌ <strong>Error al vincular:</strong><br>${error.message || error}`, 'error');
    } finally {
        if (nfcService.isSupported()) {
            elements.writeBtn.disabled = false;
            elements.writeBtn.innerHTML = '<span style="font-size: 1.5rem">✍️</span> Escribir en el Anillo';
        }
    }
});
