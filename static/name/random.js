var Random;

(function(){
	function random (){};
	
	random.prototype.words = false; //have we loaded all the word files
	random.prototype.load = function(){
		//this sets up everything so that we have all the files that we need
		
		return new Promise(function(success, failure){
			if(random.prototype.words){ //we have already loaded all the words
				success(random.prototype.words); // so give the existing words
			}
			else{ //we need to fetch new words
				var toLoad = ["/static/name/nouns.json", "/static/name/adjectives.json", "/static/name/verbs.json"]; //all the files that we need
				var loaded = []; //this is a list of the content of every file we have loaded, at loaded.length===toLoad.length we know we can move on

				var requests = []; //this is a list of all the requests that we are loading

				for(var i = 0; i < toLoad.length; i++){
					fileName = toLoad[i];

					requests.push(new XMLHttpRequest()); //add this request to the list

					requests[requests.length-1].addEventListener("load", function(event){
						//we successfully loaded this file	
						data = requests[loaded.length].response;
						
						data = (data === "") ? "[]" : data;
						
						loaded.push(data) //get the last request and remove it from this list and add it to the list to return	

						if(loaded.length == toLoad.length){
							
							random.prototype.words = {
								nouns: JSON.parse(loaded[0]),
								adjectives: JSON.parse(loaded[1]),
								verbs: JSON.parse(loaded[2])
							};

							success(random.prototype.words);
						}

					}, false);
					requests[requests.length-1].addEventListener("error", function(event){
						//there was an error loading this file. All is now over. Complain!
						alert("Error. Please report this.\
						\n(Code: Random nouns:load:error listener)");

					}, false);

					requests[requests.length-1].open("GET", fileName); //open this request
					requests[requests.length-1].send(); //and send it
				}

			}
		})
	}
	
	random.prototype.phrase = function(){
		data = random.prototype.words;
		
		var phrase = "";
			
		phrase += data.adjectives[Math.floor(Math.random()*data.adjectives.length)]+"-";
		phrase += data.nouns[Math.floor(Math.random()*data.nouns.length)]+"-";
		phrase += data.verbs[Math.floor(Math.random()*data.verbs.length)];

		return phrase;
	}
	
	Random = new random(); //set up the global Random object
}())
			