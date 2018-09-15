export declare class XHRPromise {
    DEFAULT_CONTENT_TYPE: string;
    private _xhr;
    private _unloadHandler;
    constructor();
    send(options: any): Promise<any>;
    getXHR(): any;
    private _attachWindowUnload;
    private _detachWindowUnload;
    private _getHeaders;
    private _getResponseText;
    private _getResponseUrl;
    private _handleError;
    private _handleWindowUnload;
    private trim;
    private isArray;
    private forEach;
    private forEachArray;
    private forEachString;
    private forEachObject;
    private _parseHeaders;
}
