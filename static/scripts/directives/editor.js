/* globals angular */
(function(){	
	"use strict";
	
	angular.module("etch")
	
	.directive("editor", function(){ // a directive for inserting editor elements
		return {
			restrict: "E",
			templateUrl: "partials/editor.html",
			controller: ["$scope", "$element", function($scope) { // this controller is for individual editor elements
				$scope.codemirrorConfig = {
					lineNumbers: true,
					indentWithTabs: true,
					theme: "ambiance",
					mode: "python"
				};
				
			}],
			controllerAs: "editor"
		};
	});
	
}());