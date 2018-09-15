import {Ajax, Connection, Client} from '../src/connection';
import {Base64} from '../src/tools';

describe('miapp.connection', () => {

    describe('Ajax', () => {
        const _dogName = 'dog' + Math.floor(Math.random() * 5000);
        const _dogData = JSON.stringify({type: 'dog', name: _dogName});
        const _dogURI = 'https://api.miapp.com/yourorgname/sandbox/dogs';

        beforeEach(() => {
            jasmine.Ajax.install();
            jasmine.clock().install();
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
            jasmine.clock().uninstall();
        });

        it('should POST to a URI', (done) => {
            jasmine.Ajax.stubRequest(/.*sandbox*/).andReturn(
                {
                    status: 200,
                    contentType: 'text/plain',
                    responseText: _dogName
                }
            );
            new Ajax()
                .post({url: _dogURI, data: _dogData})
                .then((data) => {
                    const request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(_dogURI);
                    // console.log('data:', data);
                    expect(data).toBe(_dogName);
                    done();
                })
                .catch((err) => done.fail(err));
        });

        it('should GET a URI', (done) => {
            jasmine.Ajax.stubRequest(/.*sandbox*/).andReturn(
                {
                    status: 200,
                    contentType: 'text/plain',
                    responseText: _dogName
                }
            );
            new Ajax()
                .get({url: _dogURI + '/' + _dogName})
                .then((data) => {
                    expect(data).toBe(_dogName);
                    done();
                })
                .catch(err => {
                    done.fail(err);
                });
        });

        it('should PUT to a URI', (done) => {
            jasmine.Ajax.stubRequest(/.*sandbox*/).andReturn(
                {
                    status: 202,
                    contentType: 'text/plain',
                    responseText: _dogName
                }
            );
            new Ajax()
                .put({url: (_dogURI + '/' + _dogName), data: {'favorite': true}})
                .then((data) => {
                    expect(data).toBe(_dogName);
                    done();
                })
                .catch(err => {
                    done.fail(err);
                });
        });

        it('should DELETE a URI', (done) => {
            jasmine.Ajax.stubRequest(/.*sandbox*/).andReturn(
                {
                    status: 204,
                    contentType: 'text/plain',
                    responseText: _dogName
                }
            );
            new Ajax()
                .delete({url: _dogURI + '/' + _dogName, data: _dogData})
                .then((data) => {
                    expect(data).toBe(_dogName);
                    done();
                })
                .catch(err => {
                    done.fail(err);
                });
        });

        it('should POST fail due to timeout (408) on fake url', (done) => {
            // For timeout
            (jasmine.Ajax
                .stubRequest(/.*/) as any)
                .andTimeout();

            new Ajax()
                .post({url: _dogURI, data: _dogData})
                .then((data) => {
                    done.fail(data);
                })
                .catch(err => {
                    // console.log('data:', data);
                    // expect(err.status).toBe(0);
                    // console.log(err);
                    expect(err.reason).toBe('timeout');
                    expect(err.code).toBe(408);
                    done();
                });
        });

        it('should GET fail due to error (500) on fake url', (done) => {
            (jasmine.Ajax
                .stubRequest(/.*/) as any)
                .andError();

            new Ajax()
                .get({url: _dogURI + '/' + _dogName})
                .then((data) => {
                    done.fail(data);
                })
                .catch(err => {
                    expect(err.reason).toBe('error');
                    expect(err.code).toBe(500);
                    done();
                });
        });

        it('should POST fail due to 404', (done) => {
            jasmine.Ajax.stubRequest(/.*sandbox*/).andReturn({
                'status': 404,
                'contentType': 'text/plain',
                'responseText': '404?'
            });

            new Ajax()
                .post({url: _dogURI, data: _dogData})
                .then((data) => {
                    done.fail(data);
                })
                .catch(err => {
                    // console.log('err:', err);
                    expect(err.reason).toBe('status');
                    expect(err.status).toBe(404);
                    expect(err.code).toBe(404);
                    done();
                });
        });

        it('should GET fail due to 404', (done) => {
            jasmine.Ajax.stubRequest(/.*sandbox*/).andReturn({
                'status': 404,
                'contentType': 'text/plain',
                'responseText': '404?'
            });
            new Ajax()
                .get({url: _dogURI + '/' + _dogName})
                .then((data) => {
                    done.fail(data);
                })
                .catch(err => {
                    expect(err.reason).toBe('status');
                    expect(err.status).toBe(404);
                    expect(err.code).toBe(404);
                    done();
                });
        });

    });

    describe('Client', () => {
        const _appId = 'clientTest';
        const _uri = 'http://client';
        const _sdk: any = {};
        const _storage: any = {
            get: key => {
            },
            set: key => {
            },
            remove: key => {
            }
        };

        beforeEach(() => {
            jasmine.Ajax.install();
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should login', (done) => {

            const userJson = {_id: '1234'};
            const tokenJson = {token: '1234'};
            jasmine.Ajax.stubRequest(/.*users/).andReturn(
                {
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify(userJson)
                }
            );
            jasmine.Ajax.stubRequest(/.*token/).andReturn(
                {
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify(tokenJson)
                }
            );
            const client = new Client(_appId, _uri, _storage, _sdk);
            expect(client).toBeDefined();
            spyOn(client, 'setClientId').and.returnValue({});

            client.login('', '')
                .then(user => {
                    expect(user).toBeDefined();
                    const ready = client.isReady();
                    expect(ready).toBeTruthy();
                    expect(client.setClientId).toHaveBeenCalledTimes(1);
                    expect(client.setClientId).toHaveBeenCalledWith(userJson._id);
                    const request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(_uri + '/oauth/token');
                    expect(request.method).toBe('POST');
                    const data: any = request.data();
                    expect(data).toBeDefined();
                    expect(data.grant_type).toEqual('client_credentials');
                    expect(data.client_secret).toEqual('');
                    expect(data.audience).toEqual(_appId);
                    done();
                })
                .catch(err => {
                    done.fail(err);
                });

        });

        it('should reAuthenticate', (done) => {

            const userJson = {_id: '1234'};
            const tokenJson = {token: '1234'};
            jasmine.Ajax.stubRequest(/.*token/).andReturn(
                {
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify(tokenJson)
                }
            );
            const client = new Client(_appId, _uri, _storage, _sdk);
            expect(client).toBeDefined();

            client.reAuthenticate('refreshToken')
                .then(user => {
                    expect(user).toBeDefined();
                    const ready = client.isReady();
                    expect(ready).toBeTruthy();
                    const request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(_uri + '/oauth/token');
                    expect(request.method).toBe('POST');
                    const data: any = request.data();
                    expect(data).toBeDefined();
                    expect(data.grant_type).toEqual('refresh_token');
                    expect(data.audience).toEqual(_appId);
                    expect(data.refresh_token).toEqual('refreshToken');
                    expect(data.refresh_extra).toEqual(0);
                    done();
                })
                .catch(err => {
                    done.fail(err);
                });

        });

        it('should be correctly initialized', (done) => {

            const responseJson = {ok: 'done'};
            jasmine.Ajax.stubRequest(/.*revoke/).andReturn(
                {
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify(responseJson)
                }
            );

            const client = new Client(_appId, _uri, _storage, _sdk);
            expect(client).toBeDefined();
            client.clientId = 'clientMockAsConnected';
            spyOn(_storage, 'remove').and.returnValue(true);

            client.logout('tokenMockAsConnected')
                .then(user => {
                    expect(JSON.stringify(user)).toBe(JSON.stringify(responseJson));

                    const ready = client.isReady();
                    expect(ready).toBeTruthy();
                    const request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe(_uri + '/oauth/revoke');
                    expect(request.method).toBe('POST');
                    const data: any = request.data();
                    expect(data).toBeDefined();
                    expect(data.token).toEqual('tokenMockAsConnected');
                    expect(data.client_id).toEqual('clientMockAsConnected');
                    expect(data.audience).toEqual(_appId);
                    expect(_storage.remove).toHaveBeenCalledTimes(2);
                    expect(_storage.remove).toHaveBeenCalledWith('v2.clientId');
                    // expect(_storage.remove).toHaveBeenCalledWith('v2.clientUuid');
                    expect(_storage.remove).toHaveBeenCalledWith('v2.refreshCount');

                    done();
                })
                .catch(err => {
                    done.fail(err);
                });

        });


    });

    describe('Connection', () => {

        const _sdk: any = {version: 'mock.sdk'};
        const _storage: any = {
            get: key => {
            }, set: key => {
            }, remove: key => {
            }
        };

        const mocks = {
            tokens: {
                withoutAnyUrl: 'begin.' + Base64.encode(JSON.stringify({})) + '.end',
                withDbs: 'begin.' + Base64.encode(JSON.stringify({
                    dbs: [
                        {url: 'http://db1'},
                        {url: 'http://db2'},
                    ]
                })) + '.end',
                withApis01: 'begin.' + Base64.encode(JSON.stringify({
                    apis: [
                        {url: 'http://api_1'},
                        {url: 'http://api_2'},
                    ]
                })) + '.end',
                withApis02: 'begin.' + Base64.encode(JSON.stringify({
                    apis: [
                        {url: 'http://api_3'},
                        {url: 'http://api_4'},
                    ]
                })) + '.end',
            }
        };

        beforeEach(() => {
            jasmine.Ajax.install();
        });
        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should isLogin', () => {
            const cx = new Connection(_sdk, _storage);
            expect(cx).toBeDefined();

            let i = cx.isLogin();
            expect(i).toBeFalsy();

            const payloadNotExpired = Base64.encode(JSON.stringify({exp: ((new Date().getTime() + 200) / 1000)}));
            (cx as any).refreshToken = '.' + payloadNotExpired + '.';
            i = cx.isLogin();
            expect(i).toBeTruthy();

        });

        it('should isReady', () => {
            const cx = new Connection(_sdk, _storage);
            let i = cx.isReady();
            expect(i).toBeFalsy();

            (cx as any).client = {
                isReady: () => true
            };
            i = cx.isReady();
            expect(i).toBeTruthy();
        });

        it('should getIdPayload & getAccessPayload', () => {
            const cx = new Connection(_sdk, _storage);

            let payload = cx.getIdPayload();
            expect(payload).toBe(null);
            payload = cx.getAccessPayload();
            expect(payload).toBe(null);

            (cx as any).accessToken = 'fake.fake.fake';
            (cx as any).idToken = 'fake.fake.fake';
            payload = cx.getIdPayload();
            expect(payload).toBe(null);
            payload = cx.getAccessPayload();
            expect(payload).toBe(null);

            (cx as any).accessToken = 'fake.fake.fake';
            (cx as any).idToken = 'fake.fake.fake';
            payload = cx.getIdPayload({mock: true});
            expect(payload).toBe(JSON.stringify({mock: true}));
            payload = cx.getAccessPayload(JSON.stringify({mock: true}));
            expect(payload).toBe(JSON.stringify({mock: true}));

            (cx as any).accessToken = 'fake.fake.fake';
            (cx as any).idToken = 'fake.fake.fake';
            payload = cx.getIdPayload('fakeTest');
            expect(payload).toBe('fakeTest');
            payload = cx.getAccessPayload('fakeTest');
            expect(payload).toBe('fakeTest');

            (cx as any).accessToken = '';
            (cx as any).idToken = '';
            payload = cx.getIdPayload('emptyTest');
            expect(payload).toBe('emptyTest');
            payload = cx.getAccessPayload('emptyTest');
            expect(payload).toBe('emptyTest');

            // a real one
            const realHF = {};
            const realValue1 = {
                test: true,
                apis: [
                    {key: '', url: 'http://api11', blocked: false},
                    {key: '', url: 'http://api12', blocked: false},
                    {key: '', url: 'http://api13', blocked: false}
                ]
            };
            const realValue2 = {test: true, apis: ['http://api21', 'http://api22', 'http://api23']};
            const hf = Base64.encode(JSON.stringify(realHF));
            const payload1 = Base64.encode(JSON.stringify(realValue1));
            const payload2 = Base64.encode(JSON.stringify(realValue2));
            const token1 = '' + hf + '.' + payload1 + '.' + hf;
            const token2 = '' + hf + '.' + payload2 + '.' + hf;
            // console.log('token1: ', token1);
            // console.log('token2: ', token2);
            (cx as any).accessToken = token1;
            (cx as any).idToken = token2;
            payload = cx.getAccessPayload();
            expect(payload).toBe(JSON.stringify(realValue1));
            payload = cx.getIdPayload();
            expect(payload).toBe(JSON.stringify(realValue2));

        });

        it('should setConnection', () => {
            const cx = new Connection(_sdk, _storage);
            spyOn(cx, 'setUser').and.returnValue({});
            spyOn((cx as any)._storage, 'set').and.returnValue({});

            cx.setConnection({
                _id: 'test',
                access_token: 'test1',
                id_token: 'test2',
                refresh_token: 'test3'
            });
            expect(cx.setUser).toHaveBeenCalledTimes(1);
            expect(cx.setUser).toHaveBeenCalledWith({_id: 'test', roles: [], message: ''});
            expect((cx as any)._storage.set).toHaveBeenCalledTimes(4);
            expect((cx as any)._storage.set).toHaveBeenCalledWith('v2.accessToken', 'test1');
            expect((cx as any)._storage.set).toHaveBeenCalledWith('v2.idToken', 'test2');
            expect((cx as any)._storage.set).toHaveBeenCalledWith('v2.refreshToken', 'test3');
            // todo expect((cx as any)._storage.set).toHaveBeenCalledWith('v2.states', 'test3');
            // todo expect((cx as any)._storage.set).toHaveBeenCalledWith('_cryptoSalt', 'test4');
        });

        it('should setConnectionOffline', () => {
            const cx = new Connection(_sdk, _storage);
            spyOn(cx, 'setUser').and.returnValue({});
            spyOn((cx as any)._storage, 'set').and.returnValue({});

            cx.setConnectionOffline({
                accessToken: 'test1',
                idToken: 'test2',
                refreshToken: 'test3'
            });
            expect(cx.setUser).toHaveBeenCalledTimes(1);
            expect(cx.setUser).toHaveBeenCalledWith({_id: 'demo', roles: [], message: ''});
            expect((cx as any)._storage.set).toHaveBeenCalledTimes(3);

        });

        it('should getApiEndpoints', () => {

            const srv = new Connection(_sdk, _storage);

            // without initialisation : default endpoints
            expect(srv.getApiEndpoints().length).toBe(2);
            expect(srv.getApiEndpoints()[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints()[1].url).toBe('https://miapp-sandbox.herokuapp.com/api');
            expect(srv.getApiEndpoints({filter: 'theBestOne'}).length).toBe(1);
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'}).length).toBe(1);
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'})[0].url).toBe('http://localhost:5894/api');

            // with corrupted access_token endpoints : default endpoints
            srv.accessToken = 'aaa.bbb.ccc';
            expect(srv.getApiEndpoints().length).toBe(2);
            expect(srv.getApiEndpoints()[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints()[1].url).toBe('https://miapp-sandbox.herokuapp.com/api');
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'})[0].url).toBe('http://localhost:5894/api');

            // with access_token without endpoints : default endpoints
            srv.accessToken = mocks.tokens.withoutAnyUrl;
            expect(srv.getApiEndpoints()[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints()[1].url).toBe('https://miapp-sandbox.herokuapp.com/api');
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'})[0].url).toBe('http://localhost:5894/api');

            // with valid access_token endpoints : valid new enpoints
            srv.accessToken = mocks.tokens.withApis01;
            expect(srv.getApiEndpoints().length).toBe(2);
            expect(srv.getApiEndpoints()[0].url).toBe('http://api_1');
            expect(srv.getApiEndpoints()[1].url).toBe('http://api_2');
            expect(srv.getApiEndpoints({filter: 'theBestOne'}).length).toBe(1);
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://api_1');
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'}).length).toBe(1);
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'})[0].url).toBe('http://api_1');

            // with states only ok for the last one
            srv.states = {
                'http://api_1': {state: false, time: 0, lastTimeWasOk: 1},
                'http://api_2': {state: false, time: 0, lastTimeWasOk: 2},
                'http://api3': {state: true, time: 0, lastTimeWasOk: 0}
            };
            expect(srv.getApiEndpoints().length).toBe(2);
            expect(srv.getApiEndpoints()[0].url).toBe('http://api_1');
            expect(srv.getApiEndpoints()[1].url).toBe('http://api_2');
            expect(srv.getApiEndpoints({filter: 'theBestOne'}).length).toBe(0);
            // expect(srv.getApiEndpoints({filter: 'theBestOne'})[0]).toBe('http://api3');
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'}).length).toBe(1);
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'})[0].url).toBe('http://api_2');

            // with other states, could not filter
            srv.states = {
                'http://otherapi1': {state: false, time: 0, lastTimeWasOk: 1},
                'http://otherapi2': {state: false, time: 0, lastTimeWasOk: 2},
                'http://otherapi3': {state: true, time: 0, lastTimeWasOk: 0}
            };
            expect(srv.getApiEndpoints().length).toBe(2);
            expect(srv.getApiEndpoints()[0].url).toBe('http://api_1');
            expect(srv.getApiEndpoints()[1].url).toBe('http://api_2');
            expect(srv.getApiEndpoints({filter: 'theBestOne'}).length).toBe(1);
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://api_1');
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'}).length).toBe(1);
            expect(srv.getApiEndpoints({filter: 'theBestOldOne'})[0].url).toBe('http://api_1');

        });

        it('should getApiEndpoints based on accessTokenPrev', () => {

            const srv = new Connection(_sdk, _storage);

            const previous = mocks.tokens.withApis01;
            const actual = mocks.tokens.withApis02;

            // previous accessToken with valid endpoints
            srv.accessTokenPrevious = previous;
            srv.accessToken = null;
            expect(srv.getApiEndpoints().length).toBe(4);
            expect(srv.getApiEndpoints()[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints()[1].url).toBe('https://miapp-sandbox.herokuapp.com/api');
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints()[2].url).toBe('http://api_1');
            expect(srv.getApiEndpoints()[3].url).toBe('http://api_2');

            // with corrupted access_token endpoints : default endpoints
            srv.accessTokenPrevious = previous;
            srv.accessToken = 'aaa.bbb.ccc';
            expect(srv.getApiEndpoints().length).toBe(4);
            expect(srv.getApiEndpoints()[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints()[1].url).toBe('https://miapp-sandbox.herokuapp.com/api');
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://localhost:5894/api');
            expect(srv.getApiEndpoints()[2].url).toBe('http://api_1');
            expect(srv.getApiEndpoints()[3].url).toBe('http://api_2');

            // with same access_token endpoints : valid same enpoints
            srv.accessTokenPrevious = previous;
            srv.accessToken = previous;
            expect(srv.getApiEndpoints().length).toBe(2);
            expect(srv.getApiEndpoints()[0].url).toBe('http://api_1');
            expect(srv.getApiEndpoints()[1].url).toBe('http://api_2');
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://api_1');

            // with access_token with new endpoints (new at the beginning)
            srv.accessTokenPrevious = previous;
            srv.accessToken = actual;
            expect(srv.getApiEndpoints().length).toBe(4);
            expect(srv.getApiEndpoints()[0].url).toBe('http://api_3');
            expect(srv.getApiEndpoints()[1].url).toBe('http://api_4');
            expect(srv.getApiEndpoints()[2].url).toBe('http://api_1');
            expect(srv.getApiEndpoints()[3].url).toBe('http://api_2');
            expect(srv.getApiEndpoints({filter: 'theBestOne'})[0].url).toBe('http://api_3');

            expect(srv.getApiEndpoints({filter: 'theBestOldOne'})[0].url).toBe('http://api_3');
        });

        it('should getDBs', () => {

            const srv = new Connection(_sdk, _storage);

            // without initialisation : no DB
            expect(srv.getDBs().length).toBe(0);
            expect(srv.getDBs({filter: 'theBestOne'}).length).toBe(0);

            // with corrupted access_token endpoints : no DB
            srv.accessToken = 'aaa.bbb.ccc';
            expect(srv.getDBs().length).toBe(0);
            expect(srv.getDBs({filter: 'theBestOne'}).length).toBe(0);

            // with access_token without endpoints : no DB
            srv.accessToken = mocks.tokens.withoutAnyUrl;
            expect(srv.getDBs().length).toBe(0);
            expect(srv.getDBs({filter: 'theBestOne'}).length).toBe(0);

            // with valid access_token endpoints : valid new enpoints
            srv.accessToken = mocks.tokens.withDbs;
            expect(srv.getDBs().length).toBe(2);
            expect(srv.getDBs()[0].url).toBe('http://db1');
            expect(srv.getDBs()[1].url).toBe('http://db2');
            expect(srv.getDBs({filter: 'theBestOne'}).length).toBe(1);
            expect(srv.getDBs({filter: 'theBestOne'})[0].url).toBe('http://db1');
            expect(srv.getDBs({filter: 'theBestOnes'}).length).toBe(2);
            expect(srv.getDBs({filter: 'theBestOnes'})[0].url).toBe('http://db1');
            expect(srv.getDBs({filter: 'theBestOnes'})[1].url).toBe('http://db2');

            // with other endpoints states
            srv.states = {
                'http://otherdb1': {state: true, time: 0, lastTimeWasOk: 1},
                'http://otherdb2': {state: true, time: 0, lastTimeWasOk: 2}
            };
            expect(srv.getDBs().length).toBe(2);
            expect(srv.getDBs()[0].url).toBe('http://db1');
            expect(srv.getDBs()[1].url).toBe('http://db2');
            expect(srv.getDBs({filter: 'theBestOne'}).length).toBe(1);
            expect(srv.getDBs({filter: 'theBestOne'})[0].url).toBe('http://db1');
            expect(srv.getDBs({filter: 'theBestOnes'}).length).toBe(2);
            expect(srv.getDBs({filter: 'theBestOnes'})[0].url).toBe('http://db1');
            expect(srv.getDBs({filter: 'theBestOnes'})[1].url).toBe('http://db2');

            // with all ok states
            srv.states = {
                'http://db1': {state: true, time: 0, lastTimeWasOk: 1},
                'http://db2': {state: true, time: 0, lastTimeWasOk: 2}
            };
            expect(srv.getDBs().length).toBe(2);
            expect(srv.getDBs()[0].url).toBe('http://db1');
            expect(srv.getDBs()[1].url).toBe('http://db2');
            expect(srv.getDBs({filter: 'theBestOne'}).length).toBe(1);
            expect(srv.getDBs({filter: 'theBestOne'})[0].url).toBe('http://db1');
            expect(srv.getDBs({filter: 'theBestOnes'}).length).toBe(2);
            expect(srv.getDBs({filter: 'theBestOnes'})[0].url).toBe('http://db1');
            expect(srv.getDBs({filter: 'theBestOnes'})[1].url).toBe('http://db2');

            // with states only ok for the last one
            srv.states = {
                'http://db1': {state: false, time: 0, lastTimeWasOk: 1},
                'http://db2': {state: true, time: 0, lastTimeWasOk: 2}
            };
            expect(srv.getDBs().length).toBe(2);
            expect(srv.getDBs()[0].url).toBe('http://db1');
            expect(srv.getDBs()[1].url).toBe('http://db2');
            expect(srv.getDBs({filter: 'theBestOne'}).length).toBe(1);
            expect(srv.getDBs({filter: 'theBestOne'})[0].url).toBe('http://db2');
            expect(srv.getDBs({filter: 'theBestOnes'}).length).toBe(1);
            expect(srv.getDBs({filter: 'theBestOnes'})[0].url).toBe('http://db2');
        });

        it('should verifyConnectionStates', (done) => {
            const srv = new Connection(_sdk, _storage);
            jasmine.Ajax.stubRequest(/.*mock*/).andReturn({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify({_id: 'myuserId', isok: true})
            });
            spyOn(srv, 'getApiEndpoints').and.returnValue(['http://mock/api1', 'http://mock/api2']);
            spyOn(srv, 'getDBs').and.returnValue(['http://mock/db1']);

            // todo test on states lastTimeWasOk
            srv.verifyConnectionStates()
                .then(() => {
                    expect(srv.getApiEndpoints).toHaveBeenCalledTimes(1);
                    expect(srv.getDBs).toHaveBeenCalledTimes(1);
                    expect(jasmine.Ajax.requests.count()).toBe(3);

                    let request = jasmine.Ajax.requests.at(0);
                    expect(request.url).toBe('http://mock/api1/status?isok=mock.sdk');
                    request = jasmine.Ajax.requests.at(1);
                    expect(request.url).toBe('http://mock/api2/status?isok=mock.sdk');
                    request = jasmine.Ajax.requests.at(2);
                    expect(request.url).toBe('http://mock/db1');
                    expect(Object.keys(srv.states).length).toBe(3);
                    expect(srv.states['http://mock/api1']).toBeDefined();
                    expect(srv.states['http://mock/api1'].state).toBeTruthy();
                    expect(srv.states['http://mock/db1'].state).toBeTruthy();

                    jasmine.Ajax.stubRequest(/.*/).andReturn({
                        status: 500, responseText: ''
                    });

                    return srv.verifyConnectionStates();
                })
                .then(() => {
                    expect(srv.getApiEndpoints).toHaveBeenCalledTimes(2);
                    expect(srv.getDBs).toHaveBeenCalledTimes(2);
                    expect(jasmine.Ajax.requests.count()).toBe(6);
                    let request = jasmine.Ajax.requests.at(0);
                    expect(request.url).toBe('http://mock/api1/status?isok=mock.sdk');
                    request = jasmine.Ajax.requests.at(1);
                    expect(request.url).toBe('http://mock/api2/status?isok=mock.sdk');
                    request = jasmine.Ajax.requests.at(2);
                    expect(request.url).toBe('http://mock/db1');
                    expect(Object.keys(srv.states).length).toBe(3);
                    expect(srv.states['http://mock/api1'].state).toBeFalsy();
                    expect(srv.states['http://mock/db1'].state).toBeFalsy();
                    done();
                })
                .catch((err) => {
                    done.fail(err);
                });
        });

        it('should refreshConnection : verify tokens', (done) => {

            const srv = new Connection(_sdk, _storage);
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
                '.eyJzdWIiOiI1OWU2NTFiZTkzMWEwMDUwYzFjMTQ2ZWEiLCJhdWQiOiI1OWU2NTFiZTkzMWEwMDUwYzFjMT' +
                'Q2ZWIiLCJleHAiOjE1MDgyNzM2MzAsImRicyI6WyJodHRwOi8vZGIxIiwiaHR0cDovL2RiMiJdLCJlbmRwb2' +
                'ludHMiOlt7Il9pZCI6IjU5ZTY1MWJlOTMxYTAwNTBjMWMxNDZlZSIsInVyaSI6Imh0dHA6Ly9hcGkxIiwia2' +
                'V5IjoibWlhcHAuYXBpIn0seyJfaWQiOiI1OWU2NTFiZTkzMWEwMDUwYzFjMTQ2ZWQiLCJ1cmkiOiJodHRwOi8' +
                'vYXBpMiIsImtleSI6Im1pYXBwLmFwaSJ9LHsiX2lkIjoiNTllNjUxYmU5MzFhMDA1MGMxYzE0NmVjIiwidXJp' +
                'IjoiaHR0cDovL2FwaTMiLCJrZXkiOiJtaWFwcC5hcGkifV0sImp0aSI6IjU5ZTY1MWJlOTMxYTAwNTBjMWMx' +
                'NDZlZiIsImlhdCI6MTUwODI2NjQzMH0' +
                '.KA59NcTA-jJR_hvuJzAMcw9XpPQivDXDZVsy7oSp5_0';

            // expired token
            srv.accessToken = expiredToken;
            srv.idToken = expiredToken;
            srv.refreshToken = expiredToken;
            (srv as any).client = {
                reAuthenticate: () => {
                }
            };
            spyOn((srv as any).client, 'reAuthenticate').and.returnValue(Promise.resolve({name: 'not408'}));
            spyOn(srv, 'setConnection').and.returnValue({});
            spyOn(srv, 'getUser').and.returnValue({name: 'getUser'});
            spyOn((srv as any)._storage, 'remove').and.returnValue({});
            spyOn((srv as any)._storage, 'set').and.returnValue({});

            srv.refreshConnection()
                .then((user) => {
                    expect(JSON.stringify(user)).toBe('{"name":"getUser"}');
                    expect((srv as any).client.reAuthenticate).toHaveBeenCalledTimes(1);
                    expect(srv.setConnection).toHaveBeenCalledTimes(1);
                    expect(srv.getUser).toHaveBeenCalledTimes(1);
                    expect(srv.accessToken).toBe(null);
                    expect(srv.idToken).toBe(null);
                    expect((srv as any)._storage.remove).toHaveBeenCalledTimes(3);
                    expect((srv as any)._storage.remove).toHaveBeenCalledWith('v2.accessToken');
                    expect((srv as any)._storage.remove).toHaveBeenCalledWith('v2.idToken');
                    expect((srv as any)._storage.remove).toHaveBeenCalledWith('v2.refreshToken');
                    expect(srv.accessTokenPrevious).toBe(expiredToken);
                    expect((srv as any)._storage.set).toHaveBeenCalledTimes(2);
                    expect((srv as any)._storage.set).toHaveBeenCalledWith('v2.accessTokenPrevious', expiredToken);
                    // todo expect((srv as any)._storage.set).toHaveBeenCalledWith('v2.states', []);
                    done();
                })
                .catch((err) => {
                    done.fail(err);
                });
        });

        it('should encrypt & decrypt', () => {

            const srv = new Connection(_sdk, _storage);
            srv.miappCrypto = false;
            srv.setCryptoSalt('salt');
            const dataAsString = 'testA';
            const dataAsObject = {test: true, 'testB': []};

            let result: any = srv.encrypt(dataAsString);
            expect(result).toBe('{"string":"testA"}');

            result = srv.encrypt(dataAsObject);
            expect(result).toBe(JSON.stringify(dataAsObject));

            srv.miappCrypto = true;
            result = srv.encrypt(dataAsString);
            expect(result).not.toBe(dataAsString);
            expect(result).toBe('EhMYER4IH1kfDhgHBgwXVgAVHh0dBk5OURUJBwcgTgk=');
            result = srv.decrypt(result);
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsString));

            result = srv.encrypt(dataAsObject);
            expect(result).not.toBe(dataAsObject);
            expect(result).toBe('EhMYER4IH1kfDhgHBgwXVgcEHwBRWxgGBgRAVgcEHwAxQ1YvLhw=');
            result = srv.decrypt(result);
            expect(result.test).toBeTruthy();
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsObject));

            // new salt but same encoded str
            srv.setCryptoSalt('saltNext');
            result = srv.encrypt(dataAsString);
            expect(result).not.toBe(dataAsString);
            expect(result).toBe('EhMYER4IH1kfDhgHBgwXVgAVHh0dBk5OURUJBwcgTgk=');
            result = srv.decrypt(result);
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsString));

            result = srv.encrypt(dataAsObject);
            expect(result).not.toBe(dataAsObject);
            expect(result).toBe('EhMYER4IH1kfDhgHBgwXVgcEHwBRWxgGBgRAVgcEHwAxQ1YvLhw=');
            result = srv.decrypt(result);
            expect(result.test).toBeTruthy();
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsObject));

            // becomes regular salt : new encoded str
            srv.setCryptoSaltAsVerified();

            result = srv.encrypt(dataAsString);
            expect(result).not.toBe(dataAsString);
            expect(result).toBe('EhMYESMMC1kfDhgHOwgDVgAVHh0gAlpOURUJBzokWgk=');
            result = srv.decrypt(result);
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsString));

            result = srv.encrypt(dataAsObject);
            expect(result).not.toBe(dataAsObject);
            expect(result).toBe('EhMYESMMC1kfDhgHOwgDVgcEHwBsXwwGBgRAVjoACwAxQ1YvExg=');
            result = srv.decrypt(result);
            expect(result.test).toBeTruthy();
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsObject));

            // without setCryptoSaltAsVerified, even new salt stay decrypt as old
            srv.setCryptoSalt('salt');
            result = srv.decrypt('EhMYESMMC1kfDhgHOwgDVgAVHh0gAlpOURUJBzokWgk=');
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsString));
            result = srv.decrypt('EhMYESMMC1kfDhgHOwgDVgcEHwBsXwwGBgRAVjoACwAxQ1YvExg=');
            expect(result.test).toBeTruthy();
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsObject));
            result = srv.decrypt('EhMYER4IH1kfDhgHBgwXVgAVHh0dBk5OURUJBwcgTgk=');
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsString));
            result = srv.decrypt('EhMYER4IH1kfDhgHBgwXVgcEHwBRWxgGBgRAVgcEHwAxQ1YvLhw=');
            expect(result.test).toBeTruthy();
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsObject));
            // again...
            result = srv.decrypt('EhMYESMMC1kfDhgHOwgDVgAVHh0gAlpOURUJBzokWgk=');
            expect(JSON.stringify(result)).toBe(JSON.stringify(dataAsString));
        });

    });

});

