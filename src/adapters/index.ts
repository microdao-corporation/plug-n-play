// Path: src/adapters/index.ts
// Import adapters
import { NNSAdapter } from "./NNSAdapter";
import { PlugAdapter } from "./PlugAdapter";
import { Wallet } from '../types/index';
import dfinityLogo from "../../assets/dfinity.svg";
import plugLogo from "../../assets/plug.jpg"; 

export const walletList: Wallet.AdapterInfo[] = [
  {
    id: "nns",
    name: "Internet Identity",
    icon: dfinityLogo,
    adapter: NNSAdapter,
  },
  {
    id: "plug",
    name: "Plug Wallet",
    icon: plugLogo,
    adapter: PlugAdapter,
  },

];

export {
  NNSAdapter,
  PlugAdapter,
};