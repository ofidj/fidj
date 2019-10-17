import {
    ModuleServiceInterface,
    ModuleServiceInitOptionsInterface,
    ModuleServiceLoginOptionsInterface,
    ErrorInterface,
    EndpointInterface
} from './interfaces';
import {InternalService} from './internal.service';
import * as tools from '../tools';
import {Error as FidjError} from '../connection';
// import {LocalStorage} from 'node-localstorage';
// import 'localstorage-polyfill/localStorage';


/**
 * Fidj Angular Auth SDK : Help your app to manage your users (login) and session shared data (sync)
 * with an angular module
 * @class FidjAngularjsService
 *
 * @exemple
 *      // ... after install :
 *      // $ bower fidj
 *      // then init your app.js & use it in your services
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 *
 */
export class FidjAngularjsService implements ModuleServiceInterface {

    private logger: any;
    private promise: any;
    private fidjService: InternalService;

    /**
     * @param $log
     * @param $q
     * @constructor
     */
    constructor($log?, $q?) {
        this.logger = $log || {
            log: function () {
            },
            error: function () {
            },
            warn: function () {
            },
        };
        this.promise = $q || Promise;
        this.fidjService = null;
    }

    /**
     * Init the service with fidj IDs
     * @param fidjId {String} given fidj appId
     * @param options Optional settings
     * @param options._devMode {boolean} optional default false, use your customized endpoints
     * @param options._forceOnline {boolean} optional force connection to fidj hub
     * @param options._forceEndpoint {String} optional auth endpoint
     * @param options._forceDBEndpoint {String} optional db endpoint
     * @memberof fidj.angularService
     */
    init(fidjId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface> {
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

    /**
     *
     * @param login
     * @param password
     * @memberof fidj.angularService
     */
    login(login, password): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    };

    loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    };

    /**
     * @return true if logged in
     * @memberof fidj.angularService
     */
    isLoggedIn(): boolean {
        if (!this.fidjService) {
            return false;
        }
        return this.fidjService.fidjIsLogin();
    };

    getRoles(): Array<string> {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    };

    getEndpoints(): Array<EndpointInterface> {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    };

    postOnEndpoint(key: string, relativePath: string, data: any): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, relativePath, data);
    };

    getIdToken(): string {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    };

    getMessage(): string {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    };

    /**
     * Logout all fidj services
     * @memberof fidj.angularService
     */
    logout(force?: boolean): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout(force);
    };

    sync(fnInitFirstData): Promise<void | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };

    /**
     *
     * @param data
     * @returns {*}
     * @memberof fidj.angularService
     */
    put(data: any): Promise<string | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    };

    /**
     *
     * @param dataId
     * @returns {*}
     * @memberof fidj.angularService
     */
    remove(dataId: string): Promise<any | ErrorInterface> {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(dataId);
    };

    /**
     *
     * @param id
     * @returns {*}
     * @memberof fidj.angularService
     */
    find(id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    };

    /**
     *
     * @returns {*}
     * @memberof fidj.angularService
     */
    findAll() {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    };

    /**
     * @deprecated
     */
    // private _testPromise() {
    //     if (!this.fidjService) {
    //         return this.promise.reject('fidj.sdk.angular.testPromise : not initialized.');
    //     }
    //     return (this.fidjService as any)._testPromise();
    // };

}

// noinspection TsLint
const angular: any = window ? window['angular'] : null;
if (angular && angular.module) {

    /**
     * @module FidjService
     * Angular.js InternalService, use it with ${FidjAngularjsService}
     */
    angular
        .module('FidjService', [])
        .factory('FidjService', ($log, $q) => {
            return new FidjAngularjsService($log, $q);
        });

    // todo : enforce fidj.services with all internal modules (LocalStorage etc...) made with love
    angular
        .module('fidj.services', [])
        .factory('srvLocalStorage', () => {

            // var LocalStorage = fidj.LocalStorageFactory(window.localStorage);
            // return new LocalStorage();
            let ls;
            if (typeof window !== 'undefined') {
                ls = window.localStorage;
            } else if (typeof global !== 'undefined') {
                require('localstorage-polyfill');
                ls = global['localStorage'];
            }
            return new tools.LocalStorage(ls, 'fidj.');

        })
        .directive('fidjLazyLoad', ($animate) => {
            return {
                scope: {
                    'fidjLazyLoad': '=',
                    'afterShow': '&',
                    'afterHide': '&'
                },
                link: (scope, element) => {
                    scope.$watch('fidjLazyLoad', (show) => {
                        if (show) {
                            $animate.removeClass(element, 'ng-hide').then(scope.afterShow);
                        }
                        if (show === false) {
                            $animate.addClass(element, 'ng-hide').then(scope.afterHide);
                        }
                    });
                }
            };
        });
}

