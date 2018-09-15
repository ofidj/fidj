/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
export class Base64 {
    constructor() {
    }
    ;
    /**
     * Decodes string from Base64 string
     * @param {?} input
     * @return {?}
     */
    static encode(input) {
        if (!input) {
            return null;
        }
        return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt('0x' + p1, 16));
        }));
    }
    /**
     * @param {?} input
     * @return {?}
     */
    static decode(input) {
        if (!input) {
            return null;
        }
        return decodeURIComponent(atob(input).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTY0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInRvb2xzL2Jhc2U2NC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsTUFBTTtJQUVGO0tBQ0M7SUFBQSxDQUFDOzs7Ozs7SUFLSyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQWE7UUFFOUIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQzNELHNCQUFzQixLQUFLLEVBQUUsRUFBRTtZQUMzQixPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2RCxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBSUwsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFhO1FBRTlCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3RELE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztDQUdwQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBCYXNlNjQge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlY29kZXMgc3RyaW5nIGZyb20gQmFzZTY0IHN0cmluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZW5jb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KGlucHV0KS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxuICAgICAgICAgICAgZnVuY3Rpb24gdG9Tb2xpZEJ5dGVzKG1hdGNoLCBwMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KCcweCcgKyBwMSwgMTYpKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZGVjb2RlKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChhdG9iKGlucHV0KS5zcGxpdCgnJykubWFwKChjKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJyUnICsgKCcwMCcgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgIH0pLmpvaW4oJycpKTtcblxuICAgIH1cbn1cbiJdfQ==