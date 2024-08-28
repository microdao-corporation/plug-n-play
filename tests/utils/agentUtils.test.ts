import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpAgent } from '@dfinity/agent';
import * as agentUtils from '../../src/utils/agentUtils';

vi.mock('@dfinity/agent', () => ({
  HttpAgent: vi.fn().mockImplementation(function (this: any, options: any) {
      this.options = options;
      this.fetchRootKey = vi.fn().mockResolvedValue(undefined); // Return a resolved promise
  }),
}));

describe('agentUtils.ts', () => {
  let httpAgentMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    httpAgentMock = HttpAgent as any;
  });

  describe('fetchRootKey', () => {
    it('should call fetchRootKey on the agent and handle errors', async () => {
      const agent = new httpAgentMock({ host: 'https://localhost:8000' });

      // Test successful fetchRootKey call
      await agentUtils.fetchRootKey(agent);
      expect(agent.fetchRootKey).toHaveBeenCalled();

      // Test error handling
      agent.fetchRootKey.mockRejectedValueOnce(new Error('Error fetching root key'));
      
      const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

      await agentUtils.fetchRootKey(agent);

      expect(consoleWarnMock).toHaveBeenCalledWith(
        'Unable to fetch root key. Check to ensure that your local replica is running'
      );
      expect(consoleErrorMock).toHaveBeenCalledWith(new Error('Error fetching root key'));
    });
  });

  describe('createAndSetupHttpAgent', () => {
    it('should create an HttpAgent and fetch root key for localhost', async () => {
      const options = { host: 'http://localhost:8000' };
      const agent = await agentUtils.createAndSetupHttpAgent(options);

      expect(httpAgentMock).toHaveBeenCalledWith(options);
      expect(agent.fetchRootKey).toHaveBeenCalled();
    });

    it('should create an HttpAgent and not fetch root key for non-localhost', async () => {
      const options = { host: 'https://ic0.app' };
      const agent = await agentUtils.createAndSetupHttpAgent(options);

      expect(httpAgentMock).toHaveBeenCalledWith(options);
      expect(agent.fetchRootKey).not.toHaveBeenCalled();
    });
  });
});
