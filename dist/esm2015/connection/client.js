/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Ajax } from './ajax';
export class Client {
    /**
     * @param {?} appId
     * @param {?} URI
     * @param {?} storage
     * @param {?} sdk
     */
    constructor(appId, URI, storage, sdk) {
        this.appId = appId;
        this.URI = URI;
        this.storage = storage;
        this.sdk = sdk;
        /** @type {?} */
        let uuid = this.storage.get(Client._clientUuid) || 'uuid-' + Math.random();
        /** @type {?} */
        let info = '_clientInfo'; // this.storage.get(Client._clientInfo);
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
    setClientId(value) {
        this.clientId = '' + value;
        this.storage.set(Client._clientId, this.clientId);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setClientUuid(value) {
        this.clientUuid = '' + value;
        this.storage.set(Client._clientUuid, this.clientUuid);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setClientInfo(value) {
        this.clientInfo = '' + value;
        // this.storage.set('clientInfo', this.clientInfo);
    }
    /**
     * @param {?} login
     * @param {?} password
     * @param {?=} updateProperties
     * @return {?}
     */
    login(login, password, updateProperties) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        /** @type {?} */
        const urlLogin = this.URI + '/users';
        /** @type {?} */
        const dataLogin = {
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
            .then(createdUser => {
            this.setClientId(createdUser._id);
            /** @type {?} */
            const urlToken = this.URI + '/oauth/token';
            /** @type {?} */
            const dataToken = {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: password,
                client_udid: this.clientUuid,
                client_info: this.clientInfo,
                audience: this.appId,
                scope: JSON.stringify(this.sdk)
            };
            return new Ajax()
                .post({
                url: urlToken,
                data: dataToken,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
        });
    }
    /**
     * @param {?} refreshToken
     * @return {?}
     */
    reAuthenticate(refreshToken) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        /** @type {?} */
        const url = this.URI + '/oauth/token';
        /** @type {?} */
        const data = {
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
            .then((obj) => {
            Client.refreshCount++;
            this.storage.set(Client._refreshCount, Client.refreshCount);
            return Promise.resolve(obj);
        });
    }
    /**
     * @param {?=} refreshToken
     * @return {?}
     */
    logout(refreshToken) {
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
        const url = this.URI + '/oauth/revoke';
        /** @type {?} */
        const data = {
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
    }
    /**
     * @return {?}
     */
    isReady() {
        return !!this.URI;
    }
}
Client.refreshCountInitial = 1;
Client.refreshCount = Client.refreshCountInitial;
Client._clientUuid = 'v2.clientUuid';
Client._clientId = 'v2.clientId';
Client._refreshCount = 'v2.refreshCount';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24vY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBSTVCLE1BQU07Ozs7Ozs7SUFZRixZQUFvQixLQUFhLEVBQ2IsS0FDQSxTQUNBO1FBSEEsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLFFBQUcsR0FBSCxHQUFHO1FBQ0gsWUFBTyxHQUFQLE9BQU87UUFDUCxRQUFHLEdBQUgsR0FBRzs7UUFFbkIsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O1FBQ25GLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQztRQUN6QixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQzVCLElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1NBQzFHO1FBQ0QsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDckQsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FDaEM7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxD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TG9jYWxTdG9yYWdlfSBmcm9tICcuLi90b29scyc7XG5pbXBvcnQge1Nka0ludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2V9IGZyb20gJy4uL3Nkay9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIENsaWVudCB7XG5cbiAgICBwdWJsaWMgY2xpZW50SWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudFV1aWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudEluZm86IHN0cmluZztcbiAgICAvLyBwcml2YXRlIHJlZnJlc2hUb2tlbjogc3RyaW5nO1xuICAgIHByaXZhdGUgc3RhdGljIHJlZnJlc2hDb3VudEluaXRpYWwgPSAxO1xuICAgIHByaXZhdGUgc3RhdGljIHJlZnJlc2hDb3VudCA9IENsaWVudC5yZWZyZXNoQ291bnRJbml0aWFsO1xuICAgIHByaXZhdGUgc3RhdGljIF9jbGllbnRVdWlkID0gJ3YyLmNsaWVudFV1aWQnO1xuICAgIHByaXZhdGUgc3RhdGljIF9jbGllbnRJZCA9ICd2Mi5jbGllbnRJZCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3JlZnJlc2hDb3VudCA9ICd2Mi5yZWZyZXNoQ291bnQnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHBJZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgVVJJOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzdG9yYWdlOiBMb2NhbFN0b3JhZ2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzZGs6IFNka0ludGVyZmFjZSkge1xuXG4gICAgICAgIGxldCB1dWlkOiBzdHJpbmcgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50VXVpZCkgfHwgJ3V1aWQtJyArIE1hdGgucmFuZG9tKCk7XG4gICAgICAgIGxldCBpbmZvID0gJ19jbGllbnRJbmZvJzsgLy8gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudEluZm8pO1xuICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICAgICAgICAgIGluZm8gPSB3aW5kb3cubmF2aWdhdG9yLmFwcE5hbWUgKyAnQCcgKyB3aW5kb3cubmF2aWdhdG9yLmFwcFZlcnNpb24gKyAnLScgKyB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93ICYmIHdpbmRvd1snZGV2aWNlJ10gJiYgd2luZG93WydkZXZpY2UnXS51dWlkKSB7XG4gICAgICAgICAgICB1dWlkID0gd2luZG93WydkZXZpY2UnXS51dWlkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q2xpZW50VXVpZCh1dWlkKTtcbiAgICAgICAgdGhpcy5zZXRDbGllbnRJbmZvKGluZm8pO1xuICAgICAgICB0aGlzLmNsaWVudElkID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9yZWZyZXNoQ291bnQpIHx8IENsaWVudC5yZWZyZXNoQ291bnRJbml0aWFsO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50SWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudElkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudElkLCB0aGlzLmNsaWVudElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50VXVpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50VXVpZCA9ICcnICsgdmFsdWU7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9jbGllbnRVdWlkLCB0aGlzLmNsaWVudFV1aWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRJbmZvKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRJbmZvID0gJycgKyB2YWx1ZTtcbiAgICAgICAgLy8gdGhpcy5zdG9yYWdlLnNldCgnY2xpZW50SW5mbycsIHRoaXMuY2xpZW50SW5mbyk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmxMb2dpbiA9IHRoaXMuVVJJICsgJy91c2Vycyc7XG4gICAgICAgIGNvbnN0IGRhdGFMb2dpbiA9IHtcbiAgICAgICAgICAgIG5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgdXNlcm5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgZW1haWw6IGxvZ2luLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybExvZ2luLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFMb2dpbixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihjcmVhdGVkVXNlciA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldENsaWVudElkKGNyZWF0ZWRVc2VyLl9pZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsVG9rZW4gPSB0aGlzLlVSSSArICcvb2F1dGgvdG9rZW4nO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFUb2tlbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ2NsaWVudF9jcmVkZW50aWFscycsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X3NlY3JldDogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICAgICAgICAgIGF1ZGllbmNlOiB0aGlzLmFwcElkLFxuICAgICAgICAgICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybFRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlQXV0aGVudGljYXRlKHJlZnJlc2hUb2tlbjogc3RyaW5nKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL29hdXRoL3Rva2VuJztcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIGdyYW50X3R5cGU6ICdyZWZyZXNoX3Rva2VuJyxcbiAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspLFxuICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgcmVmcmVzaF9leHRyYTogQ2xpZW50LnJlZnJlc2hDb3VudCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKG9iajogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9yZWZyZXNoQ291bnQsIENsaWVudC5yZWZyZXNoQ291bnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUob2JqKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2dvdXQocmVmcmVzaFRva2VuPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlbGV0ZSB0aGlzLmNsaWVudFV1aWQ7XG4gICAgICAgIC8vIGRlbGV0ZSB0aGlzLmNsaWVudElkO1xuICAgICAgICAvLyB0aGlzLnN0b3JhZ2UucmVtb3ZlKENsaWVudC5fY2xpZW50VXVpZCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRJZCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9yZWZyZXNoQ291bnQpO1xuICAgICAgICBDbGllbnQucmVmcmVzaENvdW50ID0gQ2xpZW50LnJlZnJlc2hDb3VudEluaXRpYWw7XG5cbiAgICAgICAgaWYgKCFyZWZyZXNoVG9rZW4gfHwgIXRoaXMuY2xpZW50SWQpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuVVJJICsgJy9vYXV0aC9yZXZva2UnO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgdG9rZW46IHJlZnJlc2hUb2tlbixcbiAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgIGNsaWVudF91ZGlkOiB0aGlzLmNsaWVudFV1aWQsXG4gICAgICAgICAgICBjbGllbnRfaW5mbzogdGhpcy5jbGllbnRJbmZvLFxuICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICBzY29wZTogSlNPTi5zdHJpbmdpZnkodGhpcy5zZGspXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuVVJJO1xuICAgIH1cbn1cbiJdfQ==