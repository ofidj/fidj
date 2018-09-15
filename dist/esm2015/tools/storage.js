/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
export class LocalStorage {
    /**
     * @param {?} storageService
     * @param {?} storageKey
     */
    constructor(storageService, storageKey) {
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
    /**
     * Sets a key's value.
     *
     * @param {?} key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param {?} value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @return {?} the stored value which is a container of user value.
     */
    set(key, value) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        const t = typeof (value);
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
    }
    ;
    /**
     * Looks up a key in cache
     *
     * @param {?} key - Key to look up.
     * @param {?=} def - Default value to return, if key didn't exist.
     * @return {?} the key value, default value or <null>
     */
    get(key, def) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        const item = this.storage.getItem(key);
        if (item !== null) {
            if (item === 'null') {
                return null;
            }
            /** @type {?} */
            const value = JSON.parse(item);
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
    }
    ;
    /**
     * Deletes a key from cache.
     *
     * @param {?} key - Key to delete.
     * @return {?} true if key existed or false if it didn't
     */
    remove(key) {
        key = this.storageKey + key;
        this.checkKey(key);
        /** @type {?} */
        const existed = (this.storage.getItem(key) !== null);
        this.storage.removeItem(key);
        return existed;
    }
    ;
    /**
     * Deletes everything in cache.
     *
     * @return {?} true
     */
    clear() {
        /** @type {?} */
        const existed = (this.storage.length > 0);
        this.storage.clear();
        return existed;
    }
    ;
    /**
     * How much space in bytes does the storage take?
     *
     * @return {?} Number
     */
    size() {
        return this.storage.length;
    }
    ;
    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param {?} f - Function to call on every item.
     * @param {?} context - Context (this for example).
     * @return {?} Number of items in storage
     */
    foreach(f, context) {
        /** @type {?} */
        const n = this.storage.length;
        for (let i = 0; i < n; i++) {
            /** @type {?} */
            const key = this.storage.key(i);
            /** @type {?} */
            const value = this.get(key);
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
    }
    ;
    /**
     * @param {?} key
     * @return {?}
     */
    checkKey(key) {
        if (!key || (typeof key !== 'string')) {
            throw new TypeError('Key type must be string');
        }
        return true;
    }
}
if (false) {
    /** @type {?} */
    LocalStorage.prototype.version;
    /** @type {?} */
    LocalStorage.prototype.storage;
    /** @type {?} */
    LocalStorage.prototype.storageKey;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2ZpZGovIiwic291cmNlcyI6WyJ0b29scy9zdG9yYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLE1BQU07Ozs7O0lBTUYsWUFBWSxjQUFjLEVBQVUsVUFBVTtRQUFWLGVBQVUsR0FBVixVQUFVLENBQUE7dUJBSjdCLEtBQUs7UUFLbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQztRQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztTQUN2RTs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQko7Ozs7Ozs7Ozs7SUFhRCxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQUs7UUFFbEIsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRW5CLE1BQU0sQ0FBQyxHQUFHLE9BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxXQUFXLEVBQUU7WUFDbkIsS0FBSyxHQUFHLE1BQU0sQ0FBQztTQUNsQjthQUFNLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUN2QixLQUFLLEdBQUcsTUFBTSxDQUFDO1NBQ2xCO2FBQU0sSUFBSSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3ZCLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUE7U0FDMUM7YUFBTSxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDdkIsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztTQUMzQzthQUFNLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFB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QUMsQ0FBQyxDQUFDOztZQUNoQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLElBQUksT0FBTyxFQUFFOztnQkFFVCxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMxQjtpQkFBTTs7Z0JBRUgsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ1o7U0FDSjtRQUNELE9BQU8sQ0FBQyxDQUFDO0tBQ1o7SUFBQSxDQUFDOzs7OztJQUtNLFFBQVEsQ0FBQyxHQUFHO1FBQ2hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsRUFBRTtZQUNuQyxNQUFNLElBQUksU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDbEQ7UUFDRCxPQUFPLElBQUksQ0FBQzs7Q0FFbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGxvY2FsU3RvcmFnZSBjbGFzcyBmYWN0b3J5XG4gKiBVc2FnZSA6IHZhciBMb2NhbFN0b3JhZ2UgPSBmaWRqLkxvY2FsU3RvcmFnZUZhY3Rvcnkod2luZG93LmxvY2FsU3RvcmFnZSk7IC8vIHRvIGNyZWF0ZSBhIG5ldyBjbGFzc1xuICogVXNhZ2UgOiB2YXIgbG9jYWxTdG9yYWdlU2VydmljZSA9IG5ldyBMb2NhbFN0b3JhZ2UoKTsgLy8gdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2Uge1xuXG4gICAgcHVibGljIHZlcnNpb24gPSAnMC4xJztcbiAgICBwcml2YXRlIHN0b3JhZ2U7XG5cbiAgICAvLyBDb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yKHN0b3JhZ2VTZXJ2aWNlLCBwcml2YXRlIHN0b3JhZ2VLZXkpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gc3RvcmFnZVNlcnZpY2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5Mb2NhbFN0b3JhZ2VGYWN0b3J5IG5lZWRzIGEgc3RvcmFnZVNlcnZpY2UhJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdG9kbyBMb2NhbFN0b3JhZ2UgcmVmYWN0b1xuICAgICAgICAvLyAgICAgICAgICAgIGlmICghZmlkai5YbWwpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaWRqLlhtbCBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouWG1sLmlzWG1sIHx8ICFmaWRqLlhtbC54bWwyU3RyaW5nIHx8ICFmaWRqLlhtbC5zdHJpbmcyWG1sKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmlkai5YbWwgd2l0aCBpc1htbCgpLCB4bWwyU3RyaW5nKClcbiAgICAgICAgLy8gYW5kIHN0cmluZzJYbWwoKSBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGZpZGouTG9jYWxTdG9yYWdlIScpO1xuICAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICBpZiAoIWZpZGouSnNvbi5vYmplY3QyU3RyaW5nIHx8ICFmaWRqLkpzb24uc3RyaW5nMk9iamVjdCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZGouSnNvbiB3aXRoIG9iamVjdDJTdHJpbmcoKVxuICAgICAgICAvLyBhbmQgc3RyaW5nMk9iamVjdCgpIG5lZWRzIHRvIGJlIGxvYWRlZCBiZWZvcmUgZmlkai5Mb2NhbFN0b3JhZ2UhJyk7XG4gICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAvL1xuICAgIH1cblxuICAgIC8vIFB1YmxpYyBBUElcblxuICAgIC8qKlxuICAgICAqIFNldHMgYSBrZXkncyB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXkgLSBLZXkgdG8gc2V0LiBJZiB0aGlzIHZhbHVlIGlzIG5vdCBzZXQgb3Igbm90XG4gICAgICogICAgICAgICAgICAgIGEgc3RyaW5nIGFuIGV4Y2VwdGlvbiBpcyByYWlzZWQuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVmFsdWUgdG8gc2V0LiBUaGlzIGNhbiBiZSBhbnkgdmFsdWUgdGhhdCBpcyBKU09OXG4gICAgICogICAgICAgICAgICAgIGNvbXBhdGlibGUgKE51bWJlcnMsIFN0cmluZ3MsIE9iamVjdHMgZXRjLikuXG4gICAgICogQHJldHVybnMgdGhlIHN0b3JlZCB2YWx1ZSB3aGljaCBpcyBhIGNvbnRhaW5lciBvZiB1c2VyIHZhbHVlLlxuICAgICAqL1xuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWUpIHtcblxuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgLy8gY2xvbmUgdGhlIG9iamVjdCBiZWZvcmUgc2F2aW5nIHRvIHN0b3JhZ2VcbiAgICAgICAgY29uc3QgdCA9IHR5cGVvZih2YWx1ZSk7XG4gICAgICAgIGlmICh0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSAnbnVsbCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtzdHJpbmc6IHZhbHVlfSlcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7bnVtYmVyOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYgKHQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7Ym9vbDogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7anNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJlamVjdCBhbmQgZG8gbm90IGluc2VydFxuICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIGZvciBleGFtcGxlXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSB0eXBlICcgKyB0ICsgJyBpcyBpbnZhbGlkLiBJdCBtdXN0IGJlIG51bGwsIHVuZGVmaW5lZCwgeG1sLCBzdHJpbmcsIG51bWJlciwgYm9vbGVhbiBvciBvYmplY3QnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBMb29rcyB1cCBhIGtleSBpbiBjYWNoZVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleSAtIEtleSB0byBsb29rIHVwLlxuICAgICAqIEBwYXJhbSBkZWYgLSBEZWZhdWx0IHZhbHVlIHRvIHJldHVybiwgaWYga2V5IGRpZG4ndCBleGlzdC5cbiAgICAgKiBAcmV0dXJucyB0aGUga2V5IHZhbHVlLCBkZWZhdWx0IHZhbHVlIG9yIDxudWxsPlxuICAgICAqL1xuICAgIGdldChrZXk6IHN0cmluZywgZGVmPykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2UoaXRlbSk7XG5cbiAgICAgICAgICAgIC8vIHZhciB2YWx1ZSA9IGZpZGouSnNvbi5zdHJpbmcyT2JqZWN0KGl0ZW0pO1xuICAgICAgICAgICAgLy8gaWYgKCd4bWwnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGZpZGouWG1sLnN0cmluZzJYbWwodmFsdWUueG1sKTtcbiAgICAgICAgICAgIC8vIH0gZWxzZVxuICAgICAgICAgICAgaWYgKCdzdHJpbmcnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnN0cmluZztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUubnVtYmVyLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ2Jvb2wnIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmJvb2wudmFsdWVPZigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuanNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIWRlZiA/IG51bGwgOiBkZWY7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgYSBrZXkgZnJvbSBjYWNoZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAga2V5IC0gS2V5IHRvIGRlbGV0ZS5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGtleSBleGlzdGVkIG9yIGZhbHNlIGlmIGl0IGRpZG4ndFxuICAgICAqL1xuICAgIHJlbW92ZShrZXk6IHN0cmluZykge1xuICAgICAgICBrZXkgPSB0aGlzLnN0b3JhZ2VLZXkgKyBrZXk7XG4gICAgICAgIHRoaXMuY2hlY2tLZXkoa2V5KTtcbiAgICAgICAgY29uc3QgZXhpc3RlZCA9ICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZWQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgZXZlcnl0aGluZyBpbiBjYWNoZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdHJ1ZVxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICBjb25zdCBleGlzdGVkID0gKHRoaXMuc3RvcmFnZS5sZW5ndGggPiAwKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBleGlzdGVkO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBzcGFjZSBpbiBieXRlcyBkb2VzIHRoZSBzdG9yYWdlIHRha2U/XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBOdW1iZXJcbiAgICAgKi9cbiAgICBzaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbCBmdW5jdGlvbiBmIG9uIHRoZSBzcGVjaWZpZWQgY29udGV4dCBmb3IgZWFjaCBlbGVtZW50IG9mIHRoZSBzdG9yYWdlXG4gICAgICogZnJvbSBpbmRleCAwIHRvIGluZGV4IGxlbmd0aC0xLlxuICAgICAqIFdBUk5JTkcgOiBZb3Ugc2hvdWxkIG5vdCBtb2RpZnkgdGhlIHN0b3JhZ2UgZHVyaW5nIHRoZSBsb29wICEhIVxuICAgICAqXG4gICAgICogQHBhcmFtIGYgLSBGdW5jdGlvbiB0byBjYWxsIG9uIGV2ZXJ5IGl0ZW0uXG4gICAgICogQHBhcmFtICBjb250ZXh0IC0gQ29udGV4dCAodGhpcyBmb3IgZXhhbXBsZSkuXG4gICAgICogQHJldHVybnMgTnVtYmVyIG9mIGl0ZW1zIGluIHN0b3JhZ2VcbiAgICAgKi9cbiAgICBmb3JlYWNoKGYsIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbiA9IHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLnN0b3JhZ2Uua2V5KGkpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBmIGlzIGFuIGluc3RhbmNlIG1ldGhvZCBvbiBpbnN0YW5jZSBjb250ZXh0XG4gICAgICAgICAgICAgICAgZi5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZiBpcyBhIGZ1bmN0aW9uIG9yIGNsYXNzIG1ldGhvZFxuICAgICAgICAgICAgICAgIGYodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH07XG5cbiAgICAvLyBQcml2YXRlIEFQSVxuICAgIC8vIGhlbHBlciBmdW5jdGlvbnMgYW5kIHZhcmlhYmxlcyBoaWRkZW4gd2l0aGluIHRoaXMgZnVuY3Rpb24gc2NvcGVcblxuICAgIHByaXZhdGUgY2hlY2tLZXkoa2V5KSB7XG4gICAgICAgIGlmICgha2V5IHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0tleSB0eXBlIG11c3QgYmUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuIl19