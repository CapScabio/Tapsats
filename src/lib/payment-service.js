import { webln } from "@getalby/sdk";
import { LightningAddress } from "@getalby/lightning-tools";

/**
 * Servicio para procesar pagos Lightning
 * Usa el string NWC leído desde el anillo para autorizar la transacción
 */
export class PaymentService {
    constructor() {
        this.nwcClient = null;
    }

    /**
     * Conecta el cliente NWC utilizando la URI
     * @param {string} nwcUri La uri nostr+walletconnect extraida del anillo
     */
    async connectNWC(nwcUri) {
        try {
            this.nwcClient = new webln.NWC({
                nostrWalletConnectUrl: nwcUri
            });
            await this.nwcClient.enable();
            // Opcional: Obtener info para validar conexión
            const info = await this.nwcClient.getInfo();
            console.log("Conectado a NWC:", info);
            return info;
        } catch (error) {
            console.error("Error conectando a NWC:", error);
            throw new Error(`Fallo al conectar la billetera del anillo: ${error.message || error}`);
        }
    }

    /**
     * Genera un invoice para un destinatario (ej. el comercio)
     * @param {string} recipientLnAddress La dirección lightning de quien cobra (ej. tienda@getalby.com)
     * @param {number} amountSats Monto en satoshis a cobrar
     * @param {string} comment Comentario o descripción de la compra
     */
    async requestInvoice(recipientLnAddress, amountSats, comment = "Pago desde NFC Ring") {
        try {
            const ln = new LightningAddress(recipientLnAddress);
            await ln.fetch();

            const invoiceData = await ln.requestInvoice({
                satoshi: amountSats,
                comment: comment
            });

            return invoiceData.paymentRequest;
        } catch (error) {
            console.error("Error creando invoice:", error);
            throw new Error(`Fallo al generar el invoice para el cobro: ${error.message || error}`);
        }
    }

    /**
     * Paga un invoice (bolt11) usando la conexión NWC activa
     * @param {string} invoice Factura BOLT11
     */
    async payInvoice(invoice) {
        if (!this.nwcClient) {
            throw new Error("No hay conexión NWC activa. Escanea el anillo primero.");
        }

        try {
            const response = await this.nwcClient.sendPayment(invoice);
            return response;
        } catch (error) {
            console.error("Error procesando pago:", error);
            throw new Error(`Fallo al procesar el pago: ${error.message || error}`);
        }
    }

    /**
     * Flujo completo: Crear invoice para el comercio y pagarlo con el NWC del anillo
     */
    async processNFCPayment(nwcUri, storeAddress, amountSats) {
        // 1. Conectar la wallet del usuario (anillo)
        await this.connectNWC(nwcUri);

        // 2. Crear un invoice a favor de la tienda
        const invoice = await this.requestInvoice(storeAddress, amountSats);

        // 3. Pagar el invoice
        const result = await this.payInvoice(invoice);

        // 4. Desconectar o limpiar (opcional, para mayor seguridad)
        // this.nwcClient = null; // Descomentar si no queremos mantener la sesion abierta

        return {
            success: true,
            preimage: result.preimage,
            invoice: invoice
        };
    }
}
