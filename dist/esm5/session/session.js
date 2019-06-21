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
        uid = uid || 'default';
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
                        .on('denied', function (err) { return reject({ code: 403, reason: { second: err } }); })
                        .on('error', function (err) { return reject({ code: 401, reason: { second: err } }); });
                })
                    .on('denied', function (err) { return reject({ code: 403, reason: { first: err } }); })
                    .on('error', function (err) { return reject({ code: 401, reason: { first: err } }); });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZXNzaW9uL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGNBQWMsQ0FBQzs7QUFHbkMsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7O0FBR3JGLElBQU0seUJBQXlCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDNUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7QUFPNUMsSUFBQTtJQVVJO1FBQ0ksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDZixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztLQUNqQjtJQUFBLENBQUM7Ozs7SUFFSyx5QkFBTzs7OztRQUNWLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Ozs7Ozs7SUFJZCx3QkFBTTs7Ozs7Y0FBQyxHQUFXLEVBQUUsS0FBZTs7UUFFdEMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ25CLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzVCO1FBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDZixH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LEVBQUU7WUFDbEQsTUFBTSxHQUFHLG1CQUFDLE1BQWEsRUFBQyxDQUFDLElBQUksQ0FBQztTQUNqQztRQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQzVCLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDakI7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNqQjtrQkFsYUw7SUFvYUMsQ0FBQTtBQWxaRCxtQkFrWkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGxldCBQb3VjaERCOiBhbnk7XG5cbmltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4uL3Nkay9lcnJvcic7XG5pbXBvcnQge0VuZHBvaW50SW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuXG5jb25zdCBGaWRqUG91Y2ggPSB3aW5kb3dbJ1BvdWNoREInXSA/IHdpbmRvd1snUG91Y2hEQiddIDogcmVxdWlyZSgncG91Y2hkYicpLmRlZmF1bHQ7IC8vIC5kZWZhdWx0O1xuXG4vLyBsb2FkIGNvcmRvdmEgYWRhcHRlciA6IGh0dHBzOi8vZ2l0aHViLmNvbS9wb3VjaGRiLWNvbW11bml0eS9wb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUvaXNzdWVzLzIyXG5jb25zdCBQb3VjaEFkYXB0ZXJDb3Jkb3ZhU3FsaXRlID0gcmVxdWlyZSgncG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlJyk7XG5GaWRqUG91Y2gucGx1Z2luKFBvdWNoQWRhcHRlckNvcmRvdmFTcWxpdGUpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25DcnlwdG9JbnRlcmZhY2Uge1xuICAgIG9iajogT2JqZWN0LFxuICAgIG1ldGhvZDogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBTZXNzaW9uIHtcblxuICAgIHB1YmxpYyBkYlJlY29yZENvdW50OiBudW1iZXI7XG4gICAgcHVibGljIGRiTGFzdFN5bmM6IG51bWJlcjsgLy8gRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIHByaXZhdGUgZGI6IFBvdWNoREI7IC8vIFBvdWNoREJcbiAgICBwcml2YXRlIHJlbW90ZURiOiBQb3VjaERCOyAvLyBQb3VjaERCO1xuICAgIHByaXZhdGUgcmVtb3RlVXJpOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBkYnM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW1vdGVEYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGJzID0gW107XG4gICAgfTtcblxuICAgIHB1YmxpYyBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmRiO1xuICAgIH1cblxuXG4gICAgcHVibGljIGNyZWF0ZSh1aWQ6IHN0cmluZywgZm9yY2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIWZvcmNlICYmIHRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7IC8vIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgdWlkID0gdWlkIHx8ICdkZWZhdWx0JztcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgb3B0czogYW55ID0ge2xvY2F0aW9uOiAnZGVmYXVsdCd9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93Wydjb3Jkb3ZhJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9IHtsb2NhdGlvbjogJ2RlZmF1bHQnLCBhZGFwdGVyOiAnY29yZG92YS1zcWxpdGUnfTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY29uc3QgcGx1Z2luID0gcmVxdWlyZSgncG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGlmIChwbHVnaW4pIHsgUG91Y2gucGx1Z2luKHBsdWdpbik7IH1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgdGhpcy5kYiA9IG5ldyBQb3VjaCgnZmlkal9kYicsIHthZGFwdGVyOiAnY29yZG92YS1zcWxpdGUnfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYiA9IG5ldyBGaWRqUG91Y2goJ2ZpZGpfZGJfJyArIHVpZCwgb3B0cyk7IC8vICwge2FkYXB0ZXI6ICd3ZWJzcWwnfSA/Pz9cbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRiLmluZm8oKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoaW5mbykgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIGlmIChpbmZvLmFkYXB0ZXIgIT09ICd3ZWJzcWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLmRiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgbmV3b3B0czogYW55ID0gb3B0cyB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ld29wdHMuYWRhcHRlciA9ICdpZGInO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5ld2RiID0gbmV3IFBvdWNoKCdmaWRqX2RiJywgb3B0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmRiLnJlcGxpY2F0ZS50byhuZXdkYilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuZGIgPSBuZXdkYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVyci50b1N0cmluZygpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVzdHJveSgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kYiAmJiAhdGhpcy5kYi5kZXN0cm95KSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05lZWQgYSB2YWxpZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmRlc3Ryb3koKGVyciwgaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0UmVtb3RlKGRiczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGJzID0gZGJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzeW5jKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZGJzIHx8ICF0aGlzLmRicy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBhIHJlbW90ZSBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJlbW90ZURiIHx8IHRoaXMucmVtb3RlVXJpICE9PSB0aGlzLmRic1swXS51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdGVVcmkgPSB0aGlzLmRic1swXS51cmw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlRGIgPSBuZXcgRmlkalBvdWNoKHRoaXMucmVtb3RlVXJpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyAsIHtoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBpZF90b2tlbn19KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRiLnJlcGxpY2F0ZS50byh0aGlzLnJlbW90ZURiKVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NvbXBsZXRlJywgKGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW90ZURiLnJlcGxpY2F0ZS50byh0aGlzLmRiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCEhdXNlcklkICYmICEhZG9jICYmIGRvYy5maWRqVXNlcklkID09PSB1c2VySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NvbXBsZXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvZ2dlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RlbmllZCcsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246IHtzZWNvbmQ6IGVycn19KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2Vycm9yJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDEsIHJlYXNvbjogIHtzZWNvbmQ6IGVycn19KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdkZW5pZWQnLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAge2ZpcnN0OiBlcnJ9fSkpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMSwgcmVhc29uOiAge2ZpcnN0OiBlcnJ9fSkpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXQoZGF0YTogYW55LFxuICAgICAgICAgICAgICAgX2lkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICB1aWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIG9pZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgYXZlOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhIHx8ICFfaWQgfHwgIXVpZCB8fCAhb2lkIHx8ICFhdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnbmVlZCBmb3JtYXRlZCBkYXRhJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YVdpdGhvdXRJZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgY29uc3QgdG9TdG9yZTogYW55ID0ge1xuICAgICAgICAgICAgX2lkOiBfaWQsXG4gICAgICAgICAgICBmaWRqVXNlcklkOiB1aWQsXG4gICAgICAgICAgICBmaWRqT3JnSWQ6IG9pZCxcbiAgICAgICAgICAgIGZpZGpBcHBWZXJzaW9uOiBhdmVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRhdGFXaXRob3V0SWRzLl9yZXYpIHtcbiAgICAgICAgICAgIHRvU3RvcmUuX3JldiA9ICcnICsgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX2lkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpVc2VySWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqT3JnSWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqQXBwVmVyc2lvbjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpEYXRhO1xuXG4gICAgICAgIGxldCByZXN1bHRBc1N0cmluZyA9IFNlc3Npb24ud3JpdGUoU2Vzc2lvbi52YWx1ZShkYXRhV2l0aG91dElkcykpO1xuICAgICAgICBpZiAoY3J5cHRvKSB7XG4gICAgICAgICAgICByZXN1bHRBc1N0cmluZyA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0ocmVzdWx0QXNTdHJpbmcpO1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGFjciA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGF0YSA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIucHV0KHRvU3RvcmUsIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLm9rICYmIHJlc3BvbnNlLmlkICYmIHJlc3BvbnNlLnJldikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQrKztcblxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wYWdhdGUgX3JldiAmIF9pZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9yZXYgPSByZXNwb25zZS5yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmUoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9jLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGIucHV0KGRvYyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0KGRhdGFfaWQ6IHN0cmluZywgY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAoISFyb3cuZmlkakRhY3IgfHwgISFyb3cuZmlkakRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJvdy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjcnlwdG8gJiYgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZmlkakRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShyb3cuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0QXNKc29uID0gU2Vzc2lvbi5leHRyYWN0SnNvbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX2lkID0gcm93Ll9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvdy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdCYWQgZW5jb2RpbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ05vIGRhdGEgZm91bmQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFsbChjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxBcnJheTxhbnk+IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIgfHwgISh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGEgdmFsaWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtpbmNsdWRlX2RvY3M6IHRydWUsIGRlc2NlbmRpbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgIC50aGVuKHJvd3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGwgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAhIXJvdy5kb2MuX2lkICYmICghIXJvdy5kb2MuZmlkakRhY3IgfHwgISFyb3cuZG9jLmZpZGpEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcm93LmRvYy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3J5cHRvICYmIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZG9jLmZpZGpEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJvdy5kb2MuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRBc0pzb24gPSBTZXNzaW9uLmV4dHJhY3RKc29uKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2goSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nIDogZGVsZXRlIHJvdycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsLnB1c2gocmVzdWx0QXNKc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93LmRvYy5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFsbCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IFByb21pc2U8Ym9vbGVhbiB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiIHx8ICEodGhpcy5kYiBhcyBhbnkpLmFsbERvY3MpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTm8gZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtcbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXI6ICAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24udXNlciB8fCAhc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vICAgIGlmIChkb2MuZmlkalVzZXJJZCA9PT0gc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTm8gcmVzcG9uc2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSByZXNwb25zZS50b3RhbF9yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsX3Jvd3MgJiYgcmVzcG9uc2UudG90YWxfcm93cyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdObyBkYicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kYi5pbmZvKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHdyaXRlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZiAoaXRlbSk7XG4gICAgICAgIGlmICh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtzdHJpbmc6IGl0ZW19KVxuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtudW1iZXI6IGl0ZW19KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe2Jvb2w6IGl0ZW19KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7anNvbjogaXRlbX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgdmFsdWUoaXRlbTogYW55KTogYW55IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGl0ZW07XG4gICAgICAgIGlmICh0eXBlb2YgKGl0ZW0pICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGl0ZW07XG4gICAgICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5zdHJpbmc7XG4gICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5udW1iZXIudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdib29sJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmJvb2wudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdqc29uJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmpzb247XG4gICAgICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHN0YXRpYyBleHRyYWN0SnNvbihpdGVtOiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gaXRlbTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChpdGVtKSA9PT0gJ29iamVjdCcgJiYgJ2pzb24nIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uanNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3VsdCkgPT09ICdvYmplY3QnICYmICdqc29uJyBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChyZXN1bHQgYXMgYW55KS5qc29uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuIl19