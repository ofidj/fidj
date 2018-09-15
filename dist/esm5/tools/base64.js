/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Base64 = /** @class */ (function () {
    function Base64() {
    }
    ;
    /**
     * Decodes string from Base64 string
     * @param {?} input
     * @return {?}
     */
    Base64.encode = /**
     * Decodes string from Base64 string
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (!input) {
            return null;
        }
        return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt('0x' + p1, 16));
        }));
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Base64.decode = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        if (!input) {
            return null;
        }
        return decodeURIComponent(atob(input).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };
    return Base64;
}());
export { Base64 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTY0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInRvb2xzL2Jhc2U2NC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBQTtJQUVJO0tBQ0M7SUFBQSxDQUFDOzs7Ozs7SUFLWSxhQUFNOzs7OztjQUFDLEtBQWE7UUFFOUIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQzNELHNCQUFzQixLQUFLLEVBQUUsRUFBRTtZQUMzQixPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2RCxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBSUUsYUFBTTs7OztjQUFDLEtBQWE7UUFFOUIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztZQUNsRCxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7aUJBN0JyQjtJQWdDQyxDQUFBO0FBaENELGtCQWdDQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBCYXNlNjQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlY29kZXMgc3RyaW5nIGZyb20gQmFzZTY0IHN0cmluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZW5jb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KGlucHV0KS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxuICAgICAgICAgICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KCcweCcgKyBwMSwgMTYpKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZGVjb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChhdG9iKGlucHV0KS5zcGxpdCgnJykubWFwKChjKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJyUnICsgKCcwMCcgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgIH0pLmpvaW4oJycpKTtcblxuICAgIH1cbn1cbiJdfQ==