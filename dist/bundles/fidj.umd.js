(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('fidj', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global.fidj = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

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
    var /**
     * localStorage class factory
     * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
     * Usage : var localStorageService = new LocalStorage(); // to create a new instance
     */ LocalStorage = /** @class */ (function () {
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
                    result += String.fromCharCode(( /** @type {?} */(value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
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
                    result += String.fromCharCode(( /** @type {?} */(value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
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
                if (( /** @type {?} */(window)).attachEvent) {
                    return ( /** @type {?} */(window)).attachEvent('onunload', this._unloadHandler);
                }
            };
        /**
         * @return {?}
         */
        XHRPromise.prototype._detachWindowUnload = /**
         * @return {?}
         */
            function () {
                if (( /** @type {?} */(window)).detachEvent) {
                    return ( /** @type {?} */(window)).detachEvent('onunload', this._unloadHandler);
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
                                ( /** @type {?} */(data))._rev = response.rev;
                                ( /** @type {?} */(data))._id = response.id;
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
                if (!this.db || !( /** @type {?} */(this.db)).allDocs) {
                    return Promise.reject(new Error$1(408, 'Need a valid db'));
                }
                return new Promise(function (resolve, reject) {
                    ( /** @type {?} */(_this.db)).allDocs({ include_docs: true, descending: true })
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
                if (!this.db || !( /** @type {?} */(this.db)).allDocs) {
                    return Promise.reject(new Error$1(408, 'No db'));
                }
                return new Promise(function (resolve, reject) {
                    ( /** @type {?} */(_this.db)).allDocs({})
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
                    result = ( /** @type {?} */(result)).json;
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
                    return self.promise.resolve(( /** @type {?} */(results)));
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
            { type: core.Injectable }
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
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule
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

    exports.Base64 = Base64;
    exports.LocalStorage = LocalStorage;
    exports.Xor = Xor;
    exports.FidjModule = FidjModule;
    exports.FidjService = FidjService;
    exports.LoggerService = LoggerService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlkai51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL2ZpZGovdG9vbHMvYmFzZTY0LnRzIiwibmc6Ly9maWRqL3Rvb2xzL3N0b3JhZ2UudHMiLCJuZzovL2ZpZGovdG9vbHMveG9yLnRzIiwibmc6Ly9maWRqL3ZlcnNpb24vaW5kZXgudHMiLCJuZzovL2ZpZGovY29ubmVjdGlvbi94aHJwcm9taXNlLnRzIiwibmc6Ly9maWRqL2Nvbm5lY3Rpb24vYWpheC50cyIsIm5nOi8vZmlkai9jb25uZWN0aW9uL2NsaWVudC50cyIsIm5nOi8vZmlkai9zZGsvZXJyb3IudHMiLCJuZzovL2ZpZGovY29ubmVjdGlvbi9jb25uZWN0aW9uLnRzIiwibmc6Ly9maWRqL3Nlc3Npb24vc2Vzc2lvbi50cyIsIm5nOi8vZmlkai9zZGsvaW50ZXJuYWwuc2VydmljZS50cyIsIm5nOi8vZmlkai9zZGsvYW5ndWxhci5zZXJ2aWNlLnRzIiwibmc6Ly9maWRqL3Nkay9maWRqLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQmFzZTY0IHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNvZGVzIHN0cmluZyBmcm9tIEJhc2U2NCBzdHJpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGVuY29kZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChpbnB1dCkucmVwbGFjZSgvJShbMC05QS1GXXsyfSkvZyxcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRvU29saWRCeXRlcyhtYXRjaCwgcDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludCgnMHgnICsgcDEsIDE2KSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGRlY29kZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYXRvYihpbnB1dCkuc3BsaXQoJycpLm1hcCgoYykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICclJyArICgnMDAnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgICB9KS5qb2luKCcnKSk7XG5cbiAgICB9XG59XG4iLCIvKipcbiAqIGxvY2FsU3RvcmFnZSBjbGFzcyBmYWN0b3J5XG4gKiBVc2FnZSA6IHZhciBMb2NhbFN0b3JhZ2UgPSBmaWRqLkxvY2FsU3RvcmFnZUZhY3Rvcnkod2luZG93LmxvY2FsU3RvcmFnZSk7IC8vIHRvIGNyZWF0ZSBhIG5ldyBjbGFzc1xuICogVXNhZ2UgOiB2YXIgbG9jYWxTdG9yYWdlU2VydmljZSA9IG5ldyBMb2NhbFN0b3JhZ2UoKTsgLy8gdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2Uge1xuXG4gICAgcHVibGljIHZlcnNpb24gPSAnMC4xJztcbiAgICBwcml2YXRlIHN0b3JhZ2U7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yKHN0b3JhZ2VTZXJ2aWNlLCBwcml2YXRlIHN0b3JhZ2VLZXkpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gc3RvcmFnZVNlcnZpY2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Mb2NhbFN0b3JhZ2VGYWN0b3J5IG5lZWRzIGEgc3RvcmFnZVNlcnZpY2UhJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdG9kbyBMb2NhbFN0b3JhZ2UgcmVmYWN0b1xuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5YbWwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLlhtbCBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouWG1sLmlzWG1sIHx8ICFmaWRqLlhtbC54bWwyU3RyaW5nIHx8ICFmaWRqLlhtbC5zdHJpbmcyWG1sKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5YbWwgd2l0aCBpc1htbCgpLCB4bWwyU3RyaW5nKClcbiAgICAgICAgLy8gYW5kIHN0cmluZzJYbWwoKSBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbi5vYmplY3QyU3RyaW5nIHx8ICFmaWRqLkpzb24uc3RyaW5nMk9iamVjdCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiB3aXRoIG9iamVjdDJTdHJpbmcoKVxuICAgICAgICAvLyBhbmQgc3RyaW5nMk9iamVjdCgpIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgIH1cblxuICAgIC8vIFB1YmxpYyBBUElcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBrZXkncyB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXkgLSBLZXkgdG8gc2V0LiBJZiB0aGlzIHZhbHVlIGlzIG5vdCBzZXQgb3Igbm90XG4gICAgICogICAgICAgICAgICAgIGEgc3RyaW5nIGFuIGV4Y2VwdGlvbiBpcyByYWlzZWQuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVmFsdWUgdG8gc2V0LiBUaGlzIGNhbiBiZSBhbnkgdmFsdWUgdGhhdCBpcyBKU09OXG4gICAgICogICAgICAgICAgICAgIGNvbXBhdGlibGUgKE51bWJlcnMsIFN0cmluZ3MsIE9iamVjdHMgZXRjLikuXG4gICAgICogQHJldHVybnMgdGhlIHN0b3JlZCB2YWx1ZSB3aGljaCBpcyBhIGNvbnRhaW5lciBvZiB1c2VyIHZhbHVlLlxuICAgICAqL1xuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWUpIHtcblxuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgLy8gY2xvbmUgdGhlIG9iamVjdCBiZWZvcmUgc2F2aW5nIHRvIHN0b3JhZ2VcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZih2YWx1ZSk7XG4gICAgICAgIGlmICh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtzdHJpbmc6IHZhbHVlfSlcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7bnVtYmVyOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7Ym9vbDogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7anNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlamVjdCBhbmQgZG8gbm90IGluc2VydFxuICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIGZvciBleGFtcGxlXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSB0eXBlICcgKyB0ICsgJyBpcyBpbnZhbGlkLiBJdCBtdXN0IGJlIG51bGwsIHVuZGVmaW5lZCwgeG1sLCBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiBvciBvYmplY3QnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBMb29rcyB1cCBhIGtleSBpbiBjYWNoZVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleSAtIEtleSB0byBsb29rIHVwLlxuICAgICAqIEBwYXJhbSBkZWYgLSBEZWZhdWx0IHZhbHVlIHRvIHJldHVybiwgaWYga2V5IGRpZG4ndCBleGlzdC5cbiAgICAgKiBAcmV0dXJucyB0aGUga2V5IHZhbHVlLCBkZWZhdWx0IHZhbHVlIG9yIDxudWxsPlxuICAgICAqL1xuICAgIGdldChrZXk6IHN0cmluZywgZGVmPykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2UoaXRlbSk7XG5cbiAgICAgICAgICAgIC8vIHZhciB2YWx1ZSA9IGZpZGouSnNvbi5zdHJpbmcyT2JqZWN0KGl0ZW0pO1xuICAgICAgICAgICAgLy8gaWYgKCd4bWwnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZpZGouWG1sLnN0cmluZzJYbWwodmFsdWUueG1sKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZVxuICAgICAgICAgICAgaWYgKCdzdHJpbmcnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnN0cmluZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubnVtYmVyLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ2Jvb2wnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmJvb2wudmFsdWVPZigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuanNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIWRlZiA/IG51bGwgOiBkZWY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgYSBrZXkgZnJvbSBjYWNoZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAga2V5IC0gS2V5IHRvIGRlbGV0ZS5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGtleSBleGlzdGVkIG9yIGZhbHNlIGlmIGl0IGRpZG4ndFxuICAgICAqL1xuICAgIHJlbW92ZShrZXk6IHN0cmluZykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgZXhpc3RlZCA9ICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgZXZlcnl0aGluZyBpbiBjYWNoZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdHJ1ZVxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICBjb25zdCBleGlzdGVkID0gKHRoaXMuc3RvcmFnZS5sZW5ndGggPiAwKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBleGlzdGVkO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBzcGFjZSBpbiBieXRlcyBkb2VzIHRoZSBzdG9yYWdlIHRha2U/XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBOdW1iZXJcbiAgICAgKi9cbiAgICBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBmdW5jdGlvbiBmIG9uIHRoZSBzcGVjaWZpZWQgY29udGV4dCBmb3IgZWFjaCBlbGVtZW50IG9mIHRoZSBzdG9yYWdlXG4gICAgICogZnJvbSBpbmRleCAwIHRvIGluZGV4IGxlbmd0aC0xLlxuICAgICAqIFdBUk5JTkcgOiBZb3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhlIHN0b3JhZ2UgZHVyaW5nIHRoZSBsb29wICEhIVxuICAgICAqXG4gICAgICogQHBhcmFtIGYgLSBGdW5jdGlvbiB0byBjYWxsIG9uIGV2ZXJ5IGl0ZW0uXG4gICAgICogQHBhcmFtICBjb250ZXh0IC0gQ29udGV4dCAodGhpcyBmb3IgZXhhbXBsZSkuXG4gICAgICogQHJldHVybnMgTnVtYmVyIG9mIGl0ZW1zIGluIHN0b3JhZ2VcbiAgICAgKi9cbiAgICBmb3JlYWNoKGYsIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbiA9IHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLnN0b3JhZ2Uua2V5KGkpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBmIGlzIGFuIGluc3RhbmNlIG1ldGhvZCBvbiBpbnN0YW5jZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgZi5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZiBpcyBhIGZ1bmN0aW9uIG9yIGNsYXNzIG1ldGhvZFxuICAgICAgICAgICAgICAgIGYodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH07XG5cbiAgICAvLyBQcml2YXRlIEFQSVxuICAgIC8vIGhlbHBlciBmdW5jdGlvbnMgYW5kIHZhcmlhYmxlcyBoaWRkZW4gd2l0aGluIHRoaXMgZnVuY3Rpb24gc2NvcGVcblxuICAgIHByaXZhdGUgY2hlY2tLZXkoa2V5KSB7XG4gICAgICAgIGlmICgha2V5IHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSB0eXBlIG11c3QgYmUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlNjR9IGZyb20gJy4vYmFzZTY0JztcblxuZXhwb3J0IGNsYXNzIFhvciB7XG5cbiAgICBzdGF0aWMgaGVhZGVyID0gJ2FydGVtaXMtbG90c3VtJztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH07XG5cblxuICAgIHB1YmxpYyBzdGF0aWMgZW5jcnlwdCh2YWx1ZTogc3RyaW5nLCBrZXk6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gICAgICAgIHZhbHVlID0gWG9yLmhlYWRlciArIHZhbHVlO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCh2YWx1ZVtpXS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDEwKSBhcyBhbnkpIF4gWG9yLmtleUNoYXJBdChrZXksIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBCYXNlNjQuZW5jb2RlKHJlc3VsdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0aWMgZGVjcnlwdCh2YWx1ZTogc3RyaW5nLCBrZXk6IHN0cmluZywgb2xkU3R5bGU/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICB2YWx1ZSA9IEJhc2U2NC5kZWNvZGUodmFsdWUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgodmFsdWVbaV0uY2hhckNvZGVBdCgwKS50b1N0cmluZygxMCkgYXMgYW55KSBeIFhvci5rZXlDaGFyQXQoa2V5LCBpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW9sZFN0eWxlICYmIFhvci5oZWFkZXIgIT09IHJlc3VsdC5zdWJzdHJpbmcoMCwgWG9yLmhlYWRlci5sZW5ndGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2xkU3R5bGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoWG9yLmhlYWRlci5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBrZXlDaGFyQXQoa2V5LCBpKSB7XG4gICAgICAgIHJldHVybiBrZXlbTWF0aC5mbG9vcihpICUga2V5Lmxlbmd0aCldLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTApO1xuICAgIH1cblxuXG59XG4iLCIvLyBidW1wZWQgdmVyc2lvbiB2aWEgZ3VscFxuZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnMi4xLjEwJztcbiIsImV4cG9ydCBjbGFzcyBYSFJQcm9taXNlIHtcblxuICAgIHB1YmxpYyBERUZBVUxUX0NPTlRFTlRfVFlQRSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xuICAgIHByaXZhdGUgX3hocjtcbiAgICBwcml2YXRlIF91bmxvYWRIYW5kbGVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLnNlbmQob3B0aW9ucykgLT4gUHJvbWlzZVxuICAgICAqIC0gb3B0aW9ucyAoT2JqZWN0KTogVVJMLCBtZXRob2QsIGRhdGEsIGV0Yy5cbiAgICAgKlxuICAgICAqIENyZWF0ZSB0aGUgWEhSIG9iamVjdCBhbmQgd2lyZSB1cCBldmVudCBoYW5kbGVycyB0byB1c2UgYSBwcm9taXNlLlxuICAgICAqL1xuICAgIHNlbmQob3B0aW9ucyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBkZWZhdWx0cztcbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICAgICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggKF90aGlzOiBYSFJQcm9taXNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZSwgaGVhZGVyLCByZWYsIHZhbHVlLCB4aHI7XG4gICAgICAgICAgICAgICAgaWYgKCFYTUxIdHRwUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXJyb3IoJ2Jyb3dzZXInLCByZWplY3QsIG51bGwsICdicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnVybCAhPT0gJ3N0cmluZycgfHwgb3B0aW9ucy51cmwubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9oYW5kbGVFcnJvcigndXJsJywgcmVqZWN0LCBudWxsLCAnVVJMIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuX3hociA9IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gICgpICA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXRhY2hXaW5kb3dVbmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IF90aGlzLl9nZXRSZXNwb25zZVRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXJyb3IoJ3BhcnNlJywgcmVqZWN0LCBudWxsLCAnaW52YWxpZCBKU09OIHJlc3BvbnNlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBfdGhpcy5fZ2V0UmVzcG9uc2VVcmwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBfdGhpcy5fZ2V0SGVhZGVycygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyOiB4aHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub25lcnJvciA9ICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vbnRpbWVvdXQgPSAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCd0aW1lb3V0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vbmFib3J0ID0gICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignYWJvcnQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgX3RoaXMuX2F0dGFjaFdpbmRvd1VubG9hZCgpO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCBvcHRpb25zLnVybCwgb3B0aW9ucy5hc3luYywgb3B0aW9ucy51c2VybmFtZSwgb3B0aW9ucy5wYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKG9wdGlvbnMuZGF0YSAhPSBudWxsKSAmJiAhb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gX3RoaXMuREVGQVVMVF9DT05URU5UX1RZUEU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlZiA9IG9wdGlvbnMuaGVhZGVycztcbiAgICAgICAgICAgICAgICBmb3IgKGhlYWRlciBpbiByZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZi5oYXNPd25Qcm9wZXJ0eShoZWFkZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZltoZWFkZXJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhoci5zZW5kKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3NlbmQnLCByZWplY3QsIG51bGwsIGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5nZXRYSFIoKSAtPiBYTUxIdHRwUmVxdWVzdFxuICAgICAqL1xuICAgIGdldFhIUigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hocjtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2F0dGFjaFdpbmRvd1VubG9hZCgpXG4gICAgICpcbiAgICAgKiBGaXggZm9yIElFIDkgYW5kIElFIDEwXG4gICAgICogSW50ZXJuZXQgRXhwbG9yZXIgZnJlZXplcyB3aGVuIHlvdSBjbG9zZSBhIHdlYnBhZ2UgZHVyaW5nIGFuIFhIUiByZXF1ZXN0XG4gICAgICogaHR0cHM6Ly9zdXBwb3J0Lm1pY3Jvc29mdC5jb20va2IvMjg1Njc0NlxuICAgICAqXG4gICAgICovXG4gICAgcHJpdmF0ZSBfYXR0YWNoV2luZG93VW5sb2FkKCkge1xuICAgICAgICB0aGlzLl91bmxvYWRIYW5kbGVyID0gdGhpcy5faGFuZGxlV2luZG93VW5sb2FkLmJpbmQodGhpcyk7XG4gICAgICAgIGlmICgod2luZG93IGFzIGFueSkuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkuYXR0YWNoRXZlbnQoJ29udW5sb2FkJywgdGhpcy5fdW5sb2FkSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2RldGFjaFdpbmRvd1VubG9hZCgpXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZGV0YWNoV2luZG93VW5sb2FkKCkge1xuICAgICAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLmRldGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmRldGFjaEV2ZW50KCdvbnVubG9hZCcsIHRoaXMuX3VubG9hZEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9nZXRIZWFkZXJzKCkgLT4gT2JqZWN0XG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0SGVhZGVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlSGVhZGVycyh0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0UmVzcG9uc2VUZXh0KCkgLT4gTWl4ZWRcbiAgICAgKlxuICAgICAqIFBhcnNlcyByZXNwb25zZSB0ZXh0IEpTT04gaWYgcHJlc2VudC5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXRSZXNwb25zZVRleHQoKSB7XG4gICAgICAgIGxldCByZXNwb25zZVRleHQ7XG4gICAgICAgIHJlc3BvbnNlVGV4dCA9IHR5cGVvZiB0aGlzLl94aHIucmVzcG9uc2VUZXh0ID09PSAnc3RyaW5nJyA/IHRoaXMuX3hoci5yZXNwb25zZVRleHQgOiAnJztcbiAgICAgICAgc3dpdGNoICgodGhpcy5feGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSB8fCAnJykuc3BsaXQoJzsnKVswXSkge1xuICAgICAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vanNvbic6XG4gICAgICAgICAgICBjYXNlICd0ZXh0L2phdmFzY3JpcHQnOlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0ICsgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZVRleHQ7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9nZXRSZXNwb25zZVVybCgpIC0+IFN0cmluZ1xuICAgICAqXG4gICAgICogQWN0dWFsIHJlc3BvbnNlIFVSTCBhZnRlciBmb2xsb3dpbmcgcmVkaXJlY3RzLlxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldFJlc3BvbnNlVXJsKCkge1xuICAgICAgICBpZiAodGhpcy5feGhyLnJlc3BvbnNlVVJMICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94aHIucmVzcG9uc2VVUkw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9eWC1SZXF1ZXN0LVVSTDovbS50ZXN0KHRoaXMuX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ1gtUmVxdWVzdC1VUkwnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9oYW5kbGVFcnJvcihyZWFzb24sIHJlamVjdCwgc3RhdHVzLCBzdGF0dXNUZXh0KVxuICAgICAqIC0gcmVhc29uIChTdHJpbmcpXG4gICAgICogLSByZWplY3QgKEZ1bmN0aW9uKVxuICAgICAqIC0gc3RhdHVzIChTdHJpbmcpXG4gICAgICogLSBzdGF0dXNUZXh0IChTdHJpbmcpXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaGFuZGxlRXJyb3IocmVhc29uLCByZWplY3QsIHN0YXR1cz8sIHN0YXR1c1RleHQ/KSB7XG4gICAgICAgIHRoaXMuX2RldGFjaFdpbmRvd1VubG9hZCgpO1xuXG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcignYnJvd3NlcicsIHJlamVjdCwgbnVsbCwgJ2Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCd1cmwnLCByZWplY3QsIG51bGwsICdVUkwgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCdwYXJzZScsIHJlamVjdCwgbnVsbCwgJ2ludmFsaWQgSlNPTiByZXNwb25zZScpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3RpbWVvdXQnLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdhYm9ydCcsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3NlbmQnLCByZWplY3QsIG51bGwsIGUudG9TdHJpbmcoKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdfaGFuZGxlRXJyb3I6JywgcmVhc29uLCB0aGlzLl94aHIuc3RhdHVzKTtcbiAgICAgICAgbGV0IGNvZGUgPSA0MDQ7XG4gICAgICAgIGlmIChyZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgY29kZSA9IDQwODtcbiAgICAgICAgfSBlbHNlIGlmIChyZWFzb24gPT09ICdhYm9ydCcpIHtcbiAgICAgICAgICAgIGNvZGUgPSA0MDg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVqZWN0KHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uLFxuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXMgfHwgdGhpcy5feGhyLnN0YXR1cyB8fCBjb2RlLFxuICAgICAgICAgICAgY29kZTogc3RhdHVzIHx8IHRoaXMuX3hoci5zdGF0dXMgfHwgY29kZSxcbiAgICAgICAgICAgIHN0YXR1c1RleHQ6IHN0YXR1c1RleHQgfHwgdGhpcy5feGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICB4aHI6IHRoaXMuX3hoclxuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2hhbmRsZVdpbmRvd1VubG9hZCgpXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaGFuZGxlV2luZG93VW5sb2FkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyLmFib3J0KCk7XG4gICAgfTtcblxuXG4gICAgcHJpdmF0ZSB0cmltKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQXJyYXkoYXJnKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cblxuICAgIHByaXZhdGUgZm9yRWFjaChsaXN0LCBpdGVyYXRvcikge1xuICAgICAgICBpZiAodG9TdHJpbmcuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoQXJyYXkobGlzdCwgaXRlcmF0b3IsIHRoaXMpXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmZvckVhY2hTdHJpbmcobGlzdCwgaXRlcmF0b3IsIHRoaXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZvckVhY2hPYmplY3QobGlzdCwgaXRlcmF0b3IsIHRoaXMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZvckVhY2hBcnJheShhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYXJyYXkuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG5vIHN1Y2ggdGhpbmcgYXMgYSBzcGFyc2Ugc3RyaW5nLlxuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZvckVhY2hPYmplY3Qob2JqZWN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmplY3Rba10sIGssIG9iamVjdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3BhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycykge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoKFxuICAgICAgICAgICAgdGhpcy50cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgLCAocm93KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG4gICAgICAgICAgICAgICAgICAgICwga2V5ID0gdGhpcy50cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgLCB2YWx1ZSA9IHRoaXMudHJpbShyb3cuc2xpY2UoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHJlc3VsdFtrZXldKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FycmF5KHJlc3VsdFtrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gW3Jlc3VsdFtrZXldLCB2YWx1ZV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHtYSFJQcm9taXNlfSBmcm9tICcuL3hocnByb21pc2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFhock9wdGlvbnNJbnRlcmZhY2Uge1xuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksXG4gICAgaGVhZGVycz86IGFueSxcbiAgICBhc3luYz86IGJvb2xlYW4sXG4gICAgdXNlcm5hbWU/OiBzdHJpbmcsXG4gICAgcGFzc3dvcmQ/OiBzdHJpbmcsXG4gICAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhblxufVxuXG5leHBvcnQgY2xhc3MgQWpheCB7XG5cbiAgICAvLyBwcml2YXRlIHN0YXRpYyB4aHI6IFhIUlByb21pc2UgPSBuZXcgWEhSUHJvbWlzZSgpO1xuICAgIHByaXZhdGUgeGhyOiBYSFJQcm9taXNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMueGhyID0gbmV3IFhIUlByb21pc2UoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHBvc3QoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55PiB7XG5cbiAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmwsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhcmdzLmRhdGEpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMueGhyXG4gICAgICAgICAgICAuc2VuZChvcHQpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPCAyMDAgfHwgcGFyc2VJbnQocmVzLnN0YXR1cywgMTApID49IDMwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlYXNvbiA9ICdzdGF0dXMnO1xuICAgICAgICAgICAgICAgICAgICByZXMuY29kZSA9IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ2Jyb3dzZXInLCByZWplY3QsIG51bGwsICdicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCd1cmwnLCByZWplY3QsIG51bGwsICdVUkwgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3BhcnNlJywgcmVqZWN0LCBudWxsLCAnaW52YWxpZCBKU09OIHJlc3BvbnNlJyk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3RpbWVvdXQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Fib3J0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKGVyci5yZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwODtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHV0KGFyZ3M6IFhock9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoYXJncy5kYXRhKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBvcHQuaGVhZGVycyA9IGFyZ3MuaGVhZGVycztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucmVhc29uID0gJ3N0YXR1cyc7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jb2RlID0gcGFyc2VJbnQocmVzLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZXJyLnJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA4O1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWxldGUoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdDogYW55ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmwsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhcmdzLmRhdGEpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLnNlbmQob3B0KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWFzb24gPSAnc3RhdHVzJztcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNvZGUgPSBwYXJzZUludChyZXMuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmIChlcnIucmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybFxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJncy5kYXRhKSB7XG4gICAgICAgICAgICBvcHQuZGF0YSA9IGFyZ3MuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBvcHQuaGVhZGVycyA9IGFyZ3MuaGVhZGVycztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucmVhc29uID0gJ3N0YXR1cyc7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jb2RlID0gcGFyc2VJbnQocmVzLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZXJyLnJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA4O1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7TG9jYWxTdG9yYWdlfSBmcm9tICcuLi90b29scyc7XG5pbXBvcnQge1Nka0ludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2V9IGZyb20gJy4uL3Nkay9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIENsaWVudCB7XG5cbiAgICBwdWJsaWMgY2xpZW50SWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudFV1aWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudEluZm86IHN0cmluZztcbiAgICBwcml2YXRlIHJlZnJlc2hUb2tlbjogc3RyaW5nO1xuICAgIHByaXZhdGUgc3RhdGljIHJlZnJlc2hDb3VudCA9IDA7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudFV1aWQgPSAndjIuY2xpZW50VXVpZCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudElkID0gJ3YyLmNsaWVudElkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVmcmVzaENvdW50ID0gJ3YyLnJlZnJlc2hDb3VudCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcElkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBVUkk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHN0b3JhZ2U6IExvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlKSB7XG5cbiAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRVdWlkKSB8fCAndXVpZC0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IGluZm8gPSAnX2NsaWVudEluZm8nOyAvLyB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SW5mbyk7XG4gICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93Lm5hdmlnYXRvcikge1xuICAgICAgICAgICAgaW5mbyA9IHdpbmRvdy5uYXZpZ2F0b3IuYXBwTmFtZSArICdAJyArIHdpbmRvdy5uYXZpZ2F0b3IuYXBwVmVyc2lvbiArICctJyArIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93WydkZXZpY2UnXSAmJiB3aW5kb3dbJ2RldmljZSddLnV1aWQpIHtcbiAgICAgICAgICAgIHV1aWQgPSB3aW5kb3dbJ2RldmljZSddLnV1aWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDbGllbnRVdWlkKHV1aWQpO1xuICAgICAgICB0aGlzLnNldENsaWVudEluZm8oaW5mbyk7XG4gICAgICAgIHRoaXMuY2xpZW50SWQgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SWQpO1xuICAgICAgICBDbGllbnQucmVmcmVzaENvdW50ID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX3JlZnJlc2hDb3VudCkgfHwgMDtcbiAgICB9O1xuXG4gICAgcHVibGljIHNldENsaWVudElkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRJZCA9ICcnICsgdmFsdWU7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9jbGllbnRJZCwgdGhpcy5jbGllbnRJZCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENsaWVudFV1aWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudFV1aWQgPSAnJyArIHZhbHVlO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fY2xpZW50VXVpZCwgdGhpcy5jbGllbnRVdWlkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50SW5mbyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50SW5mbyA9ICcnICsgdmFsdWU7XG4gICAgICAgIC8vIHRoaXMuc3RvcmFnZS5zZXQoJ2NsaWVudEluZm8nLCB0aGlzLmNsaWVudEluZm8pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsTG9naW4gPSB0aGlzLlVSSSArICcvdXNlcnMnO1xuICAgICAgICBjb25zdCBkYXRhTG9naW4gPSB7XG4gICAgICAgICAgICBuYW1lOiBsb2dpbixcbiAgICAgICAgICAgIHVzZXJuYW1lOiBsb2dpbixcbiAgICAgICAgICAgIGVtYWlsOiBsb2dpbixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmxMb2dpbixcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhTG9naW4sXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oY3JlYXRlZFVzZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDbGllbnRJZChjcmVhdGVkVXNlci5faWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybFRva2VuID0gdGhpcy5VUkkgKyAnL29hdXRoL3Rva2VuJztcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhVG9rZW4gPSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYW50X3R5cGU6ICdjbGllbnRfY3JlZGVudGlhbHMnLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9zZWNyZXQ6IHBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfdWRpZDogdGhpcy5jbGllbnRVdWlkLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6IEpTT04uc3RyaW5naWZ5KHRoaXMuc2RrKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmxUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZUF1dGhlbnRpY2F0ZShyZWZyZXNoVG9rZW46IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuVVJJICsgJy9vYXV0aC90b2tlbic7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBncmFudF90eXBlOiAncmVmcmVzaF90b2tlbicsXG4gICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICBjbGllbnRfdWRpZDogdGhpcy5jbGllbnRVdWlkLFxuICAgICAgICAgICAgY2xpZW50X2luZm86IHRoaXMuY2xpZW50SW5mbyxcbiAgICAgICAgICAgIGF1ZGllbmNlOiB0aGlzLmFwcElkLFxuICAgICAgICAgICAgc2NvcGU6IEpTT04uc3RyaW5naWZ5KHRoaXMuc2RrKSxcbiAgICAgICAgICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbixcbiAgICAgICAgICAgIHJlZnJlc2hfZXh0cmE6IENsaWVudC5yZWZyZXNoQ291bnQsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChvYmo6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQrKztcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fcmVmcmVzaENvdW50LCBDbGllbnQucmVmcmVzaENvdW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG9iaik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9nb3V0KHJlZnJlc2hUb2tlbj86IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWxldGUgdGhpcy5jbGllbnRVdWlkO1xuICAgICAgICAvLyBkZWxldGUgdGhpcy5jbGllbnRJZDtcbiAgICAgICAgLy8gdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX2NsaWVudFV1aWQpO1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlKENsaWVudC5fY2xpZW50SWQpO1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlKENsaWVudC5fcmVmcmVzaENvdW50KTtcbiAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCA9IDA7XG5cbiAgICAgICAgaWYgKCFyZWZyZXNoVG9rZW4gfHwgIXRoaXMuY2xpZW50SWQpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuVVJJICsgJy9vYXV0aC9yZXZva2UnO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgdG9rZW46IHJlZnJlc2hUb2tlbixcbiAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuVVJJO1xuICAgIH1cbn1cbiIsImltcG9ydCB7RXJyb3JJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBFcnJvciBpbXBsZW1lbnRzIEVycm9ySW50ZXJmYWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2RlOiBudW1iZXIsIHB1YmxpYyByZWFzb246IHN0cmluZykge1xuICAgIH07XG5cbiAgICBlcXVhbHMoZXJyOiBFcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2RlID09PSBlcnIuY29kZSAmJiB0aGlzLnJlYXNvbiA9PT0gZXJyLnJlYXNvbjtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtc2c6IHN0cmluZyA9ICh0eXBlb2YgdGhpcy5yZWFzb24gPT09ICdzdHJpbmcnKSA/IHRoaXMucmVhc29uIDogSlNPTi5zdHJpbmdpZnkodGhpcy5yZWFzb24pO1xuICAgICAgICByZXR1cm4gJycgKyB0aGlzLmNvZGUgKyAnIC0gJyArIG1zZztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7Q2xpZW50fSBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQge01vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsIFNka0ludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5pbXBvcnQge0Jhc2U2NCwgTG9jYWxTdG9yYWdlLCBYb3J9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7Q29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbiB7XG5cbiAgICBwdWJsaWMgZmlkaklkOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpDcnlwdG86IGJvb2xlYW47XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuUHJldmlvdXM6IHN0cmluZztcbiAgICBwdWJsaWMgaWRUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyByZWZyZXNoVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgc3RhdGVzOiB7IFtzOiBzdHJpbmddOiB7IHN0YXRlOiBib29sZWFuLCB0aW1lOiBudW1iZXIsIGxhc3RUaW1lV2FzT2s6IG51bWJlciB9OyB9OyAvLyBNYXA8c3RyaW5nLCBib29sZWFuPjtcbiAgICBwdWJsaWMgYXBpczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+O1xuXG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0TmV4dDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50OiBDbGllbnQ7XG4gICAgcHJpdmF0ZSB1c2VyOiBhbnk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBfYWNjZXNzVG9rZW4gPSAndjIuYWNjZXNzVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9hY2Nlc3NUb2tlblByZXZpb3VzID0gJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnO1xuICAgIHByaXZhdGUgc3RhdGljIF9pZFRva2VuID0gJ3YyLmlkVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9yZWZyZXNoVG9rZW4gPSAndjIucmVmcmVzaFRva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfc3RhdGVzID0gJ3YyLnN0YXRlcyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHQgPSAndjIuY3J5cHRvU2FsdCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHROZXh0ID0gJ3YyLmNyeXB0b1NhbHQubmV4dCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zZGs6IFNka0ludGVyZmFjZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9zdG9yYWdlOiBMb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgdGhpcy5jbGllbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHQgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0KSB8fCBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5fc3RvcmFnZS5nZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnKSB8fCBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9pZFRva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9zdGF0ZXMpIHx8IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSBbXTtcbiAgICB9O1xuXG4gICAgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jbGllbnQgJiYgdGhpcy5jbGllbnQuaXNSZWFkeSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koZm9yY2U/OiBib29sZWFuKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9pZFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fc3RhdGVzKTtcblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuUHJldmlvdXMsIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5jbGllbnQpIHtcbiAgICAgICAgICAgIC8vIHRoaXMuY2xpZW50LnNldENsaWVudElkKG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jbGllbnQubG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTsgLy8gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50KGNsaWVudDogQ2xpZW50KTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIGlmICghdGhpcy51c2VyKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMuX3VzZXIuX2lkID0gdGhpcy5fY2xpZW50LmNsaWVudElkO1xuICAgICAgICB0aGlzLnVzZXIuX25hbWUgPSBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHtuYW1lOiAnJ30pKS5uYW1lO1xuICAgIH1cblxuICAgIHNldFVzZXIodXNlcjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIGlmICh0aGlzLnVzZXIuX2lkKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5zZXRDbGllbnRJZCh0aGlzLnVzZXIuX2lkKTtcblxuICAgICAgICAgICAgLy8gc3RvcmUgb25seSBjbGllbnRJZFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMudXNlci5faWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRVc2VyKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXI7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50KCk6IENsaWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudDtcbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdCAhPT0gdmFsdWUgJiYgdGhpcy5jcnlwdG9TYWx0TmV4dCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0LCB0aGlzLmNyeXB0b1NhbHROZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdCA9IHRoaXMuY3J5cHRvU2FsdE5leHQ7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0LCB0aGlzLmNyeXB0b1NhbHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSBudWxsO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCk7XG4gICAgfVxuXG4gICAgZW5jcnlwdChkYXRhOiBhbnkpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBc09iaiA9IHtzdHJpbmc6IGRhdGF9O1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGFBc09iaik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgcmV0dXJuIFhvci5lbmNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlY3J5cHQoZGF0YTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgbGV0IGRlY3J5cHRlZCA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHROZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0TmV4dDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCAmJiB0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlY3J5cHRlZCAmJiBkZWNyeXB0ZWQuc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gZGVjcnlwdGVkLnN0cmluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVjcnlwdGVkO1xuICAgIH1cblxuICAgIGlzTG9naW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBleHAgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gSlNPTi5wYXJzZShCYXNlNjQuZGVjb2RlKHBheWxvYWQpKTtcbiAgICAgICAgICAgIGV4cCA9ICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBkZWNvZGVkLmV4cCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhZXhwO1xuICAgIH1cblxuICAgIC8vIHRvZG8gcmVpbnRlZ3JhdGUgY2xpZW50LmxvZ2luKClcblxuICAgIGxvZ291dCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnQoKS5sb2dvdXQodGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgIH1cblxuICAgIGdldENsaWVudElkKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5jbGllbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5jbGllbnRJZDtcbiAgICB9XG5cbiAgICBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0SWRQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuZ2V0SWRUb2tlbigpLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0QWNjZXNzUGF5bG9hZChkZWY/OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoZGVmICYmIHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cy5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYgPyBkZWYgOiBudWxsO1xuICAgIH1cblxuICAgIHJlZnJlc2hDb25uZWN0aW9uKCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICAvLyBzdG9yZSBzdGF0ZXNcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fc3RhdGVzLCB0aGlzLnN0YXRlcyk7XG5cbiAgICAgICAgLy8gdG9rZW4gbm90IGV4cGlyZWQgOiBva1xuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25ldyBEYXRlKCkuZ2V0VGltZSgpIDwgSlNPTi5wYXJzZShkZWNvZGVkKS5leHAgOicsIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCk7XG4gICAgICAgICAgICBpZiAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4cGlyZWQgcmVmcmVzaFRva2VuXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCBhY2Nlc3NUb2tlbiAmIGlkVG9rZW4gJiBzdG9yZSBpdCBhcyBQcmV2aW91cyBvbmVcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcblxuICAgICAgICAvLyByZWZyZXNoIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldENsaWVudCgpLnJlQXV0aGVudGljYXRlKHRoaXMucmVmcmVzaFRva2VuKVxuICAgICAgICAgICAgICAgIC50aGVuKHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENvbm5lY3Rpb24odXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDA4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDA4OyAvLyBubyBhcGkgdXJpIG9yIGJhc2ljIHRpbWVvdXQgOiBvZmZsaW5lXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDQ7IC8vIHBhZ2Ugbm90IGZvdW5kIDogb2ZmbGluZVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDAzOyAvLyB0b2tlbiBleHBpcmVkIG9yIGRldmljZSBub3Qgc3VyZSA6IG5lZWQgcmVsb2dpblxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwMzsgLy8gZm9yYmlkZGVuIDogbmVlZCByZWxvZ2luXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZlKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNldENvbm5lY3Rpb24oY2xpZW50VXNlcjogYW55KTogdm9pZCB7XG5cbiAgICAgICAgLy8gb25seSBpbiBwcml2YXRlIHN0b3JhZ2VcbiAgICAgICAgaWYgKGNsaWVudFVzZXIuYWNjZXNzX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gY2xpZW50VXNlci5hY2Nlc3NfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICBkZWxldGUgY2xpZW50VXNlci5hY2Nlc3NfdG9rZW47XG5cbiAgICAgICAgICAgIGNvbnN0IHNhbHQ6IHN0cmluZyA9IEpTT04ucGFyc2UodGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtzYWx0OiAnJ30pKS5zYWx0O1xuICAgICAgICAgICAgaWYgKHNhbHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHQoc2FsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFVzZXIuaWRfdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IGNsaWVudFVzZXIuaWRfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9pZFRva2VuLCB0aGlzLmlkVG9rZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGNsaWVudFVzZXIuaWRfdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFVzZXIucmVmcmVzaF90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBjbGllbnRVc2VyLnJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjbGllbnRVc2VyLnJlZnJlc2hfdG9rZW47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9yZSBjaGFuZ2VkIHN0YXRlc1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9zdGF0ZXMsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICAvLyBleHBvc2Ugcm9sZXMsIG1lc3NhZ2VcbiAgICAgICAgLy8gY2xpZW50VXNlci5yb2xlcyA9IHNlbGYuZmlkalJvbGVzKCk7XG4gICAgICAgIC8vIGNsaWVudFVzZXIubWVzc2FnZSA9IHNlbGYuZmlkak1lc3NhZ2UoKTtcbiAgICAgICAgY2xpZW50VXNlci5yb2xlcyA9IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcztcbiAgICAgICAgY2xpZW50VXNlci5tZXNzYWdlID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICAgICAgdGhpcy5zZXRVc2VyKGNsaWVudFVzZXIpO1xuICAgIH07XG5cbiAgICBzZXRDb25uZWN0aW9uT2ZmbGluZShvcHRpb25zOiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBvcHRpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4sIHRoaXMuYWNjZXNzVG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmlkVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IG9wdGlvbnMuaWRUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucmVmcmVzaFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IG9wdGlvbnMucmVmcmVzaFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuLCB0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFVzZXIoe1xuICAgICAgICAgICAgcm9sZXM6IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2UsXG4gICAgICAgICAgICBfaWQ6ICdkZW1vJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRBcGlFbmRwb2ludHMob3B0aW9ucz86IENvbm5lY3Rpb25GaW5kT3B0aW9uc0ludGVyZmFjZSk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG5cbiAgICAgICAgLy8gdG9kbyA6IGxldCBlYSA9IFsnaHR0cHM6Ly9maWRqL2FwaScsICdodHRwczovL2ZpZGotcHJveHkuaGVyb2t1YXBwLmNvbS9hcGknXTtcbiAgICAgICAgbGV0IGVhOiBFbmRwb2ludEludGVyZmFjZVtdID0gW1xuICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHBzOi8vZmlkai9hcGknLCBibG9ja2VkOiBmYWxzZX1dO1xuICAgICAgICBsZXQgZmlsdGVyZWRFYSA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5fc2RrLnByb2QpIHtcbiAgICAgICAgICAgIGVhID0gW1xuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjU4OTQvYXBpJywgYmxvY2tlZDogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwczovL2ZpZGotc2FuZGJveC5oZXJva3VhcHAuY29tL2FwaScsIGJsb2NrZWQ6IGZhbHNlfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmdldEFjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSk7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHZhbCkuYXBpcztcbiAgICAgICAgICAgIGlmIChhcGlFbmRwb2ludHMgJiYgYXBpRW5kcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVhID0gW107XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKSB7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHRoaXMuZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKHthcGlzOiBbXX0pKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwgJiYgZWEuZmlsdGVyKChyKSA9PiByLnVybCA9PT0gZW5kcG9pbnQudXJsKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bGRDaGVja1N0YXRlcyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZWFbaV0udXJsXSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIpIHtcblxuICAgICAgICAgICAgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgKGZpbHRlcmVkRWEubGVuZ3RoID09PSAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9sZE9uZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmVzdE9sZE9uZTogRW5kcG9pbnRJbnRlcmZhY2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICghYmVzdE9sZE9uZSB8fCB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgPiB0aGlzLnN0YXRlc1tiZXN0T2xkT25lLnVybF0ubGFzdFRpbWVXYXNPaykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdE9sZE9uZSA9IGVuZHBvaW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZXN0T2xkT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChiZXN0T2xkT25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChlYVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZEVhID0gZWE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRFYTtcbiAgICB9O1xuXG4gICAgZ2V0REJzKG9wdGlvbnM/OiBDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2UpOiBFbmRwb2ludEludGVyZmFjZVtdIHtcblxuICAgICAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG8gdGVzdCByYW5kb20gREIgY29ubmVjdGlvblxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICUgMjtcbiAgICAgICAgbGV0IGRicyA9IEpTT04ucGFyc2UodGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtkYnM6IFtdfSkpLmRicyB8fCBbXTtcblxuICAgICAgICAvLyBuZWVkIHRvIHN5bmNocm9uaXplIGRiXG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICAgIGRicyA9IGRicy5zb3J0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuZG9tID09PSAxKSB7XG4gICAgICAgICAgICBkYnMgPSBkYnMucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpbHRlcmVkREJzID0gW107XG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZGJzW2ldLnVybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCkgJiYgKGZpbHRlcmVkREJzLmxlbmd0aCA9PT0gMCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmVzJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJyAmJiBkYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGRic1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcyA9IGRicztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERCcztcbiAgICB9O1xuXG4gICAgdmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICAvLyB0b2RvIG5lZWQgdmVyaWZpY2F0aW9uID8gbm90IHlldCAoY2FjaGUpXG4gICAgICAgIC8vIGlmIChPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyAgICAgY29uc3QgdGltZSA9IHRoaXMuc3RhdGVzW09iamVjdC5rZXlzKHRoaXMuc3RhdGVzKVswXV0udGltZTtcbiAgICAgICAgLy8gICAgIGlmIChjdXJyZW50VGltZSA8IHRpbWUpIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyB2ZXJpZnkgdmlhIEdFVCBzdGF0dXMgb24gRW5kcG9pbnRzICYgREJzXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG4gICAgICAgIC8vIHRoaXMuc3RhdGVzID0ge307XG4gICAgICAgIHRoaXMuYXBpcyA9IHRoaXMuZ2V0QXBpRW5kcG9pbnRzKCk7XG4gICAgICAgIHRoaXMuYXBpcy5mb3JFYWNoKChlbmRwb2ludE9iaikgPT4ge1xuICAgICAgICAgICAgbGV0IGVuZHBvaW50VXJsOiBzdHJpbmcgPSBlbmRwb2ludE9iai51cmw7XG4gICAgICAgICAgICBpZiAoIWVuZHBvaW50VXJsKSB7XG4gICAgICAgICAgICAgICAgZW5kcG9pbnRVcmwgPSBlbmRwb2ludE9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRVcmwgKyAnL3N0YXR1cz9pc29rPScgKyB0aGlzLl9zZGsudmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pc29rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBzdGF0ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFRpbWVXYXNPayA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXS5sYXN0VGltZVdhc09rO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBmYWxzZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGxhc3RUaW1lV2FzT2t9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGJzID0gdGhpcy5nZXREQnMoKTtcbiAgICAgICAgZGJzLmZvckVhY2goKGRiRW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBkYkVuZHBvaW50OiBzdHJpbmcgPSBkYkVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZGJFbmRwb2ludCkge1xuICAgICAgICAgICAgICAgIGRiRW5kcG9pbnQgPSBkYkVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBkYkVuZHBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0gPSB7c3RhdGU6IHRydWUsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBjdXJyZW50VGltZX07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH07XG5cbn1cbiIsIi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGInO1xuLy8gbGV0IFBvdWNoREI6IGFueTtcblxuaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi4vc2RrL2Vycm9yJztcbmltcG9ydCB7RW5kcG9pbnRJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5cbmNvbnN0IEZpZGpQb3VjaCA9IHdpbmRvd1snUG91Y2hEQiddID8gd2luZG93WydQb3VjaERCJ10gOiByZXF1aXJlKCdwb3VjaGRiJykuZGVmYXVsdDsgLy8gLmRlZmF1bHQ7XG5cbi8vIGxvYWQgY29yZG92YSBhZGFwdGVyIDogaHR0cHM6Ly9naXRodWIuY29tL3BvdWNoZGItY29tbXVuaXR5L3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZS9pc3N1ZXMvMjJcbmNvbnN0IFBvdWNoQWRhcHRlckNvcmRvdmFTcWxpdGUgPSByZXF1aXJlKCdwb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUnKTtcbkZpZGpQb3VjaC5wbHVnaW4oUG91Y2hBZGFwdGVyQ29yZG92YVNxbGl0ZSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSB7XG4gICAgb2JqOiBPYmplY3QsXG4gICAgbWV0aG9kOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIFNlc3Npb24ge1xuXG4gICAgcHVibGljIGRiUmVjb3JkQ291bnQ6IG51bWJlcjtcbiAgICBwdWJsaWMgZGJMYXN0U3luYzogbnVtYmVyOyAvLyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgcHJpdmF0ZSBkYjogUG91Y2hEQjsgLy8gUG91Y2hEQlxuICAgIHByaXZhdGUgcmVtb3RlRGI6IFBvdWNoREI7IC8vIFBvdWNoREI7XG4gICAgcHJpdmF0ZSByZW1vdGVVcmk6IHN0cmluZztcbiAgICBwcml2YXRlIGRiczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICB0aGlzLnJlbW90ZURiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kYnMgPSBbXTtcbiAgICB9O1xuXG4gICAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZGI7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgY3JlYXRlKHVpZDogc3RyaW5nLCBmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghZm9yY2UgJiYgdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDsgLy8gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBvcHRzOiBhbnkgPSB7bG9jYXRpb246ICdkZWZhdWx0J307XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3dbJ2NvcmRvdmEnXSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzID0ge2xvY2F0aW9uOiAnZGVmYXVsdCcsIGFkYXB0ZXI6ICdjb3Jkb3ZhLXNxbGl0ZSd9O1xuICAgICAgICAgICAgICAgICAgICAvLyAgICBjb25zdCBwbHVnaW4gPSByZXF1aXJlKCdwb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgaWYgKHBsdWdpbikgeyBQb3VjaC5wbHVnaW4ocGx1Z2luKTsgfVxuICAgICAgICAgICAgICAgICAgICAvLyAgICB0aGlzLmRiID0gbmV3IFBvdWNoKCdmaWRqX2RiJywge2FkYXB0ZXI6ICdjb3Jkb3ZhLXNxbGl0ZSd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRiID0gbmV3IEZpZGpQb3VjaCgnZmlkal9kYl8nICsgdWlkLCBvcHRzKTsgLy8gLCB7YWRhcHRlcjogJ3dlYnNxbCd9ID8/P1xuICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZGIuaW5mbygpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gaWYgKGluZm8uYWRhcHRlciAhPT0gJ3dlYnNxbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHRoaXMuZGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBuZXdvcHRzOiBhbnkgPSBvcHRzIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3b3B0cy5hZGFwdGVyID0gJ2lkYic7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgbmV3ZGIgPSBuZXcgUG91Y2goJ2ZpZGpfZGInLCBvcHRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZGIucmVwbGljYXRlLnRvKG5ld2RiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5kYiA9IG5ld2RiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyLnRvU3RyaW5nKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVycikpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXN0cm95KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRiICYmICF0aGlzLmRiLmRlc3Ryb3kpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBhIHZhbGlkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIuZGVzdHJveSgoZXJyLCBpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBzZXRSZW1vdGUoZGJzOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kYnMgPSBkYnM7XG4gICAgfVxuXG4gICAgcHVibGljIHN5bmModXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5kYnMgfHwgIXRoaXMuZGJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGEgcmVtb3RlIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmVtb3RlRGIgfHwgdGhpcy5yZW1vdGVVcmkgIT09IHRoaXMuZGJzWzBdLnVybCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW90ZVVyaSA9IHRoaXMuZGJzWzBdLnVybDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdGVEYiA9IG5ldyBGaWRqUG91Y2godGhpcy5yZW1vdGVVcmkpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvICwge2hlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGlkX3Rva2VufX0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuZGIucmVwbGljYXRlLnRvKHRoaXMucmVtb3RlRGIpXG4gICAgICAgICAgICAgICAgICAgIC5vbignY29tcGxldGUnLCAoaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3RlRGIucmVwbGljYXRlLnRvKHRoaXMuZGIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoISF1c2VySWQgJiYgISFkb2MgJiYgZG9jLmZpZGpVc2VySWQgPT09IHVzZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignY29tcGxldGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9nZ2VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZGVuaWVkJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogZXJyfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAxLCByZWFzb246IGVycn0pKTtcblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAub24oJ2RlbmllZCcsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246IGVycn0pKVxuICAgICAgICAgICAgICAgICAgICAub24oJ2Vycm9yJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDEsIHJlYXNvbjogZXJyfSkpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXQoZGF0YTogYW55LFxuICAgICAgICAgICAgICAgX2lkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICB1aWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIG9pZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgYXZlOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhIHx8ICFfaWQgfHwgIXVpZCB8fCAhb2lkIHx8ICFhdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnbmVlZCBmb3JtYXRlZCBkYXRhJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YVdpdGhvdXRJZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgY29uc3QgdG9TdG9yZTogYW55ID0ge1xuICAgICAgICAgICAgX2lkOiBfaWQsXG4gICAgICAgICAgICBmaWRqVXNlcklkOiB1aWQsXG4gICAgICAgICAgICBmaWRqT3JnSWQ6IG9pZCxcbiAgICAgICAgICAgIGZpZGpBcHBWZXJzaW9uOiBhdmVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRhdGFXaXRob3V0SWRzLl9yZXYpIHtcbiAgICAgICAgICAgIHRvU3RvcmUuX3JldiA9ICcnICsgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX2lkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpVc2VySWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqT3JnSWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqQXBwVmVyc2lvbjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpEYXRhO1xuXG4gICAgICAgIGxldCByZXN1bHRBc1N0cmluZyA9IFNlc3Npb24ud3JpdGUoU2Vzc2lvbi52YWx1ZShkYXRhV2l0aG91dElkcykpO1xuICAgICAgICBpZiAoY3J5cHRvKSB7XG4gICAgICAgICAgICByZXN1bHRBc1N0cmluZyA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0ocmVzdWx0QXNTdHJpbmcpO1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGFjciA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGF0YSA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIucHV0KHRvU3RvcmUsIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLm9rICYmIHJlc3BvbnNlLmlkICYmIHJlc3BvbnNlLnJldikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQrKztcblxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wYWdhdGUgX3JldiAmIF9pZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9yZXYgPSByZXNwb25zZS5yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmUoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9jLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGIucHV0KGRvYyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0KGRhdGFfaWQ6IHN0cmluZywgY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAoISFyb3cuZmlkakRhY3IgfHwgISFyb3cuZmlkakRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJvdy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjcnlwdG8gJiYgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZmlkakRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShyb3cuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0QXNKc29uID0gU2Vzc2lvbi5leHRyYWN0SnNvbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX2lkID0gcm93Ll9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvdy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdCYWQgZW5jb2RpbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ05vIGRhdGEgZm91bmQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFsbChjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxBcnJheTxhbnk+IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIgfHwgISh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGEgdmFsaWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtpbmNsdWRlX2RvY3M6IHRydWUsIGRlc2NlbmRpbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgIC50aGVuKHJvd3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGwgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAhIXJvdy5kb2MuX2lkICYmICghIXJvdy5kb2MuZmlkakRhY3IgfHwgISFyb3cuZG9jLmZpZGpEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcm93LmRvYy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3J5cHRvICYmIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZG9jLmZpZGpEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJvdy5kb2MuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRBc0pzb24gPSBTZXNzaW9uLmV4dHJhY3RKc29uKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2goSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nIDogZGVsZXRlIHJvdycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsLnB1c2gocmVzdWx0QXNKc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93LmRvYy5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFsbCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IFByb21pc2U8Ym9vbGVhbiB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiIHx8ICEodGhpcy5kYiBhcyBhbnkpLmFsbERvY3MpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTm8gZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtcbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXI6ICAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24udXNlciB8fCAhc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vICAgIGlmIChkb2MuZmlkalVzZXJJZCA9PT0gc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTm8gcmVzcG9uc2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSByZXNwb25zZS50b3RhbF9yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsX3Jvd3MgJiYgcmVzcG9uc2UudG90YWxfcm93cyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdObyBkYicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kYi5pbmZvKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHdyaXRlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZihpdGVtKTtcbiAgICAgICAgaWYgKHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe3N0cmluZzogaXRlbX0pXG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe251bWJlcjogaXRlbX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7Ym9vbDogaXRlbX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtqc29uOiBpdGVtfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHN0YXRpYyB2YWx1ZShpdGVtOiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gaXRlbTtcbiAgICAgICAgaWYgKHR5cGVvZihpdGVtKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIC8vIHJldHVybiBpdGVtO1xuICAgICAgICB9IGVsc2UgaWYgKCdzdHJpbmcnIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uc3RyaW5nO1xuICAgICAgICB9IGVsc2UgaWYgKCdudW1iZXInIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0ubnVtYmVyLnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIGlmICgnYm9vbCcgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5ib29sLnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIGlmICgnanNvbicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5qc29uO1xuICAgICAgICAgICAgaWYgKHR5cGVvZihyZXN1bHQpICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHN0YXRpYyBleHRyYWN0SnNvbihpdGVtOiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gaXRlbTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChpdGVtKSA9PT0gJ29iamVjdCcgJiYgJ2pzb24nIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uanNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3VsdCkgPT09ICdvYmplY3QnICYmICdqc29uJyBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChyZXN1bHQgYXMgYW55KS5qc29uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuIiwiLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYic7XG4vLyBpbXBvcnQgKiBhcyBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbmltcG9ydCAqIGFzIHZlcnNpb24gZnJvbSAnLi4vdmVyc2lvbic7XG5pbXBvcnQgKiBhcyB0b29scyBmcm9tICcuLi90b29scyc7XG5pbXBvcnQgKiBhcyBjb25uZWN0aW9uIGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0ICogYXMgc2Vzc2lvbiBmcm9tICcuLi9zZXNzaW9uJztcbmltcG9ydCB7XG4gICAgTG9nZ2VySW50ZXJmYWNlLFxuICAgIE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSxcbiAgICBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLFxuICAgIFNka0ludGVyZmFjZSxcbiAgICBFcnJvckludGVyZmFjZSwgRW5kcG9pbnRJbnRlcmZhY2UsIEVuZHBvaW50RmlsdGVySW50ZXJmYWNlXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge1Nlc3Npb25DcnlwdG9JbnRlcmZhY2V9IGZyb20gJy4uL3Nlc3Npb24vc2Vzc2lvbic7XG5pbXBvcnQge0Vycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi4vY29ubmVjdGlvbi9hamF4JztcblxuLy8gY29uc3QgUG91Y2hEQiA9IHdpbmRvd1snUG91Y2hEQiddIHx8IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0O1xuXG4vKipcbiAqIHBsZWFzZSB1c2UgaXRzIGFuZ3VsYXIuanMgb3IgYW5ndWxhci5pbyB3cmFwcGVyXG4gKiB1c2VmdWxsIG9ubHkgZm9yIGZpZGogZGV2IHRlYW1cbiAqL1xuZXhwb3J0IGNsYXNzIEludGVybmFsU2VydmljZSB7XG5cbiAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlO1xuICAgIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3I7XG4gICAgcHJpdmF0ZSBzdG9yYWdlOiB0b29scy5Mb2NhbFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBzZXNzaW9uOiBzZXNzaW9uLlNlc3Npb247XG4gICAgcHJpdmF0ZSBjb25uZWN0aW9uOiBjb25uZWN0aW9uLkNvbm5lY3Rpb247XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IExvZ2dlckludGVyZmFjZSwgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yKSB7XG5cbiAgICAgICAgdGhpcy5zZGsgPSB7XG4gICAgICAgICAgICBvcmc6ICdmaWRqJyxcbiAgICAgICAgICAgIHZlcnNpb246IHZlcnNpb24udmVyc2lvbixcbiAgICAgICAgICAgIHByb2Q6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubG9nZ2VyID0ge1xuICAgICAgICAgICAgbG9nOiAoKSA9PiB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6ICgpID0+IHtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3YXJuOiAoKSA9PiB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmIChsb2dnZXIgJiYgd2luZG93LmNvbnNvbGUgJiYgbG9nZ2VyID09PSB3aW5kb3cuY29uc29sZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IgPSB3aW5kb3cuY29uc29sZS5lcnJvcjtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4gPSB3aW5kb3cuY29uc29sZS53YXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZSA6IGNvbnN0cnVjdG9yJyk7XG4gICAgICAgIGlmIChwcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IG5ldyB0b29scy5Mb2NhbFN0b3JhZ2Uod2luZG93LmxvY2FsU3RvcmFnZSwgJ2ZpZGouJyk7XG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IG5ldyBzZXNzaW9uLlNlc3Npb24oKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IGNvbm5lY3Rpb24uQ29ubmVjdGlvbih0aGlzLnNkaywgdGhpcy5zdG9yYWdlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IGNvbm5lY3Rpb24gJiBzZXNzaW9uXG4gICAgICogQ2hlY2sgdXJpXG4gICAgICogRG9uZSBlYWNoIGFwcCBzdGFydFxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqSWQgIHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalNhbHQgcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5maWRqVmVyc2lvbiByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmRldk1vZGUgb3B0aW9uYWwgZGVmYXVsdCBmYWxzZSwgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqSW5pdChmaWRqSWQ6IHN0cmluZywgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqSW5pdCA6ICcsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoIWZpZGpJZCkge1xuICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgOiBiYWQgaW5pdCcpO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ05lZWQgYSBmaWRqSWQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnNkay5wcm9kID0gIW9wdGlvbnMgPyB0cnVlIDogb3B0aW9ucy5wcm9kO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqSWQgPSBmaWRqSWQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqVmVyc2lvbiA9IHNlbGYuc2RrLnZlcnNpb247XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvID0gKCFvcHRpb25zIHx8ICFvcHRpb25zLmhhc093blByb3BlcnR5KCdjcnlwdG8nKSkgPyB0cnVlIDogb3B0aW9ucy5jcnlwdG87XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUJlc3RVcmw6IGFueSA9IHNlbGYuY29ubmVjdGlvbi5nZXRBcGlFbmRwb2ludHMoe2ZpbHRlcjogJ3RoZUJlc3RPbmUnfSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGVCZXN0T2xkVXJsOiBhbnkgPSBzZWxmLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T2xkT25lJ30pWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0xvZ2luID0gc2VsZi5maWRqSXNMb2dpbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsICYmIHRoZUJlc3RVcmwudXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVCZXN0VXJsID0gdGhlQmVzdFVybC51cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoZUJlc3RPbGRVcmwgJiYgdGhlQmVzdE9sZFVybC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZUJlc3RPbGRVcmwgPSB0aGVCZXN0T2xkVXJsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0VXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNMb2dpbiAmJiB0aGVCZXN0T2xkVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uc2V0Q2xpZW50KG5ldyBjb25uZWN0aW9uLkNsaWVudChzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0aGVCZXN0T2xkVXJsLCBzZWxmLnN0b3JhZ2UsIHNlbGYuc2RrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwNCwgJ05lZWQgb25lIGNvbm5lY3Rpb24gLSBvciB0b28gb2xkIFNESyB2ZXJzaW9uIChjaGVjayB1cGRhdGUpJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0OiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGwgaXQgaWYgZmlkaklzTG9naW4oKSA9PT0gZmFsc2VcbiAgICAgKiBFcmFzZSBhbGwgKGRiICYgc3RvcmFnZSlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpMb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbicpO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDQsICdOZWVkIGFuIGludGlhbGl6ZWQgRmlkalNlcnZpY2UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi52ZXJpZnlDb25uZWN0aW9uU3RhdGVzKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9jcmVhdGVTZXNzaW9uKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fbG9naW5JbnRlcm5hbChsb2dpbiwgcGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb24odXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbjogJywgZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5hY2Nlc3NUb2tlbiBvcHRpb25hbFxuICAgICAqIEBwYXJhbSBvcHRpb25zLmlkVG9rZW4gIG9wdGlvbmFsXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy8gZ2VuZXJhdGUgb25lIGRheSB0b2tlbnMgaWYgbm90IHNldFxuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBub3cuc2V0RGF0ZShub3cuZ2V0RGF0ZSgpICsgMSk7XG4gICAgICAgICAgICBjb25zdCB0b21vcnJvdyA9IG5vdy5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdG9vbHMuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgcm9sZXM6IFtdLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdkZW1vJyxcbiAgICAgICAgICAgICAgICBhcGlzOiBbXSxcbiAgICAgICAgICAgICAgICBlbmRwb2ludHM6IHt9LFxuICAgICAgICAgICAgICAgIGRiczogW10sXG4gICAgICAgICAgICAgICAgZXhwOiB0b21vcnJvd1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc3Qgand0U2lnbiA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gand0U2lnbiArICcuJyArIHBheWxvYWQgKyAnLicgKyBqd3RTaWduO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgaWRUb2tlbjogdG9rZW4sXG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiB0b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakxvZ2luIGVycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqR2V0RW5kcG9pbnRzKGZpbHRlcj86IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIWZpbHRlcikge1xuICAgICAgICAgICAgZmlsdGVyID0ge3Nob3dCbG9ja2VkOiBmYWxzZX07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVuZHBvaW50cyA9IEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldEFjY2Vzc1BheWxvYWQoe2VuZHBvaW50czogW119KSkuZW5kcG9pbnRzO1xuICAgICAgICBpZiAoIWVuZHBvaW50cykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5kcG9pbnRzID0gZW5kcG9pbnRzLmZpbHRlcigoZW5kcG9pbnQ6IEVuZHBvaW50SW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgb2sgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9rICYmIGZpbHRlci5rZXkpIHtcbiAgICAgICAgICAgICAgICBvayA9IChlbmRwb2ludC5rZXkgPT09IGZpbHRlci5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9rICYmICFmaWx0ZXIuc2hvd0Jsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICBvayA9ICFlbmRwb2ludC5ibG9ja2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9rO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVuZHBvaW50cztcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkak1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5jb25uZWN0aW9uLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpJc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmlzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpMb2dvdXQoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5sb2dvdXQoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YSBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhX0FyZyBhcmcgdG8gc2V0IHRvIGZuSW5pdEZpcnN0RGF0YSgpXG4gICAgICogQHJldHVybnMgIHByb21pc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhPywgZm5Jbml0Rmlyc3REYXRhX0FyZz8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jJyk7XG4gICAgICAgIC8vIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAvLyAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdCgnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyA6IERCIHN5bmMgaW1wb3NzaWJsZS4gRGlkIHlvdSBsb2dpbiA/Jyk7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBjb25zdCBmaXJzdFN5bmMgPSAoc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPT09IG51bGwpO1xuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5zeW5jKHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpTeW5jIHJlc29sdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uaXNFbXB0eSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIud2FybignZmlkai5zZGsuc2VydmljZS5maWRqU3luYyB3YXJuOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpc0VtcHR5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBpc0VtcHR5IDogJywgaXNFbXB0eSwgZmlyc3RTeW5jKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmVFbXB0eSwgcmVqZWN0RW1wdHlOb3RVc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eSAmJiBmaXJzdFN5bmMgJiYgZm5Jbml0Rmlyc3REYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gZm5Jbml0Rmlyc3REYXRhKGZuSW5pdEZpcnN0RGF0YV9BcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgJiYgcmV0WydjYXRjaCddIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnRoZW4ocmVzb2x2ZUVtcHR5KS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIubG9nKHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZUVtcHR5KCk7IC8vIHNlbGYuY29ubmVjdGlvbi5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBmbkluaXRGaXJzdERhdGEgcmVzb2x2ZWQ6ICcsIGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJMYXN0U3luYyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmluZm8oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmRvY19jb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSByZXN1bHQuZG9jX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyBfZGJSZWNvcmRDb3VudCA6ICcgKyBzZWxmLnNlc3Npb24uZGJSZWNvcmRDb3VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3JJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihlcnIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSA0MDMgfHwgZXJyLmNvZGUgPT09IDQxMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlkakxvZ291dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAnU3luY2hyb25pemF0aW9uIHVuYXV0aG9yaXplZCA6IG5lZWQgdG8gbG9naW4gYWdhaW4uJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gd2hhdCB0byBkbyB3aXRoIHRoaXMgZXJyID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1lc3NhZ2UgPSAnRXJyb3IgZHVyaW5nIHN5bmNyb25pc2F0aW9uOiAnICsgZXJyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxmLmxvZ2dlci5lcnJvcihlcnJNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNTAwLCByZWFzb246IGVyck1lc3NhZ2V9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalB1dEluRGIoZGF0YTogYW55KTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQdXRJbkRiOiAnLCBkYXRhKTtcblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpIHx8ICFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnREIgcHV0IGltcG9zc2libGUuIE5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgX2lkOiBzdHJpbmc7XG4gICAgICAgIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKCdfaWQnKSkge1xuICAgICAgICAgICAgX2lkID0gZGF0YS5faWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfaWQpIHtcbiAgICAgICAgICAgIF9pZCA9IHNlbGYuX2dlbmVyYXRlT2JqZWN0VW5pcXVlSWQoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNyeXB0bzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZTtcbiAgICAgICAgaWYgKHNlbGYuY29ubmVjdGlvbi5maWRqQ3J5cHRvKSB7XG4gICAgICAgICAgICBjcnlwdG8gPSB7XG4gICAgICAgICAgICAgICAgb2JqOiBzZWxmLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnZW5jcnlwdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucHV0KFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpLFxuICAgICAgICAgICAgc2VsZi5zZGsub3JnLFxuICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLmZpZGpWZXJzaW9uLFxuICAgICAgICAgICAgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpSZW1vdmVJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalJlbW92ZUluRGIgJywgZGF0YV9pZCk7XG5cbiAgICAgICAgaWYgKCFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnREIgcmVtb3ZlIGltcG9zc2libGUuICcgK1xuICAgICAgICAgICAgICAgICdOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhX2lkIHx8IHR5cGVvZiBkYXRhX2lkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ0RCIHJlbW92ZSBpbXBvc3NpYmxlLiAnICtcbiAgICAgICAgICAgICAgICAnTmVlZCB0aGUgZGF0YS5faWQuJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5yZW1vdmUoZGF0YV9pZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqRmluZEluRGIoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSB8fCAhc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakZpbmRJbkRiIDogbmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXQoZGF0YV9pZCwgY3J5cHRvKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpGaW5kQWxsSW5EYigpOiBQcm9taXNlPEFycmF5PGFueT4gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnRJZCgpIHx8ICFzZWxmLnNlc3Npb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAxLCAnTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2RlY3J5cHQnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5nZXRBbGwoY3J5cHRvKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZXNvbHZlKChyZXN1bHRzIGFzIEFycmF5PGFueT4pKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkalBvc3RPbkVuZHBvaW50KGtleTogc3RyaW5nLCBkYXRhPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXI6IEVuZHBvaW50RmlsdGVySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZW5kcG9pbnRzID0gdGhpcy5maWRqR2V0RW5kcG9pbnRzKGZpbHRlcik7XG4gICAgICAgIGlmICghZW5kcG9pbnRzIHx8IGVuZHBvaW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KFxuICAgICAgICAgICAgICAgIG5ldyBFcnJvcig0MDAsXG4gICAgICAgICAgICAgICAgICAgICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpQb3N0T25FbmRwb2ludCA6IGVuZHBvaW50IGRvZXMgbm90IGV4aXN0LicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVuZHBvaW50VXJsID0gZW5kcG9pbnRzWzBdLnVybDtcbiAgICAgICAgY29uc3Qgand0ID0gdGhpcy5jb25uZWN0aW9uLmdldElkVG9rZW4oKTtcbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsLFxuICAgICAgICAgICAgICAgIC8vIG5vdCB1c2VkIDogd2l0aENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBqd3RcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgfTtcblxuICAgIC8vIEludGVybmFsIGZ1bmN0aW9uc1xuXG4gICAgLyoqXG4gICAgICogTG9nb3V0IHRoZW4gTG9naW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2dpblxuICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAqIEBwYXJhbSB1cGRhdGVQcm9wZXJ0aWVzXG4gICAgICovXG4gICAgcHJpdmF0ZSBfbG9naW5JbnRlcm5hbChsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLl9sb2dpbkludGVybmFsJyk7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMywgJ05lZWQgYW4gaW50aWFsaXplZCBGaWRqU2VydmljZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgc2VsZi5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5sb2dvdXQoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jb25uZWN0aW9uLmdldENsaWVudCgpLmxvZ2luKGxvZ2luLCBwYXNzd29yZCwgdXBkYXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGxvZ2luVXNlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpblVzZXIuZW1haWwgPSBsb2dpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobG9naW5Vc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5fbG9naW5JbnRlcm5hbCBlcnJvciA6ICcgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgX3JlbW92ZUFsbCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24uZGVzdHJveSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmRlc3Ryb3koKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfY3JlYXRlU2Vzc2lvbih1aWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zZXRSZW1vdGUodGhpcy5jb25uZWN0aW9uLmdldERCcyh7ZmlsdGVyOiAndGhlQmVzdE9uZXMnfSkpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZSh1aWQpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIF90ZXN0UHJvbWlzZShhPyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlc29sdmUoJ3Rlc3QgcHJvbWlzZSBvayAnICsgYSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgndGVzdCBwcm9taXNlIG9rJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBfc3J2RGF0YVVuaXFJZCA9IDA7XG5cbiAgICBwcml2YXRlIF9nZW5lcmF0ZU9iamVjdFVuaXF1ZUlkKGFwcE5hbWUsIHR5cGU/LCBuYW1lPykge1xuXG4gICAgICAgIC8vIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zdCBzaW1wbGVEYXRlID0gJycgKyBub3cuZ2V0RnVsbFllYXIoKSArICcnICsgbm93LmdldE1vbnRoKCkgKyAnJyArIG5vdy5nZXREYXRlKClcbiAgICAgICAgICAgICsgJycgKyBub3cuZ2V0SG91cnMoKSArICcnICsgbm93LmdldE1pbnV0ZXMoKTsgLy8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICBjb25zdCBzZXF1SWQgPSArK0ludGVybmFsU2VydmljZS5fc3J2RGF0YVVuaXFJZDtcbiAgICAgICAgbGV0IFVJZCA9ICcnO1xuICAgICAgICBpZiAoYXBwTmFtZSAmJiBhcHBOYW1lLmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgVUlkICs9IGFwcE5hbWUuY2hhckF0KDApICsgJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgJiYgdHlwZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBVSWQgKz0gdHlwZS5zdWJzdHJpbmcoMCwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUgJiYgbmFtZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICBVSWQgKz0gbmFtZS5zdWJzdHJpbmcoMCwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgVUlkICs9IHNpbXBsZURhdGUgKyAnJyArIHNlcXVJZDtcbiAgICAgICAgcmV0dXJuIFVJZDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIExvZ2dlckludGVyZmFjZSwgTW9kdWxlU2VydmljZUludGVyZmFjZSwgTW9kdWxlU2VydmljZUluaXRPcHRpb25zSW50ZXJmYWNlLCBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLFxuICAgIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZVxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtJbnRlcm5hbFNlcnZpY2V9IGZyb20gJy4vaW50ZXJuYWwuc2VydmljZSc7XG5pbXBvcnQge0Vycm9yIGFzIEZpZGpFcnJvcn0gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5cbi8qKlxuICogQW5ndWxhcjIrIEZpZGpTZXJ2aWNlXG4gKiBAc2VlIE1vZHVsZVNlcnZpY2VJbnRlcmZhY2VcbiAqXG4gKiBAZXhlbXBsZVxuICogICAgICAvLyAuLi4gYWZ0ZXIgaW5zdGFsbCA6XG4gKiAgICAgIC8vICQgbnBtIGluc3RhbGwgLS1zYXZlLWRldiBmaWRqXG4gKiAgICAgIC8vIHRoZW4gaW5pdCB5b3VyIGFwcC5qcyAmIHVzZSBpdCBpbiB5b3VyIHNlcnZpY2VzXG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYvcmF3LzVmZmY2OWRkOWMxNWY2OTJhODU2ZGI2MmNmMzM0YjcyNGVmM2Y0YWMvYW5ndWxhci5maWRqLmluamVjdC5qc1wiPjwvc2NyaXB0PlxuICpcbiAqIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2L3Jhdy81ZmZmNjlkZDljMTVmNjkyYTg1NmRiNjJjZjMzNGI3MjRlZjNmNGFjL2FuZ3VsYXIuZmlkai5zeW5jLmpzXCI+PC9zY3JpcHQ+XG4gKlxuICpcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpZGpTZXJ2aWNlIGltcGxlbWVudHMgTW9kdWxlU2VydmljZUludGVyZmFjZSB7XG5cbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlO1xuICAgIHByaXZhdGUgZmlkalNlcnZpY2U6IEludGVybmFsU2VydmljZTtcbiAgICBwcml2YXRlIHByb21pc2U6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXJTZXJ2aWNlKCk7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IFByb21pc2U7XG4gICAgICAgIHRoaXMuZmlkalNlcnZpY2UgPSBudWxsO1xuICAgICAgICAvLyBsZXQgcG91Y2hkYlJlcXVpcmVkID0gUG91Y2hEQjtcbiAgICAgICAgLy8gcG91Y2hkYlJlcXVpcmVkLmVycm9yKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBpbml0KGZpZGpJZCwgb3B0aW9ucz86IE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZSA9IG5ldyBJbnRlcm5hbFNlcnZpY2UodGhpcy5sb2dnZXIsIHRoaXMucHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWRFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXRBdXRoRW5kcG9pbnQob3B0aW9ucy5mb3JjZWRFbmRwb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlLnNldERCRW5kcG9pbnQob3B0aW9ucy5mb3JjZWREQkVuZHBvaW50KTtcbiAgICAgICAgfSovXG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpJbml0KGZpZGpJZCwgb3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dpbihsb2dpbiwgcGFzc3dvcmQpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbiA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ2luKGxvZ2luLCBwYXNzd29yZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsb2dpbkFzRGVtbyhvcHRpb25zPzogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luQXNEZW1vIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9naW5JbkRlbW9Nb2RlKG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIHRoaXMucHJvbWlzZS5yZWplY3QoJ2ZpZGouc2RrLmFuZ3VsYXIyLmlzTG9nZ2VkSW4gOiBub3QgaW5pdGlhbGl6ZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkaklzTG9naW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldFJvbGVzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUm9sZXMoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldEVuZHBvaW50cygpOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqR2V0RW5kcG9pbnRzKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBwb3N0T25FbmRwb2ludChrZXk6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW5Bc0RlbW8gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpQb3N0T25FbmRwb2ludChrZXksIGRhdGEpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0SWRUb2tlbigpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqR2V0SWRUb2tlbigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZ2V0TWVzc2FnZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTWVzc2FnZSgpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dvdXQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dvdXQoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTeW5jaHJvbml6ZSBEQlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgIGEgZnVuY3Rpb24gd2l0aCBkYiBhcyBpbnB1dCBhbmQgdGhhdCByZXR1cm4gcHJvbWlzZTogY2FsbCBpZiBEQiBpcyBlbXB0eVxuICAgICAqIEByZXR1cm5zIHByb21pc2Ugd2l0aCB0aGlzLnNlc3Npb24uZGJcbiAgICAgKiBAbWVtYmVyb2YgZmlkai5hbmd1bGFyU2VydmljZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgbGV0IGluaXREYiA9IGZ1bmN0aW9uKCkge1xuICAgICAqICAgICB0aGlzLmZpZGpTZXJ2aWNlLnB1dCgnbXkgZmlyc3Qgcm93Jyk7XG4gICAgICogIH07XG4gICAgICogIHRoaXMuZmlkalNlcnZpY2Uuc3luYyhpbml0RGIpXG4gICAgICogIC50aGVuKHVzZXIgPT4gLi4uKVxuICAgICAqICAuY2F0Y2goZXJyID0+IC4uLilcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBzeW5jKGZuSW5pdEZpcnN0RGF0YT8pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuc3luYyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalN5bmMoZm5Jbml0Rmlyc3REYXRhLCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZGF0YSBpbiB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhIHRvIHN0b3JlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcHV0KGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnB1dCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalB1dEluRGIoZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgb2JqZWN0IElkIGFuZCByZW1vdmUgaXQgZnJvbSB5b3VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCBvZiBvYmplY3QgdG8gZmluZCBhbmQgcmVtb3ZlXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlKGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIucmVtb3ZlIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUmVtb3ZlSW5EYihpZCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZChpZDogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRJbkRiKGlkKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpbmRBbGwoKTogUHJvbWlzZTxhbnlbXSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5maW5kQWxsIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqRmluZEFsbEluRGIoKTtcbiAgICB9O1xuXG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIGltcGxlbWVudHMgTG9nZ2VySW50ZXJmYWNlIHtcbiAgICBsb2cobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIGVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHdhcm4obWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG59XG5cbiIsImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0ZpZGpTZXJ2aWNlfSBmcm9tICcuL2FuZ3VsYXIuc2VydmljZSc7XG5cblxuLyoqXG4gKiBgTmdNb2R1bGVgIHdoaWNoIHByb3ZpZGVzIGFzc29jaWF0ZWQgc2VydmljZXMuXG4gKlxuICogLi4uXG4gKlxuICogQHN0YWJsZVxuICovXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxuXG4gICAgZXhwb3J0czogW10sXG5cbiAgICBwcm92aWRlcnM6IFtGaWRqU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgRmlkak1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxufVxuXG5cbi8qKlxuICogbW9kdWxlIEZpZGpNb2R1bGVcbiAqXG4gKiBleGVtcGxlXG4gKiAgICAgIC8vIC4uLiBhZnRlciBpbnN0YWxsIDpcbiAqICAgICAgLy8gJCBucG0gaW5zdGFsbCBmaWRqXG4gKiAgICAgIC8vIHRoZW4gaW5pdCB5b3VyIGFwcC5qcyAmIHVzZSBpdCBpbiB5b3VyIHNlcnZpY2VzXG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHViLmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2LmpzXCI+PC9zY3JpcHQ+XG4gKlxuICogPHNjcmlwdCBzcmM9XCJodHRwczovL2dpc3QuZ2l0aHViLmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2LmpzXCI+PC9zY3JpcHQ+XG4gKi9cbiJdLCJuYW1lcyI6WyJFcnJvciIsInZlcnNpb24udmVyc2lvbiIsInRvb2xzLkxvY2FsU3RvcmFnZSIsInNlc3Npb24uU2Vzc2lvbiIsImNvbm5lY3Rpb24uQ29ubmVjdGlvbiIsImNvbm5lY3Rpb24uQ2xpZW50IiwidG9vbHMuQmFzZTY0IiwiRmlkakVycm9yIiwiSW5qZWN0YWJsZSIsIk5n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