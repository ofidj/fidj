/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// import PouchDB from 'pouchdb';
// let PouchDB: any;
import { Error } from '../sdk/error';
/** @type {?} */
var FidjPouch = window['PouchDB'] ? window['PouchDB'] : require('pouchdb').default;
/** @type {?} */
var PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
FidjPouch.plugin(PouchAdapterCordovaSqlite);
/**
 * @record
 */
export function SessionCryptoInterface() { }
/** @type {?} */
SessionCryptoInterface.prototype.obj;
/** @type {?} */
SessionCryptoInterface.prototype.method;
var Session = /** @class */ (function () {
    function Session() {
        this.db = null;
        this.dbRecordCount = 0;
        this.dbLastSync = null;
        this.remoteDb = null;
        this.dbs = [];
    }
    ;
    /**
     * @return {?}
     */
    Session.prototype.isReady = /**
     * @return {?}
     */
    function () {
        return !!this.db;
    };
    /**
     * @param {?} uid
     * @param {?=} force
     * @return {?}
     */
    Session.prototype.create = /**
     * @param {?} uid
     * @param {?=} force
     * @return {?}
     */
    function (uid, force) {
        var _this = this;
        if (!force && this.db) {
            return Promise.resolve();
        }
        this.dbRecordCount = 0;
        this.dbLastSync = null; // new Date().getTime();
        this.db = null;
        return new Promise(function (resolve, reject) {
            /** @type {?} */
            var opts = { location: 'default' };
            try {
                if (window['cordova']) {
                    opts = { location: 'default', adapter: 'cordova-sqlite' };
                    //    const plugin = require('pouchdb-adapter-cordova-sqlite');
                    //    if (plugin) { Pouch.plugin(plugin); }
                    //    this.db = new Pouch('fidj_db', {adapter: 'cordova-sqlite'});
                }
                // } else {
                // } else {
                _this.db = new FidjPouch('fidj_db_' + uid, opts); // , {adapter: 'websql'} ???
                // }
                // }
                _this.db.info()
                    .then(function (info) {
                    // todo if (info.adapter !== 'websql') {
                    return resolve(_this.db);
                    // }
                    // const newopts: any = opts || {};
                    // newopts.adapter = 'idb';
                    //
                    // const newdb = new Pouch('fidj_db', opts);
                    // this.db.replicate.to(newdb)
                    //     .then(() => {
                    //         this.db = newdb;
                    //         resolve();
                    //     })
                    //     .catch((err) => {
                    //         reject(new Error(400, err.toString()))
                    //     });
                }).catch(function (err) {
                    reject(new Error(400, err));
                });
            }
            catch (err) {
                reject(new Error(500, err));
            }
        });
    };
    /**
     * @return {?}
     */
    Session.prototype.destroy = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.db) {
            this.dbRecordCount = 0;
            this.dbLastSync = null;
            return Promise.resolve();
        }
        if (this.db && !this.db.destroy) {
            return Promise.reject(new Error(408, 'Need a valid db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.destroy(function (err, info) {
                if (err) {
                    reject(new Error(500, err));
                }
                else {
                    _this.dbRecordCount = 0;
                    _this.dbLastSync = null;
                    _this.db = null;
                    resolve();
                }
            });
        });
    };
    ;
    /**
     * @param {?} dbs
     * @return {?}
     */
    Session.prototype.setRemote = /**
     * @param {?} dbs
     * @return {?}
     */
    function (dbs) {
        this.dbs = dbs;
    };
    /**
     * @param {?} userId
     * @return {?}
     */
    Session.prototype.sync = /**
     * @param {?} userId
     * @return {?}
     */
    function (userId) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error(408, 'need db'));
        }
        if (!this.dbs || !this.dbs.length) {
            return Promise.reject(new Error(408, 'need a remote db'));
        }
        return new Promise(function (resolve, reject) {
            try {
                if (!_this.remoteDb || _this.remoteUri !== _this.dbs[0].url) {
                    _this.remoteUri = _this.dbs[0].url;
                    _this.remoteDb = new FidjPouch(_this.remoteUri);
                    // todo , {headers: {'Authorization': 'Bearer ' + id_token}});
                }
                _this.db.replicate.to(_this.remoteDb)
                    .on('complete', function (info) {
                    return _this.remoteDb.replicate.to(_this.db, {
                        filter: function (doc) {
                            return (!!userId && !!doc && doc.fidjUserId === userId);
                        }
                    })
                        .on('complete', function () {
                        // this.logger
                        resolve();
                    })
                        .on('denied', function (err) { return reject({ code: 403, reason: err }); })
                        .on('error', function (err) { return reject({ code: 401, reason: err }); });
                })
                    .on('denied', function (err) { return reject({ code: 403, reason: err }); })
                    .on('error', function (err) { return reject({ code: 401, reason: err }); });
            }
            catch (err) {
                reject(new Error(500, err));
            }
        });
    };
    /**
     * @param {?} data
     * @param {?} _id
     * @param {?} uid
     * @param {?} oid
     * @param {?} ave
     * @param {?=} crypto
     * @return {?}
     */
    Session.prototype.put = /**
     * @param {?} data
     * @param {?} _id
     * @param {?} uid
     * @param {?} oid
     * @param {?} ave
     * @param {?=} crypto
     * @return {?}
     */
    function (data, _id, uid, oid, ave, crypto) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error(408, 'need db'));
        }
        if (!data || !_id || !uid || !oid || !ave) {
            return Promise.reject(new Error(400, 'need formated data'));
        }
        /** @type {?} */
        var dataWithoutIds = JSON.parse(JSON.stringify(data));
        /** @type {?} */
        var toStore = {
            _id: _id,
            fidjUserId: uid,
            fidjOrgId: oid,
            fidjAppVersion: ave
        };
        if (dataWithoutIds._rev) {
            toStore._rev = '' + dataWithoutIds._rev;
        }
        delete dataWithoutIds._id;
        delete dataWithoutIds._rev;
        delete dataWithoutIds.fidjUserId;
        delete dataWithoutIds.fidjOrgId;
        delete dataWithoutIds.fidjAppVersion;
        delete dataWithoutIds.fidjData;
        /** @type {?} */
        var resultAsString = Session.write(Session.value(dataWithoutIds));
        if (crypto) {
            resultAsString = crypto.obj[crypto.method](resultAsString);
            toStore.fidjDacr = resultAsString;
        }
        else {
            toStore.fidjData = resultAsString;
        }
        return new Promise(function (resolve, reject) {
            _this.db.put(toStore, function (err, response) {
                if (response && response.ok && response.id && response.rev) {
                    _this.dbRecordCount++;
                    // propagate _rev & _id
                    if (typeof data === 'object') {
                        (/** @type {?} */ (data))._rev = response.rev;
                        (/** @type {?} */ (data))._id = response.id;
                        resolve(data);
                    }
                    else {
                        resolve(response.id);
                    }
                }
                else {
                    reject(new Error(500, err));
                }
            });
        });
    };
    /**
     * @param {?} data_id
     * @return {?}
     */
    Session.prototype.remove = /**
     * @param {?} data_id
     * @return {?}
     */
    function (data_id) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error(408, 'need db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.get(data_id)
                .then(function (doc) {
                doc._deleted = true;
                return _this.db.put(doc);
            })
                .then(function (result) {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * @param {?} data_id
     * @param {?=} crypto
     * @return {?}
     */
    Session.prototype.get = /**
     * @param {?} data_id
     * @param {?=} crypto
     * @return {?}
     */
    function (data_id, crypto) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error(408, 'Need db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.get(data_id)
                .then(function (row) {
                if (!!row && (!!row.fidjDacr || !!row.fidjData)) {
                    /** @type {?} */
                    var data = row.fidjDacr;
                    if (crypto && data) {
                        data = crypto.obj[crypto.method](data);
                    }
                    else if (row.fidjData) {
                        data = JSON.parse(row.fidjData);
                    }
                    /** @type {?} */
                    var resultAsJson = Session.extractJson(data);
                    if (resultAsJson) {
                        resultAsJson._id = row._id;
                        resultAsJson._rev = row._rev;
                        resolve(JSON.parse(JSON.stringify(resultAsJson)));
                    }
                    else {
                        // row._deleted = true;
                        // row._deleted = true;
                        _this.remove(row._id);
                        reject(new Error(400, 'Bad encoding'));
                    }
                }
                else {
                    reject(new Error(400, 'No data found'));
                }
            })
                .catch(function (err) { return reject(new Error(500, err)); });
        });
    };
    /**
     * @param {?=} crypto
     * @return {?}
     */
    Session.prototype.getAll = /**
     * @param {?=} crypto
     * @return {?}
     */
    function (crypto) {
        var _this = this;
        if (!this.db || !(/** @type {?} */ (this.db)).allDocs) {
            return Promise.reject(new Error(408, 'Need a valid db'));
        }
        return new Promise(function (resolve, reject) {
            (/** @type {?} */ (_this.db)).allDocs({ include_docs: true, descending: true })
                .then(function (rows) {
                /** @type {?} */
                var all = [];
                rows.rows.forEach(function (row) {
                    if (!!row && !!row.doc._id && (!!row.doc.fidjDacr || !!row.doc.fidjData)) {
                        /** @type {?} */
                        var data = row.doc.fidjDacr;
                        if (crypto && data) {
                            data = crypto.obj[crypto.method](data);
                        }
                        else if (row.doc.fidjData) {
                            data = JSON.parse(row.doc.fidjData);
                        }
                        /** @type {?} */
                        var resultAsJson = Session.extractJson(data);
                        if (resultAsJson) {
                            resultAsJson._id = row.doc._id;
                            resultAsJson._rev = row.doc._rev;
                            all.push(JSON.parse(JSON.stringify(resultAsJson)));
                        }
                        else {
                            console.error('Bad encoding : delete row');
                            // resultAsJson = {};
                            // resultAsJson._id = row.doc._id;
                            // resultAsJson._rev = row.doc._rev;
                            // resultAsJson._deleted = true;
                            // all.push(resultAsJson);
                            // resultAsJson = {};
                            // resultAsJson._id = row.doc._id;
                            // resultAsJson._rev = row.doc._rev;
                            // resultAsJson._deleted = true;
                            // all.push(resultAsJson);
                            _this.remove(row.doc._id);
                        }
                    }
                    else {
                        console.error('Bad encoding');
                    }
                });
                resolve(all);
            })
                .catch(function (err) { return reject(new Error(400, err)); });
        });
    };
    /**
     * @return {?}
     */
    Session.prototype.isEmpty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.db || !(/** @type {?} */ (this.db)).allDocs) {
            return Promise.reject(new Error(408, 'No db'));
        }
        return new Promise(function (resolve, reject) {
            (/** @type {?} */ (_this.db)).allDocs({})
                .then(function (response) {
                if (!response) {
                    reject(new Error(400, 'No response'));
                }
                else {
                    _this.dbRecordCount = response.total_rows;
                    if (response.total_rows && response.total_rows > 0) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                }
            })
                .catch(function (err) { return reject(new Error(400, err)); });
        });
    };
    /**
     * @return {?}
     */
    Session.prototype.info = /**
     * @return {?}
     */
    function () {
        if (!this.db) {
            return Promise.reject(new Error(408, 'No db'));
        }
        return this.db.info();
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Session.write = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var value = 'null';
        /** @type {?} */
        var t = typeof (item);
        if (t === 'undefined') {
            value = 'null';
        }
        else if (value === null) {
            value = 'null';
        }
        else if (t === 'string') {
            value = JSON.stringify({ string: item });
        }
        else if (t === 'number') {
            value = JSON.stringify({ number: item });
        }
        else if (t === 'boolean') {
            value = JSON.stringify({ bool: item });
        }
        else if (t === 'object') {
            value = JSON.stringify({ json: item });
        }
        return value;
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Session.value = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result = item;
        if (typeof (item) !== 'object') {
            // return item;
        }
        else if ('string' in item) {
            result = item.string;
        }
        else if ('number' in item) {
            result = item.number.valueOf();
        }
        else if ('bool' in item) {
            result = item.bool.valueOf();
        }
        else if ('json' in item) {
            result = item.json;
            if (typeof (result) !== 'object') {
                result = JSON.parse(result);
            }
        }
        return result;
    };
    /**
     * @param {?} item
     * @return {?}
     */
    Session.extractJson = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result = item;
        if (!item) {
            return null;
        }
        if (typeof (item) === 'object' && 'json' in item) {
            result = item.json;
        }
        if (typeof (result) === 'string') {
            result = JSON.parse(result);
        }
        if (typeof (result) === 'object' && 'json' in result) {
            result = (/** @type {?} */ (result)).json;
        }
        if (typeof result !== 'object') {
            result = null;
        }
        return result;
    };
    return Session;
}());
export { Session };
if (false) {
    /** @type {?} */
    Session.prototype.dbRecordCount;
    /** @type {?} */
    Session.prototype.dbLastSync;
    /** @type {?} */
    Session.prototype.db;
    /** @type {?} */
    Session.prototype.remoteDb;
    /** @type {?} */
    Session.prototype.remoteUri;
    /** @type {?} */
    Session.prototype.dbs;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZXNzaW9uL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGNBQWMsQ0FBQzs7QUFHbkMsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7O0FBR3JGLElBQU0seUJBQXlCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDNUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7QUFPNUMsSUFBQTtJQVVJO1FBQ0ksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDZixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztLQUNqQjtJQUFBLENBQUM7Ozs7SUFFSyx5QkFBTzs7OztRQUNWLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Ozs7Ozs7SUFJZCx3QkFBTTs7Ozs7Y0FBQyxHQUFXLEVBQUUsS0FBZTs7UUFFdEMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ25CLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzVCO1FBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFZixP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QUFDO1NBQ2pCO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDakI7a0JBamFMO0lBbWFDLENBQUE7QUFqWkQsbUJBaVpDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYic7XG4vLyBsZXQgUG91Y2hEQjogYW55O1xuXG5pbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiL2Rpc3QvcG91Y2hkYi5qcyc7XG5pbXBvcnQge0Vycm9yfSBmcm9tICcuLi9zZGsvZXJyb3InO1xuaW1wb3J0IHtFbmRwb2ludEludGVyZmFjZSwgRXJyb3JJbnRlcmZhY2V9IGZyb20gJy4uL3Nkay9pbnRlcmZhY2VzJztcblxuY29uc3QgRmlkalBvdWNoID0gd2luZG93WydQb3VjaERCJ10gPyB3aW5kb3dbJ1BvdWNoREInXSA6IHJlcXVpcmUoJ3BvdWNoZGInKS5kZWZhdWx0OyAvLyAuZGVmYXVsdDtcblxuLy8gbG9hZCBjb3Jkb3ZhIGFkYXB0ZXIgOiBodHRwczovL2dpdGh1Yi5jb20vcG91Y2hkYi1jb21tdW5pdHkvcG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlL2lzc3Vlcy8yMlxuY29uc3QgUG91Y2hBZGFwdGVyQ29yZG92YVNxbGl0ZSA9IHJlcXVpcmUoJ3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZScpO1xuRmlkalBvdWNoLnBsdWdpbihQb3VjaEFkYXB0ZXJDb3Jkb3ZhU3FsaXRlKTtcblxuZXhwb3J0IGludGVyZmFjZSBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlIHtcbiAgICBvYmo6IE9iamVjdCxcbiAgICBtZXRob2Q6IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgU2Vzc2lvbiB7XG5cbiAgICBwdWJsaWMgZGJSZWNvcmRDb3VudDogbnVtYmVyO1xuICAgIHB1YmxpYyBkYkxhc3RTeW5jOiBudW1iZXI7IC8vIERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBwcml2YXRlIGRiOiBQb3VjaERCOyAvLyBQb3VjaERCXG4gICAgcHJpdmF0ZSByZW1vdGVEYjogUG91Y2hEQjsgLy8gUG91Y2hEQjtcbiAgICBwcml2YXRlIHJlbW90ZVVyaTogc3RyaW5nO1xuICAgIHByaXZhdGUgZGJzOiBBcnJheTxFbmRwb2ludEludGVyZmFjZT47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgIHRoaXMucmVtb3RlRGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRicyA9IFtdO1xuICAgIH07XG5cbiAgICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5kYjtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBjcmVhdGUodWlkOiBzdHJpbmcsIGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsOyAvLyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgbGV0IG9wdHM6IGFueSA9IHtsb2NhdGlvbjogJ2RlZmF1bHQnfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvd1snY29yZG92YSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMgPSB7bG9jYXRpb246ICdkZWZhdWx0JywgYWRhcHRlcjogJ2NvcmRvdmEtc3FsaXRlJ307XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGNvbnN0IHBsdWdpbiA9IHJlcXVpcmUoJ3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZScpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICBpZiAocGx1Z2luKSB7IFBvdWNoLnBsdWdpbihwbHVnaW4pOyB9XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuZGIgPSBuZXcgUG91Y2goJ2ZpZGpfZGInLCB7YWRhcHRlcjogJ2NvcmRvdmEtc3FsaXRlJ30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGIgPSBuZXcgRmlkalBvdWNoKCdmaWRqX2RiXycgKyB1aWQsIG9wdHMpOyAvLyAsIHthZGFwdGVyOiAnd2Vic3FsJ30gPz8/XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kYi5pbmZvKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGluZm8pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyBpZiAoaW5mby5hZGFwdGVyICE9PSAnd2Vic3FsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGhpcy5kYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5ld29wdHM6IGFueSA9IG9wdHMgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXdvcHRzLmFkYXB0ZXIgPSAnaWRiJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBuZXdkYiA9IG5ldyBQb3VjaCgnZmlkal9kYicsIG9wdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5kYi5yZXBsaWNhdGUudG8obmV3ZGIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLmRiID0gbmV3ZGI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIudG9TdHJpbmcoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyKSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3koKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGIgJiYgIXRoaXMuZGIuZGVzdHJveSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGEgdmFsaWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5kZXN0cm95KChlcnIsIGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIHNldFJlbW90ZShkYnM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPik6IHZvaWQge1xuICAgICAgICB0aGlzLmRicyA9IGRicztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3luYyh1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgZGInKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmRicyB8fCAhdGhpcy5kYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgYSByZW1vdGUgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZW1vdGVEYiB8fCB0aGlzLnJlbW90ZVVyaSAhPT0gdGhpcy5kYnNbMF0udXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlVXJpID0gdGhpcy5kYnNbMF0udXJsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW90ZURiID0gbmV3IEZpZGpQb3VjaCh0aGlzLnJlbW90ZVVyaSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gLCB7aGVhZGVyczogeydBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgaWRfdG9rZW59fSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kYi5yZXBsaWNhdGUudG8odGhpcy5yZW1vdGVEYilcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjb21wbGV0ZScsIChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdGVEYi5yZXBsaWNhdGUudG8odGhpcy5kYixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICghIXVzZXJJZCAmJiAhIWRvYyAmJiBkb2MuZmlkalVzZXJJZCA9PT0gdXNlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjb21wbGV0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2dnZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdkZW5pZWQnLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiBlcnJ9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2Vycm9yJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDEsIHJlYXNvbjogZXJyfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGVuaWVkJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDMsIHJlYXNvbjogZXJyfSkpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMSwgcmVhc29uOiBlcnJ9KSk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHB1dChkYXRhOiBhbnksXG4gICAgICAgICAgICAgICBfaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIHVpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgb2lkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBhdmU6IHN0cmluZyxcbiAgICAgICAgICAgICAgIGNyeXB0bz86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGEgfHwgIV9pZCB8fCAhdWlkIHx8ICFvaWQgfHwgIWF2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDAsICduZWVkIGZvcm1hdGVkIGRhdGEnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhV2l0aG91dElkcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICBjb25zdCB0b1N0b3JlOiBhbnkgPSB7XG4gICAgICAgICAgICBfaWQ6IF9pZCxcbiAgICAgICAgICAgIGZpZGpVc2VySWQ6IHVpZCxcbiAgICAgICAgICAgIGZpZGpPcmdJZDogb2lkLFxuICAgICAgICAgICAgZmlkakFwcFZlcnNpb246IGF2ZVxuICAgICAgICB9O1xuICAgICAgICBpZiAoZGF0YVdpdGhvdXRJZHMuX3Jldikge1xuICAgICAgICAgICAgdG9TdG9yZS5fcmV2ID0gJycgKyBkYXRhV2l0aG91dElkcy5fcmV2O1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5faWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5fcmV2O1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkalVzZXJJZDtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpPcmdJZDtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpBcHBWZXJzaW9uO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkakRhdGE7XG5cbiAgICAgICAgbGV0IHJlc3VsdEFzU3RyaW5nID0gU2Vzc2lvbi53cml0ZShTZXNzaW9uLnZhbHVlKGRhdGFXaXRob3V0SWRzKSk7XG4gICAgICAgIGlmIChjcnlwdG8pIHtcbiAgICAgICAgICAgIHJlc3VsdEFzU3RyaW5nID0gY3J5cHRvLm9ialtjcnlwdG8ubWV0aG9kXShyZXN1bHRBc1N0cmluZyk7XG4gICAgICAgICAgICB0b1N0b3JlLmZpZGpEYWNyID0gcmVzdWx0QXNTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1N0b3JlLmZpZGpEYXRhID0gcmVzdWx0QXNTdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5wdXQodG9TdG9yZSwgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgcmVzcG9uc2Uub2sgJiYgcmVzcG9uc2UuaWQgJiYgcmVzcG9uc2UucmV2KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCsrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHByb3BhZ2F0ZSBfcmV2ICYgX2lkXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChkYXRhIGFzIGFueSkuX3JldiA9IHJlc3BvbnNlLnJldjtcbiAgICAgICAgICAgICAgICAgICAgICAgIChkYXRhIGFzIGFueSkuX2lkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZShkYXRhX2lkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIuZ2V0KGRhdGFfaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkb2MuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYi5wdXQoZG9jKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQoZGF0YV9pZDogc3RyaW5nLCBjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIuZ2V0KGRhdGFfaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4ocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhcm93ICYmICghIXJvdy5maWRqRGFjciB8fCAhIXJvdy5maWRqRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcm93LmZpZGpEYWNyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNyeXB0byAmJiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5maWRqRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJvdy5maWRqRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRBc0pzb24gPSBTZXNzaW9uLmV4dHJhY3RKc29uKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdEFzSnNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5faWQgPSByb3cuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5fcmV2ID0gcm93Ll9yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdEFzSnNvbikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcm93Ll9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyb3cuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ0JhZCBlbmNvZGluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTm8gZGF0YSBmb3VuZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QWxsKGNyeXB0bz86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2UpOiBQcm9taXNlPEFycmF5PGFueT4gfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYiB8fCAhKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05lZWQgYSB2YWxpZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAodGhpcy5kYiBhcyBhbnkpLmFsbERvY3Moe2luY2x1ZGVfZG9jczogdHJ1ZSwgZGVzY2VuZGluZzogdHJ1ZX0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocm93cyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICByb3dzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhcm93ICYmICEhcm93LmRvYy5faWQgJiYgKCEhcm93LmRvYy5maWRqRGFjciB8fCAhIXJvdy5kb2MuZmlkakRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByb3cuZG9jLmZpZGpEYWNyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjcnlwdG8gJiYgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY3J5cHRvLm9ialtjcnlwdG8ubWV0aG9kXShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJvdy5kb2MuZmlkakRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2Uocm93LmRvYy5maWRqRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdEFzSnNvbiA9IFNlc3Npb24uZXh0cmFjdEpzb24oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdEFzSnNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX2lkID0gcm93LmRvYy5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5fcmV2ID0gcm93LmRvYy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGwucHVzaChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdEFzSnNvbikpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWQgZW5jb2RpbmcgOiBkZWxldGUgcm93Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX2lkID0gcm93LmRvYy5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbi5fcmV2ID0gcm93LmRvYy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGwucHVzaChyZXN1bHRBc0pzb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShyb3cuZG9jLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdCYWQgZW5jb2RpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYWxsKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzRW1wdHkoKTogUHJvbWlzZTxib29sZWFuIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIgfHwgISh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdObyBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAodGhpcy5kYiBhcyBhbnkpLmFsbERvY3Moe1xuICAgICAgICAgICAgICAgIC8vIGZpbHRlcjogIChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAoIXNlbGYuY29ubmVjdGlvbi51c2VyIHx8ICFzZWxmLmNvbm5lY3Rpb24udXNlci5faWQpIHJldHVybiBkb2M7XG4gICAgICAgICAgICAgICAgLy8gICAgaWYgKGRvYy5maWRqVXNlcklkID09PSBzZWxmLmNvbm5lY3Rpb24udXNlci5faWQpIHJldHVybiBkb2M7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdObyByZXNwb25zZScpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IHJlc3BvbnNlLnRvdGFsX3Jvd3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UudG90YWxfcm93cyAmJiByZXNwb25zZS50b3RhbF9yb3dzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGluZm8oKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05vIGRiJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRiLmluZm8oKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgd3JpdGUoaXRlbTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHZhbHVlID0gJ251bGwnO1xuICAgICAgICBjb25zdCB0ID0gdHlwZW9mKGl0ZW0pO1xuICAgICAgICBpZiAodCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7c3RyaW5nOiBpdGVtfSlcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7bnVtYmVyOiBpdGVtfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtib29sOiBpdGVtfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe2pzb246IGl0ZW19KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgc3RhdGljIHZhbHVlKGl0ZW06IGFueSk6IGFueSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBpdGVtO1xuICAgICAgICBpZiAodHlwZW9mKGl0ZW0pICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGl0ZW07XG4gICAgICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5zdHJpbmc7XG4gICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5udW1iZXIudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdib29sJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmJvb2wudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdqc29uJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmpzb247XG4gICAgICAgICAgICBpZiAodHlwZW9mKHJlc3VsdCkgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGV4dHJhY3RKc29uKGl0ZW06IGFueSk6IGFueSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBpdGVtO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKGl0ZW0pID09PSAnb2JqZWN0JyAmJiAnanNvbicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5qc29uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3VsdCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAocmVzdWx0KSA9PT0gJ29iamVjdCcgJiYgJ2pzb24nIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gKHJlc3VsdCBhcyBhbnkpLmpzb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG59XG4iXX0=