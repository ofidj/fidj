import { LoggerInterface, ModuleServiceInitOptionsInterface, ModuleServiceLoginOptionsInterface, ErrorInterface, EndpointInterface, EndpointFilterInterface } from './interfaces';
/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
export declare class InternalService {
    private sdk;
    private logger;
    private promise;
    private storage;
    private session;
    private connection;
    constructor(logger: LoggerInterface, promise: PromiseConstructor, options?: ModuleServiceInitOptionsInterface);
    /**
     * Init connection & session
     * Check uri
     * Done each app start
     *
     * @param options Optional settings
     * @param options.fidjId  required use your customized endpoints
     * @param options.fidjSalt required use your customized endpoints
     * @param options.fidjVersion required use your customized endpoints
     * @param options.devMode optional default false, use your customized endpoints
     * @returns
     */
    fidjInit(fidjId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface>;
    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param login
     * @param password
     * @returns
     */
    fidjLogin(login: string, password: string): Promise<any | ErrorInterface>;
    /**
     *
     * @param options
     * @param options.accessToken optional
     * @param options.idToken  optional
     * @returns
     */
    fidjLoginInDemoMode(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface>;
    fidjGetEndpoints(filter?: EndpointFilterInterface): Array<EndpointInterface>;
    fidjRoles(): Array<string>;
    fidjMessage(): string;
    fidjIsLogin(): boolean;
    fidjLogout(force?: boolean): Promise<void | ErrorInterface>;
    /**
     * Synchronize DB
     *
     *
     * @param fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @returns  promise
     */
    fidjSync(fnInitFirstData?: any, fnInitFirstData_Arg?: any): Promise<void | ErrorInterface>;
    fidjPutInDb(data: any): Promise<string | ErrorInterface>;
    fidjRemoveInDb(data_id: string): Promise<void | ErrorInterface>;
    fidjFindInDb(data_id: string): Promise<any | ErrorInterface>;
    fidjFindAllInDb(): Promise<Array<any> | ErrorInterface>;
    fidjPostOnEndpoint(key: string, relativePath: string, data: any): Promise<any | ErrorInterface>;
    fidjGetIdToken(): string;
    /**
     * Logout then Login
     *
     * @param login
     * @param password
     * @param updateProperties
     */
    private _loginInternal;
    protected _removeAll(): Promise<void | ErrorInterface>;
    private _createSession;
    private _testPromise;
    private static _srvDataUniqId;
    private _generateObjectUniqueId;
}
