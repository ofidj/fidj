/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Base64, Xor } from '../tools';
import { Ajax } from './ajax';
var Connection = /** @class */ (function () {
    function Connection(_sdk, _storage) {
        this._sdk = _sdk;
        this._storage = _storage;
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
            // console.log('new Date().getTime() < JSON.parse(decoded).exp :', (new Date().getTime() / 1000), JSON.parse(decoded).exp);
            if ((new Date().getTime() / 1000) < JSON.parse(decoded).exp) {
                return Promise.resolve(this.getUser());
            }
        }
        // remove expired refreshToken
        if (this.refreshToken) {
            /** @type {?} */
            var payload = this.refreshToken.split('.')[1];
            /** @type {?} */
            var decoded = Base64.decode(payload);
            if ((new Date().getTime() / 1000) >= JSON.parse(decoded).exp) {
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
        return new Promise(function (resolve, reject) {
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
            { key: 'fidj.default', url: 'https://fidj/api', blocked: false }
        ];
        /** @type {?} */
        var filteredEa = [];
        if (!this._sdk.prod) {
            ea = [
                { key: 'fidj.default', url: 'http://localhost:5894/api', blocked: false },
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
            promises.push(new Promise(function (resolve, reject) {
                new Ajax()
                    .get({
                    url: endpointUrl + '/status?isok=' + _this._sdk.version,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                })
                    .then(function (data) {
                    /** @type {?} */
                    var state = false;
                    if (data && data.isok) {
                        state = true;
                    }
                    _this.states[endpointUrl] = { state: state, time: currentTime, lastTimeWasOk: currentTime };
                    resolve();
                })
                    .catch(function (err) {
                    /** @type {?} */
                    var lastTimeWasOk = 0;
                    if (_this.states[endpointUrl]) {
                        lastTimeWasOk = _this.states[endpointUrl].lastTimeWasOk;
                    }
                    _this.states[endpointUrl] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                    resolve();
                });
            }));
        });
        /** @type {?} */
        var dbs = this.getDBs();
        dbs.forEach(function (dbEndpointObj) {
            /** @type {?} */
            var dbEndpoint = dbEndpointObj.url;
            if (!dbEndpoint) {
                dbEndpoint = dbEndpointObj.toString();
            }
            promises.push(new Promise(function (resolve, reject) {
                new Ajax()
                    .get({
                    url: dbEndpoint,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                })
                    .then(function (data) {
                    _this.states[dbEndpoint] = { state: true, time: currentTime, lastTimeWasOk: currentTime };
                    resolve();
                })
                    .catch(function (err) {
                    /** @type {?} */
                    var lastTimeWasOk = 0;
                    if (_this.states[dbEndpoint]) {
                        lastTimeWasOk = _this.states[dbEndpoint].lastTimeWasOk;
                    }
                    _this.states[dbEndpoint] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                    resolve();
                });
            }));
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
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJjb25uZWN0aW9uL2Nvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE9BQU8sRUFBQyxNQUFNLEVBQWdCLEdBQUcsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDOztJQTRCeEIsb0JBQW9CLElBQWtCLEVBQ2xCO1FBREEsU0FBSSxHQUFKLElBQUksQ0FBYztRQUNsQixhQUFRLEdBQVIsUUFBUTtRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDcEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQzVFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN0RSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDL0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQzlELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUks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S0FDaEM7SUFBQSxDQUFDOzhCQTdqQjRCLGdCQUFnQjtzQ0FDUix3QkFBd0I7MEJBQ3BDLFlBQVk7K0JBQ1AsaUJBQWlCO3lCQUN2QixXQUFXOzZCQUNQLGVBQWU7aUNBQ1gsb0JBQW9CO3FCQTdCekQ7O1NBTWEsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2xpZW50fSBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQge01vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsIFNka0ludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5pbXBvcnQge0Jhc2U2NCwgTG9jYWxTdG9yYWdlLCBYb3J9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7Q29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbiB7XG5cbiAgICBwdWJsaWMgZmlkaklkOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpDcnlwdG86IGJvb2xlYW47XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuUHJldmlvdXM6IHN0cmluZztcbiAgICBwdWJsaWMgaWRUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyByZWZyZXNoVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgc3RhdGVzOiB7IFtzOiBzdHJpbmddOiB7IHN0YXRlOiBib29sZWFuLCB0aW1lOiBudW1iZXIsIGxhc3RUaW1lV2FzT2s6IG51bWJlciB9OyB9OyAvLyBNYXA8c3RyaW5nLCBib29sZWFuPjtcbiAgICBwdWJsaWMgYXBpczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+O1xuXG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0TmV4dDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50OiBDbGllbnQ7XG4gICAgcHJpdmF0ZSB1c2VyOiBhbnk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBfYWNjZXNzVG9rZW4gPSAndjIuYWNjZXNzVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9hY2Nlc3NUb2tlblByZXZpb3VzID0gJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnO1xuICAgIHByaXZhdGUgc3RhdGljIF9pZFRva2VuID0gJ3YyLmlkVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9yZWZyZXNoVG9rZW4gPSAndjIucmVmcmVzaFRva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfc3RhdGVzID0gJ3YyLnN0YXRlcyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHQgPSAndjIuY3J5cHRvU2FsdCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHROZXh0ID0gJ3YyLmNyeXB0b1NhbHQubmV4dCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zZGs6IFNka0ludGVyZmFjZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9zdG9yYWdlOiBMb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgdGhpcy5jbGllbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHQgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0KSB8fCBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5fc3RvcmFnZS5nZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnKSB8fCBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9pZFRva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9zdGF0ZXMpIHx8IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSBbXTtcbiAgICB9O1xuXG4gICAgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jbGllbnQgJiYgdGhpcy5jbGllbnQuaXNSZWFkeSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koZm9yY2U/OiBib29sZWFuKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9pZFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fc3RhdGVzKTtcblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuUHJldmlvdXMsIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5jbGllbnQpIHtcbiAgICAgICAgICAgIC8vIHRoaXMuY2xpZW50LnNldENsaWVudElkKG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jbGllbnQubG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTsgLy8gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50KGNsaWVudDogQ2xpZW50KTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIGlmICghdGhpcy51c2VyKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMuX3VzZXIuX2lkID0gdGhpcy5fY2xpZW50LmNsaWVudElkO1xuICAgICAgICB0aGlzLnVzZXIuX25hbWUgPSBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHtuYW1lOiAnJ30pKS5uYW1lO1xuICAgIH1cblxuICAgIHNldFVzZXIodXNlcjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIGlmICh0aGlzLnVzZXIuX2lkKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5zZXRDbGllbnRJZCh0aGlzLnVzZXIuX2lkKTtcblxuICAgICAgICAgICAgLy8gc3RvcmUgb25seSBjbGllbnRJZFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMudXNlci5faWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRVc2VyKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXI7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50KCk6IENsaWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudDtcbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdCAhPT0gdmFsdWUgJiYgdGhpcy5jcnlwdG9TYWx0TmV4dCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0LCB0aGlzLmNyeXB0b1NhbHROZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdCA9IHRoaXMuY3J5cHRvU2FsdE5leHQ7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0LCB0aGlzLmNyeXB0b1NhbHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSBudWxsO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCk7XG4gICAgfVxuXG4gICAgZW5jcnlwdChkYXRhOiBhbnkpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBc09iaiA9IHtzdHJpbmc6IGRhdGF9O1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGFBc09iaik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgcmV0dXJuIFhvci5lbmNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlY3J5cHQoZGF0YTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgbGV0IGRlY3J5cHRlZCA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHROZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0TmV4dDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCAmJiB0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlY3J5cHRlZCAmJiBkZWNyeXB0ZWQuc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gZGVjcnlwdGVkLnN0cmluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVjcnlwdGVkO1xuICAgIH1cblxuICAgIGlzTG9naW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBleHAgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gSlNPTi5wYXJzZShCYXNlNjQuZGVjb2RlKHBheWxvYWQpKTtcbiAgICAgICAgICAgIGV4cCA9ICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBkZWNvZGVkLmV4cCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhZXhwO1xuICAgIH1cblxuICAgIC8vIHRvZG8gcmVpbnRlZ3JhdGUgY2xpZW50LmxvZ2luKClcblxuICAgIGxvZ291dCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnQoKS5sb2dvdXQodGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgIH1cblxuICAgIGdldENsaWVudElkKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5jbGllbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5jbGllbnRJZDtcbiAgICB9XG5cbiAgICBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0SWRQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuZ2V0SWRUb2tlbigpLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0QWNjZXNzUGF5bG9hZChkZWY/OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoZGVmICYmIHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cy5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYgPyBkZWYgOiBudWxsO1xuICAgIH1cblxuICAgIHJlZnJlc2hDb25uZWN0aW9uKCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICAvLyBzdG9yZSBzdGF0ZXNcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fc3RhdGVzLCB0aGlzLnN0YXRlcyk7XG5cbiAgICAgICAgLy8gdG9rZW4gbm90IGV4cGlyZWQgOiBva1xuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25ldyBEYXRlKCkuZ2V0VGltZSgpIDwgSlNPTi5wYXJzZShkZWNvZGVkKS5leHAgOicsIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCk7XG4gICAgICAgICAgICBpZiAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4cGlyZWQgcmVmcmVzaFRva2VuXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCBhY2Nlc3NUb2tlbiAmIGlkVG9rZW4gJiBzdG9yZSBpdCBhcyBQcmV2aW91cyBvbmVcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcblxuICAgICAgICAvLyByZWZyZXNoIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldENsaWVudCgpLnJlQXV0aGVudGljYXRlKHRoaXMucmVmcmVzaFRva2VuKVxuICAgICAgICAgICAgICAgIC50aGVuKHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENvbm5lY3Rpb24odXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDA4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDA4OyAvLyBubyBhcGkgdXJpIG9yIGJhc2ljIHRpbWVvdXQgOiBvZmZsaW5lXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDQ7IC8vIHBhZ2Ugbm90IGZvdW5kIDogb2ZmbGluZVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDAzOyAvLyB0b2tlbiBleHBpcmVkIG9yIGRldmljZSBub3Qgc3VyZSA6IG5lZWQgcmVsb2dpblxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwMzsgLy8gZm9yYmlkZGVuIDogbmVlZCByZWxvZ2luXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZlKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNldENvbm5lY3Rpb24oY2xpZW50VXNlcjogYW55KTogdm9pZCB7XG5cbiAgICAgICAgLy8gb25seSBpbiBwcml2YXRlIHN0b3JhZ2VcbiAgICAgICAgaWYgKGNsaWVudFVzZXIuYWNjZXNzX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gY2xpZW50VXNlci5hY2Nlc3NfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICBkZWxldGUgY2xpZW50VXNlci5hY2Nlc3NfdG9rZW47XG5cbiAgICAgICAgICAgIGNvbnN0IHNhbHQ6IHN0cmluZyA9IEpTT04ucGFyc2UodGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtzYWx0OiAnJ30pKS5zYWx0O1xuICAgICAgICAgICAgaWYgKHNhbHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHQoc2FsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFVzZXIuaWRfdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IGNsaWVudFVzZXIuaWRfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9pZFRva2VuLCB0aGlzLmlkVG9rZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGNsaWVudFVzZXIuaWRfdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFVzZXIucmVmcmVzaF90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBjbGllbnRVc2VyLnJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjbGllbnRVc2VyLnJlZnJlc2hfdG9rZW47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9yZSBjaGFuZ2VkIHN0YXRlc1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9zdGF0ZXMsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICAvLyBleHBvc2Ugcm9sZXMsIG1lc3NhZ2VcbiAgICAgICAgLy8gY2xpZW50VXNlci5yb2xlcyA9IHNlbGYuZmlkalJvbGVzKCk7XG4gICAgICAgIC8vIGNsaWVudFVzZXIubWVzc2FnZSA9IHNlbGYuZmlkak1lc3NhZ2UoKTtcbiAgICAgICAgY2xpZW50VXNlci5yb2xlcyA9IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcztcbiAgICAgICAgY2xpZW50VXNlci5tZXNzYWdlID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICAgICAgdGhpcy5zZXRVc2VyKGNsaWVudFVzZXIpO1xuICAgIH07XG5cbiAgICBzZXRDb25uZWN0aW9uT2ZmbGluZShvcHRpb25zOiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBvcHRpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4sIHRoaXMuYWNjZXNzVG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmlkVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IG9wdGlvbnMuaWRUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucmVmcmVzaFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IG9wdGlvbnMucmVmcmVzaFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuLCB0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFVzZXIoe1xuICAgICAgICAgICAgcm9sZXM6IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2UsXG4gICAgICAgICAgICBfaWQ6ICdkZW1vJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRBcGlFbmRwb2ludHMob3B0aW9ucz86IENvbm5lY3Rpb25GaW5kT3B0aW9uc0ludGVyZmFjZSk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG5cbiAgICAgICAgLy8gdG9kbyA6IGxldCBlYSA9IFsnaHR0cHM6Ly9maWRqL2FwaScsICdodHRwczovL2ZpZGotcHJveHkuaGVyb2t1YXBwLmNvbS9hcGknXTtcbiAgICAgICAgbGV0IGVhOiBFbmRwb2ludEludGVyZmFjZVtdID0gW1xuICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHBzOi8vZmlkai9hcGknLCBibG9ja2VkOiBmYWxzZX1dO1xuICAgICAgICBsZXQgZmlsdGVyZWRFYSA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5fc2RrLnByb2QpIHtcbiAgICAgICAgICAgIGVhID0gW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjU4OTQvYXBpJywgYmxvY2tlZDogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwczovL2ZpZGotc2FuZGJveC5oZXJva3VhcHAuY29tL2FwaScsIGJsb2NrZWQ6IGZhbHNlfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmdldEFjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSk7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHZhbCkuYXBpcztcbiAgICAgICAgICAgIGlmIChhcGlFbmRwb2ludHMgJiYgYXBpRW5kcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVhID0gW107XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKSB7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHRoaXMuZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKHthcGlzOiBbXX0pKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwgJiYgZWEuZmlsdGVyKChyKSA9PiByLnVybCA9PT0gZW5kcG9pbnQudXJsKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bGRDaGVja1N0YXRlcyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZWFbaV0udXJsXSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIpIHtcblxuICAgICAgICAgICAgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgKGZpbHRlcmVkRWEubGVuZ3RoID09PSAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9sZE9uZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmVzdE9sZE9uZTogRW5kcG9pbnRJbnRlcmZhY2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICghYmVzdE9sZE9uZSB8fCB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgPiB0aGlzLnN0YXRlc1tiZXN0T2xkT25lLnVybF0ubGFzdFRpbWVXYXNPaykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdE9sZE9uZSA9IGVuZHBvaW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZXN0T2xkT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChiZXN0T2xkT25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChlYVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZEVhID0gZWE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRFYTtcbiAgICB9O1xuXG4gICAgZ2V0REJzKG9wdGlvbnM/OiBDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2UpOiBFbmRwb2ludEludGVyZmFjZVtdIHtcblxuICAgICAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG8gdGVzdCByYW5kb20gREIgY29ubmVjdGlvblxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICUgMjtcbiAgICAgICAgbGV0IGRicyA9IEpTT04ucGFyc2UodGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtkYnM6IFtdfSkpLmRicyB8fCBbXTtcblxuICAgICAgICAvLyBuZWVkIHRvIHN5bmNocm9uaXplIGRiXG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICAgIGRicyA9IGRicy5zb3J0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuZG9tID09PSAxKSB7XG4gICAgICAgICAgICBkYnMgPSBkYnMucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpbHRlcmVkREJzID0gW107XG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZGJzW2ldLnVybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCkgJiYgKGZpbHRlcmVkREJzLmxlbmd0aCA9PT0gMCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmVzJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJyAmJiBkYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGRic1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcyA9IGRicztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERCcztcbiAgICB9O1xuXG4gICAgdmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICAvLyB0b2RvIG5lZWQgdmVyaWZpY2F0aW9uID8gbm90IHlldCAoY2FjaGUpXG4gICAgICAgIC8vIGlmIChPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGVzW09iamVjdC5rZXlzKHRoaXMuc3RhdGVzKVswXV0udGltZTtcbiAgICAgICAgLy8gICAgIGlmIChjdXJyZW50VGltZSA8IHRpbWUpIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyB2ZXJpZnkgdmlhIEdFVCBzdGF0dXMgb24gRW5kcG9pbnRzICYgREJzXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgICAgIC8vIHRoaXMuc3RhdGVzID0ge307XG4gICAgICAgIHRoaXMuYXBpcyA9IHRoaXMuZ2V0QXBpRW5kcG9pbnRzKCk7XG4gICAgICAgIHRoaXMuYXBpcy5mb3JFYWNoKChlbmRwb2ludE9iaikgPT4ge1xuICAgICAgICAgICAgbGV0IGVuZHBvaW50VXJsOiBzdHJpbmcgPSBlbmRwb2ludE9iai51cmw7XG4gICAgICAgICAgICBpZiAoIWVuZHBvaW50VXJsKSB7XG4gICAgICAgICAgICAgICAgZW5kcG9pbnRVcmwgPSBlbmRwb2ludE9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRVcmwgKyAnL3N0YXR1cz9pc29rPScgKyB0aGlzLl9zZGsudmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pc29rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBzdGF0ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFRpbWVXYXNPayA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXS5sYXN0VGltZVdhc09rO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBmYWxzZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGxhc3RUaW1lV2FzT2t9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGJzID0gdGhpcy5nZXREQnMoKTtcbiAgICAgICAgZGJzLmZvckVhY2goKGRiRW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBkYkVuZHBvaW50OiBzdHJpbmcgPSBkYkVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZGJFbmRwb2ludCkge1xuICAgICAgICAgICAgICAgIGRiRW5kcG9pbnQgPSBkYkVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBkYkVuZHBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0gPSB7c3RhdGU6IHRydWUsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBjdXJyZW50VGltZX07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH07XG5cbn1cbiJdfQ==