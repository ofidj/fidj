import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Base64 {
    constructor() {
    }
    ;
    /**
     * Decodes string from Base64 string
     * @param {?} input
     * @return {?}
     */
    static encode(input) {
        if (!input) {
            return null;
        }
        return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt('0x' + p1, 16));
        }));
    }
    /**
     * @param {?} input
     * @return {?}
     */
    static decode(input) {
        if (!input) {
            return null;
        }
        return decodeURIComponent(atob(input).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
class LocalStorage {
    /**
     * @param {?} storageService
     * @param {?} storageKey
     */
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
    /**
     * Sets a key's value.
     *
     * @param {?} key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param {?} value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @return {?} the stored value which is a container of user value.
     */
    set(key, value) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
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
     * @param {?} key - Key to look up.
     * @param {?=} def - Default value to return, if key didn't exist.
     * @return {?} the key value, default value or <null>
     */
    get(key, def) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        const item = this.storage.getItem(key);
        if (item !== null) {
            if (item === 'null') {
                return null;
            }
            /** @type {?} */
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
     * @param {?} key - Key to delete.
     * @return {?} true if key existed or false if it didn't
     */
    remove(key) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        const existed = (this.storage.getItem(key) !== null);
        this.storage.removeItem(key);
        return existed;
    }
    ;
    /**
     * Deletes everything in cache.
     *
     * @return {?} true
     */
    clear() {
        /** @type {?} */
        const existed = (this.storage.length > 0);
        this.storage.clear();
        return existed;
    }
    ;
    /**
     * How much space in bytes does the storage take?
     *
     * @return {?} Number
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
     * @param {?} f - Function to call on every item.
     * @param {?} context - Context (this for example).
     * @return {?} Number of items in storage
     */
    foreach(f, context) {
        /** @type {?} */
        const n = this.storage.length;
        for (let i = 0; i < n; i++) {
            /** @type {?} */
            const key = this.storage.key(i);
            /** @type {?} */
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
    /**
     * @param {?} key
     * @return {?}
     */
    checkKey(key) {
        if (!key || (typeof key !== 'string')) {
            throw new TypeError('Key type must be string');
        }
        return true;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Xor {
    constructor() {
    }
    ;
    /**
     * @param {?} value
     * @param {?} key
     * @return {?}
     */
    static encrypt(value, key) {
        /** @type {?} */
        let result = '';
        value = Xor.header + value;
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        result = Base64.encode(result);
        return result;
    }
    ;
    /**
     * @param {?} value
     * @param {?} key
     * @param {?=} oldStyle
     * @return {?}
     */
    static decrypt(value, key, oldStyle) {
        /** @type {?} */
        let result = '';
        value = Base64.decode(value);
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        if (!oldStyle && Xor.header !== result.substring(0, Xor.header.length)) {
            return null;
        }
        if (!oldStyle) {
            result = result.substring(Xor.header.length);
        }
        return result;
    }
    /**
     * @param {?} key
     * @param {?} i
     * @return {?}
     */
    static keyCharAt(key, i) {
        return key[Math.floor(i % key.length)].charCodeAt(0).toString(10);
    }
}
Xor.header = 'artemis-lotsum';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const version = '2.1.12';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class XHRPromise {
    constructor() {
        this.DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    ;
    /**
     * @param {?} options
     * @return {?}
     */
    send(options) {
        /** @type {?} */
        let defaults;
        if (options == null) {
            options = {};
        }
        defaults = {
            method: 'GET',
            data: null,
            headers: {},
            async: true,
            username: null,
            password: null,
            withCredentials: false
        };
        options = Object.assign({}, defaults, options);
        return new Promise(((_this) => {
            return (resolve, reject) => {
                /** @type {?} */
                let e;
                /** @type {?} */
                let header;
                /** @type {?} */
                let ref;
                /** @type {?} */
                let value;
                /** @type {?} */
                let xhr;
                if (!XMLHttpRequest) {
                    _this._handleError('browser', reject, null, 'browser doesn\'t support XMLHttpRequest');
                    return;
                }
                if (typeof options.url !== 'string' || options.url.length === 0) {
                    _this._handleError('url', reject, null, 'URL is a required parameter');
                    return;
                }
                _this._xhr = xhr = new XMLHttpRequest;
                xhr.onload = () => {
                    /** @type {?} */
                    let responseText;
                    _this._detachWindowUnload();
                    try {
                        responseText = _this._getResponseText();
                    }
                    catch (_error) {
                        _this._handleError('parse', reject, null, 'invalid JSON response');
                        return;
                    }
                    return resolve({
                        url: _this._getResponseUrl(),
                        status: xhr.status,
                        statusText: xhr.statusText,
                        responseText: responseText,
                        headers: _this._getHeaders(),
                        xhr: xhr
                    });
                };
                xhr.onerror = () => {
                    return _this._handleError('error', reject);
                };
                xhr.ontimeout = () => {
                    return _this._handleError('timeout', reject);
                };
                xhr.onabort = () => {
                    return _this._handleError('abort', reject);
                };
                _this._attachWindowUnload();
                xhr.open(options.method, options.url, options.async, options.username, options.password);
                if (options.withCredentials) {
                    xhr.withCredentials = true;
                }
                if ((options.data != null) && !options.headers['Content-Type']) {
                    options.headers['Content-Type'] = _this.DEFAULT_CONTENT_TYPE;
                }
                ref = options.headers;
                for (header in ref) {
                    if (ref.hasOwnProperty(header)) {
                        value = ref[header];
                        xhr.setRequestHeader(header, value);
                    }
                }
                try {
                    return xhr.send(options.data);
                }
                catch (_error) {
                    e = _error;
                    return _this._handleError('send', reject, null, e.toString());
                }
            };
        })(this));
    }
    ;
    /**
     * @return {?}
     */
    getXHR() {
        return this._xhr;
    }
    ;
    /**
     * @return {?}
     */
    _attachWindowUnload() {
        this._unloadHandler = this._handleWindowUnload.bind(this);
        if ((/** @type {?} */ (window)).attachEvent) {
            return (/** @type {?} */ (window)).attachEvent('onunload', this._unloadHandler);
        }
    }
    ;
    /**
     * @return {?}
     */
    _detachWindowUnload() {
        if ((/** @type {?} */ (window)).detachEvent) {
            return (/** @type {?} */ (window)).detachEvent('onunload', this._unloadHandler);
        }
    }
    ;
    /**
     * @return {?}
     */
    _getHeaders() {
        return this._parseHeaders(this._xhr.getAllResponseHeaders());
    }
    ;
    /**
     * @return {?}
     */
    _getResponseText() {
        /** @type {?} */
        let responseText;
        responseText = typeof this._xhr.responseText === 'string' ? this._xhr.responseText : '';
        switch ((this._xhr.getResponseHeader('Content-Type') || '').split(';')[0]) {
            case 'application/json':
            case 'text/javascript':
                responseText = JSON.parse(responseText + '');
        }
        return responseText;
    }
    ;
    /**
     * @return {?}
     */
    _getResponseUrl() {
        if (this._xhr.responseURL != null) {
            return this._xhr.responseURL;
        }
        if (/^X-Request-URL:/m.test(this._xhr.getAllResponseHeaders())) {
            return this._xhr.getResponseHeader('X-Request-URL');
        }
        return '';
    }
    ;
    /**
     * @param {?} reason
     * @param {?} reject
     * @param {?=} status
     * @param {?=} statusText
     * @return {?}
     */
    _handleError(reason, reject, status, statusText) {
        this._detachWindowUnload();
        /** @type {?} */
        let code = 404;
        if (reason === 'timeout') {
            code = 408;
        }
        else if (reason === 'abort') {
            code = 408;
        }
        return reject({
            reason: reason,
            status: status || this._xhr.status || code,
            code: status || this._xhr.status || code,
            statusText: statusText || this._xhr.statusText,
            xhr: this._xhr
        });
    }
    ;
    /**
     * @return {?}
     */
    _handleWindowUnload() {
        return this._xhr.abort();
    }
    ;
    /**
     * @param {?} str
     * @return {?}
     */
    trim(str) {
        return str.replace(/^\s*|\s*$/g, '');
    }
    /**
     * @param {?} arg
     * @return {?}
     */
    isArray(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    /**
     * @param {?} list
     * @param {?} iterator
     * @return {?}
     */
    forEach(list, iterator) {
        if (toString.call(list) === '[object Array]') {
            this.forEachArray(list, iterator, this);
        }
        else if (typeof list === 'string') {
            this.forEachString(list, iterator, this);
        }
        else {
            this.forEachObject(list, iterator, this);
        }
    }
    /**
     * @param {?} array
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    forEachArray(array, iterator, context) {
        for (let i = 0, len = array.length; i < len; i++) {
            if (array.hasOwnProperty(i)) {
                iterator.call(context, array[i], i, array);
            }
        }
    }
    /**
     * @param {?} string
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    forEachString(string, iterator, context) {
        for (let i = 0, len = string.length; i < len; i++) {
            // no such thing as a sparse string.
            iterator.call(context, string.charAt(i), i, string);
        }
    }
    /**
     * @param {?} object
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    forEachObject(object, iterator, context) {
        for (const k in object) {
            if (object.hasOwnProperty(k)) {
                iterator.call(context, object[k], k, object);
            }
        }
    }
    /**
     * @param {?} headers
     * @return {?}
     */
    _parseHeaders(headers) {
        if (!headers) {
            return {};
        }
        /** @type {?} */
        const result = {};
        this.forEach(this.trim(headers).split('\n'), (row) => {
            /** @type {?} */
            const index = row.indexOf(':');
            /** @type {?} */
            const key = this.trim(row.slice(0, index)).toLowerCase();
            /** @type {?} */
            const value = this.trim(row.slice(index + 1));
            if (typeof (result[key]) === 'undefined') {
                result[key] = value;
            }
            else if (this.isArray(result[key])) {
                result[key].push(value);
            }
            else {
                result[key] = [result[key], value];
            }
        });
        return result;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Ajax {
    constructor() {
        this.xhr = new XHRPromise();
    }
    ;
    /**
     * @param {?} args
     * @return {?}
     */
    post(args) {
        /** @type {?} */
        const opt = {
            method: 'POST',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .send(opt)
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(err => {
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
            return Promise.reject(err);
        });
    }
    /**
     * @param {?} args
     * @return {?}
     */
    put(args) {
        /** @type {?} */
        const opt = {
            method: 'PUT',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .send(opt)
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(err => {
            // if (err.reason === 'timeout') {
            //     err.code = 408;
            // } else {
            //     err.code = 404;
            // }
            return Promise.reject(err);
        });
    }
    /**
     * @param {?} args
     * @return {?}
     */
    delete(args) {
        /** @type {?} */
        const opt = {
            method: 'DELETE',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .send(opt)
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(err => {
            // if (err.reason === 'timeout') {
            //     err.code = 408;
            // } else {
            //     err.code = 404;
            // }
            return Promise.reject(err);
        });
    }
    /**
     * @param {?} args
     * @return {?}
     */
    get(args) {
        /** @type {?} */
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
            .send(opt)
            .then(res => {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(err => {
            // if (err.reason === 'timeout') {
            //     err.code = 408;
            // } else {
            //     err.code = 404;
            // }
            return Promise.reject(err);
        });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Client {
    /**
     * @param {?} appId
     * @param {?} URI
     * @param {?} storage
     * @param {?} sdk
     */
    constructor(appId, URI, storage, sdk) {
        this.appId = appId;
        this.URI = URI;
        this.storage = storage;
        this.sdk = sdk;
        /** @type {?} */
        let uuid = this.storage.get(Client._clientUuid) || 'uuid-' + Math.random();
        /** @type {?} */
        let info = '_clientInfo'; // this.storage.get(Client._clientInfo);
        if (window && window.navigator) {
            info = window.navigator.appName + '@' + window.navigator.appVersion + '-' + window.navigator.userAgent;
        }
        if (window && window['device'] && window['device'].uuid) {
            uuid = window['device'].uuid;
        }
        this.setClientUuid(uuid);
        this.setClientInfo(info);
        this.clientId = this.storage.get(Client._clientId);
        Client.refreshCount = this.storage.get(Client._refreshCount) || 0;
    }
    ;
    /**
     * @param {?} value
     * @return {?}
     */
    setClientId(value) {
        this.clientId = '' + value;
        this.storage.set(Client._clientId, this.clientId);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setClientUuid(value) {
        this.clientUuid = '' + value;
        this.storage.set(Client._clientUuid, this.clientUuid);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setClientInfo(value) {
        this.clientInfo = '' + value;
        // this.storage.set('clientInfo', this.clientInfo);
    }
    /**
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    login(login, password, updateProperties) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        /** @type {?} */
        const urlLogin = this.URI + '/users';
        /** @type {?} */
        const dataLogin = {
            name: login,
            username: login,
            email: login,
            password: password
        };
        return new Ajax()
            .post({
            url: urlLogin,
            data: dataLogin,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
            .then(createdUser => {
            this.setClientId(createdUser._id);
            /** @type {?} */
            const urlToken = this.URI + '/oauth/token';
            /** @type {?} */
            const dataToken = {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: password,
                client_udid: this.clientUuid,
                client_info: this.clientInfo,
                audience: this.appId,
                scope: JSON.stringify(this.sdk)
            };
            return new Ajax()
                .post({
                url: urlToken,
                data: dataToken,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
        });
    }
    /**
     * @param {?} refreshToken
     * @return {?}
     */
    reAuthenticate(refreshToken) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        /** @type {?} */
        const url = this.URI + '/oauth/token';
        /** @type {?} */
        const data = {
            grant_type: 'refresh_token',
            client_id: this.clientId,
            client_udid: this.clientUuid,
            client_info: this.clientInfo,
            audience: this.appId,
            scope: JSON.stringify(this.sdk),
            refresh_token: refreshToken,
            refresh_extra: Client.refreshCount,
        };
        return new Ajax()
            .post({
            url: url,
            data: data,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
            .then((obj) => {
            Client.refreshCount++;
            this.storage.set(Client._refreshCount, Client.refreshCount);
            return Promise.resolve(obj);
        });
    }
    /**
     * @param {?=} refreshToken
     * @return {?}
     */
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
        Client.refreshCount = 0;
        if (!refreshToken || !this.clientId) {
            return Promise.resolve();
        }
        /** @type {?} */
        const url = this.URI + '/oauth/revoke';
        /** @type {?} */
        const data = {
            token: refreshToken,
            client_id: this.clientId,
            client_udid: this.clientUuid,
            client_info: this.clientInfo,
            audience: this.appId,
            scope: JSON.stringify(this.sdk)
        };
        return new Ajax()
            .post({
            url: url,
            data: data,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });
    }
    /**
     * @return {?}
     */
    isReady() {
        return !!this.URI;
    }
}
Client.refreshCount = 0;
Client._clientUuid = 'v2.clientUuid';
Client._clientId = 'v2.clientId';
Client._refreshCount = 'v2.refreshCount';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Error$1 {
    /**
     * @param {?} code
     * @param {?} reason
     */
    constructor(code, reason) {
        this.code = code;
        this.reason = reason;
    }
    ;
    /**
     * @param {?} err
     * @return {?}
     */
    equals(err) {
        return this.code === err.code && this.reason === err.reason;
    }
    /**
     * @return {?}
     */
    toString() {
        /** @type {?} */
        const msg = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
        return '' + this.code + ' - ' + msg;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Connection {
    /**
     * @param {?} _sdk
     * @param {?} _storage
     */
    constructor(_sdk, _storage) {
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
    isReady() {
        return !!this.client && this.client.isReady();
    }
    /**
     * @param {?=} force
     * @return {?}
     */
    destroy(force) {
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
    }
    /**
     * @param {?} client
     * @return {?}
     */
    setClient(client) {
        this.client = client;
        if (!this.user) {
            this.user = {};
        }
        // this._user._id = this._client.clientId;
        this.user._name = JSON.parse(this.getIdPayload({ name: '' })).name;
    }
    /**
     * @param {?} user
     * @return {?}
     */
    setUser(user) {
        this.user = user;
        if (this.user._id) {
            this.client.setClientId(this.user._id);
            // store only clientId
            delete this.user._id;
        }
    }
    /**
     * @return {?}
     */
    getUser() {
        return this.user;
    }
    /**
     * @return {?}
     */
    getClient() {
        return this.client;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setCryptoSalt(value) {
        if (this.cryptoSalt !== value && this.cryptoSaltNext !== value) {
            this.cryptoSaltNext = value;
            this._storage.set(Connection._cryptoSaltNext, this.cryptoSaltNext);
        }
        if (!this.cryptoSalt) {
            this.setCryptoSaltAsVerified();
        }
    }
    /**
     * @return {?}
     */
    setCryptoSaltAsVerified() {
        if (this.cryptoSaltNext) {
            this.cryptoSalt = this.cryptoSaltNext;
            this._storage.set(Connection._cryptoSalt, this.cryptoSalt);
        }
        this.cryptoSaltNext = null;
        this._storage.remove(Connection._cryptoSaltNext);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    encrypt(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        else {
            /** @type {?} */
            const dataAsObj = { string: data };
            data = JSON.stringify(dataAsObj);
        }
        if (this.fidjCrypto && this.cryptoSalt) {
            /** @type {?} */
            const key = this.cryptoSalt;
            return Xor.encrypt(data, key);
        }
        else {
            return data;
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    decrypt(data) {
        /** @type {?} */
        let decrypted = null;
        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSaltNext) {
                /** @type {?} */
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
                /** @type {?} */
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
                /** @type {?} */
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
    /**
     * @return {?}
     */
    isLogin() {
        /** @type {?} */
        let exp = true;
        try {
            /** @type {?} */
            const payload = this.refreshToken.split('.')[1];
            /** @type {?} */
            const decoded = JSON.parse(Base64.decode(payload));
            exp = ((new Date().getTime() / 1000) >= decoded.exp);
        }
        catch (e) {
        }
        return !exp;
    }
    /**
     * @return {?}
     */
    logout() {
        return this.getClient().logout(this.refreshToken);
    }
    /**
     * @return {?}
     */
    getClientId() {
        if (!this.client) {
            return null;
        }
        return this.client.clientId;
    }
    /**
     * @return {?}
     */
    getIdToken() {
        return this.idToken;
    }
    /**
     * @param {?=} def
     * @return {?}
     */
    getIdPayload(def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            /** @type {?} */
            const payload = this.getIdToken().split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    }
    /**
     * @param {?=} def
     * @return {?}
     */
    getAccessPayload(def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            /** @type {?} */
            const payload = this.accessToken.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    }
    /**
     * @param {?=} def
     * @return {?}
     */
    getPreviousAccessPayload(def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            /** @type {?} */
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
     * @return {?}
     */
    refreshConnection() {
        // store states
        this._storage.set(Connection._states, this.states);
        // token not expired : ok
        if (this.accessToken) {
            /** @type {?} */
            const payload = this.accessToken.split('.')[1];
            /** @type {?} */
            const decoded = Base64.decode(payload);
            // console.log('new Date().getTime() < JSON.parse(decoded).exp :', (new Date().getTime() / 1000), JSON.parse(decoded).exp);
            if ((new Date().getTime() / 1000) < JSON.parse(decoded).exp) {
                return Promise.resolve(this.getUser());
            }
        }
        // remove expired refreshToken
        if (this.refreshToken) {
            /** @type {?} */
            const payload = this.refreshToken.split('.')[1];
            /** @type {?} */
            const decoded = Base64.decode(payload);
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
        return new Promise((resolve, reject) => {
            this.getClient().reAuthenticate(this.refreshToken)
                .then(user => {
                this.setConnection(user);
                resolve(this.getUser());
            })
                .catch(err => {
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
    }
    ;
    /**
     * @param {?} clientUser
     * @return {?}
     */
    setConnection(clientUser) {
        // only in private storage
        if (clientUser.access_token) {
            this.accessToken = clientUser.access_token;
            this._storage.set(Connection._accessToken, this.accessToken);
            delete clientUser.access_token;
            /** @type {?} */
            const salt = JSON.parse(this.getAccessPayload({ salt: '' })).salt;
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
    }
    ;
    /**
     * @param {?} options
     * @return {?}
     */
    setConnectionOffline(options) {
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
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    getApiEndpoints(options) {
        /** @type {?} */
        let ea = [
            { key: 'fidj.default', url: 'https://fidj.ovh/api', blocked: false }
        ];
        /** @type {?} */
        let filteredEa = [];
        if (!this._sdk.prod) {
            ea = [
                { key: 'fidj.default', url: 'http://localhost:5894/api', blocked: false },
                { key: 'fidj.default', url: 'https://fidj-sandbox.herokuapp.com/api', blocked: false }
            ];
        }
        if (this.accessToken) {
            /** @type {?} */
            const val = this.getAccessPayload({ apis: [] });
            /** @type {?} */
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
            /** @type {?} */
            const apiEndpoints = JSON.parse(this.getPreviousAccessPayload({ apis: [] })).apis;
            if (apiEndpoints && apiEndpoints.length) {
                apiEndpoints.forEach((endpoint) => {
                    if (endpoint.url && ea.filter((r) => r.url === endpoint.url).length === 0) {
                        ea.push(endpoint);
                    }
                });
            }
        }
        /** @type {?} */
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
                    /** @type {?} */
                    const endpoint = ea[i];
                    if (this.states[endpoint.url] &&
                        this.states[endpoint.url].state) {
                        filteredEa.push(endpoint);
                    }
                }
            }
            else if (couldCheckStates && options.filter === 'theBestOldOne') {
                /** @type {?} */
                let bestOldOne;
                for (let i = 0; (i < ea.length); i++) {
                    /** @type {?} */
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
    }
    ;
    /**
     * @param {?=} options
     * @return {?}
     */
    getDBs(options) {
        if (!this.accessToken) {
            return [];
        }
        /** @type {?} */
        const random = Math.random() % 2;
        /** @type {?} */
        let dbs = JSON.parse(this.getAccessPayload({ dbs: [] })).dbs || [];
        // need to synchronize db
        if (random === 0) {
            dbs = dbs.sort();
        }
        else if (random === 1) {
            dbs = dbs.reverse();
        }
        /** @type {?} */
        let filteredDBs = [];
        /** @type {?} */
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
                /** @type {?} */
                const endpoint = dbs[i];
                if (this.states[endpoint.url] &&
                    this.states[endpoint.url].state) {
                    filteredDBs.push(endpoint);
                }
            }
        }
        else if (couldCheckStates && options && options.filter === 'theBestOnes') {
            for (let i = 0; (i < dbs.length); i++) {
                /** @type {?} */
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
    }
    ;
    /**
     * @return {?}
     */
    verifyConnectionStates() {
        /** @type {?} */
        const currentTime = new Date().getTime();
        /** @type {?} */
        const promises = [];
        // this.states = {};
        this.apis = this.getApiEndpoints();
        this.apis.forEach((endpointObj) => {
            /** @type {?} */
            let endpointUrl = endpointObj.url;
            if (!endpointUrl) {
                endpointUrl = endpointObj.toString();
            }
            promises.push(new Promise((resolve, reject) => {
                new Ajax()
                    .get({
                    url: endpointUrl + '/status?isok=' + this._sdk.version,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                })
                    .then(data => {
                    /** @type {?} */
                    let state = false;
                    if (data && data.isok) {
                        state = true;
                    }
                    this.states[endpointUrl] = { state: state, time: currentTime, lastTimeWasOk: currentTime };
                    resolve();
                })
                    .catch(err => {
                    /** @type {?} */
                    let lastTimeWasOk = 0;
                    if (this.states[endpointUrl]) {
                        lastTimeWasOk = this.states[endpointUrl].lastTimeWasOk;
                    }
                    this.states[endpointUrl] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                    resolve();
                });
            }));
        });
        /** @type {?} */
        const dbs = this.getDBs();
        dbs.forEach((dbEndpointObj) => {
            /** @type {?} */
            let dbEndpoint = dbEndpointObj.url;
            if (!dbEndpoint) {
                dbEndpoint = dbEndpointObj.toString();
            }
            promises.push(new Promise((resolve, reject) => {
                new Ajax()
                    .get({
                    url: dbEndpoint,
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                })
                    .then(data => {
                    this.states[dbEndpoint] = { state: true, time: currentTime, lastTimeWasOk: currentTime };
                    resolve();
                })
                    .catch(err => {
                    /** @type {?} */
                    let lastTimeWasOk = 0;
                    if (this.states[dbEndpoint]) {
                        lastTimeWasOk = this.states[dbEndpoint].lastTimeWasOk;
                    }
                    this.states[dbEndpoint] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                    resolve();
                });
            }));
        });
        return Promise.all(promises);
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const FidjPouch = window['PouchDB'] ? window['PouchDB'] : require('pouchdb').default;
/** @type {?} */
const PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
FidjPouch.plugin(PouchAdapterCordovaSqlite);
class Session {
    constructor() {
        this.db = null;
        this.dbRecordCount = 0;
        this.dbLastSync = null;
        this.remoteDb = null;
        this.dbs = [];
    }
    ;
    /**
     * @return {?}
     */
    isReady() {
        return !!this.db;
    }
    /**
     * @param {?} uid
     * @param {?=} force
     * @return {?}
     */
    create(uid, force) {
        if (!force && this.db) {
            return Promise.resolve();
        }
        this.dbRecordCount = 0;
        this.dbLastSync = null; // new Date().getTime();
        this.db = null;
        return new Promise((resolve, reject) => {
            /** @type {?} */
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
                    reject(new Error$1(400, err));
                });
            }
            catch (err) {
                reject(new Error$1(500, err));
            }
        });
    }
    /**
     * @return {?}
     */
    destroy() {
        if (!this.db) {
            this.dbRecordCount = 0;
            this.dbLastSync = null;
            return Promise.resolve();
        }
        if (this.db && !this.db.destroy) {
            return Promise.reject(new Error$1(408, 'Need a valid db'));
        }
        return new Promise((resolve, reject) => {
            this.db.destroy((err, info) => {
                if (err) {
                    reject(new Error$1(500, err));
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
    /**
     * @param {?} dbs
     * @return {?}
     */
    setRemote(dbs) {
        this.dbs = dbs;
    }
    /**
     * @param {?} userId
     * @return {?}
     */
    sync(userId) {
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'need db'));
        }
        if (!this.dbs || !this.dbs.length) {
            return Promise.reject(new Error$1(408, 'need a remote db'));
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
                        .on('denied', (err) => reject({ code: 403, reason: err }))
                        .on('error', (err) => reject({ code: 401, reason: err }));
                })
                    .on('denied', (err) => reject({ code: 403, reason: err }))
                    .on('error', (err) => reject({ code: 401, reason: err }));
            }
            catch (err) {
                reject(new Error$1(500, err));
            }
        });
    }
    /**
     * @param {?} data
     * @param {?} _id
     * @param {?} uid
     * @param {?} oid
     * @param {?} ave
     * @param {?=} crypto
     * @return {?}
     */
    put(data, _id, uid, oid, ave, crypto) {
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'need db'));
        }
        if (!data || !_id || !uid || !oid || !ave) {
            return Promise.reject(new Error$1(400, 'need formated data'));
        }
        /** @type {?} */
        const dataWithoutIds = JSON.parse(JSON.stringify(data));
        /** @type {?} */
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
        /** @type {?} */
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
                        (/** @type {?} */ (data))._rev = response.rev;
                        (/** @type {?} */ (data))._id = response.id;
                        resolve(data);
                    }
                    else {
                        resolve(response.id);
                    }
                }
                else {
                    reject(new Error$1(500, err));
                }
            });
        });
    }
    /**
     * @param {?} data_id
     * @return {?}
     */
    remove(data_id) {
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'need db'));
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
    /**
     * @param {?} data_id
     * @param {?=} crypto
     * @return {?}
     */
    get(data_id, crypto) {
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'Need db'));
        }
        return new Promise((resolve, reject) => {
            this.db.get(data_id)
                .then(row => {
                if (!!row && (!!row.fidjDacr || !!row.fidjData)) {
                    /** @type {?} */
                    let data = row.fidjDacr;
                    if (crypto && data) {
                        data = crypto.obj[crypto.method](data);
                    }
                    else if (row.fidjData) {
                        data = JSON.parse(row.fidjData);
                    }
                    /** @type {?} */
                    const resultAsJson = Session.extractJson(data);
                    if (resultAsJson) {
                        resultAsJson._id = row._id;
                        resultAsJson._rev = row._rev;
                        resolve(JSON.parse(JSON.stringify(resultAsJson)));
                    }
                    else {
                        // row._deleted = true;
                        this.remove(row._id);
                        reject(new Error$1(400, 'Bad encoding'));
                    }
                }
                else {
                    reject(new Error$1(400, 'No data found'));
                }
            })
                .catch(err => reject(new Error$1(500, err)));
        });
    }
    /**
     * @param {?=} crypto
     * @return {?}
     */
    getAll(crypto) {
        if (!this.db || !(/** @type {?} */ (this.db)).allDocs) {
            return Promise.reject(new Error$1(408, 'Need a valid db'));
        }
        return new Promise((resolve, reject) => {
            (/** @type {?} */ (this.db)).allDocs({ include_docs: true, descending: true })
                .then(rows => {
                /** @type {?} */
                const all = [];
                rows.rows.forEach(row => {
                    if (!!row && !!row.doc._id && (!!row.doc.fidjDacr || !!row.doc.fidjData)) {
                        /** @type {?} */
                        let data = row.doc.fidjDacr;
                        if (crypto && data) {
                            data = crypto.obj[crypto.method](data);
                        }
                        else if (row.doc.fidjData) {
                            data = JSON.parse(row.doc.fidjData);
                        }
                        /** @type {?} */
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
                .catch(err => reject(new Error$1(400, err)));
        });
    }
    /**
     * @return {?}
     */
    isEmpty() {
        if (!this.db || !(/** @type {?} */ (this.db)).allDocs) {
            return Promise.reject(new Error$1(408, 'No db'));
        }
        return new Promise((resolve, reject) => {
            (/** @type {?} */ (this.db)).allDocs({})
                .then((response) => {
                if (!response) {
                    reject(new Error$1(400, 'No response'));
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
                .catch((err) => reject(new Error$1(400, err)));
        });
    }
    /**
     * @return {?}
     */
    info() {
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'No db'));
        }
        return this.db.info();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    static write(item) {
        /** @type {?} */
        let value = 'null';
        /** @type {?} */
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
    /**
     * @param {?} item
     * @return {?}
     */
    static value(item) {
        /** @type {?} */
        let result = item;
        if (typeof (item) !== 'object') ;
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
    /**
     * @param {?} item
     * @return {?}
     */
    static extractJson(item) {
        /** @type {?} */
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
            result = (/** @type {?} */ (result)).json;
        }
        if (typeof result !== 'object') {
            result = null;
        }
        return result;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * please use its angular.js or angular.io wrapper
 * usefull only for fidj dev team
 */
class InternalService {
    /**
     * @param {?} logger
     * @param {?} promise
     */
    constructor(logger, promise) {
        this.sdk = {
            org: 'fidj',
            version: version,
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
        this.logger.log('fidj.sdk.service : constructor');
        if (promise) {
            this.promise = promise;
        }
        this.storage = new LocalStorage(window.localStorage, 'fidj.');
        this.session = new Session();
        this.connection = new Connection(this.sdk, this.storage);
    }
    /**
     * Init connection & session
     * Check uri
     * Done each app start
     *
     * @param {?} fidjId
     * @param {?=} options Optional settings
     * @return {?}
     */
    fidjInit(fidjId, options) {
        /** @type {?} */
        const self = this;
        self.logger.log('fidj.sdk.service.fidjInit : ', options);
        if (!fidjId) {
            self.logger.error('fidj.sdk.service.fidjInit : bad init');
            return self.promise.reject(new Error$1(400, 'Need a fidjId'));
        }
        self.sdk.prod = !options ? true : options.prod;
        return new self.promise((resolve, reject) => {
            self.connection.verifyConnectionStates()
                .then(() => {
                self.connection.fidjId = fidjId;
                self.connection.fidjVersion = self.sdk.version;
                self.connection.fidjCrypto = (!options || !options.hasOwnProperty('crypto')) ? true : options.crypto;
                /** @type {?} */
                let theBestUrl = self.connection.getApiEndpoints({ filter: 'theBestOne' })[0];
                /** @type {?} */
                let theBestOldUrl = self.connection.getApiEndpoints({ filter: 'theBestOldOne' })[0];
                /** @type {?} */
                const isLogin = self.fidjIsLogin();
                if (theBestUrl && theBestUrl.url) {
                    theBestUrl = theBestUrl.url;
                }
                if (theBestOldUrl && theBestOldUrl.url) {
                    theBestOldUrl = theBestOldUrl.url;
                }
                if (theBestUrl) {
                    self.connection.setClient(new Client(self.connection.fidjId, theBestUrl, self.storage, self.sdk));
                    resolve();
                }
                else if (isLogin && theBestOldUrl) {
                    self.connection.setClient(new Client(self.connection.fidjId, theBestOldUrl, self.storage, self.sdk));
                    resolve();
                }
                else {
                    reject(new Error$1(404, 'Need one connection - or too old SDK version (check update)'));
                }
            })
                .catch((err) => {
                self.logger.error('fidj.sdk.service.fidjInit: ', err);
                reject(new Error$1(500, err.toString()));
            });
        });
    }
    ;
    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    fidjLogin(login, password) {
        /** @type {?} */
        const self = this;
        self.logger.log('fidj.sdk.service.fidjLogin');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error$1(404, 'Need an intialized FidjService'));
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
     * @param {?=} options
     * @return {?}
     */
    fidjLoginInDemoMode(options) {
        /** @type {?} */
        const self = this;
        // generate one day tokens if not set
        if (!options || !options.accessToken) {
            /** @type {?} */
            const now = new Date();
            now.setDate(now.getDate() + 1);
            /** @type {?} */
            const tomorrow = now.getTime();
            /** @type {?} */
            const payload = Base64.encode(JSON.stringify({
                roles: [],
                message: 'demo',
                apis: [],
                endpoints: {},
                dbs: [],
                exp: tomorrow
            }));
            /** @type {?} */
            const jwtSign = Base64.encode(JSON.stringify({}));
            /** @type {?} */
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
                self.logger.error('fidj.sdk.service.fidjLogin error: ', err);
                reject(err);
            });
        });
    }
    ;
    /**
     * @param {?=} filter
     * @return {?}
     */
    fidjGetEndpoints(filter) {
        if (!filter) {
            filter = { showBlocked: false };
        }
        /** @type {?} */
        let endpoints = JSON.parse(this.connection.getAccessPayload({ endpoints: [] })).endpoints;
        if (!endpoints) {
            return [];
        }
        endpoints = endpoints.filter((endpoint) => {
            /** @type {?} */
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
    /**
     * @return {?}
     */
    fidjRoles() {
        return JSON.parse(this.connection.getIdPayload({ roles: [] })).roles;
    }
    ;
    /**
     * @return {?}
     */
    fidjMessage() {
        return JSON.parse(this.connection.getIdPayload({ message: '' })).message;
    }
    ;
    /**
     * @return {?}
     */
    fidjIsLogin() {
        return this.connection.isLogin();
    }
    ;
    /**
     * @return {?}
     */
    fidjLogout() {
        /** @type {?} */
        const self = this;
        if (!self.connection.getClient()) {
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
     * @param {?=} fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param {?=} fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @return {?} promise
     */
    fidjSync(fnInitFirstData, fnInitFirstData_Arg) {
        /** @type {?} */
        const self = this;
        self.logger.log('fidj.sdk.service.fidjSync');
        /** @type {?} */
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
                return new Promise((resolveEmpty, rejectEmptyNotUsed) => {
                    if (isEmpty && firstSync && fnInitFirstData) {
                        /** @type {?} */
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
                resolve(); // self.connection.getUser()
            })
                .catch((err) => {
                // console.error(err);
                if (err && (err.code === 403 || err.code === 410)) {
                    this.fidjLogout()
                        .then(() => {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                    })
                        .catch(() => {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                    });
                }
                else if (err && err.code) {
                    // todo what to do with this err ?
                    resolve();
                }
                else {
                    /** @type {?} */
                    const errMessage = 'Error during syncronisation: ' + err.toString();
                    // self.logger.error(errMessage);
                    reject({ code: 500, reason: errMessage });
                }
            });
        });
    }
    ;
    /**
     * @param {?} data
     * @return {?}
     */
    fidjPutInDb(data) {
        /** @type {?} */
        const self = this;
        self.logger.log('fidj.sdk.service.fidjPutInDb: ', data);
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error$1(401, 'DB put impossible. Need a user logged in.'));
        }
        /** @type {?} */
        let _id;
        if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
            _id = data._id;
        }
        if (!_id) {
            _id = self._generateObjectUniqueId(self.connection.fidjId);
        }
        /** @type {?} */
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
    /**
     * @param {?} data_id
     * @return {?}
     */
    fidjRemoveInDb(data_id) {
        /** @type {?} */
        const self = this;
        self.logger.log('fidj.sdk.service.fidjRemoveInDb ', data_id);
        if (!self.session.isReady()) {
            return self.promise.reject(new Error$1(401, 'DB remove impossible. ' +
                'Need a user logged in.'));
        }
        if (!data_id || typeof data_id !== 'string') {
            return self.promise.reject(new Error$1(400, 'DB remove impossible. ' +
                'Need the data._id.'));
        }
        return self.session.remove(data_id);
    }
    ;
    /**
     * @param {?} data_id
     * @return {?}
     */
    fidjFindInDb(data_id) {
        /** @type {?} */
        const self = this;
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error$1(401, 'fidj.sdk.service.fidjFindInDb : need a user logged in.'));
        }
        /** @type {?} */
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
    /**
     * @return {?}
     */
    fidjFindAllInDb() {
        /** @type {?} */
        const self = this;
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error$1(401, 'Need a user logged in.'));
        }
        /** @type {?} */
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
            return self.promise.resolve((/** @type {?} */ (results)));
        });
    }
    ;
    /**
     * @param {?} key
     * @param {?=} data
     * @return {?}
     */
    fidjPostOnEndpoint(key, data) {
        /** @type {?} */
        const filter = {
            key: key
        };
        /** @type {?} */
        const endpoints = this.fidjGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(new Error$1(400, 'fidj.sdk.service.fidjPostOnEndpoint : endpoint does not exist.'));
        }
        /** @type {?} */
        const endpointUrl = endpoints[0].url;
        /** @type {?} */
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
    /**
     * @return {?}
     */
    fidjGetIdToken() {
        return this.connection.getIdToken();
    }
    ;
    /**
     * Logout then Login
     *
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    _loginInternal(login, password, updateProperties) {
        /** @type {?} */
        const self = this;
        self.logger.log('fidj.sdk.service._loginInternal');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error$1(403, 'Need an intialized FidjService'));
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
    /**
     * @return {?}
     */
    _removeAll() {
        this.connection.destroy();
        return this.session.destroy();
    }
    ;
    /**
     * @param {?} uid
     * @return {?}
     */
    _createSession(uid) {
        this.session.setRemote(this.connection.getDBs({ filter: 'theBestOnes' }));
        return this.session.create(uid);
    }
    ;
    /**
     * @param {?=} a
     * @return {?}
     */
    _testPromise(a) {
        if (a) {
            return this.promise.resolve('test promise ok ' + a);
        }
        return new this.promise((resolve, reject) => {
            resolve('test promise ok');
        });
    }
    ;
    /**
     * @param {?} appName
     * @param {?=} type
     * @param {?=} name
     * @return {?}
     */
    _generateObjectUniqueId(appName, type, name) {
        /** @type {?} */
        const now = new Date();
        /** @type {?} */
        const simpleDate = '' + now.getFullYear() + '' + now.getMonth() + '' + now.getDate()
            + '' + now.getHours() + '' + now.getMinutes();
        /** @type {?} */
        const sequId = ++InternalService._srvDataUniqId;
        /** @type {?} */
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
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Angular2+ FidjService
 * @see ModuleServiceInterface
 *
 * \@exemple
 *      // ... after install :
 *      // $ npm install --save-dev fidj
 *      // then init your app.js & use it in your services
 *
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.fidj.inject.js"></script>
 *
 * <script src="https://gist.githubusercontent.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46/raw/5fff69dd9c15f692a856db62cf334b724ef3f4ac/angular.fidj.sync.js"></script>
 *
 *
 */
class FidjService {
    constructor() {
        this.logger = new LoggerService();
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    }
    ;
    /**
     * @param {?} fidjId
     * @param {?=} options
     * @return {?}
     */
    init(fidjId, options) {
        if (!this.fidjService) {
            this.fidjService = new InternalService(this.logger, this.promise);
        }
        /*
                if (options && options.forcedEndpoint) {
                    this.fidjService.setAuthEndpoint(options.forcedEndpoint);
                }
                if (options && options.forcedDBEndpoint) {
                    this.fidjService.setDBEndpoint(options.forcedDBEndpoint);
                }*/
        return this.fidjService.fidjInit(fidjId, options);
    }
    ;
    /**
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    login(login, password) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    }
    ;
    /**
     * @param {?=} options
     * @return {?}
     */
    loginAsDemo(options) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    }
    ;
    /**
     * @return {?}
     */
    isLoggedIn() {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    }
    ;
    /**
     * @return {?}
     */
    getRoles() {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    }
    ;
    /**
     * @return {?}
     */
    getEndpoints() {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    }
    ;
    /**
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    postOnEndpoint(key, data) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, data);
    }
    ;
    /**
     * @return {?}
     */
    getIdToken() {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    }
    ;
    /**
     * @return {?}
     */
    getMessage() {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    }
    ;
    /**
     * @return {?}
     */
    logout() {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout();
    }
    ;
    /**
     *
     * Synchronize DB
     * \@memberof fidj.angularService
     *
     * \@example
     *  let initDb = function() {
     *     this.fidjService.put('my first row');
     *  };
     *  this.fidjService.sync(initDb)
     *  .then(user => ...)
     *  .catch(err => ...)
     *
     * @param {?=} fnInitFirstData  a function with db as input and that return promise: call if DB is empty
     * @return {?} promise with this.session.db
     */
    sync(fnInitFirstData) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    }
    ;
    /**
     * Store data in your session
     *
     * @param {?} data to store
     * @return {?}
     */
    put(data) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    }
    ;
    /**
     * Find object Id and remove it from your session
     *
     * @param {?} id of object to find and remove
     * @return {?}
     */
    remove(id) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(id);
    }
    ;
    /**
     * Find
     * @param {?} id
     * @return {?}
     */
    find(id) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    }
    ;
    /**
     * @return {?}
     */
    findAll() {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    }
    ;
}
FidjService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FidjService.ctorParameters = () => [];
class LoggerService {
    /**
     * @param {?} message
     * @return {?}
     */
    log(message) {
        // console.log(message);
    }
    /**
     * @param {?} message
     * @return {?}
     */
    error(message) {
        console.error(message);
    }
    /**
     * @param {?} message
     * @return {?}
     */
    warn(message) {
        console.warn(message);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * `NgModule` which provides associated services.
 *
 * ...
 *
 * \@stable
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
                providers: [FidjService]
            },] }
];
/** @nocollapse */
FidjModule.ctorParameters = () => [];
/**
 * module FidjModule
 *
 * exemple
 *      // ... after install :
 *      // $ npm install fidj
 *      // then init your app.js & use it in your services
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { Base64, LocalStorage, Xor, FidjModule, FidjService, LoggerService };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlkai5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vZmlkai90b29scy9iYXNlNjQudHMiLCJuZzovL2ZpZGovdG9vbHMvc3RvcmFnZS50cyIsIm5nOi8vZmlkai90b29scy94b3IudHMiLCJuZzovL2ZpZGovdmVyc2lvbi9pbmRleC50cyIsIm5nOi8vZmlkai9jb25uZWN0aW9uL3hocnByb21pc2UudHMiLCJuZzovL2ZpZGovY29ubmVjdGlvbi9hamF4LnRzIiwibmc6Ly9maWRqL2Nvbm5lY3Rpb24vY2xpZW50LnRzIiwibmc6Ly9maWRqL3Nkay9lcnJvci50cyIsIm5nOi8vZmlkai9jb25uZWN0aW9uL2Nvbm5lY3Rpb24udHMiLCJuZzovL2ZpZGovc2Vzc2lvbi9zZXNzaW9uLnRzIiwibmc6Ly9maWRqL3Nkay9pbnRlcm5hbC5zZXJ2aWNlLnRzIiwibmc6Ly9maWRqL3Nkay9hbmd1bGFyLnNlcnZpY2UudHMiLCJuZzovL2ZpZGovc2RrL2ZpZGoubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBCYXNlNjQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlY29kZXMgc3RyaW5nIGZyb20gQmFzZTY0IHN0cmluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZW5jb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KGlucHV0KS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxuICAgICAgICAgICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KCcweCcgKyBwMSwgMTYpKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZGVjb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChhdG9iKGlucHV0KS5zcGxpdCgnJykubWFwKChjKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJyUnICsgKCcwMCcgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgIH0pLmpvaW4oJycpKTtcblxuICAgIH1cbn1cbiIsIi8qKlxuICogbG9jYWxTdG9yYWdlIGNsYXNzIGZhY3RvcnlcbiAqIFVzYWdlIDogdmFyIExvY2FsU3RvcmFnZSA9IGZpZGouTG9jYWxTdG9yYWdlRmFjdG9yeSh3aW5kb3cubG9jYWxTdG9yYWdlKTsgLy8gdG8gY3JlYXRlIGEgbmV3IGNsYXNzXG4gKiBVc2FnZSA6IHZhciBsb2NhbFN0b3JhZ2VTZXJ2aWNlID0gbmV3IExvY2FsU3RvcmFnZSgpOyAvLyB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSB7XG5cbiAgICBwdWJsaWMgdmVyc2lvbiA9ICcwLjEnO1xuICAgIHByaXZhdGUgc3RvcmFnZTtcblxuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgY29uc3RydWN0b3Ioc3RvcmFnZVNlcnZpY2UsIHByaXZhdGUgc3RvcmFnZUtleSkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlU2VydmljZSB8fCB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgICAgICBpZiAoIXRoaXMuc3RvcmFnZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLkxvY2FsU3RvcmFnZUZhY3RvcnkgbmVlZHMgYSBzdG9yYWdlU2VydmljZSEnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0b2RvIExvY2FsU3RvcmFnZSByZWZhY3RvXG4gICAgICAgIC8vICAgICAgICAgICAgaWYgKCFmaWRqLlhtbCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouWG1sIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5Kc29uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Kc29uIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5YbWwuaXNYbWwgfHwgIWZpZGouWG1sLnhtbDJTdHJpbmcgfHwgIWZpZGouWG1sLnN0cmluZzJYbWwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLlhtbCB3aXRoIGlzWG1sKCksIHhtbDJTdHJpbmcoKVxuICAgICAgICAvLyBhbmQgc3RyaW5nMlhtbCgpIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5Kc29uLm9iamVjdDJTdHJpbmcgfHwgIWZpZGouSnNvbi5zdHJpbmcyT2JqZWN0KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Kc29uIHdpdGggb2JqZWN0MlN0cmluZygpXG4gICAgICAgIC8vIGFuZCBzdHJpbmcyT2JqZWN0KCkgbmVlZHMgdG8gYmUgbG9hZGVkIGJlZm9yZSBmaWRqLkxvY2FsU3RvcmFnZSEnKTtcbiAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgfVxuXG4gICAgLy8gUHVibGljIEFQSVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhIGtleSdzIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGtleSAtIEtleSB0byBzZXQuIElmIHRoaXMgdmFsdWUgaXMgbm90IHNldCBvciBub3RcbiAgICAgKiAgICAgICAgICAgICAgYSBzdHJpbmcgYW4gZXhjZXB0aW9uIGlzIHJhaXNlZC5cbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBWYWx1ZSB0byBzZXQuIFRoaXMgY2FuIGJlIGFueSB2YWx1ZSB0aGF0IGlzIEpTT05cbiAgICAgKiAgICAgICAgICAgICAgY29tcGF0aWJsZSAoTnVtYmVycywgU3RyaW5ncywgT2JqZWN0cyBldGMuKS5cbiAgICAgKiBAcmV0dXJucyB0aGUgc3RvcmVkIHZhbHVlIHdoaWNoIGlzIGEgY29udGFpbmVyIG9mIHVzZXIgdmFsdWUuXG4gICAgICovXG4gICAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZSkge1xuXG4gICAgICAgIGtleSA9IHRoaXMuc3RvcmFnZUtleSArIGtleTtcbiAgICAgICAgdGhpcy5jaGVja0tleShrZXkpO1xuICAgICAgICAvLyBjbG9uZSB0aGUgb2JqZWN0IGJlZm9yZSBzYXZpbmcgdG8gc3RvcmFnZVxuICAgICAgICBjb25zdCB0ID0gdHlwZW9mKHZhbHVlKTtcbiAgICAgICAgaWYgKHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe3N0cmluZzogdmFsdWV9KVxuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtudW1iZXI6IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtib29sOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtqc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcmVqZWN0IGFuZCBkbyBub3QgaW5zZXJ0XG4gICAgICAgICAgICAvLyBpZiAodHlwZW9mIHZhbHVlID09IFwiZnVuY3Rpb25cIikgZm9yIGV4YW1wbGVcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1ZhbHVlIHR5cGUgJyArIHQgKyAnIGlzIGludmFsaWQuIEl0IG11c3QgYmUgbnVsbCwgdW5kZWZpbmVkLCB4bWwsIHN0cmluZywgbnVtYmVyLCBib29sZWFuIG9yIG9iamVjdCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExvb2tzIHVwIGEga2V5IGluIGNhY2hlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5IC0gS2V5IHRvIGxvb2sgdXAuXG4gICAgICogQHBhcmFtIGRlZiAtIERlZmF1bHQgdmFsdWUgdG8gcmV0dXJuLCBpZiBrZXkgZGlkbid0IGV4aXN0LlxuICAgICAqIEByZXR1cm5zIHRoZSBrZXkgdmFsdWUsIGRlZmF1bHQgdmFsdWUgb3IgPG51bGw+XG4gICAgICovXG4gICAgZ2V0KGtleTogc3RyaW5nLCBkZWY/KSB7XG4gICAgICAgIGtleSA9IHRoaXMuc3RvcmFnZUtleSArIGtleTtcbiAgICAgICAgdGhpcy5jaGVja0tleShrZXkpO1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShpdGVtKTtcblxuICAgICAgICAgICAgLy8gdmFyIHZhbHVlID0gZmlkai5Kc29uLnN0cmluZzJPYmplY3QoaXRlbSk7XG4gICAgICAgICAgICAvLyBpZiAoJ3htbCcgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmlkai5YbWwuc3RyaW5nMlhtbCh2YWx1ZS54bWwpO1xuICAgICAgICAgICAgLy8gfSBlbHNlXG4gICAgICAgICAgICBpZiAoJ3N0cmluZycgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3RyaW5nO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgnbnVtYmVyJyBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5udW1iZXIudmFsdWVPZigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgnYm9vbCcgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuYm9vbC52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5qc29uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhZGVmID8gbnVsbCA6IGRlZjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBhIGtleSBmcm9tIGNhY2hlLlxuICAgICAqXG4gICAgICogQHBhcmFtICBrZXkgLSBLZXkgdG8gZGVsZXRlLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYga2V5IGV4aXN0ZWQgb3IgZmFsc2UgaWYgaXQgZGlkbid0XG4gICAgICovXG4gICAgcmVtb3ZlKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGtleSA9IHRoaXMuc3RvcmFnZUtleSArIGtleTtcbiAgICAgICAgdGhpcy5jaGVja0tleShrZXkpO1xuICAgICAgICBjb25zdCBleGlzdGVkID0gKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkgIT09IG51bGwpO1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICByZXR1cm4gZXhpc3RlZDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBldmVyeXRoaW5nIGluIGNhY2hlLlxuICAgICAqXG4gICAgICogQHJldHVybiB0cnVlXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0ZWQgPSAodGhpcy5zdG9yYWdlLmxlbmd0aCA+IDApO1xuICAgICAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIHNwYWNlIGluIGJ5dGVzIGRvZXMgdGhlIHN0b3JhZ2UgdGFrZT9cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIE51bWJlclxuICAgICAqL1xuICAgIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2UubGVuZ3RoO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGZ1bmN0aW9uIGYgb24gdGhlIHNwZWNpZmllZCBjb250ZXh0IGZvciBlYWNoIGVsZW1lbnQgb2YgdGhlIHN0b3JhZ2VcbiAgICAgKiBmcm9tIGluZGV4IDAgdG8gaW5kZXggbGVuZ3RoLTEuXG4gICAgICogV0FSTklORyA6IFlvdSBzaG91bGQgbm90IG1vZGlmeSB0aGUgc3RvcmFnZSBkdXJpbmcgdGhlIGxvb3AgISEhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZiAtIEZ1bmN0aW9uIHRvIGNhbGwgb24gZXZlcnkgaXRlbS5cbiAgICAgKiBAcGFyYW0gIGNvbnRleHQgLSBDb250ZXh0ICh0aGlzIGZvciBleGFtcGxlKS5cbiAgICAgKiBAcmV0dXJucyBOdW1iZXIgb2YgaXRlbXMgaW4gc3RvcmFnZVxuICAgICAqL1xuICAgIGZvcmVhY2goZiwgY29udGV4dCkge1xuICAgICAgICBjb25zdCBuID0gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuc3RvcmFnZS5rZXkoaSk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIGYgaXMgYW4gaW5zdGFuY2UgbWV0aG9kIG9uIGluc3RhbmNlIGNvbnRleHRcbiAgICAgICAgICAgICAgICBmLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmIGlzIGEgZnVuY3Rpb24gb3IgY2xhc3MgbWV0aG9kXG4gICAgICAgICAgICAgICAgZih2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfTtcblxuICAgIC8vIFByaXZhdGUgQVBJXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9ucyBhbmQgdmFyaWFibGVzIGhpZGRlbiB3aXRoaW4gdGhpcyBmdW5jdGlvbiBzY29wZVxuXG4gICAgcHJpdmF0ZSBjaGVja0tleShrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignS2V5IHR5cGUgbXVzdCBiZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0Jhc2U2NH0gZnJvbSAnLi9iYXNlNjQnO1xuXG5leHBvcnQgY2xhc3MgWG9yIHtcblxuICAgIHN0YXRpYyBoZWFkZXIgPSAnYXJ0ZW1pcy1sb3RzdW0nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuXG4gICAgcHVibGljIHN0YXRpYyBlbmNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICAgICAgdmFsdWUgPSBYb3IuaGVhZGVyICsgdmFsdWU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKHZhbHVlW2ldLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTApIGFzIGFueSkgXiBYb3Iua2V5Q2hhckF0KGtleSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IEJhc2U2NC5lbmNvZGUocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgcHVibGljIHN0YXRpYyBkZWNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nLCBvbGRTdHlsZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIHZhbHVlID0gQmFzZTY0LmRlY29kZSh2YWx1ZSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCh2YWx1ZVtpXS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDEwKSBhcyBhbnkpIF4gWG9yLmtleUNoYXJBdChrZXksIGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2xkU3R5bGUgJiYgWG9yLmhlYWRlciAhPT0gcmVzdWx0LnN1YnN0cmluZygwLCBYb3IuaGVhZGVyLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvbGRTdHlsZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZyhYb3IuaGVhZGVyLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGtleUNoYXJBdChrZXksIGkpIHtcbiAgICAgICAgcmV0dXJuIGtleVtNYXRoLmZsb29yKGkgJSBrZXkubGVuZ3RoKV0uY2hhckNvZGVBdCgwKS50b1N0cmluZygxMCk7XG4gICAgfVxuXG5cbn1cbiIsIi8vIGJ1bXBlZCB2ZXJzaW9uIHZpYSBndWxwXG5leHBvcnQgY29uc3QgdmVyc2lvbiA9ICcyLjEuMTInO1xuIiwiZXhwb3J0IGNsYXNzIFhIUlByb21pc2Uge1xuXG4gICAgcHVibGljIERFRkFVTFRfQ09OVEVOVF9UWVBFID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XG4gICAgcHJpdmF0ZSBfeGhyO1xuICAgIHByaXZhdGUgX3VubG9hZEhhbmRsZXI6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2Uuc2VuZChvcHRpb25zKSAtPiBQcm9taXNlXG4gICAgICogLSBvcHRpb25zIChPYmplY3QpOiBVUkwsIG1ldGhvZCwgZGF0YSwgZXRjLlxuICAgICAqXG4gICAgICogQ3JlYXRlIHRoZSBYSFIgb2JqZWN0IGFuZCB3aXJlIHVwIGV2ZW50IGhhbmRsZXJzIHRvIHVzZSBhIHByb21pc2UuXG4gICAgICovXG4gICAgc2VuZChvcHRpb25zKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGRlZmF1bHRzO1xuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCAoX3RoaXM6IFhIUlByb21pc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBlLCBoZWFkZXIsIHJlZiwgdmFsdWUsIHhocjtcbiAgICAgICAgICAgICAgICBpZiAoIVhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9oYW5kbGVFcnJvcignYnJvd3NlcicsIHJlamVjdCwgbnVsbCwgJ2Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMudXJsICE9PSAnc3RyaW5nJyB8fCBvcHRpb25zLnVybC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCd1cmwnLCByZWplY3QsIG51bGwsICdVUkwgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5feGhyID0geGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSAgKCkgID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2RldGFjaFdpbmRvd1VubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUZXh0ID0gX3RoaXMuX2dldFJlc3BvbnNlVGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9oYW5kbGVFcnJvcigncGFyc2UnLCByZWplY3QsIG51bGwsICdpbnZhbGlkIEpTT04gcmVzcG9uc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IF90aGlzLl9nZXRSZXNwb25zZVVybCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IF90aGlzLl9nZXRIZWFkZXJzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHI6IHhoclxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9udGltZW91dCA9ICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3RpbWVvdXQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9uYWJvcnQgPSAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdhYm9ydCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBfdGhpcy5fYXR0YWNoV2luZG93VW5sb2FkKCk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCBvcHRpb25zLmFzeW5jLCBvcHRpb25zLnVzZXJuYW1lLCBvcHRpb25zLnBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy53aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgob3B0aW9ucy5kYXRhICE9IG51bGwpICYmICFvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBfdGhpcy5ERUZBVUxUX0NPTlRFTlRfVFlQRTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVmID0gb3B0aW9ucy5oZWFkZXJzO1xuICAgICAgICAgICAgICAgIGZvciAoaGVhZGVyIGluIHJlZikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVmLmhhc093blByb3BlcnR5KGhlYWRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVmW2hlYWRlcl07XG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geGhyLnNlbmQob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IF9lcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignc2VuZCcsIHJlamVjdCwgbnVsbCwgZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLmdldFhIUigpIC0+IFhNTEh0dHBSZXF1ZXN0XG4gICAgICovXG4gICAgZ2V0WEhSKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fYXR0YWNoV2luZG93VW5sb2FkKClcbiAgICAgKlxuICAgICAqIEZpeCBmb3IgSUUgOSBhbmQgSUUgMTBcbiAgICAgKiBJbnRlcm5ldCBFeHBsb3JlciBmcmVlemVzIHdoZW4geW91IGNsb3NlIGEgd2VicGFnZSBkdXJpbmcgYW4gWEhSIHJlcXVlc3RcbiAgICAgKiBodHRwczovL3N1cHBvcnQubWljcm9zb2Z0LmNvbS9rYi8yODU2NzQ2XG4gICAgICpcbiAgICAgKi9cbiAgICBwcml2YXRlIF9hdHRhY2hXaW5kb3dVbmxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VubG9hZEhhbmRsZXIgPSB0aGlzLl9oYW5kbGVXaW5kb3dVbmxvYWQuYmluZCh0aGlzKTtcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5hdHRhY2hFdmVudCgnb251bmxvYWQnLCB0aGlzLl91bmxvYWRIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZGV0YWNoV2luZG93VW5sb2FkKClcbiAgICAgKi9cbiAgICBwcml2YXRlIF9kZXRhY2hXaW5kb3dVbmxvYWQoKSB7XG4gICAgICAgIGlmICgod2luZG93IGFzIGFueSkuZGV0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkuZGV0YWNoRXZlbnQoJ29udW5sb2FkJywgdGhpcy5fdW5sb2FkSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2dldEhlYWRlcnMoKSAtPiBPYmplY3RcbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXRIZWFkZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VIZWFkZXJzKHRoaXMuX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9nZXRSZXNwb25zZVRleHQoKSAtPiBNaXhlZFxuICAgICAqXG4gICAgICogUGFyc2VzIHJlc3BvbnNlIHRleHQgSlNPTiBpZiBwcmVzZW50LlxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldFJlc3BvbnNlVGV4dCgpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlVGV4dDtcbiAgICAgICAgcmVzcG9uc2VUZXh0ID0gdHlwZW9mIHRoaXMuX3hoci5yZXNwb25zZVRleHQgPT09ICdzdHJpbmcnID8gdGhpcy5feGhyLnJlc3BvbnNlVGV4dCA6ICcnO1xuICAgICAgICBzd2l0Y2ggKCh0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpIHx8ICcnKS5zcGxpdCgnOycpWzBdKSB7XG4gICAgICAgICAgICBjYXNlICdhcHBsaWNhdGlvbi9qc29uJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQvamF2YXNjcmlwdCc6XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VUZXh0ID0gSlNPTi5wYXJzZShyZXNwb25zZVRleHQgKyAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlVGV4dDtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2dldFJlc3BvbnNlVXJsKCkgLT4gU3RyaW5nXG4gICAgICpcbiAgICAgKiBBY3R1YWwgcmVzcG9uc2UgVVJMIGFmdGVyIGZvbGxvd2luZyByZWRpcmVjdHMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0UmVzcG9uc2VVcmwoKSB7XG4gICAgICAgIGlmICh0aGlzLl94aHIucmVzcG9uc2VVUkwgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5yZXNwb25zZVVSTDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoL15YLVJlcXVlc3QtVVJMOi9tLnRlc3QodGhpcy5feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcignWC1SZXF1ZXN0LVVSTCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2hhbmRsZUVycm9yKHJlYXNvbiwgcmVqZWN0LCBzdGF0dXMsIHN0YXR1c1RleHQpXG4gICAgICogLSByZWFzb24gKFN0cmluZylcbiAgICAgKiAtIHJlamVjdCAoRnVuY3Rpb24pXG4gICAgICogLSBzdGF0dXMgKFN0cmluZylcbiAgICAgKiAtIHN0YXR1c1RleHQgKFN0cmluZylcbiAgICAgKi9cbiAgICBwcml2YXRlIF9oYW5kbGVFcnJvcihyZWFzb24sIHJlamVjdCwgc3RhdHVzPywgc3RhdHVzVGV4dD8pIHtcbiAgICAgICAgdGhpcy5fZGV0YWNoV2luZG93VW5sb2FkKCk7XG5cbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCdicm93c2VyJywgcmVqZWN0LCBudWxsLCAnYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3VybCcsIHJlamVjdCwgbnVsbCwgJ1VSTCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xuICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3BhcnNlJywgcmVqZWN0LCBudWxsLCAnaW52YWxpZCBKU09OIHJlc3BvbnNlJyk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcigndGltZW91dCcsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Fib3J0JywgcmVqZWN0KTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignc2VuZCcsIHJlamVjdCwgbnVsbCwgZS50b1N0cmluZygpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ19oYW5kbGVFcnJvcjonLCByZWFzb24sIHRoaXMuX3hoci5zdGF0dXMpO1xuICAgICAgICBsZXQgY29kZSA9IDQwNDtcbiAgICAgICAgaWYgKHJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICBjb2RlID0gNDA4O1xuICAgICAgICB9IGVsc2UgaWYgKHJlYXNvbiA9PT0gJ2Fib3J0Jykge1xuICAgICAgICAgICAgY29kZSA9IDQwODtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWplY3Qoe1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb24sXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyB8fCB0aGlzLl94aHIuc3RhdHVzIHx8IGNvZGUsXG4gICAgICAgICAgICBjb2RlOiBzdGF0dXMgfHwgdGhpcy5feGhyLnN0YXR1cyB8fCBjb2RlLFxuICAgICAgICAgICAgc3RhdHVzVGV4dDogc3RhdHVzVGV4dCB8fCB0aGlzLl94aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgIHhocjogdGhpcy5feGhyXG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5faGFuZGxlV2luZG93VW5sb2FkKClcbiAgICAgKi9cbiAgICBwcml2YXRlIF9oYW5kbGVXaW5kb3dVbmxvYWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94aHIuYWJvcnQoKTtcbiAgICB9O1xuXG5cbiAgICBwcml2YXRlIHRyaW0oc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNBcnJheShhcmcpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoKGxpc3QsIGl0ZXJhdG9yKSB7XG4gICAgICAgIGlmICh0b1N0cmluZy5jYWxsKGxpc3QpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICB0aGlzLmZvckVhY2hBcnJheShsaXN0LCBpdGVyYXRvciwgdGhpcylcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaFN0cmluZyhsaXN0LCBpdGVyYXRvciwgdGhpcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaE9iamVjdChsaXN0LCBpdGVyYXRvciwgdGhpcylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJheS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoU3RyaW5nKHN0cmluZywgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0cmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgLy8gbm8gc3VjaCB0aGluZyBhcyBhIHNwYXJzZSBzdHJpbmcuXG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHN0cmluZy5jaGFyQXQoaSksIGksIHN0cmluZylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZm9yRWFjaE9iamVjdChvYmplY3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iamVjdFtrXSwgaywgb2JqZWN0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKCFoZWFkZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgICAgICB0aGlzLmZvckVhY2goXG4gICAgICAgICAgICB0aGlzLnRyaW0oaGVhZGVycykuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgICAsIChyb3cpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHJvdy5pbmRleE9mKCc6JylcbiAgICAgICAgICAgICAgICAgICAgLCBrZXkgPSB0aGlzLnRyaW0ocm93LnNsaWNlKDAsIGluZGV4KSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAsIHZhbHVlID0gdGhpcy50cmltKHJvdy5zbGljZShpbmRleCArIDEpKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YocmVzdWx0W2tleV0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQXJyYXkocmVzdWx0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godmFsdWUpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBbcmVzdWx0W2tleV0sIHZhbHVlXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuXG59XG4iLCJpbXBvcnQge1hIUlByb21pc2V9IGZyb20gJy4veGhycHJvbWlzZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgWGhyT3B0aW9uc0ludGVyZmFjZSB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSxcbiAgICBoZWFkZXJzPzogYW55LFxuICAgIGFzeW5jPzogYm9vbGVhbixcbiAgICB1c2VybmFtZT86IHN0cmluZyxcbiAgICBwYXNzd29yZD86IHN0cmluZyxcbiAgICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuXG59XG5cbmV4cG9ydCBjbGFzcyBBamF4IHtcblxuICAgIC8vIHByaXZhdGUgc3RhdGljIHhocjogWEhSUHJvbWlzZSA9IG5ldyBYSFJQcm9taXNlKCk7XG4gICAgcHJpdmF0ZSB4aHI6IFhIUlByb21pc2U7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy54aHIgPSBuZXcgWEhSUHJvbWlzZSgpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgcG9zdChhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybCxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyZ3MuZGF0YSlcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgb3B0LmhlYWRlcnMgPSBhcmdzLmhlYWRlcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucmVhc29uID0gJ3N0YXR1cyc7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jb2RlID0gcGFyc2VJbnQocmVzLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcignYnJvd3NlcicsIHJlamVjdCwgbnVsbCwgJ2Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3VybCcsIHJlamVjdCwgbnVsbCwgJ1VSTCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigncGFyc2UnLCByZWplY3QsIG51bGwsICdpbnZhbGlkIEpTT04gcmVzcG9uc2UnKTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcigndGltZW91dCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignYWJvcnQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3NlbmQnLCByZWplY3QsIG51bGwsIGUudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiAoZXJyLnJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA4O1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXQoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdDogYW55ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmwsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhcmdzLmRhdGEpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLnNlbmQob3B0KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWFzb24gPSAnc3RhdHVzJztcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNvZGUgPSBwYXJzZUludChyZXMuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmIChlcnIucmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlbGV0ZShhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybCxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyZ3MuZGF0YSlcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgb3B0LmhlYWRlcnMgPSBhcmdzLmhlYWRlcnM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMueGhyXG4gICAgICAgICAgICAuc2VuZChvcHQpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPCAyMDAgfHwgcGFyc2VJbnQocmVzLnN0YXR1cywgMTApID49IDMwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlYXNvbiA9ICdzdGF0dXMnO1xuICAgICAgICAgICAgICAgICAgICByZXMuY29kZSA9IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKGVyci5yZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwODtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0KGFyZ3M6IFhock9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmRhdGEpIHtcbiAgICAgICAgICAgIG9wdC5kYXRhID0gYXJncy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLnNlbmQob3B0KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWFzb24gPSAnc3RhdHVzJztcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNvZGUgPSBwYXJzZUludChyZXMuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmIChlcnIucmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtBamF4fSBmcm9tICcuL2FqYXgnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2V9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7U2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcblxuICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50VXVpZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50SW5mbzogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50ID0gMDtcbiAgICBwcml2YXRlIHN0YXRpYyBfY2xpZW50VXVpZCA9ICd2Mi5jbGllbnRVdWlkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfY2xpZW50SWQgPSAndjIuY2xpZW50SWQnO1xuICAgIHByaXZhdGUgc3RhdGljIF9yZWZyZXNoQ291bnQgPSAndjIucmVmcmVzaENvdW50JztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwSWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIFVSSTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc3RvcmFnZTogTG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc2RrOiBTZGtJbnRlcmZhY2UpIHtcblxuICAgICAgICBsZXQgdXVpZDogc3RyaW5nID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudFV1aWQpIHx8ICd1dWlkLScgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBsZXQgaW5mbyA9ICdfY2xpZW50SW5mbyc7IC8vIHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRJbmZvKTtcbiAgICAgICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cubmF2aWdhdG9yKSB7XG4gICAgICAgICAgICBpbmZvID0gd2luZG93Lm5hdmlnYXRvci5hcHBOYW1lICsgJ0AnICsgd2luZG93Lm5hdmlnYXRvci5hcHBWZXJzaW9uICsgJy0nICsgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdpbmRvdyAmJiB3aW5kb3dbJ2RldmljZSddICYmIHdpbmRvd1snZGV2aWNlJ10udXVpZCkge1xuICAgICAgICAgICAgdXVpZCA9IHdpbmRvd1snZGV2aWNlJ10udXVpZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENsaWVudFV1aWQodXVpZCk7XG4gICAgICAgIHRoaXMuc2V0Q2xpZW50SW5mbyhpbmZvKTtcbiAgICAgICAgdGhpcy5jbGllbnRJZCA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRJZCk7XG4gICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fcmVmcmVzaENvdW50KSB8fCAwO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50SWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudElkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudElkLCB0aGlzLmNsaWVudElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50VXVpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50VXVpZCA9ICcnICsgdmFsdWU7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9jbGllbnRVdWlkLCB0aGlzLmNsaWVudFV1aWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRJbmZvKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRJbmZvID0gJycgKyB2YWx1ZTtcbiAgICAgICAgLy8gdGhpcy5zdG9yYWdlLnNldCgnY2xpZW50SW5mbycsIHRoaXMuY2xpZW50SW5mbyk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmxMb2dpbiA9IHRoaXMuVVJJICsgJy91c2Vycyc7XG4gICAgICAgIGNvbnN0IGRhdGFMb2dpbiA9IHtcbiAgICAgICAgICAgIG5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgdXNlcm5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgZW1haWw6IGxvZ2luLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybExvZ2luLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFMb2dpbixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihjcmVhdGVkVXNlciA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldENsaWVudElkKGNyZWF0ZWRVc2VyLl9pZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsVG9rZW4gPSB0aGlzLlVSSSArICcvb2F1dGgvdG9rZW4nO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFUb2tlbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ2NsaWVudF9jcmVkZW50aWFscycsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X3NlY3JldDogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICAgICAgICAgIGF1ZGllbmNlOiB0aGlzLmFwcElkLFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlQXV0aGVudGljYXRlKHJlZnJlc2hUb2tlbjogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL29hdXRoL3Rva2VuJztcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIGdyYW50X3R5cGU6ICdyZWZyZXNoX3Rva2VuJyxcbiAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspLFxuICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgcmVmcmVzaF9leHRyYTogQ2xpZW50LnJlZnJlc2hDb3VudCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKG9iajogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9yZWZyZXNoQ291bnQsIENsaWVudC5yZWZyZXNoQ291bnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUob2JqKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2dvdXQocmVmcmVzaFRva2VuPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlbGV0ZSB0aGlzLmNsaWVudFV1aWQ7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGlzLmNsaWVudElkO1xuICAgICAgICAvLyB0aGlzLnN0b3JhZ2UucmVtb3ZlKENsaWVudC5fY2xpZW50VXVpZCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRJZCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9yZWZyZXNoQ291bnQpO1xuICAgICAgICBDbGllbnQucmVmcmVzaENvdW50ID0gMDtcblxuICAgICAgICBpZiAoIXJlZnJlc2hUb2tlbiB8fCAhdGhpcy5jbGllbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL29hdXRoL3Jldm9rZSc7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5VUkk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtFcnJvckludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIEVycm9yIGltcGxlbWVudHMgRXJyb3JJbnRlcmZhY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvZGU6IG51bWJlciwgcHVibGljIHJlYXNvbjogc3RyaW5nKSB7XG4gICAgfTtcblxuICAgIGVxdWFscyhlcnI6IEVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGUgPT09IGVyci5jb2RlICYmIHRoaXMucmVhc29uID09PSBlcnIucmVhc29uO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1zZzogc3RyaW5nID0gKHR5cGVvZiB0aGlzLnJlYXNvbiA9PT0gJ3N0cmluZycpID8gdGhpcy5yZWFzb24gOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlYXNvbik7XG4gICAgICAgIHJldHVybiAnJyArIHRoaXMuY29kZSArICcgLSAnICsgbXNnO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtDbGllbnR9IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7TW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSwgU2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZSwgRW5kcG9pbnRJbnRlcmZhY2V9IGZyb20gJy4uL3Nkay9pbnRlcmZhY2VzJztcbmltcG9ydCB7QmFzZTY0LCBMb2NhbFN0b3JhZ2UsIFhvcn0gZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuL2FqYXgnO1xuaW1wb3J0IHtDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIHtcblxuICAgIHB1YmxpYyBmaWRqSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgZmlkalZlcnNpb246IHN0cmluZztcbiAgICBwdWJsaWMgZmlkakNyeXB0bzogYm9vbGVhbjtcbiAgICBwdWJsaWMgYWNjZXNzVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgYWNjZXNzVG9rZW5QcmV2aW91czogc3RyaW5nO1xuICAgIHB1YmxpYyBpZFRva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIHJlZnJlc2hUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyBzdGF0ZXM6IHsgW3M6IHN0cmluZ106IHsgc3RhdGU6IGJvb2xlYW4sIHRpbWU6IG51bWJlciwgbGFzdFRpbWVXYXNPazogbnVtYmVyIH07IH07IC8vIE1hcDxzdHJpbmcsIGJvb2xlYW4+O1xuICAgIHB1YmxpYyBhcGlzOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT47XG5cbiAgICBwcml2YXRlIGNyeXB0b1NhbHQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNyeXB0b1NhbHROZXh0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjbGllbnQ6IENsaWVudDtcbiAgICBwcml2YXRlIHVzZXI6IGFueTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9hY2Nlc3NUb2tlbiA9ICd2Mi5hY2Nlc3NUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2FjY2Vzc1Rva2VuUHJldmlvdXMgPSAndjIuYWNjZXNzVG9rZW5QcmV2aW91cyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2lkVG9rZW4gPSAndjIuaWRUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3JlZnJlc2hUb2tlbiA9ICd2Mi5yZWZyZXNoVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9zdGF0ZXMgPSAndjIuc3RhdGVzJztcbiAgICBwcml2YXRlIHN0YXRpYyBfY3J5cHRvU2FsdCA9ICd2Mi5jcnlwdG9TYWx0JztcbiAgICBwcml2YXRlIHN0YXRpYyBfY3J5cHRvU2FsdE5leHQgPSAndjIuY3J5cHRvU2FsdC5uZXh0JztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3NkazogU2RrSW50ZXJmYWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX3N0b3JhZ2U6IExvY2FsU3RvcmFnZSkge1xuICAgICAgICB0aGlzLmNsaWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdCA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHQpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCkgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLl9zdG9yYWdlLmdldCgndjIuYWNjZXNzVG9rZW5QcmV2aW91cycpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2lkVG9rZW4pIHx8IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX3N0YXRlcykgfHwge307XG4gICAgICAgIHRoaXMuYXBpcyA9IFtdO1xuICAgIH07XG5cbiAgICBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5pc1JlYWR5KCk7XG4gICAgfVxuXG4gICAgZGVzdHJveShmb3JjZT86IGJvb2xlYW4pOiB2b2lkIHtcblxuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9zdGF0ZXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW5QcmV2aW91cywgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlblByZXZpb3VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgLy8gdGhpcy5jbGllbnQuc2V0Q2xpZW50SWQobnVsbCk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHt9OyAvLyBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcbiAgICB9XG5cbiAgICBzZXRDbGllbnQoY2xpZW50OiBDbGllbnQpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICAgICAgaWYgKCF0aGlzLnVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5fdXNlci5faWQgPSB0aGlzLl9jbGllbnQuY2xpZW50SWQ7XG4gICAgICAgIHRoaXMudXNlci5fbmFtZSA9IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe25hbWU6ICcnfSkpLm5hbWU7XG4gICAgfVxuXG4gICAgc2V0VXNlcih1c2VyOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgaWYgKHRoaXMudXNlci5faWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnNldENsaWVudElkKHRoaXMudXNlci5faWQpO1xuXG4gICAgICAgICAgICAvLyBzdG9yZSBvbmx5IGNsaWVudElkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy51c2VyLl9pZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFVzZXIoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcjtcbiAgICB9XG5cbiAgICBnZXRDbGllbnQoKTogQ2xpZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50O1xuICAgIH1cblxuICAgIHNldENyeXB0b1NhbHQodmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5jcnlwdG9TYWx0ICE9PSB2YWx1ZSAmJiB0aGlzLmNyeXB0b1NhbHROZXh0ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQsIHRoaXMuY3J5cHRvU2FsdE5leHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCkge1xuICAgICAgICBpZiAodGhpcy5jcnlwdG9TYWx0TmV4dCkge1xuICAgICAgICAgICAgdGhpcy5jcnlwdG9TYWx0ID0gdGhpcy5jcnlwdG9TYWx0TmV4dDtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHQsIHRoaXMuY3J5cHRvU2FsdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0KTtcbiAgICB9XG5cbiAgICBlbmNyeXB0KGRhdGE6IGFueSk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0YUFzT2JqID0ge3N0cmluZzogZGF0YX07XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YUFzT2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICByZXR1cm4gWG9yLmVuY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjcnlwdChkYXRhOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBsZXQgZGVjcnlwdGVkID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHROZXh0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIChkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVjcnlwdGVkICYmIGRlY3J5cHRlZC5zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBkZWNyeXB0ZWQuc3RyaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWNyeXB0ZWQ7XG4gICAgfVxuXG4gICAgaXNMb2dpbigpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGV4cCA9IHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZWZyZXNoVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBKU09OLnBhcnNlKEJhc2U2NC5kZWNvZGUocGF5bG9hZCkpO1xuICAgICAgICAgICAgZXhwID0gKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApID49IGRlY29kZWQuZXhwKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFleHA7XG4gICAgfVxuXG4gICAgLy8gdG9kbyByZWludGVncmF0ZSBjbGllbnQubG9naW4oKVxuXG4gICAgbG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudCgpLmxvZ291dCh0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50SWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmNsaWVudElkO1xuICAgIH1cblxuICAgIGdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRUb2tlbjtcbiAgICB9XG5cbiAgICBnZXRJZFBheWxvYWQoZGVmPzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGRlZiAmJiB0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5nZXRJZFRva2VuKCkuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmID8gZGVmIDogbnVsbDtcbiAgICB9XG5cbiAgICBnZXRBY2Nlc3NQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmID8gZGVmIDogbnVsbDtcbiAgICB9XG5cbiAgICBnZXRQcmV2aW91c0FjY2Vzc1BheWxvYWQoZGVmPzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGRlZiAmJiB0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgcmVmcmVzaENvbm5lY3Rpb24oKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIC8vIHN0b3JlIHN0YXRlc1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9zdGF0ZXMsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICAvLyB0b2tlbiBub3QgZXhwaXJlZCA6IG9rXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbmV3IERhdGUoKS5nZXRUaW1lKCkgPCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCA6JywgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCksIEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwKTtcbiAgICAgICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA8IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmdldFVzZXIoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCByZWZyZXNoVG9rZW5cbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaFRva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZWZyZXNoVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgaWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApID49IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBleHBpcmVkIGFjY2Vzc1Rva2VuICYgaWRUb2tlbiAmIHN0b3JlIGl0IGFzIFByZXZpb3VzIG9uZVxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLmFjY2Vzc1Rva2VuO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldCgndjIuYWNjZXNzVG9rZW5QcmV2aW91cycsIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5faWRUb2tlbik7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSBudWxsO1xuXG4gICAgICAgIC8vIHJlZnJlc2ggYXV0aGVudGljYXRpb25cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50KCkucmVBdXRoZW50aWNhdGUodGhpcy5yZWZyZXNoVG9rZW4pXG4gICAgICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29ubmVjdGlvbih1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MDgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDg7IC8vIG5vIGFwaSB1cmkgb3IgYmFzaWMgdGltZW91dCA6IG9mZmxpbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09IDQwNCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwNDsgLy8gcGFnZSBub3QgZm91bmQgOiBvZmZsaW5lXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MTApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDM7IC8vIHRva2VuIGV4cGlyZWQgb3IgZGV2aWNlIG5vdCBzdXJlIDogbmVlZCByZWxvZ2luXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDAzOyAvLyBmb3JiaWRkZW4gOiBuZWVkIHJlbG9naW5cbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc29sdmUoY29kZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2V0Q29ubmVjdGlvbihjbGllbnRVc2VyOiBhbnkpOiB2b2lkIHtcblxuICAgICAgICAvLyBvbmx5IGluIHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBpZiAoY2xpZW50VXNlci5hY2Nlc3NfdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBjbGllbnRVc2VyLmFjY2Vzc190b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuLCB0aGlzLmFjY2Vzc1Rva2VuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjbGllbnRVc2VyLmFjY2Vzc190b2tlbjtcblxuICAgICAgICAgICAgY29uc3Qgc2FsdDogc3RyaW5nID0gSlNPTi5wYXJzZSh0aGlzLmdldEFjY2Vzc1BheWxvYWQoe3NhbHQ6ICcnfSkpLnNhbHQ7XG4gICAgICAgICAgICBpZiAoc2FsdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3J5cHRvU2FsdChzYWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VXNlci5pZF90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gY2xpZW50VXNlci5pZF90b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgICAgICBkZWxldGUgY2xpZW50VXNlci5pZF90b2tlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VXNlci5yZWZyZXNoX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IGNsaWVudFVzZXIucmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbiwgdGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGNsaWVudFVzZXIucmVmcmVzaF90b2tlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3JlIGNoYW5nZWQgc3RhdGVzXG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3N0YXRlcywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIC8vIGV4cG9zZSByb2xlcywgbWVzc2FnZVxuICAgICAgICAvLyBjbGllbnRVc2VyLnJvbGVzID0gc2VsZi5maWRqUm9sZXMoKTtcbiAgICAgICAgLy8gY2xpZW50VXNlci5tZXNzYWdlID0gc2VsZi5maWRqTWVzc2FnZSgpO1xuICAgICAgICBjbGllbnRVc2VyLnJvbGVzID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgICAgICBjbGllbnRVc2VyLm1lc3NhZ2UgPSBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlO1xuICAgICAgICB0aGlzLnNldFVzZXIoY2xpZW50VXNlcik7XG4gICAgfTtcblxuICAgIHNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnM6IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiB2b2lkIHtcblxuICAgICAgICBpZiAob3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaWRUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gb3B0aW9ucy5pZFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5faWRUb2tlbiwgdGhpcy5pZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5yZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gb3B0aW9ucy5yZWZyZXNoVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VXNlcih7XG4gICAgICAgICAgICByb2xlczogSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzLFxuICAgICAgICAgICAgbWVzc2FnZTogSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZSxcbiAgICAgICAgICAgIF9pZDogJ2RlbW8nXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEFwaUVuZHBvaW50cyhvcHRpb25zPzogQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcblxuICAgICAgICAvLyB0b2RvIDogbGV0IGVhID0gWydodHRwczovL2ZpZGovYXBpJywgJ2h0dHBzOi8vZmlkai1wcm94eS5oZXJva3VhcHAuY29tL2FwaSddO1xuICAgICAgICBsZXQgZWE6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBbXG4gICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cHM6Ly9maWRqLm92aC9hcGknLCBibG9ja2VkOiBmYWxzZX1dO1xuICAgICAgICBsZXQgZmlsdGVyZWRFYSA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5fc2RrLnByb2QpIHtcbiAgICAgICAgICAgIGVhID0gW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjU4OTQvYXBpJywgYmxvY2tlZDogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwczovL2ZpZGotc2FuZGJveC5oZXJva3VhcHAuY29tL2FwaScsIGJsb2NrZWQ6IGZhbHNlfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmdldEFjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSk7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHZhbCkuYXBpcztcbiAgICAgICAgICAgIGlmIChhcGlFbmRwb2ludHMgJiYgYXBpRW5kcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVhID0gW107XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKSB7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHRoaXMuZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKHthcGlzOiBbXX0pKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwgJiYgZWEuZmlsdGVyKChyKSA9PiByLnVybCA9PT0gZW5kcG9pbnQudXJsKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bGRDaGVja1N0YXRlcyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZWFbaV0udXJsXSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIpIHtcblxuICAgICAgICAgICAgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgKGZpbHRlcmVkRWEubGVuZ3RoID09PSAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9sZE9uZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmVzdE9sZE9uZTogRW5kcG9pbnRJbnRlcmZhY2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICghYmVzdE9sZE9uZSB8fCB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgPiB0aGlzLnN0YXRlc1tiZXN0T2xkT25lLnVybF0ubGFzdFRpbWVXYXNPaykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdE9sZE9uZSA9IGVuZHBvaW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZXN0T2xkT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChiZXN0T2xkT25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChlYVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZEVhID0gZWE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRFYTtcbiAgICB9O1xuXG4gICAgZ2V0REJzKG9wdGlvbnM/OiBDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2UpOiBFbmRwb2ludEludGVyZmFjZVtdIHtcblxuICAgICAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG8gdGVzdCByYW5kb20gREIgY29ubmVjdGlvblxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICUgMjtcbiAgICAgICAgbGV0IGRicyA9IEpTT04ucGFyc2UodGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtkYnM6IFtdfSkpLmRicyB8fCBbXTtcblxuICAgICAgICAvLyBuZWVkIHRvIHN5bmNocm9uaXplIGRiXG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICAgIGRicyA9IGRicy5zb3J0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuZG9tID09PSAxKSB7XG4gICAgICAgICAgICBkYnMgPSBkYnMucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpbHRlcmVkREJzID0gW107XG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZGJzW2ldLnVybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCkgJiYgKGZpbHRlcmVkREJzLmxlbmd0aCA9PT0gMCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmVzJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJyAmJiBkYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGRic1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcyA9IGRicztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERCcztcbiAgICB9O1xuXG4gICAgdmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICAvLyB0b2RvIG5lZWQgdmVyaWZpY2F0aW9uID8gbm90IHlldCAoY2FjaGUpXG4gICAgICAgIC8vIGlmIChPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGVzW09iamVjdC5rZXlzKHRoaXMuc3RhdGVzKVswXV0udGltZTtcbiAgICAgICAgLy8gICAgIGlmIChjdXJyZW50VGltZSA8IHRpbWUpIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyB2ZXJpZnkgdmlhIEdFVCBzdGF0dXMgb24gRW5kcG9pbnRzICYgREJzXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgICAgIC8vIHRoaXMuc3RhdGVzID0ge307XG4gICAgICAgIHRoaXMuYXBpcyA9IHRoaXMuZ2V0QXBpRW5kcG9pbnRzKCk7XG4gICAgICAgIHRoaXMuYXBpcy5mb3JFYWNoKChlbmRwb2ludE9iaikgPT4ge1xuICAgICAgICAgICAgbGV0IGVuZHBvaW50VXJsOiBzdHJpbmcgPSBlbmRwb2ludE9iai51cmw7XG4gICAgICAgICAgICBpZiAoIWVuZHBvaW50VXJsKSB7XG4gICAgICAgICAgICAgICAgZW5kcG9pbnRVcmwgPSBlbmRwb2ludE9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRVcmwgKyAnL3N0YXR1cz9pc29rPScgKyB0aGlzLl9zZGsudmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pc29rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBzdGF0ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFRpbWVXYXNPayA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXS5sYXN0VGltZVdhc09rO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBmYWxzZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGxhc3RUaW1lV2FzT2t9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGJzID0gdGhpcy5nZXREQnMoKTtcbiAgICAgICAgZGJzLmZvckVhY2goKGRiRW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBkYkVuZHBvaW50OiBzdHJpbmcgPSBkYkVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZGJFbmRwb2ludCkge1xuICAgICAgICAgICAgICAgIGRiRW5kcG9pbnQgPSBkYkVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBkYkVuZHBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0gPSB7c3RhdGU6IHRydWUsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBjdXJyZW50VGltZX07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH07XG5cbn1cbiIsIi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGInO1xuLy8gbGV0IFBvdWNoREI6IGFueTtcblxuaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi4vc2RrL2Vycm9yJztcbmltcG9ydCB7RW5kcG9pbnRJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5cbmNvbnN0IEZpZGpQb3VjaCA9IHdpbmRvd1snUG91Y2hEQiddID8gd2luZG93WydQb3VjaERCJ10gOiByZXF1aXJlKCdwb3VjaGRiJykuZGVmYXVsdDsgLy8gLmRlZmF1bHQ7XG5cbi8vIGxvYWQgY29yZG92YSBhZGFwdGVyIDogaHR0cHM6Ly9naXRodWIuY29tL3BvdWNoZGItY29tbXVuaXR5L3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZS9pc3N1ZXMvMjJcbmNvbnN0IFBvdWNoQWRhcHRlckNvcmRvdmFTcWxpdGUgPSByZXF1aXJlKCdwb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUnKTtcbkZpZGpQb3VjaC5wbHVnaW4oUG91Y2hBZGFwdGVyQ29yZG92YVNxbGl0ZSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSB7XG4gICAgb2JqOiBPYmplY3QsXG4gICAgbWV0aG9kOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIFNlc3Npb24ge1xuXG4gICAgcHVibGljIGRiUmVjb3JkQ291bnQ6IG51bWJlcjtcbiAgICBwdWJsaWMgZGJMYXN0U3luYzogbnVtYmVyOyAvLyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgcHJpdmF0ZSBkYjogUG91Y2hEQjsgLy8gUG91Y2hEQlxuICAgIHByaXZhdGUgcmVtb3RlRGI6IFBvdWNoREI7IC8vIFBvdWNoREI7XG4gICAgcHJpdmF0ZSByZW1vdGVVcmk6IHN0cmluZztcbiAgICBwcml2YXRlIGRiczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICB0aGlzLnJlbW90ZURiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kYnMgPSBbXTtcbiAgICB9O1xuXG4gICAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZGI7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgY3JlYXRlKHVpZDogc3RyaW5nLCBmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghZm9yY2UgJiYgdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDsgLy8gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBvcHRzOiBhbnkgPSB7bG9jYXRpb246ICdkZWZhdWx0J307XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3dbJ2NvcmRvdmEnXSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzID0ge2xvY2F0aW9uOiAnZGVmYXVsdCcsIGFkYXB0ZXI6ICdjb3Jkb3ZhLXNxbGl0ZSd9O1xuICAgICAgICAgICAgICAgICAgICAvLyAgICBjb25zdCBwbHVnaW4gPSByZXF1aXJlKCdwb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgaWYgKHBsdWdpbikgeyBQb3VjaC5wbHVnaW4ocGx1Z2luKTsgfVxuICAgICAgICAgICAgICAgICAgICAvLyAgICB0aGlzLmRiID0gbmV3IFBvdWNoKCdmaWRqX2RiJywge2FkYXB0ZXI6ICdjb3Jkb3ZhLXNxbGl0ZSd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRiID0gbmV3IEZpZGpQb3VjaCgnZmlkal9kYl8nICsgdWlkLCBvcHRzKTsgLy8gLCB7YWRhcHRlcjogJ3dlYnNxbCd9ID8/P1xuICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZGIuaW5mbygpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gaWYgKGluZm8uYWRhcHRlciAhPT0gJ3dlYnNxbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHRoaXMuZGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBuZXdvcHRzOiBhbnkgPSBvcHRzIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3b3B0cy5hZGFwdGVyID0gJ2lkYic7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgbmV3ZGIgPSBuZXcgUG91Y2goJ2ZpZGpfZGInLCBvcHRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZGIucmVwbGljYXRlLnRvKG5ld2RiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5kYiA9IG5ld2RiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyLnRvU3RyaW5nKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVycikpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXN0cm95KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRiICYmICF0aGlzLmRiLmRlc3Ryb3kpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBhIHZhbGlkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIuZGVzdHJveSgoZXJyLCBpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBzZXRSZW1vdGUoZGJzOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kYnMgPSBkYnM7XG4gICAgfVxuXG4gICAgcHVibGljIHN5bmModXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5kYnMgfHwgIXRoaXMuZGJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGEgcmVtb3RlIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmVtb3RlRGIgfHwgdGhpcy5yZW1vdGVVcmkgIT09IHRoaXMuZGJzWzBdLnVybCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW90ZVVyaSA9IHRoaXMuZGJzWzBdLnVybDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdGVEYiA9IG5ldyBGaWRqUG91Y2godGhpcy5yZW1vdGVVcmkpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvICwge2hlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGlkX3Rva2VufX0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZGIucmVwbGljYXRlLnRvKHRoaXMucmVtb3RlRGIpXG4gICAgICAgICAgICAgICAgICAgIC5vbignY29tcGxldGUnLCAoaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3RlRGIucmVwbGljYXRlLnRvKHRoaXMuZGIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoISF1c2VySWQgJiYgISFkb2MgJiYgZG9jLmZpZGpVc2VySWQgPT09IHVzZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignY29tcGxldGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9nZ2VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZGVuaWVkJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogZXJyfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAxLCByZWFzb246IGVycn0pKTtcblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub24oJ2RlbmllZCcsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246IGVycn0pKVxuICAgICAgICAgICAgICAgICAgICAub24oJ2Vycm9yJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDEsIHJlYXNvbjogZXJyfSkpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXQoZGF0YTogYW55LFxuICAgICAgICAgICAgICAgX2lkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICB1aWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIG9pZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgYXZlOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhIHx8ICFfaWQgfHwgIXVpZCB8fCAhb2lkIHx8ICFhdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnbmVlZCBmb3JtYXRlZCBkYXRhJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YVdpdGhvdXRJZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgY29uc3QgdG9TdG9yZTogYW55ID0ge1xuICAgICAgICAgICAgX2lkOiBfaWQsXG4gICAgICAgICAgICBmaWRqVXNlcklkOiB1aWQsXG4gICAgICAgICAgICBmaWRqT3JnSWQ6IG9pZCxcbiAgICAgICAgICAgIGZpZGpBcHBWZXJzaW9uOiBhdmVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRhdGFXaXRob3V0SWRzLl9yZXYpIHtcbiAgICAgICAgICAgIHRvU3RvcmUuX3JldiA9ICcnICsgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX2lkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpVc2VySWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqT3JnSWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqQXBwVmVyc2lvbjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpEYXRhO1xuXG4gICAgICAgIGxldCByZXN1bHRBc1N0cmluZyA9IFNlc3Npb24ud3JpdGUoU2Vzc2lvbi52YWx1ZShkYXRhV2l0aG91dElkcykpO1xuICAgICAgICBpZiAoY3J5cHRvKSB7XG4gICAgICAgICAgICByZXN1bHRBc1N0cmluZyA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0ocmVzdWx0QXNTdHJpbmcpO1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGFjciA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGF0YSA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIucHV0KHRvU3RvcmUsIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLm9rICYmIHJlc3BvbnNlLmlkICYmIHJlc3BvbnNlLnJldikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQrKztcblxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wYWdhdGUgX3JldiAmIF9pZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9yZXYgPSByZXNwb25zZS5yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmUoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9jLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGIucHV0KGRvYyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0KGRhdGFfaWQ6IHN0cmluZywgY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAoISFyb3cuZmlkakRhY3IgfHwgISFyb3cuZmlkakRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJvdy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjcnlwdG8gJiYgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZmlkakRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShyb3cuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0QXNKc29uID0gU2Vzc2lvbi5leHRyYWN0SnNvbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX2lkID0gcm93Ll9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvdy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdCYWQgZW5jb2RpbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ05vIGRhdGEgZm91bmQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFsbChjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxBcnJheTxhbnk+IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIgfHwgISh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGEgdmFsaWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtpbmNsdWRlX2RvY3M6IHRydWUsIGRlc2NlbmRpbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgIC50aGVuKHJvd3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGwgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAhIXJvdy5kb2MuX2lkICYmICghIXJvdy5kb2MuZmlkakRhY3IgfHwgISFyb3cuZG9jLmZpZGpEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcm93LmRvYy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3J5cHRvICYmIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZG9jLmZpZGpEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJvdy5kb2MuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRBc0pzb24gPSBTZXNzaW9uLmV4dHJhY3RKc29uKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2goSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nIDogZGVsZXRlIHJvdycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsLnB1c2gocmVzdWx0QXNKc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93LmRvYy5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFsbCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IFByb21pc2U8Ym9vbGVhbiB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiIHx8ICEodGhpcy5kYiBhcyBhbnkpLmFsbERvY3MpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTm8gZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtcbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXI6ICAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24udXNlciB8fCAhc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vICAgIGlmIChkb2MuZmlkalVzZXJJZCA9PT0gc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTm8gcmVzcG9uc2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSByZXNwb25zZS50b3RhbF9yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsX3Jvd3MgJiYgcmVzcG9uc2UudG90YWxfcm93cyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdObyBkYicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kYi5pbmZvKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHdyaXRlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZihpdGVtKTtcbiAgICAgICAgaWYgKHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe3N0cmluZzogaXRlbX0pXG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe251bWJlcjogaXRlbX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7Ym9vbDogaXRlbX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtqc29uOiBpdGVtfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHN0YXRpYyB2YWx1ZShpdGVtOiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gaXRlbTtcbiAgICAgICAgaWYgKHR5cGVvZihpdGVtKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIC8vIHJldHVybiBpdGVtO1xuICAgICAgICB9IGVsc2UgaWYgKCdzdHJpbmcnIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uc3RyaW5nO1xuICAgICAgICB9IGVsc2UgaWYgKCdudW1iZXInIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0ubnVtYmVyLnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIGlmICgnYm9vbCcgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5ib29sLnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIGlmICgnanNvbicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5qc29uO1xuICAgICAgICAgICAgaWYgKHR5cGVvZihyZXN1bHQpICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHN0YXRpYyBleHRyYWN0SnNvbihpdGVtOiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gaXRlbTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChpdGVtKSA9PT0gJ29iamVjdCcgJiYgJ2pzb24nIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uanNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3VsdCkgPT09ICdvYmplY3QnICYmICdqc29uJyBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChyZXN1bHQgYXMgYW55KS5qc29uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuIiwiLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYic7XG4vLyBpbXBvcnQgKiBhcyBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbmltcG9ydCAqIGFzIHZlcnNpb24gZnJvbSAnLi4vdmVyc2lvbic7XG5pbXBvcnQgKiBhcyB0b29scyBmcm9tICcuLi90b29scyc7XG5pbXBvcnQgKiBhcyBjb25uZWN0aW9uIGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0ICogYXMgc2Vzc2lvbiBmcm9tICcuLi9zZXNzaW9uJztcbmltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSxcbiAgICBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLFxuICAgIFNka0ludGVyZmFjZSxcbiAgICBFcnJvckludGVyZmFjZSwgRW5kcG9pbnRJbnRlcmZhY2UsIEVuZHBvaW50RmlsdGVySW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge1Nlc3Npb25DcnlwdG9JbnRlcmZhY2V9IGZyb20gJy4uL3Nlc3Npb24vc2Vzc2lvbic7XG5pbXBvcnQge0Vycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi4vY29ubmVjdGlvbi9hamF4JztcblxuLy8gY29uc3QgUG91Y2hEQiA9IHdpbmRvd1snUG91Y2hEQiddIHx8IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0O1xuXG4vKipcbiAqIHBsZWFzZSB1c2UgaXRzIGFuZ3VsYXIuanMgb3IgYW5ndWxhci5pbyB3cmFwcGVyXG4gKiB1c2VmdWxsIG9ubHkgZm9yIGZpZGogZGV2IHRlYW1cbiAqL1xuZXhwb3J0IGNsYXNzIEludGVybmFsU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlO1xuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3I7XG4gICAgcHJpdmF0ZSBzdG9yYWdlOiB0b29scy5Mb2NhbFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBzZXNzaW9uOiBzZXNzaW9uLlNlc3Npb247XG4gICAgcHJpdmF0ZSBjb25uZWN0aW9uOiBjb25uZWN0aW9uLkNvbm5lY3Rpb247XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IExvZ2dlckludGVyZmFjZSwgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yKSB7XG5cbiAgICAgICAgdGhpcy5zZGsgPSB7XG4gICAgICAgICAgICBvcmc6ICdmaWRqJyxcbiAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb24udmVyc2lvbixcbiAgICAgICAgICAgIHByb2Q6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubG9nZ2VyID0ge1xuICAgICAgICAgICAgbG9nOiAoKSA9PiB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6ICgpID0+IHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3YXJuOiAoKSA9PiB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmIChsb2dnZXIgJiYgd2luZG93LmNvbnNvbGUgJiYgbG9nZ2VyID09PSB3aW5kb3cuY29uc29sZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IgPSB3aW5kb3cuY29uc29sZS5lcnJvcjtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4gPSB3aW5kb3cuY29uc29sZS53YXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZSA6IGNvbnN0cnVjdG9yJyk7XG4gICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IG5ldyB0b29scy5Mb2NhbFN0b3JhZ2Uod2luZG93LmxvY2FsU3RvcmFnZSwgJ2ZpZGouJyk7XG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IG5ldyBzZXNzaW9uLlNlc3Npb24oKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IGNvbm5lY3Rpb24uQ29ubmVjdGlvbih0aGlzLnNkaywgdGhpcy5zdG9yYWdlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IGNvbm5lY3Rpb24gJiBzZXNzaW9uXG4gICAgICogQ2hlY2sgdXJpXG4gICAgICogRG9uZSBlYWNoIGFwcCBzdGFydFxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqSWQgIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalNhbHQgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqVmVyc2lvbiByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmRldk1vZGUgb3B0aW9uYWwgZGVmYXVsdCBmYWxzZSwgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqSW5pdChmaWRqSWQ6IHN0cmluZywgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6ICcsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoIWZpZGpJZCkge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgOiBiYWQgaW5pdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgYSBmaWRqSWQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnNkay5wcm9kID0gIW9wdGlvbnMgPyB0cnVlIDogb3B0aW9ucy5wcm9kO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqSWQgPSBmaWRqSWQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqVmVyc2lvbiA9IHNlbGYuc2RrLnZlcnNpb247XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvID0gKCFvcHRpb25zIHx8ICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjcnlwdG8nKSkgPyB0cnVlIDogb3B0aW9ucy5jcnlwdG87XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGVCZXN0T2xkVXJsOiBhbnkgPSBzZWxmLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T2xkT25lJ30pWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xvZ2luID0gc2VsZi5maWRqSXNMb2dpbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsICYmIHRoZUJlc3RVcmwudXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVCZXN0VXJsID0gdGhlQmVzdFVybC51cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RPbGRVcmwgJiYgdGhlQmVzdE9sZFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RPbGRVcmwgPSB0aGVCZXN0T2xkVXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0VXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNMb2dpbiAmJiB0aGVCZXN0T2xkVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0T2xkVXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgb25lIGNvbm5lY3Rpb24gLSBvciB0b28gb2xkIFNESyB2ZXJzaW9uIChjaGVjayB1cGRhdGUpJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0OiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGwgaXQgaWYgZmlkaklzTG9naW4oKSA9PT0gZmFsc2VcbiAgICAgKiBFcmFzZSBhbGwgKGRiICYgc3RvcmFnZSlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpMb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbicpO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDQsICdOZWVkIGFuIGludGlhbGl6ZWQgRmlkalNlcnZpY2UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fbG9naW5JbnRlcm5hbChsb2dpbiwgcGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb24odXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbjogJywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hY2Nlc3NUb2tlbiBvcHRpb25hbFxuICAgICAqIEBwYXJhbSBvcHRpb25zLmlkVG9rZW4gIG9wdGlvbmFsXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gZ2VuZXJhdGUgb25lIGRheSB0b2tlbnMgaWYgbm90IHNldFxuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBub3cuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpICsgMSk7XG4gICAgICAgICAgICBjb25zdCB0b21vcnJvdyA9IG5vdy5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgcm9sZXM6IFtdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdkZW1vJyxcbiAgICAgICAgICAgICAgICBhcGlzOiBbXSxcbiAgICAgICAgICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICAgICAgICAgIGRiczogW10sXG4gICAgICAgICAgICAgICAgZXhwOiB0b21vcnJvd1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc3Qgand0U2lnbiA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gand0U2lnbiArICcuJyArIHBheWxvYWQgKyAnLicgKyBqd3RTaWduO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgaWRUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luIGVycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqR2V0RW5kcG9pbnRzKGZpbHRlcj86IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIWZpbHRlcikge1xuICAgICAgICAgICAgZmlsdGVyID0ge3Nob3dCbG9ja2VkOiBmYWxzZX07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVuZHBvaW50cyA9IEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldEFjY2Vzc1BheWxvYWQoe2VuZHBvaW50czogW119KSkuZW5kcG9pbnRzO1xuICAgICAgICBpZiAoIWVuZHBvaW50cykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5kcG9pbnRzID0gZW5kcG9pbnRzLmZpbHRlcigoZW5kcG9pbnQ6IEVuZHBvaW50SW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2sgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9rICYmIGZpbHRlci5rZXkpIHtcbiAgICAgICAgICAgICAgICBvayA9IChlbmRwb2ludC5rZXkgPT09IGZpbHRlci5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9rICYmICFmaWx0ZXIuc2hvd0Jsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBvayA9ICFlbmRwb2ludC5ibG9ja2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50cztcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkak1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpJc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmlzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpMb2dvdXQoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5sb2dvdXQoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YSBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhX0FyZyBhcmcgdG8gc2V0IHRvIGZuSW5pdEZpcnN0RGF0YSgpXG4gICAgICogQHJldHVybnMgIHByb21pc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhPywgZm5Jbml0Rmlyc3REYXRhX0FyZz8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jJyk7XG4gICAgICAgIC8vIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAvLyAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyA6IERCIHN5bmMgaW1wb3NzaWJsZS4gRGlkIHlvdSBsb2dpbiA/Jyk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBjb25zdCBmaXJzdFN5bmMgPSAoc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPT09IG51bGwpO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqU3luYyB3YXJuOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpc0VtcHR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBpc0VtcHR5IDogJywgaXNFbXB0eSwgZmlyc3RTeW5jKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmVFbXB0eSwgcmVqZWN0RW1wdHlOb3RVc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eSAmJiBmaXJzdFN5bmMgJiYgZm5Jbml0Rmlyc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gZm5Jbml0Rmlyc3REYXRhKGZuSW5pdEZpcnN0RGF0YV9BcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgJiYgcmV0WydjYXRjaCddIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnRoZW4ocmVzb2x2ZUVtcHR5KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUVtcHR5KCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBmbkluaXRGaXJzdERhdGEgcmVzb2x2ZWQ6ICcsIGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmluZm8oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmRvY19jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSByZXN1bHQuZG9jX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBfZGJSZWNvcmRDb3VudCA6ICcgKyBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3JJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSA0MDMgfHwgZXJyLmNvZGUgPT09IDQxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlkakxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gd2hhdCB0byBkbyB3aXRoIHRoaXMgZXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1lc3NhZ2UgPSAnRXJyb3IgZHVyaW5nIHN5bmNyb25pc2F0aW9uOiAnICsgZXJyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxmLmxvZ2dlci5lcnJvcihlcnJNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNTAwLCByZWFzb246IGVyck1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalB1dEluRGIoZGF0YTogYW55KTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQdXRJbkRiOiAnLCBkYXRhKTtcblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpIHx8ICFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnREIgcHV0IGltcG9zc2libGUuIE5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX2lkOiBzdHJpbmc7XG4gICAgICAgIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKCdfaWQnKSkge1xuICAgICAgICAgICAgX2lkID0gZGF0YS5faWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfaWQpIHtcbiAgICAgICAgICAgIF9pZCA9IHNlbGYuX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZW5jcnlwdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucHV0KFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpLFxuICAgICAgICAgICAgc2VsZi5zZGsub3JnLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpWZXJzaW9uLFxuICAgICAgICAgICAgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSZW1vdmVJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalJlbW92ZUluRGIgJywgZGF0YV9pZCk7XG5cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnREIgcmVtb3ZlIGltcG9zc2libGUuICcgK1xuICAgICAgICAgICAgICAgICdOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhX2lkIHx8IHR5cGVvZiBkYXRhX2lkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ0RCIHJlbW92ZSBpbXBvc3NpYmxlLiAnICtcbiAgICAgICAgICAgICAgICAnTmVlZCB0aGUgZGF0YS5faWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5yZW1vdmUoZGF0YV9pZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqRmluZEluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSB8fCAhc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakZpbmRJbkRiIDogbmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXQoZGF0YV9pZCwgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kQWxsSW5EYigpOiBQcm9taXNlPEFycmF5PGFueT4gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpIHx8ICFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXRBbGwoY3J5cHRvKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZXNvbHZlKChyZXN1bHRzIGFzIEFycmF5PGFueT4pKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalBvc3RPbkVuZHBvaW50KGtleTogc3RyaW5nLCBkYXRhPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXI6IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZW5kcG9pbnRzID0gdGhpcy5maWRqR2V0RW5kcG9pbnRzKGZpbHRlcik7XG4gICAgICAgIGlmICghZW5kcG9pbnRzIHx8IGVuZHBvaW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KFxuICAgICAgICAgICAgICAgIG5ldyBFcnJvcig0MDAsXG4gICAgICAgICAgICAgICAgICAgICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQb3N0T25FbmRwb2ludCA6IGVuZHBvaW50IGRvZXMgbm90IGV4aXN0LicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZHBvaW50VXJsID0gZW5kcG9pbnRzWzBdLnVybDtcbiAgICAgICAgY29uc3Qgand0ID0gdGhpcy5jb25uZWN0aW9uLmdldElkVG9rZW4oKTtcbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkIDogd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBqd3RcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIC8vIEludGVybmFsIGZ1bmN0aW9uc1xuXG4gICAgLyoqXG4gICAgICogTG9nb3V0IHRoZW4gTG9naW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEBwYXJhbSB1cGRhdGVQcm9wZXJ0aWVzXG4gICAgICovXG4gICAgcHJpdmF0ZSBfbG9naW5JbnRlcm5hbChsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMywgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5sb2dvdXQoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGxvZ2luVXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpblVzZXIuZW1haWwgPSBsb2dpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobG9naW5Vc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5fbG9naW5JbnRlcm5hbCBlcnJvciA6ICcgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgX3JlbW92ZUFsbCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZGVzdHJveSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmRlc3Ryb3koKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfY3JlYXRlU2Vzc2lvbih1aWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zZXRSZW1vdGUodGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSkpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZSh1aWQpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF90ZXN0UHJvbWlzZShhPyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlc29sdmUoJ3Rlc3QgcHJvbWlzZSBvayAnICsgYSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBfc3J2RGF0YVVuaXFJZCA9IDA7XG5cbiAgICBwcml2YXRlIF9nZW5lcmF0ZU9iamVjdFVuaXF1ZUlkKGFwcE5hbWUsIHR5cGU/LCBuYW1lPykge1xuXG4gICAgICAgIC8vIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBzaW1wbGVEYXRlID0gJycgKyBub3cuZ2V0RnVsbFllYXIoKSArICcnICsgbm93LmdldE1vbnRoKCkgKyAnJyArIG5vdy5nZXREYXRlKClcbiAgICAgICAgICAgICsgJycgKyBub3cuZ2V0SG91cnMoKSArICcnICsgbm93LmdldE1pbnV0ZXMoKTsgLy8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICBjb25zdCBzZXF1SWQgPSArK0ludGVybmFsU2VydmljZS5fc3J2RGF0YVVuaXFJZDtcbiAgICAgICAgbGV0IFVJZCA9ICcnO1xuICAgICAgICBpZiAoYXBwTmFtZSAmJiBhcHBOYW1lLmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgVUlkICs9IGFwcE5hbWUuY2hhckF0KDApICsgJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgJiYgdHlwZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBVSWQgKz0gdHlwZS5zdWJzdHJpbmcoMCwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUgJiYgbmFtZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBVSWQgKz0gbmFtZS5zdWJzdHJpbmcoMCwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgVUlkICs9IHNpbXBsZURhdGUgKyAnJyArIHNlcXVJZDtcbiAgICAgICAgcmV0dXJuIFVJZDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIExvZ2dlckludGVyZmFjZSwgTW9kdWxlU2VydmljZUludGVyZmFjZSwgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZVxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtJbnRlcm5hbFNlcnZpY2V9IGZyb20gJy4vaW50ZXJuYWwuc2VydmljZSc7XG5pbXBvcnQge0Vycm9yIGFzIEZpZGpFcnJvcn0gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5cbi8qKlxuICogQW5ndWxhcjIrIEZpZGpTZXJ2aWNlXG4gKiBAc2VlIE1vZHVsZVNlcnZpY2VJbnRlcmZhY2VcbiAqXG4gKiBAZXhlbXBsZVxuICogICAgICAvLyAuLi4gYWZ0ZXIgaW5zdGFsbCA6XG4gKiAgICAgIC8vICQgbnBtIGluc3RhbGwgLS1zYXZlLWRldiBmaWRqXG4gKiAgICAgIC8vIHRoZW4gaW5pdCB5b3VyIGFwcC5qcyAmIHVzZSBpdCBpbiB5b3VyIHNlcnZpY2VzXG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLmluamVjdC5qc1wiPjwvc2NyaXB0PlxuICpcbiAqIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2L3Jhdy81ZmZmNjlkZDljMTVmNjkyYTg1NmRiNjJjZjMzNGI3MjRlZjNmNGFjL2FuZ3VsYXIuZmlkai5zeW5jLmpzXCI+PC9zY3JpcHQ+XG4gKlxuICpcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpZGpTZXJ2aWNlIGltcGxlbWVudHMgTW9kdWxlU2VydmljZUludGVyZmFjZSB7XG5cbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlO1xuICAgIHByaXZhdGUgZmlkalNlcnZpY2U6IEludGVybmFsU2VydmljZTtcbiAgICBwcml2YXRlIHByb21pc2U6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXJTZXJ2aWNlKCk7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IFByb21pc2U7XG4gICAgICAgIHRoaXMuZmlkalNlcnZpY2UgPSBudWxsO1xuICAgICAgICAvLyBsZXQgcG91Y2hkYlJlcXVpcmVkID0gUG91Y2hEQjtcbiAgICAgICAgLy8gcG91Y2hkYlJlcXVpcmVkLmVycm9yKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBpbml0KGZpZGpJZCwgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZSA9IG5ldyBJbnRlcm5hbFNlcnZpY2UodGhpcy5sb2dnZXIsIHRoaXMucHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWRFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXRBdXRoRW5kcG9pbnQob3B0aW9ucy5mb3JjZWRFbmRwb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldERCRW5kcG9pbnQob3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KTtcbiAgICAgICAgfSovXG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpJbml0KGZpZGpJZCwgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dpbihsb2dpbiwgcGFzc3dvcmQpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbiA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ2luKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dpbkFzRGVtbyhvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luQXNEZW1vIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIHRoaXMucHJvbWlzZS5yZWplY3QoJ2ZpZGouc2RrLmFuZ3VsYXIyLmlzTG9nZ2VkSW4gOiBub3QgaW5pdGlhbGl6ZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkaklzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldFJvbGVzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUm9sZXMoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldEVuZHBvaW50cygpOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqR2V0RW5kcG9pbnRzKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBwb3N0T25FbmRwb2ludChrZXk6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW5Bc0RlbW8gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpQb3N0T25FbmRwb2ludChrZXksIGRhdGEpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0SWRUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqR2V0SWRUb2tlbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0TWVzc2FnZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTWVzc2FnZSgpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dvdXQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dvdXQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEByZXR1cm5zIHByb21pc2Ugd2l0aCB0aGlzLnNlc3Npb24uZGJcbiAgICAgKiBAbWVtYmVyb2YgZmlkai5hbmd1bGFyU2VydmljZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgbGV0IGluaXREYiA9IGZ1bmN0aW9uKCkge1xuICAgICAqICAgICB0aGlzLmZpZGpTZXJ2aWNlLnB1dCgnbXkgZmlyc3Qgcm93Jyk7XG4gICAgICogIH07XG4gICAgICogIHRoaXMuZmlkalNlcnZpY2Uuc3luYyhpbml0RGIpXG4gICAgICogIC50aGVuKHVzZXIgPT4gLi4uKVxuICAgICAqICAuY2F0Y2goZXJyID0+IC4uLilcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBzeW5jKGZuSW5pdEZpcnN0RGF0YT8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuc3luYyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhLCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZGF0YSBpbiB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhIHRvIHN0b3JlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcHV0KGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnB1dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalB1dEluRGIoZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgb2JqZWN0IElkIGFuZCByZW1vdmUgaXQgZnJvbSB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBvZiBvYmplY3QgdG8gZmluZCBhbmQgcmVtb3ZlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIucmVtb3ZlIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUmVtb3ZlSW5EYihpZCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZChpZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRJbkRiKGlkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpbmRBbGwoKTogUHJvbWlzZTxhbnlbXSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5maW5kQWxsIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqRmluZEFsbEluRGIoKTtcbiAgICB9O1xuXG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIGltcGxlbWVudHMgTG9nZ2VySW50ZXJmYWNlIHtcbiAgICBsb2cobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHdhcm4obWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG59XG5cbiIsImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0ZpZGpTZXJ2aWNlfSBmcm9tICcuL2FuZ3VsYXIuc2VydmljZSc7XG5cblxuLyoqXG4gKiBgTmdNb2R1bGVgIHdoaWNoIHByb3ZpZGVzIGFzc29jaWF0ZWQgc2VydmljZXMuXG4gKlxuICogLi4uXG4gKlxuICogQHN0YWJsZVxuICovXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxuXG4gICAgZXhwb3J0czogW10sXG5cbiAgICBwcm92aWRlcnM6IFtGaWRqU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgRmlkak1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxufVxuXG5cbi8qKlxuICogbW9kdWxlIEZpZGpNb2R1bGVcbiAqXG4gKiBleGVtcGxlXG4gKiAgICAgIC8vIC4uLiBhZnRlciBpbnN0YWxsIDpcbiAqICAgICAgLy8gJCBucG0gaW5zdGFsbCBmaWRqXG4gKiAgICAgIC8vIHRoZW4gaW5pdCB5b3VyIGFwcC5qcyAmIHVzZSBpdCBpbiB5b3VyIHNlcnZpY2VzXG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHViLmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2LmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHViLmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2LmpzXCI+PC9zY3JpcHQ+XG4gKi9cbiJdLCJuYW1lcyI6WyJFcnJvciIsInZlcnNpb24udmVyc2lvbiIsInRvb2xzLkxvY2FsU3RvcmFnZSIsInNlc3Npb24uU2Vzc2lvbiIsImNvbm5lY3Rpb24uQ29ubmVjdGlvbiIsImNvbm5lY3Rpb24uQ2xpZW50IiwidG9vbHMuQmFzZTY0IiwiRmlkakVycm9yIl0sIm1hcHBpbmdzIjoiOzs7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