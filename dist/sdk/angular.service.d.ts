import { LoggerInterface, ModuleServiceInterface, ModuleServiceInitOptionsInterface, ModuleServiceLoginOptionsInterface, ErrorInterface, EndpointInterface } from './interfaces';
/**
 * Angular2+ FidjService
 * @see ModuleServiceInterface
 *
 * @exemple
 *      // ... after install :
 *      // $ npm install --save-dev fidj
 *      // then init your app.js & use it in your services
 *
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.fidj.inject.js"></script>
 *
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.fidj.sync.js"></script>
 *
 *
 */
export declare class FidjService implements ModuleServiceInterface {
    private logger;
    private fidjService;
    private promise;
    constructor();
    init(fidjId: any, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface>;
    login(login: any, password: any): Promise<any | ErrorInterface>;
    loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface>;
    isLoggedIn(): boolean;
    getRoles(): Array<string>;
    getEndpoints(): Array<EndpointInterface>;
    postOnEndpoint(key: string, data: any): Promise<any | ErrorInterface>;
    getIdToken(): string;
    getMessage(): string;
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
export declare class LoggerService implements LoggerInterface {
    log(message: string, args: [any]): void;
    error(message: string, args: [any]): void;
    warn(message: string, args: [any]): void;
}
