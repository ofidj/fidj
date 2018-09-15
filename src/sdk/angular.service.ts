import {Injectable} from '@angular/core';
import {
    LoggerInterface, ModuleServiceInterface, ModuleServiceInitOptionsInterface, ModuleServiceLoginOptionsInterface,
    ErrorInterface, EndpointInterface
} from './interfaces';
import {InternalService} from './internal.service';
import {Error as FidjError} from '../connection';

/**
 * Angular2+ FidjService
 * @see ModuleServiceInterface
 *
 * @exemple
 *      // ... after install :
 *      // $ npm install --save-dev fidj
 *      // then init your app.js & use it in your services
 *
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.miappio.inject.js"></script>
 *
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.miappio.sync.js"></script>
 *
 *
 */
@Injectable()
export class FidjService implements ModuleServiceInterface {

    private logger: LoggerInterface;
    private miappService: InternalService;
    private promise: any;

    constructor() {
        this.logger = new LoggerService();
        this.promise = Promise;
        this.miappService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    };

    public init(miappId, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface> {
        if (!this.miappService) {
            this.miappService = new InternalService(this.logger, this.promise);
        }
        /*
        if (options && options.forcedEndpoint) {
            this.miappService.setAuthEndpoint(options.forcedEndpoint);
        }
        if (options && options.forcedDBEndpoint) {
            this.miappService.setDBEndpoint(options.forcedDBEndpoint);
        }*/
        return this.miappService.miappInit(miappId, options);
    };

    public login(login, password): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular2.login : not initialized.'));
        }
        return this.miappService.miappLogin(login, password);
    };

    public loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.miappService.miappLoginInDemoMode(options);
    };

    public isLoggedIn(): boolean {
        if (!this.miappService) {
            return false; // this.promise.reject('miapp.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.miappService.miappIsLogin();
    };

    public getRoles(): Array<string> {
        if (!this.miappService) {
            return [];
        }
        return this.miappService.miappRoles();
    };

    public getEndpoints(): Array<EndpointInterface> {
        if (!this.miappService) {
            return [];
        }
        return this.miappService.miappGetEndpoints();
    };

    public postOnEndpoint(key: string, data: any): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.miappService.miappPostOnEndpoint(key, data);
    };

    public getIdToken(): string {
        if (!this.miappService) {
            return;
        }
        return this.miappService.miappGetIdToken();
    };

    public getMessage(): string {
        if (!this.miappService) {
            return '';
        }
        return this.miappService.miappMessage();
    };

    public logout(): Promise<void | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular2.logout : not initialized.'));
        }
        return this.miappService.miappLogout();
    };

    /**
     *
     * Synchronize DB
     * @param fnInitFirstData  a function with db as input and that return promise: call if DB is empty
     * @returns promise with this.session.db
     * @memberof miapp.angularService
     *
     * @example
     *  let initDb = function() {
     *     this.miappService.put('my first row');
     *  };
     *  this.miappService.sync(initDb)
     *  .then(user => ...)
     *  .catch(err => ...)
     *
     */
    public sync(fnInitFirstData?): Promise<void | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular2.sync : not initialized.'));
        }
        return this.miappService.miappSync(fnInitFirstData, this);
    };

    /**
     * Store data in your session
     *
     * @param data to store
     * @returns
     */
    public put(data: any): Promise<string | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular2.put : not initialized.'));
        }
        return this.miappService.miappPutInDb(data);
    };

    /**
     * Find object Id and remove it from your session
     *
     * @param id of object to find and remove
     * @returns
     */
    public remove(id: string): Promise<void | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular2.remove : not initialized.'));
        }
        return this.miappService.miappRemoveInDb(id);
    };

    /**
     * Find
     */
    public find(id: string): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular2.find : not initialized.'));
        }
        return this.miappService.miappFindInDb(id);
    };

    public findAll(): Promise<any[] | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular2.findAll : not initialized.'));
        }
        return this.miappService.miappFindAllInDb();
    };

}

export class LoggerService implements LoggerInterface {
    log(message: string) {
        // console.log(message);
    }

    error(message: string) {
        console.error(message);
    }

    warn(message: string) {
        console.warn(message);
    }
}

