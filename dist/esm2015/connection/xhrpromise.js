/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
export class XHRPromise {
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
if (false) {
    /** @type {?} */
    XHRPromise.prototype.DEFAULT_CONTENT_TYPE;
    /** @type {?} */
    XHRPromise.prototype._xhr;
    /** @type {?} */
    XHRPromise.prototype._unloadHandler;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhycHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJjb25uZWN0aW9uL3hocnByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE1BQU07SUFNRjtvQ0FKOEIsa0RBQWtEO0tBSy9FO0lBQUEsQ0FBQzs7Ozs7SUFRRixJQUFJLENBQUMsT0FBTzs7UUFDUixJQUFJLFFBQVEsQ0FBQztRQUNiLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNqQixPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ2hCO1FBQ0QsUUFBUSxHQUFHO1lBQ1AsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxFQUFFO1lBQ1gsS0FBSyxFQUFFLElBQUk7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLFFBQVEsRUFBRSxJQUFJO1lBQ2QsZUFBZSxFQUFFLEtBQUs7U0FDekIsQ0FBQztRQUNGLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFFLENBQUMsS0FBaUIsRUFBRSxFQUFFO1lBQ3ZDLE9BQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7O2dCQUN4QixJQUFJLENBQUMsQ0FBMEI7O2dCQUEvQixJQUFPLE1BQU0sQ0FBa0I7O2dCQUEvQixJQUFlLEdBQUcsQ0FBYTs7Z0JBQS9CLElBQW9CLEtBQUssQ0FBTTs7Z0JBQS9CLElBQTJCLEdBQUcsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDakIsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO29CQUN2RixPQUFPO2lCQUNWO2dCQUNELElBQUksT0FBTyxPQUFPLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLENB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LENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUMsSUFBSSxPQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO2FBQ3RCO2lCQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUMxQjtpQkFBTTtnQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7YUFDckM7U0FDSixDQUNKLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQzs7Q0FJckIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgWEhSUHJvbWlzZSB7XG5cbiAgICBwdWJsaWMgREVGQVVMVF9DT05URU5UX1RZUEUgPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcbiAgICBwcml2YXRlIF94aHI7XG4gICAgcHJpdmF0ZSBfdW5sb2FkSGFuZGxlcjogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5zZW5kKG9wdGlvbnMpIC0+IFByb21pc2VcbiAgICAgKiAtIG9wdGlvbnMgKE9iamVjdCk6IFVSTCwgbWV0aG9kLCBkYXRhLCBldGMuXG4gICAgICpcbiAgICAgKiBDcmVhdGUgdGhlIFhIUiBvYmplY3QgYW5kIHdpcmUgdXAgZXZlbnQgaGFuZGxlcnMgdG8gdXNlIGEgcHJvbWlzZS5cbiAgICAgKi9cbiAgICBzZW5kKG9wdGlvbnMpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgZGVmYXVsdHM7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIChfdGhpczogWEhSUHJvbWlzZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGUsIGhlYWRlciwgcmVmLCB2YWx1ZSwgeGhyO1xuICAgICAgICAgICAgICAgIGlmICghWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCdicm93c2VyJywgcmVqZWN0LCBudWxsLCAnYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy51cmwgIT09ICdzdHJpbmcnIHx8IG9wdGlvbnMudXJsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXJyb3IoJ3VybCcsIHJlamVjdCwgbnVsbCwgJ1VSTCBpcyBhIHJlcXVpcmVkIHBhcmFtZXRlcicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLl94aHIgPSB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICAoKSAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGV0YWNoV2luZG93VW5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVRleHQgPSBfdGhpcy5fZ2V0UmVzcG9uc2VUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2hhbmRsZUVycm9yKCdwYXJzZScsIHJlamVjdCwgbnVsbCwgJ2ludmFsaWQgSlNPTiByZXNwb25zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogX3RoaXMuX2dldFJlc3BvbnNlVXJsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlVGV4dDogcmVzcG9uc2VUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogX3RoaXMuX2dldEhlYWRlcnMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhocjogeGhyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub250aW1lb3V0ID0gICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcigndGltZW91dCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIub25hYm9ydCA9ICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Fib3J0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIF90aGlzLl9hdHRhY2hXaW5kb3dVbmxvYWQoKTtcbiAgICAgICAgICAgICAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIG9wdGlvbnMuYXN5bmMsIG9wdGlvbnMudXNlcm5hbWUsIG9wdGlvbnMucGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLndpdGhDcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChvcHRpb25zLmRhdGEgIT0gbnVsbCkgJiYgIW9wdGlvbnMuaGVhZGVyc1snQ29udGVudC1UeXBlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IF90aGlzLkRFRkFVTFRfQ09OVEVOVF9UWVBFO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWYgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICAgICAgICAgICAgZm9yIChoZWFkZXIgaW4gcmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWYuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZWZbaGVhZGVyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4aHIuc2VuZChvcHRpb25zLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuZ2V0WEhSKCkgLT4gWE1MSHR0cFJlcXVlc3RcbiAgICAgKi9cbiAgICBnZXRYSFIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94aHI7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9hdHRhY2hXaW5kb3dVbmxvYWQoKVxuICAgICAqXG4gICAgICogRml4IGZvciBJRSA5IGFuZCBJRSAxMFxuICAgICAqIEludGVybmV0IEV4cGxvcmVyIGZyZWV6ZXMgd2hlbiB5b3UgY2xvc2UgYSB3ZWJwYWdlIGR1cmluZyBhbiBYSFIgcmVxdWVzdFxuICAgICAqIGh0dHBzOi8vc3VwcG9ydC5taWNyb3NvZnQuY29tL2tiLzI4NTY3NDZcbiAgICAgKlxuICAgICAqL1xuICAgIHByaXZhdGUgX2F0dGFjaFdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdW5sb2FkSGFuZGxlciA9IHRoaXMuX2hhbmRsZVdpbmRvd1VubG9hZC5iaW5kKHRoaXMpO1xuICAgICAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmF0dGFjaEV2ZW50KCdvbnVubG9hZCcsIHRoaXMuX3VubG9hZEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9kZXRhY2hXaW5kb3dVbmxvYWQoKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2RldGFjaFdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5kZXRhY2hFdmVudCgnb251bmxvYWQnLCB0aGlzLl91bmxvYWRIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0SGVhZGVycygpIC0+IE9iamVjdFxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldEhlYWRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUhlYWRlcnModGhpcy5feGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICAqIFhIUlByb21pc2UuX2dldFJlc3BvbnNlVGV4dCgpIC0+IE1peGVkXG4gICAgICpcbiAgICAgKiBQYXJzZXMgcmVzcG9uc2UgdGV4dCBKU09OIGlmIHByZXNlbnQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0UmVzcG9uc2VUZXh0KCkge1xuICAgICAgICBsZXQgcmVzcG9uc2VUZXh0O1xuICAgICAgICByZXNwb25zZVRleHQgPSB0eXBlb2YgdGhpcy5feGhyLnJlc3BvbnNlVGV4dCA9PT0gJ3N0cmluZycgPyB0aGlzLl94aHIucmVzcG9uc2VUZXh0IDogJyc7XG4gICAgICAgIHN3aXRjaCAoKHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJykgfHwgJycpLnNwbGl0KCc7JylbMF0pIHtcbiAgICAgICAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL2pzb24nOlxuICAgICAgICAgICAgY2FzZSAndGV4dC9qYXZhc2NyaXB0JzpcbiAgICAgICAgICAgICAgICByZXNwb25zZVRleHQgPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dCArICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VUZXh0O1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5fZ2V0UmVzcG9uc2VVcmwoKSAtPiBTdHJpbmdcbiAgICAgKlxuICAgICAqIEFjdHVhbCByZXNwb25zZSBVUkwgYWZ0ZXIgZm9sbG93aW5nIHJlZGlyZWN0cy5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXRSZXNwb25zZVVybCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3hoci5yZXNwb25zZVVSTCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlVVJMO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXlgtUmVxdWVzdC1VUkw6L20udGVzdCh0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5feGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlcXVlc3QtVVJMJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgICogWEhSUHJvbWlzZS5faGFuZGxlRXJyb3IocmVhc29uLCByZWplY3QsIHN0YXR1cywgc3RhdHVzVGV4dClcbiAgICAgKiAtIHJlYXNvbiAoU3RyaW5nKVxuICAgICAqIC0gcmVqZWN0IChGdW5jdGlvbilcbiAgICAgKiAtIHN0YXR1cyAoU3RyaW5nKVxuICAgICAqIC0gc3RhdHVzVGV4dCAoU3RyaW5nKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2hhbmRsZUVycm9yKHJlYXNvbiwgcmVqZWN0LCBzdGF0dXM/LCBzdGF0dXNUZXh0Pykge1xuICAgICAgICB0aGlzLl9kZXRhY2hXaW5kb3dVbmxvYWQoKTtcblxuICAgICAgICAvLyBfdGhpcy5faGFuZGxlRXJyb3IoJ2Jyb3dzZXInLCByZWplY3QsIG51bGwsICdicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigndXJsJywgcmVqZWN0LCBudWxsLCAnVVJMIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigncGFyc2UnLCByZWplY3QsIG51bGwsICdpbnZhbGlkIEpTT04gcmVzcG9uc2UnKTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCd0aW1lb3V0JywgcmVqZWN0KTtcbiAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignYWJvcnQnLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdzZW5kJywgcmVqZWN0LCBudWxsLCBlLnRvU3RyaW5nKCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnX2hhbmRsZUVycm9yOicsIHJlYXNvbiwgdGhpcy5feGhyLnN0YXR1cyk7XG4gICAgICAgIGxldCBjb2RlID0gNDA0O1xuICAgICAgICBpZiAocmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgIGNvZGUgPSA0MDg7XG4gICAgICAgIH0gZWxzZSBpZiAocmVhc29uID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICBjb2RlID0gNDA4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlamVjdCh7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvbixcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzIHx8IHRoaXMuX3hoci5zdGF0dXMgfHwgY29kZSxcbiAgICAgICAgICAgIGNvZGU6IHN0YXR1cyB8fCB0aGlzLl94aHIuc3RhdHVzIHx8IGNvZGUsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiBzdGF0dXNUZXh0IHx8IHRoaXMuX3hoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgeGhyOiB0aGlzLl94aHJcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAgKiBYSFJQcm9taXNlLl9oYW5kbGVXaW5kb3dVbmxvYWQoKVxuICAgICAqL1xuICAgIHByaXZhdGUgX2hhbmRsZVdpbmRvd1VubG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgIH07XG5cblxuICAgIHByaXZhdGUgdHJpbShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0FycmF5KGFyZykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGZvckVhY2gobGlzdCwgaXRlcmF0b3IpIHtcbiAgICAgICAgaWYgKHRvU3RyaW5nLmNhbGwobGlzdCkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoU3RyaW5nKGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb3JFYWNoT2JqZWN0KGxpc3QsIGl0ZXJhdG9yLCB0aGlzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGFycmF5Lmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZvckVhY2hTdHJpbmcoc3RyaW5nLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gc3RyaW5nLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgZm9yIChjb25zdCBrIGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqZWN0W2tdLCBrLCBvYmplY3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9wYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICAgICAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaChcbiAgICAgICAgICAgIHRoaXMudHJpbShoZWFkZXJzKS5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgICwgKHJvdykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcm93LmluZGV4T2YoJzonKVxuICAgICAgICAgICAgICAgICAgICAsIGtleSA9IHRoaXMudHJpbShyb3cuc2xpY2UoMCwgaW5kZXgpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICwgdmFsdWUgPSB0aGlzLnRyaW0ocm93LnNsaWNlKGluZGV4ICsgMSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihyZXN1bHRba2V5XSkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IFtyZXN1bHRba2V5XSwgdmFsdWVdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG5cbn1cbiJdfQ==