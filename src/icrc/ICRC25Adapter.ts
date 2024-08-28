// import { ActorSubclass } from "@dfinity/agent";

// class ICRC25Adapter extends GenericICRCAdapter {
//   private permissions: Map<string, ICRC25PermissionState> = new Map();

//   constructor(walletAdapter: any) {
//     super(walletAdapter);
//     this.standards.push({
//       name: "ICRC-25",
//       url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-25/ICRC-25.md"
//     });
//   }

//   async requestPermissions(scopes: ICRC25Scope[]): Promise<ICRC25ScopeWithState[]> {
//     const result: ICRC25ScopeWithState[] = [];
//     for (const scope of scopes) {
//       let state: ICRC25PermissionState = 'ask_on_use';
//       // Here you would implement the logic to determine the permission state
//       // This might involve interacting with the wallet adapter or user
//       this.permissions.set(scope.method, state);
//       result.push({ scope, state });
//     }
//     return result;
//   }

//   async getPermissions(): Promise<ICRC25ScopeWithState[]> {
//     const result: ICRC25ScopeWithState[] = [];
//     for (const [method, state] of this.permissions.entries()) {
//       result.push({ scope: { method }, state });
//     }
//     return result;
//   }

//   async isMethodPermitted(method: string): Promise<boolean> {
//     const state = this.permissions.get(method);
//     return state === 'granted' || state === 'ask_on_use';
//   }

//   // Override methods to include permission checks
//   async createActor<T>(canisterId: string, idl: any): Promise<ActorSubclass<T>> {
//     if (await this.isMethodPermitted('createActor')) {
//       return super.createActor(canisterId, idl);
//     }
//     throw new Error("Permission denied for createActor");
//   }

//   async transfer(params: any): Promise<any> {
//     if (await this.isMethodPermitted('transfer')) {
//       return super.transfer(params);
//     }
//     throw new Error("Permission denied for transfer");
//   }
// }
