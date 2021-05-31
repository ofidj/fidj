(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('fidj', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fidj = {}, global.ng.core, global.ng.common));
}(this, (function (exports, i0, common) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    var Base64 = /** @class */ (function () {
        function Base64() {
        }
        ;
        /**
         * Decodes string from Base64 string
         */
        Base64.encode = function (input) {
            if (!input) {
                return null;
            }
            var _btoa = typeof window !== 'undefined' ? window.btoa : require('btoa');
            return _btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
                return String.fromCharCode(parseInt('0x' + p1, 16));
            }));
        };
        Base64.decode = function (input) {
            if (!input) {
                return null;
            }
            var _atob = typeof window !== 'undefined' ? window.atob : require('atob');
            return decodeURIComponent(_atob(input).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        };
        return Base64;
    }());

    /**
     * localStorage class factory
     * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
     * Usage : var localStorageService = new LocalStorage(); // to create a new instance
     */
    var LocalStorage = /** @class */ (function () {
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
        LocalStorage.prototype.set = function (key, value) {
            key = this.storageKey + key;
            this.checkKey(key);
            // clone the object before saving to storage
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
        ;
        /**
         * Looks up a key in cache
         *
         * @param key - Key to look up.
         * @param def - Default value to return, if key didn't exist.
         * @returns the key value, default value or <null>
         */
        LocalStorage.prototype.get = function (key, def) {
            key = this.storageKey + key;
            this.checkKey(key);
            var item = this.storage.getItem(key);
            if (item !== null) {
                if (item === 'null') {
                    return null;
                }
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
        ;
        /**
         * Deletes a key from cache.
         *
         * @param  key - Key to delete.
         * @returns true if key existed or false if it didn't
         */
        LocalStorage.prototype.remove = function (key) {
            key = this.storageKey + key;
            this.checkKey(key);
            var existed = (this.storage.getItem(key) !== null);
            this.storage.removeItem(key);
            return existed;
        };
        ;
        /**
         * Deletes everything in cache.
         *
         * @return true
         */
        LocalStorage.prototype.clear = function () {
            var existed = (this.storage.length > 0);
            this.storage.clear();
            return existed;
        };
        ;
        /**
         * How much space in bytes does the storage take?
         *
         * @returns Number
         */
        LocalStorage.prototype.size = function () {
            return this.storage.length;
        };
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
        LocalStorage.prototype.foreach = function (f, context) {
            var n = this.storage.length;
            for (var i = 0; i < n; i++) {
                var key = this.storage.key(i);
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
        ;
        // Private API
        // helper functions and variables hidden within this function scope
        LocalStorage.prototype.checkKey = function (key) {
            if (!key || (typeof key !== 'string')) {
                throw new TypeError('Key type must be string');
            }
            return true;
        };
        return LocalStorage;
    }());

    var Xor = /** @class */ (function () {
        function Xor() {
        }
        ;
        Xor.encrypt = function (value, key) {
            var result = '';
            value = Xor.header + value;
            for (var i = 0; i < value.length; i++) {
                result += String.fromCharCode(value[i].charCodeAt(0).toString(10) ^ Xor.keyCharAt(key, i));
            }
            result = Base64.encode(result);
            return result;
        };
        ;
        Xor.decrypt = function (value, key, oldStyle) {
            var result = '';
            value = Base64.decode(value);
            for (var i = 0; i < value.length; i++) {
                result += String.fromCharCode(value[i].charCodeAt(0).toString(10) ^ Xor.keyCharAt(key, i));
            }
            if (!oldStyle && Xor.header !== result.substring(0, Xor.header.length)) {
                return null;
            }
            if (!oldStyle) {
                result = result.substring(Xor.header.length);
            }
            return result;
        };
        Xor.keyCharAt = function (key, i) {
            return key[Math.floor(i % key.length)].charCodeAt(0).toString(10);
        };
        return Xor;
    }());
    Xor.header = 'artemis-lotsum';

    exports.LoggerLevelEnum = void 0;
    (function (LoggerLevelEnum) {
        LoggerLevelEnum[LoggerLevelEnum["INFO"] = 1] = "INFO";
        LoggerLevelEnum[LoggerLevelEnum["WARN"] = 2] = "WARN";
        LoggerLevelEnum[LoggerLevelEnum["ERROR"] = 3] = "ERROR";
        LoggerLevelEnum[LoggerLevelEnum["NONE"] = 4] = "NONE";
    })(exports.LoggerLevelEnum || (exports.LoggerLevelEnum = {}));

    var Error$2 = /** @class */ (function () {
        function Error(code, reason) {
            this.code = code;
            this.reason = reason;
        }
        ;
        Error.prototype.equals = function (err) {
            return this.code === err.code && this.reason === err.reason;
        };
        Error.prototype.toString = function () {
            var msg = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
            return '' + this.code + ' - ' + msg;
        };
        return Error;
    }());

    /**
     * `NgModule` which provides associated services.
     *
     * ...
     *
     * @stable
     */
    var FidjModule = /** @class */ (function () {
        function FidjModule() {
        }
        return FidjModule;
    }());
    FidjModule.decorators = [
        { type: i0.NgModule, args: [{
                    imports: [
                        common.CommonModule
                    ],
                    declarations: [],
                    exports: [],
                },] }
    ];
    FidjModule.ctorParameters = function () { return []; };
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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    // bumped version via gulp
    var version = '3.3.5';

    var ClientToken = /** @class */ (function () {
        function ClientToken(id, type, data) {
            this.id = id;
            this.type = type;
            this.data = data;
        }
        return ClientToken;
    }());
    var ClientTokens = /** @class */ (function () {
        function ClientTokens(username, accessToken, idToken, refreshToken) {
            this.username = username;
            this.accessToken = accessToken;
            this.idToken = idToken;
            this.refreshToken = refreshToken;
        }
        return ClientTokens;
    }());
    var ClientUser = /** @class */ (function () {
        function ClientUser(id, username, roles, message) {
            this.id = id;
            this.username = username;
            this.roles = roles;
        }
        return ClientUser;
    }());

    // import {XHRPromise} from './xhrpromise';
    // const superagent = require('superagent');
    // import from 'superagent';
    var XhrErrorReason;
    (function (XhrErrorReason) {
        XhrErrorReason[XhrErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
        XhrErrorReason[XhrErrorReason["TIMEOUT"] = 1] = "TIMEOUT";
        XhrErrorReason[XhrErrorReason["STATUS"] = 2] = "STATUS";
    })(XhrErrorReason || (XhrErrorReason = {}));
    var Ajax = /** @class */ (function () {
        function Ajax() {
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
        Ajax.formatResponseData = function (response) {
            // TODO switch depending on json headers
            var dataParsed = response;
            while (dataParsed && dataParsed.data) {
                dataParsed = dataParsed.data;
            }
            try {
                dataParsed = JSON.parse(dataParsed + '');
            }
            catch (e) {
            }
            return dataParsed;
        };
        ;
        Ajax.formatError = function (error) {
            var errorFormatted = {
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
        };
        ;
        Ajax.prototype.post = function (args) {
            var opt = {
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
                .then(function (res) {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }
                return Promise.resolve(Ajax.formatResponseData(res));
            })
                .catch(function (err) {
                return Promise.reject(Ajax.formatError(err));
            });
        };
        Ajax.prototype.put = function (args) {
            var opt = {
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
                .then(function (res) {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }
                return Promise.resolve(Ajax.formatResponseData(res));
            })
                .catch(function (err) {
                return Promise.reject(Ajax.formatError(err));
            });
        };
        Ajax.prototype.delete = function (args) {
            var opt = {
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
                .then(function (res) {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }
                return Promise.resolve(Ajax.formatResponseData(res));
            })
                .catch(function (err) {
                return Promise.reject(Ajax.formatError(err));
            });
        };
        Ajax.prototype.get = function (args) {
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
                .get(opt.url, {
                // opt.data,
                headers: opt.headers,
                timeout: 10000
            })
                // .get(opt.url) // .send(opt)
                .then(function (res) {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }
                return Promise.resolve(Ajax.formatResponseData(res));
            })
                .catch(function (err) {
                return Promise.reject(Ajax.formatError(err));
            });
        };
        return Ajax;
    }());

    var Client = /** @class */ (function () {
        function Client(appId, URI, storage, sdk) {
            this.appId = appId;
            this.URI = URI;
            this.storage = storage;
            this.sdk = sdk;
            var uuid = this.storage.get(Client._clientUuid) || 'uuid-' + Math.random();
            var info = '_clientInfo'; // this.storage.get(Client._clientInfo);
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
        Client.prototype.setClientId = function (value) {
            this.clientId = '' + value;
            this.storage.set(Client._clientId, this.clientId);
        };
        Client.prototype.setClientUuid = function (value) {
            this.clientUuid = '' + value;
            this.storage.set(Client._clientUuid, this.clientUuid);
        };
        Client.prototype.setClientInfo = function (value) {
            this.clientInfo = '' + value;
            // this.storage.set('clientInfo', this.clientInfo);
        };
        /**
         *
         * @param login
         * @param password
         * @param updateProperties
         * @throws {ErrorInterface}
         */
        Client.prototype.login = function (login, password, updateProperties) {
            return __awaiter(this, void 0, void 0, function () {
                var urlLogin, dataLogin, createdUser, urlToken, dataToken, createdAccessToken, createdIdToken, createdRefreshToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.URI) {
                                console.error('no api uri');
                                return [2 /*return*/, Promise.reject({ code: 408, reason: 'no-api-uri' })];
                            }
                            urlLogin = this.URI + '/users';
                            dataLogin = {
                                name: login,
                                username: login,
                                email: login,
                                password: password
                            };
                            return [4 /*yield*/, new Ajax().post({
                                    url: urlLogin,
                                    data: dataLogin,
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                                })];
                        case 1:
                            createdUser = (_a.sent()).user;
                            this.setClientId(login); // login or createdUser.id or createdUser._id
                            urlToken = this.URI + '/apps/' + this.appId + '/tokens';
                            dataToken = {
                                grant_type: 'access_token',
                                // grant_type: 'client_credentials',
                                // client_id: this.clientId,
                                // client_secret: password,
                                client_udid: this.clientUuid,
                                client_info: this.clientInfo,
                                // audience: this.appId,
                                scope: JSON.stringify(this.sdk)
                            };
                            return [4 /*yield*/, new Ajax().post({
                                    url: urlToken,
                                    data: dataToken,
                                    headers: {
                                        'Content-Type': 'application/json', 'Accept': 'application/json',
                                        'Authorization': 'Basic ' + Base64.encode('' + login + ':' + password)
                                    }
                                })];
                        case 2:
                            createdAccessToken = (_a.sent()).token;
                            dataToken.grant_type = 'id_token';
                            return [4 /*yield*/, new Ajax().post({
                                    url: urlToken,
                                    data: dataToken,
                                    headers: {
                                        'Content-Type': 'application/json', 'Accept': 'application/json',
                                        'Authorization': 'Bearer ' + createdAccessToken.data
                                    }
                                })];
                        case 3:
                            createdIdToken = (_a.sent()).token;
                            dataToken.grant_type = 'refresh_token';
                            return [4 /*yield*/, new Ajax().post({
                                    url: urlToken,
                                    data: dataToken,
                                    headers: {
                                        'Content-Type': 'application/json', 'Accept': 'application/json',
                                        'Authorization': 'Bearer ' + createdAccessToken.data
                                    }
                                })];
                        case 4:
                            createdRefreshToken = (_a.sent()).token;
                            return [2 /*return*/, new ClientTokens(login, createdAccessToken, createdIdToken, createdRefreshToken)];
                    }
                });
            });
        };
        /**
         *
         * @param refreshToken
         * @throws ErrorInterface
         */
        Client.prototype.reAuthenticate = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var url, data, clientToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.URI) {
                                console.error('no api uri');
                                return [2 /*return*/, Promise.reject({ code: 408, reason: 'no-api-uri' })];
                            }
                            url = this.URI + '/apps/' + this.appId + '/tokens';
                            data = {
                                grant_type: 'refresh_token',
                                // client_id: this.clientId,
                                client_udid: this.clientUuid,
                                client_info: this.clientInfo,
                                // audience: this.appId,
                                scope: JSON.stringify(this.sdk),
                                refresh_token: refreshToken,
                                refreshCount: Client.refreshCount,
                            };
                            return [4 /*yield*/, new Ajax().post({
                                    url: url,
                                    data: data,
                                    headers: {
                                        'Content-Type': 'application/json', 'Accept': 'application/json',
                                        'Authorization': 'Bearer ' + refreshToken
                                    }
                                })];
                        case 1:
                            clientToken = _a.sent();
                            Client.refreshCount++;
                            this.storage.set(Client._refreshCount, Client.refreshCount);
                            return [2 /*return*/, clientToken];
                    }
                });
            });
        };
        Client.prototype.logout = function (refreshToken) {
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
            var url = this.URI + '/apps/' + this.appId + '/tokens';
            return new Ajax()
                .delete({
                url: url,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Bearer ' + refreshToken
                }
            });
        };
        Client.prototype.isReady = function () {
            return !!this.URI;
        };
        return Client;
    }());
    // private refreshToken: string;
    Client.refreshCountInitial = 1;
    Client.refreshCount = Client.refreshCountInitial;
    Client._clientUuid = 'v2.clientUuid';
    Client._clientId = 'v2.clientId';
    Client._refreshCount = 'v2.refreshCount';

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
        Connection.prototype.isReady = function () {
            return !!this.client && this.client.isReady();
        };
        Connection.prototype.destroy = function (force) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
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
                            if (!this.client) return [3 /*break*/, 2];
                            // this.client.setClientId(null);
                            return [4 /*yield*/, this.client.logout()];
                        case 1:
                            // this.client.setClientId(null);
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this.accessToken = null;
                            this.idToken = null;
                            this.refreshToken = null;
                            this.states = {}; // new Map<string, boolean>();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Connection.prototype.setClient = function (client) {
            this.client = client;
            //if (!this.user) {
            //    this.user = new ClientUser();
            //}
            // this._user._id = this._client.clientId;
            //this.user._name = JSON.parse(this.getIdPayload({name: ''})).name;
        };
        Connection.prototype.setUser = function (user) {
            this.user = user;
            if (this.client && this.user.id) {
                this.client.setClientId(this.user.id);
                // store only clientId
                // delete this.user._id;
            }
        };
        Connection.prototype.getUser = function () {
            return this.user;
        };
        Connection.prototype.getClient = function () {
            return this.client;
        };
        Connection.prototype.setCryptoSalt = function (value) {
            if (this.cryptoSalt !== value && this.cryptoSaltNext !== value) {
                this.cryptoSaltNext = value;
                this._storage.set(Connection._cryptoSaltNext, this.cryptoSaltNext);
            }
            if (!this.cryptoSalt) {
                this.setCryptoSaltAsVerified();
            }
        };
        Connection.prototype.setCryptoSaltAsVerified = function () {
            if (this.cryptoSaltNext) {
                this.cryptoSalt = this.cryptoSaltNext;
                this._storage.set(Connection._cryptoSalt, this.cryptoSalt);
            }
            this.cryptoSaltNext = null;
            this._storage.remove(Connection._cryptoSaltNext);
        };
        Connection.prototype.encrypt = function (data) {
            if (typeof data !== 'string') {
                data = JSON.stringify(data);
            }
            else {
                var dataAsObj = { string: data };
                data = JSON.stringify(dataAsObj);
            }
            if (this.fidjCrypto && this.cryptoSalt) {
                var key = this.cryptoSalt;
                return Xor.encrypt(data, key);
            }
            else {
                return data;
            }
        };
        Connection.prototype.decrypt = function (data) {
            var decrypted = null;
            try {
                if (this.fidjCrypto && this.cryptoSaltNext) {
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
        Connection.prototype.isLogin = function () {
            var exp = true;
            try {
                var payload = this.refreshToken.split('.')[1];
                var decoded = JSON.parse(Base64.decode(payload));
                exp = ((new Date().getTime() / 1000) >= decoded.exp);
            }
            catch (e) {
            }
            return !exp;
        };
        // todo reintegrate client.login()
        Connection.prototype.logout = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getClient().logout(this.refreshToken)];
                });
            });
        };
        Connection.prototype.getClientId = function () {
            if (!this.client) {
                return null;
            }
            return this.client.clientId;
        };
        Connection.prototype.getIdToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.idToken];
                });
            });
        };
        Connection.prototype.getIdPayload = function (def) {
            return __awaiter(this, void 0, void 0, function () {
                var idToken, payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getIdToken()];
                        case 1:
                            idToken = _a.sent();
                            try {
                                payload = void 0;
                                if (idToken) {
                                    payload = idToken.split('.')[1];
                                }
                                if (payload) {
                                    return [2 /*return*/, Base64.decode(payload)];
                                }
                            }
                            catch (e) {
                                this._logger.log('fidj.connection.getIdPayload pb: ', def, e);
                            }
                            if (def) {
                                if (typeof def !== 'string') {
                                    def = JSON.stringify(def);
                                }
                                return [2 /*return*/, def];
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        Connection.prototype.getAccessPayload = function (def) {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    if (def && typeof def !== 'string') {
                        def = JSON.stringify(def);
                    }
                    try {
                        payload = this.accessToken.split('.')[1];
                        if (payload) {
                            return [2 /*return*/, Base64.decode(payload)];
                        }
                    }
                    catch (e) {
                    }
                    return [2 /*return*/, def ? def : null];
                });
            });
        };
        Connection.prototype.getPreviousAccessPayload = function (def) {
            if (def && typeof def !== 'string') {
                def = JSON.stringify(def);
            }
            try {
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
         * @throws ErrorInterface
         */
        Connection.prototype.refreshConnection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var payload, decoded, notExpired, payload, decoded, expired, client, refreshToken, previousIdToken, previousAccessToken, clientTokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // store states
                            this._storage.set(Connection._states, this.states);
                            // token not expired : ok
                            if (this.accessToken) {
                                payload = this.accessToken.split('.')[1];
                                decoded = Base64.decode(payload);
                                notExpired = (new Date().getTime() / 1000) < JSON.parse(decoded).exp;
                                // console.log('new Date().getTime() < JSON.parse(decoded).exp :', (new Date().getTime() / 1000), JSON.parse(decoded).exp);
                                this._logger.log('fidj.connection.connection.refreshConnection : token not expired ? ', notExpired);
                                if (notExpired) {
                                    return [2 /*return*/, Promise.resolve(this.getUser())];
                                }
                            }
                            // remove expired refreshToken
                            if (this.refreshToken) {
                                payload = this.refreshToken.split('.')[1];
                                decoded = Base64.decode(payload);
                                expired = (new Date().getTime() / 1000) >= JSON.parse(decoded).exp;
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
                            client = this.getClient();
                            if (!client) {
                                throw new Error$2(400, 'Need an initialized client.');
                            }
                            return [4 /*yield*/, this.getClient().reAuthenticate(this.refreshToken)];
                        case 1:
                            refreshToken = _a.sent();
                            previousIdToken = new ClientToken(this.getClientId(), 'idToken', this.idToken);
                            previousAccessToken = new ClientToken(this.getClientId(), 'accessToken', this.accessToken);
                            clientTokens = new ClientTokens(this.getClientId(), previousIdToken, previousAccessToken, refreshToken);
                            return [4 /*yield*/, this.setConnection(clientTokens)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.getUser()];
                    }
                });
            });
        };
        ;
        Connection.prototype.setConnection = function (clientTokens) {
            return __awaiter(this, void 0, void 0, function () {
                var salt, _a, _b, clientUser, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            if (!clientTokens.accessToken) return [3 /*break*/, 2];
                            this.accessToken = clientTokens.accessToken.data;
                            this._storage.set(Connection._accessToken, this.accessToken);
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, this.getAccessPayload({ salt: '' })];
                        case 1:
                            salt = _b.apply(_a, [_j.sent()]).salt;
                            if (salt) {
                                this.setCryptoSalt(salt);
                            }
                            _j.label = 2;
                        case 2:
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
                            _c = ClientUser.bind;
                            _d = [void 0, clientTokens.username, clientTokens.username];
                            _f = (_e = JSON).parse;
                            return [4 /*yield*/, this.getIdPayload({ roles: [] })];
                        case 3:
                            _d = _d.concat([_f.apply(_e, [_j.sent()]).roles]);
                            _h = (_g = JSON).parse;
                            return [4 /*yield*/, this.getIdPayload({ message: '' })];
                        case 4:
                            clientUser = new (_c.apply(ClientUser, _d.concat([_h.apply(_g, [_j.sent()]).message])))();
                            this.setUser(clientUser);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ;
        Connection.prototype.setConnectionOffline = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
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
                            _a = this.setUser;
                            _b = ClientUser.bind;
                            _c = [void 0, 'demo', 'demo'];
                            _e = (_d = JSON).parse;
                            return [4 /*yield*/, this.getIdPayload({ roles: [] })];
                        case 1:
                            _c = _c.concat([_e.apply(_d, [_h.sent()]).roles]);
                            _g = (_f = JSON).parse;
                            return [4 /*yield*/, this.getIdPayload({ message: '' })];
                        case 2:
                            _a.apply(this, [new (_b.apply(ClientUser, _c.concat([_g.apply(_f, [_h.sent()]).message])))()]);
                            return [2 /*return*/];
                    }
                });
            });
        };
        Connection.prototype.getApiEndpoints = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var ea, filteredEa, val, apiEndpoints, apiEndpoints, couldCheckStates, i, i, endpoint, bestOldOne, i, endpoint;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ea = [
                                { key: 'fidj.default', url: 'https://api.fidj.ovh/v3', blocked: false }
                            ];
                            filteredEa = [];
                            if (!this._sdk.prod) {
                                ea = [
                                    { key: 'fidj.default', url: 'http://localhost:3201/v3', blocked: false },
                                    { key: 'fidj.default', url: 'https://fidj-sandbox.herokuapp.com/v3', blocked: false }
                                ];
                            }
                            if (!this.accessToken) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAccessPayload({ apis: [] })];
                        case 1:
                            val = _a.sent();
                            apiEndpoints = JSON.parse(val).apis;
                            if (apiEndpoints && apiEndpoints.length) {
                                ea = [];
                                apiEndpoints.forEach(function (endpoint) {
                                    if (endpoint.url) {
                                        ea.push(endpoint);
                                    }
                                });
                            }
                            _a.label = 2;
                        case 2:
                            if (this.accessTokenPrevious) {
                                apiEndpoints = JSON.parse(this.getPreviousAccessPayload({ apis: [] })).apis;
                                if (apiEndpoints && apiEndpoints.length) {
                                    apiEndpoints.forEach(function (endpoint) {
                                        if (endpoint.url && ea.filter(function (r) { return r.url === endpoint.url; }).length === 0) {
                                            ea.push(endpoint);
                                        }
                                    });
                                }
                            }
                            this._logger.log('fidj.sdk.connection.getApiEndpoints : ', ea);
                            couldCheckStates = true;
                            if (this.states && Object.keys(this.states).length) {
                                for (i = 0; (i < ea.length) && couldCheckStates; i++) {
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
                                    for (i = 0; (i < ea.length) && (filteredEa.length === 0); i++) {
                                        endpoint = ea[i];
                                        if (this.states[endpoint.url] &&
                                            this.states[endpoint.url].state) {
                                            filteredEa.push(endpoint);
                                        }
                                    }
                                }
                                else if (couldCheckStates && options.filter === 'theBestOldOne') {
                                    bestOldOne = void 0;
                                    for (i = 0; (i < ea.length); i++) {
                                        endpoint = ea[i];
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
                            return [2 /*return*/, filteredEa];
                    }
                });
            });
        };
        ;
        Connection.prototype.getDBs = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var random, dbs, _a, _b, filteredDBs, couldCheckStates, i, i, endpoint, i, endpoint;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.accessToken) {
                                return [2 /*return*/, []];
                            }
                            random = Math.random() % 2;
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, this.getAccessPayload({ dbs: [] })];
                        case 1:
                            dbs = _b.apply(_a, [_c.sent()]).dbs || [];
                            // need to synchronize db
                            if (random === 0) {
                                dbs = dbs.sort();
                            }
                            else if (random === 1) {
                                dbs = dbs.reverse();
                            }
                            filteredDBs = [];
                            couldCheckStates = true;
                            if (this.states && Object.keys(this.states).length) {
                                for (i = 0; (i < dbs.length) && couldCheckStates; i++) {
                                    if (!this.states[dbs[i].url]) {
                                        couldCheckStates = false;
                                    }
                                }
                            }
                            else {
                                couldCheckStates = false;
                            }
                            if (couldCheckStates && options && options.filter === 'theBestOne') {
                                for (i = 0; (i < dbs.length) && (filteredDBs.length === 0); i++) {
                                    endpoint = dbs[i];
                                    if (this.states[endpoint.url] &&
                                        this.states[endpoint.url].state) {
                                        filteredDBs.push(endpoint);
                                    }
                                }
                            }
                            else if (couldCheckStates && options && options.filter === 'theBestOnes') {
                                for (i = 0; (i < dbs.length); i++) {
                                    endpoint = dbs[i];
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
                            return [2 /*return*/, filteredDBs];
                    }
                });
            });
        };
        ;
        Connection.prototype.verifyApiState = function (currentTime, endpointUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var data, state, err_1, lastTimeWasOk;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this._logger.log('fidj.sdk.connection.verifyApiState : ', currentTime, endpointUrl);
                            return [4 /*yield*/, new Ajax()
                                    .get({
                                    url: endpointUrl + '/status?isOk=' + this._sdk.version,
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                                })];
                        case 1:
                            data = _a.sent();
                            state = false;
                            if (data && data.isOk) {
                                state = true;
                            }
                            this.states[endpointUrl] = { state: state, time: currentTime, lastTimeWasOk: currentTime };
                            this._logger.log('fidj.sdk.connection.verifyApiState > states : ', this.states);
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            lastTimeWasOk = 0;
                            if (this.states[endpointUrl]) {
                                lastTimeWasOk = this.states[endpointUrl].lastTimeWasOk;
                            }
                            this.states[endpointUrl] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                            this._logger.log('fidj.sdk.connection.verifyApiState > catch pb  - states : ', err_1, this.states);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Connection.prototype.verifyDbState = function (currentTime, dbEndpoint) {
            return __awaiter(this, void 0, void 0, function () {
                var err_2, lastTimeWasOk;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // console.log('verifyDbState: ', dbEndpoint);
                            return [4 /*yield*/, new Ajax()
                                    .get({
                                    url: dbEndpoint,
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                                })];
                        case 1:
                            // console.log('verifyDbState: ', dbEndpoint);
                            _a.sent();
                            this.states[dbEndpoint] = { state: true, time: currentTime, lastTimeWasOk: currentTime };
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            lastTimeWasOk = 0;
                            if (this.states[dbEndpoint]) {
                                lastTimeWasOk = this.states[dbEndpoint].lastTimeWasOk;
                            }
                            this.states[dbEndpoint] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Connection.prototype.verifyConnectionStates = function () {
            return __awaiter(this, void 0, void 0, function () {
                var currentTime, promises, _a, dbs;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            currentTime = new Date().getTime();
                            promises = [];
                            // this.states = {};
                            _a = this;
                            return [4 /*yield*/, this.getApiEndpoints()];
                        case 1:
                            // this.states = {};
                            _a.apis = _b.sent();
                            this.apis.forEach(function (endpointObj) {
                                var endpointUrl = endpointObj.url;
                                if (!endpointUrl) {
                                    endpointUrl = endpointObj.toString();
                                }
                                promises.push(_this.verifyApiState(currentTime, endpointUrl));
                            });
                            return [4 /*yield*/, this.getDBs()];
                        case 2:
                            dbs = _b.sent();
                            dbs.forEach(function (dbEndpointObj) {
                                var dbEndpoint = dbEndpointObj.url;
                                if (!dbEndpoint) {
                                    dbEndpoint = dbEndpointObj.toString();
                                }
                                promises.push(_this.verifyDbState(currentTime, dbEndpoint));
                            });
                            return [2 /*return*/, Promise.all(promises)];
                    }
                });
            });
        };
        ;
        return Connection;
    }());
    Connection._accessToken = 'v2.accessToken';
    Connection._accessTokenPrevious = 'v2.accessTokenPrevious';
    Connection._idToken = 'v2.idToken';
    Connection._refreshToken = 'v2.refreshToken';
    Connection._states = 'v2.states';
    Connection._cryptoSalt = 'v2.cryptoSalt';
    Connection._cryptoSaltNext = 'v2.cryptoSalt.next';

    // import PouchDB from 'pouchdb';
    var FidjPouch;
    if (typeof window !== 'undefined') {
        FidjPouch = (window['PouchDB']) ? window['PouchDB'] : require('pouchdb').default; // .default;
        // load cordova adapter : https://github.com/pouchdb-community/pouchdb-adapter-cordova-sqlite/issues/22
        var PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
        FidjPouch.plugin(PouchAdapterCordovaSqlite);
    }
    var Session = /** @class */ (function () {
        function Session() {
            this.db = null;
            this.dbRecordCount = 0;
            this.dbLastSync = null;
            this.remoteDb = null;
            this.dbs = [];
        }
        ;
        Session.prototype.isReady = function () {
            return !!this.db;
        };
        Session.prototype.create = function (uid, force) {
            var _this = this;
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
            return new Promise(function (resolve, reject) {
                var opts = { location: 'default' };
                try {
                    if (window['cordova']) {
                        opts = { location: 'default', adapter: 'cordova-sqlite' };
                        //    const plugin = require('pouchdb-adapter-cordova-sqlite');
                        //    if (plugin) { Pouch.plugin(plugin); }
                        //    this.db = new Pouch('fidj_db', {adapter: 'cordova-sqlite'});
                    }
                    // } else {
                    _this.db = new FidjPouch('fidj_db_' + uid, opts); // , {adapter: 'websql'} ???
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
                        reject(new Error$2(400, err));
                    });
                }
                catch (err) {
                    reject(new Error$2(500, err));
                }
            });
        };
        Session.prototype.destroy = function () {
            var _this = this;
            if (!this.db) {
                this.dbRecordCount = 0;
                this.dbLastSync = null;
                return Promise.resolve();
            }
            if (this.db && !this.db.destroy) {
                return Promise.reject(new Error$2(408, 'Need a valid db'));
            }
            return new Promise(function (resolve, reject) {
                _this.db.destroy(function (err, info) {
                    if (err) {
                        reject(new Error$2(500, err));
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
        ;
        Session.prototype.setRemote = function (dbs) {
            this.dbs = dbs;
        };
        Session.prototype.sync = function (userId) {
            var _this = this;
            if (!this.db) {
                return Promise.reject(new Error$2(408, 'need db'));
            }
            if (!this.dbs || !this.dbs.length) {
                return Promise.reject(new Error$2(408, 'need a remote db'));
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
                            .on('denied', function (err) { return reject({ code: 403, reason: { second: err } }); })
                            .on('error', function (err) { return reject({ code: 401, reason: { second: err } }); });
                    })
                        .on('denied', function (err) { return reject({ code: 403, reason: { first: err } }); })
                        .on('error', function (err) { return reject({ code: 401, reason: { first: err } }); });
                }
                catch (err) {
                    reject(new Error$2(500, err));
                }
            });
        };
        Session.prototype.put = function (data, _id, uid, oid, ave, crypto) {
            var _this = this;
            if (!this.db) {
                return Promise.reject(new Error$2(408, 'need db'));
            }
            if (!data || !_id || !uid || !oid || !ave) {
                return Promise.reject(new Error$2(400, 'need formated data'));
            }
            var dataWithoutIds = JSON.parse(JSON.stringify(data));
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
        };
        Session.prototype.remove = function (data_id) {
            var _this = this;
            if (!this.db) {
                return Promise.reject(new Error$2(408, 'need db'));
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
        Session.prototype.get = function (data_id, crypto) {
            var _this = this;
            if (!this.db) {
                return Promise.reject(new Error$2(408, 'Need db'));
            }
            return new Promise(function (resolve, reject) {
                _this.db.get(data_id)
                    .then(function (row) {
                    if (!!row && (!!row.fidjDacr || !!row.fidjData)) {
                        var data = row.fidjDacr;
                        if (crypto && data) {
                            data = crypto.obj[crypto.method](data);
                        }
                        else if (row.fidjData) {
                            data = JSON.parse(row.fidjData);
                        }
                        var resultAsJson = Session.extractJson(data);
                        if (resultAsJson) {
                            resultAsJson._id = row._id;
                            resultAsJson._rev = row._rev;
                            resolve(JSON.parse(JSON.stringify(resultAsJson)));
                        }
                        else {
                            // row._deleted = true;
                            _this.remove(row._id);
                            reject(new Error$2(400, 'Bad encoding'));
                        }
                    }
                    else {
                        reject(new Error$2(400, 'No data found'));
                    }
                })
                    .catch(function (err) { return reject(new Error$2(500, err)); });
            });
        };
        Session.prototype.getAll = function (crypto) {
            var _this = this;
            if (!this.db || !this.db.allDocs) {
                return Promise.reject(new Error$2(408, 'Need a valid db'));
            }
            return new Promise(function (resolve, reject) {
                _this.db.allDocs({ include_docs: true, descending: true })
                    .then(function (rows) {
                    var all = [];
                    rows.rows.forEach(function (row) {
                        if (!!row && !!row.doc._id && (!!row.doc.fidjDacr || !!row.doc.fidjData)) {
                            var data = row.doc.fidjDacr;
                            if (crypto && data) {
                                data = crypto.obj[crypto.method](data);
                            }
                            else if (row.doc.fidjData) {
                                data = JSON.parse(row.doc.fidjData);
                            }
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
                                _this.remove(row.doc._id);
                            }
                        }
                        else {
                            console.error('Bad encoding');
                        }
                    });
                    resolve(all);
                })
                    .catch(function (err) { return reject(new Error$2(400, err)); });
            });
        };
        Session.prototype.isEmpty = function () {
            var _this = this;
            if (!this.db || !this.db.allDocs) {
                return Promise.reject(new Error$2(408, 'No db'));
            }
            return new Promise(function (resolve, reject) {
                _this.db.allDocs({
                // filter:  (doc) => {
                //    if (!self.connection.user || !self.connection.user._id) return doc;
                //    if (doc.fidjUserId === self.connection.user._id) return doc;
                // }
                })
                    .then(function (response) {
                    if (!response) {
                        reject(new Error$2(400, 'No response'));
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
                    .catch(function (err) { return reject(new Error$2(400, err)); });
            });
        };
        Session.prototype.info = function () {
            if (!this.db) {
                return Promise.reject(new Error$2(408, 'No db'));
            }
            return this.db.info();
        };
        Session.write = function (item) {
            var value = 'null';
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
        Session.value = function (item) {
            var result = item;
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
        };
        Session.extractJson = function (item) {
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
                result = result.json;
            }
            if (typeof result !== 'object') {
                result = null;
            }
            return result;
        };
        return Session;
    }());

    var Error$1 = /** @class */ (function () {
        function Error() {
        }
        ;
        return Error;
    }());

    var LoggerService = /** @class */ (function () {
        function LoggerService(level) {
            this.level = level;
            if (!level) {
                this.level = exports.LoggerLevelEnum.ERROR;
            }
            if (typeof console === 'undefined') {
                this.level = exports.LoggerLevelEnum.NONE;
            }
        }
        LoggerService.prototype.log = function (message, args) {
            if (this.level === exports.LoggerLevelEnum.INFO) {
                console.log(message, args);
            }
        };
        LoggerService.prototype.warn = function (message, args) {
            if (this.level === exports.LoggerLevelEnum.INFO || this.level === exports.LoggerLevelEnum.WARN) {
                console.warn(message, args);
            }
        };
        LoggerService.prototype.error = function (message, args) {
            if (this.level === exports.LoggerLevelEnum.INFO || this.level === exports.LoggerLevelEnum.WARN || this.level === exports.LoggerLevelEnum.ERROR) {
                console.error(message, args);
            }
        };
        LoggerService.prototype.setLevel = function (level) {
            this.level = level;
        };
        return LoggerService;
    }());

    var urljoin = require('url-join');
    // import {LocalStorage} from 'node-localstorage';
    // import 'localstorage-polyfill/localStorage';
    // const PouchDB = window['PouchDB'] || require('pouchdb').default;
    /**
     * please use its angular.js or angular.io wrapper
     * usefull only for fidj dev team
     */
    var InternalService = /** @class */ (function () {
        function InternalService(logger, promise, options) {
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
            var ls;
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
        InternalService.prototype.fidjInit = function (fidjId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var bestUrls, bestOldUrls, err_1, theBestFirstUrl, theBestFirstOldUrl, isLogin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
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
                                this.logger.setLevel(exports.LoggerLevelEnum.NONE);
                            }
                            this.logger.log('fidj.sdk.service.fidjInit : ', options);
                            if (!fidjId) {
                                this.logger.error('fidj.sdk.service.fidjInit : bad init');
                                return [2 /*return*/, this.promise.reject(new Error$2(400, 'Need a fidjId'))];
                            }
                            this.sdk.prod = !options ? true : options.prod;
                            this.sdk.useDB = !options ? false : options.useDB;
                            this.connection.fidjId = fidjId;
                            this.connection.fidjVersion = this.sdk.version;
                            this.connection.fidjCrypto = (!options || !options.hasOwnProperty('crypto')) ? false : options.crypto;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.connection.verifyConnectionStates()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.connection.getApiEndpoints({ filter: 'theBestOne' })];
                        case 3:
                            bestUrls = _a.sent();
                            return [4 /*yield*/, this.connection.getApiEndpoints({ filter: 'theBestOldOne' })];
                        case 4:
                            bestOldUrls = _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _a.sent();
                            this.logger.error('fidj.sdk.service.fidjInit: ', err_1);
                            throw new Error$2(500, err_1.toString());
                        case 6:
                            if (!bestUrls || !bestOldUrls || (bestUrls.length === 0 && bestOldUrls.length === 0)) {
                                throw new Error$2(404, 'Need one connection - or too old SDK version (check update)');
                            }
                            theBestFirstUrl = bestUrls[0];
                            theBestFirstOldUrl = bestOldUrls[0];
                            isLogin = this.fidjIsLogin();
                            this.logger.log('fidj.sdk.service.fidjInit > verifyConnectionStates : ', theBestFirstUrl, theBestFirstOldUrl, isLogin);
                            if (theBestFirstUrl) {
                                this.connection.setClient(new Client(this.connection.fidjId, theBestFirstUrl.url, this.storage, this.sdk));
                            }
                            else {
                                this.connection.setClient(new Client(this.connection.fidjId, theBestFirstOldUrl.url, this.storage, this.sdk));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ;
        /**
         * Call it if fidjIsLogin() === false
         * Erase all (db & storage)
         *
         * @param login
         * @param password
         * @throws {ErrorInterface}
         */
        InternalService.prototype.fidjLogin = function (login, password) {
            return __awaiter(this, void 0, void 0, function () {
                var clientTokens, err_2, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('fidj.sdk.service.fidjLogin');
                            if (!this.connection.isReady()) {
                                throw new Error$2(404, 'Need an initialized FidjService');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, this._removeAll()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.connection.verifyConnectionStates()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this._createSession(this.connection.fidjId)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this._loginInternal(login, password)];
                        case 5:
                            clientTokens = _a.sent();
                            return [4 /*yield*/, this.connection.setConnection(clientTokens)];
                        case 6:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            err_2 = _a.sent();
                            throw new Error$2(500, err_2.toString());
                        case 8:
                            if (!this.sdk.useDB) {
                                return [2 /*return*/, this.connection.getUser()];
                            }
                            _a.label = 9;
                        case 9:
                            _a.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.session.sync(this.connection.getClientId())];
                        case 10:
                            _a.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            e_1 = _a.sent();
                            this.logger.warn('fidj.sdk.service.fidjLogin: sync -not blocking- issue  ', e_1.toString());
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/, this.connection.getUser()];
                    }
                });
            });
        };
        /**
         *
         * @param options
         * @param options.accessToken optional
         * @param options.idToken  optional
         * @returns
         */
        InternalService.prototype.fidjLoginInDemoMode = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var self, now, tomorrow, payload, jwtSign, token;
                var _this = this;
                return __generator(this, function (_a) {
                    self = this;
                    // generate one day tokens if not set
                    if (!options || !options.accessToken) {
                        now = new Date();
                        now.setDate(now.getDate() + 1);
                        tomorrow = now.getTime();
                        payload = Base64.encode(JSON.stringify({
                            roles: [],
                            message: 'demo',
                            apis: [],
                            endpoints: [],
                            dbs: [],
                            exp: tomorrow
                        }));
                        jwtSign = Base64.encode(JSON.stringify({}));
                        token = jwtSign + '.' + payload + '.' + jwtSign;
                        options = {
                            accessToken: token,
                            idToken: token,
                            refreshToken: token
                        };
                    }
                    return [2 /*return*/, new self.promise(function (resolve, reject) {
                            self._removeAll()
                                .then(function () {
                                return self._createSession(self.connection.fidjId);
                            })
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, self.connection.setConnectionOffline(options)];
                                        case 1:
                                            _a.sent();
                                            resolve(self.connection.getUser());
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (err) {
                                self.logger.error('fidj.sdk.service.fidjLoginInDemoMode error: ', err);
                                reject(err);
                            });
                        })];
                });
            });
        };
        ;
        InternalService.prototype.fidjIsLogin = function () {
            return this.connection.isLogin();
        };
        ;
        InternalService.prototype.fidjGetEndpoints = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                var ap, endpoints;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!filter) {
                                filter = { showBlocked: false };
                            }
                            return [4 /*yield*/, this.connection.getAccessPayload({ endpoints: [] })];
                        case 1:
                            ap = _a.sent();
                            endpoints = JSON.parse(ap).endpoints;
                            if (!endpoints || !Array.isArray(endpoints)) {
                                return [2 /*return*/, []];
                            }
                            endpoints = endpoints.filter(function (endpoint) {
                                var ok = true;
                                if (ok && filter.key) {
                                    ok = (endpoint.key === filter.key);
                                }
                                if (ok && !filter.showBlocked) {
                                    ok = !endpoint.blocked;
                                }
                                return ok;
                            });
                            return [2 /*return*/, endpoints];
                    }
                });
            });
        };
        ;
        InternalService.prototype.fidjRoles = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, this.connection.getIdPayload({ roles: [] })];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]).roles];
                    }
                });
            });
        };
        ;
        InternalService.prototype.fidjMessage = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, this.connection.getIdPayload({ message: '' })];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]).message];
                    }
                });
            });
        };
        ;
        InternalService.prototype.fidjLogout = function (force) {
            return __awaiter(this, void 0, void 0, function () {
                var self;
                var _this = this;
                return __generator(this, function (_a) {
                    self = this;
                    if (!self.connection.getClient() && !force) {
                        return [2 /*return*/, self._removeAll()
                                .then(function () {
                                return _this.session.create(self.connection.fidjId, true);
                            })];
                    }
                    return [2 /*return*/, self.connection.logout()
                            .then(function () {
                            return self._removeAll();
                        })
                            .catch(function () {
                            return self._removeAll();
                        })
                            .then(function () {
                            return _this.session.create(self.connection.fidjId, true);
                        })];
                });
            });
        };
        ;
        /**
         * Synchronize DB
         *
         *
         * @param fnInitFirstData a function with db as input and that return promise: call if DB is empty
         * @param fnInitFirstData_Arg arg to set to fnInitFirstData()
         * @returns  promise
         */
        InternalService.prototype.fidjSync = function (fnInitFirstData, fnInitFirstData_Arg) {
            return __awaiter(this, void 0, void 0, function () {
                var self, firstSync;
                var _this = this;
                return __generator(this, function (_a) {
                    self = this;
                    self.logger.log('fidj.sdk.service.fidjSync');
                    // if (!self.session.isReady()) {
                    //    return self.promise.reject('fidj.sdk.service.fidjSync : DB sync impossible. Did you login ?');
                    // }
                    if (!self.sdk.useDB) {
                        self.logger.log('fidj.sdk.service.fidjSync: you ar not using DB - no sync available.');
                        return [2 /*return*/, Promise.resolve()];
                    }
                    firstSync = (self.session.dbLastSync === null);
                    return [2 /*return*/, new self.promise(function (resolve, reject) {
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
                                return new self.promise(function (resolveEmpty, rejectEmptyNotUsed) {
                                    if (isEmpty && firstSync && fnInitFirstData) {
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
                                self.logger.log('fidj.sdk.service.fidjSync refreshConnection done : ', user);
                                resolve(); // self.connection.getUser()
                            })
                                .catch(function (err) {
                                // console.error(err);
                                self.logger.warn('fidj.sdk.service.fidjSync refreshConnection failed : ', err);
                                if (err && (err.code === 403 || err.code === 410)) {
                                    _this.fidjLogout()
                                        .then(function () {
                                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again.' });
                                    })
                                        .catch(function () {
                                        reject({ code: 403, reason: 'Synchronization unauthorized : need to login again..' });
                                    });
                                }
                                else if (err && err.code) {
                                    // todo what to do with this err ?
                                    resolve();
                                }
                                else {
                                    var errMessage = 'Error during synchronisation: ' + err.toString();
                                    self.logger.error(errMessage);
                                    reject({ code: 500, reason: errMessage });
                                }
                            });
                        })];
                });
            });
        };
        ;
        InternalService.prototype.fidjPutInDb = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var self, _id, crypto;
                return __generator(this, function (_a) {
                    self = this;
                    self.logger.log('fidj.sdk.service.fidjPutInDb: ', data);
                    if (!self.sdk.useDB) {
                        self.logger.log('fidj.sdk.service.fidjPutInDb: you are not using DB - no put available.');
                        return [2 /*return*/, Promise.resolve('NA')];
                    }
                    if (!self.connection.getClientId()) {
                        return [2 /*return*/, self.promise.reject(new Error$2(401, 'DB put impossible. Need a user logged in.'))];
                    }
                    if (!self.session.isReady()) {
                        return [2 /*return*/, self.promise.reject(new Error$2(400, 'Need to be synchronised.'))];
                    }
                    if (data && typeof data === 'object' && Object.keys(data).indexOf('_id')) {
                        _id = data._id;
                    }
                    if (!_id) {
                        _id = self._generateObjectUniqueId(self.connection.fidjId);
                    }
                    if (self.connection.fidjCrypto) {
                        crypto = {
                            obj: self.connection,
                            method: 'encrypt'
                        };
                    }
                    return [2 /*return*/, self.session.put(data, _id, self.connection.getClientId(), self.sdk.org, self.connection.fidjVersion, crypto)];
                });
            });
        };
        ;
        InternalService.prototype.fidjRemoveInDb = function (data_id) {
            return __awaiter(this, void 0, void 0, function () {
                var self;
                return __generator(this, function (_a) {
                    self = this;
                    self.logger.log('fidj.sdk.service.fidjRemoveInDb ', data_id);
                    if (!self.sdk.useDB) {
                        self.logger.log('fidj.sdk.service.fidjRemoveInDb: you are not using DB - no remove available.');
                        return [2 /*return*/, Promise.resolve()];
                    }
                    if (!self.session.isReady()) {
                        return [2 /*return*/, self.promise.reject(new Error$2(400, 'Need to be synchronised.'))];
                    }
                    if (!data_id || typeof data_id !== 'string') {
                        return [2 /*return*/, self.promise.reject(new Error$2(400, 'DB remove impossible. ' +
                                'Need the data._id.'))];
                    }
                    return [2 /*return*/, self.session.remove(data_id)];
                });
            });
        };
        ;
        InternalService.prototype.fidjFindInDb = function (data_id) {
            return __awaiter(this, void 0, void 0, function () {
                var self, crypto;
                return __generator(this, function (_a) {
                    self = this;
                    if (!self.sdk.useDB) {
                        self.logger.log('fidj.sdk.service.fidjFindInDb: you are not using DB - no find available.');
                        return [2 /*return*/, Promise.resolve()];
                    }
                    if (!self.connection.getClientId()) {
                        return [2 /*return*/, self.promise.reject(new Error$2(401, 'Find pb : need a user logged in.'))];
                    }
                    if (!self.session.isReady()) {
                        return [2 /*return*/, self.promise.reject(new Error$2(400, ' Need to be synchronised.'))];
                    }
                    if (self.connection.fidjCrypto) {
                        crypto = {
                            obj: self.connection,
                            method: 'decrypt'
                        };
                    }
                    return [2 /*return*/, self.session.get(data_id, crypto)];
                });
            });
        };
        ;
        InternalService.prototype.fidjFindAllInDb = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, crypto;
                return __generator(this, function (_a) {
                    self = this;
                    if (!self.sdk.useDB) {
                        self.logger.log('fidj.sdk.service.fidjFindAllInDb: you are not using DB - no find available.');
                        return [2 /*return*/, Promise.resolve([])];
                    }
                    if (!self.connection.getClientId()) {
                        return [2 /*return*/, self.promise.reject(new Error$2(401, 'Need a user logged in.'))];
                    }
                    if (!self.session.isReady()) {
                        return [2 /*return*/, self.promise.reject(new Error$2(400, 'Need to be synchronised.'))];
                    }
                    if (self.connection.fidjCrypto) {
                        crypto = {
                            obj: self.connection,
                            method: 'decrypt'
                        };
                    }
                    return [2 /*return*/, self.session.getAll(crypto)
                            .then(function (results) {
                            self.connection.setCryptoSaltAsVerified();
                            return self.promise.resolve(results);
                        })];
                });
            });
        };
        ;
        InternalService.prototype.fidjSendOnEndpoint = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, endpoints, firstEndpointUrl, jwt, answer, query;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = input.key ? { key: input.key } : null;
                            return [4 /*yield*/, this.fidjGetEndpoints(filter)];
                        case 1:
                            endpoints = _a.sent();
                            if (!endpoints || endpoints.length !== 1) {
                                throw new Error$2(400, 'fidj.sdk.service.fidjSendOnEndpoint : endpoint does not exist.');
                            }
                            firstEndpointUrl = endpoints[0].url;
                            if (input.relativePath) {
                                firstEndpointUrl = urljoin(firstEndpointUrl, input.relativePath);
                            }
                            return [4 /*yield*/, this.connection.getIdToken()];
                        case 2:
                            jwt = _a.sent();
                            query = new Ajax();
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
                            return [2 /*return*/, answer];
                    }
                });
            });
        };
        ;
        InternalService.prototype.fidjForgotPasswordRequest = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var bestUrls, query;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connection.getApiEndpoints({ filter: 'theBestOne' })];
                        case 1:
                            bestUrls = _a.sent();
                            if (!bestUrls || bestUrls.length !== 1) {
                                throw new Error$2(400, 'fidj.sdk.service.fidjForgotPasswordRequest : api endpoint does not exist.');
                            }
                            query = new Ajax();
                            return [4 /*yield*/, query.post({
                                    url: bestUrls[0].url + '/me/forgot',
                                    // not used : withCredentials: true,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    },
                                    data: { email: email }
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InternalService.prototype.fidjGetIdToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.connection.getIdToken()];
                });
            });
        };
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
        InternalService.prototype._loginInternal = function (login, password, updateProperties) {
            return __awaiter(this, void 0, void 0, function () {
                var clientTokens, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('fidj.sdk.service._loginInternal');
                            if (!this.connection.isReady()) {
                                throw new Error$2(403, 'Need an initialized FidjService');
                            }
                            return [4 /*yield*/, this.connection.logout()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 3, , 5]);
                            clientTokens = this.connection.getClient().login(login, password, updateProperties);
                            return [3 /*break*/, 5];
                        case 3:
                            e_2 = _a.sent();
                            return [4 /*yield*/, this.connection.getClient().login(login, password, updateProperties)];
                        case 4:
                            clientTokens = _a.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/, clientTokens];
                    }
                });
            });
        };
        ;
        InternalService.prototype._removeAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.connection.destroy();
                    return [2 /*return*/, this.session.destroy()];
                });
            });
        };
        ;
        InternalService.prototype._createSession = function (uid) {
            return __awaiter(this, void 0, void 0, function () {
                var dbs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.connection.getDBs({ filter: 'theBestOnes' })];
                        case 1:
                            dbs = _a.sent();
                            if (!dbs || dbs.length === 0) {
                                this.logger.warn('Seems that you are in Demo mode or using Node (no remote DB).');
                            }
                            this.session.setRemote(dbs);
                            return [2 /*return*/, this.session.create(uid)];
                    }
                });
            });
        };
        ;
        InternalService.prototype._testPromise = function (a) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (a) {
                        return [2 /*return*/, this.promise.resolve('test promise ok ' + a)];
                    }
                    return [2 /*return*/, new this.promise(function (resolve, reject) {
                            resolve('test promise ok');
                        })];
                });
            });
        };
        ;
        InternalService.prototype._generateObjectUniqueId = function (appName, type, name) {
            // return null;
            var now = new Date();
            var simpleDate = '' + now.getFullYear() + '' + now.getMonth() + '' + now.getDate()
                + '' + now.getHours() + '' + now.getMinutes(); // new Date().toISOString();
            var sequId = ++InternalService._srvDataUniqId;
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
        return InternalService;
    }());
    InternalService._srvDataUniqId = 0;

    /**
     * Angular FidjService
     * @see ModuleServiceInterface
     *
     */
    var FidjService = /** @class */ (function () {
        function FidjService() {
            this.logger = new LoggerService(exports.LoggerLevelEnum.ERROR);
            this.promise = Promise;
            this.fidjService = null;
            // let pouchdbRequired = PouchDB;
            // pouchdbRequired.error();
        }
        ;
        FidjService.prototype.init = function (fidjId, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        this.fidjService = new InternalService(this.logger, this.promise);
                    }
                    return [2 /*return*/, this.fidjService.fidjInit(fidjId, options)];
                });
            });
        };
        ;
        FidjService.prototype.login = function (login, password) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(303, 'fidj.sdk.angular.login : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjLogin(login, password)];
                });
            });
        };
        ;
        FidjService.prototype.loginAsDemo = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjLoginInDemoMode(options)];
                });
            });
        };
        ;
        FidjService.prototype.isLoggedIn = function () {
            if (!this.fidjService) {
                return false; // this.promise.reject('fidj.sdk.angular.isLoggedIn : not initialized.');
            }
            return this.fidjService.fidjIsLogin();
        };
        ;
        FidjService.prototype.getRoles = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.fidjService) {
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, this.fidjService.fidjRoles()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ;
        FidjService.prototype.getEndpoints = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, this.fidjService.fidjGetEndpoints()];
                });
            });
        };
        ;
        /**
         * @throws {ErrorInterface}
         * @param {EndpointCallInterface} input
         */
        FidjService.prototype.sendOnEndpoint = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjSendOnEndpoint(input)];
                });
            });
        };
        ;
        FidjService.prototype.forgotPasswordRequest = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(303, 'fidj.sdk.angular.loginAsDemo : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjForgotPasswordRequest(email)];
                });
            });
        };
        ;
        FidjService.prototype.getIdToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/];
                    }
                    return [2 /*return*/, this.fidjService.fidjGetIdToken()];
                });
            });
        };
        ;
        FidjService.prototype.getMessage = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, ''];
                    }
                    return [2 /*return*/, this.fidjService.fidjMessage()];
                });
            });
        };
        ;
        FidjService.prototype.logout = function (force) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (force || !this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(303, 'fidj.sdk.angular.logout : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjLogout(force)];
                });
            });
        };
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
        FidjService.prototype.sync = function (fnInitFirstData) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(401, 'fidj.sdk.angular.sync : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjSync(fnInitFirstData, this)];
                });
            });
        };
        ;
        /**
         * Store data in your session
         *
         * @param data to store
         * @returns
         */
        FidjService.prototype.put = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(401, 'fidj.sdk.angular.put : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjPutInDb(data)];
                });
            });
        };
        ;
        /**
         * Find object Id and remove it from your session
         *
         * @param id of object to find and remove
         * @returns
         */
        FidjService.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(401, 'fidj.sdk.angular.remove : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjRemoveInDb(id)];
                });
            });
        };
        ;
        /**
         * Find
         */
        FidjService.prototype.find = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(401, 'fidj.sdk.angular.find : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjFindInDb(id)];
                });
            });
        };
        ;
        FidjService.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.fidjService) {
                        return [2 /*return*/, this.promise.reject(new Error$2(401, 'fidj.sdk.angular.findAll : not initialized.'))];
                    }
                    return [2 /*return*/, this.fidjService.fidjFindAllInDb()];
                });
            });
        };
        ;
        return FidjService;
    }());
    FidjService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function FidjService_Factory() { return new FidjService(); }, token: FidjService, providedIn: "root" });
    FidjService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    FidjService.ctorParameters = function () { return []; };

    /**
     * Generated bundle index. Do not edit.
     */

    exports.Base64 = Base64;
    exports.Error = Error$2;
    exports.FidjModule = FidjModule;
    exports.FidjService = FidjService;
    exports.LocalStorage = LocalStorage;
    exports.Xor = Xor;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fidj.umd.js.map
