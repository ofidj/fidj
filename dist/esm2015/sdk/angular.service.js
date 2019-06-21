/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { LoggerLevelEnum } from './interfaces';
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
     * @param {?=} level
     */
    constructor(level) {
        this.level = level;
        if (!level) {
            this.level = LoggerLevelEnum.ERROR;
        }
        if (!window.console) {
            this.level = LoggerLevelEnum.NONE;
        }
    }
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    log(message, args) {
        if (this.level === LoggerLevelEnum.LOG) {
            console.log(message, args);
        }
    }
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    warn(message, args) {
        if (this.level === LoggerLevelEnum.LOG || this.level === LoggerLevelEnum.WARN) {
            console.warn(message, args);
        }
    }
    /**
     * @param {?} message
     * @param {?} args
     * @return {?}
     */
    error(message, args) {
        if (this.level === LoggerLevelEnum.LOG || this.level === LoggerLevelEnum.WARN || this.level === LoggerLevelEnum.ERROR) {
            console.error(message, args);
        }
    }
    /**
     * @param {?} level
     * @return {?}
     */
    setLevel(level) {
        this.level = level;
    }
}
if (false) {
    /** @type {?} */
    LoggerService.prototype.level;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInNkay9hbmd1bGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUVnQyxlQUFlLEVBQ3JELE1BQU0sY0FBYyxDQUFDO0FBQ3RCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsS0FBSyxJQUFJLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQWtCakQsTUFBTTtJQU1GO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7S0FHM0I7SUFBQSxDQUFDOzs7Ozs7SUFFSyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQTJDO1FBQzNELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckU7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzs7SUFDckQsQ0FBQzs7Ozs7O0lBRUssS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDRDQUE0QyxDQUFDLENBQUMsQ0FBQztTQUNoRztRQUNELE9BQU8sSUFBSSxDQUFD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LE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUM7U0FDckM7S0FDSjs7Ozs7O0lBRUQsR0FBRyxDQUFDLE9BQWUsRUFBRSxJQUFXO1FBQzVCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQUMsR0FBRyxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzlCO0tBQ0o7Ozs7OztJQUVELElBQUksQ0FBQyxPQUFlLEVBQUUsSUFBVztRQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLGVBQWUsQ0FBQyxJQUFJLEVBQUU7WUFDM0UsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDL0I7S0FDSjs7Ozs7O0lBRUQsS0FBSyxDQUFDLE9BQWUsRUFBRSxJQUFXO1FBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLGVBQWUsQ0FBQyxLQUFLLEVBQUU7WUFDbkgsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDaEM7S0FDSjs7Ozs7SUFFRCxRQUFRLENBQUMsS0FBc0I7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDdEI7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIExvZ2dlckludGVyZmFjZSwgTW9kdWxlU2VydmljZUludGVyZmFjZSwgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgTG9nZ2VyTGV2ZWxFbnVtXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge0ludGVybmFsU2VydmljZX0gZnJvbSAnLi9pbnRlcm5hbC5zZXJ2aWNlJztcbmltcG9ydCB7RXJyb3IgYXMgRmlkakVycm9yfSBmcm9tICcuLi9jb25uZWN0aW9uJztcblxuLyoqXG4gKiBBbmd1bGFyMisgRmlkalNlcnZpY2VcbiAqIEBzZWUgTW9kdWxlU2VydmljZUludGVyZmFjZVxuICpcbiAqIEBleGVtcGxlXG4gKiAgICAgIC8vIC4uLiBhZnRlciBpbnN0YWxsIDpcbiAqICAgICAgLy8gJCBucG0gaW5zdGFsbCAtLXNhdmUtZGV2IGZpZGpcbiAqICAgICAgLy8gdGhlbiBpbml0IHlvdXIgYXBwLmpzICYgdXNlIGl0IGluIHlvdXIgc2VydmljZXNcbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni9yYXcvNWZmZjY5ZGQ5YzE1ZjY5MmE4NTZkYjYyY2YzMzRiNzI0ZWYzZjRhYy9hbmd1bGFyLmZpZGouaW5qZWN0LmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLnN5bmMuanNcIj48L3NjcmlwdD5cbiAqXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlkalNlcnZpY2UgaW1wbGVtZW50cyBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlIHtcblxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBmaWRqU2VydmljZTogSW50ZXJuYWxTZXJ2aWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2UoKTtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gUHJvbWlzZTtcbiAgICAgICAgdGhpcy5maWRqU2VydmljZSA9IG51bGw7XG4gICAgICAgIC8vIGxldCBwb3VjaGRiUmVxdWlyZWQgPSBQb3VjaERCO1xuICAgICAgICAvLyBwb3VjaGRiUmVxdWlyZWQuZXJyb3IoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGluaXQoZmlkaklkLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlID0gbmV3IEludGVybmFsU2VydmljZSh0aGlzLmxvZ2dlciwgdGhpcy5wcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSW5pdChmaWRqSWQsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9naW4obG9naW4sIHBhc3N3b3JkKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW4gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbihsb2dpbiwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9naW5Bc0RlbW8ob3B0aW9ucz86IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbkFzRGVtbyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyB0aGlzLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5hbmd1bGFyMi5pc0xvZ2dlZEluIDogbm90IGluaXRpYWxpemVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpJc0xvZ2luKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalJvbGVzKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRFbmRwb2ludHMoKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakdldEVuZHBvaW50cygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgcG9zdE9uRW5kcG9pbnQoa2V5OiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luQXNEZW1vIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUG9zdE9uRW5kcG9pbnQoa2V5LCBkYXRhKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldE1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkak1lc3NhZ2UoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ291dChmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoZm9yY2UgfHwgIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9nb3V0IDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9nb3V0KGZvcmNlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEByZXR1cm5zIHByb21pc2Ugd2l0aCB0aGlzLnNlc3Npb24uZGJcbiAgICAgKiBAbWVtYmVyb2YgZmlkai5hbmd1bGFyU2VydmljZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgbGV0IGluaXREYiA9IGZ1bmN0aW9uKCkge1xuICAgICAqICAgICB0aGlzLmZpZGpTZXJ2aWNlLnB1dCgnbXkgZmlyc3Qgcm93Jyk7XG4gICAgICogIH07XG4gICAgICogIHRoaXMuZmlkalNlcnZpY2Uuc3luYyhpbml0RGIpXG4gICAgICogIC50aGVuKHVzZXIgPT4gLi4uKVxuICAgICAqICAuY2F0Y2goZXJyID0+IC4uLilcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBzeW5jKGZuSW5pdEZpcnN0RGF0YT8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuc3luYyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhLCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZGF0YSBpbiB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhIHRvIHN0b3JlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcHV0KGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnB1dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalB1dEluRGIoZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgb2JqZWN0IElkIGFuZCByZW1vdmUgaXQgZnJvbSB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBvZiBvYmplY3QgdG8gZmluZCBhbmQgcmVtb3ZlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIucmVtb3ZlIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUmVtb3ZlSW5EYihpZCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZChpZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRJbkRiKGlkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpbmRBbGwoKTogUHJvbWlzZTxhbnlbXSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5maW5kQWxsIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqRmluZEFsbEluRGIoKTtcbiAgICB9O1xuXG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIGltcGxlbWVudHMgTG9nZ2VySW50ZXJmYWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbGV2ZWw/OiBMb2dnZXJMZXZlbEVudW0pIHtcbiAgICAgICAgaWYgKCFsZXZlbCkge1xuICAgICAgICAgICAgdGhpcy5sZXZlbCA9IExvZ2dlckxldmVsRW51bS5FUlJPUjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd2luZG93LmNvbnNvbGUpIHtcbiAgICAgICAgICAgIHRoaXMubGV2ZWwgPSBMb2dnZXJMZXZlbEVudW0uTk9ORTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvZyhtZXNzYWdlOiBzdHJpbmcsIGFyZ3M6IFthbnldKSB7XG4gICAgICAgIGlmICh0aGlzLmxldmVsID09PSBMb2dnZXJMZXZlbEVudW0uTE9HKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdhcm4obWVzc2FnZTogc3RyaW5nLCBhcmdzOiBbYW55XSkge1xuICAgICAgICBpZiAodGhpcy5sZXZlbCA9PT0gTG9nZ2VyTGV2ZWxFbnVtLkxPRyB8fCB0aGlzLmxldmVsID09PSBMb2dnZXJMZXZlbEVudW0uV0FSTikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXJyb3IobWVzc2FnZTogc3RyaW5nLCBhcmdzOiBbYW55XSkge1xuICAgICAgICBpZiAodGhpcy5sZXZlbCA9PT0gTG9nZ2VyTGV2ZWxFbnVtLkxPRyB8fCB0aGlzLmxldmVsID09PSBMb2dnZXJMZXZlbEVudW0uV0FSTiB8fCB0aGlzLmxldmVsID09PSBMb2dnZXJMZXZlbEVudW0uRVJST1IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRMZXZlbChsZXZlbDogTG9nZ2VyTGV2ZWxFbnVtKSB7XG4gICAgICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcbiAgICB9XG59XG5cbiJdfQ==