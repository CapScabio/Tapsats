import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentService } from '../src/lib/payment-service.js';

// Mocking dependencies
vi.mock('@getalby/sdk', () => ({
  webln: {
    NWC: class {
      enable() { return Promise.resolve(true); }
      getInfo() { return Promise.resolve({ node: { alias: 'TestNode' } }); }
      sendPayment() { return Promise.resolve({ preimage: 'fake-preimage-123' }); }
    }
  }
}));

vi.mock('@getalby/lightning-tools', () => ({
  LightningAddress: class {
    fetch() { return Promise.resolve(true); }
    requestInvoice() { return Promise.resolve({ paymentRequest: 'lnbc1fakeinvoice' }); }
  }
}));

describe('PaymentService', () => {
  let service;

  beforeEach(() => {
    service = new PaymentService();
    vi.clearAllMocks();
  });

  it('should initialize without an active NWC client', () => {
    expect(service.nwcClient).toBeNull();
  });

  it('should connect to NWC and return info', async () => {
    const info = await service.connectNWC('nostr+walletconnect://test-nwc');
    expect(info.node.alias).toBe('TestNode');
    expect(service.nwcClient).not.toBeNull();
  });

  it('should request an invoice successfully', async () => {
    const invoice = await service.requestInvoice('test@getalby.com', 100);
    expect(invoice).toBe('lnbc1fakeinvoice');
  });

  it('should fail to pay invoice if not connected', async () => {
    await expect(service.payInvoice('lnbcfake')).rejects.toThrow(/No hay conexión NWC activa/);
  });

  it('should process full NFC payment end-to-end', async () => {
    const result = await service.processNFCPayment('nostr+walletconnect://test-nwc', 'test@getalby.com', 100);
    
    expect(result.success).toBe(true);
    expect(result.invoice).toBe('lnbc1fakeinvoice');
    expect(result.preimage).toBe('fake-preimage-123');
  });
});
