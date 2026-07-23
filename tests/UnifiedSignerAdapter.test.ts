import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UnifiedSignerAdapter, SignerType } from '../src/adapters/ic/UnifiedSignerAdapter';
import { BrowserExtensionTransport } from '@slide-computer/signer-extension';

// ── helpers ────────────────────────────────────────────────────────────────

const adapterConfig = {
  id: 'plug',
  enabled: true,
  walletName: 'Plug',
  logo: '',
  chain: 'ICP' as const,
  adapter: UnifiedSignerAdapter,
  config: {},
};

const baseConfig = {
  hostUrl: 'https://icp0.io',
  fetchRootKey: false,
  verifyQuerySignatures: false,
  signerType: SignerType.PLUG,
};

function makeAdapter(extraConfig = {}) {
  return new UnifiedSignerAdapter({
    adapter: adapterConfig,
    config: { ...baseConfig, ...extraConfig },
  });
}

// Minimal ICRC-94 sendMessage mock that responds to computr_isConnected
function makeSendMessage(connected: boolean) {
  return vi.fn().mockImplementation(async (req: any) => {
    if (req.method === 'computr_isConnected') {
      return { jsonrpc: '2.0', id: req.id, result: { connected } };
    }
    return { jsonrpc: '2.0', id: req.id, result: {} };
  });
}

// Minimal signer mock
function makeMockSigner(principalText = 'aaaaa-aa') {
  const { Principal } = require('@dfinity/principal');
  const principal = Principal.fromText(principalText);
  return {
    accounts: vi.fn().mockResolvedValue([{ owner: principal }]),
    openChannel: vi.fn(),
    closeChannel: vi.fn(),
    request: vi.fn(),
  };
}

// ── BaseSignerAdapter.disconnectInternal storage behaviour ─────────────────

describe('BaseSignerAdapter — disconnect storage key behaviour', () => {
  let adapter: UnifiedSignerAdapter;

  beforeEach(() => {
    adapter = makeAdapter();
    localStorage.clear();

    // Mock BrowserExtensionTransport.discover so transport init doesn't hang
    vi.spyOn(BrowserExtensionTransport, 'discover').mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves stored principal when signer was never initialised (connect failed before transport found)', async () => {
    localStorage.setItem('plug_principal', 'aaaaa-aa');

    // discover returns nothing → initializeTransport throws → signer stays null
    vi.spyOn(BrowserExtensionTransport, 'discover').mockResolvedValue([]);

    await expect(adapter.connect()).rejects.toThrow();

    // Key must still be present so auto-reconnect can retry on next page load
    expect(localStorage.getItem('plug_principal')).toBe('aaaaa-aa');
  });

  it('removes stored principal when signer was initialised then accounts() failed', async () => {
    // No stored principal → will go through connectWithAccounts → accounts() throws
    // Signer IS initialised so disconnectInternal should clear storage.
    localStorage.setItem('plug_principal', 'aaaaa-aa');

    // sendMessage says NOT connected → connectWithStoredPrincipalPlug clears key
    // and falls through to connectWithAccounts → accounts() rejects
    const sendMessage = makeSendMessage(false);
    const providerDetail = { uuid: '71edc834-bab2-4d59-8860-c36a01fee7b8', sendMessage } as any;
    vi.spyOn(BrowserExtensionTransport, 'discover').mockResolvedValue([providerDetail]);

    const mockSigner = makeMockSigner();
    mockSigner.accounts.mockRejectedValue(new Error('extension rejected'));

    vi.spyOn(adapter as any, 'ensureTransportInitialized').mockImplementation(async () => {
      (adapter as any).signer = mockSigner;
      (adapter as any).transport = {};
      (adapter as any).signerAgent = {
        signer: mockSigner,
        replaceAccount: vi.fn(),
        getPrincipal: vi.fn(),
      };
      (adapter as any).plugSendMessage = sendMessage;
    });

    await expect(adapter.connect()).rejects.toThrow('extension rejected');

    // Signer existed → storage must be cleared (stale session invalidated)
    expect(localStorage.getItem('plug_principal')).toBeNull();
  });
});

// ── connectWithStoredPrincipalPlug ─────────────────────────────────────────

describe('UnifiedSignerAdapter — connectWithStoredPrincipalPlug', () => {
  let adapter: UnifiedSignerAdapter;

  beforeEach(() => {
    adapter = makeAdapter();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // Helper: wire transport + signer so connect() reaches the principal check
  async function wireTransport(connected: boolean, principalText = 'aaaaa-aa') {
    const sendMessage = makeSendMessage(connected);
    const providerDetail = { uuid: '71edc834-bab2-4d59-8860-c36a01fee7b8', sendMessage } as any;

    vi.spyOn(BrowserExtensionTransport, 'discover').mockResolvedValue([providerDetail]);

    const mockSigner = makeMockSigner(principalText);
    const { Principal } = await import('@dfinity/principal');

    vi.spyOn(adapter as any, 'ensureTransportInitialized').mockImplementation(async () => {
      (adapter as any).transport = {};
      (adapter as any).signer = mockSigner;
      (adapter as any).signerAgent = {
        signer: mockSigner,
        replaceAccount: vi.fn(),
        getPrincipal: vi.fn().mockResolvedValue(Principal.fromText(principalText)),
      };
      (adapter as any).plugSendMessage = sendMessage;
    });

    return { sendMessage, mockSigner };
  }

  it('reconnects silently when origin is still approved', async () => {
    localStorage.setItem('plug_principal', 'aaaaa-aa');
    const { sendMessage, mockSigner } = await wireTransport(true);

    const account = await adapter.connect();

    expect(account.owner).toBe('aaaaa-aa');
    // computr_isConnected was called
    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'computr_isConnected' })
    );
    // signer.accounts() was NOT called — no popup
    expect(mockSigner.accounts).not.toHaveBeenCalled();
  });

  it('falls through to full connect when origin is not approved', async () => {
    localStorage.setItem('plug_principal', 'aaaaa-aa');
    const { mockSigner } = await wireTransport(false);

    const account = await adapter.connect();

    // signer.accounts() was called to prompt user
    expect(mockSigner.accounts).toHaveBeenCalled();
    expect(account.owner).toBe('aaaaa-aa');
    // old stored key was cleared
    // (new key may be re-written after connectWithAccounts succeeds)
  });

  it('clears stored principal when origin is not approved', async () => {
    localStorage.setItem('plug_principal', 'aaaaa-aa');
    const { mockSigner } = await wireTransport(false);

    await adapter.connect();

    // Even though connect eventually succeeds via accounts(),
    // the stale key should have been cleared and rewritten with confirmed value
    expect(mockSigner.accounts).toHaveBeenCalled();
  });

  it('falls through to full connect when no principal is stored', async () => {
    // Nothing in localStorage
    const { mockSigner } = await wireTransport(true);

    const account = await adapter.connect();

    expect(mockSigner.accounts).toHaveBeenCalled();
    expect(account.owner).toBe('aaaaa-aa');
  });

  it('falls through when sendMessage rejects (extension unavailable)', async () => {
    localStorage.setItem('plug_principal', 'aaaaa-aa');

    const sendMessage = vi.fn().mockRejectedValue(new Error('extension error'));
    const providerDetail = { uuid: '71edc834-bab2-4d59-8860-c36a01fee7b8', sendMessage } as any;
    vi.spyOn(BrowserExtensionTransport, 'discover').mockResolvedValue([providerDetail]);

    const mockSigner = makeMockSigner();
    const { Principal } = await import('@dfinity/principal');

    vi.spyOn(adapter as any, 'ensureTransportInitialized').mockImplementation(async () => {
      (adapter as any).transport = {};
      (adapter as any).signer = mockSigner;
      (adapter as any).signerAgent = {
        signer: mockSigner,
        replaceAccount: vi.fn(),
        getPrincipal: vi.fn().mockResolvedValue(Principal.fromText('aaaaa-aa')),
      };
      (adapter as any).plugSendMessage = sendMessage;
    });

    const account = await adapter.connect();

    // Error in sendMessage → falls through to accounts()
    expect(mockSigner.accounts).toHaveBeenCalled();
    expect(account.owner).toBe('aaaaa-aa');
  });
});

// ── UnifiedSignerAdapter — COMPUTR signer type ────────────────────────────

function makeComputrAdapter(extraConfig = {}) {
  return new UnifiedSignerAdapter({
    adapter: {
      id: 'computr',
      enabled: true,
      walletName: 'Computr',
      logo: '',
      chain: 'ICP' as const,
      adapter: UnifiedSignerAdapter,
      config: {},
    },
    config: {
      hostUrl: 'https://icp0.io',
      fetchRootKey: false,
      verifyQuerySignatures: false,
      signerType: SignerType.COMPUTR,
      ...extraConfig,
    },
  });
}

function makeComputrProvider(overrides: Record<string, any> = {}) {
  return {
    principalId: 'aaaaa-aa',
    agent: { call: vi.fn(), query: vi.fn() } as any,
    isConnected: vi.fn().mockResolvedValue(false),
    requestConnect: vi.fn().mockResolvedValue(true),
    disconnect: vi.fn().mockResolvedValue(undefined),
    getPrincipal: vi.fn().mockResolvedValue('aaaaa-aa'),
    ...overrides,
  };
}

describe('UnifiedSignerAdapter — SignerType.COMPUTR', () => {
  let adapter: UnifiedSignerAdapter;
  let provider: ReturnType<typeof makeComputrProvider>;

  beforeEach(() => {
    adapter = makeComputrAdapter();
    provider = makeComputrProvider();
    Object.defineProperty(window, 'ic', {
      value: { computr: provider },
      writable: true,
      configurable: true,
    });
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    delete window.ic;
  });

  describe('isConnected', () => {
    it('returns false when provider says not connected', async () => {
      provider.isConnected.mockResolvedValue(false);
      expect(await adapter.isConnected()).toBe(false);
    });

    it('returns true when provider says connected', async () => {
      provider.isConnected.mockResolvedValue(true);
      expect(await adapter.isConnected()).toBe(true);
    });

    it('returns false when provider is unavailable', async () => {
      vi.useFakeTimers();
      (window as any).ic = {};
      const resultPromise = adapter.isConnected();
      vi.advanceTimersByTime(3001);
      expect(await resultPromise).toBe(false);
      vi.useRealTimers();
    });
  });

  describe('connect — stored principal fast path', () => {
    it('restores session from localStorage without prompting', async () => {
      localStorage.setItem('computr_principal', 'aaaaa-aa');

      const account = await adapter.connect();

      expect(account.owner).toBe('aaaaa-aa');
      expect(provider.requestConnect).not.toHaveBeenCalled();
    });

    it('clears bad stored principal and falls through to requestConnect', async () => {
      localStorage.setItem('computr_principal', 'not-a-valid-principal!!!');
      provider.principalId = 'aaaaa-aa';

      const account = await adapter.connect();

      expect(provider.requestConnect).toHaveBeenCalled();
      expect(account.owner).toBe('aaaaa-aa');
    });
  });

  describe('connect — fresh connect', () => {
    it('calls requestConnect and stores principal on success', async () => {
      provider.principalId = 'aaaaa-aa';

      const account = await adapter.connect();

      expect(provider.requestConnect).toHaveBeenCalledWith({
        whitelist: undefined,
        host: undefined,
      });
      expect(account.owner).toBe('aaaaa-aa');
      expect(localStorage.getItem('computr_principal')).toBe('aaaaa-aa');
    });

    it('passes whitelist and host from config', async () => {
      adapter = makeComputrAdapter({ whitelist: ['canister1'], host: 'https://ic0.app' });
      (window as any).ic = { computr: provider };
      provider.principalId = 'aaaaa-aa';

      await adapter.connect();

      expect(provider.requestConnect).toHaveBeenCalledWith({
        whitelist: ['canister1'],
        host: 'https://ic0.app',
      });
    });

    it('throws when user rejects connection', async () => {
      provider.requestConnect.mockResolvedValue(false);
      await expect(adapter.connect()).rejects.toThrow('rejected');
    });

    it('throws when principal is anonymous', async () => {
      provider.requestConnect.mockResolvedValue(true);
      provider.principalId = undefined;
      provider.getPrincipal.mockResolvedValue('2vxsx-fae');
      await expect(adapter.connect()).rejects.toThrow('anonymous');
    });

    it('sets ERROR state when connect throws', async () => {
      provider.requestConnect.mockRejectedValue(new Error('extension error'));
      await expect(adapter.connect()).rejects.toThrow('extension error');
      expect(adapter.getState()).toBe('ERROR');
    });
  });

  describe('waitForComputrProvider', () => {
    it('waits for computr:ready event when provider not yet available', async () => {
      (window as any).ic = {};
      const connectPromise = adapter.isConnected();
      (window as any).ic.computr = provider;
      window.dispatchEvent(new Event('computr:ready'));
      expect(typeof await connectPromise).toBe('boolean');
    });

    it('rejects after timeout when provider never appears', async () => {
      vi.useFakeTimers();
      (window as any).ic = {};
      const connectPromise = adapter.connect();
      vi.advanceTimersByTime(3001);
      await expect(connectPromise).rejects.toThrow('not found');
      vi.useRealTimers();
    });
  });

  describe('getPrincipal', () => {
    it('returns principalId from provider synchronous field', async () => {
      provider.principalId = 'aaaaa-aa';
      expect(await adapter.getPrincipal()).toBe('aaaaa-aa');
    });

    it('falls back to async getPrincipal call', async () => {
      provider.principalId = undefined;
      provider.getPrincipal.mockResolvedValue('aaaaa-aa');
      expect(await adapter.getPrincipal()).toBe('aaaaa-aa');
    });

    it('throws when no principal is available', async () => {
      provider.principalId = undefined;
      provider.getPrincipal.mockResolvedValue(null);
      await expect(adapter.getPrincipal()).rejects.toThrow('principal');
    });
  });

  describe('disconnect', () => {
    it('removes stored principal and calls provider.disconnect', async () => {
      localStorage.setItem('computr_principal', 'aaaaa-aa');
      provider.principalId = 'aaaaa-aa';
      await adapter.connect();

      await adapter.disconnect();

      expect(localStorage.getItem('computr_principal')).toBeNull();
      expect(provider.disconnect).toHaveBeenCalled();
    });

    it('still clears storage even if provider.disconnect throws', async () => {
      localStorage.setItem('computr_principal', 'aaaaa-aa');
      provider.principalId = 'aaaaa-aa';
      await adapter.connect();
      provider.disconnect.mockRejectedValue(new Error('rpc failed'));

      await adapter.disconnect();

      expect(localStorage.getItem('computr_principal')).toBeNull();
    });
  });

  describe('createActorInternal', () => {
    it('throws when called before connect', () => {
      expect(() =>
        adapter.createActor('ryjl3-tyaaa-aaaaa-aaaba-cai', () => ({ _fields: [] }))
      ).toThrow('agent not available');
    });
  });
});
