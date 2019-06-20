/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as version from '../version';
import * as tools from '../tools';
import * as connection from '../connection';
import * as session from '../session';
import { Error } from './error';
import { Ajax } from '../connection/ajax';
/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
var InternalService = /** @class */ (function () {
    function InternalService(logger, promise) {
        this.sdk = {
            org: 'fidj',
            version: version.version,
            prod: false
        };
        this.logger = {
            log: function () {
            },
            error: function () {
            },
            warn: function () {
            }
        };
        if (logger) {
            this.logger = logger;
        }
        else if (window.console) { // && logger === window.console
            // && logger === window.console
            this.logger.log = window.console.log;
            this.logger.error = window.console.error;
            this.logger.warn = window.console.warn;
        }
        // console.log('logger: ', this.logger);
        this.logger.log('fidj.sdk.service : constructor');
        if (promise) {
            this.promise = promise;
        }
        this.storage = new tools.LocalStorage(window.localStorage, 'fidj.');
        this.session = new session.Session();
        this.connection = new connection.Connection(this.sdk, this.storage);
    }
    /**
     * Init connection & session
     * Check uri
     * Done each app start
     *
     * @param {?} fidjId
     * @param {?=} options Optional settings
     * @return {?}
     */
    InternalService.prototype.fidjInit = /**
     * Init connection & session
     * Check uri
     * Done each app start
     *
     * @param {?} fidjId
     * @param {?=} options Optional settings
     * @return {?}
     */
    function (fidjId, options) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjInit : ', options);
        if (!fidjId) {
            self.logger.error('fidj.sdk.service.fidjInit : bad init');
            return self.promise.reject(new Error(400, 'Need a fidjId'));
        }
        self.sdk.prod = !options ? true : options.prod;
        return new self.promise(function (resolve, reject) {
            self.connection.verifyConnectionStates()
                .then(function () {
                self.connection.fidjId = fidjId;
                self.connection.fidjVersion = self.sdk.version;
                self.connection.fidjCrypto = (!options || !options.hasOwnProperty('crypto')) ? true : options.crypto;
                /** @type {?} */
                var theBestUrl = self.connection.getApiEndpoints({ filter: 'theBestOne' })[0];
                /** @type {?} */
                var theBestOldUrl = self.connection.getApiEndpoints({ filter: 'theBestOldOne' })[0];
                /** @type {?} */
                var isLogin = self.fidjIsLogin();
                if (theBestUrl && theBestUrl.url) {
                    theBestUrl = theBestUrl.url;
                }
                if (theBestOldUrl && theBestOldUrl.url) {
                    theBestOldUrl = theBestOldUrl.url;
                }
                if (theBestUrl) {
                    self.connection.setClient(new connection.Client(self.connection.fidjId, theBestUrl, self.storage, self.sdk));
                    resolve();
                }
                else if (isLogin && theBestOldUrl) {
                    self.connection.setClient(new connection.Client(self.connection.fidjId, theBestOldUrl, self.storage, self.sdk));
                    resolve();
                }
                else {
                    reject(new Error(404, 'Need one connection - or too old SDK version (check update)'));
                }
            })
                .catch(function (err) {
                self.logger.error('fidj.sdk.service.fidjInit: ', err);
                reject(new Error(500, err.toString()));
            });
        });
    };
    ;
    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    InternalService.prototype.fidjLogin = /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    function (login, password) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjLogin');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error(404, 'Need an intialized FidjService'));
        }
        return new self.promise(function (resolve, reject) {
            self._removeAll()
                .then(function () {
                return self.connection.verifyConnectionStates();
            })
                .then(function () {
                return self._createSession(self.connection.fidjId);
            })
                .then(function () {
                return self._loginInternal(login, password);
            })
                .then(function (user) {
                self.connection.setConnection(user);
                self.session.sync(self.connection.getClientId())
                    .then(function () { return resolve(self.connection.getUser()); })
                    .catch(function (err) { return resolve(self.connection.getUser()); });
            })
                .catch(function (err) {
                self.logger.error('fidj.sdk.service.fidjLogin: ', err.toString());
                reject(err);
            });
        });
    };
    ;
    /**
     *
     * @param {?=} options
     * @return {?}
     */
    InternalService.prototype.fidjLoginInDemoMode = /**
     *
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var self = this;
        // generate one day tokens if not set
        if (!options || !options.accessToken) {
            /** @type {?} */
            var now = new Date();
            now.setDate(now.getDate() + 1);
            /** @type {?} */
            var tomorrow = now.getTime();
            /** @type {?} */
            var payload = tools.Base64.encode(JSON.stringify({
                roles: [],
                message: 'demo',
                apis: [],
                endpoints: {},
                dbs: [],
                exp: tomorrow
            }));
            /** @type {?} */
            var jwtSign = tools.Base64.encode(JSON.stringify({}));
            /** @type {?} */
            var token = jwtSign + '.' + payload + '.' + jwtSign;
            options = {
                accessToken: token,
                idToken: token,
                refreshToken: token
            };
        }
        return new self.promise(function (resolve, reject) {
            self._removeAll()
                .then(function () {
                return self._createSession(self.connection.fidjId);
            })
                .then(function () {
                self.connection.setConnectionOffline(options);
                resolve(self.connection.getUser());
            })
                .catch(function (err) {
                self.logger.error('fidj.sdk.service.fidjLogin error: ', err);
                reject(err);
            });
        });
    };
    ;
    /**
     * @param {?=} filter
     * @return {?}
     */
    InternalService.prototype.fidjGetEndpoints = /**
     * @param {?=} filter
     * @return {?}
     */
    function (filter) {
        if (!filter) {
            filter = { showBlocked: false };
        }
        /** @type {?} */
        var endpoints = JSON.parse(this.connection.getAccessPayload({ endpoints: [] })).endpoints;
        if (!endpoints) {
            return [];
        }
        endpoints = endpoints.filter(function (endpoint) {
            /** @type {?} */
            var ok = true;
            if (ok && filter.key) {
                ok = (endpoint.key === filter.key);
            }
            if (ok && !filter.showBlocked) {
                ok = !endpoint.blocked;
            }
            return ok;
        });
        return endpoints;
    };
    ;
    /**
     * @return {?}
     */
    InternalService.prototype.fidjRoles = /**
     * @return {?}
     */
    function () {
        return JSON.parse(this.connection.getIdPayload({ roles: [] })).roles;
    };
    ;
    /**
     * @return {?}
     */
    InternalService.prototype.fidjMessage = /**
     * @return {?}
     */
    function () {
        return JSON.parse(this.connection.getIdPayload({ message: '' })).message;
    };
    ;
    /**
     * @return {?}
     */
    InternalService.prototype.fidjIsLogin = /**
     * @return {?}
     */
    function () {
        return this.connection.isLogin();
    };
    ;
    /**
     * @param {?=} force
     * @return {?}
     */
    InternalService.prototype.fidjLogout = /**
     * @param {?=} force
     * @return {?}
     */
    function (force) {
        var _this = this;
        /** @type {?} */
        var self = this;
        if (!self.connection.getClient() && !force) {
            return self._removeAll()
                .then(function () {
                return _this.session.create(self.connection.fidjId, true);
            });
        }
        return self.connection.logout()
            .then(function () {
            return self._removeAll();
        })
            .catch(function () {
            return self._removeAll();
        })
            .then(function () {
            return _this.session.create(self.connection.fidjId, true);
        });
    };
    ;
    /**
     * Synchronize DB
     *
     *
     * @param {?=} fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param {?=} fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @return {?} promise
     */
    InternalService.prototype.fidjSync = /**
     * Synchronize DB
     *
     *
     * @param {?=} fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param {?=} fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @return {?} promise
     */
    function (fnInitFirstData, fnInitFirstData_Arg) {
        var _this = this;
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjSync');
        /** @type {?} */
        var firstSync = (self.session.dbLastSync === null);
        return new self.promise(function (resolve, reject) {
            self._createSession(self.connection.fidjId)
                .then(function () {
                return self.session.sync(self.connection.getClientId());
            })
                .then(function () {
                self.logger.log('fidj.sdk.service.fidjSync resolved');
                return self.session.isEmpty();
            })
                .catch(function (err) {
                self.logger.warn('fidj.sdk.service.fidjSync warn: ', err);
                return self.session.isEmpty();
            })
                .then(function (isEmpty) {
                self.logger.log('fidj.sdk.service.fidjSync isEmpty : ', isEmpty, firstSync);
                return new Promise(function (resolveEmpty, rejectEmptyNotUsed) {
                    if (isEmpty && firstSync && fnInitFirstData) {
                        /** @type {?} */
                        var ret = fnInitFirstData(fnInitFirstData_Arg);
                        if (ret && ret['catch'] instanceof Function) {
                            ret.then(resolveEmpty).catch(reject);
                        }
                        if (typeof ret === 'string') {
                            self.logger.log(ret);
                        }
                    }
                    resolveEmpty(); // self.connection.getUser());
                });
            })
                .then(function (info) {
                self.logger.log('fidj.sdk.service.fidjSync fnInitFirstData resolved: ', info);
                self.session.dbLastSync = new Date().getTime();
                return self.session.info();
            })
                .then(function (result) {
                self.session.dbRecordCount = 0;
                if (result && result.doc_count) {
                    self.session.dbRecordCount = result.doc_count;
                }
                self.logger.log('fidj.sdk.service.fidjSync _dbRecordCount : ' + self.session.dbRecordCount);
                return self.connection.refreshConnection();
            })
                .then(function (user) {
                resolve(); // self.connection.getUser()
            })
                .catch(function (err) {
                // console.error(err);
                if (err && (err.code === 403 || err.code === 410)) {
                    _this.fidjLogout()
                        .then(function () {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                    })
                        .catch(function () {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                    });
                }
                else if (err && err.code) {
                    // todo what to do with this err ?
                    resolve();
                }
                else {
                    /** @type {?} */
                    var errMessage = 'Error during syncronisation: ' + err.toString();
                    // self.logger.error(errMessage);
                    reject({ code: 500, reason: errMessage });
                }
            });
        });
    };
    ;
    /**
     * @param {?} data
     * @return {?}
     */
    InternalService.prototype.fidjPutInDb = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjPutInDb: ', data);
        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'DB put impossible. Need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, 'Need to be synchronised.'));
        }
        /** @type {?} */
        var _id;
        if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
            _id = data._id;
        }
        if (!_id) {
            _id = self._generateObjectUniqueId(self.connection.fidjId);
        }
        /** @type {?} */
        var crypto;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'encrypt'
            };
        }
        return self.session.put(data, _id, self.connection.getClientId(), self.sdk.org, self.connection.fidjVersion, crypto);
    };
    ;
    /**
     * @param {?} data_id
     * @return {?}
     */
    InternalService.prototype.fidjRemoveInDb = /**
     * @param {?} data_id
     * @return {?}
     */
    function (data_id) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjRemoveInDb ', data_id);
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, 'Need to be synchronised.'));
        }
        if (!data_id || typeof data_id !== 'string') {
            return self.promise.reject(new Error(400, 'DB remove impossible. ' +
                'Need the data._id.'));
        }
        return self.session.remove(data_id);
    };
    ;
    /**
     * @param {?} data_id
     * @return {?}
     */
    InternalService.prototype.fidjFindInDb = /**
     * @param {?} data_id
     * @return {?}
     */
    function (data_id) {
        /** @type {?} */
        var self = this;
        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'Find pb : need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, ' Need to be synchronised.'));
        }
        /** @type {?} */
        var crypto;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'decrypt'
            };
        }
        return self.session.get(data_id, crypto);
    };
    ;
    /**
     * @return {?}
     */
    InternalService.prototype.fidjFindAllInDb = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var self = this;
        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'Need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, 'Need to be synchronised.'));
        }
        /** @type {?} */
        var crypto;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'decrypt'
            };
        }
        return self.session.getAll(crypto)
            .then(function (results) {
            self.connection.setCryptoSaltAsVerified();
            return self.promise.resolve((/** @type {?} */ (results)));
        });
    };
    ;
    /**
     * @param {?} key
     * @param {?=} data
     * @return {?}
     */
    InternalService.prototype.fidjPostOnEndpoint = /**
     * @param {?} key
     * @param {?=} data
     * @return {?}
     */
    function (key, data) {
        /** @type {?} */
        var filter = {
            key: key
        };
        /** @type {?} */
        var endpoints = this.fidjGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(new Error(400, 'fidj.sdk.service.fidjPostOnEndpoint : endpoint does not exist.'));
        }
        /** @type {?} */
        var endpointUrl = endpoints[0].url;
        /** @type {?} */
        var jwt = this.connection.getIdToken();
        return new Ajax()
            .post({
            url: endpointUrl,
            // not used : withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            data: data
        });
    };
    ;
    /**
     * @return {?}
     */
    InternalService.prototype.fidjGetIdToken = /**
     * @return {?}
     */
    function () {
        return this.connection.getIdToken();
    };
    ;
    /**
     * Logout then Login
     *
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    InternalService.prototype._loginInternal = /**
     * Logout then Login
     *
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    function (login, password, updateProperties) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service._loginInternal');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error(403, 'Need an intialized FidjService'));
        }
        return new self.promise(function (resolve, reject) {
            self.connection.logout()
                .then(function () {
                return self.connection.getClient().login(login, password, updateProperties);
            })
                .catch(function (err) {
                return self.connection.getClient().login(login, password, updateProperties);
            })
                .then(function (loginUser) {
                loginUser.email = login;
                resolve(loginUser);
            })
                .catch(function (err) {
                self.logger.error('fidj.sdk.service._loginInternal error : ' + err);
                reject(err);
            });
        });
    };
    ;
    /**
     * @return {?}
     */
    InternalService.prototype._removeAll = /**
     * @return {?}
     */
    function () {
        this.connection.destroy();
        return this.session.destroy();
    };
    ;
    /**
     * @param {?} uid
     * @return {?}
     */
    InternalService.prototype._createSession = /**
     * @param {?} uid
     * @return {?}
     */
    function (uid) {
        this.session.setRemote(this.connection.getDBs({ filter: 'theBestOnes' }));
        return this.session.create(uid);
    };
    ;
    /**
     * @param {?=} a
     * @return {?}
     */
    InternalService.prototype._testPromise = /**
     * @param {?=} a
     * @return {?}
     */
    function (a) {
        if (a) {
            return this.promise.resolve('test promise ok ' + a);
        }
        return new this.promise(function (resolve, reject) {
            resolve('test promise ok');
        });
    };
    ;
    /**
     * @param {?} appName
     * @param {?=} type
     * @param {?=} name
     * @return {?}
     */
    InternalService.prototype._generateObjectUniqueId = /**
     * @param {?} appName
     * @param {?=} type
     * @param {?=} name
     * @return {?}
     */
    function (appName, type, name) {
        /** @type {?} */
        var now = new Date();
        /** @type {?} */
        var simpleDate = '' + now.getFullYear() + '' + now.getMonth() + '' + now.getDate()
            + '' + now.getHours() + '' + now.getMinutes();
        /** @type {?} */
        var sequId = ++InternalService._srvDataUniqId;
        /** @type {?} */
        var UId = '';
        if (appName && appName.charAt(0)) {
            UId += appName.charAt(0) + '';
        }
        if (type && type.length > 3) {
            UId += type.substring(0, 4);
        }
        if (name && name.length > 3) {
            UId += name.substring(0, 4);
        }
        UId += simpleDate + '' + sequId;
        return UId;
    };
    InternalService._srvDataUniqId = 0;
    return InternalService;
}());
export { InternalService };
if (false) {
    /** @type {?} */
    InternalService._srvDataUniqId;
    /** @type {?} */
    InternalService.prototype.sdk;
    /** @type {?} */
    InternalService.prototype.logger;
    /** @type {?} */
    InternalService.prototype.promise;
    /** @type {?} */
    InternalService.prototype.storage;
    /** @type {?} */
    InternalService.prototype.session;
    /** @type {?} */
    InternalService.prototype.connection;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxLQUFLLFVBQVUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFTdEMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztJQWlCcEMseUJBQVksTUFBdUIsRUFBRSxPQUEyQjtRQUU1RCxJQUFJLENBQUMsR0FBRyxHQUFHO1lBQ1AsR0FBRyxFQUFFLE1BQU07WUFDWCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsSUFBSSxFQUFFLEtBQUs7U0FDZCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLEdBQUcsRUFBRTthQUNKO1lBQ0QsS0FBSyxFQUFFO2FBQ047WUFDRCxJQUFJLEVBQUU7YUFDTDtTQUNKLENBQUM7UUFDRixJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQ3hCO2FBQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsK0JBQStCOztZQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztT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d0JhLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGltcG9ydCAqIGFzIFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0ICogYXMgdmVyc2lvbiBmcm9tICcuLi92ZXJzaW9uJztcbmltcG9ydCAqIGFzIHRvb2xzIGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgKiBhcyBzZXNzaW9uIGZyb20gJy4uL3Nlc3Npb24nO1xuaW1wb3J0IHtcbiAgICBMb2dnZXJJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgU2RrSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7U2Vzc2lvbkNyeXB0b0ludGVyZmFjZX0gZnJvbSAnLi4vc2Vzc2lvbi9zZXNzaW9uJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuLi9jb25uZWN0aW9uL2FqYXgnO1xuXG4vLyBjb25zdCBQb3VjaERCID0gd2luZG93WydQb3VjaERCJ10gfHwgcmVxdWlyZSgncG91Y2hkYicpLmRlZmF1bHQ7XG5cbi8qKlxuICogcGxlYXNlIHVzZSBpdHMgYW5ndWxhci5qcyBvciBhbmd1bGFyLmlvIHdyYXBwZXJcbiAqIHVzZWZ1bGwgb25seSBmb3IgZmlkaiBkZXYgdGVhbVxuICovXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgc2RrOiBTZGtJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlckludGVyZmFjZTtcbiAgICBwcml2YXRlIHByb21pc2U6IFByb21pc2VDb25zdHJ1Y3RvcjtcbiAgICBwcml2YXRlIHN0b3JhZ2U6IHRvb2xzLkxvY2FsU3RvcmFnZTtcbiAgICBwcml2YXRlIHNlc3Npb246IHNlc3Npb24uU2Vzc2lvbjtcbiAgICBwcml2YXRlIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24uQ29ubmVjdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlLCBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3IpIHtcblxuICAgICAgICB0aGlzLnNkayA9IHtcbiAgICAgICAgICAgIG9yZzogJ2ZpZGonLFxuICAgICAgICAgICAgdmVyc2lvbjogdmVyc2lvbi52ZXJzaW9uLFxuICAgICAgICAgICAgcHJvZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSB7XG4gICAgICAgICAgICBsb2c6ICgpID0+IHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm46ICgpID0+IHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGxvZ2dlcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmNvbnNvbGUpIHsgLy8gJiYgbG9nZ2VyID09PSB3aW5kb3cuY29uc29sZVxuICAgICAgICAgICAgdGhpcy5sb2dnZXIubG9nID0gd2luZG93LmNvbnNvbGUubG9nO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IgPSB3aW5kb3cuY29uc29sZS5lcnJvcjtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4gPSB3aW5kb3cuY29uc29sZS53YXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2dnZXI6ICcsIHRoaXMubG9nZ2VyKTtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlIDogY29uc3RydWN0b3InKTtcbiAgICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IHRvb2xzLkxvY2FsU3RvcmFnZSh3aW5kb3cubG9jYWxTdG9yYWdlLCAnZmlkai4nKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gbmV3IHNlc3Npb24uU2Vzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdGlvbi5Db25uZWN0aW9uKHRoaXMuc2RrLCB0aGlzLnN0b3JhZ2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgY29ubmVjdGlvbiAmIHNlc3Npb25cbiAgICAgKiBDaGVjayB1cmlcbiAgICAgKiBEb25lIGVhY2ggYXBwIHN0YXJ0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpJZCAgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqU2FsdCByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpWZXJzaW9uIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZGV2TW9kZSBvcHRpb25hbCBkZWZhdWx0IGZhbHNlLCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpJbml0KGZpZGpJZDogc3RyaW5nLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogJywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghZmlkaklkKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6IGJhZCBpbml0Jyk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhIGZpZGpJZCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc2RrLnByb2QgPSAhb3B0aW9ucyA/IHRydWUgOiBvcHRpb25zLnByb2Q7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpJZCA9IGZpZGpJZDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpWZXJzaW9uID0gc2VsZi5zZGsudmVyc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8gPSAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2NyeXB0bycpKSA/IHRydWUgOiBvcHRpb25zLmNyeXB0bztcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGhlQmVzdFVybDogYW55ID0gc2VsZi5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9uZSd9KVswXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RPbGRVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbGRPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzTG9naW4gPSBzZWxmLmZpZGpJc0xvZ2luKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwgJiYgdGhlQmVzdFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RVcmwgPSB0aGVCZXN0VXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlQmVzdE9sZFVybCAmJiB0aGVCZXN0T2xkVXJsLnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlQmVzdE9sZFVybCA9IHRoZUJlc3RPbGRVcmwudXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xvZ2luICYmIHRoZUJlc3RPbGRVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RPbGRVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDA0LCAnTmVlZCBvbmUgY29ubmVjdGlvbiAtIG9yIHRvbyBvbGQgU0RLIHZlcnNpb24gKGNoZWNrIHVwZGF0ZSknKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQ6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIudG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBpdCBpZiBmaWRqSXNMb2dpbigpID09PSBmYWxzZVxuICAgICAqIEVyYXNlIGFsbCAoZGIgJiBzdG9yYWdlKVxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9sb2dpbkludGVybmFsKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbih1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luOiAnLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmFjY2Vzc1Rva2VuIG9wdGlvbmFsXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaWRUb2tlbiAgb3B0aW9uYWxcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBnZW5lcmF0ZSBvbmUgZGF5IHRva2VucyBpZiBub3Qgc2V0XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIG5vdy5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93ID0gbm93LmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICByb2xlczogW10sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2RlbW8nLFxuICAgICAgICAgICAgICAgIGFwaXM6IFtdLFxuICAgICAgICAgICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgICAgICAgICAgZGJzOiBbXSxcbiAgICAgICAgICAgICAgICBleHA6IHRvbW9ycm93XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zdCBqd3RTaWduID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBqd3RTaWduICsgJy4nICsgcGF5bG9hZCArICcuJyArIGp3dFNpZ247XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICBpZFRva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbk9mZmxpbmUob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqTG9naW4gZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpHZXRFbmRwb2ludHMoZmlsdGVyPzogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UpOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghZmlsdGVyKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSB7c2hvd0Jsb2NrZWQ6IGZhbHNlfTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kcG9pbnRzID0gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0QWNjZXNzUGF5bG9hZCh7ZW5kcG9pbnRzOiBbXX0pKS5lbmRwb2ludHM7XG4gICAgICAgIGlmICghZW5kcG9pbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBlbmRwb2ludHMgPSBlbmRwb2ludHMuZmlsdGVyKChlbmRwb2ludDogRW5kcG9pbnRJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgIGxldCBvayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob2sgJiYgZmlsdGVyLmtleSkge1xuICAgICAgICAgICAgICAgIG9rID0gKGVuZHBvaW50LmtleSA9PT0gZmlsdGVyLmtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2sgJiYgIWZpbHRlci5zaG93QmxvY2tlZCkge1xuICAgICAgICAgICAgICAgIG9rID0gIWVuZHBvaW50LmJsb2NrZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2s7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJvbGVzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHtyb2xlczogW119KSkucm9sZXM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkaklzTG9naW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uaXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakxvZ291dChmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkgJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5sb2dvdXQoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YSBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhX0FyZyBhcmcgdG8gc2V0IHRvIGZuSW5pdEZpcnN0RGF0YSgpXG4gICAgICogQHJldHVybnMgIHByb21pc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhPywgZm5Jbml0Rmlyc3REYXRhX0FyZz8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jJyk7XG4gICAgICAgIC8vIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAvLyAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyA6IERCIHN5bmMgaW1wb3NzaWJsZS4gRGlkIHlvdSBsb2dpbiA/Jyk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBjb25zdCBmaXJzdFN5bmMgPSAoc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPT09IG51bGwpO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqU3luYyB3YXJuOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpc0VtcHR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBpc0VtcHR5IDogJywgaXNFbXB0eSwgZmlyc3RTeW5jKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmVFbXB0eSwgcmVqZWN0RW1wdHlOb3RVc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eSAmJiBmaXJzdFN5bmMgJiYgZm5Jbml0Rmlyc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gZm5Jbml0Rmlyc3REYXRhKGZuSW5pdEZpcnN0RGF0YV9BcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgJiYgcmV0WydjYXRjaCddIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnRoZW4ocmVzb2x2ZUVtcHR5KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUVtcHR5KCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBmbkluaXRGaXJzdERhdGEgcmVzb2x2ZWQ6ICcsIGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmluZm8oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmRvY19jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSByZXN1bHQuZG9jX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBfZGJSZWNvcmRDb3VudCA6ICcgKyBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3JJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSA0MDMgfHwgZXJyLmNvZGUgPT09IDQxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlkakxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gd2hhdCB0byBkbyB3aXRoIHRoaXMgZXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1lc3NhZ2UgPSAnRXJyb3IgZHVyaW5nIHN5bmNyb25pc2F0aW9uOiAnICsgZXJyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxmLmxvZ2dlci5lcnJvcihlcnJNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNTAwLCByZWFzb246IGVyck1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalB1dEluRGIoZGF0YTogYW55KTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQdXRJbkRiOiAnLCBkYXRhKTtcblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnREIgcHV0IGltcG9zc2libGUuIE5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF9pZDogc3RyaW5nO1xuICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoZGF0YSkuaW5kZXhPZignX2lkJykpIHtcbiAgICAgICAgICAgIF9pZCA9IGRhdGEuX2lkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX2lkKSB7XG4gICAgICAgICAgICBfaWQgPSBzZWxmLl9nZW5lcmF0ZU9iamVjdFVuaXF1ZUlkKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2VuY3J5cHQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnB1dChcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSxcbiAgICAgICAgICAgIHNlbGYuc2RrLm9yZyxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqVmVyc2lvbixcbiAgICAgICAgICAgIGNyeXB0byk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUmVtb3ZlSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpSZW1vdmVJbkRiICcsIGRhdGFfaWQpO1xuXG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGF0YV9pZCB8fCB0eXBlb2YgZGF0YV9pZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdEQiByZW1vdmUgaW1wb3NzaWJsZS4gJyArXG4gICAgICAgICAgICAgICAgJ05lZWQgdGhlIGRhdGEuX2lkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucmVtb3ZlKGRhdGFfaWQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakZpbmRJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdGaW5kIHBiIDogbmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICcgTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldChkYXRhX2lkLCBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakZpbmRBbGxJbkRiKCk6IFByb21pc2U8QXJyYXk8YW55PiB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXRBbGwoY3J5cHRvKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZXNvbHZlKChyZXN1bHRzIGFzIEFycmF5PGFueT4pKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalBvc3RPbkVuZHBvaW50KGtleTogc3RyaW5nLCBkYXRhPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXI6IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZW5kcG9pbnRzID0gdGhpcy5maWRqR2V0RW5kcG9pbnRzKGZpbHRlcik7XG4gICAgICAgIGlmICghZW5kcG9pbnRzIHx8IGVuZHBvaW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KFxuICAgICAgICAgICAgICAgIG5ldyBFcnJvcig0MDAsXG4gICAgICAgICAgICAgICAgICAgICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQb3N0T25FbmRwb2ludCA6IGVuZHBvaW50IGRvZXMgbm90IGV4aXN0LicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZHBvaW50VXJsID0gZW5kcG9pbnRzWzBdLnVybDtcbiAgICAgICAgY29uc3Qgand0ID0gdGhpcy5jb25uZWN0aW9uLmdldElkVG9rZW4oKTtcbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkIDogd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBqd3RcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIC8vIEludGVybmFsIGZ1bmN0aW9uc1xuXG4gICAgLyoqXG4gICAgICogTG9nb3V0IHRoZW4gTG9naW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEBwYXJhbSB1cGRhdGVQcm9wZXJ0aWVzXG4gICAgICovXG4gICAgcHJpdmF0ZSBfbG9naW5JbnRlcm5hbChsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMywgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5sb2dvdXQoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGxvZ2luVXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpblVzZXIuZW1haWwgPSBsb2dpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobG9naW5Vc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5fbG9naW5JbnRlcm5hbCBlcnJvciA6ICcgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgX3JlbW92ZUFsbCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZGVzdHJveSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmRlc3Ryb3koKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfY3JlYXRlU2Vzc2lvbih1aWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zZXRSZW1vdGUodGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSkpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZSh1aWQpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF90ZXN0UHJvbWlzZShhPyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlc29sdmUoJ3Rlc3QgcHJvbWlzZSBvayAnICsgYSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBfc3J2RGF0YVVuaXFJZCA9IDA7XG5cbiAgICBwcml2YXRlIF9nZW5lcmF0ZU9iamVjdFVuaXF1ZUlkKGFwcE5hbWUsIHR5cGU/LCBuYW1lPykge1xuXG4gICAgICAgIC8vIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBzaW1wbGVEYXRlID0gJycgKyBub3cuZ2V0RnVsbFllYXIoKSArICcnICsgbm93LmdldE1vbnRoKCkgKyAnJyArIG5vdy5nZXREYXRlKClcbiAgICAgICAgICAgICsgJycgKyBub3cuZ2V0SG91cnMoKSArICcnICsgbm93LmdldE1pbnV0ZXMoKTsgLy8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICBjb25zdCBzZXF1SWQgPSArK0ludGVybmFsU2VydmljZS5fc3J2RGF0YVVuaXFJZDtcbiAgICAgICAgbGV0IFVJZCA9ICcnO1xuICAgICAgICBpZiAoYXBwTmFtZSAmJiBhcHBOYW1lLmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgVUlkICs9IGFwcE5hbWUuY2hhckF0KDApICsgJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgJiYgdHlwZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBVSWQgKz0gdHlwZS5zdWJzdHJpbmcoMCwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUgJiYgbmFtZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBVSWQgKz0gbmFtZS5zdWJzdHJpbmcoMCwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgVUlkICs9IHNpbXBsZURhdGUgKyAnJyArIHNlcXVJZDtcbiAgICAgICAgcmV0dXJuIFVJZDtcbiAgICB9XG5cbn1cbiJdfQ==