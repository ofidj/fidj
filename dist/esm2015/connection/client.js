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
    /**
     *
     * @param login
     * @param password
     * @param updateProperties
     * @throws {ErrorInterface}
     */
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
    /**
     *
     * @param refreshToken
     * @throws ErrorInterface
     */
    reAuthenticate(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.URI) {
                console.error('no api uri');
                return Promise.reject({ code: 408, reason: 'no-api-uri' });
            }
            const url = this.URI + '/apps/' + this.appId + '/tokens';
            const data = {
                grant_type: 'refresh_token',
                // client_id: this.clientId,
                client_udid: this.clientUuid,
                client_info: this.clientInfo,
                // audience: this.appId,
                scope: JSON.stringify(this.sdk),
                refresh_token: refreshToken,
                refreshCount: Client.refreshCount,
            };
            const clientToken = yield new Ajax().post({
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'Authorization': 'Bearer ' + refreshToken
                }
            });
            Client.refreshCount++;
            this.storage.set(Client._refreshCount, Client.refreshCount);
            return clientToken;
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
        const url = this.URI + '/apps/' + this.appId + '/tokens';
        return new Ajax()
            .delete({
            url: url,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3RyYXZpcy9idWlsZC9vZmlkai9maWRqL3NyYy8iLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24vY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRzVCLE9BQU8sS0FBSyxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBYyxZQUFZLEVBQWEsTUFBTSxjQUFjLENBQUM7QUFFbkUsTUFBTSxPQUFPLE1BQU07SUFZZixZQUFvQixLQUFhLEVBQ2IsR0FBVyxFQUNYLE9BQXFCLEVBQ3JCLEdBQWlCO1FBSGpCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQ1gsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUNyQixRQUFHLEdBQUgsR0FBRyxDQUFjO1FBRWpDLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25GLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLHdDQUF3QztRQUNsRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ25ELElBQUksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1NBQzFHO1FBQ0QsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDNUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENB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QUFHLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBamF4fSBmcm9tICcuL2FqYXgnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2V9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7U2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuaW1wb3J0ICogYXMgdG9vbHMgZnJvbSAnLi4vdG9vbHMnO1xuaW1wb3J0IHtDbGllbnRUb2tlbiwgQ2xpZW50VG9rZW5zLCBDbGllbnRVc2VyfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcblxuICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50VXVpZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50SW5mbzogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50SW5pdGlhbCA9IDE7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaENvdW50ID0gQ2xpZW50LnJlZnJlc2hDb3VudEluaXRpYWw7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudFV1aWQgPSAndjIuY2xpZW50VXVpZCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NsaWVudElkID0gJ3YyLmNsaWVudElkJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVmcmVzaENvdW50ID0gJ3YyLnJlZnJlc2hDb3VudCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcElkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBVUkk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHN0b3JhZ2U6IExvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNkazogU2RrSW50ZXJmYWNlKSB7XG5cbiAgICAgICAgbGV0IHV1aWQ6IHN0cmluZyA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9jbGllbnRVdWlkKSB8fCAndXVpZC0nICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgbGV0IGluZm8gPSAnX2NsaWVudEluZm8nOyAvLyB0aGlzLnN0b3JhZ2UuZ2V0KENsaWVudC5fY2xpZW50SW5mbyk7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubmF2aWdhdG9yKSB7XG4gICAgICAgICAgICBpbmZvID0gd2luZG93Lm5hdmlnYXRvci5hcHBOYW1lICsgJ0AnICsgd2luZG93Lm5hdmlnYXRvci5hcHBWZXJzaW9uICsgJy0nICsgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvd1snZGV2aWNlJ10gJiYgd2luZG93WydkZXZpY2UnXS51dWlkKSB7XG4gICAgICAgICAgICB1dWlkID0gd2luZG93WydkZXZpY2UnXS51dWlkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q2xpZW50VXVpZCh1dWlkKTtcbiAgICAgICAgdGhpcy5zZXRDbGllbnRJbmZvKGluZm8pO1xuICAgICAgICB0aGlzLmNsaWVudElkID0gdGhpcy5zdG9yYWdlLmdldChDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCA9IHRoaXMuc3RvcmFnZS5nZXQoQ2xpZW50Ll9yZWZyZXNoQ291bnQpIHx8IENsaWVudC5yZWZyZXNoQ291bnRJbml0aWFsO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50SWQodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNsaWVudElkID0gJycgKyB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldChDbGllbnQuX2NsaWVudElkLCB0aGlzLmNsaWVudElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2xpZW50VXVpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xpZW50VXVpZCA9ICcnICsgdmFsdWU7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXQoQ2xpZW50Ll9jbGllbnRVdWlkLCB0aGlzLmNsaWVudFV1aWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDbGllbnRJbmZvKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jbGllbnRJbmZvID0gJycgKyB2YWx1ZTtcbiAgICAgICAgLy8gdGhpcy5zdG9yYWdlLnNldCgnY2xpZW50SW5mbycsIHRoaXMuY2xpZW50SW5mbyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9naW5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgKiBAcGFyYW0gdXBkYXRlUHJvcGVydGllc1xuICAgICAqIEB0aHJvd3Mge0Vycm9ySW50ZXJmYWNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBsb2dpbihsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1cGRhdGVQcm9wZXJ0aWVzPzogYW55KTogUHJvbWlzZTxDbGllbnRUb2tlbnM+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybExvZ2luID0gdGhpcy5VUkkgKyAnL3VzZXJzJztcbiAgICAgICAgY29uc3QgZGF0YUxvZ2luID0ge1xuICAgICAgICAgICAgbmFtZTogbG9naW4sXG4gICAgICAgICAgICB1c2VybmFtZTogbG9naW4sXG4gICAgICAgICAgICBlbWFpbDogbG9naW4sXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjcmVhdGVkVXNlcjogQ2xpZW50VXNlciA9IChhd2FpdCBuZXcgQWpheCgpLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmxMb2dpbixcbiAgICAgICAgICAgIGRhdGE6IGRhdGFMb2dpbixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICB9KSBhcyBhbnkpLnVzZXI7XG5cbiAgICAgICAgdGhpcy5zZXRDbGllbnRJZChsb2dpbik7IC8vIGxvZ2luIG9yIGNyZWF0ZWRVc2VyLmlkIG9yIGNyZWF0ZWRVc2VyLl9pZFxuICAgICAgICBjb25zdCB1cmxUb2tlbiA9IHRoaXMuVVJJICsgJy9hcHBzLycgKyB0aGlzLmFwcElkICsgJy90b2tlbnMnO1xuICAgICAgICBjb25zdCBkYXRhVG9rZW4gPSB7XG4gICAgICAgICAgICBncmFudF90eXBlOiAnYWNjZXNzX3Rva2VuJyxcbiAgICAgICAgICAgIC8vIGdyYW50X3R5cGU6ICdjbGllbnRfY3JlZGVudGlhbHMnLFxuICAgICAgICAgICAgLy8gY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgLy8gY2xpZW50X3NlY3JldDogcGFzc3dvcmQsXG4gICAgICAgICAgICBjbGllbnRfdWRpZDogdGhpcy5jbGllbnRVdWlkLFxuICAgICAgICAgICAgY2xpZW50X2luZm86IHRoaXMuY2xpZW50SW5mbyxcbiAgICAgICAgICAgIC8vIGF1ZGllbmNlOiB0aGlzLmFwcElkLFxuICAgICAgICAgICAgc2NvcGU6IEpTT04uc3RyaW5naWZ5KHRoaXMuc2RrKVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjcmVhdGVkQWNjZXNzVG9rZW46IENsaWVudFRva2VuID0gKGF3YWl0IG5ldyBBamF4KCkucG9zdCh7XG4gICAgICAgICAgICB1cmw6IHVybFRva2VuLFxuICAgICAgICAgICAgZGF0YTogZGF0YVRva2VuLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmFzaWMgJyArIHRvb2xzLkJhc2U2NC5lbmNvZGUoJycgKyBsb2dpbiArICc6JyArIHBhc3N3b3JkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSBhcyBhbnkpLnRva2VuO1xuXG4gICAgICAgIGRhdGFUb2tlbi5ncmFudF90eXBlID0gJ2lkX3Rva2VuJztcbiAgICAgICAgY29uc3QgY3JlYXRlZElkVG9rZW46IENsaWVudFRva2VuID0gKGF3YWl0IG5ldyBBamF4KCkucG9zdCh7XG4gICAgICAgICAgICB1cmw6IHVybFRva2VuLFxuICAgICAgICAgICAgZGF0YTogZGF0YVRva2VuLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBjcmVhdGVkQWNjZXNzVG9rZW4uZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSBhcyBhbnkpLnRva2VuO1xuXG4gICAgICAgIGRhdGFUb2tlbi5ncmFudF90eXBlID0gJ3JlZnJlc2hfdG9rZW4nO1xuICAgICAgICBjb25zdCBjcmVhdGVkUmVmcmVzaFRva2VuOiBDbGllbnRUb2tlbiA9IChhd2FpdCBuZXcgQWpheCgpLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmxUb2tlbixcbiAgICAgICAgICAgIGRhdGE6IGRhdGFUb2tlbixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgY3JlYXRlZEFjY2Vzc1Rva2VuLmRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkgYXMgYW55KS50b2tlbjtcblxuICAgICAgICByZXR1cm4gbmV3IENsaWVudFRva2Vucyhsb2dpbiwgY3JlYXRlZEFjY2Vzc1Rva2VuLCBjcmVhdGVkSWRUb2tlbiwgY3JlYXRlZFJlZnJlc2hUb2tlbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVmcmVzaFRva2VuXG4gICAgICogQHRocm93cyBFcnJvckludGVyZmFjZVxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyByZUF1dGhlbnRpY2F0ZShyZWZyZXNoVG9rZW46IHN0cmluZyk6IFByb21pc2U8Q2xpZW50VG9rZW4+IHtcblxuICAgICAgICBpZiAoIXRoaXMuVVJJKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdubyBhcGkgdXJpJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2NvZGU6IDQwOCwgcmVhc29uOiAnbm8tYXBpLXVyaSd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuVVJJICsgJy9hcHBzLycgKyB0aGlzLmFwcElkICsgJy90b2tlbnMnO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZ3JhbnRfdHlwZTogJ3JlZnJlc2hfdG9rZW4nLFxuICAgICAgICAgICAgLy8gY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgY2xpZW50X3VkaWQ6IHRoaXMuY2xpZW50VXVpZCxcbiAgICAgICAgICAgIGNsaWVudF9pbmZvOiB0aGlzLmNsaWVudEluZm8sXG4gICAgICAgICAgICAvLyBhdWRpZW5jZTogdGhpcy5hcHBJZCxcbiAgICAgICAgICAgIHNjb3BlOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNkayksXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICByZWZyZXNoQ291bnQ6IENsaWVudC5yZWZyZXNoQ291bnQsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY2xpZW50VG9rZW46IENsaWVudFRva2VuID0gYXdhaXQgbmV3IEFqYXgoKS5wb3N0KHtcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgcmVmcmVzaFRva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgQ2xpZW50LnJlZnJlc2hDb3VudCsrO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KENsaWVudC5fcmVmcmVzaENvdW50LCBDbGllbnQucmVmcmVzaENvdW50KTtcblxuICAgICAgICByZXR1cm4gY2xpZW50VG9rZW47XG4gICAgfVxuXG4gICAgcHVibGljIGxvZ291dChyZWZyZXNoVG9rZW4/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5VUkkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGFwaSB1cmknKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7Y29kZTogNDA4LCByZWFzb246ICduby1hcGktdXJpJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50VXVpZDtcbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuY2xpZW50SWQ7XG4gICAgICAgIC8vIHRoaXMuc3RvcmFnZS5yZW1vdmUoQ2xpZW50Ll9jbGllbnRVdWlkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX2NsaWVudElkKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZShDbGllbnQuX3JlZnJlc2hDb3VudCk7XG4gICAgICAgIENsaWVudC5yZWZyZXNoQ291bnQgPSBDbGllbnQucmVmcmVzaENvdW50SW5pdGlhbDtcblxuICAgICAgICBpZiAoIXJlZnJlc2hUb2tlbiB8fCAhdGhpcy5jbGllbnRJZCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5VUkkgKyAnL2FwcHMvJyArIHRoaXMuYXBwSWQgKyAnL3Rva2Vucyc7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBamF4KClcbiAgICAgICAgICAgIC5kZWxldGUoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyByZWZyZXNoVG9rZW5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5VUkk7XG4gICAgfVxufVxuIl19