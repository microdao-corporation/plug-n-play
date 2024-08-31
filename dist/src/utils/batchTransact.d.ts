import { Wallet } from '../../types/index';
export declare class BatchTransact {
    state: string;
    transactionLlist: Record<string, Wallet.Transaction.Item>;
    stepsList: string[];
    completed: string[];
    activeStep: string;
    failedSteps: string[];
    transactionResults: Record<string, any>;
    trxArray: Wallet.Transaction.Item[][];
    _info: any;
    _adapterObj: any;
    constructor(transactionLlist: Record<string, Wallet.Transaction.Item>, _adapterObj: any);
    _prepareTrxArry(): Wallet.Transaction.Item[][];
}
