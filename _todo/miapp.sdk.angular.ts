import {IFidjService} from './miapp.sdk';
// import {SrvFidj} from './miapp.sdk.service';


/**
 * Fidj Angular Auth SDK : Help your app to manage your users (login) and session shared data (sync)
 * with an angular module
 * @class FidjAngularService
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
export class FidjAngularService implements IFidjService {

    private logger: any;
    private promise: any;
    private miappService: any;

    /**
     * @param $log
     * @param $q
     * @constructor
     */
    constructor($log?, $q?) {
        this.logger = $log;
        // this.logger = {
        //     log: function () {
        //     },
        //     error: function () {
        //     }
        // };
        this.promise = $q;
        this.miappService = null;
    }

    /**
     * Init the service with miapp.io IDs
     * @param miappId {String} given miapp.io appId
     * @param miappSalt {String} given miapp.io appSalt
     * @param options Optional settings
     * @param options._devMode {boolean} optional default false, use your customized endpoints
     * @param options._forceOnline {boolean} optional force connection to miapp.io hub
     * @param options._forceEndpoint {String} optional auth endpoint
     * @param options._forceDBEndpoint {String} optional db endpoint
     * @memberof miapp.angularService
     */
    init(miappId, miappSalt, options) {
        if (this.miappService) return this.promise.reject('miapp.sdk.angular.init : already initialized.');
        //todo this.miappService = new SrvFidj(this.logger, this.promise);
        if (options && options._forceEndpoint) this.miappService.setAuthEndpoint(options._forceEndpoint);
        if (options && options._forceDBEndpoint) this.miappService.setDBEndpoint(options._forceDBEndpoint);
        let _forceOnline = false;
        if (options && options._forceOnline === true) _forceOnline = true;
        return this.miappService.miappInit({miappId: miappId, miappSalt: miappSalt, devMode: options._devMode});

    };

    /**
     *
     * @param login
     * @param password
     * @memberof miapp.angularService
     */
    login(login, password) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.login : not initialized.');
        return this.miappService.miappLogin(login, password);
    };


    /**
     * @return true if logged in
     * @memberof miapp.angularService
     */
    isLoggedIn() {
        if (!this.miappService) return false;
        return this.miappService.miappIsLogin();
    };

    getRoles() {
        if (!this.miappService) return [];
        return this.miappService.miappRoles();
    };

    getEndpoints() {
        if (!this.miappService) return [];
        return this.miappService.getEndpoints();
    };


    /**
     * Logoff all miapp services
     * @memberof miapp.angularService
     */
    logoff() {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.miappLogoff : not initialized.');
        return this.miappService.miappLogoff();
    };

    sync(fnInitFirstData) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.sync : not initialized.');
        return this.miappService.miappSync(fnInitFirstData, this);
    };

    /**
     *
     * @param data
     * @returns {*}
     * @memberof miapp.angularService
     */
    put(data) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.put : not initialized.');
        return this.miappService.miappPutInDb(data);
    };


    /**
     *
     * @param data
     * @returns {*}
     * @memberof miapp.angularService
     */
    remove(data) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.remove : not initialized.');
        return this.miappService.miappRemoveInDb(data);
    };

    /**
     *
     * @param id
     * @returns {*}
     * @memberof miapp.angularService
     */
    find(id) {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.find : not initialized.');
        return this.miappService.miappFindInDb(id);
    };

    /**
     *
     * @returns {*}
     * @memberof miapp.angularService
     */
    findAll() {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.findAll : not initialized.');
        return this.miappService.miappFindAllInDb();
    };


    /**
     * @deprecated
     * @private
     */
    private _testPromise() {
        if (!this.miappService) return this.promise.reject('miapp.sdk.angular.testPromise : not initialized.');
        return this.miappService._testPromise();
    };

}


let angular: any;
if (angular && angular.module) {

    /**
     * @module FidjService
     * Angular.js FidjService, use it with ${FidjAngularService}
     * todo doc on angular 1 module ?
     */
    angular
        .module('FidjService', [])
        .factory('FidjService', function ($log, $q) {
            return new FidjAngularService($log, $q);
        });


    //todo : enforce miapp.services with all internal modules made with love
    angular
        .module('miapp.services', [])
        .factory('srvLocalStorage', function () {

            //todo var LocalStorage = miapp.LocalStorageFactory(window.localStorage);
            //return new LocalStorage();

        })
        .directive('miappLazyLoad', function ($animate) {
            return {
                scope: {
                    'miappLazyLoad': '=',
                    'afterShow': '&',
                    'afterHide': '&'
                },
                link: function (scope, element) {
                    scope.$watch('miappLazyLoad', function (show, oldShow) {
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

