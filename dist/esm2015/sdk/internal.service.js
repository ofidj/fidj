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
// const PouchDB = window['PouchDB'] || require('pouchdb').default;
/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
export class InternalService {
    constructor(logger, promise) {
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
        const ls = typeof window !== 'undefined' ? window.localStorage : {};
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
    fidjInit(fidjId, options) {
        const self = this;
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
        return new self.promise((resolve, reject) => {
            self.connection.verifyConnectionStates()
                .then(() => {
                let theBestUrl = self.connection.getApiEndpoints({ filter: 'theBestOne' })[0];
                let theBestOldUrl = self.connection.getApiEndpoints({ filter: 'theBestOldOne' })[0];
                const isLogin = self.fidjIsLogin();
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
                .catch((err) => {
                self.logger.error('fidj.sdk.service.fidjInit: ', err);
                reject(new Error(500, err.toString()));
            });
        });
    }
    ;
    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param login
     * @param password
     * @returns
     */
    fidjLogin(login, password) {
        const self = this;
        self.logger.log('fidj.sdk.service.fidjLogin');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error(404, 'Need an intialized FidjService'));
        }
        return new self.promise((resolve, reject) => {
            self._removeAll()
                .then(() => {
                return self.connection.verifyConnectionStates();
            })
                .then(() => {
                return self._createSession(self.connection.fidjId);
            })
                .then(() => {
                return self._loginInternal(login, password);
            })
                .then((user) => {
                self.connection.setConnection(user);
                self.session.sync(self.connection.getClientId())
                    .then(() => resolve(self.connection.getUser()))
                    .catch((err) => resolve(self.connection.getUser()));
            })
                .catch((err) => {
                self.logger.error('fidj.sdk.service.fidjLogin: ', err.toString());
                reject(err);
            });
        });
    }
    ;
    /**
     *
     * @param options
     * @param options.accessToken optional
     * @param options.idToken  optional
     * @returns
     */
    fidjLoginInDemoMode(options) {
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
                .then(() => {
                self.connection.setConnectionOffline(options);
                resolve(self.connection.getUser());
            })
                .catch((err) => {
                self.logger.error('fidj.sdk.service.fidjLoginInDemoMode error: ', err);
                reject(err);
            });
        });
    }
    ;
    fidjGetEndpoints(filter) {
        if (!filter) {
            filter = { showBlocked: false };
        }
        const ap = this.connection.getAccessPayload({ endpoints: [] });
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
    fidjRoles() {
        return JSON.parse(this.connection.getIdPayload({ roles: [] })).roles;
    }
    ;
    fidjMessage() {
        return JSON.parse(this.connection.getIdPayload({ message: '' })).message;
    }
    ;
    fidjIsLogin() {
        return this.connection.isLogin();
    }
    ;
    fidjLogout(force) {
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
    fidjSync(fnInitFirstData, fnInitFirstData_Arg) {
        const self = this;
        self.logger.log('fidj.sdk.service.fidjSync');
        // if (!self.session.isReady()) {
        //    return self.promise.reject('fidj.sdk.service.fidjSync : DB sync impossible. Did you login ?');
        // }
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
    }
    ;
    fidjPutInDb(data) {
        const self = this;
        self.logger.log('fidj.sdk.service.fidjPutInDb: ', data);
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
    fidjRemoveInDb(data_id) {
        const self = this;
        self.logger.log('fidj.sdk.service.fidjRemoveInDb ', data_id);
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
    fidjFindInDb(data_id) {
        const self = this;
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
    fidjFindAllInDb() {
        const self = this;
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
    fidjPostOnEndpoint(key, data) {
        const filter = {
            key: key
        };
        const endpoints = this.fidjGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(new Error(400, 'fidj.sdk.service.fidjPostOnEndpoint : endpoint does not exist.'));
        }
        const endpointUrl = endpoints[0].url;
        const jwt = this.connection.getIdToken();
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
    }
    ;
    fidjGetIdToken() {
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
     */
    _loginInternal(login, password, updateProperties) {
        const self = this;
        self.logger.log('fidj.sdk.service._loginInternal');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error(403, 'Need an intialized FidjService'));
        }
        return new self.promise((resolve, reject) => {
            self.connection.logout()
                .then(() => {
                return self.connection.getClient().login(login, password, updateProperties);
            })
                .catch((err) => {
                return self.connection.getClient().login(login, password, updateProperties);
            })
                .then(loginUser => {
                loginUser.email = login;
                resolve(loginUser);
            })
                .catch(err => {
                self.logger.error('fidj.sdk.service._loginInternal error : ' + err);
                reject(err);
            });
        });
    }
    ;
    _removeAll() {
        this.connection.destroy();
        return this.session.destroy();
    }
    ;
    _createSession(uid) {
        const dbs = this.connection.getDBs({ filter: 'theBestOnes' });
        if (!dbs || dbs.length === 0) {
            this.logger.warn('Seems that you are in demo mode, no remote DB.');
        }
        this.session.setRemote(dbs);
        return this.session.create(uid);
    }
    ;
    _testPromise(a) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQ0FBaUM7QUFDakMsc0RBQXNEO0FBQ3RELGlEQUFpRDtBQUNqRCxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEtBQUssVUFBVSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQVN0QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0MsbUVBQW1FO0FBRW5FOzs7R0FHRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBU3hCLFlBQVksTUFBdUIsRUFBRSxPQUEyQjtRQUU1RCxJQUFJLENBQUMsR0FBRyxHQUFHO1lBQ1AsR0FBRyxFQUFFLE1BQU07WUFDWCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsSUFBSSxFQUFFLEtBQUs7U0FDZCxDQUFDO1FBQ0YsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMxQjtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDeEI7YUFBTTtZQUNILElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztTQUNyQztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxFQUFFLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMs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QUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekIsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsR0FBRyxJQUFJLFVBQVUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7QUFyQmMsOEJBQWMsR0FBRyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGltcG9ydCAqIGFzIFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0ICogYXMgdmVyc2lvbiBmcm9tICcuLi92ZXJzaW9uJztcbmltcG9ydCAqIGFzIHRvb2xzIGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgKiBhcyBzZXNzaW9uIGZyb20gJy4uL3Nlc3Npb24nO1xuaW1wb3J0IHtcbiAgICBMb2dnZXJJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgU2RrSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7U2Vzc2lvbkNyeXB0b0ludGVyZmFjZX0gZnJvbSAnLi4vc2Vzc2lvbi9zZXNzaW9uJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuLi9jb25uZWN0aW9uL2FqYXgnO1xuaW1wb3J0IHtMb2dnZXJTZXJ2aWNlfSBmcm9tICcuL2xvZ2dlci5zZXJ2aWNlJztcblxuLy8gY29uc3QgUG91Y2hEQiA9IHdpbmRvd1snUG91Y2hEQiddIHx8IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0O1xuXG4vKipcbiAqIHBsZWFzZSB1c2UgaXRzIGFuZ3VsYXIuanMgb3IgYW5ndWxhci5pbyB3cmFwcGVyXG4gKiB1c2VmdWxsIG9ubHkgZm9yIGZpZGogZGV2IHRlYW1cbiAqL1xuZXhwb3J0IGNsYXNzIEludGVybmFsU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlO1xuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3I7XG4gICAgcHJpdmF0ZSBzdG9yYWdlOiB0b29scy5Mb2NhbFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBzZXNzaW9uOiBzZXNzaW9uLlNlc3Npb247XG4gICAgcHJpdmF0ZSBjb25uZWN0aW9uOiBjb25uZWN0aW9uLkNvbm5lY3Rpb247XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IExvZ2dlckludGVyZmFjZSwgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yKSB7XG5cbiAgICAgICAgdGhpcy5zZGsgPSB7XG4gICAgICAgICAgICBvcmc6ICdmaWRqJyxcbiAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb24udmVyc2lvbixcbiAgICAgICAgICAgIHByb2Q6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2dnZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyU2VydmljZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZSA6IGNvbnN0cnVjdG9yJyk7XG4gICAgICAgIGNvbnN0IGxzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cubG9jYWxTdG9yYWdlIDoge307XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IG5ldyB0b29scy5Mb2NhbFN0b3JhZ2UobHMsICdmaWRqLicpO1xuICAgICAgICB0aGlzLnNlc3Npb24gPSBuZXcgc2Vzc2lvbi5TZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG5ldyBjb25uZWN0aW9uLkNvbm5lY3Rpb24odGhpcy5zZGssIHRoaXMuc3RvcmFnZSwgdGhpcy5sb2dnZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgY29ubmVjdGlvbiAmIHNlc3Npb25cbiAgICAgKiBDaGVjayB1cmlcbiAgICAgKiBEb25lIGVhY2ggYXBwIHN0YXJ0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpJZCAgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqU2FsdCByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpWZXJzaW9uIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZGV2TW9kZSBvcHRpb25hbCBkZWZhdWx0IGZhbHNlLCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpJbml0KGZpZGpJZDogc3RyaW5nLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgLypcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWRFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXRBdXRoRW5kcG9pbnQob3B0aW9ucy5mb3JjZWRFbmRwb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldERCRW5kcG9pbnQob3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KTtcbiAgICAgICAgfSovXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubG9nTGV2ZWwpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLnNldExldmVsKG9wdGlvbnMubG9nTGV2ZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogJywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghZmlkaklkKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6IGJhZCBpbml0Jyk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhIGZpZGpJZCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc2RrLnByb2QgPSAhb3B0aW9ucyA/IHRydWUgOiBvcHRpb25zLnByb2Q7XG4gICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqSWQgPSBmaWRqSWQ7XG4gICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqVmVyc2lvbiA9IHNlbGYuc2RrLnZlcnNpb247XG4gICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvID0gKCFvcHRpb25zIHx8ICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjcnlwdG8nKSkgPyB0cnVlIDogb3B0aW9ucy5jcnlwdG87XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGhlQmVzdFVybDogYW55ID0gc2VsZi5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9uZSd9KVswXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RPbGRVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbGRPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzTG9naW4gPSBzZWxmLmZpZGpJc0xvZ2luKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwgJiYgdGhlQmVzdFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RVcmwgPSB0aGVCZXN0VXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlQmVzdE9sZFVybCAmJiB0aGVCZXN0T2xkVXJsLnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlQmVzdE9sZFVybCA9IHRoZUJlc3RPbGRVcmwudXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xvZ2luICYmIHRoZUJlc3RPbGRVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RPbGRVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDA0LCAnTmVlZCBvbmUgY29ubmVjdGlvbiAtIG9yIHRvbyBvbGQgU0RLIHZlcnNpb24gKGNoZWNrIHVwZGF0ZSknKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQ6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIudG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBpdCBpZiBmaWRqSXNMb2dpbigpID09PSBmYWxzZVxuICAgICAqIEVyYXNlIGFsbCAoZGIgJiBzdG9yYWdlKVxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9sb2dpbkludGVybmFsKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbih1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luOiAnLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmFjY2Vzc1Rva2VuIG9wdGlvbmFsXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaWRUb2tlbiAgb3B0aW9uYWxcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBnZW5lcmF0ZSBvbmUgZGF5IHRva2VucyBpZiBub3Qgc2V0XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIG5vdy5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93ID0gbm93LmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICByb2xlczogW10sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2RlbW8nLFxuICAgICAgICAgICAgICAgIGFwaXM6IFtdLFxuICAgICAgICAgICAgICAgIGVuZHBvaW50czogW10sXG4gICAgICAgICAgICAgICAgZGJzOiBbXSxcbiAgICAgICAgICAgICAgICBleHA6IHRvbW9ycm93XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zdCBqd3RTaWduID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBqd3RTaWduICsgJy4nICsgcGF5bG9hZCArICcuJyArIGp3dFNpZ247XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICBpZFRva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbk9mZmxpbmUob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqTG9naW5JbkRlbW9Nb2RlIGVycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqR2V0RW5kcG9pbnRzKGZpbHRlcj86IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIWZpbHRlcikge1xuICAgICAgICAgICAgZmlsdGVyID0ge3Nob3dCbG9ja2VkOiBmYWxzZX07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXAgPSB0aGlzLmNvbm5lY3Rpb24uZ2V0QWNjZXNzUGF5bG9hZCh7ZW5kcG9pbnRzOiBbXX0pO1xuICAgICAgICBsZXQgZW5kcG9pbnRzID0gSlNPTi5wYXJzZShhcCkuZW5kcG9pbnRzO1xuICAgICAgICBpZiAoIWVuZHBvaW50cyB8fCAhQXJyYXkuaXNBcnJheSggZW5kcG9pbnRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5kcG9pbnRzID0gZW5kcG9pbnRzLmZpbHRlcigoZW5kcG9pbnQ6IEVuZHBvaW50SW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2sgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9rICYmIGZpbHRlci5rZXkpIHtcbiAgICAgICAgICAgICAgICBvayA9IChlbmRwb2ludC5rZXkgPT09IGZpbHRlci5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9rICYmICFmaWx0ZXIuc2hvd0Jsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBvayA9ICFlbmRwb2ludC5ibG9ja2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50cztcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkak1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpJc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmlzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpMb2dvdXQoZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpICYmICFmb3JjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ubG9nb3V0KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplIERCXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgYSBmdW5jdGlvbiB3aXRoIGRiIGFzIGlucHV0IGFuZCB0aGF0IHJldHVybiBwcm9taXNlOiBjYWxsIGlmIERCIGlzIGVtcHR5XG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YV9BcmcgYXJnIHRvIHNldCB0byBmbkluaXRGaXJzdERhdGEoKVxuICAgICAqIEByZXR1cm5zICBwcm9taXNlXG4gICAgICovXG4gICAgcHVibGljIGZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YT8sIGZuSW5pdEZpcnN0RGF0YV9Bcmc/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYycpO1xuICAgICAgICAvLyBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgOiBEQiBzeW5jIGltcG9zc2libGUuIERpZCB5b3UgbG9naW4gPycpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgY29uc3QgZmlyc3RTeW5jID0gKHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID09PSBudWxsKTtcblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uc3luYyhzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLndhcm4oJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgd2FybjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaXNFbXB0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgaXNFbXB0eSA6ICcsIGlzRW1wdHksIGZpcnN0U3luYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmVFbXB0eSwgcmVqZWN0RW1wdHlOb3RVc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eSAmJiBmaXJzdFN5bmMgJiYgZm5Jbml0Rmlyc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gZm5Jbml0Rmlyc3REYXRhKGZuSW5pdEZpcnN0RGF0YV9BcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgJiYgcmV0WydjYXRjaCddIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnRoZW4ocmVzb2x2ZUVtcHR5KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUVtcHR5KCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBmbkluaXRGaXJzdERhdGEgcmVzb2x2ZWQ6ICcsIGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmluZm8oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmRvY19jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSByZXN1bHQuZG9jX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBfZGJSZWNvcmRDb3VudCA6ICcgKyBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlZnJlc2hDb25uZWN0aW9uIGRvbmUgOiAnLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3JJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlZnJlc2hDb25uZWN0aW9uIGZhaWxlZCA6ICcsIGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09IDQwMyB8fCBlcnIuY29kZSA9PT0gNDEwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWRqTG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246ICdTeW5jaHJvbml6YXRpb24gdW5hdXRob3JpemVkIDogbmVlZCB0byBsb2dpbiBhZ2Fpbi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gd2hhdCB0byBkbyB3aXRoIHRoaXMgZXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1lc3NhZ2UgPSAnRXJyb3IgZHVyaW5nIHN5bmNocm9uaXNhdGlvbjogJyArIGVyci50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoZXJyTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDUwMCwgcmVhc29uOiBlcnJNZXNzYWdlfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpQdXRJbkRiKGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUHV0SW5EYjogJywgZGF0YSk7XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ0RCIHB1dCBpbXBvc3NpYmxlLiBOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfaWQ6IHN0cmluZztcbiAgICAgICAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2YoJ19pZCcpKSB7XG4gICAgICAgICAgICBfaWQgPSBkYXRhLl9pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV9pZCkge1xuICAgICAgICAgICAgX2lkID0gc2VsZi5fZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdlbmNyeXB0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5wdXQoXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCksXG4gICAgICAgICAgICBzZWxmLnNkay5vcmcsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24sXG4gICAgICAgICAgICBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJlbW92ZUluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUmVtb3ZlSW5EYiAnLCBkYXRhX2lkKTtcblxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGFfaWQgfHwgdHlwZW9mIGRhdGFfaWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnREIgcmVtb3ZlIGltcG9zc2libGUuICcgK1xuICAgICAgICAgICAgICAgICdOZWVkIHRoZSBkYXRhLl9pZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnJlbW92ZShkYXRhX2lkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnRmluZCBwYiA6IG5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnIE5lZWQgdG8gYmUgc3luY2hyb25pc2VkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXQoZGF0YV9pZCwgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kQWxsSW5EYigpOiBQcm9taXNlPEFycmF5PGFueT4gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uZ2V0QWxsKGNyeXB0bylcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVzb2x2ZSgocmVzdWx0cyBhcyBBcnJheTxhbnk+KSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpQb3N0T25FbmRwb2ludChrZXk6IHN0cmluZywgZGF0YT86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZmlsdGVyOiBFbmRwb2ludEZpbHRlckludGVyZmFjZSA9IHtcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVuZHBvaW50cyA9IHRoaXMuZmlkakdldEVuZHBvaW50cyhmaWx0ZXIpO1xuICAgICAgICBpZiAoIWVuZHBvaW50cyB8fCBlbmRwb2ludHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChcbiAgICAgICAgICAgICAgICBuZXcgRXJyb3IoNDAwLFxuICAgICAgICAgICAgICAgICAgICAnZmlkai5zZGsuc2VydmljZS5maWRqUG9zdE9uRW5kcG9pbnQgOiBlbmRwb2ludCBkb2VzIG5vdCBleGlzdC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmRwb2ludFVybCA9IGVuZHBvaW50c1swXS51cmw7XG4gICAgICAgIGNvbnN0IGp3dCA9IHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiBlbmRwb2ludFVybCxcbiAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgand0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpHZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgIH07XG5cbiAgICAvLyBJbnRlcm5hbCBmdW5jdGlvbnNcblxuICAgIC8qKlxuICAgICAqIExvZ291dCB0aGVuIExvZ2luXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAcGFyYW0gdXBkYXRlUHJvcGVydGllc1xuICAgICAqL1xuICAgIHByaXZhdGUgX2xvZ2luSW50ZXJuYWwobG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXBkYXRlUHJvcGVydGllcz86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5fbG9naW5JbnRlcm5hbCcpO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDMsICdOZWVkIGFuIGludGlhbGl6ZWQgRmlkalNlcnZpY2UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24ubG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihsb2dpblVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5Vc2VyLmVtYWlsID0gbG9naW47XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGxvZ2luVXNlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuX2xvZ2luSW50ZXJuYWwgZXJyb3IgOiAnICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcHJvdGVjdGVkIF9yZW1vdmVBbGwoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgX2NyZWF0ZVNlc3Npb24odWlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBkYnM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSB0aGlzLmNvbm5lY3Rpb24uZ2V0REJzKHtmaWx0ZXI6ICd0aGVCZXN0T25lcyd9KTtcbiAgICAgICAgaWYgKCFkYnMgfHwgZGJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybignU2VlbXMgdGhhdCB5b3UgYXJlIGluIGRlbW8gbW9kZSwgbm8gcmVtb3RlIERCLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zZXRSZW1vdGUoZGJzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUodWlkKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfdGVzdFByb21pc2UoYT8pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2sgJyArIGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoJ3Rlc3QgcHJvbWlzZSBvaycpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3NydkRhdGFVbmlxSWQgPSAwO1xuXG4gICAgcHJpdmF0ZSBfZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChhcHBOYW1lLCB0eXBlPywgbmFtZT8pIHtcblxuICAgICAgICAvLyByZXR1cm4gbnVsbDtcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3Qgc2ltcGxlRGF0ZSA9ICcnICsgbm93LmdldEZ1bGxZZWFyKCkgKyAnJyArIG5vdy5nZXRNb250aCgpICsgJycgKyBub3cuZ2V0RGF0ZSgpXG4gICAgICAgICAgICArICcnICsgbm93LmdldEhvdXJzKCkgKyAnJyArIG5vdy5nZXRNaW51dGVzKCk7IC8vIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgY29uc3Qgc2VxdUlkID0gKytJbnRlcm5hbFNlcnZpY2UuX3NydkRhdGFVbmlxSWQ7XG4gICAgICAgIGxldCBVSWQgPSAnJztcbiAgICAgICAgaWYgKGFwcE5hbWUgJiYgYXBwTmFtZS5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIFVJZCArPSBhcHBOYW1lLmNoYXJBdCgwKSArICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlICYmIHR5cGUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgVUlkICs9IHR5cGUuc3Vic3RyaW5nKDAsIDQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lICYmIG5hbWUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgVUlkICs9IG5hbWUuc3Vic3RyaW5nKDAsIDQpO1xuICAgICAgICB9XG4gICAgICAgIFVJZCArPSBzaW1wbGVEYXRlICsgJycgKyBzZXF1SWQ7XG4gICAgICAgIHJldHVybiBVSWQ7XG4gICAgfVxuXG59XG4iXX0=