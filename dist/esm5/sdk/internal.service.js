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
var urljoin = require('url-join');
// import {LocalStorage} from 'node-localstorage';
// import 'localstorage-polyfill/localStorage';
// const PouchDB = window['PouchDB'] || require('pouchdb').default;
/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
var InternalService = /** @class */ (function () {
    function InternalService(logger, promise, options) {
        this.sdk = {
            org: 'fidj',
            version: version.version,
            prod: false,
            useDB: true
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
        if (options && options.logLevel) {
            this.logger.setLevel(options.logLevel);
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
        self.sdk.useDB = !options ? true : options.useDB;
        self.connection.fidjId = fidjId;
        self.connection.fidjVersion = self.sdk.version;
        self.connection.fidjCrypto = (!options || !options.hasOwnProperty('crypto')) ? true : options.crypto;
        return new self.promise(function (resolve, reject) {
            self.connection.verifyConnectionStates()
                .then(function () {
                var theBestUrl = self.connection.getApiEndpoints({ filter: 'theBestOne' })[0];
                var theBestOldUrl = self.connection.getApiEndpoints({ filter: 'theBestOldOne' })[0];
                var isLogin = self.fidjIsLogin();
                self.logger.log('fidj.sdk.service.fidjInit > verifyConnectionStates : ', theBestUrl, theBestOldUrl, isLogin);
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
                if (!self.sdk.useDB) {
                    resolve(self.connection.getUser());
                }
                else {
                    self.session.sync(self.connection.getClientId())
                        .then(function () { return resolve(self.connection.getUser()); })
                        .catch(function (err) { return resolve(self.connection.getUser()); });
                }
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
        if (!self.sdk.useDB) {
            self.logger.log('fidj.sdk.service.fidjSync: you ar not using DB - no sync available.');
            return Promise.resolve();
        }
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
        if (!self.sdk.useDB) {
            self.logger.log('fidj.sdk.service.fidjPutInDb: you are not using DB - no put available.');
            return Promise.resolve('NA');
        }
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
        if (!self.sdk.useDB) {
            self.logger.log('fidj.sdk.service.fidjRemoveInDb: you are not using DB - no remove available.');
            return Promise.resolve();
        }
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
        if (!self.sdk.useDB) {
            self.logger.log('fidj.sdk.service.fidjFindInDb: you are not using DB - no find available.');
            return Promise.resolve();
        }
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
        if (!self.sdk.useDB) {
            self.logger.log('fidj.sdk.service.fidjFindAllInDb: you are not using DB - no find available.');
            return Promise.resolve([]);
        }
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
    InternalService.prototype.fidjSendOnEndpoint = function (key, verb, relativePath, data) {
        var filter = {
            key: key
        };
        var endpoints = this.fidjGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(new Error(400, 'fidj.sdk.service.fidjSendOnEndpoint : endpoint does not exist.'));
        }
        var endpointUrl = endpoints[0].url;
        if (relativePath) {
            endpointUrl = urljoin(endpointUrl, relativePath);
        }
        var jwt = this.connection.getIdToken();
        var answer;
        var query = new Ajax();
        switch (verb) {
            case 'POST':
                answer = query.post({
                    url: endpointUrl,
                    // not used : withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    },
                    data: data
                });
                break;
            case 'PUT':
                answer = query.put({
                    url: endpointUrl,
                    // not used : withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    },
                    data: data
                });
                break;
            case 'DELETE':
                answer = query.delete({
                    url: endpointUrl,
                    // not used : withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    },
                });
                break;
            default:
                answer = query.get({
                    url: endpointUrl,
                    // not used : withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    },
                });
        }
        return answer;
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
            this.logger.warn('Seems that you are in Demo mode or using Node (no remote DB).');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQ0FBaUM7QUFDakMsc0RBQXNEO0FBQ3RELGlEQUFpRDtBQUNqRCxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEtBQUssVUFBVSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQVN0QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0MsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLGtEQUFrRDtBQUNsRCwrQ0FBK0M7QUFFL0MsbUVBQW1FO0FBRW5FOzs7R0FHRztBQUNIO0lBU0kseUJBQVksTUFBdUIsRUFBRSxPQUEyQixFQUFFLE9BQTJDO1FBRXpHLElBQUksQ0FBQyxHQUFHLEdBQUc7WUFDUCxHQUFHLEVBQUUsTUFBTTtZQUNYLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUNGLElBQUksT0FBTyxFQUFFO1lBQ1QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDMUI7UUFDRCxJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQ3hCO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7U0FDckM7UUFDRCxJQUFJLE9BQU8s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QUFlLENBQUMsY0FBYyxDQUFDO1FBQ2hELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDOUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekIsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekIsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsR0FBRyxJQUFJLFVBQVUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQXJCYyw4QkFBYyxHQUFHLENBQUMsQ0FBQztJQXVCdEMsc0JBQUM7Q0FBQSxBQXRuQkQsSUFzbkJDO1NBdG5CWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYic7XG4vLyBpbXBvcnQgKiBhcyBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbmltcG9ydCAqIGFzIHZlcnNpb24gZnJvbSAnLi4vdmVyc2lvbic7XG5pbXBvcnQgKiBhcyB0b29scyBmcm9tICcuLi90b29scyc7XG5pbXBvcnQgKiBhcyBjb25uZWN0aW9uIGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0ICogYXMgc2Vzc2lvbiBmcm9tICcuLi9zZXNzaW9uJztcbmltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSxcbiAgICBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLFxuICAgIFNka0ludGVyZmFjZSxcbiAgICBFcnJvckludGVyZmFjZSwgRW5kcG9pbnRJbnRlcmZhY2UsIEVuZHBvaW50RmlsdGVySW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge1Nlc3Npb25DcnlwdG9JbnRlcmZhY2V9IGZyb20gJy4uL3Nlc3Npb24vc2Vzc2lvbic7XG5pbXBvcnQge0Vycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi4vY29ubmVjdGlvbi9hamF4JztcbmltcG9ydCB7TG9nZ2VyU2VydmljZX0gZnJvbSAnLi9sb2dnZXIuc2VydmljZSc7XG5cbmNvbnN0IHVybGpvaW4gPSByZXF1aXJlKCd1cmwtam9pbicpO1xuLy8gaW1wb3J0IHtMb2NhbFN0b3JhZ2V9IGZyb20gJ25vZGUtbG9jYWxzdG9yYWdlJztcbi8vIGltcG9ydCAnbG9jYWxzdG9yYWdlLXBvbHlmaWxsL2xvY2FsU3RvcmFnZSc7XG5cbi8vIGNvbnN0IFBvdWNoREIgPSB3aW5kb3dbJ1BvdWNoREInXSB8fCByZXF1aXJlKCdwb3VjaGRiJykuZGVmYXVsdDtcblxuLyoqXG4gKiBwbGVhc2UgdXNlIGl0cyBhbmd1bGFyLmpzIG9yIGFuZ3VsYXIuaW8gd3JhcHBlclxuICogdXNlZnVsbCBvbmx5IGZvciBmaWRqIGRldiB0ZWFtXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbFNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBzZGs6IFNka0ludGVyZmFjZTtcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yO1xuICAgIHByaXZhdGUgc3RvcmFnZTogdG9vbHMuTG9jYWxTdG9yYWdlO1xuICAgIHByaXZhdGUgc2Vzc2lvbjogc2Vzc2lvbi5TZXNzaW9uO1xuICAgIHByaXZhdGUgY29ubmVjdGlvbjogY29ubmVjdGlvbi5Db25uZWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2UsIHByb21pc2U6IFByb21pc2VDb25zdHJ1Y3Rvciwgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSkge1xuXG4gICAgICAgIHRoaXMuc2RrID0ge1xuICAgICAgICAgICAgb3JnOiAnZmlkaicsXG4gICAgICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uLnZlcnNpb24sXG4gICAgICAgICAgICBwcm9kOiBmYWxzZSxcbiAgICAgICAgICAgIHVzZURCOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2dnZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyU2VydmljZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubG9nTGV2ZWwpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLnNldExldmVsKG9wdGlvbnMubG9nTGV2ZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlIDogY29uc3RydWN0b3InKTtcbiAgICAgICAgbGV0IGxzO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxzID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmVxdWlyZSgnbG9jYWxzdG9yYWdlLXBvbHlmaWxsJyk7XG4gICAgICAgICAgICBscyA9IGdsb2JhbFsnbG9jYWxTdG9yYWdlJ107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IHRvb2xzLkxvY2FsU3RvcmFnZShscywgJ2ZpZGouJyk7XG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IG5ldyBzZXNzaW9uLlNlc3Npb24oKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IGNvbm5lY3Rpb24uQ29ubmVjdGlvbih0aGlzLnNkaywgdGhpcy5zdG9yYWdlLCB0aGlzLmxvZ2dlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCBjb25uZWN0aW9uICYgc2Vzc2lvblxuICAgICAqIENoZWNrIHVyaVxuICAgICAqIERvbmUgZWFjaCBhcHAgc3RhcnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIHNldHRpbmdzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkaklkICByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpTYWx0IHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalZlcnNpb24gcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5kZXZNb2RlIG9wdGlvbmFsIGRlZmF1bHQgZmFsc2UsIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakluaXQoZmlkaklkOiBzdHJpbmcsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvKlxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZEVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldEF1dGhFbmRwb2ludChvcHRpb25zLmZvcmNlZEVuZHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0REJFbmRwb2ludChvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpO1xuICAgICAgICB9Ki9cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sb2dMZXZlbCkge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIuc2V0TGV2ZWwob3B0aW9ucy5sb2dMZXZlbCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgOiAnLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKCFmaWRqSWQpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogYmFkIGluaXQnKTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIGEgZmlkaklkJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5zZGsucHJvZCA9ICFvcHRpb25zID8gdHJ1ZSA6IG9wdGlvbnMucHJvZDtcbiAgICAgICAgc2VsZi5zZGsudXNlREIgPSAhb3B0aW9ucyA/IHRydWUgOiBvcHRpb25zLnVzZURCO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkaklkID0gZmlkaklkO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24gPSBzZWxmLnNkay52ZXJzaW9uO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0byA9ICghb3B0aW9ucyB8fCAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY3J5cHRvJykpID8gdHJ1ZSA6IG9wdGlvbnMuY3J5cHRvO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGVCZXN0T2xkVXJsOiBhbnkgPSBzZWxmLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T2xkT25lJ30pWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xvZ2luID0gc2VsZi5maWRqSXNMb2dpbigpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgPiB2ZXJpZnlDb25uZWN0aW9uU3RhdGVzIDogJywgdGhlQmVzdFVybCwgdGhlQmVzdE9sZFVybCwgaXNMb2dpbik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwgJiYgdGhlQmVzdFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RVcmwgPSB0aGVCZXN0VXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlQmVzdE9sZFVybCAmJiB0aGVCZXN0T2xkVXJsLnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlQmVzdE9sZFVybCA9IHRoZUJlc3RPbGRVcmwudXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xvZ2luICYmIHRoZUJlc3RPbGRVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RPbGRVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDA0LCAnTmVlZCBvbmUgY29ubmVjdGlvbiAtIG9yIHRvbyBvbGQgU0RLIHZlcnNpb24gKGNoZWNrIHVwZGF0ZSknKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQ6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIudG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBpdCBpZiBmaWRqSXNMb2dpbigpID09PSBmYWxzZVxuICAgICAqIEVyYXNlIGFsbCAoZGIgJiBzdG9yYWdlKVxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9sb2dpbkludGVybmFsKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbih1c2VyKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbjogJywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hY2Nlc3NUb2tlbiBvcHRpb25hbFxuICAgICAqIEBwYXJhbSBvcHRpb25zLmlkVG9rZW4gIG9wdGlvbmFsXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gZ2VuZXJhdGUgb25lIGRheSB0b2tlbnMgaWYgbm90IHNldFxuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBub3cuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpICsgMSk7XG4gICAgICAgICAgICBjb25zdCB0b21vcnJvdyA9IG5vdy5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgcm9sZXM6IFtdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdkZW1vJyxcbiAgICAgICAgICAgICAgICBhcGlzOiBbXSxcbiAgICAgICAgICAgICAgICBlbmRwb2ludHM6IFtdLFxuICAgICAgICAgICAgICAgIGRiczogW10sXG4gICAgICAgICAgICAgICAgZXhwOiB0b21vcnJvd1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc3Qgand0U2lnbiA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gand0U2lnbiArICcuJyArIHBheWxvYWQgKyAnLicgKyBqd3RTaWduO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgaWRUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luSW5EZW1vTW9kZSBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakdldEVuZHBvaW50cyhmaWx0ZXI/OiBFbmRwb2ludEZpbHRlckludGVyZmFjZSk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCFmaWx0ZXIpIHtcbiAgICAgICAgICAgIGZpbHRlciA9IHtzaG93QmxvY2tlZDogZmFsc2V9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFwID0gdGhpcy5jb25uZWN0aW9uLmdldEFjY2Vzc1BheWxvYWQoe2VuZHBvaW50czogW119KTtcbiAgICAgICAgbGV0IGVuZHBvaW50cyA9IEpTT04ucGFyc2UoYXApLmVuZHBvaW50cztcbiAgICAgICAgaWYgKCFlbmRwb2ludHMgfHwgIUFycmF5LmlzQXJyYXkoZW5kcG9pbnRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5kcG9pbnRzID0gZW5kcG9pbnRzLmZpbHRlcigoZW5kcG9pbnQ6IEVuZHBvaW50SW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2sgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9rICYmIGZpbHRlci5rZXkpIHtcbiAgICAgICAgICAgICAgICBvayA9IChlbmRwb2ludC5rZXkgPT09IGZpbHRlci5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9rICYmICFmaWx0ZXIuc2hvd0Jsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBvayA9ICFlbmRwb2ludC5ibG9ja2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50cztcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkak1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpJc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmlzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpMb2dvdXQoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ubG9nb3V0KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplIERCXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgYSBmdW5jdGlvbiB3aXRoIGRiIGFzIGlucHV0IGFuZCB0aGF0IHJldHVybiBwcm9taXNlOiBjYWxsIGlmIERCIGlzIGVtcHR5XG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YV9BcmcgYXJnIHRvIHNldCB0byBmbkluaXRGaXJzdERhdGEoKVxuICAgICAqIEByZXR1cm5zICBwcm9taXNlXG4gICAgICovXG4gICAgcHVibGljIGZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YT8sIGZuSW5pdEZpcnN0RGF0YV9Bcmc/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYycpO1xuICAgICAgICAvLyBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgOiBEQiBzeW5jIGltcG9zc2libGUuIERpZCB5b3UgbG9naW4gPycpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgaWYgKCFzZWxmLnNkay51c2VEQikge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jOiB5b3UgYXIgbm90IHVzaW5nIERCIC0gbm8gc3luYyBhdmFpbGFibGUuJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaXJzdFN5bmMgPSAoc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPT09IG51bGwpO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqU3luYyB3YXJuOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpc0VtcHR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBpc0VtcHR5IDogJywgaXNFbXB0eSwgZmlyc3RTeW5jKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZUVtcHR5LCByZWplY3RFbXB0eU5vdFVzZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5ICYmIGZpcnN0U3luYyAmJiBmbkluaXRGaXJzdERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBmbkluaXRGaXJzdERhdGEoZm5Jbml0Rmlyc3REYXRhX0FyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAmJiByZXRbJ2NhdGNoJ10gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQudGhlbihyZXNvbHZlRW1wdHkpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2cocmV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlRW1wdHkoKTsgLy8gc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIGZuSW5pdEZpcnN0RGF0YSByZXNvbHZlZDogJywgaW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaW5mbygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuZG9jX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IHJlc3VsdC5kb2NfY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIF9kYlJlY29yZENvdW50IDogJyArIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgcmVmcmVzaENvbm5lY3Rpb24gZG9uZSA6ICcsIHVzZXIpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBFcnJvckludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLndhcm4oJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgcmVmcmVzaENvbm5lY3Rpb24gZmFpbGVkIDogJywgZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gNDAzIHx8IGVyci5jb2RlID09PSA0MTApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpZGpMb2dvdXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246ICdTeW5jaHJvbml6YXRpb24gdW5hdXRob3JpemVkIDogbmVlZCB0byBsb2dpbiBhZ2Fpbi4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyciAmJiBlcnIuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyB3aGF0IHRvIGRvIHdpdGggdGhpcyBlcnIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyTWVzc2FnZSA9ICdFcnJvciBkdXJpbmcgc3luY2hyb25pc2F0aW9uOiAnICsgZXJyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcihlcnJNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNTAwLCByZWFzb246IGVyck1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalB1dEluRGIoZGF0YTogYW55KTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQdXRJbkRiOiAnLCBkYXRhKTtcbiAgICAgICAgaWYgKCFzZWxmLnNkay51c2VEQikge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQdXRJbkRiOiB5b3UgYXJlIG5vdCB1c2luZyBEQiAtIG5vIHB1dCBhdmFpbGFibGUuJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCdOQScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ0RCIHB1dCBpbXBvc3NpYmxlLiBOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfaWQ6IHN0cmluZztcbiAgICAgICAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2YoJ19pZCcpKSB7XG4gICAgICAgICAgICBfaWQgPSBkYXRhLl9pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV9pZCkge1xuICAgICAgICAgICAgX2lkID0gc2VsZi5fZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdlbmNyeXB0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5wdXQoXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCksXG4gICAgICAgICAgICBzZWxmLnNkay5vcmcsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24sXG4gICAgICAgICAgICBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJlbW92ZUluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUmVtb3ZlSW5EYiAnLCBkYXRhX2lkKTtcbiAgICAgICAgaWYgKCFzZWxmLnNkay51c2VEQikge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpSZW1vdmVJbkRiOiB5b3UgYXJlIG5vdCB1c2luZyBEQiAtIG5vIHJlbW92ZSBhdmFpbGFibGUuJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGFfaWQgfHwgdHlwZW9mIGRhdGFfaWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnREIgcmVtb3ZlIGltcG9zc2libGUuICcgK1xuICAgICAgICAgICAgICAgICdOZWVkIHRoZSBkYXRhLl9pZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnJlbW92ZShkYXRhX2lkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqRmluZEluRGI6IHlvdSBhcmUgbm90IHVzaW5nIERCIC0gbm8gZmluZCBhdmFpbGFibGUuJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnRmluZCBwYiA6IG5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnIE5lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXQoZGF0YV9pZCwgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kQWxsSW5EYigpOiBQcm9taXNlPEFycmF5PGFueT4gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakZpbmRBbGxJbkRiOiB5b3UgYXJlIG5vdCB1c2luZyBEQiAtIG5vIGZpbmQgYXZhaWxhYmxlLicpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uZ2V0QWxsKGNyeXB0bylcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVzb2x2ZSgocmVzdWx0cyBhcyBBcnJheTxhbnk+KSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpTZW5kT25FbmRwb2ludChrZXk6IHN0cmluZywgdmVyYjogc3RyaW5nLCByZWxhdGl2ZVBhdGg6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXI6IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZW5kcG9pbnRzID0gdGhpcy5maWRqR2V0RW5kcG9pbnRzKGZpbHRlcik7XG4gICAgICAgIGlmICghZW5kcG9pbnRzIHx8IGVuZHBvaW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KFxuICAgICAgICAgICAgICAgIG5ldyBFcnJvcig0MDAsXG4gICAgICAgICAgICAgICAgICAgICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTZW5kT25FbmRwb2ludCA6IGVuZHBvaW50IGRvZXMgbm90IGV4aXN0LicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbmRwb2ludFVybCA9IGVuZHBvaW50c1swXS51cmw7XG4gICAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgICAgIGVuZHBvaW50VXJsID0gdXJsam9pbihlbmRwb2ludFVybCwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBqd3QgPSB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgICAgICBsZXQgYW5zd2VyO1xuICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBBamF4KCk7XG4gICAgICAgIHN3aXRjaCAodmVyYikge1xuICAgICAgICAgICAgY2FzZSAnUE9TVCcgOlxuICAgICAgICAgICAgICAgIGFuc3dlciA9IHF1ZXJ5LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdQVVQnIDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5wdXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdERUxFVEUnIDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5kZWxldGUoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZDogZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZDogZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnN3ZXI7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqR2V0SWRUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWwgZnVuY3Rpb25zXG5cbiAgICAvKipcbiAgICAgKiBMb2dvdXQgdGhlbiBMb2dpblxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHBhcmFtIHVwZGF0ZVByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIF9sb2dpbkludGVybmFsKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuX2xvZ2luSW50ZXJuYWwnKTtcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAzLCAnTmVlZCBhbiBpbnRpYWxpemVkIEZpZGpTZXJ2aWNlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4obG9naW5Vc2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luVXNlci5lbWFpbCA9IGxvZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShsb2dpblVzZXIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsIGVycm9yIDogJyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBfcmVtb3ZlQWxsKCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF9jcmVhdGVTZXNzaW9uKHVpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZGJzOiBFbmRwb2ludEludGVyZmFjZVtdID0gdGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSk7XG4gICAgICAgIGlmICghZGJzIHx8IGRicy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1NlZW1zIHRoYXQgeW91IGFyZSBpbiBEZW1vIG1vZGUgb3IgdXNpbmcgTm9kZSAobm8gcmVtb3RlIERCKS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlc3Npb24uc2V0UmVtb3RlKGRicyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHVpZCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgX3Rlc3RQcm9taXNlKGE/KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rICcgKyBhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2snKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9zcnZEYXRhVW5pcUlkID0gMDtcblxuICAgIHByaXZhdGUgX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoYXBwTmFtZSwgdHlwZT8sIG5hbWU/KSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHNpbXBsZURhdGUgPSAnJyArIG5vdy5nZXRGdWxsWWVhcigpICsgJycgKyBub3cuZ2V0TW9udGgoKSArICcnICsgbm93LmdldERhdGUoKVxuICAgICAgICAgICAgKyAnJyArIG5vdy5nZXRIb3VycygpICsgJycgKyBub3cuZ2V0TWludXRlcygpOyAvLyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHNlcXVJZCA9ICsrSW50ZXJuYWxTZXJ2aWNlLl9zcnZEYXRhVW5pcUlkO1xuICAgICAgICBsZXQgVUlkID0gJyc7XG4gICAgICAgIGlmIChhcHBOYW1lICYmIGFwcE5hbWUuY2hhckF0KDApKSB7XG4gICAgICAgICAgICBVSWQgKz0gYXBwTmFtZS5jaGFyQXQoMCkgKyAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSB0eXBlLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSBuYW1lLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBVSWQgKz0gc2ltcGxlRGF0ZSArICcnICsgc2VxdUlkO1xuICAgICAgICByZXR1cm4gVUlkO1xuICAgIH1cblxufVxuIl19