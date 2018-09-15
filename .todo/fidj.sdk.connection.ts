export class Connection {

    constructor(private orgName: string,
                private appName: string,
                private logging: boolean,
                private buildCurl: boolean,
                private URI: string) {
    };


    public reAuthenticate(callback) {

        /**
         * function (err, user) {

                if (err && err.name === '408') {
                    code = 408; // timeout : in memory offline
                }
                else {
                    self.setConnection(user);
                }

                resolve(code);
            }
         */

        callback("408",null);

    }

    public logout() {
        console.log('logout');
    }

    public login(appId : string, login : string, password : string, callback : any) {

        /**
         * self.connection.fidjId, login, password, updateProperties,
         function (err, loginUser) {
                // self.logger.log('fidj.sdk.service._loginInternal done :' + err + ' user:' + user);
                if (err || !loginUser) {
                    // Error - could not log user in, even for 404
                    self.logger.error('fidj.sdk.service._loginInternal error : ' + err);
                    return reject(err);
                }

                // Success - user has been logged in
                loginUser.email = login;
                resolve(loginUser);
            }
         */
        if (callback) callback('not implemented', null);
    }
}