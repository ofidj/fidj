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
        Client.refreshCount = this.storage.get(Client._refreshCount) || Client.refreshCountInitial;
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
        Client.refreshCount = Client.refreshCountInitial;
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
    Client.refreshCountInitial = 1;
    Client.refreshCount = Client.refreshCountInitial;
    Client._clientUuid = 'v2.clientUuid';
    Client._clientId = 'v2.clientId';
    Client._refreshCount = 'v2.refreshCount';
    return Client;
}());
export { Client };
if (false) {
    /** @type {?} */
    Client.refreshCountInitial;
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
    Client.prototype.appId;
    /** @type {?} */
    Client.prototype.URI;
    /** @type {?} */
    Client.prototype.storage;
    /** @type {?} */
    Client.prototype.sdk;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24vY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDOztJQWdCeEIsZ0JBQW9CLEtBQWEsRUFDYixLQUNBLFNBQ0E7UUFIQSxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsUUFBRyxHQUFILEdBQUc7UUFDSCxZQUFPLEdBQVAsT0FBTztRQUNQLFFBQUcsR0FBSCxHQUFHOztRQUVuQixJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7UUFDbkYsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDO1FBQ3pCLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7U0FDMUc7UUFDRCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNyRCxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUNoQztRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNu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ICcuL2FqYXgnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2V9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7U2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcblxuICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50VXVpZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50SW5mbzogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50SW5pdGlhbCA9IDE7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50ID0gQ2xpZW50LnJlZnJlc2hDb3VudEluaXRpYWw7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudFV1aWQgPSAndjIuY2xpZW50VXVpZCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudElkID0gJ3YyLmNsaWVudElkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVmcmVzaENvdW50ID0gJ3YyLnJlZnJlc2hDb3VudCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcElkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBVUkk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHN0b3JhZ2U6IExvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlKSB7XG5cbiAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRVdWlkKSB8fCAndXVpZC0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IGluZm8gPSAnX2NsaWVudEluZm8nOyAvLyB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SW5mbyk7XG4gICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93Lm5hdmlnYXRvcikge1xuICAgICAgICAgICAgaW5mbyA9IHdpbmRvdy5uYXZpZ2F0b3IuYXBwTmFtZSArICdAJyArIHdpbmRvdy5uYXZpZ2F0b3IuYXBwVmVyc2lvbiArICctJyArIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93WydkZXZpY2UnXSAmJiB3aW5kb3dbJ2RldmljZSddLnV1aWQpIHtcbiAgICAgICAgICAgIHV1aWQgPSB3aW5kb3dbJ2RldmljZSddLnV1aWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDbGllbnRVdWlkKHV1aWQpO1xuICAgICAgICB0aGlzLnNldENsaWVudEluZm8oaW5mbyk7XG4gICAgICAgIHRoaXMuY2xpZW50SWQgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SWQpO1xuICAgICAgICBDbGllbnQucmVmcmVzaENvdW50ID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX3JlZnJlc2hDb3VudCkgfHwgQ2xpZW50LnJlZnJlc2hDb3VudEluaXRpYWw7XG4gICAgfTtcblxuICAgIHB1YmxpYyBzZXRDbGllbnRJZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50SWQgPSAnJyArIHZhbHVlO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fY2xpZW50SWQsIHRoaXMuY2xpZW50SWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRVdWlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRVdWlkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudFV1aWQsIHRoaXMuY2xpZW50VXVpZCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENsaWVudEluZm8odmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudEluZm8gPSAnJyArIHZhbHVlO1xuICAgICAgICAvLyB0aGlzLnN0b3JhZ2Uuc2V0KCdjbGllbnRJbmZvJywgdGhpcy5jbGllbnRJbmZvKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9naW4obG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXBkYXRlUHJvcGVydGllcz86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybExvZ2luID0gdGhpcy5VUkkgKyAnL3VzZXJzJztcbiAgICAgICAgY29uc3QgZGF0YUxvZ2luID0ge1xuICAgICAgICAgICAgbmFtZTogbG9naW4sXG4gICAgICAgICAgICB1c2VybmFtZTogbG9naW4sXG4gICAgICAgICAgICBlbWFpbDogbG9naW4sXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsTG9naW4sXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YUxvZ2luLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGNyZWF0ZWRVc2VyID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2xpZW50SWQoY3JlYXRlZFVzZXIuX2lkKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmxUb2tlbiA9IHRoaXMuVVJJICsgJy9vYXV0aC90b2tlbic7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVRva2VuID0ge1xuICAgICAgICAgICAgICAgICAgICBncmFudF90eXBlOiAnY2xpZW50X2NyZWRlbnRpYWxzJyxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfc2VjcmV0OiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X2luZm86IHRoaXMuY2xpZW50SW5mbyxcbiAgICAgICAgICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVBdXRoZW50aWNhdGUocmVmcmVzaFRva2VuOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlVSSSArICcvb2F1dGgvdG9rZW4nO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ3JlZnJlc2hfdG9rZW4nLFxuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkayksXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICByZWZyZXNoX2V4dHJhOiBDbGllbnQucmVmcmVzaENvdW50LFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigob2JqOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBDbGllbnQucmVmcmVzaENvdW50Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX3JlZnJlc2hDb3VudCwgQ2xpZW50LnJlZnJlc2hDb3VudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShvYmopO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ291dChyZWZyZXNoVG9rZW4/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50VXVpZDtcbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50SWQ7XG4gICAgICAgIC8vIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRVdWlkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX3JlZnJlc2hDb3VudCk7XG4gICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQgPSBDbGllbnQucmVmcmVzaENvdW50SW5pdGlhbDtcblxuICAgICAgICBpZiAoIXJlZnJlc2hUb2tlbiB8fCAhdGhpcy5jbGllbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL29hdXRoL3Jldm9rZSc7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5VUkk7XG4gICAgfVxufVxuIl19