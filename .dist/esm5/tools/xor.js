/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Base64 } from './base64';
var Xor = /** @class */ (function () {
    function Xor() {
    }
    ;
    /**
     * @param {?} value
     * @param {?} key
     * @return {?}
     */
    Xor.encrypt = /**
     * @param {?} value
     * @param {?} key
     * @return {?}
     */
    function (value, key) {
        /** @type {?} */
        var result = '';
        value = Xor.header + value;
        for (var i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        result = Base64.encode(result);
        return result;
    };
    ;
    /**
     * @param {?} value
     * @param {?} key
     * @param {?=} oldStyle
     * @return {?}
     */
    Xor.decrypt = /**
     * @param {?} value
     * @param {?} key
     * @param {?=} oldStyle
     * @return {?}
     */
    function (value, key, oldStyle) {
        /** @type {?} */
        var result = '';
        value = Base64.decode(value);
        for (var i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        if (!oldStyle && Xor.header !== result.substring(0, Xor.header.length)) {
            return null;
        }
        if (!oldStyle) {
            result = result.substring(Xor.header.length);
        }
        return result;
    };
    /**
     * @param {?} key
     * @param {?} i
     * @return {?}
     */
    Xor.keyCharAt = /**
     * @param {?} key
     * @param {?} i
     * @return {?}
     */
    function (key, i) {
        return key[Math.floor(i % key.length)].charCodeAt(0).toString(10);
    };
    Xor.header = 'artemis-lotsum';
    return Xor;
}());
export { Xor };
if (false) {
    /** @type {?} */
    Xor.header;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInRvb2xzL3hvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQzs7SUFNNUI7S0FDQztJQUFBLENBQUM7Ozs7OztJQUdZLFdBQU87Ozs7O2NBQUMsS0FBYSxFQUFFLEdBQVc7O1FBRTVDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFRLEVBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZHO1FBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsT0FBTyxNQUFNLENBQUM7O0lBQ2pCLENBQUM7Ozs7Ozs7SUFFWSxXQUFPOzs7Ozs7Y0FBQyxLQUFhLEVBQUUsR0FBVyxFQUFFLFFBQWtCOztRQUNoRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFRLEVBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZHO1FBRUQsSUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDcEUsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxNQUFNLENBQUM7Ozs7Ozs7SUFHSixhQUFTOzs7OztjQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7O2lCQXJDdEQsZ0JBQWdCO2NBSnBDOztTQUVhLEdBQUciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Jhc2U2NH0gZnJvbSAnLi9iYXNlNjQnO1xuXG5leHBvcnQgY2xhc3MgWG9yIHtcblxuICAgIHN0YXRpYyBoZWFkZXIgPSAnYXJ0ZW1pcy1sb3RzdW0nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuXG4gICAgcHVibGljIHN0YXRpYyBlbmNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICAgICAgdmFsdWUgPSBYb3IuaGVhZGVyICsgdmFsdWU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKHZhbHVlW2ldLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTApIGFzIGFueSkgXiBYb3Iua2V5Q2hhckF0KGtleSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IEJhc2U2NC5lbmNvZGUocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgcHVibGljIHN0YXRpYyBkZWNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nLCBvbGRTdHlsZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIHZhbHVlID0gQmFzZTY0LmRlY29kZSh2YWx1ZSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCh2YWx1ZVtpXS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDEwKSBhcyBhbnkpIF4gWG9yLmtleUNoYXJBdChrZXksIGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2xkU3R5bGUgJiYgWG9yLmhlYWRlciAhPT0gcmVzdWx0LnN1YnN0cmluZygwLCBYb3IuaGVhZGVyLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvbGRTdHlsZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZyhYb3IuaGVhZGVyLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGtleUNoYXJBdChrZXksIGkpIHtcbiAgICAgICAgcmV0dXJuIGtleVtNYXRoLmZsb29yKGkgJSBrZXkubGVuZ3RoKV0uY2hhckNvZGVBdCgwKS50b1N0cmluZygxMCk7XG4gICAgfVxuXG5cbn1cbiJdfQ==