import {IFidjService} from './fidj.sdk';
// import {SrvFidj} from './fidj.sdk.service';


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
    private fidjService: any;

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
        this.fidjService = null;
    }

    /**
     * Init the service with fidj IDs
     * @param fidjId {String} given fidj appId
     * @param fidjSalt {String} given fidj appSalt
     * @param options Optional settings
     * @param options._devMode {boolean} optional default false, use your customized endpoints
     * @param options._forceOnline {boolean} optional force connection to fidj hub
     * @param options._forceEndpoint {String} optional auth endpoint
     * @param options._forceDBEndpoint {String} optional db endpoint
     * @memberof fidj.angularService
     */
    init(fidjId, fidjSalt, options) {
        if (this.fidjService) return this.promise.reject('fidj.sdk.angular.init : already initialized.');
        //todo this.fidjService = new SrvFidj(this.logger, this.promise);
        if (options && options._forceEndpoint) this.fidjService.setAuthEndpoint(options._forceEndpoint);
        if (options && options._forceDBEndpoint) this.fidjService.setDBEndpoint(options._forceDBEndpoint);
        let _forceOnline = false;
        if (options && options._forceOnline === true) _forceOnline = true;
        return this.fidjService.fidjInit({fidjId: fidjId, fidjSalt: fidjSalt, devMode: options._devMode});

    };

    /**
     *
     * @param login
     * @param password
     * @memberof fidj.angularService
     */
    login(login, password) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.login : not initialized.');
        return this.fidjService.fidjLogin(login, password);
    };


    /**
     * @return true if logged in
     * @memberof fidj.angularService
     */
    isLoggedIn() {
        if (!this.fidjService) return false;
        return this.fidjService.fidjIsLogin();
    };

    getRoles() {
        if (!this.fidjService) return [];
        return this.fidjService.fidjRoles();
    };

    getEndpoints() {
        if (!this.fidjService) return [];
        return this.fidjService.getEndpoints();
    };


    /**
     * Logoff all fidj services
     * @memberof fidj.angularService
     */
    logoff() {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.fidjLogoff : not initialized.');
        return this.fidjService.fidjLogoff();
    };

    sync(fnInitFirstData) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.sync : not initialized.');
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };

    /**
     *
     * @param data
     * @returns {*}
     * @memberof fidj.angularService
     */
    put(data) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.put : not initialized.');
        return this.fidjService.fidjPutInDb(data);
    };


    /**
     *
     * @param data
     * @returns {*}
     * @memberof fidj.angularService
     */
    remove(data) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.remove : not initialized.');
        return this.fidjService.fidjRemoveInDb(data);
    };

    /**
     *
     * @param id
     * @returns {*}
     * @memberof fidj.angularService
     */
    find(id) {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.find : not initialized.');
        return this.fidjService.fidjFindInDb(id);
    };

    /**
     *
     * @returns {*}
     * @memberof fidj.angularService
     */
    findAll() {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.findAll : not initialized.');
        return this.fidjService.fidjFindAllInDb();
    };


    /**
     * @deprecated
     * @private
     */
    private _testPromise() {
        if (!this.fidjService) return this.promise.reject('fidj.sdk.angular.testPromise : not initialized.');
        return this.fidjService._testPromise();
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


    //todo : enforce fidj.services with all internal modules made with love
    angular
        .module('fidj.services', [])
        .factory('srvLocalStorage', function () {

            //todo var LocalStorage = fidj.LocalStorageFactory(window.localStorage);
            //return new LocalStorage();

        })
        .directive('fidjLazyLoad', function ($animate) {
            return {
                scope: {
                    'fidjLazyLoad': '=',
                    'afterShow': '&',
                    'afterHide': '&'
                },
                link: function (scope, element) {
                    scope.$watch('fidjLazyLoad', function (show, oldShow) {
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

