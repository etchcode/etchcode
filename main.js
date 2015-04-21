function browserOldError(){
	alert("Because you are using an old browser, this web application will not work as intended.\nYou can continue to use the \
	web application at your own risk, or update to the current version of Google Chrome or Firefox.");
}

function getCaretXY(elem){
	var id = (new Date().getTime()+(Math.random()*10000) ) + ""; // generate a unique id
	
	var toFind = document.createElement("span"); // create a span
	toFind.setAttribute("id", id); // set the span's id to our unique id
	
	window.getSelection().getRangeAt(0).insertNode(toFind); // insert our span at the cursor position
	
	var position = document.getElementById(id).getBoundingClientRect();
	
	document.getElementById(id).remove();
	
	return position;
}

if(!!window.Worker){ // the user supports web workers
	
	// autocomplete section
	var autocomplete = document.getElementById("autocomplete");

	var resets = [8, 13, 57, 48]; // keyCodes that reset the current tokens
	
	var autocompleteWorker = new Worker("autocomplete.js");
	textarea.onkeypress = function(key){ // watch for letters typed
		autocompleteWorker.postMessage({"type": "keyPress", "letter": String.fromCharCode(key.charCode)});
	}
	
	textarea.onkeydown = function(key){ // also look for stuff like backspace
		if(resets.indexOf(key.keyCode) !== -1){
			autocompleteWorker.postMessage({"type": "clear"});
			autocomplete.style.display = "none";
		}
	}
	
	autocompleteWorker.onmessage = function(message){		
		autocomplete.innerHTML = "";
				
		for(var i = 0; i < message.data.length; i++){
			
			var elem = document.createElement("li");
			elem.innerText = message.data[i];
			autocomplete.appendChild(elem);
		}
		
		var currentPosition = getCaretXY();
		
		autocomplete.style.top = (currentPosition.top + 17) + "px";
		autocomplete.style.left = currentPosition.left + "px";
		
		autocomplete.style.display = "block";
	}
}
else{
	browserOldError();
}