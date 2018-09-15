/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Error = /** @class */ (function () {
    function Error(code, reason) {
        this.code = code;
        this.reason = reason;
    }
    ;
    /**
     * @param {?} err
     * @return {?}
     */
    Error.prototype.equals = /**
     * @param {?} err
     * @return {?}
     */
    function (err) {
        return this.code === err.code && this.reason === err.reason;
    };
    /**
     * @return {?}
     */
    Error.prototype.toString = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var msg = (typeof this.reason === 'string') ? this.reason : JSON.stringify(this.reason);
        return '' + this.code + ' - ' + msg;
    };
    return Error;
}());
export { Error };
if (false) {
    /** @type {?} */
    Error.prototype.code;
    /** @type {?} */
    Error.prototype.reason;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9maWRqLyIsInNvdXJjZXMiOlsic2RrL2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFBO0lBRUksZUFBbUIsSUFBWSxFQUFTLE1BQWM7UUFBbkMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7S0FDckQ7SUFBQSxDQUFDOzs7OztJQUVGLHNCQUFNOzs7O0lBQU4sVUFBTyxHQUFVO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDO0tBQy9EOzs7O0lBRUQsd0JBQVE7OztJQUFSOztRQUNJLElBQU0sR0FBRyxHQUFXLENBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDdkM7Z0JBZEw7SUFnQkMsQ0FBQTtBQWRELGlCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFcnJvckludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIEVycm9yIGltcGxlbWVudHMgRXJyb3JJbnRlcmZhY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvZGU6IG51bWJlciwgcHVibGljIHJlYXNvbjogc3RyaW5nKSB7XG4gICAgfTtcblxuICAgIGVxdWFscyhlcnI6IEVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvZGUgPT09IGVyci5jb2RlICYmIHRoaXMucmVhc29uID09PSBlcnIucmVhc29uO1xuICAgIH1cblxuICAgIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1zZzogc3RyaW5nID0gKHR5cGVvZiB0aGlzLnJlYXNvbiA9PT0gJ3N0cmluZycpID8gdGhpcy5yZWFzb24gOiBKU09OLnN0cmluZ2lmeSh0aGlzLnJlYXNvbik7XG4gICAgICAgIHJldHVybiAnJyArIHRoaXMuY29kZSArICcgLSAnICsgbXNnO1xuICAgIH1cblxufVxuIl19