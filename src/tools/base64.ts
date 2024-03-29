export class Base64 {

    constructor() {
    };

    /**
     * Decodes string from Base64 string
     */
    public static encode(input: string): string {

        if (!input) {
            return null;
        }

        // TODO const _btoa = typeof window !== 'undefined' ? window.btoa : import('btoa');
        const _btoa = window.btoa;

        return _btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(parseInt('0x' + p1, 16));
            }));

    }

    public static decode(input: string): string {

        if (!input) {
            return null;
        }

        // TODO const _atob = typeof window !== 'undefined' ? window.atob : import 'atob';
        const _atob = window.atob;

        return decodeURIComponent(_atob(input).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

    }
}
