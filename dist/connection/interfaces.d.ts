export interface ConnectionFindOptionsInterface {
    filter: string;
}
export declare class ClientToken {
    id: string;
    type: string;
    data: string;
    constructor(id: string, type: string, data: string);
}
export declare class ClientTokens {
    username: string;
    accessToken: ClientToken;
    idToken: ClientToken;
    refreshToken: ClientToken;
    constructor(username: string, accessToken: ClientToken, idToken: ClientToken, refreshToken: ClientToken);
}
export declare class ClientUser {
    id: string;
    username: string;
    roles: string[];
    constructor(id: string, username: string, roles: string[], message: string);
}
