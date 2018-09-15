/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Base64 } from './base64';
export class Xor {
    constructor() {
    }
    ;
    /**
     * @param {?} value
     * @param {?} key
     * @return {?}
     */
    static encrypt(value, key) {
        /** @type {?} */
        let result = '';
        value = Xor.header + value;
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        result = Base64.encode(result);
        return result;
    }
    ;
    /**
     * @param {?} value
     * @param {?} key
     * @param {?=} oldStyle
     * @return {?}
     */
    static decrypt(value, key, oldStyle) {
        /** @type {?} */
        let result = '';
        value = Base64.decode(value);
        for (let i = 0; i < value.length; i++) {
            result += String.fromCharCode((/** @type {?} */ (value[i].charCodeAt(0).toString(10))) ^ Xor.keyCharAt(key, i));
        }
        if (!oldStyle && Xor.header !== result.substring(0, Xor.header.length)) {
            return null;
        }
        if (!oldStyle) {
            result = result.substring(Xor.header.length);
        }
        return result;
    }
    /**
     * @param {?} key
     * @param {?} i
     * @return {?}
     */
    static keyCharAt(key, i) {
        return key[Math.floor(i % key.length)].charCodeAt(0).toString(10);
    }
}
Xor.header = 'artemis-lotsum';
if (false) {
    /** @type {?} */
    Xor.header;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmlkai8iLCJzb3VyY2VzIjpbInRvb2xzL3hvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUVoQyxNQUFNO0lBSUY7S0FDQztJQUFBLENBQUM7Ozs7OztJQUdLLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBYSxFQUFFLEdBQVc7O1FBRTVDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFRLEVBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZHO1FBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsT0FBTyxNQUFNLENBQUM7O0lBQ2pCLENBQUM7Ozs7Ozs7SUFFSyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWEsRUFBRSxHQUFXLEVBQUUsUUFBa0I7O1FBQ2hFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxtQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQVEsRUFBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkc7UUFFRCxJQUFJLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNwRSxPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQzs7Ozs7OztJQUdYLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O2FBckN0RCxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Jhc2U2NH0gZnJvbSAnLi9iYXNlNjQnO1xuXG5leHBvcnQgY2xhc3MgWG9yIHtcblxuICAgIHN0YXRpYyBoZWFkZXIgPSAnYXJ0ZW1pcy1sb3RzdW0nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfTtcblxuXG4gICAgcHVibGljIHN0YXRpYyBlbmNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICAgICAgdmFsdWUgPSBYb3IuaGVhZGVyICsgdmFsdWU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKHZhbHVlW2ldLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTApIGFzIGFueSkgXiBYb3Iua2V5Q2hhckF0KGtleSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IEJhc2U2NC5lbmNvZGUocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgcHVibGljIHN0YXRpYyBkZWNyeXB0KHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nLCBvbGRTdHlsZT86IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIHZhbHVlID0gQmFzZTY0LmRlY29kZSh2YWx1ZSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCh2YWx1ZVtpXS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDEwKSBhcyBhbnkpIF4gWG9yLmtleUNoYXJBdChrZXksIGkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2xkU3R5bGUgJiYgWG9yLmhlYWRlciAhPT0gcmVzdWx0LnN1YnN0cmluZygwLCBYb3IuaGVhZGVyLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvbGRTdHlsZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZyhYb3IuaGVhZGVyLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGtleUNoYXJBdChrZXksIGkpIHtcbiAgICAgICAgcmV0dXJuIGtleVtNYXRoLmZsb29yKGkgJSBrZXkubGVuZ3RoKV0uY2hhckNvZGVBdCgwKS50b1N0cmluZygxMCk7XG4gICAgfVxuXG5cbn1cbiJdfQ==