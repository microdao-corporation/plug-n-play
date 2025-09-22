/**
 * Centralized module loader for Ledger dependencies
 * Provides lazy loading and caching of dynamic imports
 */

import type InternetComputerApp from "@zondax/ledger-icp";
import type Transport from "@ledgerhq/hw-transport";

// Cache for loaded modules
const moduleCache: Record<string, any> = {};

/**
 * Load the appropriate transport module based on type
 * @param transportType - 'WebHID' or 'WebUSB'
 * @param timeout - Connection timeout in milliseconds
 * @returns Transport instance
 */
export async function loadTransport(
  transportType: 'WebHID' | 'WebUSB',
  timeout: number = 60000
): Promise<Transport> {
  const cacheKey = `transport-${transportType}`;

  if (!moduleCache[cacheKey]) {
    if (transportType === 'WebUSB') {
      // @ts-ignore - Dynamic import
      const module = await import('@ledgerhq/hw-transport-webusb');
      moduleCache[cacheKey] = module.default;
    } else {
      // Default to WebHID
      // @ts-ignore - Dynamic import
      const module = await import('@ledgerhq/hw-transport-webhid');
      moduleCache[cacheKey] = module.default;
    }
  }

  const TransportClass = moduleCache[cacheKey];
  return await TransportClass.create(timeout);
}

/**
 * Load the Internet Computer Ledger app
 * @param transport - The transport instance to use
 * @returns InternetComputerApp instance
 */
export async function loadLedgerApp(transport: Transport): Promise<InternetComputerApp> {
  if (!moduleCache['ledger-app']) {
    // @ts-ignore - Dynamic import
    const { default: InternetComputerApp } = await import('@zondax/ledger-icp');
    moduleCache['ledger-app'] = InternetComputerApp;
  }

  const AppClass = moduleCache['ledger-app'];
  return new AppClass(transport);
}

/**
 * Load Dfinity agent and actor modules
 * @returns Agent and Actor utilities
 */
export async function loadAgentModules() {
  if (!moduleCache['agent-modules']) {
    const [agentModule, candidModule] = await Promise.all([
      import("@dfinity/agent"),
      import("@dfinity/candid")
    ]);

    moduleCache['agent-modules'] = {
      Actor: agentModule.Actor,
      HttpAgent: agentModule.HttpAgent,
      IDL: candidModule.IDL
    };
  }

  return moduleCache['agent-modules'];
}

/**
 * Clear module cache (useful for testing)
 */
export function clearModuleCache(): void {
  Object.keys(moduleCache).forEach(key => {
    delete moduleCache[key];
  });
}