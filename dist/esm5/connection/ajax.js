/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { XHRPromise } from './xhrpromise';
/**
 * @record
 */
export function XhrOptionsInterface() { }
/** @type {?} */
XhrOptionsInterface.prototype.url;
/** @type {?|undefined} */
XhrOptionsInterface.prototype.data;
/** @type {?|undefined} */
XhrOptionsInterface.prototype.headers;
/** @type {?|undefined} */
XhrOptionsInterface.prototype.async;
/** @type {?|undefined} */
XhrOptionsInterface.prototype.username;
/** @type {?|undefined} */
XhrOptionsInterface.prototype.password;
/** @type {?|undefined} */
XhrOptionsInterface.prototype.withCredentials;
var Ajax = /** @class */ (function () {
    function Ajax() {
        this.xhr = new XHRPromise();
    }
    ;
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
export { Ajax };
if (false) {
    /** @type {?} */
    Ajax.prototype.xhr;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWpheC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJjb25uZWN0aW9uL2FqYXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZeEMsSUFBQTtJQUtJO1FBQ0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0tBQy9CO0lBQUEsQ0FBQzs7Ozs7SUFFSyxtQkFBSTs7OztjQUFDLElBQXlCOztRQUVqQyxJQUFNLEdBQUcsR0FBUTtZQUNiLE1BQU0sRUFBRSxNQUFNO1lBQ2QsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQyxDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzlCO1FBRUQsT0FBTyxJQUFJLENBQUMsR0FBRzthQUNWLElBQUksQ0FBQyxHQUFHLENBQUM7YUFDVCxJQUFJLENBQUMsVUFBQSxHQUFHO1lBQ0wsSUFBSSxHQUFHLENBQUMsTUFBTTtnQkFDVixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtnQkFDckUsR0FBRyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM5QjtZQUNELE9BQU8sT0FB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TSxFQUFFLEtBQUs7WUFDYixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7U0FDaEIsQ0FBQztRQUNGLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN4QjtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM5QjtRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUc7YUFDVixJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ1QsSUFBSSxDQUFDLFVBQUEsR0FBRztZQUNMLElBQUksR0FBRyxDQUFDLE1BQU07Z0JBQ1YsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7Z0JBQ3JFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO2dCQUN0QixHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUI7WUFDRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzVDLENBQUM7YUFDRCxLQUFLLENBQUMsVUFBQSxHQUFHOzs7Ozs7WUFNTixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDOUIsQ0FBQyxDQUFDOztlQXZKZjtJQXlKQyxDQUFBO0FBN0lELGdCQTZJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7WEhSUHJvbWlzZX0gZnJvbSAnLi94aHJwcm9taXNlJztcblxuZXhwb3J0IGludGVyZmFjZSBYaHJPcHRpb25zSW50ZXJmYWNlIHtcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhPzogYW55LFxuICAgIGhlYWRlcnM/OiBhbnksXG4gICAgYXN5bmM/OiBib29sZWFuLFxuICAgIHVzZXJuYW1lPzogc3RyaW5nLFxuICAgIHBhc3N3b3JkPzogc3RyaW5nLFxuICAgIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGNsYXNzIEFqYXgge1xuXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgeGhyOiBYSFJQcm9taXNlID0gbmV3IFhIUlByb21pc2UoKTtcbiAgICBwcml2YXRlIHhocjogWEhSUHJvbWlzZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnhociA9IG5ldyBYSFJQcm9taXNlKCk7XG4gICAgfTtcblxuICAgIHB1YmxpYyBwb3N0KGFyZ3M6IFhock9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuXG4gICAgICAgIGNvbnN0IG9wdDogYW55ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoYXJncy5kYXRhKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBvcHQuaGVhZGVycyA9IGFyZ3MuaGVhZGVycztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLnNlbmQob3B0KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZWFzb24gPSAnc3RhdHVzJztcbiAgICAgICAgICAgICAgICAgICAgcmVzLmNvZGUgPSBwYXJzZUludChyZXMuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCdicm93c2VyJywgcmVqZWN0LCBudWxsLCAnYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcigndXJsJywgcmVqZWN0LCBudWxsLCAnVVJMIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCdwYXJzZScsIHJlamVjdCwgbnVsbCwgJ2ludmFsaWQgSlNPTiByZXNwb25zZScpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCd0aW1lb3V0JywgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdhYm9ydCcsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF90aGlzLl9oYW5kbGVFcnJvcignc2VuZCcsIHJlamVjdCwgbnVsbCwgZS50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIChlcnIucmVhc29uID09PSAndGltZW91dCcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHB1dChhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybCxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyZ3MuZGF0YSlcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgb3B0LmhlYWRlcnMgPSBhcmdzLmhlYWRlcnM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMueGhyXG4gICAgICAgICAgICAuc2VuZChvcHQpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPCAyMDAgfHwgcGFyc2VJbnQocmVzLnN0YXR1cywgMTApID49IDMwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlYXNvbiA9ICdzdGF0dXMnO1xuICAgICAgICAgICAgICAgICAgICByZXMuY29kZSA9IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKGVyci5yZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwODtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVsZXRlKGFyZ3M6IFhock9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoYXJncy5kYXRhKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBvcHQuaGVhZGVycyA9IGFyZ3MuaGVhZGVycztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucmVhc29uID0gJ3N0YXR1cyc7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jb2RlID0gcGFyc2VJbnQocmVzLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoZXJyLnJlYXNvbiA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA4O1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGVyci5jb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdDogYW55ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3MuZGF0YSkge1xuICAgICAgICAgICAgb3B0LmRhdGEgPSBhcmdzLmRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgb3B0LmhlYWRlcnMgPSBhcmdzLmhlYWRlcnM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMueGhyXG4gICAgICAgICAgICAuc2VuZChvcHQpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPCAyMDAgfHwgcGFyc2VJbnQocmVzLnN0YXR1cywgMTApID49IDMwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlYXNvbiA9ICdzdGF0dXMnO1xuICAgICAgICAgICAgICAgICAgICByZXMuY29kZSA9IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKGVyci5yZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwODtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=