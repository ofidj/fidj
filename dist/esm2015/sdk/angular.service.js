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
let FidjService = class FidjService {
    constructor() {
        this.logger = new LoggerService();
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    }
    ;
    init(fidjId, options) {
        if (!this.fidjService) {
            this.fidjService = new InternalService(this.logger, this.promise);
        }
        return this.fidjService.fidjInit(fidjId, options);
    }
    ;
    login(login, password) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    }
    ;
    loginAsDemo(options) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    }
    ;
    isLoggedIn() {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    }
    ;
    getRoles() {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    }
    ;
    getEndpoints() {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    }
    ;
    postOnEndpoint(key, data) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, data);
    }
    ;
    getIdToken() {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    }
    ;
    getMessage() {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    }
    ;
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
     * @param data to store
     * @returns
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
     * @param id of object to find and remove
     * @returns
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
     */
    find(id) {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    }
    ;
    findAll() {
        if (!this.fidjService) {
            return this.promise.reject(new FidjError(401, 'fidj.sdk.angular2.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    }
    ;
};
FidjService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], FidjService);
export { FidjService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInNkay9hbmd1bGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG9DQUFvQztBQUNwQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBS3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsS0FBSyxJQUFJLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0M7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSCxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0lBTXBCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLGlDQUFpQztRQUNqQywyQkFBMkI7SUFDL0IsQ0FBQztJQUFBLENBQUM7SUFFSyxJQUFJLENBQUMsTUFBYyxFQUFFLE9BQTJDO1FBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckU7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQUEsQ0FBQztJQUVLLEtBQUssQ0FBQyxLQUFhLEVBQUUsUUFBZ0I7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJ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SUFDOUMsQ0FBQztJQUFBLENBQUM7Q0FFTCxDQUFBO0FBdEpZLFdBQVc7SUFEdkIsVUFBVSxFQUFFOztHQUNBLFdBQVcsQ0FzSnZCO1NBdEpZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIExvZ2dlckludGVyZmFjZSwgTW9kdWxlU2VydmljZUludGVyZmFjZSwgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZVxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtJbnRlcm5hbFNlcnZpY2V9IGZyb20gJy4vaW50ZXJuYWwuc2VydmljZSc7XG5pbXBvcnQge0Vycm9yIGFzIEZpZGpFcnJvcn0gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQge0xvZ2dlclNlcnZpY2V9IGZyb20gJy4vbG9nZ2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqIEFuZ3VsYXIyKyBGaWRqU2VydmljZVxuICogQHNlZSBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlXG4gKlxuICogQGV4ZW1wbGVcbiAqICAgICAgLy8gLi4uIGFmdGVyIGluc3RhbGwgOlxuICogICAgICAvLyAkIG5wbSBpbnN0YWxsIC0tc2F2ZS1kZXYgZmlkalxuICogICAgICAvLyB0aGVuIGluaXQgeW91ciBhcHAuanMgJiB1c2UgaXQgaW4geW91ciBzZXJ2aWNlc1xuICogVE9ETyByZWZyZXNoIGdpc3QgOlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLmluamVjdC5qc1wiPjwvc2NyaXB0PlxuICpcbiAqIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2L3Jhdy81ZmZmNjlkZDljMTVmNjkyYTg1NmRiNjJjZjMzNGI3MjRlZjNmNGFjL2FuZ3VsYXIuZmlkai5zeW5jLmpzXCI+PC9zY3JpcHQ+XG4gKlxuICpcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpZGpTZXJ2aWNlIGltcGxlbWVudHMgTW9kdWxlU2VydmljZUludGVyZmFjZSB7XG5cbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlO1xuICAgIHByaXZhdGUgZmlkalNlcnZpY2U6IEludGVybmFsU2VydmljZTtcbiAgICBwcml2YXRlIHByb21pc2U6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXJTZXJ2aWNlKCk7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IFByb21pc2U7XG4gICAgICAgIHRoaXMuZmlkalNlcnZpY2UgPSBudWxsO1xuICAgICAgICAvLyBsZXQgcG91Y2hkYlJlcXVpcmVkID0gUG91Y2hEQjtcbiAgICAgICAgLy8gcG91Y2hkYlJlcXVpcmVkLmVycm9yKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBpbml0KGZpZGpJZDogc3RyaW5nLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlID0gbmV3IEludGVybmFsU2VydmljZSh0aGlzLmxvZ2dlciwgdGhpcy5wcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSW5pdChmaWRqSWQsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9naW4obG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9naW4obG9naW4sIHBhc3N3b3JkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ2luQXNEZW1vKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW5Bc0RlbW8gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbkluRGVtb01vZGUob3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gdGhpcy5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuYW5ndWxhcjIuaXNMb2dnZWRJbiA6IG5vdCBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0Um9sZXMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpSb2xlcygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0RW5kcG9pbnRzKCk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRFbmRwb2ludHMoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHBvc3RPbkVuZHBvaW50KGtleTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbkFzRGVtbyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalBvc3RPbkVuZHBvaW50KGtleSwgZGF0YSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpNZXNzYWdlKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dvdXQoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKGZvcmNlIHx8ICF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ291dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ291dChmb3JjZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhICBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcmV0dXJucyBwcm9taXNlIHdpdGggdGhpcy5zZXNzaW9uLmRiXG4gICAgICogQG1lbWJlcm9mIGZpZGouYW5ndWxhclNlcnZpY2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGxldCBpbml0RGIgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgdGhpcy5maWRqU2VydmljZS5wdXQoJ215IGZpcnN0IHJvdycpO1xuICAgICAqICB9O1xuICAgICAqICB0aGlzLmZpZGpTZXJ2aWNlLnN5bmMoaW5pdERiKVxuICAgICAqICAudGhlbih1c2VyID0+IC4uLilcbiAgICAgKiAgLmNhdGNoKGVyciA9PiAuLi4pXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgc3luYyhmbkluaXRGaXJzdERhdGE/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnN5bmMgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YSwgdGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGRhdGEgaW4geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSB0byBzdG9yZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHB1dChkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5wdXQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpQdXRJbkRiKGRhdGEpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG9iamVjdCBJZCBhbmQgcmVtb3ZlIGl0IGZyb20geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgb2Ygb2JqZWN0IHRvIGZpbmQgYW5kIHJlbW92ZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnJlbW92ZSA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalJlbW92ZUluRGIoaWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kXG4gICAgICovXG4gICAgcHVibGljIGZpbmQoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLmZpbmQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpGaW5kSW5EYihpZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaW5kQWxsKCk6IFByb21pc2U8YW55W10gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZEFsbCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRBbGxJbkRiKCk7XG4gICAgfTtcblxufVxuIl19