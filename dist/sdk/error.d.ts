import { ErrorInterface } from './interfaces';
export declare class Error implements ErrorInterface {
    code: number;
    reason: string;
    constructor(code: number, reason: string);
    equals(err: Error): boolean;
    toString(): string;
}
