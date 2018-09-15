/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
export declare class LocalStorage {
    private storageKey;
    version: string;
    private storage;
    constructor(storageService: any, storageKey: any);
    /**
     * Sets a key's value.
     *
     * @param key - Key to set. If this value is not set or not
     *              a string an exception is raised.
     * @param value - Value to set. This can be any value that is JSON
     *              compatible (Numbers, Strings, Objects etc.).
     * @returns the stored value which is a container of user value.
     */
    set(key: string, value: any): any;
    /**
     * Looks up a key in cache
     *
     * @param key - Key to look up.
     * @param def - Default value to return, if key didn't exist.
     * @returns the key value, default value or <null>
     */
    get(key: string, def?: any): any;
    /**
     * Deletes a key from cache.
     *
     * @param  key - Key to delete.
     * @returns true if key existed or false if it didn't
     */
    remove(key: string): boolean;
    /**
     * Deletes everything in cache.
     *
     * @return true
     */
    clear(): boolean;
    /**
     * How much space in bytes does the storage take?
     *
     * @returns Number
     */
    size(): any;
    /**
     * Call function f on the specified context for each element of the storage
     * from index 0 to index length-1.
     * WARNING : You should not modify the storage during the loop !!!
     *
     * @param f - Function to call on every item.
     * @param  context - Context (this for example).
     * @returns Number of items in storage
     */
    foreach(f: any, context: any): any;
    private checkKey;
}
