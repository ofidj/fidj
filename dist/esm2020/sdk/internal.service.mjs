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
import urljoin from 'url-join';
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
            import('localstorage-polyfill');
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
    async fidjInit(fidjId, options) {
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
            await this.connection.verifyConnectionStates();
            bestUrls = await this.connection.getApiEndpoints({ filter: 'theBestOne' });
            bestOldUrls = await this.connection.getApiEndpoints({ filter: 'theBestOldOne' });
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
    async fidjLogin(login, password) {
        this.logger.log('fidj.sdk.service.fidjLogin');
        if (!this.connection.isReady()) {
            throw new Error(404, 'Need an initialized FidjService');
        }
        try {
            await this._removeAll();
            await this.connection.verifyConnectionStates();
            await this._createSession(this.connection.fidjId);
            const clientTokens = await this._loginInternal(login, password);
            await this.connection.setConnection(clientTokens);
        }
        catch (err) {
            throw new Error(500, err.toString());
        }
        if (!this.sdk.useDB) {
            return this.connection.getUser();
        }
        try {
            await this.session.sync(this.connection.getClientId());
        }
        catch (e) {
            this.logger.warn('fidj.sdk.service.fidjLogin: sync -not blocking- issue  ', e.toString());
        }
        return this.connection.getUser();
    }
    /**
     *
     * @param options
     * @param options.accessToken optional
     * @param options.idToken  optional
     * @returns
     */
    async fidjLoginInDemoMode(options) {
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
                .then(async () => {
                await self.connection.setConnectionOffline(options);
                resolve(self.connection.getUser());
            })
                .catch((err) => {
                self.logger.error('fidj.sdk.service.fidjLoginInDemoMode error: ', err);
                reject(err);
            });
        });
    }
    ;
    fidjIsLogin() {
        return this.connection.isLogin();
    }
    ;
    async fidjGetEndpoints(filter) {
        if (!filter) {
            filter = { showBlocked: false };
        }
        const ap = await this.connection.getAccessPayload({ endpoints: [] });
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
    }
    ;
    async fidjRoles() {
        return JSON.parse(await this.connection.getIdPayload({ roles: [] })).roles;
    }
    ;
    async fidjMessage() {
        return JSON.parse(await this.connection.getIdPayload({ message: '' })).message;
    }
    ;
    async fidjLogout(force) {
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
    async fidjSync(fnInitFirstData, fnInitFirstData_Arg) {
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
                    resolveEmpty(null); // self.connection.getUser());
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
    }
    ;
    async fidjPutInDb(data) {
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
    }
    ;
    async fidjRemoveInDb(data_id) {
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
    }
    ;
    async fidjFindInDb(data_id) {
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
    }
    ;
    async fidjFindAllInDb() {
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
    }
    ;
    async fidjSendOnEndpoint(input) {
        const filter = input.key ? { key: input.key } : null;
        const endpoints = await this.fidjGetEndpoints(filter);
        if (!input.defaultKeyUrl && (!endpoints || endpoints.length !== 1)) {
            throw new Error(400, 'fidj.sdk.service.fidjSendOnEndpoint : endpoint does not exist.');
        }
        let firstEndpointUrl = (!endpoints || endpoints.length !== 1) ? input.defaultKeyUrl : endpoints[0].url;
        if (input.relativePath) {
            firstEndpointUrl = urljoin(firstEndpointUrl, input.relativePath);
        }
        const jwt = await this.connection.getIdToken();
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
                    data: input.data ? input.data : {},
                    timeout: input.timeout
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
                    data: input.data ? input.data : {},
                    timeout: input.timeout
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
                    timeout: input.timeout
                    // not used: data: data
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
                    timeout: input.timeout
                    // not used: data: data
                });
        }
        return answer;
    }
    ;
    async fidjForgotPasswordRequest(email) {
        const bestUrls = await this.connection.getApiEndpoints({ filter: 'theBestOne' });
        if (!bestUrls || bestUrls.length !== 1) {
            throw new Error(400, 'fidj.sdk.service.fidjForgotPasswordRequest : api endpoint does not exist.');
        }
        const query = new Ajax();
        await query.post({
            url: bestUrls[0].url + '/me/forgot',
            // not used : withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: { email }
        });
    }
    async fidjGetIdToken() {
        return this.connection.getIdToken();
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
    async _loginInternal(login, password, updateProperties) {
        this.logger.log('fidj.sdk.service._loginInternal');
        if (!this.connection.isReady()) {
            throw new Error(403, 'Need an initialized FidjService');
        }
        await this.connection.logout();
        let clientTokens;
        try {
            clientTokens = this.connection.getClient().login(login, password, updateProperties);
        }
        catch (e) {
            clientTokens = await this.connection.getClient().login(login, password, updateProperties);
        }
        return clientTokens;
    }
    ;
    async _removeAll() {
        await this.connection.destroy();
        await this.session.destroy();
    }
    ;
    async _createSession(uid) {
        const dbs = await this.connection.getDBs({ filter: 'theBestOnes' });
        if (!dbs || dbs.length === 0) {
            this.logger.warn('Seems that you are in Demo mode or using Node (no remote DB).');
        }
        this.session.setRemote(dbs);
        return this.session.create(uid);
    }
    ;
    async _testPromise(a) {
        if (a) {
            return this.promise.resolve('test promise ok ' + a);
        }
        return new this.promise((resolve, reject) => {
            resolve('test promise ok');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQ0FBaUM7QUFDakMsc0RBQXNEO0FBQ3RELGlEQUFpRDtBQUNqRCxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEtBQUssVUFBVSxNQUFNLGVBQWUsQ0FBQztBQUU1QyxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBTUgsZUFBZSxFQUlsQixNQUFNLGNBQWMsQ0FBQztBQUV0QixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDL0MsT0FBTyxPQUFPLE1BQU0sVUFBVSxDQUFDO0FBQy9CLGtEQUFrRDtBQUNsRCwrQ0FBK0M7QUFFL0MsbUVBQW1FO0FBRW5FOzs7R0FHRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBU3hCLFlBQVksTUFBdUIsRUFBRSxPQUEyQixFQUFFLE9BQTJDO1FBRXpHLElBQUksQ0FBQyxHQUFHLEdBQUc7WUFDUCxHQUFHLEVBQUUsTUFBTTtZQUNYLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztZQUN4QixJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUNGLElBQUksT0FBTyxFQUFFO1lBQ1QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDMUI7UUFDRCxJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQ3hCO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxH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QUFHLE1BQU0sQ0FBQztRQUNoQyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7O0FBckJjLDhCQUFjLEdBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYic7XG4vLyBpbXBvcnQgKiBhcyBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbmltcG9ydCAqIGFzIHZlcnNpb24gZnJvbSAnLi4vdmVyc2lvbic7XG5pbXBvcnQgKiBhcyB0b29scyBmcm9tICcuLi90b29scyc7XG5pbXBvcnQgKiBhcyBjb25uZWN0aW9uIGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHtDbGllbnRUb2tlbnMsIENsaWVudFVzZXJ9IGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0ICogYXMgc2Vzc2lvbiBmcm9tICcuLi9zZXNzaW9uJztcbmltcG9ydCB7XG4gICAgRW5kcG9pbnRDYWxsSW50ZXJmYWNlLFxuICAgIEVuZHBvaW50RmlsdGVySW50ZXJmYWNlLFxuICAgIEVuZHBvaW50SW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLFxuICAgIExvZ2dlckludGVyZmFjZSxcbiAgICBMb2dnZXJMZXZlbEVudW0sXG4gICAgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgU2RrSW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge1Nlc3Npb25DcnlwdG9JbnRlcmZhY2V9IGZyb20gJy4uL3Nlc3Npb24vc2Vzc2lvbic7XG5pbXBvcnQge0Vycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi4vY29ubmVjdGlvbi9hamF4JztcbmltcG9ydCB7TG9nZ2VyU2VydmljZX0gZnJvbSAnLi9sb2dnZXIuc2VydmljZSc7XG5pbXBvcnQgdXJsam9pbiBmcm9tICd1cmwtam9pbic7XG4vLyBpbXBvcnQge0xvY2FsU3RvcmFnZX0gZnJvbSAnbm9kZS1sb2NhbHN0b3JhZ2UnO1xuLy8gaW1wb3J0ICdsb2NhbHN0b3JhZ2UtcG9seWZpbGwvbG9jYWxTdG9yYWdlJztcblxuLy8gY29uc3QgUG91Y2hEQiA9IHdpbmRvd1snUG91Y2hEQiddIHx8IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0O1xuXG4vKipcbiAqIHBsZWFzZSB1c2UgaXRzIGFuZ3VsYXIuanMgb3IgYW5ndWxhci5pbyB3cmFwcGVyXG4gKiB1c2VmdWxsIG9ubHkgZm9yIGZpZGogZGV2IHRlYW1cbiAqL1xuZXhwb3J0IGNsYXNzIEludGVybmFsU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlO1xuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3I7XG4gICAgcHJpdmF0ZSBzdG9yYWdlOiB0b29scy5Mb2NhbFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBzZXNzaW9uOiBzZXNzaW9uLlNlc3Npb247XG4gICAgcHJpdmF0ZSBjb25uZWN0aW9uOiBjb25uZWN0aW9uLkNvbm5lY3Rpb247XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IExvZ2dlckludGVyZmFjZSwgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKSB7XG5cbiAgICAgICAgdGhpcy5zZGsgPSB7XG4gICAgICAgICAgICBvcmc6ICdmaWRqJyxcbiAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb24udmVyc2lvbixcbiAgICAgICAgICAgIHByb2Q6IGZhbHNlLFxuICAgICAgICAgICAgdXNlREI6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvZ2dlcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXJTZXJ2aWNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sb2dMZXZlbCkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuc2V0TGV2ZWwob3B0aW9ucy5sb2dMZXZlbCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UgOiBjb25zdHJ1Y3RvcicpO1xuICAgICAgICBsZXQgbHM7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbHMgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbXBvcnQoJ2xvY2Fsc3RvcmFnZS1wb2x5ZmlsbCcpO1xuICAgICAgICAgICAgbHMgPSBnbG9iYWxbJ2xvY2FsU3RvcmFnZSddO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IG5ldyB0b29scy5Mb2NhbFN0b3JhZ2UobHMsICdmaWRqLicpO1xuICAgICAgICB0aGlzLnNlc3Npb24gPSBuZXcgc2Vzc2lvbi5TZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG5ldyBjb25uZWN0aW9uLkNvbm5lY3Rpb24odGhpcy5zZGssIHRoaXMuc3RvcmFnZSwgdGhpcy5sb2dnZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgY29ubmVjdGlvbiAmIHNlc3Npb25cbiAgICAgKiBDaGVjayB1cmlcbiAgICAgKiBEb25lIGVhY2ggYXBwIHN0YXJ0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmlkaklkXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqSWQgIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalNhbHQgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqVmVyc2lvbiByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmRldk1vZGUgb3B0aW9uYWwgZGVmYXVsdCBmYWxzZSwgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqIEB0aHJvd3Mge0Vycm9ySW50ZXJmYWNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBmaWRqSW5pdChmaWRqSWQ6IHN0cmluZywgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIC8qaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWRFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXRBdXRoRW5kcG9pbnQob3B0aW9ucy5mb3JjZWRFbmRwb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldERCRW5kcG9pbnQob3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KTtcbiAgICAgICAgfSovXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubG9nTGV2ZWwpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLnNldExldmVsKG9wdGlvbnMubG9nTGV2ZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuc2V0TGV2ZWwoTG9nZ2VyTGV2ZWxFbnVtLk5PTkUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogJywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghZmlkaklkKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6IGJhZCBpbml0Jyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhIGZpZGpJZCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2RrLnByb2QgPSAhb3B0aW9ucyA/IHRydWUgOiBvcHRpb25zLnByb2Q7XG4gICAgICAgIHRoaXMuc2RrLnVzZURCID0gIW9wdGlvbnMgPyBmYWxzZSA6IG9wdGlvbnMudXNlREI7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5maWRqSWQgPSBmaWRqSWQ7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5maWRqVmVyc2lvbiA9IHRoaXMuc2RrLnZlcnNpb247XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5maWRqQ3J5cHRvID0gKCFvcHRpb25zIHx8ICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjcnlwdG8nKSkgPyBmYWxzZSA6IG9wdGlvbnMuY3J5cHRvO1xuXG4gICAgICAgIGxldCBiZXN0VXJscywgYmVzdE9sZFVybHM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24udmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpO1xuICAgICAgICAgICAgYmVzdFVybHMgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T25lJ30pO1xuICAgICAgICAgICAgYmVzdE9sZFVybHMgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T2xkT25lJ30pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0OiAnLCBlcnIpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFiZXN0VXJscyB8fCAhYmVzdE9sZFVybHMgfHwgKGJlc3RVcmxzLmxlbmd0aCA9PT0gMCAmJiBiZXN0T2xkVXJscy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoNDA0LCAnTmVlZCBvbmUgY29ubmVjdGlvbiAtIG9yIHRvbyBvbGQgU0RLIHZlcnNpb24gKGNoZWNrIHVwZGF0ZSknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0aGVCZXN0Rmlyc3RVcmwgPSBiZXN0VXJsc1swXTtcbiAgICAgICAgbGV0IHRoZUJlc3RGaXJzdE9sZFVybCA9IGJlc3RPbGRVcmxzWzBdO1xuICAgICAgICBjb25zdCBpc0xvZ2luID0gdGhpcy5maWRqSXNMb2dpbigpO1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgPiB2ZXJpZnlDb25uZWN0aW9uU3RhdGVzIDogJywgdGhlQmVzdEZpcnN0VXJsLCB0aGVCZXN0Rmlyc3RPbGRVcmwsIGlzTG9naW4pO1xuXG4gICAgICAgIGlmICh0aGVCZXN0Rmlyc3RVcmwpIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHRoaXMuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RGaXJzdFVybC51cmwsIHRoaXMuc3RvcmFnZSwgdGhpcy5zZGspKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHRoaXMuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RGaXJzdE9sZFVybC51cmwsIHRoaXMuc3RvcmFnZSwgdGhpcy5zZGspKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGl0IGlmIGZpZGpJc0xvZ2luKCkgPT09IGZhbHNlXG4gICAgICogRXJhc2UgYWxsIChkYiAmIHN0b3JhZ2UpXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAdGhyb3dzIHtFcnJvckludGVyZmFjZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgZmlkakxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPENsaWVudFVzZXI+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbicpO1xuICAgICAgICBpZiAoIXRoaXMuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig0MDQsICdOZWVkIGFuIGluaXRpYWxpemVkIEZpZGpTZXJ2aWNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24udmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fY3JlYXRlU2Vzc2lvbih0aGlzLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudFRva2VucyA9IGF3YWl0IHRoaXMuX2xvZ2luSW50ZXJuYWwobG9naW4sIHBhc3N3b3JkKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zZXRDb25uZWN0aW9uKGNsaWVudFRva2Vucyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnNkay51c2VEQikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRVc2VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXNzaW9uLnN5bmModGhpcy5jb25uZWN0aW9uLmdldENsaWVudElkKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbjogc3luYyAtbm90IGJsb2NraW5nLSBpc3N1ZSAgJywgZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmdldFVzZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYWNjZXNzVG9rZW4gb3B0aW9uYWxcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pZFRva2VuICBvcHRpb25hbFxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIGZpZGpMb2dpbkluRGVtb01vZGUob3B0aW9ucz86IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIG9uZSBkYXkgdG9rZW5zIGlmIG5vdCBzZXRcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbm93LnNldERhdGUobm93LmdldERhdGUoKSArIDEpO1xuICAgICAgICAgICAgY29uc3QgdG9tb3Jyb3cgPSBub3cuZ2V0VGltZSgpO1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHJvbGVzOiBbXSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnZGVtbycsXG4gICAgICAgICAgICAgICAgYXBpczogW10sXG4gICAgICAgICAgICAgICAgZW5kcG9pbnRzOiBbXSxcbiAgICAgICAgICAgICAgICBkYnM6IFtdLFxuICAgICAgICAgICAgICAgIGV4cDogdG9tb3Jyb3dcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGp3dFNpZ24gPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHt9KSk7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGp3dFNpZ24gKyAnLicgKyBwYXlsb2FkICsgJy4nICsgand0U2lnbjtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IHRva2VuLFxuICAgICAgICAgICAgICAgIGlkVG9rZW46IHRva2VuLFxuICAgICAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlbGYuY29ubmVjdGlvbi5zZXRDb25uZWN0aW9uT2ZmbGluZShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbkluRGVtb01vZGUgZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpJc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmlzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpHZXRFbmRwb2ludHMoZmlsdGVyPzogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UpOiBQcm9taXNlPEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPj4ge1xuXG4gICAgICAgIGlmICghZmlsdGVyKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSB7c2hvd0Jsb2NrZWQ6IGZhbHNlfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcCA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRBY2Nlc3NQYXlsb2FkKHtlbmRwb2ludHM6IFtdfSk7XG4gICAgICAgIGxldCBlbmRwb2ludHMgPSBKU09OLnBhcnNlKGFwKS5lbmRwb2ludHM7XG4gICAgICAgIGlmICghZW5kcG9pbnRzIHx8ICFBcnJheS5pc0FycmF5KGVuZHBvaW50cykpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZHBvaW50cyA9IGVuZHBvaW50cy5maWx0ZXIoKGVuZHBvaW50OiBFbmRwb2ludEludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChvayAmJiBmaWx0ZXIua2V5KSB7XG4gICAgICAgICAgICAgICAgb2sgPSAoZW5kcG9pbnQua2V5ID09PSBmaWx0ZXIua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvayAmJiAhZmlsdGVyLnNob3dCbG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgb2sgPSAhZW5kcG9pbnQuYmxvY2tlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvaztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqUm9sZXMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcztcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpNZXNzYWdlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2U7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqTG9nb3V0KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGFfQXJnIGFyZyB0byBzZXQgdG8gZm5Jbml0Rmlyc3REYXRhKClcbiAgICAgKiBAcmV0dXJucyAgcHJvbWlzZVxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBmaWRqU3luYyhmbkluaXRGaXJzdERhdGE/LCBmbkluaXRGaXJzdERhdGFfQXJnPyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMnKTtcbiAgICAgICAgLy8gaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIDogREIgc3luYyBpbXBvc3NpYmxlLiBEaWQgeW91IGxvZ2luID8nKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGlmICghc2VsZi5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYzogeW91IGFyIG5vdCB1c2luZyBEQiAtIG5vIHN5bmMgYXZhaWxhYmxlLicpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlyc3RTeW5jID0gKHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID09PSBudWxsKTtcblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uc3luYyhzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLndhcm4oJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgd2FybjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaXNFbXB0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgaXNFbXB0eSA6ICcsIGlzRW1wdHksIGZpcnN0U3luYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmVFbXB0eSwgcmVqZWN0RW1wdHlOb3RVc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eSAmJiBmaXJzdFN5bmMgJiYgZm5Jbml0Rmlyc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gZm5Jbml0Rmlyc3REYXRhKGZuSW5pdEZpcnN0RGF0YV9BcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgJiYgcmV0WydjYXRjaCddIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnRoZW4ocmVzb2x2ZUVtcHR5KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUVtcHR5KG51bGwpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgZm5Jbml0Rmlyc3REYXRhIHJlc29sdmVkOiAnLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pbmZvKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5kb2NfY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50ID0gcmVzdWx0LmRvY19jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgX2RiUmVjb3JkQ291bnQgOiAnICsgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ucmVmcmVzaENvbm5lY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZWZyZXNoQ29ubmVjdGlvbiBkb25lIDogJywgdXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTsgLy8gc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9ySW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZWZyZXNoQ29ubmVjdGlvbiBmYWlsZWQgOiAnLCBlcnIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSA0MDMgfHwgZXJyLmNvZGUgPT09IDQxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlkakxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIHdoYXQgdG8gZG8gd2l0aCB0aGlzIGVyciA/XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJNZXNzYWdlID0gJ0Vycm9yIGR1cmluZyBzeW5jaHJvbmlzYXRpb246ICcgKyBlcnIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKGVyck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA1MDAsIHJlYXNvbjogZXJyTWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqUHV0SW5EYihkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalB1dEluRGI6ICcsIGRhdGEpO1xuICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalB1dEluRGI6IHlvdSBhcmUgbm90IHVzaW5nIERCIC0gbm8gcHV0IGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoJ05BJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnREIgcHV0IGltcG9zc2libGUuIE5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF9pZDogc3RyaW5nO1xuICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoZGF0YSkuaW5kZXhPZignX2lkJykpIHtcbiAgICAgICAgICAgIF9pZCA9IGRhdGEuX2lkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX2lkKSB7XG4gICAgICAgICAgICBfaWQgPSBzZWxmLl9nZW5lcmF0ZU9iamVjdFVuaXF1ZUlkKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2VuY3J5cHQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnB1dChcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSxcbiAgICAgICAgICAgIHNlbGYuc2RrLm9yZyxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqVmVyc2lvbixcbiAgICAgICAgICAgIGNyeXB0byk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBhc3luYyBmaWRqUmVtb3ZlSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpSZW1vdmVJbkRiICcsIGRhdGFfaWQpO1xuICAgICAgICBpZiAoIXNlbGYuc2RrLnVzZURCKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalJlbW92ZUluRGI6IHlvdSBhcmUgbm90IHVzaW5nIERCIC0gbm8gcmVtb3ZlIGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGF0YV9pZCB8fCB0eXBlb2YgZGF0YV9pZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdEQiByZW1vdmUgaW1wb3NzaWJsZS4gJyArXG4gICAgICAgICAgICAgICAgJ05lZWQgdGhlIGRhdGEuX2lkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucmVtb3ZlKGRhdGFfaWQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkakZpbmRJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLnNkay51c2VEQikge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpGaW5kSW5EYjogeW91IGFyZSBub3QgdXNpbmcgREIgLSBubyBmaW5kIGF2YWlsYWJsZS4nKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdGaW5kIHBiIDogbmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICcgTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldChkYXRhX2lkLCBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkakZpbmRBbGxJbkRiKCk6IFByb21pc2U8QXJyYXk8YW55PiB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5zZGsudXNlREIpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqRmluZEFsbEluRGI6IHlvdSBhcmUgbm90IHVzaW5nIERCIC0gbm8gZmluZCBhdmFpbGFibGUuJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXRBbGwoY3J5cHRvKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZXNvbHZlKChyZXN1bHRzIGFzIEFycmF5PGFueT4pKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkalNlbmRPbkVuZHBvaW50KGlucHV0OiBFbmRwb2ludENhbGxJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXI6IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlID0gaW5wdXQua2V5ID8ge2tleTogaW5wdXQua2V5fSA6IG51bGw7XG4gICAgICAgIGNvbnN0IGVuZHBvaW50cyA9IGF3YWl0IHRoaXMuZmlkakdldEVuZHBvaW50cyhmaWx0ZXIpO1xuICAgICAgICBpZiAoIWlucHV0LmRlZmF1bHRLZXlVcmwgJiYgKCFlbmRwb2ludHMgfHwgZW5kcG9pbnRzLmxlbmd0aCAhPT0gMSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig0MDAsICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTZW5kT25FbmRwb2ludCA6IGVuZHBvaW50IGRvZXMgbm90IGV4aXN0LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpcnN0RW5kcG9pbnRVcmwgPSAoIWVuZHBvaW50cyB8fCBlbmRwb2ludHMubGVuZ3RoICE9PSAxKSA/IGlucHV0LmRlZmF1bHRLZXlVcmwgOiBlbmRwb2ludHNbMF0udXJsO1xuICAgICAgICBpZiAoaW5wdXQucmVsYXRpdmVQYXRoKSB7XG4gICAgICAgICAgICBmaXJzdEVuZHBvaW50VXJsID0gdXJsam9pbihmaXJzdEVuZHBvaW50VXJsLCBpbnB1dC5yZWxhdGl2ZVBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGp3dCA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgICAgIGxldCBhbnN3ZXI7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gbmV3IEFqYXgoKTtcbiAgICAgICAgc3dpdGNoIChpbnB1dC52ZXJiKSB7XG4gICAgICAgICAgICBjYXNlICdQT1NUJyA6XG4gICAgICAgICAgICAgICAgYW5zd2VyID0gcXVlcnkucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogZmlyc3RFbmRwb2ludFVybCxcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHVzZWQgOiB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBqd3RcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5wdXQuZGF0YSA/IGlucHV0LmRhdGEgOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dDogaW5wdXQudGltZW91dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnUFVUJyA6XG4gICAgICAgICAgICAgICAgYW5zd2VyID0gcXVlcnkucHV0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBmaXJzdEVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpbnB1dC5kYXRhID8gaW5wdXQuZGF0YSA6IHt9LFxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiBpbnB1dC50aW1lb3V0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdERUxFVEUnIDpcbiAgICAgICAgICAgICAgICBhbnN3ZXIgPSBxdWVyeS5kZWxldGUoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGZpcnN0RW5kcG9pbnRVcmwsXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkIDogd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgand0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IGlucHV0LnRpbWVvdXRcbiAgICAgICAgICAgICAgICAgICAgLy8gbm90IHVzZWQ6IGRhdGE6IGRhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYW5zd2VyID0gcXVlcnkuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBmaXJzdEVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiBpbnB1dC50aW1lb3V0XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkOiBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlcjtcbiAgICB9O1xuXG4gICAgcHVibGljIGFzeW5jIGZpZGpGb3Jnb3RQYXNzd29yZFJlcXVlc3QoZW1haWw6IFN0cmluZykge1xuXG4gICAgICAgIGNvbnN0IGJlc3RVcmxzID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9uZSd9KTtcbiAgICAgICAgaWYgKCFiZXN0VXJscyB8fCBiZXN0VXJscy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig0MDAsICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpGb3Jnb3RQYXNzd29yZFJlcXVlc3QgOiBhcGkgZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBBamF4KCk7XG4gICAgICAgIGF3YWl0IHF1ZXJ5LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiBiZXN0VXJsc1swXS51cmwgKyAnL21lL2ZvcmdvdCcsXG4gICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YToge2VtYWlsfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmlkakdldElkVG9rZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgIH07XG5cbiAgICAvLyBJbnRlcm5hbCBmdW5jdGlvbnNcblxuICAgIC8qKlxuICAgICAqIExvZ291dCB0aGVuIExvZ2luXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAcGFyYW0gdXBkYXRlUHJvcGVydGllc1xuICAgICAqIEB0aHJvd3Mge0Vycm9ySW50ZXJmYWNlfVxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2xvZ2luSW50ZXJuYWwobG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXBkYXRlUHJvcGVydGllcz86IGFueSk6IFByb21pc2U8Q2xpZW50VG9rZW5zPiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5fbG9naW5JbnRlcm5hbCcpO1xuICAgICAgICBpZiAoIXRoaXMuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig0MDMsICdOZWVkIGFuIGluaXRpYWxpemVkIEZpZGpTZXJ2aWNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24ubG9nb3V0KCk7XG5cbiAgICAgICAgbGV0IGNsaWVudFRva2VucztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNsaWVudFRva2VucyA9IHRoaXMuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjbGllbnRUb2tlbnMgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xpZW50VG9rZW5zO1xuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgX3JlbW92ZUFsbCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uZGVzdHJveSgpO1xuICAgICAgICBhd2FpdCB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGFzeW5jIF9jcmVhdGVTZXNzaW9uKHVpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZGJzOiBFbmRwb2ludEludGVyZmFjZVtdID0gYXdhaXQgdGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSk7XG4gICAgICAgIGlmICghZGJzIHx8IGRicy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1NlZW1zIHRoYXQgeW91IGFyZSBpbiBEZW1vIG1vZGUgb3IgdXNpbmcgTm9kZSAobm8gcmVtb3RlIERCKS4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlc3Npb24uc2V0UmVtb3RlKGRicyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHVpZCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYXN5bmMgX3Rlc3RQcm9taXNlKGE/KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rICcgKyBhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2snKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9zcnZEYXRhVW5pcUlkID0gMDtcblxuICAgIHByaXZhdGUgX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoYXBwTmFtZSwgdHlwZT8sIG5hbWU/KSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHNpbXBsZURhdGUgPSAnJyArIG5vdy5nZXRGdWxsWWVhcigpICsgJycgKyBub3cuZ2V0TW9udGgoKSArICcnICsgbm93LmdldERhdGUoKVxuICAgICAgICAgICAgKyAnJyArIG5vdy5nZXRIb3VycygpICsgJycgKyBub3cuZ2V0TWludXRlcygpOyAvLyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHNlcXVJZCA9ICsrSW50ZXJuYWxTZXJ2aWNlLl9zcnZEYXRhVW5pcUlkO1xuICAgICAgICBsZXQgVUlkID0gJyc7XG4gICAgICAgIGlmIChhcHBOYW1lICYmIGFwcE5hbWUuY2hhckF0KDApKSB7XG4gICAgICAgICAgICBVSWQgKz0gYXBwTmFtZS5jaGFyQXQoMCkgKyAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSB0eXBlLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSBuYW1lLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBVSWQgKz0gc2ltcGxlRGF0ZSArICcnICsgc2VxdUlkO1xuICAgICAgICByZXR1cm4gVUlkO1xuICAgIH1cblxufVxuIl19