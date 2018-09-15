/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
var /**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
LocalStorage = /** @class */ (function () {
    // Constructor
    function LocalStorage(storageService, storageKey) {
        this.storageKey = storageKey;
        this.version = '0.1';
        this.storage = storageService || window.localStorage;
        if (!this.storage) {
            throw new Error('fidj.LocalStorageFactory needs a storageService!');
        }
        // todo LocalStorage refacto
        //            if (!fidj.Xml) {
        //                throw new Error('fidj.Xml needs to be loaded before fidj.LocalStorage!');
        //            }
        //            if (!fidj.Json) {
        //                throw new Error('fidj.Json needs to be loaded before fidj.LocalStorage!');
        //            }
        //            if (!fidj.Xml.isXml || !fidj.Xml.xml2String || !fidj.Xml.string2Xml) {
        //                throw new Error('fidj.Xml with isXml(), xml2String()
        // and string2Xml() needs to be loaded before fidj.LocalStorage!');
        //            }
        //            if (!fidj.Json.object2String || !fidj.Json.string2Object) {
        //                throw new Error('fidj.Json with object2String()
        // and string2Object() needs to be loaded before fidj.LocalStorage!');
        //            }
        //
    }
    // Public API
    /**
     * Sets a key's value.
     *
     * @param key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @returns the stored value which is a container of user value.
     */
    /**
     * Sets a key's value.
     *
     * @param {?} key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param {?} value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @return {?} the stored value which is a container of user value.
     */
    LocalStorage.prototype.set = /**
     * Sets a key's value.
     *
     * @param {?} key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param {?} value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @return {?} the stored value which is a container of user value.
     */
    function (key, value) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        var t = typeof (value);
        if (t === 'undefined') {
            value = 'null';
        }
        else if (value === null) {
            value = 'null';
        }
        else if (t === 'string') {
            value = JSON.stringify({ string: value });
        }
        else if (t === 'number') {
            value = JSON.stringify({ number: value });
        }
        else if (t === 'boolean') {
            value = JSON.stringify({ bool: value });
        }
        else if (t === 'object') {
            value = JSON.stringify({ json: value });
        }
        else {
            // reject and do not insert
            // if (typeof value == "function") for example
            throw new TypeError('Value type ' + t + ' is invalid. It must be null, undefined, xml, string, number, boolean or object');
        }
        this.storage.setItem(key, value);
        return value;
    };
    ;
    /**
     * Looks up a key in cache
     *
     * @param key - Key to look up.
     * @param def - Default value to return, if key didn't exist.
     * @returns the key value, default value or <null>
     */
    /**
     * Looks up a key in cache
     *
     * @param {?} key - Key to look up.
     * @param {?=} def - Default value to return, if key didn't exist.
     * @return {?} the key value, default value or <null>
     */
    LocalStorage.prototype.get = /**
     * Looks up a key in cache
     *
     * @param {?} key - Key to look up.
     * @param {?=} def - Default value to return, if key didn't exist.
     * @return {?} the key value, default value or <null>
     */
    function (key, def) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        var item = this.storage.getItem(key);
        if (item !== null) {
            if (item === 'null') {
                return null;
            }
            /** @type {?} */
            var value = JSON.parse(item);
            // var value = fidj.Json.string2Object(item);
            // if ('xml' in value) {
            //     return fidj.Xml.string2Xml(value.xml);
            // } else
            if ('string' in value) {
                return value.string;
            }
            else if ('number' in value) {
                return value.number.valueOf();
            }
            else if ('bool' in value) {
                return value.bool.valueOf();
            }
            else {
                return value.json;
            }
        }
        return !def ? null : def;
    };
    ;
    /**
     * Deletes a key from cache.
     *
     * @param  key - Key to delete.
     * @returns true if key existed or false if it didn't
     */
    /**
     * Deletes a key from cache.
     *
     * @param {?} key - Key to delete.
     * @return {?} true if key existed or false if it didn't
     */
    LocalStorage.prototype.remove = /**
     * Deletes a key from cache.
     *
     * @param {?} key - Key to delete.
     * @return {?} true if key existed or false if it didn't
     */
    function (key) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        var existed = (this.storage.getItem(key) !== null);
        this.storage.removeItem(key);
        return existed;
    };
    ;
    /**
     * Deletes everything in cache.
     *
     * @return true
     */
    /**
     * Deletes everything in cache.
     *
     * @return {?} true
     */
    LocalStorage.prototype.clear = /**
     * Deletes everything in cache.
     *
     * @return {?} true
     */
    function () {
        /** @type {?} */
        var existed = (this.storage.length > 0);
        this.storage.clear();
        return existed;
    };
    ;
    /**
     * How much space in bytes does the storage take?
     *
     * @returns Number
     */
    /**
     * How much space in bytes does the storage take?
     *
     * @return {?} Number
     */
    LocalStorage.prototype.size = /**
     * How much space in bytes does the storage take?
     *
     * @return {?} Number
     */
    function () {
        return this.storage.length;
    };
    ;
    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param f - Function to call on every item.
     * @param  context - Context (this for example).
     * @returns Number of items in storage
     */
    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param {?} f - Function to call on every item.
     * @param {?} context - Context (this for example).
     * @return {?} Number of items in storage
     */
    LocalStorage.prototype.foreach = /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param {?} f - Function to call on every item.
     * @param {?} context - Context (this for example).
     * @return {?} Number of items in storage
     */
    function (f, context) {
        /** @type {?} */
        var n = this.storage.length;
        for (var i = 0; i < n; i++) {
            /** @type {?} */
            var key = this.storage.key(i);
            /** @type {?} */
            var value = this.get(key);
            if (context) {
                // f is an instance method on instance context
                f.call(context, value);
            }
            else {
                // f is a function or class method
                f(value);
            }
        }
        return n;
    };
    ;
    /**
     * @param {?} key
     * @return {?}
     */
    LocalStorage.prototype.checkKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (!key || (typeof key !== 'string')) {
            throw new TypeError('Key type must be string');
        }
        return true;
    };
    return LocalStorage;
}());
/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
export { LocalStorage };
if (false) {
    /** @type {?} */
    LocalStorage.prototype.version;
    /** @type {?} */
    LocalStorage.prototype.storage;
    /** @type {?} */
    LocalStorage.prototype.storageKey;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJ0b29scy9zdG9yYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBOzs7OztBQUFBO0lBS0ksY0FBYztJQUNkLHNCQUFZLGNBQWMsRUFBVSxVQUFVO1FBQVYsZUFBVSxHQUFWLFVBQVUsQ0FBQTt1QkFKN0IsS0FBSztRQUtsQixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1NBQ3ZFOzs7Ozs7Ozs7Ozs7Ozs7OztLQWlCSjtJQUVELGFBQWE7SUFFYjs7Ozs7Ozs7T0FRRzs7Ozs7Ozs7OztJQUNILDBCQUFHOzs7Ozs7Ozs7SUFBSCxVQUFJLEdBQVcsRUFBRSxLQUFLO1FBRWxCLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUVuQixJQUFNLENBQUMsR0FBRyxPQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ25CLEtBQUssR0FBRyxNQUFNLENBQUM7U0FDbEI7YUFBTSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDdkIsS0FBSyxHQUFHLE1BQU0sQ0FBQztTQUNsQjthQUFNLElBQUksQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUN2QixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBO1NBQzFDO2FBQU0sSUFBSSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3ZCLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtB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T0FBTzs7UUFDZCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOztZQUN4QixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDaEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixJQUFJLE9BQU8sRUFBRTs7Z0JBRVQsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDMUI7aUJBQU07O2dCQUVILENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNaO1NBQ0o7UUFDRCxPQUFPLENBQUMsQ0FBQztLQUNaO0lBQUEsQ0FBQzs7Ozs7SUFLTSwrQkFBUTs7OztjQUFDLEdBQUc7UUFDaEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNsRDtRQUNELE9BQU8sSUFBSSxDQUFDOzt1QkE1S3BCO0lBOEtDLENBQUE7Ozs7OztBQXpLRCx3QkF5S0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGxvY2FsU3RvcmFnZSBjbGFzcyBmYWN0b3J5XG4gKiBVc2FnZSA6IHZhciBMb2NhbFN0b3JhZ2UgPSBmaWRqLkxvY2FsU3RvcmFnZUZhY3Rvcnkod2luZG93LmxvY2FsU3RvcmFnZSk7IC8vIHRvIGNyZWF0ZSBhIG5ldyBjbGFzc1xuICogVXNhZ2UgOiB2YXIgbG9jYWxTdG9yYWdlU2VydmljZSA9IG5ldyBMb2NhbFN0b3JhZ2UoKTsgLy8gdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2Uge1xuXG4gICAgcHVibGljIHZlcnNpb24gPSAnMC4xJztcbiAgICBwcml2YXRlIHN0b3JhZ2U7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yKHN0b3JhZ2VTZXJ2aWNlLCBwcml2YXRlIHN0b3JhZ2VLZXkpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gc3RvcmFnZVNlcnZpY2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Mb2NhbFN0b3JhZ2VGYWN0b3J5IG5lZWRzIGEgc3RvcmFnZVNlcnZpY2UhJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdG9kbyBMb2NhbFN0b3JhZ2UgcmVmYWN0b1xuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5YbWwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLlhtbCBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouWG1sLmlzWG1sIHx8ICFmaWRqLlhtbC54bWwyU3RyaW5nIHx8ICFmaWRqLlhtbC5zdHJpbmcyWG1sKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5YbWwgd2l0aCBpc1htbCgpLCB4bWwyU3RyaW5nKClcbiAgICAgICAgLy8gYW5kIHN0cmluZzJYbWwoKSBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbi5vYmplY3QyU3RyaW5nIHx8ICFmaWRqLkpzb24uc3RyaW5nMk9iamVjdCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiB3aXRoIG9iamVjdDJTdHJpbmcoKVxuICAgICAgICAvLyBhbmQgc3RyaW5nMk9iamVjdCgpIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgIH1cblxuICAgIC8vIFB1YmxpYyBBUElcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBrZXkncyB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXkgLSBLZXkgdG8gc2V0LiBJZiB0aGlzIHZhbHVlIGlzIG5vdCBzZXQgb3Igbm90XG4gICAgICogICAgICAgICAgICAgIGEgc3RyaW5nIGFuIGV4Y2VwdGlvbiBpcyByYWlzZWQuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVmFsdWUgdG8gc2V0LiBUaGlzIGNhbiBiZSBhbnkgdmFsdWUgdGhhdCBpcyBKU09OXG4gICAgICogICAgICAgICAgICAgIGNvbXBhdGlibGUgKE51bWJlcnMsIFN0cmluZ3MsIE9iamVjdHMgZXRjLikuXG4gICAgICogQHJldHVybnMgdGhlIHN0b3JlZCB2YWx1ZSB3aGljaCBpcyBhIGNvbnRhaW5lciBvZiB1c2VyIHZhbHVlLlxuICAgICAqL1xuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWUpIHtcblxuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgLy8gY2xvbmUgdGhlIG9iamVjdCBiZWZvcmUgc2F2aW5nIHRvIHN0b3JhZ2VcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZih2YWx1ZSk7XG4gICAgICAgIGlmICh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtzdHJpbmc6IHZhbHVlfSlcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7bnVtYmVyOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7Ym9vbDogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7anNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlamVjdCBhbmQgZG8gbm90IGluc2VydFxuICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIGZvciBleGFtcGxlXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSB0eXBlICcgKyB0ICsgJyBpcyBpbnZhbGlkLiBJdCBtdXN0IGJlIG51bGwsIHVuZGVmaW5lZCwgeG1sLCBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiBvciBvYmplY3QnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBMb29rcyB1cCBhIGtleSBpbiBjYWNoZVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleSAtIEtleSB0byBsb29rIHVwLlxuICAgICAqIEBwYXJhbSBkZWYgLSBEZWZhdWx0IHZhbHVlIHRvIHJldHVybiwgaWYga2V5IGRpZG4ndCBleGlzdC5cbiAgICAgKiBAcmV0dXJucyB0aGUga2V5IHZhbHVlLCBkZWZhdWx0IHZhbHVlIG9yIDxudWxsPlxuICAgICAqL1xuICAgIGdldChrZXk6IHN0cmluZywgZGVmPykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2UoaXRlbSk7XG5cbiAgICAgICAgICAgIC8vIHZhciB2YWx1ZSA9IGZpZGouSnNvbi5zdHJpbmcyT2JqZWN0KGl0ZW0pO1xuICAgICAgICAgICAgLy8gaWYgKCd4bWwnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZpZGouWG1sLnN0cmluZzJYbWwodmFsdWUueG1sKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZVxuICAgICAgICAgICAgaWYgKCdzdHJpbmcnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnN0cmluZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubnVtYmVyLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ2Jvb2wnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmJvb2wudmFsdWVPZigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuanNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIWRlZiA/IG51bGwgOiBkZWY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgYSBrZXkgZnJvbSBjYWNoZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAga2V5IC0gS2V5IHRvIGRlbGV0ZS5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGtleSBleGlzdGVkIG9yIGZhbHNlIGlmIGl0IGRpZG4ndFxuICAgICAqL1xuICAgIHJlbW92ZShrZXk6IHN0cmluZykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgZXhpc3RlZCA9ICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgZXZlcnl0aGluZyBpbiBjYWNoZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdHJ1ZVxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICBjb25zdCBleGlzdGVkID0gKHRoaXMuc3RvcmFnZS5sZW5ndGggPiAwKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBleGlzdGVkO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBzcGFjZSBpbiBieXRlcyBkb2VzIHRoZSBzdG9yYWdlIHRha2U/XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBOdW1iZXJcbiAgICAgKi9cbiAgICBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBmdW5jdGlvbiBmIG9uIHRoZSBzcGVjaWZpZWQgY29udGV4dCBmb3IgZWFjaCBlbGVtZW50IG9mIHRoZSBzdG9yYWdlXG4gICAgICogZnJvbSBpbmRleCAwIHRvIGluZGV4IGxlbmd0aC0xLlxuICAgICAqIFdBUk5JTkcgOiBZb3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhlIHN0b3JhZ2UgZHVyaW5nIHRoZSBsb29wICEhIVxuICAgICAqXG4gICAgICogQHBhcmFtIGYgLSBGdW5jdGlvbiB0byBjYWxsIG9uIGV2ZXJ5IGl0ZW0uXG4gICAgICogQHBhcmFtICBjb250ZXh0IC0gQ29udGV4dCAodGhpcyBmb3IgZXhhbXBsZSkuXG4gICAgICogQHJldHVybnMgTnVtYmVyIG9mIGl0ZW1zIGluIHN0b3JhZ2VcbiAgICAgKi9cbiAgICBmb3JlYWNoKGYsIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbiA9IHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLnN0b3JhZ2Uua2V5KGkpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBmIGlzIGFuIGluc3RhbmNlIG1ldGhvZCBvbiBpbnN0YW5jZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgZi5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZiBpcyBhIGZ1bmN0aW9uIG9yIGNsYXNzIG1ldGhvZFxuICAgICAgICAgICAgICAgIGYodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH07XG5cbiAgICAvLyBQcml2YXRlIEFQSVxuICAgIC8vIGhlbHBlciBmdW5jdGlvbnMgYW5kIHZhcmlhYmxlcyBoaWRkZW4gd2l0aGluIHRoaXMgZnVuY3Rpb24gc2NvcGVcblxuICAgIHByaXZhdGUgY2hlY2tLZXkoa2V5KSB7XG4gICAgICAgIGlmICgha2V5IHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSB0eXBlIG11c3QgYmUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIl19