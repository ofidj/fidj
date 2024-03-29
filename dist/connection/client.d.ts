import { LocalStorage } from '../tools';
import { SdkInterface, ErrorInterface } from '../sdk/interfaces';
import { ClientToken, ClientTokens } from './interfaces';
export declare class Client {
    private appId;
    private URI;
    private storage;
    private sdk;
    clientId: string;
    private clientUuid;
    private clientInfo;
    private static refreshCountInitial;
    private static refreshCount;
    private static _clientUuid;
    private static _clientId;
    private static _refreshCount;
    constructor(appId: string, URI: string, storage: LocalStorage, sdk: SdkInterface);
    setClientId(value: string): void;
    setClientUuid(value: string): void;
    setClientInfo(value: string): void;
    /**
     *
     * @param login
     * @param password
     * @param updateProperties
     * @throws {ErrorInterface}
     */
    login(login: string, password: string, updateProperties?: any): Promise<ClientTokens>;
    /**
     *
     * @param refreshToken
     * @throws ErrorInterface
     */
    reAuthenticate(refreshToken: string): Promise<ClientToken>;
    logout(refreshToken?: string): Promise<void | ErrorInterface>;
    isReady(): boolean;
}
