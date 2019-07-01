/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Base64, Xor } from '../tools';
import { Ajax } from './ajax';
import { Error } from '../sdk/error';
var Connection = /** @class */ (function () {
    function Connection(_sdk, _storage, _logger) {
        this._sdk = _sdk;
        this._storage = _storage;
        this._logger = _logger;
        this.client = null;
        this.user = null;
        this.cryptoSalt = this._storage.get(Connection._cryptoSalt) || null;
        this.cryptoSaltNext = this._storage.get(Connection._cryptoSaltNext) || null;
        this.accessToken = this._storage.get(Connection._accessToken) || null;
        this.accessTokenPrevious = this._storage.get('v2.accessTokenPrevious') || null;
        this.idToken = this._storage.get(Connection._idToken) || null;
        this.refreshToken = this._storage.get(Connection._refreshToken) || null;
        this.states = this._storage.get(Connection._states) || {};
        this.apis = [];
    }
    ;
    /**
     * @return {?}
     */
    Connection.prototype.isReady = /**
     * @return {?}
     */
    function () {
        return !!this.client && this.client.isReady();
    };
    /**
     * @param {?=} force
     * @return {?}
     */
    Connection.prototype.destroy = /**
     * @param {?=} force
     * @return {?}
     */
    function (force) {
        this._storage.remove(Connection._accessToken);
        this._storage.remove(Connection._idToken);
        this._storage.remove(Connection._refreshToken);
        this._storage.remove(Connection._states);
        if (this.accessToken) {
            this.accessTokenPrevious = this.accessToken;
            this._storage.set(Connection._accessTokenPrevious, this.accessTokenPrevious);
        }
        if (force) {
            this._storage.remove(Connection._cryptoSalt);
            this._storage.remove(Connection._cryptoSaltNext);
            this._storage.remove(Connection._accessTokenPrevious);
        }
        this.user = null;
        if (this.client) {
            // this.client.setClientId(null);
            this.client.logout();
        }
        this.accessToken = null;
        this.idToken = null;
        this.refreshToken = null;
        this.states = {}; // new Map<string, boolean>();
    };
    /**
     * @param {?} client
     * @return {?}
     */
    Connection.prototype.setClient = /**
     * @param {?} client
     * @return {?}
     */
    function (client) {
        this.client = client;
        if (!this.user) {
            this.user = {};
        }
        // this._user._id = this._client.clientId;
        this.user._name = JSON.parse(this.getIdPayload({ name: '' })).name;
    };
    /**
     * @param {?} user
     * @return {?}
     */
    Connection.prototype.setUser = /**
     * @param {?} user
     * @return {?}
     */
    function (user) {
        this.user = user;
        if (this.user._id) {
            this.client.setClientId(this.user._id);
            // store only clientId
            delete this.user._id;
        }
    };
    /**
     * @return {?}
     */
    Connection.prototype.getUser = /**
     * @return {?}
     */
    function () {
        return this.user;
    };
    /**
     * @return {?}
     */
    Connection.prototype.getClient = /**
     * @return {?}
     */
    function () {
        return this.client;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Connection.prototype.setCryptoSalt = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (this.cryptoSalt !== value && this.cryptoSaltNext !== value) {
            this.cryptoSaltNext = value;
            this._storage.set(Connection._cryptoSaltNext, this.cryptoSaltNext);
        }
        if (!this.cryptoSalt) {
            this.setCryptoSaltAsVerified();
        }
    };
    /**
     * @return {?}
     */
    Connection.prototype.setCryptoSaltAsVerified = /**
     * @return {?}
     */
    function () {
        if (this.cryptoSaltNext) {
            this.cryptoSalt = this.cryptoSaltNext;
            this._storage.set(Connection._cryptoSalt, this.cryptoSalt);
        }
        this.cryptoSaltNext = null;
        this._storage.remove(Connection._cryptoSaltNext);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    Connection.prototype.encrypt = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        else {
            /** @type {?} */
            var dataAsObj = { string: data };
            data = JSON.stringify(dataAsObj);
        }
        if (this.fidjCrypto && this.cryptoSalt) {
            /** @type {?} */
            var key = this.cryptoSalt;
            return Xor.encrypt(data, key);
        }
        else {
            return data;
        }
    };
    /**
     * @param {?} data
     * @return {?}
     */
    Connection.prototype.decrypt = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var decrypted = null;
        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSaltNext) {
                /** @type {?} */
                var key = this.cryptoSaltNext;
                decrypted = Xor.decrypt(data, key);
                decrypted = JSON.parse(decrypted);
                // if (decrypted) {
                //    this.setCryptoSaltAsVerified();
                // }
            }
        }
        catch (err) {
            decrypted = null;
        }
        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSalt) {
                /** @type {?} */
                var key = this.cryptoSalt;
                decrypted = Xor.decrypt(data, key);
                decrypted = JSON.parse(decrypted);
            }
        }
        catch (err) {
            decrypted = null;
        }
        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSalt) {
                /** @type {?} */
                var key = this.cryptoSalt;
                decrypted = Xor.decrypt(data, key, true);
                decrypted = JSON.parse(decrypted);
            }
        }
        catch (err) {
            decrypted = null;
        }
        try {
            if (!decrypted) {
                decrypted = JSON.parse(data);
            }
            if (decrypted && decrypted.string) {
                decrypted = decrypted.string;
            }
        }
        catch (err) {
            decrypted = null;
        }
        return decrypted;
    };
    /**
     * @return {?}
     */
    Connection.prototype.isLogin = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var exp = true;
        try {
            /** @type {?} */
            var payload = this.refreshToken.split('.')[1];
            /** @type {?} */
            var decoded = JSON.parse(Base64.decode(payload));
            exp = ((new Date().getTime() / 1000) >= decoded.exp);
        }
        catch (e) {
        }
        return !exp;
    };
    // todo reintegrate client.login()
    /**
     * @return {?}
     */
    Connection.prototype.logout = /**
     * @return {?}
     */
    function () {
        return this.getClient().logout(this.refreshToken);
    };
    /**
     * @return {?}
     */
    Connection.prototype.getClientId = /**
     * @return {?}
     */
    function () {
        if (!this.client) {
            return null;
        }
        return this.client.clientId;
    };
    /**
     * @return {?}
     */
    Connection.prototype.getIdToken = /**
     * @return {?}
     */
    function () {
        return this.idToken;
    };
    /**
     * @param {?=} def
     * @return {?}
     */
    Connection.prototype.getIdPayload = /**
     * @param {?=} def
     * @return {?}
     */
    function (def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            /** @type {?} */
            var payload = this.getIdToken().split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    };
    /**
     * @param {?=} def
     * @return {?}
     */
    Connection.prototype.getAccessPayload = /**
     * @param {?=} def
     * @return {?}
     */
    function (def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            /** @type {?} */
            var payload = this.accessToken.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    };
    /**
     * @param {?=} def
     * @return {?}
     */
    Connection.prototype.getPreviousAccessPayload = /**
     * @param {?=} def
     * @return {?}
     */
    function (def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            /** @type {?} */
            var payload = this.accessTokenPrevious.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    };
    /**
     * @return {?}
     */
    Connection.prototype.refreshConnection = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // store states
        this._storage.set(Connection._states, this.states);
        // token not expired : ok
        if (this.accessToken) {
            /** @type {?} */
            var payload = this.accessToken.split('.')[1];
            /** @type {?} */
            var decoded = Base64.decode(payload);
            /** @type {?} */
            var notExpired = (new Date().getTime() / 1000) < JSON.parse(decoded).exp;
            // console.log('new Date().getTime() < JSON.parse(decoded).exp :', (new Date().getTime() / 1000), JSON.parse(decoded).exp);
            this._logger.log('fidj.connection.connection.refreshConnection : token not expired ? ', notExpired);
            if (notExpired) {
                return Promise.resolve(this.getUser());
            }
        }
        // remove expired refreshToken
        if (this.refreshToken) {
            /** @type {?} */
            var payload = this.refreshToken.split('.')[1];
            /** @type {?} */
            var decoded = Base64.decode(payload);
            /** @type {?} */
            var expired = (new Date().getTime() / 1000) >= JSON.parse(decoded).exp;
            this._logger.log('fidj.connection.connection.refreshConnection : refreshToken not expired ? ', expired);
            if (expired) {
                this._storage.remove(Connection._refreshToken);
            }
        }
        // remove expired accessToken & idToken & store it as Previous one
        this.accessTokenPrevious = this.accessToken;
        this._storage.set('v2.accessTokenPrevious', this.accessTokenPrevious);
        this._storage.remove(Connection._accessToken);
        this._storage.remove(Connection._idToken);
        this.accessToken = null;
        this.idToken = null;
        // refresh authentication
        this._logger.log('fidj.connection.connection.refreshConnection : refresh authentication.');
        return new Promise(function (resolve, reject) {
            /** @type {?} */
            var client = _this.getClient();
            if (!client) {
                return reject(new Error(400, 'Need an initialized client.'));
            }
            _this.getClient().reAuthenticate(_this.refreshToken)
                .then(function (user) {
                _this.setConnection(user);
                resolve(_this.getUser());
            })
                .catch(function (err) {
                // if (err && err.code === 408) {
                //     code = 408; // no api uri or basic timeout : offline
                // } else if (err && err.code === 404) {
                //     code = 404; // page not found : offline
                // } else if (err && err.code === 410) {
                //     code = 403; // token expired or device not sure : need relogin
                // } else if (err) {
                //     code = 403; // forbidden : need relogin
                // }
                // resolve(code);
                reject(err);
            });
        });
    };
    ;
    /**
     * @param {?} clientUser
     * @return {?}
     */
    Connection.prototype.setConnection = /**
     * @param {?} clientUser
     * @return {?}
     */
    function (clientUser) {
        // only in private storage
        if (clientUser.access_token) {
            this.accessToken = clientUser.access_token;
            this._storage.set(Connection._accessToken, this.accessToken);
            delete clientUser.access_token;
            /** @type {?} */
            var salt = JSON.parse(this.getAccessPayload({ salt: '' })).salt;
            if (salt) {
                this.setCryptoSalt(salt);
            }
        }
        if (clientUser.id_token) {
            this.idToken = clientUser.id_token;
            this._storage.set(Connection._idToken, this.idToken);
            delete clientUser.id_token;
        }
        if (clientUser.refresh_token) {
            this.refreshToken = clientUser.refresh_token;
            this._storage.set(Connection._refreshToken, this.refreshToken);
            delete clientUser.refresh_token;
        }
        // store changed states
        this._storage.set(Connection._states, this.states);
        // expose roles, message
        // clientUser.roles = self.fidjRoles();
        // clientUser.message = self.fidjMessage();
        clientUser.roles = JSON.parse(this.getIdPayload({ roles: [] })).roles;
        clientUser.message = JSON.parse(this.getIdPayload({ message: '' })).message;
        this.setUser(clientUser);
    };
    ;
    /**
     * @param {?} options
     * @return {?}
     */
    Connection.prototype.setConnectionOffline = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        if (options.accessToken) {
            this.accessToken = options.accessToken;
            this._storage.set(Connection._accessToken, this.accessToken);
        }
        if (options.idToken) {
            this.idToken = options.idToken;
            this._storage.set(Connection._idToken, this.idToken);
        }
        if (options.refreshToken) {
            this.refreshToken = options.refreshToken;
            this._storage.set(Connection._refreshToken, this.refreshToken);
        }
        this.setUser({
            roles: JSON.parse(this.getIdPayload({ roles: [] })).roles,
            message: JSON.parse(this.getIdPayload({ message: '' })).message,
            _id: 'demo'
        });
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    Connection.prototype.getApiEndpoints = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var ea = [
            { key: 'fidj.default', url: 'https://fidj.ovh/api', blocked: false }
        ];
        /** @type {?} */
        var filteredEa = [];
        if (!this._sdk.prod) {
            ea = [
                { key: 'fidj.default', url: 'http://localhost:3201/api', blocked: false },
                { key: 'fidj.default', url: 'https://fidj-sandbox.herokuapp.com/api', blocked: false }
            ];
        }
        if (this.accessToken) {
            /** @type {?} */
            var val = this.getAccessPayload({ apis: [] });
            /** @type {?} */
            var apiEndpoints = JSON.parse(val).apis;
            if (apiEndpoints && apiEndpoints.length) {
                ea = [];
                apiEndpoints.forEach(function (endpoint) {
                    if (endpoint.url) {
                        ea.push(endpoint);
                    }
                });
            }
        }
        if (this.accessTokenPrevious) {
            /** @type {?} */
            var apiEndpoints = JSON.parse(this.getPreviousAccessPayload({ apis: [] })).apis;
            if (apiEndpoints && apiEndpoints.length) {
                apiEndpoints.forEach(function (endpoint) {
                    if (endpoint.url && ea.filter(function (r) { return r.url === endpoint.url; }).length === 0) {
                        ea.push(endpoint);
                    }
                });
            }
        }
        /** @type {?} */
        var couldCheckStates = true;
        if (this.states && Object.keys(this.states).length) {
            for (var i = 0; (i < ea.length) && couldCheckStates; i++) {
                if (!this.states[ea[i].url]) {
                    couldCheckStates = false;
                }
            }
        }
        else {
            couldCheckStates = false;
        }
        if (options && options.filter) {
            if (couldCheckStates && options.filter === 'theBestOne') {
                for (var i = 0; (i < ea.length) && (filteredEa.length === 0); i++) {
                    /** @type {?} */
                    var endpoint = ea[i];
                    if (this.states[endpoint.url] &&
                        this.states[endpoint.url].state) {
                        filteredEa.push(endpoint);
                    }
                }
            }
            else if (couldCheckStates && options.filter === 'theBestOldOne') {
                /** @type {?} */
                var bestOldOne = void 0;
                for (var i = 0; (i < ea.length); i++) {
                    /** @type {?} */
                    var endpoint = ea[i];
                    if (this.states[endpoint.url] &&
                        this.states[endpoint.url].lastTimeWasOk &&
                        (!bestOldOne || this.states[endpoint.url].lastTimeWasOk > this.states[bestOldOne.url].lastTimeWasOk)) {
                        bestOldOne = endpoint;
                    }
                }
                if (bestOldOne) {
                    filteredEa.push(bestOldOne);
                }
            }
            else if (ea.length) {
                filteredEa.push(ea[0]);
            }
        }
        else {
            filteredEa = ea;
        }
        return filteredEa;
    };
    ;
    /**
     * @param {?=} options
     * @return {?}
     */
    Connection.prototype.getDBs = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        if (!this.accessToken) {
            return [];
        }
        /** @type {?} */
        var random = Math.random() % 2;
        /** @type {?} */
        var dbs = JSON.parse(this.getAccessPayload({ dbs: [] })).dbs || [];
        // need to synchronize db
        if (random === 0) {
            dbs = dbs.sort();
        }
        else if (random === 1) {
            dbs = dbs.reverse();
        }
        /** @type {?} */
        var filteredDBs = [];
        /** @type {?} */
        var couldCheckStates = true;
        if (this.states && Object.keys(this.states).length) {
            for (var i = 0; (i < dbs.length) && couldCheckStates; i++) {
                if (!this.states[dbs[i].url]) {
                    couldCheckStates = false;
                }
            }
        }
        else {
            couldCheckStates = false;
        }
        if (couldCheckStates && options && options.filter === 'theBestOne') {
            for (var i = 0; (i < dbs.length) && (filteredDBs.length === 0); i++) {
                /** @type {?} */
                var endpoint = dbs[i];
                if (this.states[endpoint.url] &&
                    this.states[endpoint.url].state) {
                    filteredDBs.push(endpoint);
                }
            }
        }
        else if (couldCheckStates && options && options.filter === 'theBestOnes') {
            for (var i = 0; (i < dbs.length); i++) {
                /** @type {?} */
                var endpoint = dbs[i];
                if (this.states[endpoint.url] &&
                    this.states[endpoint.url].state) {
                    filteredDBs.push(endpoint);
                }
            }
        }
        else if (options && options.filter === 'theBestOne' && dbs.length) {
            filteredDBs.push(dbs[0]);
        }
        else {
            filteredDBs = dbs;
        }
        return filteredDBs;
    };
    ;
    /**
     * @param {?} currentTime
     * @param {?} endpointUrl
     * @return {?}
     */
    Connection.prototype.verifyApiState = /**
     * @param {?} currentTime
     * @param {?} endpointUrl
     * @return {?}
     */
    function (currentTime, endpointUrl) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, state, err_1, lastTimeWasOk;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Ajax()
                                .get({
                                url: endpointUrl + '/status?isok=' + this._sdk.version,
                                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                            })];
                    case 1:
                        data = _a.sent();
                        state = false;
                        if (data && data.isok) {
                            state = true;
                        }
                        this.states[endpointUrl] = { state: state, time: currentTime, lastTimeWasOk: currentTime };
                        // resolve();
                        // console.log('verifyApiState: state', endpointUrl, state);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        lastTimeWasOk = 0;
                        if (this.states[endpointUrl]) {
                            lastTimeWasOk = this.states[endpointUrl].lastTimeWasOk;
                        }
                        this.states[endpointUrl] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                        // resolve();
                        return [3 /*break*/, 3];
                    case 3:
                        // console.log('verifyApiState: ', this.states);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {?} currentTime
     * @param {?} dbEndpoint
     * @return {?}
     */
    Connection.prototype.verifyDbState = /**
     * @param {?} currentTime
     * @param {?} dbEndpoint
     * @return {?}
     */
    function (currentTime, dbEndpoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, err_2, lastTimeWasOk;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new Ajax()
                                .get({
                                url: dbEndpoint,
                                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                            })];
                    case 1:
                        data = _a.sent();
                        this.states[dbEndpoint] = { state: true, time: currentTime, lastTimeWasOk: currentTime };
                        // resolve();
                        // console.log('verifyDbState: state', dbEndpoint, true);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        lastTimeWasOk = 0;
                        if (this.states[dbEndpoint]) {
                            lastTimeWasOk = this.states[dbEndpoint].lastTimeWasOk;
                        }
                        this.states[dbEndpoint] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                        // resolve();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    Connection.prototype.verifyConnectionStates = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var currentTime = new Date().getTime();
        /** @type {?} */
        var promises = [];
        // this.states = {};
        this.apis = this.getApiEndpoints();
        this.apis.forEach(function (endpointObj) {
            /** @type {?} */
            var endpointUrl = endpointObj.url;
            if (!endpointUrl) {
                endpointUrl = endpointObj.toString();
            }
            promises.push(_this.verifyApiState(currentTime, endpointUrl));
        });
        /** @type {?} */
        var dbs = this.getDBs();
        dbs.forEach(function (dbEndpointObj) {
            /** @type {?} */
            var dbEndpoint = dbEndpointObj.url;
            if (!dbEndpoint) {
                dbEndpoint = dbEndpointObj.toString();
            }
            promises.push(_this.verifyDbState(currentTime, dbEndpoint));
        });
        return Promise.all(promises);
    };
    ;
    Connection._accessToken = 'v2.accessToken';
    Connection._accessTokenPrevious = 'v2.accessTokenPrevious';
    Connection._idToken = 'v2.idToken';
    Connection._refreshToken = 'v2.refreshToken';
    Connection._states = 'v2.states';
    Connection._cryptoSalt = 'v2.cryptoSalt';
    Connection._cryptoSaltNext = 'v2.cryptoSalt.next';
    return Connection;
}());
export { Connection };
if (false) {
    /** @type {?} */
    Connection._accessToken;
    /** @type {?} */
    Connection._accessTokenPrevious;
    /** @type {?} */
    Connection._idToken;
    /** @type {?} */
    Connection._refreshToken;
    /** @type {?} */
    Connection._states;
    /** @type {?} */
    Connection._cryptoSalt;
    /** @type {?} */
    Connection._cryptoSaltNext;
    /** @type {?} */
    Connection.prototype.fidjId;
    /** @type {?} */
    Connection.prototype.fidjVersion;
    /** @type {?} */
    Connection.prototype.fidjCrypto;
    /** @type {?} */
    Connection.prototype.accessToken;
    /** @type {?} */
    Connection.prototype.accessTokenPrevious;
    /** @type {?} */
    Connection.prototype.idToken;
    /** @type {?} */
    Connection.prototype.refreshToken;
    /** @type {?} */
    Connection.prototype.states;
    /** @type {?} */
    Connection.prototype.apis;
    /** @type {?} */
    Connection.prototype.cryptoSalt;
    /** @type {?} */
    Connection.prototype.cryptoSaltNext;
    /** @type {?} */
    Connection.prototype.client;
    /** @type {?} */
    Connection.prototype.user;
    /** @type {?} */
    Connection.prototype._sdk;
    /** @type {?} */
    Connection.prototype._storage;
    /** @type {?} */
    Connection.prototype._logger;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJjb25uZWN0aW9uL2Nvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxPQUFPLEVBQUMsTUFBTSxFQUFnQixHQUFHLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbkQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sY0FBYyxDQUFDOztJQTJCL0Isb0JBQW9CLElBQWtCLEVBQ2xCLFVBQ0E7UUFGQSxTQUFJLEdBQUosSUFBSSxDQUFjO1FBQ2xCLGFBQVEsR0FBUixRQUFRO1FBQ1IsWUFBTyxHQUFQLE9BQU87UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3BFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUM1RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDdEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLElBQUksSUFBSSxDQUFDO1FBQy9FLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUM5RCxJQUFJLENBQUMsWUFB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VyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDaEUsQ0FBQyxDQUFDOztRQUVILElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxQixHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsYUFBYTs7WUFDdEIsSUFBSSxVQUFVLEdBQVcsYUFBYSxDQUFDLEdBQUcsQ0FBQztZQUMzQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNiLFVBQVUsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDekM7WUFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDOUQsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2hDO0lBQUEsQ0FBQzs4QkF2bEI0QixnQkFBZ0I7c0NBQ1Isd0JBQXdCOzBCQUNwQyxZQUFZOytCQUNQLGlCQUFpQjt5QkFDdkIsV0FBVzs2QkFDUCxlQUFlO2lDQUNYLG9CQUFvQjtxQkE5QnpEOztTQU9hLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NsaWVudH0gZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHtNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLCBTZGtJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgTG9nZ2VySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5pbXBvcnQge0Jhc2U2NCwgTG9jYWxTdG9yYWdlLCBYb3J9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7Q29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi4vc2RrL2Vycm9yJztcblxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb24ge1xuXG4gICAgcHVibGljIGZpZGpJZDogc3RyaW5nO1xuICAgIHB1YmxpYyBmaWRqVmVyc2lvbjogc3RyaW5nO1xuICAgIHB1YmxpYyBmaWRqQ3J5cHRvOiBib29sZWFuO1xuICAgIHB1YmxpYyBhY2Nlc3NUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyBhY2Nlc3NUb2tlblByZXZpb3VzOiBzdHJpbmc7XG4gICAgcHVibGljIGlkVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIHN0YXRlczogeyBbczogc3RyaW5nXTogeyBzdGF0ZTogYm9vbGVhbiwgdGltZTogbnVtYmVyLCBsYXN0VGltZVdhc09rOiBudW1iZXIgfTsgfTsgLy8gTWFwPHN0cmluZywgYm9vbGVhbj47XG4gICAgcHVibGljIGFwaXM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPjtcblxuICAgIHByaXZhdGUgY3J5cHRvU2FsdDogc3RyaW5nO1xuICAgIHByaXZhdGUgY3J5cHRvU2FsdE5leHQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudDogQ2xpZW50O1xuICAgIHByaXZhdGUgdXNlcjogYW55O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2FjY2Vzc1Rva2VuID0gJ3YyLmFjY2Vzc1Rva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfYWNjZXNzVG9rZW5QcmV2aW91cyA9ICd2Mi5hY2Nlc3NUb2tlblByZXZpb3VzJztcbiAgICBwcml2YXRlIHN0YXRpYyBfaWRUb2tlbiA9ICd2Mi5pZFRva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVmcmVzaFRva2VuID0gJ3YyLnJlZnJlc2hUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3N0YXRlcyA9ICd2Mi5zdGF0ZXMnO1xuICAgIHByaXZhdGUgc3RhdGljIF9jcnlwdG9TYWx0ID0gJ3YyLmNyeXB0b1NhbHQnO1xuICAgIHByaXZhdGUgc3RhdGljIF9jcnlwdG9TYWx0TmV4dCA9ICd2Mi5jcnlwdG9TYWx0Lm5leHQnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2RrOiBTZGtJbnRlcmZhY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBfc3RvcmFnZTogTG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX2xvZ2dlcjogTG9nZ2VySW50ZXJmYWNlKSB7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgdGhpcy5jcnlwdG9TYWx0ID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdCkgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0KSB8fCBudWxsO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4pIHx8IG51bGw7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyA9IHRoaXMuX3N0b3JhZ2UuZ2V0KCd2Mi5hY2Nlc3NUb2tlblByZXZpb3VzJykgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5faWRUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4pIHx8IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGVzID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fc3RhdGVzKSB8fCB7fTtcbiAgICAgICAgdGhpcy5hcGlzID0gW107XG4gICAgfTtcblxuICAgIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuY2xpZW50ICYmIHRoaXMuY2xpZW50LmlzUmVhZHkoKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KGZvcmNlPzogYm9vbGVhbik6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5faWRUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3N0YXRlcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyA9IHRoaXMuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlblByZXZpb3VzLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvcmNlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0KTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0KTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICAgICAgICAvLyB0aGlzLmNsaWVudC5zZXRDbGllbnRJZChudWxsKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LmxvZ291dCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGVzID0ge307IC8vIG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuICAgIH1cblxuICAgIHNldENsaWVudChjbGllbnQ6IENsaWVudCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgICAgICBpZiAoIXRoaXMudXNlcikge1xuICAgICAgICAgICAgdGhpcy51c2VyID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLl91c2VyLl9pZCA9IHRoaXMuX2NsaWVudC5jbGllbnRJZDtcbiAgICAgICAgdGhpcy51c2VyLl9uYW1lID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bmFtZTogJyd9KSkubmFtZTtcbiAgICB9XG5cbiAgICBzZXRVc2VyKHVzZXI6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICBpZiAodGhpcy51c2VyLl9pZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnQuc2V0Q2xpZW50SWQodGhpcy51c2VyLl9pZCk7XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIG9ubHkgY2xpZW50SWRcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnVzZXIuX2lkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VXNlcigpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyO1xuICAgIH1cblxuICAgIGdldENsaWVudCgpOiBDbGllbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnQ7XG4gICAgfVxuXG4gICAgc2V0Q3J5cHRvU2FsdCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmNyeXB0b1NhbHQgIT09IHZhbHVlICYmIHRoaXMuY3J5cHRvU2FsdE5leHQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCwgdGhpcy5jcnlwdG9TYWx0TmV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgdGhpcy5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNyeXB0b1NhbHROZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmNyeXB0b1NhbHQgPSB0aGlzLmNyeXB0b1NhbHROZXh0O1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdCwgdGhpcy5jcnlwdG9TYWx0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpO1xuICAgIH1cblxuICAgIGVuY3J5cHQoZGF0YTogYW55KTogc3RyaW5nIHtcblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhQXNPYmogPSB7c3RyaW5nOiBkYXRhfTtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhQXNPYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgIHJldHVybiBYb3IuZW5jcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWNyeXB0KGRhdGE6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGxldCBkZWNyeXB0ZWQgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCAmJiB0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0TmV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdE5leHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgKGRlY3J5cHRlZCkge1xuICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCAmJiB0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXksIHRydWUpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCkge1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkZWNyeXB0ZWQgJiYgZGVjcnlwdGVkLnN0cmluZykge1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IGRlY3J5cHRlZC5zdHJpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlY3J5cHRlZDtcbiAgICB9XG5cbiAgICBpc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZXhwID0gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlZnJlc2hUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IEpTT04ucGFyc2UoQmFzZTY0LmRlY29kZShwYXlsb2FkKSk7XG4gICAgICAgICAgICBleHAgPSAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPj0gZGVjb2RlZC5leHApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIWV4cDtcbiAgICB9XG5cbiAgICAvLyB0b2RvIHJlaW50ZWdyYXRlIGNsaWVudC5sb2dpbigpXG5cbiAgICBsb2dvdXQoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50KCkubG9nb3V0KHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICB9XG5cbiAgICBnZXRDbGllbnRJZCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuY2xpZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnQuY2xpZW50SWQ7XG4gICAgfVxuXG4gICAgZ2V0SWRUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5pZFRva2VuO1xuICAgIH1cblxuICAgIGdldElkUGF5bG9hZChkZWY/OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoZGVmICYmIHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmdldElkVG9rZW4oKS5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYgPyBkZWYgOiBudWxsO1xuICAgIH1cblxuICAgIGdldEFjY2Vzc1BheWxvYWQoZGVmPzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGRlZiAmJiB0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYgPyBkZWYgOiBudWxsO1xuICAgIH1cblxuICAgIGdldFByZXZpb3VzQWNjZXNzUGF5bG9hZChkZWY/OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoZGVmICYmIHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmID8gZGVmIDogbnVsbDtcbiAgICB9XG5cbiAgICByZWZyZXNoQ29ubmVjdGlvbigpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgLy8gc3RvcmUgc3RhdGVzXG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3N0YXRlcywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIC8vIHRva2VuIG5vdCBleHBpcmVkIDogb2tcbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGNvbnN0IG5vdEV4cGlyZWQgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA8IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25ldyBEYXRlKCkuZ2V0VGltZSgpIDwgSlNPTi5wYXJzZShkZWNvZGVkKS5leHAgOicsIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCk7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLmNvbm5lY3Rpb24uY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbiA6IHRva2VuIG5vdCBleHBpcmVkID8gJywgbm90RXhwaXJlZCk7XG4gICAgICAgICAgICBpZiAobm90RXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4cGlyZWQgcmVmcmVzaFRva2VuXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZWQgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBKU09OLnBhcnNlKGRlY29kZWQpLmV4cDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouY29ubmVjdGlvbi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uIDogcmVmcmVzaFRva2VuIG5vdCBleHBpcmVkID8gJywgZXhwaXJlZCk7XG4gICAgICAgICAgICBpZiAoZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCBhY2Nlc3NUb2tlbiAmIGlkVG9rZW4gJiBzdG9yZSBpdCBhcyBQcmV2aW91cyBvbmVcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcblxuICAgICAgICAvLyByZWZyZXNoIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouY29ubmVjdGlvbi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uIDogcmVmcmVzaCBhdXRoZW50aWNhdGlvbi4nKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50KCk7XG5cbiAgICAgICAgICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhbiBpbml0aWFsaXplZCBjbGllbnQuJykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50KCkucmVBdXRoZW50aWNhdGUodGhpcy5yZWZyZXNoVG9rZW4pXG4gICAgICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29ubmVjdGlvbih1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MDgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDg7IC8vIG5vIGFwaSB1cmkgb3IgYmFzaWMgdGltZW91dCA6IG9mZmxpbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09IDQwNCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwNDsgLy8gcGFnZSBub3QgZm91bmQgOiBvZmZsaW5lXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MTApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDM7IC8vIHRva2VuIGV4cGlyZWQgb3IgZGV2aWNlIG5vdCBzdXJlIDogbmVlZCByZWxvZ2luXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDAzOyAvLyBmb3JiaWRkZW4gOiBuZWVkIHJlbG9naW5cbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc29sdmUoY29kZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2V0Q29ubmVjdGlvbihjbGllbnRVc2VyOiBhbnkpOiB2b2lkIHtcblxuICAgICAgICAvLyBvbmx5IGluIHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBpZiAoY2xpZW50VXNlci5hY2Nlc3NfdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBjbGllbnRVc2VyLmFjY2Vzc190b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuLCB0aGlzLmFjY2Vzc1Rva2VuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjbGllbnRVc2VyLmFjY2Vzc190b2tlbjtcblxuICAgICAgICAgICAgY29uc3Qgc2FsdDogc3RyaW5nID0gSlNPTi5wYXJzZSh0aGlzLmdldEFjY2Vzc1BheWxvYWQoe3NhbHQ6ICcnfSkpLnNhbHQ7XG4gICAgICAgICAgICBpZiAoc2FsdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3J5cHRvU2FsdChzYWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VXNlci5pZF90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gY2xpZW50VXNlci5pZF90b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgICAgICBkZWxldGUgY2xpZW50VXNlci5pZF90b2tlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VXNlci5yZWZyZXNoX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IGNsaWVudFVzZXIucmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbiwgdGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGNsaWVudFVzZXIucmVmcmVzaF90b2tlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3JlIGNoYW5nZWQgc3RhdGVzXG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3N0YXRlcywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIC8vIGV4cG9zZSByb2xlcywgbWVzc2FnZVxuICAgICAgICAvLyBjbGllbnRVc2VyLnJvbGVzID0gc2VsZi5maWRqUm9sZXMoKTtcbiAgICAgICAgLy8gY2xpZW50VXNlci5tZXNzYWdlID0gc2VsZi5maWRqTWVzc2FnZSgpO1xuICAgICAgICBjbGllbnRVc2VyLnJvbGVzID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgICAgICBjbGllbnRVc2VyLm1lc3NhZ2UgPSBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlO1xuICAgICAgICB0aGlzLnNldFVzZXIoY2xpZW50VXNlcik7XG4gICAgfTtcblxuICAgIHNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnM6IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiB2b2lkIHtcblxuICAgICAgICBpZiAob3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaWRUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gb3B0aW9ucy5pZFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5faWRUb2tlbiwgdGhpcy5pZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5yZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gb3B0aW9ucy5yZWZyZXNoVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VXNlcih7XG4gICAgICAgICAgICByb2xlczogSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzLFxuICAgICAgICAgICAgbWVzc2FnZTogSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZSxcbiAgICAgICAgICAgIF9pZDogJ2RlbW8nXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEFwaUVuZHBvaW50cyhvcHRpb25zPzogQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcblxuICAgICAgICAvLyB0b2RvIDogbGV0IGVhID0gWydodHRwczovL2ZpZGovYXBpJywgJ2h0dHBzOi8vZmlkai1wcm94eS5oZXJva3VhcHAuY29tL2FwaSddO1xuICAgICAgICBsZXQgZWE6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBbXG4gICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cHM6Ly9maWRqLm92aC9hcGknLCBibG9ja2VkOiBmYWxzZX1dO1xuICAgICAgICBsZXQgZmlsdGVyZWRFYSA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5fc2RrLnByb2QpIHtcbiAgICAgICAgICAgIGVhID0gW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjMyMDEvYXBpJywgYmxvY2tlZDogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwczovL2ZpZGotc2FuZGJveC5oZXJva3VhcHAuY29tL2FwaScsIGJsb2NrZWQ6IGZhbHNlfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmdldEFjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSk7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHZhbCkuYXBpcztcbiAgICAgICAgICAgIGlmIChhcGlFbmRwb2ludHMgJiYgYXBpRW5kcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVhID0gW107XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKSB7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHRoaXMuZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKHthcGlzOiBbXX0pKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwgJiYgZWEuZmlsdGVyKChyKSA9PiByLnVybCA9PT0gZW5kcG9pbnQudXJsKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bGRDaGVja1N0YXRlcyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZWFbaV0udXJsXSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIpIHtcblxuICAgICAgICAgICAgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgKGZpbHRlcmVkRWEubGVuZ3RoID09PSAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9sZE9uZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmVzdE9sZE9uZTogRW5kcG9pbnRJbnRlcmZhY2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICghYmVzdE9sZE9uZSB8fCB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgPiB0aGlzLnN0YXRlc1tiZXN0T2xkT25lLnVybF0ubGFzdFRpbWVXYXNPaykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdE9sZE9uZSA9IGVuZHBvaW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZXN0T2xkT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChiZXN0T2xkT25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChlYVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZEVhID0gZWE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRFYTtcbiAgICB9O1xuXG4gICAgZ2V0REJzKG9wdGlvbnM/OiBDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2UpOiBFbmRwb2ludEludGVyZmFjZVtdIHtcblxuICAgICAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG8gdGVzdCByYW5kb20gREIgY29ubmVjdGlvblxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICUgMjtcbiAgICAgICAgbGV0IGRicyA9IEpTT04ucGFyc2UodGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtkYnM6IFtdfSkpLmRicyB8fCBbXTtcblxuICAgICAgICAvLyBuZWVkIHRvIHN5bmNocm9uaXplIGRiXG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICAgIGRicyA9IGRicy5zb3J0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuZG9tID09PSAxKSB7XG4gICAgICAgICAgICBkYnMgPSBkYnMucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpbHRlcmVkREJzID0gW107XG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZGJzW2ldLnVybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCkgJiYgKGZpbHRlcmVkREJzLmxlbmd0aCA9PT0gMCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmVzJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJyAmJiBkYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGRic1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcyA9IGRicztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERCcztcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBhc3luYyB2ZXJpZnlBcGlTdGF0ZShjdXJyZW50VGltZTogbnVtYmVyLCBlbmRwb2ludFVybDogc3RyaW5nKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3ZlcmlmeUFwaVN0YXRlOiAnLCBlbmRwb2ludFVybCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsICsgJy9zdGF0dXM/aXNvaz0nICsgdGhpcy5fc2RrLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuaXNvaykge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXSA9IHtzdGF0ZTogc3RhdGUsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBjdXJyZW50VGltZX07XG4gICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmVyaWZ5QXBpU3RhdGU6IHN0YXRlJywgZW5kcG9pbnRVcmwsIHN0YXRlKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxldCBsYXN0VGltZVdhc09rID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0pIHtcbiAgICAgICAgICAgICAgICBsYXN0VGltZVdhc09rID0gdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0gPSB7c3RhdGU6IGZhbHNlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogbGFzdFRpbWVXYXNPa307XG4gICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ZlcmlmeUFwaVN0YXRlOiAnLCB0aGlzLnN0YXRlcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyB2ZXJpZnlEYlN0YXRlKGN1cnJlbnRUaW1lOiBudW1iZXIsIGRiRW5kcG9pbnQ6IHN0cmluZykge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmVyaWZ5RGJTdGF0ZTogJywgZGJFbmRwb2ludCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGRiRW5kcG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogdHJ1ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcbiAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2ZXJpZnlEYlN0YXRlOiBzdGF0ZScsIGRiRW5kcG9pbnQsIHRydWUpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcbiAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgLy8gdG9kbyBuZWVkIHZlcmlmaWNhdGlvbiA/IG5vdCB5ZXQgKGNhY2hlKVxuICAgICAgICAvLyBpZiAoT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHRpbWUgPSB0aGlzLnN0YXRlc1tPYmplY3Qua2V5cyh0aGlzLnN0YXRlcylbMF1dLnRpbWU7XG4gICAgICAgIC8vICAgICBpZiAoY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdmVyaWZ5IHZpYSBHRVQgc3RhdHVzIG9uIEVuZHBvaW50cyAmIERCc1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgICAgICAvLyB0aGlzLnN0YXRlcyA9IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSB0aGlzLmdldEFwaUVuZHBvaW50cygpO1xuICAgICAgICB0aGlzLmFwaXMuZm9yRWFjaCgoZW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBlbmRwb2ludFVybDogc3RyaW5nID0gZW5kcG9pbnRPYmoudXJsO1xuICAgICAgICAgICAgaWYgKCFlbmRwb2ludFVybCkge1xuICAgICAgICAgICAgICAgIGVuZHBvaW50VXJsID0gZW5kcG9pbnRPYmoudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2VzLnB1c2godGhpcy52ZXJpZnlBcGlTdGF0ZShjdXJyZW50VGltZSwgZW5kcG9pbnRVcmwpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGJzID0gdGhpcy5nZXREQnMoKTtcbiAgICAgICAgZGJzLmZvckVhY2goKGRiRW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBkYkVuZHBvaW50OiBzdHJpbmcgPSBkYkVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZGJFbmRwb2ludCkge1xuICAgICAgICAgICAgICAgIGRiRW5kcG9pbnQgPSBkYkVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMudmVyaWZ5RGJTdGF0ZShjdXJyZW50VGltZSwgZGJFbmRwb2ludCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9O1xuXG59XG4iXX0=