/*globals angular */
(function () {
	"use strict";
	
	angular.module("etch")
	
	.directive("sprite", function(){
		return {
			restrict: "E",
			replace: true,
			templateUrl: "partials/sprite.html",
		};
	});
	
}());