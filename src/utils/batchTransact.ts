import { Wallet } from '../types/index';

export class BatchTransact {
    state: string = 'idle';
    transactionLlist: Record<string, Wallet.Transaction.Item> = {};
    stepsList: string[] = [];
    completed: string[] = [];
    activeStep: string = '';
    failedSteps: string[] = [];
    transactionResults: Record<string, any> = {};
    trxArray: Wallet.Transaction.Item[][] = [];
    _info: any = false;
    _adapterObj: any = false;

    constructor(transactionLlist: Record<string, Wallet.Transaction.Item> = {}, _adapterObj: any) {
        if (!_adapterObj || !_adapterObj.provider) return;
        Object.entries(transactionLlist).forEach(([key, value]) => {
            if (typeof value === 'object') { this.transactionLlist[key] = value; }
        });
        if (Object.keys(this.transactionLlist).length > 0) {
            this.stepsList = Object.keys(this.transactionLlist);
            this._adapterObj = _adapterObj;
        }
    }

    _prepareTrxArry(): Wallet.Transaction.Item[][] {
        this.trxArray = [];
        let tempArray: Wallet.Transaction.Item[] = [];
        Object.values(this.transactionLlist).forEach(x => {
            tempArray.push(x);
            if (x.updateNextStep) { this.trxArray.push(tempArray); tempArray = []; }
        });
        if (tempArray.length > 0) this.trxArray.push(tempArray);
        let trxIndex = 0;
        this.trxArray.forEach((subArray, i) => {
            subArray.forEach((el, j) => {
                this.trxArray[i][j].stepIndex = trxIndex;
                this.trxArray[i][j].state = 'idle';
                this.trxArray[i][j].onSuccessMain = async (data: any, _this: Wallet.Transaction.Item): Promise<boolean|undefined> => {
                    const stepIndex = _this.stepIndex!;
                    const onSucessCall = el.onSuccess;
                    const onFailCall = el.onFail;

                    if (data.err || data.Err || data.ERR) {
                        this.failedSteps.push(this.stepsList[stepIndex]);
                        this.transactionResults[this.stepsList[stepIndex]] = data;
                        this.state = 'error';
                        _this.state = 'error';
                        if (onFailCall) await onFailCall(data);
                        return false;
                    } else {
                        this.completed.push(this.stepsList[stepIndex]);
                        this.activeStep = this.stepsList[stepIndex + 1];
                        this.transactionResults[this.stepsList[stepIndex]] = data;
                        _this.state = 'done';
                    }
                    if (_this.updateNextStep && this.trxArray[(i + 1)]) {
                        await _this.updateNextStep(data, this.trxArray[(i + 1)][0]);
                    }
                    if (onSucessCall) await onSucessCall(data);
                };

                this.trxArray[i][j].onFailMain = async (err: any, _this: Wallet.Transaction.Item) => {
                    const onFailCall = el.onFail;
                    const stepIndex = _this.stepIndex!;
                    console.error(`error in  ${this.stepsList[stepIndex]} `, this.trxArray[i][j]);
                    console.error(err);
                    this.failedSteps.push(this.stepsList[stepIndex]);
                    this.activeStep = this.stepsList[stepIndex];
                    this.state = 'error';
                    _this.state = 'error';
                    if (onFailCall) await onFailCall(err);
                    return false;
                };
                trxIndex++;
            });
        });
        return this.trxArray;
    }

    // ... rest of the methods (retryExecute, execute, _processBatch) remain the same,
    // but you should add type annotations to their parameters and return types.
}

