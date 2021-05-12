import { __awaiter } from "tslib";
// import PouchDB from 'pouchdb';
// import * as PouchDB from 'pouchdb/dist/pouchdb.js';
// import PouchDB from 'pouchdb/dist/pouchdb.js';
import * as version from '../version';
import * as tools from '../tools';
import * as connection from '../connection';
import * as session from '../session';
import { LoggerLevelEnum } from './interfaces';
import { Error } from './error';
import { Ajax } from '../connection/ajax';
import { LoggerService } from './logger.service';
const urljoin = require('url-join');
// import {LocalStorage} from 'node-localstorage';
// import 'localstorage-polyfill/localStorage';
// const PouchDB = window['PouchDB'] || require('pouchdb').default;
/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
export class InternalService {
    constructor(logger, promise, options) {
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
        let ls;
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
     * @param fidjId
     * @param options Optional settings
     * @param options.fidjId  required use your customized endpoints
     * @param options.fidjSalt required use your customized endpoints
     * @param options.fidjVersion required use your customized endpoints
     * @param options.devMode optional default false, use your customized endpoints
     * @returns
     * @throws {ErrorInterface}
     */
    fidjInit(fidjId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            /*if (options && options.forcedEndpoint) {
                this.fidjService.setAuthEndpoint(options.forcedEndpoint);
            }
            if (options && options.forcedDBEndpoint) {
                this.fidjService.setDBEndpoint(options.forcedDBEndpoint);
            }*/
            if (options && options.logLevel) {
                this.logger.setLevel(options.logLevel);
            }
            else {
                this.logger.setLevel(LoggerLevelEnum.NONE);
            }
            this.logger.log('fidj.sdk.service.fidjInit : ', options);
            if (!fidjId) {
                this.logger.error('fidj.sdk.service.fidjInit : bad init');
                return this.promise.reject(new Error(400, 'Need a fidjId'));
            }
            this.sdk.prod = !options ? true : options.prod;
            this.sdk.useDB = !options ? false : options.useDB;
            this.connection.fidjId = fidjId;
            this.connection.fidjVersion = this.sdk.version;
            this.connection.fidjCrypto = (!options || !options.hasOwnProperty('crypto')) ? false : options.crypto;
            let bestUrls, bestOldUrls;
            try {
                yield this.connection.verifyConnectionStates();
                bestUrls = yield this.connection.getApiEndpoints({ filter: 'theBestOne' });
                bestOldUrls = yield this.connection.getApiEndpoints({ filter: 'theBestOldOne' });
            }
            catch (err) {
                this.logger.error('fidj.sdk.service.fidjInit: ', err);
                throw new Error(500, err.toString());
            }
            if (!bestUrls || !bestOldUrls || (bestUrls.length === 0 && bestOldUrls.length === 0)) {
                throw new Error(404, 'Need one connection - or too old SDK version (check update)');
            }
            let theBestFirstUrl = bestUrls[0];
            let theBestFirstOldUrl = bestOldUrls[0];
            const isLogin = this.fidjIsLogin();
            this.logger.log('fidj.sdk.service.fidjInit > verifyConnectionStates : ', theBestFirstUrl, theBestFirstOldUrl, isLogin);
            if (theBestFirstUrl) {
                this.connection.setClient(new connection.Client(this.connection.fidjId, theBestFirstUrl.url, this.storage, this.sdk));
            }
            else {
                this.connection.setClient(new connection.Client(this.connection.fidjId, theBestFirstOldUrl.url, this.storage, this.sdk));
            }
        });
    }
    ;
    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param login
     * @param password
     * @throws {ErrorInterface}
     */
    fidjLogin(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('fidj.sdk.service.fidjLogin');
            if (!this.connection.isReady()) {
                throw new Error(404, 'Need an initialized FidjService');
            }
            try {
                yield this._removeAll();
                yield this.connection.verifyConnectionStates();
                yield this._createSession(this.connection.fidjId);
                const clientTokens = yield this._loginInternal(login, password);
                yield this.connection.setConnection(clientTokens);
            }
            catch (err) {
                throw new Error(500, err.toString());
            }
            if (!this.sdk.useDB) {
                return this.connection.getUser();
            }
            try {
                yield this.session.sync(this.connection.getClientId());
            }
            catch (e) {
                this.logger.warn('fidj.sdk.service.fidjLogin: sync -not blocking- issue  ', e.toString());
            }
            return this.connection.getUser();
        });
    }
    /**
     *
     * @param options
     * @param options.accessToken optional
     * @param options.idToken  optional
     * @returns
     */
    fidjLoginInDemoMode(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            // generate one day tokens if not set
            if (!options || !options.accessToken) {
                const now = new Date();
                now.setDate(now.getDate() + 1);
                const tomorrow = now.getTime();
                const payload = tools.Base64.encode(JSON.stringify({
                    roles: [],
                    message: 'demo',
                    apis: [],
                    endpoints: [],
                    dbs: [],
                    exp: tomorrow
                }));
                const jwtSign = tools.Base64.encode(JSON.stringify({}));
                const token = jwtSign + '.' + payload + '.' + jwtSign;
                options = {
                    accessToken: token,
                    idToken: token,
                    refreshToken: token
                };
            }
            return new self.promise((resolve, reject) => {
                self._removeAll()
                    .then(() => {
                    return self._createSession(self.connection.fidjId);
                })
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    yield self.connection.setConnectionOffline(options);
                    resolve(self.connection.getUser());
                }))
                    .catch((err) => {
                    self.logger.error('fidj.sdk.service.fidjLoginInDemoMode error: ', err);
                    reject(err);
                });
            });
        });
    }
    ;
    fidjIsLogin() {
        return this.connection.isLogin();
    }
    ;
    fidjGetEndpoints(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filter) {
                filter = { showBlocked: false };
            }
            const ap = yield this.connection.getAccessPayload({ endpoints: [] });
            let endpoints = JSON.parse(ap).endpoints;
            if (!endpoints || !Array.isArray(endpoints)) {
                return [];
            }
            endpoints = endpoints.filter((endpoint) => {
                let ok = true;
                if (ok && filter.key) {
                    ok = (endpoint.key === filter.key);
                }
                if (ok && !filter.showBlocked) {
                    ok = !endpoint.blocked;
                }
                return ok;
            });
            return endpoints;
        });
    }
    ;
    fidjRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.connection.getIdPayload({ roles: [] })).roles;
        });
    }
    ;
    fidjMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.connection.getIdPayload({ message: '' })).message;
        });
    }
    ;
    fidjLogout(force) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            if (!self.connection.getClient() && !force) {
                return self._removeAll()
                    .then(() => {
                    return this.session.create(self.connection.fidjId, true);
                });
            }
            return self.connection.logout()
                .then(() => {
                return self._removeAll();
            })
                .catch(() => {
                return self._removeAll();
            })
                .then(() => {
                return this.session.create(self.connection.fidjId, true);
            });
        });
    }
    ;
    /**
     * Synchronize DB
     *
     *
     * @param fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @returns  promise
     */
    fidjSync(fnInitFirstData, fnInitFirstData_Arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            self.logger.log('fidj.sdk.service.fidjSync');
            // if (!self.session.isReady()) {
            //    return self.promise.reject('fidj.sdk.service.fidjSync : DB sync impossible. Did you login ?');
            // }
            if (!self.sdk.useDB) {
                self.logger.log('fidj.sdk.service.fidjSync: you ar not using DB - no sync available.');
                return Promise.resolve();
            }
            const firstSync = (self.session.dbLastSync === null);
            return new self.promise((resolve, reject) => {
                self._createSession(self.connection.fidjId)
                    .then(() => {
                    return self.session.sync(self.connection.getClientId());
                })
                    .then(() => {
                    self.logger.log('fidj.sdk.service.fidjSync resolved');
                    return self.session.isEmpty();
                })
                    .catch((err) => {
                    self.logger.warn('fidj.sdk.service.fidjSync warn: ', err);
                    return self.session.isEmpty();
                })
                    .then((isEmpty) => {
                    self.logger.log('fidj.sdk.service.fidjSync isEmpty : ', isEmpty, firstSync);
                    return new self.promise((resolveEmpty, rejectEmptyNotUsed) => {
                        if (isEmpty && firstSync && fnInitFirstData) {
                            const ret = fnInitFirstData(fnInitFirstData_Arg);
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
                    .then((info) => {
                    self.logger.log('fidj.sdk.service.fidjSync fnInitFirstData resolved: ', info);
                    self.session.dbLastSync = new Date().getTime();
                    return self.session.info();
                })
                    .then((result) => {
                    self.session.dbRecordCount = 0;
                    if (result && result.doc_count) {
                        self.session.dbRecordCount = result.doc_count;
                    }
                    self.logger.log('fidj.sdk.service.fidjSync _dbRecordCount : ' + self.session.dbRecordCount);
                    return self.connection.refreshConnection();
                })
                    .then((user) => {
                    self.logger.log('fidj.sdk.service.fidjSync refreshConnection done : ', user);
                    resolve(); // self.connection.getUser()
                })
                    .catch((err) => {
                    // console.error(err);
                    self.logger.warn('fidj.sdk.service.fidjSync refreshConnection failed : ', err);
                    if (err && (err.code === 403 || err.code === 410)) {
                        this.fidjLogout()
                            .then(() => {
                            reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                        })
                            .catch(() => {
                            reject({ code: 403, reason: 'Synchronization unauthorized : need to login again..' });
                        });
                    }
                    else if (err && err.code) {
                        // todo what to do with this err ?
                        resolve();
                    }
                    else {
                        const errMessage = 'Error during synchronisation: ' + err.toString();
                        self.logger.error(errMessage);
                        reject({ code: 500, reason: errMessage });
                    }
                });
            });
        });
    }
    ;
    fidjPutInDb(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
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
            let _id;
            if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
                _id = data._id;
            }
            if (!_id) {
                _id = self._generateObjectUniqueId(self.connection.fidjId);
            }
            let crypto;
            if (self.connection.fidjCrypto) {
                crypto = {
                    obj: self.connection,
                    method: 'encrypt'
                };
            }
            return self.session.put(data, _id, self.connection.getClientId(), self.sdk.org, self.connection.fidjVersion, crypto);
        });
    }
    ;
    fidjRemoveInDb(data_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
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
        });
    }
    ;
    fidjFindInDb(data_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
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
            let crypto;
            if (self.connection.fidjCrypto) {
                crypto = {
                    obj: self.connection,
                    method: 'decrypt'
                };
            }
            return self.session.get(data_id, crypto);
        });
    }
    ;
    fidjFindAllInDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
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
            let crypto;
            if (self.connection.fidjCrypto) {
                crypto = {
                    obj: self.connection,
                    method: 'decrypt'
                };
            }
            return self.session.getAll(crypto)
                .then(results => {
                self.connection.setCryptoSaltAsVerified();
                return self.promise.resolve(results);
            });
        });
    }
    ;
    fidjSendOnEndpoint(key, verb, relativePath, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                key: key
            };
            const endpoints = yield this.fidjGetEndpoints(filter);
            if (!endpoints || endpoints.length !== 1) {
                return this.promise.reject(new Error(400, 'fidj.sdk.service.fidjSendOnEndpoint : endpoint does not exist.'));
            }
            let endpointUrl = endpoints[0].url;
            if (relativePath) {
                endpointUrl = urljoin(endpointUrl, relativePath);
            }
            const jwt = yield this.connection.getIdToken();
            let answer;
            const query = new Ajax();
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
        });
    }
    ;
    fidjGetIdToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.getIdToken();
        });
    }
    ;
    // Internal functions
    /**
     * Logout then Login
     *
     * @param login
     * @param password
     * @param updateProperties
     * @throws {ErrorInterface}
     */
    _loginInternal(login, password, updateProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('fidj.sdk.service._loginInternal');
            if (!this.connection.isReady()) {
                throw new Error(403, 'Need an initialized FidjService');
            }
            yield this.connection.logout();
            let clientTokens;
            try {
                clientTokens = this.connection.getClient().login(login, password, updateProperties);
            }
            catch (e) {
                clientTokens = yield this.connection.getClient().login(login, password, updateProperties);
            }
            return clientTokens;
        });
    }
    ;
    _removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection.destroy();
            return this.session.destroy();
        });
    }
    ;
    _createSession(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbs = yield this.connection.getDBs({ filter: 'theBestOnes' });
            if (!dbs || dbs.length === 0) {
                this.logger.warn('Seems that you are in Demo mode or using Node (no remote DB).');
            }
            this.session.setRemote(dbs);
            return this.session.create(uid);
        });
    }
    ;
    _testPromise(a) {
        return __awaiter(this, void 0, void 0, function* () {
            if (a) {
                return this.promise.resolve('test promise ok ' + a);
            }
            return new this.promise((resolve, reject) => {
                resolve('test promise ok');
            });
        });
    }
    ;
    _generateObjectUniqueId(appName, type, name) {
        // return null;
        const now = new Date();
        const simpleDate = '' + now.getFullYear() + '' + now.getMonth() + '' + now.getDate()
            + '' + now.getHours() + '' + now.getMinutes(); // new Date().toISOString();
        const sequId = ++InternalService._srvDataUniqId;
        let UId = '';
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
    }
}
InternalService._srvDataUniqId = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvbWxlcHJldm9zdC9Xb3Jrc3BhY2Uvb2ZpZGovZmlkai9zcmMvIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQWlDO0FBQ2pDLHNEQUFzRDtBQUN0RCxpREFBaUQ7QUFDakQsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxLQUFLLFVBQVUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUt5RCxlQUFlLEVBQzlFLE1BQU0sY0FBYyxDQUFDO0FBRXRCLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDOUIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUcvQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsa0RBQWtEO0FBQ2xELCtDQUErQztBQUUvQyxtRUFBbUU7QUFFbkU7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGVBQWU7SUFTeEIsWUFBWSxNQUF1QixFQUFFLE9BQTJCLEVBQUUsT0FBMkM7UUFFekcsSUFBSSxDQUFDLEdBQUcsR0FBRztZQUNQLEdBQUcsRUFBRSxNQUFNO1lBQ1gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDO1FBQ0YsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMxQjtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0s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QVUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7QUFyQmMsOEJBQWMsR0FBRyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGltcG9ydCAqIGFzIFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0ICogYXMgdmVyc2lvbiBmcm9tICcuLi92ZXJzaW9uJztcbmltcG9ydCAqIGFzIHRvb2xzIGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgKiBhcyBzZXNzaW9uIGZyb20gJy4uL3Nlc3Npb24nO1xuaW1wb3J0IHtcbiAgICBMb2dnZXJJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgU2RrSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UsIExvZ2dlckxldmVsRW51bVxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlfSBmcm9tICcuLi9zZXNzaW9uL3Nlc3Npb24nO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge0FqYXh9IGZyb20gJy4uL2Nvbm5lY3Rpb24vYWpheCc7XG5pbXBvcnQge0xvZ2dlclNlcnZpY2V9IGZyb20gJy4vbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHtDbGllbnRUb2tlbnMsIENsaWVudFVzZXJ9IGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuXG5jb25zdCB1cmxqb2luID0gcmVxdWlyZSgndXJsLWpvaW4nKTtcbi8vIGltcG9ydCB7TG9jYWxTdG9yYWdlfSBmcm9tICdub2RlLWxvY2Fsc3RvcmFnZSc7XG4vLyBpbXBvcnQgJ2xvY2Fsc3RvcmFnZS1wb2x5ZmlsbC9sb2NhbFN0b3JhZ2UnO1xuXG4vLyBjb25zdCBQb3VjaERCID0gd2luZG93WydQb3VjaERCJ10gfHwgcmVxdWlyZSgncG91Y2hkYicpLmRlZmF1bHQ7XG5cbi8qKlxuICogcGxlYXNlIHVzZSBpdHMgYW5ndWxhci5qcyBvciBhbmd1bGFyLmlvIHdyYXBwZXJcbiAqIHVzZWZ1bGwgb25seSBmb3IgZmlkaiBkZXYgdGVhbVxuICovXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgc2RrOiBTZGtJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlckludGVyZmFjZTtcbiAgICBwcml2YXRlIHByb21pc2U6IFByb21pc2VDb25zdHJ1Y3RvcjtcbiAgICBwcml2YXRlIHN0b3JhZ2U6IHRvb2xzLkxvY2FsU3RvcmFnZTtcbiAgICBwcml2YXRlIHNlc3Npb246IHNlc3Npb24uU2Vzc2lvbjtcbiAgICBwcml2YXRlIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24uQ29ubmVjdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlLCBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3IsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpIHtcblxuICAgICAgICB0aGlzLnNkayA9IHtcbiAgICAgICAgICAgIG9yZzogJ2ZpZGonLFxuICAgICAgICAgICAgdmVyc2lvbjogdmVyc2lvbi52ZXJzaW9uLFxuICAgICAgICAgICAgcHJvZDogZmFsc2UsXG4gICAgICAgICAgICB1c2VEQjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9nZ2VyKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxvZ0xldmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5zZXRMZXZlbChvcHRpb25zLmxvZ0xldmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZSA6IGNvbnN0cnVjdG9yJyk7XG4gICAgICAgIGxldCBscztcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBscyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJlcXVpcmUoJ2xvY2Fsc3RvcmFnZS1wb2x5ZmlsbCcpO1xuICAgICAgICAgICAgbHMgPSBnbG9iYWxbJ2xvY2FsU3RvcmFnZSddO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IG5ldyB0b29scy5Mb2NhbFN0b3JhZ2UobHMsICdmaWRqLicpO1xuICAgICAgICB0aGlzLnNlc3Npb24gPSBuZXcgc2Vzc2lvbi5TZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG5ldyBjb25uZWN0aW9uLkNvbm5lY3Rpb24odGhpcy5zZGssIHRoaXMuc3RvcmFnZSwgdGhpcy5sb2dnZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgY29ubmVjdGlvbiAmIHNlc3Npb25cbiAgICAgKiBDaGVjayB1cmlcbiAgICAgKiBEb25lIGVhY2ggYXBwIHN0YXJ0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmlkaklkXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqSWQgIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalNhbHQgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqVmVyc2lvbiByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmRldk1vZGUgb3B0aW9uYWwgZGVmYXVsdCBmYWxzZSwgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqIEB0aHJvd3Mge0Vycm9ySW50ZXJmYWNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBmaWRqSW5pdChmaWRqSWQ6IHN0cmluZywgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIC8qaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWRFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXRBdXRoRW5kcG9pbnQob3B0aW9ucy5mb3JjZWRFbmRwb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldERCRW5kcG9pbnQob3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KTtcbiAgICAgICAgfSovXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubG9nTGV2ZWwpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLnNldExldmVsKG9wdGlvbnMubG9nTGV2ZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuc2V0TGV2ZWwoTG9nZ2VyTGV2ZWxFbnVtLk5PTkUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogJywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghZmlkaklkKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6IGJhZCBpbml0Jyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhIGZpZGpJZCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2RrLnByb2QgPSAhb3B0aW9ucyA/IHRydWUgOiBvcHRpb25zLnByb2Q7XG4gICAgICAgIHRoaXMuc2RrLnVzZURCID0gIW9wdGlvbnMgPyBmYWxzZSA6IG9wdGlvbnMudXNlREI7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5maWRqSWQgPSBmaWRqSWQ7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5maWRqVmVyc2lvbiA9IHRoaXMuc2RrLnZlcnNpb247XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5maWRqQ3J5cHRvID0gKCFvcHRpb25zIHx8ICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjcnlwdG8nKSkgPyBmYWxzZSA6IG9wdGlvbnMuY3J5cHRvO1xuXG4gICAgICAgIGxldCBiZXN0VXJscywgYmVzdE9sZFVybHM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24udmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpO1xuICAgICAgICAgICAgYmVzdFVybHMgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T25lJ30pO1xuICAgICAgICAgICAgYmVzdE9sZFVybHMgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T2xkT25lJ30pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0OiAnLCBlcnIpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFiZXN0VXJscyB8fCAhYmVzdE9sZFVybHMgfHwgKGJlc3RVcmxzLmxlbmd0aCA9PT0gMCAmJiBiZXN0T2xkVXJscy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoNDA0LCAnTmVlZCBvbmUgY29ubmVjdGlvbiAtIG9yIHRvbyBvbGQgU0RLIHZlcnNpb24gKGNoZWNrIHVwZGF0ZSknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0aGVCZXN0Rmlyc3RVcmwgPSBiZXN0VXJsc1swXTtcbiAgICAgICAgbGV0IHRoZUJlc3RGaXJzdE9sZFVybCA9IGJlc3RPbGRVcmxzWzBdO1xuICAgICAgICBjb25zdCBpc0xvZ2luID0gdGhpcy5maWRqSXNMb2dpbigpO1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgPiB2ZXJpZnlDb25uZWN0aW9uU3RhdGVzIDogJywgdGhlQmVzdEZpcnN0VXJsLCB0aGVCZXN0Rmlyc3RPbGRVcmwsIGlzTG9naW4pO1xuXG4gICAgICAgIGlmICh0aGVCZXN0Rmlyc3RVcmwpIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHRoaXMuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RGaXJzdFVybC51cmwsIHRoaXMuc3RvcmFnZSwgdGhpcy5zZGspKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHRoaXMuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RGaXJzdE9sZFVybC51cmwsIHRoaXMuc3RvcmFnZSwgdGhpcy5zZGspKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGl0IGlmIGZpZGpJc0xvZ2luKCkgPT09IGZhbHNlXG4gICAgICogRXJhc2UgYWxsIChkYiAmIHN0b3JhZ2UpXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAdGhyb3dzIHtFcnJvckludGVyZmFjZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgZmlkakxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPENsaWVudFVzZXI+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbicpO1xuICAgICAgICBpZiAoIXRoaXMuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig0MDQsICdOZWVkIGFuIGluaXRpYWxpemVkIEZpZGpTZXJ2aWNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24udmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fY3JlYXRlU2Vzc2lvbih0aGlzLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFRva2VucyA9IGF3YWl0IHRoaXMuX2xvZ2luSW50ZXJuYWwobG9naW4sIHBhc3N3b3JkKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zZXRDb25uZWN0aW9uKGNsaWVudFRva2Vucyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnNkay51c2VEQikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRVc2VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXNzaW9uLnN5bmModGhpcy5jb25uZWN0aW9uLmdldENsaWVudElkKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbjogc3luYyAtbm90IGJsb2NraW5nLSBpc3N1ZSAgJywgZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmdldFVzZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYWNjZXNzVG9rZW4gb3B0aW9uYWxcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pZFRva2VuICBvcHRpb25hbFxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIGZpZGpMb2dpbkluRGVtb01vZGUob3B0aW9ucz86IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIG9uZSBkYXkgdG9rZW5zIGlmIG5vdCBzZXRcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbm93LnNldERhdGUobm93LmdldERhdGUoKSArIDEpO1xuICAgICAgICAgICAgY29uc3QgdG9tb3Jyb3cgPSBub3cuZ2V0VGltZSgpO1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHJvbGVzOiBbXSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnZGVtbycsXG4gICAgICAgICAgICAgICAgYXBpczogW10sXG4gICAgICAgICAgICAgICAgZW5kcG9pbnRzOiBbXSxcbiAgICAgICAgICAgICAgICBkYnM6IFtdLFxuICAgICAgICAgICAgICAgIGV4cDogdG9tb3Jyb3dcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGp3dFNpZ24gPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHt9KSk7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGp3dFNpZ24gKyAnLicgKyBwYXlsb2FkICsgJy4nICsgand0U2lnbjtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IHRva2VuLFxuICAgICAgICAgICAgICAgIGlkVG9rZW46IHRva2VuLFxuICAgICAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlbGYuY29ubmVjdGlvbi5zZXRDb25uZWN0aW9uT2ZmbGluZShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbkluRGVtb01vZGUgZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpJc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmlzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpHZXRFbmRwb2ludHMoZmlsdGVyPzogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UpOiBQcm9taXNlPEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPj4ge1xuXG4gICAgICAgIGlmICghZmlsdGVyKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSB7c2hvd0Jsb2NrZWQ6IGZhbHNlfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcCA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRBY2Nlc3NQYXlsb2FkKHtlbmRwb2ludHM6IFtdfSk7XG4gICAgICAgIGxldCBlbmRwb2ludHMgPSBKU09OLnBhcnNlKGFwKS5lbmRwb2ludHM7XG4gICAgICAgIGlmICghZW5kcG9pbnRzIHx8ICFBcnJheS5pc0FycmF5KGVuZHBvaW50cykpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZHBvaW50cyA9IGVuZHBvaW50cy5maWx0ZXIoKGVuZHBvaW50OiBFbmRwb2ludEludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChvayAmJiBmaWx0ZXIua2V5KSB7XG4gICAgICAgICAgICAgICAgb2sgPSAoZW5kcG9pbnQua2V5ID09PSBmaWx0ZXIua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvayAmJiAhZmlsdGVyLnNob3dCbG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgb2sgPSAhZW5kcG9pbnQuYmxvY2tlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvaztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqUm9sZXMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcztcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpNZXNzYWdlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2U7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqTG9nb3V0KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGFfQXJnIGFyZyB0byBzZXQgdG8gZm5Jbml0Rmlyc3REYXRhKClcbiAgICAgKiBAcmV0dXJucyAgcHJvbWlzZVxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBmaWRqU3luYyhmbkluaXRGaXJzdERhdGE/LCBmbkluaXRGaXJzdERhdGFfQXJnPyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMnKTtcbiAgICAgICAgLy8gaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIDogREIgc3luYyBpbXBvc3NpYmxlLiBEaWQgeW91IGxvZ2luID8nKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGlmICghc2VsZi5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYzogeW91IGFyIG5vdCB1c2luZyBEQiAtIG5vIHN5bmMgYXZhaWxhYmxlLicpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlyc3RTeW5jID0gKHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID09PSBudWxsKTtcblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uc3luYyhzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLndhcm4oJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgd2FybjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaXNFbXB0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgaXNFbXB0eSA6ICcsIGlzRW1wdHksIGZpcnN0U3luYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmVFbXB0eSwgcmVqZWN0RW1wdHlOb3RVc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eSAmJiBmaXJzdFN5bmMgJiYgZm5Jbml0Rmlyc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gZm5Jbml0Rmlyc3REYXRhKGZuSW5pdEZpcnN0RGF0YV9BcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgJiYgcmV0WydjYXRjaCddIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnRoZW4ocmVzb2x2ZUVtcHR5KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUVtcHR5KCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBmbkluaXRGaXJzdERhdGEgcmVzb2x2ZWQ6ICcsIGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmluZm8oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmRvY19jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSByZXN1bHQuZG9jX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBfZGJSZWNvcmRDb3VudCA6ICcgKyBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlZnJlc2hDb25uZWN0aW9uIGRvbmUgOiAnLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3JJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlZnJlc2hDb25uZWN0aW9uIGZhaWxlZCA6ICcsIGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09IDQwMyB8fCBlcnIuY29kZSA9PT0gNDEwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWRqTG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246ICdTeW5jaHJvbml6YXRpb24gdW5hdXRob3JpemVkIDogbmVlZCB0byBsb2dpbiBhZ2Fpbi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gd2hhdCB0byBkbyB3aXRoIHRoaXMgZXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1lc3NhZ2UgPSAnRXJyb3IgZHVyaW5nIHN5bmNocm9uaXNhdGlvbjogJyArIGVyci50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoZXJyTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDUwMCwgcmVhc29uOiBlcnJNZXNzYWdlfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpQdXRJbkRiKGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUHV0SW5EYjogJywgZGF0YSk7XG4gICAgICAgIGlmICghc2VsZi5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUHV0SW5EYjogeW91IGFyZSBub3QgdXNpbmcgREIgLSBubyBwdXQgYXZhaWxhYmxlLicpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgnTkEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdEQiBwdXQgaW1wb3NzaWJsZS4gTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX2lkOiBzdHJpbmc7XG4gICAgICAgIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKCdfaWQnKSkge1xuICAgICAgICAgICAgX2lkID0gZGF0YS5faWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfaWQpIHtcbiAgICAgICAgICAgIF9pZCA9IHNlbGYuX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZW5jcnlwdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucHV0KFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpLFxuICAgICAgICAgICAgc2VsZi5zZGsub3JnLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpWZXJzaW9uLFxuICAgICAgICAgICAgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpSZW1vdmVJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalJlbW92ZUluRGIgJywgZGF0YV9pZCk7XG4gICAgICAgIGlmICghc2VsZi5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUmVtb3ZlSW5EYjogeW91IGFyZSBub3QgdXNpbmcgREIgLSBubyByZW1vdmUgYXZhaWxhYmxlLicpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhX2lkIHx8IHR5cGVvZiBkYXRhX2lkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ0RCIHJlbW92ZSBpbXBvc3NpYmxlLiAnICtcbiAgICAgICAgICAgICAgICAnTmVlZCB0aGUgZGF0YS5faWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5yZW1vdmUoZGF0YV9pZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqRmluZEluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakZpbmRJbkRiOiB5b3UgYXJlIG5vdCB1c2luZyBEQiAtIG5vIGZpbmQgYXZhaWxhYmxlLicpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ0ZpbmQgcGIgOiBuZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJyBOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uZ2V0KGRhdGFfaWQsIGNyeXB0byk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqRmluZEFsbEluRGIoKTogUHJvbWlzZTxBcnJheTxhbnk+IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLnNkay51c2VEQikge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpGaW5kQWxsSW5EYjogeW91IGFyZSBub3QgdXNpbmcgREIgLSBubyBmaW5kIGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ05lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldEFsbChjcnlwdG8pXG4gICAgICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlc29sdmUoKHJlc3VsdHMgYXMgQXJyYXk8YW55PikpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqU2VuZE9uRW5kcG9pbnQoa2V5OiBzdHJpbmcsIHZlcmI6IHN0cmluZywgcmVsYXRpdmVQYXRoOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgICAgICBjb25zdCBmaWx0ZXI6IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZW5kcG9pbnRzID0gYXdhaXQgdGhpcy5maWRqR2V0RW5kcG9pbnRzKGZpbHRlcik7XG4gICAgICAgIGlmICghZW5kcG9pbnRzIHx8IGVuZHBvaW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KFxuICAgICAgICAgICAgICAgIG5ldyBFcnJvcig0MDAsXG4gICAgICAgICAgICAgICAgICAgICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTZW5kT25FbmRwb2ludCA6IGVuZHBvaW50IGRvZXMgbm90IGV4aXN0LicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbmRwb2ludFVybCA9IGVuZHBvaW50c1swXS51cmw7XG4gICAgICAgIGlmIChyZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgICAgIGVuZHBvaW50VXJsID0gdXJsam9pbihlbmRwb2ludFVybCwgcmVsYXRpdmVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBqd3QgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgICAgICBsZXQgYW5zd2VyO1xuICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBBamF4KCk7XG4gICAgICAgIHN3aXRjaCAodmVyYikge1xuICAgICAgICAgICAgY2FzZSAnUE9TVCcgOlxuICAgICAgICAgICAgICAgIGFuc3dlciA9IHF1ZXJ5LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdQVVQnIDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5wdXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdERUxFVEUnIDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5kZWxldGUoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZDogZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZDogZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnN3ZXI7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqR2V0SWRUb2tlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIC8vIEludGVybmFsIGZ1bmN0aW9uc1xuXG4gICAgLyoqXG4gICAgICogTG9nb3V0IHRoZW4gTG9naW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEBwYXJhbSB1cGRhdGVQcm9wZXJ0aWVzXG4gICAgICogQHRocm93cyB7RXJyb3JJbnRlcmZhY2V9XG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfbG9naW5JbnRlcm5hbChsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxDbGllbnRUb2tlbnM+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsJyk7XG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDQwMywgJ05lZWQgYW4gaW5pdGlhbGl6ZWQgRmlkalNlcnZpY2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5sb2dvdXQoKTtcblxuICAgICAgICBsZXQgY2xpZW50VG9rZW5zO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2xpZW50VG9rZW5zID0gdGhpcy5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsaWVudFRva2VucyA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbGllbnRUb2tlbnM7XG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBhc3luYyBfcmVtb3ZlQWxsKCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGFzeW5jIF9jcmVhdGVTZXNzaW9uKHVpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZGJzOiBFbmRwb2ludEludGVyZmFjZVtdID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSk7XG4gICAgICAgIGlmICghZGJzIHx8IGRicy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1NlZW1zIHRoYXQgeW91IGFyZSBpbiBEZW1vIG1vZGUgb3IgdXNpbmcgTm9kZSAobm8gcmVtb3RlIERCKS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlc3Npb24uc2V0UmVtb3RlKGRicyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHVpZCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYXN5bmMgX3Rlc3RQcm9taXNlKGE/KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rICcgKyBhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2snKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9zcnZEYXRhVW5pcUlkID0gMDtcblxuICAgIHByaXZhdGUgX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoYXBwTmFtZSwgdHlwZT8sIG5hbWU/KSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHNpbXBsZURhdGUgPSAnJyArIG5vdy5nZXRGdWxsWWVhcigpICsgJycgKyBub3cuZ2V0TW9udGgoKSArICcnICsgbm93LmdldERhdGUoKVxuICAgICAgICAgICAgKyAnJyArIG5vdy5nZXRIb3VycygpICsgJycgKyBub3cuZ2V0TWludXRlcygpOyAvLyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHNlcXVJZCA9ICsrSW50ZXJuYWxTZXJ2aWNlLl9zcnZEYXRhVW5pcUlkO1xuICAgICAgICBsZXQgVUlkID0gJyc7XG4gICAgICAgIGlmIChhcHBOYW1lICYmIGFwcE5hbWUuY2hhckF0KDApKSB7XG4gICAgICAgICAgICBVSWQgKz0gYXBwTmFtZS5jaGFyQXQoMCkgKyAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSB0eXBlLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSBuYW1lLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBVSWQgKz0gc2ltcGxlRGF0ZSArICcnICsgc2VxdUlkO1xuICAgICAgICByZXR1cm4gVUlkO1xuICAgIH1cblxufVxuIl19