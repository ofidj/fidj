import {ErrorInterface} from './interfaces';

export class Error implements ErrorInterface {

    constructor(public code: number, public reason: string) {
    };

    equals(err: Error) {
        return this.code === err.code && this.reason === err.reason;
    }

    toString(): string {
        const msg: string = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
        return '' + this.code + ' - ' + msg;
    }

}
