(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('fidj', ['exports', '@angular/common', '@angular/core'], factory) :
    (factory((global.fidj = {}),global.ng.common,global.ng.core));
}(this, (function (exports,common,core) { 'use strict';

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
    var version = '2.1.16';

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

//# sourceMappingURL=fidj.umd.js.map