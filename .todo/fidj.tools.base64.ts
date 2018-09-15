export class Base64 {

    // todo Base64 ts refactor
    // static keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    constructor() {
    };

    /**
     * Decodes string from Base64 string
     */
    public static decode(input) {

        return decodeURIComponent(atob(input).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

    }
}