// import PouchDB from 'pouchdb';
const PouchDB: any = undefined;

import {Connection} from './fidj.sdk.connection';
import {Base64} from './fidj.tools.base64';
import {LocalStorage} from './fidj.tools.storage';
// let fidj : any;
// let fidjSdk  :any;


/**
 * @private please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
export class SrvFidj {
    'use strict';

    private sdk;
    private logger;
    private promise;
    private storage;
    private session;
    private connection;

    // deprecated ?
    private currentUser;
    private fidjURL;
    private fidjDBURL;
    private fidjOrg;
    private fidjAppVersion;
    private appName;
    private fidjClient;
    private fidjIsOffline;
    private fidjAuthEndDate;

    constructor(logger, promise) {

        this.sdk = {
            org: 'fidj',
            version: '1.0.81',
            dev: false
        };
        this.logger = {
            log: function () {
            }, error: function () {
            }, warn: function () {
            }
        };
        //this.logger = logger;
        this.logger.log('fidj.sdk.service : constructor');
        this.promise = promise;
        this.storage = new LocalStorage(window.localStorage, 'fidj.');
        this.session = {
            db: null,
            dbRecordCount: 0,
            dbLastSync: null
        };

        // todo set connection in sdk.base
        this.connection = {
            fidjId: null,
            fidjSalt: 'fidjDefaultSalt',
            client: null,
            user: null,
            accessToken: this.storage.get('accessToken') || null,
            idToken: this.storage.get('idToken') || null,
            refreshToken: this.storage.get('refreshToken') || null,
            states: this.storage.get('states') || {}
        };
    }

    /**
     *
     * @param options Optional settings
     * @param options.fidjId {string} required use your customized endpoints
     * @param options.fidjSalt {string} required use your customized endpoints
     * @param options.devMode {boolean} optional default false, use your customized endpoints
     * @returns {*}
     */
    public fidjInit(options) {

        var self = this;
        self.logger.log('fidj.sdk.service.fidjInit : ', options);
        if (!options || !options.fidjId) {
            self.logger.error('fidj.sdk.service.fidjInit : bad init');
            return self.promise.reject('fidj.sdk.service.fidjInit : bad init');
        }

        self.sdk.dev = options.devMode;

        return new self.promise(function (resolve, reject) {
            self.verifyConnectionStates()
                .then(function () {

                    self.connection.fidjId = options.fidjId;
                    self.connection.fidjSalt = options.fidjSalt;
                    let url = self.getEndpoints({filter: 'theBestOne'})[0];
                    self.connection.client = new Connection(self.sdk.org, self.connection.fidjId, true, false, url);
                    resolve();
                })
                .catch(function (err) {
                    self.logger.error('fidj.sdk.service.fidjInit : error ', err);
                    reject('fidj.sdk.service.fidjInit : error ' + err.toString());
                });
        });
    };

    /**
     * Call it only at login
     * Erase all (db & storage)
     *
     *
     * @param login
     * @param password
     * @returns {*}
     */
    public fidjLogin(login, password) {
        var self = this;
        self.logger.log('fidj.sdk.service.fidjLogin');
        if (!self.connection.client)
            return self.promise.reject('fidj.sdk.service.fidjLogin : Did you fidj.sdk.service.fidjInit() ?');

        return new self.promise(function (resolve, reject) {
            self.removeAll()
                .then(function () {
                    self._createSession();
                    return self.verifyConnectionStates();
                })
                .then(function () {
                    return self._loginInternal(login, password);
                })
                .then(function (user) {
                    self.setConnection(user);
                    return self.syncDb();
                })
                .then(function () {
                    resolve(self.connection.user);
                })
                .catch(function (err) {
                    self.logger.error('fidj.sdk.service.fidjLogin : err : ', err);
                    reject(err);
                });
        });
    };

    /**
     *
     * @param options
     * @param options.accessToken {string} optional
     * @param options.idToken {string} optional
     * @returns {*}
     */
    public fidjLoginInDemoMode(options) {
        var self = this;

        self.connection.accessToken = options.accessToken;
        self.connection.idToken = options.idToken;

        return self.fidjLogin('demo', 'demo');
    };

    public fidjRoles() {
        try {
            var payload = this.connection.idToken.split('.')[1];
            var decoded = Base64.decode(payload);
            return JSON.parse(decoded).roles;
        }
        catch (e) {
        }
        return null;
    };

    public fidjMessage() {
        try {
            var payload = this.connection.idToken.split('.')[1];
            var decoded = Base64.decode(payload);
            return JSON.parse(decoded).message;
        }
        catch (e) {
        }
        return null;
    };

    public fidjIsLogin() {
        if (!this.connection.accessToken) return false;
        return true;
    };

    public fidjLogoff() {
        var self = this;
        //if (!self.currentUser) return self.promise.reject('fidj.sdk.service not logged in');

        //self.currentUser = null;
        return self.removeAll();
    };

    /**
     * Synchronize DB
     * @param fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @returns {*} promise with this.session.db
     */
    public fidjSync(fnInitFirstData, fnInitFirstData_Arg) {
        var self = this;
        self.logger.log('fidj.sdk.service.fidjSync');
        if (!self.connection.client || !self.session.db)
            return self.promise.reject('fidj.sdk.service.fidjSync : DB sync impossible. Did you fidj.sdk.service.fidjLogin() ?');

        var firstSync = !self.session.dbFirstSyncDone;

        return new self.promise(function (resolve, reject) {

            self.syncDb()
                .then(function () {
                    self.logger.log('fidj.sdk.service.fidjSync syncDb resolved');
                    return self.isDbEmpty();
                })
                .then(function (isEmpty) {
                    self.logger.log('fidj.sdk.service.fidjSync isEmpty : ', isEmpty, firstSync);
                    if (isEmpty && firstSync && fnInitFirstData) {
                        var ret = fnInitFirstData(fnInitFirstData_Arg);
                        if (ret && ret['catch'] instanceof Function) return ret;
                        if (typeof ret === 'string') self.logger.log(ret);
                    }
                    return self.promise.resolve();
                })
                .then(function () {
                    self.logger.log('fidj.sdk.service.fidjSync fnInitFirstData resolved');
                    self.session.dbFirstSyncDone = true;
                    return self.session.db.info();
                })
                .then(function (result) {
                    self.session.dbRecordCount = 0;
                    if (result && result.doc_count) self.session.dbRecordCount = result.doc_count;
                    self.logger.log('fidj.sdk.service.fidjSync _dbRecordCount : ' + self.session.dbRecordCount);

                    return self.refreshConnection();
                })
                .then(function (code) {
                    // todo code ? offline ? not authorized -> login ?
                    if (code === 403 || code === 401) {
                        reject(code, 'unauthorized');
                    }
                    else
                        resolve(self.session.dbRecordCount);
                })
                .catch(function (err) {
                    var errMessage = 'fidj.sdk.service.fidjSync err : ' + err.toString() + ')';
                    //self.logger.error(errMessage);
                    reject({code: 500, msg: errMessage});
                })
            ;
        });
    };

    /**
     *
     * @param data
     * @returns {*}
     */
    public fidjPutInDb(data) {
        var self = this;
        self.logger.log('fidj.sdk.service.fidjPutInDb :', data);

        if (!self.currentUser || !self.currentUser._id || !self.session.db)
            return self.promise.reject('fidj.sdk.service.fidjPutInDb : DB put impossible. Need a user logged in. (' + self.currentUser + ')');

        data.fidjUserId = self.currentUser._id;
        data.fidjOrgId = self.fidjOrg;
        data.fidjAppVersion = self.fidjAppVersion;

        var dataId = data._id;
        if (!dataId) dataId = self._generateObjectUniqueId(self.appName);
        delete data._id;
        data._id = dataId;
        return new self.promise(function (resolve, reject) {
            self.session.db.put(data, function (err, response) {
                if (response && response.ok && response.id && response.rev) {
                    data._id = response.id;
                    data._rev = response.rev;
                    self.session.dbRecordCount++;
                    self.logger.log('updatedData: ' + data._id + ' - ' + data._rev);
                    resolve(data);
                    return;
                }
                reject(err);
            });
        });

    };

    /**
     *
     * @param data
     * @returns {*}
     */
    // todo test : fidjRemoveInDb
    public fidjRemoveInDb(data) {
        var self = this;
        self.logger.log('fidj.sdk.service.fidjRemoveInDb ', data);

        if (!self.session.db)
            return self.promise.reject('fidj.sdk.service.fidjRemoveInDb : DB put impossible. Need a user logged in. (' + self.currentUser + ')');

        if (!data._id)
            return self.promise.reject('fidj.sdk.service.fidjRemoveInDb : DB put impossible. Need the data._id.');

        return new self.promise(function (resolve, reject) {
            self.session.db.get(data._id)
                .then(function (doc) {
                    doc._deleted = true;
                    return self.session.db.put(doc);
                })
                .then(function (result) {
                    resolve();
                })
                .catch(function (err) {
                    reject(err);
                });
        });

    };

    /**
     *
     * @param id
     * @returns {*}
     */
    public fidjFindInDb(id) {
        var self = this;

        if (!self.currentUser || !self.currentUser._id || !self.session.db)
            return self.promise.reject('fidj.sdk.service.fidjFindInDb : need a user logged in. (' + self.currentUser + ')');

        return self.session.db.get(id);
    };

    /**
     *
     * @returns {*}
     */
    public fidjFindAllInDb() {
        var self = this;

        if (!self.currentUser || !self.currentUser._id || !self.session.db)
            return self.promise.reject('fidj.sdk.service.fidjFindAllInDb : need a user logged in. (' + self.currentUser + ')');

        return self.session.db.allDocs({include_docs: true, descending: true});
    };

    // Internal functions

    // todo getEndpoints -> connection
    public getEndpoints(options?) : Array<string> {

        var ea = ['https://fidj/api', 'https://fidj-proxy.herokuapp.com/api'];
        if (this.sdk.dev)
            ea = ['http://localhost:5894/api', 'https://fidj-sandbox.herokuapp.com/api'];

        if (this.connection.accessToken) {
            try {
                var payload = this.connection.accessToken.split('.')[1];
                var decoded = Base64.decode(payload);
                var endpoints = JSON.parse(decoded).endpoints;
                if (endpoints.length) {
                    ea = [];
                    endpoints.forEach(function (endpoint) {
                        ea.push(endpoint.uri);
                    });
                }
            }
            catch (e) {
                this.logger.error('fidj.sdk.service.getEndpoints error: ', e);
            }
        }

        let filteredEa = [];
        if (options && options.filter && options.filter === 'theBestOne') {
            if (this.connection.states && Object.keys(this.connection.states).length) {
                for (let i = 0; (i < ea.length) && (filteredEa.length === 0); i++) {
                    var endpoint = ea[i];
                    if (this.connection.states[endpoint] && this.connection.states[endpoint].state)
                        filteredEa.push(endpoint);
                }
            }
            else if (ea.length) {
                filteredEa = [ea[0]];
            }
        }
        else {
            filteredEa = ea;
        }

        return filteredEa;
    };

    // todo getDBs -> connection
    private getDBs(options?) {
        if (!this.connection.accessToken) return [];

        var dbs = [];
        try {
            var payload = this.connection.accessToken.split('.')[1];
            var decoded = Base64.decode(payload);
            dbs = JSON.parse(decoded).dbs || dbs;
        }
        catch (e) {
            this.logger.error('fidj.sdk.service.getDBs error: ', e);
        }

        var filteredDBs = [];
        if (options && options.filter && options.filter === 'theBestOne') {
            if (this.connection.states && Object.keys(this.connection.states).length) {
                for (var i = 0; (i < dbs.length) && (filteredDBs.length === 0); i++) {
                    var endpoint = dbs[i];
                    if (this.connection.states[endpoint].state)
                        filteredDBs.push(endpoint);
                }
            }
            else if (dbs.length) {
                filteredDBs = [dbs[0]];
            }
        }
        else {
            filteredDBs = dbs;
        }

        return filteredDBs;
    };

    // todo verifyConnectionStates -> connection
    private verifyConnectionStates() {

        var self = this;
        var currentTime = new Date().getTime();

        // need verification ? cache it for 2 hours
        if (Object.keys(self.connection.states).length > 0) {
            var time = self.connection.states[Object.keys(self.connection.states)[0]].time;
            if (currentTime < time)
                return self.promise.resolve();
        }

        // verify via GET status
        self.connection.states = {};
        var endpoints = self.getEndpoints();
        var dbs = self.getDBs();
        var promises = [];
        endpoints.forEach(function (endpoint) {
            promises.push(new self.promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', endpoint);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        self.connection.states[endpoint] = {state: true, time: currentTime};
                    }
                    else {
                        self.connection.states[endpoint] = {state: false, time: currentTime};
                    }
                    resolve();
                };
                xhr.send();
            }));
        });
        dbs.forEach(function (dbEndpoint) {
            promises.push(new self.promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', dbEndpoint);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        self.connection.states[dbEndpoint] = {state: true, time: currentTime};
                    }
                    else {
                        self.connection.states[dbEndpoint] = {state: false, time: currentTime};
                    }
                    resolve();
                };
                xhr.send();
            }));
        });
        return self.promise.all(promises);
    };

    // todo -> connection
    private refreshConnection() {
        var self = this;
        var code = 0;

        // token not expired : ok
        if (self.connection.accessToken) {
            var payload = self.connection.accessToken.split('.')[1];
            var decoded = Base64.decode(payload);
            console.log('new Date().getTime() < JSON.parse(decoded).exp :', (new Date().getTime() / 1000), JSON.parse(decoded).exp);
            if ((new Date().getTime() / 1000) < JSON.parse(decoded).exp) {
                return self.promise.resolve(code);
            }
        }

        return new self.promise(function (resolve, reject) {
            self.connection.client.reAuthenticate(function (err, user) {

                if (err && err.name === '408') {
                    code = 408; // timeout : in memory offline
                }
                else {
                    self.setConnection(user);
                }

                resolve(code);
            });
        });
    };

    // todo -> connection
    private setConnection(clientUser) {
        var self = this;
        // todo : remove not usefull clientUser.fields

        // store in storage
        if (clientUser.access_token) {
            self.connection.accessToken = clientUser.access_token;
            self.storage.set('accessToken', self.connection.accessToken);
        }
        if (clientUser.id_token) {
            self.connection.idToken = clientUser.id_token;
            self.storage.set('idToken', self.connection.idToken);
        }
        if (clientUser.refresh_token) {
            self.connection.refreshToken = clientUser.refresh_token;
            self.storage.set('refreshToken', self.connection.refreshToken);
        }

        // expose roles, message
        self.connection.user = clientUser;
        self.connection.user.roles = self.fidjRoles();
        self.connection.user.message = self.fidjMessage();
    };

    private removeAll() {

        // todo remove connection
        this.storage.remove('accessToken');
        this.storage.remove('idToken');
        this.storage.remove('refreshToken');
        this.storage.remove('states');
        this.connection.user = null;
        this.connection.accessToken = null;
        this.connection.idToken = null;
        this.connection.refreshToken = null;
        this.connection.states = {};

        // remove session
        return this._removeSession();
    };

    /**
     * @deprecated
     * @param endpointURI
     */
    private setAuthEndpoint(endpointURI) {
        this.fidjURL = endpointURI;
        if (this.fidjURL) this.storage.set('fidjURL', this.fidjURL);
        if (this.fidjClient && this.fidjURL) this.fidjClient.setFidjURL(this.fidjURL);
    };

    /**
     * @deprecated
     * @param endpointURI
     */
    private setDBEndpoint(endpointURI) {
        this.fidjDBURL = endpointURI;
        if (this.fidjDBURL) this.storage.set('fidjDBURL', this.fidjDBURL);
    };

    /**
     * @deprecated
     * @param endDate
     */
    private setAuthEndDate(endDate) {
        this.fidjAuthEndDate = endDate;
        if (this.fidjAuthEndDate) this.storage.set('fidjAuthEndDate', this.fidjAuthEndDate);
    };

    /**
     * @deprecated
     * @param b
     */
    private setOffline(b) {
        this.fidjIsOffline = (b == true);
        this.storage.set('fidjIsOffline', this.fidjIsOffline);
    };

    /**
     *
     * @param login
     * @param password
     * @param updateProperties
     * @returns {*}
     * @private
     */
    private _loginInternal(login, password, updateProperties?) {
        var self = this;
        self.logger.log('fidj.sdk.service._loginInternal');
        if (!self.connection.client)
            return self.promise.reject('fidj.sdk.service._loginInternal : need init');

        return new self.promise(function (resolve, reject) {

                self.connection.client.logout();

                self.connection.client.login(self.connection.fidjId, login, password, updateProperties,
                    function (err, loginUser) {
                        // self.logger.log('fidj.sdk.service._loginInternal done :' + err + ' user:' + user);
                        if (err || !loginUser) {
                            // Error - could not log user in, even for 404
                            self.logger.error('fidj.sdk.service._loginInternal error : ' + err);
                            return reject(err);
                        }

                        // Success - user has been logged in
                        loginUser.email = login;
                        resolve(loginUser);
                    });


            }
        );
    };

    /**
     * @deprecated
     * @param userIDToDelete
     * @returns {*}
     */
    private deleteUser(userIDToDelete) {
        var self = this;
        if (self.fidjIsOffline) {
            return self.promise.resolve(null);
        }

        if (!self.fidjClient) {
            return self.promise.reject('fidj.sdk.service not initialized');
        }

        return new self.promise(function (resolve, reject) {
            self.fidjClient.deleteUserMLE(userIDToDelete, function (err) {
                // self.logger.log('fidj.sdk.service.deleteUserMLE callback done :' + err);
                if (err) {
                    // Error - could not log user in
                    return reject(err);
                }
                return resolve();
            });
        });
    };

    private isDbEmpty() {
        var self = this;
        self.logger.log('fidj.sdk.service.isDbEmpty ..');
        if (!self.session.db) {//if (!self.currentUser || !self.currentUser.email || !pouchDB) {
            var error = 'fidj.sdk.service.isDbEmpty : DB search impossible. Need a user logged in. (' + self.currentUser + ')';
            self.logger.error(error);
            return self.promise.reject(error);
        }

        self.logger.log('fidj.sdk.service.isDbEmpty call');
        return new self.promise(function (resolve, reject) {
            self.session.db
                .allDocs({
                    //filter: function (doc) {
                    //    if (!self.currentUser || !self.currentUser._id) return doc;
                    //    if (doc.fidjUserId === self.currentUser._id) return doc;
                    //}
                })
                .then(function (response) {
                    self.logger.log('fidj.sdk.service.isDbEmpty callback');
                    if (!response) {
                        reject();
                        return;
                    }

                    self.session.dbRecordCount = response.total_rows;
                    //if (response && response.total_rows && response.total_rows > 5) return resolve(false);
                    if (response.total_rows && response.total_rows > 0) {
                        resolve(false);
                        return;
                    }

                    self.logger.log('fidj.sdk.service.isDbEmpty callback: ' + response.total_rows);
                    resolve(true);

                })
                .catch(function (err) {
                    reject(err);
                });
        });
    };

    private syncDb = function () {
        var self = this;
        var uri = self.getDBs({filter: 'theBestOne'});
        if (!uri || uri.length === 0) return self.promise.reject({code: 408, msg: 'no uri'}); // offline ?

        return new self.promise(function (resolve, reject) {
            try {

                if (!self.session.remoteDb || self.session.remoteUri !== uri[0]) {
                    self.session.remoteUri = uri;
                    self.session.remoteDb = new PouchDB(self.session.remoteUri);// todo , {headers: {'Authorization': 'Bearer ' + id_token}});
                }

                self.session.db
                    .sync(self.session.remoteDb, {
                        filter: function (doc) {
                            if (!self.connection.user || !self.connection.user._id) return;
                            if (doc.fidjUserId === self.connection.user._id) return doc;
                        }
                    })
                    .on('complete', function () {
                        resolve();
                    })
                    .on('error', function (err) {
                        // todo err code
                        reject({code: 401, msg: err});
                    })
                    .on('denied', function (err) {
                        reject({code: 403, msg: err});
                    });
            }
            catch (err) {
                reject({code: 500, msg: 'fidj.sdk.service.syncDb : erreur catched : ' + err});
            }
        });

    };

    /**
     * @deprecated ?
     */
    private setCurrentUser = function (user) {
        var self = this;
        if (!user)
            return self.logger.log('fidj.sdk.service.setCurrentUser : need a valid user');

        // Set a currentUser
        if (!self.currentUser) self.currentUser = {};

        // Look for an unique id
        var firstUserId = user._id;
        if (!firstUserId) firstUserId = self.currentUser._id;
        if (!firstUserId) firstUserId = self._generateObjectUniqueId(self.fidjAppVersion, 'user');

        user._id = firstUserId;
        user.fidjUserId = firstUserId;
        user.fidjOrgId = self.fidjOrgId;
        user.fidjAppVersion = self.fidjAppVersion;

        // Merge from stored currentUser and user gave in
        //self.logger.log(self.currentUser);
        for (var attrname in user) {
            //self.logger.log('' + attrname + ' = ' + user[attrname]);
            if (user[attrname]) self.currentUser[attrname] = user[attrname];
        }

        // Delete and don't store some fields : _rev ...
        delete self.currentUser._rev;

        // store it
        self.storage.set('fidjCurrentUser', self.currentUser);
        self.logger.log('fidj.sdk.service.setCurrentUser :', self.currentUser);
    };

    /**
     * @deprecated ?
     */
    private putFirstUserInEmptyDb = function (firstUser) {
        var self = this;
        self.logger.log('fidj.sdk.service.putFirstUserInEmptyBd');
        if (!firstUser || !self.currentUser || !self.currentUser.email || !self.session.db || !self.session.db.put)
            return self.promise.reject('fidj.sdk.service.putFirstUserInEmptyBd : DB put impossible. Need a user logged in. (' + self.currentUser + ')_');

        var firstUserId = firstUser._id;
        if (!firstUserId) firstUserId = self.currentUser._id;
        if (!firstUserId) firstUserId = self._generateObjectUniqueId(self.appName, 'user');

        firstUser.fidjUserId = firstUserId;
        firstUser.fidjOrgId = self.fidjOrg;
        firstUser.fidjAppVersion = self.fidjAppVersion;
        delete firstUser._id;
        firstUser._id = firstUserId;

        return new self.promise(function (resolve, reject) {
            try {
                self.logger.log('fidj.sdk.service.putFirstUserInEmptyBd : put ...');
                self.session.db.put(firstUser)
                    .then(function (response) {

                        self.logger.log('fidj.sdk.service.putFirstUserInEmptyBd : then ...');

                        if (response && response.ok && response.id && response.rev) {
                            firstUser._id = response.id;
                            firstUser._rev = response.rev;
                            self.logger.log('fidj.sdk.service.putFirstUserInEmptyBd : firstUser: ' + firstUser._id + ' - ' + firstUser._rev);

                            self.session.dbRecordCount++;
                            self.setCurrentUser(firstUser);
                            resolve(firstUser);
                        }
                        else {
                            reject('fidj.sdk.service.putFirstUserInEmptyBd : bad response');
                        }
                    })
                    .catch(function (err) {
                        self.logger.log('fidj.sdk.service.putFirstUserInEmptyBd : catched : ' + err);
                        reject(err);
                    });
            }
            catch (err) {
                self.logger.log('fidj.sdk.service.putFirstUserInEmptyBd : catched ...: ' + err);
                reject(err);
            }
        });
    };


    /**
     *
     * @private
     */
    private _createSession() {
        var self = this;
        self.session.db = new PouchDB('fidj_db', {adapter: 'websql'});
        self.session.dbRecordCount = 0;
        self.session.dbLastSync = new Date().getTime();
    };

    /**
     *
     * @returns {*}
     * @private
     */
    private _removeSession() {
        var self = this;
        self.logger.log('fidj.sdk.service._removeSession');
        var cleanSession = function () {
            self.session.dbRecordCount = 0;
            self.session.dbInitialized = false;
            self.session.dbFirstSyncDone = false;
        };

        if (!self.session.db) {
            cleanSession();
            return self.promise.resolve();
        }

        if (self.session.db && !self.session.db.destroy)
            return self.promise.reject('fidj.sdk.service._removeSession : DB clean impossible.');

        return new self.promise(function (resolve, reject) {

            self.session.db.destroy(function (err, info) {
                if (err) return reject(err);

                cleanSession();
                self.logger.log('fidj.sdk.service._removeSession done : ' + info);
                return resolve();
            });
        });
    };

    /**
     *
     * @param a
     * @returns {*}
     * @private
     */
    private _testPromise = function (a) {
        if (a) return this.promise.resolve('test promise ok ' + a);
        return new this.promise(function (resolve, reject) {
            resolve('test promise ok');
        });
    };


    private _srvDataUniqId = 0;

    private _generateObjectUniqueId(appName, type?, name?) {

        //return null;
        var now = new Date();
        var simpleDate = '' + now.getFullYear() + '' + now.getMonth() + '' + now.getDate() + '' + now.getHours() + '' + now.getMinutes();//new Date().toISOString();
        var sequId = ++this._srvDataUniqId;
        var UId = '';
        if (appName && appName.charAt(0)) UId += appName.charAt(0) + '';
        if (type && type.length > 3) UId += type.substring(0, 4);
        if (name && name.length > 3) UId += name.substring(0, 4);
        UId += simpleDate + '' + sequId;
        return UId;
    }

}
