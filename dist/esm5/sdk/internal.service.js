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
        if (logger && window.console && logger === window.console) {
            this.logger.error = window.console.error;
            this.logger.warn = window.console.warn;
        }
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
     * @return {?}
     */
    InternalService.prototype.fidjLogout = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var self = this;
        if (!self.connection.getClient()) {
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
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error(401, 'DB put impossible. Need a user logged in.'));
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
            return self.promise.reject(new Error(401, 'DB remove impossible. ' +
                'Need a user logged in.'));
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
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error(401, 'fidj.sdk.service.fidjFindInDb : need a user logged in.'));
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
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error(401, 'Need a user logged in.'));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxLQUFLLFVBQVUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFTdEMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztJQWlCcEMseUJBQVksTUFBdUIsRUFBRSxPQUEyQjtRQUU1RCxJQUFJLENBQUMsR0FBRyxHQUFHO1lBQ1AsR0FBRyxFQUFFLE1BQU07WUFDWCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsSUFBSSxFQUFFLEtBQUs7U0FDZCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLEdBQUcsRUFBRTthQUNKO1lBQ0QsS0FBSyxFQUFFO2FBQ047WUFDRCxJQUFJLEVBQUU7YUFDTDtTQUNKLENBQUM7UUFDRixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQzFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNsRCxJQUFJLE9BQU8sRUFBRTtZQUNULElBQUksQ0FBQyxPQUFPLEdB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LElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDOUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekIsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekIsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsR0FBRyxJQUFJLFVBQVUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxDQUFDOztxQ0FwQmlCLENBQUM7MEJBN2dCckM7O1NBd0JhLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGltcG9ydCAqIGFzIFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0ICogYXMgdmVyc2lvbiBmcm9tICcuLi92ZXJzaW9uJztcbmltcG9ydCAqIGFzIHRvb2xzIGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgKiBhcyBzZXNzaW9uIGZyb20gJy4uL3Nlc3Npb24nO1xuaW1wb3J0IHtcbiAgICBMb2dnZXJJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgU2RrSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7U2Vzc2lvbkNyeXB0b0ludGVyZmFjZX0gZnJvbSAnLi4vc2Vzc2lvbi9zZXNzaW9uJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuLi9jb25uZWN0aW9uL2FqYXgnO1xuXG4vLyBjb25zdCBQb3VjaERCID0gd2luZG93WydQb3VjaERCJ10gfHwgcmVxdWlyZSgncG91Y2hkYicpLmRlZmF1bHQ7XG5cbi8qKlxuICogcGxlYXNlIHVzZSBpdHMgYW5ndWxhci5qcyBvciBhbmd1bGFyLmlvIHdyYXBwZXJcbiAqIHVzZWZ1bGwgb25seSBmb3IgZmlkaiBkZXYgdGVhbVxuICovXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgc2RrOiBTZGtJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlckludGVyZmFjZTtcbiAgICBwcml2YXRlIHByb21pc2U6IFByb21pc2VDb25zdHJ1Y3RvcjtcbiAgICBwcml2YXRlIHN0b3JhZ2U6IHRvb2xzLkxvY2FsU3RvcmFnZTtcbiAgICBwcml2YXRlIHNlc3Npb246IHNlc3Npb24uU2Vzc2lvbjtcbiAgICBwcml2YXRlIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24uQ29ubmVjdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlLCBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3IpIHtcblxuICAgICAgICB0aGlzLnNkayA9IHtcbiAgICAgICAgICAgIG9yZzogJ2ZpZGonLFxuICAgICAgICAgICAgdmVyc2lvbjogdmVyc2lvbi52ZXJzaW9uLFxuICAgICAgICAgICAgcHJvZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSB7XG4gICAgICAgICAgICBsb2c6ICgpID0+IHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm46ICgpID0+IHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGxvZ2dlciAmJiB3aW5kb3cuY29uc29sZSAmJiBsb2dnZXIgPT09IHdpbmRvdy5jb25zb2xlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvciA9IHdpbmRvdy5jb25zb2xlLmVycm9yO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybiA9IHdpbmRvdy5jb25zb2xlLndhcm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlIDogY29uc3RydWN0b3InKTtcbiAgICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IHRvb2xzLkxvY2FsU3RvcmFnZSh3aW5kb3cubG9jYWxTdG9yYWdlLCAnZmlkai4nKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gbmV3IHNlc3Npb24uU2Vzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdGlvbi5Db25uZWN0aW9uKHRoaXMuc2RrLCB0aGlzLnN0b3JhZ2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgY29ubmVjdGlvbiAmIHNlc3Npb25cbiAgICAgKiBDaGVjayB1cmlcbiAgICAgKiBEb25lIGVhY2ggYXBwIHN0YXJ0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpJZCAgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqU2FsdCByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpWZXJzaW9uIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZGV2TW9kZSBvcHRpb25hbCBkZWZhdWx0IGZhbHNlLCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpJbml0KGZpZGpJZDogc3RyaW5nLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogJywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghZmlkaklkKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6IGJhZCBpbml0Jyk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhIGZpZGpJZCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc2RrLnByb2QgPSAhb3B0aW9ucyA/IHRydWUgOiBvcHRpb25zLnByb2Q7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpJZCA9IGZpZGpJZDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpWZXJzaW9uID0gc2VsZi5zZGsudmVyc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8gPSAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2NyeXB0bycpKSA/IHRydWUgOiBvcHRpb25zLmNyeXB0bztcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGhlQmVzdFVybDogYW55ID0gc2VsZi5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9uZSd9KVswXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RPbGRVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbGRPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzTG9naW4gPSBzZWxmLmZpZGpJc0xvZ2luKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwgJiYgdGhlQmVzdFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RVcmwgPSB0aGVCZXN0VXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlQmVzdE9sZFVybCAmJiB0aGVCZXN0T2xkVXJsLnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlQmVzdE9sZFVybCA9IHRoZUJlc3RPbGRVcmwudXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xvZ2luICYmIHRoZUJlc3RPbGRVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RPbGRVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDA0LCAnTmVlZCBvbmUgY29ubmVjdGlvbiAtIG9yIHRvbyBvbGQgU0RLIHZlcnNpb24gKGNoZWNrIHVwZGF0ZSknKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQ6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIudG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBpdCBpZiBmaWRqSXNMb2dpbigpID09PSBmYWxzZVxuICAgICAqIEVyYXNlIGFsbCAoZGIgJiBzdG9yYWdlKVxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9sb2dpbkludGVybmFsKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbih1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luOiAnLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmFjY2Vzc1Rva2VuIG9wdGlvbmFsXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaWRUb2tlbiAgb3B0aW9uYWxcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBnZW5lcmF0ZSBvbmUgZGF5IHRva2VucyBpZiBub3Qgc2V0XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIG5vdy5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93ID0gbm93LmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICByb2xlczogW10sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2RlbW8nLFxuICAgICAgICAgICAgICAgIGFwaXM6IFtdLFxuICAgICAgICAgICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgICAgICAgICAgZGJzOiBbXSxcbiAgICAgICAgICAgICAgICBleHA6IHRvbW9ycm93XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zdCBqd3RTaWduID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBqd3RTaWduICsgJy4nICsgcGF5bG9hZCArICcuJyArIGp3dFNpZ247XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICBpZFRva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbk9mZmxpbmUob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqTG9naW4gZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpHZXRFbmRwb2ludHMoZmlsdGVyPzogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UpOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghZmlsdGVyKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSB7c2hvd0Jsb2NrZWQ6IGZhbHNlfTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kcG9pbnRzID0gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0QWNjZXNzUGF5bG9hZCh7ZW5kcG9pbnRzOiBbXX0pKS5lbmRwb2ludHM7XG4gICAgICAgIGlmICghZW5kcG9pbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBlbmRwb2ludHMgPSBlbmRwb2ludHMuZmlsdGVyKChlbmRwb2ludDogRW5kcG9pbnRJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgIGxldCBvayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob2sgJiYgZmlsdGVyLmtleSkge1xuICAgICAgICAgICAgICAgIG9rID0gKGVuZHBvaW50LmtleSA9PT0gZmlsdGVyLmtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2sgJiYgIWZpbHRlci5zaG93QmxvY2tlZCkge1xuICAgICAgICAgICAgICAgIG9rID0gIWVuZHBvaW50LmJsb2NrZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2s7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJvbGVzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHtyb2xlczogW119KSkucm9sZXM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkaklzTG9naW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uaXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakxvZ291dCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGFfQXJnIGFyZyB0byBzZXQgdG8gZm5Jbml0Rmlyc3REYXRhKClcbiAgICAgKiBAcmV0dXJucyAgcHJvbWlzZVxuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqU3luYyhmbkluaXRGaXJzdERhdGE/LCBmbkluaXRGaXJzdERhdGFfQXJnPyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMnKTtcbiAgICAgICAgLy8gaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIDogREIgc3luYyBpbXBvc3NpYmxlLiBEaWQgeW91IGxvZ2luID8nKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IGZpcnN0U3luYyA9IChzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9PT0gbnVsbCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgcmVzb2x2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHdhcm46ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGlzRW1wdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIGlzRW1wdHkgOiAnLCBpc0VtcHR5LCBmaXJzdFN5bmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZUVtcHR5LCByZWplY3RFbXB0eU5vdFVzZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5ICYmIGZpcnN0U3luYyAmJiBmbkluaXRGaXJzdERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBmbkluaXRGaXJzdERhdGEoZm5Jbml0Rmlyc3REYXRhX0FyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAmJiByZXRbJ2NhdGNoJ10gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQudGhlbihyZXNvbHZlRW1wdHkpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2cocmV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlRW1wdHkoKTsgLy8gc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIGZuSW5pdEZpcnN0RGF0YSByZXNvbHZlZDogJywgaW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaW5mbygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuZG9jX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IHJlc3VsdC5kb2NfY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIF9kYlJlY29yZENvdW50IDogJyArIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBFcnJvckludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09IDQwMyB8fCBlcnIuY29kZSA9PT0gNDEwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWRqTG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246ICdTeW5jaHJvbml6YXRpb24gdW5hdXRob3JpemVkIDogbmVlZCB0byBsb2dpbiBhZ2Fpbi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyciAmJiBlcnIuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyB3aGF0IHRvIGRvIHdpdGggdGhpcyBlcnIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyTWVzc2FnZSA9ICdFcnJvciBkdXJpbmcgc3luY3JvbmlzYXRpb246ICcgKyBlcnIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbGYubG9nZ2VyLmVycm9yKGVyck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA1MDAsIHJlYXNvbjogZXJyTWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUHV0SW5EYihkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalB1dEluRGI6ICcsIGRhdGEpO1xuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkgfHwgIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdEQiBwdXQgaW1wb3NzaWJsZS4gTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfaWQ6IHN0cmluZztcbiAgICAgICAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2YoJ19pZCcpKSB7XG4gICAgICAgICAgICBfaWQgPSBkYXRhLl9pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV9pZCkge1xuICAgICAgICAgICAgX2lkID0gc2VsZi5fZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdlbmNyeXB0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5wdXQoXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCksXG4gICAgICAgICAgICBzZWxmLnNkay5vcmcsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24sXG4gICAgICAgICAgICBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJlbW92ZUluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUmVtb3ZlSW5EYiAnLCBkYXRhX2lkKTtcblxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdEQiByZW1vdmUgaW1wb3NzaWJsZS4gJyArXG4gICAgICAgICAgICAgICAgJ05lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGFfaWQgfHwgdHlwZW9mIGRhdGFfaWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnREIgcmVtb3ZlIGltcG9zc2libGUuICcgK1xuICAgICAgICAgICAgICAgICdOZWVkIHRoZSBkYXRhLl9pZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnJlbW92ZShkYXRhX2lkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpIHx8ICFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnZmlkai5zZGsuc2VydmljZS5maWRqRmluZEluRGIgOiBuZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldChkYXRhX2lkLCBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakZpbmRBbGxJbkRiKCk6IFByb21pc2U8QXJyYXk8YW55PiB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkgfHwgIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldEFsbChjcnlwdG8pXG4gICAgICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlc29sdmUoKHJlc3VsdHMgYXMgQXJyYXk8YW55PikpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUG9zdE9uRW5kcG9pbnQoa2V5OiBzdHJpbmcsIGRhdGE/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IGZpbHRlcjogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UgPSB7XG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlbmRwb2ludHMgPSB0aGlzLmZpZGpHZXRFbmRwb2ludHMoZmlsdGVyKTtcbiAgICAgICAgaWYgKCFlbmRwb2ludHMgfHwgZW5kcG9pbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgICAgICAgbmV3IEVycm9yKDQwMCxcbiAgICAgICAgICAgICAgICAgICAgJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalBvc3RPbkVuZHBvaW50IDogZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5kcG9pbnRVcmwgPSBlbmRwb2ludHNbMF0udXJsO1xuICAgICAgICBjb25zdCBqd3QgPSB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRVcmwsXG4gICAgICAgICAgICAgICAgLy8gbm90IHVzZWQgOiB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqR2V0SWRUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWwgZnVuY3Rpb25zXG5cbiAgICAvKipcbiAgICAgKiBMb2dvdXQgdGhlbiBMb2dpblxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHBhcmFtIHVwZGF0ZVByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIF9sb2dpbkludGVybmFsKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuX2xvZ2luSW50ZXJuYWwnKTtcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAzLCAnTmVlZCBhbiBpbnRpYWxpemVkIEZpZGpTZXJ2aWNlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4obG9naW5Vc2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luVXNlci5lbWFpbCA9IGxvZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShsb2dpblVzZXIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsIGVycm9yIDogJyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBfcmVtb3ZlQWxsKCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF9jcmVhdGVTZXNzaW9uKHVpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgdGhpcy5zZXNzaW9uLnNldFJlbW90ZSh0aGlzLmNvbm5lY3Rpb24uZ2V0REJzKHtmaWx0ZXI6ICd0aGVCZXN0T25lcyd9KSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHVpZCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgX3Rlc3RQcm9taXNlKGE/KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rICcgKyBhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2snKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9zcnZEYXRhVW5pcUlkID0gMDtcblxuICAgIHByaXZhdGUgX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoYXBwTmFtZSwgdHlwZT8sIG5hbWU/KSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHNpbXBsZURhdGUgPSAnJyArIG5vdy5nZXRGdWxsWWVhcigpICsgJycgKyBub3cuZ2V0TW9udGgoKSArICcnICsgbm93LmdldERhdGUoKVxuICAgICAgICAgICAgKyAnJyArIG5vdy5nZXRIb3VycygpICsgJycgKyBub3cuZ2V0TWludXRlcygpOyAvLyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHNlcXVJZCA9ICsrSW50ZXJuYWxTZXJ2aWNlLl9zcnZEYXRhVW5pcUlkO1xuICAgICAgICBsZXQgVUlkID0gJyc7XG4gICAgICAgIGlmIChhcHBOYW1lICYmIGFwcE5hbWUuY2hhckF0KDApKSB7XG4gICAgICAgICAgICBVSWQgKz0gYXBwTmFtZS5jaGFyQXQoMCkgKyAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSB0eXBlLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSBuYW1lLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBVSWQgKz0gc2ltcGxlRGF0ZSArICcnICsgc2VxdUlkO1xuICAgICAgICByZXR1cm4gVUlkO1xuICAgIH1cblxufVxuIl19