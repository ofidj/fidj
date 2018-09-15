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
/**
 * @record
 */
export function LoggerInterface() { }
/** @type {?} */
LoggerInterface.prototype.log;
/** @type {?} */
LoggerInterface.prototype.error;
/** @type {?} */
LoggerInterface.prototype.warn;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXhwb3J0IG5hbWVzcGFjZSBmaWRqIHtcbi8vIH1cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JJbnRlcmZhY2Uge1xuICAgIGNvZGU6IG51bWJlcjtcbiAgICByZWFzb246IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbmRwb2ludEludGVyZmFjZSB7XG4gICAga2V5OiBzdHJpbmc7XG4gICAgdXJsOiBzdHJpbmc7XG4gICAgYmxvY2tlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbmRwb2ludEZpbHRlckludGVyZmFjZSB7XG4gICAga2V5Pzogc3RyaW5nO1xuICAgIHNob3dCbG9ja2VkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgdXNlZCBieSBhbGwgSW50ZXJuYWxTZXJ2aWNlIHdyYXBwZXJzIChhbmd1bGFyLmpzLCBhbmd1bGFyLmlvKVxuICpcbiAqIEBzZWUgRmlkak1vZHVsZVxuICogQHNlZSBGaWRqTW9kdWxlLCBGaWRqQW5ndWxhclNlcnZpY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlIHtcblxuICAgIGluaXQoZmlkaklkOiBzdHJpbmcsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBsb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBsb2dpbkFzRGVtbyhvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+O1xuXG4gICAgaXNMb2dnZWRJbigpOiBib29sZWFuO1xuXG4gICAgZ2V0Um9sZXMoKTogQXJyYXk8c3RyaW5nPjtcblxuICAgIGdldEVuZHBvaW50cygpOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT47XG5cbiAgICBwb3N0T25FbmRwb2ludChrZXk6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBnZXRJZFRva2VuKCk6IHN0cmluZztcblxuICAgIGdldE1lc3NhZ2UoKTogc3RyaW5nO1xuXG4gICAgbG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPjtcblxuICAgIHN5bmMoZm5Jbml0Rmlyc3REYXRhPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICBwdXQoZGF0YTogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT47XG5cbiAgICByZW1vdmUoZGF0YUlkOiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPjtcblxuICAgIGZpbmQoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+O1xuXG4gICAgZmluZEFsbCgpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPjtcbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSB7XG4gICAgcHJvZDogYm9vbGVhbixcbiAgICAvLyBmb3JjZWRFbmRwb2ludD86IHN0cmluZyxcbiAgICAvLyBmb3JjZWREQkVuZHBvaW50Pzogc3RyaW5nLFxuICAgIGNyeXB0bz86IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSB7XG4gICAgYWNjZXNzVG9rZW4/OiBzdHJpbmcsXG4gICAgaWRUb2tlbj86IHN0cmluZyxcbiAgICByZWZyZXNoVG9rZW4/OiBzdHJpbmcsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2RrSW50ZXJmYWNlIHtcbiAgICBvcmc6IHN0cmluZyxcbiAgICB2ZXJzaW9uOiBzdHJpbmcsXG4gICAgcHJvZDogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvZ2dlckludGVyZmFjZSB7XG4gICAgbG9nOiAoYT8sIGI/LCBjPywgZD8sIGU/LCBmPykgPT4gYW55O1xuICAgIGVycm9yOiAoYT8sIGI/LCBjPywgZD8sIGU/LCBmPykgPT4gYW55O1xuICAgIHdhcm46IChhPywgYj8sIGM/LCBkPywgZT8sIGY/KSA9PiBhbnk7XG59XG4iXX0=