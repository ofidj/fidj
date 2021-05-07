import { __awaiter } from "tslib";
import { Base64, Xor } from '../tools';
import { Ajax } from './ajax';
import { ClientUser } from './interfaces';
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
            this.client.logout();
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
            if (!decrypted && this.fidjCrypto && this.cryptoSaltNext) {
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
        return this.getClient().logout(this.refreshToken);
    }
    getClientId() {
        if (!this.client) {
            return null;
        }
        return this.client.clientId;
    }
    getIdToken() {
        return this.idToken;
    }
    getIdPayload(def) {
        const idToken = this.getIdToken();
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
    getAccessPayload(def) {
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
    refreshConnection() {
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
        return new Promise((resolve, reject) => {
            const client = this.getClient();
            if (!client) {
                return reject(new Error(400, 'Need an initialized client.'));
            }
            this.getClient().reAuthenticate(this.refreshToken)
                .then((clientTokens) => {
                this.setConnection(clientTokens);
                resolve(this.getUser());
            })
                .catch(err => {
                // if (err && err.code === 408) {
                //     code = 408; // no api uri or basic timeout : offline
                // } else if (err && err.code === 404) {
                //     code = 404; // page not found : offline
                // } else if (err && err.code === 410) {
                //     code = 403; // token expired or device not sure : need relogin
                // } else if (err) {
                //     code = 403; // forbidden : need relogin
                // }
                // resolve(code);
                reject(err);
            });
        });
    }
    ;
    setConnection(clientTokens) {
        // only in private storage
        if (clientTokens.accessToken) {
            this.accessToken = clientTokens.accessToken.data;
            this._storage.set(Connection._accessToken, this.accessToken);
            const salt = JSON.parse(this.getAccessPayload({ salt: '' })).salt;
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
        const clientUser = new ClientUser(clientTokens.username, clientTokens.username, JSON.parse(this.getIdPayload({ roles: [] })).roles, JSON.parse(this.getIdPayload({ message: '' })).message);
        this.setUser(clientUser);
    }
    ;
    setConnectionOffline(options) {
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
        this.setUser(new ClientUser('demo', 'demo', JSON.parse(this.getIdPayload({ roles: [] })).roles, JSON.parse(this.getIdPayload({ message: '' })).message));
    }
    getApiEndpoints(options) {
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
            const val = this.getAccessPayload({ apis: [] });
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
    getDBs(options) {
        if (!this.accessToken) {
            return [];
        }
        // todo test random DB connection
        const random = Math.random() % 2;
        let dbs = JSON.parse(this.getAccessPayload({ dbs: [] })).dbs || [];
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
                const data = yield new Ajax()
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
        this.apis = this.getApiEndpoints();
        this.apis.forEach((endpointObj) => {
            let endpointUrl = endpointObj.url;
            if (!endpointUrl) {
                endpointUrl = endpointObj.toString();
            }
            promises.push(this.verifyApiState(currentTime, endpointUrl));
        });
        const dbs = this.getDBs();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvbWxlcHJldm9zdC9Xb3Jrc3BhY2Uvb2ZpZGovZmlkai9zcmMvIiwic291cmNlcyI6WyJjb25uZWN0aW9uL2Nvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBQyxNQUFNLEVBQWdCLEdBQUcsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBZSxVQUFVLEVBQWlDLE1BQU0sY0FBYyxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFbkMsTUFBTSxPQUFPLFVBQVU7SUF5Qm5CLFlBQW9CLElBQWtCLEVBQ2xCLFFBQXNCLEVBQ3RCLE9BQXdCO1FBRnhCLFNBQUksR0FBSixJQUFJLENBQWM7UUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQUN0QixZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDcEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQzVFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN0RSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsSUFBSSxJQUFJ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RSxFQUFFO1lBQzFCLElBQUksVUFBVSxHQUFXLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFDM0MsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDYixVQUFVLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ3pDO1lBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFBQSxDQUFDOztBQWhtQmEsdUJBQVksR0FBRyxnQkFBZ0IsQ0FBQztBQUNoQywrQkFBb0IsR0FBRyx3QkFBd0IsQ0FBQztBQUNoRCxtQkFBUSxHQUFHLFlBQVksQ0FBQztBQUN4Qix3QkFBYSxHQUFHLGlCQUFpQixDQUFDO0FBQ2xDLGtCQUFPLEdBQUcsV0FBVyxDQUFDO0FBQ3RCLHNCQUFXLEdBQUcsZUFBZSxDQUFDO0FBQzlCLDBCQUFlLEdBQUcsb0JBQW9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NsaWVudH0gZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHtNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlLCBTZGtJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlLCBFbmRwb2ludEludGVyZmFjZSwgTG9nZ2VySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5pbXBvcnQge0Jhc2U2NCwgTG9jYWxTdG9yYWdlLCBYb3J9IGZyb20gJy4uL3Rvb2xzJztcbmltcG9ydCB7QWpheH0gZnJvbSAnLi9hamF4JztcbmltcG9ydCB7Q2xpZW50VG9rZW5zLCBDbGllbnRVc2VyLCBDb25uZWN0aW9uRmluZE9wdGlvbnNJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQge0Vycm9yfSBmcm9tICcuLi9zZGsvZXJyb3InO1xuXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbiB7XG5cbiAgICBwdWJsaWMgZmlkaklkOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIGZpZGpDcnlwdG86IGJvb2xlYW47XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XG4gICAgcHVibGljIGFjY2Vzc1Rva2VuUHJldmlvdXM6IHN0cmluZztcbiAgICBwdWJsaWMgaWRUb2tlbjogc3RyaW5nO1xuICAgIHB1YmxpYyByZWZyZXNoVG9rZW46IHN0cmluZztcbiAgICBwdWJsaWMgc3RhdGVzOiB7IFtzOiBzdHJpbmddOiB7IHN0YXRlOiBib29sZWFuLCB0aW1lOiBudW1iZXIsIGxhc3RUaW1lV2FzT2s6IG51bWJlciB9OyB9OyAvLyBNYXA8c3RyaW5nLCBib29sZWFuPjtcbiAgICBwdWJsaWMgYXBpczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+O1xuXG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjcnlwdG9TYWx0TmV4dDogc3RyaW5nO1xuICAgIHByaXZhdGUgY2xpZW50OiBDbGllbnQ7XG4gICAgcHJpdmF0ZSB1c2VyOiBDbGllbnRVc2VyO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2FjY2Vzc1Rva2VuID0gJ3YyLmFjY2Vzc1Rva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfYWNjZXNzVG9rZW5QcmV2aW91cyA9ICd2Mi5hY2Nlc3NUb2tlblByZXZpb3VzJztcbiAgICBwcml2YXRlIHN0YXRpYyBfaWRUb2tlbiA9ICd2Mi5pZFRva2VuJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVmcmVzaFRva2VuID0gJ3YyLnJlZnJlc2hUb2tlbic7XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3N0YXRlcyA9ICd2Mi5zdGF0ZXMnO1xuICAgIHByaXZhdGUgc3RhdGljIF9jcnlwdG9TYWx0ID0gJ3YyLmNyeXB0b1NhbHQnO1xuICAgIHByaXZhdGUgc3RhdGljIF9jcnlwdG9TYWx0TmV4dCA9ICd2Mi5jcnlwdG9TYWx0Lm5leHQnO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2RrOiBTZGtJbnRlcmZhY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBfc3RvcmFnZTogTG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgX2xvZ2dlcjogTG9nZ2VySW50ZXJmYWNlKSB7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgdGhpcy5jcnlwdG9TYWx0ID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdCkgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IHRoaXMuX3N0b3JhZ2UuZ2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0KSB8fCBudWxsO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4pIHx8IG51bGw7XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyA9IHRoaXMuX3N0b3JhZ2UuZ2V0KCd2Mi5hY2Nlc3NUb2tlblByZXZpb3VzJykgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5faWRUb2tlbikgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW4gPSB0aGlzLl9zdG9yYWdlLmdldChDb25uZWN0aW9uLl9yZWZyZXNoVG9rZW4pIHx8IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGVzID0gdGhpcy5fc3RvcmFnZS5nZXQoQ29ubmVjdGlvbi5fc3RhdGVzKSB8fCB7fTtcbiAgICAgICAgdGhpcy5hcGlzID0gW107XG4gICAgfTtcblxuICAgIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuY2xpZW50ICYmIHRoaXMuY2xpZW50LmlzUmVhZHkoKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KGZvcmNlPzogYm9vbGVhbik6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuKTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5yZW1vdmUoQ29ubmVjdGlvbi5faWRUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3N0YXRlcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cyA9IHRoaXMuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9hY2Nlc3NUb2tlblByZXZpb3VzLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvcmNlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9jcnlwdG9TYWx0KTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0KTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2FjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICAgICAgICAvLyB0aGlzLmNsaWVudC5zZXRDbGllbnRJZChudWxsKTtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LmxvZ291dCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLmlkVG9rZW4gPSBudWxsO1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGVzID0ge307IC8vIG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuICAgIH1cblxuICAgIHNldENsaWVudChjbGllbnQ6IENsaWVudCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgICAgICAvL2lmICghdGhpcy51c2VyKSB7XG4gICAgICAgIC8vICAgIHRoaXMudXNlciA9IG5ldyBDbGllbnRVc2VyKCk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIC8vIHRoaXMuX3VzZXIuX2lkID0gdGhpcy5fY2xpZW50LmNsaWVudElkO1xuICAgICAgICAvL3RoaXMudXNlci5fbmFtZSA9IEpTT04ucGFyc2UodGhpcy5nZXRJZFBheWxvYWQoe25hbWU6ICcnfSkpLm5hbWU7XG4gICAgfVxuXG4gICAgc2V0VXNlcih1c2VyOiBDbGllbnRVc2VyKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIGlmICh0aGlzLmNsaWVudCAmJiB0aGlzLnVzZXIuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnNldENsaWVudElkKHRoaXMudXNlci5pZCk7XG5cbiAgICAgICAgICAgIC8vIHN0b3JlIG9ubHkgY2xpZW50SWRcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGlzLnVzZXIuX2lkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VXNlcigpOiBDbGllbnRVc2VyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcjtcbiAgICB9XG5cbiAgICBnZXRDbGllbnQoKTogQ2xpZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50O1xuICAgIH1cblxuICAgIHNldENyeXB0b1NhbHQodmFsdWU6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5jcnlwdG9TYWx0ICE9PSB2YWx1ZSAmJiB0aGlzLmNyeXB0b1NhbHROZXh0ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fY3J5cHRvU2FsdE5leHQsIHRoaXMuY3J5cHRvU2FsdE5leHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q3J5cHRvU2FsdEFzVmVyaWZpZWQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCkge1xuICAgICAgICBpZiAodGhpcy5jcnlwdG9TYWx0TmV4dCkge1xuICAgICAgICAgICAgdGhpcy5jcnlwdG9TYWx0ID0gdGhpcy5jcnlwdG9TYWx0TmV4dDtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2NyeXB0b1NhbHQsIHRoaXMuY3J5cHRvU2FsdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jcnlwdG9TYWx0TmV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2NyeXB0b1NhbHROZXh0KTtcbiAgICB9XG5cbiAgICBlbmNyeXB0KGRhdGE6IGFueSk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0YUFzT2JqID0ge3N0cmluZzogZGF0YX07XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YUFzT2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZpZGpDcnlwdG8gJiYgdGhpcy5jcnlwdG9TYWx0KSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICByZXR1cm4gWG9yLmVuY3J5cHQoZGF0YSwga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjcnlwdChkYXRhOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBsZXQgZGVjcnlwdGVkID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdE5leHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHROZXh0O1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IFhvci5kZWNyeXB0KGRhdGEsIGtleSk7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gSlNPTi5wYXJzZShkZWNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgIC8vIGlmIChkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnNldENyeXB0b1NhbHRBc1ZlcmlmaWVkKCk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGRlY3J5cHRlZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQgJiYgdGhpcy5maWRqQ3J5cHRvICYmIHRoaXMuY3J5cHRvU2FsdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuY3J5cHRvU2FsdDtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBYb3IuZGVjcnlwdChkYXRhLCBrZXkpO1xuICAgICAgICAgICAgICAgIGRlY3J5cHRlZCA9IEpTT04ucGFyc2UoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBkZWNyeXB0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghZGVjcnlwdGVkICYmIHRoaXMuZmlkakNyeXB0byAmJiB0aGlzLmNyeXB0b1NhbHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmNyeXB0b1NhbHQ7XG4gICAgICAgICAgICAgICAgZGVjcnlwdGVkID0gWG9yLmRlY3J5cHQoZGF0YSwga2V5LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgaWYgKCFkZWNyeXB0ZWQpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVjcnlwdGVkICYmIGRlY3J5cHRlZC5zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBkZWNyeXB0ZWQgPSBkZWNyeXB0ZWQuc3RyaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZGVjcnlwdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWNyeXB0ZWQ7XG4gICAgfVxuXG4gICAgaXNMb2dpbigpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGV4cCA9IHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gdGhpcy5yZWZyZXNoVG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIGNvbnN0IGRlY29kZWQgPSBKU09OLnBhcnNlKEJhc2U2NC5kZWNvZGUocGF5bG9hZCkpO1xuICAgICAgICAgICAgZXhwID0gKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApID49IGRlY29kZWQuZXhwKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFleHA7XG4gICAgfVxuXG4gICAgLy8gdG9kbyByZWludGVncmF0ZSBjbGllbnQubG9naW4oKVxuXG4gICAgbG9nb3V0KCk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudCgpLmxvZ291dCh0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50SWQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xpZW50LmNsaWVudElkO1xuICAgIH1cblxuICAgIGdldElkVG9rZW4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRUb2tlbjtcbiAgICB9XG5cbiAgICBnZXRJZFBheWxvYWQoZGVmPzogYW55KTogc3RyaW5nIHtcblxuICAgICAgICBjb25zdCBpZFRva2VuID0gdGhpcy5nZXRJZFRva2VuKCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBwYXlsb2FkO1xuICAgICAgICAgICAgaWYgKGlkVG9rZW4pIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gaWRUb2tlbi5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZygnZmlkai5jb25uZWN0aW9uLmdldElkUGF5bG9hZCBwYjogJywgZGVmLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWYpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVmO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0QWNjZXNzUGF5bG9hZChkZWY/OiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoZGVmICYmIHR5cGVvZiBkZWYgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkZWYgPSBKU09OLnN0cmluZ2lmeShkZWYpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZiA/IGRlZiA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0UHJldmlvdXNBY2Nlc3NQYXlsb2FkKGRlZj86IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChkZWYgJiYgdHlwZW9mIGRlZiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlZiA9IEpTT04uc3RyaW5naWZ5KGRlZik7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMuYWNjZXNzVG9rZW5QcmV2aW91cy5zcGxpdCgnLicpWzFdO1xuICAgICAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYgPyBkZWYgOiBudWxsO1xuICAgIH1cblxuICAgIHJlZnJlc2hDb25uZWN0aW9uKCk6IFByb21pc2U8Q2xpZW50VXNlciB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgLy8gc3RvcmUgc3RhdGVzXG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX3N0YXRlcywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIC8vIHRva2VuIG5vdCBleHBpcmVkIDogb2tcbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGNvbnN0IG5vdEV4cGlyZWQgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA8IEpTT04ucGFyc2UoZGVjb2RlZCkuZXhwO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25ldyBEYXRlKCkuZ2V0VGltZSgpIDwgSlNPTi5wYXJzZShkZWNvZGVkKS5leHAgOicsIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLCBKU09OLnBhcnNlKGRlY29kZWQpLmV4cCk7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLmNvbm5lY3Rpb24uY29ubmVjdGlvbi5yZWZyZXNoQ29ubmVjdGlvbiA6IHRva2VuIG5vdCBleHBpcmVkID8gJywgbm90RXhwaXJlZCk7XG4gICAgICAgICAgICBpZiAobm90RXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5nZXRVc2VyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4cGlyZWQgcmVmcmVzaFRva2VuXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hUb2tlbikge1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHRoaXMucmVmcmVzaFRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICBjb25zdCBkZWNvZGVkID0gQmFzZTY0LmRlY29kZShwYXlsb2FkKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyZWQgPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSA+PSBKU09OLnBhcnNlKGRlY29kZWQpLmV4cDtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouY29ubmVjdGlvbi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uIDogcmVmcmVzaFRva2VuIG5vdCBleHBpcmVkID8gJywgZXhwaXJlZCk7XG4gICAgICAgICAgICBpZiAoZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX3JlZnJlc2hUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhwaXJlZCBhY2Nlc3NUb2tlbiAmIGlkVG9rZW4gJiBzdG9yZSBpdCBhcyBQcmV2aW91cyBvbmVcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblByZXZpb3VzID0gdGhpcy5hY2Nlc3NUb2tlbjtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoJ3YyLmFjY2Vzc1Rva2VuUHJldmlvdXMnLCB0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpO1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnJlbW92ZShDb25uZWN0aW9uLl9hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2UucmVtb3ZlKENvbm5lY3Rpb24uX2lkVG9rZW4pO1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5pZFRva2VuID0gbnVsbDtcblxuICAgICAgICAvLyByZWZyZXNoIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouY29ubmVjdGlvbi5jb25uZWN0aW9uLnJlZnJlc2hDb25uZWN0aW9uIDogcmVmcmVzaCBhdXRoZW50aWNhdGlvbi4nKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50KCk7XG5cbiAgICAgICAgICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTmVlZCBhbiBpbml0aWFsaXplZCBjbGllbnQuJykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0Q2xpZW50KCkucmVBdXRoZW50aWNhdGUodGhpcy5yZWZyZXNoVG9rZW4pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGNsaWVudFRva2VuczogQ2xpZW50VG9rZW5zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Q29ubmVjdGlvbihjbGllbnRUb2tlbnMpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZ2V0VXNlcigpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09IDQwOCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwODsgLy8gbm8gYXBpIHVyaSBvciBiYXNpYyB0aW1lb3V0IDogb2ZmbGluZVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjb2RlID0gNDA0OyAvLyBwYWdlIG5vdCBmb3VuZCA6IG9mZmxpbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09IDQxMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29kZSA9IDQwMzsgLy8gdG9rZW4gZXhwaXJlZCBvciBkZXZpY2Ugbm90IHN1cmUgOiBuZWVkIHJlbG9naW5cbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvZGUgPSA0MDM7IC8vIGZvcmJpZGRlbiA6IG5lZWQgcmVsb2dpblxuICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzb2x2ZShjb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzZXRDb25uZWN0aW9uKGNsaWVudFRva2VuczogQ2xpZW50VG9rZW5zKTogdm9pZCB7XG5cbiAgICAgICAgLy8gb25seSBpbiBwcml2YXRlIHN0b3JhZ2VcbiAgICAgICAgaWYgKGNsaWVudFRva2Vucy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IGNsaWVudFRva2Vucy5hY2Nlc3NUb2tlbi5kYXRhO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4sIHRoaXMuYWNjZXNzVG9rZW4pO1xuXG4gICAgICAgICAgICBjb25zdCBzYWx0OiBzdHJpbmcgPSBKU09OLnBhcnNlKHRoaXMuZ2V0QWNjZXNzUGF5bG9hZCh7c2FsdDogJyd9KSkuc2FsdDtcbiAgICAgICAgICAgIGlmIChzYWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDcnlwdG9TYWx0KHNhbHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjbGllbnRUb2tlbnMuaWRUb2tlbikge1xuICAgICAgICAgICAgdGhpcy5pZFRva2VuID0gY2xpZW50VG9rZW5zLmlkVG9rZW4uZGF0YTtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsaWVudFRva2Vucy5yZWZyZXNoVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFRva2VuID0gY2xpZW50VG9rZW5zLnJlZnJlc2hUb2tlbi5kYXRhO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuLCB0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9yZSBjaGFuZ2VkIHN0YXRlc1xuICAgICAgICB0aGlzLl9zdG9yYWdlLnNldChDb25uZWN0aW9uLl9zdGF0ZXMsIHRoaXMuc3RhdGVzKTtcblxuICAgICAgICAvLyBleHBvc2Ugcm9sZXMsIG1lc3NhZ2VcbiAgICAgICAgY29uc3QgY2xpZW50VXNlciA9IG5ldyBDbGllbnRVc2VyKFxuICAgICAgICAgICAgY2xpZW50VG9rZW5zLnVzZXJuYW1lLCBjbGllbnRUb2tlbnMudXNlcm5hbWUsXG4gICAgICAgICAgICBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHtyb2xlczogW119KSkucm9sZXMsXG4gICAgICAgICAgICBKU09OLnBhcnNlKHRoaXMuZ2V0SWRQYXlsb2FkKHttZXNzYWdlOiAnJ30pKS5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy5zZXRVc2VyKGNsaWVudFVzZXIpO1xuICAgIH07XG5cbiAgICBzZXRDb25uZWN0aW9uT2ZmbGluZShvcHRpb25zOiBNb2R1bGVTZXJ2aWNlTG9naW5PcHRpb25zSW50ZXJmYWNlKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBvcHRpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fYWNjZXNzVG9rZW4sIHRoaXMuYWNjZXNzVG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmlkVG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuaWRUb2tlbiA9IG9wdGlvbnMuaWRUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KENvbm5lY3Rpb24uX2lkVG9rZW4sIHRoaXMuaWRUb2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucmVmcmVzaFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbiA9IG9wdGlvbnMucmVmcmVzaFRva2VuO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXQoQ29ubmVjdGlvbi5fcmVmcmVzaFRva2VuLCB0aGlzLnJlZnJlc2hUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFVzZXIobmV3IENsaWVudFVzZXIoJ2RlbW8nLCAnZGVtbycgLFxuICAgICAgICAgICAgSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7cm9sZXM6IFtdfSkpLnJvbGVzLFxuICAgICAgICAgICAgSlNPTi5wYXJzZSh0aGlzLmdldElkUGF5bG9hZCh7bWVzc2FnZTogJyd9KSkubWVzc2FnZSkpO1xuICAgIH1cblxuICAgIGdldEFwaUVuZHBvaW50cyhvcHRpb25zPzogQ29ubmVjdGlvbkZpbmRPcHRpb25zSW50ZXJmYWNlKTogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+IHtcblxuICAgICAgICAvLyB0b2RvIDogbGV0IGVhID0gWydodHRwczovL2ZpZGovdjMnLCAnaHR0cHM6Ly9maWRqLXByb3h5Lmhlcm9rdWFwcC5jb20vdjMnXTtcbiAgICAgICAgbGV0IGVhOiBFbmRwb2ludEludGVyZmFjZVtdID0gW1xuICAgICAgICAgICAge2tleTogJ2ZpZGouZGVmYXVsdCcsIHVybDogJ2h0dHBzOi8vYXBpLmZpZGoub3ZoL3YzJywgYmxvY2tlZDogZmFsc2V9XTtcbiAgICAgICAgbGV0IGZpbHRlcmVkRWEgPSBbXTtcblxuICAgICAgICBpZiAoIXRoaXMuX3Nkay5wcm9kKSB7XG4gICAgICAgICAgICBlYSA9IFtcbiAgICAgICAgICAgICAgICB7a2V5OiAnZmlkai5kZWZhdWx0JywgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDozMjAxL3YzJywgYmxvY2tlZDogZmFsc2V9LFxuICAgICAgICAgICAgICAgIHtrZXk6ICdmaWRqLmRlZmF1bHQnLCB1cmw6ICdodHRwczovL2ZpZGotc2FuZGJveC5oZXJva3VhcHAuY29tL3YzJywgYmxvY2tlZDogZmFsc2V9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZ2V0QWNjZXNzUGF5bG9hZCh7YXBpczogW119KTtcbiAgICAgICAgICAgIGNvbnN0IGFwaUVuZHBvaW50czogRW5kcG9pbnRJbnRlcmZhY2VbXSA9IEpTT04ucGFyc2UodmFsKS5hcGlzO1xuICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50cyAmJiBhcGlFbmRwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZWEgPSBbXTtcbiAgICAgICAgICAgICAgICBhcGlFbmRwb2ludHMuZm9yRWFjaCgoZW5kcG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZHBvaW50LnVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjY2Vzc1Rva2VuUHJldmlvdXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGFwaUVuZHBvaW50czogRW5kcG9pbnRJbnRlcmZhY2VbXSA9IEpTT04ucGFyc2UodGhpcy5nZXRQcmV2aW91c0FjY2Vzc1BheWxvYWQoe2FwaXM6IFtdfSkpLmFwaXM7XG4gICAgICAgICAgICBpZiAoYXBpRW5kcG9pbnRzICYmIGFwaUVuZHBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhcGlFbmRwb2ludHMuZm9yRWFjaCgoZW5kcG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZHBvaW50LnVybCAmJiBlYS5maWx0ZXIoKHIpID0+IHIudXJsID09PSBlbmRwb2ludC51cmwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvZ2dlci5sb2coJ2ZpZGouc2RrLmNvbm5lY3Rpb24uZ2V0QXBpRW5kcG9pbnRzIDogJywgZWEpO1xuXG4gICAgICAgIGxldCBjb3VsZENoZWNrU3RhdGVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IGVhLmxlbmd0aCkgJiYgY291bGRDaGVja1N0YXRlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1tlYVtpXS51cmxdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdWxkQ2hlY2tTdGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlcikge1xuXG4gICAgICAgICAgICBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmUnKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZWEubGVuZ3RoKSAmJiAoZmlsdGVyZWRFYS5sZW5ndGggPT09IDApOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBlYVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0uc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWEucHVzaChlbmRwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucy5maWx0ZXIgPT09ICd0aGVCZXN0T2xkT25lJykge1xuICAgICAgICAgICAgICAgIGxldCBiZXN0T2xkT25lOiBFbmRwb2ludEludGVyZmFjZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBlYS5sZW5ndGgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBlYVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0ubGFzdFRpbWVXYXNPayAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCFiZXN0T2xkT25lIHx8IHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0ubGFzdFRpbWVXYXNPayA+IHRoaXMuc3RhdGVzW2Jlc3RPbGRPbmUudXJsXS5sYXN0VGltZVdhc09rKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0T2xkT25lID0gZW5kcG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJlc3RPbGRPbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFYS5wdXNoKGJlc3RPbGRPbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRFYS5wdXNoKGVhWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlcmVkRWEgPSBlYTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZEVhO1xuICAgIH07XG5cbiAgICBnZXREQnMob3B0aW9ucz86IENvbm5lY3Rpb25GaW5kT3B0aW9uc0ludGVyZmFjZSk6IEVuZHBvaW50SW50ZXJmYWNlW10ge1xuXG4gICAgICAgIGlmICghdGhpcy5hY2Nlc3NUb2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9kbyB0ZXN0IHJhbmRvbSBEQiBjb25uZWN0aW9uXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCkgJSAyO1xuICAgICAgICBsZXQgZGJzID0gSlNPTi5wYXJzZSh0aGlzLmdldEFjY2Vzc1BheWxvYWQoe2RiczogW119KSkuZGJzIHx8IFtdO1xuXG4gICAgICAgIC8vIG5lZWQgdG8gc3luY2hyb25pemUgZGJcbiAgICAgICAgaWYgKHJhbmRvbSA9PT0gMCkge1xuICAgICAgICAgICAgZGJzID0gZGJzLnNvcnQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChyYW5kb20gPT09IDEpIHtcbiAgICAgICAgICAgIGRicyA9IGRicy5yZXZlcnNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmlsdGVyZWREQnMgPSBbXTtcbiAgICAgICAgbGV0IGNvdWxkQ2hlY2tTdGF0ZXMgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZXMgJiYgT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgZGJzLmxlbmd0aCkgJiYgY291bGRDaGVja1N0YXRlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1tkYnNbaV0udXJsXSkge1xuICAgICAgICAgICAgICAgICAgICBjb3VsZENoZWNrU3RhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bGRDaGVja1N0YXRlcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvdWxkQ2hlY2tTdGF0ZXMgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmUnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBkYnMubGVuZ3RoKSAmJiAoZmlsdGVyZWREQnMubGVuZ3RoID09PSAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBkYnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY291bGRDaGVja1N0YXRlcyAmJiBvcHRpb25zICYmIG9wdGlvbnMuZmlsdGVyID09PSAndGhlQmVzdE9uZXMnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgKGkgPCBkYnMubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBkYnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50LnVybF0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZXNbZW5kcG9pbnQudXJsXS5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZERCcy5wdXNoKGVuZHBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciA9PT0gJ3RoZUJlc3RPbmUnICYmIGRicy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZpbHRlcmVkREJzLnB1c2goZGJzWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlcmVkREJzID0gZGJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkREJzO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGFzeW5jIHZlcmlmeUFwaVN0YXRlKGN1cnJlbnRUaW1lOiBudW1iZXIsIGVuZHBvaW50VXJsOiBzdHJpbmcpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLnNkay5jb25uZWN0aW9uLnZlcmlmeUFwaVN0YXRlIDogJywgY3VycmVudFRpbWUsIGVuZHBvaW50VXJsKTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IG5ldyBBamF4KClcbiAgICAgICAgICAgICAgICAuZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBlbmRwb2ludFVybCArICcvc3RhdHVzP2lzT2s9JyArIHRoaXMuX3Nkay52ZXJzaW9uLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJywgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ31cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IHN0YXRlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmlzT2spIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0gPSB7c3RhdGU6IHN0YXRlLCB0aW1lOiBjdXJyZW50VGltZSwgbGFzdFRpbWVXYXNPazogY3VycmVudFRpbWV9O1xuXG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIubG9nKCdmaWRqLnNkay5jb25uZWN0aW9uLnZlcmlmeUFwaVN0YXRlID4gc3RhdGVzIDogJywgdGhpcy5zdGF0ZXMpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXSkge1xuICAgICAgICAgICAgICAgIGxhc3RUaW1lV2FzT2sgPSB0aGlzLnN0YXRlc1tlbmRwb2ludFVybF0ubGFzdFRpbWVXYXNPaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdGVzW2VuZHBvaW50VXJsXSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcblxuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmxvZygnZmlkai5zZGsuY29ubmVjdGlvbi52ZXJpZnlBcGlTdGF0ZSA+IGNhdGNoIHBiICAtIHN0YXRlcyA6ICcsIGVyciwgdGhpcy5zdGF0ZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyB2ZXJpZnlEYlN0YXRlKGN1cnJlbnRUaW1lOiBudW1iZXIsIGRiRW5kcG9pbnQ6IHN0cmluZykge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmVyaWZ5RGJTdGF0ZTogJywgZGJFbmRwb2ludCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgbmV3IEFqYXgoKVxuICAgICAgICAgICAgICAgIC5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGRiRW5kcG9pbnQsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogdHJ1ZSwgdGltZTogY3VycmVudFRpbWUsIGxhc3RUaW1lV2FzT2s6IGN1cnJlbnRUaW1lfTtcbiAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2ZXJpZnlEYlN0YXRlOiBzdGF0ZScsIGRiRW5kcG9pbnQsIHRydWUpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbGV0IGxhc3RUaW1lV2FzT2sgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgbGFzdFRpbWVXYXNPayA9IHRoaXMuc3RhdGVzW2RiRW5kcG9pbnRdLmxhc3RUaW1lV2FzT2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlc1tkYkVuZHBvaW50XSA9IHtzdGF0ZTogZmFsc2UsIHRpbWU6IGN1cnJlbnRUaW1lLCBsYXN0VGltZVdhc09rOiBsYXN0VGltZVdhc09rfTtcbiAgICAgICAgICAgIC8vIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZlcmlmeUNvbm5lY3Rpb25TdGF0ZXMoKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgLy8gdG9kbyBuZWVkIHZlcmlmaWNhdGlvbiA/IG5vdCB5ZXQgKGNhY2hlKVxuICAgICAgICAvLyBpZiAoT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IHRpbWUgPSB0aGlzLnN0YXRlc1tPYmplY3Qua2V5cyh0aGlzLnN0YXRlcylbMF1dLnRpbWU7XG4gICAgICAgIC8vICAgICBpZiAoY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gdmVyaWZ5IHZpYSBHRVQgc3RhdHVzIG9uIEVuZHBvaW50cyAmIERCc1xuICAgICAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuICAgICAgICAvLyB0aGlzLnN0YXRlcyA9IHt9O1xuICAgICAgICB0aGlzLmFwaXMgPSB0aGlzLmdldEFwaUVuZHBvaW50cygpO1xuICAgICAgICB0aGlzLmFwaXMuZm9yRWFjaCgoZW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBlbmRwb2ludFVybDogc3RyaW5nID0gZW5kcG9pbnRPYmoudXJsO1xuICAgICAgICAgICAgaWYgKCFlbmRwb2ludFVybCkge1xuICAgICAgICAgICAgICAgIGVuZHBvaW50VXJsID0gZW5kcG9pbnRPYmoudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb21pc2VzLnB1c2godGhpcy52ZXJpZnlBcGlTdGF0ZShjdXJyZW50VGltZSwgZW5kcG9pbnRVcmwpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGJzID0gdGhpcy5nZXREQnMoKTtcbiAgICAgICAgZGJzLmZvckVhY2goKGRiRW5kcG9pbnRPYmopID0+IHtcbiAgICAgICAgICAgIGxldCBkYkVuZHBvaW50OiBzdHJpbmcgPSBkYkVuZHBvaW50T2JqLnVybDtcbiAgICAgICAgICAgIGlmICghZGJFbmRwb2ludCkge1xuICAgICAgICAgICAgICAgIGRiRW5kcG9pbnQgPSBkYkVuZHBvaW50T2JqLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9taXNlcy5wdXNoKHRoaXMudmVyaWZ5RGJTdGF0ZShjdXJyZW50VGltZSwgZGJFbmRwb2ludCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9O1xuXG59XG4iXX0=