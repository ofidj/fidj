import {Injectable} from '@angular/core';
import {
    EndpointCallInterface,
    EndpointInterface,
    ErrorInterface,
    LoggerInterface,
    LoggerLevelEnum,
    ModuleServiceInitOptionsInterface,
    ModuleServiceInterface,
    ModuleServiceLoginOptionsInterface
} from './interfaces';
import {InternalService} from './internal.service';
import {Error as FidjError} from '../connection';
import {LoggerService} from './logger.service';

/**
 * Angular FidjService
 * @see ModuleServiceInterface
 *
 */
@Injectable({
    providedIn: 'root',
})
export class FidjService implements ModuleServiceInterface {

    private logger: LoggerInterface;
    private fidjService: InternalService;
    private promise: any;

    constructor() {
        this.logger = new LoggerService(LoggerLevelEnum.ERROR);
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    };

    public async init(fidjId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            this.fidjService = new InternalService(this.logger, this.promise);
        }
        return this.fidjService.fidjInit(fidjId, options);
    };

    public async login(login: string, password: string): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    };

    public async loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    };

    public isLoggedIn(): boolean {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    };

    public async getRoles(): Promise<Array<string>> {
        if (!this.fidjService) {
            return [];
        }
        return await this.fidjService.fidjRoles();
    };

    public async getEndpoints(): Promise<Array<EndpointInterface>> {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    };

    /**
     * @throws {ErrorInterface}
     * @param {EndpointCallInterface} input
     */
    public async sendOnEndpoint(input: EndpointCallInterface): Promise<any> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjSendOnEndpoint(input);
    };

    public async getIdToken() {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    };

    public async getMessage(): Promise<string> {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    };

    public async logout(force?: boolean): Promise<void | ErrorInterface> {
        if (force || !this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout(force);
    };

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
    public async sync(fnInitFirstData?): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };

    /**
     * Store data in your session
     *
     * @param data to store
     * @returns
     */
    public async put(data: any): Promise<string | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    };

    /**
     * Find object Id and remove it from your session
     *
     * @param id of object to find and remove
     * @returns
     */
    public async remove(id: string): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(id);
    };

    /**
     * Find
     */
    public async find(id: string): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    };

    public async findAll(): Promise<any[] | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    };

}
