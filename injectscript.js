var IDLE_TIMEOUT = 20; //seconds
var IDLE_TIMEOUT_2 = 20;
var _localStorageKey = 'global_countdown_last_reset_timestamp';
var _idleSecondsTimer = null;
var _lastResetTimeStamp = (new Date()).getTime();
var _localStorage = null;

var first_timeout = false;
var iDiv;
var iDiv2;
var isActive = true;
console.log("is aloitettu");
getDataFromExtension("hello", function(idle1, idle2) {
        console.log("is idletime saatu " + idle1 + " " + idle2);
        IDLE_TIMEOUT = parseInt(idle1, 10);
        IDLE_TIMEOUT_2 = parseInt(idle2, 10);
    });
console.log("is getdata done");

idlecheck();

window.onblur = function () { 
    isActive = false;
    console.log("bg laitettu");
}; 

window.onfocus = function () { 
    isActive = true;
    setWarningVisibility(false);
    ResetTime(); 
}; 
function GetLastResetTimeStamp() {
    var lastResetTimeStamp = 0;
    if (_localStorage) {
        lastResetTimeStamp = parseInt(_localStorage[_localStorageKey], 10);
        if (isNaN(lastResetTimeStamp) || lastResetTimeStamp < 0)
            lastResetTimeStamp = (new Date()).getTime();
    } else {
        lastResetTimeStamp = _lastResetTimeStamp;
    }

    return lastResetTimeStamp;
}

function SetLastResetTimeStamp(timeStamp) {
    if (_localStorage) {
        _localStorage[_localStorageKey] = timeStamp;
    } else {
        _lastResetTimeStamp = timeStamp;
    }
}

function ResetTime() {
    SetLastResetTimeStamp((new Date()).getTime());
    first_timeout = false;
}

function AttachEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
        return true;
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
        return true;
    } else {
        //nothing to do, browser too old or non standard anyway
        return false;
    }
}

function WriteProgress(msg) {
    
    console.log(msg);
}



function CheckIdleTime() {
    if(!isActive)
        return;
    var currentTimeStamp = (new Date()).getTime();
    var lastResetTimeStamp = GetLastResetTimeStamp();
    var secondsDiff = Math.floor((currentTimeStamp - lastResetTimeStamp) / 1000);
    
    if (secondsDiff <= 0) {
        ResetTime();
        secondsDiff = 0;
        setWarningVisibility(false);
    }
    //WriteProgress((IDLE_TIMEOUT - secondsDiff) + "");
    console.log("kulunut "+secondsDiff + " ?? " +(IDLE_TIMEOUT + IDLE_TIMEOUT_2) + " " + IDLE_TIMEOUT + " "+IDLE_TIMEOUT_2);
    if(secondsDiff >= (IDLE_TIMEOUT + IDLE_TIMEOUT_2)){
        console.log("kirjaudutaan ulos, host: " + document.location.host);
    	deleteUserLogonIdCookie();

        if(document.location.host.indexOf("anttila") > -1){
            logout('https://www.anttila.com/shop/Logoff?catalogId=1444&myAcctMain=1&langId=22&storeId=1444&deleteCartCookie=true&URL=http%3A%2F%2Fwww.anttila.com%2Fshop%2Ffi%2Fnetanttila');
        }
        else if(document.location.host.indexOf("kodin1") > -1){
            logout('https://www.kodin1.com/shop/Logoff?catalogId=3444&myAcctMain=1&langId=22&storeId=3444&deleteCartCookie=true&URL=http%3A%2F%2Fwww.kodin1.com%2Fshop%2Ffi%2Fkodin1');
        }
        changeWarningTime(0);
		//deleteUserLogonIdCookie();
		//logout('https://www.anttila.com/shop/Logoff?catalogId=1444&myAcctMain=1&langId=22&storeId=1444&deleteCartCookie=true&URL=http%3A%2F%2Fwww.anttila.com%2Fshop%2Ffi%2Fnetanttila');
    }
    else if (secondsDiff >= IDLE_TIMEOUT && first_timeout == false) {
        //window.clearInterval(_idleSecondsTimer);
        changeWarningTime(IDLE_TIMEOUT_2);
        setWarningVisibility(true);
        console.log("yli ajasta");
        first_timeout = true;

    }
    else if(secondsDiff >= IDLE_TIMEOUT && first_timeout == true){
        changeWarningTime(IDLE_TIMEOUT+IDLE_TIMEOUT_2-secondsDiff);
    }
}

function idlecheck(){
	var name = getCookie("DISPLAYNAME");
    
	if(name != "guest" && name != null && name.length > 0){
		initWarning();
		AttachEvent(document, 'click', ResetTime);
		AttachEvent(document, 'mousemove', ResetTime);
		AttachEvent(document, 'keypress', ResetTime);
		AttachEvent(window, 'load', ResetTime);

		try {
    		_localStorage = window.localStorage;
		}
		catch (ex) {
		}
		ResetTime();
		_idleSecondsTimer = window.setInterval(CheckIdleTime, 1000);
	}

}

function initWarning(){
    console.log("naytetaan varoitus");
    iDiv = document.createElement('div');
    iDiv.id = 'idlew';
    iDiv.innerHTML = "Automaattinen uloskirjautuminen, jos et liikuta hiirtä."
    iDiv2 = document.createElement('div');
    iDiv2.id = 'textcount';
    iDiv.appendChild(iDiv2);
    document.getElementsByTagName('body')[0].appendChild(iDiv);
}

function setWarningVisibility(show){
    if(show == true)
        iDiv.style.display = "block";
    else
        iDiv.style.display = "none";
}

function changeWarningTime(value){
    iDiv2.innerHTML = value;

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function getDataFromExtension(key, callback) {
    document.addEventListener('fetchResponse', function respListener(event) {
        var data = event.detail;

        // check if this response is for this request
        if(data.reqId == reqId) {
            callback(data.idle1, data.idle2);
            document.removeEventListener('fetchResponse', respListener);
        }
    })
    var reqId = Math.random().toString(); // unique ID for this request
    var dataObj = {"key":key, "reqId":reqId};
    var fetchEvent = new CustomEvent('myFetchEvent', {"detail":dataObj});
    document.dispatchEvent(fetchEvent);

    // get ready for a reply from the content script
    
}
/*
deleteUserLogonIdCookie();

logout('https://www.anttila.com/shop/Logoff?catalogId=1444&amp;myAcctMain=1&amp;langId=22&amp;storeId=1444&amp;deleteCartCookie=true&amp;URL=http%3A%2F%2Fwww.anttila.com%2Fshop%2Ffi%2Fnetanttila');

javascript:deleteUserLogonIdCookie();logout('https://www.anttila.com/shop/Logoff?catalogId=1444&myAcctMain=1&langId=22&storeId=1444&deleteCartCookie=true&URL=http%3A%2F%2Fwww.anttila.com%2Fshop%2Ffi%2Fnetanttila');
*/