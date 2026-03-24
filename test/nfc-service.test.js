import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NFCService } from '../src/lib/nfc-service.js';

describe('NFCService', () => {
  let service;
  
  beforeEach(() => {
    // Mock the global NDEFReader before each test
    global.window = global.window || {};
    
    // Default mock NDEFReader
    global.window.NDEFReader = class {
      scan() { return Promise.resolve(true); }
      write() { return Promise.resolve(true); }
      addEventListener(event, callback) {
        if (event === 'reading') {
          global.simulateNFCRead = callback;
        }
        if (event === 'error') {
          global.simulateNFCError = callback;
        }
      }
    };

    service = new NFCService();
  });

  it('should correctly identify if NFC is supported', () => {
    expect(service.isSupported()).toBe(true);
  });

  it('should successfully write a valid NWC string', async () => {
    const validNwc = 'nostr+walletconnect://valid-uri';
    await expect(service.writeNWC(validNwc)).resolves.toBe(true);
  });

  it('should reject writing an invalid NWC string', async () => {
    const invalidNwc = 'invalid-uri';
    await expect(service.writeNWC(invalidNwc)).rejects.toThrow(/El string no parece un NWC válido/);
  });

  it('should successfully read a valid NWC string from NFC', async () => {
    const promise = service.readNWC();
    
    // Simulate reading event with valid NWC
    const mockMessage = {
      records: [{
        recordType: 'text',
        encoding: 'utf-8',
        data: new TextEncoder().encode('nostr+walletconnect://simulated-nwc')
      }]
    };
    
    // Yield event loop so reader.scan() can resolve and listeners attach
    await new Promise(resolve => setTimeout(resolve, 10));

    // Trigger callback
    if (global.simulateNFCRead) {
      global.simulateNFCRead({ message: mockMessage, serialNumber: '1234' });
    }
    
    const result = await promise;
    expect(result).toBe('nostr+walletconnect://simulated-nwc');
  });

  it('should reject reading if no valid NWC string is found', async () => {
    const promise = service.readNWC();
    
    // Simulate reading event with invalid data
    const mockMessage = {
      records: [{
        recordType: 'text',
        encoding: 'utf-8',
        data: new TextEncoder().encode('some random text')
      }]
    };
    
    // Yield event loop
    await new Promise(resolve => setTimeout(resolve, 10));

    if (global.simulateNFCRead) {
      global.simulateNFCRead({ message: mockMessage, serialNumber: '1234' });
    }
    
    await expect(promise).rejects.toThrow(/no contiene una cadena NWC válida/);
  });
});
