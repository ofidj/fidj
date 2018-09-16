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
    var version = '2.1.13';

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
                    { key: 'fidj.default', url: 'https://fidj.ovh/api', blocked: false }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlkai51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL2ZpZGovdG9vbHMvYmFzZTY0LnRzIiwibmc6Ly9maWRqL3Rvb2xzL3N0b3JhZ2UudHMiLCJuZzovL2ZpZGovdG9vbHMveG9yLnRzIiwibmc6Ly9maWRqL3ZlcnNpb24vaW5kZXgudHMiLCJuZzovL2ZpZGovY29ubmVjdGlvbi94aHJwcm9taXNlLnRzIiwibmc6Ly9maWRqL2Nvbm5lY3Rpb24vYWpheC50cyIsIm5nOi8vZmlkai9jb25uZWN0aW9uL2NsaWVudC50cyIsIm5nOi8vZmlkai9zZGsvZXJyb3IudHMiLCJuZzovL2ZpZGovY29ubmVjdGlvbi9jb25uZWN0aW9uLnRzIiwibmc6Ly9maWRqL3Nlc3Npb24vc2Vzc2lvbi50cyIsIm5nOi8vZmlkai9zZGsvaW50ZXJuYWwuc2VydmljZS50cyIsIm5nOi8vZmlkai9zZGsvYW5ndWxhci5zZXJ2aWNlLnRzIiwibmc6Ly9maWRqL3Nkay9maWRqLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQmFzZTY0IHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNvZGVzIHN0cmluZyBmcm9tIEJhc2U2NCBzdHJpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGVuY29kZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChpbnB1dCkucmVwbGFjZSgvJShbMC05QS1GXXsyfSkvZyxcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRvU29saWRCeXRlcyhtYXRjaCwgcDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludCgnMHgnICsgcDEsIDE2KSk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGRlY29kZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoYXRvYihpbnB1dCkuc3BsaXQoJycpLm1hcCgoYykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICclJyArICgnMDAnICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xuICAgICAgICB9KS5qb2luKCcnKSk7XG5cbiAgICB9XG59XG4iLCIvKipcbiAqIGxvY2FsU3RvcmFnZSBjbGFzcyBmYWN0b3J5XG4gKiBVc2FnZSA6IHZhciBMb2NhbFN0b3JhZ2UgPSBmaWRqLkxvY2FsU3RvcmFnZUZhY3Rvcnkod2luZG93LmxvY2FsU3RvcmFnZSk7IC8vIHRvIGNyZWF0ZSBhIG5ldyBjbGFzc1xuICogVXNhZ2UgOiB2YXIgbG9jYWxTdG9yYWdlU2VydmljZSA9IG5ldyBMb2NhbFN0b3JhZ2UoKTsgLy8gdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2Uge1xuXG4gICAgcHVibGljIHZlcnNpb24gPSAnMC4xJztcbiAgICBwcml2YXRlIHN0b3JhZ2U7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yKHN0b3JhZ2VTZXJ2aWNlLCBwcml2YXRlIHN0b3JhZ2VLZXkpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gc3RvcmFnZVNlcnZpY2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Mb2NhbFN0b3JhZ2VGYWN0b3J5IG5lZWRzIGEgc3RvcmFnZVNlcnZpY2UhJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdG9kbyBMb2NhbFN0b3JhZ2UgcmVmYWN0b1xuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5YbWwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLlhtbCBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouWG1sLmlzWG1sIHx8ICFmaWRqLlhtbC54bWwyU3RyaW5nIHx8ICFmaWRqLlhtbC5zdHJpbmcyWG1sKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5YbWwgd2l0aCBpc1htbCgpLCB4bWwyU3RyaW5nKClcbiAgICAgICAgLy8gYW5kIHN0cmluZzJYbWwoKSBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbi5vYmplY3QyU3RyaW5nIHx8ICFmaWRqLkpzb24uc3RyaW5nMk9iamVjdCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiB3aXRoIG9iamVjdDJTdHJpbmcoKVxuICAgICAgICAvLyBhbmQgc3RyaW5nMk9iamVjdCgpIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgIH1cblxuICAgIC8vIFB1YmxpYyBBUElcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBrZXkncyB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXkgLSBLZXkgdG8gc2V0LiBJZiB0aGlzIHZhbHVlIGlzIG5vdCBzZXQgb3Igbm90XG4gICAgICogICAgICAgICAgICAgIGEgc3RyaW5nIGFuIGV4Y2VwdGlvbiBpcyByYWlzZWQuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVmFsdWUgdG8gc2V0LiBUaGlzIGNhbiBiZSBhbnkgdmFsdWUgdGhhdCBpcyBKU09OXG4gICAgICogICAgICAgICAgICAgIGNvbXBhdGlibGUgKE51bWJlcnMsIFN0cmluZ3MsIE9iamVjdHMgZXRjLikuXG4gICAgICogQHJldHVybnMgdGhlIHN0b3JlZCB2YWx1ZSB3aGljaCBpcyBhIGNvbnRhaW5lciBvZiB1c2VyIHZhbHVlLlxuICAgICAqL1xuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWUpIHtcblxuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgLy8gY2xvbmUgdGhlIG9iamVjdCBiZWZvcmUgc2F2aW5nIHRvIHN0b3JhZ2VcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZih2YWx1ZSk7XG4gICAgICAgIGlmICh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtzdHJpbmc6IHZhbHVlfSlcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7bnVtYmVyOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7Ym9vbDogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7anNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlamVjdCBhbmQgZG8gbm90IGluc2VydFxuICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIGZvciBleGFtcGxlXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSB0eXBlICcgKyB0ICsgJyBpcyBpbnZhbGlkLiBJdCBtdXN0IGJlIG51bGwsIHVuZGVmaW5lZCwgeG1sLCBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiBvciBvYmplY3QnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBMb29rcyB1cCBhIGtleSBpbiBjYWNoZVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleSAtIEtleSB0byBsb29rIHVwLlxuICAgICAqIEBwYXJhbSBkZWYgLSBEZWZhdWx0IHZhbHVlIHRvIHJldHVybiwgaWYga2V5IGRpZG4ndCBleGlzdC5cbiAgICAgKiBAcmV0dXJucyB0aGUga2V5IHZhbHVlLCBkZWZhdWx0IHZhbHVlIG9yIDxudWxsPlxuICAgICAqL1xuICAgIGdldChrZXk6IHN0cmluZywgZGVmPykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2UoaXRlbSk7XG5cbiAgICAgICAgICAgIC8vIHZhciB2YWx1ZSA9IGZpZGouSnNvbi5zdHJpbmcyT2JqZWN0KGl0ZW0pO1xuICAgICAgICAgICAgLy8gaWYgKCd4bWwnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZpZGouWG1sLnN0cmluZzJYbWwodmFsdWUueG1sKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZVxuICAgICAgICAgICAgaWYgKCdzdHJpbmcnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnN0cmluZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubnVtYmVyLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ2Jvb2wnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmJvb2wudmFsdWVPZigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuanNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIWRlZiA/IG51bGwgOiBkZWY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgYSBrZXkgZnJvbSBjYWNoZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAga2V5IC0gS2V5IHRvIGRlbGV0ZS5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGtleSBleGlzdGVkIG9yIGZhbHNlIGlmIGl0IGRpZG4ndFxuICAgICAqL1xuICAgIHJlbW92ZShrZXk6IHN0cmluZykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgZXhpc3RlZCA9ICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgZXZlcnl0aGluZyBpbiBjYWNoZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdHJ1ZVxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICBjb25zdCBleGlzdGVkID0gKHRoaXMuc3RvcmFnZS5sZW5ndGggPiAwKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBleGlzdGVkO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBzcGFjZSBpbiBieXRlcyBkb2VzIHRoZSBzdG9yYWdlIHRha2U/XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBOdW1iZXJcbiAgICAgKi9cbiAgICBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBmdW5jdGlvbiBmIG9uIHRoZSBzcGVjaWZpZWQgY29udGV4dCBmb3IgZWFjaCBlbGVtZW50IG9mIHRoZSBzdG9yYWdlXG4gICAgICogZnJvbSBpbmRleCAwIHRvIGluZGV4IGxlbmd0aC0xLlxuICAgICAqIFdBUk5JTkcgOiBZb3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhlIHN0b3JhZ2UgZHVyaW5nIHRoZSBsb29wICEhIVxuICAgICAqXG4gICAgICogQHBhcmFtIGYgLSBGdW5jdGlvbiB0byBjYWxsIG9uIGV2ZXJ5IGl0ZW0uXG4gICAgICogQHBhcmFtICBjb250ZXh0IC0gQ29udGV4dCAodGhpcyBmb3IgZXhhbXBsZSkuXG4gICAgICogQHJldHVybnMgTnVtYmVyIG9mIGl0ZW1zIGluIHN0b3JhZ2VcbiAgICAgKi9cbiAgICBmb3JlYWNoKGYsIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbiA9IHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLnN0b3JhZ2Uua2V5KGkpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBmIGlzIGFuIGluc3RhbmNlIG1ldGhvZCBvbiBpbnN0YW5jZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgZi5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZiBpcyBhIGZ1bmN0aW9uIG9yIGNsYXNzIG1ldGhvZFxuICAgICAgICAgICAgICAgIGYodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH07XG5cbiAgICAvLyBQcml2YXRlIEFQSVxuICAgIC8vIGhlbHBlciBmdW5jdGlvbnMgYW5kIHZhcmlhYmxlcyBoaWRkZW4gd2l0aGluIHRoaXMgZnVuY3Rpb24gc2NvcGVcblxuICAgIHByaXZhdGUgY2hlY2tLZXkoa2V5KSB7XG4gICAgICAgIGlmICgha2V5IHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSB0eXBlIG11c3QgYmUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtCYXNlNjR9IGZyb20gJy4vYmFzZTY0JztcblxuZXhwb3J0IGNsYXNzIFhvciB7XG5cbiAgICBzdGF0aWMgaGVhZGVyID0gJ2FydGVtaXMtbG90c3VtJztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH07XG5cblxuICAgIHB1YmxpYyBzdGF0aWMgZW5jcnlwdCh2YWx1ZTogc3RyaW5nLCBrZXk6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gICAgICAgIHZhbHVlID0gWG9yLmhlYWRlciArIHZhbHVlO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCh2YWx1ZVtpXS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDEwKSBhcyBhbnkpIF4gWG9yLmtleUNoYXJBdChrZXksIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBCYXNlNjQuZW5jb2RlKHJlc3VsdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHB1YmxpYyBzdGF0aWMgZGVjcnlwdCh2YWx1ZTogc3RyaW5nLCBrZXk6IHN0cmluZywgb2xkU3R5bGU/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICB2YWx1ZSA9IEJhc2U2NC5kZWNvZGUodmFsdWUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgodmFsdWVbaV0uY2hhckNvZGVBdCgwKS50b1N0cmluZygxMCkgYXMgYW55KSBeIFhvci5rZXlDaGFyQXQoa2V5LCBpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW9sZFN0eWxlICYmIFhvci5oZWFkZXIgIT09IHJlc3VsdC5zdWJzdHJpbmcoMCwgWG9yLmhlYWRlci5sZW5ndGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2xkU3R5bGUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoWG9yLmhlYWRlci5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBrZXlDaGFyQXQoa2V5LCBpKSB7XG4gICAgICAgIHJldHVybiBrZXlbTWF0aC5mbG9vcihpICUga2V5Lmxlbmd0aCldLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTApO1xuICAgIH1cblxuXG59XG4iLCIvLyBidW1wZWQgdmVyc2lvbiB2aWEgZ3VscFxuZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnMi4xLjEzJztcbiIsImV4cG9ydCBjbGFzcyBYSFJQcm9taXNlIHtcblxuICAgIHB1YmxpYyBERUZBVUxUX0NPTlRFTlRfVFlQRSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xuICAgIHByaXZhdGUgX3hocjtcbiAgICBwcml2YXRlIF91bmxvYWRIYW5kbGVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLnNlbmQob3B0aW9ucykgLT4gUHJvbWlzZVxuICAgICAqIC0gb3B0aW9ucyAoT2JqZWN0KTogVVJMLCBtZXRob2QsIGRhdGEsIGV0Yy5cbiAgICAgKlxuICAgICAqIENyZWF0ZSB0aGUgWEhSIG9iamVjdCBhbmQgd2lyZSB1cCBldmVudCBoYW5kbGVycyB0byB1c2UgYSBwcm9taXNlLlxuICAgICAqL1xuICAgIHNlbmQob3B0aW9ucyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBkZWZhdWx0cztcbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICAgICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCggKF90aGlzOiBYSFJQcm9taXNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZSwgaGVhZGVyLCByZWYsIHZhbHVlLCB4aHI7XG4gICAgICAgICAgICAgICAgaWYgKCFYTUxIdHRwUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXJyb3IoJ2Jyb3dzZXInLCByZWplY3QsIG51bGwsICdicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnVybCAhPT0gJ3N0cmluZycgfHwgb3B0aW9ucy51cmwubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9oYW5kbGVFcnJvcigndXJsJywgcmVqZWN0LCBudWxsLCAnVVJMIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuX3hociA9IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gICgpICA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXRhY2hXaW5kb3dVbmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IF90aGlzLl9nZXRSZXNwb25zZVRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXJyb3IoJ3BhcnNlJywgcmVqZWN0LCBudWxsLCAnaW52YWxpZCBKU09OIHJlc3BvbnNlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBfdGhpcy5fZ2V0UmVzcG9uc2VVcmwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBfdGhpcy5fZ2V0SGVhZGVycygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyOiB4aHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub25lcnJvciA9ICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vbnRpbWVvdXQgPSAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCd0aW1lb3V0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vbmFib3J0ID0gICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignYWJvcnQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgX3RoaXMuX2F0dGFjaFdpbmRvd1VubG9hZCgpO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCBvcHRpb25zLnVybCwgb3B0aW9ucy5hc3luYywgb3B0aW9ucy51c2VybmFtZSwgb3B0aW9ucy5wYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKG9wdGlvbnMuZGF0YSAhPSBudWxsKSAmJiAhb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gX3RoaXMuREVGQVVMVF9DT05URU5UX1RZUEU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlZiA9IG9wdGlvbnMuaGVhZGVycztcbiAgICAgICAgICAgICAgICBmb3IgKGhlYWRlciBpbiByZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZi5oYXNPd25Qcm9wZXJ0eShoZWFkZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZltoZWFkZXJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhoci5zZW5kKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3NlbmQnLCByZWplY3QsIG51bGwsIGUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5nZXRYSFIoKSAtPiBYTUxIdHRwUmVxdWVzdFxuICAgICAqL1xuICAgIGdldFhIUigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hocjtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2F0dGFjaFdpbmRvd1VubG9hZCgpXG4gICAgICpcbiAgICAgKiBGaXggZm9yIElFIDkgYW5kIElFIDEwXG4gICAgICogSW50ZXJuZXQgRXhwbG9yZXIgZnJlZXplcyB3aGVuIHlvdSBjbG9zZSBhIHdlYnBhZ2UgZHVyaW5nIGFuIFhIUiByZXF1ZXN0XG4gICAgICogaHR0cHM6Ly9zdXBwb3J0Lm1pY3Jvc29mdC5jb20va2IvMjg1Njc0NlxuICAgICAqXG4gICAgICovXG4gICAgcHJpdmF0ZSBfYXR0YWNoV2luZG93VW5sb2FkKCkge1xuICAgICAgICB0aGlzLl91bmxvYWRIYW5kbGVyID0gdGhpcy5faGFuZGxlV2luZG93VW5sb2FkLmJpbmQodGhpcyk7XG4gICAgICAgIGlmICgod2luZG93IGFzIGFueSkuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkuYXR0YWNoRXZlbnQoJ29udW5sb2FkJywgdGhpcy5fdW5sb2FkSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2RldGFjaFdpbmRvd1VubG9hZCgpXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZGV0YWNoV2luZG93VW5sb2FkKCkge1xuICAgICAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLmRldGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmRldGFjaEV2ZW50KCdvbnVubG9hZCcsIHRoaXMuX3VubG9hZEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9nZXRIZWFkZXJzKCkgLT4gT2JqZWN0XG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0SGVhZGVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlSGVhZGVycyh0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0UmVzcG9uc2VUZXh0KCkgLT4gTWl4ZWRcbiAgICAgKlxuICAgICAqIFBhcnNlcyByZXNwb25zZSB0ZXh0IEpTT04gaWYgcHJlc2VudC5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXRSZXNwb25zZVRleHQoKSB7XG4gICAgICAgIGxldCByZXNwb25zZVRleHQ7XG4gICAgICAgIHJlc3BvbnNlVGV4dCA9IHR5cGVvZiB0aGlzLl94aHIucmVzcG9uc2VUZXh0ID09PSAnc3RyaW5nJyA/IHRoaXMuX3hoci5yZXNwb25zZVRleHQgOiAnJztcbiAgICAgICAgc3dpdGNoICgodGhpcy5feGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSB8fCAnJykuc3BsaXQoJzsnKVswXSkge1xuICAgICAgICAgICAgY2FzZSAnYXBwbGljYXRpb24vanNvbic6XG4gICAgICAgICAgICBjYXNlICd0ZXh0L2phdmFzY3JpcHQnOlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0ICsgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZVRleHQ7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9nZXRSZXNwb25zZVVybCgpIC0+IFN0cmluZ1xuICAgICAqXG4gICAgICogQWN0dWFsIHJlc3BvbnNlIFVSTCBhZnRlciBmb2xsb3dpbmcgcmVkaXJlY3RzLlxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldFJlc3BvbnNlVXJsKCkge1xuICAgICAgICBpZiAodGhpcy5feGhyLnJlc3BvbnNlVVJMICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94aHIucmVzcG9uc2VVUkw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9eWC1SZXF1ZXN0LVVSTDovbS50ZXN0KHRoaXMuX3hoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ1gtUmVxdWVzdC1VUkwnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9oYW5kbGVFcnJvcihyZWFzb24sIHJlamVjdCwgc3RhdHVzLCBzdGF0dXNUZXh0KVxuICAgICAqIC0gcmVhc29uIChTdHJpbmcpXG4gICAgICogLSByZWplY3QgKEZ1bmN0aW9uKVxuICAgICAqIC0gc3RhdHVzIChTdHJpbmcpXG4gICAgICogLSBzdGF0dXNUZXh0IChTdHJpbmcpXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaGFuZGxlRXJyb3IocmVhc29uLCByZWplY3QsIHN0YXR1cz8sIHN0YXR1c1RleHQ/KSB7XG4gICAgICAgIHRoaXMuX2RldGFjaFdpbmRvd1VubG9hZCgpO1xuXG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcignYnJvd3NlcicsIHJlamVjdCwgbnVsbCwgJ2Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCd1cmwnLCByZWplY3QsIG51bGwsICdVUkwgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCdwYXJzZScsIHJlamVjdCwgbnVsbCwgJ2ludmFsaWQgSlNPTiByZXNwb25zZScpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3RpbWVvdXQnLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdhYm9ydCcsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3NlbmQnLCByZWplY3QsIG51bGwsIGUudG9TdHJpbmcoKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdfaGFuZGxlRXJyb3I6JywgcmVhc29uLCB0aGlzLl94aHIuc3RhdHVzKTtcbiAgICAgICAgbGV0IGNvZGUgPSA0MDQ7XG4gICAgICAgIGlmIChyZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgY29kZSA9IDQwODtcbiAgICAgICAgfSBlbHNlIGlmIChyZWFzb24gPT09ICdhYm9ydCcpIHtcbiAgICAgICAgICAgIGNvZGUgPSA0MDg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVqZWN0KHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uLFxuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXMgfHwgdGhpcy5feGhyLnN0YXR1cyB8fCBjb2RlLFxuICAgICAgICAgICAgY29kZTogc3RhdHVzIHx8IHRoaXMuX3hoci5zdGF0dXMgfHwgY29kZSxcbiAgICAgICAgICAgIHN0YXR1c1RleHQ6IHN0YXR1c1RleHQgfHwgdGhpcy5feGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICB4aHI6IHRoaXMuX3hoclxuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2hhbmRsZVdpbmRvd1VubG9hZCgpXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaGFuZGxlV2luZG93VW5sb2FkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyLmFib3J0KCk7XG4gICAgfTtcblxuXG4gICAgcHJpdmF0ZSB0cmltKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQXJyYXkoYXJnKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cblxuICAgIHByaXZhdGUgZm9yRWFjaChsaXN0LCBpdGVyYXRvcikge1xuICAgICAgICBpZiAodG9TdHJpbmcuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoQXJyYXkobGlzdCwgaXRlcmF0b3IsIHRoaXMpXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmZvckVhY2hTdHJpbmcobGlzdCwgaXRlcmF0b3IsIHRoaXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZvckVhY2hPYmplY3QobGlzdCwgaXRlcmF0b3IsIHRoaXMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZvckVhY2hBcnJheShhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYXJyYXkuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzdHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG5vIHN1Y2ggdGhpbmcgYXMgYSBzcGFyc2Ugc3RyaW5nLlxuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZvckVhY2hPYmplY3Qob2JqZWN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmplY3Rba10sIGssIG9iamVjdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3BhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycykge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoKFxuICAgICAgICAgICAgdGhpcy50cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgLCAocm93KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG4gICAgICAgICAgICAgICAgICAgICwga2V5ID0gdGhpcy50cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgLCB2YWx1ZSA9IHRoaXMudHJpbShyb3cuc2xpY2UoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHJlc3VsdFtrZXldKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FycmF5KHJlc3VsdFtrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gW3Jlc3VsdFtrZXldLCB2YWx1ZV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cblxufVxuIiwiaW1wb3J0IHtYSFJQcm9taXNlfSBmcm9tICcuL3hocnByb21pc2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFhock9wdGlvbnNJbnRlcmZhY2Uge1xuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksXG4gICAgaGVhZGVycz86IGFueSxcbiAgICBhc3luYz86IGJvb2xlYW4sXG4gICAgdXNlcm5hbWU/OiBzdHJpbmcsXG4gICAgcGFzc3dvcmQ/OiBzdHJpbmcsXG4gICAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhblxufVxuXG5leHBvcnQgY2xhc3MgQWpheCB7XG5cbiAgICAvLyBwcml2YXRlIHN0YXRpYyB4aHI6IFhIUlByb21pc2UgPSBuZXcgWEhSUHJvbWlzZSgpO1xuICAgIHByaXZhdGUgeGhyOiBYSFJQcm9taXNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMueGhyID0gbmV3IFhIUlByb21pc2UoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIHBvc3QoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55PiB7XG5cbiAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmwsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhcmdzLmRhdGEpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMueGhyXG4gICAgICAgICAgICAuc2VuZChvcHQpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPCAyMDAgfHwgcGFyc2VJbnQocmVzLnN0YXR1cywgMTApID49IDMwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlYXNvbiA9ICdzdGF0dXMnO1xuICAgICAgICAgICAgICAgICAgICByZXMuY29kZSA9IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ2Jyb3dzZXInLCByZWplY3QsIG51bGwsICdicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCd1cmwnLCByZWplY3QsIG51bGwsICdVUkwgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ3BhcnNlJywgcmVqZWN0LCBudWxsLCAnaW52YWxpZCBKU09OIHJlc3BvbnNlJyk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3RpbWVvdXQnLCByZWplY3QpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Fib3J0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgKGVyci5yZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwODtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHV0KGFyZ3M6IFhock9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoYXJncy5kYXRhKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBvcHQuaGVhZGVycyA9IGFyZ3MuaGVhZGVycztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucmVhc29uID0gJ3N0YXR1cyc7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jb2RlID0gcGFyc2VJbnQocmVzLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZXJyLnJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA4O1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWxldGUoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdDogYW55ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmwsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhcmdzLmRhdGEpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLnNlbmQob3B0KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWFzb24gPSAnc3RhdHVzJztcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNvZGUgPSBwYXJzZUludChyZXMuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmIChlcnIucmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybFxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJncy5kYXRhKSB7XG4gICAgICAgICAgICBvcHQuZGF0YSA9IGFyZ3MuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBvcHQuaGVhZGVycyA9IGFyZ3MuaGVhZGVycztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucmVhc29uID0gJ3N0YXR1cyc7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jb2RlID0gcGFyc2VJbnQocmVzLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZXJyLnJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA4O1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7TG9jYWxTdG9yYWdlfSBmcm9tICcuLi90b29scyc7XG5pbXBvcnQge1Nka0ludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2V9IGZyb20gJy4uL3Nkay9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIENsaWVudCB7XG5cbiAgICBwdWJsaWMgY2xpZW50SWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudFV1aWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudEluZm86IHN0cmluZztcbiAgICBwcml2YXRlIHJlZnJlc2hUb2tlbjogc3RyaW5nO1xuICAgIHByaXZhdGUgc3RhdGljIHJlZnJlc2hDb3VudCA9IDA7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudFV1aWQgPSAndjIuY2xpZW50VXVpZCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudElkID0gJ3YyLmNsaWVudElkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVmcmVzaENvdW50ID0gJ3YyLnJlZnJlc2hDb3VudCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcElkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBVUkk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHN0b3JhZ2U6IExvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlKSB7XG5cbiAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRVdWlkKSB8fCAndXVpZC0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IGluZm8gPSAnX2NsaWVudEluZm8nOyAvLyB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SW5mbyk7XG4gICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93Lm5hdmlnYXRvcikge1xuICAgICAgICAgICAgaW5mbyA9IHdpbmRvdy5uYXZpZ2F0b3IuYXBwTmFtZSArICdAJyArIHdpbmRvdy5uYXZpZ2F0b3IuYXBwVmVyc2lvbiArICctJyArIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93WydkZXZpY2UnXSAmJiB3aW5kb3dbJ2RldmljZSddLnV1aWQpIHtcbiAgICAgICAgICAgIHV1aWQgPSB3aW5kb3dbJ2RldmljZSddLnV1aWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDbGllbnRVdWlkKHV1aWQpO1xuICAgICAgICB0aGlzLnNldENsaWVudEluZm8oaW5mbyk7XG4gICAgICAgIHRoaXMuY2xpZW50SWQgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SWQpO1xuICAgICAgICBDbGllbnQucmVmcmVzaENvdW50ID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX3JlZnJlc2hDb3VudCkgfHwgMDtcbiAgICB9O1xuXG4gICAgcHVibGljIHNldENsaWVudElkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRJZCA9ICcnICsgdmFsdWU7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9jbGllbnRJZCwgdGhpcy5jbGllbnRJZCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENsaWVudFV1aWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudFV1aWQgPSAnJyArIHZhbHVlO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fY2xpZW50VXVpZCwgdGhpcy5jbGllbnRVdWlkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50SW5mbyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50SW5mbyA9ICcnICsgdmFsdWU7XG4gICAgICAgIC8vIHRoaXMuc3RvcmFnZS5zZXQoJ2NsaWVudEluZm8nLCB0aGlzLmNsaWVudEluZm8pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsTG9naW4gPSB0aGlzLlVSSSArICcvdXNlcnMnO1xuICAgICAgICBjb25zdCBkYXRhTG9naW4gPSB7XG4gICAgICAgICAgICBuYW1lOiBsb2dpbixcbiAgICAgICAgICAgIHVzZXJuYW1lOiBsb2dpbixcbiAgICAgICAgICAgIGVtYWlsOiBsb2dpbixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmxMb2dpbixcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhTG9naW4sXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oY3JlYXRlZFVzZXIgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDbGllbnRJZChjcmVhdGVkVXNlci5faWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybFRva2VuID0gdGhpcy5VUkkgKyAnL29hdXRoL3Rva2VuJztcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhVG9rZW4gPSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYW50X3R5cGU6ICdjbGllbnRfY3JlZGVudGlhbHMnLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9zZWNyZXQ6IHBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfdWRpZDogdGhpcy5jbGllbnRVdWlkLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6IEpTT04uc3RyaW5naWZ5KHRoaXMuc2RrKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmxUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZUF1dGhlbnRpY2F0ZShyZWZyZXNoVG9rZW46IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuVVJJICsgJy9vYXV0aC90b2tlbic7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBncmFudF90eXBlOiAncmVmcmVzaF90b2tlbicsXG4gICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICBjbGllbnRfdWRpZDogdGhpcy5jbGllbnRVdWlkLFxuICAgICAgICAgICAgY2xpZW50X2luZm86IHRoaXMuY2xpZW50SW5mbyxcbiAgICAgICAgICAgIGF1ZGllbmNlOiB0aGlzLmFwcElkLFxuICAgICAgICAgICAgc2NvcGU6IEpTT04uc3RyaW5naWZ5KHRoaXMuc2RrKSxcbiAgICAgICAgICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbixcbiAgICAgICAgICAgIHJlZnJlc2hfZXh0cmE6IENsaWVudC5yZWZyZXNoQ291bnQsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChvYmo6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQrKztcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fcmVmcmVzaENvdW50LCBDbGllbnQucmVmcmVzaENvdW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG9iaik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9nb3V0KHJlZnJlc2hUb2tlbj86IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWxldGUgdGhpcy5jbGllbnRVdWlkO1xuICAgICAgICAvLyBkZWxldGUgdGhpcy5jbGllbnRJZDtcbiAgICAgICAgLy8gdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX2NsaWVudFV1aWQpO1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlKENsaWVudC5fY2xpZW50SWQpO1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlKENsaWVudC5fcmVmcmVzaENvdW50KTtcbiAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCA9IDA7XG5cbiAgICAgICAgaWYgKCFyZWZyZXNoVG9rZW4gfHwgIXRoaXMuY2xpZW50SWQpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuVVJJICsgJy9vYXV0aC9yZXZva2UnO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgdG9rZW46IHJlZnJlc2hUb2tlbixcbiAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuVVJJO1xuICAgIH1cbn1cbiIsImltcG9ydCB7RXJyb3JJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBFcnJvciBpbXBsZW1lbnRzIEVycm9ySW50ZXJmYWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2RlOiBudW1iZXIsIHB1YmxpYyByZWFzb246IHN0cmluZykge1xuICAgIH07XG5cbiAgICBlcXVhbHMoZXJyOiBFcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2RlID09PSBlcnIuY29kZSAmJiB0aGlzLnJlYXNvbiA9PT0gZXJyLnJlYXNvbjtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtc2c6IHN0cmluZyA9ICh0eXBlb2YgdGhpcy5yZWFzb24gPT09ICdzdHJpbmcnKSA/IHRoaXMucmVhc29uIDogSlNPTi5zdHJpbmdpZnkodGhpcy5yZWFzb24pO1xuICAgICAgICByZXR1cm4gJycgKyB0aGlzLmNvZGUgKyAnIC0gJyArIG1zZztcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7Q2xpZW50fSBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQge01vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UsIFNka0ludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5pbXBvcnQge0Jhc2U2NCwgTG9jYWxTdG9yYWdlLCBYb3J9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7Q29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbiB7XG5cbiAgICBwdWJsaWMgZmlkaklkOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpDcnlwdG86IGJvb2xlYW47XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuUHJldmlvdXM6IHN0cmluZztcbiAgICBwdWJsaWMgaWRUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyByZWZyZXNoVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgc3RhdGVzOiB7IFtzOiBzdHJpbmddOiB7IHN0YXRlOiBib29sZWFuLCB0aW1lOiBudW1iZXIsIGxhc3RUaW1lV2FzT2s6IG51bWJlciB9OyB9OyAvLyBNYXA8c3RyaW5nLCBib29sZWFuPjtcbiAgICBwdWJsaWMgYXBpczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+O1xuXG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0TmV4dDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50OiBDbGllbnQ7XG4gICAgcHJpdmF0ZSB1c2VyOiBhbnk7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBfYWNjZXNzVG9rZW4gPSAndjIuYWNjZXNzVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9hY2Nlc3NUb2tlblByZXZpb3VzID0gJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnO1xuICAgIHByaXZhdGUgc3RhdGljIF9pZFRva2VuID0gJ3YyLmlkVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9yZWZyZXNoVG9rZW4gPSAndjIucmVmcmVzaFRva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfc3RhdGVzID0gJ3YyLnN0YXRlcyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHQgPSAndjIuY3J5cHRvU2FsdCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHROZXh0ID0gJ3YyLmNyeXB0b1NhbHQubmV4dCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zZGs6IFNka0ludGVyZmFjZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9zdG9yYWdlOiBMb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgdGhpcy5jbGllbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHQgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0KSB8fCBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5fc3RvcmFnZS5nZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnKSB8fCBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9pZFRva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9zdGF0ZXMpIHx8IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSBbXTtcbiAgICB9O1xuXG4gICAgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jbGllbnQgJiYgdGhpcy5jbGllbnQuaXNSZWFkeSgpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koZm9yY2U/OiBib29sZWFuKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9pZFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fc3RhdGVzKTtcblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuUHJldmlvdXMsIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5jbGllbnQpIHtcbiAgICAgICAgICAgIC8vIHRoaXMuY2xpZW50LnNldENsaWVudElkKG51bGwpO1xuICAgICAgICAgICAgdGhpcy5jbGllbnQubG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTsgLy8gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50KGNsaWVudDogQ2xpZW50KTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIGlmICghdGhpcy51c2VyKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoaXMuX3VzZXIuX2lkID0gdGhpcy5fY2xpZW50LmNsaWVudElkO1xuICAgICAgICB0aGlzLnVzZXIuX25hbWUgPSBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHtuYW1lOiAnJ30pKS5uYW1lO1xuICAgIH1cblxuICAgIHNldFVzZXIodXNlcjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIGlmICh0aGlzLnVzZXIuX2lkKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5zZXRDbGllbnRJZCh0aGlzLnVzZXIuX2lkKTtcblxuICAgICAgICAgICAgLy8gc3RvcmUgb25seSBjbGllbnRJZFxuICAgICAgICAgICAgZGVsZXRlIHRoaXMudXNlci5faWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRVc2VyKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXI7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50KCk6IENsaWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudDtcbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdCAhPT0gdmFsdWUgJiYgdGhpcy5jcnlwdG9TYWx0TmV4dCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0LCB0aGlzLmNyeXB0b1NhbHROZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdCA9IHRoaXMuY3J5cHRvU2FsdE5leHQ7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0LCB0aGlzLmNyeXB0b1NhbHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSBudWxsO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCk7XG4gICAgfVxuXG4gICAgZW5jcnlwdChkYXRhOiBhbnkpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBc09iaiA9IHtzdHJpbmc6IGRhdGF9O1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGFBc09iaik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgcmV0dXJuIFhvci5lbmNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlY3J5cHQoZGF0YTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgbGV0IGRlY3J5cHRlZCA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHROZXh0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0TmV4dDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCAmJiB0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlY3J5cHRlZCAmJiBkZWNyeXB0ZWQuc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gZGVjcnlwdGVkLnN0cmluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVjcnlwdGVkO1xuICAgIH1cblxuICAgIGlzTG9naW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBleHAgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gSlNPTi5wYXJzZShCYXNlNjQuZGVjb2RlKHBheWxvYWQpKTtcbiAgICAgICAgICAgIGV4cCA9ICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBkZWNvZGVkLmV4cCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhZXhwO1xuICAgIH1cblxuICAgIC8vIHRvZG8gcmVpbnRlZ3JhdGUgY2xpZW50LmxvZ2luKClcblxuICAgIGxvZ291dCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGllbnQoKS5sb2dvdXQodGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgIH1cblxuICAgIGdldENsaWVudElkKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5jbGllbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudC5jbGllbnRJZDtcbiAgICB9XG5cbiAgICBnZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkVG9rZW47XG4gICAgfVxuXG4gICAgZ2V0SWRQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuZ2V0SWRUb2tlbigpLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0QWNjZXNzUGF5bG9hZChkZWY/OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoZGVmICYmIHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cy5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYgPyBkZWYgOiBudWxsO1xuICAgIH1cblxuICAgIHJlZnJlc2hDb25uZWN0aW9uKCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICAvLyBzdG9yZSBzdGF0ZXNcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fc3RhdGVzLCB0aGlzLnN0YXRlcyk7XG5cbiAgICAgICAgLy8gdG9rZW4gbm90IGV4cGlyZWQgOiBva1xuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25ldyBEYXRlKCkuZ2V0VGltZSgpIDwgSlNPTi5wYXJzZShkZWNvZGVkKS5leHAgOicsIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCk7XG4gICAgICAgICAgICBpZiAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4cGlyZWQgcmVmcmVzaFRva2VuXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCBhY2Nlc3NUb2tlbiAmIGlkVG9rZW4gJiBzdG9yZSBpdCBhcyBQcmV2aW91cyBvbmVcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcblxuICAgICAgICAvLyByZWZyZXNoIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdldENsaWVudCgpLnJlQXV0aGVudGljYXRlKHRoaXMucmVmcmVzaFRva2VuKVxuICAgICAgICAgICAgICAgIC50aGVuKHVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENvbm5lY3Rpb24odXNlcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDA4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDA4OyAvLyBubyBhcGkgdXJpIG9yIGJhc2ljIHRpbWVvdXQgOiBvZmZsaW5lXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlID09PSA0MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDQ7IC8vIHBhZ2Ugbm90IGZvdW5kIDogb2ZmbGluZVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDAzOyAvLyB0b2tlbiBleHBpcmVkIG9yIGRldmljZSBub3Qgc3VyZSA6IG5lZWQgcmVsb2dpblxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwMzsgLy8gZm9yYmlkZGVuIDogbmVlZCByZWxvZ2luXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyByZXNvbHZlKGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNldENvbm5lY3Rpb24oY2xpZW50VXNlcjogYW55KTogdm9pZCB7XG5cbiAgICAgICAgLy8gb25seSBpbiBwcml2YXRlIHN0b3JhZ2VcbiAgICAgICAgaWYgKGNsaWVudFVzZXIuYWNjZXNzX3Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gY2xpZW50VXNlci5hY2Nlc3NfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICBkZWxldGUgY2xpZW50VXNlci5hY2Nlc3NfdG9rZW47XG5cbiAgICAgICAgICAgIGNvbnN0IHNhbHQ6IHN0cmluZyA9IEpTT04ucGFyc2UodGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtzYWx0OiAnJ30pKS5zYWx0O1xuICAgICAgICAgICAgaWYgKHNhbHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHQoc2FsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFVzZXIuaWRfdG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IGNsaWVudFVzZXIuaWRfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9pZFRva2VuLCB0aGlzLmlkVG9rZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGNsaWVudFVzZXIuaWRfdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFVzZXIucmVmcmVzaF90b2tlbikge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBjbGllbnRVc2VyLnJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjbGllbnRVc2VyLnJlZnJlc2hfdG9rZW47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9yZSBjaGFuZ2VkIHN0YXRlc1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9zdGF0ZXMsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICAvLyBleHBvc2Ugcm9sZXMsIG1lc3NhZ2VcbiAgICAgICAgLy8gY2xpZW50VXNlci5yb2xlcyA9IHNlbGYuZmlkalJvbGVzKCk7XG4gICAgICAgIC8vIGNsaWVudFVzZXIubWVzc2FnZSA9IHNlbGYuZmlkak1lc3NhZ2UoKTtcbiAgICAgICAgY2xpZW50VXNlci5yb2xlcyA9IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcztcbiAgICAgICAgY2xpZW50VXNlci5tZXNzYWdlID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZTtcbiAgICAgICAgdGhpcy5zZXRVc2VyKGNsaWVudFVzZXIpO1xuICAgIH07XG5cbiAgICBzZXRDb25uZWN0aW9uT2ZmbGluZShvcHRpb25zOiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBvcHRpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4sIHRoaXMuYWNjZXNzVG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmlkVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IG9wdGlvbnMuaWRUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucmVmcmVzaFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IG9wdGlvbnMucmVmcmVzaFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuLCB0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFVzZXIoe1xuICAgICAgICAgICAgcm9sZXM6IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2UsXG4gICAgICAgICAgICBfaWQ6ICdkZW1vJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRBcGlFbmRwb2ludHMob3B0aW9ucz86IENvbm5lY3Rpb25GaW5kT3B0aW9uc0ludGVyZmFjZSk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG5cbiAgICAgICAgLy8gdG9kbyA6IGxldCBlYSA9IFsnaHR0cHM6Ly9maWRqL2FwaScsICdodHRwczovL2ZpZGotcHJveHkuaGVyb2t1YXBwLmNvbS9hcGknXTtcbiAgICAgICAgbGV0IGVhOiBFbmRwb2ludEludGVyZmFjZVtdID0gW1xuICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHBzOi8vZmlkai5vdmgvYXBpJywgYmxvY2tlZDogZmFsc2V9XTtcbiAgICAgICAgbGV0IGZpbHRlcmVkRWEgPSBbXTtcblxuICAgICAgICBpZiAoIXRoaXMuX3Nkay5wcm9kKSB7XG4gICAgICAgICAgICBlYSA9IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo1ODk0L2FwaScsIGJsb2NrZWQ6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cHM6Ly9maWRqLXNhbmRib3guaGVyb2t1YXBwLmNvbS9hcGknLCBibG9ja2VkOiBmYWxzZX1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHthcGlzOiBbXX0pO1xuICAgICAgICAgICAgY29uc3QgYXBpRW5kcG9pbnRzOiBFbmRwb2ludEludGVyZmFjZVtdID0gSlNPTi5wYXJzZSh2YWwpLmFwaXM7XG4gICAgICAgICAgICBpZiAoYXBpRW5kcG9pbnRzICYmIGFwaUVuZHBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBlYSA9IFtdO1xuICAgICAgICAgICAgICAgIGFwaUVuZHBvaW50cy5mb3JFYWNoKChlbmRwb2ludCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kcG9pbnQudXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlYS5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cykge1xuICAgICAgICAgICAgY29uc3QgYXBpRW5kcG9pbnRzOiBFbmRwb2ludEludGVyZmFjZVtdID0gSlNPTi5wYXJzZSh0aGlzLmdldFByZXZpb3VzQWNjZXNzUGF5bG9hZCh7YXBpczogW119KSkuYXBpcztcbiAgICAgICAgICAgIGlmIChhcGlFbmRwb2ludHMgJiYgYXBpRW5kcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFwaUVuZHBvaW50cy5mb3JFYWNoKChlbmRwb2ludCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kcG9pbnQudXJsICYmIGVhLmZpbHRlcigocikgPT4gci51cmwgPT09IGVuZHBvaW50LnVybCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlYS5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdWxkQ2hlY2tTdGF0ZXMgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZXMgJiYgT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKSAmJiBjb3VsZENoZWNrU3RhdGVzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2VhW2ldLnVybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZmlsdGVyKSB7XG5cbiAgICAgICAgICAgIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZScpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpICYmIChmaWx0ZXJlZEVhLmxlbmd0aCA9PT0gMCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGVhW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFYS5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbGRPbmUnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJlc3RPbGRPbmU6IEVuZHBvaW50SW50ZXJmYWNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGVhW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5sYXN0VGltZVdhc09rICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoIWJlc3RPbGRPbmUgfHwgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5sYXN0VGltZVdhc09rID4gdGhpcy5zdGF0ZXNbYmVzdE9sZE9uZS51cmxdLmxhc3RUaW1lV2FzT2spKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RPbGRPbmUgPSBlbmRwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYmVzdE9sZE9uZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goYmVzdE9sZE9uZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChlYS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goZWFbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyZWRFYSA9IGVhO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkRWE7XG4gICAgfTtcblxuICAgIGdldERCcyhvcHRpb25zPzogQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlKTogRW5kcG9pbnRJbnRlcmZhY2VbXSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2RvIHRlc3QgcmFuZG9tIERCIGNvbm5lY3Rpb25cbiAgICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAlIDI7XG4gICAgICAgIGxldCBkYnMgPSBKU09OLnBhcnNlKHRoaXMuZ2V0QWNjZXNzUGF5bG9hZCh7ZGJzOiBbXX0pKS5kYnMgfHwgW107XG5cbiAgICAgICAgLy8gbmVlZCB0byBzeW5jaHJvbml6ZSBkYlxuICAgICAgICBpZiAocmFuZG9tID09PSAwKSB7XG4gICAgICAgICAgICBkYnMgPSBkYnMuc29ydCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHJhbmRvbSA9PT0gMSkge1xuICAgICAgICAgICAgZGJzID0gZGJzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWx0ZXJlZERCcyA9IFtdO1xuICAgICAgICBsZXQgY291bGRDaGVja1N0YXRlcyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBkYnMubGVuZ3RoKSAmJiBjb3VsZENoZWNrU3RhdGVzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2Ric1tpXS51cmxdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZScpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpICYmIChmaWx0ZXJlZERCcy5sZW5ndGggPT09IDApOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGRic1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkREJzLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lcycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGRic1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkREJzLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZScgJiYgZGJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChkYnNbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyZWREQnMgPSBkYnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWREQnM7XG4gICAgfTtcblxuICAgIHZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgLy8gdG9kbyBuZWVkIHZlcmlmaWNhdGlvbiA/IG5vdCB5ZXQgKGNhY2hlKVxuICAgICAgICAvLyBpZiAoT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHRpbWUgPSB0aGlzLnN0YXRlc1tPYmplY3Qua2V5cyh0aGlzLnN0YXRlcylbMF1dLnRpbWU7XG4gICAgICAgIC8vICAgICBpZiAoY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdmVyaWZ5IHZpYSBHRVQgc3RhdHVzIG9uIEVuZHBvaW50cyAmIERCc1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgICAgICAvLyB0aGlzLnN0YXRlcyA9IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSB0aGlzLmdldEFwaUVuZHBvaW50cygpO1xuICAgICAgICB0aGlzLmFwaXMuZm9yRWFjaCgoZW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBlbmRwb2ludFVybDogc3RyaW5nID0gZW5kcG9pbnRPYmoudXJsO1xuICAgICAgICAgICAgaWYgKCFlbmRwb2ludFVybCkge1xuICAgICAgICAgICAgICAgIGVuZHBvaW50VXJsID0gZW5kcG9pbnRPYmoudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBBamF4KClcbiAgICAgICAgICAgICAgICAgICAgLmdldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsICsgJy9zdGF0dXM/aXNvaz0nICsgdGhpcy5fc2RrLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuaXNvaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXSA9IHtzdGF0ZTogc3RhdGUsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBjdXJyZW50VGltZX07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUaW1lV2FzT2sgPSB0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0ubGFzdFRpbWVXYXNPaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRicyA9IHRoaXMuZ2V0REJzKCk7XG4gICAgICAgIGRicy5mb3JFYWNoKChkYkVuZHBvaW50T2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGJFbmRwb2ludDogc3RyaW5nID0gZGJFbmRwb2ludE9iai51cmw7XG4gICAgICAgICAgICBpZiAoIWRiRW5kcG9pbnQpIHtcbiAgICAgICAgICAgICAgICBkYkVuZHBvaW50ID0gZGJFbmRwb2ludE9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZGJFbmRwb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdID0ge3N0YXRlOiB0cnVlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogY3VycmVudFRpbWV9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0VGltZVdhc09rID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUaW1lV2FzT2sgPSB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XS5sYXN0VGltZVdhc09rO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0gPSB7c3RhdGU6IGZhbHNlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogbGFzdFRpbWVXYXNPa307XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9O1xuXG59XG4iLCIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGxldCBQb3VjaERCOiBhbnk7XG5cbmltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4uL3Nkay9lcnJvcic7XG5pbXBvcnQge0VuZHBvaW50SW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuXG5jb25zdCBGaWRqUG91Y2ggPSB3aW5kb3dbJ1BvdWNoREInXSA/IHdpbmRvd1snUG91Y2hEQiddIDogcmVxdWlyZSgncG91Y2hkYicpLmRlZmF1bHQ7IC8vIC5kZWZhdWx0O1xuXG4vLyBsb2FkIGNvcmRvdmEgYWRhcHRlciA6IGh0dHBzOi8vZ2l0aHViLmNvbS9wb3VjaGRiLWNvbW11bml0eS9wb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUvaXNzdWVzLzIyXG5jb25zdCBQb3VjaEFkYXB0ZXJDb3Jkb3ZhU3FsaXRlID0gcmVxdWlyZSgncG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlJyk7XG5GaWRqUG91Y2gucGx1Z2luKFBvdWNoQWRhcHRlckNvcmRvdmFTcWxpdGUpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25DcnlwdG9JbnRlcmZhY2Uge1xuICAgIG9iajogT2JqZWN0LFxuICAgIG1ldGhvZDogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBTZXNzaW9uIHtcblxuICAgIHB1YmxpYyBkYlJlY29yZENvdW50OiBudW1iZXI7XG4gICAgcHVibGljIGRiTGFzdFN5bmM6IG51bWJlcjsgLy8gRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIHByaXZhdGUgZGI6IFBvdWNoREI7IC8vIFBvdWNoREJcbiAgICBwcml2YXRlIHJlbW90ZURiOiBQb3VjaERCOyAvLyBQb3VjaERCO1xuICAgIHByaXZhdGUgcmVtb3RlVXJpOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBkYnM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW1vdGVEYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGJzID0gW107XG4gICAgfTtcblxuICAgIHB1YmxpYyBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmRiO1xuICAgIH1cblxuXG4gICAgcHVibGljIGNyZWF0ZSh1aWQ6IHN0cmluZywgZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7IC8vIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgb3B0czogYW55ID0ge2xvY2F0aW9uOiAnZGVmYXVsdCd9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Wydjb3Jkb3ZhJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9IHtsb2NhdGlvbjogJ2RlZmF1bHQnLCBhZGFwdGVyOiAnY29yZG92YS1zcWxpdGUnfTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY29uc3QgcGx1Z2luID0gcmVxdWlyZSgncG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGlmIChwbHVnaW4pIHsgUG91Y2gucGx1Z2luKHBsdWdpbik7IH1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgdGhpcy5kYiA9IG5ldyBQb3VjaCgnZmlkal9kYicsIHthZGFwdGVyOiAnY29yZG92YS1zcWxpdGUnfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYiA9IG5ldyBGaWRqUG91Y2goJ2ZpZGpfZGJfJyArIHVpZCwgb3B0cyk7IC8vICwge2FkYXB0ZXI6ICd3ZWJzcWwnfSA/Pz9cbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRiLmluZm8oKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoaW5mbykgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIGlmIChpbmZvLmFkYXB0ZXIgIT09ICd3ZWJzcWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLmRiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgbmV3b3B0czogYW55ID0gb3B0cyB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ld29wdHMuYWRhcHRlciA9ICdpZGInO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5ld2RiID0gbmV3IFBvdWNoKCdmaWRqX2RiJywgb3B0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmRiLnJlcGxpY2F0ZS50byhuZXdkYilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuZGIgPSBuZXdkYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVyci50b1N0cmluZygpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVzdHJveSgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kYiAmJiAhdGhpcy5kYi5kZXN0cm95KSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05lZWQgYSB2YWxpZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmRlc3Ryb3koKGVyciwgaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0UmVtb3RlKGRiczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGJzID0gZGJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzeW5jKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZGJzIHx8ICF0aGlzLmRicy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBhIHJlbW90ZSBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJlbW90ZURiIHx8IHRoaXMucmVtb3RlVXJpICE9PSB0aGlzLmRic1swXS51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdGVVcmkgPSB0aGlzLmRic1swXS51cmw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlRGIgPSBuZXcgRmlkalBvdWNoKHRoaXMucmVtb3RlVXJpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyAsIHtoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBpZF90b2tlbn19KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRiLnJlcGxpY2F0ZS50byh0aGlzLnJlbW90ZURiKVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NvbXBsZXRlJywgKGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW90ZURiLnJlcGxpY2F0ZS50byh0aGlzLmRiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCEhdXNlcklkICYmICEhZG9jICYmIGRvYy5maWRqVXNlcklkID09PSB1c2VySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NvbXBsZXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvZ2dlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RlbmllZCcsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246IGVycn0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMSwgcmVhc29uOiBlcnJ9KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdkZW5pZWQnLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiBlcnJ9KSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAxLCByZWFzb246IGVycn0pKTtcblxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHV0KGRhdGE6IGFueSxcbiAgICAgICAgICAgICAgIF9pZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgdWlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBvaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIGF2ZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGF0YSB8fCAhX2lkIHx8ICF1aWQgfHwgIW9pZCB8fCAhYXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ25lZWQgZm9ybWF0ZWQgZGF0YScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGFXaXRob3V0SWRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIGNvbnN0IHRvU3RvcmU6IGFueSA9IHtcbiAgICAgICAgICAgIF9pZDogX2lkLFxuICAgICAgICAgICAgZmlkalVzZXJJZDogdWlkLFxuICAgICAgICAgICAgZmlkak9yZ0lkOiBvaWQsXG4gICAgICAgICAgICBmaWRqQXBwVmVyc2lvbjogYXZlXG4gICAgICAgIH07XG4gICAgICAgIGlmIChkYXRhV2l0aG91dElkcy5fcmV2KSB7XG4gICAgICAgICAgICB0b1N0b3JlLl9yZXYgPSAnJyArIGRhdGFXaXRob3V0SWRzLl9yZXY7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLl9pZDtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLl9yZXY7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqVXNlcklkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkak9yZ0lkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkakFwcFZlcnNpb247XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqRGF0YTtcblxuICAgICAgICBsZXQgcmVzdWx0QXNTdHJpbmcgPSBTZXNzaW9uLndyaXRlKFNlc3Npb24udmFsdWUoZGF0YVdpdGhvdXRJZHMpKTtcbiAgICAgICAgaWYgKGNyeXB0bykge1xuICAgICAgICAgICAgcmVzdWx0QXNTdHJpbmcgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKHJlc3VsdEFzU3RyaW5nKTtcbiAgICAgICAgICAgIHRvU3RvcmUuZmlkakRhY3IgPSByZXN1bHRBc1N0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvU3RvcmUuZmlkakRhdGEgPSByZXN1bHRBc1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLnB1dCh0b1N0b3JlLCAoZXJyLCByZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5vayAmJiByZXNwb25zZS5pZCAmJiByZXNwb25zZS5yZXYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50Kys7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcHJvcGFnYXRlIF9yZXYgJiBfaWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGRhdGEgYXMgYW55KS5fcmV2ID0gcmVzcG9uc2UucmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgKGRhdGEgYXMgYW55KS5faWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5nZXQoZGF0YV9pZClcbiAgICAgICAgICAgICAgICAudGhlbigoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRvYy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRiLnB1dChkb2MpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChkYXRhX2lkOiBzdHJpbmcsIGNyeXB0bz86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05lZWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5nZXQoZGF0YV9pZClcbiAgICAgICAgICAgICAgICAudGhlbihyb3cgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISFyb3cgJiYgKCEhcm93LmZpZGpEYWNyIHx8ICEhcm93LmZpZGpEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByb3cuZmlkakRhY3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3J5cHRvICYmIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY3J5cHRvLm9ialtjcnlwdG8ubWV0aG9kXShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm93LmZpZGpEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2Uocm93LmZpZGpEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdEFzSnNvbiA9IFNlc3Npb24uZXh0cmFjdEpzb24oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0QXNKc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9yZXYgPSByb3cuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0QXNKc29uKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByb3cuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJvdy5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnQmFkIGVuY29kaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdObyBkYXRhIGZvdW5kJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBbGwoY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8QXJyYXk8YW55PiB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiIHx8ICEodGhpcy5kYiBhcyBhbnkpLmFsbERvY3MpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBhIHZhbGlkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcyh7aW5jbHVkZV9kb2NzOiB0cnVlLCBkZXNjZW5kaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICAudGhlbihyb3dzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJvd3Mucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFyb3cgJiYgISFyb3cuZG9jLl9pZCAmJiAoISFyb3cuZG9jLmZpZGpEYWNyIHx8ICEhcm93LmRvYy5maWRqRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJvdy5kb2MuZmlkakRhY3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNyeXB0byAmJiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm93LmRvYy5maWRqRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShyb3cuZG9jLmZpZGpEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0QXNKc29uID0gU2Vzc2lvbi5leHRyYWN0SnNvbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0QXNKc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5faWQgPSByb3cuZG9jLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9yZXYgPSByb3cuZG9jLl9yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbC5wdXNoKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0QXNKc29uKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhZCBlbmNvZGluZyA6IGRlbGV0ZSByb3cnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbi5faWQgPSByb3cuZG9jLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9yZXYgPSByb3cuZG9jLl9yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbi5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbC5wdXNoKHJlc3VsdEFzSnNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJvdy5kb2MuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhZCBlbmNvZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbGwpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBQcm9taXNlPGJvb2xlYW4gfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYiB8fCAhKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05vIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcyh7XG4gICAgICAgICAgICAgICAgLy8gZmlsdGVyOiAgKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgIC8vICAgIGlmICghc2VsZi5jb25uZWN0aW9uLnVzZXIgfHwgIXNlbGYuY29ubmVjdGlvbi51c2VyLl9pZCkgcmV0dXJuIGRvYztcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAoZG9jLmZpZGpVc2VySWQgPT09IHNlbGYuY29ubmVjdGlvbi51c2VyLl9pZCkgcmV0dXJuIGRvYztcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ05vIHJlc3BvbnNlJykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gcmVzcG9uc2UudG90YWxfcm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS50b3RhbF9yb3dzICYmIHJlc3BvbnNlLnRvdGFsX3Jvd3MgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5mbygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTm8gZGInKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGIuaW5mbygpO1xuICAgIH1cblxuICAgIHN0YXRpYyB3cml0ZShpdGVtOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIGNvbnN0IHQgPSB0eXBlb2YoaXRlbSk7XG4gICAgICAgIGlmICh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtzdHJpbmc6IGl0ZW19KVxuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtudW1iZXI6IGl0ZW19KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe2Jvb2w6IGl0ZW19KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7anNvbjogaXRlbX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgdmFsdWUoaXRlbTogYW55KTogYW55IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGl0ZW07XG4gICAgICAgIGlmICh0eXBlb2YoaXRlbSkgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gaXRlbTtcbiAgICAgICAgfSBlbHNlIGlmICgnc3RyaW5nJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLnN0cmluZztcbiAgICAgICAgfSBlbHNlIGlmICgnbnVtYmVyJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLm51bWJlci52YWx1ZU9mKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Jvb2wnIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uYm9vbC52YWx1ZU9mKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2pzb24nIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uanNvbjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YocmVzdWx0KSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZXh0cmFjdEpzb24oaXRlbTogYW55KTogYW55IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGl0ZW07XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAoaXRlbSkgPT09ICdvYmplY3QnICYmICdqc29uJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmpzb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAocmVzdWx0KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpID09PSAnb2JqZWN0JyAmJiAnanNvbicgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSAocmVzdWx0IGFzIGFueSkuanNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbn1cbiIsIi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGInO1xuLy8gaW1wb3J0ICogYXMgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG4vLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG5pbXBvcnQgKiBhcyB2ZXJzaW9uIGZyb20gJy4uL3ZlcnNpb24nO1xuaW1wb3J0ICogYXMgdG9vbHMgZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0ICogYXMgY29ubmVjdGlvbiBmcm9tICcuLi9jb25uZWN0aW9uJztcbmltcG9ydCAqIGFzIHNlc3Npb24gZnJvbSAnLi4vc2Vzc2lvbic7XG5pbXBvcnQge1xuICAgIExvZ2dlckludGVyZmFjZSxcbiAgICBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UsXG4gICAgTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSxcbiAgICBTZGtJbnRlcmZhY2UsXG4gICAgRXJyb3JJbnRlcmZhY2UsIEVuZHBvaW50SW50ZXJmYWNlLCBFbmRwb2ludEZpbHRlckludGVyZmFjZVxufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlfSBmcm9tICcuLi9zZXNzaW9uL3Nlc3Npb24nO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge0FqYXh9IGZyb20gJy4uL2Nvbm5lY3Rpb24vYWpheCc7XG5cbi8vIGNvbnN0IFBvdWNoREIgPSB3aW5kb3dbJ1BvdWNoREInXSB8fCByZXF1aXJlKCdwb3VjaGRiJykuZGVmYXVsdDtcblxuLyoqXG4gKiBwbGVhc2UgdXNlIGl0cyBhbmd1bGFyLmpzIG9yIGFuZ3VsYXIuaW8gd3JhcHBlclxuICogdXNlZnVsbCBvbmx5IGZvciBmaWRqIGRldiB0ZWFtXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbFNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBzZGs6IFNka0ludGVyZmFjZTtcbiAgICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VySW50ZXJmYWNlO1xuICAgIHByaXZhdGUgcHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yO1xuICAgIHByaXZhdGUgc3RvcmFnZTogdG9vbHMuTG9jYWxTdG9yYWdlO1xuICAgIHByaXZhdGUgc2Vzc2lvbjogc2Vzc2lvbi5TZXNzaW9uO1xuICAgIHByaXZhdGUgY29ubmVjdGlvbjogY29ubmVjdGlvbi5Db25uZWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2UsIHByb21pc2U6IFByb21pc2VDb25zdHJ1Y3Rvcikge1xuXG4gICAgICAgIHRoaXMuc2RrID0ge1xuICAgICAgICAgICAgb3JnOiAnZmlkaicsXG4gICAgICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uLnZlcnNpb24sXG4gICAgICAgICAgICBwcm9kOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxvZ2dlciA9IHtcbiAgICAgICAgICAgIGxvZzogKCkgPT4ge1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2FybjogKCkgPT4ge1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAobG9nZ2VyICYmIHdpbmRvdy5jb25zb2xlICYmIGxvZ2dlciA9PT0gd2luZG93LmNvbnNvbGUpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yID0gd2luZG93LmNvbnNvbGUuZXJyb3I7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuID0gd2luZG93LmNvbnNvbGUud2FybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UgOiBjb25zdHJ1Y3RvcicpO1xuICAgICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgdG9vbHMuTG9jYWxTdG9yYWdlKHdpbmRvdy5sb2NhbFN0b3JhZ2UsICdmaWRqLicpO1xuICAgICAgICB0aGlzLnNlc3Npb24gPSBuZXcgc2Vzc2lvbi5TZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG5ldyBjb25uZWN0aW9uLkNvbm5lY3Rpb24odGhpcy5zZGssIHRoaXMuc3RvcmFnZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCBjb25uZWN0aW9uICYgc2Vzc2lvblxuICAgICAqIENoZWNrIHVyaVxuICAgICAqIERvbmUgZWFjaCBhcHAgc3RhcnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIHNldHRpbmdzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkaklkICByZXF1aXJlZCB1c2UgeW91ciBjdXN0b21pemVkIGVuZHBvaW50c1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmZpZGpTYWx0IHJlcXVpcmVkIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmlkalZlcnNpb24gcmVxdWlyZWQgdXNlIHlvdXIgY3VzdG9taXplZCBlbmRwb2ludHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5kZXZNb2RlIG9wdGlvbmFsIGRlZmF1bHQgZmFsc2UsIHVzZSB5b3VyIGN1c3RvbWl6ZWQgZW5kcG9pbnRzXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlkakluaXQoZmlkaklkOiBzdHJpbmcsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkakluaXQgOiAnLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKCFmaWRqSWQpIHtcbiAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpJbml0IDogYmFkIGluaXQnKTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdOZWVkIGEgZmlkaklkJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5zZGsucHJvZCA9ICFvcHRpb25zID8gdHJ1ZSA6IG9wdGlvbnMucHJvZDtcblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24udmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkaklkID0gZmlkaklkO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkalZlcnNpb24gPSBzZWxmLnNkay52ZXJzaW9uO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0byA9ICghb3B0aW9ucyB8fCAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY3J5cHRvJykpID8gdHJ1ZSA6IG9wdGlvbnMuY3J5cHRvO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGVCZXN0VXJsOiBhbnkgPSBzZWxmLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzKHtmaWx0ZXI6ICd0aGVCZXN0T25lJ30pWzBdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGhlQmVzdE9sZFVybDogYW55ID0gc2VsZi5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyh7ZmlsdGVyOiAndGhlQmVzdE9sZE9uZSd9KVswXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNMb2dpbiA9IHNlbGYuZmlkaklzTG9naW4oKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlQmVzdFVybCAmJiB0aGVCZXN0VXJsLnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlQmVzdFVybCA9IHRoZUJlc3RVcmwudXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGVCZXN0T2xkVXJsICYmIHRoZUJlc3RPbGRVcmwudXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVCZXN0T2xkVXJsID0gdGhlQmVzdE9sZFVybC51cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhlQmVzdFVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENsaWVudChuZXcgY29ubmVjdGlvbi5DbGllbnQoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdGhlQmVzdFVybCwgc2VsZi5zdG9yYWdlLCBzZWxmLnNkaykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzTG9naW4gJiYgdGhlQmVzdE9sZFVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb25uZWN0aW9uLnNldENsaWVudChuZXcgY29ubmVjdGlvbi5DbGllbnQoc2VsZi5jb25uZWN0aW9uLmZpZGpJZCwgdGhlQmVzdE9sZFVybCwgc2VsZi5zdG9yYWdlLCBzZWxmLnNkaykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDQsICdOZWVkIG9uZSBjb25uZWN0aW9uIC0gb3IgdG9vIG9sZCBTREsgdmVyc2lvbiAoY2hlY2sgdXBkYXRlKScpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqSW5pdDogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVyci50b1N0cmluZygpKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGl0IGlmIGZpZGpJc0xvZ2luKCkgPT09IGZhbHNlXG4gICAgICogRXJhc2UgYWxsIChkYiAmIHN0b3JhZ2UpXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWRqTG9naW4obG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqTG9naW4nKTtcbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uaXNSZWFkeSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5wcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA0LCAnTmVlZCBhbiBpbnRpYWxpemVkIEZpZGpTZXJ2aWNlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBzZWxmLnByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2VsZi5fcmVtb3ZlQWxsKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24udmVyaWZ5Q29ubmVjdGlvblN0YXRlcygpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fY3JlYXRlU2Vzc2lvbihzZWxmLmNvbm5lY3Rpb24uZmlkaklkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2xvZ2luSW50ZXJuYWwobG9naW4sIHBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDb25uZWN0aW9uKHVzZXIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlc3Npb24uc3luYyhzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHJlc29sdmUoc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5lcnJvcignZmlkai5zZGsuc2VydmljZS5maWRqTG9naW46ICcsIGVyci50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYWNjZXNzVG9rZW4gb3B0aW9uYWxcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pZFRva2VuICBvcHRpb25hbFxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIGZpZGpMb2dpbkluRGVtb01vZGUob3B0aW9ucz86IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIGdlbmVyYXRlIG9uZSBkYXkgdG9rZW5zIGlmIG5vdCBzZXRcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgbm93LnNldERhdGUobm93LmdldERhdGUoKSArIDEpO1xuICAgICAgICAgICAgY29uc3QgdG9tb3Jyb3cgPSBub3cuZ2V0VGltZSgpO1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRvb2xzLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHJvbGVzOiBbXSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnZGVtbycsXG4gICAgICAgICAgICAgICAgYXBpczogW10sXG4gICAgICAgICAgICAgICAgZW5kcG9pbnRzOiB7fSxcbiAgICAgICAgICAgICAgICBkYnM6IFtdLFxuICAgICAgICAgICAgICAgIGV4cDogdG9tb3Jyb3dcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGp3dFNpZ24gPSB0b29scy5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KHt9KSk7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGp3dFNpZ24gKyAnLicgKyBwYXlsb2FkICsgJy4nICsgand0U2lnbjtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IHRva2VuLFxuICAgICAgICAgICAgICAgIGlkVG9rZW46IHRva2VuLFxuICAgICAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBzZWxmLl9yZW1vdmVBbGwoKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDb25uZWN0aW9uT2ZmbGluZShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmVycm9yKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpMb2dpbiBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakdldEVuZHBvaW50cyhmaWx0ZXI/OiBFbmRwb2ludEZpbHRlckludGVyZmFjZSk6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCFmaWx0ZXIpIHtcbiAgICAgICAgICAgIGZpbHRlciA9IHtzaG93QmxvY2tlZDogZmFsc2V9O1xuICAgICAgICB9XG4gICAgICAgIGxldCBlbmRwb2ludHMgPSBKU09OLnBhcnNlKHRoaXMuY29ubmVjdGlvbi5nZXRBY2Nlc3NQYXlsb2FkKHtlbmRwb2ludHM6IFtdfSkpLmVuZHBvaW50cztcbiAgICAgICAgaWYgKCFlbmRwb2ludHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZHBvaW50cyA9IGVuZHBvaW50cy5maWx0ZXIoKGVuZHBvaW50OiBFbmRwb2ludEludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChvayAmJiBmaWx0ZXIua2V5KSB7XG4gICAgICAgICAgICAgICAgb2sgPSAoZW5kcG9pbnQua2V5ID09PSBmaWx0ZXIua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvayAmJiAhZmlsdGVyLnNob3dCbG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgb2sgPSAhZW5kcG9pbnQuYmxvY2tlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvaztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBlbmRwb2ludHM7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUm9sZXMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcztcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuY29ubmVjdGlvbi5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2U7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqSXNMb2dpbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5pc0xvZ2luKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqTG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3JlbW92ZUFsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uLmNyZWF0ZShzZWxmLmNvbm5lY3Rpb24uZmlkaklkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ubG9nb3V0KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlc3Npb24uY3JlYXRlKHNlbGYuY29ubmVjdGlvbi5maWRqSWQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9uaXplIERCXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmbkluaXRGaXJzdERhdGEgYSBmdW5jdGlvbiB3aXRoIGRiIGFzIGlucHV0IGFuZCB0aGF0IHJldHVybiBwcm9taXNlOiBjYWxsIGlmIERCIGlzIGVtcHR5XG4gICAgICogQHBhcmFtIGZuSW5pdEZpcnN0RGF0YV9BcmcgYXJnIHRvIHNldCB0byBmbkluaXRGaXJzdERhdGEoKVxuICAgICAqIEByZXR1cm5zICBwcm9taXNlXG4gICAgICovXG4gICAgcHVibGljIGZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YT8sIGZuSW5pdEZpcnN0RGF0YV9Bcmc/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYycpO1xuICAgICAgICAvLyBpZiAoIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QoJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgOiBEQiBzeW5jIGltcG9zc2libGUuIERpZCB5b3UgbG9naW4gPycpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgY29uc3QgZmlyc3RTeW5jID0gKHNlbGYuc2Vzc2lvbi5kYkxhc3RTeW5jID09PSBudWxsKTtcblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIHNlbGYuX2NyZWF0ZVNlc3Npb24oc2VsZi5jb25uZWN0aW9uLmZpZGpJZClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uc3luYyhzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqU3luYyByZXNvbHZlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLmlzRW1wdHkoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLndhcm4oJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgd2FybjogJywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pc0VtcHR5KCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaXNFbXB0eSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgaXNFbXB0eSA6ICcsIGlzRW1wdHksIGZpcnN0U3luYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlRW1wdHksIHJlamVjdEVtcHR5Tm90VXNlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRW1wdHkgJiYgZmlyc3RTeW5jICYmIGZuSW5pdEZpcnN0RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGZuSW5pdEZpcnN0RGF0YShmbkluaXRGaXJzdERhdGFfQXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICYmIHJldFsnY2F0Y2gnXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldC50aGVuKHJlc29sdmVFbXB0eSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9nZ2VyLmxvZyhyZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVFbXB0eSgpOyAvLyBzZWxmLmNvbm5lY3Rpb24uZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgZm5Jbml0Rmlyc3REYXRhIHJlc29sdmVkOiAnLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiTGFzdFN5bmMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2Vzc2lvbi5pbmZvKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5kb2NfY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2Vzc2lvbi5kYlJlY29yZENvdW50ID0gcmVzdWx0LmRvY19jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvZ2dlci5sb2coJ2ZpZGouc2RrLnNlcnZpY2UuZmlkalN5bmMgX2RiUmVjb3JkQ291bnQgOiAnICsgc2VsZi5zZXNzaW9uLmRiUmVjb3JkQ291bnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNvbm5lY3Rpb24ucmVmcmVzaENvbm5lY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTsgLy8gc2VsZi5jb25uZWN0aW9uLmdldFVzZXIoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IEVycm9ySW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gNDAzIHx8IGVyci5jb2RlID09PSA0MTApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpZGpMb2dvdXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogJ1N5bmNocm9uaXphdGlvbiB1bmF1dGhvcml6ZWQgOiBuZWVkIHRvIGxvZ2luIGFnYWluLid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246ICdTeW5jaHJvbml6YXRpb24gdW5hdXRob3JpemVkIDogbmVlZCB0byBsb2dpbiBhZ2Fpbi4nfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyICYmIGVyci5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIHdoYXQgdG8gZG8gd2l0aCB0aGlzIGVyciA/XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJNZXNzYWdlID0gJ0Vycm9yIGR1cmluZyBzeW5jcm9uaXNhdGlvbjogJyArIGVyci50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VsZi5sb2dnZXIuZXJyb3IoZXJyTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe2NvZGU6IDUwMCwgcmVhc29uOiBlcnJNZXNzYWdlfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpQdXRJbkRiKGRhdGE6IGFueSk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5maWRqUHV0SW5EYjogJywgZGF0YSk7XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSB8fCAhc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ0RCIHB1dCBpbXBvc3NpYmxlLiBOZWVkIGEgdXNlciBsb2dnZWQgaW4uJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IF9pZDogc3RyaW5nO1xuICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoZGF0YSkuaW5kZXhPZignX2lkJykpIHtcbiAgICAgICAgICAgIF9pZCA9IGRhdGEuX2lkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX2lkKSB7XG4gICAgICAgICAgICBfaWQgPSBzZWxmLl9nZW5lcmF0ZU9iamVjdFVuaXF1ZUlkKHNlbGYuY29ubmVjdGlvbi5maWRqSWQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjcnlwdG86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2U7XG4gICAgICAgIGlmIChzZWxmLmNvbm5lY3Rpb24uZmlkakNyeXB0bykge1xuICAgICAgICAgICAgY3J5cHRvID0ge1xuICAgICAgICAgICAgICAgIG9iajogc2VsZi5jb25uZWN0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ2VuY3J5cHQnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5zZXNzaW9uLnB1dChcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSxcbiAgICAgICAgICAgIHNlbGYuc2RrLm9yZyxcbiAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5maWRqVmVyc2lvbixcbiAgICAgICAgICAgIGNyeXB0byk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqUmVtb3ZlSW5EYihkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5sb2dnZXIubG9nKCdmaWRqLnNkay5zZXJ2aWNlLmZpZGpSZW1vdmVJbkRiICcsIGRhdGFfaWQpO1xuXG4gICAgICAgIGlmICghc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ0RCIHJlbW92ZSBpbXBvc3NpYmxlLiAnICtcbiAgICAgICAgICAgICAgICAnTmVlZCBhIHVzZXIgbG9nZ2VkIGluLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGF0YV9pZCB8fCB0eXBlb2YgZGF0YV9pZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICdEQiByZW1vdmUgaW1wb3NzaWJsZS4gJyArXG4gICAgICAgICAgICAgICAgJ05lZWQgdGhlIGRhdGEuX2lkLicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24ucmVtb3ZlKGRhdGFfaWQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgZmlkakZpbmRJbkRiKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmICghc2VsZi5jb25uZWN0aW9uLmdldENsaWVudElkKCkgfHwgIXNlbGYuc2Vzc2lvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDEsICdmaWRqLnNkay5zZXJ2aWNlLmZpZGpGaW5kSW5EYiA6IG5lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uZ2V0KGRhdGFfaWQsIGNyeXB0byk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaWRqRmluZEFsbEluRGIoKTogUHJvbWlzZTxBcnJheTxhbnk+IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24uZ2V0Q2xpZW50SWQoKSB8fCAhc2VsZi5zZXNzaW9uLmlzUmVhZHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYucHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMSwgJ05lZWQgYSB1c2VyIGxvZ2dlZCBpbi4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3J5cHRvOiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlO1xuICAgICAgICBpZiAoc2VsZi5jb25uZWN0aW9uLmZpZGpDcnlwdG8pIHtcbiAgICAgICAgICAgIGNyeXB0byA9IHtcbiAgICAgICAgICAgICAgICBvYmo6IHNlbGYuY29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdkZWNyeXB0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxmLnNlc3Npb24uZ2V0QWxsKGNyeXB0bylcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYuY29ubmVjdGlvbi5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVzb2x2ZSgocmVzdWx0cyBhcyBBcnJheTxhbnk+KSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpQb3N0T25FbmRwb2ludChrZXk6IHN0cmluZywgZGF0YT86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3QgZmlsdGVyOiBFbmRwb2ludEZpbHRlckludGVyZmFjZSA9IHtcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVuZHBvaW50cyA9IHRoaXMuZmlkakdldEVuZHBvaW50cyhmaWx0ZXIpO1xuICAgICAgICBpZiAoIWVuZHBvaW50cyB8fCBlbmRwb2ludHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChcbiAgICAgICAgICAgICAgICBuZXcgRXJyb3IoNDAwLFxuICAgICAgICAgICAgICAgICAgICAnZmlkai5zZGsuc2VydmljZS5maWRqUG9zdE9uRW5kcG9pbnQgOiBlbmRwb2ludCBkb2VzIG5vdCBleGlzdC4nKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmRwb2ludFVybCA9IGVuZHBvaW50c1swXS51cmw7XG4gICAgICAgIGNvbnN0IGp3dCA9IHRoaXMuY29ubmVjdGlvbi5nZXRJZFRva2VuKCk7XG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiBlbmRwb2ludFVybCxcbiAgICAgICAgICAgICAgICAvLyBub3QgdXNlZCA6IHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgand0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIGZpZGpHZXRJZFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uZ2V0SWRUb2tlbigpO1xuICAgIH07XG5cbiAgICAvLyBJbnRlcm5hbCBmdW5jdGlvbnNcblxuICAgIC8qKlxuICAgICAqIExvZ291dCB0aGVuIExvZ2luXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAcGFyYW0gdXBkYXRlUHJvcGVydGllc1xuICAgICAqL1xuICAgIHByaXZhdGUgX2xvZ2luSW50ZXJuYWwobG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXBkYXRlUHJvcGVydGllcz86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubG9nZ2VyLmxvZygnZmlkai5zZGsuc2VydmljZS5fbG9naW5JbnRlcm5hbCcpO1xuICAgICAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDMsICdOZWVkIGFuIGludGlhbGl6ZWQgRmlkalNlcnZpY2UnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHNlbGYucHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBzZWxmLmNvbm5lY3Rpb24ubG9nb3V0KClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbi5nZXRDbGllbnQoKS5sb2dpbihsb2dpbiwgcGFzc3dvcmQsIHVwZGF0ZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihsb2dpblVzZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5Vc2VyLmVtYWlsID0gbG9naW47XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGxvZ2luVXNlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoJ2ZpZGouc2RrLnNlcnZpY2UuX2xvZ2luSW50ZXJuYWwgZXJyb3IgOiAnICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcHJvdGVjdGVkIF9yZW1vdmVBbGwoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgX2NyZWF0ZVNlc3Npb24odWlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICB0aGlzLnNlc3Npb24uc2V0UmVtb3RlKHRoaXMuY29ubmVjdGlvbi5nZXREQnMoe2ZpbHRlcjogJ3RoZUJlc3RPbmVzJ30pKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Vzc2lvbi5jcmVhdGUodWlkKTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBfdGVzdFByb21pc2UoYT8pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZXNvbHZlKCd0ZXN0IHByb21pc2Ugb2sgJyArIGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5wcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoJ3Rlc3QgcHJvbWlzZSBvaycpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3NydkRhdGFVbmlxSWQgPSAwO1xuXG4gICAgcHJpdmF0ZSBfZ2VuZXJhdGVPYmplY3RVbmlxdWVJZChhcHBOYW1lLCB0eXBlPywgbmFtZT8pIHtcblxuICAgICAgICAvLyByZXR1cm4gbnVsbDtcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3Qgc2ltcGxlRGF0ZSA9ICcnICsgbm93LmdldEZ1bGxZZWFyKCkgKyAnJyArIG5vdy5nZXRNb250aCgpICsgJycgKyBub3cuZ2V0RGF0ZSgpXG4gICAgICAgICAgICArICcnICsgbm93LmdldEhvdXJzKCkgKyAnJyArIG5vdy5nZXRNaW51dGVzKCk7IC8vIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgY29uc3Qgc2VxdUlkID0gKytJbnRlcm5hbFNlcnZpY2UuX3NydkRhdGFVbmlxSWQ7XG4gICAgICAgIGxldCBVSWQgPSAnJztcbiAgICAgICAgaWYgKGFwcE5hbWUgJiYgYXBwTmFtZS5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIFVJZCArPSBhcHBOYW1lLmNoYXJBdCgwKSArICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlICYmIHR5cGUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgVUlkICs9IHR5cGUuc3Vic3RyaW5nKDAsIDQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lICYmIG5hbWUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgVUlkICs9IG5hbWUuc3Vic3RyaW5nKDAsIDQpO1xuICAgICAgICB9XG4gICAgICAgIFVJZCArPSBzaW1wbGVEYXRlICsgJycgKyBzZXF1SWQ7XG4gICAgICAgIHJldHVybiBVSWQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBMb2dnZXJJbnRlcmZhY2UsIE1vZHVsZVNlcnZpY2VJbnRlcmZhY2UsIE1vZHVsZVNlcnZpY2VJbml0T3B0aW9uc0ludGVyZmFjZSwgTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSxcbiAgICBFcnJvckludGVyZmFjZSwgRW5kcG9pbnRJbnRlcmZhY2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7SW50ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2ludGVybmFsLnNlcnZpY2UnO1xuaW1wb3J0IHtFcnJvciBhcyBGaWRqRXJyb3J9IGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuXG4vKipcbiAqIEFuZ3VsYXIyKyBGaWRqU2VydmljZVxuICogQHNlZSBNb2R1bGVTZXJ2aWNlSW50ZXJmYWNlXG4gKlxuICogQGV4ZW1wbGVcbiAqICAgICAgLy8gLi4uIGFmdGVyIGluc3RhbGwgOlxuICogICAgICAvLyAkIG5wbSBpbnN0YWxsIC0tc2F2ZS1kZXYgZmlkalxuICogICAgICAvLyB0aGVuIGluaXQgeW91ciBhcHAuanMgJiB1c2UgaXQgaW4geW91ciBzZXJ2aWNlc1xuICpcbiAqIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tbGVmcmVlL2FkNjRmN2Y2YTM0NTg1NmY2YmY0NWZkNTljYThkYjQ2L3Jhdy81ZmZmNjlkZDljMTVmNjkyYTg1NmRiNjJjZjMzNGI3MjRlZjNmNGFjL2FuZ3VsYXIuZmlkai5pbmplY3QuanNcIj48L3NjcmlwdD5cbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni9yYXcvNWZmZjY5ZGQ5YzE1ZjY5MmE4NTZkYjYyY2YzMzRiNzI0ZWYzZjRhYy9hbmd1bGFyLmZpZGouc3luYy5qc1wiPjwvc2NyaXB0PlxuICpcbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBGaWRqU2VydmljZSBpbXBsZW1lbnRzIE1vZHVsZVNlcnZpY2VJbnRlcmZhY2Uge1xuXG4gICAgcHJpdmF0ZSBsb2dnZXI6IExvZ2dlckludGVyZmFjZTtcbiAgICBwcml2YXRlIGZpZGpTZXJ2aWNlOiBJbnRlcm5hbFNlcnZpY2U7XG4gICAgcHJpdmF0ZSBwcm9taXNlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyU2VydmljZSgpO1xuICAgICAgICB0aGlzLnByb21pc2UgPSBQcm9taXNlO1xuICAgICAgICB0aGlzLmZpZGpTZXJ2aWNlID0gbnVsbDtcbiAgICAgICAgLy8gbGV0IHBvdWNoZGJSZXF1aXJlZCA9IFBvdWNoREI7XG4gICAgICAgIC8vIHBvdWNoZGJSZXF1aXJlZC5lcnJvcigpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgaW5pdChmaWRqSWQsIG9wdGlvbnM/OiBNb2R1bGVTZXJ2aWNlSW5pdE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2UgPSBuZXcgSW50ZXJuYWxTZXJ2aWNlKHRoaXMubG9nZ2VyLCB0aGlzLnByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIC8qXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlkalNlcnZpY2Uuc2V0QXV0aEVuZHBvaW50KG9wdGlvbnMuZm9yY2VkRW5kcG9pbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5maWRqU2VydmljZS5zZXREQkVuZHBvaW50KG9wdGlvbnMuZm9yY2VkREJFbmRwb2ludCk7XG4gICAgICAgIH0qL1xuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqSW5pdChmaWRqSWQsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9naW4obG9naW4sIHBhc3N3b3JkKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9naW4gOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpMb2dpbihsb2dpbiwgcGFzc3dvcmQpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgbG9naW5Bc0RlbW8ob3B0aW9ucz86IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcigzMDMsICdmaWRqLnNkay5hbmd1bGFyMi5sb2dpbkFzRGVtbyA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakxvZ2luSW5EZW1vTW9kZShvcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGlzTG9nZ2VkSW4oKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyB0aGlzLnByb21pc2UucmVqZWN0KCdmaWRqLnNkay5hbmd1bGFyMi5pc0xvZ2dlZEluIDogbm90IGluaXRpYWxpemVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpJc0xvZ2luKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRSb2xlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalJvbGVzKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBnZXRFbmRwb2ludHMoKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakdldEVuZHBvaW50cygpO1xuICAgIH07XG5cbiAgICBwdWJsaWMgcG9zdE9uRW5kcG9pbnQoa2V5OiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDMwMywgJ2ZpZGouc2RrLmFuZ3VsYXIyLmxvZ2luQXNEZW1vIDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqUG9zdE9uRW5kcG9pbnQoa2V5LCBkYXRhKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakdldElkVG9rZW4oKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGdldE1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkak1lc3NhZ2UoKTtcbiAgICB9O1xuXG4gICAgcHVibGljIGxvZ291dCgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoMzAzLCAnZmlkai5zZGsuYW5ndWxhcjIubG9nb3V0IDogbm90IGluaXRpYWxpemVkLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maWRqU2VydmljZS5maWRqTG9nb3V0KCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3luY2hyb25pemUgREJcbiAgICAgKiBAcGFyYW0gZm5Jbml0Rmlyc3REYXRhICBhIGZ1bmN0aW9uIHdpdGggZGIgYXMgaW5wdXQgYW5kIHRoYXQgcmV0dXJuIHByb21pc2U6IGNhbGwgaWYgREIgaXMgZW1wdHlcbiAgICAgKiBAcmV0dXJucyBwcm9taXNlIHdpdGggdGhpcy5zZXNzaW9uLmRiXG4gICAgICogQG1lbWJlcm9mIGZpZGouYW5ndWxhclNlcnZpY2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogIGxldCBpbml0RGIgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgdGhpcy5maWRqU2VydmljZS5wdXQoJ215IGZpcnN0IHJvdycpO1xuICAgICAqICB9O1xuICAgICAqICB0aGlzLmZpZGpTZXJ2aWNlLnN5bmMoaW5pdERiKVxuICAgICAqICAudGhlbih1c2VyID0+IC4uLilcbiAgICAgKiAgLmNhdGNoKGVyciA9PiAuLi4pXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgc3luYyhmbkluaXRGaXJzdERhdGE/KTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnN5bmMgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpTeW5jKGZuSW5pdEZpcnN0RGF0YSwgdGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGRhdGEgaW4geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSB0byBzdG9yZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHB1dChkYXRhOiBhbnkpOiBQcm9taXNlPHN0cmluZyB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGlmICghdGhpcy5maWRqU2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS5yZWplY3QobmV3IEZpZGpFcnJvcig0MDEsICdmaWRqLnNkay5hbmd1bGFyMi5wdXQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpQdXRJbkRiKGRhdGEpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG9iamVjdCBJZCBhbmQgcmVtb3ZlIGl0IGZyb20geW91ciBzZXNzaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgb2Ygb2JqZWN0IHRvIGZpbmQgYW5kIHJlbW92ZVxuICAgICAqIEByZXR1cm5zXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZShpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLnJlbW92ZSA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkalJlbW92ZUluRGIoaWQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kXG4gICAgICovXG4gICAgcHVibGljIGZpbmQoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKCF0aGlzLmZpZGpTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLnJlamVjdChuZXcgRmlkakVycm9yKDQwMSwgJ2ZpZGouc2RrLmFuZ3VsYXIyLmZpbmQgOiBub3QgaW5pdGlhbGl6ZWQuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpZGpTZXJ2aWNlLmZpZGpGaW5kSW5EYihpZCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBmaW5kQWxsKCk6IFByb21pc2U8YW55W10gfCBFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlkalNlcnZpY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb21pc2UucmVqZWN0KG5ldyBGaWRqRXJyb3IoNDAxLCAnZmlkai5zZGsuYW5ndWxhcjIuZmluZEFsbCA6IG5vdCBpbml0aWFsaXplZC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmlkalNlcnZpY2UuZmlkakZpbmRBbGxJbkRiKCk7XG4gICAgfTtcblxufVxuXG5leHBvcnQgY2xhc3MgTG9nZ2VyU2VydmljZSBpbXBsZW1lbnRzIExvZ2dlckludGVyZmFjZSB7XG4gICAgbG9nKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBlcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG5cbiAgICB3YXJuKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtGaWRqU2VydmljZX0gZnJvbSAnLi9hbmd1bGFyLnNlcnZpY2UnO1xuXG5cbi8qKlxuICogYE5nTW9kdWxlYCB3aGljaCBwcm92aWRlcyBhc3NvY2lhdGVkIHNlcnZpY2VzLlxuICpcbiAqIC4uLlxuICpcbiAqIEBzdGFibGVcbiAqL1xuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcblxuICAgIGV4cG9ydHM6IFtdLFxuXG4gICAgcHJvdmlkZXJzOiBbRmlkalNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIEZpZGpNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cbn1cblxuXG4vKipcbiAqIG1vZHVsZSBGaWRqTW9kdWxlXG4gKlxuICogZXhlbXBsZVxuICogICAgICAvLyAuLi4gYWZ0ZXIgaW5zdGFsbCA6XG4gKiAgICAgIC8vICQgbnBtIGluc3RhbGwgZmlkalxuICogICAgICAvLyB0aGVuIGluaXQgeW91ciBhcHAuanMgJiB1c2UgaXQgaW4geW91ciBzZXJ2aWNlc1xuICpcbiAqIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni5qc1wiPjwvc2NyaXB0PlxuICpcbiAqIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vbWxlZnJlZS9hZDY0ZjdmNmEzNDU4NTZmNmJmNDVmZDU5Y2E4ZGI0Ni5qc1wiPjwvc2NyaXB0PlxuICovXG4iXSwibmFtZXMiOlsiRXJyb3IiLCJ2ZXJzaW9uLnZlcnNpb24iLCJ0b29scy5Mb2NhbFN0b3JhZ2UiLCJzZXNzaW9uLlNlc3Npb24iLCJjb25uZWN0aW9uLkNvbm5lY3Rpb24iLCJjb25uZWN0aW9uLkNsaWVudCIsInRvb2xzLkJhc2U2NCIsIkZpZGpFcnJvciIsIkluamVjdGFibGUi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