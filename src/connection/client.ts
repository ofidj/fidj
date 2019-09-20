import {Ajax} from './ajax';
import {LocalStorage} from '../tools';
import {SdkInterface, ErrorInterface} from '../sdk/interfaces';

export class Client {

    public clientId: string;
    private clientUuid: string;
    private clientInfo: string;
    // private refreshToken: string;
    private static refreshCountInitial = 1;
    private static refreshCount = Client.refreshCountInitial;
    private static _clientUuid = 'v2.clientUuid';
    private static _clientId = 'v2.clientId';
    private static _refreshCount = 'v2.refreshCount';

    constructor(private appId: string,
                private URI: string,
                private storage: LocalStorage,
                private sdk: SdkInterface) {

        let uuid: string = this.storage.get(Client._clientUuid) || 'uuid-' + Math.random();
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
    };

    public setClientId(value: string) {
        this.clientId = '' + value;
        this.storage.set(Client._clientId, this.clientId);
    }

    public setClientUuid(value: string) {
        this.clientUuid = '' + value;
        this.storage.set(Client._clientUuid, this.clientUuid);
    }

    public setClientInfo(value: string) {
        this.clientInfo = '' + value;
        // this.storage.set('clientInfo', this.clientInfo);
    }

    public login(login: string, password: string, updateProperties?: any): Promise<any | ErrorInterface> {

        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({code: 408, reason: 'no-api-uri'});
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
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
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
                        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
                    });
            });
    }

    public reAuthenticate(refreshToken: string): Promise<any | ErrorInterface> {

        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({code: 408, reason: 'no-api-uri'});
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
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
            })
            .then((obj: any) => {
                Client.refreshCount++;
                this.storage.set(Client._refreshCount, Client.refreshCount);
                return Promise.resolve(obj);
            });
    }

    public logout(refreshToken?: string): Promise<void | ErrorInterface> {

        if (!this.URI) {
            console.error('no api uri');
            return Promise.reject({code: 408, reason: 'no-api-uri'});
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
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
            });
    }

    public isReady(): boolean {
        return !!this.URI;
    }
}
