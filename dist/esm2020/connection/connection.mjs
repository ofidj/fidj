import { Base64, Xor } from '../tools';
import { Ajax } from './ajax';
import { ClientToken, ClientTokens, ClientUser } from './interfaces';
import { Error } from '../sdk/error';
export class Connection {
    constructor(_sdk, _storage, _logger) {
        this._sdk = _sdk;
        this._storage = _storage;
        this._logger = _logger;
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
    }
    ;
    isReady() {
        return !!this.client && this.client.isReady();
    }
    async destroy(force) {
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
    setClient(client) {
        this.client = client;
        //if (!this.user) {
        //    this.user = new ClientUser();
        //}
        // this._user._id = this._client.clientId;
        //this.user._name = JSON.parse(this.getIdPayload({name: ''})).name;
    }
    setUser(user) {
        this.user = user;
        if (this.client && this.user.id) {
            this.client.setClientId(this.user.id);
            // store only clientId
            // delete this.user._id;
        }
    }
    getUser() {
        return this.user;
    }
    getClient() {
        return this.client;
    }
    setCryptoSalt(value) {
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
    encrypt(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        else {
            const dataAsObj = { string: data };
            data = JSON.stringify(dataAsObj);
        }
        if (this.fidjCrypto && this.cryptoSalt) {
            const key = this.cryptoSalt;
            return Xor.encrypt(data, key);
        }
        else {
            return data;
        }
    }
    decrypt(data) {
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
        }
        catch (err) {
            decrypted = null;
        }
        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSalt) {
                const key = this.cryptoSalt;
                decrypted = Xor.decrypt(data, key);
                decrypted = JSON.parse(decrypted);
            }
        }
        catch (err) {
            decrypted = null;
        }
        try {
            if (!decrypted && this.fidjCrypto && this.cryptoSalt) {
                const key = this.cryptoSalt;
                decrypted = Xor.decrypt(data, key, true);
                decrypted = JSON.parse(decrypted);
            }
        }
        catch (err) {
            decrypted = null;
        }
        try {
            if (!decrypted) {
                decrypted = JSON.parse(data);
            }
            if (decrypted && decrypted.string) {
                decrypted = decrypted.string;
            }
        }
        catch (err) {
            decrypted = null;
        }
        return decrypted;
    }
    isLogin() {
        let exp = true;
        try {
            const payload = this.refreshToken.split('.')[1];
            const decoded = JSON.parse(Base64.decode(payload));
            exp = ((new Date().getTime() / 1000) >= decoded.exp);
        }
        catch (e) {
        }
        return !exp;
    }
    // todo reintegrate client.login()
    async logout() {
        return this.getClient().logout(this.refreshToken);
    }
    getClientId() {
        if (!this.client) {
            return null;
        }
        return this.client.clientId;
    }
    async getIdToken() {
        return this.idToken;
    }
    async getIdPayload(def) {
        const idToken = await this.getIdToken();
        try {
            let payload;
            if (idToken) {
                payload = idToken.split('.')[1];
            }
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
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
    async getAccessPayload(def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            const payload = this.accessToken.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    }
    getPreviousAccessPayload(def) {
        if (def && typeof def !== 'string') {
            def = JSON.stringify(def);
        }
        try {
            const payload = this.accessTokenPrevious.split('.')[1];
            if (payload) {
                return Base64.decode(payload);
            }
        }
        catch (e) {
        }
        return def ? def : null;
    }
    /**
     * @throws ErrorInterface
     */
    async refreshConnection() {
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
        const refreshToken = await this.getClient().reAuthenticate(this.refreshToken);
        const previousIdToken = new ClientToken(this.getClientId(), 'idToken', this.idToken);
        const previousAccessToken = new ClientToken(this.getClientId(), 'accessToken', this.accessToken);
        const clientTokens = new ClientTokens(this.getClientId(), previousIdToken, previousAccessToken, refreshToken);
        await this.setConnection(clientTokens);
        return this.getUser();
    }
    ;
    async setConnection(clientTokens) {
        // only in private storage
        if (clientTokens.accessToken) {
            this.accessToken = clientTokens.accessToken.data;
            this._storage.set(Connection._accessToken, this.accessToken);
            const salt = JSON.parse(await this.getAccessPayload({ salt: '' })).salt;
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
        const clientUser = new ClientUser(clientTokens.username, clientTokens.username, JSON.parse(await this.getIdPayload({ roles: [] })).roles, JSON.parse(await this.getIdPayload({ message: '' })).message);
        this.setUser(clientUser);
    }
    ;
    async setConnectionOffline(options) {
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
        this.setUser(new ClientUser('demo', 'demo', JSON.parse(await this.getIdPayload({ roles: [] })).roles, JSON.parse(await this.getIdPayload({ message: '' })).message));
    }
    async getApiEndpoints(options) {
        let ea = [
            { key: 'fidj.default', url: 'https://api.fidj.ovh/v3', blocked: false }
        ];
        let filteredEa = [];
        if (!this._sdk.prod) {
            ea = [
                { key: 'fidj.default', url: 'http://localhost:3201/v3', blocked: false },
                { key: 'fidj.default', url: 'https://fidj-sandbox.herokuapp.com/v3', blocked: false }
            ];
        }
        if (this.accessToken) {
            const val = await this.getAccessPayload({ apis: [] });
            const apiEndpoints = JSON.parse(val).apis;
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
            const apiEndpoints = JSON.parse(this.getPreviousAccessPayload({ apis: [] })).apis;
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
        }
        else {
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
            }
            else if (couldCheckStates && options.filter === 'theBestOldOne') {
                let bestOldOne;
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
            }
            else if (ea.length) {
                filteredEa.push(ea[0]);
            }
        }
        else {
            filteredEa = ea;
        }
        return filteredEa;
    }
    ;
    async getDBs(options) {
        if (!this.accessToken) {
            return [];
        }
        // todo test random DB connection
        const random = Math.random() % 2;
        let dbs = JSON.parse(await this.getAccessPayload({ dbs: [] })).dbs || [];
        // need to synchronize db
        if (random === 0) {
            dbs = dbs.sort();
        }
        else if (random === 1) {
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
        }
        else {
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
        }
        else if (couldCheckStates && options && options.filter === 'theBestOnes') {
            for (let i = 0; (i < dbs.length); i++) {
                const endpoint = dbs[i];
                if (this.states[endpoint.url] &&
                    this.states[endpoint.url].state) {
                    filteredDBs.push(endpoint);
                }
            }
        }
        else if (options && options.filter === 'theBestOne' && dbs.length) {
            filteredDBs.push(dbs[0]);
        }
        else {
            filteredDBs = dbs;
        }
        return filteredDBs;
    }
    ;
    async verifyApiState(currentTime, endpointUrl) {
        try {
            this._logger.log('fidj.sdk.connection.verifyApiState : ', currentTime, endpointUrl);
            const data = await new Ajax()
                .get({
                url: endpointUrl + '/status?isOk=' + this._sdk.version,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
            let state = false;
            if (data && data.isOk) {
                state = true;
            }
            this.states[endpointUrl] = { state: state, time: currentTime, lastTimeWasOk: currentTime };
            this._logger.log('fidj.sdk.connection.verifyApiState > states : ', this.states);
        }
        catch (err) {
            let lastTimeWasOk = 0;
            if (this.states[endpointUrl]) {
                lastTimeWasOk = this.states[endpointUrl].lastTimeWasOk;
            }
            this.states[endpointUrl] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
            this._logger.log('fidj.sdk.connection.verifyApiState > catch pb  - states : ', err, this.states);
        }
    }
    async verifyDbState(currentTime, dbEndpoint) {
        try {
            // console.log('verifyDbState: ', dbEndpoint);
            await new Ajax()
                .get({
                url: dbEndpoint,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });
            this.states[dbEndpoint] = { state: true, time: currentTime, lastTimeWasOk: currentTime };
            // resolve();
            // console.log('verifyDbState: state', dbEndpoint, true);
        }
        catch (err) {
            let lastTimeWasOk = 0;
            if (this.states[dbEndpoint]) {
                lastTimeWasOk = this.states[dbEndpoint].lastTimeWasOk;
            }
            this.states[dbEndpoint] = { state: false, time: currentTime, lastTimeWasOk: lastTimeWasOk };
            // resolve();
        }
    }
    async verifyConnectionStates() {
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
            let endpointUrl = endpointObj.url;
            if (!endpointUrl) {
                endpointUrl = endpointObj.toString();
            }
            promises.push(this.verifyApiState(currentTime, endpointUrl));
        });
        const dbs = await this.getDBs();
        dbs.forEach((dbEndpointObj) => {
            let dbEndpoint = dbEndpointObj.url;
            if (!dbEndpoint) {
                dbEndpoint = dbEndpointObj.toString();
            }
            promises.push(this.verifyDbState(currentTime, dbEndpoint));
        });
        return Promise.all(promises);
    }
    ;
}
Connection._accessToken = 'v2.accessToken';
Connection._accessTokenPrevious = 'v2.accessTokenPrevious';
Connection._idToken = 'v2.idToken';
Connection._refreshToken = 'v2.refreshToken';
Connection._states = 'v2.states';
Connection._cryptoSalt = 'v2.cryptoSalt';
Connection._cryptoSaltNext = 'v2.cryptoSalt.next';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25uZWN0aW9uL2Nvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFDLE1BQU0sRUFBZ0IsR0FBRyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25ELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFpQyxNQUFNLGNBQWMsQ0FBQztBQUNuRyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRW5DLE1BQU0sT0FBTyxVQUFVO0lBeUJuQixZQUFvQixJQUFrQixFQUNsQixRQUFzQixFQUN0QixPQUF3QjtRQUZ4QixTQUFJLEdBQUosSUFBSSxDQUFjO1FBQ2xCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFDdEIsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3BFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUM1RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDdEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLElBQUksSUFBSSxDQUFDO1FBQy9F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QU0sRUFBRSxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUMxQixJQUFJLFVBQVUsR0FBVyxhQUFhLENBQUMsR0FBRyxDQUFDO1lBQzNDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2IsVUFBVSxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUN6QztZQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQUEsQ0FBQzs7QUFsbEJhLHVCQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFDaEMsK0JBQW9CLEdBQUcsd0JBQXdCLENBQUM7QUFDaEQsbUJBQVEsR0FBRyxZQUFZLENBQUM7QUFDeEIsd0JBQWEsR0FBRyxpQkFBaUIsQ0FBQztBQUNsQyxrQkFBTyxHQUFHLFdBQVcsQ0FBQztBQUN0QixzQkFBVyxHQUFHLGVBQWUsQ0FBQztBQUM5QiwwQkFBZSxHQUFHLG9CQUFvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDbGllbnR9IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7TW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSwgU2RrSW50ZXJmYWNlLCBFcnJvckludGVyZmFjZSwgRW5kcG9pbnRJbnRlcmZhY2UsIExvZ2dlckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtCYXNlNjQsIExvY2FsU3RvcmFnZSwgWG9yfSBmcm9tICcuLi90b29scyc7XG5pbXBvcnQge0FqYXh9IGZyb20gJy4vYWpheCc7XG5pbXBvcnQge0NsaWVudFRva2VuLCBDbGllbnRUb2tlbnMsIENsaWVudFVzZXIsIENvbm5lY3Rpb25GaW5kT3B0aW9uc0ludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4uL3Nkay9lcnJvcic7XG5cbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIHtcblxuICAgIHB1YmxpYyBmaWRqSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgZmlkalZlcnNpb246IHN0cmluZztcbiAgICBwdWJsaWMgZmlkakNyeXB0bzogYm9vbGVhbjtcbiAgICBwdWJsaWMgYWNjZXNzVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgYWNjZXNzVG9rZW5QcmV2aW91czogc3RyaW5nO1xuICAgIHB1YmxpYyBpZFRva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIHJlZnJlc2hUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyBzdGF0ZXM6IHsgW3M6IHN0cmluZ106IHsgc3RhdGU6IGJvb2xlYW4sIHRpbWU6IG51bWJlciwgbGFzdFRpbWVXYXNPazogbnVtYmVyIH07IH07IC8vIE1hcDxzdHJpbmcsIGJvb2xlYW4+O1xuICAgIHB1YmxpYyBhcGlzOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT47XG5cbiAgICBwcml2YXRlIGNyeXB0b1NhbHQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNyeXB0b1NhbHROZXh0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjbGllbnQ6IENsaWVudDtcbiAgICBwcml2YXRlIHVzZXI6IENsaWVudFVzZXI7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBfYWNjZXNzVG9rZW4gPSAndjIuYWNjZXNzVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9hY2Nlc3NUb2tlblByZXZpb3VzID0gJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnO1xuICAgIHByaXZhdGUgc3RhdGljIF9pZFRva2VuID0gJ3YyLmlkVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9yZWZyZXNoVG9rZW4gPSAndjIucmVmcmVzaFRva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfc3RhdGVzID0gJ3YyLnN0YXRlcyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHQgPSAndjIuY3J5cHRvU2FsdCc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NyeXB0b1NhbHROZXh0ID0gJ3YyLmNyeXB0b1NhbHQubmV4dCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zZGs6IFNka0ludGVyZmFjZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9zdG9yYWdlOiBMb2NhbFN0b3JhZ2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBfbG9nZ2VyOiBMb2dnZXJJbnRlcmZhY2UpIHtcbiAgICAgICAgdGhpcy5jbGllbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHQgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0KSB8fCBudWxsO1xuICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5fc3RvcmFnZS5nZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnKSB8fCBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9pZFRva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9zdGF0ZXMpIHx8IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSBbXTtcbiAgICB9O1xuXG4gICAgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jbGllbnQgJiYgdGhpcy5jbGllbnQuaXNSZWFkeSgpO1xuICAgIH1cblxuICAgIGFzeW5jIGRlc3Ryb3koZm9yY2U/OiBib29sZWFuKSB7XG5cbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9pZFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fc3RhdGVzKTtcblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuUHJldmlvdXMsIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW5QcmV2aW91cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5jbGllbnQpIHtcbiAgICAgICAgICAgIC8vIHRoaXMuY2xpZW50LnNldENsaWVudElkKG51bGwpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5jbGllbnQubG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSB7fTsgLy8gbmV3IE1hcDxzdHJpbmcsIGJvb2xlYW4+KCk7XG4gICAgfVxuXG4gICAgc2V0Q2xpZW50KGNsaWVudDogQ2xpZW50KTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgICAgIC8vaWYgKCF0aGlzLnVzZXIpIHtcbiAgICAgICAgLy8gICAgdGhpcy51c2VyID0gbmV3IENsaWVudFVzZXIoKTtcbiAgICAgICAgLy99XG5cbiAgICAgICAgLy8gdGhpcy5fdXNlci5faWQgPSB0aGlzLl9jbGllbnQuY2xpZW50SWQ7XG4gICAgICAgIC8vdGhpcy51c2VyLl9uYW1lID0gSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bmFtZTogJyd9KSkubmFtZTtcbiAgICB9XG5cbiAgICBzZXRVc2VyKHVzZXI6IENsaWVudFVzZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50ICYmIHRoaXMudXNlci5pZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnQuc2V0Q2xpZW50SWQodGhpcy51c2VyLmlkKTtcblxuICAgICAgICAgICAgLy8gc3RvcmUgb25seSBjbGllbnRJZFxuICAgICAgICAgICAgLy8gZGVsZXRlIHRoaXMudXNlci5faWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRVc2VyKCk6IENsaWVudFVzZXIge1xuICAgICAgICByZXR1cm4gdGhpcy51c2VyO1xuICAgIH1cblxuICAgIGdldENsaWVudCgpOiBDbGllbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnQ7XG4gICAgfVxuXG4gICAgc2V0Q3J5cHRvU2FsdCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmNyeXB0b1NhbHQgIT09IHZhbHVlICYmIHRoaXMuY3J5cHRvU2FsdE5leHQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCwgdGhpcy5jcnlwdG9TYWx0TmV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgdGhpcy5zZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNyeXB0b1NhbHROZXh0KSB7XG4gICAgICAgICAgICB0aGlzLmNyeXB0b1NhbHQgPSB0aGlzLmNyeXB0b1NhbHROZXh0O1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdCwgdGhpcy5jcnlwdG9TYWx0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNyeXB0b1NhbHROZXh0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQpO1xuICAgIH1cblxuICAgIGVuY3J5cHQoZGF0YTogYW55KTogc3RyaW5nIHtcblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhQXNPYmogPSB7c3RyaW5nOiBkYXRhfTtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhQXNPYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgIHJldHVybiBYb3IuZW5jcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWNyeXB0KGRhdGE6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGxldCBkZWNyeXB0ZWQgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHROZXh0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIChkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVjcnlwdGVkICYmIGRlY3J5cHRlZC5zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBkZWNyeXB0ZWQuc3RyaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWNyeXB0ZWQ7XG4gICAgfVxuXG4gICAgaXNMb2dpbigpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGV4cCA9IHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZWZyZXNoVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBKU09OLnBhcnNlKEJhc2U2NC5kZWNvZGUocGF5bG9hZCkpO1xuICAgICAgICAgICAgZXhwID0gKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApID49IGRlY29kZWQuZXhwKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFleHA7XG4gICAgfVxuXG4gICAgLy8gdG9kbyByZWludGVncmF0ZSBjbGllbnQubG9naW4oKVxuXG4gICAgYXN5bmMgbG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudCgpLmxvZ291dCh0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50SWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmNsaWVudElkO1xuICAgIH1cblxuICAgIGFzeW5jIGdldElkVG9rZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkVG9rZW47XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0SWRQYXlsb2FkKGRlZj86IGFueSkge1xuXG4gICAgICAgIGNvbnN0IGlkVG9rZW4gPSBhd2FpdCB0aGlzLmdldElkVG9rZW4oKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHBheWxvYWQ7XG4gICAgICAgICAgICBpZiAoaWRUb2tlbikge1xuICAgICAgICAgICAgICAgIHBheWxvYWQgPSBpZFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLmNvbm5lY3Rpb24uZ2V0SWRQYXlsb2FkIHBiOiAnLCBkZWYsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlZikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWY7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBY2Nlc3NQYXlsb2FkKGRlZj86IGFueSk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmID8gZGVmIDogbnVsbDtcbiAgICB9XG5cbiAgICBnZXRQcmV2aW91c0FjY2Vzc1BheWxvYWQoZGVmPzogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGRlZiAmJiB0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHRocm93cyBFcnJvckludGVyZmFjZVxuICAgICAqL1xuICAgIGFzeW5jIHJlZnJlc2hDb25uZWN0aW9uKCk6IFByb21pc2U8Q2xpZW50VXNlcj4ge1xuXG4gICAgICAgIC8vIHN0b3JlIHN0YXRlc1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9zdGF0ZXMsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICAvLyB0b2tlbiBub3QgZXhwaXJlZCA6IG9rXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBjb25zdCBub3RFeHBpcmVkID0gKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCduZXcgRGF0ZSgpLmdldFRpbWUoKSA8IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwIDonLCAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSwgSlNPTi5wYXJzZShkZWNvZGVkKS5leHApO1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZygnZmlkai5jb25uZWN0aW9uLmNvbm5lY3Rpb24ucmVmcmVzaENvbm5lY3Rpb24gOiB0b2tlbiBub3QgZXhwaXJlZCA/ICcsIG5vdEV4cGlyZWQpO1xuICAgICAgICAgICAgaWYgKG5vdEV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZ2V0VXNlcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBleHBpcmVkIHJlZnJlc2hUb2tlblxuICAgICAgICBpZiAodGhpcy5yZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlZnJlc2hUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBjb25zdCBleHBpcmVkID0gKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPj0gSlNPTi5wYXJzZShkZWNvZGVkKS5leHA7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLmNvbm5lY3Rpb24uY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbiA6IHJlZnJlc2hUb2tlbiBub3QgZXhwaXJlZCA/ICcsIGV4cGlyZWQpO1xuICAgICAgICAgICAgaWYgKGV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4cGlyZWQgYWNjZXNzVG9rZW4gJiBpZFRva2VuICYgc3RvcmUgaXQgYXMgUHJldmlvdXMgb25lXG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyA9IHRoaXMuYWNjZXNzVG9rZW47XG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KCd2Mi5hY2Nlc3NUb2tlblByZXZpb3VzJywgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9pZFRva2VuKTtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IG51bGw7XG5cbiAgICAgICAgLy8gcmVmcmVzaCBhdXRoZW50aWNhdGlvblxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLmNvbm5lY3Rpb24uY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbiA6IHJlZnJlc2ggYXV0aGVudGljYXRpb24uJyk7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50KCk7XG4gICAgICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoNDAwLCAnTmVlZCBhbiBpbml0aWFsaXplZCBjbGllbnQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWZyZXNoVG9rZW46IENsaWVudFRva2VuID0gYXdhaXQgdGhpcy5nZXRDbGllbnQoKS5yZUF1dGhlbnRpY2F0ZSh0aGlzLnJlZnJlc2hUb2tlbik7XG5cbiAgICAgICAgY29uc3QgcHJldmlvdXNJZFRva2VuID0gbmV3IENsaWVudFRva2VuKHRoaXMuZ2V0Q2xpZW50SWQoKSwgJ2lkVG9rZW4nLCB0aGlzLmlkVG9rZW4pO1xuICAgICAgICBjb25zdCBwcmV2aW91c0FjY2Vzc1Rva2VuID0gbmV3IENsaWVudFRva2VuKHRoaXMuZ2V0Q2xpZW50SWQoKSwgJ2FjY2Vzc1Rva2VuJywgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIGNvbnN0IGNsaWVudFRva2VucyA9IG5ldyBDbGllbnRUb2tlbnModGhpcy5nZXRDbGllbnRJZCgpLCBwcmV2aW91c0lkVG9rZW4sIHByZXZpb3VzQWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbik7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0Q29ubmVjdGlvbihjbGllbnRUb2tlbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRVc2VyKCk7XG4gICAgfTtcblxuICAgIGFzeW5jIHNldENvbm5lY3Rpb24oY2xpZW50VG9rZW5zOiBDbGllbnRUb2tlbnMpIHtcblxuICAgICAgICAvLyBvbmx5IGluIHByaXZhdGUgc3RvcmFnZVxuICAgICAgICBpZiAoY2xpZW50VG9rZW5zLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gY2xpZW50VG9rZW5zLmFjY2Vzc1Rva2VuLmRhdGE7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG5cbiAgICAgICAgICAgIGNvbnN0IHNhbHQ6IHN0cmluZyA9IEpTT04ucGFyc2UoYXdhaXQgdGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtzYWx0OiAnJ30pKS5zYWx0O1xuICAgICAgICAgICAgaWYgKHNhbHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHQoc2FsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFRva2Vucy5pZFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmlkVG9rZW4gPSBjbGllbnRUb2tlbnMuaWRUb2tlbi5kYXRhO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5faWRUb2tlbiwgdGhpcy5pZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VG9rZW5zLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBjbGllbnRUb2tlbnMucmVmcmVzaFRva2VuLmRhdGE7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3JlIGNoYW5nZWQgc3RhdGVzXG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3N0YXRlcywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIC8vIGV4cG9zZSByb2xlcywgbWVzc2FnZVxuICAgICAgICBjb25zdCBjbGllbnRVc2VyID0gbmV3IENsaWVudFVzZXIoXG4gICAgICAgICAgICBjbGllbnRUb2tlbnMudXNlcm5hbWUsIGNsaWVudFRva2Vucy51c2VybmFtZSxcbiAgICAgICAgICAgIEpTT04ucGFyc2UoYXdhaXQgdGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcyxcbiAgICAgICAgICAgIEpTT04ucGFyc2UoYXdhaXQgdGhpcy5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnNldFVzZXIoY2xpZW50VXNlcik7XG4gICAgfTtcblxuICAgIGFzeW5jIHNldENvbm5lY3Rpb25PZmZsaW5lKG9wdGlvbnM6IE1vZHVsZVNlcnZpY2VMb2dpbk9wdGlvbnNJbnRlcmZhY2UpIHtcblxuICAgICAgICBpZiAob3B0aW9ucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbiwgdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaWRUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gb3B0aW9ucy5pZFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5faWRUb2tlbiwgdGhpcy5pZFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5yZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gb3B0aW9ucy5yZWZyZXNoVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4sIHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VXNlcihuZXcgQ2xpZW50VXNlcignZGVtbycsICdkZW1vJyxcbiAgICAgICAgICAgIEpTT04ucGFyc2UoYXdhaXQgdGhpcy5nZXRJZFBheWxvYWQoe3JvbGVzOiBbXX0pKS5yb2xlcyxcbiAgICAgICAgICAgIEpTT04ucGFyc2UoYXdhaXQgdGhpcy5nZXRJZFBheWxvYWQoe21lc3NhZ2U6ICcnfSkpLm1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBcGlFbmRwb2ludHMob3B0aW9ucz86IENvbm5lY3Rpb25GaW5kT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8QXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+PiB7XG5cbiAgICAgICAgbGV0IGVhOiBFbmRwb2ludEludGVyZmFjZVtdID0gW1xuICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHBzOi8vYXBpLmZpZGoub3ZoL3YzJywgYmxvY2tlZDogZmFsc2V9XG4gICAgICAgIF07XG4gICAgICAgIGxldCBmaWx0ZXJlZEVhID0gW107XG5cbiAgICAgICAgaWYgKCF0aGlzLl9zZGsucHJvZCkge1xuICAgICAgICAgICAgZWEgPSBbXG4gICAgICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzIwMS92MycsIGJsb2NrZWQ6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cHM6Ly9maWRqLXNhbmRib3guaGVyb2t1YXBwLmNvbS92MycsIGJsb2NrZWQ6IGZhbHNlfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBhd2FpdCB0aGlzLmdldEFjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSk7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHZhbCkuYXBpcztcbiAgICAgICAgICAgIGlmIChhcGlFbmRwb2ludHMgJiYgYXBpRW5kcG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVhID0gW107XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKSB7XG4gICAgICAgICAgICBjb25zdCBhcGlFbmRwb2ludHM6IEVuZHBvaW50SW50ZXJmYWNlW10gPSBKU09OLnBhcnNlKHRoaXMuZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKHthcGlzOiBbXX0pKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYXBpRW5kcG9pbnRzLmZvckVhY2goKGVuZHBvaW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRwb2ludC51cmwgJiYgZWEuZmlsdGVyKChyKSA9PiByLnVybCA9PT0gZW5kcG9pbnQudXJsKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLnNkay5jb25uZWN0aW9uLmdldEFwaUVuZHBvaW50cyA6ICcsIGVhKTtcblxuICAgICAgICBsZXQgY291bGRDaGVja1N0YXRlcyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZWFbaV0udXJsXSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIpIHtcbiAgICAgICAgICAgIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZScpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpICYmIChmaWx0ZXJlZEVhLmxlbmd0aCA9PT0gMCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGVhW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFYS5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbGRPbmUnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJlc3RPbGRPbmU6IEVuZHBvaW50SW50ZXJmYWNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGVhW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5sYXN0VGltZVdhc09rICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoIWJlc3RPbGRPbmUgfHwgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5sYXN0VGltZVdhc09rID4gdGhpcy5zdGF0ZXNbYmVzdE9sZE9uZS51cmxdLmxhc3RUaW1lV2FzT2spKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RPbGRPbmUgPSBlbmRwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYmVzdE9sZE9uZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goYmVzdE9sZE9uZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChlYS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goZWFbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyZWRFYSA9IGVhO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkRWE7XG4gICAgfTtcblxuICAgIGFzeW5jIGdldERCcyhvcHRpb25zPzogQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxFbmRwb2ludEludGVyZmFjZVtdPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2RvIHRlc3QgcmFuZG9tIERCIGNvbm5lY3Rpb25cbiAgICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAlIDI7XG4gICAgICAgIGxldCBkYnMgPSBKU09OLnBhcnNlKGF3YWl0IHRoaXMuZ2V0QWNjZXNzUGF5bG9hZCh7ZGJzOiBbXX0pKS5kYnMgfHwgW107XG5cbiAgICAgICAgLy8gbmVlZCB0byBzeW5jaHJvbml6ZSBkYlxuICAgICAgICBpZiAocmFuZG9tID09PSAwKSB7XG4gICAgICAgICAgICBkYnMgPSBkYnMuc29ydCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHJhbmRvbSA9PT0gMSkge1xuICAgICAgICAgICAgZGJzID0gZGJzLnJldmVyc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWx0ZXJlZERCcyA9IFtdO1xuICAgICAgICBsZXQgY291bGRDaGVja1N0YXRlcyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBkYnMubGVuZ3RoKSAmJiBjb3VsZENoZWNrU3RhdGVzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW2Ric1tpXS51cmxdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZScpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpICYmIChmaWx0ZXJlZERCcy5sZW5ndGggPT09IDApOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGRic1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkREJzLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lcycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRwb2ludCA9IGRic1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkREJzLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZScgJiYgZGJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChkYnNbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyZWREQnMgPSBkYnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWREQnM7XG4gICAgfTtcblxuICAgIHByaXZhdGUgYXN5bmMgdmVyaWZ5QXBpU3RhdGUoY3VycmVudFRpbWU6IG51bWJlciwgZW5kcG9pbnRVcmw6IHN0cmluZykge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouc2RrLmNvbm5lY3Rpb24udmVyaWZ5QXBpU3RhdGUgOiAnLCBjdXJyZW50VGltZSwgZW5kcG9pbnRVcmwpO1xuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGVuZHBvaW50VXJsICsgJy9zdGF0dXM/aXNPaz0nICsgdGhpcy5fc2RrLnZlcnNpb24sXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuaXNPaykge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXSA9IHtzdGF0ZTogc3RhdGUsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBjdXJyZW50VGltZX07XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouc2RrLmNvbm5lY3Rpb24udmVyaWZ5QXBpU3RhdGUgPiBzdGF0ZXMgOiAnLCB0aGlzLnN0YXRlcyk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsZXQgbGFzdFRpbWVXYXNPayA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdKSB7XG4gICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXS5sYXN0VGltZVdhc09rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBmYWxzZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGxhc3RUaW1lV2FzT2t9O1xuXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLnNkay5jb25uZWN0aW9uLnZlcmlmeUFwaVN0YXRlID4gY2F0Y2ggcGIgIC0gc3RhdGVzIDogJywgZXJyLCB0aGlzLnN0YXRlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHZlcmlmeURiU3RhdGUoY3VycmVudFRpbWU6IG51bWJlciwgZGJFbmRwb2ludDogc3RyaW5nKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2ZXJpZnlEYlN0YXRlOiAnLCBkYkVuZHBvaW50KTtcbiAgICAgICAgICAgIGF3YWl0IG5ldyBBamF4KClcbiAgICAgICAgICAgICAgICAuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBkYkVuZHBvaW50LFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0gPSB7c3RhdGU6IHRydWUsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBjdXJyZW50VGltZX07XG4gICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmVyaWZ5RGJTdGF0ZTogc3RhdGUnLCBkYkVuZHBvaW50LCB0cnVlKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxldCBsYXN0VGltZVdhc09rID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSkge1xuICAgICAgICAgICAgICAgIGxhc3RUaW1lV2FzT2sgPSB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XS5sYXN0VGltZVdhc09rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZGJFbmRwb2ludF0gPSB7c3RhdGU6IGZhbHNlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogbGFzdFRpbWVXYXNPa307XG4gICAgICAgICAgICAvLyByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB2ZXJpZnlDb25uZWN0aW9uU3RhdGVzKCk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICAgIC8vIHRvZG8gbmVlZCB2ZXJpZmljYXRpb24gPyBub3QgeWV0IChjYWNoZSlcbiAgICAgICAgLy8gaWYgKE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vICAgICBjb25zdCB0aW1lID0gdGhpcy5zdGF0ZXNbT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpWzBdXS50aW1lO1xuICAgICAgICAvLyAgICAgaWYgKGN1cnJlbnRUaW1lIDwgdGltZSkge1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIHZlcmlmeSB2aWEgR0VUIHN0YXR1cyBvbiBFbmRwb2ludHMgJiBEQnNcbiAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICAgICAgLy8gdGhpcy5zdGF0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5hcGlzID0gYXdhaXQgdGhpcy5nZXRBcGlFbmRwb2ludHMoKTtcbiAgICAgICAgdGhpcy5hcGlzLmZvckVhY2goKGVuZHBvaW50T2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgZW5kcG9pbnRVcmw6IHN0cmluZyA9IGVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZW5kcG9pbnRVcmwpIHtcbiAgICAgICAgICAgICAgICBlbmRwb2ludFVybCA9IGVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMudmVyaWZ5QXBpU3RhdGUoY3VycmVudFRpbWUsIGVuZHBvaW50VXJsKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRicyA9IGF3YWl0IHRoaXMuZ2V0REJzKCk7XG4gICAgICAgIGRicy5mb3JFYWNoKChkYkVuZHBvaW50T2JqKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGJFbmRwb2ludDogc3RyaW5nID0gZGJFbmRwb2ludE9iai51cmw7XG4gICAgICAgICAgICBpZiAoIWRiRW5kcG9pbnQpIHtcbiAgICAgICAgICAgICAgICBkYkVuZHBvaW50ID0gZGJFbmRwb2ludE9iai50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLnZlcmlmeURiU3RhdGUoY3VycmVudFRpbWUsIGRiRW5kcG9pbnQpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfTtcblxufVxuIl19