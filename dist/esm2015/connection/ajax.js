// import {XHRPromise} from './xhrpromise';
// const superagent = require('superagent');
// import from 'superagent';
export var XhrErrorReason;
(function (XhrErrorReason) {
    XhrErrorReason[XhrErrorReason["UNKNOWN"] = 0] = "UNKNOWN";
    XhrErrorReason[XhrErrorReason["TIMEOUT"] = 1] = "TIMEOUT";
    XhrErrorReason[XhrErrorReason["STATUS"] = 2] = "STATUS";
})(XhrErrorReason || (XhrErrorReason = {}));
export class Ajax {
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
        this.xhr = require('axios'); // require('superagent'); // new XHRPromise();
    }
    ;
    static formatResponseData(response) {
        // TODO switch depending on json headers
        let dataParsed = response;
        while (dataParsed && dataParsed.data) {
            dataParsed = dataParsed.data;
        }
        try {
            dataParsed = JSON.parse(dataParsed + '');
        }
        catch (e) {
        }
        return dataParsed;
    }
    ;
    static formatError(error) {
        const errorFormatted = {
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
            }
            else if (error.response.status === null) { // timeout
                errorFormatted.reason = XhrErrorReason.TIMEOUT;
                errorFormatted.status = 408;
                errorFormatted.code = 408;
            }
        }
        else if (error.request) {
            errorFormatted.message = error.request;
        }
        else if (error.message) {
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
    }
    ;
    post(args) {
        const opt = {
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
            headers: opt.headers,
            timeout: 10000
        })
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
    put(args) {
        const opt = {
            method: 'PUT',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .put(opt.url, {
            data: opt.data,
            headers: opt.headers,
            timeout: 10000
        })
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
    delete(args) {
        const opt = {
            method: 'DELETE',
            url: args.url,
            data: JSON.stringify(args.data)
        };
        if (args.headers) {
            opt.headers = args.headers;
        }
        return this.xhr
            .delete(opt.url, {
            data: opt.data,
            headers: opt.headers,
            timeout: 10000
        })
            // .delete(opt.url) // .send(opt)
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
    get(args) {
        const opt = {
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
            .get(opt.url, {
            data: opt.data,
            headers: opt.headers,
            timeout: 10000
        })
            // .get(opt.url) // .send(opt)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWpheC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJjb25uZWN0aW9uL2FqYXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQTJDO0FBQzNDLDRDQUE0QztBQUM1Qyw0QkFBNEI7QUFZNUIsTUFBTSxDQUFOLElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN0Qix5REFBTyxDQUFBO0lBQ1AseURBQU8sQ0FBQTtJQUNQLHVEQUFNLENBQUE7QUFDVixDQUFDLEVBSlcsY0FBYyxLQUFkLGNBQWMsUUFJekI7QUFVRCxNQUFNLE9BQU8sSUFBSTtJQUtiO1FBRUksb0VBQW9FO1FBQ3BFLFVBQVU7UUFDVixrQ0FBa0M7UUFDbEMsa0NBQWtDO1FBRWxDLG9FQUFvRTtRQUNwRSwwQkFBMEI7UUFDMUIsMENBQTBDO1FBQzFDLGtEQUFrRDtRQUNsRCxTQUFTO1FBRVQsd0RBQXdEO1FBQ3hELDBEQUEwRDtRQUUxRCxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLDhDQUE4QztJQUMvRSxDQUFDO0lBQUEsQ0FBQztJQUVNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFhO1FBQzNDLHdDQUF3QztRQUN4QyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFFMUIsT0FBTyxVQUFVLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUNsQyxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztTQUNoQztRQUVELElBQUk7WUFDQSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQUMsRUFBRTtTQUNYO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUFBLENBQUM7SUFFTSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQVU7UUFFakMsTUFBTSxjQUFjLEdBQXNCO1lBQ3RDLE1BQU0sRUFBRSxjQUFjLENBQUMsT0FBTztZQUM5QixNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNSLE9BQU8sRUFBRSxFQUFFO1NBQ2QsQ0FBQztRQUVGLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNkLGNBQWMsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztZQUM5QyxjQUFjLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELGNBQWMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDcEQ7UUFFRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDaEIsY0FBYyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBRXhDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZCLGNBQWMsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztnQkFDOUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzVELGNBQWMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQzdEO2lCQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFLEVBQUUsVUFBVTtnQkFDbkQsY0FBYyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDO2dCQUMvQyxjQUFjLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDNUIsY0FBYyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7YUFDN0I7U0FFSjthQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUN0QixjQUFjLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7U0FDMUM7YUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDdEIsY0FBYyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQzFDO1FBRUQsMEZBQTBGO1FBQzFGLDBFQUEwRTtRQUMxRSxzRUFBc0U7UUFDdEUsOENBQThDO1FBQzlDLGdEQUFnRDtRQUNoRCw4Q0FBOEM7UUFDOUMsaUVBQWlFO1FBRWpFLGtDQUFrQztRQUNsQyxzQkFBc0I7UUFDdEIsV0FBVztRQUNYLHNCQUFzQjtRQUN0QixJQUFJO1FBRUosT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUFBLENBQUM7SUFFSyxJQUFJLENBQUMsSUFBeUI7UUFFakMsTUFBTSxHQUFHLEdBQVE7WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbEMsQ0FBQztRQUNGLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUM5QjtRQUVELE9BQU8sSUFBSSxDQUFDLEdBQUc7YUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNYLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtZQUNkLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztZQUNwQixPQUFPLEVBQUUsS0FBSztTQUNqQixDQUFDO2FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1IsSUFBSSxHQUFHLENBQUMsTUFBTTtnQkFDVixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtnQkFDckUsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoRDtZQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDVCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVNLEdBQUcsQ0FBQyxJQUF5QjtRQUNoQyxNQUFNLEdBQUcsR0FBUTtZQUNiLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQyxDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRzthQUNWLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3BCLE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUM7YUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDUixJQUFJLEdBQUcsQ0FBQyxNQUFNO2dCQUNWLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO2dCQUNyRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO1lBRUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNULE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU0sTUFBTSxDQUFDLElBQXlCO1FBQ25DLE1BQU0sR0FBRyxHQUFRO1lBQ2IsTUFBTSxFQUFFLFFBQVE7WUFDaEIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQyxDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRzthQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1lBQ2IsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3BCLE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUM7WUFDRixpQ0FBaUM7YUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1IsSUFBSSxHQUFHLENBQUMsTUFBTTtnQkFDVixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtnQkFDckUsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoRDtZQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDVCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVNLEdBQUcsQ0FBQyxJQUF5QjtRQUNoQyxNQUFNLEdBQUcsR0FBUTtZQUNiLE1BQU0sRUFBRSxLQUFLO1lBQ2IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2hCLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDeEI7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDOUI7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHO2FBQ1YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7WUFDZCxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87WUFDcEIsT0FBTyxFQUFFLEtBQUs7U0FDakIsQ0FBQztZQUNGLDhCQUE4QjthQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDUixJQUFJLEdBQUcsQ0FBQyxNQUFNO2dCQUNWLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO2dCQUNyRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO1lBRUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNULE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQge1hIUlByb21pc2V9IGZyb20gJy4veGhycHJvbWlzZSc7XG4vLyBjb25zdCBzdXBlcmFnZW50ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xuLy8gaW1wb3J0IGZyb20gJ3N1cGVyYWdlbnQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFhock9wdGlvbnNJbnRlcmZhY2Uge1xuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE/OiBhbnksXG4gICAgaGVhZGVycz86IGFueSxcbiAgICBhc3luYz86IGJvb2xlYW4sXG4gICAgdXNlcm5hbWU/OiBzdHJpbmcsXG4gICAgcGFzc3dvcmQ/OiBzdHJpbmcsXG4gICAgd2l0aENyZWRlbnRpYWxzPzogYm9vbGVhblxufVxuXG5leHBvcnQgZW51bSBYaHJFcnJvclJlYXNvbiB7XG4gICAgVU5LTk9XTixcbiAgICBUSU1FT1VULFxuICAgIFNUQVRVU1xufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgWGhyRXJyb3JJbnRlcmZhY2Uge1xuICAgIHJlYXNvbjogWGhyRXJyb3JSZWFzb24sXG4gICAgc3RhdHVzOiBudW1iZXIsXG4gICAgY29kZTogbnVtYmVyLFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbn1cblxuZXhwb3J0IGNsYXNzIEFqYXgge1xuXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgeGhyOiBYSFJQcm9taXNlID0gbmV3IFhIUlByb21pc2UoKTtcbiAgICBwcml2YXRlIHhocjsgLy8gOiBYSFJQcm9taXNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgLy8gaHR0cHM6Ly93d3cudHdpbGlvLmNvbS9ibG9nLzIwMTcvMDgvaHR0cC1yZXF1ZXN0cy1pbi1ub2RlLWpzLmh0bWxcbiAgICAgICAgLy8gYXhpb3MgP1xuICAgICAgICAvLyAgaHR0cHM6Ly9naXRodWIuY29tL2F4aW9zL2F4aW9zXG4gICAgICAgIC8vIGNvbnN0IGF4aW9zID0gcmVxdWlyZSgnYXhpb3MnKTtcblxuICAgICAgICAvLyBheGlvcy5nZXQoJ2h0dHBzOi8vYXBpLm5hc2EuZ292L3BsYW5ldGFyeS9hcG9kP2FwaV9rZXk9REVNT19LRVknKVxuICAgICAgICAvLyAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEudXJsKTtcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhLmV4cGxhbmF0aW9uKTtcbiAgICAgICAgLy8gICAgIH0pXG5cbiAgICAgICAgLy8gc3VwZXJhZ2VudC5nZXQoJ2h0dHBzOi8vYXBpLm5hc2EuZ292L3BsYW5ldGFyeS9hcG9kJylcbiAgICAgICAgLy8gICAgIC5xdWVyeSh7IGFwaV9rZXk6ICdERU1PX0tFWScsIGRhdGU6ICcyMDE3LTA4LTAyJyB9KVxuXG4gICAgICAgIHRoaXMueGhyID0gcmVxdWlyZSgnYXhpb3MnKTsgLy8gcmVxdWlyZSgnc3VwZXJhZ2VudCcpOyAvLyBuZXcgWEhSUHJvbWlzZSgpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBmb3JtYXRSZXNwb25zZURhdGEocmVzcG9uc2U6IGFueSk6IGFueSB7XG4gICAgICAgIC8vIFRPRE8gc3dpdGNoIGRlcGVuZGluZyBvbiBqc29uIGhlYWRlcnNcbiAgICAgICAgbGV0IGRhdGFQYXJzZWQgPSByZXNwb25zZTtcblxuICAgICAgICB3aGlsZSAoZGF0YVBhcnNlZCAmJiBkYXRhUGFyc2VkLmRhdGEpIHtcbiAgICAgICAgICAgIGRhdGFQYXJzZWQgPSBkYXRhUGFyc2VkLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YVBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YVBhcnNlZCArICcnKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhUGFyc2VkO1xuICAgIH07XG5cbiAgICBwcml2YXRlIHN0YXRpYyBmb3JtYXRFcnJvcihlcnJvcjogYW55KTogWGhyRXJyb3JJbnRlcmZhY2Uge1xuXG4gICAgICAgIGNvbnN0IGVycm9yRm9ybWF0dGVkOiBYaHJFcnJvckludGVyZmFjZSA9IHtcbiAgICAgICAgICAgIHJlYXNvbjogWGhyRXJyb3JSZWFzb24uVU5LTk9XTixcbiAgICAgICAgICAgIHN0YXR1czogLTEsXG4gICAgICAgICAgICBjb2RlOiAtMSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChlcnJvci5zdGF0dXMpIHtcbiAgICAgICAgICAgIGVycm9yRm9ybWF0dGVkLnJlYXNvbiA9IFhockVycm9yUmVhc29uLlNUQVRVUztcbiAgICAgICAgICAgIGVycm9yRm9ybWF0dGVkLnN0YXR1cyA9IHBhcnNlSW50KGVycm9yLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgZXJyb3JGb3JtYXR0ZWQuY29kZSA9IHBhcnNlSW50KGVycm9yLnN0YXR1cywgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9yLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBlcnJvckZvcm1hdHRlZC5tZXNzYWdlID0gZXJyb3IucmVzcG9uc2U7XG5cbiAgICAgICAgICAgIGlmIChlcnJvci5yZXNwb25zZS5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBlcnJvckZvcm1hdHRlZC5yZWFzb24gPSBYaHJFcnJvclJlYXNvbi5TVEFUVVM7XG4gICAgICAgICAgICAgICAgZXJyb3JGb3JtYXR0ZWQuc3RhdHVzID0gcGFyc2VJbnQoZXJyb3IucmVzcG9uc2Uuc3RhdHVzLCAxMCk7XG4gICAgICAgICAgICAgICAgZXJyb3JGb3JtYXR0ZWQuY29kZSA9IHBhcnNlSW50KGVycm9yLnJlc3BvbnNlLnN0YXR1cywgMTApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5yZXNwb25zZS5zdGF0dXMgPT09IG51bGwpIHsgLy8gdGltZW91dFxuICAgICAgICAgICAgICAgIGVycm9yRm9ybWF0dGVkLnJlYXNvbiA9IFhockVycm9yUmVhc29uLlRJTUVPVVQ7XG4gICAgICAgICAgICAgICAgZXJyb3JGb3JtYXR0ZWQuc3RhdHVzID0gNDA4O1xuICAgICAgICAgICAgICAgIGVycm9yRm9ybWF0dGVkLmNvZGUgPSA0MDg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5yZXF1ZXN0KSB7XG4gICAgICAgICAgICBlcnJvckZvcm1hdHRlZC5tZXNzYWdlID0gZXJyb3IucmVxdWVzdDtcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgICAgICBlcnJvckZvcm1hdHRlZC5tZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIF90aGlzLl9oYW5kbGVFcnJvcignYnJvd3NlcicsIHJlamVjdCwgbnVsbCwgJ2Jyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QnKTtcbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCd1cmwnLCByZWplY3QsIG51bGwsICdVUkwgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXInKTtcbiAgICAgICAgLy8gX3RoaXMuX2hhbmRsZUVycm9yKCdwYXJzZScsIHJlamVjdCwgbnVsbCwgJ2ludmFsaWQgSlNPTiByZXNwb25zZScpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3RpbWVvdXQnLCByZWplY3QpO1xuICAgICAgICAvLyByZXR1cm4gX3RoaXMuX2hhbmRsZUVycm9yKCdhYm9ydCcsIHJlamVjdCk7XG4gICAgICAgIC8vIHJldHVybiBfdGhpcy5faGFuZGxlRXJyb3IoJ3NlbmQnLCByZWplY3QsIG51bGwsIGUudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgLy8gaWYgKGVyci5yZWFzb24gPT09ICd0aW1lb3V0Jykge1xuICAgICAgICAvLyAgICAgZXJyLmNvZGUgPSA0MDg7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICBlcnIuY29kZSA9IDQwNDtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHJldHVybiBlcnJvckZvcm1hdHRlZDtcbiAgICB9O1xuXG4gICAgcHVibGljIHBvc3QoYXJnczogWGhyT3B0aW9uc0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgWGhyRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBhcmdzLnVybCxcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFyZ3MuZGF0YSlcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgb3B0LmhlYWRlcnMgPSBhcmdzLmhlYWRlcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5wb3N0KG9wdC51cmwsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBvcHQuZGF0YSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBvcHQuaGVhZGVycyxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoQWpheC5mb3JtYXRFcnJvcihyZXMpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEFqYXguZm9ybWF0UmVzcG9uc2VEYXRhKHJlcykpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChBamF4LmZvcm1hdEVycm9yKGVycikpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHB1dChhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBYaHJFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoYXJncy5kYXRhKVxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICBvcHQuaGVhZGVycyA9IGFyZ3MuaGVhZGVycztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy54aHJcbiAgICAgICAgICAgIC5wdXQob3B0LnVybCwge1xuICAgICAgICAgICAgICAgIGRhdGE6IG9wdC5kYXRhLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IG9wdC5oZWFkZXJzLFxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAocGFyc2VJbnQocmVzLnN0YXR1cywgMTApIDwgMjAwIHx8IHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA+PSAzMDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChBamF4LmZvcm1hdEVycm9yKHJlcykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoQWpheC5mb3JtYXRSZXNwb25zZURhdGEocmVzKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KEFqYXguZm9ybWF0RXJyb3IoZXJyKSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVsZXRlKGFyZ3M6IFhock9wdGlvbnNJbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IFhockVycm9ySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IG9wdDogYW55ID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgICAgIHVybDogYXJncy51cmwsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShhcmdzLmRhdGEpXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLmRlbGV0ZShvcHQudXJsLCB7XG4gICAgICAgICAgICAgICAgZGF0YTogb3B0LmRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogb3B0LmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyAuZGVsZXRlKG9wdC51cmwpIC8vIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoQWpheC5mb3JtYXRFcnJvcihyZXMpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEFqYXguZm9ybWF0UmVzcG9uc2VEYXRhKHJlcykpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChBamF4LmZvcm1hdEVycm9yKGVycikpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChhcmdzOiBYaHJPcHRpb25zSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBYaHJFcnJvckludGVyZmFjZT4ge1xuICAgICAgICBjb25zdCBvcHQ6IGFueSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IGFyZ3MudXJsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmdzLmRhdGEpIHtcbiAgICAgICAgICAgIG9wdC5kYXRhID0gYXJncy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgIG9wdC5oZWFkZXJzID0gYXJncy5oZWFkZXJzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnhoclxuICAgICAgICAgICAgLmdldChvcHQudXJsLCB7XG4gICAgICAgICAgICAgICAgZGF0YTogb3B0LmRhdGEsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogb3B0LmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgdGltZW91dDogMTAwMDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyAuZ2V0KG9wdC51cmwpIC8vIC5zZW5kKG9wdClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50KHJlcy5zdGF0dXMsIDEwKSA8IDIwMCB8fCBwYXJzZUludChyZXMuc3RhdHVzLCAxMCkgPj0gMzAwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoQWpheC5mb3JtYXRFcnJvcihyZXMpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEFqYXguZm9ybWF0UmVzcG9uc2VEYXRhKHJlcykpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChBamF4LmZvcm1hdEVycm9yKGVycikpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIl19