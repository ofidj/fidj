// import PouchDB from 'pouchdb';
// let PouchDB: any;
import { Error } from '../sdk/error';
var FidjPouch = (window && window['PouchDB']) ? window['PouchDB'] : require('pouchdb').default; // .default;
// load cordova adapter : https://github.com/pouchdb-community/pouchdb-adapter-cordova-sqlite/issues/22
var PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
FidjPouch.plugin(PouchAdapterCordovaSqlite);
var Session = /** @class */ (function () {
    function Session() {
        this.db = null;
        this.dbRecordCount = 0;
        this.dbLastSync = null;
        this.remoteDb = null;
        this.dbs = [];
    }
    ;
    Session.prototype.isReady = function () {
        return !!this.db;
    };
    Session.prototype.create = function (uid, force) {
        var _this = this;
        if (!force && this.db) {
            return Promise.resolve();
        }
        this.dbRecordCount = 0;
        this.dbLastSync = null; // new Date().getTime();
        this.db = null;
        uid = uid || 'default';
        return new Promise(function (resolve, reject) {
            var opts = { location: 'default' };
            try {
                if (window && window['cordova']) {
                    opts = { location: 'default', adapter: 'cordova-sqlite' };
                    //    const plugin = require('pouchdb-adapter-cordova-sqlite');
                    //    if (plugin) { Pouch.plugin(plugin); }
                    //    this.db = new Pouch('fidj_db', {adapter: 'cordova-sqlite'});
                }
                // } else {
                _this.db = new FidjPouch('fidj_db_' + uid, opts); // , {adapter: 'websql'} ???
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
    Session.prototype.destroy = function () {
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
    Session.prototype.setRemote = function (dbs) {
        this.dbs = dbs;
    };
    Session.prototype.sync = function (userId) {
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
    Session.prototype.put = function (data, _id, uid, oid, ave, crypto) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error(408, 'need db'));
        }
        if (!data || !_id || !uid || !oid || !ave) {
            return Promise.reject(new Error(400, 'need formated data'));
        }
        var dataWithoutIds = JSON.parse(JSON.stringify(data));
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
                        data._rev = response.rev;
                        data._id = response.id;
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
    Session.prototype.remove = function (data_id) {
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
    Session.prototype.get = function (data_id, crypto) {
        var _this = this;
        if (!this.db) {
            return Promise.reject(new Error(408, 'Need db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.get(data_id)
                .then(function (row) {
                if (!!row && (!!row.fidjDacr || !!row.fidjData)) {
                    var data = row.fidjDacr;
                    if (crypto && data) {
                        data = crypto.obj[crypto.method](data);
                    }
                    else if (row.fidjData) {
                        data = JSON.parse(row.fidjData);
                    }
                    var resultAsJson = Session.extractJson(data);
                    if (resultAsJson) {
                        resultAsJson._id = row._id;
                        resultAsJson._rev = row._rev;
                        resolve(JSON.parse(JSON.stringify(resultAsJson)));
                    }
                    else {
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
    Session.prototype.getAll = function (crypto) {
        var _this = this;
        if (!this.db || !this.db.allDocs) {
            return Promise.reject(new Error(408, 'Need a valid db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.allDocs({ include_docs: true, descending: true })
                .then(function (rows) {
                var all = [];
                rows.rows.forEach(function (row) {
                    if (!!row && !!row.doc._id && (!!row.doc.fidjDacr || !!row.doc.fidjData)) {
                        var data = row.doc.fidjDacr;
                        if (crypto && data) {
                            data = crypto.obj[crypto.method](data);
                        }
                        else if (row.doc.fidjData) {
                            data = JSON.parse(row.doc.fidjData);
                        }
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
    Session.prototype.isEmpty = function () {
        var _this = this;
        if (!this.db || !this.db.allDocs) {
            return Promise.reject(new Error(408, 'No db'));
        }
        return new Promise(function (resolve, reject) {
            _this.db.allDocs({
            // filter:  (doc) => {
            //    if (!self.connection.user || !self.connection.user._id) return doc;
            //    if (doc.fidjUserId === self.connection.user._id) return doc;
            // }
            })
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
    Session.prototype.info = function () {
        if (!this.db) {
            return Promise.reject(new Error(408, 'No db'));
        }
        return this.db.info();
    };
    Session.write = function (item) {
        var value = 'null';
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
    Session.value = function (item) {
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
    Session.extractJson = function (item) {
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
            result = result.json;
        }
        if (typeof result !== 'object') {
            result = null;
        }
        return result;
    };
    return Session;
}());
export { Session };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZXNzaW9uL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBQ2pDLG9CQUFvQjtBQUdwQixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBR25DLElBQU0sU0FBUyxHQUFHLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZO0FBRTlHLHVHQUF1RztBQUN2RyxJQUFNLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzVFLFNBQVMsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQU81QztJQVVJO1FBQ0ksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDZixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBQUEsQ0FBQztJQUVLLHlCQUFPLEdBQWQ7UUFDSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFHTSx3QkFBTSxHQUFiLFVBQWMsR0FBVyxFQUFFLEtBQWU7UUFBMUMsaUJBb0RDO1FBbERHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNuQixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUM1QjtRQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElB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QixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNuQixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQzlCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQy9CO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0sbUJBQVcsR0FBbEIsVUFBbUIsSUFBUztRQUN4QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtZQUM5QyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN0QjtRQUNELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUM5QixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjtRQUNELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsSUFBSSxNQUFNLElBQUksTUFBTSxFQUFFO1lBQ2xELE1BQU0sR0FBSSxNQUFjLENBQUMsSUFBSSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDNUIsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTCxjQUFDO0FBQUQsQ0FBQyxBQWxaRCxJQWtaQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGInO1xuLy8gbGV0IFBvdWNoREI6IGFueTtcblxuaW1wb3J0IFBvdWNoREIgZnJvbSAncG91Y2hkYi9kaXN0L3BvdWNoZGIuanMnO1xuaW1wb3J0IHtFcnJvcn0gZnJvbSAnLi4vc2RrL2Vycm9yJztcbmltcG9ydCB7RW5kcG9pbnRJbnRlcmZhY2UsIEVycm9ySW50ZXJmYWNlfSBmcm9tICcuLi9zZGsvaW50ZXJmYWNlcyc7XG5cbmNvbnN0IEZpZGpQb3VjaCA9ICh3aW5kb3cgJiYgd2luZG93WydQb3VjaERCJ10pID8gd2luZG93WydQb3VjaERCJ10gOiByZXF1aXJlKCdwb3VjaGRiJykuZGVmYXVsdDsgLy8gLmRlZmF1bHQ7XG5cbi8vIGxvYWQgY29yZG92YSBhZGFwdGVyIDogaHR0cHM6Ly9naXRodWIuY29tL3BvdWNoZGItY29tbXVuaXR5L3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZS9pc3N1ZXMvMjJcbmNvbnN0IFBvdWNoQWRhcHRlckNvcmRvdmFTcWxpdGUgPSByZXF1aXJlKCdwb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUnKTtcbkZpZGpQb3VjaC5wbHVnaW4oUG91Y2hBZGFwdGVyQ29yZG92YVNxbGl0ZSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSB7XG4gICAgb2JqOiBPYmplY3QsXG4gICAgbWV0aG9kOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIFNlc3Npb24ge1xuXG4gICAgcHVibGljIGRiUmVjb3JkQ291bnQ6IG51bWJlcjtcbiAgICBwdWJsaWMgZGJMYXN0U3luYzogbnVtYmVyOyAvLyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgcHJpdmF0ZSBkYjogUG91Y2hEQjsgLy8gUG91Y2hEQlxuICAgIHByaXZhdGUgcmVtb3RlRGI6IFBvdWNoREI7IC8vIFBvdWNoREI7XG4gICAgcHJpdmF0ZSByZW1vdGVVcmk6IHN0cmluZztcbiAgICBwcml2YXRlIGRiczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICB0aGlzLnJlbW90ZURiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kYnMgPSBbXTtcbiAgICB9O1xuXG4gICAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZGI7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgY3JlYXRlKHVpZDogc3RyaW5nLCBmb3JjZT86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghZm9yY2UgJiYgdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDsgLy8gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICB1aWQgPSB1aWQgfHwgJ2RlZmF1bHQnO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBvcHRzOiBhbnkgPSB7bG9jYXRpb246ICdkZWZhdWx0J307XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93Wydjb3Jkb3ZhJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9IHtsb2NhdGlvbjogJ2RlZmF1bHQnLCBhZGFwdGVyOiAnY29yZG92YS1zcWxpdGUnfTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgY29uc3QgcGx1Z2luID0gcmVxdWlyZSgncG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGlmIChwbHVnaW4pIHsgUG91Y2gucGx1Z2luKHBsdWdpbik7IH1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgdGhpcy5kYiA9IG5ldyBQb3VjaCgnZmlkal9kYicsIHthZGFwdGVyOiAnY29yZG92YS1zcWxpdGUnfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYiA9IG5ldyBGaWRqUG91Y2goJ2ZpZGpfZGJfJyArIHVpZCwgb3B0cyk7IC8vICwge2FkYXB0ZXI6ICd3ZWJzcWwnfSA/Pz9cbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRiLmluZm8oKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoaW5mbykgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIGlmIChpbmZvLmFkYXB0ZXIgIT09ICd3ZWJzcWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLmRiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgbmV3b3B0czogYW55ID0gb3B0cyB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5ld29wdHMuYWRhcHRlciA9ICdpZGInO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5ld2RiID0gbmV3IFBvdWNoKCdmaWRqX2RiJywgb3B0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmRiLnJlcGxpY2F0ZS50byhuZXdkYilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuZGIgPSBuZXdkYjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsIGVyci50b1N0cmluZygpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVzdHJveSgpOiBQcm9taXNlPHZvaWQgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kYiAmJiAhdGhpcy5kYi5kZXN0cm95KSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05lZWQgYSB2YWxpZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmRlc3Ryb3koKGVyciwgaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGJMYXN0U3luYyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwdWJsaWMgc2V0UmVtb3RlKGRiczogQXJyYXk8RW5kcG9pbnRJbnRlcmZhY2U+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGJzID0gZGJzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzeW5jKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuZGJzIHx8ICF0aGlzLmRicy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBhIHJlbW90ZSBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJlbW90ZURiIHx8IHRoaXMucmVtb3RlVXJpICE9PSB0aGlzLmRic1swXS51cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdGVVcmkgPSB0aGlzLmRic1swXS51cmw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlRGIgPSBuZXcgRmlkalBvdWNoKHRoaXMucmVtb3RlVXJpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyAsIHtoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBpZF90b2tlbn19KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRiLnJlcGxpY2F0ZS50byh0aGlzLnJlbW90ZURiKVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NvbXBsZXRlJywgKGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW90ZURiLnJlcGxpY2F0ZS50byh0aGlzLmRiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCEhdXNlcklkICYmICEhZG9jICYmIGRvYy5maWRqVXNlcklkID09PSB1c2VySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NvbXBsZXRlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvZ2dlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RlbmllZCcsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAzLCByZWFzb246IHtzZWNvbmQ6IGVycn19KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2Vycm9yJywgKGVycikgPT4gcmVqZWN0KHtjb2RlOiA0MDEsIHJlYXNvbjogIHtzZWNvbmQ6IGVycn19KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdkZW5pZWQnLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiAge2ZpcnN0OiBlcnJ9fSkpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMSwgcmVhc29uOiAge2ZpcnN0OiBlcnJ9fSkpO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBwdXQoZGF0YTogYW55LFxuICAgICAgICAgICAgICAgX2lkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICB1aWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIG9pZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgYXZlOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxhbnkgfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICduZWVkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhIHx8ICFfaWQgfHwgIXVpZCB8fCAhb2lkIHx8ICFhdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDAwLCAnbmVlZCBmb3JtYXRlZCBkYXRhJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YVdpdGhvdXRJZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgY29uc3QgdG9TdG9yZTogYW55ID0ge1xuICAgICAgICAgICAgX2lkOiBfaWQsXG4gICAgICAgICAgICBmaWRqVXNlcklkOiB1aWQsXG4gICAgICAgICAgICBmaWRqT3JnSWQ6IG9pZCxcbiAgICAgICAgICAgIGZpZGpBcHBWZXJzaW9uOiBhdmVcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRhdGFXaXRob3V0SWRzLl9yZXYpIHtcbiAgICAgICAgICAgIHRvU3RvcmUuX3JldiA9ICcnICsgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX2lkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuX3JldjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpVc2VySWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqT3JnSWQ7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqQXBwVmVyc2lvbjtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLmZpZGpEYXRhO1xuXG4gICAgICAgIGxldCByZXN1bHRBc1N0cmluZyA9IFNlc3Npb24ud3JpdGUoU2Vzc2lvbi52YWx1ZShkYXRhV2l0aG91dElkcykpO1xuICAgICAgICBpZiAoY3J5cHRvKSB7XG4gICAgICAgICAgICByZXN1bHRBc1N0cmluZyA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0ocmVzdWx0QXNTdHJpbmcpO1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGFjciA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9TdG9yZS5maWRqRGF0YSA9IHJlc3VsdEFzU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIucHV0KHRvU3RvcmUsIChlcnIsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLm9rICYmIHJlc3BvbnNlLmlkICYmIHJlc3BvbnNlLnJldikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQrKztcblxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wYWdhdGUgX3JldiAmIF9pZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9yZXYgPSByZXNwb25zZS5yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF0YSBhcyBhbnkpLl9pZCA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDUwMCwgZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmUoZGF0YV9pZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKChkb2MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZG9jLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGIucHV0KGRvYyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0KGRhdGFfaWQ6IHN0cmluZywgY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLmdldChkYXRhX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAoISFyb3cuZmlkakRhY3IgfHwgISFyb3cuZmlkakRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJvdy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjcnlwdG8gJiYgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZmlkakRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShyb3cuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0QXNKc29uID0gU2Vzc2lvbi5leHRyYWN0SnNvbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX2lkID0gcm93Ll9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5fcmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvdy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdCYWQgZW5jb2RpbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ05vIGRhdGEgZm91bmQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFsbChjcnlwdG8/OiBTZXNzaW9uQ3J5cHRvSW50ZXJmYWNlKTogUHJvbWlzZTxBcnJheTxhbnk+IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIgfHwgISh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGEgdmFsaWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtpbmNsdWRlX2RvY3M6IHRydWUsIGRlc2NlbmRpbmc6IHRydWV9KVxuICAgICAgICAgICAgICAgIC50aGVuKHJvd3MgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGwgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIXJvdyAmJiAhIXJvdy5kb2MuX2lkICYmICghIXJvdy5kb2MuZmlkakRhY3IgfHwgISFyb3cuZG9jLmZpZGpEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcm93LmRvYy5maWRqRGFjcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3J5cHRvICYmIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGNyeXB0by5vYmpbY3J5cHRvLm1ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyb3cuZG9jLmZpZGpEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJvdy5kb2MuZmlkakRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRBc0pzb24gPSBTZXNzaW9uLmV4dHJhY3RKc29uKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRBc0pzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2goSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHRBc0pzb24pKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nIDogZGVsZXRlIHJvdycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5kb2MuX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHRBc0pzb24uX3JldiA9IHJvdy5kb2MuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9kZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsLnB1c2gocmVzdWx0QXNKc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUocm93LmRvYy5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQmFkIGVuY29kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFsbCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IFByb21pc2U8Ym9vbGVhbiB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiIHx8ICEodGhpcy5kYiBhcyBhbnkpLmFsbERvY3MpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTm8gZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKHtcbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXI6ICAoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgaWYgKCFzZWxmLmNvbm5lY3Rpb24udXNlciB8fCAhc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vICAgIGlmIChkb2MuZmlkalVzZXJJZCA9PT0gc2VsZi5jb25uZWN0aW9uLnVzZXIuX2lkKSByZXR1cm4gZG9jO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnTm8gcmVzcG9uc2UnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSByZXNwb25zZS50b3RhbF9yb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnRvdGFsX3Jvd3MgJiYgcmVzcG9uc2UudG90YWxfcm93cyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGlmICghdGhpcy5kYikge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdObyBkYicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kYi5pbmZvKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHdyaXRlKGl0ZW06IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZiAoaXRlbSk7XG4gICAgICAgIGlmICh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtzdHJpbmc6IGl0ZW19KVxuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtudW1iZXI6IGl0ZW19KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe2Jvb2w6IGl0ZW19KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7anNvbjogaXRlbX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgdmFsdWUoaXRlbTogYW55KTogYW55IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGl0ZW07XG4gICAgICAgIGlmICh0eXBlb2YgKGl0ZW0pICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGl0ZW07XG4gICAgICAgIH0gZWxzZSBpZiAoJ3N0cmluZycgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5zdHJpbmc7XG4gICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5udW1iZXIudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdib29sJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmJvb2wudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2UgaWYgKCdqc29uJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmpzb247XG4gICAgICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHN0YXRpYyBleHRyYWN0SnNvbihpdGVtOiBhbnkpOiBhbnkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gaXRlbTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChpdGVtKSA9PT0gJ29iamVjdCcgJiYgJ2pzb24nIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uanNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKHJlc3VsdCkgPT09ICdvYmplY3QnICYmICdqc29uJyBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChyZXN1bHQgYXMgYW55KS5qc29uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuIl19