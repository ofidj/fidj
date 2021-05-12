import { LoggerInterface, ModuleServiceInitOptionsInterface, ModuleServiceLoginOptionsInterface, ErrorInterface, EndpointInterface, EndpointFilterInterface } from './interfaces';
import { ClientUser } from '../connection';
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
     * @param fidjId
     * @param options Optional settings
     * @param options.fidjId  required use your customized endpoints
     * @param options.fidjSalt required use your customized endpoints
     * @param options.fidjVersion required use your customized endpoints
     * @param options.devMode optional default false, use your customized endpoints
     * @returns
     * @throws {ErrorInterface}
     */
    fidjInit(fidjId: string, options?: ModuleServiceInitOptionsInterface): Promise<void>;
    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param login
     * @param password
     * @throws {ErrorInterface}
     */
    fidjLogin(login: string, password: string): Promise<ClientUser>;
    /**
     *
     * @param options
     * @param options.accessToken optional
     * @param options.idToken  optional
     * @returns
     */
    fidjLoginInDemoMode(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface>;
    fidjIsLogin(): boolean;
    fidjGetEndpoints(filter?: EndpointFilterInterface): Promise<Array<EndpointInterface>>;
    fidjRoles(): Promise<Array<string>>;
    fidjMessage(): Promise<string>;
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
    fidjSendOnEndpoint(key: string, verb: string, relativePath: string, data: any): Promise<any>;
    fidjGetIdToken(): Promise<string>;
    /**
     * Logout then Login
     *
     * @param login
     * @param password
     * @param updateProperties
     * @throws {ErrorInterface}
     */
    private _loginInternal;
    protected _removeAll(): Promise<void | ErrorInterface>;
    private _createSession;
    private _testPromise;
    private static _srvDataUniqId;
    private _generateObjectUniqueId;
}
