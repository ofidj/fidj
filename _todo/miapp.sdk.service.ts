// import PouchDB from 'pouchdb';
let PouchDB: any;

import {Connection} from './miapp.sdk.connection';
import {Base64} from './miapp.tools.base64';
import {LocalStorage} from './miapp.tools.storage';
//let miapp : any;
//let miappSdk  :any;


/**
 * @private please use its angular.js or angular.io wrapper
 * usefull only for miapp.io dev team
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
    private miappURL;
    private miappDBURL;
    private miappOrg;
    private miappAppVersion;
    private appName;
    private miappClient;
    private miappIsOffline;
    private miappAuthEndDate;

    constructor(logger, promise) {

        this.sdk = {
            org: 'miapp.io',
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
        this.logger.log('miapp.sdk.service : constructor');
        this.promise = promise;
        this.storage = new LocalStorage(window.localStorage, 'miapp.');
        this.session = {
            db: null,
            dbRecordCount: 0,
            dbLastSync: null
        };

        // todo set connection in sdk.base
        this.connection = {
            miappId: null,
            miappSalt: 'miappDefaultSalt',
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
     * @param options.miappId {string} required use your customized endpoints
     * @param options.miappSalt {string} required use your customized endpoints
     * @param options.devMode {boolean} optional default false, use your customized endpoints
     * @returns {*}
     */
    public miappInit(options) {

        var self = this;
        self.logger.log('miapp.sdk.service.miappInit : ', options);
        if (!options || !options.miappId) {
            self.logger.error('miapp.sdk.service.miappInit : bad init');
            return self.promise.reject('miapp.sdk.service.miappInit : bad init');
        }

        self.sdk.dev = options.devMode;

        return new self.promise(function (resolve, reject) {
            self.verifyConnectionStates()
                .then(function () {

                    self.connection.miappId = options.miappId;
                    self.connection.miappSalt = options.miappSalt;
                    let url = self.getEndpoints({filter: 'theBestOne'})[0];
                    self.connection.client = new Connection(self.sdk.org, self.connection.miappId, true, false, url);
                    resolve();
                })
                .catch(function (err) {
                    self.logger.error('miapp.sdk.service.miappInit : error ', err);
                    reject('miapp.sdk.service.miappInit : error ' + err.toString());
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
    public miappLogin(login, password) {
        var self = this;
        self.logger.log('miapp.sdk.service.miappLogin');
        if (!self.connection.client)
            return self.promise.reject('miapp.sdk.service.miappLogin : Did you miapp.sdk.service.miappInit() ?');

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
                    self.logger.error('miapp.sdk.service.miappLogin : err : ', err);
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
    public miappLoginInDemoMode(options) {
        var self = this;

        self.connection.accessToken = options.accessToken;
        self.connection.idToken = options.idToken;

        return self.miappLogin('demo', 'demo');
    };

    public miappRoles() {
        try {
            var payload = this.connection.idToken.split('.')[1];
            var decoded = Base64.decode(payload);
            return JSON.parse(decoded).roles;
        }
        catch (e) {
        }
        return null;
    };

    public miappMessage() {
        try {
            var payload = this.connection.idToken.split('.')[1];
            var decoded = Base64.decode(payload);
            return JSON.parse(decoded).message;
        }
        catch (e) {
        }
        return null;
    };

    public miappIsLogin() {
        if (!this.connection.accessToken) return false;
        return true;
    };

    public miappLogoff() {
        var self = this;
        //if (!self.currentUser) return self.promise.reject('miapp.sdk.service not logged in');

        //self.currentUser = null;
        return self.removeAll();
    };

    /**
     * Synchronize DB
     * @param fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @returns {*} promise with this.session.db
     */
    public miappSync(fnInitFirstData, fnInitFirstData_Arg) {
        var self = this;
        self.logger.log('miapp.sdk.service.miappSync');
        if (!self.connection.client || !self.session.db)
            return self.promise.reject('miapp.sdk.service.miappSync : DB sync impossible. Did you miapp.sdk.service.miappLogin() ?');

        var firstSync = !self.session.dbFirstSyncDone;

        return new self.promise(function (resolve, reject) {

            self.syncDb()
                .then(function () {
                    self.logger.log('miapp.sdk.service.miappSync syncDb resolved');
                    return self.isDbEmpty();
                })
                .then(function (isEmpty) {
                    self.logger.log('miapp.sdk.service.miappSync isEmpty : ', isEmpty, firstSync);
                    if (isEmpty && firstSync && fnInitFirstData) {
                        var ret = fnInitFirstData(fnInitFirstData_Arg);
                        if (ret && ret['catch'] instanceof Function) return ret;
                        if (typeof ret === 'string') self.logger.log(ret);
                    }
                    return self.promise.resolve();
                })
                .then(function () {
                    self.logger.log('miapp.sdk.service.miappSync fnInitFirstData resolved');
                    self.session.dbFirstSyncDone = true;
                    return self.session.db.info();
                })
                .then(function (result) {
                    self.session.dbRecordCount = 0;
                    if (result && result.doc_count) self.session.dbRecordCount = result.doc_count;
                    self.logger.log('miapp.sdk.service.miappSync _dbRecordCount : ' + self.session.dbRecordCount);

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
                    var errMessage = 'miapp.sdk.service.miappSync err : ' + err.toString() + ')';
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
    public miappPutInDb(data) {
        var self = this;
        self.logger.log('miapp.sdk.service.miappPutInDb :', data);

        if (!self.currentUser || !self.currentUser._id || !self.session.db)
            return self.promise.reject('miapp.sdk.service.miappPutInDb : DB put impossible. Need a user logged in. (' + self.currentUser + ')');

        data.miappUserId = self.currentUser._id;
        data.miappOrgId = self.miappOrg;
        data.miappAppVersion = self.miappAppVersion;

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
    // todo test : miappRemoveInDb
    public miappRemoveInDb(data) {
        var self = this;
        self.logger.log('miapp.sdk.service.miappRemoveInDb ', data);

        if (!self.session.db)
            return self.promise.reject('miapp.sdk.service.miappRemoveInDb : DB put impossible. Need a user logged in. (' + self.currentUser + ')');

        if (!data._id)
            return self.promise.reject('miapp.sdk.service.miappRemoveInDb : DB put impossible. Need the data._id.');

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
    public miappFindInDb(id) {
        var self = this;

        if (!self.currentUser || !self.currentUser._id || !self.session.db)
            return self.promise.reject('miapp.sdk.service.miappFindInDb : need a user logged in. (' + self.currentUser + ')');

        return self.session.db.get(id);
    };

    /**
     *
     * @returns {*}
     */
    public miappFindAllInDb() {
        var self = this;

        if (!self.currentUser || !self.currentUser._id || !self.session.db)
            return self.promise.reject('miapp.sdk.service.miappFindAllInDb : need a user logged in. (' + self.currentUser + ')');

        return self.session.db.allDocs({include_docs: true, descending: true});
    };

    // Internal functions

    // todo getEndpoints -> connection
    public getEndpoints(options?) : Array<string> {

        var ea = ['https://miapp.io/api', 'https://miapp-proxy.herokuapp.com/api'];
        if (this.sdk.dev)
            ea = ['http://localhost:5894/api', 'https://miapp-sandbox.herokuapp.com/api'];

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
                this.logger.error('miapp.sdk.service.getEndpoints error: ', e);
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
            this.logger.error('miapp.sdk.service.getDBs error: ', e);
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
        self.connection.user.roles = self.miappRoles();
        self.connection.user.message = self.miappMessage();
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
        this.miappURL = endpointURI;
        if (this.miappURL) this.storage.set('miappURL', this.miappURL);
        if (this.miappClient && this.miappURL) this.miappClient.setFidjURL(this.miappURL);
    };

    /**
     * @deprecated
     * @param endpointURI
     */
    private setDBEndpoint(endpointURI) {
        this.miappDBURL = endpointURI;
        if (this.miappDBURL) this.storage.set('miappDBURL', this.miappDBURL);
    };

    /**
     * @deprecated
     * @param endDate
     */
    private setAuthEndDate(endDate) {
        this.miappAuthEndDate = endDate;
        if (this.miappAuthEndDate) this.storage.set('miappAuthEndDate', this.miappAuthEndDate);
    };

    /**
     * @deprecated
     * @param b
     */
    private setOffline(b) {
        this.miappIsOffline = (b == true);
        this.storage.set('miappIsOffline', this.miappIsOffline);
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
        self.logger.log('miapp.sdk.service._loginInternal');
        if (!self.connection.client)
            return self.promise.reject('miapp.sdk.service._loginInternal : need init');

        return new self.promise(function (resolve, reject) {

                self.connection.client.logout();

                self.connection.client.login(self.connection.miappId, login, password, updateProperties,
                    function (err, loginUser) {
                        // self.logger.log('miapp.sdk.service._loginInternal done :' + err + ' user:' + user);
                        if (err || !loginUser) {
                            // Error - could not log user in, even for 404
                            self.logger.error('miapp.sdk.service._loginInternal error : ' + err);
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
        if (self.miappIsOffline) {
            return self.promise.resolve(null);
        }

        if (!self.miappClient) {
            return self.promise.reject('miapp.sdk.service not initialized');
        }

        return new self.promise(function (resolve, reject) {
            self.miappClient.deleteUserMLE(userIDToDelete, function (err) {
                // self.logger.log('miapp.sdk.service.deleteUserMLE callback done :' + err);
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
        self.logger.log('miapp.sdk.service.isDbEmpty ..');
        if (!self.session.db) {//if (!self.currentUser || !self.currentUser.email || !pouchDB) {
            var error = 'miapp.sdk.service.isDbEmpty : DB search impossible. Need a user logged in. (' + self.currentUser + ')';
            self.logger.error(error);
            return self.promise.reject(error);
        }

        self.logger.log('miapp.sdk.service.isDbEmpty call');
        return new self.promise(function (resolve, reject) {
            self.session.db
                .allDocs({
                    //filter: function (doc) {
                    //    if (!self.currentUser || !self.currentUser._id) return doc;
                    //    if (doc.miappUserId === self.currentUser._id) return doc;
                    //}
                })
                .then(function (response) {
                    self.logger.log('miapp.sdk.service.isDbEmpty callback');
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

                    self.logger.log('miapp.sdk.service.isDbEmpty callback: ' + response.total_rows);
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
                            if (doc.miappUserId === self.connection.user._id) return doc;
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
                reject({code: 500, msg: 'miapp.sdk.service.syncDb : erreur catched : ' + err});
            }
        });

    };

    /**
     * @deprecated ?
     */
    private setCurrentUser = function (user) {
        var self = this;
        if (!user)
            return self.logger.log('miapp.sdk.service.setCurrentUser : need a valid user');

        // Set a currentUser
        if (!self.currentUser) self.currentUser = {};

        // Look for an unique id
        var firstUserId = user._id;
        if (!firstUserId) firstUserId = self.currentUser._id;
        if (!firstUserId) firstUserId = self._generateObjectUniqueId(self.miappAppVersion, 'user');

        user._id = firstUserId;
        user.miappUserId = firstUserId;
        user.miappOrgId = self.miappOrgId;
        user.miappAppVersion = self.miappAppVersion;

        // Merge from stored currentUser and user gave in
        //self.logger.log(self.currentUser);
        for (var attrname in user) {
            //self.logger.log('' + attrname + ' = ' + user[attrname]);
            if (user[attrname]) self.currentUser[attrname] = user[attrname];
        }

        // Delete and don't store some fields : _rev ...
        delete self.currentUser._rev;

        // store it
        self.storage.set('miappCurrentUser', self.currentUser);
        self.logger.log('miapp.sdk.service.setCurrentUser :', self.currentUser);
    };

    /**
     * @deprecated ?
     */
    private putFirstUserInEmptyDb = function (firstUser) {
        var self = this;
        self.logger.log('miapp.sdk.service.putFirstUserInEmptyBd');
        if (!firstUser || !self.currentUser || !self.currentUser.email || !self.session.db || !self.session.db.put)
            return self.promise.reject('miapp.sdk.service.putFirstUserInEmptyBd : DB put impossible. Need a user logged in. (' + self.currentUser + ')_');

        var firstUserId = firstUser._id;
        if (!firstUserId) firstUserId = self.currentUser._id;
        if (!firstUserId) firstUserId = self._generateObjectUniqueId(self.appName, 'user');

        firstUser.miappUserId = firstUserId;
        firstUser.miappOrgId = self.miappOrg;
        firstUser.miappAppVersion = self.miappAppVersion;
        delete firstUser._id;
        firstUser._id = firstUserId;

        return new self.promise(function (resolve, reject) {
            try {
                self.logger.log('miapp.sdk.service.putFirstUserInEmptyBd : put ...');
                self.session.db.put(firstUser)
                    .then(function (response) {

                        self.logger.log('miapp.sdk.service.putFirstUserInEmptyBd : then ...');

                        if (response && response.ok && response.id && response.rev) {
                            firstUser._id = response.id;
                            firstUser._rev = response.rev;
                            self.logger.log('miapp.sdk.service.putFirstUserInEmptyBd : firstUser: ' + firstUser._id + ' - ' + firstUser._rev);

                            self.session.dbRecordCount++;
                            self.setCurrentUser(firstUser);
                            resolve(firstUser);
                        }
                        else {
                            reject('miapp.sdk.service.putFirstUserInEmptyBd : bad response');
                        }
                    })
                    .catch(function (err) {
                        self.logger.log('miapp.sdk.service.putFirstUserInEmptyBd : catched : ' + err);
                        reject(err);
                    });
            }
            catch (err) {
                self.logger.log('miapp.sdk.service.putFirstUserInEmptyBd : catched ...: ' + err);
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
        self.session.db = new PouchDB('miapp_db', {adapter: 'websql'});
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
        self.logger.log('miapp.sdk.service._removeSession');
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
            return self.promise.reject('miapp.sdk.service._removeSession : DB clean impossible.');

        return new self.promise(function (resolve, reject) {

            self.session.db.destroy(function (err, info) {
                if (err) return reject(err);

                cleanSession();
                self.logger.log('miapp.sdk.service._removeSession done : ' + info);
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
