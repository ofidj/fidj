export declare class Xor {
    static header: string;
    constructor();
    static encrypt(value: string, key: string): string;
    static decrypt(value: string, key: string, oldStyle?: boolean): string;
    static keyCharAt(key: any, i: any): any;
}
