import * as i0 from '@angular/core';
import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { __awaiter } from 'tslib';

class Base64 {
    constructor() {
    }
    ;
    /**
     * Decodes string from Base64 string
     */
    static encode(input) {
        if (!input) {
            return null;
        }
        const _btoa = typeof window !== 'undefined' ? window.btoa : require('btoa');
        return _btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt('0x' + p1, 16));
        }));
    }
    static decode(input) {
        if (!input) {
            return null;
        }
        const _atob = typeof window !== 'undefined' ? window.atob : require('atob');
        return decodeURIComponent(_atob(input).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}

/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
class LocalStorage {
    // Constructor
    constructor(storageService, storageKey) {
        this.storageKey = storageKey;
        this.version = '0.1';
        this.storage = storageService || window.localStorage;
        if (!this.storage) {
            throw new Error('fidj.LocalStorageFactory needs a storageService!');
        }
        // todo LocalStorage refacto
        //            if (!fidj.Xml) {
        //                throw new Error('fidj.Xml needs to be loaded before fidj.LocalStorage!');
        //            }
        //            if (!fidj.Json) {
        //                throw new Error('fidj.Json needs to be loaded before fidj.LocalStorage!');
        //            }
        //            if (!fidj.Xml.isXml || !fidj.Xml.xml2String || !fidj.Xml.string2Xml) {
        //                throw new Error('fidj.Xml with isXml(), xml2String()
        // and string2Xml() needs to be loaded before fidj.LocalStorage!');
        //            }
        //            if (!fidj.Json.object2String || !fidj.Json.string2Object) {
        //                throw new Error('fidj.Json with object2String()
        // and string2Object() needs to be loaded before fidj.LocalStorage!');
        //            }
        //
    }
    // Public API
    /**
     * Sets a key's value.
     *
     * @param key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @returns the stored value which is a container of user value.
     */
    set(key, value) {
        key = this.storageKey + key;
        this.checkKey(key);
        // clone the object before saving to storage
        const t = typeof (value);
        if (t === 'undefined') {
            value = 'null';
        }
        else if (value === null) {
            value = 'null';
        }
        else if (t === 'string') {
            value = JSON.stringify({ string: value });
        }
        else if (t === 'number') {
            value = JSON.stringify({ number: value });
        }
        else if (t === 'boolean') {
            value = JSON.stringify({ bool: value });
        }
        else if (t === 'object') {
            value = JSON.stringify({ json: value });
        }
        else {
            // reject and do not insert
            // if (typeof value == "function") for example
            throw new TypeError('Value type ' + t + ' is invalid. It must be null, undefined, xml, string, number, boolean or object');
        }
        this.storage.setItem(key, value);
        return value;
    }
    ;
    /**
     * Looks up a key in cache
     *
     * @param key - Key to look up.
     * @param def - Default value to return, if key didn't exist.
     * @returns the key value, default value or <null>
     */
    get(key, def) {
        key = this.storageKey + key;
        this.checkKey(key);
        const item = this.storage.getItem(key);
        if (item !== null) {
            if (item === 'null') {
                return null;
            }
            const value = JSON.parse(item);
            // var value = fidj.Json.string2Object(item);
            // if ('xml' in value) {
            //     return fidj.Xml.string2Xml(value.xml);
            // } else
            if ('string' in value) {
                return value.string;
            }
            else if ('number' in value) {
                return value.number.valueOf();
            }
            else if ('bool' in value) {
                return value.bool.valueOf();
            }
            else {
                return value.json;
            }
        }
        return !def ? null : def;
    }
    ;
    /**
     * Deletes a key from cache.
     *
     * @param  key - Key to delete.
     * @returns true if key existed or false if it didn't
     */
    remove(key) {
        key = this.storageKey + key;
        this.checkKey(key);
        const existed = (this.storage.getItem(key) !== null);
        this.storage.removeItem(key);
        return existed;
    }
    ;
    /**
     * Deletes everything in cache.
     *
     * @return true
     */
    clear() {
        const existed = (this.storage.length > 0);
        this.storage.clear();
        return existed;
    }
    ;
    /**
     * How much space in bytes does the storage take?
     *
     * @returns Number
     */
    size() {
        return this.storage.length;
    }
    ;
    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param f - Function to call on every item.
     * @param  context - Context (this for example).
     * @returns Number of items in storage
     */
    foreach(f, context) {
        const n = this.storage.length;
        for (let i = 0; i < n; i++) {
            const key = this.storage.key(i);
            const value = this.get(key);
            if (context) {
                // f is an instance method on instance context
                f.call(context, value);
            }
            else {
                // f is a function or class method
                f(value);
            }
        }
        return n;
    }
    ;
    // Private API
    // helper functions and variables hidden within this function scope
    checkKey(key) {
        if (!key || (typeof key !== 'string')) {
            throw new TypeError('Key type must be string');
        }
        return true;
    }
}

class Xor {
    constructor() {
    }
    ;
    static encrypt(value, key) {
        let result = '';
        value = Xor.header + value;
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(value[i].charCodeAt(0).toString(10) ^ Xor.keyCharAt(key, i));
        }
        result = Base64.encode(result);
        return result;
    }
    ;
    static decrypt(value, key, oldStyle) {
        let result = '';
        value = Base64.decode(value);
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode(value[i].charCodeAt(0).toString(10) ^ Xor.keyCharAt(key, i));
        }
        if (!oldStyle && Xor.header !== result.substring(0, Xor.header.length)) {
            return null;
        }
        if (!oldStyle) {
            result = result.substring(Xor.header.length);
        }
        return result;
    }
    static keyCharAt(key, i) {
        return key[Math.floor(i % key.length)].charCodeAt(0).toString(10);
    }
}
Xor.header = 'artemis-lotsum';

var LoggerLevelEnum;
(function (LoggerLevelEnum) {
    LoggerLevelEnum[LoggerLevelEnum["INFO"] = 1] = "INFO";
    LoggerLevelEnum[LoggerLevelEnum["WARN"] = 2] = "WARN";
    LoggerLevelEnum[LoggerLevelEnum["ERROR"] = 3] = "ERROR";
    LoggerLevelEnum[LoggerLevelEnum["NONE"] = 4] = "NONE";
})(LoggerLevelEnum || (LoggerLevelEnum = {}));

class Error$2 {
    constructor(code, reason) {
        this.code = code;
        this.reason = reason;
    }
    ;
    equals(err) {
        return this.code === err.code && this.reason === err.reason;
    }
    toString() {
        const msg = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
        return '' + this.code + ' - ' + msg;
    }
}

/**
 * `NgModule` which provides associated services.
 *
 * ...
 *
 * @stable
 */
class FidjModule {
    constructor() {
    }
}
FidjModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [],
                exports: [],
            },] }
];
FidjModule.ctorParameters = () => [];
/**
 * module FidjModule
 *
 * exemple
 *      // ... after install :
 *      // $ npm install fidj
 *      // then init your app.js & use it in your services
 * TODO refresh gist :
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 */

// bumped version via gulp
const version = '3.3.5';

class ClientToken {
    constructor(id, type, data) {
        this.id = id;
        this.type = type;
        this.data = data;
    }
}
class ClientTokens {
    constructor(username, accessToken, idToken, refreshToken) {
        this.username = username;
        this.accessToken = accessToken;
        this.idToken = idToken;
        this.refreshToken = refreshToken;
    }
}
class ClientUser {
    constructor(id, username, roles, message) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }
}

// import {XHRPromise} from './xhrpromise';
// const superagent = require('superagent');
// import from 'superagent';
var XhrErrorReason;
(function (XhrErrorReason) {
    XhrErrorReason[XhrErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    XhrErrorReason[XhrErrorReason["TIMEOUT"] = 1] = "TIMEOUT";
    XhrErrorReason[XhrErrorReason["STATUS"] = 2] = "STATUS";
})(XhrErrorReason || (XhrErrorReason = {}));
class Ajax {
    constructor() {
        // https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
        // axios ?
        //  https://github.com/axios/axios
        // const axios = require('axios');
        // axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
        //     .then(response => {
        //         console.log(response.data.url);
        //         console.log(response.data.explanation);
        //     })
        // superagent.get('https://api.nasa.gov/planetary/apod')
        //     .query({ api_key: 'DEMO_KEY', date: '2017-08-02' })
        this.xhr = require('axios'); // require('superagent'); // new XHRPromise();
    }
    ;
    static formatResponseData(response) {
        // TODO switch depending on json headers
        let dataParsed = response;
        while (dataParsed && dataParsed.data) {
            dataParsed = dataParsed.data;
        }
        try {
            dataParsed = JSON.parse(dataParsed + '');
        }
        catch (e) {
        }
        return dataParsed;
    }
    ;
    static formatError(error) {
        const errorFormatted = {
            reason: XhrErrorReason.UNKNOWN,
            status: -1,
            code: -1,
            message: '',
        };
        if (error.status) {
            errorFormatted.reason = XhrErrorReason.STATUS;
            errorFormatted.status = parseInt(error.status, 10);
            errorFormatted.code = parseInt(error.status, 10);
        }
        if (error.response) {
            errorFormatted.message = error.response;
            if (error.response.status) {
                errorFormatted.reason = XhrErrorReason.STATUS;
                errorFormatted.status = parseInt(error.response.status, 10);
                errorFormatted.code = parseInt(error.response.status, 10);
            }
            else if (error.response.status === null) { // timeout
                errorFormatted.reason = XhrErrorReason.TIMEOUT;
                errorFormatted.status = 408;
                errorFormatted.code = 408;
            }
        }
        else if (error.request) {
            errorFormatted.message = error.request;
        }
        else if (error.message) {
            errorFormatted.message = error.message;
        }
        // _this._handleError('browser', reject, null, 'browser doesn\'t support XMLHttpRequest');
        // _this._handleError('url', reject, null, 'URL is a required parameter');
        // _this._handleError('parse', reject, null, 'invalid JSON response');
        // return _this._handleError('error', reject);
        // return _this._handleError('timeout', reject);
        // return _this._handleError('abort', reject);
        // return _this._handleError('send', reject, null, e.toString());
        // if (err.reason === 'timeout') {
        //     err.code = 408;
        // } else {
        //     err.code = 404;
        // }
        return errorFormatted;
    }
    ;
    post(args) {
        const opt = {
            method: 'POST',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr.post(opt.url, opt.data, {
            headers: opt.headers,
        })
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                return Promise.reject(Ajax.formatError(res));
            }
            return Promise.resolve(Ajax.formatResponseData(res));
        })
            .catch(err => {
            return Promise.reject(Ajax.formatError(err));
        });
    }
    put(args) {
        const opt = {
            method: 'PUT',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .put(opt.url, opt.data, {
            headers: opt.headers,
            timeout: 10000
        })
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                return Promise.reject(Ajax.formatError(res));
            }
            return Promise.resolve(Ajax.formatResponseData(res));
        })
            .catch(err => {
            return Promise.reject(Ajax.formatError(err));
        });
    }
    delete(args) {
        const opt = {
            method: 'DELETE',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .delete(opt.url, // no data
        {
            headers: opt.headers,
            timeout: 10000
        })
            // .delete(opt.url) // .send(opt)
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                return Promise.reject(Ajax.formatError(res));
            }
            return Promise.resolve(Ajax.formatResponseData(res));
        })
            .catch(err => {
            return Promise.reject(Ajax.formatError(err));
        });
    }
    get(args) {
        const opt = {
            method: 'GET',
            url: args.url
        };
        if (args.data) {
            opt.data = args.data;
        }
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .get(opt.url, {
            // opt.data,
            headers: opt.headers,
            timeout: 10000
        })
            // .get(opt.url) // .send(opt)
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                return Promise.reject(Ajax.formatError(res));
            }
            return Promise.resolve(Ajax.formatResponseData(res));
        })
            .catch(err => {
            return Promise.reject(Ajax.formatError(err));
        });
    }
}

class Client {
    constructor(appId, URI, storage, sdk) {
        this.appId = appId;
        this.URI = URI;
        this.storage = storage;
        this.sdk = sdk;
        let uuid = this.storage.get(Client._clientUuid) || 'uuid-' + Math.random();
        let info = '_clientInfo'; // this.storage.get(Client._clientInfo);
        if (typeof window !== 'undefined' && window.navigator) {
            info = window.navigator.appName + '@' + window.navigator.appVersion + '-' + window.navigator.userAgent;
        }
        if (typeof window !== 'undefined' && window['device'] && window['device'].uuid) {
            uuid = window['device'].uuid;
        }
        this.setClientUuid(uuid);
        this.setClientInfo(info);
        this.clientId = this.storage.get(Client._clientId);
        Client.refreshCount = this.storage.get(Client._refreshCount) || Client.refreshCountInitial;
    }
    ;
    setClientId(value) {
        this.clientId = '' + value;
        this.storage.set(Client._clientId, this.clientId);
    }
    setClientUuid(value) {
        this.clientUuid = '' + value;
        this.storage.set(Client._clientUuid, this.clientUuid);
    }
    setClientInfo(value) {
        this.clientInfo = '' + value;
        // this.storage.set('clientInfo', this.clientInfo);
    }
    /**
     *
     * @param login
     * @param password
     * @param updateProperties
     * @throws {ErrorInterface}
     */
    login(login, password, updateProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.URI) {
                console.error('no api uri');
                return Promise.reject({ code: 408, reason: 'no-api-uri' });
            }
            const urlLogin = this.URI + '/users';
            const dataLogin = {
                name: login,
                username: login,
                email: login,
                password: password
            };
            const createdUser = (yield new Ajax().post({
                url: urlLogin,
                data: dataLogin,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })).user;
            this.setClientId(login); // login or createdUser.id or createdUser._id
            const urlToken = this.URI + '/apps/' + this.appId + '/tokens';
            const dataToken = {
                grant_type: 'access_token',
                // grant_type: 'client_credentials',
                // client_id: this.clientId,
                // client_secret: password,
                client_udid: this.clientUuid,
                client_info: this.clientInfo,
                // audience: this.appId,
                scope: JSON.stringify(this.sdk)
            };
            const createdAccessToken = (yield new Ajax().post({
                url: urlToken,
                data: dataToken,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Basic ' + Base64.encode('' + login + ':' + password)
                }
            })).token;
            dataToken.grant_type = 'id_token';
            const createdIdToken = (yield new Ajax().post({
                url: urlToken,
                data: dataToken,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Bearer ' + createdAccessToken.data
                }
            })).token;
            dataToken.grant_type = 'refresh_token';
            const createdRefreshToken = (yield new Ajax().post({
                url: urlToken,
                data: dataToken,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Bearer ' + createdAccessToken.data
                }
            })).token;
            return new ClientTokens(login, createdAccessToken, createdIdToken, createdRefreshToken);
        });
    }
    /**
     *
     * @param refreshToken
     * @throws ErrorInterface
     */
    reAuthenticate(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.URI) {
                console.error('no api uri');
                return Promise.reject({ code: 408, reason: 'no-api-uri' });
            }
            const url = this.URI + '/apps/' + this.appId + '/tokens';
            const data = {
                grant_type: 'refresh_token',
                // client_id: this.clientId,
                client_udid: this.clientUuid,
                client_info: this.clientInfo,
                // audience: this.appId,
                scope: JSON.stringify(this.sdk),
                refresh_token: refreshToken,
                refreshCount: Client.refreshCount,
            };
            const clientToken = yield new Ajax().post({
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Bearer ' + refreshToken
                }
            });
            Client.refreshCount++;
            this.storage.set(Client._refreshCount, Client.refreshCount);
            return clientToken;
        });
    }
    logout(refreshToken) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        // delete this.clientUuid;
        // delete this.clientId;
        // this.storage.remove(Client._clientUuid);
        this.storage.remove(Client._clientId);
        this.storage.remove(Client._refreshCount);
        Client.refreshCount = Client.refreshCountInitial;
        if (!refreshToken || !this.clientId) {
            return Promise.resolve();
        }
        const url = this.URI + '/apps/' + this.appId + '/tokens';
        return new Ajax()
            .delete({
            url: url,
            headers: {
                'Content-Type': 'application/json', 'Accept': 'application/json',
                'Authorization': 'Bearer ' + refreshToken
            }
        });
    }
    isReady() {
        return !!this.URI;
    }
}
// private refreshToken: string;
Client.refreshCountInitial = 1;
Client.refreshCount = Client.refreshCountInitial;
Client._clientUuid = 'v2.clientUuid';
Client._clientId = 'v2.clientId';
Client._refreshCount = 'v2.refreshCount';

class Connection {
    constructor(_sdk, _storage, _logger) {
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
    isReady() {
        return !!this.client && this.client.isReady();
    }
    destroy(force) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.client.logout();
            }
            this.accessToken = null;
            this.idToken = null;
            this.refreshToken = null;
            this.states = {}; // new Map<string, boolean>();
        });
    }
    setClient(client) {
        this.client = client;
        //if (!this.user) {
        //    this.user = new ClientUser();
        //}
        // this._user._id = this._client.clientId;
        //this.user._name = JSON.parse(this.getIdPayload({name: ''})).name;
    }
    setUser(user) {
        this.user = user;
        if (this.client && this.user.id) {
            this.client.setClientId(this.user.id);
            // store only clientId
            // delete this.user._id;
        }
    }
    getUser() {
        return this.user;
    }
    getClient() {
        return this.client;
    }
    setCryptoSalt(value) {
        if (this.cryptoSalt !== value && this.cryptoSaltNext !== value) {
            this.cryptoSaltNext = value;
            this._storage.set(Connection._cryptoSaltNext, this.cryptoSaltNext);
        }
        if (!this.cryptoSalt) {
            this.setCryptoSaltAsVerified();
        }
    }
    setCryptoSaltAsVerified() {
        if (this.cryptoSaltNext) {
            this.cryptoSalt = this.cryptoSaltNext;
            this._storage.set(Connection._cryptoSalt, this.cryptoSalt);
        }
        this.cryptoSaltNext = null;
        this._storage.remove(Connection._cryptoSaltNext);
    }
    encrypt(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        else {
            const dataAsObj = { string: data };
            data = JSON.stringify(dataAsObj);
        }
        if (this.fidjCrypto && this.cryptoSalt) {
            const key = this.cryptoSalt;
            return Xor.encrypt(data, key);
        }
        else {
            return data;
        }
    }
    decrypt(data) {
        let decrypted = null;
        try {
            if (this.fidjCrypto && this.cryptoSaltNext) {
                const key = this.cryptoSaltNext;
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
                const key = this.cryptoSalt;
                decrypted = Xor.decrypt(data, key);
                decrypted = JSON.parse(decrypted);
            }
        }
        catch (err) {
            decrypted = null;
        }
        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSalt) {
                const key = this.cryptoSalt;
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
    }
    isLogin() {
        let exp = true;
        try {
            const payload = this.refreshToken.split('.')[1];
            const decoded = JSON.parse(Base64.decode(payload));
            exp = ((new Date().getTime() / 1000) >= decoded.exp);
        }
        catch (e) {
        }
        return !exp;
    }
    // todo reintegrate client.login()
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getClient().logout(this.refreshToken);
        });
    }
    getClientId() {
        if (!this.client) {
            return null;
        }
        return this.client.clientId;
    }
    getIdToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.idToken;
        });
    }
    getIdPayload(def) {
        return __awaiter(this, void 0, void 0, function* () {
            const idToken = yield this.getIdToken();
            try {
                let payload;
                if (idToken) {
                    payload = idToken.split('.')[1];
                }
                if (payload) {
                    return Base64.decode(payload);
                }
            }
            catch (e) {
                this._logger.log('fidj.connection.getIdPayload pb: ', def, e);
            }
            if (def) {
                if (typeof def !== 'string') {
                    def = JSON.stringify(def);
                }
                return def;
            }
            return null;
        });
    }
    getAccessPayload(def) {
        return __awaiter(this, void 0, void 0, function* () {
            if (def && typeof def !== 'string') {
                def = JSON.stringify(def);
            }
            try {
                const payload = this.accessToken.split('.')[1];
                if (payload) {
                    return Base64.decode(payload);
                }
            }
            catch (e) {
            }
            return def ? def : null;
        });
    }
    getPreviousAccessPayload(def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            const payload = this.accessTokenPrevious.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    }
    /**
     * @throws ErrorInterface
     */
    refreshConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            // store states
            this._storage.set(Connection._states, this.states);
            // token not expired : ok
            if (this.accessToken) {
                const payload = this.accessToken.split('.')[1];
                const decoded = Base64.decode(payload);
                const notExpired = (new Date().getTime() / 1000) < JSON.parse(decoded).exp;
                // console.log('new Date().getTime() < JSON.parse(decoded).exp :', (new Date().getTime() / 1000), JSON.parse(decoded).exp);
                this._logger.log('fidj.connection.connection.refreshConnection : token not expired ? ', notExpired);
                if (notExpired) {
                    return Promise.resolve(this.getUser());
                }
            }
            // remove expired refreshToken
            if (this.refreshToken) {
                const payload = this.refreshToken.split('.')[1];
                const decoded = Base64.decode(payload);
                const expired = (new Date().getTime() / 1000) >= JSON.parse(decoded).exp;
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
            const client = this.getClient();
            if (!client) {
                throw new Error$2(400, 'Need an initialized client.');
            }
            const refreshToken = yield this.getClient().reAuthenticate(this.refreshToken);
            const previousIdToken = new ClientToken(this.getClientId(), 'idToken', this.idToken);
            const previousAccessToken = new ClientToken(this.getClientId(), 'accessToken', this.accessToken);
            const clientTokens = new ClientTokens(this.getClientId(), previousIdToken, previousAccessToken, refreshToken);
            yield this.setConnection(clientTokens);
            return this.getUser();
        });
    }
    ;
    setConnection(clientTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            // only in private storage
            if (clientTokens.accessToken) {
                this.accessToken = clientTokens.accessToken.data;
                this._storage.set(Connection._accessToken, this.accessToken);
                const salt = JSON.parse(yield this.getAccessPayload({ salt: '' })).salt;
                if (salt) {
                    this.setCryptoSalt(salt);
                }
            }
            if (clientTokens.idToken) {
                this.idToken = clientTokens.idToken.data;
                this._storage.set(Connection._idToken, this.idToken);
            }
            if (clientTokens.refreshToken) {
                this.refreshToken = clientTokens.refreshToken.data;
                this._storage.set(Connection._refreshToken, this.refreshToken);
            }
            // store changed states
            this._storage.set(Connection._states, this.states);
            // expose roles, message
            const clientUser = new ClientUser(clientTokens.username, clientTokens.username, JSON.parse(yield this.getIdPayload({ roles: [] })).roles, JSON.parse(yield this.getIdPayload({ message: '' })).message);
            this.setUser(clientUser);
        });
    }
    ;
    setConnectionOffline(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
            this.setUser(new ClientUser('demo', 'demo', JSON.parse(yield this.getIdPayload({ roles: [] })).roles, JSON.parse(yield this.getIdPayload({ message: '' })).message));
        });
    }
    getApiEndpoints(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // todo : let ea = ['https://fidj/v3', 'https://fidj-proxy.herokuapp.com/v3'];
            let ea = [
                { key: 'fidj.default', url: 'https://api.fidj.ovh/v3', blocked: false }
            ];
            let filteredEa = [];
            if (!this._sdk.prod) {
                ea = [
                    { key: 'fidj.default', url: 'http://localhost:3201/v3', blocked: false },
                    { key: 'fidj.default', url: 'https://fidj-sandbox.herokuapp.com/v3', blocked: false }
                ];
            }
            if (this.accessToken) {
                const val = yield this.getAccessPayload({ apis: [] });
                const apiEndpoints = JSON.parse(val).apis;
                if (apiEndpoints && apiEndpoints.length) {
                    ea = [];
                    apiEndpoints.forEach((endpoint) => {
                        if (endpoint.url) {
                            ea.push(endpoint);
                        }
                    });
                }
            }
            if (this.accessTokenPrevious) {
                const apiEndpoints = JSON.parse(this.getPreviousAccessPayload({ apis: [] })).apis;
                if (apiEndpoints && apiEndpoints.length) {
                    apiEndpoints.forEach((endpoint) => {
                        if (endpoint.url && ea.filter((r) => r.url === endpoint.url).length === 0) {
                            ea.push(endpoint);
                        }
                    });
                }
            }
            this._logger.log('fidj.sdk.connection.getApiEndpoints : ', ea);
            let couldCheckStates = true;
            if (this.states && Object.keys(this.states).length) {
                for (let i = 0; (i < ea.length) && couldCheckStates; i++) {
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
                    for (let i = 0; (i < ea.length) && (filteredEa.length === 0); i++) {
                        const endpoint = ea[i];
                        if (this.states[endpoint.url] &&
                            this.states[endpoint.url].state) {
                            filteredEa.push(endpoint);
                        }
                    }
                }
                else if (couldCheckStates && options.filter === 'theBestOldOne') {
                    let bestOldOne;
                    for (let i = 0; (i < ea.length); i++) {
                        const endpoint = ea[i];
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
        });
    }
    ;
    getDBs(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.accessToken) {
                return [];
            }
            // todo test random DB connection
            const random = Math.random() % 2;
            let dbs = JSON.parse(yield this.getAccessPayload({ dbs: [] })).dbs || [];
            // need to synchronize db
            if (random === 0) {
                dbs = dbs.sort();
            }
            else if (random === 1) {
                dbs = dbs.reverse();
            }
            let filteredDBs = [];
            let couldCheckStates = true;
            if (this.states && Object.keys(this.states).length) {
                for (let i = 0; (i < dbs.length) && couldCheckStates; i++) {
                    if (!this.states[dbs[i].url]) {
                        couldCheckStates = false;
                    }
                }
            }
            else {
                couldCheckStates = false;
            }
            if (couldCheckStates && options && options.filter === 'theBestOne') {
                for (let i = 0; (i < dbs.length) && (filteredDBs.length === 0); i++) {
                    const endpoint = dbs[i];
                    if (this.states[endpoint.url] &&
                        this.states[endpoint.url].state) {
                        filteredDBs.push(endpoint);
                    }
                }
            }
            else if (couldCheckStates && options && options.filter === 'theBestOnes') {
                for (let i = 0; (i < dbs.length); i++) {
                    const endpoint = dbs[i];
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
        });
    }
    ;
    verifyApiState(currentTime, endpointUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._logger.log('fidj.sdk.connection.verifyApiState : ', currentTime, endpointUrl);
                const data = yield new Ajax()
                    .get({
                    url: endpointUrl + '/status?isOk=' + this._sdk.version,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });
                let state = false;
                if (data && data.isOk) {
                    state = true;
                }
                this.states[endpointUrl] = { state: state, time: currentTime, lastTimeWasOk: currentTime };
                this._logger.log('fidj.sdk.connection.verifyApiState > states : ', this.states);
            }
            catch (err) {
                let lastTimeWasOk = 0;
                if (this.states[endpointUrl]) {
                    lastTimeWasOk = this.states[endpointUrl].lastTimeWasOk;
                }
                this.states[endpointUrl] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                this._logger.log('fidj.sdk.connection.verifyApiState > catch pb  - states : ', err, this.states);
            }
        });
    }
    verifyDbState(currentTime, dbEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('verifyDbState: ', dbEndpoint);
                yield new Ajax()
                    .get({
                    url: dbEndpoint,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });
                this.states[dbEndpoint] = { state: true, time: currentTime, lastTimeWasOk: currentTime };
                // resolve();
                // console.log('verifyDbState: state', dbEndpoint, true);
            }
            catch (err) {
                let lastTimeWasOk = 0;
                if (this.states[dbEndpoint]) {
                    lastTimeWasOk = this.states[dbEndpoint].lastTimeWasOk;
                }
                this.states[dbEndpoint] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                // resolve();
            }
        });
    }
    verifyConnectionStates() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date().getTime();
            // todo need verification ? not yet (cache)
            // if (Object.keys(this.states).length > 0) {
            //     const time = this.states[Object.keys(this.states)[0]].time;
            //     if (currentTime < time) {
            //         return Promise.resolve();
            //     }
            // }
            // verify via GET status on Endpoints & DBs
            const promises = [];
            // this.states = {};
            this.apis = yield this.getApiEndpoints();
            this.apis.forEach((endpointObj) => {
                let endpointUrl = endpointObj.url;
                if (!endpointUrl) {
                    endpointUrl = endpointObj.toString();
                }
                promises.push(this.verifyApiState(currentTime, endpointUrl));
            });
            const dbs = yield this.getDBs();
            dbs.forEach((dbEndpointObj) => {
                let dbEndpoint = dbEndpointObj.url;
                if (!dbEndpoint) {
                    dbEndpoint = dbEndpointObj.toString();
                }
                promises.push(this.verifyDbState(currentTime, dbEndpoint));
            });
            return Promise.all(promises);
        });
    }
    ;
}
Connection._accessToken = 'v2.accessToken';
Connection._accessTokenPrevious = 'v2.accessTokenPrevious';
Connection._idToken = 'v2.idToken';
Connection._refreshToken = 'v2.refreshToken';
Connection._states = 'v2.states';
Connection._cryptoSalt = 'v2.cryptoSalt';
Connection._cryptoSaltNext = 'v2.cryptoSalt.next';

// import PouchDB from 'pouchdb';
let FidjPouch;
if (typeof window !== 'undefined') {
    FidjPouch = (window['PouchDB']) ? window['PouchDB'] : require('pouchdb').default; // .default;
    // load cordova adapter : https://github.com/pouchdb-community/pouchdb-adapter-cordova-sqlite/issues/22
    const PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
    FidjPouch.plugin(PouchAdapterCordovaSqlite);
}
class Session {
    constructor() {
        this.db = null;
        this.dbRecordCount = 0;
        this.dbLastSync = null;
        this.remoteDb = null;
        this.dbs = [];
    }
    ;
    isReady() {
        return !!this.db;
    }
    create(uid, force) {
        if (!force && this.db) {
            return Promise.resolve(this.db);
        }
        this.dbRecordCount = 0;
        this.dbLastSync = null; // new Date().getTime();
        this.db = null;
        uid = uid || 'default';
        if (typeof window === 'undefined') {
            return Promise.resolve(this.db);
        }
        return new Promise((resolve, reject) => {
            let opts = { location: 'default' };
            try {
                if (window['cordova']) {
                    opts = { location: 'default', adapter: 'cordova-sqlite' };
                    //    const plugin = require('pouchdb-adapter-cordova-sqlite');
                    //    if (plugin) { Pouch.plugin(plugin); }
                    //    this.db = new Pouch('fidj_db', {adapter: 'cordova-sqlite'});
                }
                // } else {
                this.db = new FidjPouch('fidj_db_' + uid, opts); // , {adapter: 'websql'} ???
                // }
                this.db.info()
                    .then((info) => {
                    // todo if (info.adapter !== 'websql') {
                    return resolve(this.db);
                    // }
                    // const newopts: any = opts || {};
                    // newopts.adapter = 'idb';
                    //
                    // const newdb = new Pouch('fidj_db', opts);
                    // this.db.replicate.to(newdb)
                    //     .then(() => {
                    //         this.db = newdb;
                    //         resolve();
                    //     })
                    //     .catch((err) => {
                    //         reject(new Error(400, err.toString()))
                    //     });
                }).catch((err) => {
                    reject(new Error$2(400, err));
                });
            }
            catch (err) {
                reject(new Error$2(500, err));
            }
        });
    }
    destroy() {
        if (!this.db) {
            this.dbRecordCount = 0;
            this.dbLastSync = null;
            return Promise.resolve();
        }
        if (this.db && !this.db.destroy) {
            return Promise.reject(new Error$2(408, 'Need a valid db'));
        }
        return new Promise((resolve, reject) => {
            this.db.destroy((err, info) => {
                if (err) {
                    reject(new Error$2(500, err));
                }
                else {
                    this.dbRecordCount = 0;
                    this.dbLastSync = null;
                    this.db = null;
                    resolve();
                }
            });
        });
    }
    ;
    setRemote(dbs) {
        this.dbs = dbs;
    }
    sync(userId) {
        if (!this.db) {
            return Promise.reject(new Error$2(408, 'need db'));
        }
        if (!this.dbs || !this.dbs.length) {
            return Promise.reject(new Error$2(408, 'need a remote db'));
        }
        return new Promise((resolve, reject) => {
            try {
                if (!this.remoteDb || this.remoteUri !== this.dbs[0].url) {
                    this.remoteUri = this.dbs[0].url;
                    this.remoteDb = new FidjPouch(this.remoteUri);
                    // todo , {headers: {'Authorization': 'Bearer ' + id_token}});
                }
                this.db.replicate.to(this.remoteDb)
                    .on('complete', (info) => {
                    return this.remoteDb.replicate.to(this.db, {
                        filter: (doc) => {
                            return (!!userId && !!doc && doc.fidjUserId === userId);
                        }
                    })
                        .on('complete', () => {
                        // this.logger
                        resolve();
                    })
                        .on('denied', (err) => reject({ code: 403, reason: { second: err } }))
                        .on('error', (err) => reject({ code: 401, reason: { second: err } }));
                })
                    .on('denied', (err) => reject({ code: 403, reason: { first: err } }))
                    .on('error', (err) => reject({ code: 401, reason: { first: err } }));
            }
            catch (err) {
                reject(new Error$2(500, err));
            }
        });
    }
    put(data, _id, uid, oid, ave, crypto) {
        if (!this.db) {
            return Promise.reject(new Error$2(408, 'need db'));
        }
        if (!data || !_id || !uid || !oid || !ave) {
            return Promise.reject(new Error$2(400, 'need formated data'));
        }
        const dataWithoutIds = JSON.parse(JSON.stringify(data));
        const toStore = {
            _id: _id,
            fidjUserId: uid,
            fidjOrgId: oid,
            fidjAppVersion: ave
        };
        if (dataWithoutIds._rev) {
            toStore._rev = '' + dataWithoutIds._rev;
        }
        delete dataWithoutIds._id;
        delete dataWithoutIds._rev;
        delete dataWithoutIds.fidjUserId;
        delete dataWithoutIds.fidjOrgId;
        delete dataWithoutIds.fidjAppVersion;
        delete dataWithoutIds.fidjData;
        let resultAsString = Session.write(Session.value(dataWithoutIds));
        if (crypto) {
            resultAsString = crypto.obj[crypto.method](resultAsString);
            toStore.fidjDacr = resultAsString;
        }
        else {
            toStore.fidjData = resultAsString;
        }
        return new Promise((resolve, reject) => {
            this.db.put(toStore, (err, response) => {
                if (response && response.ok && response.id && response.rev) {
                    this.dbRecordCount++;
                    // propagate _rev & _id
                    if (typeof data === 'object') {
                        data._rev = response.rev;
                        data._id = response.id;
                        resolve(data);
                    }
                    else {
                        resolve(response.id);
                    }
                }
                else {
                    reject(new Error$2(500, err));
                }
            });
        });
    }
    remove(data_id) {
        if (!this.db) {
            return Promise.reject(new Error$2(408, 'need db'));
        }
        return new Promise((resolve, reject) => {
            this.db.get(data_id)
                .then((doc) => {
                doc._deleted = true;
                return this.db.put(doc);
            })
                .then((result) => {
                resolve();
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    get(data_id, crypto) {
        if (!this.db) {
            return Promise.reject(new Error$2(408, 'Need db'));
        }
        return new Promise((resolve, reject) => {
            this.db.get(data_id)
                .then(row => {
                if (!!row && (!!row.fidjDacr || !!row.fidjData)) {
                    let data = row.fidjDacr;
                    if (crypto && data) {
                        data = crypto.obj[crypto.method](data);
                    }
                    else if (row.fidjData) {
                        data = JSON.parse(row.fidjData);
                    }
                    const resultAsJson = Session.extractJson(data);
                    if (resultAsJson) {
                        resultAsJson._id = row._id;
                        resultAsJson._rev = row._rev;
                        resolve(JSON.parse(JSON.stringify(resultAsJson)));
                    }
                    else {
                        // row._deleted = true;
                        this.remove(row._id);
                        reject(new Error$2(400, 'Bad encoding'));
                    }
                }
                else {
                    reject(new Error$2(400, 'No data found'));
                }
            })
                .catch(err => reject(new Error$2(500, err)));
        });
    }
    getAll(crypto) {
        if (!this.db || !this.db.allDocs) {
            return Promise.reject(new Error$2(408, 'Need a valid db'));
        }
        return new Promise((resolve, reject) => {
            this.db.allDocs({ include_docs: true, descending: true })
                .then(rows => {
                const all = [];
                rows.rows.forEach(row => {
                    if (!!row && !!row.doc._id && (!!row.doc.fidjDacr || !!row.doc.fidjData)) {
                        let data = row.doc.fidjDacr;
                        if (crypto && data) {
                            data = crypto.obj[crypto.method](data);
                        }
                        else if (row.doc.fidjData) {
                            data = JSON.parse(row.doc.fidjData);
                        }
                        const resultAsJson = Session.extractJson(data);
                        if (resultAsJson) {
                            resultAsJson._id = row.doc._id;
                            resultAsJson._rev = row.doc._rev;
                            all.push(JSON.parse(JSON.stringify(resultAsJson)));
                        }
                        else {
                            console.error('Bad encoding : delete row');
                            // resultAsJson = {};
                            // resultAsJson._id = row.doc._id;
                            // resultAsJson._rev = row.doc._rev;
                            // resultAsJson._deleted = true;
                            // all.push(resultAsJson);
                            this.remove(row.doc._id);
                        }
                    }
                    else {
                        console.error('Bad encoding');
                    }
                });
                resolve(all);
            })
                .catch(err => reject(new Error$2(400, err)));
        });
    }
    isEmpty() {
        if (!this.db || !this.db.allDocs) {
            return Promise.reject(new Error$2(408, 'No db'));
        }
        return new Promise((resolve, reject) => {
            this.db.allDocs({
            // filter:  (doc) => {
            //    if (!self.connection.user || !self.connection.user._id) return doc;
            //    if (doc.fidjUserId === self.connection.user._id) return doc;
            // }
            })
                .then((response) => {
                if (!response) {
                    reject(new Error$2(400, 'No response'));
                }
                else {
                    this.dbRecordCount = response.total_rows;
                    if (response.total_rows && response.total_rows > 0) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                }
            })
                .catch((err) => reject(new Error$2(400, err)));
        });
    }
    info() {
        if (!this.db) {
            return Promise.reject(new Error$2(408, 'No db'));
        }
        return this.db.info();
    }
    static write(item) {
        let value = 'null';
        const t = typeof (item);
        if (t === 'undefined') {
            value = 'null';
        }
        else if (value === null) {
            value = 'null';
        }
        else if (t === 'string') {
            value = JSON.stringify({ string: item });
        }
        else if (t === 'number') {
            value = JSON.stringify({ number: item });
        }
        else if (t === 'boolean') {
            value = JSON.stringify({ bool: item });
        }
        else if (t === 'object') {
            value = JSON.stringify({ json: item });
        }
        return value;
    }
    static value(item) {
        let result = item;
        if (typeof (item) !== 'object') {
            // return item;
        }
        else if ('string' in item) {
            result = item.string;
        }
        else if ('number' in item) {
            result = item.number.valueOf();
        }
        else if ('bool' in item) {
            result = item.bool.valueOf();
        }
        else if ('json' in item) {
            result = item.json;
            if (typeof (result) !== 'object') {
                result = JSON.parse(result);
            }
        }
        return result;
    }
    static extractJson(item) {
        let result = item;
        if (!item) {
            return null;
        }
        if (typeof (item) === 'object' && 'json' in item) {
            result = item.json;
        }
        if (typeof (result) === 'string') {
            result = JSON.parse(result);
        }
        if (typeof (result) === 'object' && 'json' in result) {
            result = result.json;
        }
        if (typeof result !== 'object') {
            result = null;
        }
        return result;
    }
}

class Error$1 {
    constructor() {
    }
    ;
}

class LoggerService {
    constructor(level) {
        this.level = level;
        if (!level) {
            this.level = LoggerLevelEnum.ERROR;
        }
        if (typeof console === 'undefined') {
            this.level = LoggerLevelEnum.NONE;
        }
    }
    log(message, args) {
        if (this.level === LoggerLevelEnum.INFO) {
            console.log(message, args);
        }
    }
    warn(message, args) {
        if (this.level === LoggerLevelEnum.INFO || this.level === LoggerLevelEnum.WARN) {
            console.warn(message, args);
        }
    }
    error(message, args) {
        if (this.level === LoggerLevelEnum.INFO || this.level === LoggerLevelEnum.WARN || this.level === LoggerLevelEnum.ERROR) {
            console.error(message, args);
        }
    }
    setLevel(level) {
        this.level = level;
    }
}

const urljoin = require('url-join');
// import {LocalStorage} from 'node-localstorage';
// import 'localstorage-polyfill/localStorage';
// const PouchDB = window['PouchDB'] || require('pouchdb').default;
/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
class InternalService {
    constructor(logger, promise, options) {
        this.sdk = {
            org: 'fidj',
            version: version,
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
        this.storage = new LocalStorage(ls, 'fidj.');
        this.session = new Session();
        this.connection = new Connection(this.sdk, this.storage, this.logger);
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
                return this.promise.reject(new Error$2(400, 'Need a fidjId'));
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
                throw new Error$2(500, err.toString());
            }
            if (!bestUrls || !bestOldUrls || (bestUrls.length === 0 && bestOldUrls.length === 0)) {
                throw new Error$2(404, 'Need one connection - or too old SDK version (check update)');
            }
            let theBestFirstUrl = bestUrls[0];
            let theBestFirstOldUrl = bestOldUrls[0];
            const isLogin = this.fidjIsLogin();
            this.logger.log('fidj.sdk.service.fidjInit > verifyConnectionStates : ', theBestFirstUrl, theBestFirstOldUrl, isLogin);
            if (theBestFirstUrl) {
                this.connection.setClient(new Client(this.connection.fidjId, theBestFirstUrl.url, this.storage, this.sdk));
            }
            else {
                this.connection.setClient(new Client(this.connection.fidjId, theBestFirstOldUrl.url, this.storage, this.sdk));
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
                throw new Error$2(404, 'Need an initialized FidjService');
            }
            try {
                yield this._removeAll();
                yield this.connection.verifyConnectionStates();
                yield this._createSession(this.connection.fidjId);
                const clientTokens = yield this._loginInternal(login, password);
                yield this.connection.setConnection(clientTokens);
            }
            catch (err) {
                throw new Error$2(500, err.toString());
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
                const payload = Base64.encode(JSON.stringify({
                    roles: [],
                    message: 'demo',
                    apis: [],
                    endpoints: [],
                    dbs: [],
                    exp: tomorrow
                }));
                const jwtSign = Base64.encode(JSON.stringify({}));
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
                return self.promise.reject(new Error$2(401, 'DB put impossible. Need a user logged in.'));
            }
            if (!self.session.isReady()) {
                return self.promise.reject(new Error$2(400, 'Need to be synchronised.'));
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
                return self.promise.reject(new Error$2(400, 'Need to be synchronised.'));
            }
            if (!data_id || typeof data_id !== 'string') {
                return self.promise.reject(new Error$2(400, 'DB remove impossible. ' +
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
                return self.promise.reject(new Error$2(401, 'Find pb : need a user logged in.'));
            }
            if (!self.session.isReady()) {
                return self.promise.reject(new Error$2(400, ' Need to be synchronised.'));
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
                return self.promise.reject(new Error$2(401, 'Need a user logged in.'));
            }
            if (!self.session.isReady()) {
                return self.promise.reject(new Error$2(400, 'Need to be synchronised.'));
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
                throw new Error$2(400, 'fidj.sdk.service.fidjSendOnEndpoint : endpoint does not exist.');
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
                throw new Error$2(400, 'fidj.sdk.service.fidjForgotPasswordRequest : api endpoint does not exist.');
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
                throw new Error$2(403, 'Need an initialized FidjService');
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

/**
 * Angular FidjService
 * @see ModuleServiceInterface
 *
 */
class FidjService {
    constructor() {
        this.logger = new LoggerService(LoggerLevelEnum.ERROR);
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    }
    ;
    init(fidjId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                this.fidjService = new InternalService(this.logger, this.promise);
            }
            return this.fidjService.fidjInit(fidjId, options);
        });
    }
    ;
    login(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(303, 'fidj.sdk.angular.login : not initialized.'));
            }
            return this.fidjService.fidjLogin(login, password);
        });
    }
    ;
    loginAsDemo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
            }
            return this.fidjService.fidjLoginInDemoMode(options);
        });
    }
    ;
    isLoggedIn() {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    }
    ;
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return [];
            }
            return yield this.fidjService.fidjRoles();
        });
    }
    ;
    getEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return [];
            }
            return this.fidjService.fidjGetEndpoints();
        });
    }
    ;
    /**
     * @throws {ErrorInterface}
     * @param {EndpointCallInterface} input
     */
    sendOnEndpoint(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
            }
            return this.fidjService.fidjSendOnEndpoint(input);
        });
    }
    ;
    forgotPasswordRequest(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'));
            }
            return this.fidjService.fidjForgotPasswordRequest(email);
        });
    }
    ;
    getIdToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return;
            }
            return this.fidjService.fidjGetIdToken();
        });
    }
    ;
    getMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return '';
            }
            return this.fidjService.fidjMessage();
        });
    }
    ;
    logout(force) {
        return __awaiter(this, void 0, void 0, function* () {
            if (force || !this.fidjService) {
                return this.promise.reject(new Error$2(303, 'fidj.sdk.angular.logout : not initialized.'));
            }
            return this.fidjService.fidjLogout(force);
        });
    }
    ;
    /**
     *
     * Synchronize DB
     * @param fnInitFirstData  a function with db as input and that return promise: call if DB is empty
     * @returns promise with this.session.db
     * @memberof fidj.angularService
     *
     * @example
     *  let initDb = function() {
     *     this.fidjService.put('my first row');
     *  };
     *  this.fidjService.sync(initDb)
     *  .then(user => ...)
     *  .catch(err => ...)
     *
     */
    sync(fnInitFirstData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(401, 'fidj.sdk.angular.sync : not initialized.'));
            }
            return this.fidjService.fidjSync(fnInitFirstData, this);
        });
    }
    ;
    /**
     * Store data in your session
     *
     * @param data to store
     * @returns
     */
    put(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(401, 'fidj.sdk.angular.put : not initialized.'));
            }
            return this.fidjService.fidjPutInDb(data);
        });
    }
    ;
    /**
     * Find object Id and remove it from your session
     *
     * @param id of object to find and remove
     * @returns
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(401, 'fidj.sdk.angular.remove : not initialized.'));
            }
            return this.fidjService.fidjRemoveInDb(id);
        });
    }
    ;
    /**
     * Find
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(401, 'fidj.sdk.angular.find : not initialized.'));
            }
            return this.fidjService.fidjFindInDb(id);
        });
    }
    ;
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fidjService) {
                return this.promise.reject(new Error$2(401, 'fidj.sdk.angular.findAll : not initialized.'));
            }
            return this.fidjService.fidjFindAllInDb();
        });
    }
    ;
}
FidjService.ɵprov = i0.ɵɵdefineInjectable({ factory: function FidjService_Factory() { return new FidjService(); }, token: FidjService, providedIn: "root" });
FidjService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
FidjService.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { Base64, Error$2 as Error, FidjModule, FidjService, LocalStorage, LoggerLevelEnum, Xor };
//# sourceMappingURL=fidj.js.map
