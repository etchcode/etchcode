function browserOldError(){
	alert("Because you are using an old browser, this web application will not work as intended.\nYou can continue to use the \
	web application at your own risk, or update to the current version of Google Chrome or Firefox.");
}

function getCaretXY(elem){
	var id = (new Date().getTime()+(Math.random()*10000) ) + "";
	
	var toFind = document.createElement("span");
	toFind.setAttribute("id", id);
	
if(!!window.Worker){ // the user supports web workers
	
	// autocomplete section
	var autocomplete = document.getElementById("autocomplete");

	var resets = [8, 13];
	
	var autocompleteWorker = new Worker("autocomplete.js");
	textarea.onkeypress = function(key){ // watch for letters typed
		autocompleteWorker.postMessage({"type": "keyPress", "letter": String.fromCharCode(key.charCode)});
	}
	
	textarea.onkeydown = function(key){ // also look for stuff like backspace
		if(resets.indexOf(key.keyCode) !== -1){
			autocompleteWorker.postMessage({"type": "clear"});
			autocomplete.innerHTML = "";
		}
	}
	
	autocompleteWorker.onmessage = function(message){		
		autocomplete.innerHTML = "";
		
		for(var i = 0; i < message.data.length; i++){
			
			var elem = document.createElement("li");
			elem.innerText = message.data[i];
			autocomplete.appendChild(elem);
		}
	}
}
else{
	browserOldError();
}