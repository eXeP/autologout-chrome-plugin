internalStorage = {};
var idlet1 = 30;
var idlet2 = 15;

//tee tämä onchange storage!!

document.addEventListener('myFetchEvent', function(event) {
	
	/*chrome.runtime.sendMessage({method: "getIdle1"}, function(response) {
  		idlet1 = response;
	});
	chrome.runtime.sendMessage({method: "getIdle2"}, function(response) {
  		idlet2 = response;
	});*/
	
  	chrome.storage.sync.get({
  		idletime1: idlet1,
    	idletime2: idlet2

    	}, function(items) {
    		console.log(items);
    		if(items.idletime2 !== undefined){
    			console.log("id2 "+idlet2);
    			idlet2 = items.idletime2;
    			console.log("id2 "+idlet2);
    			idlet1 = items.idletime1;
    		}
    		respond();
    	
  	});
  	
    
});

function repond(){
	var dataFromPage = event.detail;
    var responseData = {"value":internalStorage[dataFromPage.key], "reqId":dataFromPage.reqId, "idle1":idlet1, "idle2":idlet2};
    var fetchResponse = new CustomEvent('fetchResponse', {"detail":responseData});
    document.dispatchEvent(fetchResponse);
    console.log("cs event sent");
}
console.log("cs valmis");
var s = document.createElement('script');
s.src = chrome.extension.getURL("injectscript.js");
(document.head||document.documentElement).appendChild(s);
s.parentNode.removeChild(s);

