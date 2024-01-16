import {Client} from './client';
import {ModuleServiceLoginOptionsInterface, SdkInterface, ErrorInterface, EndpointInterface, LoggerInterface} from '../sdk/interfaces';
import {Base64, LocalStorage, Xor} from '../tools';
import {Ajax} from './ajax';
import {ClientToken, ClientTokens, ClientUser, ConnectionFindOptionsInterface} from './interfaces';
import {Error} from '../sdk/error';

export class Connection {

    public fidjId: string;
    public fidjVersion: string;
    public fidjCrypto: boolean;
    public accessToken: string;
    public accessTokenPrevious: string;
    public idToken: string;
    public refreshToken: string;
    public states: { [s: string]: { state: boolean, time: number, lastTimeWasOk: number }; }; // Map<string, boolean>;
    public apis: Array<EndpointInterface>;

    private cryptoSalt: string;
    private cryptoSaltNext: string;
    private client: Client;
    private user: ClientUser;

    private static _accessToken = 'v2.accessToken';
    private static _accessTokenPrevious = 'v2.accessTokenPrevious';
    private static _idToken = 'v2.idToken';
    private static _refreshToken = 'v2.refreshToken';
    private static _states = 'v2.states';
    private static _cryptoSalt = 'v2.cryptoSalt';
    private static _cryptoSaltNext = 'v2.cryptoSalt.next';

    constructor(private _sdk: SdkInterface,
                private _storage: LocalStorage,
                private _logger: LoggerInterface) {
        this.client = null;
        this.user = null;
        this.cryptoSalt = this._storage.get(Connection._cryptoSalt) || null;
        this.cryptoSaltNext = this._storage.get(Connection._cryptoSaltNext) || null;
        this.accessToken = this._storage.get(Connection._accessToken) || null;
        this.accessTokenPrevious = this._storage.get('v2.accessTokenPrevious') || null;
        this.idToken = this._storage.get(Connection._idToken) || null;
        this.refreshToken = this._storage.get(Connection._refreshToken) || null;
        this.states = this._storage.get(Connection._states) || {};
        this.apis = [];
    };

    isReady(): boolean {
        return !!this.client && this.client.isReady();
    }

    async destroy(force?: boolean) {

        this._storage.remove(Connection._accessToken);
        this._storage.remove(Connection._idToken);
        this._storage.remove(Connection._refreshToken);
        this._storage.remove(Connection._states);

        if (this.accessToken) {
            this.accessTokenPrevious = this.accessToken;
            this._storage.set(Connection._accessTokenPrevious, this.accessTokenPrevious);
        }

        if (force) {
            this._storage.remove(Connection._cryptoSalt);
            this._storage.remove(Connection._cryptoSaltNext);
            this._storage.remove(Connection._accessTokenPrevious);
        }

        this.user = null;
        if (this.client) {
            // this.client.setClientId(null);
            await this.client.logout();
        }
        this.accessToken = null;
        this.idToken = null;
        this.refreshToken = null;
        this.states = {}; // new Map<string, boolean>();
    }

    setClient(client: Client): void {

        this.client = client;
        //if (!this.user) {
        //    this.user = new ClientUser();
        //}

        // this._user._id = this._client.clientId;
        //this.user._name = JSON.parse(this.getIdPayload({name: ''})).name;
    }

    setUser(user: ClientUser): void {
        this.user = user;
        if (this.client && this.user.id) {
            this.client.setClientId(this.user.id);

            // store only clientId
            // delete this.user._id;
        }
    }

    getUser(): ClientUser {
        return this.user;
    }

    getClient(): Client {
        return this.client;
    }

    setCryptoSalt(value: string) {
        if (this.cryptoSalt !== value && this.cryptoSaltNext !== value) {
            this.cryptoSaltNext = value;
            this._storage.set(Connection._cryptoSaltNext, this.cryptoSaltNext);
        }

        if (!this.cryptoSalt) {
            this.setCryptoSaltAsVerified();
        }
    }

    setCryptoSaltAsVerified() {
        if (this.cryptoSaltNext) {
            this.cryptoSalt = this.cryptoSaltNext;
            this._storage.set(Connection._cryptoSalt, this.cryptoSalt);
        }
        this.cryptoSaltNext = null;
        this._storage.remove(Connection._cryptoSaltNext);
    }

    encrypt(data: any): string {

        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        } else {
            const dataAsObj = {string: data};
            data = JSON.stringify(dataAsObj);
        }

        if (this.fidjCrypto && this.cryptoSalt) {
            const key = this.cryptoSalt;
            return Xor.encrypt(data, key);
        } else {
            return data;
        }
    }

    decrypt(data: string): any {
        let decrypted = null;

        try {
            if (this.fidjCrypto && this.cryptoSaltNext) {
                const key = this.cryptoSaltNext;
                decrypted = Xor.decrypt(data, key);
                decrypted = JSON.parse(decrypted);
                // if (decrypted) {
                //    this.setCryptoSaltAsVerified();
                // }
            }
        } catch (err) {
            decrypted = null;
        }

        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSalt) {
                const key = this.cryptoSalt;
                decrypted = Xor.decrypt(data, key);
                decrypted = JSON.parse(decrypted);
            }
        } catch (err) {
            decrypted = null;
        }

        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSalt) {
                const key = this.cryptoSalt;
                decrypted = Xor.decrypt(data, key, true);
                decrypted = JSON.parse(decrypted);
            }
        } catch (err) {
            decrypted = null;
        }


        try {

            if (!decrypted) {
                decrypted = JSON.parse(data);
            }

            if (decrypted && decrypted.string) {
                decrypted = decrypted.string;
            }

        } catch (err) {
            decrypted = null;
        }

        return decrypted;
    }

    isLogin(): boolean {
        let exp = true;
        try {
            const payload = this.refreshToken.split('.')[1];
            const decoded = JSON.parse(Base64.decode(payload));
            exp = ((new Date().getTime() / 1000) >= decoded.exp);

        } catch (e) {
        }
        return !exp;
    }

    // todo reintegrate client.login()

    async logout(): Promise<void | ErrorInterface> {
        return this.getClient().logout(this.refreshToken);
    }

    getClientId(): string {
        if (!this.client) {
            return null;
        }
        return this.client.clientId;
    }

    async getIdToken() {
        return this.idToken;
    }

    async getIdPayload(def?: any) {

        const idToken = await this.getIdToken();

        try {
            let payload;
            if (idToken) {
                payload = idToken.split('.')[1];
            }
            if (payload) {
                return Base64.decode(payload);
            }
        } catch (e) {
            this._logger.log('fidj.connection.getIdPayload pb: ', def, e);
        }

        if (def) {
            if (typeof def !== 'string') {
                def = JSON.stringify(def);
            }
            return def;
        }

        return null;
    }

    async getAccessPayload(def?: any): Promise<string> {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }

        try {
            const payload = this.accessToken.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        } catch (e) {
        }
        return def ? def : null;
    }

    getPreviousAccessPayload(def?: any): string {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }

        try {
            const payload = this.accessTokenPrevious.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        } catch (e) {
        }
        return def ? def : null;
    }

    /**
     * @throws ErrorInterface
     */
    async refreshConnection(): Promise<ClientUser> {

        // store states
        this._storage.set(Connection._states, this.states);

        // token not expired : ok
        if (this.accessToken) {
            const payload = this.accessToken.split('.')[1];
            const decoded = Base64.decode(payload);
            const notExpired = (new Date().getTime() / 1000) < JSON.parse(decoded).exp;
            // console.log('new Date().getTime() < JSON.parse(decoded).exp :', (new Date().getTime() / 1000), JSON.parse(decoded).exp);
            this._logger.log('fidj.connection.connection.refreshConnection : token not expired ? ', notExpired);
            if (notExpired) {
                return Promise.resolve(this.getUser());
            }
        }

        // remove expired refreshToken
        if (this.refreshToken) {
            const payload = this.refreshToken.split('.')[1];
            const decoded = Base64.decode(payload);
            const expired = (new Date().getTime() / 1000) >= JSON.parse(decoded).exp;
            this._logger.log('fidj.connection.connection.refreshConnection : refreshToken not expired ? ', expired);
            if (expired) {
                this._storage.remove(Connection._refreshToken);
            }
        }

        // remove expired accessToken & idToken & store it as Previous one
        this.accessTokenPrevious = this.accessToken;
        this._storage.set('v2.accessTokenPrevious', this.accessTokenPrevious);
        this._storage.remove(Connection._accessToken);
        this._storage.remove(Connection._idToken);
        this.accessToken = null;
        this.idToken = null;

        // refresh authentication
        this._logger.log('fidj.connection.connection.refreshConnection : refresh authentication.');
        const client = this.getClient();
        if (!client) {
            throw new Error(400, 'Need an initialized client.');
        }

        const refreshToken: ClientToken = await this.getClient().reAuthenticate(this.refreshToken);

        const previousIdToken = new ClientToken(this.getClientId(), 'idToken', this.idToken);
        const previousAccessToken = new ClientToken(this.getClientId(), 'accessToken', this.accessToken);
        const clientTokens = new ClientTokens(this.getClientId(), previousIdToken, previousAccessToken, refreshToken);
        await this.setConnection(clientTokens);
        return this.getUser();
    };

    async setConnection(clientTokens: ClientTokens) {

        // only in private storage
        if (clientTokens.accessToken) {
            this.accessToken = clientTokens.accessToken.data;
            this._storage.set(Connection._accessToken, this.accessToken);

            const salt: string = JSON.parse(await this.getAccessPayload({salt: ''})).salt;
            if (salt) {
                this.setCryptoSalt(salt);
            }
        }
        if (clientTokens.idToken) {
            this.idToken = clientTokens.idToken.data;
            this._storage.set(Connection._idToken, this.idToken);
        }
        if (clientTokens.refreshToken) {
            this.refreshToken = clientTokens.refreshToken.data;
            this._storage.set(Connection._refreshToken, this.refreshToken);
        }

        // store changed states
        this._storage.set(Connection._states, this.states);

        // expose roles, message
        const clientUser = new ClientUser(
            clientTokens.username, clientTokens.username,
            JSON.parse(await this.getIdPayload({roles: []})).roles,
            JSON.parse(await this.getIdPayload({message: ''})).message);
        this.setUser(clientUser);
    };

    async setConnectionOffline(options: ModuleServiceLoginOptionsInterface) {

        if (options.accessToken) {
            this.accessToken = options.accessToken;
            this._storage.set(Connection._accessToken, this.accessToken);
        }
        if (options.idToken) {
            this.idToken = options.idToken;
            this._storage.set(Connection._idToken, this.idToken);
        }
        if (options.refreshToken) {
            this.refreshToken = options.refreshToken;
            this._storage.set(Connection._refreshToken, this.refreshToken);
        }

        this.setUser(new ClientUser('demo', 'demo',
            JSON.parse(await this.getIdPayload({roles: []})).roles,
            JSON.parse(await this.getIdPayload({message: ''})).message));
    }

    async getApiEndpoints(options?: ConnectionFindOptionsInterface): Promise<Array<EndpointInterface>> {

        let ea: EndpointInterface[] = [
            {key: 'fidj.default', url: 'https://api.fidj.ovh/v3', blocked: false}
        ];
        let filteredEa = [];

        if (!this._sdk.prod) {
            ea = [
                {key: 'fidj.default', url: 'http://localhost:3201/v3', blocked: false},
                {key: 'fidj.default', url: 'https://fidj-sandbox.herokuapp.com/v3', blocked: false}
            ];
        }

        if (this.accessToken) {
            const val = await this.getAccessPayload({apis: []});
            const apiEndpoints: EndpointInterface[] = JSON.parse(val).apis;
            if (apiEndpoints && apiEndpoints.length) {
                ea = [];
                apiEndpoints.forEach((endpoint) => {
                    if (endpoint.url) {
                        ea.push(endpoint);
                    }
                });
            }
        }

        if (this.accessTokenPrevious) {
            const apiEndpoints: EndpointInterface[] = JSON.parse(this.getPreviousAccessPayload({apis: []})).apis;
            if (apiEndpoints && apiEndpoints.length) {
                apiEndpoints.forEach((endpoint) => {
                    if (endpoint.url && ea.filter((r) => r.url === endpoint.url).length === 0) {
                        ea.push(endpoint);
                    }
                });
            }
        }

        this._logger.log('fidj.sdk.connection.getApiEndpoints : ', ea);

        let couldCheckStates = true;
        if (this.states && Object.keys(this.states).length) {
            for (let i = 0; (i < ea.length) && couldCheckStates; i++) {
                if (!this.states[ea[i].url]) {
                    couldCheckStates = false;
                }
            }
        } else {
            couldCheckStates = false;
        }

        if (options && options.filter) {
            if (couldCheckStates && options.filter === 'theBestOne') {
                for (let i = 0; (i < ea.length) && (filteredEa.length === 0); i++) {
                    const endpoint = ea[i];
                    if (this.states[endpoint.url] &&
                        this.states[endpoint.url].state) {
                        filteredEa.push(endpoint);
                    }
                }
            } else if (couldCheckStates && options.filter === 'theBestOldOne') {
                let bestOldOne: EndpointInterface;
                for (let i = 0; (i < ea.length); i++) {
                    const endpoint = ea[i];
                    if (this.states[endpoint.url] &&
                        this.states[endpoint.url].lastTimeWasOk &&
                        (!bestOldOne || this.states[endpoint.url].lastTimeWasOk > this.states[bestOldOne.url].lastTimeWasOk)) {

                        bestOldOne = endpoint;
                    }
                }
                if (bestOldOne) {
                    filteredEa.push(bestOldOne);
                }
            } else if (ea.length) {
                filteredEa.push(ea[0]);
            }
        } else {
            filteredEa = ea;
        }

        return filteredEa;
    };

    async getDBs(options?: ConnectionFindOptionsInterface): Promise<EndpointInterface[]> {

        if (!this.accessToken) {
            return [];
        }

        // todo test random DB connection
        const random = Math.random() % 2;
        let dbs = JSON.parse(await this.getAccessPayload({dbs: []})).dbs || [];

        // need to synchronize db
        if (random === 0) {
            dbs = dbs.sort();
        } else if (random === 1) {
            dbs = dbs.reverse();
        }

        let filteredDBs = [];
        let couldCheckStates = true;
        if (this.states && Object.keys(this.states).length) {
            for (let i = 0; (i < dbs.length) && couldCheckStates; i++) {
                if (!this.states[dbs[i].url]) {
                    couldCheckStates = false;
                }
            }
        } else {
            couldCheckStates = false;
        }

        if (couldCheckStates && options && options.filter === 'theBestOne') {
            for (let i = 0; (i < dbs.length) && (filteredDBs.length === 0); i++) {
                const endpoint = dbs[i];
                if (this.states[endpoint.url] &&
                    this.states[endpoint.url].state) {
                    filteredDBs.push(endpoint);
                }
            }
        } else if (couldCheckStates && options && options.filter === 'theBestOnes') {
            for (let i = 0; (i < dbs.length); i++) {
                const endpoint = dbs[i];
                if (this.states[endpoint.url] &&
                    this.states[endpoint.url].state) {
                    filteredDBs.push(endpoint);
                }
            }
        } else if (options && options.filter === 'theBestOne' && dbs.length) {
            filteredDBs.push(dbs[0]);
        } else {
            filteredDBs = dbs;
        }

        return filteredDBs;
    };

    private async verifyApiState(currentTime: number, endpointUrl: string) {

        try {

            this._logger.log('fidj.sdk.connection.verifyApiState : ', currentTime, endpointUrl);

            const data = await new Ajax()
                .get({
                    url: endpointUrl + '/status?isOk=' + this._sdk.version,
                    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
                });

            let state = false;
            if (data && data.isOk) {
                state = true;
            }
            this.states[endpointUrl] = {state: state, time: currentTime, lastTimeWasOk: currentTime};

            this._logger.log('fidj.sdk.connection.verifyApiState > states : ', this.states);

        } catch (err) {
            let lastTimeWasOk = 0;
            if (this.states[endpointUrl]) {
                lastTimeWasOk = this.states[endpointUrl].lastTimeWasOk;
            }
            this.states[endpointUrl] = {state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk};

            this._logger.log('fidj.sdk.connection.verifyApiState > catch pb  - states : ', err, this.states);
        }
    }

    private async verifyDbState(currentTime: number, dbEndpoint: string) {

        try {
            // console.log('verifyDbState: ', dbEndpoint);
            await new Ajax()
                .get({
                    url: dbEndpoint,
                    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
                });

            this.states[dbEndpoint] = {state: true, time: currentTime, lastTimeWasOk: currentTime};
            // resolve();
            // console.log('verifyDbState: state', dbEndpoint, true);

        } catch (err) {
            let lastTimeWasOk = 0;
            if (this.states[dbEndpoint]) {
                lastTimeWasOk = this.states[dbEndpoint].lastTimeWasOk;
            }
            this.states[dbEndpoint] = {state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk};
            // resolve();
        }
    }

    async verifyConnectionStates(): Promise<any | ErrorInterface> {

        const currentTime = new Date().getTime();

        // todo need verification ? not yet (cache)
        // if (Object.keys(this.states).length > 0) {
        //     const time = this.states[Object.keys(this.states)[0]].time;
        //     if (currentTime < time) {
        //         return Promise.resolve();
        //     }
        // }

        // verify via GET status on Endpoints & DBs
        const promises = [];
        // this.states = {};
        this.apis = await this.getApiEndpoints();
        this.apis.forEach((endpointObj) => {
            let endpointUrl: string = endpointObj.url;
            if (!endpointUrl) {
                endpointUrl = endpointObj.toString();
            }
            promises.push(this.verifyApiState(currentTime, endpointUrl));
        });

        const dbs = await this.getDBs();
        dbs.forEach((dbEndpointObj) => {
            let dbEndpoint: string = dbEndpointObj.url;
            if (!dbEndpoint) {
                dbEndpoint = dbEndpointObj.toString();
            }
            promises.push(this.verifyDbState(currentTime, dbEndpoint));
        });
        return Promise.all(promises);
    };

}
