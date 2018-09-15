import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Injectable} from '@angular/core';
// import PouchDB from 'pouchdb';
// window['PouchDB'] = PouchDB;
import {IFidjService} from './fidj.sdk';
import {SrvFidj} from './fidj.sdk.service';


/**
 * Angular2+ FidjService
 * @class FidjService
 * @see IFidjService
 *
 */
@Injectable()
export class FidjService implements IFidjService {

    private logger: LoggerService;
    private fidjService: any = null;
    private promise: any = null;

    constructor() {
        this.logger = new LoggerService();
        // this.logger = {
        //     log: function () {
        //     },
        //     error: function () {
        //     }
        // };
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    };

    public init(fidjId, fidjSalt, options) {
        if (this.fidjService) return this.promise.reject('fidj.sdk.angular2.init : already initialized.');
        this.fidjService = new SrvFidj(this.logger, this.promise);

        if (options && options._forceEndpoint) this.fidjService.setAuthEndpoint(options._forceEndpoint);
        if (options && options._forceDBEndpoint) this.fidjService.setDBEndpoint(options._forceDBEndpoint);
        let _forceOnline = false;
        if (options && options._forceOnline === true) _forceOnline = true;

        return this.fidjService.fidjInit(fidjId, fidjSalt, _forceOnline);
    };

    public login(login, password) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.login : not initialized.');
        return this.fidjService.fidjLogin(login, password);
    };

    public isLoggedIn() {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        return this.fidjService.fidjIsLogin();
    };

    public getRoles() {
        if (!this.fidjService) return [];
        return this.fidjService.fidjRoles();
    };

    public getEndpoints() {
        if (!this.fidjService) return [];
        return this.fidjService.getEndpoints();
    };

    public logoff() {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.fidjLogoff : not initialized.');
        return this.fidjService.fidjLogoff();
    };

    public sync(fnInitFirstData) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.sync : not initialized.');
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };

    public put(data) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.put : not initialized.');
        return this.fidjService.fidjPutInDb(data);
    };

    public remove(data) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.remove : not initialized.');
        return this.fidjService.fidjRemoveInDb(data);
    };

    public find(id) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.find : not initialized.');
        return this.fidjService.fidjFindInDb(id);
    };

    public findAll() {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular2.findAll : not initialized.');
        return this.fidjService.fidjFindAllInDb();
    };

}


//todo https://auth0.com/blog/ionic-2-authentication-how-to-secure-your-mobile-app-with-jwt/
export class LoggerService {
    static log(message: string) {
        console.log(message);
    }

    static error(message: string) {
        console.log(message);
    }
}


/**
 * @module FidjModule
 * Todo doc on module ?
 *
 *
 * @exemple
 *      // ... after install :
 *      // $ npm install fidj
 *      // then init your app.js & use it in your services
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 */
@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],

    exports: [],

    providers: [FidjService]
})
export class FidjModule {
}

