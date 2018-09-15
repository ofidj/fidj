// export namespace miapp {
// }
/**
 * Interface used by all FidjService wrappers (angular.js, angular.io)
 *
 * @see FidjModule
 * @see FidjModule, FidjAngularService
 */
export interface IFidjService {

    init (miappId, miappSalt, options?): Promise<boolean>;

    login(login, password): Promise<boolean>;

    isLoggedIn(): Promise<boolean>;

    getRoles(): Array<string>;

    getEndpoints(): Array<string>;

    logoff(): Promise<boolean>;

    /**
     *
     * Synchronize DB
     * @param fnInitFirstData  a function with db as input and that return promise: call if DB is empty
     * @returns {*} promise with this.session.db
     * @memberof miapp.angularService
     */
    sync(fnInitFirstData?: any): Promise<boolean>;

    put(data: any): Promise<any>;

    remove(data: any): Promise<boolean>;

    find(id: string): Promise<any>;

    findAll(): Promise<any>;
}
