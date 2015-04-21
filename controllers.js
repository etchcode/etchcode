(function(){
	var app = angular.module("webapp", ["sprites", "editor"]);
	
	localforage.config({
    	name: 'Etch Code Editor'
	});
}());