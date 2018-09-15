/**
 * localStorage class factory
 * Usage : var LocalStorage = miapp.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
export class LocalStorage {

    public version = '0.1';
    private storage;

    // Constructor
    constructor(storageService, private storageKey) {
        this.storage = storageService || window.localStorage;
        if (!this.storage) {
            throw new Error('miapp.LocalStorageFactory needs a storageService!');
        }
        /* todo huge refacto
                    if (!miapp.Xml) {
                        throw new Error('miapp.Xml needs to be loaded before miapp.LocalStorage!');
                    }
                    if (!miapp.Json) {
                        throw new Error('miapp.Json needs to be loaded before miapp.LocalStorage!');
                    }
                    if (!miapp.Xml.isXml || !miapp.Xml.xml2String || !miapp.Xml.string2Xml) {
                        throw new Error('miapp.Xml with isXml(), xml2String() and string2Xml() needs to be loaded before miapp.LocalStorage!');
                    }
                    if (!miapp.Json.object2String || !miapp.Json.string2Object) {
                        throw new Error('miapp.Json with object2String() and string2Object() needs to be loaded before miapp.LocalStorage!');
                    }
                    */
    }

    // Public API

    /**
     * Sets a key's value.
     *
     * @param {String} key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param {Mixed} value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @returns the stored value which is a container of user value.
     */
    set(key, value) {

        key = this.storageKey + key;
        this.checkKey(key);
        // clone the object before saving to storage
        var t = typeof(value);
        if (t == 'undefined')
            value = 'null';
        else if (value === null)
            value = 'null';
        /* todo
         else if (miapp.Xml.isXml(value))

             value = miapp.Json.object2String({xml: miapp.Xml.xml2String(value)});
         else if (t == 'string')
             value = miapp.Json.object2String({string: value});
         else if (t == 'number')
             value = miapp.Json.object2String({number: value});
         else if (t == 'boolean')
             value = miapp.Json.object2String({bool: value});
         else if (t == 'object')
             value = miapp.Json.object2String({json: value});
             */
        else {
            // reject and do not insert
            // if (typeof value == "function") for example
            throw new TypeError('Value type ' + t + ' is invalid. It must be null, undefined, xml, string, number, boolean or object');
        }
        this.storage.setItem(key, value);
        return value;
    };

    /**
     * Looks up a key in cache
     *
     * @param {String} key - Key to look up.
     * @param {mixed} def - Default value to return, if key didn't exist.
     * @returns the key value, default value or <null>
     */
    get(key, def?) {
        key = this.storageKey + key;
        this.checkKey(key);
        var item = this.storage.getItem(key);
        if (item !== null) {
            if (item == 'null') {
                return null;
            }
            var value;
            /* todo
            var value = miapp.Json.string2Object(item);
            if ('xml' in value) {
                return miapp.Xml.string2Xml(value.xml);
            } else  */
            if ('string' in value) {
                return value.string;
            } else if ('number' in value) {
                return value.number.valueOf();
            } else if ('bool' in value) {
                return value.bool.valueOf();
            } else {
                return value.json;
            }
        }
        return !def ? null : def;
    };

    /**
     * Deletes a key from cache.
     *
     * @param {String} key - Key to delete.
     * @returns true if key existed or false if it didn't
     */
    remove(key) {
        key = this.storageKey + key;
        this.checkKey(key);
        var existed = (this.storage.getItem(key) !== null);
        this.storage.removeItem(key);
        return existed;
    };

    /**
     * Deletes everything in cache.
     *
     * @return true
     */
    clear() {
        var existed = (this.storage.length > 0);
        this.storage.clear();
        return existed;
    };

    /**
     * How much space in bytes does the storage take?
     *
     * @returns Number
     */
    size() {
        return this.storage.length;
    };

    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param {Function} f - Function to call on every item.
     * @param {Object} context - Context (this for example).
     * @returns Number of items in storage
     */
    foreach(f, context) {
        var n = this.storage.length;
        for (var i = 0; i < n; i++) {
            var key = this.storage.key(i);
            var value = this.get(key);
            if (context) {
                // f is an instance method on instance context
                f.call(context, value);
            } else {
                // f is a function or class method
                f(value);
            }
        }
        return n;
    };

    // Private API
    // helper functions and variables hidden within this function scope

    private checkKey(key) {
        if (!key || (typeof key != 'string')) {
            throw new TypeError('Key type must be string');
        }
        return true;
    }
}
