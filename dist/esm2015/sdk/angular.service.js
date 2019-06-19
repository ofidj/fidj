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
export class FidjService {
    constructor() {
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
    init(fidjId, options) {
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
    }
    ;
    /**
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    login(login, password) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    }
    ;
    /**
     * @param {?=} options
     * @return {?}
     */
    loginAsDemo(options) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    }
    ;
    /**
     * @return {?}
     */
    isLoggedIn() {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    }
    ;
    /**
     * @return {?}
     */
    getRoles() {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    }
    ;
    /**
     * @return {?}
     */
    getEndpoints() {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    }
    ;
    /**
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    postOnEndpoint(key, data) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, data);
    }
    ;
    /**
     * @return {?}
     */
    getIdToken() {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    }
    ;
    /**
     * @return {?}
     */
    getMessage() {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    }
    ;
    /**
     * @param {?=} force
     * @return {?}
     */
    logout(force) {
        if (force || !this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout(force);
    }
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
    sync(fnInitFirstData) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    }
    ;
    /**
     * Store data in your session
     *
     * @param {?} data to store
     * @return {?}
     */
    put(data) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    }
    ;
    /**
     * Find object Id and remove it from your session
     *
     * @param {?} id of object to find and remove
     * @return {?}
     */
    remove(id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(id);
    }
    ;
    /**
     * Find
     * @param {?} id
     * @return {?}
     */
    find(id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    }
    ;
    /**
     * @return {?}
     */
    findAll() {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    }
    ;
}
FidjService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FidjService.ctorParameters = () => [];
if (false) {
    /** @type {?} */
    FidjService.prototype.logger;
    /** @type {?} */
    FidjService.prototype.fidjService;
    /** @type {?} */
    FidjService.prototype.promise;
}
export class LoggerService {
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    log(message, args) {
        console.log(message, args);
    }
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    error(message, args) {
        console.error(message, args);
    }
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    warn(message, args) {
        console.warn(message, args);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInNkay9hbmd1bGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFLekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxLQUFLLElBQUksU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBa0JqRCxNQUFNO0lBTUY7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7OztLQUczQjtJQUFBLENBQUM7Ozs7OztJQUVLLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBMkM7UUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyRTs7Ozs7Ozs7UUFRRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzs7SUFDckQsQ0FBQzs7Ozs7O0lBRUssS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDRDQUE0QyxDQUFDLENBQUMsQ0FBQztTQUNoRztRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEs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Ozs7OztJQUVELElBQUksQ0FBQyxPQUFlLEVBQUUsSUFBVztRQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMvQjtDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UsIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge0ludGVybmFsU2VydmljZX0gZnJvbSAnLi9pbnRlcm5hbC5zZXJ2aWNlJztcbmltcG9ydCB7RXJyb3IgYXMgRmlkakVycm9yfSBmcm9tICcuLi9jb25uZWN0aW9uJztcblxuLyoqXG4gKiBBbmd1bGFyMisgRmlkalNlcnZpY2VcbiAqIEBzZWUgTW9kdWxlU2VydmljZUludGVyZmFjZVxuICpcbiAqIEBleGVtcGxlXG4gKiAgICAgIC8vIC4uLiBhZnRlciBpbnN0YWxsIDpcbiAqICAgICAgLy8gJCBucG0gaW5zdGFsbCAtLXNhdmUtZGV2IGZpZGpcbiAqICAgICAgLy8gdGhlbiBpbml0IHlvdXIgYXBwLmpzICYgdXNlIGl0IGluIHlvdXIgc2VydmljZXNcbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni9yYXcvNWZmZjY5ZGQ5YzE1ZjY5MmE4NTZkYjYyY2YzMzRiNzI0ZWYzZjRhYy9hbmd1bGFyLmZpZGouaW5qZWN0LmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLnN5bmMuanNcIj48L3NjcmlwdD5cbiAqXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlkalNlcnZpY2UgaW1wbGVtZW50cyBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlIHtcblxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBmaWRqU2VydmljZTogSW50ZXJuYWxTZXJ2aWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2UoKTtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gUHJvbWlzZTtcbiAgICAgICAgdGhpcy5maWRqU2VydmljZSA9IG51bGw7XG4gICAgICAgIC8vIGxldCBwb3VjaGRiUmVxdWlyZWQgPSBQb3VjaERCO1xuICAgICAgICAvLyBwb3VjaGRiUmVxdWlyZWQuZXJyb3IoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGluaXQoZmlkaklkLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlID0gbmV3IEludGVybmFsU2VydmljZSh0aGlzLmxvZ2dlciwgdGhpcy5wcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZEVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldEF1dGhFbmRwb2ludChvcHRpb25zLmZvcmNlZEVuZHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0REJFbmRwb2ludChvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpO1xuICAgICAgICB9Ki9cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakluaXQoZmlkaklkLCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ2luKGxvZ2luLCBwYXNzd29yZCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9naW4obG9naW4sIHBhc3N3b3JkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ2luQXNEZW1vKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW5Bc0RlbW8gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbkluRGVtb01vZGUob3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gdGhpcy5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuYW5ndWxhcjIuaXNMb2dnZWRJbiA6IG5vdCBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0Um9sZXMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpSb2xlcygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0RW5kcG9pbnRzKCk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRFbmRwb2ludHMoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHBvc3RPbkVuZHBvaW50KGtleTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbkFzRGVtbyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalBvc3RPbkVuZHBvaW50KGtleSwgZGF0YSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpNZXNzYWdlKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dvdXQoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKGZvcmNlIHx8ICF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ291dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ291dChmb3JjZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhICBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcmV0dXJucyBwcm9taXNlIHdpdGggdGhpcy5zZXNzaW9uLmRiXG4gICAgICogQG1lbWJlcm9mIGZpZGouYW5ndWxhclNlcnZpY2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGxldCBpbml0RGIgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgdGhpcy5maWRqU2VydmljZS5wdXQoJ215IGZpcnN0IHJvdycpO1xuICAgICAqICB9O1xuICAgICAqICB0aGlzLmZpZGpTZXJ2aWNlLnN5bmMoaW5pdERiKVxuICAgICAqICAudGhlbih1c2VyID0+IC4uLilcbiAgICAgKiAgLmNhdGNoKGVyciA9PiAuLi4pXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgc3luYyhmbkluaXRGaXJzdERhdGE/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnN5bmMgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YSwgdGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGRhdGEgaW4geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSB0byBzdG9yZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHB1dChkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5wdXQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpQdXRJbkRiKGRhdGEpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG9iamVjdCBJZCBhbmQgcmVtb3ZlIGl0IGZyb20geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgb2Ygb2JqZWN0IHRvIGZpbmQgYW5kIHJlbW92ZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnJlbW92ZSA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalJlbW92ZUluRGIoaWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kXG4gICAgICovXG4gICAgcHVibGljIGZpbmQoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLmZpbmQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpGaW5kSW5EYihpZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaW5kQWxsKCk6IFByb21pc2U8YW55W10gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZEFsbCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRBbGxJbkRiKCk7XG4gICAgfTtcblxufVxuXG5leHBvcnQgY2xhc3MgTG9nZ2VyU2VydmljZSBpbXBsZW1lbnRzIExvZ2dlckludGVyZmFjZSB7XG4gICAgbG9nKG1lc3NhZ2U6IHN0cmluZywgYXJnczogW2FueV0pIHtcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSwgYXJncyk7XG4gICAgfVxuXG4gICAgZXJyb3IobWVzc2FnZTogc3RyaW5nLCBhcmdzOiBbYW55XSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UsIGFyZ3MpO1xuICAgIH1cblxuICAgIHdhcm4obWVzc2FnZTogc3RyaW5nLCBhcmdzOiBbYW55XSkge1xuICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSwgYXJncyk7XG4gICAgfVxufVxuXG4iXX0=