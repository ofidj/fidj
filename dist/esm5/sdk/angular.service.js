/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { InternalService } from './internal.service';
import { Error as FidjError } from '../connection';
/**
 * Angular2+ FidjService
 * @see ModuleServiceInterface
 *
 * \@exemple
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
var FidjService = /** @class */ (function () {
    function FidjService() {
        this.logger = new LoggerService();
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    }
    ;
    /**
     * @param {?} fidjId
     * @param {?=} options
     * @return {?}
     */
    FidjService.prototype.init = /**
     * @param {?} fidjId
     * @param {?=} options
     * @return {?}
     */
    function (fidjId, options) {
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
    ;
    /**
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    FidjService.prototype.login = /**
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    function (login, password) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    };
    ;
    /**
     * @param {?=} options
     * @return {?}
     */
    FidjService.prototype.loginAsDemo = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    };
    ;
    /**
     * @return {?}
     */
    FidjService.prototype.isLoggedIn = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    };
    ;
    /**
     * @return {?}
     */
    FidjService.prototype.getRoles = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    };
    ;
    /**
     * @return {?}
     */
    FidjService.prototype.getEndpoints = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    };
    ;
    /**
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    FidjService.prototype.postOnEndpoint = /**
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    function (key, data) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, data);
    };
    ;
    /**
     * @return {?}
     */
    FidjService.prototype.getIdToken = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    };
    ;
    /**
     * @return {?}
     */
    FidjService.prototype.getMessage = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    };
    ;
    /**
     * @param {?=} force
     * @return {?}
     */
    FidjService.prototype.logout = /**
     * @param {?=} force
     * @return {?}
     */
    function (force) {
        if (force || !this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout(force);
    };
    ;
    /**
     *
     * Synchronize DB
     * \@memberof fidj.angularService
     *
     * \@example
     *  let initDb = function() {
     *     this.fidjService.put('my first row');
     *  };
     *  this.fidjService.sync(initDb)
     *  .then(user => ...)
     *  .catch(err => ...)
     *
     * @param {?=} fnInitFirstData  a function with db as input and that return promise: call if DB is empty
     * @return {?} promise with this.session.db
     */
    FidjService.prototype.sync = /**
     *
     * Synchronize DB
     * \@memberof fidj.angularService
     *
     * \@example
     *  let initDb = function() {
     *     this.fidjService.put('my first row');
     *  };
     *  this.fidjService.sync(initDb)
     *  .then(user => ...)
     *  .catch(err => ...)
     *
     * @param {?=} fnInitFirstData  a function with db as input and that return promise: call if DB is empty
     * @return {?} promise with this.session.db
     */
    function (fnInitFirstData) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };
    ;
    /**
     * Store data in your session
     *
     * @param {?} data to store
     * @return {?}
     */
    FidjService.prototype.put = /**
     * Store data in your session
     *
     * @param {?} data to store
     * @return {?}
     */
    function (data) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    };
    ;
    /**
     * Find object Id and remove it from your session
     *
     * @param {?} id of object to find and remove
     * @return {?}
     */
    FidjService.prototype.remove = /**
     * Find object Id and remove it from your session
     *
     * @param {?} id of object to find and remove
     * @return {?}
     */
    function (id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(id);
    };
    ;
    /**
     * Find
     * @param {?} id
     * @return {?}
     */
    FidjService.prototype.find = /**
     * Find
     * @param {?} id
     * @return {?}
     */
    function (id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    };
    ;
    /**
     * @return {?}
     */
    FidjService.prototype.findAll = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    };
    ;
    FidjService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    FidjService.ctorParameters = function () { return []; };
    return FidjService;
}());
export { FidjService };
if (false) {
    /** @type {?} */
    FidjService.prototype.logger;
    /** @type {?} */
    FidjService.prototype.fidjService;
    /** @type {?} */
    FidjService.prototype.promise;
}
var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    LoggerService.prototype.log = /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    function (message, args) {
        console.log(message, args);
    };
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    LoggerService.prototype.error = /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    function (message, args) {
        console.error(message, args);
    };
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    LoggerService.prototype.warn = /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    function (message, args) {
        console.warn(message, args);
    };
    return LoggerService;
}());
export { LoggerService };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInNkay9hbmd1bGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFLekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxLQUFLLElBQUksU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztJQXdCN0M7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7OztLQUczQjtJQUFBLENBQUM7Ozs7OztJQUVLLDBCQUFJOzs7OztjQUFDLE1BQU0sRUFBRSxPQUEyQztRQUMzRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JFOzs7Ozs7OztRQVFELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztJQUNyRCxDQUFDOzs7Ozs7SUFFSywyQkFBSzs7Ozs7Y0FBQyxLQUFLLEVBQUUsUUFBUTtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7U0FDaEc7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFR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Q0FBQztLQUM5Qjs7Ozs7O0lBRUQsNkJBQUs7Ozs7O0lBQUwsVUFBTSxPQUFlLEVBQUUsSUFBVztRQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNoQzs7Ozs7O0lBRUQsNEJBQUk7Ozs7O0lBQUosVUFBSyxPQUFlLEVBQUUsSUFBVztRQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMvQjt3QkFsTUw7SUFtTUMsQ0FBQTtBQVpELHlCQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UsIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge0ludGVybmFsU2VydmljZX0gZnJvbSAnLi9pbnRlcm5hbC5zZXJ2aWNlJztcbmltcG9ydCB7RXJyb3IgYXMgRmlkakVycm9yfSBmcm9tICcuLi9jb25uZWN0aW9uJztcblxuLyoqXG4gKiBBbmd1bGFyMisgRmlkalNlcnZpY2VcbiAqIEBzZWUgTW9kdWxlU2VydmljZUludGVyZmFjZVxuICpcbiAqIEBleGVtcGxlXG4gKiAgICAgIC8vIC4uLiBhZnRlciBpbnN0YWxsIDpcbiAqICAgICAgLy8gJCBucG0gaW5zdGFsbCAtLXNhdmUtZGV2IGZpZGpcbiAqICAgICAgLy8gdGhlbiBpbml0IHlvdXIgYXBwLmpzICYgdXNlIGl0IGluIHlvdXIgc2VydmljZXNcbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni9yYXcvNWZmZjY5ZGQ5YzE1ZjY5MmE4NTZkYjYyY2YzMzRiNzI0ZWYzZjRhYy9hbmd1bGFyLmZpZGouaW5qZWN0LmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLnN5bmMuanNcIj48L3NjcmlwdD5cbiAqXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlkalNlcnZpY2UgaW1wbGVtZW50cyBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlIHtcblxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBmaWRqU2VydmljZTogSW50ZXJuYWxTZXJ2aWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2UoKTtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gUHJvbWlzZTtcbiAgICAgICAgdGhpcy5maWRqU2VydmljZSA9IG51bGw7XG4gICAgICAgIC8vIGxldCBwb3VjaGRiUmVxdWlyZWQgPSBQb3VjaERCO1xuICAgICAgICAvLyBwb3VjaGRiUmVxdWlyZWQuZXJyb3IoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGluaXQoZmlkaklkLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlID0gbmV3IEludGVybmFsU2VydmljZSh0aGlzLmxvZ2dlciwgdGhpcy5wcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZEVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldEF1dGhFbmRwb2ludChvcHRpb25zLmZvcmNlZEVuZHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0REJFbmRwb2ludChvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpO1xuICAgICAgICB9Ki9cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakluaXQoZmlkaklkLCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ2luKGxvZ2luLCBwYXNzd29yZCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9naW4obG9naW4sIHBhc3N3b3JkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ2luQXNEZW1vKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW5Bc0RlbW8gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbkluRGVtb01vZGUob3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gdGhpcy5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuYW5ndWxhcjIuaXNMb2dnZWRJbiA6IG5vdCBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0Um9sZXMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpSb2xlcygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0RW5kcG9pbnRzKCk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRFbmRwb2ludHMoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHBvc3RPbkVuZHBvaW50KGtleTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbkFzRGVtbyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalBvc3RPbkVuZHBvaW50KGtleSwgZGF0YSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpNZXNzYWdlKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dvdXQoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKGZvcmNlIHx8ICF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ291dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ291dChmb3JjZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhICBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcmV0dXJucyBwcm9taXNlIHdpdGggdGhpcy5zZXNzaW9uLmRiXG4gICAgICogQG1lbWJlcm9mIGZpZGouYW5ndWxhclNlcnZpY2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGxldCBpbml0RGIgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgdGhpcy5maWRqU2VydmljZS5wdXQoJ215IGZpcnN0IHJvdycpO1xuICAgICAqICB9O1xuICAgICAqICB0aGlzLmZpZGpTZXJ2aWNlLnN5bmMoaW5pdERiKVxuICAgICAqICAudGhlbih1c2VyID0+IC4uLilcbiAgICAgKiAgLmNhdGNoKGVyciA9PiAuLi4pXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgc3luYyhmbkluaXRGaXJzdERhdGE/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnN5bmMgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YSwgdGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGRhdGEgaW4geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSB0byBzdG9yZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHB1dChkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5wdXQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpQdXRJbkRiKGRhdGEpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG9iamVjdCBJZCBhbmQgcmVtb3ZlIGl0IGZyb20geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgb2Ygb2JqZWN0IHRvIGZpbmQgYW5kIHJlbW92ZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnJlbW92ZSA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalJlbW92ZUluRGIoaWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kXG4gICAgICovXG4gICAgcHVibGljIGZpbmQoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLmZpbmQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpGaW5kSW5EYihpZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaW5kQWxsKCk6IFByb21pc2U8YW55W10gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZEFsbCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRBbGxJbkRiKCk7XG4gICAgfTtcblxufVxuXG5leHBvcnQgY2xhc3MgTG9nZ2VyU2VydmljZSBpbXBsZW1lbnRzIExvZ2dlckludGVyZmFjZSB7XG4gICAgbG9nKG1lc3NhZ2U6IHN0cmluZywgYXJnczogW2FueV0pIHtcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSwgYXJncyk7XG4gICAgfVxuXG4gICAgZXJyb3IobWVzc2FnZTogc3RyaW5nLCBhcmdzOiBbYW55XSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UsIGFyZ3MpO1xuICAgIH1cblxuICAgIHdhcm4obWVzc2FnZTogc3RyaW5nLCBhcmdzOiBbYW55XSkge1xuICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSwgYXJncyk7XG4gICAgfVxufVxuXG4iXX0=