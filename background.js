chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getIdle1")
      sendResponse(getIdle1());
  	else if (request.method == "getIdle2")
      sendResponse(getIdle2());
    
});

function getIdle1(){
	chrome.storage.sync.get({
    	idletime1: 30,
  	}, function(items) {
    	return items.idletime1;
  	});
}

function getIdle2(){
	chrome.storage.sync.get({
    	idletime2: 15,
  	}, function(items) {
    	return items.idletime2;
  	});
}