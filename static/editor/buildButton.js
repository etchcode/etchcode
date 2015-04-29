(function(){
	angular.module("buildButton", ["sprites"])
	
	.service("built", function(){
		this.xml = "";
	})
	
	.controller("buildButtonController", function(){
		this.dropdown = false;
	})
}());