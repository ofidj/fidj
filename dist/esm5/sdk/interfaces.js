/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function ErrorInterface() { }
/** @type {?} */
ErrorInterface.prototype.code;
/** @type {?} */
ErrorInterface.prototype.reason;
/**
 * @record
 */
export function EndpointInterface() { }
/** @type {?} */
EndpointInterface.prototype.key;
/** @type {?} */
EndpointInterface.prototype.url;
/** @type {?} */
EndpointInterface.prototype.blocked;
/**
 * @record
 */
export function EndpointFilterInterface() { }
/** @type {?|undefined} */
EndpointFilterInterface.prototype.key;
/** @type {?|undefined} */
EndpointFilterInterface.prototype.showBlocked;
/**
 * Interface used by all InternalService wrappers (angular.js, angular.io)
 *
 * @see FidjModule
 * @see FidjModule, FidjAngularService
 * @record
 */
export function ModuleServiceInterface() { }
/** @type {?} */
ModuleServiceInterface.prototype.init;
/** @type {?} */
ModuleServiceInterface.prototype.login;
/** @type {?} */
ModuleServiceInterface.prototype.loginAsDemo;
/** @type {?} */
ModuleServiceInterface.prototype.isLoggedIn;
/** @type {?} */
ModuleServiceInterface.prototype.getRoles;
/** @type {?} */
ModuleServiceInterface.prototype.getEndpoints;
/** @type {?} */
ModuleServiceInterface.prototype.postOnEndpoint;
/** @type {?} */
ModuleServiceInterface.prototype.getIdToken;
/** @type {?} */
ModuleServiceInterface.prototype.getMessage;
/** @type {?} */
ModuleServiceInterface.prototype.logout;
/** @type {?} */
ModuleServiceInterface.prototype.sync;
/** @type {?} */
ModuleServiceInterface.prototype.put;
/** @type {?} */
ModuleServiceInterface.prototype.remove;
/** @type {?} */
ModuleServiceInterface.prototype.find;
/** @type {?} */
ModuleServiceInterface.prototype.findAll;
/**
 * @record
 */
export function ModuleServiceInitOptionsInterface() { }
/** @type {?} */
ModuleServiceInitOptionsInterface.prototype.prod;
/** @type {?|undefined} */
ModuleServiceInitOptionsInterface.prototype.crypto;
/** @type {?|undefined} */
ModuleServiceInitOptionsInterface.prototype.logLevel;
/**
 * @record
 */
export function ModuleServiceLoginOptionsInterface() { }
/** @type {?|undefined} */
ModuleServiceLoginOptionsInterface.prototype.accessToken;
/** @type {?|undefined} */
ModuleServiceLoginOptionsInterface.prototype.idToken;
/** @type {?|undefined} */
ModuleServiceLoginOptionsInterface.prototype.refreshToken;
/**
 * @record
 */
export function SdkInterface() { }
/** @type {?} */
SdkInterface.prototype.org;
/** @type {?} */
SdkInterface.prototype.version;
/** @type {?} */
SdkInterface.prototype.prod;
/** @enum {number} */
var LoggerLevelEnum = {
    LOG: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
};
export { LoggerLevelEnum };
LoggerLevelEnum[LoggerLevelEnum.LOG] = 'LOG';
LoggerLevelEnum[LoggerLevelEnum.WARN] = 'WARN';
LoggerLevelEnum[LoggerLevelEnum.ERROR] = 'ERROR';
LoggerLevelEnum[LoggerLevelEnum.NONE] = 'NONE';
/**
 * @record
 */
export function LoggerInterface() { }
/** @type {?} */
LoggerInterface.prototype.setLevel;
/** @type {?} */
LoggerInterface.prototype.log;
/** @type {?} */
LoggerInterface.prototype.warn;
/** @type {?} */
LoggerInterface.prototype.error;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0VJLE1BQU87SUFDUCxPQUFRO0lBQ1IsUUFBUztJQUNULE9BQVE7OztnQ0FIUixHQUFHO2dDQUNILElBQUk7Z0NBQ0osS0FBSztnQ0FDTCxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXhwb3J0IG5hbWVzcGFjZSBmaWRqIHtcbi8vIH1cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JJbnRlcmZhY2Uge1xuICAgIGNvZGU6IG51bWJlcjtcbiAgICByZWFzb246IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbmRwb2ludEludGVyZmFjZSB7XG4gICAga2V5OiBzdHJpbmc7XG4gICAgdXJsOiBzdHJpbmc7XG4gICAgYmxvY2tlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbmRwb2ludEZpbHRlckludGVyZmFjZSB7XG4gICAga2V5Pzogc3RyaW5nO1xuICAgIHNob3dCbG9ja2VkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgdXNlZCBieSBhbGwgSW50ZXJuYWxTZXJ2aWNlIHdyYXBwZXJzIChhbmd1bGFyLmpzLCBhbmd1bGFyLmlvKVxuICpcbiAqIEBzZWUgRmlkak1vZHVsZVxuICogQHNlZSBGaWRqTW9kdWxlLCBGaWRqQW5ndWxhclNlcnZpY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlIHtcblxuICAgIGluaXQoZmlkaklkOiBzdHJpbmcsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBsb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBsb2dpbkFzRGVtbyhvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+O1xuXG4gICAgaXNMb2dnZWRJbigpOiBib29sZWFuO1xuXG4gICAgZ2V0Um9sZXMoKTogQXJyYXk8c3RyaW5nPjtcblxuICAgIGdldEVuZHBvaW50cygpOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT47XG5cbiAgICBwb3N0T25FbmRwb2ludChrZXk6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBnZXRJZFRva2VuKCk6IHN0cmluZztcblxuICAgIGdldE1lc3NhZ2UoKTogc3RyaW5nO1xuXG4gICAgbG9nb3V0KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPjtcblxuICAgIHN5bmMoZm5Jbml0Rmlyc3REYXRhPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBwdXQoZGF0YTogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICByZW1vdmUoZGF0YUlkOiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPjtcblxuICAgIGZpbmQoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+O1xuXG4gICAgZmluZEFsbCgpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPjtcbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSB7XG4gICAgcHJvZDogYm9vbGVhbixcbiAgICAvLyBmb3JjZWRFbmRwb2ludD86IHN0cmluZyxcbiAgICAvLyBmb3JjZWREQkVuZHBvaW50Pzogc3RyaW5nLFxuICAgIGNyeXB0bz86IGJvb2xlYW4sXG4gICAgbG9nTGV2ZWw/OiBMb2dnZXJMZXZlbEVudW1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlIHtcbiAgICBhY2Nlc3NUb2tlbj86IHN0cmluZyxcbiAgICBpZFRva2VuPzogc3RyaW5nLFxuICAgIHJlZnJlc2hUb2tlbj86IHN0cmluZyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZGtJbnRlcmZhY2Uge1xuICAgIG9yZzogc3RyaW5nLFxuICAgIHZlcnNpb246IHN0cmluZyxcbiAgICBwcm9kOiBib29sZWFuXG59XG5cbmV4cG9ydCBlbnVtIExvZ2dlckxldmVsRW51bSB7XG4gICAgTE9HID0gMSxcbiAgICBXQVJOID0gMixcbiAgICBFUlJPUiA9IDMsXG4gICAgTk9ORSA9IDRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXJJbnRlcmZhY2Uge1xuICAgIHNldExldmVsOiAoTG9nZ2VyTGV2ZWxFbnVtKSA9PiB2b2lkO1xuXG4gICAgbG9nOiAoYT8sIGI/LCBjPywgZD8sIGU/LCBmPykgPT4gYW55O1xuICAgIHdhcm46IChhPywgYj8sIGM/LCBkPywgZT8sIGY/KSA9PiBhbnk7XG4gICAgZXJyb3I6IChhPywgYj8sIGM/LCBkPywgZT8sIGY/KSA9PiBhbnk7XG59XG4iXX0=