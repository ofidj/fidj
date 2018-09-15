/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var XHRPromise = /** @class */ (function () {
    function XHRPromise() {
        this.DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    ;
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
    ;
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
    ;
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
    ;
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
    ;
    /**
     * @return {?}
     */
    XHRPromise.prototype._getHeaders = /**
     * @return {?}
     */
    function () {
        return this._parseHeaders(this._xhr.getAllResponseHeaders());
    };
    ;
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
    ;
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
    ;
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
    ;
    /**
     * @return {?}
     */
    XHRPromise.prototype._handleWindowUnload = /**
     * @return {?}
     */
    function () {
        return this._xhr.abort();
    };
    ;
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
export { XHRPromise };
if (false) {
    /** @type {?} */
    XHRPromise.prototype.DEFAULT_CONTENT_TYPE;
    /** @type {?} */
    XHRPromise.prototype._xhr;
    /** @type {?} */
    XHRPromise.prototype._unloadHandler;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhycHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJjb25uZWN0aW9uL3hocnByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUE7SUFNSTtvQ0FKOEIsa0RBQWtEO0tBSy9FO0lBQUEsQ0FBQztJQUVGOzs7OztPQUtHOzs7OztJQUNILHlCQUFJOzs7O0lBQUosVUFBSyxPQUFPOztRQUNSLElBQUksUUFBUSxDQUFDO1FBQ2IsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1lBQ2pCLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDaEI7UUFDRCxRQUFRLEdBQUc7WUFDUCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxJQUFJO1lBQ1YsT0FBTyxFQUFFLEVBQUU7WUFDWCxLQUFLLEVBQUUsSUFBSTtZQUNYLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxlQUFlLEVBQUUsS0FBSztTQUN6QixDQUFDO1FBQ0YsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUUsVUFBQyxLQUFpQjtZQUNuQyxPQUFRLFVBQUMsT0FBTyxFQUFFLE1BQU07O2dCQUNwQixJQUFJLENBQUMsQ0FBMEI7O2dCQUEvQixJQUFPLE1BQU0sQ0FBa0I7O2dCQUEvQixJQUFlLEdBQUcsQ0FBYTs7Z0JBQS9CLElBQW9CLEtBQUssQ0FBTTs7Z0JBQS9CLElBQTJCLEdBQUcsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDakIsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO29CQUN2RixPQUFPO2lCQUNWO2dCQUNELElBQUksT0FBTyxPQUFPLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFP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Q0FDVjs7WUFGOUMsSUFFTSxLQUFLLEdBQUcsT0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlDLElBQUksT0FBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLFdBQVcsRUFBRTtnQkFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTthQUN0QjtpQkFBTSxJQUFJLE9BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDMUI7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO2FBQ3JDO1NBQ0osQ0FDSixDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7O3FCQXZSdEI7SUEyUkMsQ0FBQTtBQTNSRCxzQkEyUkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgWEhSUHJvbWlzZSB7XG5cbiAgICBwdWJsaWMgREVGQVVMVF9DT05URU5UX1RZUEUgPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcbiAgICBwcml2YXRlIF94aHI7XG4gICAgcHJpdmF0ZSBfdW5sb2FkSGFuZGxlcjogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5zZW5kKG9wdGlvbnMpIC0+IFByb21pc2VcbiAgICAgKiAtIG9wdGlvbnMgKE9iamVjdCk6IFVSTCwgbWV0aG9kLCBkYXRhLCBldGMuXG4gICAgICpcbiAgICAgKiBDcmVhdGUgdGhlIFhIUiBvYmplY3QgYW5kIHdpcmUgdXAgZXZlbnQgaGFuZGxlcnMgdG8gdXNlIGEgcHJvbWlzZS5cbiAgICAgKi9cbiAgICBzZW5kKG9wdGlvbnMpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgZGVmYXVsdHM7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIChfdGhpczogWEhSUHJvbWlzZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGUsIGhlYWRlciwgcmVmLCB2YWx1ZSwgeGhyO1xuICAgICAgICAgICAgICAgIGlmICghWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCdicm93c2VyJywgcmVqZWN0LCBudWxsLCAnYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy51cmwgIT09ICdzdHJpbmcnIHx8IG9wdGlvbnMudXJsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXJyb3IoJ3VybCcsIHJlamVjdCwgbnVsbCwgJ1VSTCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLl94aHIgPSB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICAoKSAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGV0YWNoV2luZG93VW5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVRleHQgPSBfdGhpcy5fZ2V0UmVzcG9uc2VUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCdwYXJzZScsIHJlamVjdCwgbnVsbCwgJ2ludmFsaWQgSlNPTiByZXNwb25zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogX3RoaXMuX2dldFJlc3BvbnNlVXJsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVGV4dDogcmVzcG9uc2VUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogX3RoaXMuX2dldEhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhocjogeGhyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub250aW1lb3V0ID0gICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcigndGltZW91dCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub25hYm9ydCA9ICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Fib3J0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIF90aGlzLl9hdHRhY2hXaW5kb3dVbmxvYWQoKTtcbiAgICAgICAgICAgICAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIG9wdGlvbnMuYXN5bmMsIG9wdGlvbnMudXNlcm5hbWUsIG9wdGlvbnMucGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChvcHRpb25zLmRhdGEgIT0gbnVsbCkgJiYgIW9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IF90aGlzLkRFRkFVTFRfQ09OVEVOVF9UWVBFO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWYgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICAgICAgICAgICAgZm9yIChoZWFkZXIgaW4gcmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWYuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWZbaGVhZGVyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4aHIuc2VuZChvcHRpb25zLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuZ2V0WEhSKCkgLT4gWE1MSHR0cFJlcXVlc3RcbiAgICAgKi9cbiAgICBnZXRYSFIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9hdHRhY2hXaW5kb3dVbmxvYWQoKVxuICAgICAqXG4gICAgICogRml4IGZvciBJRSA5IGFuZCBJRSAxMFxuICAgICAqIEludGVybmV0IEV4cGxvcmVyIGZyZWV6ZXMgd2hlbiB5b3UgY2xvc2UgYSB3ZWJwYWdlIGR1cmluZyBhbiBYSFIgcmVxdWVzdFxuICAgICAqIGh0dHBzOi8vc3VwcG9ydC5taWNyb3NvZnQuY29tL2tiLzI4NTY3NDZcbiAgICAgKlxuICAgICAqL1xuICAgIHByaXZhdGUgX2F0dGFjaFdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdW5sb2FkSGFuZGxlciA9IHRoaXMuX2hhbmRsZVdpbmRvd1VubG9hZC5iaW5kKHRoaXMpO1xuICAgICAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmF0dGFjaEV2ZW50KCdvbnVubG9hZCcsIHRoaXMuX3VubG9hZEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9kZXRhY2hXaW5kb3dVbmxvYWQoKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2RldGFjaFdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudCgnb251bmxvYWQnLCB0aGlzLl91bmxvYWRIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0SGVhZGVycygpIC0+IE9iamVjdFxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldEhlYWRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUhlYWRlcnModGhpcy5feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2dldFJlc3BvbnNlVGV4dCgpIC0+IE1peGVkXG4gICAgICpcbiAgICAgKiBQYXJzZXMgcmVzcG9uc2UgdGV4dCBKU09OIGlmIHByZXNlbnQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0UmVzcG9uc2VUZXh0KCkge1xuICAgICAgICBsZXQgcmVzcG9uc2VUZXh0O1xuICAgICAgICByZXNwb25zZVRleHQgPSB0eXBlb2YgdGhpcy5feGhyLnJlc3BvbnNlVGV4dCA9PT0gJ3N0cmluZycgPyB0aGlzLl94aHIucmVzcG9uc2VUZXh0IDogJyc7XG4gICAgICAgIHN3aXRjaCAoKHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJykgfHwgJycpLnNwbGl0KCc7JylbMF0pIHtcbiAgICAgICAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL2pzb24nOlxuICAgICAgICAgICAgY2FzZSAndGV4dC9qYXZhc2NyaXB0JzpcbiAgICAgICAgICAgICAgICByZXNwb25zZVRleHQgPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dCArICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VUZXh0O1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0UmVzcG9uc2VVcmwoKSAtPiBTdHJpbmdcbiAgICAgKlxuICAgICAqIEFjdHVhbCByZXNwb25zZSBVUkwgYWZ0ZXIgZm9sbG93aW5nIHJlZGlyZWN0cy5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXRSZXNwb25zZVVybCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3hoci5yZXNwb25zZVVSTCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlVVJMO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXlgtUmVxdWVzdC1VUkw6L20udGVzdCh0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlcXVlc3QtVVJMJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5faGFuZGxlRXJyb3IocmVhc29uLCByZWplY3QsIHN0YXR1cywgc3RhdHVzVGV4dClcbiAgICAgKiAtIHJlYXNvbiAoU3RyaW5nKVxuICAgICAqIC0gcmVqZWN0IChGdW5jdGlvbilcbiAgICAgKiAtIHN0YXR1cyAoU3RyaW5nKVxuICAgICAqIC0gc3RhdHVzVGV4dCAoU3RyaW5nKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2hhbmRsZUVycm9yKHJlYXNvbiwgcmVqZWN0LCBzdGF0dXM/LCBzdGF0dXNUZXh0Pykge1xuICAgICAgICB0aGlzLl9kZXRhY2hXaW5kb3dVbmxvYWQoKTtcblxuICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ2Jyb3dzZXInLCByZWplY3QsIG51bGwsICdicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigndXJsJywgcmVqZWN0LCBudWxsLCAnVVJMIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigncGFyc2UnLCByZWplY3QsIG51bGwsICdpbnZhbGlkIEpTT04gcmVzcG9uc2UnKTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCd0aW1lb3V0JywgcmVqZWN0KTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignYWJvcnQnLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnX2hhbmRsZUVycm9yOicsIHJlYXNvbiwgdGhpcy5feGhyLnN0YXR1cyk7XG4gICAgICAgIGxldCBjb2RlID0gNDA0O1xuICAgICAgICBpZiAocmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgIGNvZGUgPSA0MDg7XG4gICAgICAgIH0gZWxzZSBpZiAocmVhc29uID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICBjb2RlID0gNDA4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlamVjdCh7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvbixcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzIHx8IHRoaXMuX3hoci5zdGF0dXMgfHwgY29kZSxcbiAgICAgICAgICAgIGNvZGU6IHN0YXR1cyB8fCB0aGlzLl94aHIuc3RhdHVzIHx8IGNvZGUsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiBzdGF0dXNUZXh0IHx8IHRoaXMuX3hoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgeGhyOiB0aGlzLl94aHJcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9oYW5kbGVXaW5kb3dVbmxvYWQoKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2hhbmRsZVdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgIH07XG5cblxuICAgIHByaXZhdGUgdHJpbShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0FycmF5KGFyZykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGZvckVhY2gobGlzdCwgaXRlcmF0b3IpIHtcbiAgICAgICAgaWYgKHRvU3RyaW5nLmNhbGwobGlzdCkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoU3RyaW5nKGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoT2JqZWN0KGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycmF5Lmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZvckVhY2hTdHJpbmcoc3RyaW5nLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gc3RyaW5nLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqZWN0W2tdLCBrLCBvYmplY3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9wYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICAgICAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaChcbiAgICAgICAgICAgIHRoaXMudHJpbShoZWFkZXJzKS5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgICwgKHJvdykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcm93LmluZGV4T2YoJzonKVxuICAgICAgICAgICAgICAgICAgICAsIGtleSA9IHRoaXMudHJpbShyb3cuc2xpY2UoMCwgaW5kZXgpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICwgdmFsdWUgPSB0aGlzLnRyaW0ocm93LnNsaWNlKGluZGV4ICsgMSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihyZXN1bHRba2V5XSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IFtyZXN1bHRba2V5XSwgdmFsdWVdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG5cbn1cbiJdfQ==