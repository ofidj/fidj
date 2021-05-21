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
    fidjSendOnEndpoint(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = input.key ? { key: input.key } : null;
            const endpoints = yield this.fidjGetEndpoints(filter);
            if (!endpoints || endpoints.length !== 1) {
                throw new Error(400, 'fidj.sdk.service.fidjSendOnEndpoint : endpoint does not exist.');
            }
            let firstEndpointUrl = endpoints[0].url;
            if (input.relativePath) {
                firstEndpointUrl = urljoin(firstEndpointUrl, input.relativePath);
            }
            const jwt = yield this.connection.getIdToken();
            let answer;
            const query = new Ajax();
            switch (input.verb) {
                case 'POST':
                    answer = query.post({
                        url: firstEndpointUrl,
                        // not used : withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + jwt
                        },
                        data: input.data ? input.data : {}
                    });
                    break;
                case 'PUT':
                    answer = query.put({
                        url: firstEndpointUrl,
                        // not used : withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + jwt
                        },
                        data: input.data ? input.data : {}
                    });
                    break;
                case 'DELETE':
                    answer = query.delete({
                        url: firstEndpointUrl,
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
                        url: firstEndpointUrl,
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
    fidjForgotPasswordRequest(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const bestUrls = yield this.connection.getApiEndpoints({ filter: 'theBestOne' });
            if (!bestUrls || bestUrls.length !== 1) {
                throw new Error(400, 'fidj.sdk.service.fidjForgotPasswordRequest : api endpoint does not exist.');
            }
            const query = new Ajax();
            yield query.post({
                url: bestUrls[0].url + '/me/forgot',
                // not used : withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: { email }
            });
        });
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS90cmF2aXMvYnVpbGQvb2ZpZGovZmlkai9zcmMvIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQWlDO0FBQ2pDLHNEQUFzRDtBQUN0RCxpREFBaUQ7QUFDakQsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxLQUFLLFVBQVUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxLQUFLLE9BQU8sTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUt5RCxlQUFlLEVBQzlFLE1BQU0sY0FBYyxDQUFDO0FBRXRCLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDOUIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUcvQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsa0RBQWtEO0FBQ2xELCtDQUErQztBQUUvQyxtRUFBbUU7QUFFbkU7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGVBQWU7SUFTeEIsWUFBWSxNQUF1QixFQUFFLE9BQTJCLEVBQUUsT0FBMkM7UUFFekcsSUFBSSxDQUFDLEdBQUcsR0FBRztZQUNQLEdBQUcsRUFBRSxNQUFNO1lBQ1gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDO1FBQ0YsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMxQjtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFN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dkIsTUFBTSxVQUFVLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFO2NBQzlFLEVBQUUsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLDRCQUE0QjtRQUMvRSxNQUFNLE1BQU0sR0FBRyxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUM7UUFDaEQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM5QixHQUFHLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDakM7UUFDRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN6QixHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDL0I7UUFDRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN6QixHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDL0I7UUFDRCxHQUFHLElBQUksVUFBVSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFDaEMsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDOztBQXJCYyw4QkFBYyxHQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGInO1xuLy8gaW1wb3J0ICogYXMgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG4vLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG5pbXBvcnQgKiBhcyB2ZXJzaW9uIGZyb20gJy4uL3ZlcnNpb24nO1xuaW1wb3J0ICogYXMgdG9vbHMgZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0ICogYXMgY29ubmVjdGlvbiBmcm9tICcuLi9jb25uZWN0aW9uJztcbmltcG9ydCAqIGFzIHNlc3Npb24gZnJvbSAnLi4vc2Vzc2lvbic7XG5pbXBvcnQge1xuICAgIExvZ2dlckludGVyZmFjZSxcbiAgICBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSxcbiAgICBTZGtJbnRlcmZhY2UsXG4gICAgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlLCBFbmRwb2ludEZpbHRlckludGVyZmFjZSwgTG9nZ2VyTGV2ZWxFbnVtLCBFbmRwb2ludENhbGxJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7U2Vzc2lvbkNyeXB0b0ludGVyZmFjZX0gZnJvbSAnLi4vc2Vzc2lvbi9zZXNzaW9uJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuLi9jb25uZWN0aW9uL2FqYXgnO1xuaW1wb3J0IHtMb2dnZXJTZXJ2aWNlfSBmcm9tICcuL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7Q2xpZW50VG9rZW5zLCBDbGllbnRVc2VyfSBmcm9tICcuLi9jb25uZWN0aW9uJztcblxuY29uc3QgdXJsam9pbiA9IHJlcXVpcmUoJ3VybC1qb2luJyk7XG4vLyBpbXBvcnQge0xvY2FsU3RvcmFnZX0gZnJvbSAnbm9kZS1sb2NhbHN0b3JhZ2UnO1xuLy8gaW1wb3J0ICdsb2NhbHN0b3JhZ2UtcG9seWZpbGwvbG9jYWxTdG9yYWdlJztcblxuLy8gY29uc3QgUG91Y2hEQiA9IHdpbmRvd1snUG91Y2hEQiddIHx8IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0O1xuXG4vKipcbiAqIHBsZWFzZSB1c2UgaXRzIGFuZ3VsYXIuanMgb3IgYW5ndWxhci5pbyB3cmFwcGVyXG4gKiB1c2VmdWxsIG9ubHkgZm9yIGZpZGogZGV2IHRlYW1cbiAqL1xuZXhwb3J0IGNsYXNzIEludGVybmFsU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlO1xuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3I7XG4gICAgcHJpdmF0ZSBzdG9yYWdlOiB0b29scy5Mb2NhbFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBzZXNzaW9uOiBzZXNzaW9uLlNlc3Npb247XG4gICAgcHJpdmF0ZSBjb25uZWN0aW9uOiBjb25uZWN0aW9uLkNvbm5lY3Rpb247XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IExvZ2dlckludGVyZmFjZSwgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKSB7XG5cbiAgICAgICAgdGhpcy5zZGsgPSB7XG4gICAgICAgICAgICBvcmc6ICdmaWRqJyxcbiAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb24udmVyc2lvbixcbiAgICAgICAgICAgIHByb2Q6IGZhbHNlLFxuICAgICAgICAgICAgdXNlREI6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvZ2dlcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXJTZXJ2aWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sb2dMZXZlbCkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuc2V0TGV2ZWwob3B0aW9ucy5sb2dMZXZlbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UgOiBjb25zdHJ1Y3RvcicpO1xuICAgICAgICBsZXQgbHM7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXF1aXJlKCdsb2NhbHN0b3JhZ2UtcG9seWZpbGwnKTtcbiAgICAgICAgICAgIGxzID0gZ2xvYmFsWydsb2NhbFN0b3JhZ2UnXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgdG9vbHMuTG9jYWxTdG9yYWdlKGxzLCAnZmlkai4nKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gbmV3IHNlc3Npb24uU2Vzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdGlvbi5Db25uZWN0aW9uKHRoaXMuc2RrLCB0aGlzLnN0b3JhZ2UsIHRoaXMubG9nZ2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IGNvbm5lY3Rpb24gJiBzZXNzaW9uXG4gICAgICogQ2hlY2sgdXJpXG4gICAgICogRG9uZSBlYWNoIGFwcCBzdGFydFxuICAgICAqXG4gICAgICogQHBhcmFtIGZpZGpJZFxuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIHNldHRpbmdzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkaklkICByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpTYWx0IHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalZlcnNpb24gcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5kZXZNb2RlIG9wdGlvbmFsIGRlZmF1bHQgZmFsc2UsIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHJldHVybnNcbiAgICAgKiBAdGhyb3dzIHtFcnJvckludGVyZmFjZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgZmlkakluaXQoZmlkaklkOiBzdHJpbmcsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgICAvKmlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0QXV0aEVuZHBvaW50KG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXREQkVuZHBvaW50KG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCk7XG4gICAgICAgIH0qL1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxvZ0xldmVsKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5zZXRMZXZlbChvcHRpb25zLmxvZ0xldmVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLnNldExldmVsKExvZ2dlckxldmVsRW51bS5OT05FKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6ICcsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoIWZpZGpJZCkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgOiBiYWQgaW5pdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgYSBmaWRqSWQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNkay5wcm9kID0gIW9wdGlvbnMgPyB0cnVlIDogb3B0aW9ucy5wcm9kO1xuICAgICAgICB0aGlzLnNkay51c2VEQiA9ICFvcHRpb25zID8gZmFsc2UgOiBvcHRpb25zLnVzZURCO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZmlkaklkID0gZmlkaklkO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZmlkalZlcnNpb24gPSB0aGlzLnNkay52ZXJzaW9uO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZmlkakNyeXB0byA9ICghb3B0aW9ucyB8fCAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY3J5cHRvJykpID8gZmFsc2UgOiBvcHRpb25zLmNyeXB0bztcblxuICAgICAgICBsZXQgYmVzdFVybHMsIGJlc3RPbGRVcmxzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTtcbiAgICAgICAgICAgIGJlc3RVcmxzID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9uZSd9KTtcbiAgICAgICAgICAgIGJlc3RPbGRVcmxzID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9sZE9uZSd9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdDogJywgZXJyKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig1MDAsIGVyci50b1N0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYmVzdFVybHMgfHwgIWJlc3RPbGRVcmxzIHx8IChiZXN0VXJscy5sZW5ndGggPT09IDAgJiYgYmVzdE9sZFVybHMubGVuZ3RoID09PSAwKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDQwNCwgJ05lZWQgb25lIGNvbm5lY3Rpb24gLSBvciB0b28gb2xkIFNESyB2ZXJzaW9uIChjaGVjayB1cGRhdGUpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdGhlQmVzdEZpcnN0VXJsID0gYmVzdFVybHNbMF07XG4gICAgICAgIGxldCB0aGVCZXN0Rmlyc3RPbGRVcmwgPSBiZXN0T2xkVXJsc1swXTtcbiAgICAgICAgY29uc3QgaXNMb2dpbiA9IHRoaXMuZmlkaklzTG9naW4oKTtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0ID4gdmVyaWZ5Q29ubmVjdGlvblN0YXRlcyA6ICcsIHRoZUJlc3RGaXJzdFVybCwgdGhlQmVzdEZpcnN0T2xkVXJsLCBpc0xvZ2luKTtcblxuICAgICAgICBpZiAodGhlQmVzdEZpcnN0VXJsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudCh0aGlzLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0Rmlyc3RVcmwudXJsLCB0aGlzLnN0b3JhZ2UsIHRoaXMuc2RrKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudCh0aGlzLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0Rmlyc3RPbGRVcmwudXJsLCB0aGlzLnN0b3JhZ2UsIHRoaXMuc2RrKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBpdCBpZiBmaWRqSXNMb2dpbigpID09PSBmYWxzZVxuICAgICAqIEVyYXNlIGFsbCAoZGIgJiBzdG9yYWdlKVxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHRocm93cyB7RXJyb3JJbnRlcmZhY2V9XG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIGZpZGpMb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxDbGllbnRVc2VyPiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqTG9naW4nKTtcbiAgICAgICAgaWYgKCF0aGlzLmNvbm5lY3Rpb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoNDA0LCAnTmVlZCBhbiBpbml0aWFsaXplZCBGaWRqU2VydmljZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2NyZWF0ZVNlc3Npb24odGhpcy5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICBjb25zdCBjbGllbnRUb2tlbnMgPSBhd2FpdCB0aGlzLl9sb2dpbkludGVybmFsKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbihjbGllbnRUb2tlbnMpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig1MDAsIGVyci50b1N0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uZ2V0VXNlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2Vzc2lvbi5zeW5jKHRoaXMuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqTG9naW46IHN5bmMgLW5vdCBibG9ja2luZy0gaXNzdWUgICcsIGUudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRVc2VyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmFjY2Vzc1Rva2VuIG9wdGlvbmFsXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaWRUb2tlbiAgb3B0aW9uYWxcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBmaWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBnZW5lcmF0ZSBvbmUgZGF5IHRva2VucyBpZiBub3Qgc2V0XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIG5vdy5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93ID0gbm93LmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICByb2xlczogW10sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2RlbW8nLFxuICAgICAgICAgICAgICAgIGFwaXM6IFtdLFxuICAgICAgICAgICAgICAgIGVuZHBvaW50czogW10sXG4gICAgICAgICAgICAgICAgZGJzOiBbXSxcbiAgICAgICAgICAgICAgICBleHA6IHRvbW9ycm93XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zdCBqd3RTaWduID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBqd3RTaWduICsgJy4nICsgcGF5bG9hZCArICcuJyArIGp3dFNpZ247XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICBpZFRva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbk9mZmxpbmUob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqTG9naW5JbkRlbW9Nb2RlIGVycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqSXNMb2dpbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5pc0xvZ2luKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqR2V0RW5kcG9pbnRzKGZpbHRlcj86IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlKTogUHJvbWlzZTxBcnJheTxFbmRwb2ludEludGVyZmFjZT4+IHtcblxuICAgICAgICBpZiAoIWZpbHRlcikge1xuICAgICAgICAgICAgZmlsdGVyID0ge3Nob3dCbG9ja2VkOiBmYWxzZX07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXAgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0QWNjZXNzUGF5bG9hZCh7ZW5kcG9pbnRzOiBbXX0pO1xuICAgICAgICBsZXQgZW5kcG9pbnRzID0gSlNPTi5wYXJzZShhcCkuZW5kcG9pbnRzO1xuICAgICAgICBpZiAoIWVuZHBvaW50cyB8fCAhQXJyYXkuaXNBcnJheShlbmRwb2ludHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBlbmRwb2ludHMgPSBlbmRwb2ludHMuZmlsdGVyKChlbmRwb2ludDogRW5kcG9pbnRJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgIGxldCBvayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob2sgJiYgZmlsdGVyLmtleSkge1xuICAgICAgICAgICAgICAgIG9rID0gKGVuZHBvaW50LmtleSA9PT0gZmlsdGVyLmtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2sgJiYgIWZpbHRlci5zaG93QmxvY2tlZCkge1xuICAgICAgICAgICAgICAgIG9rID0gIWVuZHBvaW50LmJsb2NrZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2s7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkalJvbGVzKCk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHtyb2xlczogW119KSkucm9sZXM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqTWVzc2FnZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkakxvZ291dChmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkgJiYgIWZvcmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5sb2dvdXQoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YSBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhX0FyZyBhcmcgdG8gc2V0IHRvIGZuSW5pdEZpcnN0RGF0YSgpXG4gICAgICogQHJldHVybnMgIHByb21pc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhPywgZm5Jbml0Rmlyc3REYXRhX0FyZz8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jJyk7XG4gICAgICAgIC8vIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAvLyAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyA6IERCIHN5bmMgaW1wb3NzaWJsZS4gRGlkIHlvdSBsb2dpbiA/Jyk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmM6IHlvdSBhciBub3QgdXNpbmcgREIgLSBubyBzeW5jIGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpcnN0U3luYyA9IChzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9PT0gbnVsbCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgcmVzb2x2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHdhcm46ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGlzRW1wdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIGlzRW1wdHkgOiAnLCBpc0VtcHR5LCBmaXJzdFN5bmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlRW1wdHksIHJlamVjdEVtcHR5Tm90VXNlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRW1wdHkgJiYgZmlyc3RTeW5jICYmIGZuSW5pdEZpcnN0RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGZuSW5pdEZpcnN0RGF0YShmbkluaXRGaXJzdERhdGFfQXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICYmIHJldFsnY2F0Y2gnXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldC50aGVuKHJlc29sdmVFbXB0eSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZyhyZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVFbXB0eSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgZm5Jbml0Rmlyc3REYXRhIHJlc29sdmVkOiAnLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pbmZvKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5kb2NfY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50ID0gcmVzdWx0LmRvY19jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgX2RiUmVjb3JkQ291bnQgOiAnICsgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ucmVmcmVzaENvbm5lY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZWZyZXNoQ29ubmVjdGlvbiBkb25lIDogJywgdXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTsgLy8gc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9ySW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZWZyZXNoQ29ubmVjdGlvbiBmYWlsZWQgOiAnLCBlcnIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSA0MDMgfHwgZXJyLmNvZGUgPT09IDQxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlkakxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIHdoYXQgdG8gZG8gd2l0aCB0aGlzIGVyciA/XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJNZXNzYWdlID0gJ0Vycm9yIGR1cmluZyBzeW5jaHJvbmlzYXRpb246ICcgKyBlcnIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKGVyck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA1MDAsIHJlYXNvbjogZXJyTWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqUHV0SW5EYihkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalB1dEluRGI6ICcsIGRhdGEpO1xuICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalB1dEluRGI6IHlvdSBhcmUgbm90IHVzaW5nIERCIC0gbm8gcHV0IGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoJ05BJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnREIgcHV0IGltcG9zc2libGUuIE5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF9pZDogc3RyaW5nO1xuICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoZGF0YSkuaW5kZXhPZignX2lkJykpIHtcbiAgICAgICAgICAgIF9pZCA9IGRhdGEuX2lkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX2lkKSB7XG4gICAgICAgICAgICBfaWQgPSBzZWxmLl9nZW5lcmF0ZU9iamVjdFVuaXF1ZUlkKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2VuY3J5cHQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnB1dChcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSxcbiAgICAgICAgICAgIHNlbGYuc2RrLm9yZyxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqVmVyc2lvbixcbiAgICAgICAgICAgIGNyeXB0byk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqUmVtb3ZlSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpSZW1vdmVJbkRiICcsIGRhdGFfaWQpO1xuICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalJlbW92ZUluRGI6IHlvdSBhcmUgbm90IHVzaW5nIERCIC0gbm8gcmVtb3ZlIGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGF0YV9pZCB8fCB0eXBlb2YgZGF0YV9pZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdEQiByZW1vdmUgaW1wb3NzaWJsZS4gJyArXG4gICAgICAgICAgICAgICAgJ05lZWQgdGhlIGRhdGEuX2lkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucmVtb3ZlKGRhdGFfaWQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkakZpbmRJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLnNkay51c2VEQikge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpGaW5kSW5EYjogeW91IGFyZSBub3QgdXNpbmcgREIgLSBubyBmaW5kIGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdGaW5kIHBiIDogbmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICcgTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldChkYXRhX2lkLCBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkakZpbmRBbGxJbkRiKCk6IFByb21pc2U8QXJyYXk8YW55PiB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqRmluZEFsbEluRGI6IHlvdSBhcmUgbm90IHVzaW5nIERCIC0gbm8gZmluZCBhdmFpbGFibGUuJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXRBbGwoY3J5cHRvKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZXNvbHZlKChyZXN1bHRzIGFzIEFycmF5PGFueT4pKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkalNlbmRPbkVuZHBvaW50KGlucHV0OiBFbmRwb2ludENhbGxJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXI6IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlID0gaW5wdXQua2V5ID8ge2tleTogaW5wdXQua2V5fSA6IG51bGw7XG4gICAgICAgIGNvbnN0IGVuZHBvaW50cyA9IGF3YWl0IHRoaXMuZmlkakdldEVuZHBvaW50cyhmaWx0ZXIpO1xuICAgICAgICBpZiAoIWVuZHBvaW50cyB8fCBlbmRwb2ludHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoNDAwLCAnZmlkai5zZGsuc2VydmljZS5maWRqU2VuZE9uRW5kcG9pbnQgOiBlbmRwb2ludCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaXJzdEVuZHBvaW50VXJsID0gZW5kcG9pbnRzWzBdLnVybDtcbiAgICAgICAgaWYgKGlucHV0LnJlbGF0aXZlUGF0aCkge1xuICAgICAgICAgICAgZmlyc3RFbmRwb2ludFVybCA9IHVybGpvaW4oZmlyc3RFbmRwb2ludFVybCwgaW5wdXQucmVsYXRpdmVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBqd3QgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgICAgICBsZXQgYW5zd2VyO1xuICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBBamF4KCk7XG4gICAgICAgIHN3aXRjaCAoaW5wdXQudmVyYikge1xuICAgICAgICAgICAgY2FzZSAnUE9TVCcgOlxuICAgICAgICAgICAgICAgIGFuc3dlciA9IHF1ZXJ5LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGZpcnN0RW5kcG9pbnRVcmwsXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkIDogd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgand0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGlucHV0LmRhdGEgPyBpbnB1dC5kYXRhIDoge31cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1BVVCcgOlxuICAgICAgICAgICAgICAgIGFuc3dlciA9IHF1ZXJ5LnB1dCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogZmlyc3RFbmRwb2ludFVybCxcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHVzZWQgOiB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBqd3RcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5wdXQuZGF0YSA/IGlucHV0LmRhdGEgOiB7fVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnREVMRVRFJyA6XG4gICAgICAgICAgICAgICAgYW5zd2VyID0gcXVlcnkuZGVsZXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBmaXJzdEVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZDogZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGZpcnN0RW5kcG9pbnRVcmwsXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkIDogd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgand0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkOiBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlcjtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpGb3Jnb3RQYXNzd29yZFJlcXVlc3QoZW1haWw6IFN0cmluZykge1xuXG4gICAgICAgIGNvbnN0IGJlc3RVcmxzID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9uZSd9KTtcbiAgICAgICAgaWYgKCFiZXN0VXJscyB8fGJlc3RVcmxzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDQwMCwgJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakZvcmdvdFBhc3N3b3JkUmVxdWVzdCA6IGFwaSBlbmRwb2ludCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gbmV3IEFqYXgoKTtcbiAgICAgICAgYXdhaXQgcXVlcnkucG9zdCh7XG4gICAgICAgICAgICB1cmw6IGJlc3RVcmxzWzBdLnVybCArICcvbWUvZm9yZ290JyxcbiAgICAgICAgICAgIC8vIG5vdCB1c2VkIDogd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiB7ZW1haWx9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaWRqR2V0SWRUb2tlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIC8vIEludGVybmFsIGZ1bmN0aW9uc1xuXG4gICAgLyoqXG4gICAgICogTG9nb3V0IHRoZW4gTG9naW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEBwYXJhbSB1cGRhdGVQcm9wZXJ0aWVzXG4gICAgICogQHRocm93cyB7RXJyb3JJbnRlcmZhY2V9XG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfbG9naW5JbnRlcm5hbChsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxDbGllbnRUb2tlbnM+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsJyk7XG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDQwMywgJ05lZWQgYW4gaW5pdGlhbGl6ZWQgRmlkalNlcnZpY2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5sb2dvdXQoKTtcblxuICAgICAgICBsZXQgY2xpZW50VG9rZW5zO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2xpZW50VG9rZW5zID0gdGhpcy5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNsaWVudFRva2VucyA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbGllbnRUb2tlbnM7XG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBhc3luYyBfcmVtb3ZlQWxsKCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGFzeW5jIF9jcmVhdGVTZXNzaW9uKHVpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZGJzOiBFbmRwb2ludEludGVyZmFjZVtdID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSk7XG4gICAgICAgIGlmICghZGJzIHx8IGRicy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1NlZW1zIHRoYXQgeW91IGFyZSBpbiBEZW1vIG1vZGUgb3IgdXNpbmcgTm9kZSAobm8gcmVtb3RlIERCKS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlc3Npb24uc2V0UmVtb3RlKGRicyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHVpZCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYXN5bmMgX3Rlc3RQcm9taXNlKGE/KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rICcgKyBhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2snKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9zcnZEYXRhVW5pcUlkID0gMDtcblxuICAgIHByaXZhdGUgX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoYXBwTmFtZSwgdHlwZT8sIG5hbWU/KSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHNpbXBsZURhdGUgPSAnJyArIG5vdy5nZXRGdWxsWWVhcigpICsgJycgKyBub3cuZ2V0TW9udGgoKSArICcnICsgbm93LmdldERhdGUoKVxuICAgICAgICAgICAgKyAnJyArIG5vdy5nZXRIb3VycygpICsgJycgKyBub3cuZ2V0TWludXRlcygpOyAvLyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHNlcXVJZCA9ICsrSW50ZXJuYWxTZXJ2aWNlLl9zcnZEYXRhVW5pcUlkO1xuICAgICAgICBsZXQgVUlkID0gJyc7XG4gICAgICAgIGlmIChhcHBOYW1lICYmIGFwcE5hbWUuY2hhckF0KDApKSB7XG4gICAgICAgICAgICBVSWQgKz0gYXBwTmFtZS5jaGFyQXQoMCkgKyAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSB0eXBlLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSBuYW1lLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBVSWQgKz0gc2ltcGxlRGF0ZSArICcnICsgc2VxdUlkO1xuICAgICAgICByZXR1cm4gVUlkO1xuICAgIH1cblxufVxuIl19