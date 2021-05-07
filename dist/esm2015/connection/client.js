import { __awaiter } from "tslib";
import { Ajax } from './ajax';
import * as tools from '../tools';
import { ClientTokens } from './interfaces';
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
        return __awaiter(this, void 0, void 0, function* () {
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
            const createdUser = (yield new Ajax().post({
                url: urlLogin,
                data: dataLogin,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })).user;
            this.setClientId(login); // login or createdUser.id or createdUser._id
            const urlToken = this.URI + '/apps/' + this.appId + '/tokens';
            const dataToken = {
                grant_type: 'access_token',
                // grant_type: 'client_credentials',
                // client_id: this.clientId,
                // client_secret: password,
                client_udid: this.clientUuid,
                client_info: this.clientInfo,
                // audience: this.appId,
                scope: JSON.stringify(this.sdk)
            };
            const createdAccessToken = (yield new Ajax().post({
                url: urlToken,
                data: dataToken,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Basic ' + tools.Base64.encode('' + login + ':' + password)
                }
            })).token;
            dataToken.grant_type = 'id_token';
            const createdIdToken = (yield new Ajax().post({
                url: urlToken,
                data: dataToken,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Bearer ' + createdAccessToken.data
                }
            })).token;
            dataToken.grant_type = 'refresh_token';
            const createdRefreshToken = (yield new Ajax().post({
                url: urlToken,
                data: dataToken,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Bearer ' + createdAccessToken.data
                }
            })).token;
            return new ClientTokens(login, createdAccessToken, createdIdToken, createdRefreshToken);
        });
    }
    reAuthenticate(refreshToken) {
        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({ code: 408, reason: 'no-api-uri' });
        }
        const url = this.URI + '/me/tokens';
        const data = {
            grant_type: 'refresh_token',
            // client_id: this.clientId,
            client_udid: this.clientUuid,
            client_info: this.clientInfo,
            // audience: this.appId,
            scope: JSON.stringify(this.sdk),
            // refresh_token: refreshToken,
            refreshCount: Client.refreshCount,
        };
        return new Ajax()
            .post({
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json', 'Accept': 'application/json',
                'Authorization': 'Bearer ' + refreshToken
            }
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
        const url = this.URI + '/me/tokens';
        const data = {
            token: refreshToken,
            // client_id: this.clientId,
            client_udid: this.clientUuid,
            client_info: this.clientInfo,
            // audience: this.appId,
            scope: JSON.stringify(this.sdk)
        };
        return new Ajax()
            .delete({
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/json', 'Accept': 'application/json',
                'Authorization': 'Bearer ' + refreshToken
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9tbGVwcmV2b3N0L1dvcmtzcGFjZS9vZmlkai9maWRqL3NyYy8iLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24vY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRzVCLE9BQU8sS0FBSyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBYyxZQUFZLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFFbkUsTUFBTSxPQUFPLE1BQU07SUFZZixZQUFvQixLQUFhLEVBQ2IsR0FBVyxFQUNYLE9BQXFCLEVBQ3JCLEdBQWlCO1FBSGpCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQ1gsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixRQUFHLEdBQUgsR0FBRyxDQUFjO1FBRWpDLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25GLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLHdDQUF3QztRQUNsRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ25ELElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1NBQzFHO1FBQ0QsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDNUUsSUFBSSxHQUFHLE1BQU0sQ0FB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QUFHLENBQUM7SUFDdEIsQ0FBQzs7QUF0TEQsZ0NBQWdDO0FBQ2pCLDBCQUFtQixHQUFHLENBQUMsQ0FBQztBQUN4QixtQkFBWSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUMxQyxrQkFBVyxHQUFHLGVBQWUsQ0FBQztBQUM5QixnQkFBUyxHQUFHLGFBQWEsQ0FBQztBQUMxQixvQkFBYSxHQUFHLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBamF4fSBmcm9tICcuL2FqYXgnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2V9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7U2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuaW1wb3J0ICogYXMgdG9vbHMgZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0IHtDbGllbnRUb2tlbiwgQ2xpZW50VG9rZW5zLCBDbGllbnRVc2VyfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcblxuICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50VXVpZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50SW5mbzogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50SW5pdGlhbCA9IDE7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50ID0gQ2xpZW50LnJlZnJlc2hDb3VudEluaXRpYWw7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudFV1aWQgPSAndjIuY2xpZW50VXVpZCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudElkID0gJ3YyLmNsaWVudElkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVmcmVzaENvdW50ID0gJ3YyLnJlZnJlc2hDb3VudCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcElkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBVUkk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHN0b3JhZ2U6IExvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlKSB7XG5cbiAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRVdWlkKSB8fCAndXVpZC0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IGluZm8gPSAnX2NsaWVudEluZm8nOyAvLyB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SW5mbyk7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubmF2aWdhdG9yKSB7XG4gICAgICAgICAgICBpbmZvID0gd2luZG93Lm5hdmlnYXRvci5hcHBOYW1lICsgJ0AnICsgd2luZG93Lm5hdmlnYXRvci5hcHBWZXJzaW9uICsgJy0nICsgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvd1snZGV2aWNlJ10gJiYgd2luZG93WydkZXZpY2UnXS51dWlkKSB7XG4gICAgICAgICAgICB1dWlkID0gd2luZG93WydkZXZpY2UnXS51dWlkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q2xpZW50VXVpZCh1dWlkKTtcbiAgICAgICAgdGhpcy5zZXRDbGllbnRJbmZvKGluZm8pO1xuICAgICAgICB0aGlzLmNsaWVudElkID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9yZWZyZXNoQ291bnQpIHx8IENsaWVudC5yZWZyZXNoQ291bnRJbml0aWFsO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50SWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudElkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudElkLCB0aGlzLmNsaWVudElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50VXVpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50VXVpZCA9ICcnICsgdmFsdWU7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9jbGllbnRVdWlkLCB0aGlzLmNsaWVudFV1aWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRJbmZvKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRJbmZvID0gJycgKyB2YWx1ZTtcbiAgICAgICAgLy8gdGhpcy5zdG9yYWdlLnNldCgnY2xpZW50SW5mbycsIHRoaXMuY2xpZW50SW5mbyk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGxvZ2luKGxvZ2luOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIHVwZGF0ZVByb3BlcnRpZXM/OiBhbnkpOiBQcm9taXNlPENsaWVudFRva2VucyB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLlVSSSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gYXBpIHVyaScpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtjb2RlOiA0MDgsIHJlYXNvbjogJ25vLWFwaS11cmknfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmxMb2dpbiA9IHRoaXMuVVJJICsgJy91c2Vycyc7XG4gICAgICAgIGNvbnN0IGRhdGFMb2dpbiA9IHtcbiAgICAgICAgICAgIG5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgdXNlcm5hbWU6IGxvZ2luLFxuICAgICAgICAgICAgZW1haWw6IGxvZ2luLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY3JlYXRlZFVzZXI6IENsaWVudFVzZXIgPSAoYXdhaXQgbmV3IEFqYXgoKS5wb3N0KHtcbiAgICAgICAgICAgIHVybDogdXJsTG9naW4sXG4gICAgICAgICAgICBkYXRhOiBkYXRhTG9naW4sXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgfSkgYXMgYW55KS51c2VyO1xuXG4gICAgICAgIHRoaXMuc2V0Q2xpZW50SWQobG9naW4pOyAvLyBsb2dpbiBvciBjcmVhdGVkVXNlci5pZCBvciBjcmVhdGVkVXNlci5faWRcbiAgICAgICAgY29uc3QgdXJsVG9rZW4gPSB0aGlzLlVSSSArICcvYXBwcy8nICsgdGhpcy5hcHBJZCArICcvdG9rZW5zJztcbiAgICAgICAgY29uc3QgZGF0YVRva2VuID0ge1xuICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ2FjY2Vzc190b2tlbicsXG4gICAgICAgICAgICAvLyBncmFudF90eXBlOiAnY2xpZW50X2NyZWRlbnRpYWxzJyxcbiAgICAgICAgICAgIC8vIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgIC8vIGNsaWVudF9zZWNyZXQ6IHBhc3N3b3JkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICAvLyBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3JlYXRlZEFjY2Vzc1Rva2VuOiBDbGllbnRUb2tlbiA9IChhd2FpdCBuZXcgQWpheCgpLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmxUb2tlbixcbiAgICAgICAgICAgIGRhdGE6IGRhdGFUb2tlbixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0Jhc2ljICcgKyB0b29scy5CYXNlNjQuZW5jb2RlKCcnICsgbG9naW4gKyAnOicgKyBwYXNzd29yZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkgYXMgYW55KS50b2tlbjtcblxuICAgICAgICBkYXRhVG9rZW4uZ3JhbnRfdHlwZSA9ICdpZF90b2tlbic7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRJZFRva2VuOiBDbGllbnRUb2tlbiA9IChhd2FpdCBuZXcgQWpheCgpLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmxUb2tlbixcbiAgICAgICAgICAgIGRhdGE6IGRhdGFUb2tlbixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgY3JlYXRlZEFjY2Vzc1Rva2VuLmRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkgYXMgYW55KS50b2tlbjtcblxuICAgICAgICBkYXRhVG9rZW4uZ3JhbnRfdHlwZSA9ICdyZWZyZXNoX3Rva2VuJztcbiAgICAgICAgY29uc3QgY3JlYXRlZFJlZnJlc2hUb2tlbjogQ2xpZW50VG9rZW4gPSAoYXdhaXQgbmV3IEFqYXgoKS5wb3N0KHtcbiAgICAgICAgICAgIHVybDogdXJsVG9rZW4sXG4gICAgICAgICAgICBkYXRhOiBkYXRhVG9rZW4sXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGNyZWF0ZWRBY2Nlc3NUb2tlbi5kYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pIGFzIGFueSkudG9rZW47XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDbGllbnRUb2tlbnMobG9naW4sIGNyZWF0ZWRBY2Nlc3NUb2tlbiwgY3JlYXRlZElkVG9rZW4sIGNyZWF0ZWRSZWZyZXNoVG9rZW4pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZUF1dGhlbnRpY2F0ZShyZWZyZXNoVG9rZW46IHN0cmluZyk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuVVJJICsgJy9tZS90b2tlbnMnO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ3JlZnJlc2hfdG9rZW4nLFxuICAgICAgICAgICAgLy8gY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICAvLyBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkayksXG4gICAgICAgICAgICAvLyByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICByZWZyZXNoQ291bnQ6IENsaWVudC5yZWZyZXNoQ291bnQsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyByZWZyZXNoVG9rZW5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKG9iajogQ2xpZW50VG9rZW4pID0+IHtcbiAgICAgICAgICAgICAgICBDbGllbnQucmVmcmVzaENvdW50Kys7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX3JlZnJlc2hDb3VudCwgQ2xpZW50LnJlZnJlc2hDb3VudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShvYmopO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ291dChyZWZyZXNoVG9rZW4/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50VXVpZDtcbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50SWQ7XG4gICAgICAgIC8vIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRVdWlkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX3JlZnJlc2hDb3VudCk7XG4gICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQgPSBDbGllbnQucmVmcmVzaENvdW50SW5pdGlhbDtcblxuICAgICAgICBpZiAoIXJlZnJlc2hUb2tlbiB8fCAhdGhpcy5jbGllbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL21lL3Rva2Vucyc7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICB0b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgLy8gY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICAvLyBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkaylcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEFqYXgoKVxuICAgICAgICAgICAgLmRlbGV0ZSh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgcmVmcmVzaFRva2VuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuVVJJO1xuICAgIH1cbn1cbiJdfQ==