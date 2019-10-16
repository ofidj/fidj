// import {XHRPromise} from './xhrpromise';
// const superagent = require('superagent');
// import from 'superagent';

export interface XhrOptionsInterface {
    url: string,
    data?: any,
    headers?: any,
    async?: boolean,
    username?: string,
    password?: string,
    withCredentials?: boolean
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

        this.xhr = require('axios').default; // require('superagent'); // new XHRPromise();
    };

    public post(args: XhrOptionsInterface): Promise<any> {

        const opt: any = {
            method: 'POST',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }

        return this.xhr
            .post(opt.url, {
                data: opt.data,
                headers: opt.headers
            })
            .then(res => {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    res.reason = 'status';
                    res.code = parseInt(res.status, 10);
                    return Promise.reject(res);
                }
                return Promise.resolve(res.responseText);
            })
            .catch(err => {
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
                return Promise.reject(err);
            });
    }

    public put(args: XhrOptionsInterface): Promise<any> {
        const opt: any = {
            method: 'PUT',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .put(opt.url) // .send(opt)
            .then(res => {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    res.reason = 'status';
                    res.code = parseInt(res.status, 10);
                    return Promise.reject(res);
                }
                return Promise.resolve(res.responseText);
            })
            .catch(err => {
                // if (err.reason === 'timeout') {
                //     err.code = 408;
                // } else {
                //     err.code = 404;
                // }
                return Promise.reject(err);
            });
    }

    public delete(args: XhrOptionsInterface): Promise<any> {
        const opt: any = {
            method: 'DELETE',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .delete(opt.url) // .send(opt)
            .then(res => {
                console.log(res);
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    res.reason = 'status';
                    res.code = parseInt(res.status, 10);
                    return Promise.reject(res);
                }
                return Promise.resolve(res.responseText);
            })
            .catch(err => {
                // if (err.reason === 'timeout') {
                //     err.code = 408;
                // } else {
                //     err.code = 404;
                // }
                return Promise.reject(err);
            });
    }

    public get(args: XhrOptionsInterface): Promise<any> {
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
        return this.xhr
            .get(opt.url) // .send(opt)
            .then(res => {
                if (res.status &&
                    (parseInt(res.status, 10) < 200 || parseInt(res.status, 10) >= 300)) {
                    res.reason = 'status';
                    res.code = parseInt(res.status, 10);
                    return Promise.reject(res);
                }
                return Promise.resolve(res.responseText);
            })
            .catch(err => {
                // if (err.reason === 'timeout') {
                //     err.code = 408;
                // } else {
                //     err.code = 404;
                // }
                return Promise.reject(err);
            });
    }
}
