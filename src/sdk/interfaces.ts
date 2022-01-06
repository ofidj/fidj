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

export interface EndpointCallInterface {
    verb: string;
    key?: string;
    relativePath?: string;
    data?: any;
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

    getRoles(): Promise<Array<string>>;

    getEndpoints(): Promise<Array<EndpointInterface>>;

    sendOnEndpoint(input: EndpointCallInterface): Promise<any>;

    forgotPasswordRequest(email: String): Promise<void>;

    getIdToken(): Promise<string | ErrorInterface>;

    getMessage(): Promise<string>;

    logout(force?: boolean): Promise<void | ErrorInterface>;

    sync(fnInitFirstData?: any): Promise<any | ErrorInterface>;

    put(data: any): Promise<any | ErrorInterface>;

    remove(dataId: any): Promise<any | ErrorInterface>;

    find(id: string): Promise<any | ErrorInterface>;

    findAll(): Promise<any | ErrorInterface>;
}

/**
 * prod : true by default
 * useDB : false by default
 * crypto : false by default
 * logLevel : NONE by default
 */
export interface ModuleServiceInitOptionsInterface {
    prod: boolean,
    useDB?: boolean,
    crypto?: boolean,
    logLevel?: LoggerLevelEnum
}

export interface ModuleServiceLoginOptionsInterface {
    accessToken?: string,
    idToken?: string,
    refreshToken?: string,
}

export interface SdkInterface {
    org: string,
    version: string,
    prod: boolean,
    useDB: boolean
}

export enum LoggerLevelEnum {
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}

export interface LoggerInterface {
    setLevel: (LoggerLevelEnum) => void;

    log: (a?, b?, c?, d?, e?, f?) => any;
    warn: (a?, b?, c?, d?, e?, f?) => any;
    error: (a?, b?, c?, d?, e?, f?) => any;
}
