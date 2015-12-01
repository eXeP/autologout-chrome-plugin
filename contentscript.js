var IDLE_TIMEOUT = 30; //seconds
var IDLE_TIMEOUT_2 = 20;
var _localStorageKey = 'global_countdown_last_reset_timestamp';
var _idleSecondsTimer = null;
var _lastResetTimeStamp = (new Date()).getTime();
var _localStorage = null;




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
    var currentTimeStamp = (new Date()).getTime();
    var lastResetTimeStamp = GetLastResetTimeStamp();
    var secondsDiff = Math.floor((currentTimeStamp - lastResetTimeStamp) / 1000);
    if (secondsDiff <= 0) {
        ResetTime();
        secondsDiff = 0;
    }
    WriteProgress((IDLE_TIMEOUT - secondsDiff) + "");
    if (secondsDiff >= IDLE_TIMEOUT) {
        window.clearInterval(_idleSecondsTimer);
        ResetTime();
        alert("Time expired!");
        document.location.href = "logout.html";
    }
}

function idlecheck(){
	
	if(getCookie("DISPLAYNAME") != "guest"){
		
		console.log("juuh "+getCookie("DISPLAYNAME"));

		AttachEvent(document, 'click', ResetTime);
		AttachEvent(document, 'mousemove', ResetTime);
		AttachEvent(document, 'keypress', ResetTime);
		AttachEvent(window, 'load', ResetTime);

		try {
    		_localStorage = window.localStorage;
		}
		catch (ex) {
		}
		_idleSecondsTimer = window.setInterval(CheckIdleTime, 1000);
	}

}
window.onload=idlecheck;

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
/*
deleteUserLogonIdCookie();

logout('https://www.anttila.com/shop/Logoff?catalogId=1444&amp;myAcctMain=1&amp;langId=22&amp;storeId=1444&amp;deleteCartCookie=true&amp;URL=http%3A%2F%2Fwww.anttila.com%2Fshop%2Ffi%2Fnetanttila');

javascript:deleteUserLogonIdCookie();logout('https://www.anttila.com/shop/Logoff?catalogId=1444&myAcctMain=1&langId=22&storeId=1444&deleteCartCookie=true&URL=http%3A%2F%2Fwww.anttila.com%2Fshop%2Ffi%2Fnetanttila');
*/