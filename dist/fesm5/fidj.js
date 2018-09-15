import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Base64 = /** @class */ (function () {
    function Base64() {
    }
    /**
     * Decodes string from Base64 string
     * @param {?} input
     * @return {?}
     */
    Base64.encode = /**
     * Decodes string from Base64 string
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (!input) {
            return null;
        }
        return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt('0x' + p1, 16));
        }));
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Base64.decode = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (!input) {
            return null;
        }
        return decodeURIComponent(atob(input).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };
    return Base64;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
var  /**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
LocalStorage = /** @class */ (function () {
    // Constructor
    function LocalStorage(storageService, storageKey) {
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
    /**
     * Sets a key's value.
     *
     * @param {?} key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param {?} value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @return {?} the stored value which is a container of user value.
     */
    LocalStorage.prototype.set = /**
     * Sets a key's value.
     *
     * @param {?} key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param {?} value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @return {?} the stored value which is a container of user value.
     */
    function (key, value) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        var t = typeof (value);
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
    };
    /**
     * Looks up a key in cache
     *
     * @param key - Key to look up.
     * @param def - Default value to return, if key didn't exist.
     * @returns the key value, default value or <null>
     */
    /**
     * Looks up a key in cache
     *
     * @param {?} key - Key to look up.
     * @param {?=} def - Default value to return, if key didn't exist.
     * @return {?} the key value, default value or <null>
     */
    LocalStorage.prototype.get = /**
     * Looks up a key in cache
     *
     * @param {?} key - Key to look up.
     * @param {?=} def - Default value to return, if key didn't exist.
     * @return {?} the key value, default value or <null>
     */
    function (key, def) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        var item = this.storage.getItem(key);
        if (item !== null) {
            if (item === 'null') {
                return null;
            }
            /** @type {?} */
            var value = JSON.parse(item);
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
    };
    /**
     * Deletes a key from cache.
     *
     * @param  key - Key to delete.
     * @returns true if key existed or false if it didn't
     */
    /**
     * Deletes a key from cache.
     *
     * @param {?} key - Key to delete.
     * @return {?} true if key existed or false if it didn't
     */
    LocalStorage.prototype.remove = /**
     * Deletes a key from cache.
     *
     * @param {?} key - Key to delete.
     * @return {?} true if key existed or false if it didn't
     */
    function (key) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        var existed = (this.storage.getItem(key) !== null);
        this.storage.removeItem(key);
        return existed;
    };
    /**
     * Deletes everything in cache.
     *
     * @return true
     */
    /**
     * Deletes everything in cache.
     *
     * @return {?} true
     */
    LocalStorage.prototype.clear = /**
     * Deletes everything in cache.
     *
     * @return {?} true
     */
    function () {
        /** @type {?} */
        var existed = (this.storage.length > 0);
        this.storage.clear();
        return existed;
    };
    /**
     * How much space in bytes does the storage take?
     *
     * @returns Number
     */
    /**
     * How much space in bytes does the storage take?
     *
     * @return {?} Number
     */
    LocalStorage.prototype.size = /**
     * How much space in bytes does the storage take?
     *
     * @return {?} Number
     */
    function () {
        return this.storage.length;
    };
    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param f - Function to call on every item.
     * @param  context - Context (this for example).
     * @returns Number of items in storage
     */
    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param {?} f - Function to call on every item.
     * @param {?} context - Context (this for example).
     * @return {?} Number of items in storage
     */
    LocalStorage.prototype.foreach = /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param {?} f - Function to call on every item.
     * @param {?} context - Context (this for example).
     * @return {?} Number of items in storage
     */
    function (f, context) {
        /** @type {?} */
        var n = this.storage.length;
        for (var i = 0; i < n; i++) {
            /** @type {?} */
            var key = this.storage.key(i);
            /** @type {?} */
            var value = this.get(key);
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
    };
    /**
     * @param {?} key
     * @return {?}
     */
    LocalStorage.prototype.checkKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (!key || (typeof key !== 'string')) {
            throw new TypeError('Key type must be string');
        }
        return true;
    };
    return LocalStorage;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Xor = /** @class */ (function () {
    function Xor() {
    }
    /**
     * @param {?} value
     * @param {?} key
     * @return {?}
     */
    Xor.encrypt = /**
     * @param {?} value
     * @param {?} key
     * @return {?}
     */
    function (value, key) {
        /** @type {?} */
        var result = '';
        value = Xor.header + value;
        for (var i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        result = Base64.encode(result);
        return result;
    };
    /**
     * @param {?} value
     * @param {?} key
     * @param {?=} oldStyle
     * @return {?}
     */
    Xor.decrypt = /**
     * @param {?} value
     * @param {?} key
     * @param {?=} oldStyle
     * @return {?}
     */
    function (value, key, oldStyle) {
        /** @type {?} */
        var result = '';
        value = Base64.decode(value);
        for (var i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        if (!oldStyle && Xor.header !== result.substring(0, Xor.header.length)) {
            return null;
        }
        if (!oldStyle) {
            result = result.substring(Xor.header.length);
        }
        return result;
    };
    /**
     * @param {?} key
     * @param {?} i
     * @return {?}
     */
    Xor.keyCharAt = /**
     * @param {?} key
     * @param {?} i
     * @return {?}
     */
    function (key, i) {
        return key[Math.floor(i % key.length)].charCodeAt(0).toString(10);
    };
    Xor.header = 'artemis-lotsum';
    return Xor;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var version = '2.1.10';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var XHRPromise = /** @class */ (function () {
    function XHRPromise() {
        this.DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    /*
     * XHRPromise.send(options) -> Promise
     * - options (Object): URL, method, data, etc.
     *
     * Create the XHR object and wire up event handlers to use a promise.
     */
    /**
     * @param {?} options
     * @return {?}
     */
    XHRPromise.prototype.send = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var defaults;
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
        return new Promise((function (_this) {
            return function (resolve, reject) {
                /** @type {?} */
                var e;
                /** @type {?} */
                var header;
                /** @type {?} */
                var ref;
                /** @type {?} */
                var value;
                /** @type {?} */
                var xhr;
                if (!XMLHttpRequest) {
                    _this._handleError('browser', reject, null, 'browser doesn\'t support XMLHttpRequest');
                    return;
                }
                if (typeof options.url !== 'string' || options.url.length === 0) {
                    _this._handleError('url', reject, null, 'URL is a required parameter');
                    return;
                }
                _this._xhr = xhr = new XMLHttpRequest;
                xhr.onload = function () {
                    /** @type {?} */
                    var responseText;
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
                xhr.onerror = function () {
                    return _this._handleError('error', reject);
                };
                xhr.ontimeout = function () {
                    return _this._handleError('timeout', reject);
                };
                xhr.onabort = function () {
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
    };
    /*
     * XHRPromise.getXHR() -> XMLHttpRequest
     */
    /**
     * @return {?}
     */
    XHRPromise.prototype.getXHR = /**
     * @return {?}
     */
    function () {
        return this._xhr;
    };
    /**
     * @return {?}
     */
    XHRPromise.prototype._attachWindowUnload = /**
     * @return {?}
     */
    function () {
        this._unloadHandler = this._handleWindowUnload.bind(this);
        if ((/** @type {?} */ (window)).attachEvent) {
            return (/** @type {?} */ (window)).attachEvent('onunload', this._unloadHandler);
        }
    };
    /**
     * @return {?}
     */
    XHRPromise.prototype._detachWindowUnload = /**
     * @return {?}
     */
    function () {
        if ((/** @type {?} */ (window)).detachEvent) {
            return (/** @type {?} */ (window)).detachEvent('onunload', this._unloadHandler);
        }
    };
    /**
     * @return {?}
     */
    XHRPromise.prototype._getHeaders = /**
     * @return {?}
     */
    function () {
        return this._parseHeaders(this._xhr.getAllResponseHeaders());
    };
    /**
     * @return {?}
     */
    XHRPromise.prototype._getResponseText = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var responseText;
        responseText = typeof this._xhr.responseText === 'string' ? this._xhr.responseText : '';
        switch ((this._xhr.getResponseHeader('Content-Type') || '').split(';')[0]) {
            case 'application/json':
            case 'text/javascript':
                responseText = JSON.parse(responseText + '');
        }
        return responseText;
    };
    /**
     * @return {?}
     */
    XHRPromise.prototype._getResponseUrl = /**
     * @return {?}
     */
    function () {
        if (this._xhr.responseURL != null) {
            return this._xhr.responseURL;
        }
        if (/^X-Request-URL:/m.test(this._xhr.getAllResponseHeaders())) {
            return this._xhr.getResponseHeader('X-Request-URL');
        }
        return '';
    };
    /**
     * @param {?} reason
     * @param {?} reject
     * @param {?=} status
     * @param {?=} statusText
     * @return {?}
     */
    XHRPromise.prototype._handleError = /**
     * @param {?} reason
     * @param {?} reject
     * @param {?=} status
     * @param {?=} statusText
     * @return {?}
     */
    function (reason, reject, status, statusText) {
        this._detachWindowUnload();
        /** @type {?} */
        var code = 404;
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
    };
    /**
     * @return {?}
     */
    XHRPromise.prototype._handleWindowUnload = /**
     * @return {?}
     */
    function () {
        return this._xhr.abort();
    };
    /**
     * @param {?} str
     * @return {?}
     */
    XHRPromise.prototype.trim = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return str.replace(/^\s*|\s*$/g, '');
    };
    /**
     * @param {?} arg
     * @return {?}
     */
    XHRPromise.prototype.isArray = /**
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    /**
     * @param {?} list
     * @param {?} iterator
     * @return {?}
     */
    XHRPromise.prototype.forEach = /**
     * @param {?} list
     * @param {?} iterator
     * @return {?}
     */
    function (list, iterator) {
        if (toString.call(list) === '[object Array]') {
            this.forEachArray(list, iterator, this);
        }
        else if (typeof list === 'string') {
            this.forEachString(list, iterator, this);
        }
        else {
            this.forEachObject(list, iterator, this);
        }
    };
    /**
     * @param {?} array
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    XHRPromise.prototype.forEachArray = /**
     * @param {?} array
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    function (array, iterator, context) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array.hasOwnProperty(i)) {
                iterator.call(context, array[i], i, array);
            }
        }
    };
    /**
     * @param {?} string
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    XHRPromise.prototype.forEachString = /**
     * @param {?} string
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    function (string, iterator, context) {
        for (var i = 0, len = string.length; i < len; i++) {
            // no such thing as a sparse string.
            iterator.call(context, string.charAt(i), i, string);
        }
    };
    /**
     * @param {?} object
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    XHRPromise.prototype.forEachObject = /**
     * @param {?} object
     * @param {?} iterator
     * @param {?} context
     * @return {?}
     */
    function (object, iterator, context) {
        for (var k in object) {
            if (object.hasOwnProperty(k)) {
                iterator.call(context, object[k], k, object);
            }
        }
    };
    /**
     * @param {?} headers
     * @return {?}
     */
    XHRPromise.prototype._parseHeaders = /**
     * @param {?} headers
     * @return {?}
     */
    function (headers) {
        var _this_1 = this;
        if (!headers) {
            return {};
        }
        /** @type {?} */
        var result = {};
        this.forEach(this.trim(headers).split('\n'), function (row) {
            /** @type {?} */
            var index = row.indexOf(':');
            /** @type {?} */
            var key = _this_1.trim(row.slice(0, index)).toLowerCase();
            /** @type {?} */
            var value = _this_1.trim(row.slice(index + 1));
            if (typeof (result[key]) === 'undefined') {
                result[key] = value;
            }
            else if (_this_1.isArray(result[key])) {
                result[key].push(value);
            }
            else {
                result[key] = [result[key], value];
            }
        });
        return result;
    };
    return XHRPromise;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Ajax = /** @class */ (function () {
    function Ajax() {
        this.xhr = new XHRPromise();
    }
    /**
     * @param {?} args
     * @return {?}
     */
    Ajax.prototype.post = /**
     * @param {?} args
     * @return {?}
     */
    function (args) {
        /** @type {?} */
        var opt = {
            method: 'POST',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .send(opt)
            .then(function (res) {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(function (err) {
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
    };
    /**
     * @param {?} args
     * @return {?}
     */
    Ajax.prototype.put = /**
     * @param {?} args
     * @return {?}
     */
    function (args) {
        /** @type {?} */
        var opt = {
            method: 'PUT',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .send(opt)
            .then(function (res) {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(function (err) {
            // if (err.reason === 'timeout') {
            //     err.code = 408;
            // } else {
            //     err.code = 404;
            // }
            return Promise.reject(err);
        });
    };
    /**
     * @param {?} args
     * @return {?}
     */
    Ajax.prototype.delete = /**
     * @param {?} args
     * @return {?}
     */
    function (args) {
        /** @type {?} */
        var opt = {
            method: 'DELETE',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .send(opt)
            .then(function (res) {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(function (err) {
            // if (err.reason === 'timeout') {
            //     err.code = 408;
            // } else {
            //     err.code = 404;
            // }
            return Promise.reject(err);
        });
    };
    /**
     * @param {?} args
     * @return {?}
     */
    Ajax.prototype.get = /**
     * @param {?} args
     * @return {?}
     */
    function (args) {
        /** @type {?} */
        var opt = {
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
            .then(function (res) {
            if (res.status &&
                (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                res.reason = 'status';
                res.code = parseInt(res.status, 10);
                return Promise.reject(res);
            }
            return Promise.resolve(res.responseText);
        })
            .catch(function (err) {
            // if (err.reason === 'timeout') {
            //     err.code = 408;
            // } else {
            //     err.code = 404;
            // }
            return Promise.reject(err);
        });
    };
    return Ajax;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Client = /** @class */ (function () {
    function Client(appId, URI, storage, sdk) {
        this.appId = appId;
        this.URI = URI;
        this.storage = storage;
        this.sdk = sdk;
        /** @type {?} */
        var uuid = this.storage.get(Client._clientUuid) || 'uuid-' + Math.random();
        /** @type {?} */
        var info = '_clientInfo'; // this.storage.get(Client._clientInfo);
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
    /**
     * @param {?} value
     * @return {?}
     */
    Client.prototype.setClientId = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.clientId = '' + value;
        this.storage.set(Client._clientId, this.clientId);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Client.prototype.setClientUuid = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.clientUuid = '' + value;
        this.storage.set(Client._clientUuid, this.clientUuid);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Client.prototype.setClientInfo = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.clientInfo = '' + value;
        // this.storage.set('clientInfo', this.clientInfo);
    };
    /**
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    Client.prototype.login = /**
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    function (login, password, updateProperties) {
        var _this = this;
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        /** @type {?} */
        var urlLogin = this.URI + '/users';
        /** @type {?} */
        var dataLogin = {
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
            .then(function (createdUser) {
            _this.setClientId(createdUser._id);
            /** @type {?} */
            var urlToken = _this.URI + '/oauth/token';
            /** @type {?} */
            var dataToken = {
                grant_type: 'client_credentials',
                client_id: _this.clientId,
                client_secret: password,
                client_udid: _this.clientUuid,
                client_info: _this.clientInfo,
                audience: _this.appId,
                scope: JSON.stringify(_this.sdk)
            };
            return new Ajax()
                .post({
                url: urlToken,
                data: dataToken,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
        });
    };
    /**
     * @param {?} refreshToken
     * @return {?}
     */
    Client.prototype.reAuthenticate = /**
     * @param {?} refreshToken
     * @return {?}
     */
    function (refreshToken) {
        var _this = this;
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        /** @type {?} */
        var url = this.URI + '/oauth/token';
        /** @type {?} */
        var data = {
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
            .then(function (obj) {
            Client.refreshCount++;
            _this.storage.set(Client._refreshCount, Client.refreshCount);
            return Promise.resolve(obj);
        });
    };
    /**
     * @param {?=} refreshToken
     * @return {?}
     */
    Client.prototype.logout = /**
     * @param {?=} refreshToken
     * @return {?}
     */
    function (refreshToken) {
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
        var url = this.URI + '/oauth/revoke';
        /** @type {?} */
        var data = {
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
    };
    /**
     * @return {?}
     */
    Client.prototype.isReady = /**
     * @return {?}
     */
    function () {
        return !!this.URI;
    };
    Client.refreshCount = 0;
    Client._clientUuid = 'v2.clientUuid';
    Client._clientId = 'v2.clientId';
    Client._refreshCount = 'v2.refreshCount';
    return Client;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Error$1 = /** @class */ (function () {
    function Error(code, reason) {
        this.code = code;
        this.reason = reason;
    }
    /**
     * @param {?} err
     * @return {?}
     */
    Error.prototype.equals = /**
     * @param {?} err
     * @return {?}
     */
    function (err) {
        return this.code === err.code && this.reason === err.reason;
    };
    /**
     * @return {?}
     */
    Error.prototype.toString = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var msg = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
        return '' + this.code + ' - ' + msg;
    };
    return Error;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
    Connection._accessToken = 'v2.accessToken';
    Connection._accessTokenPrevious = 'v2.accessTokenPrevious';
    Connection._idToken = 'v2.idToken';
    Connection._refreshToken = 'v2.refreshToken';
    Connection._states = 'v2.states';
    Connection._cryptoSalt = 'v2.cryptoSalt';
    Connection._cryptoSaltNext = 'v2.cryptoSalt.next';
    return Connection;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var FidjPouch = window['PouchDB'] ? window['PouchDB'] : require('pouchdb').default;
/** @type {?} */
var PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
FidjPouch.plugin(PouchAdapterCordovaSqlite);
var Session = /** @class */ (function () {
    function Session() {
        this.db = null;
        this.dbRecordCount = 0;
        this.dbLastSync = null;
        this.remoteDb = null;
        this.dbs = [];
    }
    /**
     * @return {?}
     */
    Session.prototype.isReady = /**
     * @return {?}
     */
    function () {
        return !!this.db;
    };
    /**
     * @param {?} uid
     * @param {?=} force
     * @return {?}
     */
    Session.prototype.create = /**
     * @param {?} uid
     * @param {?=} force
     * @return {?}
     */
    function (uid, force) {
        var _this = this;
        if (!force && this.db) {
            return Promise.resolve();
        }
        this.dbRecordCount = 0;
        this.dbLastSync = null; // new Date().getTime();
        this.db = null;
        return new Promise(function (resolve, reject) {
            /** @type {?} */
            var opts = { location: 'default' };
            try {
                if (window['cordova']) {
                    opts = { location: 'default', adapter: 'cordova-sqlite' };
                    //    const plugin = require('pouchdb-adapter-cordova-sqlite');
                    //    if (plugin) { Pouch.plugin(plugin); }
                    //    this.db = new Pouch('fidj_db', {adapter: 'cordova-sqlite'});
                }
                // } else {
                // } else {
                _this.db = new FidjPouch('fidj_db_' + uid, opts); // , {adapter: 'websql'} ???
                // }
                // }
                _this.db.info()
                    .then(function (info) {
                    // todo if (info.adapter !== 'websql') {
                    return resolve(_this.db);
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
                }).catch(function (err) {
                    reject(new Error$1(400, err));
                });
            }
            catch (err) {
                reject(new Error$1(500, err));
            }
        });
    };
    /**
     * @return {?}
     */
    Session.prototype.destroy = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.db) {
            this.dbRecordCount = 0;
            this.dbLastSync = null;
            return Promise.resolve();
        }
        if (this.db && !this.db.destroy) {
            return Promise.reject(new Error$1(408, 'Need a valid db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.destroy(function (err, info) {
                if (err) {
                    reject(new Error$1(500, err));
                }
                else {
                    _this.dbRecordCount = 0;
                    _this.dbLastSync = null;
                    _this.db = null;
                    resolve();
                }
            });
        });
    };
    /**
     * @param {?} dbs
     * @return {?}
     */
    Session.prototype.setRemote = /**
     * @param {?} dbs
     * @return {?}
     */
    function (dbs) {
        this.dbs = dbs;
    };
    /**
     * @param {?} userId
     * @return {?}
     */
    Session.prototype.sync = /**
     * @param {?} userId
     * @return {?}
     */
    function (userId) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'need db'));
        }
        if (!this.dbs || !this.dbs.length) {
            return Promise.reject(new Error$1(408, 'need a remote db'));
        }
        return new Promise(function (resolve, reject) {
            try {
                if (!_this.remoteDb || _this.remoteUri !== _this.dbs[0].url) {
                    _this.remoteUri = _this.dbs[0].url;
                    _this.remoteDb = new FidjPouch(_this.remoteUri);
                    // todo , {headers: {'Authorization': 'Bearer ' + id_token}});
                }
                _this.db.replicate.to(_this.remoteDb)
                    .on('complete', function (info) {
                    return _this.remoteDb.replicate.to(_this.db, {
                        filter: function (doc) {
                            return (!!userId && !!doc && doc.fidjUserId === userId);
                        }
                    })
                        .on('complete', function () {
                        // this.logger
                        resolve();
                    })
                        .on('denied', function (err) { return reject({ code: 403, reason: err }); })
                        .on('error', function (err) { return reject({ code: 401, reason: err }); });
                })
                    .on('denied', function (err) { return reject({ code: 403, reason: err }); })
                    .on('error', function (err) { return reject({ code: 401, reason: err }); });
            }
            catch (err) {
                reject(new Error$1(500, err));
            }
        });
    };
    /**
     * @param {?} data
     * @param {?} _id
     * @param {?} uid
     * @param {?} oid
     * @param {?} ave
     * @param {?=} crypto
     * @return {?}
     */
    Session.prototype.put = /**
     * @param {?} data
     * @param {?} _id
     * @param {?} uid
     * @param {?} oid
     * @param {?} ave
     * @param {?=} crypto
     * @return {?}
     */
    function (data, _id, uid, oid, ave, crypto) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'need db'));
        }
        if (!data || !_id || !uid || !oid || !ave) {
            return Promise.reject(new Error$1(400, 'need formated data'));
        }
        /** @type {?} */
        var dataWithoutIds = JSON.parse(JSON.stringify(data));
        /** @type {?} */
        var toStore = {
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
        var resultAsString = Session.write(Session.value(dataWithoutIds));
        if (crypto) {
            resultAsString = crypto.obj[crypto.method](resultAsString);
            toStore.fidjDacr = resultAsString;
        }
        else {
            toStore.fidjData = resultAsString;
        }
        return new Promise(function (resolve, reject) {
            _this.db.put(toStore, function (err, response) {
                if (response && response.ok && response.id && response.rev) {
                    _this.dbRecordCount++;
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
    };
    /**
     * @param {?} data_id
     * @return {?}
     */
    Session.prototype.remove = /**
     * @param {?} data_id
     * @return {?}
     */
    function (data_id) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'need db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.get(data_id)
                .then(function (doc) {
                doc._deleted = true;
                return _this.db.put(doc);
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
     * @param {?} data_id
     * @param {?=} crypto
     * @return {?}
     */
    Session.prototype.get = /**
     * @param {?} data_id
     * @param {?=} crypto
     * @return {?}
     */
    function (data_id, crypto) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'Need db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.get(data_id)
                .then(function (row) {
                if (!!row && (!!row.fidjDacr || !!row.fidjData)) {
                    /** @type {?} */
                    var data = row.fidjDacr;
                    if (crypto && data) {
                        data = crypto.obj[crypto.method](data);
                    }
                    else if (row.fidjData) {
                        data = JSON.parse(row.fidjData);
                    }
                    /** @type {?} */
                    var resultAsJson = Session.extractJson(data);
                    if (resultAsJson) {
                        resultAsJson._id = row._id;
                        resultAsJson._rev = row._rev;
                        resolve(JSON.parse(JSON.stringify(resultAsJson)));
                    }
                    else {
                        // row._deleted = true;
                        // row._deleted = true;
                        _this.remove(row._id);
                        reject(new Error$1(400, 'Bad encoding'));
                    }
                }
                else {
                    reject(new Error$1(400, 'No data found'));
                }
            })
                .catch(function (err) { return reject(new Error$1(500, err)); });
        });
    };
    /**
     * @param {?=} crypto
     * @return {?}
     */
    Session.prototype.getAll = /**
     * @param {?=} crypto
     * @return {?}
     */
    function (crypto) {
        var _this = this;
        if (!this.db || !(/** @type {?} */ (this.db)).allDocs) {
            return Promise.reject(new Error$1(408, 'Need a valid db'));
        }
        return new Promise(function (resolve, reject) {
            (/** @type {?} */ (_this.db)).allDocs({ include_docs: true, descending: true })
                .then(function (rows) {
                /** @type {?} */
                var all = [];
                rows.rows.forEach(function (row) {
                    if (!!row && !!row.doc._id && (!!row.doc.fidjDacr || !!row.doc.fidjData)) {
                        /** @type {?} */
                        var data = row.doc.fidjDacr;
                        if (crypto && data) {
                            data = crypto.obj[crypto.method](data);
                        }
                        else if (row.doc.fidjData) {
                            data = JSON.parse(row.doc.fidjData);
                        }
                        /** @type {?} */
                        var resultAsJson = Session.extractJson(data);
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
                            // resultAsJson = {};
                            // resultAsJson._id = row.doc._id;
                            // resultAsJson._rev = row.doc._rev;
                            // resultAsJson._deleted = true;
                            // all.push(resultAsJson);
                            _this.remove(row.doc._id);
                        }
                    }
                    else {
                        console.error('Bad encoding');
                    }
                });
                resolve(all);
            })
                .catch(function (err) { return reject(new Error$1(400, err)); });
        });
    };
    /**
     * @return {?}
     */
    Session.prototype.isEmpty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.db || !(/** @type {?} */ (this.db)).allDocs) {
            return Promise.reject(new Error$1(408, 'No db'));
        }
        return new Promise(function (resolve, reject) {
            (/** @type {?} */ (_this.db)).allDocs({})
                .then(function (response) {
                if (!response) {
                    reject(new Error$1(400, 'No response'));
                }
                else {
                    _this.dbRecordCount = response.total_rows;
                    if (response.total_rows && response.total_rows > 0) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                }
            })
                .catch(function (err) { return reject(new Error$1(400, err)); });
        });
    };
    /**
     * @return {?}
     */
    Session.prototype.info = /**
     * @return {?}
     */
    function () {
        if (!this.db) {
            return Promise.reject(new Error$1(408, 'No db'));
        }
        return this.db.info();
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Session.write = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var value = 'null';
        /** @type {?} */
        var t = typeof (item);
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
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Session.value = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result = item;
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
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Session.extractJson = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result = item;
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
    };
    return Session;
}());

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
var InternalService = /** @class */ (function () {
    function InternalService(logger, promise) {
        this.sdk = {
            org: 'fidj',
            version: version,
            prod: false
        };
        this.logger = {
            log: function () {
            },
            error: function () {
            },
            warn: function () {
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
    InternalService.prototype.fidjInit = /**
     * Init connection & session
     * Check uri
     * Done each app start
     *
     * @param {?} fidjId
     * @param {?=} options Optional settings
     * @return {?}
     */
    function (fidjId, options) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjInit : ', options);
        if (!fidjId) {
            self.logger.error('fidj.sdk.service.fidjInit : bad init');
            return self.promise.reject(new Error$1(400, 'Need a fidjId'));
        }
        self.sdk.prod = !options ? true : options.prod;
        return new self.promise(function (resolve, reject) {
            self.connection.verifyConnectionStates()
                .then(function () {
                self.connection.fidjId = fidjId;
                self.connection.fidjVersion = self.sdk.version;
                self.connection.fidjCrypto = (!options || !options.hasOwnProperty('crypto')) ? true : options.crypto;
                /** @type {?} */
                var theBestUrl = self.connection.getApiEndpoints({ filter: 'theBestOne' })[0];
                /** @type {?} */
                var theBestOldUrl = self.connection.getApiEndpoints({ filter: 'theBestOldOne' })[0];
                /** @type {?} */
                var isLogin = self.fidjIsLogin();
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
                .catch(function (err) {
                self.logger.error('fidj.sdk.service.fidjInit: ', err);
                reject(new Error$1(500, err.toString()));
            });
        });
    };
    /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    InternalService.prototype.fidjLogin = /**
     * Call it if fidjIsLogin() === false
     * Erase all (db & storage)
     *
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    function (login, password) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjLogin');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error$1(404, 'Need an intialized FidjService'));
        }
        return new self.promise(function (resolve, reject) {
            self._removeAll()
                .then(function () {
                return self.connection.verifyConnectionStates();
            })
                .then(function () {
                return self._createSession(self.connection.fidjId);
            })
                .then(function () {
                return self._loginInternal(login, password);
            })
                .then(function (user) {
                self.connection.setConnection(user);
                self.session.sync(self.connection.getClientId())
                    .then(function () { return resolve(self.connection.getUser()); })
                    .catch(function (err) { return resolve(self.connection.getUser()); });
            })
                .catch(function (err) {
                self.logger.error('fidj.sdk.service.fidjLogin: ', err.toString());
                reject(err);
            });
        });
    };
    /**
     *
     * @param {?=} options
     * @return {?}
     */
    InternalService.prototype.fidjLoginInDemoMode = /**
     *
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var self = this;
        // generate one day tokens if not set
        if (!options || !options.accessToken) {
            /** @type {?} */
            var now = new Date();
            now.setDate(now.getDate() + 1);
            /** @type {?} */
            var tomorrow = now.getTime();
            /** @type {?} */
            var payload = Base64.encode(JSON.stringify({
                roles: [],
                message: 'demo',
                apis: [],
                endpoints: {},
                dbs: [],
                exp: tomorrow
            }));
            /** @type {?} */
            var jwtSign = Base64.encode(JSON.stringify({}));
            /** @type {?} */
            var token = jwtSign + '.' + payload + '.' + jwtSign;
            options = {
                accessToken: token,
                idToken: token,
                refreshToken: token
            };
        }
        return new self.promise(function (resolve, reject) {
            self._removeAll()
                .then(function () {
                return self._createSession(self.connection.fidjId);
            })
                .then(function () {
                self.connection.setConnectionOffline(options);
                resolve(self.connection.getUser());
            })
                .catch(function (err) {
                self.logger.error('fidj.sdk.service.fidjLogin error: ', err);
                reject(err);
            });
        });
    };
    /**
     * @param {?=} filter
     * @return {?}
     */
    InternalService.prototype.fidjGetEndpoints = /**
     * @param {?=} filter
     * @return {?}
     */
    function (filter) {
        if (!filter) {
            filter = { showBlocked: false };
        }
        /** @type {?} */
        var endpoints = JSON.parse(this.connection.getAccessPayload({ endpoints: [] })).endpoints;
        if (!endpoints) {
            return [];
        }
        endpoints = endpoints.filter(function (endpoint) {
            /** @type {?} */
            var ok = true;
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
    /**
     * @return {?}
     */
    InternalService.prototype.fidjRoles = /**
     * @return {?}
     */
    function () {
        return JSON.parse(this.connection.getIdPayload({ roles: [] })).roles;
    };
    /**
     * @return {?}
     */
    InternalService.prototype.fidjMessage = /**
     * @return {?}
     */
    function () {
        return JSON.parse(this.connection.getIdPayload({ message: '' })).message;
    };
    /**
     * @return {?}
     */
    InternalService.prototype.fidjIsLogin = /**
     * @return {?}
     */
    function () {
        return this.connection.isLogin();
    };
    /**
     * @return {?}
     */
    InternalService.prototype.fidjLogout = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var self = this;
        if (!self.connection.getClient()) {
            return self._removeAll()
                .then(function () {
                return _this.session.create(self.connection.fidjId, true);
            });
        }
        return self.connection.logout()
            .then(function () {
            return self._removeAll();
        })
            .catch(function () {
            return self._removeAll();
        })
            .then(function () {
            return _this.session.create(self.connection.fidjId, true);
        });
    };
    /**
     * Synchronize DB
     *
     *
     * @param {?=} fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param {?=} fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @return {?} promise
     */
    InternalService.prototype.fidjSync = /**
     * Synchronize DB
     *
     *
     * @param {?=} fnInitFirstData a function with db as input and that return promise: call if DB is empty
     * @param {?=} fnInitFirstData_Arg arg to set to fnInitFirstData()
     * @return {?} promise
     */
    function (fnInitFirstData, fnInitFirstData_Arg) {
        var _this = this;
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjSync');
        /** @type {?} */
        var firstSync = (self.session.dbLastSync === null);
        return new self.promise(function (resolve, reject) {
            self._createSession(self.connection.fidjId)
                .then(function () {
                return self.session.sync(self.connection.getClientId());
            })
                .then(function () {
                self.logger.log('fidj.sdk.service.fidjSync resolved');
                return self.session.isEmpty();
            })
                .catch(function (err) {
                self.logger.warn('fidj.sdk.service.fidjSync warn: ', err);
                return self.session.isEmpty();
            })
                .then(function (isEmpty) {
                self.logger.log('fidj.sdk.service.fidjSync isEmpty : ', isEmpty, firstSync);
                return new Promise(function (resolveEmpty, rejectEmptyNotUsed) {
                    if (isEmpty && firstSync && fnInitFirstData) {
                        /** @type {?} */
                        var ret = fnInitFirstData(fnInitFirstData_Arg);
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
                .then(function (info) {
                self.logger.log('fidj.sdk.service.fidjSync fnInitFirstData resolved: ', info);
                self.session.dbLastSync = new Date().getTime();
                return self.session.info();
            })
                .then(function (result) {
                self.session.dbRecordCount = 0;
                if (result && result.doc_count) {
                    self.session.dbRecordCount = result.doc_count;
                }
                self.logger.log('fidj.sdk.service.fidjSync _dbRecordCount : ' + self.session.dbRecordCount);
                return self.connection.refreshConnection();
            })
                .then(function (user) {
                resolve(); // self.connection.getUser()
            })
                .catch(function (err) {
                // console.error(err);
                if (err && (err.code === 403 || err.code === 410)) {
                    _this.fidjLogout()
                        .then(function () {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                    })
                        .catch(function () {
                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                    });
                }
                else if (err && err.code) {
                    // todo what to do with this err ?
                    resolve();
                }
                else {
                    /** @type {?} */
                    var errMessage = 'Error during syncronisation: ' + err.toString();
                    // self.logger.error(errMessage);
                    reject({ code: 500, reason: errMessage });
                }
            });
        });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    InternalService.prototype.fidjPutInDb = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service.fidjPutInDb: ', data);
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error$1(401, 'DB put impossible. Need a user logged in.'));
        }
        /** @type {?} */
        var _id;
        if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
            _id = data._id;
        }
        if (!_id) {
            _id = self._generateObjectUniqueId(self.connection.fidjId);
        }
        /** @type {?} */
        var crypto;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'encrypt'
            };
        }
        return self.session.put(data, _id, self.connection.getClientId(), self.sdk.org, self.connection.fidjVersion, crypto);
    };
    /**
     * @param {?} data_id
     * @return {?}
     */
    InternalService.prototype.fidjRemoveInDb = /**
     * @param {?} data_id
     * @return {?}
     */
    function (data_id) {
        /** @type {?} */
        var self = this;
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
    };
    /**
     * @param {?} data_id
     * @return {?}
     */
    InternalService.prototype.fidjFindInDb = /**
     * @param {?} data_id
     * @return {?}
     */
    function (data_id) {
        /** @type {?} */
        var self = this;
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error$1(401, 'fidj.sdk.service.fidjFindInDb : need a user logged in.'));
        }
        /** @type {?} */
        var crypto;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'decrypt'
            };
        }
        return self.session.get(data_id, crypto);
    };
    /**
     * @return {?}
     */
    InternalService.prototype.fidjFindAllInDb = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var self = this;
        if (!self.connection.getClientId() || !self.session.isReady()) {
            return self.promise.reject(new Error$1(401, 'Need a user logged in.'));
        }
        /** @type {?} */
        var crypto;
        if (self.connection.fidjCrypto) {
            crypto = {
                obj: self.connection,
                method: 'decrypt'
            };
        }
        return self.session.getAll(crypto)
            .then(function (results) {
            self.connection.setCryptoSaltAsVerified();
            return self.promise.resolve((/** @type {?} */ (results)));
        });
    };
    /**
     * @param {?} key
     * @param {?=} data
     * @return {?}
     */
    InternalService.prototype.fidjPostOnEndpoint = /**
     * @param {?} key
     * @param {?=} data
     * @return {?}
     */
    function (key, data) {
        /** @type {?} */
        var filter = {
            key: key
        };
        /** @type {?} */
        var endpoints = this.fidjGetEndpoints(filter);
        if (!endpoints || endpoints.length !== 1) {
            return this.promise.reject(new Error$1(400, 'fidj.sdk.service.fidjPostOnEndpoint : endpoint does not exist.'));
        }
        /** @type {?} */
        var endpointUrl = endpoints[0].url;
        /** @type {?} */
        var jwt = this.connection.getIdToken();
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
    /**
     * @return {?}
     */
    InternalService.prototype.fidjGetIdToken = /**
     * @return {?}
     */
    function () {
        return this.connection.getIdToken();
    };
    /**
     * Logout then Login
     *
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    InternalService.prototype._loginInternal = /**
     * Logout then Login
     *
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    function (login, password, updateProperties) {
        /** @type {?} */
        var self = this;
        self.logger.log('fidj.sdk.service._loginInternal');
        if (!self.connection.isReady()) {
            return self.promise.reject(new Error$1(403, 'Need an intialized FidjService'));
        }
        return new self.promise(function (resolve, reject) {
            self.connection.logout()
                .then(function () {
                return self.connection.getClient().login(login, password, updateProperties);
            })
                .catch(function (err) {
                return self.connection.getClient().login(login, password, updateProperties);
            })
                .then(function (loginUser) {
                loginUser.email = login;
                resolve(loginUser);
            })
                .catch(function (err) {
                self.logger.error('fidj.sdk.service._loginInternal error : ' + err);
                reject(err);
            });
        });
    };
    /**
     * @return {?}
     */
    InternalService.prototype._removeAll = /**
     * @return {?}
     */
    function () {
        this.connection.destroy();
        return this.session.destroy();
    };
    /**
     * @param {?} uid
     * @return {?}
     */
    InternalService.prototype._createSession = /**
     * @param {?} uid
     * @return {?}
     */
    function (uid) {
        this.session.setRemote(this.connection.getDBs({ filter: 'theBestOnes' }));
        return this.session.create(uid);
    };
    /**
     * @param {?=} a
     * @return {?}
     */
    InternalService.prototype._testPromise = /**
     * @param {?=} a
     * @return {?}
     */
    function (a) {
        if (a) {
            return this.promise.resolve('test promise ok ' + a);
        }
        return new this.promise(function (resolve, reject) {
            resolve('test promise ok');
        });
    };
    /**
     * @param {?} appName
     * @param {?=} type
     * @param {?=} name
     * @return {?}
     */
    InternalService.prototype._generateObjectUniqueId = /**
     * @param {?} appName
     * @param {?=} type
     * @param {?=} name
     * @return {?}
     */
    function (appName, type, name) {
        /** @type {?} */
        var now = new Date();
        /** @type {?} */
        var simpleDate = '' + now.getFullYear() + '' + now.getMonth() + '' + now.getDate()
            + '' + now.getHours() + '' + now.getMinutes();
        /** @type {?} */
        var sequId = ++InternalService._srvDataUniqId;
        /** @type {?} */
        var UId = '';
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
    };
    InternalService._srvDataUniqId = 0;
    return InternalService;
}());

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
var FidjService = /** @class */ (function () {
    function FidjService() {
        this.logger = new LoggerService();
        this.promise = Promise;
        this.fidjService = null;
        // let pouchdbRequired = PouchDB;
        // pouchdbRequired.error();
    }
    /**
     * @param {?} fidjId
     * @param {?=} options
     * @return {?}
     */
    FidjService.prototype.init = /**
     * @param {?} fidjId
     * @param {?=} options
     * @return {?}
     */
    function (fidjId, options) {
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
    };
    /**
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    FidjService.prototype.login = /**
     * @param {?} login
     * @param {?} password
     * @return {?}
     */
    function (login, password) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.login : not initialized.'));
        }
        return this.fidjService.fidjLogin(login, password);
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    FidjService.prototype.loginAsDemo = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjLoginInDemoMode(options);
    };
    /**
     * @return {?}
     */
    FidjService.prototype.isLoggedIn = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return false; // this.promise.reject('fidj.sdk.angular2.isLoggedIn : not initialized.');
        }
        return this.fidjService.fidjIsLogin();
    };
    /**
     * @return {?}
     */
    FidjService.prototype.getRoles = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjRoles();
    };
    /**
     * @return {?}
     */
    FidjService.prototype.getEndpoints = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return [];
        }
        return this.fidjService.fidjGetEndpoints();
    };
    /**
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    FidjService.prototype.postOnEndpoint = /**
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    function (key, data) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.loginAsDemo : not initialized.'));
        }
        return this.fidjService.fidjPostOnEndpoint(key, data);
    };
    /**
     * @return {?}
     */
    FidjService.prototype.getIdToken = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return;
        }
        return this.fidjService.fidjGetIdToken();
    };
    /**
     * @return {?}
     */
    FidjService.prototype.getMessage = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return '';
        }
        return this.fidjService.fidjMessage();
    };
    /**
     * @return {?}
     */
    FidjService.prototype.logout = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(303, 'fidj.sdk.angular2.logout : not initialized.'));
        }
        return this.fidjService.fidjLogout();
    };
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
    FidjService.prototype.sync = /**
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
    function (fnInitFirstData) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.sync : not initialized.'));
        }
        return this.fidjService.fidjSync(fnInitFirstData, this);
    };
    /**
     * Store data in your session
     *
     * @param {?} data to store
     * @return {?}
     */
    FidjService.prototype.put = /**
     * Store data in your session
     *
     * @param {?} data to store
     * @return {?}
     */
    function (data) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.put : not initialized.'));
        }
        return this.fidjService.fidjPutInDb(data);
    };
    /**
     * Find object Id and remove it from your session
     *
     * @param {?} id of object to find and remove
     * @return {?}
     */
    FidjService.prototype.remove = /**
     * Find object Id and remove it from your session
     *
     * @param {?} id of object to find and remove
     * @return {?}
     */
    function (id) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.remove : not initialized.'));
        }
        return this.fidjService.fidjRemoveInDb(id);
    };
    /**
     * Find
     * @param {?} id
     * @return {?}
     */
    FidjService.prototype.find = /**
     * Find
     * @param {?} id
     * @return {?}
     */
    function (id) {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.find : not initialized.'));
        }
        return this.fidjService.fidjFindInDb(id);
    };
    /**
     * @return {?}
     */
    FidjService.prototype.findAll = /**
     * @return {?}
     */
    function () {
        if (!this.fidjService) {
            return this.promise.reject(new Error$1(401, 'fidj.sdk.angular2.findAll : not initialized.'));
        }
        return this.fidjService.fidjFindAllInDb();
    };
    FidjService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    FidjService.ctorParameters = function () { return []; };
    return FidjService;
}());
var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    /**
     * @param {?} message
     * @return {?}
     */
    LoggerService.prototype.log = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        // console.log(message);
    };
    /**
     * @param {?} message
     * @return {?}
     */
    LoggerService.prototype.error = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        console.error(message);
    };
    /**
     * @param {?} message
     * @return {?}
     */
    LoggerService.prototype.warn = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        console.warn(message);
    };
    return LoggerService;
}());

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
var FidjModule = /** @class */ (function () {
    function FidjModule() {
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
    FidjModule.ctorParameters = function () { return []; };
    return FidjModule;
}());
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