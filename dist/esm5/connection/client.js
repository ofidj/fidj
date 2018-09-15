/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Ajax } from './ajax';
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
    ;
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
export { Client };
if (false) {
    /** @type {?} */
    Client.refreshCount;
    /** @type {?} */
    Client._clientUuid;
    /** @type {?} */
    Client._clientId;
    /** @type {?} */
    Client._refreshCount;
    /** @type {?} */
    Client.prototype.clientId;
    /** @type {?} */
    Client.prototype.clientUuid;
    /** @type {?} */
    Client.prototype.clientInfo;
    /** @type {?} */
    Client.prototype.refreshToken;
    /** @type {?} */
    Client.prototype.appId;
    /** @type {?} */
    Client.prototype.URI;
    /** @type {?} */
    Client.prototype.storage;
    /** @type {?} */
    Client.prototype.sdk;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24vY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDOztJQWV4QixnQkFBb0IsS0FBYSxFQUNiLEtBQ0EsU0FDQTtRQUhBLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixRQUFHLEdBQUgsR0FBRztRQUNILFlBQU8sR0FBUCxPQUFPO1FBQ1AsUUFBRyxHQUFILEdBQUc7O1FBRW5CLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztRQUNuRixJQUFJLElBQUksR0FBRyxhQUFhLENBQUM7UUFDekIsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUM1QixJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztTQUMxRztRQUNELElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQ3JELElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25E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QUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pDLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzVCOztRQUVELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsZUFBZSxDQUFDOztRQUN2QyxJQUFNLElBQUksR0FBRztZQUNULEtBQUssRUFBRSxZQUFZO1lBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN4QixXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDNUIsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzVCLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSztZQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQ2xDLENBQUM7UUFFRixPQUFPLElBQUksSUFBSSxFQUFFO2FBQ1osSUFBSSxDQUFDO1lBQ0YsR0FBRyxFQUFFLEdBQUc7WUFDUixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUM7U0FDOUUsQ0FBQyxDQUFDOzs7OztJQUdKLHdCQUFPOzs7O1FBQ1YsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7MEJBdkpRLENBQUM7eUJBQ0YsZUFBZTt1QkFDakIsYUFBYTsyQkFDVCxpQkFBaUI7aUJBYnBEOztTQUlhLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FqYXh9IGZyb20gJy4vYWpheCc7XG5pbXBvcnQge0xvY2FsU3RvcmFnZX0gZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0IHtTZGtJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBDbGllbnQge1xuXG4gICAgcHVibGljIGNsaWVudElkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjbGllbnRVdWlkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjbGllbnRJbmZvOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByZWZyZXNoVG9rZW46IHN0cmluZztcbiAgICBwcml2YXRlIHN0YXRpYyByZWZyZXNoQ291bnQgPSAwO1xuICAgIHByaXZhdGUgc3RhdGljIF9jbGllbnRVdWlkID0gJ3YyLmNsaWVudFV1aWQnO1xuICAgIHByaXZhdGUgc3RhdGljIF9jbGllbnRJZCA9ICd2Mi5jbGllbnRJZCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3JlZnJlc2hDb3VudCA9ICd2Mi5yZWZyZXNoQ291bnQnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHBJZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgVVJJOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzdG9yYWdlOiBMb2NhbFN0b3JhZ2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzZGs6IFNka0ludGVyZmFjZSkge1xuXG4gICAgICAgIGxldCB1dWlkOiBzdHJpbmcgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50VXVpZCkgfHwgJ3V1aWQtJyArIE1hdGgucmFuZG9tKCk7XG4gICAgICAgIGxldCBpbmZvID0gJ19jbGllbnRJbmZvJzsgLy8gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudEluZm8pO1xuICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICAgICAgICAgIGluZm8gPSB3aW5kb3cubmF2aWdhdG9yLmFwcE5hbWUgKyAnQCcgKyB3aW5kb3cubmF2aWdhdG9yLmFwcFZlcnNpb24gKyAnLScgKyB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvd1snZGV2aWNlJ10gJiYgd2luZG93WydkZXZpY2UnXS51dWlkKSB7XG4gICAgICAgICAgICB1dWlkID0gd2luZG93WydkZXZpY2UnXS51dWlkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q2xpZW50VXVpZCh1dWlkKTtcbiAgICAgICAgdGhpcy5zZXRDbGllbnRJbmZvKGluZm8pO1xuICAgICAgICB0aGlzLmNsaWVudElkID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9yZWZyZXNoQ291bnQpIHx8IDA7XG4gICAgfTtcblxuICAgIHB1YmxpYyBzZXRDbGllbnRJZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50SWQgPSAnJyArIHZhbHVlO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fY2xpZW50SWQsIHRoaXMuY2xpZW50SWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRVdWlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRVdWlkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudFV1aWQsIHRoaXMuY2xpZW50VXVpZCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENsaWVudEluZm8odmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudEluZm8gPSAnJyArIHZhbHVlO1xuICAgICAgICAvLyB0aGlzLnN0b3JhZ2Uuc2V0KCdjbGllbnRJbmZvJywgdGhpcy5jbGllbnRJbmZvKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9naW4obG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXBkYXRlUHJvcGVydGllcz86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybExvZ2luID0gdGhpcy5VUkkgKyAnL3VzZXJzJztcbiAgICAgICAgY29uc3QgZGF0YUxvZ2luID0ge1xuICAgICAgICAgICAgbmFtZTogbG9naW4sXG4gICAgICAgICAgICB1c2VybmFtZTogbG9naW4sXG4gICAgICAgICAgICBlbWFpbDogbG9naW4sXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsTG9naW4sXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YUxvZ2luLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGNyZWF0ZWRVc2VyID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2xpZW50SWQoY3JlYXRlZFVzZXIuX2lkKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmxUb2tlbiA9IHRoaXMuVVJJICsgJy9vYXV0aC90b2tlbic7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVRva2VuID0ge1xuICAgICAgICAgICAgICAgICAgICBncmFudF90eXBlOiAnY2xpZW50X2NyZWRlbnRpYWxzJyxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfc2VjcmV0OiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X2luZm86IHRoaXMuY2xpZW50SW5mbyxcbiAgICAgICAgICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVBdXRoZW50aWNhdGUocmVmcmVzaFRva2VuOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlVSSSArICcvb2F1dGgvdG9rZW4nO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ3JlZnJlc2hfdG9rZW4nLFxuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkayksXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICByZWZyZXNoX2V4dHJhOiBDbGllbnQucmVmcmVzaENvdW50LFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigob2JqOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBDbGllbnQucmVmcmVzaENvdW50Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX3JlZnJlc2hDb3VudCwgQ2xpZW50LnJlZnJlc2hDb3VudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShvYmopO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ291dChyZWZyZXNoVG9rZW4/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50VXVpZDtcbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50SWQ7XG4gICAgICAgIC8vIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRVdWlkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX3JlZnJlc2hDb3VudCk7XG4gICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQgPSAwO1xuXG4gICAgICAgIGlmICghcmVmcmVzaFRva2VuIHx8ICF0aGlzLmNsaWVudElkKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlVSSSArICcvb2F1dGgvcmV2b2tlJztcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICBjbGllbnRfdWRpZDogdGhpcy5jbGllbnRVdWlkLFxuICAgICAgICAgICAgY2xpZW50X2luZm86IHRoaXMuY2xpZW50SW5mbyxcbiAgICAgICAgICAgIGF1ZGllbmNlOiB0aGlzLmFwcElkLFxuICAgICAgICAgICAgc2NvcGU6IEpTT04uc3RyaW5naWZ5KHRoaXMuc2RrKVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLlVSSTtcbiAgICB9XG59XG4iXX0=