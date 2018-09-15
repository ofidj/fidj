/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
export class Error {
    /**
     * @param {?} code
     * @param {?} reason
     */
    constructor(code, reason) {
        this.code = code;
        this.reason = reason;
    }
    ;
    /**
     * @param {?} err
     * @return {?}
     */
    equals(err) {
        return this.code === err.code && this.reason === err.reason;
    }
    /**
     * @return {?}
     */
    toString() {
        /** @type {?} */
        const msg = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
        return '' + this.code + ' - ' + msg;
    }
}
if (false) {
    /** @type {?} */
    Error.prototype.code;
    /** @type {?} */
    Error.prototype.reason;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9maWRqLyIsInNvdXJjZXMiOlsic2RrL2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxNQUFNOzs7OztJQUVGLFlBQW1CLElBQVksRUFBUyxNQUFjO1FBQW5DLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0tBQ3JEO0lBQUEsQ0FBQzs7Ozs7SUFFRixNQUFNLENBQUMsR0FBVTtRQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQztLQUMvRDs7OztJQUVELFFBQVE7O1FBQ0osTUFBTSxHQUFHLEdBQVcsQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xHLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUN2QztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFcnJvckludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIEVycm9yIGltcGxlbWVudHMgRXJyb3JJbnRlcmZhY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvZGU6IG51bWJlciwgcHVibGljIHJlYXNvbjogc3RyaW5nKSB7XG4gICAgfTtcblxuICAgIGVxdWFscyhlcnI6IEVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGUgPT09IGVyci5jb2RlICYmIHRoaXMucmVhc29uID09PSBlcnIucmVhc29uO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1zZzogc3RyaW5nID0gKHR5cGVvZiB0aGlzLnJlYXNvbiA9PT0gJ3N0cmluZycpID8gdGhpcy5yZWFzb24gOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlYXNvbik7XG4gICAgICAgIHJldHVybiAnJyArIHRoaXMuY29kZSArICcgLSAnICsgbXNnO1xuICAgIH1cblxufVxuIl19