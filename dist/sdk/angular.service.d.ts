import { EndpointCallInterface, EndpointInterface, ErrorInterface, ModuleServiceInitOptionsInterface, ModuleServiceInterface, ModuleServiceLoginOptionsInterface } from './interfaces';
/**
 * Angular FidjService
 * @see ModuleServiceInterface
 *
 */
export declare class FidjService implements ModuleServiceInterface {
    private logger;
    private fidjService;
    private promise;
    constructor();
    init(fidjId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface>;
    login(login: string, password: string): Promise<any | ErrorInterface>;
    loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface>;
    isLoggedIn(): boolean;
    getRoles(): Promise<Array<string>>;
    getEndpoints(): Promise<Array<EndpointInterface>>;
    sendOnEndpoint(input: EndpointCallInterface): Promise<any | ErrorInterface>;
    getIdToken(): Promise<string>;
    getMessage(): Promise<string>;
    logout(force?: boolean): Promise<void | ErrorInterface>;
    /**
     *
     * Synchronize DB
     * @param fnInitFirstData  a function with db as input and that return promise: call if DB is empty
     * @returns promise with this.session.db
     * @memberof fidj.angularService
     *
     * @example
     *  let initDb = function() {
     *     this.fidjService.put('my first row');
     *  };
     *  this.fidjService.sync(initDb)
     *  .then(user => ...)
     *  .catch(err => ...)
     *
     */
    sync(fnInitFirstData?: any): Promise<void | ErrorInterface>;
    /**
     * Store data in your session
     *
     * @param data to store
     * @returns
     */
    put(data: any): Promise<string | ErrorInterface>;
    /**
     * Find object Id and remove it from your session
     *
     * @param id of object to find and remove
     * @returns
     */
    remove(id: string): Promise<void | ErrorInterface>;
    /**
     * Find
     */
    find(id: string): Promise<any | ErrorInterface>;
    findAll(): Promise<any[] | ErrorInterface>;
}
