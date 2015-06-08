/* globals angular, Default */
(function() {
	"use strict";
	
	angular.module("syntaxHighlighter", [])
	
	.service("syntaxHighlighterService", function() {
		var that = this;
		
		var blocks = Default.blocks;
		
		this.tokenizer = function(string) {
			return string.split(/(\.|\,|\:|\(|\)|\n|\t)/);
		};
		
		this.categorizeToken = function(token) {
			function cleanToken (token){
				token = token.toLowerCase(); // tokens are case-insensitive
				token = token.replace(" ", ""); // and can contain spaces
				
				var shortened = blocks.abbreviations[token];
				
				return shortened ? shortened : token; // if there is a shortened version return it, else return the origional token
			}
			
			var cleanedToken = cleanToken(token);
			
			var tokenType;
			for(var type in blocks.snapNames) {
				if(blocks.snapNames[type][cleanedToken] || type == cleanedToken) {
					tokenType = type;
				}
			}
			
			if(tokenType){ 
				return tokenType;
			}
			else if(token.match(/^(\"(.*)\"|\'(.*)\')$/)) {
				return "string";
			}
			else if(token.match(/^[0-9]*$/)) {
				return "number";
			}
			else {
				return "unknown";
			}
		};
		
		this.highlightTokens = function(tokens){
			var marked = []; // list of tokens with classed spans around themselves
			
			for(var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var category = that.categorizeToken(token);
				
				if(token !== "") {
					marked.push('<span class="' + category + ' token">' + token + '</span>');
				}
			}
			
			return marked.join("");
		};
		
		this.highlight = function(string){
			var tokens = that.tokenizer(string);
			
			return that.highlightTokens(tokens);
		};
		
	});
	
}());