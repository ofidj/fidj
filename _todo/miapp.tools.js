

// Namespace fidj
var fidj = {};

/**
 * Management of browser capabilities
 */
fidj.BrowserCapabilities = (function (navigator, window, document) {
    var capacities = {vendor: '', cssVendor: ''};

    function prefixStyle(style) {
        if (capacities.vendor === '') return style;
        style = style.charAt(0).toUpperCase() + style.substr(1);
        return capacities.vendor + style;
    }

    var dummyStyle = document.createElement('div').style;
    var vendors = 't,webkitT,MozT,msT,OT'.split(',');
    var nbVendors = vendors.length;
    for (var i = 0; i < nbVendors; i++) {
        var t = vendors[i] + 'ransform';
        if (t in dummyStyle) {
            capacities.vendor = vendors[i].substr(0, vendors[i].length - 1);
            capacities.cssVendor = '-' + capacities.vendor.toLowerCase() + '-';
            break;
        }
    }

    capacities.transform = prefixStyle('transform');
    capacities.transitionProperty = prefixStyle('transitionProperty');
    capacities.transitionDuration = prefixStyle('transitionDuration');
    capacities.transformOrigin = prefixStyle('transformOrigin');
    capacities.transitionTimingFunction = prefixStyle('transitionTimingFunction');
    capacities.transitionDelay = prefixStyle('transitionDelay');

    capacities.isAndroid = (/android/gi).test(navigator.appVersion);
    capacities.isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
    capacities.isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    capacities.isPhantom = (/phantom/gi).test(navigator.userAgent);
    //capacities.hasTouch = (('ontouchstart' in window) || ('createTouch' in document)) && !capacities.isTouchPad && !capacities.isPhantom;
    capacities.hasTouch = (('ontouchstart' in window) || ('createTouch' in document)) && (capacities.isAndroid || capacities.isIDevice) && !capacities.isPhantom;
    capacities.has3d = prefixStyle('perspective') in dummyStyle;
    capacities.hasTransform = (capacities.vendor != '');
    capacities.hasTransitionEnd = prefixStyle('transition') in dummyStyle;

    capacities.online = navigator.onLine;

    /**
     *  @deprecated  use ngCordova now
     */
    capacities.isConnectionOnline = function () {

        //cordova
        if (navigator && navigator.connection && Connection) {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            return (states[networkState] !== 'No network connection'
            && states[networkState] !== 'Unknown connection');
        }

        // web browser
        if (navigator && typeof navigator.onLine === 'boolean') return navigator.onLine;

        return false;
    }

    capacities.RESIZE_EVENT = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    capacities.TRNEND_EVENT = (function () {
        if (capacities.vendor == '') return false;
        var transitionEnd = {
            '': 'transitionend',
            'webkit': 'webkitTransitionEnd',
            'Moz': 'transitionend',
            'O': 'otransitionend',
            'ms': 'MSTransitionEnd'
        };
        return transitionEnd[capacities.vendor];
    })();
    if (window.requestAnimationFrame) {
        //capacities.nextFrame.call(window, callback);
        capacities.nextFrame = function (callback) {
            return window.requestAnimationFrame(callback);
        };
    } else if (window.webkitRequestAnimationFrame) {
        capacities.nextFrame = function (callback) {
            return window.webkitRequestAnimationFrame(callback);
        };
    } else if (window.mozRequestAnimationFrame) {
        capacities.nextFrame = function (callback) {
            return window.mozRequestAnimationFrame(callback);
        };
    } else if (window.oRequestAnimationFrame) {
        capacities.nextFrame = function (callback) {
            return window.oRequestAnimationFrame(callback);
        };
    } else if (window.msRequestAnimationFrame) {
        capacities.nextFrame = function (callback) {
            return window.msRequestAnimationFrame(callback);
        };
    } else {
        capacities.nextFrame = function (callback) {
            return setTimeout(callback, 1);
        };
    }
    if (window.cancelRequestAnimationFrame) {
        //capacities.cancelFrame.call(window, handle);
        capacities.cancelFrame = function (handle) {
            return window.cancelRequestAnimationFrame(handle);
        };
    } else if (window.webkitCancelAnimationFrame) {
        capacities.cancelFrame = function (handle) {
            return window.webkitCancelAnimationFrame(handle);
        };
    } else if (window.webkitCancelRequestAnimationFrame) {
        capacities.cancelFrame = function (handle) {
            return window.webkitCancelRequestAnimationFrame(handle);
        };
    } else if (window.mozCancelRequestAnimationFrame) {
        capacities.cancelFrame = function (handle) {
            return window.mozCancelRequestAnimationFrame(handle);
        };
    } else if (window.oCancelRequestAnimationFrame) {
        capacities.cancelFrame = function (handle) {
            return window.oCancelRequestAnimationFrame(handle);
        };
    } else if (window.msCancelRequestAnimationFrame) {
        capacities.cancelFrame = function (handle) {
            return window.msCancelRequestAnimationFrame(handle);
        };
    } else {
        capacities.cancelFrame = function (handle) {
            return clearTimeout(handle);
        };
    }
    // FIX ANDROID BUG : translate3d and scale doesn't work together => deactivate translate3d (in case user uses scale) !
    capacities.translateZ = (capacities.has3d && !capacities.isAndroid) ? ' translateZ(0)' : '';

    dummyStyle = null;

    return capacities;
})(navigator, window, document);


fidj.Json = (function($)
{
    'use strict';

    if(!(Object.toJSON || window.JSON)){
        throw new Error("Object.toJSON or window.JSON needs to be loaded before fidj.Json!");
    }

    // Constructor
    function Json()
    {
        this.version = "0.1";
    }

    // Public API

    /**
     * Encodes object to JSON string
     *
     * Do not use $.param() which causes havoc in ANGULAR.
     * See http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
     */
    Json.uriEncode = function(obj) {
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            if (!obj.hasOwnProperty(name)) continue;
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += Json.uriEncode(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    if (!value.hasOwnProperty(subName)) continue;
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += Json.uriEncode(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };

    /**
     * Encodes object to JSON string
     */
    Json.object2String = Object.toJSON || (window.JSON && (JSON.encode || JSON.stringify));

    /**
     * Decodes object from JSON string
     */
    Json.string2Object = (window.JSON && (JSON.decode || JSON.parse)) || function (str) {
        return String(str).evalJSON();
    };

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return Json;
})(window.$ || window.jQuery); // Invoke the function immediately to create this class.


/**
 *
 *  Secure Hash Algorithm (SHA1)
 *  http://www.webtoolkit.info/
 *
 **/
fidj.Sha1 = (function () {
'use strict';

    var Sha1 = {};

    // Public API

    /**
     * Hash string
     */
    Sha1.hash = function (input) {
        var s = fidj.Utf8.encode(input);
        return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
    };

    /**
     * Create a 256 bits key from a password
     */
    Sha1.key256 = function (password) {
        var nBytes = 256 / 8;  // no bytes in key
        var halfLen = password.length / 2;
        var hash1 = fidj.Sha1.hash(password.substr(0, halfLen));
        var hash2 = fidj.Sha1.hash(password.substr(halfLen));
        return hash1.substr(0, 16) + hash2.substr(0, nBytes - 16);  // expand key to 16/24/32 bytes long
    };

    /*
     * Convert a raw string to an array of big-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binb(input) {
        var output = new Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var j = 0; j < input.length * 8; j += 8)
            output[j >> 5] |= (input.charCodeAt(j / 8) & 0xFF) << (24 - j % 32);
        return output;
    }

    /*
     * Convert an array of big-endian words to a string
     */
    function binb2rstr(input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
        return output;
    }

    /*
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    function binb_sha1(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = new Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;

            for (var j = 0; j < 80; j++) {
                if (j < 16) w[j] = x[i + j];
                else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                    safe_add(safe_add(e, w[j]), sha1_kt(j)));
                e = d;
                d = c;
                c = bit_rol(b, 30);
                b = a;
                a = t;
            }

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
            e = safe_add(e, olde);
        }
        return [a, b, c, d, e];

    }

    /*
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    function sha1_ft(t, b, c, d) {
        if (t < 20) return (b & c) | ((~b) & d);
        if (t < 40) return b ^ c ^ d;
        if (t < 60) return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    }

    /*
     * Determine the appropriate additive constant for the current iteration
     */
    function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
            (t < 60) ? -1894007588 : -899497514;
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return Sha1;
})(); // Invoke the function immediately to create this class.



// Usefull
var fidjBlockMove = function (evt,stopBubble) {
    'use strict';
    //console.log('fidjBlockMove');
    // All but scrollable element = .c4p-container-scroll-y
    //if (evt.preventDefault) evt.preventDefault() ;
    //if (evt.preventDefault && !$(evt.target).parents('.c4p-container-scroll-y')[0]) {
    //    evt.preventDefault();
    //}
    if (evt.preventDefault && !$('.c4p-container-scroll-y').has($(evt.target)).length) {
        evt.preventDefault();
    }

    if (stopBubble && evt.stopPropagation) evt.stopPropagation();
    if (stopBubble && !evt.cancelBubble) evt.cancelBubble = true;


};

var fidjAllowMove = function (e) {
    //console.log('fidjAllowMove');
    return true ;
};


var fidjFakeConsoleLog = function (e) {
    //console.log('fidjAllowMove');
    return true;
};

// Should be created by Cordova (or CordovaMocks)
var LocalFileSystem;
var Metadata;
var FileError;
var ProgressEvent;
var File;
var DirectoryEntry;
var DirectoryReader;
var FileWriter;
var FileEntry;
var FileSystem;
var FileReader;
var FileTransferError;
var FileUploadOptions;
var FileUploadResult;
var FileTransfer;
var Camera;
//var calendarPlugin;
//var analytics;

// A consistent way to create a unique ID which will never overflow.

fidj.uid  = ['0', '0', '0'];
fidj.idStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
fidj.idNext = {
    '0':1, '1':2, '2':3, '3':4, '4':5, '5':6, '6':7, '7':8, '8':9, '9':10,
    'A':11, 'B':12, 'C':13, 'D':14, 'E':15, 'F':16, 'G':17, 'H':18, 'I':19, 'J':20,
    'K':21, 'L':22, 'M':23, 'N':24, 'O':25, 'P':26, 'Q':27, 'R':28, 'S':29, 'T':30,
    'U':31, 'V':32, 'W':33, 'X':34, 'Y':35, 'Z':0
};

fidj.nextUid = function() {
    var index = fidj.uid.length;
    while (index) {
        index--;
        var i = fidj.idNext[fidj.uid[index]];
        fidj.uid[index] = fidj.idStr[i];
        if (i > 0) {
            return fidj.uid.join('');
        }
    }
    fidj.uid.unshift('0');
    return fidj.uid.join('');
};

fidj.getUid = function() {
    return fidj.uid.join('');
};

fidj.initUid = function(seed) {
    if (fidj.isUndefined(seed)) {
        fidj.uid  = ['0', '0', '0'];
        return;
    }
    seed = seed.toUpperCase();
    fidj.uid  = [];
    for (var i = 0, n = seed.length; i < n; i++) {
        var c = seed.charAt(i);
        if (fidj.isDefined(fidj.idNext[c])) {
            fidj.uid.push(c);
        }
    }
    while (fidj.uid.length < 3) {
        fidj.uid.unshift('0');
    }
};

/**
 * Function to test the undefined of any variable
 *
 * @param obj
 * @returns {boolean}
 */
fidj.isUndefined = function(obj) {
    return (typeof(obj) == 'undefined');
};

/**
 * Function to test the non-undefined of any variable
 *
 * @param obj
 * @returns {boolean}
 */
fidj.isDefined = function(obj) {
    return (typeof(obj) != 'undefined');
};

/**
 * Function to test the undefined or nullity of any variable
 *
 * @param obj
 * @returns {boolean}
 */
fidj.isUndefinedOrNull = function(obj) {
    return (typeof(obj) == 'undefined') || (obj === null);
};

/**
 * Function to test the non-undefined and non-null of any variable
 *
 * @param obj
 * @returns {boolean}
 */
fidj.isDefinedAndNotNull = function(obj) {
    return (typeof(obj) != 'undefined') && (obj !== null);
};

// Speed up calls to hasOwnProperty
//var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Function to test the emptiest of any variable
 * Ex: undefined, null, {}, [], '' are empty
 *
 * @param obj
 * @returns {boolean}
 */
fidj.isEmptyOrFalse = function(obj) {
    'use strict';
    switch (typeof(obj)) {
        case 'object' :
            /*for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }*/
            // Object.getOwnPropertyNames throw exception on null object
            if (obj === null) return true;
            if (Object.getOwnPropertyNames(obj).length === 0) return true;
            // Beware Document objects have a 'length' attr about the body attribute
            if (obj instanceof Array) {
                return (obj.length === 0);
            } else {
                return false;
            }
            break;
        case 'string' :
            return (obj.length === 0);
        case 'number' :
            return (obj === 0);
        case 'boolean' :
            return !obj;
        case 'function' :
            return false;
        case 'undefined' :
            return true;
    }
    return !obj;
};

/**
 * Function to test the emptiest of any variable
 * Ex: undefined, null, {}, [], '' are empty
 *
 * @param obj
 * @returns {boolean}
 */
fidj.isTrueOrNonEmpty = function(obj) {
    switch (typeof(obj)) {
        case 'object' :
            /*for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }*/
            // Object.getOwnPropertyNames throw exception on null object
            if (obj === null) return false;
            if (Object.getOwnPropertyNames(obj).length === 0) return false;
            // Beware Document objects have a 'length' attr about the body attribute
            if (obj instanceof Array) {
                return (obj.length !== 0);
            } else {
                return true;
            }
            break;
        case 'string' :
            return (obj.length !== 0);
        case 'number' :
            return (obj !== 0);
        case 'boolean' :
            return obj;
        case 'function' :
            return true;
        case 'undefined' :
            return false;
    }
    return !!obj;
};

/**
 * Safe $apply with evaluation in scope context : asynchronous if we are already in $$phase, direct if not
 *
 * To execute expr in next $apply, you should use $timeout(function() {scope.$apply(expr);}, 0);
 *
 * @param scope
 * @param expr
 */
fidj.safeApply = function (scope, expr, beforeFct, afterFct) {

    if (beforeFct) fidj.safeApply(scope,beforeFct);

    // Check scope.$root.$$phase because it is always true during any $apply(), while scope.$$phase is NOT always true
    if (scope.$root && scope.$root.$$phase) {
        // Queue in scope.$root, because in scope it will not be evaluated in $digest()
        // scope.$digest() is not executed, ONLY $rootScope.$digest() is executed.
        //console.log('safeApply - scope.$root outside the $digest');
        scope.$root.$evalAsync(function() {
            scope.$eval(expr);
        });
    }
    else if (scope.$treeScope && scope.$treeScope.$apply){
        //console.log('safeApply - scope.$treeScope for callback');
        scope.$treeScope.$apply(expr);
    }
    else if (scope.$apply && (scope.$apply != angular.noop)) {
        //console.log('safeApply - scope.$apply');
        scope.$apply(expr);
    }
    else {
        //console.log('safeApply - na : dangerous ?');
        expr();
    }

    if (afterFct) fidj.safeApply(scope,afterFct);
};

/**
 * Solution to work around an XHR issue : sometimes no end if no $Apply under Chrome for example.
 * This solution trigger an $apply to hope triggering the XHR end.
 */
fidj.promiseWakeupNb = 0; // number of simultaneous active httpPromise
fidj.promiseWakeupTimeout = null;
fidj.promiseWakeup = function (scope, httpPromise, fctOnHttpSuccess, fctOnHttpError) {
    var promiseWakeupOnHttpSuccess = function(response) {
        //fidj.InternalLog.log("fidj.promiseWakeup.tick", "promiseWakeupOnHttpSuccess?");
        fidj.promiseWakeupNb--;
        // Keep tick function active until all httpPromise end
        if (fidj.promiseWakeupNb <= 0) {
            fidj.InternalLog.log("fidj.promiseWakeup.tick", "stop");
            fidj.promiseWakeupNb = 0;
            clearTimeout(fidj.promiseWakeupTimeout);
            fidj.promiseWakeupTimeout = null;
        }
        fctOnHttpSuccess(response);
    };
    var promiseWakeupOnHttpError = function(response) {
        //fidj.InternalLog.log("fidj.promiseWakeup.tick", "promiseWakeupOnHttpError?");
        fidj.promiseWakeupNb--;
        // Keep tick function active until all httpPromise end
        if (fidj.promiseWakeupNb <= 0) {
            fidj.InternalLog.log("fidj.promiseWakeup.tick", "stop");
            fidj.promiseWakeupNb = 0;
            clearTimeout(fidj.promiseWakeupTimeout);
            fidj.promiseWakeupTimeout = null;
        }
        fctOnHttpError(response);
    };
    function tick() {
        if (fidj.promiseWakeupNb > 0) {
            //fidj.InternalLog.log("fidj.promiseWakeup.tick", "scope.$apply");
            fidj.safeApply(scope);
            // Usage of $timeout breaks e2e tests for the moment : https://github.com/angular/angular.js/issues/2402
            //$timeout(tick, 1000, false);// DO NOT call $apply
            fidj.promiseWakeupTimeout = setTimeout(tick, 1000);
        } else {
            //fidj.InternalLog.log("fidj.promiseWakeup.tick", "ignored");
        }
    }
    // Launch only one tick function if many httpPromise occur
    if (fidj.promiseWakeupNb === 0) {
        //fidj.InternalLog.log("fidj.promiseWakeup.tick", "start");
        fidj.promiseWakeupTimeout = setTimeout(tick, 1000);
    }
    fidj.promiseWakeupNb++;
    //fidj.InternalLog.log("fidj.promiseWakeup.tick", "before?");
    httpPromise.then(promiseWakeupOnHttpSuccess, promiseWakeupOnHttpError);
    //fidj.InternalLog.log("fidj.promiseWakeup.tick", "after?");
};

function openChildBrowser(url, extension, onLocationChange, onClose) {

    //fidj.InternalLog.log('openChildBrowser', url+' extension:'+extension);
    var closeChildBrowserAfterLocationChange = false;// To NOT call onClose() if onLocationChange() has been called
    if (!window.device){
        // Chrome case
        // We can not bind on window events because Salesforce page modify/erase our event bindings.
        fidj.InternalLog.log('openChildBrowser', 'window.open');
        var new_window = window.open(url, '_blank', 'menubar=no,scrollbars=yes,resizable=1,height=400,width=600');
        var initialLocation;
        var initialUrl;
        if (fidj.isDefinedAndNotNull(new_window.location)) {
            initialLocation = new_window.location.href;
        }
        if (fidj.isDefinedAndNotNull(new_window.document)) {
            initialUrl = new_window.document.URL;
        }
        fidj.InternalLog.log('openChildBrowser', 'initialLocation=' + initialLocation + ' initialUrl=' + initialUrl);
        var locationChanged = false;
        //if (onLocationChange) new_window.onbeforeunload = onLocationChange;
        var new_window_tracker = function () {
            if (fidj.isDefinedAndNotNull(new_window.location) && (typeof new_window.location.href == "string")) {
                //fidj.InternalLog.log('openChildBrowser', 'new location=' + new_window.location.href);
            } else if (fidj.isDefinedAndNotNull(new_window.document) && (typeof new_window.document.URL == "string")) {
                //fidj.InternalLog.log('openChildBrowser', 'new url=' + new_window.document.URL);
            }
            if (!locationChanged) {
                if (fidj.isDefinedAndNotNull(new_window.location) &&
                    (typeof new_window.location.href == "string") &&
                    (initialLocation != new_window.location.href)) {
                    fidj.InternalLog.log('openChildBrowser', 'new location=' + new_window.location.href);
                    locationChanged = true;
                    setTimeout(new_window_tracker, 100);
                    return;
                } else if (fidj.isDefinedAndNotNull(new_window.document) &&
                    (typeof new_window.document.URL == "string") &&
                    (initialUrl != new_window.document.URL)) {
                    fidj.InternalLog.log('openChildBrowser', 'new url=' + new_window.document.URL);
                    locationChanged = true;
                    setTimeout(new_window_tracker, 100);
                    return;
                }
            } else {
                if (fidj.isDefinedAndNotNull(new_window.location) &&
                    (typeof new_window.location.href == "string") &&
                    (new_window.location.href.indexOf('about:blank') >= 0)) {
                    fidj.InternalLog.log('openChildBrowser', 'onLocationChange');
                    if (onLocationChange) onLocationChange();
                    closeChildBrowserAfterLocationChange = true;
                    new_window.close();
                    return;
                } else if (fidj.isDefinedAndNotNull(new_window.document) &&
                    (typeof new_window.document.URL == "string") &&
                    (new_window.document.URL.indexOf('about:blank') >= 0)) {
                    fidj.InternalLog.log('openChildBrowser', 'onUrlChange');
                    if (onLocationChange) onLocationChange();
                    closeChildBrowserAfterLocationChange = true;
                    new_window.close();
                    return;
                }
            }
            if (new_window.closed) {
                fidj.InternalLog.log('openChildBrowser', 'onClose');
                if (!closeChildBrowserAfterLocationChange) {
                    if (onClose) onClose();
                }
                return;
            }
            //fidj.InternalLog.log('openChildBrowser', 'track locationChanged=' + locationChanged);
            setTimeout(new_window_tracker, 100);
        };
        setTimeout(new_window_tracker, 100);

  }
  else {
        fidj.InternalLog.log('openChildBrowser', 'cordova : window.open');
        var target = '_blank';
        if (extension != 'url' && window.device.platform === "Android") target = '_system';
        var ref = window.open(url, target,'location=no' );//'_blank', 'location=yes');'_system','location=no'
        ref.addEventListener('loadstart', function(e){
          fidj.InternalLog.log('openChildBrowser', 'loadstart '+e.url);
        });
        ref.addEventListener('loadstop', function(e){
          fidj.InternalLog.log('openChildBrowser', 'loadstop '+e.url);
          if (typeof e.url == "string" && e.url.indexOf("about:blank") >= 0) {
              closeChildBrowserAfterLocationChange = true;
              if (onLocationChange) onLocationChange();
              ref.close();
          }
        });
        ref.addEventListener('loaderror', function(e){
          fidj.InternalLog.log('openChildBrowser', 'loaderror '+e.url);
        });
        ref.addEventListener('exit', function(e){
          fidj.InternalLog.log('openChildBrowser', 'exit '+e.url);
          if(!closeChildBrowserAfterLocationChange){
            if (onClose) onClose();
          }
        });
  }
}

function closeWindow()
{
   window.close();
}

function isArray(obj) {
    // do an instanceof check first
    if (obj instanceof Array) {
        return true;
    }
    // then check for obvious falses
    if (typeof obj !== 'object') {
        return false;
    }
    if (fidj.isUndefined(obj) || (obj === null)) {
        return false;
    }
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        return true;
    }
    return false;
}

function updateImage(source,img) {
  if (img && img != '/.')
    source.src = img;
  else
    source.src = "./img/broken.png";

  source.onerror = "";
  return true;
}

function ImgError(source, img){

    setTimeout(function() {updateImage(source,img);}, 10000);
    return false;
}

function getErrorObject(){
    try { throw Error(''); } catch(err) { return err; }
}

function fidjExportJson(input, maxDepth) {
    var str = '{\n', key, first = true, type;
    for (key in input) {
        if (!input.hasOwnProperty(key)) continue;
        if (key != 'Contact' && key != 'Attendee' && key != 'Account' &&
           key != 'Opportunity' && key != 'Event' && key != 'Document') continue;
        type = key;
        if (first) {
            first = false;
        } else {
            str += ',\n';
        }
        str +='\t' + '\"' + key + '\":[\n';

        if (typeof input[key] === "object") {
            if (maxDepth > 0) {
                str += fidjExportJsonObject('\t\t', input[key], maxDepth-1, type);
            }
        }
        str +='\t' + ']';
    }
    str +='\n}\n';

    return str;
}

function fidjExportJsonObject(offset, input, maxDepth, type) {
    var str = "", key, first = true;
    for (key in input) {
        if (!input.hasOwnProperty(key)) continue;
        if (first) {
            first = false;
        } else {
            str += ',\n';
        }
        if (typeof input[key] === "object") {
            if (maxDepth > 0) {
                if (maxDepth == 2) {
                    str += offset + '{\n';
                } else {
                    str += offset + '\"' +key+ '\":{';
                }
                str += fidjExportJsonObject(offset + '\t', input[key], maxDepth-1, type);

                if (maxDepth == 2) {
                    str += offset + '}';
                } else {
                    str += '}';
                }
            }
        } else {
            if (typeof input[key] == 'string') {
                input[key] = input[key].replace(/\r/ig, ' ').replace(/\n/ig, ' ');
            }
            if (maxDepth === 0) {
                str += '\"' +key + '\":\"' + input[key] + '\"';
            } else {
                str += offset + '\"' +key + '\":\"' + input[key] + '\"';
            }

        }
    }
    if(maxDepth == 1 && type == 'Document'){
      str += ',\n' + offset +'\"url\":\"img/samples/docs/' + input.name + '\"';
    }
    if(maxDepth !== 0){
      str +='\n';
    }

    return str;
}


var cache = window.applicationCache;
var cacheStatusValues = [];

function logEvent(e) {
    var online, status, type, message;
    var bCon = checkConnection();
    online = (bCon) ? 'yes' : 'no';
    status = cacheStatusValues[cache.status];
    type = e.type;
    message = 'CACHE online: ' + online;
    message+= ', event: ' + type;
    message+= ', status: ' + status;
    if (type == 'error' && bCon) {
        message+= ' (prolly a syntax error in manifest)';
    }
    fidj.InternalLog.log(message);
}

//window.applicationCache.addEventListener(
//    'updateready',
//    function(){
//        window.applicationCache.swapCache();
//        fidj.InternalLog.log('swap cache has been called');
//    },
//    false
//);

//setInterval(function(){cache.update()}, 10000);


function checkCache() {
// Check if new appcache is available, load it, and reload page.
//if (window.applicationCache) {
//  window.applicationCache.addEventListener('updateready', function(e) {
//    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
//      window.applicationCache.swapCache();
//      if (confirm('A new version of this site is available. Load it?')) {
//        window.location.reload();
//      }
//    }
//  }, false);
//}

	if(cache) {

		cacheStatusValues[0] = 'uncached';
		cacheStatusValues[1] = 'idle';
		cacheStatusValues[2] = 'checking';
		cacheStatusValues[3] = 'downloading';
		cacheStatusValues[4] = 'updateready';
		cacheStatusValues[5] = 'obsolete';

		cache.addEventListener('cached', logEvent, false);
		cache.addEventListener('checking', logEvent, false);
		cache.addEventListener('downloading', logEvent, false);
		cache.addEventListener('error', logEvent, false);
		cache.addEventListener('noupdate', logEvent, false);
		cache.addEventListener('obsolete', logEvent, false);
		cache.addEventListener('progress', logEvent, false);
		cache.addEventListener('updateready', logEvent, false);
	}

}

function checkConnection() {

    var bCon = false;
    fidj.InternalLog.log('checkConnection','launched');
    /*
        if (!navigator.onLine) used or not ?
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);


	if (navigator.network && navigator.network.connection && !navigator.network.connection.type) return false;

	if (!navigator.network || !navigator.network.connection){
		if (navigator.onLine) {
            fidj.InternalLog.log('checkConnection','without cordova but online');
			return true;
		}
        else {
            fidj.InternalLog.log('checkConnection','without cordova but online');
            return false;
        }
	}

    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    fidj.InternalLog.log('checkConnection','Connection type: ' + states[networkState]);
    bCon = (networkState != Connection.NONE);
    return bCon;
     */

     if (!navigator.connection || !navigator.connection.type){
        if (fidj.BrowserCapabilities && fidj.BrowserCapabilities.online) {
            bCon = true;
        }
        else if (!fidj.BrowserCapabilities) {
            bCon = navigator.onLine;
        }
        fidj.InternalLog.log('checkConnection','without Cordova but online ? '+bCon);
    }
    else {

        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        fidj.InternalLog.log('checkConnection','Cordova Connection type: ' + states[networkState]);
        bCon = (networkState != Connection.NONE);
    }
    return bCon;
}



function getUrlVars(ihref)
{
	var href = ihref;
	if(fidj.isUndefined(href) || !href) href = window.location.href;

    fidj.InternalLog.log('getUrlVars','href:'+href);

    var vars = [], hash;
    var hashes = href.slice(href.indexOf('#') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function SHA256(s){

    if (s.length === 0) return '';
	var chrsz   = 8;
	var hexcase = 0;

	function safe_add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	function R (X, n) { return ( X >>> n ); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

	function core_sha256 (m, l) {
        var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
        var HASH = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;

		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;

		for ( i = 0; i<m.length; i+=16 ) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];

			for ( j = 0; j<64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));

				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}

			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}

	function str2binb (str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	}

	function Utf8Encode(string) {
		if (string.length === 0) return string;


		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	}

	function binb2hex (binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	}

	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}

var fidjTranslateDatesToPxSize = function(date_start, date_end, totalSize) {
    var date1 = date_start;
    if (typeof date1 == 'string') date1 = fidjDateParse(date_start);
    if (!date1) return totalSize;// date_start is invalid

    var date2 = date_end;
    if (typeof date2 == 'string') date2 = fidjDateParse(date_end);
    if (!date2) return totalSize;// date_end is invalid

    var milliseconds = date2.getTime() - date1.getTime();
    if (milliseconds < 0) return totalSize; // date_end is before date_start

    var days = milliseconds / 1000 / 86400;
    // TODO : Calendar does not yet support events over many days => limit duration to 1 day.
    if (days > 1) days = 1;

    return Math.round(days * totalSize);
};

var fidjTranslateDateToPx = function(date, totalSize) {
    var date1 = date;
    if (typeof date1 == 'string') date1 = fidjDateParse(date);
    if (!date1) return 0;// date is invalid

    var days = (date1.getHours()*60 + date1.getMinutes()) / 1440;

    return Math.round(days * totalSize);
};

// Higher-order functions (functions that operate on functions)

/**
 * Create a new function that passes its arguments to f and returns the logical negation of f's return value.
 *
 * @param f
 * @returns {Function}
 */
fidj.not = function(f) {
    return function () {
        var result = f.apply(this, arguments);
        return !result;
    };
};

/**
 * Create a new function that expects an array argument and applies f to each element,
 * returning the array of return values.
 *
 * @param f
 * @returns {Function}
 */
// Contrast this with the map() function from earlier.
fidj.mapper = function(f) {
    return function(a) {
        return map(a, f);
    };
};

/**
 * Create a new function which cache its results based on its arguments string representations
 *
 * @param f idempotent function keyed on its arguments string representations
 * @returns {Function}
 */
fidj.memoize = function(f) {
    var cache = {}; // Value cache stored in the closure.
    return function () {
        // Create a string version of the arguments to use as a cache key.
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) return cache.key;
        else {
          cache.key = f.apply(this, arguments);
          return cache.key;
        }
    };
};

/*
// Note that when we write a recursive function that we will be memoizing,
// we typically want to recurse to the memoized version, not the original.
var factorial = fidj.memoize(function(n) {
    return (n <= 1) ? 1 : n * factorial(n-1);
});
factorial(5) // => 120. Also caches values for 4, 3, 2 and 1.
 */

// Helper functions

/**
 * Copy the enumerable properties of p to o, and return o.
 * If o and p have a property by the same name, o's property is overwritten.
 * This function does not handle getters and setters or copy attributes.
 * Return o.
 *
 * @param o
 * @param p
 * @returns {*}
 */
fidj.extend = function(o, p) {
    for (var prop in p) { // For all props in p.
        o[prop] = p[prop]; // Add the property to o.
    }
    return o;
};

/**
 * Copy the enumerable properties of p to o, and return o.
 * If o and p have a property by the same name, o's property is left alone.
 * This function does not handle getters and setters or copy attributes.
 * Return o.
 *
 * @param o
 * @param p
 * @returns {*}
 */
fidj.merge = function(o, p) {
    for (var prop in p) { // For all props in p.
        if (o.hasOwnProperty(prop)) continue; // Except those already in o.
        o[prop] = p[prop]; // Add the property to o.
    }
    return o;
};

/**
 * Remove properties from o if there is not a property with the same name in p.
 * Return o.
 *
 * @param o
 * @param p
 * @returns {*}
 */
fidj.restrict = function(o, p) {
    for (var prop in o) { // For all props in o
        if (!(prop in p)) delete o[prop]; // Delete if not in p
    }
    return o;
};

/**
 * For each property of p, delete the property with the same name from o.
 * Return o.
 *
 * @param o
 * @param p
 * @returns {*}
 */
fidj.subtract = function(o, p) {
    for (var prop in p) { // For all props in p
        delete o[prop]; // Delete from o (deleting a nonexistent prop is harmless)
    }
    return o;
};

/**
 * Return a new object that holds the properties of both o and p.
 * If o and p have properties by the same name, the values from o are used.
 * Return new object.
 *
 * @param o
 * @param p
 * @returns {*}
 */
fidj.union = function(o, p) {
    return fidj.extend(fidj.extend({}, o), p);
};

/**
 * Return a new object that holds only the properties of o that also appear in p.
 * This is something like the intersection of o and p, but the values of the properties in p are discarded.
 *
 * @param o
 * @param p
 * @returns {*}
 */
fidj.intersection = function(o, p) {
    return fidj.restrict(fidj.extend({}, o), p);
};

/**
 * Return an array that holds the names of the enumerable own properties of o.
 *
 * @param o
 * @returns {Array}
 */
fidj.keys = function(o) {
    if (typeof o !== "object") throw new TypeError();
    var result = [];
    for (var prop in o) {
        if (o.hasOwnProperty(prop)) {
            result.push(prop);
        }
    }
    return result;
};

/**
 * Create a new object that inherits properties from the prototype object p.
 * It uses the ECMAScript 5 function Object.create() if it is defined,
 * and otherwise falls back to an older technique.
 *
 * @param proto
 * @param props
 * @returns {*}
 */
fidj.create = function(proto, props) {
    if (proto === null) throw new TypeError();
    if (Object.create) {
        return Object.create(proto, props);
    }
    var t = typeof proto;
    if (t !== "object" && t !== "function") throw new TypeError();
    function F() {} // dummy constructor function.
    F.prototype = proto;
    var o = new F();
    return fidj.extend(o, props);
};

/**
 * Determine if a number is even
 *
 * @param x
 * @returns {boolean}
 */
fidj.even = function(x) {
    return x % 2 === 0;
};

/**
 * Determine if a number is odd
 *
 * @param x
 * @returns {boolean}
 */
fidj.odd = fidj.not(fidj.even);

/**
 * Loop via Array.forEach method.
 * If the function passed to foreach() throws fidj.foreach.break, the loop will terminate early.
 *
 * @param a array object
 * @param f callback function as first argument in Array.forEach()
 * @param t thisObject as second argument in Array.forEach()
 * @returns {boolean}
 */
fidj.foreach = function(a, f, t) {
    try {
        a.forEach(f, t);
    } catch (e) {
        if (e === fidj.foreach.break) return;
        throw e;
    }
};
fidj.foreach.break = new Error("StopIteration");
'use strict';


function fidjDumpData(input, maxDepth) {
    var str = "";
    if (typeof input === "object") {
        if (input instanceof Array) {
            if (maxDepth > 0) {
                str += "[\n";
                str += fidjDumpArray("  ", input, maxDepth-1);
                str += "]\n";
            } else {
                str += "[Array]\n";
            }
        } else {
            if (maxDepth > 0) {
                str += "{\n";
                str += fidjDumpObject("  ", input, maxDepth-1);
                str += "}\n";
            } else {
                str += "[" + typeof(input) + "]\n";
            }
        }
    } else {
        str += input + "\n";
    }
    return str;
}

function fidjDumpArray(offset, input, maxDepth) {
    var str = "";
    for (var key = 0,nb = input.length; key<nb; key++) {
        if (typeof input[key] === "object") {
            if (input[key] instanceof Array) {
                if (maxDepth > 0) {
                    str += offset + key + " : [\n";
                    str += fidjDumpArray(offset + "  ", input[key], maxDepth-1);
                    str += offset + "]\n";
                } else {
                    str += offset + key + " : [Array]\n";
                }
            } else {
                if (maxDepth > 0) {
                    str += offset + key + " : {\n";
                    str += fidjDumpObject(offset + "  ", input[key], maxDepth-1);
                    str += offset + "}\n";
                } else {
                    str += offset + key + " : [" + typeof(input[key]) + "]\n";
                }
            }
        } else {
            str += offset + key + " : " + input[key] + "\n";
        }
    }
    return str;
}

function fidjDumpObject(offset, input, maxDepth) {
    var str = "", key;
    for (key in input) {
        if (!input.hasOwnProperty(key)) continue;
        if (typeof input[key] === "object") {
            if (input[key] instanceof Array) {
                if (maxDepth > 0) {
                    str += offset + key + " : [\n";
                    str += fidjDumpArray(offset + "  ", input[key], maxDepth-1);
                    str += offset + "]\n";
                } else {
                    str += offset + key + " : [Array]\n";
                }
            } else {
                if (maxDepth > 0) {
                    str += offset + key + " : {\n";
                    str += fidjDumpObject(offset + "  ", input[key], maxDepth-1);
                    str += offset + "}\n";
                } else {
                    str += offset + key + " : [" + typeof(input[key]) + "]\n";
                }
            }
        } else {
            str += offset + key + " : " + input[key] + "\n";
        }
    }
    return str;
}

/**
 * Return a string format "yyyy-MM-dd HH:mm:ss" from a Number which is the result of any Date.getTime (timestamp in ms).
 * @param {Number} timestamp in ms since 1/1/1970
 * @returns {string} result
 */
function fidjTimestampFormat(timestamp) {
    var date = new Date(timestamp);
    return fidjPadNumber(date.getFullYear(), 4) + '-' +
        fidjPadNumber(date.getMonth() + 1, 2) + '-' +
        fidjPadNumber(date.getDate(), 2) + ' ' +
        fidjPadNumber(date.getHours(), 2) + ':' +
        fidjPadNumber(date.getMinutes(), 2) + ':' +
        fidjPadNumber(date.getSeconds(), 2);
}

/**
 * Return a string format "yyyy-MM-dd HH:mm:ss" from a Date object.
 * @param {Date} date to format
 * @returns {string} result
 */
function fidjDateFormat(date) {
    if (!date) return '';
    return fidjPadNumber(date.getFullYear(), 4) + '-' +
        fidjPadNumber(date.getMonth() + 1, 2) + '-' +
        fidjPadNumber(date.getDate(), 2) + ' ' +
        fidjPadNumber(date.getHours(), 2) + ':' +
        fidjPadNumber(date.getMinutes(), 2) + ':' +
        fidjPadNumber(date.getSeconds(), 2);
}

/**
 * Return a string format "yyMMdd_HHmmss" from a Date object.
 * @param {Date} date to format
 * @returns {string} result
 */
function fidjDateCompactFormat(date) {
    if (!date) return '';
    return fidjPadNumber(date.getFullYear(), 2) +
        fidjPadNumber(date.getMonth() + 1, 2) +
        fidjPadNumber(date.getDate(), 2) + '_' +
        fidjPadNumber(date.getHours(), 2) +
        fidjPadNumber(date.getMinutes(), 2) +
        fidjPadNumber(date.getSeconds(), 2);
}

/**
 * Parse a date string to create a Date object
 * @param {string} date string at format "yyyy-MM-dd HH:mm:ss"
 * @returns {Number} Number resulting from Date.getTime or 0 if invalid date
 */
function fidjTimestampParse(date) {
    var newDate = fidjDateParse(date);
    return (newDate !== false) ? newDate.getTime() : 0;
}

/**
 * Parse a date string to create a Date object
 * @param {string} date string at format "yyyy-MM-dd HH:mm:ss"
 * @returns {Date} Date object or false if invalid date
 */
function fidjDateParse(date) {
    if (!date || typeof date != 'string' || date == '') return false;
    // Date (choose 0 in date to force an error if parseInt fails)
    var yearS = parseInt(date.substr(0,4), 10) || 0;
    var monthS = parseInt(date.substr(5,2), 10) || 0;
    var dayS = parseInt(date.substr(8,2), 10) || 0;
    var hourS = parseInt(date.substr(11,2), 10) || 0;
    var minuteS = parseInt(date.substr(14,2),10) || 0;
    var secS = parseInt(date.substr(17,2),10) || 0;
    /*
    BEWARE : here are the ONLY formats supported by all browsers in creating a Date object
    var d = new Date(2011, 01, 07); // yyyy, mm-1, dd
    var d = new Date(2011, 01, 07, 11, 05, 00); // yyyy, mm-1, dd, hh, mm, ss
    var d = new Date("02/07/2011"); // "mm/dd/yyyy"
    var d = new Date("02/07/2011 11:05:00"); // "mm/dd/yyyy hh:mm:ss"
    var d = new Date(1297076700000); // milliseconds
    var d = new Date("Mon Feb 07 2011 11:05:00 GMT"); // ""Day Mon dd yyyy hh:mm:ss GMT/UTC
     */

    var newDate = new Date(yearS, monthS-1, dayS, hourS, minuteS, secS, 0);
    if ((newDate.getFullYear() !== yearS) || (newDate.getMonth() !== (monthS-1)) || (newDate.getDate() !== dayS)) {
        // Invalid date
        return false;
    }
    return newDate;
}

// @input date or string
// @return String formatted as date
function fidjDateFormatObject(object) {

    var yearS = '1970';
    var monthS = '01';
    var dayS = '01';
    var hourS = "00";
    var minuteS = "00";
    var secondS = "00";
   
    if ( Object.prototype.toString.call(object) === "[object Date]" ) {
      // it is a date
      if ( isNaN(object.getTime() ) ) {  // d.valueOf() could also work
        // date is not valid
      }
      else {
        // date is valid
        yearS = ''+object.getFullYear();
        monthS = ''+(object.getMonth()+1);
        dayS = ''+object.getDate();
        hourS = ''+object.getHours();
        minuteS = ''+object.getMinutes();
        secondS = ''+object.getSeconds();
      }
    }
    else if (typeof object == "string") {
        // string
        var dateReg = new RegExp("([0-9][0-9][0-9][0-9])-([0-9]\\d)-([0-9]\\d)+", "g");
        var dateParts = object.split(dateReg);
        yearS = dateParts[1] || '0';
        monthS = dateParts[2] || '0';
        dayS = dateParts[3] || '0';

        var timeReg = new RegExp("([01]\\d|2[0-9]):([0-5]\\d):([0-5]\\d)");
        var timeParts = object.match(timeReg);
        if (timeParts != null) {
            hourS = timeParts[1] || '00';
            minuteS = timeParts[2] || '00';
            secondS = timeParts[3] || '00';
        } else {
            hourS = '00';
            minuteS = '00';
            secondS = '00';
        }
    }
    // 4-2-2 2:2  
    while (yearS.length < 4) yearS = '0' + yearS;
    while (monthS.length < 2) monthS = '0' + monthS;
    while (dayS.length < 2) dayS = '0' + dayS;
    while (hourS.length < 2) hourS = '0' + hourS;
    while (minuteS.length < 2) minuteS = '0' + minuteS;
    while (secondS.length < 2) secondS = '0' + secondS;

    var newDate = yearS + '-' + monthS + '-' + dayS + ' ' + hourS + ':' + minuteS + ':'+secondS;
    return newDate;
}


function fidjDateExtractDate(dateString) {

    var dateReg = new RegExp("([0-9][0-9][0-9][0-9])-([0-9]\\d)-([0-9]\\d)+", "g");
    var dateParts = dateString.split(dateReg);
    var yearS = dateParts[1] || '0';
    var monthS = dateParts[2] || '0';
    var dayS = dateParts[3] || '0';
    while (yearS.length < 4) yearS = '0' + yearS;
    while (monthS.length < 2) monthS = '0' + monthS;
    while (dayS.length < 2) dayS = '0' + dayS;
    return ''+ yearS + '-' + monthS + '-' + dayS;
}

function fidjDateExtractTime(dateString) {
    var timeReg = new RegExp("([01]\\d|2[0-9]):([0-5]\\d):([0-5]\\d)");
    var timeParts = dateString.match(timeReg);
    var hourS = "00";
    var minuteS = "00";
    var secondS = "00";
    if (timeParts != null) {
        hourS = timeParts[1] || '00';
        minuteS = timeParts[2] || '00';
        secondS = timeParts[3] || '00';
    } else {
        hourS = '00';
        minuteS = '00';
        secondS = '00';
    }
    while (hourS.length < 2) hourS = '0' + hourS;
    while (minuteS.length < 2) minuteS = '0' + minuteS;
    while (secondS.length < 2) secondS = '0' + secondS;

    return '' + hourS + ':' + minuteS + ':'+secondS;
}


function fidjPadNumber(num, digits, trim) {
    var neg = '';
    if (num < 0) {
        neg = '-';
        num = -num;
    }
    num = '' + num;
    while (num.length < digits) {
        num = '0' + num;
    }
    if (trim && (num.length > digits)) {
        num = num.substr(num.length - digits);
    }
    return neg + num;
}

fidj.formatError = function(arg) {
    if (arg instanceof Error) {
        if (arg.stack) {
            arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                ? 'Error: ' + arg.message + '\n' + arg.stack
                : arg.stack;
        } else if (arg.sourceURL) {
            arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
    }
    return arg;
};

fidj.Log = (function () {

    function Log(nbMax) {
        this.nbMax = nbMax || 1000;
        if (this.nbMax < 1) this.nbMax = 1;
        this.logEntries = [];
        this.callbackHandle = 0;
        this.callbacks = [];
    }

    Log.prototype.getLog = function () {
        return this.logEntries;
    };

    Log.prototype.clearLog = function () {
        this.logEntries = [];
    };

    Log.prototype.setNbMax = function (nbMax) {
        this.nbMax = nbMax || 1000;
        if (this.nbMax < 1) this.nbMax = 1;
        if (this.logEntries.length > this.nbMax) {
            this.logEntries.splice(0, (this.logEntries.length - this.nbMax));
        }
    };

    Log.prototype.log = function (msg, details, traceStackOffset) {
    	
    	//REMOVE_IN_PROD return {'date':'','msg':msg,'details':details};
    	    	
        details = details || '';
        var now = new Date();
        now = fidjDateFormat(now) + '.' + now.getMilliseconds();
        // TODO : get the file and line of caller
        //var nb = (new Error).lineNumber;
        var from = '';
       	var stack;
        /*
        try {
            throw Error('');
        } catch(e) {
            stack = e.stack;
        }
        */
        traceStackOffset = traceStackOffset || 0;
        stack = (new Error).stack;
       	if (stack) {
            var caller_stack = stack.split("\n");
            var caller_line = caller_stack[2+traceStackOffset];
       		if (caller_line) {
       			var index = caller_line.indexOf("at ") + 3;
                from = ' at ' + caller_line.substr(index);
       		}
       	}
        if (details) {
            //MLE //TODO prod ? var ? console.log(now + from + ' : ' + msg + " : " + details);
        } else {
            //MLE console.log(now + from + ' : ' + msg);
        }
        var logEntry = {
            'date':now,
            'msg':msg,
            'details':details
        };
        if (this.logEntries.length >= this.nbMax) {
            this.logEntries.splice(0, 1);
        }
        this.logEntries.push(logEntry);

        for (var idx = 0, nb = this.callbacks.length; idx < nb; idx++) {
            try {
                this.callbacks[idx].callback(this.callbacks[idx].id, logEntry);
            } catch (e) {
                //console.log("Error on callback#" + idx
                //    + " called from Log for the logEntry " + fidjDumpData(logEntry, 1)
                //    + " : " + fidj.formatError(e));
            }
        }
        return logEntry;
    };

    Log.prototype.addListener = function (fct) {
        this.callbackHandle++;
        this.callbacks.push({id:this.callbackHandle, callback:fct});
        return this.callbackHandle;
    };

    Log.prototype.cancelListener = function (callbackHandle) {
        for (var idx = this.callbacks.length - 1; idx >= 0; idx--) {
            if (this.callbacks[idx].id == callbackHandle) {
                this.callbacks.splice(idx, 1);
                return true;
            }
        }
        return false;
    };

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return Log;
})(); // Invoke the function immediately to create this class.

fidj.ErrorLog = new fidj.Log(1000);
fidj.InternalLog = new fidj.Log(1000);


/*
Pour recopier un fichier externe au navigateur dans le localStorage ou le fileStorage, il faut passer par <input type="file"/>
Exemple :

<!--<input id="file" type="file" multiple />-->
<!-- multiple does not work on Android -->
<input id="file" type="file" />
<div id="prev"></div>

<script>
var fileInput = document.querySelector('#file');
var prev = document.querySelector('#prev');

fileInput.onchange = function() {

    var files = this.files;
    var filesLen = files.length;
    var allowedTypes = ['png', 'jpg', 'jpeg', 'gif']

    for (var i = 0 ; i < filesLen ; i++) {
        var reader = new FileReader();
        // Lecture du contenu de fichier
        reader.onload = function() {
            alert('Contenu du fichier "' + fileInput.files[i].name + '" :\n\n' + reader.result);
        };
        reader.readAsText(files[i]);

        // Previsualisation de fichier image
        var fileNames = files[i].name.split('.');
        var fileExt = fileNames[fileNames.length - 1];
        if (allowedTypes.indexOf(fileExt) != -1) {
            var reader = new FileReader();
            reader.onload = function() {
                var imgElement = document.createElement('img');
                imgElement.style.maxWidth = '150px';
                imgElement.style.maxHeight = '150px';
                imgElement.src = this.result;
                prev.appendChild(imgElement);
            };
            reader.readAsDataURL(files[i]);
        }
    }
};
</script>

 */

// Create a new module
/*angular.module("fidj", [
    "fidj.all",
    "fidj.file",
    "fidj.analytics",
    "fidj.storage",
    "fidj.stringFormat",
    "fidj.base64",
    "fidj.json",
    "fidj.xml",
    "fidj.fileDownloader",
    "fidj.fileUploader",
    "fidj.taskReceiver",
    "fidj.taskSender",
    "fidj.sense"
]);*/

// Create a new module
//var fidjStorageModule = angular.module('fidj.storage', ['fidj.xml', 'fidj.json']);

/**
 * localStorage service provides an interface to manage in memory data repository.
 * @param {object} storageService The object window.localStorage or an equivalent object which implements it.
 */
/*fidjStorageModule.factory('localStorage', ['fidjXml', 'fidjJson', function(fidjXml, fidjJson) {
    var LocalStorage = function(storageService) {
        storageService = storageService || window.localStorage;
    };
    return LocalStorage;
}]);*/


/**
 * Memory storage (used mainly for tests).
 * Usage : fidj.LocalStorageFactory(new fidj.MemoryStorage());
 */
fidj.MemoryStorage = (function () {
"use strict";

    function Storage() {
        this.keyes = [];
        this.set = {};
        this.length = 0;
    }
    Storage.prototype.clear = function () {
        this.keyes = [];
        this.set = {};
        this.length = 0;
    };
    Storage.prototype.key = function (idx) {
        return this.keyes[idx];
    };
    Storage.prototype.getItem = function (key) {
        if (fidj.isUndefined(this.set[key])) return null;
        return this.set[key];
    };
    Storage.prototype.setItem = function (key, value) {
        this.set[key] = value;
        for (var i = 0; i < this.keyes.length; i++) {
            if (this.keyes[i] == key) return;
        }
        this.keyes.push(key);
        this.length = this.keyes.length;
    };
    Storage.prototype.removeItem = function (key) {
        delete this.set[key];
        for (var i = 0; i < this.keyes.length; i++) {
            if (this.keyes[i] == key) {
                this.keyes.splice(i, 1);
                this.length = this.keyes.length;
            }
        }
    };
    return Storage;
})();

/**
 * localStorage class factory
 * Usage : var LocalStorage = fidj.LocalStorageFactory(window.localStorage); // to create a new class
 * Usage : var localStorageService = new LocalStorage(); // to create a new instance
 */
fidj.LocalStorageFactory = function (storageService, storageKey) {
"use strict";

    var storage = storageService || window.localStorage;
    if (!storage) {
        throw new Error("fidj.LocalStorageFactory needs a storageService!");
    }

    // Constructor
    function LocalStorage() {
        this.version = "0.1";
        if (!fidj.Xml) {
            throw new Error("fidj.Xml needs to be loaded before fidj.LocalStorage!");
        }
        if (!fidj.Json) {
            throw new Error("fidj.Json needs to be loaded before fidj.LocalStorage!");
        }
        if (!fidj.Xml.isXml || !fidj.Xml.xml2String || !fidj.Xml.string2Xml) {
            throw new Error("fidj.Xml with isXml(), xml2String() and string2Xml() needs to be loaded before fidj.LocalStorage!");
        }
        if (!fidj.Json.object2String || !fidj.Json.string2Object) {
            throw new Error("fidj.Json with object2String() and string2Object() needs to be loaded before fidj.LocalStorage!");
        }
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
    LocalStorage.prototype.set = function (key, value) {

        key = storageKey + key;
        checkKey(key);
        // clone the object before saving to storage
        var t = typeof(value);
        if (t == "undefined")
            value = 'null';
        else if (value === null)
            value = 'null';
        else if (fidj.Xml.isXml(value))
            value = fidj.Json.object2String({xml:fidj.Xml.xml2String(value)});
        else if (t == "string")
            value = fidj.Json.object2String({string:value});
        else if (t == "number")
            value = fidj.Json.object2String({number:value});
        else if (t == "boolean")
            value = fidj.Json.object2String({ bool : value });
        else if (t == "object")
            value = fidj.Json.object2String( { json : value } );
        else {
            // reject and do not insert
            // if (typeof value == "function") for example
            throw new TypeError('Value type ' + t + ' is invalid. It must be null, undefined, xml, string, number, boolean or object');
        }
        storage.setItem(key, value);
        return value;
    };

    /**
     * Looks up a key in cache
     *
     * @param {String} key - Key to look up.
     * @param {mixed} def - Default value to return, if key didn't exist.
     * @returns the key value, default value or <null>
     */
    LocalStorage.prototype.get = function (key, def) {
        key = storageKey + key;
        checkKey(key);
        var item = storage.getItem(key);
        if (item !== null) {
            if (item == 'null') {
                return null;
            }
            var value = fidj.Json.string2Object(item);
            if ('xml' in value) {
                return fidj.Xml.string2Xml(value.xml);
            } else if ('string' in value) {
                return value.string;
            } else if ('number' in value) {
                return value.number.valueOf();
            } else if ('bool' in value) {
                return value.bool.valueOf();
            } else {
                return value.json;
            }
        }
        return fidj.isUndefined(def) ? null : def;
    };

    /**
     * Deletes a key from cache.
     *
     * @param {String} key - Key to delete.
     * @returns true if key existed or false if it didn't
     */
    LocalStorage.prototype.remove = function (key) {
        key = storageKey + key;
        checkKey(key);
        var existed = (storage.getItem(key) !== null);
        storage.removeItem(key);
        return existed;
    };

    /**
     * Deletes everything in cache.
     *
     * @return true
     */
    LocalStorage.prototype.clear = function () {
        var existed = (storage.length > 0);
        storage.clear();
        return existed;
    };

    /**
     * How much space in bytes does the storage take?
     *
     * @returns Number
     */
    LocalStorage.prototype.size = function () {
        return storage.length;
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
    LocalStorage.prototype.foreach = function (f, context) {
        var n = storage.length;
        for (var i = 0; i < n; i++) {
            var key = storage.key(i);
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

    function checkKey(key) {
        if (!key || (typeof key != "string")) {
            throw new TypeError('Key type must be string');
        }
        return true;
    }

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return LocalStorage;
};

fidj.FileStorage = (function () {
    "use strict";

    // Constructor
    function FileStorage($q, $rootScope) {
        this.version = "0.1";
        this.q = $q;
        this.rootScope = $rootScope;
        this.grantedBytes = 0;
        this.fs = null;
        this.urlPrefix = '';
        this.storageType = null;

        this.initDone = false;
        this.initPromises = [];
        this.initTimer = null;
    }

    // Public API

    function initEnd(self) {
        fidj.safeApply(self.rootScope, function() {
            for (var i= 0; i < self.initPromises.length; i++) {
                self.initTrigger(self.initPromises[i]);
            }
            self.initDone = true;
            self.initPromises = [];
            self.initTimer = null;
        });
    }

    function launchEnd(self) {
        if (self.initTimer === null) {
            self.initTimer = setTimeout(function() { initEnd(self); }, 100);
        }
    }

    function tryQuota(self, grantBytes) {
        try {
            var fctOnSuccess = function (fs) {
                //fidj.InternalLog.log('fidj.FileStorage', 'opened file system ' + fs.name);
                self.fs = fs;
                self.urlPrefix = '';
                var pattern = /^(https?)_([^_]+)_(\d+):Persistent$/;
                if (pattern.test(fs.name)) {
                    var name = fs.name;
                    name = name.replace(pattern, "$1://$2:$3");// remove ':Persistent' and '_'
                    name = name.replace(/^(.*):0$/, "$1");// remove ':0'
                    // Specific to Chrome where window.webkitResolveLocalFileSystemURI does not exist
                    // get URL from URI by prefixing fullPath with urlPrefix
                    self.urlPrefix = 'filesystem:' + name + '/persistent';
                }
                //fidj.InternalLog.log('fidj.FileStorage', 'urlPrefix = ' + self.urlPrefix);
                self.initTrigger = function(deferred) { deferred.resolve(); };
                launchEnd(self);
            };
            var fctOnFailure = function (fileError) {
                if (fileError.code == FileError.QUOTA_EXCEEDED_ERR) {
                    setTimeout(function() { tryQuota(self, grantBytes/2); }, 100);
                } else {
                    var message = "requestFileSystem failure : " + errorMessage(fileError);
                    self.initTrigger = function(deferred) { deferred.reject(message); };
                    launchEnd(self);
                }
            };
            var requestFs = function(grantedBytes) {
                try {
                    if (fidj.isDefined(window.requestFileSystem)) {
                        window.requestFileSystem(self.storageType, grantedBytes, fctOnSuccess, fctOnFailure);
                    } else {
                        window.webkitRequestFileSystem(self.storageType, grantedBytes, fctOnSuccess, fctOnFailure);
                    }
                } catch (e) {
                    var message = e.message;
                    self.initTrigger = function(deferred) { deferred.reject(message); };
                    launchEnd(self);
                }
            };

            if (fidj.isDefined(window.webkitPersistentStorage)) {
                // In Chrome 27+
                if (fidj.isDefined(window.webkitPersistentStorage.requestQuota)) {
                    window.webkitPersistentStorage.requestQuota(grantBytes, function (grantedBytes) {
                        self.grantedBytes = grantedBytes;
                        requestFs(grantedBytes);
                    }, function (fileError) {
                        if (fileError.code == FileError.QUOTA_EXCEEDED_ERR) {
                            setTimeout(function() { tryQuota(self, grantBytes/2); }, 100);
                        } else {
                            var message = "requestQuota failure : " + errorMessage(fileError);
                            self.initTrigger = function(deferred) { deferred.reject(message); };
                            launchEnd(self);
                        }
                    });
                } else {
                    requestFs(grantBytes);
                }
            } else if (fidj.isDefined(navigator.webkitPersistentStorage)){//MLE deprecated ? (fidj.isDefined(window.webkitStorageInfo)) {
                // In Chrome 13
                if (fidj.isDefined(navigator.webkitPersistentStorage.requestQuota)) {
                    navigator.webkitPersistentStorage.requestQuota(self.storageType, grantBytes, function (grantedBytes) {
                        self.grantedBytes = grantedBytes;
                        requestFs(grantedBytes);
                    }, function (fileError) {
                        if (fileError.code == FileError.QUOTA_EXCEEDED_ERR) {
                            setTimeout(function() { tryQuota(self, grantBytes/2); }, 100);
                        } else {
                            var message = "requestQuota failure : " + errorMessage(fileError);
                            self.initTrigger = function(deferred) { deferred.reject(message); };
                            launchEnd(self);
                        }
                    });
                } else {
                    requestFs(grantBytes);
                }
            } else {
                requestFs(grantBytes);
            }
        } catch (e) {
            var message = e.message;
            self.initTrigger = function(deferred) { deferred.reject(message); };
            launchEnd(self);
        }
    }

    FileStorage.prototype.init = function () {
        var deferred = this.q.defer();
        this.initPromises.push(deferred);
        var message;
        if (this.initDone) {
            // Init already finished
            launchEnd(this);
        } else if (this.initPromises.length == 1) {
            // Init not yet started
            this.initPromises.push(deferred);
            if (fidj.isUndefinedOrNull(LocalFileSystem)) {
                this.storageType = window.PERSISTENT;
            } else {
                this.storageType = LocalFileSystem.PERSISTENT;
            }
            if (!window.File || !window.FileReader || !window.Blob) {
                message = "window.File, window.FileReader and window.Blob need to be loaded before fidj.FileStorage!";
                this.initTrigger = function(deferred) { deferred.reject(message); };
                launchEnd(this);
            } else if (fidj.isUndefined(window.requestFileSystem) && fidj.isUndefined(window.webkitRequestFileSystem)) {
                message = "window.requestFileSystem() or window.webkitRequestFileSystem() required by fidj.FileStorage!";
                this.initTrigger = function(deferred) { deferred.reject(message); };
                launchEnd(this);
            } else if (fidj.isUndefined(window.resolveLocalFileSystemURL) &&
                fidj.isUndefined(window.webkitResolveLocalFileSystemURL) &&
                fidj.isUndefined(window.resolveLocalFileSystemURI) &&
                fidj.isUndefined(window.webkitResolveLocalFileSystemURI)) {
                message = "window.resolveLocalFileSystemURI or equivalent required by fidj.FileStorage!";
                this.initTrigger = function(deferred) { deferred.reject(message); };
                launchEnd(this);
            } else {
                var grantBytes = 4 * 1024 * 1024 * 1024;
                var self = this;
                setTimeout(function() { tryQuota(self, grantBytes); }, 100);
            }
        } else {
            // Init already started but not yet finished
        }
        return deferred.promise;
    };

    /**
     * Get granted space.
     *
     * @param {Int} storageType - LocalFileSystem.TEMPORARY or LocalFileSystem.PERSISTENT or window.TEMPORARY or window.PERSISTENT value.
     * @param {Function} onSuccess - Callback function with long long argument giving grantedQuotaInBytes or 0 if not available.
     * @returns true.
     */
    /* getGrantedBytes() and getUsedBytes() are not yet ready
     FileStorage.getGrantedBytes = function (storageType, onSuccess) {
     // In Chrome 13
            if ((fidj.isUndefinedOrNull(storageType)) {
                if (fidj.isUndefinedOrNull(LocalFileSystem)) {
                    storageType = window.PERSISTENT;
                } else {
                    storageType = LocalFileSystem.PERSISTENT;
                }
            }
     if (fidj.isUndefined(navigator.webkitPersistentStorage)) {
     if (fidj.isUndefined(navigator.webkitPersistentStorage.queryUsageAndQuota)) {
     navigator.webkitPersistentStorage.queryUsageAndQuota(storageType,
     function (currentUsageInBytes) {
     },
     function (grantedQuotaInBytes) {
     onSuccess(grantedQuotaInBytes);
     });
     return true;
     }
     }
     onSuccess(0);
     return true;
     };
     */

    /**
     * Get used space.
     *
     * @param {Int} storageType - LocalFileSystem.TEMPORARY or LocalFileSystem.PERSISTENT or window.TEMPORARY or window.PERSISTENT value.
     * @param {Function} onSuccess - Callback function with long long argument giving currentUsageInBytes or 0 if not available.
     * @returns true.
     */
    /* getGrantedBytes() and getUsedBytes() are not yet ready
     FileStorage.getUsedBytes = function (storageType, onSuccess) {
     // In Chrome 13
            if (fidj.isUndefinedOrNull(storageType)) {
                if (fidj.isUndefinedOrNull(LocalFileSystem)) {
                    storageType = window.PERSISTENT;
                } else {
                    storageType = LocalFileSystem.PERSISTENT;
                }
            }
     if (fidj.isDefined(navigator.webkitPersistentStorage)) {
     if (fidj.isDefined(navigator.webkitPersistentStorage.queryUsageAndQuota)) {
     navigator.webkitPersistentStorage.queryUsageAndQuota(storageType,
     function (currentUsageInBytes) {
     onSuccess(currentUsageInBytes);
     },
     function (grantedQuotaInBytes) {
     });
     return true;
     }
     }
     onSuccess(0);
     return true;
     };
     */


    /**
     * get FileSystem ... usefull ? prefer using inside
     */
    FileStorage.prototype.getFS = function () {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        return this.fs;
    };

    /**
     * Create a directory in root directory.
     *
     * @param {String} dirPath - Directory path (relative or absolute). All directories in path will be created.
     * @param {Function} onSuccess - Called with dirEntry argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.createDir = function (dirPath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var self = this;
        var names = dirPath.split('/');
        var max = names.length;
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:true, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs,
            function (dirEntry) {
                if (onSuccess) {
                    onSuccess(dirEntry);
                }
            }, onFailure);

    };

    /**
     * Get a directory in root directory.
     * Will get nothing if directory does not already exist.
     *
     * @param {String} dirPath - Directory path (relative or absolute). Its direct parent directory must already exist.
     * @param {Function} onSuccess - Called with dirEntry argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getDir = function (dirPath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var names = dirPath.split('/');
        var max = names.length;
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:false, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs, onSuccess, onFailure);
    };

    /**
     * Read the content of a directory.
     * Will get nothing if directory does not already exist.
     *
     * @param {String} dirPath - Directory path (relative or absolute). Its parent directories must already exist.
     * @param {Function} onSuccess - Called with dirNames and fileNames sorted Array arguments if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.readDirectory = function (dirPath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var names = dirPath.split('/');
        var max = names.length;
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:false, exclusive:false};
        var dirContentReader = function (dirEntry) {
            var dirReader = dirEntry.createReader();
            var fileEntries = [];
            var dirEntries = [];
            // There is no guarantee that all entries are read in ony one call to readEntries()
            // call readEntries() until no more results are returned
            var readEntries = function () {
                dirReader.readEntries(function (results) {
                    if (!results.length) {
                        // All entries have been read
                        if (onSuccess) {
                            dirEntries.sort();
                            fileEntries.sort();
                            onSuccess(dirEntries, fileEntries);
                        }
                    } else {
                        // New entries to add
                        var max = results.length;
                        for (var i = 0; i < max; i++) {
                            if (results[i].isFile) {
                                //fileEntries.push(results[i].fullPath);
                                fileEntries.push(results[i].name);
                            } else {
                                //dirEntries.push(results[i].fullPath);
                                dirEntries.push(results[i].name);
                            }
                        }
                        readEntries();
                    }
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("readEntries from " + dirEntry.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            };
            // Start to read entries
            readEntries();
        };
        getDirEntry(this.fs.root, dirOptions, dirs, dirContentReader, onFailure);
    };

    /**
     * Read the content of a directory and all its subdirectories.
     * Will get nothing if directory does not already exist.
     *
     * @param {String} dirPath - Directory path (relative or absolute). Its parent directories must already exist.
     * @param {Function} onSuccess - Called with fileFullPaths sorted Array argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.readFullDirectory = function (dirPath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var names = dirPath.split('/');
        var max = names.length;
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:false, exclusive:false};
        var dirEntries = [];
        var fileEntries = [];
        var dirContentReader = function (dirEntry) {
            //fidj.InternalLog.log('fidj.FileStorage', 'Reading dir ' + dirEntry.fullPath);
            var dirReader = dirEntry.createReader();
            // There is no guarantee that all entries are read in ony one call to readEntries()
            // call readEntries() until no more results are returned
            var readEntries = function () {
                dirReader.readEntries(function (results) {
                    if (!results.length) {
                        // All entries of this dirEntry have been read
                        if (dirEntries.length <= 0) {
                            // All entries of all dirEntries have been read
                            if (onSuccess) {
                                fileEntries.sort();
                                onSuccess(fileEntries);
                            }
                        } else {
                            dirContentReader(dirEntries.shift());
                        }
                    } else {
                        // New entries to add
                        var max = results.length;
                        for (var i = 0; i < max; i++) {
                            if (results[i].isFile) {
                                fileEntries.push(results[i].fullPath);
                            } else {
                                dirEntries.push(results[i]);
                            }
                        }
                        readEntries();
                    }
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("readEntries from " + dirEntry.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            };
            // Start to read entries
            readEntries();
        };
        getDirEntry(this.fs.root, dirOptions, dirs, dirContentReader, onFailure);
    };

    FileStorage.prototype.deleteDir = function (dirPath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var names = dirPath.split('/');
        var max = names.length;
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:false, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs,
            function (dirEntry) {
                dirEntry.remove(function () {
                    if (onSuccess) {
                        onSuccess();
                    }
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("remove " + dirEntry.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, function(message) {
                // Ignore error if dir unknown. It is also a success
                if (onSuccess) {
                    onSuccess();
                }
            });
    };

    FileStorage.prototype.deleteFullDir = function (dirPath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var names = dirPath.split('/');
        var max = names.length;
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:false, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs,
            function (dirEntry) {
                dirEntry.removeRecursively(function () {
                    if (onSuccess) {
                        onSuccess();
                    }
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("removeRecursively " + dirEntry.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, function (message) {
                // Ignore error if dir unknown. It is also a success
                if (onSuccess) {
                    onSuccess();
                }
            });
    };

    /**
     * Get a fileEntry from its URL.
     * Will get nothing if file does not already exist.
     *
     * @param {String} fileUrl - File URL.
     * @param {Function} onSuccess - Called with fileEntry argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getFileFromUrl = function (fileUrl, onSuccess, onFailure) {
        //fidj.InternalLog.log('fidj.FileStorage','getFileFromUrl : '+ fileUrl);
        if (!this.fs) {
            //fidj.InternalLog.log('fidj.FileStorage','FileStorage No FS !');
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        // resolve File in private or localhost fs
        fileUrl = fileUrl.replace('/private/','/');
        fileUrl = fileUrl.replace('/localhost/','/');

        if (fidj.isDefined(window.resolveLocalFileSystemURL)) {
            //fidj.InternalLog.log('fidj.FileStorage','window.resolveLocalFileSystemURL '+fileUrl);
            window.resolveLocalFileSystemURL(fileUrl, function (fileEntry) {
                    if (onSuccess) {
                        onSuccess(fileEntry);
                    }
                },
                function (fileError) {
                    if (onFailure) {
                        onFailure("resolveLocalFileSystemURL " + fileUrl + " failure : " + errorMessage(fileError));
                    }
                });
        } else if (fidj.isDefined(window.webkitResolveLocalFileSystemURL)) {
            //fidj.InternalLog.log('fidj.FileStorage','window.webkitResolveLocalFileSystemURL '+fileUrl);
            window.webkitResolveLocalFileSystemURL(fileUrl, function (fileEntry) {
                    if (onSuccess) {
                        onSuccess(fileEntry);
                    }
                },
                function (fileError) {
                    if (onFailure) {
                        onFailure("webkitResolveLocalFileSystemURL " + fileUrl + " failure : " + errorMessage(fileError));
                    }
                });
        }
        else {
            //fidj.InternalLog.log('fidj.FileStorage','cordova.getFileFromUri '+fileUrl);
            // In Cordova window.webkitResolveLocalFileSystemURL does not exist
            this.getFileFromUri(fileUrl, onSuccess, onFailure);
        }
    };

    /**
     * Get a fileEntry from its URI.
     * Will get nothing if file does not already exist.
     *
     * @param {String} fileUri - File URI.
     * @param {Function} onSuccess - Called with fileEntry argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getFileFromUri = function (fileUri, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        // resolve File in private or localhost fs
        fileUri = fileUri.replace('/private/','/');
        fileUri = fileUri.replace('/localhost/','/');

        if (fidj.isDefined(window.resolveLocalFileSystemURI)) {
            //fidj.InternalLog.log('fidj.FileStorage','window.resolveLocalFileSystemURI '+fileUri);
            window.resolveLocalFileSystemURI(fileUri, function (fileEntry) {
                    if (onSuccess) {
                        onSuccess(fileEntry);
                    }
                },
                function (fileError) {
                    if (onFailure) {
                        onFailure("resolveLocalFileSystemURI " + fileUri + " failure : " + errorMessage(fileError));
                    }
                });
        } else if (fidj.isDefined(window.webkitResolveLocalFileSystemURI)) {
            //fidj.InternalLog.log('fidj.FileStorage','window.webkitResolveLocalFileSystemURI '+fileUri);
            window.webkitResolveLocalFileSystemURI(fileUri, function (fileEntry) {
                    if (onSuccess) {
                        onSuccess(fileEntry);
                    }
                },
                function (fileError) {
                    if (onFailure) {
                        onFailure("webkitResolveLocalFileSystemURI " + fileUri + " failure : " + errorMessage(fileError));
                    }
                });
        } else {
            //fidj.InternalLog.log('fidj.FileStorage','cordova.getFileFromUrl '+fileUri);
            // In Chrome window.webkitResolveLocalFileSystemURI does not exist
            this.getFileFromUrl(self.urlPrefix + fileUri, onSuccess, onFailure);
        }
    };

    /**
     * Get a URL from its filePath.
     * Will get nothing if file does not already exist.
     *
     * @param {String} filePath - File path.
     * @param {Function} onSuccess - Called with fileURL argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getUrlFromFile = function (filePath, onSuccess, onFailure) {
        //fidj.InternalLog.log('fidj.FileStorage','getUrlFromFile '+filePath);
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }

        //fidj.InternalLog.log('fidj.FileStorage','getUrlFromFile .. '+filePath);
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {

                //fidj.InternalLog.log('fidj.FileStorage','getUrlFromFile result  toURL '+fileEntry.toURL());
                //fidj.InternalLog.log('fidj.FileStorage','getUrlFromFile result  fullPath '+fileEntry.fullPath);

                if (fidj.isDefined(fileEntry.toNativeURL)){
                    //fidj.InternalLog.log('fidj.FileStorage','getUrlFromFile result  toNativeURL '+fileEntry.toNativeURL());
                    if (onSuccess) onSuccess(fileEntry.toNativeURL());
                } else {
                    //fidj.InternalLog.log('fidj.FileStorage','toNativeURL not defined, use toUrl');
                    if (onSuccess) onSuccess(fileEntry.toURL());
                }

            }, onFailure);
    };

    /**
     * Get a URI from its filePath.
     * Will get nothing if file does not already exist.
     *
     * @param {String} filePath - File path.
     * @param {Function} onSuccess - Called with fileURI argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getUriFromFile = function (filePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {
                if (onSuccess) {
                    onSuccess(fileEntry.toURI());
                }
            }, onFailure);
    };

    /**
     * Get a modification time from its filePath.
     * Will get nothing if file does not already exist.
     *
     * @param {String} filePath - File URL.
     * @param {Function} onSuccess - Called with Date object argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getModificationTimeFromFile = function (filePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {
                fileEntry.getMetadata(
                    function (metadata) {
                        if (onSuccess) {
                            onSuccess(metadata.modificationTime);
                        }
                    },
                    function (fileError) {
                        if (onFailure) {
                            onFailure("getMetadata " + fileEntry.fullPath + " failure : " + errorMessage(fileError));
                        }
                    });
            }, onFailure);
    };

    /**
     * Get a file in root directory.
     * Will get nothing if file does not already exist.
     *
     * @param {String} filePath - File path (relative or absolute). Its direct parent directory must already exist.
     * @param {Function} onSuccess - Called with fileEntry argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getFile = function (filePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false}, onSuccess, onFailure);
    };

    /**
     * Creates a new file in root directory.
     * Will create file if file does not already exist. Will fail if file already exist.
     *
     * @param {String} filePath - File path (relative or absolute). Its direct parent directory must already exist.
     * @param {Function} onSuccess - Called with fileEntry argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.newFile = function (filePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:true, exclusive:true}, onSuccess, onFailure);
    };

    /**
     * Get a existant file or create a new file in root directory.
     * Will create file if file does not already exist. Will reuse the same file if file already exist.
     *
     * @param {String} filePath - File path (relative or absolute). Its direct parent directory must already exist.
     * @param {Function} onSuccess - Called with fileEntry argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.getOrNewFile = function (filePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:true, exclusive:false}, onSuccess, onFailure);
    };

    /**
     * Read the content of a file in root directory.
     * Will get nothing if file does not already exist.
     *
     * @param {String} filePath - File path (relative or absolute). Its direct parent directory must already exist.
     * @param {Function} onSuccess - Called with text argument if success.
     * @param {Function} onFailure - Called with error message argument if failure.
     */
    FileStorage.prototype.readFileAsDataURL = function (filePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    if (onSuccess) {
                        reader.onload = function (evt) {
                            onSuccess(evt.target.result);
                        };
                    }
                    if (onFailure) {
                        reader.onerror = function (fileError) {
                            onFailure("readAsDataURL " + file.fullPath + " failure : " + errorMessage(fileError));
                        };
                    }
                    reader.readAsDataURL(file);
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("file " + file.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, onFailure);
    };
    FileStorage.prototype.readFileAsText = function (filePath, onSuccess, onFailure, onProgress, from, length) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    //var blob = createBlobToReadByChunks(file, reader, onSuccess, onFailure, onProgress, from, length);
                    //reader.readAsText(blob);// use 'UTF-8' encoding
                    if (onSuccess) {
                        reader.onload = function (evt) {
                            onSuccess(evt.target.result);
                        };
                    }
                    if (onFailure) {
                        reader.onerror = function (fileError) {
                            onFailure("readAsText " + file.fullPath + " failure : " + errorMessage(fileError));
                        };
                    }
                    reader.readAsText(file);
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("file " + file.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, onFailure);
    };

    // Not yet implemented in Cordova
    FileStorage.prototype.readFileAsArrayBuffer = function (filePath, onSuccess, onFailure, onProgress, from, length) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    //var blob = createBlobToReadByChunks(file, reader, onSuccess, onFailure, onProgress, from, length);
                    //reader.readAsArrayBuffer(blob);
                    if (onSuccess) {
                        reader.onload = function (evt) {
                            onSuccess(evt.target.result);
                        };
                    }
                    if (onFailure) {
                        reader.onerror = function (fileError) {
                            onFailure("readAsText " + file.fullPath + " failure : " + errorMessage(fileError));
                        };
                    }
                    reader.readAsArrayBuffer(file);
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("file " + file.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, onFailure);
    };

    // Not yet implemented in Cordova
    FileStorage.prototype.readFileAsBinaryString = function (filePath, onSuccess, onFailure, onProgress, from, length) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    //var blob = createBlobToReadByChunks(file, reader, onSuccess, onFailure, onProgress, from, length);
                    //reader.readAsBinaryString(blob);
                    if (onSuccess) {
                        reader.onload = function (evt) {
                            onSuccess(evt.target.result);
                        };
                    }
                    if (onFailure) {
                        reader.onerror = function (fileError) {
                            onFailure("readAsText " + file.fullPath + " failure : " + errorMessage(fileError));
                        };
                    }
                    reader.readAsBinaryString(file);
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("file " + file.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, onFailure);
    };

    FileStorage.prototype.writeFile = function (fromBlob, toFilePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, toFilePath, {create:true, exclusive:false},
            function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    // WARNING : can not do truncate() + write() at the same time
                    fileWriter.onwriteend = function (evt) {
                        fileWriter.onwriteend = null;
                        if (onSuccess) {
                            fileWriter.onwrite = function (evt) {
                                onSuccess(fileEntry);
                            };
                        }
                        if (onFailure) {
                            fileWriter.onerror = function (fileError) {
                                onFailure("write or truncate " + fileEntry.fullPath + " failure : " + errorMessage(fileError));
                            };
                        }
                        fileWriter.write(fromBlob);
                    };
                    fileWriter.truncate(0);// Required if new text is shorter than previous text
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("createWriter " + fileEntry.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, onFailure);
    };

    FileStorage.prototype.appendFile = function (fromBlob, toFilePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, toFilePath, {create:true, exclusive:false},
            function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    if (onSuccess) {
                        fileWriter.onwrite = function (e) {
                            onSuccess(fileEntry);
                        };
                    }
                    if (onFailure) {
                        fileWriter.onerror = function (fileError) {
                            onFailure("write or seek " + fileEntry.fullPath + " failure : " + errorMessage(fileError));
                        };
                    }
                    // can do seek() + write() at the same time
                    fileWriter.seek(fileWriter.length);
                    fileWriter.write(fromBlob);
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("createWriter " + fileEntry.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, onFailure);
    };

    FileStorage.prototype.deleteFile = function (filePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        getFileEntry(this.fs.root, filePath, {create:false, exclusive:false},
            function (fileEntry) {
                fileEntry.remove(function () {
                    if (onSuccess) {
                        onSuccess();
                    }
                }, function (fileError) {
                    if (onFailure) {
                        onFailure("remove " + fileEntry.fullPath + " failure : " + errorMessage(fileError));
                    }
                });
            }, function (message) {
                // Ignore error if file unknown. It is also a success
                if (onSuccess) {
                    onSuccess();
                }
            });
    };

    FileStorage.prototype.copyFile = function (fromFilePath, toFilePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        //fidj.InternalLog.log('fidj.FileStorage','copyFile :'+fromFilePath+" to:"+toFilePath);
        var self = this;
        var names = toFilePath.split('/');
        var max = names.length - 1;
        var fileName = names[max];
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:true, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs,
            function (dirEntry) {
                //fidj.InternalLog.log('fidj.FileStorage','copyFile in :'+fromFilePath+" to:"+toFilePath);
                getFileEntry(self.fs.root, fromFilePath, {create:false, exclusive:false},
                    function (fileEntry) {
                        //fidj.InternalLog.log('fidj.FileStorage','copyFile in2 :'+fromFilePath+" to:"+toFilePath);
                        fileEntry.copyTo(dirEntry, fileName, function (toFileEntry) {
                            if (onSuccess) {
                                onSuccess(toFileEntry);
                            }
                        }, function (fileError) {
                            if (onFailure) {
                                onFailure("copy " + fileEntry.fullPath + " to " + dirEntry.fullPath + "/" + fileName + " failure : " + errorMessage(fileError));
                            }
                        });
                    }, onFailure);
            }, onFailure);

    };

    FileStorage.prototype.copyFileFromUrl = function (fromFileUrl, toFilePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        //fidj.InternalLog.log('fidj.FileStorage','copyFileFromUrl :'+fromFileUrl+" to:"+toFilePath);
        var self = this;
        var names = toFilePath.split('/');
        var max = names.length - 1;
        var fileName = names[max];
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:true, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs,
            function (dirEntry) {
                //fidj.InternalLog.log('fidj.FileStorage','copyFileFromUrl in :'+fromFileUrl+" to:"+toFilePath);
                self.getFileFromUrl(fromFileUrl,
                    function (fileEntry) {
                        //fidj.InternalLog.log('fidj.FileStorage','copyFileFromUrl in2 :'+fromFileUrl+" to:"+toFilePath);
                        fileEntry.copyTo(dirEntry, fileName, function (toFileEntry) {
                            if (onSuccess) {
                                onSuccess(toFileEntry);
                            }
                        }, function (fileError) {
                            if (onFailure) {
                                onFailure("copy " + fileEntry.fullPath + " to " + dirEntry.fullPath + "/" + fileName + " failure : " + errorMessage(fileError));
                            }
                        });
                    }, onFailure);
            }, onFailure);
    };

    FileStorage.prototype.moveFile = function (fromFilePath, toFilePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var self = this;
        var names = toFilePath.split('/');
        var max = names.length - 1;
        var fileName = names[max];
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:true, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs,
            function (dirEntry) {
                getFileEntry(self.fs.root, fromFilePath, {create:false, exclusive:false},
                    function (fileEntry) {
                        fileEntry.moveTo(dirEntry, fileName, function (toFileEntry) {
                            if (onSuccess) {
                                onSuccess(toFileEntry);
                            }
                        }, function (fileError) {
                            if (onFailure) {
                                onFailure("move " + fileEntry.fullPath + " to " + dirEntry.fullPath + "/" + fileName + " failure : " + errorMessage(fileError));
                            }
                        });
                    }, onFailure);
            }, onFailure);

    };

    FileStorage.prototype.moveFileEntry = function (fromFileEntry, toFilePath, onSuccess, onFailure) {
        if (!this.fs) {
            throw new Error("fidj.FileStorage is not yet initialized with its file system.");
        }
        var self = this;
        var names = toFilePath.split('/');
        var max = names.length - 1;
        var fileName = names[max];
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] != '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }
        var dirOptions = {create:true, exclusive:false};
        getDirEntry(this.fs.root, dirOptions, dirs,
            function (dirEntry) {
    			fromFileEntry.moveTo(dirEntry, fileName, function (toFileEntry) {
                        if (onSuccess) {
                            onSuccess(toFileEntry);
                        }
                    }, function (fileError) {
                        if (onFailure) {
                            onFailure("move " + fileEntry.fullPath + " to " + dirEntry.fullPath + "/" + fileName + " failure : " + errorMessage(fileError));
                        }
                    });
            }, onFailure);

    };

    // Private API
    // helper functions and variables hidden within this function scope

    function errorMessage(fileError) {
        var msg = '';
        switch (fileError.code) {
            case FileError.NOT_FOUND_ERR:
                msg = 'File not found';
                break;
            case FileError.SECURITY_ERR:
                // You may need the --allow-file-access-from-files flag
                // if you're debugging your app from file://.
                msg = 'Security error';
                break;
            case FileError.ABORT_ERR:
                msg = 'Aborted';
                break;
            case FileError.NOT_READABLE_ERR:
                msg = 'File not readable';
                break;
            case FileError.ENCODING_ERR:
                msg = 'Encoding error';
                break;
            case FileError.NO_MODIFICATION_ALLOWED_ERR:
                msg = 'File not modifiable';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'Invalid state';
                break;
            case FileError.SYNTAX_ERR:
                msg = 'Syntax error';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'Invalid modification';
                break;
            case FileError.QUOTA_EXCEEDED_ERR:
                // You may need the --allow-file-access-from-files flag
                // if you're debugging your app from file://.
                msg = 'Quota exceeded';
                break;
            case FileError.TYPE_MISMATCH_ERR:
                msg = 'Type mismatch';
                break;
            case FileError.PATH_EXISTS_ERR:
                msg = 'File already exists';
                break;
            default:
                msg = 'Unknown FileError code (code= ' + fileError.code + ', type=' + typeof(fileError) + ')';
                break;
        }
        return msg;
    }

    function getDirEntry(dirEntry, dirOptions, dirs, onSuccess, onFailure) {

        if (dirs.length <= 0) {
            //fidj.InternalLog.log('fidj.FileStorage','getDirEntry success1');
            if (onSuccess) onSuccess(dirEntry);
            return;
        }

        var bWillThrow = false;
        var dirName = dirs[0];
        dirs = dirs.slice(1);

        //fidj.InternalLog.log('fidj.FileStorage','getDirEntry '+dirName+' '+dirOptions);
        dirEntry.getDirectory(dirName, dirOptions,
            function (dirEntry) {
                bWillThrow = true;
                //fidj.InternalLog.log('fidj.FileStorage','getDirEntry in '+dirName);
                if (dirs.length) {
                    //fidj.InternalLog.log('fidj.FileStorage','getDirEntry in2 '+dirName);
                    getDirEntry(dirEntry, dirOptions, dirs, onSuccess, onFailure);
                } else {
                    //fidj.InternalLog.log('fidj.FileStorage','getDirEntry success2 '+dirName);
                    if (onSuccess) onSuccess(dirEntry);
                }
            },
            function (fileError) {
                //fidj.InternalLog.log('fidj.FileStorage','getDirEntry fail '+dirName+' '+fileError+' '+dirOptions);
                bWillThrow = true;
                if (onFailure) onFailure("getDirectory " + dirName + " from " + dirEntry.fullPath + " failure : " + errorMessage(fileError));
            }
        );

        //setTimeout(function() {
            //fidj.InternalLog.log('fidj.FileStorage','bWillThrow ? '+bWillThrow+' '+dirName);
            // window.setTimeout(function(){console.log('wait...');},1000);
            // console.log('bWillThrow... ? '+bWillThrow);

            // if (!bWillThrow) {
            //     console.log('getDirEntry not throw pb'+' '+dirName+' '+dirOptions);
            //     //if (onFailure) onFailure("getDirectory " + dirName + " from " + dirEntry.fullPath + " failure : unknow ?");
            // }
        //},500);
    }

    function getFileEntry(rootEntry, filePath, fileOptions, onSuccess, onFailure) {
        var names = filePath.split('/');
        var max = names.length - 1;
        var fileName = names[max];
        var dirs = [];
        for (var i = 0; i < max; i++) {
            if ((names[i] !== '.') && (names[i] !== '')) {
                dirs.push(names[i]);
            }
        }

        //fidj.InternalLog.log('fidj.FileStorage','getFileEntry filePath :'+filePath+" fileOptions:"+fileOptions.create+' dirs:'+fidjDumpObject("  ", dirs, 1));
        var dirOptions;
        if (fileOptions.create) {
            dirOptions = {create:true, exclusive:false};
        } else {
            dirOptions = {create:false, exclusive:false};
        }
        getDirEntry(rootEntry, dirOptions, dirs,
            function (dirEntry) {
                //fidj.InternalLog.log('fidj.FileStorage','getFileEntry in filePath :'+filePath+" fileOptions:"+fileOptions.create);
                dirEntry.getFile(fileName, fileOptions,
                    function (fileEntry) {
                        //fidj.InternalLog.log('fidj.FileStorage','getFileEntry in success filePath :'+filePath+" fileOptions:"+fileOptions.create);
                        if (onSuccess) {
                            onSuccess(fileEntry);
                        }
                    }, function (fileError) {
                        //fidj.InternalLog.log('fidj.FileStorage','getFileEntry in failure filePath :'+filePath+" fileOptions:"+fileOptions.create);
                        if (onFailure) {
                            onFailure("getFile " + fileName + " from " + dirEntry.fullPath + " failure : " + errorMessage(fileError));
                        }
                    });
            }, onFailure);
    }

    function createBlobToReadByChunks(file, reader, onSuccess, onFailure, onProgress, from, length) {
        var start = parseInt(from) || 0;
        var stop = parseInt(length) || (file.size - start);
        if (onProgress) {
            reader.onloadstart = function (evt) {
                onProgress(0, stop - start);
            };
            reader.onprogress = function (evt) {
                if (evt.lengthComputable) {
                    //var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
                    onProgress(evt.loaded, evt.total);
                }
            };
            if (onSuccess) {
                reader.onloadend = function (evt) {
                    if (evt.target.readyState == FileReader.DONE) {
                        onProgress(stop - start, stop - start);
                        onSuccess(evt.target.result);
                    }
                };
            } else {
                reader.onloadend = function (evt) {
                    if (evt.target.readyState == FileReader.DONE) {
                        onProgress(stop - start, stop - start);
                    }
                };
            }
        } else if (onSuccess) {
            reader.onloadend = function (evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    onSuccess(evt.target.result);
                }
            };
        }
        if (onFailure) {
            reader.onerror = function (fileError) {
                onFailure("FileReader " + file.fullPath + " failure : " + errorMessage(fileError));
            };
            reader.onabort = function (evt) {
                onFailure('Aborted by user');
            };
        }
        var blob = file.slice(start, stop);
        return blob;
    }

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return FileStorage;
})(); // Invoke the function immediately to create this class.

// An auxiliary constructor for the FileStorage class.
fidj.PredefinedFileStorage = (function () {
    // Constructor
    function PredefinedFileStorage(fileSystem, grantedBytes) {
        this.version = "0.1";
        this.fs = fileSystem;
        this.grantedBytes = grantedBytes;
    }

    // Set the prototype so that PredefinedFileStorage creates instances of FileStorage
    PredefinedFileStorage.prototype = fidj.FileStorage.prototype;

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return PredefinedFileStorage;
})(); // Invoke the function immediately to create this class.



fidj.Utf8 = (function () {
'use strict';

    var Utf8 = {};

    // Public API


    /**
     * Encodes multi-byte Unicode string to utf-8 encoded characters
     *
     * @param {String} input Unicode string to be encoded into utf-8
     * @returns {String} UTF-8 string
     */
    Utf8.encode = function (input) {
        var utftext = '', nChr, nStrLen = input.length;
        /* transcription... */
        for (var nChrIdx = 0; nChrIdx < nStrLen; nChrIdx++) {
            nChr = input.charCodeAt(nChrIdx);
            if (nChr < 128) {
                /* one byte */
                utftext += String.fromCharCode(nChr);
            } else if (nChr < 0x800) {
                /* two bytes */
                utftext += String.fromCharCode(192 + (nChr >>> 6));
                utftext += String.fromCharCode(128 + (nChr & 63));
            } else if (nChr < 0x10000) {
                /* three bytes */
                utftext += String.fromCharCode(224 + (nChr >>> 12));
                utftext += String.fromCharCode(128 + (nChr >>> 6 & 63));
                utftext += String.fromCharCode(128 + (nChr & 63));
            } else if (nChr < 0x200000) {
                /* four bytes */
                utftext += String.fromCharCode(240 + (nChr >>> 18));
                utftext += String.fromCharCode(128 + (nChr >>> 12 & 63));
                utftext += String.fromCharCode(128 + (nChr >>> 6 & 63));
                utftext += String.fromCharCode(128 + (nChr & 63));
            } else if (nChr < 0x4000000) {
                /* five bytes */
                utftext += String.fromCharCode(248 + (nChr >>> 24));
                utftext += String.fromCharCode(128 + (nChr >>> 18 & 63));
                utftext += String.fromCharCode(128 + (nChr >>> 12 & 63));
                utftext += String.fromCharCode(128 + (nChr >>> 6 & 63));
                utftext += String.fromCharCode(128 + (nChr & 63));
            } else /* if (nChr <= 0x7fffffff) */ {
                /* six bytes */
                utftext += String.fromCharCode(252 + /* (nChr >>> 32) is not possible in ECMAScript! So...: */ (nChr / 1073741824));
                utftext += String.fromCharCode(128 + (nChr >>> 24 & 63));
                utftext += String.fromCharCode(128 + (nChr >>> 18 & 63));
                utftext += String.fromCharCode(128 + (nChr >>> 12 & 63));
                utftext += String.fromCharCode(128 + (nChr >>> 6 & 63));
                utftext += String.fromCharCode(128 + (nChr & 63));
            }
        }
        return utftext;
    };

    /**
     * Encodes multi-byte Unicode string to Uint8Array characters
     *
     * @param {String} input Unicode string to be encoded into Uint8Array
     * @returns {String} Uint8Array
     */
    Utf8.encodeToUint8Array = function (input) {
        var aBytes, nChr, nStrLen = input.length, nArrLen = 0;
        /* mapping... */
        for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
            nChr = input.charCodeAt(nMapIdx);
            nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
        }
        aBytes = new Uint8Array(nArrLen);
        /* transcription... */
        for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
            nChr = input.charCodeAt(nChrIdx);
            if (nChr < 128) {
                /* one byte */
                aBytes[nIdx++] = nChr;
            } else if (nChr < 0x800) {
                /* two bytes */
                aBytes[nIdx++] = 192 + (nChr >>> 6);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x10000) {
                /* three bytes */
                aBytes[nIdx++] = 224 + (nChr >>> 12);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x200000) {
                /* four bytes */
                aBytes[nIdx++] = 240 + (nChr >>> 18);
                aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x4000000) {
                /* five bytes */
                aBytes[nIdx++] = 248 + (nChr >>> 24);
                aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            } else /* if (nChr <= 0x7fffffff) */ {
                /* six bytes */
                aBytes[nIdx++] = 252 + /* (nChr >>> 32) is not possible in ECMAScript! So...: */ (nChr / 1073741824);
                aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
                aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
                aBytes[nIdx++] = 128 + (nChr & 63);
            }
        }
        return aBytes;
    };

    /**
     * Decodes utf-8 encoded string to multi-byte Unicode characters
     *
     * @param {String} input UTF-8 string to be decoded into Unicode
     * @returns {String} Unicode string
     */
    Utf8.decode = function (input) {
        var sView = "", nChr, nCode, nStrLen = input.length;
        for (var nChrIdx = 0; nChrIdx < nStrLen; nChrIdx++) {
            nChr = input.charCodeAt(nChrIdx);
            if ((nChr >= 0xfc) && (nChr <= 0xfd) && ((nChrIdx + 5) < nStrLen)) {
                /* six bytes */
                /* (nChr - 252 << 32) is not possible in ECMAScript! So...: */
                nCode = (nChr & 0x01) * 1073741824;
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 24);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 18);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 12);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 6);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= (nChr & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nChr >= 0xf8) && (nChr <= 0xfb) && ((nChrIdx + 4) < nStrLen)) {
                /* five bytes */
                nCode = ((nChr & 0x03) << 24);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 18);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 12);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 6);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= (nChr & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nChr >= 0xf0) && (nChr <= 0xf7) && ((nChrIdx + 3) < nStrLen)) {
                /* four bytes */
                nCode = ((nChr & 0x07) << 18);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 12);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 6);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= (nChr & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nChr >= 0xe0) && (nChr <= 0xef) && ((nChrIdx + 2) < nStrLen)) {
                /* three bytes */
                nCode = ((nChr & 0x0f) << 12);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= ((nChr & 0x3f) << 6);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= (nChr & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nChr >= 0xc0) && (nChr <= 0xdf) && ((nChrIdx + 1) < nStrLen)) {
                /* two bytes */
                nCode = ((nChr & 0x1f) << 6);
                nChr = input.charCodeAt(++nChrIdx);
                nCode |= (nChr & 0x3f);
                sView += String.fromCharCode(nCode);
            } else {
                /* one byte */
                sView += String.fromCharCode(nChr & 0x7f);
            }
        }
        return sView;
    };

    /**
     * Decodes Uint8Array to to multi-byte Unicode characters
     *
     * @param {String} aBytes Uint8Array to be decoded into Unicode
     * @returns {String} Unicode string
     */
    Utf8.decodeFromUint8Array = function (aBytes) {
        var sView = "", nPart, nCode, nLen = aBytes.length;
        for (var nIdx = 0; nIdx < nLen; nIdx++) {
            nPart = aBytes[nIdx];
            if ((nPart >= 0xfc) && (nPart <= 0xfd) && ((nIdx + 5) < nLen)) {
                /* six bytes */
                /* (nPart - 252 << 32) is not possible in ECMAScript! So...: */
                nCode = (nPart & 0x01) * 1073741824;
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 24);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 18);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 12);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 6);
                nPart = aBytes[++nIdx];
                nCode += (nPart & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nPart >= 0xf8) && (nPart <= 0xfb) && ((nIdx + 4) < nLen)) {
                /* five bytes */
                nCode = ((nPart & 0x03) << 24);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 18);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 12);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 6);
                nPart = aBytes[++nIdx];
                nCode += (nPart & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nPart >= 0xf0) && (nPart <= 0xf7) && ((nIdx + 3) < nLen)) {
                /* four bytes */
                nCode = ((nPart & 0x07) << 18);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 12);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 6);
                nPart = aBytes[++nIdx];
                nCode += (nPart & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nPart >= 0xe0) && (nPart <= 0xef) && ((nIdx + 2) < nLen)) {
                /* three bytes */
                nCode = ((nPart & 0x0f) << 12);
                nPart = aBytes[++nIdx];
                nCode += ((nPart & 0x3f) << 6);
                nPart = aBytes[++nIdx];
                nCode += (nPart & 0x3f);
                sView += String.fromCharCode(nCode);
            } else if ((nPart >= 0xc0) && (nPart <= 0xdf) && ((nIdx + 1) < nLen)) {
                /* two bytes */
                nCode = ((nPart & 0x1f) << 6);
                nPart = aBytes[++nIdx];
                nCode += (nPart & 0x3f);
                sView += String.fromCharCode(nCode);
            } else {
                /* one byte */
                sView += String.fromCharCode(nPart & 0x7f);
            }
        }
        return sView;
    };

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return Utf8;
})(); // Invoke the function immediately to create this class.


fidj.Base64 = (function () {
'use strict';

    var Base64 = {};

    // Public API

    /**
     * Encodes string to Base64 string
     */
    Base64.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        //input = utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);

        }

        return output;
    };

    Base64.encodeFromUint8Array = function (input) {
        var nMod3, sB64Enc = "";
        for (var nLen = input.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
            nMod3 = nIdx % 3;
            if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
                sB64Enc += "\r\n";
            }
            nUint24 |= input[nIdx] << (16 >>> nMod3 & 24);
            if (nMod3 === 2 || input.length - nIdx === 1) {
                sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63),
                    uint6ToB64(nUint24 >>> 12 & 63),
                    uint6ToB64(nUint24 >>> 6 & 63),
                    uint6ToB64(nUint24 & 63));
                nUint24 = 0;
            }
        }
        return sB64Enc.replace(/A(?=A$|$)/g, "=");
    };

    /**
     * Decodes string from Base64 string
     */
    Base64.decode = function (input) {

        return decodeURIComponent(atob(input).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        //output = utf8_decode(output);

        return output;
    };

    Base64.decodeToUint8Array = function (input) {
        var nBlocksSize = 1;// for ASCII, binary strings or UTF-8-encoded strings
        //var nBlocksSize = 2;// for UTF-16 strings
        //var nBlocksSize = 4;// for UTF-32 strings
        var sB64Enc = input.replace(/[^A-Za-z0-9\+\/]/g, ""),
            nInLen = sB64Enc.length,
            nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
            taBytes = new Uint8Array(nOutLen);
        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;
            }
        }
        return taBytes;
    };

    // Private API
    // helper functions and variables hidden within this function scope

    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    function uint6ToB64(nUint6) {
        return nUint6 < 26 ?
            nUint6 + 65
            : nUint6 < 52 ?
            nUint6 + 71
            : nUint6 < 62 ?
            nUint6 - 4
            : nUint6 === 62 ?
            43
            : nUint6 === 63 ?
            47
            :
            65;
    }

    function b64ToUint6(nChr) {
        return nChr > 64 && nChr < 91 ?
            nChr - 65
            : nChr > 96 && nChr < 123 ?
            nChr - 71
            : nChr > 47 && nChr < 58 ?
            nChr + 4
            : nChr === 43 ?
            62
            : nChr === 47 ?
            63
            :
            0;
    }

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return Base64;
})(); // Invoke the function immediately to create this class.
/**
 * Geolocation - Begin
 */

var geo_code;
var geo_city;

//Get the latitude and the longitude;
var geo_success = function (position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    geo_codeLatLng(lat, lng);
};

var geo_error = function () {
    a4p.ErrorLog.log('geo_error', "Geocoder failed");
};

var geo_codeLatLng = function (lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geo_code.geocode({'latLng': latlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            a4p.InternalLog.log('geo_codeLatLng', results);
            if (results[1]) {
                //formatted address
                a4p.InternalLog.log('geo_codeLatLng', results[0].formatted_address);
                geo_city = results[0].formatted_address;
                var city;
                //find country name
                for (var i = 0; i < results[0].address_components.length; i++) {
                    for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                        if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                            //this is the object you are looking for
                            city = results[0].address_components[i];
                            break;
                        }
                    }
                }
                //city data
                a4p.InternalLog.log('geo_codeLatLng', city.short_name + " " + city.long_name);
                //return city.short_name;
                //geo_city = city.short_name;
                geo_city = '<?php print Lang::_t("(near)",$current_user);?> ' + geo_city;
                var option = new Option(geo_city, geo_city, true, true);
                $('#rdv-header-location').append(option);
                $('#rdv-header-location').val(option);


            } else {
                a4p.InternalLog.log('geo_codeLatLng', "Geocoder No results found");
            }
        } else {
            a4p.InternalLog.log('geo_codeLatLng', "Geocoder failed due to: " + status);
        }
    });
};

var loadLocation = function () {

    geo_code = new google.maps.Geocoder();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geo_success, geo_error);
    }
};


/**
 * Geolocation - End
 */


fidj.Xml = (function()
{
    // Constructor
    function Xml()
    {
        this.version = "0.1";
    }

    // Public API

    Xml.isXml = function (elm) {
        // based on jQuery.isXML function
        var documentElement = (elm ? elm.ownerDocument || elm : 0).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };

    /**
     * Encodes a XML node to string
     */
    Xml.xml2String = function(xmlNode) {
        // based on http://www.mercurytide.co.uk/news/article/issues-when-working-ajax/
        if (!Xml.isXml(xmlNode)) {
            return false;
        }
        try { // Mozilla, Webkit, Opera
            return new XMLSerializer().serializeToString(xmlNode);
        } catch (E1) {
            try {  // IE
                return xmlNode.xml;
            } catch (E2) {

            }
        }
        return false;
    };

    /**
     * Decodes a XML node from string
     */
    Xml.string2Xml = function(xmlString) {
        // based on http://outwestmedia.com/jquery-plugins/xmldom/
        if (!dom_parser) {
            return false;
        }
        var resultXML = dom_parser.call("DOMParser" in window && (new DOMParser()) || window,
            xmlString, 'text/xml');
        return this.isXml(resultXML) ? resultXML : false;
    };

    // Private API
    // helper functions and variables hidden within this function scope

    var dom_parser = ("DOMParser" in window && (new DOMParser()).parseFromString) ||
        (window.ActiveXObject && function(_xmlString) {
            var xml_doc = new ActiveXObject('Microsoft.XMLDOM');
            xml_doc.async = 'false';
            xml_doc.loadXML(_xmlString);
            return xml_doc;
        });

    // The public API for this module is the constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.
    return Xml;
})(); // Invoke the function immediately to create this class.


export fidj;