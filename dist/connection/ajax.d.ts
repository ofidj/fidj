export interface XhrOptionsInterface {
    url: string;
    data?: any;
    headers?: any;
    async?: boolean;
    username?: string;
    password?: string;
    withCredentials?: boolean;
}
export declare enum XhrErrorReason {
    UNKNOWN = 0,
    TIMEOUT = 1,
    STATUS = 2
}
export interface XhrErrorInterface {
    reason: XhrErrorReason;
    status: number;
    code: number;
    message: string;
}
export declare class Ajax {
    private xhr;
    constructor();
    private static formatResponseData;
    private static formatError;
    post(args: XhrOptionsInterface): Promise<any | XhrErrorInterface>;
    put(args: XhrOptionsInterface): Promise<any | XhrErrorInterface>;
    delete(args: XhrOptionsInterface): Promise<any | XhrErrorInterface>;
    get(args: XhrOptionsInterface): Promise<any | XhrErrorInterface>;
}
