import { LocalStorage } from '../tools';
import { SdkInterface, ErrorInterface } from '../sdk/interfaces';
export declare class Client {
    private appId;
    private URI;
    private storage;
    private sdk;
    clientId: string;
    private clientUuid;
    private clientInfo;
    private refreshToken;
    private static refreshCount;
    private static _clientUuid;
    private static _clientId;
    private static _refreshCount;
    constructor(appId: string, URI: string, storage: LocalStorage, sdk: SdkInterface);
    setClientId(value: string): void;
    setClientUuid(value: string): void;
    setClientInfo(value: string): void;
    login(login: string, password: string, updateProperties?: any): Promise<any | ErrorInterface>;
    reAuthenticate(refreshToken: string): Promise<any | ErrorInterface>;
    logout(refreshToken?: string): Promise<void | ErrorInterface>;
    isReady(): boolean;
}
