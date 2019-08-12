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
    XHRPromise.prototype.send = function (options) {
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
                var e, header, ref, value, xhr;
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
    XHRPromise.prototype.getXHR = function () {
        return this._xhr;
    };
    ;
    /*
     * XHRPromise._attachWindowUnload()
     *
     * Fix for IE 9 and IE 10
     * Internet Explorer freezes when you close a webpage during an XHR request
     * https://support.microsoft.com/kb/2856746
     *
     */
    XHRPromise.prototype._attachWindowUnload = function () {
        this._unloadHandler = this._handleWindowUnload.bind(this);
        if (window.attachEvent) {
            return window.attachEvent('onunload', this._unloadHandler);
        }
    };
    ;
    /*
     * XHRPromise._detachWindowUnload()
     */
    XHRPromise.prototype._detachWindowUnload = function () {
        if (window.detachEvent) {
            return window.detachEvent('onunload', this._unloadHandler);
        }
    };
    ;
    /*
     * XHRPromise._getHeaders() -> Object
     */
    XHRPromise.prototype._getHeaders = function () {
        return this._parseHeaders(this._xhr.getAllResponseHeaders());
    };
    ;
    /*
     * XHRPromise._getResponseText() -> Mixed
     *
     * Parses response text JSON if present.
     */
    XHRPromise.prototype._getResponseText = function () {
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
    /*
     * XHRPromise._getResponseUrl() -> String
     *
     * Actual response URL after following redirects.
     */
    XHRPromise.prototype._getResponseUrl = function () {
        if (this._xhr.responseURL != null) {
            return this._xhr.responseURL;
        }
        if (/^X-Request-URL:/m.test(this._xhr.getAllResponseHeaders())) {
            return this._xhr.getResponseHeader('X-Request-URL');
        }
        return '';
    };
    ;
    /*
     * XHRPromise._handleError(reason, reject, status, statusText)
     * - reason (String)
     * - reject (Function)
     * - status (String)
     * - statusText (String)
     */
    XHRPromise.prototype._handleError = function (reason, reject, status, statusText) {
        this._detachWindowUnload();
        // _this._handleError('browser', reject, null, 'browser doesn\'t support XMLHttpRequest');
        // _this._handleError('url', reject, null, 'URL is a required parameter');
        // _this._handleError('parse', reject, null, 'invalid JSON response');
        // return _this._handleError('error', reject);
        // return _this._handleError('timeout', reject);
        // return _this._handleError('abort', reject);
        // return _this._handleError('send', reject, null, e.toString());
        // console.log('_handleError:', reason, this._xhr.status);
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
    /*
     * XHRPromise._handleWindowUnload()
     */
    XHRPromise.prototype._handleWindowUnload = function () {
        return this._xhr.abort();
    };
    ;
    XHRPromise.prototype.trim = function (str) {
        return str.replace(/^\s*|\s*$/g, '');
    };
    XHRPromise.prototype.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
    XHRPromise.prototype.forEach = function (list, iterator) {
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
    XHRPromise.prototype.forEachArray = function (array, iterator, context) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array.hasOwnProperty(i)) {
                iterator.call(context, array[i], i, array);
            }
        }
    };
    XHRPromise.prototype.forEachString = function (string, iterator, context) {
        for (var i = 0, len = string.length; i < len; i++) {
            // no such thing as a sparse string.
            iterator.call(context, string.charAt(i), i, string);
        }
    };
    XHRPromise.prototype.forEachObject = function (object, iterator, context) {
        for (var k in object) {
            if (object.hasOwnProperty(k)) {
                iterator.call(context, object[k], k, object);
            }
        }
    };
    XHRPromise.prototype._parseHeaders = function (headers) {
        var _this_1 = this;
        if (!headers) {
            return {};
        }
        var result = {};
        this.forEach(this.trim(headers).split('\n'), function (row) {
            var index = row.indexOf(':'), key = _this_1.trim(row.slice(0, index)).toLowerCase(), value = _this_1.trim(row.slice(index + 1));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhycHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJjb25uZWN0aW9uL3hocnByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFNSTtRQUpPLHlCQUFvQixHQUFHLGtEQUFrRCxDQUFDO0lBS2pGLENBQUM7SUFBQSxDQUFDO0lBRUY7Ozs7O09BS0c7SUFDSCx5QkFBSSxHQUFKLFVBQUssT0FBTztRQUNSLElBQUksUUFBUSxDQUFDO1FBQ2IsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1lBQ2pCLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDaEI7UUFDRCxRQUFRLEdBQUc7WUFDUCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxJQUFJO1lBQ1YsT0FBTyxFQUFFLEVBQUU7WUFDWCxLQUFLLEVBQUUsSUFBSTtZQUNYLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxlQUFlLEVBQUUsS0FBSztTQUN6QixDQUFDO1FBQ0YsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUUsVUFBQyxLQUFpQjtZQUNuQyxPQUFRLFVBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQ3BCLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDakIsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO29CQUN2RixPQUFPO2lCQUNWO2dCQUNELElBQUksT0FBTyxPQUFPLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQzdELEtBQUssQ0FBQyxZ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QUFPLENBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQzVCLFVBQUMsR0FBRztZQUNGLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQ3hCLEdBQUcsR0FBRyxPQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQ2xELEtBQUssR0FBRyxPQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUMsSUFBSSxPQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO2FBQ3RCO2lCQUFNLElBQUksT0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUMxQjtpQkFBTTtnQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7YUFDckM7UUFDTCxDQUFDLENBQ0osQ0FBQztRQUVGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFHTCxpQkFBQztBQUFELENBQUMsQUEzUkQsSUEyUkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgWEhSUHJvbWlzZSB7XG5cbiAgICBwdWJsaWMgREVGQVVMVF9DT05URU5UX1RZUEUgPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcbiAgICBwcml2YXRlIF94aHI7XG4gICAgcHJpdmF0ZSBfdW5sb2FkSGFuZGxlcjogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5zZW5kKG9wdGlvbnMpIC0+IFByb21pc2VcbiAgICAgKiAtIG9wdGlvbnMgKE9iamVjdCk6IFVSTCwgbWV0aG9kLCBkYXRhLCBldGMuXG4gICAgICpcbiAgICAgKiBDcmVhdGUgdGhlIFhIUiBvYmplY3QgYW5kIHdpcmUgdXAgZXZlbnQgaGFuZGxlcnMgdG8gdXNlIGEgcHJvbWlzZS5cbiAgICAgKi9cbiAgICBzZW5kKG9wdGlvbnMpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgZGVmYXVsdHM7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIChfdGhpczogWEhSUHJvbWlzZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGUsIGhlYWRlciwgcmVmLCB2YWx1ZSwgeGhyO1xuICAgICAgICAgICAgICAgIGlmICghWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCdicm93c2VyJywgcmVqZWN0LCBudWxsLCAnYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy51cmwgIT09ICdzdHJpbmcnIHx8IG9wdGlvbnMudXJsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXJyb3IoJ3VybCcsIHJlamVjdCwgbnVsbCwgJ1VSTCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLl94aHIgPSB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICAoKSAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGV0YWNoV2luZG93VW5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVRleHQgPSBfdGhpcy5fZ2V0UmVzcG9uc2VUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCdwYXJzZScsIHJlamVjdCwgbnVsbCwgJ2ludmFsaWQgSlNPTiByZXNwb25zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogX3RoaXMuX2dldFJlc3BvbnNlVXJsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVGV4dDogcmVzcG9uc2VUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogX3RoaXMuX2dldEhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhocjogeGhyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub250aW1lb3V0ID0gICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcigndGltZW91dCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub25hYm9ydCA9ICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Fib3J0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIF90aGlzLl9hdHRhY2hXaW5kb3dVbmxvYWQoKTtcbiAgICAgICAgICAgICAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIG9wdGlvbnMuYXN5bmMsIG9wdGlvbnMudXNlcm5hbWUsIG9wdGlvbnMucGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChvcHRpb25zLmRhdGEgIT0gbnVsbCkgJiYgIW9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IF90aGlzLkRFRkFVTFRfQ09OVEVOVF9UWVBFO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWYgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICAgICAgICAgICAgZm9yIChoZWFkZXIgaW4gcmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWYuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWZbaGVhZGVyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4aHIuc2VuZChvcHRpb25zLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuZ2V0WEhSKCkgLT4gWE1MSHR0cFJlcXVlc3RcbiAgICAgKi9cbiAgICBnZXRYSFIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9hdHRhY2hXaW5kb3dVbmxvYWQoKVxuICAgICAqXG4gICAgICogRml4IGZvciBJRSA5IGFuZCBJRSAxMFxuICAgICAqIEludGVybmV0IEV4cGxvcmVyIGZyZWV6ZXMgd2hlbiB5b3UgY2xvc2UgYSB3ZWJwYWdlIGR1cmluZyBhbiBYSFIgcmVxdWVzdFxuICAgICAqIGh0dHBzOi8vc3VwcG9ydC5taWNyb3NvZnQuY29tL2tiLzI4NTY3NDZcbiAgICAgKlxuICAgICAqL1xuICAgIHByaXZhdGUgX2F0dGFjaFdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdW5sb2FkSGFuZGxlciA9IHRoaXMuX2hhbmRsZVdpbmRvd1VubG9hZC5iaW5kKHRoaXMpO1xuICAgICAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmF0dGFjaEV2ZW50KCdvbnVubG9hZCcsIHRoaXMuX3VubG9hZEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9kZXRhY2hXaW5kb3dVbmxvYWQoKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2RldGFjaFdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudCgnb251bmxvYWQnLCB0aGlzLl91bmxvYWRIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0SGVhZGVycygpIC0+IE9iamVjdFxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldEhlYWRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUhlYWRlcnModGhpcy5feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2dldFJlc3BvbnNlVGV4dCgpIC0+IE1peGVkXG4gICAgICpcbiAgICAgKiBQYXJzZXMgcmVzcG9uc2UgdGV4dCBKU09OIGlmIHByZXNlbnQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0UmVzcG9uc2VUZXh0KCkge1xuICAgICAgICBsZXQgcmVzcG9uc2VUZXh0O1xuICAgICAgICByZXNwb25zZVRleHQgPSB0eXBlb2YgdGhpcy5feGhyLnJlc3BvbnNlVGV4dCA9PT0gJ3N0cmluZycgPyB0aGlzLl94aHIucmVzcG9uc2VUZXh0IDogJyc7XG4gICAgICAgIHN3aXRjaCAoKHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJykgfHwgJycpLnNwbGl0KCc7JylbMF0pIHtcbiAgICAgICAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL2pzb24nOlxuICAgICAgICAgICAgY2FzZSAndGV4dC9qYXZhc2NyaXB0JzpcbiAgICAgICAgICAgICAgICByZXNwb25zZVRleHQgPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dCArICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VUZXh0O1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0UmVzcG9uc2VVcmwoKSAtPiBTdHJpbmdcbiAgICAgKlxuICAgICAqIEFjdHVhbCByZXNwb25zZSBVUkwgYWZ0ZXIgZm9sbG93aW5nIHJlZGlyZWN0cy5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXRSZXNwb25zZVVybCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3hoci5yZXNwb25zZVVSTCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlVVJMO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXlgtUmVxdWVzdC1VUkw6L20udGVzdCh0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlcXVlc3QtVVJMJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5faGFuZGxlRXJyb3IocmVhc29uLCByZWplY3QsIHN0YXR1cywgc3RhdHVzVGV4dClcbiAgICAgKiAtIHJlYXNvbiAoU3RyaW5nKVxuICAgICAqIC0gcmVqZWN0IChGdW5jdGlvbilcbiAgICAgKiAtIHN0YXR1cyAoU3RyaW5nKVxuICAgICAqIC0gc3RhdHVzVGV4dCAoU3RyaW5nKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2hhbmRsZUVycm9yKHJlYXNvbiwgcmVqZWN0LCBzdGF0dXM/LCBzdGF0dXNUZXh0Pykge1xuICAgICAgICB0aGlzLl9kZXRhY2hXaW5kb3dVbmxvYWQoKTtcblxuICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ2Jyb3dzZXInLCByZWplY3QsIG51bGwsICdicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigndXJsJywgcmVqZWN0LCBudWxsLCAnVVJMIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigncGFyc2UnLCByZWplY3QsIG51bGwsICdpbnZhbGlkIEpTT04gcmVzcG9uc2UnKTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCd0aW1lb3V0JywgcmVqZWN0KTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignYWJvcnQnLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnX2hhbmRsZUVycm9yOicsIHJlYXNvbiwgdGhpcy5feGhyLnN0YXR1cyk7XG4gICAgICAgIGxldCBjb2RlID0gNDA0O1xuICAgICAgICBpZiAocmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgIGNvZGUgPSA0MDg7XG4gICAgICAgIH0gZWxzZSBpZiAocmVhc29uID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICBjb2RlID0gNDA4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlamVjdCh7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvbixcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzIHx8IHRoaXMuX3hoci5zdGF0dXMgfHwgY29kZSxcbiAgICAgICAgICAgIGNvZGU6IHN0YXR1cyB8fCB0aGlzLl94aHIuc3RhdHVzIHx8IGNvZGUsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiBzdGF0dXNUZXh0IHx8IHRoaXMuX3hoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgeGhyOiB0aGlzLl94aHJcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9oYW5kbGVXaW5kb3dVbmxvYWQoKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2hhbmRsZVdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgIH07XG5cblxuICAgIHByaXZhdGUgdHJpbShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0FycmF5KGFyZykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGZvckVhY2gobGlzdCwgaXRlcmF0b3IpIHtcbiAgICAgICAgaWYgKHRvU3RyaW5nLmNhbGwobGlzdCkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoU3RyaW5nKGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoT2JqZWN0KGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycmF5Lmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZvckVhY2hTdHJpbmcoc3RyaW5nLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gc3RyaW5nLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqZWN0W2tdLCBrLCBvYmplY3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9wYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICAgICAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaChcbiAgICAgICAgICAgIHRoaXMudHJpbShoZWFkZXJzKS5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgICwgKHJvdykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcm93LmluZGV4T2YoJzonKVxuICAgICAgICAgICAgICAgICAgICAsIGtleSA9IHRoaXMudHJpbShyb3cuc2xpY2UoMCwgaW5kZXgpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICwgdmFsdWUgPSB0aGlzLnRyaW0ocm93LnNsaWNlKGluZGV4ICsgMSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihyZXN1bHRba2V5XSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IFtyZXN1bHRba2V5XSwgdmFsdWVdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG5cbn1cbiJdfQ==