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
        const ls = window ? window.localStorage : {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZGsvaW50ZXJuYWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQ0FBaUM7QUFDakMsc0RBQXNEO0FBQ3RELGlEQUFpRDtBQUNqRCxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEtBQUssVUFBVSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEtBQUssT0FBTyxNQUFNLFlBQVksQ0FBQztBQVN0QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0MsbUVBQW1FO0FBRW5FOzs7R0FHRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBU3hCLFlBQVksTUFBdUIsRUFBRSxPQUEyQjtRQUU1RCxJQUFJLENBQUMsR0FBRyxHQUFHO1lBQ1AsR0FBRyxFQUFFLE1BQU07WUFDWCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsSUFBSSxFQUFFLEtBQUs7U0FDZCxDQUFDO1FBQ0YsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMxQjtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDeEI7YUFBTTtZQUNILElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztTQUNyQztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMs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QUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekIsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsR0FBRyxJQUFJLFVBQVUsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQzs7QUFyQmMsOEJBQWMsR0FBRyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGltcG9ydCAqIGFzIFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0ICogYXMgdmVyc2lvbiBmcm9tICcuLi92ZXJzaW9uJztcbmltcG9ydCAqIGFzIHRvb2xzIGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgKiBhcyBzZXNzaW9uIGZyb20gJy4uL3Nlc3Npb24nO1xuaW1wb3J0IHtcbiAgICBMb2dnZXJJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgU2RrSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7U2Vzc2lvbkNyeXB0b0ludGVyZmFjZX0gZnJvbSAnLi4vc2Vzc2lvbi9zZXNzaW9uJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuLi9jb25uZWN0aW9uL2FqYXgnO1xuaW1wb3J0IHtMb2dnZXJTZXJ2aWNlfSBmcm9tICcuL2xvZ2dlci5zZXJ2aWNlJztcblxuLy8gY29uc3QgUG91Y2hEQiA9IHdpbmRvd1snUG91Y2hEQiddIHx8IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0O1xuXG4vKipcbiAqIHBsZWFzZSB1c2UgaXRzIGFuZ3VsYXIuanMgb3IgYW5ndWxhci5pbyB3cmFwcGVyXG4gKiB1c2VmdWxsIG9ubHkgZm9yIGZpZGogZGV2IHRlYW1cbiAqL1xuZXhwb3J0IGNsYXNzIEludGVybmFsU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlO1xuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3I7XG4gICAgcHJpdmF0ZSBzdG9yYWdlOiB0b29scy5Mb2NhbFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBzZXNzaW9uOiBzZXNzaW9uLlNlc3Npb247XG4gICAgcHJpdmF0ZSBjb25uZWN0aW9uOiBjb25uZWN0aW9uLkNvbm5lY3Rpb247XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IExvZ2dlckludGVyZmFjZSwgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yKSB7XG5cbiAgICAgICAgdGhpcy5zZGsgPSB7XG4gICAgICAgICAgICBvcmc6ICdmaWRqJyxcbiAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb24udmVyc2lvbixcbiAgICAgICAgICAgIHByb2Q6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2dnZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyU2VydmljZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZSA6IGNvbnN0cnVjdG9yJyk7XG4gICAgICAgIGNvbnN0IGxzID0gd2luZG93ID8gd2luZG93LmxvY2FsU3RvcmFnZSA6IHt9O1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgdG9vbHMuTG9jYWxTdG9yYWdlKGxzLCAnZmlkai4nKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gbmV3IHNlc3Npb24uU2Vzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdGlvbi5Db25uZWN0aW9uKHRoaXMuc2RrLCB0aGlzLnN0b3JhZ2UsIHRoaXMubG9nZ2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IGNvbm5lY3Rpb24gJiBzZXNzaW9uXG4gICAgICogQ2hlY2sgdXJpXG4gICAgICogRG9uZSBlYWNoIGFwcCBzdGFydFxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqSWQgIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalNhbHQgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqVmVyc2lvbiByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmRldk1vZGUgb3B0aW9uYWwgZGVmYXVsdCBmYWxzZSwgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqSW5pdChmaWRqSWQ6IHN0cmluZywgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8qXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0QXV0aEVuZHBvaW50KG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXREQkVuZHBvaW50KG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCk7XG4gICAgICAgIH0qL1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxvZ0xldmVsKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5zZXRMZXZlbChvcHRpb25zLmxvZ0xldmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6ICcsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoIWZpZGpJZCkge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgOiBiYWQgaW5pdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgYSBmaWRqSWQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnNkay5wcm9kID0gIW9wdGlvbnMgPyB0cnVlIDogb3B0aW9ucy5wcm9kO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkaklkID0gZmlkaklkO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24gPSBzZWxmLnNkay52ZXJzaW9uO1xuICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0byA9ICghb3B0aW9ucyB8fCAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY3J5cHRvJykpID8gdHJ1ZSA6IG9wdGlvbnMuY3J5cHRvO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGVCZXN0T2xkVXJsOiBhbnkgPSBzZWxmLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T2xkT25lJ30pWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xvZ2luID0gc2VsZi5maWRqSXNMb2dpbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsICYmIHRoZUJlc3RVcmwudXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVCZXN0VXJsID0gdGhlQmVzdFVybC51cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RPbGRVcmwgJiYgdGhlQmVzdE9sZFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RPbGRVcmwgPSB0aGVCZXN0T2xkVXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0VXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNMb2dpbiAmJiB0aGVCZXN0T2xkVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0T2xkVXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgb25lIGNvbm5lY3Rpb24gLSBvciB0b28gb2xkIFNESyB2ZXJzaW9uIChjaGVjayB1cGRhdGUpJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0OiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGwgaXQgaWYgZmlkaklzTG9naW4oKSA9PT0gZmFsc2VcbiAgICAgKiBFcmFzZSBhbGwgKGRiICYgc3RvcmFnZSlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpMb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbicpO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDQsICdOZWVkIGFuIGludGlhbGl6ZWQgRmlkalNlcnZpY2UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fbG9naW5JbnRlcm5hbChsb2dpbiwgcGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb24odXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbjogJywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hY2Nlc3NUb2tlbiBvcHRpb25hbFxuICAgICAqIEBwYXJhbSBvcHRpb25zLmlkVG9rZW4gIG9wdGlvbmFsXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gZ2VuZXJhdGUgb25lIGRheSB0b2tlbnMgaWYgbm90IHNldFxuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBub3cuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpICsgMSk7XG4gICAgICAgICAgICBjb25zdCB0b21vcnJvdyA9IG5vdy5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgcm9sZXM6IFtdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdkZW1vJyxcbiAgICAgICAgICAgICAgICBhcGlzOiBbXSxcbiAgICAgICAgICAgICAgICBlbmRwb2ludHM6IFtdLFxuICAgICAgICAgICAgICAgIGRiczogW10sXG4gICAgICAgICAgICAgICAgZXhwOiB0b21vcnJvd1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc3Qgand0U2lnbiA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gand0U2lnbiArICcuJyArIHBheWxvYWQgKyAnLicgKyBqd3RTaWduO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgaWRUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luSW5EZW1vTW9kZSBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakdldEVuZHBvaW50cyhmaWx0ZXI/OiBFbmRwb2ludEZpbHRlckludGVyZmFjZSk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCFmaWx0ZXIpIHtcbiAgICAgICAgICAgIGZpbHRlciA9IHtzaG93QmxvY2tlZDogZmFsc2V9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFwID0gdGhpcy5jb25uZWN0aW9uLmdldEFjY2Vzc1BheWxvYWQoe2VuZHBvaW50czogW119KTtcbiAgICAgICAgbGV0IGVuZHBvaW50cyA9IEpTT04ucGFyc2UoYXApLmVuZHBvaW50cztcbiAgICAgICAgaWYgKCFlbmRwb2ludHMgfHwgIUFycmF5LmlzQXJyYXkoIGVuZHBvaW50cykpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZHBvaW50cyA9IGVuZHBvaW50cy5maWx0ZXIoKGVuZHBvaW50OiBFbmRwb2ludEludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChvayAmJiBmaWx0ZXIua2V5KSB7XG4gICAgICAgICAgICAgICAgb2sgPSAoZW5kcG9pbnQua2V5ID09PSBmaWx0ZXIua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvayAmJiAhZmlsdGVyLnNob3dCbG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgb2sgPSAhZW5kcG9pbnQuYmxvY2tlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvaztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUm9sZXMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcztcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2U7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqSXNMb2dpbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5pc0xvZ2luKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqTG9nb3V0KGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKSAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGFfQXJnIGFyZyB0byBzZXQgdG8gZm5Jbml0Rmlyc3REYXRhKClcbiAgICAgKiBAcmV0dXJucyAgcHJvbWlzZVxuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqU3luYyhmbkluaXRGaXJzdERhdGE/LCBmbkluaXRGaXJzdERhdGFfQXJnPyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMnKTtcbiAgICAgICAgLy8gaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIDogREIgc3luYyBpbXBvc3NpYmxlLiBEaWQgeW91IGxvZ2luID8nKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IGZpcnN0U3luYyA9IChzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9PT0gbnVsbCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgcmVzb2x2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHdhcm46ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGlzRW1wdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIGlzRW1wdHkgOiAnLCBpc0VtcHR5LCBmaXJzdFN5bmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlRW1wdHksIHJlamVjdEVtcHR5Tm90VXNlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRW1wdHkgJiYgZmlyc3RTeW5jICYmIGZuSW5pdEZpcnN0RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGZuSW5pdEZpcnN0RGF0YShmbkluaXRGaXJzdERhdGFfQXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICYmIHJldFsnY2F0Y2gnXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldC50aGVuKHJlc29sdmVFbXB0eSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZyhyZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVFbXB0eSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgZm5Jbml0Rmlyc3REYXRhIHJlc29sdmVkOiAnLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pbmZvKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5kb2NfY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50ID0gcmVzdWx0LmRvY19jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgX2RiUmVjb3JkQ291bnQgOiAnICsgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ucmVmcmVzaENvbm5lY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZWZyZXNoQ29ubmVjdGlvbiBkb25lIDogJywgdXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTsgLy8gc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9ySW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZWZyZXNoQ29ubmVjdGlvbiBmYWlsZWQgOiAnLCBlcnIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSA0MDMgfHwgZXJyLmNvZGUgPT09IDQxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlkakxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIHdoYXQgdG8gZG8gd2l0aCB0aGlzIGVyciA/XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJNZXNzYWdlID0gJ0Vycm9yIGR1cmluZyBzeW5jaHJvbmlzYXRpb246ICcgKyBlcnIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKGVyck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA1MDAsIHJlYXNvbjogZXJyTWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUHV0SW5EYihkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalB1dEluRGI6ICcsIGRhdGEpO1xuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdEQiBwdXQgaW1wb3NzaWJsZS4gTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX2lkOiBzdHJpbmc7XG4gICAgICAgIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKCdfaWQnKSkge1xuICAgICAgICAgICAgX2lkID0gZGF0YS5faWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfaWQpIHtcbiAgICAgICAgICAgIF9pZCA9IHNlbGYuX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZW5jcnlwdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucHV0KFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpLFxuICAgICAgICAgICAgc2VsZi5zZGsub3JnLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpWZXJzaW9uLFxuICAgICAgICAgICAgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSZW1vdmVJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalJlbW92ZUluRGIgJywgZGF0YV9pZCk7XG5cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhX2lkIHx8IHR5cGVvZiBkYXRhX2lkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ0RCIHJlbW92ZSBpbXBvc3NpYmxlLiAnICtcbiAgICAgICAgICAgICAgICAnTmVlZCB0aGUgZGF0YS5faWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5yZW1vdmUoZGF0YV9pZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqRmluZEluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ0ZpbmQgcGIgOiBuZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJyBOZWVkIHRvIGJlIHN5bmNocm9uaXNlZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uZ2V0KGRhdGFfaWQsIGNyeXB0byk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqRmluZEFsbEluRGIoKTogUHJvbWlzZTxBcnJheTxhbnk+IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ05lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCB0byBiZSBzeW5jaHJvbmlzZWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldEFsbChjcnlwdG8pXG4gICAgICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlc29sdmUoKHJlc3VsdHMgYXMgQXJyYXk8YW55PikpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUG9zdE9uRW5kcG9pbnQoa2V5OiBzdHJpbmcsIGRhdGE/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IGZpbHRlcjogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UgPSB7XG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlbmRwb2ludHMgPSB0aGlzLmZpZGpHZXRFbmRwb2ludHMoZmlsdGVyKTtcbiAgICAgICAgaWYgKCFlbmRwb2ludHMgfHwgZW5kcG9pbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgICAgICAgbmV3IEVycm9yKDQwMCxcbiAgICAgICAgICAgICAgICAgICAgJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalBvc3RPbkVuZHBvaW50IDogZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5kcG9pbnRVcmwgPSBlbmRwb2ludHNbMF0udXJsO1xuICAgICAgICBjb25zdCBqd3QgPSB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRVcmwsXG4gICAgICAgICAgICAgICAgLy8gbm90IHVzZWQgOiB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqR2V0SWRUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWwgZnVuY3Rpb25zXG5cbiAgICAvKipcbiAgICAgKiBMb2dvdXQgdGhlbiBMb2dpblxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHBhcmFtIHVwZGF0ZVByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIF9sb2dpbkludGVybmFsKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuX2xvZ2luSW50ZXJuYWwnKTtcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAzLCAnTmVlZCBhbiBpbnRpYWxpemVkIEZpZGpTZXJ2aWNlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4obG9naW5Vc2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luVXNlci5lbWFpbCA9IGxvZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShsb2dpblVzZXIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsIGVycm9yIDogJyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBfcmVtb3ZlQWxsKCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF9jcmVhdGVTZXNzaW9uKHVpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZGJzOiBFbmRwb2ludEludGVyZmFjZVtdID0gdGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSk7XG4gICAgICAgIGlmICghZGJzIHx8IGRicy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1NlZW1zIHRoYXQgeW91IGFyZSBpbiBkZW1vIG1vZGUsIG5vIHJlbW90ZSBEQi4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlc3Npb24uc2V0UmVtb3RlKGRicyk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHVpZCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgX3Rlc3RQcm9taXNlKGE/KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rICcgKyBhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2snKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9zcnZEYXRhVW5pcUlkID0gMDtcblxuICAgIHByaXZhdGUgX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoYXBwTmFtZSwgdHlwZT8sIG5hbWU/KSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHNpbXBsZURhdGUgPSAnJyArIG5vdy5nZXRGdWxsWWVhcigpICsgJycgKyBub3cuZ2V0TW9udGgoKSArICcnICsgbm93LmdldERhdGUoKVxuICAgICAgICAgICAgKyAnJyArIG5vdy5nZXRIb3VycygpICsgJycgKyBub3cuZ2V0TWludXRlcygpOyAvLyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHNlcXVJZCA9ICsrSW50ZXJuYWxTZXJ2aWNlLl9zcnZEYXRhVW5pcUlkO1xuICAgICAgICBsZXQgVUlkID0gJyc7XG4gICAgICAgIGlmIChhcHBOYW1lICYmIGFwcE5hbWUuY2hhckF0KDApKSB7XG4gICAgICAgICAgICBVSWQgKz0gYXBwTmFtZS5jaGFyQXQoMCkgKyAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSB0eXBlLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSBuYW1lLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBVSWQgKz0gc2ltcGxlRGF0ZSArICcnICsgc2VxdUlkO1xuICAgICAgICByZXR1cm4gVUlkO1xuICAgIH1cblxufVxuIl19