import { HttpAgent, HttpAgentOptions } from '../@dfinity/agent';
export declare function createHttpAgent(options: HttpAgentOptions): HttpAgent;
export declare function fetchRootKey(agent: HttpAgent): Promise<void | ArrayBuffer>;
export declare function createAndSetupHttpAgent(options: HttpAgentOptions): Promise<HttpAgent>;
