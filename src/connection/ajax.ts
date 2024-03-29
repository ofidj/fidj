// import {XHRPromise} from './xhrpromise';
// const superagent = require('superagent');
// import from 'superagent';
import axios from 'axios';

export interface XhrOptionsInterface {
    url: string,
    data?: any,
    headers?: any,
    async?: boolean,
    username?: string,
    password?: string,
    withCredentials?: boolean,
    timeout?: number,
}

export enum XhrErrorReason {
    UNKNOWN,
    TIMEOUT,
    STATUS
}


export interface XhrErrorInterface {
    reason: XhrErrorReason,
    status: number,
    code: number,
    message: string,
}

export class Ajax {

    // private static xhr: XHRPromise = new XHRPromise();
    private xhr; // : XHRPromise;

    constructor() {

        // https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
        // axios ?
        //  https://github.com/axios/axios
        // const axios = require('axios');

        // axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
        //     .then(response => {
        //         console.log(response.data.url);
        //         console.log(response.data.explanation);
        //     })

        // superagent.get('https://api.nasa.gov/planetary/apod')
        //     .query({ api_key: 'DEMO_KEY', date: '2017-08-02' })

        this.xhr = axios; // require('superagent'); // new XHRPromise();
    };

    private static formatResponseData(response: any): any {
        // TODO switch depending on json headers
        let dataParsed = response;

        while (dataParsed && dataParsed.data) {
            dataParsed = dataParsed.data;
        }

        try {
            dataParsed = JSON.parse(dataParsed + '');
        } catch (e) {
        }
        return dataParsed;
    };

    private static formatError(error: any): XhrErrorInterface {

        const errorFormatted: XhrErrorInterface = {
            reason: XhrErrorReason.UNKNOWN,
            status: -1,
            code: -1,
            message: '',
        };

        if (error.status) {
            errorFormatted.reason = XhrErrorReason.STATUS;
            errorFormatted.status = parseInt(error.status, 10);
            errorFormatted.code = parseInt(error.status, 10);
        }

        if (error.response) {
            errorFormatted.message = error.response;

            if (error.response.status) {
                errorFormatted.reason = XhrErrorReason.STATUS;
                errorFormatted.status = parseInt(error.response.status, 10);
                errorFormatted.code = parseInt(error.response.status, 10);
            } else if (error.response.status === null) { // timeout
                errorFormatted.reason = XhrErrorReason.TIMEOUT;
                errorFormatted.status = 408;
                errorFormatted.code = 408;
            }

        } else if (error.request) {
            errorFormatted.message = error.request;
        } else if (error.message) {
            errorFormatted.message = error.message;
        }

        // _this._handleError('browser', reject, null, 'browser doesn\'t support XMLHttpRequest');
        // _this._handleError('url', reject, null, 'URL is a required parameter');
        // _this._handleError('parse', reject, null, 'invalid JSON response');
        // return _this._handleError('error', reject);
        // return _this._handleError('timeout', reject);
        // return _this._handleError('abort', reject);
        // return _this._handleError('send', reject, null, e.toString());

        // if (err.reason === 'timeout') {
        //     err.code = 408;
        // } else {
        //     err.code = 404;
        // }

        return errorFormatted;
    };

    public post(args: XhrOptionsInterface): Promise<any | XhrErrorInterface> {

        const opt: any = {
            method: 'POST',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }

        const options = {headers: opt.headers};
        if (args.timeout) {
            options['timeout'] = args.timeout;
        }

        return this.xhr.post(opt.url, opt.data, options)
            .then(res => {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }

                return Promise.resolve(Ajax.formatResponseData(res));
            })
            .catch(err => {
                return Promise.reject(Ajax.formatError(err));
            });
    }

    public put(args: XhrOptionsInterface): Promise<any | XhrErrorInterface> {
        const opt: any = {
            method: 'PUT',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        const options = {headers: opt.headers};
        if (args.timeout) {
            options['timeout'] = args.timeout;
        }

        return this.xhr
            .put(opt.url, opt.data, options)
            .then(res => {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }

                return Promise.resolve(Ajax.formatResponseData(res));
            })
            .catch(err => {
                return Promise.reject(Ajax.formatError(err));
            });
    }

    public delete(args: XhrOptionsInterface): Promise<any | XhrErrorInterface> {
        const opt: any = {
            method: 'DELETE',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        const options = {headers: opt.headers};
        if (args.timeout) {
            options['timeout'] = args.timeout;
        }
        return this.xhr
            .delete(opt.url, options)
            .then(res => {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }

                return Promise.resolve(Ajax.formatResponseData(res));
            })
            .catch(err => {
                return Promise.reject(Ajax.formatError(err));
            });
    }

    public get(args: XhrOptionsInterface): Promise<any | XhrErrorInterface> {
        const opt: any = {
            method: 'GET',
            url: args.url
        };
        if (args.data) {
            opt.data = args.data;
        }
        if (args.headers) {
            opt.headers = args.headers;
        }
        const options = {headers: opt.headers};
        if (args.timeout) {
            options['timeout'] = args.timeout;
        }
        return this.xhr
            .get(opt.url, options)
            .then(res => {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    return Promise.reject(Ajax.formatError(res));
                }

                return Promise.resolve(Ajax.formatResponseData(res));
            })
            .catch(err => {
                return Promise.reject(Ajax.formatError(err));
            });
    }
}
