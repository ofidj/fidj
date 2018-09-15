import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Injectable} from '@angular/core';
// import PouchDB from 'pouchdb';
// window['PouchDB'] = PouchDB;
import {IFidjService} from './miapp.sdk';
import {SrvFidj} from './miapp.sdk.service';


/**
 * Angular2+ FidjService
 * @class FidjService
 * @see IFidjService
 *
 */
@Injectable()
export class FidjService implements IFidjService {

    private logger: LoggerService;
    private miappService: any = null;
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
        this.miappService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    };

    public init(miappId, miappSalt, options) {
        if (this.miappService) return this.promise.reject('miapp.sdk.angular2.init : already initialized.');
        this.miappService = new SrvFidj(this.logger, this.promise);

        if (options && options._forceEndpoint) this.miappService.setAuthEndpoint(options._forceEndpoint);
        if (options && options._forceDBEndpoint) this.miappService.setDBEndpoint(options._forceDBEndpoint);
        let _forceOnline = false;
        if (options && options._forceOnline === true) _forceOnline = true;

        return this.miappService.miappInit(miappId, miappSalt, _forceOnline);
    };

    public login(login, password) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.login : not initialized.');
        return this.miappService.miappLogin(login, password);
    };

    public isLoggedIn() {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.isLoggedIn : not initialized.');
        return this.miappService.miappIsLogin();
    };

    public getRoles() {
        if (!this.miappService) return [];
        return this.miappService.miappRoles();
    };

    public getEndpoints() {
        if (!this.miappService) return [];
        return this.miappService.getEndpoints();
    };

    public logoff() {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.miappLogoff : not initialized.');
        return this.miappService.miappLogoff();
    };

    public sync(fnInitFirstData) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.sync : not initialized.');
        return this.miappService.miappSync(fnInitFirstData, this);
    };

    public put(data) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.put : not initialized.');
        return this.miappService.miappPutInDb(data);
    };

    public remove(data) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.remove : not initialized.');
        return this.miappService.miappRemoveInDb(data);
    };

    public find(id) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.find : not initialized.');
        return this.miappService.miappFindInDb(id);
    };

    public findAll() {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular2.findAll : not initialized.');
        return this.miappService.miappFindAllInDb();
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

