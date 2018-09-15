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
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.fidj.inject.js"></script>
 *
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.fidj.sync.js"></script>
 *
 *
 */
@Injectable()
export class FidjService implements ModuleServiceInterface {

    private logger: LoggerInterface;
    private fidjService: InternalService;
    private promise: any;

    constructor() {
        this.logger = new LoggerService();
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    };

    public init(fidjId, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            this.fidjService = new InternalService(this.logger, this.promise);
        }
        /*
        if (options && options.forcedEndpoint) {
            this.fidjService.setAuthEndpoint(options.forcedEndpoint);
        }
        if (options && options.forcedDBEndpoint) {
            this.fidjService.setDBEndpoint(options.forcedDBEndpoint);
        }*/
        return this.fidjService.fidjInit(fidjId, options);
    };

    public login(login, password): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    };

    public loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    };

    public isLoggedIn(): boolean {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    };

    public getRoles(): Array<string> {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    };

    public getEndpoints(): Array<EndpointInterface> {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    };

    public postOnEndpoint(key: string, data: any): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, data);
    };

    public getIdToken(): string {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    };

    public getMessage(): string {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    };

    public logout(): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout();
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
    public sync(fnInitFirstData?): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };

    /**
     * Store data in your session
     *
     * @param data to store
     * @returns
     */
    public put(data: any): Promise<string | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    };

    /**
     * Find object Id and remove it from your session
     *
     * @param id of object to find and remove
     * @returns
     */
    public remove(id: string): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(id);
    };

    /**
     * Find
     */
    public find(id: string): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    };

    public findAll(): Promise<any[] | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
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

