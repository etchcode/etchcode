/*globals angular */
(function () {
	"use strict";
	
	angular.module("etch")
	
	.directive("sprite", function(){
		return {
			restrict: "E",
			templateUrl: "partials/sprite.html",
		};
	});
	
}());