import {
    ModuleServiceInterface,
    ModuleServiceInitOptionsInterface,
    ModuleServiceLoginOptionsInterface,
    ErrorInterface,
    EndpointInterface
} from './interfaces';
import {InternalService} from './internal.service';
import {LocalStorage} from '../tools';
import {Error as FidjError} from '../connection';


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
    private miappService: InternalService;

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
        this.miappService = null;
    }

    /**
     * Init the service with miapp.io IDs
     * @param miappId {String} given miapp.io appId
     * @param options Optional settings
     * @param options._devMode {boolean} optional default false, use your customized endpoints
     * @param options._forceOnline {boolean} optional force connection to miapp.io hub
     * @param options._forceEndpoint {String} optional auth endpoint
     * @param options._forceDBEndpoint {String} optional db endpoint
     * @memberof miapp.angularService
     */
    init(miappId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface> {
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

    /**
     *
     * @param login
     * @param password
     * @memberof miapp.angularService
     */
    login(login, password): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular.login : not initialized.'));
        }
        return this.miappService.miappLogin(login, password);
    };

    loginAsDemo(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular.loginAsDemo : not initialized.'));
        }
        return this.miappService.miappLoginInDemoMode(options);
    };

    /**
     * @return true if logged in
     * @memberof miapp.angularService
     */
    isLoggedIn(): boolean {
        if (!this.miappService) {
            return false;
        }
        return this.miappService.miappIsLogin();
    };

    getRoles(): Array<string> {
        if (!this.miappService) {
            return [];
        }
        return this.miappService.miappRoles();
    };

    getEndpoints(): Array<EndpointInterface> {
        if (!this.miappService) {
            return [];
        }
        return this.miappService.miappGetEndpoints();
    };

    postOnEndpoint(key: string, data: any): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.miappService.miappPostOnEndpoint(key, data);
    };

    getIdToken(): string {
        if (!this.miappService) {
            return;
        }
        return this.miappService.miappGetIdToken();
    };

    getMessage(): string {
        if (!this.miappService) {
            return '';
        }
        return this.miappService.miappMessage();
    };

    /**
     * Logout all miapp services
     * @memberof miapp.angularService
     */
    logout(): Promise<void | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(303, 'miapp.sdk.angular.logout : not initialized.'));
        }
        return this.miappService.miappLogout();
    };

    sync(fnInitFirstData): Promise<void | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular.sync : not initialized.'));
        }
        return this.miappService.miappSync(fnInitFirstData, this);
    };

    /**
     *
     * @param data
     * @returns {*}
     * @memberof miapp.angularService
     */
    put(data: any): Promise<string | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular.put : not initialized.'));
        }
        return this.miappService.miappPutInDb(data);
    };

    /**
     *
     * @param dataId
     * @returns {*}
     * @memberof miapp.angularService
     */
    remove(dataId: string): Promise<any | ErrorInterface> {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular.remove : not initialized.'));
        }
        return this.miappService.miappRemoveInDb(dataId);
    };

    /**
     *
     * @param id
     * @returns {*}
     * @memberof miapp.angularService
     */
    find(id) {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular.find : not initialized.'));
        }
        return this.miappService.miappFindInDb(id);
    };

    /**
     *
     * @returns {*}
     * @memberof miapp.angularService
     */
    findAll() {
        if (!this.miappService) {
            return this.promise.reject(new FidjError(401, 'miapp.sdk.angular.findAll : not initialized.'));
        }
        return this.miappService.miappFindAllInDb();
    };

    /**
     * @deprecated
     */
    // private _testPromise() {
    //     if (!this.miappService) {
    //         return this.promise.reject('miapp.sdk.angular.testPromise : not initialized.');
    //     }
    //     return (this.miappService as any)._testPromise();
    // };

}

// noinspection TsLint
const angular: any = window['angular'];
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

    // todo : enforce miapp.services with all internal modules (LocalStorage etc...) made with love
    angular
        .module('miapp.services', [])
        .factory('srvLocalStorage', () => {

            // var LocalStorage = miapp.LocalStorageFactory(window.localStorage);
            // return new LocalStorage();

            return new LocalStorage(window.localStorage, 'miapp.');

        })
        .directive('miappLazyLoad', ($animate) => {
            return {
                scope: {
                    'miappLazyLoad': '=',
                    'afterShow': '&',
                    'afterHide': '&'
                },
                link: (scope, element) => {
                    scope.$watch('miappLazyLoad', (show) => {
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

