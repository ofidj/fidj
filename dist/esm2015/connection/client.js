import { Ajax } from './ajax';
export class Client {
    constructor(appId, URI, storage, sdk) {
        this.appId = appId;
        this.URI = URI;
        this.storage = storage;
        this.sdk = sdk;
        let uuid = this.storage.get(Client._clientUuid) || 'uuid-' + Math.random();
        let info = '_clientInfo'; // this.storage.get(Client._clientInfo);
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
    setClientId(value) {
        this.clientId = '' + value;
        this.storage.set(Client._clientId, this.clientId);
    }
    setClientUuid(value) {
        this.clientUuid = '' + value;
        this.storage.set(Client._clientUuid, this.clientUuid);
    }
    setClientInfo(value) {
        this.clientInfo = '' + value;
        // this.storage.set('clientInfo', this.clientInfo);
    }
    login(login, password, updateProperties) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        const urlLogin = this.URI + '/users';
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
            const urlToken = this.URI + '/oauth/token';
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
    reAuthenticate(refreshToken) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        const url = this.URI + '/oauth/token';
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
        const url = this.URI + '/oauth/revoke';
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
    isReady() {
        return !!this.URI;
    }
}
// private refreshToken: string;
Client.refreshCountInitial = 1;
Client.refreshCount = Client.refreshCountInitial;
Client._clientUuid = 'v2.clientUuid';
Client._clientId = 'v2.clientId';
Client._refreshCount = 'v2.refreshCount';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3RyYXZpcy9idWlsZC9vZmlkai9maWRqL3NyYy8iLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24vY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFJNUIsTUFBTSxPQUFPLE1BQU07SUFZZixZQUFvQixLQUFhLEVBQ2IsR0FBVyxFQUNYLE9BQXFCLEVBQ3JCLEdBQWlCO1FBSGpCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQ1gsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixRQUFHLEdBQUgsR0FBRyxDQUFjO1FBRWpDLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25GLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLHdDQUF3QztRQUNsRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ25ELElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1NBQzFHO1FBQ0QsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDNUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FDaEM7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FB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TSxPQUFPO1FBQ1YsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUN0QixDQUFDOztBQTFKRCxnQ0FBZ0M7QUFDakIsMEJBQW1CLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLG1CQUFZLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDO0FBQzFDLGtCQUFXLEdBQUcsZUFBZSxDQUFDO0FBQzlCLGdCQUFTLEdBQUcsYUFBYSxDQUFDO0FBQzFCLG9CQUFhLEdBQUcsaUJBQWlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FqYXh9IGZyb20gJy4vYWpheCc7XG5pbXBvcnQge0xvY2FsU3RvcmFnZX0gZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0IHtTZGtJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBjbGFzcyBDbGllbnQge1xuXG4gICAgcHVibGljIGNsaWVudElkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjbGllbnRVdWlkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjbGllbnRJbmZvOiBzdHJpbmc7XG4gICAgLy8gcHJpdmF0ZSByZWZyZXNoVG9rZW46IHN0cmluZztcbiAgICBwcml2YXRlIHN0YXRpYyByZWZyZXNoQ291bnRJbml0aWFsID0gMTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWZyZXNoQ291bnQgPSBDbGllbnQucmVmcmVzaENvdW50SW5pdGlhbDtcbiAgICBwcml2YXRlIHN0YXRpYyBfY2xpZW50VXVpZCA9ICd2Mi5jbGllbnRVdWlkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfY2xpZW50SWQgPSAndjIuY2xpZW50SWQnO1xuICAgIHByaXZhdGUgc3RhdGljIF9yZWZyZXNoQ291bnQgPSAndjIucmVmcmVzaENvdW50JztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwSWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIFVSSTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc3RvcmFnZTogTG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgc2RrOiBTZGtJbnRlcmZhY2UpIHtcblxuICAgICAgICBsZXQgdXVpZDogc3RyaW5nID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudFV1aWQpIHx8ICd1dWlkLScgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBsZXQgaW5mbyA9ICdfY2xpZW50SW5mbyc7IC8vIHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRJbmZvKTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICAgICAgICAgIGluZm8gPSB3aW5kb3cubmF2aWdhdG9yLmFwcE5hbWUgKyAnQCcgKyB3aW5kb3cubmF2aWdhdG9yLmFwcFZlcnNpb24gKyAnLScgKyB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93WydkZXZpY2UnXSAmJiB3aW5kb3dbJ2RldmljZSddLnV1aWQpIHtcbiAgICAgICAgICAgIHV1aWQgPSB3aW5kb3dbJ2RldmljZSddLnV1aWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDbGllbnRVdWlkKHV1aWQpO1xuICAgICAgICB0aGlzLnNldENsaWVudEluZm8oaW5mbyk7XG4gICAgICAgIHRoaXMuY2xpZW50SWQgPSB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SWQpO1xuICAgICAgICBDbGllbnQucmVmcmVzaENvdW50ID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX3JlZnJlc2hDb3VudCkgfHwgQ2xpZW50LnJlZnJlc2hDb3VudEluaXRpYWw7XG4gICAgfTtcblxuICAgIHB1YmxpYyBzZXRDbGllbnRJZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50SWQgPSAnJyArIHZhbHVlO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fY2xpZW50SWQsIHRoaXMuY2xpZW50SWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRVdWlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRVdWlkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudFV1aWQsIHRoaXMuY2xpZW50VXVpZCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENsaWVudEluZm8odmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudEluZm8gPSAnJyArIHZhbHVlO1xuICAgICAgICAvLyB0aGlzLnN0b3JhZ2Uuc2V0KCdjbGllbnRJbmZvJywgdGhpcy5jbGllbnRJbmZvKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9naW4obG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXBkYXRlUHJvcGVydGllcz86IGFueSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybExvZ2luID0gdGhpcy5VUkkgKyAnL3VzZXJzJztcbiAgICAgICAgY29uc3QgZGF0YUxvZ2luID0ge1xuICAgICAgICAgICAgbmFtZTogbG9naW4sXG4gICAgICAgICAgICB1c2VybmFtZTogbG9naW4sXG4gICAgICAgICAgICBlbWFpbDogbG9naW4sXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsTG9naW4sXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YUxvZ2luLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGNyZWF0ZWRVc2VyID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2xpZW50SWQoY3JlYXRlZFVzZXIuX2lkKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmxUb2tlbiA9IHRoaXMuVVJJICsgJy9vYXV0aC90b2tlbic7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVRva2VuID0ge1xuICAgICAgICAgICAgICAgICAgICBncmFudF90eXBlOiAnY2xpZW50X2NyZWRlbnRpYWxzJyxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRfc2VjcmV0OiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50X2luZm86IHRoaXMuY2xpZW50SW5mbyxcbiAgICAgICAgICAgICAgICAgICAgYXVkaWVuY2U6IHRoaXMuYXBwSWQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVBdXRoZW50aWNhdGUocmVmcmVzaFRva2VuOiBzdHJpbmcpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLlVSSSArICcvb2F1dGgvdG9rZW4nO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ3JlZnJlc2hfdG9rZW4nLFxuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkayksXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICByZWZyZXNoX2V4dHJhOiBDbGllbnQucmVmcmVzaENvdW50LFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXcgQWpheCgpXG4gICAgICAgICAgICAucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigob2JqOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBDbGllbnQucmVmcmVzaENvdW50Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX3JlZnJlc2hDb3VudCwgQ2xpZW50LnJlZnJlc2hDb3VudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShvYmopO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ291dChyZWZyZXNoVG9rZW4/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50VXVpZDtcbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50SWQ7XG4gICAgICAgIC8vIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRVdWlkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX3JlZnJlc2hDb3VudCk7XG4gICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQgPSBDbGllbnQucmVmcmVzaENvdW50SW5pdGlhbDtcblxuICAgICAgICBpZiAoIXJlZnJlc2hUb2tlbiB8fCAhdGhpcy5jbGllbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL29hdXRoL3Jldm9rZSc7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5VUkk7XG4gICAgfVxufVxuIl19