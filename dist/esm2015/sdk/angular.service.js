import { __awaiter } from "tslib";
import { Injectable } from '@angular/core';
import { LoggerLevelEnum } from './interfaces';
import { InternalService } from './internal.service';
import { Error as FidjError } from '../connection';
import { LoggerService } from './logger.service';
import * as i0 from "@angular/core";
/**
 * Angular FidjService
 * @see ModuleServiceInterface
 *
 */
export class FidjService {
    constructor() {
        this.logger = new LoggerService(LoggerLevelEnum.ERROR);
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    }
    ;
    init(fidjId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                this.fidjService = new InternalService(this.logger, this.promise);
            }
            return this.fidjService.fidjInit(fidjId, options);
        });
    }
    ;
    login(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.login : not initialized.'));
            }
            return this.fidjService.fidjLogin(login, password);
        });
    }
    ;
    loginAsDemo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
            }
            return this.fidjService.fidjLoginInDemoMode(options);
        });
    }
    ;
    isLoggedIn() {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    }
    ;
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return [];
            }
            return yield this.fidjService.fidjRoles();
        });
    }
    ;
    getEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return [];
            }
            return this.fidjService.fidjGetEndpoints();
        });
    }
    ;
    sendOnEndpoint(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
            }
            return this.fidjService.fidjSendOnEndpoint(input);
        });
    }
    ;
    getIdToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return;
            }
            return this.fidjService.fidjGetIdToken();
        });
    }
    ;
    getMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return '';
            }
            return this.fidjService.fidjMessage();
        });
    }
    ;
    logout(force) {
        return __awaiter(this, void 0, void 0, function* () {
            if (force || !this.fidjService) {
                return this.promise.reject(new FidjError(303, 'fidj.sdk.angular.logout : not initialized.'));
            }
            return this.fidjService.fidjLogout(force);
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.sync : not initialized.'));
            }
            return this.fidjService.fidjSync(fnInitFirstData, this);
        });
    }
    ;
    /**
     * Store data in your session
     *
     * @param data to store
     * @returns
     */
    put(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.put : not initialized.'));
            }
            return this.fidjService.fidjPutInDb(data);
        });
    }
    ;
    /**
     * Find object Id and remove it from your session
     *
     * @param id of object to find and remove
     * @returns
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.remove : not initialized.'));
            }
            return this.fidjService.fidjRemoveInDb(id);
        });
    }
    ;
    /**
     * Find
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.find : not initialized.'));
            }
            return this.fidjService.fidjFindInDb(id);
        });
    }
    ;
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new FidjError(401, 'fidj.sdk.angular.findAll : not initialized.'));
            }
            return this.fidjService.fidjFindAllInDb();
        });
    }
    ;
}
FidjService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FidjService_Factory() { return new FidjService(); }, token: FidjService, providedIn: "root" });
FidjService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
FidjService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3RyYXZpcy9idWlsZC9vZmlkai9maWRqL3NyYy8iLCJzb3VyY2VzIjpbInNkay9hbmd1bGFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUtILGVBQWUsRUFJbEIsTUFBTSxjQUFjLENBQUM7QUFDdEIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxLQUFLLElBQUksU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFFL0M7Ozs7R0FJRztBQUlILE1BQU0sT0FBTyxXQUFXO0lBTXBCO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsaUNBQWlDO1FBQ2pDLDJCQUEyQjtJQUMvQixDQUFDO0lBQUEsQ0FBQztJQUVXLElBQUksQ0FBQyxNQUFjLEVBQUUsT0FBMkM7O1lBQ3pFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3JFO1lBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEQsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVXLEtBQUssQ0FBQyxLQUFhLEVBQUUsUUFBZ0I7O1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDLENBQUM7YUFDL0Y7WUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQUE7SUFBQSxDQUFDO0lBRVcsV0FBVyxDQUFDLE9BQTRDOztZQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsaURBQWlELENBQUMsQ0FBQyxDQUFDO2FBQ3JHO1lBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQUFBLENBQUM7SUFFSyxVQUFVO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkIsT0FBTyxLQUFLLENBQUMsQ0FBQyx5RUFBeUU7U0FDMUY7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUFBLENBQUM7SUFFVyxRQUFROztZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDbkIsT0FBTyxFQUFFLENBQUM7YUFDYjtZQUNELE9BQU8sTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlDLENBQUM7S0FBQTtJQUFBLENBQUM7SUFFVyxZQUFZOztZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDbkIsT0FBTyxFQUFFLENBQUM7YUFDYjtZQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQy9DLENBQUM7S0FBQTtJQUFBLENBQUM7SUFFVyxjQUFjLENBQUMsS0FBNEI7O1lBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxpREFBaUQsQ0FBQyxDQUFDLENBQUM7YUFDckc7WUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEQsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVXLFVBQVU7O1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixPQUFPO2FBQ1Y7WUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDN0MsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVXLFVBQVU7O1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixPQUFPLEVBQUUsQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzFDLENBQUM7S0FBQTtJQUFBLENBQUM7SUFFVyxNQUFNLENBQUMsS0FBZTs7WUFDL0IsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUM1QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7YUFDaEc7WUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtJQUFBLENBQUM7SUFFRjs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDVSxJQUFJLENBQUMsZUFBZ0I7O1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDLENBQUM7YUFDOUY7WUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxDQUFDO0tBQUE7SUFBQSxDQUFDO0lBRUY7Ozs7O09BS0c7SUFDVSxHQUFHLENBQUMsSUFBUzs7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxDQUFDLENBQUMsQ0FBQzthQUM3RjtZQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVGOzs7OztPQUtHO0lBQ1UsTUFBTSxDQUFDLEVBQVU7O1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7YUFDaEc7WUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUM7S0FBQTtJQUFBLENBQUM7SUFFRjs7T0FFRztJQUNVLElBQUksQ0FBQyxFQUFVOztZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsMENBQTBDLENBQUMsQ0FBQyxDQUFDO2FBQzlGO1lBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDO0tBQUE7SUFBQSxDQUFDO0lBRVcsT0FBTzs7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDZDQUE2QyxDQUFDLENBQUMsQ0FBQzthQUNqRztZQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM5QyxDQUFDO0tBQUE7SUFBQSxDQUFDOzs7O1lBdkpMLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIEVuZHBvaW50Q2FsbEludGVyZmFjZSxcbiAgICBFbmRwb2ludEludGVyZmFjZSxcbiAgICBFcnJvckludGVyZmFjZSxcbiAgICBMb2dnZXJJbnRlcmZhY2UsXG4gICAgTG9nZ2VyTGV2ZWxFbnVtLFxuICAgIE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSxcbiAgICBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7SW50ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2ludGVybmFsLnNlcnZpY2UnO1xuaW1wb3J0IHtFcnJvciBhcyBGaWRqRXJyb3J9IGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHtMb2dnZXJTZXJ2aWNlfSBmcm9tICcuL2xvZ2dlci5zZXJ2aWNlJztcblxuLyoqXG4gKiBBbmd1bGFyIEZpZGpTZXJ2aWNlXG4gKiBAc2VlIE1vZHVsZVNlcnZpY2VJbnRlcmZhY2VcbiAqXG4gKi9cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEZpZGpTZXJ2aWNlIGltcGxlbWVudHMgTW9kdWxlU2VydmljZUludGVyZmFjZSB7XG5cbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlO1xuICAgIHByaXZhdGUgZmlkalNlcnZpY2U6IEludGVybmFsU2VydmljZTtcbiAgICBwcml2YXRlIHByb21pc2U6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXJTZXJ2aWNlKExvZ2dlckxldmVsRW51bS5FUlJPUik7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IFByb21pc2U7XG4gICAgICAgIHRoaXMuZmlkalNlcnZpY2UgPSBudWxsO1xuICAgICAgICAvLyBsZXQgcG91Y2hkYlJlcXVpcmVkID0gUG91Y2hEQjtcbiAgICAgICAgLy8gcG91Y2hkYlJlcXVpcmVkLmVycm9yKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBpbml0KGZpZGpJZDogc3RyaW5nLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlID0gbmV3IEludGVybmFsU2VydmljZSh0aGlzLmxvZ2dlciwgdGhpcy5wcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSW5pdChmaWRqSWQsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgbG9naW4obG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIubG9naW4gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbihsb2dpbiwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgbG9naW5Bc0RlbW8ob3B0aW9ucz86IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyLmxvZ2luQXNEZW1vIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIHRoaXMucHJvbWlzZS5yZWplY3QoJ2ZpZGouc2RrLmFuZ3VsYXIuaXNMb2dnZWRJbiA6IG5vdCBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0Um9sZXMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpSb2xlcygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0RW5kcG9pbnRzKCk6IFByb21pc2U8QXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+PiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRFbmRwb2ludHMoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIHNlbmRPbkVuZHBvaW50KGlucHV0OiBFbmRwb2ludENhbGxJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyLmxvZ2luQXNEZW1vIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqU2VuZE9uRW5kcG9pbnQoaW5wdXQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0SWRUb2tlbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGdldE1lc3NhZ2UoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkak1lc3NhZ2UoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGxvZ291dChmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoZm9yY2UgfHwgIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhci5sb2dvdXQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dvdXQoZm9yY2UpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFN5bmNocm9uaXplIERCXG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YSAgYSBmdW5jdGlvbiB3aXRoIGRiIGFzIGlucHV0IGFuZCB0aGF0IHJldHVybiBwcm9taXNlOiBjYWxsIGlmIERCIGlzIGVtcHR5XG4gICAgICogQHJldHVybnMgcHJvbWlzZSB3aXRoIHRoaXMuc2Vzc2lvbi5kYlxuICAgICAqIEBtZW1iZXJvZiBmaWRqLmFuZ3VsYXJTZXJ2aWNlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBsZXQgaW5pdERiID0gZnVuY3Rpb24oKSB7XG4gICAgICogICAgIHRoaXMuZmlkalNlcnZpY2UucHV0KCdteSBmaXJzdCByb3cnKTtcbiAgICAgKiAgfTtcbiAgICAgKiAgdGhpcy5maWRqU2VydmljZS5zeW5jKGluaXREYilcbiAgICAgKiAgLnRoZW4odXNlciA9PiAuLi4pXG4gICAgICogIC5jYXRjaChlcnIgPT4gLi4uKVxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIHN5bmMoZm5Jbml0Rmlyc3REYXRhPyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyLnN5bmMgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YSwgdGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGRhdGEgaW4geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSB0byBzdG9yZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIHB1dChkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyLnB1dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalB1dEluRGIoZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgb2JqZWN0IElkIGFuZCByZW1vdmUgaXQgZnJvbSB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBvZiBvYmplY3QgdG8gZmluZCBhbmQgcmVtb3ZlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgcmVtb3ZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhci5yZW1vdmUgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpSZW1vdmVJbkRiKGlkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmluZFxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBmaW5kKGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyLmZpbmQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpGaW5kSW5EYihpZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaW5kQWxsKCk6IFByb21pc2U8YW55W10gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhci5maW5kQWxsIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqRmluZEFsbEluRGIoKTtcbiAgICB9O1xuXG59XG4iXX0=