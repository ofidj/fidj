// import PouchDB from 'pouchdb';
// import * as PouchDB from 'pouchdb/dist/pouchdb.js';
// import PouchDB from 'pouchdb/dist/pouchdb.js';
import * as version from '../version';
import * as tools from '../tools';
import * as connection from '../connection';
import * as session from '../session';
import {
    LoggerInterface,
    ModuleServiceInitOptionsInterface,
    ModuleServiceLoginOptionsInterface,
    SdkInterface,
    ErrorInterface, EndpointInterface, EndpointFilterInterface
} from './interfaces';
import {SessionCryptoInterface} from '../session/session';
import {Error} from './error';
import {Ajax} from '../connection/ajax';
import {LoggerService} from './logger.service';

// const PouchDB = window['PouchDB'] || require('pouchdb').default;

/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
export class InternalService {

    private sdk: SdkInterface;
    private logger: LoggerInterface;
    private promise: PromiseConstructor;
    private storage: tools.LocalStorage;
    private session: session.Session;
    private connection: connection.Connection;

    constructor(logger: LoggerInterface, promise: PromiseConstructor) {

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
        } else {
            this.logger = new LoggerService();
        }
        this.logger.log('fidj.sdk.service : constructor');
        this.storage = new tools.LocalStorage(window.localStorage, 'fidj.');
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
    public fidjInit(fidjId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface> {

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

                    let theBestUrl: any = self.connection.getApiEndpoints({filter: 'theBestOne'})[0];
                    let theBestOldUrl: any = self.connection.getApiEndpoints({filter: 'theBestOldOne'})[0];
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
                    } else if (isLogin && theBestOldUrl) {
                        self.connection.setClient(new connection.Client(self.connection.fidjId, theBestOldUrl, self.storage, self.sdk));
                        resolve();
                    } else {
                        reject(new Error(404, 'Need one connection - or too old SDK version (check update)'));
                    }

                })
                .catch((err) => {
                    self.logger.error('fidj.sdk.service.fidjInit: ', err);
                    reject(new Error(500, err.toString()));
                });
        });
    };

    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param login
     * @param password
     * @returns
     */
    public fidjLogin(login: string, password: string): Promise<any | ErrorInterface> {
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
    };

    /**
     *
     * @param options
     * @param options.accessToken optional
     * @param options.idToken  optional
     * @returns
     */
    public fidjLoginInDemoMode(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface> {
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
                endpoints: {},
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
    };

    public fidjGetEndpoints(filter?: EndpointFilterInterface): Array<EndpointInterface> {

        if (!filter) {
            filter = {showBlocked: false};
        }
        let endpoints = JSON.parse(this.connection.getAccessPayload({endpoints: []})).endpoints;
        if (!endpoints) {
            return [];
        }

        endpoints = endpoints.filter((endpoint: EndpointInterface) => {
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
    };

    public fidjRoles(): Array<string> {
        return JSON.parse(this.connection.getIdPayload({roles: []})).roles;
    };

    public fidjMessage(): string {
        return JSON.parse(this.connection.getIdPayload({message: ''})).message;
    };

    public fidjIsLogin(): boolean {
        return this.connection.isLogin();
    };

    public fidjLogout(force?: boolean): Promise<void | ErrorInterface> {
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
    };

    /**
     * Synchronize DB
     *
     *
     * @param fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @returns  promise
     */
    public fidjSync(fnInitFirstData?, fnInitFirstData_Arg?): Promise<void | ErrorInterface> {
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
                .then((result: any) => {
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
                .catch((err: ErrorInterface) => {
                    // console.error(err);
                    self.logger.warn('fidj.sdk.service.fidjSync refreshConnection failed : ', err);

                    if (err && (err.code === 403 || err.code === 410)) {
                        this.fidjLogout()
                            .then(() => {
                                reject({code: 403, reason: 'Synchronization unauthorized : need to login again.'});
                            })
                            .catch(() => {
                                reject({code: 403, reason: 'Synchronization unauthorized : need to login again..'});
                            });
                    } else if (err && err.code) {
                        // todo what to do with this err ?
                        resolve();
                    } else {
                        const errMessage = 'Error during synchronisation: ' + err.toString();
                        self.logger.error(errMessage);
                        reject({code: 500, reason: errMessage});
                    }
                })
            ;
        });
    };

    public fidjPutInDb(data: any): Promise<string | ErrorInterface> {
        const self = this;
        self.logger.log('fidj.sdk.service.fidjPutInDb: ', data);

        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'DB put impossible. Need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, 'Need to be synchronised.'));
        }

        let _id: string;
        if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
            _id = data._id;
        }
        if (!_id) {
            _id = self._generateObjectUniqueId(self.connection.fidjId);
        }
        let crypto: SessionCryptoInterface;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'encrypt'
            }
        }

        return self.session.put(
            data,
            _id,
            self.connection.getClientId(),
            self.sdk.org,
            self.connection.fidjVersion,
            crypto);
    };

    public fidjRemoveInDb(data_id: string): Promise<void | ErrorInterface> {
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
    };

    public fidjFindInDb(data_id: string): Promise<any | ErrorInterface> {
        const self = this;
        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'Find pb : need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, ' Need to be synchronised.'));
        }

        let crypto: SessionCryptoInterface;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'decrypt'
            };
        }

        return self.session.get(data_id, crypto);
    };

    public fidjFindAllInDb(): Promise<Array<any> | ErrorInterface> {
        const self = this;

        if (!self.connection.getClientId()) {
            return self.promise.reject(new Error(401, 'Need a user logged in.'));
        }
        if (!self.session.isReady()) {
            return self.promise.reject(new Error(400, 'Need to be synchronised.'));
        }

        let crypto: SessionCryptoInterface;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'decrypt'
            };
        }

        return self.session.getAll(crypto)
            .then(results => {
                self.connection.setCryptoSaltAsVerified();
                return self.promise.resolve((results as Array<any>));
            });
    };

    public fidjPostOnEndpoint(key: string, data?: any): Promise<any | ErrorInterface> {
        const filter: EndpointFilterInterface = {
            key: key
        };
        const endpoints = this.fidjGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(
                new Error(400,
                    'fidj.sdk.service.fidjPostOnEndpoint : endpoint does not exist.'));
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
    };

    public fidjGetIdToken(): string {
        return this.connection.getIdToken();
    };

    // Internal functions

    /**
     * Logout then Login
     *
     * @param login
     * @param password
     * @param updateProperties
     */
    private _loginInternal(login: string, password: string, updateProperties?: any): Promise<any | ErrorInterface> {
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
            }
        );
    };

    protected _removeAll(): Promise<void | ErrorInterface> {
        this.connection.destroy();
        return this.session.destroy();
    };

    private _createSession(uid: string): Promise<void | ErrorInterface> {
        const dbs: EndpointInterface[] = this.connection.getDBs({filter: 'theBestOnes'});
        if (!dbs || dbs.length === 0) {
            this.logger.warn('Seems that you are in demo mode, no remote DB.');
        }
        this.session.setRemote(dbs);
        return this.session.create(uid);
    };

    private _testPromise(a?): Promise<any> {
        if (a) {
            return this.promise.resolve('test promise ok ' + a);
        }
        return new this.promise((resolve, reject) => {
            resolve('test promise ok');
        });
    };

    private static _srvDataUniqId = 0;

    private _generateObjectUniqueId(appName, type?, name?) {

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
