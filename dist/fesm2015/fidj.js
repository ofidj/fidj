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
const version = '2.1.10';

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
            { key: 'fidj.default', url: 'https://fidj/api', blocked: false }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlkai5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vZmlkai90b29scy9iYXNlNjQudHMiLCJuZzovL2ZpZGovdG9vbHMvc3RvcmFnZS50cyIsIm5nOi8vZmlkai90b29scy94b3IudHMiLCJuZzovL2ZpZGovdmVyc2lvbi9pbmRleC50cyIsIm5nOi8vZmlkai9jb25uZWN0aW9uL3hocnByb21pc2UudHMiLCJuZzovL2ZpZGovY29ubmVjdGlvbi9hamF4LnRzIiwibmc6Ly9maWRqL2Nvbm5lY3Rpb24vY2xpZW50LnRzIiwibmc6Ly9maWRqL3Nkay9lcnJvci50cyIsIm5nOi8vZmlkai9jb25uZWN0aW9uL2Nvbm5lY3Rpb24udHMiLCJuZzovL2ZpZGovc2Vzc2lvbi9zZXNzaW9uLnRzIiwibmc6Ly9maWRqL3Nkay9pbnRlcm5hbC5zZXJ2aWNlLnRzIiwibmc6Ly9maWRqL3Nkay9hbmd1bGFyLnNlcnZpY2UudHMiLCJuZzovL2ZpZGovc2RrL2ZpZGoubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBCYXNlNjQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlY29kZXMgc3RyaW5nIGZyb20gQmFzZTY0IHN0cmluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZW5jb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KGlucHV0KS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxuICAgICAgICAgICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KCcweCcgKyBwMSwgMTYpKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZGVjb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChhdG9iKGlucHV0KS5zcGxpdCgnJykubWFwKChjKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJyUnICsgKCcwMCcgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgIH0pLmpvaW4oJycpKTtcblxuICAgIH1cbn1cbiIsIi8qKlxuICogbG9jYWxTdG9yYWdlIGNsYXNzIGZhY3RvcnlcbiAqIFVzYWdlIDogdmFyIExvY2FsU3RvcmFnZSA9IGZpZGouTG9jYWxTdG9yYWdlRmFjdG9yeSh3aW5kb3cubG9jYWxTdG9yYWdlKTsgLy8gdG8gY3JlYXRlIGEgbmV3IGNsYXNzXG4gKiBVc2FnZSA6IHZhciBsb2NhbFN0b3JhZ2VTZXJ2aWNlID0gbmV3IExvY2FsU3RvcmFnZSgpOyAvLyB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2VcbiAqL1xuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSB7XG5cbiAgICBwdWJsaWMgdmVyc2lvbiA9ICcwLjEnO1xuICAgIHByaXZhdGUgc3RvcmFnZTtcblxuICAgIC8vIENvbnN0cnVjdG9yXG4gICAgY29uc3RydWN0b3Ioc3RvcmFnZVNlcnZpY2UsIHByaXZhdGUgc3RvcmFnZUtleSkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlU2VydmljZSB8fCB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgICAgICBpZiAoIXRoaXMuc3RvcmFnZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLkxvY2FsU3RvcmFnZUZhY3RvcnkgbmVlZHMgYSBzdG9yYWdlU2VydmljZSEnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0b2RvIExvY2FsU3RvcmFnZSByZWZhY3RvXG4gICAgICAgIC8vICAgICAgICAgICAgaWYgKCFmaWRqLlhtbCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouWG1sIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5Kc29uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Kc29uIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5YbWwuaXNYbWwgfHwgIWZpZGouWG1sLnhtbDJTdHJpbmcgfHwgIWZpZGouWG1sLnN0cmluZzJYbWwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLlhtbCB3aXRoIGlzWG1sKCksIHhtbDJTdHJpbmcoKVxuICAgICAgICAvLyBhbmQgc3RyaW5nMlhtbCgpIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5Kc29uLm9iamVjdDJTdHJpbmcgfHwgIWZpZGouSnNvbi5zdHJpbmcyT2JqZWN0KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Kc29uIHdpdGggb2JqZWN0MlN0cmluZygpXG4gICAgICAgIC8vIGFuZCBzdHJpbmcyT2JqZWN0KCkgbmVlZHMgdG8gYmUgbG9hZGVkIGJlZm9yZSBmaWRqLkxvY2FsU3RvcmFnZSEnKTtcbiAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgfVxuXG4gICAgLy8gUHVibGljIEFQSVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhIGtleSdzIHZhbHVlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGtleSAtIEtleSB0byBzZXQuIElmIHRoaXMgdmFsdWUgaXMgbm90IHNldCBvciBub3RcbiAgICAgKiAgICAgICAgICAgICAgYSBzdHJpbmcgYW4gZXhjZXB0aW9uIGlzIHJhaXNlZC5cbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBWYWx1ZSB0byBzZXQuIFRoaXMgY2FuIGJlIGFueSB2YWx1ZSB0aGF0IGlzIEpTT05cbiAgICAgKiAgICAgICAgICAgICAgY29tcGF0aWJsZSAoTnVtYmVycywgU3RyaW5ncywgT2JqZWN0cyBldGMuKS5cbiAgICAgKiBAcmV0dXJucyB0aGUgc3RvcmVkIHZhbHVlIHdoaWNoIGlzIGEgY29udGFpbmVyIG9mIHVzZXIgdmFsdWUuXG4gICAgICovXG4gICAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZSkge1xuXG4gICAgICAgIGtleSA9IHRoaXMuc3RvcmFnZUtleSArIGtleTtcbiAgICAgICAgdGhpcy5jaGVja0tleShrZXkpO1xuICAgICAgICAvLyBjbG9uZSB0aGUgb2JqZWN0IGJlZm9yZSBzYXZpbmcgdG8gc3RvcmFnZVxuICAgICAgICBjb25zdCB0ID0gdHlwZW9mKHZhbHVlKTtcbiAgICAgICAgaWYgKHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe3N0cmluZzogdmFsdWV9KVxuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtudW1iZXI6IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtib29sOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtqc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcmVqZWN0IGFuZCBkbyBub3QgaW5zZXJ0XG4gICAgICAgICAgICAvLyBpZiAodHlwZW9mIHZhbHVlID09IFwiZnVuY3Rpb25cIikgZm9yIGV4YW1wbGVcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1ZhbHVlIHR5cGUgJyArIHQgKyAnIGlzIGludmFsaWQuIEl0IG11c3QgYmUgbnVsbCwgdW5kZWZpbmVkLCB4bWwsIHN0cmluZywgbnVtYmVyLCBib29sZWFuIG9yIG9iamVjdCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExvb2tzIHVwIGEga2V5IGluIGNhY2hlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5IC0gS2V5IHRvIGxvb2sgdXAuXG4gICAgICogQHBhcmFtIGRlZiAtIERlZmF1bHQgdmFsdWUgdG8gcmV0dXJuLCBpZiBrZXkgZGlkbid0IGV4aXN0LlxuICAgICAqIEByZXR1cm5zIHRoZSBrZXkgdmFsdWUsIGRlZmF1bHQgdmFsdWUgb3IgPG51bGw+XG4gICAgICovXG4gICAgZ2V0KGtleTogc3RyaW5nLCBkZWY/KSB7XG4gICAgICAgIGtleSA9IHRoaXMuc3RvcmFnZUtleSArIGtleTtcbiAgICAgICAgdGhpcy5jaGVja0tleShrZXkpO1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShpdGVtKTtcblxuICAgICAgICAgICAgLy8gdmFyIHZhbHVlID0gZmlkai5Kc29uLnN0cmluZzJPYmplY3QoaXRlbSk7XG4gICAgICAgICAgICAvLyBpZiAoJ3htbCcgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmlkai5YbWwuc3RyaW5nMlhtbCh2YWx1ZS54bWwpO1xuICAgICAgICAgICAgLy8gfSBlbHNlXG4gICAgICAgICAgICBpZiAoJ3N0cmluZycgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3RyaW5nO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgnbnVtYmVyJyBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5udW1iZXIudmFsdWVPZigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgnYm9vbCcgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuYm9vbC52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5qc29uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhZGVmID8gbnVsbCA6IGRlZjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBhIGtleSBmcm9tIGNhY2hlLlxuICAgICAqXG4gICAgICogQHBhcmFtICBrZXkgLSBLZXkgdG8gZGVsZXRlLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYga2V5IGV4aXN0ZWQgb3IgZmFsc2UgaWYgaXQgZGlkbid0XG4gICAgICovXG4gICAgcmVtb3ZlKGtleTogc3RyaW5nKSB7XG4gICAgICAgIGtleSA9IHRoaXMuc3RvcmFnZUtleSArIGtleTtcbiAgICAgICAgdGhpcy5jaGVja0tleShrZXkpO1xuICAgICAgICBjb25zdCBleGlzdGVkID0gKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkgIT09IG51bGwpO1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICByZXR1cm4gZXhpc3RlZDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBldmVyeXRoaW5nIGluIGNhY2hlLlxuICAgICAqXG4gICAgICogQHJldHVybiB0cnVlXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0ZWQgPSAodGhpcy5zdG9yYWdlLmxlbmd0aCA+IDApO1xuICAgICAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIHNwYWNlIGluIGJ5dGVzIGRvZXMgdGhlIHN0b3JhZ2UgdGFrZT9cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIE51bWJlclxuICAgICAqL1xuICAgIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2UubGVuZ3RoO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGZ1bmN0aW9uIGYgb24gdGhlIHNwZWNpZmllZCBjb250ZXh0IGZvciBlYWNoIGVsZW1lbnQgb2YgdGhlIHN0b3JhZ2VcbiAgICAgKiBmcm9tIGluZGV4IDAgdG8gaW5kZXggbGVuZ3RoLTEuXG4gICAgICogV0FSTklORyA6IFlvdSBzaG91bGQgbm90IG1vZGlmeSB0aGUgc3RvcmFnZSBkdXJpbmcgdGhlIGxvb3AgISEhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZiAtIEZ1bmN0aW9uIHRvIGNhbGwgb24gZXZlcnkgaXRlbS5cbiAgICAgKiBAcGFyYW0gIGNvbnRleHQgLSBDb250ZXh0ICh0aGlzIGZvciBleGFtcGxlKS5cbiAgICAgKiBAcmV0dXJucyBOdW1iZXIgb2YgaXRlbXMgaW4gc3RvcmFnZVxuICAgICAqL1xuICAgIGZvcmVhY2goZiwgY29udGV4dCkge1xuICAgICAgICBjb25zdCBuID0gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuc3RvcmFnZS5rZXkoaSk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIGYgaXMgYW4gaW5zdGFuY2UgbWV0aG9kIG9uIGluc3RhbmNlIGNvbnRleHRcbiAgICAgICAgICAgICAgICBmLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmIGlzIGEgZnVuY3Rpb24gb3IgY2xhc3MgbWV0aG9kXG4gICAgICAgICAgICAgICAgZih2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfTtcblxuICAgIC8vIFByaXZhdGUgQVBJXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9ucyBhbmQgdmFyaWFibGVzIGhpZGRlbiB3aXRoaW4gdGhpcyBmdW5jdGlvbiBzY29wZVxuXG4gICAgcHJpdmF0ZSBjaGVja0tleShrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignS2V5IHR5cGUgbXVzdCBiZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0Jhc2U2NH0gZnJvbSAnLi9iYXNlNjQnO1xuXG5leHBvcnQgY2xhc3MgWG9yIHtcblxuICAgIHN0YXRpYyBoZWFkZXIgPSAnYXJ0ZW1pcy1sb3RzdW0nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuXG4gICAgcHVibGljIHN0YXRpYyBlbmNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICAgICAgdmFsdWUgPSBYb3IuaGVhZGVyICsgdmFsdWU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKHZhbHVlW2ldLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTApIGFzIGFueSkgXiBYb3Iua2V5Q2hhckF0KGtleSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IEJhc2U2NC5lbmNvZGUocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgcHVibGljIHN0YXRpYyBkZWNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nLCBvbGRTdHlsZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIHZhbHVlID0gQmFzZTY0LmRlY29kZSh2YWx1ZSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCh2YWx1ZVtpXS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDEwKSBhcyBhbnkpIF4gWG9yLmtleUNoYXJBdChrZXksIGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2xkU3R5bGUgJiYgWG9yLmhlYWRlciAhPT0gcmVzdWx0LnN1YnN0cmluZygwLCBYb3IuaGVhZGVyLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvbGRTdHlsZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZyhYb3IuaGVhZGVyLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGtleUNoYXJBdChrZXksIGkpIHtcbiAgICAgICAgcmV0dXJuIGtleVtNYXRoLmZsb29yKGkgJSBrZXkubGVuZ3RoKV0uY2hhckNvZGVBdCgwKS50b1N0cmluZygxMCk7XG4gICAgfVxuXG5cbn1cbiIsIi8vIGJ1bXBlZCB2ZXJzaW9uIHZpYSBndWxwXG5leHBvcnQgY29uc3QgdmVyc2lvbiA9ICcyLjEuMTAnO1xuIiwiZXhwb3J0IGNsYXNzIFhIUlByb21pc2Uge1xuXG4gICAgcHVibGljIERFRkFVTFRfQ09OVEVOVF9UWVBFID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XG4gICAgcHJpdmF0ZSBfeGhyO1xuICAgIHByaXZhdGUgX3VubG9hZEhhbmRsZXI6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2Uuc2VuZChvcHRpb25zKSAtPiBQcm9taXNlXG4gICAgICogLSBvcHRpb25zIChPYmplY3QpOiBVUkwsIG1ldGhvZCwgZGF0YSwgZXRjLlxuICAgICAqXG4gICAgICogQ3JlYXRlIHRoZSBYSFIgb2JqZWN0IGFuZCB3aXJlIHVwIGV2ZW50IGhhbmRsZXJzIHRvIHVzZSBhIHByb21pc2UuXG4gICAgICovXG4gICAgc2VuZChvcHRpb25zKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGRlZmF1bHRzO1xuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCAoX3RoaXM6IFhIUlByb21pc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBlLCBoZWFkZXIsIHJlZiwgdmFsdWUsIHhocjtcbiAgICAgICAgICAgICAgICBpZiAoIVhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9oYW5kbGVFcnJvcignYnJvd3NlcicsIHJlamVjdCwgbnVsbCwgJ2Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMudXJsICE9PSAnc3RyaW5nJyB8fCBvcHRpb25zLnVybC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCd1cmwnLCByZWplY3QsIG51bGwsICdVUkwgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5feGhyID0geGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSAgKCkgID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2RldGFjaFdpbmRvd1VubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUZXh0ID0gX3RoaXMuX2dldFJlc3BvbnNlVGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9oYW5kbGVFcnJvcigncGFyc2UnLCByZWplY3QsIG51bGwsICdpbnZhbGlkIEpTT04gcmVzcG9uc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IF90aGlzLl9nZXRSZXNwb25zZVVybCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IF90aGlzLl9nZXRIZWFkZXJzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHI6IHhoclxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9udGltZW91dCA9ICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3RpbWVvdXQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9uYWJvcnQgPSAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdhYm9ydCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBfdGhpcy5fYXR0YWNoV2luZG93VW5sb2FkKCk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCBvcHRpb25zLmFzeW5jLCBvcHRpb25zLnVzZXJuYW1lLCBvcHRpb25zLnBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy53aXRoQ3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgob3B0aW9ucy5kYXRhICE9IG51bGwpICYmICFvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSBfdGhpcy5ERUZBVUxUX0NPTlRFTlRfVFlQRTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVmID0gb3B0aW9ucy5oZWFkZXJzO1xuICAgICAgICAgICAgICAgIGZvciAoaGVhZGVyIGluIHJlZikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVmLmhhc093blByb3BlcnR5KGhlYWRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVmW2hlYWRlcl07XG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geGhyLnNlbmQob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IF9lcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignc2VuZCcsIHJlamVjdCwgbnVsbCwgZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLmdldFhIUigpIC0+IFhNTEh0dHBSZXF1ZXN0XG4gICAgICovXG4gICAgZ2V0WEhSKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fYXR0YWNoV2luZG93VW5sb2FkKClcbiAgICAgKlxuICAgICAqIEZpeCBmb3IgSUUgOSBhbmQgSUUgMTBcbiAgICAgKiBJbnRlcm5ldCBFeHBsb3JlciBmcmVlemVzIHdoZW4geW91IGNsb3NlIGEgd2VicGFnZSBkdXJpbmcgYW4gWEhSIHJlcXVlc3RcbiAgICAgKiBodHRwczovL3N1cHBvcnQubWljcm9zb2Z0LmNvbS9rYi8yODU2NzQ2XG4gICAgICpcbiAgICAgKi9cbiAgICBwcml2YXRlIF9hdHRhY2hXaW5kb3dVbmxvYWQoKSB7XG4gICAgICAgIHRoaXMuX3VubG9hZEhhbmRsZXIgPSB0aGlzLl9oYW5kbGVXaW5kb3dVbmxvYWQuYmluZCh0aGlzKTtcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5hdHRhY2hFdmVudCgnb251bmxvYWQnLCB0aGlzLl91bmxvYWRIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZGV0YWNoV2luZG93VW5sb2FkKClcbiAgICAgKi9cbiAgICBwcml2YXRlIF9kZXRhY2hXaW5kb3dVbmxvYWQoKSB7XG4gICAgICAgIGlmICgod2luZG93IGFzIGFueSkuZGV0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkuZGV0YWNoRXZlbnQoJ29udW5sb2FkJywgdGhpcy5fdW5sb2FkSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2dldEhlYWRlcnMoKSAtPiBPYmplY3RcbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXRIZWFkZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VIZWFkZXJzKHRoaXMuX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9nZXRSZXNwb25zZVRleHQoKSAtPiBNaXhlZFxuICAgICAqXG4gICAgICogUGFyc2VzIHJlc3BvbnNlIHRleHQgSlNPTiBpZiBwcmVzZW50LlxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldFJlc3BvbnNlVGV4dCgpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlVGV4dDtcbiAgICAgICAgcmVzcG9uc2VUZXh0ID0gdHlwZW9mIHRoaXMuX3hoci5yZXNwb25zZVRleHQgPT09ICdzdHJpbmcnID8gdGhpcy5feGhyLnJlc3BvbnNlVGV4dCA6ICcnO1xuICAgICAgICBzd2l0Y2ggKCh0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpIHx8ICcnKS5zcGxpdCgnOycpWzBdKSB7XG4gICAgICAgICAgICBjYXNlICdhcHBsaWNhdGlvbi9qc29uJzpcbiAgICAgICAgICAgIGNhc2UgJ3RleHQvamF2YXNjcmlwdCc6XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VUZXh0ID0gSlNPTi5wYXJzZShyZXNwb25zZVRleHQgKyAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlVGV4dDtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2dldFJlc3BvbnNlVXJsKCkgLT4gU3RyaW5nXG4gICAgICpcbiAgICAgKiBBY3R1YWwgcmVzcG9uc2UgVVJMIGFmdGVyIGZvbGxvd2luZyByZWRpcmVjdHMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0UmVzcG9uc2VVcmwoKSB7XG4gICAgICAgIGlmICh0aGlzLl94aHIucmVzcG9uc2VVUkwgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5yZXNwb25zZVVSTDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoL15YLVJlcXVlc3QtVVJMOi9tLnRlc3QodGhpcy5feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcignWC1SZXF1ZXN0LVVSTCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2hhbmRsZUVycm9yKHJlYXNvbiwgcmVqZWN0LCBzdGF0dXMsIHN0YXR1c1RleHQpXG4gICAgICogLSByZWFzb24gKFN0cmluZylcbiAgICAgKiAtIHJlamVjdCAoRnVuY3Rpb24pXG4gICAgICogLSBzdGF0dXMgKFN0cmluZylcbiAgICAgKiAtIHN0YXR1c1RleHQgKFN0cmluZylcbiAgICAgKi9cbiAgICBwcml2YXRlIF9oYW5kbGVFcnJvcihyZWFzb24sIHJlamVjdCwgc3RhdHVzPywgc3RhdHVzVGV4dD8pIHtcbiAgICAgICAgdGhpcy5fZGV0YWNoV2luZG93VW5sb2FkKCk7XG5cbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCdicm93c2VyJywgcmVqZWN0LCBudWxsLCAnYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3VybCcsIHJlamVjdCwgbnVsbCwgJ1VSTCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xuICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3BhcnNlJywgcmVqZWN0LCBudWxsLCAnaW52YWxpZCBKU09OIHJlc3BvbnNlJyk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcigndGltZW91dCcsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Fib3J0JywgcmVqZWN0KTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignc2VuZCcsIHJlamVjdCwgbnVsbCwgZS50b1N0cmluZygpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ19oYW5kbGVFcnJvcjonLCByZWFzb24sIHRoaXMuX3hoci5zdGF0dXMpO1xuICAgICAgICBsZXQgY29kZSA9IDQwNDtcbiAgICAgICAgaWYgKHJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICBjb2RlID0gNDA4O1xuICAgICAgICB9IGVsc2UgaWYgKHJlYXNvbiA9PT0gJ2Fib3J0Jykge1xuICAgICAgICAgICAgY29kZSA9IDQwODtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWplY3Qoe1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb24sXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyB8fCB0aGlzLl94aHIuc3RhdHVzIHx8IGNvZGUsXG4gICAgICAgICAgICBjb2RlOiBzdGF0dXMgfHwgdGhpcy5feGhyLnN0YXR1cyB8fCBjb2RlLFxuICAgICAgICAgICAgc3RhdHVzVGV4dDogc3RhdHVzVGV4dCB8fCB0aGlzLl94aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgIHhocjogdGhpcy5feGhyXG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5faGFuZGxlV2luZG93VW5sb2FkKClcbiAgICAgKi9cbiAgICBwcml2YXRlIF9oYW5kbGVXaW5kb3dVbmxvYWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94aHIuYWJvcnQoKTtcbiAgICB9O1xuXG5cbiAgICBwcml2YXRlIHRyaW0oc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNBcnJheShhcmcpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoKGxpc3QsIGl0ZXJhdG9yKSB7XG4gICAgICAgIGlmICh0b1N0cmluZy5jYWxsKGxpc3QpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICB0aGlzLmZvckVhY2hBcnJheShsaXN0LCBpdGVyYXRvciwgdGhpcylcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaFN0cmluZyhsaXN0LCBpdGVyYXRvciwgdGhpcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaE9iamVjdChsaXN0LCBpdGVyYXRvciwgdGhpcylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJheS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoU3RyaW5nKHN0cmluZywgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0cmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgLy8gbm8gc3VjaCB0aGluZyBhcyBhIHNwYXJzZSBzdHJpbmcuXG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHN0cmluZy5jaGFyQXQoaSksIGksIHN0cmluZylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZm9yRWFjaE9iamVjdChvYmplY3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGZvciAoY29uc3QgayBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iamVjdFtrXSwgaywgb2JqZWN0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKCFoZWFkZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgICAgICB0aGlzLmZvckVhY2goXG4gICAgICAgICAgICB0aGlzLnRyaW0oaGVhZGVycykuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgICAsIChyb3cpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHJvdy5pbmRleE9mKCc6JylcbiAgICAgICAgICAgICAgICAgICAgLCBrZXkgPSB0aGlzLnRyaW0ocm93LnNsaWNlKDAsIGluZGV4KSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAsIHZhbHVlID0gdGhpcy50cmltKHJvdy5zbGljZShpbmRleCArIDEpKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YocmVzdWx0W2tleV0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQXJyYXkocmVzdWx0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godmFsdWUpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBbcmVzdWx0W2tleV0sIHZhbHVlXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuXG59XG4iLCJpbXBvcnQge1hIUlByb21pc2V9IGZyb20gJy4veGhycHJvbWlzZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgWGhyT3B0aW9uc0ludGVyZmFjZSB7XG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YT86IGFueSxcbiAgICBoZWFkZXJzPzogYW55LFxuICAgIGFzeW5jPzogYm9vbGVhbixcbiAgICB1c2VybmFtZT86IHN0cmluZyxcbiAgICBwYXNzd29yZD86IHN0cmluZyxcbiAgICB3aXRoQ3JlZGVudGlhbHM/OiBib29sZWFuXG59XG5cbmV4cG9ydCBjbGFzcyBBamF4IHtcblxuICAgIC8vIHByaXZhdGUgc3RhdGljIHhocjogWEhSUHJvbWlzZSA9IG5ldyBYSFJQcm9taXNlKCk7XG4gICAgcHJpdmF0ZSB4aHI6IFhIUlByb21pc2U7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy54aHIgPSBuZXcgWEhSUHJvbWlzZSgpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgcG9zdChhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybCxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyZ3MuZGF0YSlcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgb3B0LmhlYWRlcnMgPSBhcmdzLmhlYWRlcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucmVhc29uID0gJ3N0YXR1cyc7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jb2RlID0gcGFyc2VJbnQocmVzLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcignYnJvd3NlcicsIHJlamVjdCwgbnVsbCwgJ2Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3VybCcsIHJlamVjdCwgbnVsbCwgJ1VSTCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigncGFyc2UnLCByZWplY3QsIG51bGwsICdpbnZhbGlkIEpTT04gcmVzcG9uc2UnKTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcigndGltZW91dCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignYWJvcnQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3NlbmQnLCByZWplY3QsIG51bGwsIGUudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiAoZXJyLnJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA4O1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXQoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdDogYW55ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmwsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhcmdzLmRhdGEpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLnNlbmQob3B0KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWFzb24gPSAnc3RhdHVzJztcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNvZGUgPSBwYXJzZUludChyZXMuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmIChlcnIucmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlbGV0ZShhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybCxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyZ3MuZGF0YSlcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgb3B0LmhlYWRlcnMgPSBhcmdzLmhlYWRlcnM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMueGhyXG4gICAgICAgICAgICAuc2VuZChvcHQpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPCAyMDAgfHwgcGFyc2VJbnQocmVzLnN0YXR1cywgMTApID49IDMwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlYXNvbiA9ICdzdGF0dXMnO1xuICAgICAgICAgICAgICAgICAgICByZXMuY29kZSA9IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKGVyci5yZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwODtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0KGFyZ3M6IFhock9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmRhdGEpIHtcbiAgICAgICAgICAgIG9wdC5kYXRhID0gYXJncy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLnNlbmQob3B0KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWFzb24gPSAnc3RhdHVzJztcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNvZGUgPSBwYXJzZUludChyZXMuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmIChlcnIucmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtBamF4fSBmcm9tICcuL2FqYXgnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2V9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7U2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcblxuICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50VXVpZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50SW5mbzogc3RyaW5nO1xuICAgIHByaXZhdGUgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50ID0gMDtcbiAgICBwcml2YXRlIHN0YXRpYyBfY2xpZW50VXVpZCA9ICd2Mi5jbGllbnRVdWlkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfY2xpZW50SWQgPSAndjIuY2xpZW50SWQnO1xuICAgIHByaXZhdGUgc3RhdGljIF9yZWZyZXNoQ291bnQgPSAndjIucmVmcmVzaENvdW50JztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwSWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIFVSSTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc3RvcmFnZTogTG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc2RrOiBTZGtJbnRlcmZhY2UpIHtcblxuICAgICAgICBsZXQgdXVpZDogc3RyaW5nID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudFV1aWQpIHx8ICd1dWlkLScgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBsZXQgaW5mbyA9ICdfY2xpZW50SW5mbyc7IC8vIHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRJbmZvKTtcbiAgICAgICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cubmF2aWdhdG9yKSB7XG4gICAgICAgICAgICBpbmZvID0gd2luZG93Lm5hdmlnYXRvci5hcHBOYW1lICsgJ0AnICsgd2luZG93Lm5hdmlnYXRvci5hcHBWZXJzaW9uICsgJy0nICsgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdpbmRvdyAmJiB3aW5kb3dbJ2RldmljZSddICYmIHdpbmRvd1snZGV2aWNlJ10udXVpZCkge1xuICAgICAgICAgICAgdXVpZCA9IHdpbmRvd1snZGV2aWNlJ10udXVpZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldENsaWVudFV1aWQodXVpZCk7XG4gICAgICAgIHRoaXMuc2V0Q2xpZW50SW5mbyhpbmZvKTtcbiAgICAgICAgdGhpcy5jbGllbnRJZCA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRJZCk7XG4gICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fcmVmcmVzaENvdW50KSB8fCAwO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50SWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudElkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudElkLCB0aGlzLmNsaWVudElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50VXVpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50VXVpZCA9ICcnICsgdmFsdWU7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9jbGllbnRVdWlkLCB0aGlzLmNsaWVudFV1aWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRJbmZvKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRJbmZvID0gJycgKyB2YWx1ZTtcbiAgICAgICAgLy8gdGhpcy5zdG9yYWdlLnNldCgnY2xpZW50SW5mbycsIHRoaXMuY2xpZW50SW5mbyk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmxMb2dpbiA9IHRoaXMuVVJJICsgJy91c2Vycyc7XG4gICAgICAgIGNvbnN0IGRhdGFMb2dpbiA9IHtcbiAgICAgICAgICAgIG5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgdXNlcm5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgZW1haWw6IGxvZ2luLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybExvZ2luLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFMb2dpbixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihjcmVhdGVkVXNlciA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldENsaWVudElkKGNyZWF0ZWRVc2VyLl9pZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsVG9rZW4gPSB0aGlzLlVSSSArICcvb2F1dGgvdG9rZW4nO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFUb2tlbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ2NsaWVudF9jcmVkZW50aWFscycsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X3NlY3JldDogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICAgICAgICAgIGF1ZGllbmNlOiB0aGlzLmFwcElkLFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlQXV0aGVudGljYXRlKHJlZnJlc2hUb2tlbjogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL29hdXRoL3Rva2VuJztcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIGdyYW50X3R5cGU6ICdyZWZyZXNoX3Rva2VuJyxcbiAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspLFxuICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgcmVmcmVzaF9leHRyYTogQ2xpZW50LnJlZnJlc2hDb3VudCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKG9iajogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9yZWZyZXNoQ291bnQsIENsaWVudC5yZWZyZXNoQ291bnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUob2JqKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2dvdXQocmVmcmVzaFRva2VuPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlbGV0ZSB0aGlzLmNsaWVudFV1aWQ7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGlzLmNsaWVudElkO1xuICAgICAgICAvLyB0aGlzLnN0b3JhZ2UucmVtb3ZlKENsaWVudC5fY2xpZW50VXVpZCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRJZCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9yZWZyZXNoQ291bnQpO1xuICAgICAgICBDbGllbnQucmVmcmVzaENvdW50ID0gMDtcblxuICAgICAgICBpZiAoIXJlZnJlc2hUb2tlbiB8fCAhdGhpcy5jbGllbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL29hdXRoL3Jldm9rZSc7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5VUkk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtFcnJvckludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIEVycm9yIGltcGxlbWVudHMgRXJyb3JJbnRlcmZhY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvZGU6IG51bWJlciwgcHVibGljIHJlYXNvbjogc3RyaW5nKSB7XG4gICAgfTtcblxuICAgIGVxdWFscyhlcnI6IEVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGUgPT09IGVyci5jb2RlICYmIHRoaXMucmVhc29uID09PSBlcnIucmVhc29uO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1zZzogc3RyaW5nID0gKHR5cGVvZiB0aGlzLnJlYXNvbiA9PT0gJ3N0cmluZycpID8gdGhpcy5yZWFzb24gOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlYXNvbik7XG4gICAgICAgIHJldHVybiAnJyArIHRoaXMuY29kZSArICcgLSAnICsgbXNnO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtDbGllbnR9IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7TW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSwgU2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZSwgRW5kcG9pbnRJbnRlcmZhY2V9IGZyb20gJy4uL3Nkay9pbnRlcmZhY2VzJztcbmltcG9ydCB7QmFzZTY0LCBMb2NhbFN0b3JhZ2UsIFhvcn0gZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuL2FqYXgnO1xuaW1wb3J0IHtDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIHtcblxuICAgIHB1YmxpYyBmaWRqSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgZmlkalZlcnNpb246IHN0cmluZztcbiAgICBwdWJsaWMgZmlkakNyeXB0bzogYm9vbGVhbjtcbiAgICBwdWJsaWMgYWNjZXNzVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgYWNjZXNzVG9rZW5QcmV2aW91czogc3RyaW5nO1xuICAgIHB1YmxpYyBpZFRva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIHJlZnJlc2hUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyBzdGF0ZXM6IHsgW3M6IHN0cmluZ106IHsgc3RhdGU6IGJvb2xlYW4sIHRpbWU6IG51bWJlciwgbGFzdFRpbWVXYXNPazogbnVtYmVyIH07IH07IC8vIE1hcDxzdHJpbmcsIGJvb2xlYW4+O1xuICAgIHB1YmxpYyBhcGlzOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT47XG5cbiAgICBwcml2YXRlIGNyeXB0b1NhbHQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNyeXB0b1NhbHROZXh0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjbGllbnQ6IENsaWVudDtcbiAgICBwcml2YXRlIHVzZXI6IGFueTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9hY2Nlc3NUb2tlbiA9ICd2Mi5hY2Nlc3NUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2FjY2Vzc1Rva2VuUHJldmlvdXMgPSAndjIuYWNjZXNzVG9rZW5QcmV2aW91cyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2lkVG9rZW4gPSAndjIuaWRUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3JlZnJlc2hUb2tlbiA9ICd2Mi5yZWZyZXNoVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9zdGF0ZXMgPSAndjIuc3RhdGVzJztcbiAgICBwcml2YXRlIHN0YXRpYyBfY3J5cHRvU2FsdCA9ICd2Mi5jcnlwdG9TYWx0JztcbiAgICBwcml2YXRlIHN0YXRpYyBfY3J5cHRvU2FsdE5leHQgPSAndjIuY3J5cHRvU2FsdC5uZXh0JztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3NkazogU2RrSW50ZXJmYWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX3N0b3JhZ2U6IExvY2FsU3RvcmFnZSkge1xuICAgICAgICB0aGlzLmNsaWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdCA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHQpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCkgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLl9zdG9yYWdlLmdldCgndjIuYWNjZXNzVG9rZW5QcmV2aW91cycpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2lkVG9rZW4pIHx8IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX3N0YXRlcykgfHwge307XG4gICAgICAgIHRoaXMuYXBpcyA9IFtdO1xuICAgIH07XG5cbiAgICBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5pc1JlYWR5KCk7XG4gICAgfVxuXG4gICAgZGVzdHJveShmb3JjZT86IGJvb2xlYW4pOiB2b2lkIHtcblxuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9zdGF0ZXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW5QcmV2aW91cywgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlblByZXZpb3VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgLy8gdGhpcy5jbGllbnQuc2V0Q2xpZW50SWQobnVsbCk7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHt9OyAvLyBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcbiAgICB9XG5cbiAgICBzZXRDbGllbnQoY2xpZW50OiBDbGllbnQpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICAgICAgaWYgKCF0aGlzLnVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcy5fdXNlci5faWQgPSB0aGlzLl9jbGllbnQuY2xpZW50SWQ7XG4gICAgICAgIHRoaXMudXNlci5fbmFtZSA9IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe25hbWU6ICcnfSkpLm5hbWU7XG4gICAgfVxuXG4gICAgc2V0VXNlcih1c2VyOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgaWYgKHRoaXMudXNlci5faWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnNldENsaWVudElkKHRoaXMudXNlci5faWQpO1xuXG4gICAgICAgICAgICAvLyBzdG9yZSBvbmx5IGNsaWVudElkXG4gICAgICAgICAgICBkZWxldGUgdGhpcy51c2VyLl9pZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFVzZXIoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcjtcbiAgICB9XG5cbiAgICBnZXRDbGllbnQoKTogQ2xpZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50O1xuICAgIH1cblxuICAgIHNldENyeXB0b1NhbHQodmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5jcnlwdG9TYWx0ICE9PSB2YWx1ZSAmJiB0aGlzLmNyeXB0b1NhbHROZXh0ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQsIHRoaXMuY3J5cHRvU2FsdE5leHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCkge1xuICAgICAgICBpZiAodGhpcy5jcnlwdG9TYWx0TmV4dCkge1xuICAgICAgICAgICAgdGhpcy5jcnlwdG9TYWx0ID0gdGhpcy5jcnlwdG9TYWx0TmV4dDtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHQsIHRoaXMuY3J5cHRvU2FsdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0KTtcbiAgICB9XG5cbiAgICBlbmNyeXB0KGRhdGE6IGFueSk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0YUFzT2JqID0ge3N0cmluZzogZGF0YX07XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YUFzT2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICByZXR1cm4gWG9yLmVuY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjcnlwdChkYXRhOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBsZXQgZGVjcnlwdGVkID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHROZXh0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIChkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVjcnlwdGVkICYmIGRlY3J5cHRlZC5zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBkZWNyeXB0ZWQuc3RyaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWNyeXB0ZWQ7XG4gICAgfVxuXG4gICAgaXNMb2dpbigpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGV4cCA9IHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZWZyZXNoVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBKU09OLnBhcnNlKEJhc2U2NC5kZWNvZGUocGF5bG9hZCkpO1xuICAgICAgICAgICAgZXhwID0gKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApID49IGRlY29kZWQuZXhwKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFleHA7XG4gICAgfVxuXG4gICAgLy8gdG9kbyByZWludGVncmF0ZSBjbGllbnQubG9naW4oKVxuXG4gICAgbG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudCgpLmxvZ291dCh0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50SWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmNsaWVudElkO1xuICAgIH1cblxuICAgIGdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRUb2tlbjtcbiAgICB9XG5cbiAgICBnZXRJZFBheWxvYWQoZGVmPzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGRlZiAmJiB0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5nZXRJZFRva2VuKCkuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmID8gZGVmIDogbnVsbDtcbiAgICB9XG5cbiAgICBnZXRBY2Nlc3NQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmID8gZGVmIDogbnVsbDtcbiAgICB9XG5cbiAgICBnZXRQcmV2aW91c0FjY2Vzc1BheWxvYWQoZGVmPzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGRlZiAmJiB0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgcmVmcmVzaENvbm5lY3Rpb24oKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIC8vIHN0b3JlIHN0YXRlc1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9zdGF0ZXMsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICAvLyB0b2tlbiBub3QgZXhwaXJlZCA6IG9rXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbmV3IERhdGUoKS5nZXRUaW1lKCkgPCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCA6JywgKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCksIEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwKTtcbiAgICAgICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA8IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmdldFVzZXIoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCByZWZyZXNoVG9rZW5cbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaFRva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZWZyZXNoVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgaWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApID49IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBleHBpcmVkIGFjY2Vzc1Rva2VuICYgaWRUb2tlbiAmIHN0b3JlIGl0IGFzIFByZXZpb3VzIG9uZVxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLmFjY2Vzc1Rva2VuO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldCgndjIuYWNjZXNzVG9rZW5QcmV2aW91cycsIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5faWRUb2tlbik7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSBudWxsO1xuXG4gICAgICAgIC8vIHJlZnJlc2ggYXV0aGVudGljYXRpb25cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50KCkucmVBdXRoZW50aWNhdGUodGhpcy5yZWZyZXNoVG9rZW4pXG4gICAgICAgICAgICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29ubmVjdGlvbih1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MDgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDg7IC8vIG5vIGFwaSB1cmkgb3IgYmFzaWMgdGltZW91dCA6IG9mZmxpbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09IDQwNCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwNDsgLy8gcGFnZSBub3QgZm91bmQgOiBvZmZsaW5lXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MTApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDM7IC8vIHRva2VuIGV4cGlyZWQgb3IgZGV2aWNlIG5vdCBzdXJlIDogbmVlZCByZWxvZ2luXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDAzOyAvLyBmb3JiaWRkZW4gOiBuZWVkIHJlbG9naW5cbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc29sdmUoY29kZSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2V0Q29ubmVjdGlvbihjbGllbnRVc2VyOiBhbnkpOiB2b2lkIHtcblxuICAgICAgICAvLyBvbmx5IGluIHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBpZiAoY2xpZW50VXNlci5hY2Nlc3NfdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBjbGllbnRVc2VyLmFjY2Vzc190b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuLCB0aGlzLmFjY2Vzc1Rva2VuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjbGllbnRVc2VyLmFjY2Vzc190b2tlbjtcblxuICAgICAgICAgICAgY29uc3Qgc2FsdDogc3RyaW5nID0gSlNPTi5wYXJzZSh0aGlzLmdldEFjY2Vzc1BheWxvYWQoe3NhbHQ6ICcnfSkpLnNhbHQ7XG4gICAgICAgICAgICBpZiAoc2FsdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3J5cHRvU2FsdChzYWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VXNlci5pZF90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gY2xpZW50VXNlci5pZF90b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgICAgICBkZWxldGUgY2xpZW50VXNlci5pZF90b2tlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VXNlci5yZWZyZXNoX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IGNsaWVudFVzZXIucmVmcmVzaF90b2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbiwgdGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGNsaWVudFVzZXIucmVmcmVzaF90b2tlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3JlIGNoYW5nZWQgc3RhdGVzXG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3N0YXRlcywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIC8vIGV4cG9zZSByb2xlcywgbWVzc2FnZVxuICAgICAgICAvLyBjbGllbnRVc2VyLnJvbGVzID0gc2VsZi5maWRqUm9sZXMoKTtcbiAgICAgICAgLy8gY2xpZW50VXNlci5tZXNzYWdlID0gc2VsZi5maWRqTWVzc2FnZSgpO1xuICAgICAgICBjbGllbnRVc2VyLnJvbGVzID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgICAgICBjbGllbnRVc2VyLm1lc3NhZ2UgPSBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlO1xuICAgICAgICB0aGlzLnNldFVzZXIoY2xpZW50VXNlcik7XG4gICAgfTtcblxuICAgIHNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnM6IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiB2b2lkIHtcblxuICAgICAgICBpZiAob3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaWRUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gb3B0aW9ucy5pZFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5faWRUb2tlbiwgdGhpcy5pZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5yZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gb3B0aW9ucy5yZWZyZXNoVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VXNlcih7XG4gICAgICAgICAgICByb2xlczogSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzLFxuICAgICAgICAgICAgbWVzc2FnZTogSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZSxcbiAgICAgICAgICAgIF9pZDogJ2RlbW8nXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEFwaUVuZHBvaW50cyhvcHRpb25zPzogQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcblxuICAgICAgICAvLyB0b2RvIDogbGV0IGVhID0gWydodHRwczovL2ZpZGovYXBpJywgJ2h0dHBzOi8vZmlkai1wcm94eS5oZXJva3VhcHAuY29tL2FwaSddO1xuICAgICAgICBsZXQgZWE6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBbXG4gICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cHM6Ly9maWRqL2FwaScsIGJsb2NrZWQ6IGZhbHNlfV07XG4gICAgICAgIGxldCBmaWx0ZXJlZEVhID0gW107XG5cbiAgICAgICAgaWYgKCF0aGlzLl9zZGsucHJvZCkge1xuICAgICAgICAgICAgZWEgPSBbXG4gICAgICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTg5NC9hcGknLCBibG9ja2VkOiBmYWxzZX0sXG4gICAgICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHBzOi8vZmlkai1zYW5kYm94Lmhlcm9rdWFwcC5jb20vYXBpJywgYmxvY2tlZDogZmFsc2V9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZ2V0QWNjZXNzUGF5bG9hZCh7YXBpczogW119KTtcbiAgICAgICAgICAgIGNvbnN0IGFwaUVuZHBvaW50czogRW5kcG9pbnRJbnRlcmZhY2VbXSA9IEpTT04ucGFyc2UodmFsKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZWEgPSBbXTtcbiAgICAgICAgICAgICAgICBhcGlFbmRwb2ludHMuZm9yRWFjaCgoZW5kcG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZHBvaW50LnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGFwaUVuZHBvaW50czogRW5kcG9pbnRJbnRlcmZhY2VbXSA9IEpTT04ucGFyc2UodGhpcy5nZXRQcmV2aW91c0FjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSkpLmFwaXM7XG4gICAgICAgICAgICBpZiAoYXBpRW5kcG9pbnRzICYmIGFwaUVuZHBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhcGlFbmRwb2ludHMuZm9yRWFjaCgoZW5kcG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZHBvaW50LnVybCAmJiBlYS5maWx0ZXIoKHIpID0+IHIudXJsID09PSBlbmRwb2ludC51cmwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgY291bGRDaGVja1N0YXRlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1tlYVtpXS51cmxdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlcikge1xuXG4gICAgICAgICAgICBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmUnKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKSAmJiAoZmlsdGVyZWRFYS5sZW5ndGggPT09IDApOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBlYVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T2xkT25lJykge1xuICAgICAgICAgICAgICAgIGxldCBiZXN0T2xkT25lOiBFbmRwb2ludEludGVyZmFjZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBlYVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0ubGFzdFRpbWVXYXNPayAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCFiZXN0T2xkT25lIHx8IHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0ubGFzdFRpbWVXYXNPayA+IHRoaXMuc3RhdGVzW2Jlc3RPbGRPbmUudXJsXS5sYXN0VGltZVdhc09rKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0T2xkT25lID0gZW5kcG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJlc3RPbGRPbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFYS5wdXNoKGJlc3RPbGRPbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRFYS5wdXNoKGVhWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlcmVkRWEgPSBlYTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZEVhO1xuICAgIH07XG5cbiAgICBnZXREQnMob3B0aW9ucz86IENvbm5lY3Rpb25GaW5kT3B0aW9uc0ludGVyZmFjZSk6IEVuZHBvaW50SW50ZXJmYWNlW10ge1xuXG4gICAgICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9kbyB0ZXN0IHJhbmRvbSBEQiBjb25uZWN0aW9uXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCkgJSAyO1xuICAgICAgICBsZXQgZGJzID0gSlNPTi5wYXJzZSh0aGlzLmdldEFjY2Vzc1BheWxvYWQoe2RiczogW119KSkuZGJzIHx8IFtdO1xuXG4gICAgICAgIC8vIG5lZWQgdG8gc3luY2hyb25pemUgZGJcbiAgICAgICAgaWYgKHJhbmRvbSA9PT0gMCkge1xuICAgICAgICAgICAgZGJzID0gZGJzLnNvcnQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChyYW5kb20gPT09IDEpIHtcbiAgICAgICAgICAgIGRicyA9IGRicy5yZXZlcnNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmlsdGVyZWREQnMgPSBbXTtcbiAgICAgICAgbGV0IGNvdWxkQ2hlY2tTdGF0ZXMgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZXMgJiYgT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCkgJiYgY291bGRDaGVja1N0YXRlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1tkYnNbaV0udXJsXSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmUnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBkYnMubGVuZ3RoKSAmJiAoZmlsdGVyZWREQnMubGVuZ3RoID09PSAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBkYnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZXMnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBkYnMubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBkYnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmUnICYmIGRicy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZpbHRlcmVkREJzLnB1c2goZGJzWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlcmVkREJzID0gZGJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkREJzO1xuICAgIH07XG5cbiAgICB2ZXJpZnlDb25uZWN0aW9uU3RhdGVzKCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICAgIC8vIHRvZG8gbmVlZCB2ZXJpZmljYXRpb24gPyBub3QgeWV0IChjYWNoZSlcbiAgICAgICAgLy8gaWYgKE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZXNbT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpWzBdXS50aW1lO1xuICAgICAgICAvLyAgICAgaWYgKGN1cnJlbnRUaW1lIDwgdGltZSkge1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIHZlcmlmeSB2aWEgR0VUIHN0YXR1cyBvbiBFbmRwb2ludHMgJiBEQnNcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgLy8gdGhpcy5zdGF0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5hcGlzID0gdGhpcy5nZXRBcGlFbmRwb2ludHMoKTtcbiAgICAgICAgdGhpcy5hcGlzLmZvckVhY2goKGVuZHBvaW50T2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgZW5kcG9pbnRVcmw6IHN0cmluZyA9IGVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZW5kcG9pbnRVcmwpIHtcbiAgICAgICAgICAgICAgICBlbmRwb2ludFVybCA9IGVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBlbmRwb2ludFVybCArICcvc3RhdHVzP2lzb2s9JyArIHRoaXMuX3Nkay52ZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmlzb2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0gPSB7c3RhdGU6IHN0YXRlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogY3VycmVudFRpbWV9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VGltZVdhc09rID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VGltZVdhc09rID0gdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0gPSB7c3RhdGU6IGZhbHNlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogbGFzdFRpbWVXYXNPa307XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkYnMgPSB0aGlzLmdldERCcygpO1xuICAgICAgICBkYnMuZm9yRWFjaCgoZGJFbmRwb2ludE9iaikgPT4ge1xuICAgICAgICAgICAgbGV0IGRiRW5kcG9pbnQ6IHN0cmluZyA9IGRiRW5kcG9pbnRPYmoudXJsO1xuICAgICAgICAgICAgaWYgKCFkYkVuZHBvaW50KSB7XG4gICAgICAgICAgICAgICAgZGJFbmRwb2ludCA9IGRiRW5kcG9pbnRPYmoudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBBamF4KClcbiAgICAgICAgICAgICAgICAgICAgLmdldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGRiRW5kcG9pbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogdHJ1ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFRpbWVXYXNPayA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VGltZVdhc09rID0gdGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0ubGFzdFRpbWVXYXNPaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdID0ge3N0YXRlOiBmYWxzZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGxhc3RUaW1lV2FzT2t9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfTtcblxufVxuIiwiLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYic7XG4vLyBsZXQgUG91Y2hEQjogYW55O1xuXG5pbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG5pbXBvcnQge0Vycm9yfSBmcm9tICcuLi9zZGsvZXJyb3InO1xuaW1wb3J0IHtFbmRwb2ludEludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2V9IGZyb20gJy4uL3Nkay9pbnRlcmZhY2VzJztcblxuY29uc3QgRmlkalBvdWNoID0gd2luZG93WydQb3VjaERCJ10gPyB3aW5kb3dbJ1BvdWNoREInXSA6IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0OyAvLyAuZGVmYXVsdDtcblxuLy8gbG9hZCBjb3Jkb3ZhIGFkYXB0ZXIgOiBodHRwczovL2dpdGh1Yi5jb20vcG91Y2hkYi1jb21tdW5pdHkvcG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlL2lzc3Vlcy8yMlxuY29uc3QgUG91Y2hBZGFwdGVyQ29yZG92YVNxbGl0ZSA9IHJlcXVpcmUoJ3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZScpO1xuRmlkalBvdWNoLnBsdWdpbihQb3VjaEFkYXB0ZXJDb3Jkb3ZhU3FsaXRlKTtcblxuZXhwb3J0IGludGVyZmFjZSBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlIHtcbiAgICBvYmo6IE9iamVjdCxcbiAgICBtZXRob2Q6IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgU2Vzc2lvbiB7XG5cbiAgICBwdWJsaWMgZGJSZWNvcmRDb3VudDogbnVtYmVyO1xuICAgIHB1YmxpYyBkYkxhc3RTeW5jOiBudW1iZXI7IC8vIERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBwcml2YXRlIGRiOiBQb3VjaERCOyAvLyBQb3VjaERCXG4gICAgcHJpdmF0ZSByZW1vdGVEYjogUG91Y2hEQjsgLy8gUG91Y2hEQjtcbiAgICBwcml2YXRlIHJlbW90ZVVyaTogc3RyaW5nO1xuICAgIHByaXZhdGUgZGJzOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgIHRoaXMucmVtb3RlRGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRicyA9IFtdO1xuICAgIH07XG5cbiAgICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5kYjtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBjcmVhdGUodWlkOiBzdHJpbmcsIGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsOyAvLyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgbGV0IG9wdHM6IGFueSA9IHtsb2NhdGlvbjogJ2RlZmF1bHQnfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvd1snY29yZG92YSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMgPSB7bG9jYXRpb246ICdkZWZhdWx0JywgYWRhcHRlcjogJ2NvcmRvdmEtc3FsaXRlJ307XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGNvbnN0IHBsdWdpbiA9IHJlcXVpcmUoJ3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZScpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICBpZiAocGx1Z2luKSB7IFBvdWNoLnBsdWdpbihwbHVnaW4pOyB9XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuZGIgPSBuZXcgUG91Y2goJ2ZpZGpfZGInLCB7YWRhcHRlcjogJ2NvcmRvdmEtc3FsaXRlJ30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGIgPSBuZXcgRmlkalBvdWNoKCdmaWRqX2RiXycgKyB1aWQsIG9wdHMpOyAvLyAsIHthZGFwdGVyOiAnd2Vic3FsJ30gPz8/XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kYi5pbmZvKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGluZm8pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyBpZiAoaW5mby5hZGFwdGVyICE9PSAnd2Vic3FsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGhpcy5kYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5ld29wdHM6IGFueSA9IG9wdHMgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXdvcHRzLmFkYXB0ZXIgPSAnaWRiJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBuZXdkYiA9IG5ldyBQb3VjaCgnZmlkal9kYicsIG9wdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5kYi5yZXBsaWNhdGUudG8obmV3ZGIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLmRiID0gbmV3ZGI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIudG9TdHJpbmcoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyKSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3koKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGIgJiYgIXRoaXMuZGIuZGVzdHJveSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGEgdmFsaWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5kZXN0cm95KChlcnIsIGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIHNldFJlbW90ZShkYnM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPik6IHZvaWQge1xuICAgICAgICB0aGlzLmRicyA9IGRicztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3luYyh1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgZGInKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmRicyB8fCAhdGhpcy5kYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgYSByZW1vdGUgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZW1vdGVEYiB8fCB0aGlzLnJlbW90ZVVyaSAhPT0gdGhpcy5kYnNbMF0udXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlVXJpID0gdGhpcy5kYnNbMF0udXJsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW90ZURiID0gbmV3IEZpZGpQb3VjaCh0aGlzLnJlbW90ZVVyaSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gLCB7aGVhZGVyczogeydBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgaWRfdG9rZW59fSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kYi5yZXBsaWNhdGUudG8odGhpcy5yZW1vdGVEYilcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjb21wbGV0ZScsIChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdGVEYi5yZXBsaWNhdGUudG8odGhpcy5kYixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICghIXVzZXJJZCAmJiAhIWRvYyAmJiBkb2MuZmlkalVzZXJJZCA9PT0gdXNlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjb21wbGV0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2dnZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdkZW5pZWQnLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiBlcnJ9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2Vycm9yJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDEsIHJlYXNvbjogZXJyfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGVuaWVkJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogZXJyfSkpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMSwgcmVhc29uOiBlcnJ9KSk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHB1dChkYXRhOiBhbnksXG4gICAgICAgICAgICAgICBfaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIHVpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgb2lkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBhdmU6IHN0cmluZyxcbiAgICAgICAgICAgICAgIGNyeXB0bz86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGEgfHwgIV9pZCB8fCAhdWlkIHx8ICFvaWQgfHwgIWF2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICduZWVkIGZvcm1hdGVkIGRhdGEnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhV2l0aG91dElkcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICBjb25zdCB0b1N0b3JlOiBhbnkgPSB7XG4gICAgICAgICAgICBfaWQ6IF9pZCxcbiAgICAgICAgICAgIGZpZGpVc2VySWQ6IHVpZCxcbiAgICAgICAgICAgIGZpZGpPcmdJZDogb2lkLFxuICAgICAgICAgICAgZmlkakFwcFZlcnNpb246IGF2ZVxuICAgICAgICB9O1xuICAgICAgICBpZiAoZGF0YVdpdGhvdXRJZHMuX3Jldikge1xuICAgICAgICAgICAgdG9TdG9yZS5fcmV2ID0gJycgKyBkYXRhV2l0aG91dElkcy5fcmV2O1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5faWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5fcmV2O1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkalVzZXJJZDtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpPcmdJZDtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpBcHBWZXJzaW9uO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkakRhdGE7XG5cbiAgICAgICAgbGV0IHJlc3VsdEFzU3RyaW5nID0gU2Vzc2lvbi53cml0ZShTZXNzaW9uLnZhbHVlKGRhdGFXaXRob3V0SWRzKSk7XG4gICAgICAgIGlmIChjcnlwdG8pIHtcbiAgICAgICAgICAgIHJlc3VsdEFzU3RyaW5nID0gY3J5cHRvLm9ialtjcnlwdG8ubWV0aG9kXShyZXN1bHRBc1N0cmluZyk7XG4gICAgICAgICAgICB0b1N0b3JlLmZpZGpEYWNyID0gcmVzdWx0QXNTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1N0b3JlLmZpZGpEYXRhID0gcmVzdWx0QXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5wdXQodG9TdG9yZSwgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2Uub2sgJiYgcmVzcG9uc2UuaWQgJiYgcmVzcG9uc2UucmV2KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCsrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHByb3BhZ2F0ZSBfcmV2ICYgX2lkXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChkYXRhIGFzIGFueSkuX3JldiA9IHJlc3BvbnNlLnJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIChkYXRhIGFzIGFueSkuX2lkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZShkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIuZ2V0KGRhdGFfaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkb2MuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYi5wdXQoZG9jKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQoZGF0YV9pZDogc3RyaW5nLCBjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIuZ2V0KGRhdGFfaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4ocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhcm93ICYmICghIXJvdy5maWRqRGFjciB8fCAhIXJvdy5maWRqRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcm93LmZpZGpEYWNyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNyeXB0byAmJiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5maWRqRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJvdy5maWRqRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRBc0pzb24gPSBTZXNzaW9uLmV4dHJhY3RKc29uKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdEFzSnNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5faWQgPSByb3cuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5fcmV2ID0gcm93Ll9yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdEFzSnNvbikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcm93Ll9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyb3cuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ0JhZCBlbmNvZGluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTm8gZGF0YSBmb3VuZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QWxsKGNyeXB0bz86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2UpOiBQcm9taXNlPEFycmF5PGFueT4gfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYiB8fCAhKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05lZWQgYSB2YWxpZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAodGhpcy5kYiBhcyBhbnkpLmFsbERvY3Moe2luY2x1ZGVfZG9jczogdHJ1ZSwgZGVzY2VuZGluZzogdHJ1ZX0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocm93cyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICByb3dzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhcm93ICYmICEhcm93LmRvYy5faWQgJiYgKCEhcm93LmRvYy5maWRqRGFjciB8fCAhIXJvdy5kb2MuZmlkakRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByb3cuZG9jLmZpZGpEYWNyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjcnlwdG8gJiYgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY3J5cHRvLm9ialtjcnlwdG8ubWV0aG9kXShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5kb2MuZmlkakRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2Uocm93LmRvYy5maWRqRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdEFzSnNvbiA9IFNlc3Npb24uZXh0cmFjdEpzb24oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdEFzSnNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX2lkID0gcm93LmRvYy5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5fcmV2ID0gcm93LmRvYy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGwucHVzaChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdEFzSnNvbikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWQgZW5jb2RpbmcgOiBkZWxldGUgcm93Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX2lkID0gcm93LmRvYy5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbi5fcmV2ID0gcm93LmRvYy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGwucHVzaChyZXN1bHRBc0pzb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyb3cuZG9jLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWQgZW5jb2RpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYWxsKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzRW1wdHkoKTogUHJvbWlzZTxib29sZWFuIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIgfHwgISh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdObyBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAodGhpcy5kYiBhcyBhbnkpLmFsbERvY3Moe1xuICAgICAgICAgICAgICAgIC8vIGZpbHRlcjogIChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi51c2VyIHx8ICFzZWxmLmNvbm5lY3Rpb24udXNlci5faWQpIHJldHVybiBkb2M7XG4gICAgICAgICAgICAgICAgLy8gICAgaWYgKGRvYy5maWRqVXNlcklkID09PSBzZWxmLmNvbm5lY3Rpb24udXNlci5faWQpIHJldHVybiBkb2M7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdObyByZXNwb25zZScpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IHJlc3BvbnNlLnRvdGFsX3Jvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UudG90YWxfcm93cyAmJiByZXNwb25zZS50b3RhbF9yb3dzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGluZm8oKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05vIGRiJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRiLmluZm8oKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgd3JpdGUoaXRlbTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHZhbHVlID0gJ251bGwnO1xuICAgICAgICBjb25zdCB0ID0gdHlwZW9mKGl0ZW0pO1xuICAgICAgICBpZiAodCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7c3RyaW5nOiBpdGVtfSlcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7bnVtYmVyOiBpdGVtfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtib29sOiBpdGVtfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe2pzb246IGl0ZW19KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgc3RhdGljIHZhbHVlKGl0ZW06IGFueSk6IGFueSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBpdGVtO1xuICAgICAgICBpZiAodHlwZW9mKGl0ZW0pICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGl0ZW07XG4gICAgICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5zdHJpbmc7XG4gICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5udW1iZXIudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdib29sJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmJvb2wudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdqc29uJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmpzb247XG4gICAgICAgICAgICBpZiAodHlwZW9mKHJlc3VsdCkgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGV4dHJhY3RKc29uKGl0ZW06IGFueSk6IGFueSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBpdGVtO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKGl0ZW0pID09PSAnb2JqZWN0JyAmJiAnanNvbicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5qc29uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3VsdCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAocmVzdWx0KSA9PT0gJ29iamVjdCcgJiYgJ2pzb24nIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gKHJlc3VsdCBhcyBhbnkpLmpzb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG59XG4iLCIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGltcG9ydCAqIGFzIFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0ICogYXMgdmVyc2lvbiBmcm9tICcuLi92ZXJzaW9uJztcbmltcG9ydCAqIGFzIHRvb2xzIGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCAqIGFzIGNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgKiBhcyBzZXNzaW9uIGZyb20gJy4uL3Nlc3Npb24nO1xuaW1wb3J0IHtcbiAgICBMb2dnZXJJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgU2RrSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7U2Vzc2lvbkNyeXB0b0ludGVyZmFjZX0gZnJvbSAnLi4vc2Vzc2lvbi9zZXNzaW9uJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHtBamF4fSBmcm9tICcuLi9jb25uZWN0aW9uL2FqYXgnO1xuXG4vLyBjb25zdCBQb3VjaERCID0gd2luZG93WydQb3VjaERCJ10gfHwgcmVxdWlyZSgncG91Y2hkYicpLmRlZmF1bHQ7XG5cbi8qKlxuICogcGxlYXNlIHVzZSBpdHMgYW5ndWxhci5qcyBvciBhbmd1bGFyLmlvIHdyYXBwZXJcbiAqIHVzZWZ1bGwgb25seSBmb3IgZmlkaiBkZXYgdGVhbVxuICovXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgc2RrOiBTZGtJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlckludGVyZmFjZTtcbiAgICBwcml2YXRlIHByb21pc2U6IFByb21pc2VDb25zdHJ1Y3RvcjtcbiAgICBwcml2YXRlIHN0b3JhZ2U6IHRvb2xzLkxvY2FsU3RvcmFnZTtcbiAgICBwcml2YXRlIHNlc3Npb246IHNlc3Npb24uU2Vzc2lvbjtcbiAgICBwcml2YXRlIGNvbm5lY3Rpb246IGNvbm5lY3Rpb24uQ29ubmVjdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlLCBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3IpIHtcblxuICAgICAgICB0aGlzLnNkayA9IHtcbiAgICAgICAgICAgIG9yZzogJ2ZpZGonLFxuICAgICAgICAgICAgdmVyc2lvbjogdmVyc2lvbi52ZXJzaW9uLFxuICAgICAgICAgICAgcHJvZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSB7XG4gICAgICAgICAgICBsb2c6ICgpID0+IHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm46ICgpID0+IHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGxvZ2dlciAmJiB3aW5kb3cuY29uc29sZSAmJiBsb2dnZXIgPT09IHdpbmRvdy5jb25zb2xlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvciA9IHdpbmRvdy5jb25zb2xlLmVycm9yO1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIud2FybiA9IHdpbmRvdy5jb25zb2xlLndhcm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlIDogY29uc3RydWN0b3InKTtcbiAgICAgICAgaWYgKHByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IHRvb2xzLkxvY2FsU3RvcmFnZSh3aW5kb3cubG9jYWxTdG9yYWdlLCAnZmlkai4nKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gbmV3IHNlc3Npb24uU2Vzc2lvbigpO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBuZXcgY29ubmVjdGlvbi5Db25uZWN0aW9uKHRoaXMuc2RrLCB0aGlzLnN0b3JhZ2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgY29ubmVjdGlvbiAmIHNlc3Npb25cbiAgICAgKiBDaGVjayB1cmlcbiAgICAgKiBEb25lIGVhY2ggYXBwIHN0YXJ0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpJZCAgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqU2FsdCByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpWZXJzaW9uIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZGV2TW9kZSBvcHRpb25hbCBkZWZhdWx0IGZhbHNlLCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpJbml0KGZpZGpJZDogc3RyaW5nLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogJywgb3B0aW9ucyk7XG4gICAgICAgIGlmICghZmlkaklkKSB7XG4gICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6IGJhZCBpbml0Jyk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhIGZpZGpJZCcpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc2RrLnByb2QgPSAhb3B0aW9ucyA/IHRydWUgOiBvcHRpb25zLnByb2Q7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpJZCA9IGZpZGpJZDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpWZXJzaW9uID0gc2VsZi5zZGsudmVyc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8gPSAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2NyeXB0bycpKSA/IHRydWUgOiBvcHRpb25zLmNyeXB0bztcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdGhlQmVzdFVybDogYW55ID0gc2VsZi5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9uZSd9KVswXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RPbGRVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbGRPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzTG9naW4gPSBzZWxmLmZpZGpJc0xvZ2luKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwgJiYgdGhlQmVzdFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RVcmwgPSB0aGVCZXN0VXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlQmVzdE9sZFVybCAmJiB0aGVCZXN0T2xkVXJsLnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlQmVzdE9sZFVybCA9IHRoZUJlc3RPbGRVcmwudXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xvZ2luICYmIHRoZUJlc3RPbGRVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDbGllbnQobmV3IGNvbm5lY3Rpb24uQ2xpZW50KHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRoZUJlc3RPbGRVcmwsIHNlbGYuc3RvcmFnZSwgc2VsZi5zZGspKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDA0LCAnTmVlZCBvbmUgY29ubmVjdGlvbiAtIG9yIHRvbyBvbGQgU0RLIHZlcnNpb24gKGNoZWNrIHVwZGF0ZSknKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQ6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIudG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBpdCBpZiBmaWRqSXNMb2dpbigpID09PSBmYWxzZVxuICAgICAqIEVyYXNlIGFsbCAoZGIgJiBzdG9yYWdlKVxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9sb2dpbkludGVybmFsKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbih1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luOiAnLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmFjY2Vzc1Rva2VuIG9wdGlvbmFsXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaWRUb2tlbiAgb3B0aW9uYWxcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBnZW5lcmF0ZSBvbmUgZGF5IHRva2VucyBpZiBub3Qgc2V0XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIG5vdy5zZXREYXRlKG5vdy5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgICAgIGNvbnN0IHRvbW9ycm93ID0gbm93LmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICByb2xlczogW10sXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2RlbW8nLFxuICAgICAgICAgICAgICAgIGFwaXM6IFtdLFxuICAgICAgICAgICAgICAgIGVuZHBvaW50czoge30sXG4gICAgICAgICAgICAgICAgZGJzOiBbXSxcbiAgICAgICAgICAgICAgICBleHA6IHRvbW9ycm93XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zdCBqd3RTaWduID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBqd3RTaWduICsgJy4nICsgcGF5bG9hZCArICcuJyArIGp3dFNpZ247XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICBpZFRva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IHRva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q29ubmVjdGlvbk9mZmxpbmUob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqTG9naW4gZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpHZXRFbmRwb2ludHMoZmlsdGVyPzogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UpOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghZmlsdGVyKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSB7c2hvd0Jsb2NrZWQ6IGZhbHNlfTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kcG9pbnRzID0gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0QWNjZXNzUGF5bG9hZCh7ZW5kcG9pbnRzOiBbXX0pKS5lbmRwb2ludHM7XG4gICAgICAgIGlmICghZW5kcG9pbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBlbmRwb2ludHMgPSBlbmRwb2ludHMuZmlsdGVyKChlbmRwb2ludDogRW5kcG9pbnRJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgIGxldCBvayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob2sgJiYgZmlsdGVyLmtleSkge1xuICAgICAgICAgICAgICAgIG9rID0gKGVuZHBvaW50LmtleSA9PT0gZmlsdGVyLmtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2sgJiYgIWZpbHRlci5zaG93QmxvY2tlZCkge1xuICAgICAgICAgICAgICAgIG9rID0gIWVuZHBvaW50LmJsb2NrZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2s7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZW5kcG9pbnRzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJvbGVzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHtyb2xlczogW119KSkucm9sZXM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkaklzTG9naW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uaXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakxvZ291dCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGFfQXJnIGFyZyB0byBzZXQgdG8gZm5Jbml0Rmlyc3REYXRhKClcbiAgICAgKiBAcmV0dXJucyAgcHJvbWlzZVxuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqU3luYyhmbkluaXRGaXJzdERhdGE/LCBmbkluaXRGaXJzdERhdGFfQXJnPyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMnKTtcbiAgICAgICAgLy8gaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgIC8vICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIDogREIgc3luYyBpbXBvc3NpYmxlLiBEaWQgeW91IGxvZ2luID8nKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IGZpcnN0U3luYyA9IChzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9PT0gbnVsbCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnN5bmMoc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgcmVzb2x2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci53YXJuKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHdhcm46ICcsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGlzRW1wdHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIGlzRW1wdHkgOiAnLCBpc0VtcHR5LCBmaXJzdFN5bmMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZUVtcHR5LCByZWplY3RFbXB0eU5vdFVzZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5ICYmIGZpcnN0U3luYyAmJiBmbkluaXRGaXJzdERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBmbkluaXRGaXJzdERhdGEoZm5Jbml0Rmlyc3REYXRhX0FyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAmJiByZXRbJ2NhdGNoJ10gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQudGhlbihyZXNvbHZlRW1wdHkpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2cocmV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlRW1wdHkoKTsgLy8gc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIGZuSW5pdEZpcnN0RGF0YSByZXNvbHZlZDogJywgaW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaW5mbygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuZG9jX2NvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IHJlc3VsdC5kb2NfY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIF9kYlJlY29yZENvdW50IDogJyArIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBFcnJvckludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09IDQwMyB8fCBlcnIuY29kZSA9PT0gNDEwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWRqTG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246ICdTeW5jaHJvbml6YXRpb24gdW5hdXRob3JpemVkIDogbmVlZCB0byBsb2dpbiBhZ2Fpbi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyciAmJiBlcnIuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyB3aGF0IHRvIGRvIHdpdGggdGhpcyBlcnIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyTWVzc2FnZSA9ICdFcnJvciBkdXJpbmcgc3luY3JvbmlzYXRpb246ICcgKyBlcnIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbGYubG9nZ2VyLmVycm9yKGVyck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA1MDAsIHJlYXNvbjogZXJyTWVzc2FnZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUHV0SW5EYihkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalB1dEluRGI6ICcsIGRhdGEpO1xuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkgfHwgIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdEQiBwdXQgaW1wb3NzaWJsZS4gTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBfaWQ6IHN0cmluZztcbiAgICAgICAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2YoJ19pZCcpKSB7XG4gICAgICAgICAgICBfaWQgPSBkYXRhLl9pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV9pZCkge1xuICAgICAgICAgICAgX2lkID0gc2VsZi5fZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdlbmNyeXB0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5wdXQoXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCksXG4gICAgICAgICAgICBzZWxmLnNkay5vcmcsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24sXG4gICAgICAgICAgICBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalJlbW92ZUluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUmVtb3ZlSW5EYiAnLCBkYXRhX2lkKTtcblxuICAgICAgICBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdEQiByZW1vdmUgaW1wb3NzaWJsZS4gJyArXG4gICAgICAgICAgICAgICAgJ05lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGFfaWQgfHwgdHlwZW9mIGRhdGFfaWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnREIgcmVtb3ZlIGltcG9zc2libGUuICcgK1xuICAgICAgICAgICAgICAgICdOZWVkIHRoZSBkYXRhLl9pZC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnJlbW92ZShkYXRhX2lkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpIHx8ICFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnZmlkai5zZGsuc2VydmljZS5maWRqRmluZEluRGIgOiBuZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldChkYXRhX2lkLCBjcnlwdG8pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakZpbmRBbGxJbkRiKCk6IFByb21pc2U8QXJyYXk8YW55PiB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkgfHwgIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZGVjcnlwdCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmdldEFsbChjcnlwdG8pXG4gICAgICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlc29sdmUoKHJlc3VsdHMgYXMgQXJyYXk8YW55PikpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUG9zdE9uRW5kcG9pbnQoa2V5OiBzdHJpbmcsIGRhdGE/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IGZpbHRlcjogRW5kcG9pbnRGaWx0ZXJJbnRlcmZhY2UgPSB7XG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlbmRwb2ludHMgPSB0aGlzLmZpZGpHZXRFbmRwb2ludHMoZmlsdGVyKTtcbiAgICAgICAgaWYgKCFlbmRwb2ludHMgfHwgZW5kcG9pbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgICAgICAgbmV3IEVycm9yKDQwMCxcbiAgICAgICAgICAgICAgICAgICAgJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalBvc3RPbkVuZHBvaW50IDogZW5kcG9pbnQgZG9lcyBub3QgZXhpc3QuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW5kcG9pbnRVcmwgPSBlbmRwb2ludHNbMF0udXJsO1xuICAgICAgICBjb25zdCBqd3QgPSB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRVcmwsXG4gICAgICAgICAgICAgICAgLy8gbm90IHVzZWQgOiB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGp3dFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqR2V0SWRUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgLy8gSW50ZXJuYWwgZnVuY3Rpb25zXG5cbiAgICAvKipcbiAgICAgKiBMb2dvdXQgdGhlbiBMb2dpblxuICAgICAqXG4gICAgICogQHBhcmFtIGxvZ2luXG4gICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICogQHBhcmFtIHVwZGF0ZVByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIF9sb2dpbkludGVybmFsKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuX2xvZ2luSW50ZXJuYWwnKTtcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAzLCAnTmVlZCBhbiBpbnRpYWxpemVkIEZpZGpTZXJ2aWNlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50KCkubG9naW4obG9naW4sIHBhc3N3b3JkLCB1cGRhdGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4obG9naW5Vc2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luVXNlci5lbWFpbCA9IGxvZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShsb2dpblVzZXIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsIGVycm9yIDogJyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBfcmVtb3ZlQWxsKCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5kZXN0cm95KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uZGVzdHJveSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF9jcmVhdGVTZXNzaW9uKHVpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgdGhpcy5zZXNzaW9uLnNldFJlbW90ZSh0aGlzLmNvbm5lY3Rpb24uZ2V0REJzKHtmaWx0ZXI6ICd0aGVCZXN0T25lcyd9KSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHVpZCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgX3Rlc3RQcm9taXNlKGE/KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rICcgKyBhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHRoaXMucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2snKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9zcnZEYXRhVW5pcUlkID0gMDtcblxuICAgIHByaXZhdGUgX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoYXBwTmFtZSwgdHlwZT8sIG5hbWU/KSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHNpbXBsZURhdGUgPSAnJyArIG5vdy5nZXRGdWxsWWVhcigpICsgJycgKyBub3cuZ2V0TW9udGgoKSArICcnICsgbm93LmdldERhdGUoKVxuICAgICAgICAgICAgKyAnJyArIG5vdy5nZXRIb3VycygpICsgJycgKyBub3cuZ2V0TWludXRlcygpOyAvLyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHNlcXVJZCA9ICsrSW50ZXJuYWxTZXJ2aWNlLl9zcnZEYXRhVW5pcUlkO1xuICAgICAgICBsZXQgVUlkID0gJyc7XG4gICAgICAgIGlmIChhcHBOYW1lICYmIGFwcE5hbWUuY2hhckF0KDApKSB7XG4gICAgICAgICAgICBVSWQgKz0gYXBwTmFtZS5jaGFyQXQoMCkgKyAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSB0eXBlLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZSAmJiBuYW1lLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgIFVJZCArPSBuYW1lLnN1YnN0cmluZygwLCA0KTtcbiAgICAgICAgfVxuICAgICAgICBVSWQgKz0gc2ltcGxlRGF0ZSArICcnICsgc2VxdUlkO1xuICAgICAgICByZXR1cm4gVUlkO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UsIE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsXG4gICAgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge0ludGVybmFsU2VydmljZX0gZnJvbSAnLi9pbnRlcm5hbC5zZXJ2aWNlJztcbmltcG9ydCB7RXJyb3IgYXMgRmlkakVycm9yfSBmcm9tICcuLi9jb25uZWN0aW9uJztcblxuLyoqXG4gKiBBbmd1bGFyMisgRmlkalNlcnZpY2VcbiAqIEBzZWUgTW9kdWxlU2VydmljZUludGVyZmFjZVxuICpcbiAqIEBleGVtcGxlXG4gKiAgICAgIC8vIC4uLiBhZnRlciBpbnN0YWxsIDpcbiAqICAgICAgLy8gJCBucG0gaW5zdGFsbCAtLXNhdmUtZGV2IGZpZGpcbiAqICAgICAgLy8gdGhlbiBpbml0IHlvdXIgYXBwLmpzICYgdXNlIGl0IGluIHlvdXIgc2VydmljZXNcbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni9yYXcvNWZmZjY5ZGQ5YzE1ZjY5MmE4NTZkYjYyY2YzMzRiNzI0ZWYzZjRhYy9hbmd1bGFyLmZpZGouaW5qZWN0LmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLnN5bmMuanNcIj48L3NjcmlwdD5cbiAqXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlkalNlcnZpY2UgaW1wbGVtZW50cyBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlIHtcblxuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBmaWRqU2VydmljZTogSW50ZXJuYWxTZXJ2aWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlclNlcnZpY2UoKTtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gUHJvbWlzZTtcbiAgICAgICAgdGhpcy5maWRqU2VydmljZSA9IG51bGw7XG4gICAgICAgIC8vIGxldCBwb3VjaGRiUmVxdWlyZWQgPSBQb3VjaERCO1xuICAgICAgICAvLyBwb3VjaGRiUmVxdWlyZWQuZXJyb3IoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGluaXQoZmlkaklkLCBvcHRpb25zPzogTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlID0gbmV3IEludGVybmFsU2VydmljZSh0aGlzLmxvZ2dlciwgdGhpcy5wcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZEVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldEF1dGhFbmRwb2ludChvcHRpb25zLmZvcmNlZEVuZHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0REJFbmRwb2ludChvcHRpb25zLmZvcmNlZERCRW5kcG9pbnQpO1xuICAgICAgICB9Ki9cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakluaXQoZmlkaklkLCBvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ2luKGxvZ2luLCBwYXNzd29yZCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9naW4obG9naW4sIHBhc3N3b3JkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ2luQXNEZW1vKG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW5Bc0RlbW8gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbkluRGVtb01vZGUob3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gdGhpcy5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuYW5ndWxhcjIuaXNMb2dnZWRJbiA6IG5vdCBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSXNMb2dpbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0Um9sZXMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpSb2xlcygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0RW5kcG9pbnRzKCk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRFbmRwb2ludHMoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHBvc3RPbkVuZHBvaW50KGtleTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbkFzRGVtbyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalBvc3RPbkVuZHBvaW50KGtleSwgZGF0YSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpHZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpNZXNzYWdlKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dvdXQoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ291dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ291dCgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFN5bmNocm9uaXplIERCXG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YSAgYSBmdW5jdGlvbiB3aXRoIGRiIGFzIGlucHV0IGFuZCB0aGF0IHJldHVybiBwcm9taXNlOiBjYWxsIGlmIERCIGlzIGVtcHR5XG4gICAgICogQHJldHVybnMgcHJvbWlzZSB3aXRoIHRoaXMuc2Vzc2lvbi5kYlxuICAgICAqIEBtZW1iZXJvZiBmaWRqLmFuZ3VsYXJTZXJ2aWNlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBsZXQgaW5pdERiID0gZnVuY3Rpb24oKSB7XG4gICAgICogICAgIHRoaXMuZmlkalNlcnZpY2UucHV0KCdteSBmaXJzdCByb3cnKTtcbiAgICAgKiAgfTtcbiAgICAgKiAgdGhpcy5maWRqU2VydmljZS5zeW5jKGluaXREYilcbiAgICAgKiAgLnRoZW4odXNlciA9PiAuLi4pXG4gICAgICogIC5jYXRjaChlcnIgPT4gLi4uKVxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIHN5bmMoZm5Jbml0Rmlyc3REYXRhPyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5zeW5jIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqU3luYyhmbkluaXRGaXJzdERhdGEsIHRoaXMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSBkYXRhIGluIHlvdXIgc2Vzc2lvblxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGEgdG8gc3RvcmVcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBwdXQoZGF0YTogYW55KTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIucHV0IDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUHV0SW5EYihkYXRhKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmluZCBvYmplY3QgSWQgYW5kIHJlbW92ZSBpdCBmcm9tIHlvdXIgc2Vzc2lvblxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIG9mIG9iamVjdCB0byBmaW5kIGFuZCByZW1vdmVcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmUoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5yZW1vdmUgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpSZW1vdmVJbkRiKGlkKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmluZFxuICAgICAqL1xuICAgIHB1YmxpYyBmaW5kKGlkOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5maW5kIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqRmluZEluRGIoaWQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmluZEFsbCgpOiBQcm9taXNlPGFueVtdIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLmZpbmRBbGwgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpGaW5kQWxsSW5EYigpO1xuICAgIH07XG5cbn1cblxuZXhwb3J0IGNsYXNzIExvZ2dlclNlcnZpY2UgaW1wbGVtZW50cyBMb2dnZXJJbnRlcmZhY2Uge1xuICAgIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgZXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgd2FybihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RmlkalNlcnZpY2V9IGZyb20gJy4vYW5ndWxhci5zZXJ2aWNlJztcblxuXG4vKipcbiAqIGBOZ01vZHVsZWAgd2hpY2ggcHJvdmlkZXMgYXNzb2NpYXRlZCBzZXJ2aWNlcy5cbiAqXG4gKiAuLi5cbiAqXG4gKiBAc3RhYmxlXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW10sXG5cbiAgICBleHBvcnRzOiBbXSxcblxuICAgIHByb3ZpZGVyczogW0ZpZGpTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBGaWRqTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBtb2R1bGUgRmlkak1vZHVsZVxuICpcbiAqIGV4ZW1wbGVcbiAqICAgICAgLy8gLi4uIGFmdGVyIGluc3RhbGwgOlxuICogICAgICAvLyAkIG5wbSBpbnN0YWxsIGZpZGpcbiAqICAgICAgLy8gdGhlbiBpbml0IHlvdXIgYXBwLmpzICYgdXNlIGl0IGluIHlvdXIgc2VydmljZXNcbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYuanNcIj48L3NjcmlwdD5cbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYuanNcIj48L3NjcmlwdD5cbiAqL1xuIl0sIm5hbWVzIjpbIkVycm9yIiwidmVyc2lvbi52ZXJzaW9uIiwidG9vbHMuTG9jYWxTdG9yYWdlIiwic2Vzc2lvbi5TZXNzaW9uIiwiY29ubmVjdGlvbi5Db25uZWN0aW9uIiwiY29ubmVjdGlvbi5DbGllbnQiLCJ0b29scy5CYXNlNjQiLCJGaWRqRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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