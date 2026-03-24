import { NFCService } from './lib/nfc-service.js';
import { PaymentService } from './lib/payment-service.js';
import { UIController } from './lib/ui-controller.js';
import { UI_STATES } from './lib/config.js';

// Inicializar servicios
const nfcService = new NFCService();
const paymentService = new PaymentService();
const ui = new UIController();

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (!nfcService.isSupported()) {
        ui.disableNFCSupport();
    }
});

// ==========================================
// FLUJO: COBRAR (Leer Anillo y Pagar)
// ==========================================
ui.elements.chargeBtn.addEventListener('click', async () => {
    const amount = Number(ui.elements.amountInput.value);
    const merchant = ui.elements.merchantAddress.value.trim();

    if (!amount || amount <= 0 || !Number.isSafeInteger(amount)) {
        ui.transitionState(UI_STATES.ERROR, { error: 'Ingresá un monto válido para cobrar.' });
        return;
    }

    const lnUrlRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!merchant || !lnUrlRegex.test(merchant)) {
        ui.transitionState(UI_STATES.ERROR, { error: 'Ingresá una Lightning Address válida.' });
        return;
    }

    try {
        // 1. Iniciar Escaneo
        ui.transitionState(UI_STATES.SCANNING, {
            message: `<strong>Acercá el anillo</strong> del cliente al reverso del teléfono para cobrar ${amount} sats.<br><br>⏱️ Esperando...`
        });

        // 2. Leer NWC del Anillo
        const nwcUri = await nfcService.readNWC();
        
        // 3. Conectar a NWC
        ui.transitionState(UI_STATES.CONNECTING_WALLET);
        await paymentService.connectNWC(nwcUri);

        // 4. Pedir Invoice
        ui.transitionState(UI_STATES.REQUESTING_INVOICE);
        const invoice = await paymentService.requestInvoice(merchant, amount);

        // 5. Pagar Invoice
        ui.transitionState(UI_STATES.PAYING);
        const result = await paymentService.payInvoice(invoice);

        // 6. Éxito
        ui.transitionState(UI_STATES.SUCCESS, { amount, preimage: result.preimage });

    } catch (error) {
        ui.transitionState(UI_STATES.ERROR, { error: error.message || String(error) });
    }
});

// ==========================================
// FLUJO: COBRAR (NWC Manual)
// ==========================================
ui.elements.chargeManualBtn.addEventListener('click', async () => {
    const amount = Number(ui.elements.amountInput.value);
    const merchant = ui.elements.merchantAddress.value.trim();

    if (!amount || amount <= 0 || !Number.isSafeInteger(amount)) {
        ui.transitionState(UI_STATES.ERROR, { error: 'Ingresá un monto válido para cobrar.' });
        return;
    }

    const lnUrlRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!merchant || !lnUrlRegex.test(merchant)) {
        ui.transitionState(UI_STATES.ERROR, { error: 'Ingresá una Lightning Address válida.' });
        return;
    }

    const nwcUri = prompt('Pegá la URI de Nostr Wallet Connect (nostr+walletconnect://...)');
    if (!nwcUri || !nwcUri.trim().startsWith('nostr+walletconnect://')) {
        if (nwcUri !== null) {
            ui.transitionState(UI_STATES.ERROR, { error: 'Ingresá una URI válida.' });
        }
        return;
    }

    try {
        ui.transitionState(UI_STATES.CONNECTING_WALLET);
        await paymentService.connectNWC(nwcUri.trim());

        ui.transitionState(UI_STATES.REQUESTING_INVOICE);
        const invoice = await paymentService.requestInvoice(merchant, amount);

        ui.transitionState(UI_STATES.PAYING);
        const result = await paymentService.payInvoice(invoice);

        ui.transitionState(UI_STATES.SUCCESS, { amount, preimage: result.preimage });

    } catch (error) {
        ui.transitionState(UI_STATES.ERROR, { error: error.message || String(error) });
    }
});

// ==========================================
// FLUJO: CONFIGURAR ANILLO (Escribir NWC)
// ==========================================
ui.elements.writeBtn.addEventListener('click', async () => {
    const nwc = ui.elements.nwcString.value.trim();

    if (!nwc || !nwc.startsWith('nostr+walletconnect://')) {
        ui.transitionState(UI_STATES.ERROR, { error: 'Ingresá una URI válida (debe empezar con nostr+walletconnect://)' });
        return;
    }

    try {
        ui.transitionState(UI_STATES.SCANNING, {
            message: '<strong>Acercá el anillo</strong> al reverso de tu teléfono para vincularlo a tu billetera...<br><br>⏱️ Esperando...'
        });

        await nfcService.writeNWC(nwc);

        ui.elements.nwcString.value = ''; 
        ui.showStatus('✅ <strong>¡Anillo configurado con éxito!</strong><br>Ya podés usarlo para pagar.', 'success');
        
        setTimeout(() => {
            if (ui.currentState !== UI_STATES.SCANNING) ui.transitionState(UI_STATES.IDLE);
        }, 3000);

    } catch (error) {
        ui.transitionState(UI_STATES.ERROR, { error: error.message || String(error) });
    }
});
