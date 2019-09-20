// import PouchDB from 'pouchdb';
// let PouchDB: any;
import { Error } from '../sdk/error';
var FidjPouch;
if (typeof window !== 'undefined') {
    FidjPouch = (window['PouchDB']) ? window['PouchDB'] : require('pouchdb').default; // .default;
    // load cordova adapter : https://github.com/pouchdb-community/pouchdb-adapter-cordova-sqlite/issues/22
    var PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
    FidjPouch.plugin(PouchAdapterCordovaSqlite);
}
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
                if (typeof window !== 'undefined' && window['cordova']) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJzZXNzaW9uL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUNBQWlDO0FBQ2pDLG9CQUFvQjtBQUdwQixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBR25DLElBQUksU0FBUyxDQUFDO0FBRWQsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7SUFDL0IsU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVk7SUFDOUYsdUdBQXVHO0lBQ3ZHLElBQU0seUJBQXlCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDNUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0NBQy9DO0FBT0Q7SUFVSTtRQUNJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUFBLENBQUM7SUFFSyx5QkFBTyxHQUFkO1FBQ0ksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sd0JBQU0sR0FBYixVQUFjLEdBQVcsRUFBRSxLQUFlO1FBQTFDLGlCQW9EQztRQWxERyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDbkIsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7U0FD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LENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEM7YUFBTSxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbkIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUM5QixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMvQjtTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVNLG1CQUFXLEdBQWxCLFVBQW1CLElBQVM7UUFDeEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDOUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDdEI7UUFDRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDOUIsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFDRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLElBQUksTUFBTSxJQUFJLE1BQU0sRUFBRTtZQUNsRCxNQUFNLEdBQUksTUFBYyxDQUFDLElBQUksQ0FBQztTQUNqQztRQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQzVCLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDakI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUwsY0FBQztBQUFELENBQUMsQUFqWkQsSUFpWkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgUG91Y2hEQiBmcm9tICdwb3VjaGRiJztcbi8vIGxldCBQb3VjaERCOiBhbnk7XG5cbmltcG9ydCBQb3VjaERCIGZyb20gJ3BvdWNoZGIvZGlzdC9wb3VjaGRiLmpzJztcbmltcG9ydCB7RXJyb3J9IGZyb20gJy4uL3Nkay9lcnJvcic7XG5pbXBvcnQge0VuZHBvaW50SW50ZXJmYWNlLCBFcnJvckludGVyZmFjZX0gZnJvbSAnLi4vc2RrL2ludGVyZmFjZXMnO1xuXG5sZXQgRmlkalBvdWNoO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBGaWRqUG91Y2ggPSAod2luZG93WydQb3VjaERCJ10pID8gd2luZG93WydQb3VjaERCJ10gOiByZXF1aXJlKCdwb3VjaGRiJykuZGVmYXVsdDsgLy8gLmRlZmF1bHQ7XG4gICAgLy8gbG9hZCBjb3Jkb3ZhIGFkYXB0ZXIgOiBodHRwczovL2dpdGh1Yi5jb20vcG91Y2hkYi1jb21tdW5pdHkvcG91Y2hkYi1hZGFwdGVyLWNvcmRvdmEtc3FsaXRlL2lzc3Vlcy8yMlxuICAgIGNvbnN0IFBvdWNoQWRhcHRlckNvcmRvdmFTcWxpdGUgPSByZXF1aXJlKCdwb3VjaGRiLWFkYXB0ZXItY29yZG92YS1zcWxpdGUnKTtcbiAgICBGaWRqUG91Y2gucGx1Z2luKFBvdWNoQWRhcHRlckNvcmRvdmFTcWxpdGUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25DcnlwdG9JbnRlcmZhY2Uge1xuICAgIG9iajogT2JqZWN0LFxuICAgIG1ldGhvZDogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBTZXNzaW9uIHtcblxuICAgIHB1YmxpYyBkYlJlY29yZENvdW50OiBudW1iZXI7XG4gICAgcHVibGljIGRiTGFzdFN5bmM6IG51bWJlcjsgLy8gRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIHByaXZhdGUgZGI6IFBvdWNoREI7IC8vIFBvdWNoREJcbiAgICBwcml2YXRlIHJlbW90ZURiOiBQb3VjaERCOyAvLyBQb3VjaERCO1xuICAgIHByaXZhdGUgcmVtb3RlVXJpOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBkYnM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5kYkxhc3RTeW5jID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW1vdGVEYiA9IG51bGw7XG4gICAgICAgIHRoaXMuZGJzID0gW107XG4gICAgfTtcblxuICAgIHB1YmxpYyBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmRiO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGUodWlkOiBzdHJpbmcsIGZvcmNlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCFmb3JjZSAmJiB0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsOyAvLyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5kYiA9IG51bGw7XG4gICAgICAgIHVpZCA9IHVpZCB8fCAnZGVmYXVsdCc7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgbGV0IG9wdHM6IGFueSA9IHtsb2NhdGlvbjogJ2RlZmF1bHQnfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvd1snY29yZG92YSddKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMgPSB7bG9jYXRpb246ICdkZWZhdWx0JywgYWRhcHRlcjogJ2NvcmRvdmEtc3FsaXRlJ307XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGNvbnN0IHBsdWdpbiA9IHJlcXVpcmUoJ3BvdWNoZGItYWRhcHRlci1jb3Jkb3ZhLXNxbGl0ZScpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICBpZiAocGx1Z2luKSB7IFBvdWNoLnBsdWdpbihwbHVnaW4pOyB9XG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuZGIgPSBuZXcgUG91Y2goJ2ZpZGpfZGInLCB7YWRhcHRlcjogJ2NvcmRvdmEtc3FsaXRlJ30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGIgPSBuZXcgRmlkalBvdWNoKCdmaWRqX2RiXycgKyB1aWQsIG9wdHMpOyAvLyAsIHthZGFwdGVyOiAnd2Vic3FsJ30gPz8/XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kYi5pbmZvKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGluZm8pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyBpZiAoaW5mby5hZGFwdGVyICE9PSAnd2Vic3FsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGhpcy5kYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5ld29wdHM6IGFueSA9IG9wdHMgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXdvcHRzLmFkYXB0ZXIgPSAnaWRiJztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBuZXdkYiA9IG5ldyBQb3VjaCgnZmlkal9kYicsIG9wdHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5kYi5yZXBsaWNhdGUudG8obmV3ZGIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLmRiID0gbmV3ZGI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCBlcnIudG9TdHJpbmcoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyKSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3koKTogUHJvbWlzZTx2b2lkIHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHRoaXMuZGJSZWNvcmRDb3VudCA9IDA7XG4gICAgICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGIgJiYgIXRoaXMuZGIuZGVzdHJveSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcig0MDgsICdOZWVkIGEgdmFsaWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5kZXN0cm95KChlcnIsIGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiUmVjb3JkQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiTGFzdFN5bmMgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcHVibGljIHNldFJlbW90ZShkYnM6IEFycmF5PEVuZHBvaW50SW50ZXJmYWNlPik6IHZvaWQge1xuICAgICAgICB0aGlzLmRicyA9IGRicztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3luYyh1c2VySWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgZGInKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmRicyB8fCAhdGhpcy5kYnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgYSByZW1vdGUgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZW1vdGVEYiB8fCB0aGlzLnJlbW90ZVVyaSAhPT0gdGhpcy5kYnNbMF0udXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3RlVXJpID0gdGhpcy5kYnNbMF0udXJsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW90ZURiID0gbmV3IEZpZGpQb3VjaCh0aGlzLnJlbW90ZVVyaSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gLCB7aGVhZGVyczogeydBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgaWRfdG9rZW59fSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kYi5yZXBsaWNhdGUudG8odGhpcy5yZW1vdGVEYilcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjb21wbGV0ZScsIChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdGVEYi5yZXBsaWNhdGUudG8odGhpcy5kYixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICghIXVzZXJJZCAmJiAhIWRvYyAmJiBkb2MuZmlkalVzZXJJZCA9PT0gdXNlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjb21wbGV0ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2dnZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdkZW5pZWQnLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiB7c2Vjb25kOiBlcnJ9fSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAxLCByZWFzb246IHtzZWNvbmQ6IGVycn19KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdkZW5pZWQnLCAoZXJyKSA9PiByZWplY3Qoe2NvZGU6IDQwMywgcmVhc29uOiB7Zmlyc3Q6IGVycn19KSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnIpID0+IHJlamVjdCh7Y29kZTogNDAxLCByZWFzb246IHtmaXJzdDogZXJyfX0pKTtcblxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHV0KGRhdGE6IGFueSxcbiAgICAgICAgICAgICAgIF9pZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgdWlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBvaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgIGF2ZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8YW55IHwgRXJyb3JJbnRlcmZhY2U+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnbmVlZCBkYicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGF0YSB8fCAhX2lkIHx8ICF1aWQgfHwgIW9pZCB8fCAhYXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwMCwgJ25lZWQgZm9ybWF0ZWQgZGF0YScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGFXaXRob3V0SWRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIGNvbnN0IHRvU3RvcmU6IGFueSA9IHtcbiAgICAgICAgICAgIF9pZDogX2lkLFxuICAgICAgICAgICAgZmlkalVzZXJJZDogdWlkLFxuICAgICAgICAgICAgZmlkak9yZ0lkOiBvaWQsXG4gICAgICAgICAgICBmaWRqQXBwVmVyc2lvbjogYXZlXG4gICAgICAgIH07XG4gICAgICAgIGlmIChkYXRhV2l0aG91dElkcy5fcmV2KSB7XG4gICAgICAgICAgICB0b1N0b3JlLl9yZXYgPSAnJyArIGRhdGFXaXRob3V0SWRzLl9yZXY7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLl9pZDtcbiAgICAgICAgZGVsZXRlIGRhdGFXaXRob3V0SWRzLl9yZXY7XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqVXNlcklkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkak9yZ0lkO1xuICAgICAgICBkZWxldGUgZGF0YVdpdGhvdXRJZHMuZmlkakFwcFZlcnNpb247XG4gICAgICAgIGRlbGV0ZSBkYXRhV2l0aG91dElkcy5maWRqRGF0YTtcblxuICAgICAgICBsZXQgcmVzdWx0QXNTdHJpbmcgPSBTZXNzaW9uLndyaXRlKFNlc3Npb24udmFsdWUoZGF0YVdpdGhvdXRJZHMpKTtcbiAgICAgICAgaWYgKGNyeXB0bykge1xuICAgICAgICAgICAgcmVzdWx0QXNTdHJpbmcgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKHJlc3VsdEFzU3RyaW5nKTtcbiAgICAgICAgICAgIHRvU3RvcmUuZmlkakRhY3IgPSByZXN1bHRBc1N0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvU3RvcmUuZmlkakRhdGEgPSByZXN1bHRBc1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiLnB1dCh0b1N0b3JlLCAoZXJyLCByZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5vayAmJiByZXNwb25zZS5pZCAmJiByZXNwb25zZS5yZXYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50Kys7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcHJvcGFnYXRlIF9yZXYgJiBfaWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGRhdGEgYXMgYW55KS5fcmV2ID0gcmVzcG9uc2UucmV2O1xuICAgICAgICAgICAgICAgICAgICAgICAgKGRhdGEgYXMgYW55KS5faWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig1MDAsIGVycikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlKGRhdGFfaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZCB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ25lZWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5nZXQoZGF0YV9pZClcbiAgICAgICAgICAgICAgICAudGhlbigoZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRvYy5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRiLnB1dChkb2MpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldChkYXRhX2lkOiBzdHJpbmcsIGNyeXB0bz86IFNlc3Npb25DcnlwdG9JbnRlcmZhY2UpOiBQcm9taXNlPGFueSB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05lZWQgZGInKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYi5nZXQoZGF0YV9pZClcbiAgICAgICAgICAgICAgICAudGhlbihyb3cgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISFyb3cgJiYgKCEhcm93LmZpZGpEYWNyIHx8ICEhcm93LmZpZGpEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByb3cuZmlkakRhY3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3J5cHRvICYmIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gY3J5cHRvLm9ialtjcnlwdG8ubWV0aG9kXShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm93LmZpZGpEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2Uocm93LmZpZGpEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdEFzSnNvbiA9IFNlc3Npb24uZXh0cmFjdEpzb24oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0QXNKc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9pZCA9IHJvdy5faWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9yZXYgPSByb3cuX3JldjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0QXNKc29uKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByb3cuX2RlbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJvdy5faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoNDAwLCAnQmFkIGVuY29kaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcig0MDAsICdObyBkYXRhIGZvdW5kJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHJlamVjdChuZXcgRXJyb3IoNTAwLCBlcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRBbGwoY3J5cHRvPzogU2Vzc2lvbkNyeXB0b0ludGVyZmFjZSk6IFByb21pc2U8QXJyYXk8YW55PiB8IEVycm9ySW50ZXJmYWNlPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRiIHx8ICEodGhpcy5kYiBhcyBhbnkpLmFsbERvY3MpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTmVlZCBhIHZhbGlkIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcyh7aW5jbHVkZV9kb2NzOiB0cnVlLCBkZXNjZW5kaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICAudGhlbihyb3dzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsID0gW107XG4gICAgICAgICAgICAgICAgICAgIHJvd3Mucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFyb3cgJiYgISFyb3cuZG9jLl9pZCAmJiAoISFyb3cuZG9jLmZpZGpEYWNyIHx8ICEhcm93LmRvYy5maWRqRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJvdy5kb2MuZmlkakRhY3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNyeXB0byAmJiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBjcnlwdG8ub2JqW2NyeXB0by5tZXRob2RdKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocm93LmRvYy5maWRqRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShyb3cuZG9jLmZpZGpEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0QXNKc29uID0gU2Vzc2lvbi5leHRyYWN0SnNvbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0QXNKc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdEFzSnNvbi5faWQgPSByb3cuZG9jLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QXNKc29uLl9yZXYgPSByb3cuZG9jLl9yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbC5wdXNoKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0QXNKc29uKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhZCBlbmNvZGluZyA6IGRlbGV0ZSByb3cnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbi5faWQgPSByb3cuZG9jLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzdWx0QXNKc29uLl9yZXYgPSByb3cuZG9jLl9yZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc3VsdEFzSnNvbi5fZGVsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbC5wdXNoKHJlc3VsdEFzSnNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHJvdy5kb2MuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0JhZCBlbmNvZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbGwpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNFbXB0eSgpOiBQcm9taXNlPGJvb2xlYW4gfCBFcnJvckludGVyZmFjZT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5kYiB8fCAhKHRoaXMuZGIgYXMgYW55KS5hbGxEb2NzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKDQwOCwgJ05vIGRiJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICh0aGlzLmRiIGFzIGFueSkuYWxsRG9jcyh7XG4gICAgICAgICAgICAgICAgLy8gZmlsdGVyOiAgKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgIC8vICAgIGlmICghc2VsZi5jb25uZWN0aW9uLnVzZXIgfHwgIXNlbGYuY29ubmVjdGlvbi51c2VyLl9pZCkgcmV0dXJuIGRvYztcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAoZG9jLmZpZGpVc2VySWQgPT09IHNlbGYuY29ubmVjdGlvbi51c2VyLl9pZCkgcmV0dXJuIGRvYztcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKDQwMCwgJ05vIHJlc3BvbnNlJykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYlJlY29yZENvdW50ID0gcmVzcG9uc2UudG90YWxfcm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS50b3RhbF9yb3dzICYmIHJlc3BvbnNlLnRvdGFsX3Jvd3MgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QobmV3IEVycm9yKDQwMCwgZXJyKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5mbygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAoIXRoaXMuZGIpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoNDA4LCAnTm8gZGInKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGIuaW5mbygpO1xuICAgIH1cblxuICAgIHN0YXRpYyB3cml0ZShpdGVtOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIGNvbnN0IHQgPSB0eXBlb2YgKGl0ZW0pO1xuICAgICAgICBpZiAodCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICdudWxsJztcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7c3RyaW5nOiBpdGVtfSlcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7bnVtYmVyOiBpdGVtfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtib29sOiBpdGVtfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe2pzb246IGl0ZW19KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgc3RhdGljIHZhbHVlKGl0ZW06IGFueSk6IGFueSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBpdGVtO1xuICAgICAgICBpZiAodHlwZW9mIChpdGVtKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIC8vIHJldHVybiBpdGVtO1xuICAgICAgICB9IGVsc2UgaWYgKCdzdHJpbmcnIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uc3RyaW5nO1xuICAgICAgICB9IGVsc2UgaWYgKCdudW1iZXInIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0ubnVtYmVyLnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIGlmICgnYm9vbCcgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5ib29sLnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIGlmICgnanNvbicgaW4gaXRlbSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gaXRlbS5qc29uO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAocmVzdWx0KSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZXh0cmFjdEpzb24oaXRlbTogYW55KTogYW55IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGl0ZW07XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAoaXRlbSkgPT09ICdvYmplY3QnICYmICdqc29uJyBpbiBpdGVtKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBpdGVtLmpzb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAocmVzdWx0KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChyZXN1bHQpID09PSAnb2JqZWN0JyAmJiAnanNvbicgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSAocmVzdWx0IGFzIGFueSkuanNvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbn1cbiJdfQ==