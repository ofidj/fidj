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

// const PouchDB = window['PouchDB'] || require('pouchdb').default;

/**
 * please use its angular.js or angular.io wrapper
 * usefull only for miapp.io dev team
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
            org: 'miapp.io',
            version: version.version,
            prod: false
        };
        this.logger = {
            log: () => {
            },
            error: () => {
            },
            warn: () => {
            }
        };
        if (logger && window.console && logger === window.console) {
            this.logger.error = window.console.error;
            this.logger.warn = window.console.warn;
        }
        this.logger.log('miapp.sdk.service : constructor');
        if (promise) {
            this.promise = promise;
        }
        this.storage = new tools.LocalStorage(window.localStorage, 'miapp.');
        this.session = new session.Session();
        this.connection = new connection.Connection(this.sdk, this.storage);
    }

    /**
     * Init connection & session
     * Check uri
     * Done each app start
     *
     * @param options Optional settings
     * @param options.miappId  required use your customized endpoints
     * @param options.miappSalt required use your customized endpoints
     * @param options.miappVersion required use your customized endpoints
     * @param options.devMode optional default false, use your customized endpoints
     * @returns
     */
    public miappInit(miappId: string, options?: ModuleServiceInitOptionsInterface): Promise<void | ErrorInterface> {

        const self = this;
        self.logger.log('miapp.sdk.service.miappInit : ', options);
        if (!miappId) {
            self.logger.error('miapp.sdk.service.miappInit : bad init');
            return self.promise.reject(new Error(400, 'Need a miappId'));
        }

        self.sdk.prod = !options ? true : options.prod;

        return new self.promise((resolve, reject) => {
            self.connection.verifyConnectionStates()
                .then(() => {
                    self.connection.miappId = miappId;
                    self.connection.miappVersion = self.sdk.version;
                    self.connection.miappCrypto = (!options || !options.hasOwnProperty('crypto')) ? true : options.crypto;

                    let theBestUrl: any = self.connection.getApiEndpoints({filter: 'theBestOne'})[0];
                    let theBestOldUrl: any = self.connection.getApiEndpoints({filter: 'theBestOldOne'})[0];
                    const isLogin = self.miappIsLogin();

                    if (theBestUrl && theBestUrl.url) {
                        theBestUrl = theBestUrl.url;
                    }
                    if (theBestOldUrl && theBestOldUrl.url) {
                        theBestOldUrl = theBestOldUrl.url;
                    }

                    if (theBestUrl) {
                        self.connection.setClient(new connection.Client(self.connection.miappId, theBestUrl, self.storage, self.sdk));
                        resolve();
                    } else if (isLogin && theBestOldUrl) {
                        self.connection.setClient(new connection.Client(self.connection.miappId, theBestOldUrl, self.storage, self.sdk));
                        resolve();
                    } else {
                        reject(new Error(404, 'Need one connection - or too old SDK version (check update)'));
                    }

                })
                .catch((err) => {
                    self.logger.error('miapp.sdk.service.miappInit: ', err);
                    reject(new Error(500, err.toString()));
                });
        });
    };

    /**
     * Call it if miappIsLogin() === false
     * Erase all (db & storage)
     *
     * @param login
     * @param password
     * @returns
     */
    public miappLogin(login: string, password: string): Promise<any | ErrorInterface> {
        const self = this;
        self.logger.log('miapp.sdk.service.miappLogin');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error(404, 'Need an intialized FidjService'));
        }

        return new self.promise((resolve, reject) => {
            self._removeAll()
                .then(() => {
                    return self.connection.verifyConnectionStates();
                })
                .then(() => {
                    return self._createSession(self.connection.miappId);
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
                    self.logger.error('miapp.sdk.service.miappLogin: ', err.toString());
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
    public miappLoginInDemoMode(options?: ModuleServiceLoginOptionsInterface): Promise<any | ErrorInterface> {
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
                    return self._createSession(self.connection.miappId);
                })
                .then(() => {
                    self.connection.setConnectionOffline(options);
                    resolve(self.connection.getUser());
                })
                .catch((err) => {
                    self.logger.error('miapp.sdk.service.miappLogin error: ', err);
                    reject(err);
                });
        });
    };

    public miappGetEndpoints(filter?: EndpointFilterInterface): Array<EndpointInterface> {

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

    public miappRoles(): Array<string> {
        return JSON.parse(this.connection.getIdPayload({roles: []})).roles;
    };

    public miappMessage(): string {
        return JSON.parse(this.connection.getIdPayload({message: ''})).message;
    };

    public miappIsLogin(): boolean {
        return this.connection.isLogin();
    };

    public miappLogout(): Promise<void | ErrorInterface> {
        const self = this;
        if (!self.connection.getClient()) {
            return self._removeAll()
                .then(() => {
                    return this.session.create(self.connection.miappId, true);
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
                return this.session.create(self.connection.miappId, true);
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
    public miappSync(fnInitFirstData?, fnInitFirstData_Arg?): Promise<void | ErrorInterface> {
        const self = this;
        self.logger.log('miapp.sdk.service.miappSync');
        // if (!self.session.isReady()) {
        //    return self.promise.reject('miapp.sdk.service.miappSync : DB sync impossible. Did you login ?');
        // }

        const firstSync = (self.session.dbLastSync === null);

        return new self.promise((resolve, reject) => {

            self._createSession(self.connection.miappId)
                .then(() => {
                    return self.session.sync(self.connection.getClientId());
                })
                .then(() => {
                    self.logger.log('miapp.sdk.service.miappSync resolved');
                    return self.session.isEmpty();
                })
                .catch((err) => {
                    self.logger.warn('miapp.sdk.service.miappSync warn: ', err);
                    return self.session.isEmpty();
                })
                .then((isEmpty) => {
                    self.logger.log('miapp.sdk.service.miappSync isEmpty : ', isEmpty, firstSync);

                    return new Promise((resolveEmpty, rejectEmptyNotUsed) => {
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
                    self.logger.log('miapp.sdk.service.miappSync fnInitFirstData resolved: ', info);
                    self.session.dbLastSync = new Date().getTime();
                    return self.session.info();
                })
                .then((result: any) => {
                    self.session.dbRecordCount = 0;
                    if (result && result.doc_count) {
                        self.session.dbRecordCount = result.doc_count;
                    }
                    self.logger.log('miapp.sdk.service.miappSync _dbRecordCount : ' + self.session.dbRecordCount);

                    return self.connection.refreshConnection();
                })
                .then((user) => {
                    resolve(); // self.connection.getUser()
                })
                .catch((err: ErrorInterface) => {
                    // console.error(err);

                    if (err && (err.code === 403 || err.code === 410)) {
                        this.miappLogout()
                            .then(() => {
                                reject({code: 403, reason: 'Synchronization unauthorized : need to login again.'});
                            })
                            .catch(() => {
                                reject({code: 403, reason: 'Synchronization unauthorized : need to login again.'});
                            });
                    } else if (err && err.code) {
                        // todo what to do with this err ?
                        resolve();
                    } else {
                        const errMessage = 'Error during syncronisation: ' + err.toString();
                        // self.logger.error(errMessage);
                        reject({code: 500, reason: errMessage});
                    }
                })
            ;
        });
    };

    public miappPutInDb(data: any): Promise<string | ErrorInterface> {
        const self = this;
        self.logger.log('miapp.sdk.service.miappPutInDb: ', data);

        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error(401, 'DB put impossible. Need a user logged in.'));
        }

        let _id: string;
        if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
            _id = data._id;
        }
        if (!_id) {
            _id = self._generateObjectUniqueId(self.connection.miappId);
        }
        let crypto: SessionCryptoInterface;
        if (self.connection.miappCrypto) {
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
            self.connection.miappVersion,
            crypto);
    };

    public miappRemoveInDb(data_id: string): Promise<void | ErrorInterface> {
        const self = this;
        self.logger.log('miapp.sdk.service.miappRemoveInDb ', data_id);

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

    public miappFindInDb(data_id: string): Promise<any | ErrorInterface> {
        const self = this;
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error(401, 'miapp.sdk.service.miappFindInDb : need a user logged in.'));
        }

        let crypto: SessionCryptoInterface;
        if (self.connection.miappCrypto) {
            crypto = {
                obj: self.connection,
                method: 'decrypt'
            };
        }

        return self.session.get(data_id, crypto);
    };

    public miappFindAllInDb(): Promise<Array<any> | ErrorInterface> {
        const self = this;

        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error(401, 'Need a user logged in.'));
        }

        let crypto: SessionCryptoInterface;
        if (self.connection.miappCrypto) {
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

    public miappPostOnEndpoint(key: string, data?: any): Promise<any | ErrorInterface> {
        const filter: EndpointFilterInterface = {
            key: key
        };
        const endpoints = this.miappGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(
                new Error(400,
                    'miapp.sdk.service.miappPostOnEndpoint : endpoint does not exist.'));
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

    public miappGetIdToken(): string {
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
        self.logger.log('miapp.sdk.service._loginInternal');
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
                        self.logger.error('miapp.sdk.service._loginInternal error : ' + err);
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
        this.session.setRemote(this.connection.getDBs({filter: 'theBestOnes'}));
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
