import { Client } from './client';
import { ModuleServiceLoginOptionsInterface, SdkInterface, ErrorInterface, EndpointInterface, LoggerInterface } from '../sdk/interfaces';
import { LocalStorage } from '../tools';
import { ClientTokens, ClientUser, ConnectionFindOptionsInterface } from './interfaces';
export declare class Connection {
    private _sdk;
    private _storage;
    private _logger;
    fidjId: string;
    fidjVersion: string;
    fidjCrypto: boolean;
    accessToken: string;
    accessTokenPrevious: string;
    idToken: string;
    refreshToken: string;
    states: {
        [s: string]: {
            state: boolean;
            time: number;
            lastTimeWasOk: number;
        };
    };
    apis: Array<EndpointInterface>;
    private cryptoSalt;
    private cryptoSaltNext;
    private client;
    private user;
    private static _accessToken;
    private static _accessTokenPrevious;
    private static _idToken;
    private static _refreshToken;
    private static _states;
    private static _cryptoSalt;
    private static _cryptoSaltNext;
    constructor(_sdk: SdkInterface, _storage: LocalStorage, _logger: LoggerInterface);
    isReady(): boolean;
    destroy(force?: boolean): Promise<void>;
    setClient(client: Client): void;
    setUser(user: ClientUser): void;
    getUser(): ClientUser;
    getClient(): Client;
    setCryptoSalt(value: string): void;
    setCryptoSaltAsVerified(): void;
    encrypt(data: any): string;
    decrypt(data: string): any;
    isLogin(): boolean;
    logout(): Promise<void | ErrorInterface>;
    getClientId(): string;
    getIdToken(): Promise<string>;
    getIdPayload(def?: any): Promise<any>;
    getAccessPayload(def?: any): Promise<string>;
    getPreviousAccessPayload(def?: any): string;
    /**
     * @throws ErrorInterface
     */
    refreshConnection(): Promise<ClientUser>;
    setConnection(clientTokens: ClientTokens): Promise<void>;
    setConnectionOffline(options: ModuleServiceLoginOptionsInterface): Promise<void>;
    getApiEndpoints(options?: ConnectionFindOptionsInterface): Promise<Array<EndpointInterface>>;
    getDBs(options?: ConnectionFindOptionsInterface): Promise<EndpointInterface[]>;
    private verifyApiState;
    private verifyDbState;
    verifyConnectionStates(): Promise<any | ErrorInterface>;
}
