import { __awaiter } from "tslib";
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
    destroy(force) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.client.logout();
            }
            this.accessToken = null;
            this.idToken = null;
            this.refreshToken = null;
            this.states = {}; // new Map<string, boolean>();
        });
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
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getClient().logout(this.refreshToken);
        });
    }
    getClientId() {
        if (!this.client) {
            return null;
        }
        return this.client.clientId;
    }
    getIdToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.idToken;
        });
    }
    getIdPayload(def) {
        return __awaiter(this, void 0, void 0, function* () {
            const idToken = yield this.getIdToken();
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
        });
    }
    getAccessPayload(def) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
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
    refreshConnection() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const refreshToken = yield this.getClient().reAuthenticate(this.refreshToken);
            const previousIdToken = new ClientToken(this.getClientId(), 'idToken', this.idToken);
            const previousAccessToken = new ClientToken(this.getClientId(), 'accessToken', this.accessToken);
            const clientTokens = new ClientTokens(this.getClientId(), previousIdToken, previousAccessToken, refreshToken);
            yield this.setConnection(clientTokens);
            return this.getUser();
        });
    }
    ;
    setConnection(clientTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            // only in private storage
            if (clientTokens.accessToken) {
                this.accessToken = clientTokens.accessToken.data;
                this._storage.set(Connection._accessToken, this.accessToken);
                const salt = JSON.parse(yield this.getAccessPayload({ salt: '' })).salt;
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
            const clientUser = new ClientUser(clientTokens.username, clientTokens.username, JSON.parse(yield this.getIdPayload({ roles: [] })).roles, JSON.parse(yield this.getIdPayload({ message: '' })).message);
            this.setUser(clientUser);
        });
    }
    ;
    setConnectionOffline(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
            this.setUser(new ClientUser('demo', 'demo', JSON.parse(yield this.getIdPayload({ roles: [] })).roles, JSON.parse(yield this.getIdPayload({ message: '' })).message));
        });
    }
    getApiEndpoints(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // todo : let ea = ['https://fidj/v3', 'https://fidj-proxy.herokuapp.com/v3'];
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
                const val = yield this.getAccessPayload({ apis: [] });
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
        });
    }
    ;
    getDBs(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.accessToken) {
                return [];
            }
            // todo test random DB connection
            const random = Math.random() % 2;
            let dbs = JSON.parse(yield this.getAccessPayload({ dbs: [] })).dbs || [];
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
        });
    }
    ;
    verifyApiState(currentTime, endpointUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._logger.log('fidj.sdk.connection.verifyApiState : ', currentTime, endpointUrl);
                const data = yield new Ajax()
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
        });
    }
    verifyDbState(currentTime, dbEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('verifyDbState: ', dbEndpoint);
                yield new Ajax()
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
        });
    }
    verifyConnectionStates() {
        return __awaiter(this, void 0, void 0, function* () {
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
            this.apis = yield this.getApiEndpoints();
            this.apis.forEach((endpointObj) => {
                let endpointUrl = endpointObj.url;
                if (!endpointUrl) {
                    endpointUrl = endpointObj.toString();
                }
                promises.push(this.verifyApiState(currentTime, endpointUrl));
            });
            const dbs = yield this.getDBs();
            dbs.forEach((dbEndpointObj) => {
                let dbEndpoint = dbEndpointObj.url;
                if (!dbEndpoint) {
                    dbEndpoint = dbEndpointObj.toString();
                }
                promises.push(this.verifyDbState(currentTime, dbEndpoint));
            });
            return Promise.all(promises);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvbWxlcHJldm9zdC9Xb3Jrc3BhY2Uvb2ZpZGovZmlkai9zcmMvIiwic291cmNlcyI6WyJjb25uZWN0aW9uL2Nvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBQyxNQUFNLEVBQWdCLEdBQUcsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBaUMsTUFBTSxjQUFjLENBQUM7QUFDbkcsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUVuQyxNQUFNLE9BQU8sVUFBVTtJQXlCbkIsWUFBb0IsSUFBa0IsRUFDbEIsUUFBc0IsRUFDdEIsT0FBd0I7UUFGeEIsU0FBSSxHQUFKLElBQUksQ0FBYztRQUNsQixhQUFRLEdBQVIsUUFBUSxDQUFjO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ3hDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNwRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDNUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyx3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QUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUMxQixJQUFJLFVBQVUsR0FBVyxhQUFhLENBQUMsR0FBRyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNiLFVBQVUsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQ3pDO2dCQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMvRCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxDQUFDO0tBQUE7SUFBQSxDQUFDOztBQWxsQmEsdUJBQVksR0FBRyxnQkFBZ0IsQ0FBQztBQUNoQywrQkFBb0IsR0FBRyx3QkFBd0IsQ0FBQztBQUNoRCxtQkFBUSxHQUFHLFlBQVksQ0FBQztBQUN4Qix3QkFBYSxHQUFHLGlCQUFpQixDQUFDO0FBQ2xDLGtCQUFPLEdBQUcsV0FBVyxDQUFDO0FBQ3RCLHNCQUFXLEdBQUcsZUFBZSxDQUFDO0FBQzlCLDBCQUFlLEdBQUcsb0JBQW9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NsaWVudH0gZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHtNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLCBTZGtJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgTG9nZ2VySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5pbXBvcnQge0Jhc2U2NCwgTG9jYWxTdG9yYWdlLCBYb3J9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7Q2xpZW50VG9rZW4sIENsaWVudFRva2VucywgQ2xpZW50VXNlciwgQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi4vc2RrL2Vycm9yJztcblxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb24ge1xuXG4gICAgcHVibGljIGZpZGpJZDogc3RyaW5nO1xuICAgIHB1YmxpYyBmaWRqVmVyc2lvbjogc3RyaW5nO1xuICAgIHB1YmxpYyBmaWRqQ3J5cHRvOiBib29sZWFuO1xuICAgIHB1YmxpYyBhY2Nlc3NUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyBhY2Nlc3NUb2tlblByZXZpb3VzOiBzdHJpbmc7XG4gICAgcHVibGljIGlkVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgcmVmcmVzaFRva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIHN0YXRlczogeyBbczogc3RyaW5nXTogeyBzdGF0ZTogYm9vbGVhbiwgdGltZTogbnVtYmVyLCBsYXN0VGltZVdhc09rOiBudW1iZXIgfTsgfTsgLy8gTWFwPHN0cmluZywgYm9vbGVhbj47XG4gICAgcHVibGljIGFwaXM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPjtcblxuICAgIHByaXZhdGUgY3J5cHRvU2FsdDogc3RyaW5nO1xuICAgIHByaXZhdGUgY3J5cHRvU2FsdE5leHQ6IHN0cmluZztcbiAgICBwcml2YXRlIGNsaWVudDogQ2xpZW50O1xuICAgIHByaXZhdGUgdXNlcjogQ2xpZW50VXNlcjtcblxuICAgIHByaXZhdGUgc3RhdGljIF9hY2Nlc3NUb2tlbiA9ICd2Mi5hY2Nlc3NUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2FjY2Vzc1Rva2VuUHJldmlvdXMgPSAndjIuYWNjZXNzVG9rZW5QcmV2aW91cyc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2lkVG9rZW4gPSAndjIuaWRUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3JlZnJlc2hUb2tlbiA9ICd2Mi5yZWZyZXNoVG9rZW4nO1xuICAgIHByaXZhdGUgc3RhdGljIF9zdGF0ZXMgPSAndjIuc3RhdGVzJztcbiAgICBwcml2YXRlIHN0YXRpYyBfY3J5cHRvU2FsdCA9ICd2Mi5jcnlwdG9TYWx0JztcbiAgICBwcml2YXRlIHN0YXRpYyBfY3J5cHRvU2FsdE5leHQgPSAndjIuY3J5cHRvU2FsdC5uZXh0JztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3NkazogU2RrSW50ZXJmYWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX3N0b3JhZ2U6IExvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9sb2dnZXI6IExvZ2dlckludGVyZmFjZSkge1xuICAgICAgICB0aGlzLmNsaWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdCA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHQpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCkgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLl9zdG9yYWdlLmdldCgndjIuYWNjZXNzVG9rZW5QcmV2aW91cycpIHx8IG51bGw7XG4gICAgICAgIHRoaXMuaWRUb2tlbiA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2lkVG9rZW4pIHx8IG51bGw7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuKSB8fCBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX3N0YXRlcykgfHwge307XG4gICAgICAgIHRoaXMuYXBpcyA9IFtdO1xuICAgIH07XG5cbiAgICBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5pc1JlYWR5KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVzdHJveShmb3JjZT86IGJvb2xlYW4pIHtcblxuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4pO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9zdGF0ZXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMgPSB0aGlzLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW5QcmV2aW91cywgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlblByZXZpb3VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgLy8gdGhpcy5jbGllbnQuc2V0Q2xpZW50SWQobnVsbCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNsaWVudC5sb2dvdXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXRlcyA9IHt9OyAvLyBuZXcgTWFwPHN0cmluZywgYm9vbGVhbj4oKTtcbiAgICB9XG5cbiAgICBzZXRDbGllbnQoY2xpZW50OiBDbGllbnQpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICAgICAgLy9pZiAoIXRoaXMudXNlcikge1xuICAgICAgICAvLyAgICB0aGlzLnVzZXIgPSBuZXcgQ2xpZW50VXNlcigpO1xuICAgICAgICAvL31cblxuICAgICAgICAvLyB0aGlzLl91c2VyLl9pZCA9IHRoaXMuX2NsaWVudC5jbGllbnRJZDtcbiAgICAgICAgLy90aGlzLnVzZXIuX25hbWUgPSBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHtuYW1lOiAnJ30pKS5uYW1lO1xuICAgIH1cblxuICAgIHNldFVzZXIodXNlcjogQ2xpZW50VXNlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICBpZiAodGhpcy5jbGllbnQgJiYgdGhpcy51c2VyLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5zZXRDbGllbnRJZCh0aGlzLnVzZXIuaWQpO1xuXG4gICAgICAgICAgICAvLyBzdG9yZSBvbmx5IGNsaWVudElkXG4gICAgICAgICAgICAvLyBkZWxldGUgdGhpcy51c2VyLl9pZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFVzZXIoKTogQ2xpZW50VXNlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXI7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50KCk6IENsaWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudDtcbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdCAhPT0gdmFsdWUgJiYgdGhpcy5jcnlwdG9TYWx0TmV4dCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0LCB0aGlzLmNyeXB0b1NhbHROZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDcnlwdG9TYWx0QXNWZXJpZmllZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgIHRoaXMuY3J5cHRvU2FsdCA9IHRoaXMuY3J5cHRvU2FsdE5leHQ7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9jcnlwdG9TYWx0LCB0aGlzLmNyeXB0b1NhbHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3J5cHRvU2FsdE5leHQgPSBudWxsO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0TmV4dCk7XG4gICAgfVxuXG4gICAgZW5jcnlwdChkYXRhOiBhbnkpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBc09iaiA9IHtzdHJpbmc6IGRhdGF9O1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGFBc09iaik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgcmV0dXJuIFhvci5lbmNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlY3J5cHQoZGF0YTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgbGV0IGRlY3J5cHRlZCA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0TmV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdE5leHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgKGRlY3J5cHRlZCkge1xuICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCAmJiB0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jcnlwdG9TYWx0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXksIHRydWUpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBpZiAoIWRlY3J5cHRlZCkge1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkZWNyeXB0ZWQgJiYgZGVjcnlwdGVkLnN0cmluZykge1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IGRlY3J5cHRlZC5zdHJpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlY3J5cHRlZDtcbiAgICB9XG5cbiAgICBpc0xvZ2luKCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZXhwID0gdHJ1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLnJlZnJlc2hUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IEpTT04ucGFyc2UoQmFzZTY0LmRlY29kZShwYXlsb2FkKSk7XG4gICAgICAgICAgICBleHAgPSAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPj0gZGVjb2RlZC5leHApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIWV4cDtcbiAgICB9XG5cbiAgICAvLyB0b2RvIHJlaW50ZWdyYXRlIGNsaWVudC5sb2dpbigpXG5cbiAgICBhc3luYyBsb2dvdXQoKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50KCkubG9nb3V0KHRoaXMucmVmcmVzaFRva2VuKTtcbiAgICB9XG5cbiAgICBnZXRDbGllbnRJZCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuY2xpZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnQuY2xpZW50SWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0SWRUb2tlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRUb2tlbjtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRJZFBheWxvYWQoZGVmPzogYW55KSB7XG5cbiAgICAgICAgY29uc3QgaWRUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0SWRUb2tlbigpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgcGF5bG9hZDtcbiAgICAgICAgICAgIGlmIChpZFRva2VuKSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZCA9IGlkVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouY29ubmVjdGlvbi5nZXRJZFBheWxvYWQgcGI6ICcsIGRlZiwgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVmKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEFjY2Vzc1BheWxvYWQoZGVmPzogYW55KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgaWYgKGRlZiAmJiB0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGVmID0gSlNPTi5zdHJpbmdpZnkoZGVmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5hY2Nlc3NUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYgPyBkZWYgOiBudWxsO1xuICAgIH1cblxuICAgIGdldFByZXZpb3VzQWNjZXNzUGF5bG9hZChkZWY/OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoZGVmICYmIHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMuc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmID8gZGVmIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdGhyb3dzIEVycm9ySW50ZXJmYWNlXG4gICAgICovXG4gICAgYXN5bmMgcmVmcmVzaENvbm5lY3Rpb24oKTogUHJvbWlzZTxDbGllbnRVc2VyPiB7XG5cbiAgICAgICAgLy8gc3RvcmUgc3RhdGVzXG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3N0YXRlcywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIC8vIHRva2VuIG5vdCBleHBpcmVkIDogb2tcbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGNvbnN0IG5vdEV4cGlyZWQgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA8IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25ldyBEYXRlKCkuZ2V0VGltZSgpIDwgSlNPTi5wYXJzZShkZWNvZGVkKS5leHAgOicsIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCk7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLmNvbm5lY3Rpb24uY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbiA6IHRva2VuIG5vdCBleHBpcmVkID8gJywgbm90RXhwaXJlZCk7XG4gICAgICAgICAgICBpZiAobm90RXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4cGlyZWQgcmVmcmVzaFRva2VuXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZWQgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBKU09OLnBhcnNlKGRlY29kZWQpLmV4cDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouY29ubmVjdGlvbi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uIDogcmVmcmVzaFRva2VuIG5vdCBleHBpcmVkID8gJywgZXhwaXJlZCk7XG4gICAgICAgICAgICBpZiAoZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCBhY2Nlc3NUb2tlbiAmIGlkVG9rZW4gJiBzdG9yZSBpdCBhcyBQcmV2aW91cyBvbmVcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcblxuICAgICAgICAvLyByZWZyZXNoIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouY29ubmVjdGlvbi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uIDogcmVmcmVzaCBhdXRoZW50aWNhdGlvbi4nKTtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5nZXRDbGllbnQoKTtcbiAgICAgICAgaWYgKCFjbGllbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcig0MDAsICdOZWVkIGFuIGluaXRpYWxpemVkIGNsaWVudC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbjogQ2xpZW50VG9rZW4gPSBhd2FpdCB0aGlzLmdldENsaWVudCgpLnJlQXV0aGVudGljYXRlKHRoaXMucmVmcmVzaFRva2VuKTtcblxuICAgICAgICBjb25zdCBwcmV2aW91c0lkVG9rZW4gPSBuZXcgQ2xpZW50VG9rZW4odGhpcy5nZXRDbGllbnRJZCgpLCAnaWRUb2tlbicsIHRoaXMuaWRUb2tlbik7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzQWNjZXNzVG9rZW4gPSBuZXcgQ2xpZW50VG9rZW4odGhpcy5nZXRDbGllbnRJZCgpLCAnYWNjZXNzVG9rZW4nLCB0aGlzLmFjY2Vzc1Rva2VuKTtcbiAgICAgICAgY29uc3QgY2xpZW50VG9rZW5zID0gbmV3IENsaWVudFRva2Vucyh0aGlzLmdldENsaWVudElkKCksIHByZXZpb3VzSWRUb2tlbiwgcHJldmlvdXNBY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuKTtcbiAgICAgICAgYXdhaXQgdGhpcy5zZXRDb25uZWN0aW9uKGNsaWVudFRva2Vucyk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFVzZXIoKTtcbiAgICB9O1xuXG4gICAgYXN5bmMgc2V0Q29ubmVjdGlvbihjbGllbnRUb2tlbnM6IENsaWVudFRva2Vucykge1xuXG4gICAgICAgIC8vIG9ubHkgaW4gcHJpdmF0ZSBzdG9yYWdlXG4gICAgICAgIGlmIChjbGllbnRUb2tlbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBjbGllbnRUb2tlbnMuYWNjZXNzVG9rZW4uZGF0YTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuLCB0aGlzLmFjY2Vzc1Rva2VuKTtcblxuICAgICAgICAgICAgY29uc3Qgc2FsdDogc3RyaW5nID0gSlNPTi5wYXJzZShhd2FpdCB0aGlzLmdldEFjY2Vzc1BheWxvYWQoe3NhbHQ6ICcnfSkpLnNhbHQ7XG4gICAgICAgICAgICBpZiAoc2FsdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3J5cHRvU2FsdChzYWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpZW50VG9rZW5zLmlkVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IGNsaWVudFRva2Vucy5pZFRva2VuLmRhdGE7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9pZFRva2VuLCB0aGlzLmlkVG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRUb2tlbnMucmVmcmVzaFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IGNsaWVudFRva2Vucy5yZWZyZXNoVG9rZW4uZGF0YTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbiwgdGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3RvcmUgY2hhbmdlZCBzdGF0ZXNcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fc3RhdGVzLCB0aGlzLnN0YXRlcyk7XG5cbiAgICAgICAgLy8gZXhwb3NlIHJvbGVzLCBtZXNzYWdlXG4gICAgICAgIGNvbnN0IGNsaWVudFVzZXIgPSBuZXcgQ2xpZW50VXNlcihcbiAgICAgICAgICAgIGNsaWVudFRva2Vucy51c2VybmFtZSwgY2xpZW50VG9rZW5zLnVzZXJuYW1lLFxuICAgICAgICAgICAgSlNPTi5wYXJzZShhd2FpdCB0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzLFxuICAgICAgICAgICAgSlNPTi5wYXJzZShhd2FpdCB0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZSk7XG4gICAgICAgIHRoaXMuc2V0VXNlcihjbGllbnRVc2VyKTtcbiAgICB9O1xuXG4gICAgYXN5bmMgc2V0Q29ubmVjdGlvbk9mZmxpbmUob3B0aW9uczogTW9kdWxlU2VydmljZUxvZ2luT3B0aW9uc0ludGVyZmFjZSkge1xuXG4gICAgICAgIGlmIChvcHRpb25zLmFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gb3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuLCB0aGlzLmFjY2Vzc1Rva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pZFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmlkVG9rZW4gPSBvcHRpb25zLmlkVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9pZFRva2VuLCB0aGlzLmlkVG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSBvcHRpb25zLnJlZnJlc2hUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbiwgdGhpcy5yZWZyZXNoVG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRVc2VyKG5ldyBDbGllbnRVc2VyKCdkZW1vJywgJ2RlbW8nLFxuICAgICAgICAgICAgSlNPTi5wYXJzZShhd2FpdCB0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzLFxuICAgICAgICAgICAgSlNPTi5wYXJzZShhd2FpdCB0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZSkpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEFwaUVuZHBvaW50cyhvcHRpb25zPzogQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxBcnJheTxFbmRwb2ludEludGVyZmFjZT4+IHtcblxuICAgICAgICAvLyB0b2RvIDogbGV0IGVhID0gWydodHRwczovL2ZpZGovdjMnLCAnaHR0cHM6Ly9maWRqLXByb3h5Lmhlcm9rdWFwcC5jb20vdjMnXTtcbiAgICAgICAgbGV0IGVhOiBFbmRwb2ludEludGVyZmFjZVtdID0gW1xuICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHBzOi8vYXBpLmZpZGoub3ZoL3YzJywgYmxvY2tlZDogZmFsc2V9XTtcbiAgICAgICAgbGV0IGZpbHRlcmVkRWEgPSBbXTtcblxuICAgICAgICBpZiAoIXRoaXMuX3Nkay5wcm9kKSB7XG4gICAgICAgICAgICBlYSA9IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDozMjAxL3YzJywgYmxvY2tlZDogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwczovL2ZpZGotc2FuZGJveC5oZXJva3VhcHAuY29tL3YzJywgYmxvY2tlZDogZmFsc2V9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzUGF5bG9hZCh7YXBpczogW119KTtcbiAgICAgICAgICAgIGNvbnN0IGFwaUVuZHBvaW50czogRW5kcG9pbnRJbnRlcmZhY2VbXSA9IEpTT04ucGFyc2UodmFsKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZWEgPSBbXTtcbiAgICAgICAgICAgICAgICBhcGlFbmRwb2ludHMuZm9yRWFjaCgoZW5kcG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZHBvaW50LnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGFwaUVuZHBvaW50czogRW5kcG9pbnRJbnRlcmZhY2VbXSA9IEpTT04ucGFyc2UodGhpcy5nZXRQcmV2aW91c0FjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSkpLmFwaXM7XG4gICAgICAgICAgICBpZiAoYXBpRW5kcG9pbnRzICYmIGFwaUVuZHBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhcGlFbmRwb2ludHMuZm9yRWFjaCgoZW5kcG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZHBvaW50LnVybCAmJiBlYS5maWx0ZXIoKHIpID0+IHIudXJsID09PSBlbmRwb2ludC51cmwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouc2RrLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzIDogJywgZWEpO1xuXG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgY291bGRDaGVja1N0YXRlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1tlYVtpXS51cmxdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlcikge1xuICAgICAgICAgICAgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgKGZpbHRlcmVkRWEubGVuZ3RoID09PSAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLnN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVhLnB1c2goZW5kcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9sZE9uZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmVzdE9sZE9uZTogRW5kcG9pbnRJbnRlcmZhY2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZWFbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICghYmVzdE9sZE9uZSB8fCB0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdLmxhc3RUaW1lV2FzT2sgPiB0aGlzLnN0YXRlc1tiZXN0T2xkT25lLnVybF0ubGFzdFRpbWVXYXNPaykpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdE9sZE9uZSA9IGVuZHBvaW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZXN0T2xkT25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChiZXN0T2xkT25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChlYVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZEVhID0gZWE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVyZWRFYTtcbiAgICB9O1xuXG4gICAgYXN5bmMgZ2V0REJzKG9wdGlvbnM/OiBDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPEVuZHBvaW50SW50ZXJmYWNlW10+IHtcblxuICAgICAgICBpZiAoIXRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZG8gdGVzdCByYW5kb20gREIgY29ubmVjdGlvblxuICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICUgMjtcbiAgICAgICAgbGV0IGRicyA9IEpTT04ucGFyc2UoYXdhaXQgdGhpcy5nZXRBY2Nlc3NQYXlsb2FkKHtkYnM6IFtdfSkpLmRicyB8fCBbXTtcblxuICAgICAgICAvLyBuZWVkIHRvIHN5bmNocm9uaXplIGRiXG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICAgIGRicyA9IGRicy5zb3J0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAocmFuZG9tID09PSAxKSB7XG4gICAgICAgICAgICBkYnMgPSBkYnMucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpbHRlcmVkREJzID0gW107XG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGRicy5sZW5ndGgpICYmIGNvdWxkQ2hlY2tTdGF0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZXNbZGJzW2ldLnVybF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb3VsZENoZWNrU3RhdGVzICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCkgJiYgKGZpbHRlcmVkREJzLmxlbmd0aCA9PT0gMCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmVzJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZHBvaW50ID0gZGJzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludC51cmxdICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWREQnMucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T25lJyAmJiBkYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGRic1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERCcyA9IGRicztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERCcztcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBhc3luYyB2ZXJpZnlBcGlTdGF0ZShjdXJyZW50VGltZTogbnVtYmVyLCBlbmRwb2ludFVybDogc3RyaW5nKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZygnZmlkai5zZGsuY29ubmVjdGlvbi52ZXJpZnlBcGlTdGF0ZSA6ICcsIGN1cnJlbnRUaW1lLCBlbmRwb2ludFVybCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBuZXcgQWpheCgpXG4gICAgICAgICAgICAgICAgLmdldCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRVcmwgKyAnL3N0YXR1cz9pc09rPScgKyB0aGlzLl9zZGsudmVyc2lvbixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbid9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5pc09rKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdID0ge3N0YXRlOiBzdGF0ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcblxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZygnZmlkai5zZGsuY29ubmVjdGlvbi52ZXJpZnlBcGlTdGF0ZSA+IHN0YXRlcyA6ICcsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGxldCBsYXN0VGltZVdhc09rID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0pIHtcbiAgICAgICAgICAgICAgICBsYXN0VGltZVdhc09rID0gdGhpcy5zdGF0ZXNbZW5kcG9pbnRVcmxdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0gPSB7c3RhdGU6IGZhbHNlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogbGFzdFRpbWVXYXNPa307XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouc2RrLmNvbm5lY3Rpb24udmVyaWZ5QXBpU3RhdGUgPiBjYXRjaCBwYiAgLSBzdGF0ZXMgOiAnLCBlcnIsIHRoaXMuc3RhdGVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgdmVyaWZ5RGJTdGF0ZShjdXJyZW50VGltZTogbnVtYmVyLCBkYkVuZHBvaW50OiBzdHJpbmcpIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3ZlcmlmeURiU3RhdGU6ICcsIGRiRW5kcG9pbnQpO1xuICAgICAgICAgICAgYXdhaXQgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGRiRW5kcG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogdHJ1ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcbiAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2ZXJpZnlEYlN0YXRlOiBzdGF0ZScsIGRiRW5kcG9pbnQsIHRydWUpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcbiAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgLy8gdG9kbyBuZWVkIHZlcmlmaWNhdGlvbiA/IG5vdCB5ZXQgKGNhY2hlKVxuICAgICAgICAvLyBpZiAoT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHRpbWUgPSB0aGlzLnN0YXRlc1tPYmplY3Qua2V5cyh0aGlzLnN0YXRlcylbMF1dLnRpbWU7XG4gICAgICAgIC8vICAgICBpZiAoY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdmVyaWZ5IHZpYSBHRVQgc3RhdHVzIG9uIEVuZHBvaW50cyAmIERCc1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgICAgICAvLyB0aGlzLnN0YXRlcyA9IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSBhd2FpdCB0aGlzLmdldEFwaUVuZHBvaW50cygpO1xuICAgICAgICB0aGlzLmFwaXMuZm9yRWFjaCgoZW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBlbmRwb2ludFVybDogc3RyaW5nID0gZW5kcG9pbnRPYmoudXJsO1xuICAgICAgICAgICAgaWYgKCFlbmRwb2ludFVybCkge1xuICAgICAgICAgICAgICAgIGVuZHBvaW50VXJsID0gZW5kcG9pbnRPYmoudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2VzLnB1c2godGhpcy52ZXJpZnlBcGlTdGF0ZShjdXJyZW50VGltZSwgZW5kcG9pbnRVcmwpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGJzID0gYXdhaXQgdGhpcy5nZXREQnMoKTtcbiAgICAgICAgZGJzLmZvckVhY2goKGRiRW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBkYkVuZHBvaW50OiBzdHJpbmcgPSBkYkVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZGJFbmRwb2ludCkge1xuICAgICAgICAgICAgICAgIGRiRW5kcG9pbnQgPSBkYkVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMudmVyaWZ5RGJTdGF0ZShjdXJyZW50VGltZSwgZGJFbmRwb2ludCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9O1xuXG59XG4iXX0=