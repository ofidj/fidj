


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
