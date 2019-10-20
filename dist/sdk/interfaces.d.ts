export interface ErrorInterface {
    code: number;
    reason: string;
}
export interface EndpointInterface {
    key: string;
    url: string;
    blocked: boolean;
}
export interface EndpointFilterInterface {
    key?: string;
    showBlocked?: boolean;
}
/**
 * Interface used by all InternalService wrappers (angular.js, angular.io)
 *
 * @see FidjModule
 * @see FidjModule, FidjAngularService
 */
export interface ModuleServiceInterface {
    init(fidjId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface>;
    login(login: string, password: string): Promise<any | ErrorInterface>;
    loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface>;
    isLoggedIn(): boolean;
    getRoles(): Array<string>;
    getEndpoints(): Array<EndpointInterface>;
    sendOnEndpoint(key: string, verb: string, relativePath?: string, data?: any): Promise<any | ErrorInterface>;
    getIdToken(): string;
    getMessage(): string;
    logout(force?: boolean): Promise<void | ErrorInterface>;
    sync(fnInitFirstData?: any): Promise<any | ErrorInterface>;
    put(data: any): Promise<any | ErrorInterface>;
    remove(dataId: any): Promise<any | ErrorInterface>;
    find(id: string): Promise<any | ErrorInterface>;
    findAll(): Promise<any | ErrorInterface>;
}
export interface ModuleServiceInitOptionsInterface {
    prod: boolean;
    useDB?: boolean;
    crypto?: boolean;
    logLevel?: LoggerLevelEnum;
}
export interface ModuleServiceLoginOptionsInterface {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
}
export interface SdkInterface {
    org: string;
    version: string;
    prod: boolean;
    useDB: boolean;
}
export declare enum LoggerLevelEnum {
    LOG = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}
export interface LoggerInterface {
    setLevel: (LoggerLevelEnum: any) => void;
    log: (a?: any, b?: any, c?: any, d?: any, e?: any, f?: any) => any;
    warn: (a?: any, b?: any, c?: any, d?: any, e?: any, f?: any) => any;
    error: (a?: any, b?: any, c?: any, d?: any, e?: any, f?: any) => any;
}
