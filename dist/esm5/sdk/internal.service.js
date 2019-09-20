// import PouchDB from 'pouchdb';
// import * as PouchDB from 'pouchdb/dist/pouchdb.js';
// import PouchDB from 'pouchdb/dist/pouchdb.js';
import * as version from '../version';
import * as tools from '../tools';
import * as connection from '../connection';
import * as session from '../session';
import { Error } from './error';
import { Ajax } from '../connection/ajax';
import { LoggerService } from './logger.service';
// import {LocalStorage} from 'node-localstorage';
// import 'localstorage-polyfill/localStorage';
// const PouchDB = window['PouchDB'] || require('pouchdb').default;
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
        if (promise) {
            this.promise = promise;
        }
        if (logger) {
            this.logger = logger;
        }
        else {
            this.logger = new LoggerService();
        }
        this.logger.log('fidj.sdk.service : constructor');
        var ls;
        if (typeof window !== 'undefined') {
            ls = window.localStorage;
        }
        else if (typeof global !== 'undefined') {
            require('localstorage-polyfill');
            ls = global['localStorage'];
        }
        this.storage = new tools.LocalStorage(ls, 'fidj.');
        this.session = new session.Session();
        this.connection = new connection.Connection(this.sdk, this.storage, this.logger);
    }
    /**
     * Init connection & session
     * Check uri
     * Done each app start
     *
     * @param options Optional settings
     * @param options.fidjId  required use your customized endpoints
     * @param options.fidjSalt required use your customized endpoints
     * @param options.fidjVersion required use your customized endpoints
     * @param options.devMode optional default false, use your customized endpoints
     * @returns
     */
    InternalService.prototype.fidjInit = function (fidjId, options) {
        var self = this;
        /*
        if (options && options.forcedEndpoint) {
            this.fidjService.setAuthEndpoint(options.forcedEndpoint);
        }
        if (options && options.forcedDBEndpoint) {
            this.fidjService.setDBEndpoint(options.forcedDBEndpoint);
        }*/
        if (options && options.logLevel) {
            self.logger.setLevel(options.logLevel);
        }
        self.logger.log('fidj.sdk.service.fidjInit : ', options);
        if (!fidjId) {
            self.logger.error('fidj.sdk.service.fidjInit : bad init');
            return self.promise.reject(new Error(400, 'Need a fidjId'));
        }
        self.sdk.prod = !options ? true : options.prod;
        self.connection.fidjId = fidjId;
        self.connection.fidjVersion = self.sdk.version;
        self.connection.fidjCrypto = (!options || !options.hasOwnProperty('crypto')) ? true : options.crypto;
        return new self.promise(function (resolve, reject) {
            self.connection.verifyConnectionStates()
                .then(function () {
                var theBestUrl = self.connection.getApiEndpoints({ filter: 'theBestOne' })[0];
                var theBestOldUrl = self.connection.getApiEndpoints({ filter: 'theBestOldOne' })[0];
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
     * @param login
     * @param password
     * @returns
     */
    InternalService.prototype.fidjLogin = function (login, password) {
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
     * @param options
     * @param options.accessToken optional
     * @param options.idToken  optional
     * @returns
     */
    InternalService.prototype.fidjLoginInDemoMode = function (options) {
        var self = this;
        // generate one day tokens if not set
        if (!options || !options.accessToken) {
            var now = new Date();
            now.setDate(now.getDate() + 1);
            var tomorrow = now.getTime();
            var payload = tools.Base64.encode(JSON.stringify({
                roles: [],
                message: 'demo',
                apis: [],
                endpoints: [],
                dbs: [],
                exp: tomorrow
            }));
            var jwtSign = tools.Base64.encode(JSON.stringify({}));
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
                self.logger.error('fidj.sdk.service.fidjLoginInDemoMode error: ', err);
                reject(err);
            });
        });
    };
    ;
    InternalService.prototype.fidjGetEndpoints = function (filter) {
        if (!filter) {
            filter = { showBlocked: false };
        }
        var ap = this.connection.getAccessPayload({ endpoints: [] });
        var endpoints = JSON.parse(ap).endpoints;
        if (!endpoints || !Array.isArray(endpoints)) {
            return [];
        }
        endpoints = endpoints.filter(function (endpoint) {
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
    InternalService.prototype.fidjRoles = function () {
        return JSON.parse(this.connection.getIdPayload({ roles: [] })).roles;
    };
    ;
    InternalService.prototype.fidjMessage = function () {
        return JSON.parse(this.connection.getIdPayload({ message: '' })).message;
    };
    ;
    InternalService.prototype.fidjIsLogin = function () {
        return this.connection.isLogin();
    };
    ;
    InternalService.prototype.fidjLogout = function (force) {
        var _this = this;
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
     * @param fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @returns  promise
     */
    InternalService.prototype.fidjSync = function (fnInitFirstData, fnInitFirstData_Arg) {
        var _this = this;
        var self = this;
        self.logger.log('fidj.sdk.service.fidjSync');
        // if (!self.session.isReady()) {
        //    return self.promise.reject('fidj.sdk.service.fidjSync : DB sync impossible. Did you login ?');
        // }
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
                return new self.promise(function (resolveEmpty, rejectEmptyNotUsed) {
                    if (isEmpty && firstSync && fnInitFirstData) {
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
                self.logger.log('fidj.sdk.service.fidjSync refreshConnection done : ', user);
                resolve(); // self.connection.getUser()
            })
                .catch(function (err) {
                // console.error(err);
                self.logger.warn('fidj.sdk.service.fidjSync refreshConnection failed : ', err);
                if (err && (err.code === 403 || err.code === 410)) {
                    _this.fidjLogout()
                        .then(function () {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                    })
                        .catch(function () {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again..' });
                    });
                }
                else if (err && err.code) {
                    // todo what to do with this err ?
                    resolve();
                }
                else {
                    var errMessage = 'Error during synchronisation: ' + err.toString();
                    self.logger.error(errMessage);
                    reject({ code: 500, reason: errMessage });
                }
            });
        });
    };
    ;
    InternalService.prototype.fidjPutInDb = function (data) {
        var self = this;
        self.logger.log('fidj.sdk.service.fidjPutInDb: ', data);
        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'DB put impossible. Need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, 'Need to be synchronised.'));
        }
        var _id;
        if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
            _id = data._id;
        }
        if (!_id) {
            _id = self._generateObjectUniqueId(self.connection.fidjId);
        }
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
    InternalService.prototype.fidjRemoveInDb = function (data_id) {
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
    InternalService.prototype.fidjFindInDb = function (data_id) {
        var self = this;
        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'Find pb : need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, ' Need to be synchronised.'));
        }
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
    InternalService.prototype.fidjFindAllInDb = function () {
        var self = this;
        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'Need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, 'Need to be synchronised.'));
        }
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
            return self.promise.resolve(results);
        });
    };
    ;
    InternalService.prototype.fidjPostOnEndpoint = function (key, data) {
        var filter = {
            key: key
        };
        var endpoints = this.fidjGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(new Error(400, 'fidj.sdk.service.fidjPostOnEndpoint : endpoint does not exist.'));
        }
        var endpointUrl = endpoints[0].url;
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
    InternalService.prototype.fidjGetIdToken = function () {
        return this.connection.getIdToken();
    };
    ;
    // Internal functions
    /**
     * Logout then Login
     *
     * @param login
     * @param password
     * @param updateProperties
     */
    InternalService.prototype._loginInternal = function (login, password, updateProperties) {
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
    InternalService.prototype._removeAll = function () {
        this.connection.destroy();
        return this.session.destroy();
    };
    ;
    InternalService.prototype._createSession = function (uid) {
        var dbs = this.connection.getDBs({ filter: 'theBestOnes' });
        if (!dbs || dbs.length === 0) {
            this.logger.warn('Seems that you are in demo mode, no remote DB.');
        }
        this.session.setRemote(dbs);
        return this.session.create(uid);
    };
    ;
    InternalService.prototype._testPromise = function (a) {
        if (a) {
            return this.promise.resolve('test promise ok ' + a);
        }
        return new this.promise(function (resolve, reject) {
            resolve('test promise ok');
        });
    };
    ;
    InternalService.prototype._generateObjectUniqueId = function (appName, type, name) {
        // return null;
        var now = new Date();
        var simpleDate = '' + now.getFullYear() + '' + now.getMonth() + '' + now.getDate()
            + '' + now.getHours() + '' + now.getMinutes(); // new Date().toISOString();
        var sequId = ++InternalService._srvDataUniqId;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQ0FBaUM7QUFDakMsc0RBQXNEO0FBQ3RELGlEQUFpRDtBQUNqRCxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEtBQUssVUFBVSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQVN0QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDL0Msa0RBQWtEO0FBQ2xELCtDQUErQztBQUUvQyxtRUFBbUU7QUFFbkU7OztHQUdHO0FBQ0g7SUFTSSx5QkFBWSxNQUF1QixFQUFFLE9BQTJCO1FBRTVELElBQUksQ0FBQyxHQUFHLEdBQUc7WUFDUCxHQUFHLEVBQUUsTUFBTTtZQUNYLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixJQUFJLEVBQUUsS0FBSztTQUNkLENBQUM7UUFDRixJQUFJLE9BQU8sRUFBRTtZQUNULElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxNQUFNLEVBQUU7WUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUN4QjthQUFNO1lBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNsRCxJQUFJLEVBQUUsQ0FBQztRQUNQLElBQUksT0FBTyxNQUFN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LElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMvQjtRQUNELEdBQUcsSUFBSSxVQUFVLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUNoQyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFyQmMsOEJBQWMsR0FBRyxDQUFDLENBQUM7SUF1QnRDLHNCQUFDO0NBQUEsQUF0aUJELElBc2lCQztTQXRpQlksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGInO1xuLy8gaW1wb3J0ICogYXMgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG4vLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG5pbXBvcnQgKiBhcyB2ZXJzaW9uIGZyb20gJy4uL3ZlcnNpb24nO1xuaW1wb3J0ICogYXMgdG9vbHMgZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0ICogYXMgY29ubmVjdGlvbiBmcm9tICcuLi9jb25uZWN0aW9uJztcbmltcG9ydCAqIGFzIHNlc3Npb24gZnJvbSAnLi4vc2Vzc2lvbic7XG5pbXBvcnQge1xuICAgIExvZ2dlckludGVyZmFjZSxcbiAgICBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSxcbiAgICBTZGtJbnRlcmZhY2UsXG4gICAgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlLCBFbmRwb2ludEZpbHRlckludGVyZmFjZVxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlfSBmcm9tICcuLi9zZXNzaW9uL3Nlc3Npb24nO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge0FqYXh9IGZyb20gJy4uL2Nvbm5lY3Rpb24vYWpheCc7XG5pbXBvcnQge0xvZ2dlclNlcnZpY2V9IGZyb20gJy4vbG9nZ2VyLnNlcnZpY2UnO1xuLy8gaW1wb3J0IHtMb2NhbFN0b3JhZ2V9IGZyb20gJ25vZGUtbG9jYWxzdG9yYWdlJztcbi8vIGltcG9ydCAnbG9jYWxzdG9yYWdlLXBvbHlmaWxsL2xvY2FsU3RvcmFnZSc7XG5cbi8vIGNvbnN0IFBvdWNoREIgPSB3aW5kb3dbJ1BvdWNoREInXSB8fCByZXF1aXJlKCdwb3VjaGRiJykuZGVmYXVsdDtcblxuLyoqXG4gKiBwbGVhc2UgdXNlIGl0cyBhbmd1bGFyLmpzIG9yIGFuZ3VsYXIuaW8gd3JhcHBlclxuICogdXNlZnVsbCBvbmx5IGZvciBmaWRqIGRldiB0ZWFtXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbFNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBzZGs6IFNka0ludGVyZmFjZTtcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yO1xuICAgIHByaXZhdGUgc3RvcmFnZTogdG9vbHMuTG9jYWxTdG9yYWdlO1xuICAgIHByaXZhdGUgc2Vzc2lvbjogc2Vzc2lvbi5TZXNzaW9uO1xuICAgIHByaXZhdGUgY29ubmVjdGlvbjogY29ubmVjdGlvbi5Db25uZWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2UsIHByb21pc2U6IFByb21pc2VDb25zdHJ1Y3Rvcikge1xuXG4gICAgICAgIHRoaXMuc2RrID0ge1xuICAgICAgICAgICAgb3JnOiAnZmlkaicsXG4gICAgICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uLnZlcnNpb24sXG4gICAgICAgICAgICBwcm9kOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9nZ2VyKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UgOiBjb25zdHJ1Y3RvcicpO1xuICAgICAgICBsZXQgbHM7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXF1aXJlKCdsb2NhbHN0b3JhZ2UtcG9seWZpbGwnKTtcbiAgICAgICAgICAgIGxzID0gZ2xvYmFsWydsb2NhbFN0b3JhZ2UnXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgdG9vbHMuTG9jYWxTdG9yYWdlKGxzLCAnZmlkai4nKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gbmV3IHNlc3Npb24uU2Vzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdGlvbi5Db25uZWN0aW9uKHRoaXMuc2RrLCB0aGlzLnN0b3JhZ2UsIHRoaXMubG9nZ2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IGNvbm5lY3Rpb24gJiBzZXNzaW9uXG4gICAgICogQ2hlY2sgdXJpXG4gICAgICogRG9uZSBlYWNoIGFwcCBzdGFydFxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqSWQgIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalNhbHQgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqVmVyc2lvbiByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmRldk1vZGUgb3B0aW9uYWwgZGVmYXVsdCBmYWxzZSwgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqSW5pdChmaWRqSWQ6IHN0cmluZywgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8qXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0QXV0aEVuZHBvaW50KG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXREQkVuZHBvaW50KG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCk7XG4gICAgICAgIH0qL1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxvZ0xldmVsKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5zZXRMZXZlbChvcHRpb25zLmxvZ0xldmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6ICcsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoIWZpZGpJZCkge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgOiBiYWQgaW5pdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgYSBmaWRqSWQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnNkay5wcm9kID0gIW9wdGlvbnMgPyB0cnVlIDogb3B0aW9ucy5wcm9kO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkaklkID0gZmlkaklkO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24gPSBzZWxmLnNkay52ZXJzaW9uO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0byA9ICghb3B0aW9ucyB8fCAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY3J5cHRvJykpID8gdHJ1ZSA6IG9wdGlvbnMuY3J5cHRvO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGVCZXN0T2xkVXJsOiBhbnkgPSBzZWxmLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T2xkT25lJ30pWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xvZ2luID0gc2VsZi5maWRqSXNMb2dpbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsICYmIHRoZUJlc3RVcmwudXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVCZXN0VXJsID0gdGhlQmVzdFVybC51cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RPbGRVcmwgJiYgdGhlQmVzdE9sZFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RPbGRVcmwgPSB0aGVCZXN0T2xkVXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0VXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNMb2dpbiAmJiB0aGVCZXN0T2xkVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0T2xkVXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgb25lIGNvbm5lY3Rpb24gLSBvciB0b28gb2xkIFNESyB2ZXJzaW9uIChjaGVjayB1cGRhdGUpJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0OiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGwgaXQgaWYgZmlkaklzTG9naW4oKSA9PT0gZmFsc2VcbiAgICAgKiBFcmFzZSBhbGwgKGRiICYgc3RvcmFnZSlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpMb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbicpO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDQsICdOZWVkIGFuIGludGlhbGl6ZWQgRmlkalNlcnZpY2UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fbG9naW5JbnRlcm5hbChsb2dpbiwgcGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb24odXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbjogJywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hY2Nlc3NUb2tlbiBvcHRpb25hbFxuICAgICAqIEBwYXJhbSBvcHRpb25zLmlkVG9rZW4gIG9wdGlvbmFsXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gZ2VuZXJhdGUgb25lIGRheSB0b2tlbnMgaWYgbm90IHNldFxuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBub3cuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpICsgMSk7XG4gICAgICAgICAgICBjb25zdCB0b21vcnJvdyA9IG5vdy5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgcm9sZXM6IFtdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdkZW1vJyxcbiAgICAgICAgICAgICAgICBhcGlzOiBbXSxcbiAgICAgICAgICAgICAgICBlbmRwb2ludHM6IFtdLFxuICAgICAgICAgICAgICAgIGRiczogW10sXG4gICAgICAgICAgICAgICAgZXhwOiB0b21vcnJvd1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc3Qgand0U2lnbiA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gand0U2lnbiArICcuJyArIHBheWxvYWQgKyAnLicgKyBqd3RTaWduO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgaWRUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luSW5EZW1vTW9kZSBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakdldEVuZHBvaW50cyhmaWx0ZXI/OiBFbmRwb2ludEZpbHRlckludGVyZmFjZSk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCFmaWx0ZXIpIHtcbiAgICAgICAgICAgIGZpbHRlciA9IHtzaG93QmxvY2tlZDogZmFsc2V9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFwID0gdGhpcy5jb25uZWN0aW9uLmdldEFjY2Vzc1BheWxvYWQoe2VuZHBvaW50czogW119KTtcbiAgICAgICAgbGV0IGVuZHBvaW50cyA9IEpTT04ucGFyc2UoYXApLmVuZHBvaW50cztcbiAgICAgICAgaWYgKCFlbmRwb2ludHMgfHwgIUFycmF5LmlzQXJyYXkoZW5kcG9pbnRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5kcG9pbnRzID0gZW5kcG9pbnRzLmZpbHRlcigoZW5kcG9pbnQ6IEVuZHBvaW50SW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2sgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9rICYmIGZpbHRlci5rZXkpIHtcbiAgICAgICAgICAgICAgICBvayA9IChlbmRwb2ludC5rZXkgPT09IGZpbHRlci5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9rICYmICFmaWx0ZXIuc2hvd0Jsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBvayA9ICFlbmRwb2ludC5ibG9ja2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50cztcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkak1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpJc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmlzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpMb2dvdXQoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ubG9nb3V0KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplIERCXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgYSBmdW5jdGlvbiB3aXRoIGRiIGFzIGlucHV0IGFuZCB0aGF0IHJldHVybiBwcm9taXNlOiBjYWxsIGlmIERCIGlzIGVtcHR5XG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YV9BcmcgYXJnIHRvIHNldCB0byBmbkluaXRGaXJzdERhdGEoKVxuICAgICAqIEByZXR1cm5zICBwcm9taXNlXG4gICAgICovXG4gICAgcHVibGljIGZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YT8sIGZuSW5pdEZpcnN0RGF0YV9Bcmc/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYycpO1xuICAgICAgICAvLyBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgOiBEQiBzeW5jIGltcG9zc2libGUuIERpZCB5b3UgbG9naW4gPycpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgY29uc3QgZmlyc3RTeW5jID0gKHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID09PSBudWxsKTtcblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uc3luYyhzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLndhcm4oJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgd2FybjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaXNFbXB0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgaXNFbXB0eSA6ICcsIGlzRW1wdHksIGZpcnN0U3luYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmVFbXB0eSwgcmVqZWN0RW1wdHlOb3RVc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eSAmJiBmaXJzdFN5bmMgJiYgZm5Jbml0Rmlyc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gZm5Jbml0Rmlyc3REYXRhKGZuSW5pdEZpcnN0RGF0YV9BcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgJiYgcmV0WydjYXRjaCddIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnRoZW4ocmVzb2x2ZUVtcHR5KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUVtcHR5KCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBmbkluaXRGaXJzdERhdGEgcmVzb2x2ZWQ6ICcsIGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmluZm8oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmRvY19jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSByZXN1bHQuZG9jX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBfZGJSZWNvcmRDb3VudCA6ICcgKyBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlZnJlc2hDb25uZWN0aW9uIGRvbmUgOiAnLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3JJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlZnJlc2hDb25uZWN0aW9uIGZhaWxlZCA6ICcsIGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09IDQwMyB8fCBlcnIuY29kZSA9PT0gNDEwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWRqTG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246ICdTeW5jaHJvbml6YXRpb24gdW5hdXRob3JpemVkIDogbmVlZCB0byBsb2dpbiBhZ2Fpbi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gd2hhdCB0byBkbyB3aXRoIHRoaXMgZXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1lc3NhZ2UgPSAnRXJyb3IgZHVyaW5nIHN5bmNocm9uaXNhdGlvbjogJyArIGVyci50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoZXJyTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDUwMCwgcmVhc29uOiBlcnJNZXNzYWdlfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpQdXRJbkRiKGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUHV0SW5EYjogJywgZGF0YSk7XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ0RCIHB1dCBpbXBvc3NpYmxlLiBOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfaWQ6IHN0cmluZztcbiAgICAgICAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2YoJ19pZCcpKSB7XG4gICAgICAgICAgICBfaWQgPSBkYXRhLl9pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV9pZCkge1xuICAgICAgICAgICAgX2lkID0gc2VsZi5fZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdlbmNyeXB0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5wdXQoXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCksXG4gICAgICAgICAgICBzZWxmLnNkay5vcmcsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24sXG4gICAgICAgICAgICBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJlbW92ZUluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUmVtb3ZlSW5EYiAnLCBkYXRhX2lkKTtcblxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGFfaWQgfHwgdHlwZW9mIGRhdGFfaWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnREIgcmVtb3ZlIGltcG9zc2libGUuICcgK1xuICAgICAgICAgICAgICAgICdOZWVkIHRoZSBkYXRhLl9pZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnJlbW92ZShkYXRhX2lkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnRmluZCBwYiA6IG5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnIE5lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXQoZGF0YV9pZCwgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kQWxsSW5EYigpOiBQcm9taXNlPEFycmF5PGFueT4gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uZ2V0QWxsKGNyeXB0bylcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVzb2x2ZSgocmVzdWx0cyBhcyBBcnJheTxhbnk+KSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpQb3N0T25FbmRwb2ludChrZXk6IHN0cmluZywgZGF0YT86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZmlsdGVyOiBFbmRwb2ludEZpbHRlckludGVyZmFjZSA9IHtcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVuZHBvaW50cyA9IHRoaXMuZmlkakdldEVuZHBvaW50cyhmaWx0ZXIpO1xuICAgICAgICBpZiAoIWVuZHBvaW50cyB8fCBlbmRwb2ludHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChcbiAgICAgICAgICAgICAgICBuZXcgRXJyb3IoNDAwLFxuICAgICAgICAgICAgICAgICAgICAnZmlkai5zZGsuc2VydmljZS5maWRqUG9zdE9uRW5kcG9pbnQgOiBlbmRwb2ludCBkb2VzIG5vdCBleGlzdC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmRwb2ludFVybCA9IGVuZHBvaW50c1swXS51cmw7XG4gICAgICAgIGNvbnN0IGp3dCA9IHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiBlbmRwb2ludFVybCxcbiAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgand0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpHZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgIH07XG5cbiAgICAvLyBJbnRlcm5hbCBmdW5jdGlvbnNcblxuICAgIC8qKlxuICAgICAqIExvZ291dCB0aGVuIExvZ2luXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAcGFyYW0gdXBkYXRlUHJvcGVydGllc1xuICAgICAqL1xuICAgIHByaXZhdGUgX2xvZ2luSW50ZXJuYWwobG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXBkYXRlUHJvcGVydGllcz86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5fbG9naW5JbnRlcm5hbCcpO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDMsICdOZWVkIGFuIGludGlhbGl6ZWQgRmlkalNlcnZpY2UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24ubG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihsb2dpblVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5Vc2VyLmVtYWlsID0gbG9naW47XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGxvZ2luVXNlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuX2xvZ2luSW50ZXJuYWwgZXJyb3IgOiAnICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcHJvdGVjdGVkIF9yZW1vdmVBbGwoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgX2NyZWF0ZVNlc3Npb24odWlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBkYnM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSB0aGlzLmNvbm5lY3Rpb24uZ2V0REJzKHtmaWx0ZXI6ICd0aGVCZXN0T25lcyd9KTtcbiAgICAgICAgaWYgKCFkYnMgfHwgZGJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybignU2VlbXMgdGhhdCB5b3UgYXJlIGluIGRlbW8gbW9kZSwgbm8gcmVtb3RlIERCLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zZXRSZW1vdGUoZGJzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUodWlkKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfdGVzdFByb21pc2UoYT8pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2sgJyArIGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoJ3Rlc3QgcHJvbWlzZSBvaycpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3NydkRhdGFVbmlxSWQgPSAwO1xuXG4gICAgcHJpdmF0ZSBfZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChhcHBOYW1lLCB0eXBlPywgbmFtZT8pIHtcblxuICAgICAgICAvLyByZXR1cm4gbnVsbDtcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3Qgc2ltcGxlRGF0ZSA9ICcnICsgbm93LmdldEZ1bGxZZWFyKCkgKyAnJyArIG5vdy5nZXRNb250aCgpICsgJycgKyBub3cuZ2V0RGF0ZSgpXG4gICAgICAgICAgICArICcnICsgbm93LmdldEhvdXJzKCkgKyAnJyArIG5vdy5nZXRNaW51dGVzKCk7IC8vIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgY29uc3Qgc2VxdUlkID0gKytJbnRlcm5hbFNlcnZpY2UuX3NydkRhdGFVbmlxSWQ7XG4gICAgICAgIGxldCBVSWQgPSAnJztcbiAgICAgICAgaWYgKGFwcE5hbWUgJiYgYXBwTmFtZS5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIFVJZCArPSBhcHBOYW1lLmNoYXJBdCgwKSArICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlICYmIHR5cGUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgVUlkICs9IHR5cGUuc3Vic3RyaW5nKDAsIDQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lICYmIG5hbWUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgVUlkICs9IG5hbWUuc3Vic3RyaW5nKDAsIDQpO1xuICAgICAgICB9XG4gICAgICAgIFVJZCArPSBzaW1wbGVEYXRlICsgJycgKyBzZXF1SWQ7XG4gICAgICAgIHJldHVybiBVSWQ7XG4gICAgfVxuXG59XG4iXX0=