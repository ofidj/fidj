import * as tslib_1 from "tslib";
/* tslint:disable:max-line-length */
import { Injectable } from '@angular/core';
import { InternalService } from './internal.service';
import { Error as FidjError } from '../connection';
import { LoggerService } from './logger.service';
/**
 * Angular2+ FidjService
 * @see ModuleServiceInterface
 *
 * @exemple
 *      // ... after install :
 *      // $ npm install --save-dev fidj
 *      // then init your app.js & use it in your services
 * TODO refresh gist :
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
    FidjService.prototype.init = function (fidjId, options) {
        if (!this.fidjService) {
            this.fidjService = new InternalService(this.logger, this.promise);
        }
        return this.fidjService.fidjInit(fidjId, options);
    };
    ;
    FidjService.prototype.login = function (login, password) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    };
    ;
    FidjService.prototype.loginAsDemo = function (options) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    };
    ;
    FidjService.prototype.isLoggedIn = function () {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    };
    ;
    FidjService.prototype.getRoles = function () {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    };
    ;
    FidjService.prototype.getEndpoints = function () {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    };
    ;
    FidjService.prototype.postOnEndpoint = function (key, data) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, data);
    };
    ;
    FidjService.prototype.getIdToken = function () {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    };
    ;
    FidjService.prototype.getMessage = function () {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    };
    ;
    FidjService.prototype.logout = function (force) {
        if (force || !this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout(force);
    };
    ;
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
    FidjService.prototype.sync = function (fnInitFirstData) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };
    ;
    /**
     * Store data in your session
     *
     * @param data to store
     * @returns
     */
    FidjService.prototype.put = function (data) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    };
    ;
    /**
     * Find object Id and remove it from your session
     *
     * @param id of object to find and remove
     * @returns
     */
    FidjService.prototype.remove = function (id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(id);
    };
    ;
    /**
     * Find
     */
    FidjService.prototype.find = function (id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    };
    ;
    FidjService.prototype.findAll = function () {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    };
    ;
    FidjService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [])
    ], FidjService);
    return FidjService;
}());
export { FidjService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInNkay9hbmd1bGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG9DQUFvQztBQUNwQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBS3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsS0FBSyxJQUFJLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0M7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSDtJQU1JO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLGlDQUFpQztRQUNqQywyQkFBMkI7SUFDL0IsQ0FBQztJQUFBLENBQUM7SUFFSywwQkFBSSxHQUFYLFVBQVksTUFBYyxFQUFFLE9BQTJDO1FBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckU7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQUEsQ0FBQztJQUVLLDJCQUFLLEdBQVosVUFBYSxLQUFhLEVBQUUsUUFBZ0I7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFH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QUE4QyxDQUFDLENBQUMsQ0FBQztTQUNsRztRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBQUEsQ0FBQztJQXBKTyxXQUFXO1FBRHZCLFVBQVUsRUFBRTs7T0FDQSxXQUFXLENBc0p2QjtJQUFELGtCQUFDO0NBQUEsQUF0SkQsSUFzSkM7U0F0SlksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UsIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge0ludGVybmFsU2VydmljZX0gZnJvbSAnLi9pbnRlcm5hbC5zZXJ2aWNlJztcbmltcG9ydCB7RXJyb3IgYXMgRmlkakVycm9yfSBmcm9tICcuLi9jb25uZWN0aW9uJztcbmltcG9ydCB7TG9nZ2VyU2VydmljZX0gZnJvbSAnLi9sb2dnZXIuc2VydmljZSc7XG5cbi8qKlxuICogQW5ndWxhcjIrIEZpZGpTZXJ2aWNlXG4gKiBAc2VlIE1vZHVsZVNlcnZpY2VJbnRlcmZhY2VcbiAqXG4gKiBAZXhlbXBsZVxuICogICAgICAvLyAuLi4gYWZ0ZXIgaW5zdGFsbCA6XG4gKiAgICAgIC8vICQgbnBtIGluc3RhbGwgLS1zYXZlLWRldiBmaWRqXG4gKiAgICAgIC8vIHRoZW4gaW5pdCB5b3VyIGFwcC5qcyAmIHVzZSBpdCBpbiB5b3VyIHNlcnZpY2VzXG4gKiBUT0RPIHJlZnJlc2ggZ2lzdCA6XG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni9yYXcvNWZmZjY5ZGQ5YzE1ZjY5MmE4NTZkYjYyY2YzMzRiNzI0ZWYzZjRhYy9hbmd1bGFyLmZpZGouaW5qZWN0LmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLnN5bmMuanNcIj48L3NjcmlwdD5cbiAqXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlkalNlcnZpY2UgaW1wbGVtZW50cyBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlIHtcblxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBmaWRqU2VydmljZTogSW50ZXJuYWxTZXJ2aWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2UoKTtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gUHJvbWlzZTtcbiAgICAgICAgdGhpcy5maWRqU2VydmljZSA9IG51bGw7XG4gICAgICAgIC8vIGxldCBwb3VjaGRiUmVxdWlyZWQgPSBQb3VjaERCO1xuICAgICAgICAvLyBwb3VjaGRiUmVxdWlyZWQuZXJyb3IoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGluaXQoZmlkaklkOiBzdHJpbmcsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2UgPSBuZXcgSW50ZXJuYWxTZXJ2aWNlKHRoaXMubG9nZ2VyLCB0aGlzLnByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpJbml0KGZpZGpJZCwgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW4gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbihsb2dpbiwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9naW5Bc0RlbW8ob3B0aW9ucz86IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbkFzRGVtbyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyB0aGlzLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5hbmd1bGFyMi5pc0xvZ2dlZEluIDogbm90IGluaXRpYWxpemVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpJc0xvZ2luKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalJvbGVzKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRFbmRwb2ludHMoKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakdldEVuZHBvaW50cygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgcG9zdE9uRW5kcG9pbnQoa2V5OiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luQXNEZW1vIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUG9zdE9uRW5kcG9pbnQoa2V5LCBkYXRhKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldE1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkak1lc3NhZ2UoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ291dChmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoZm9yY2UgfHwgIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9nb3V0IDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9nb3V0KGZvcmNlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEByZXR1cm5zIHByb21pc2Ugd2l0aCB0aGlzLnNlc3Npb24uZGJcbiAgICAgKiBAbWVtYmVyb2YgZmlkai5hbmd1bGFyU2VydmljZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgbGV0IGluaXREYiA9IGZ1bmN0aW9uKCkge1xuICAgICAqICAgICB0aGlzLmZpZGpTZXJ2aWNlLnB1dCgnbXkgZmlyc3Qgcm93Jyk7XG4gICAgICogIH07XG4gICAgICogIHRoaXMuZmlkalNlcnZpY2Uuc3luYyhpbml0RGIpXG4gICAgICogIC50aGVuKHVzZXIgPT4gLi4uKVxuICAgICAqICAuY2F0Y2goZXJyID0+IC4uLilcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBzeW5jKGZuSW5pdEZpcnN0RGF0YT8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuc3luYyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhLCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZGF0YSBpbiB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhIHRvIHN0b3JlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcHV0KGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnB1dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalB1dEluRGIoZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgb2JqZWN0IElkIGFuZCByZW1vdmUgaXQgZnJvbSB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBvZiBvYmplY3QgdG8gZmluZCBhbmQgcmVtb3ZlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIucmVtb3ZlIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUmVtb3ZlSW5EYihpZCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZChpZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRJbkRiKGlkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpbmRBbGwoKTogUHJvbWlzZTxhbnlbXSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5maW5kQWxsIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqRmluZEFsbEluRGIoKTtcbiAgICB9O1xuXG59XG4iXX0=