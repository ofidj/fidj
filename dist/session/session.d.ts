import { EndpointInterface, ErrorInterface } from '../sdk/interfaces';
export interface SessionCryptoInterface {
    obj: Object;
    method: string;
}
export declare class Session {
    dbRecordCount: number;
    dbLastSync: number;
    private db;
    private remoteDb;
    private remoteUri;
    private dbs;
    constructor();
    isReady(): boolean;
    create(uid: string, force?: boolean): Promise<any | ErrorInterface>;
    destroy(): Promise<void | ErrorInterface>;
    setRemote(dbs: Array<EndpointInterface>): void;
    sync(userId: string): Promise<void | ErrorInterface>;
    put(data: any, _id: string, uid: string, oid: string, ave: string, crypto?: SessionCryptoInterface): Promise<any | ErrorInterface>;
    remove(data_id: string): Promise<void | ErrorInterface>;
    get(data_id: string, crypto?: SessionCryptoInterface): Promise<any | ErrorInterface>;
    getAll(crypto?: SessionCryptoInterface): Promise<Array<any> | ErrorInterface>;
    isEmpty(): Promise<boolean | ErrorInterface>;
    info(): Promise<any>;
    static write(item: any): string;
    static value(item: any): any;
    static extractJson(item: any): any;
}
