(function(){
	"use strict";

	angular.module("etch")

	.directive("editor", function(){ // a directive for inserting editor elements
		return {
			restrict: "E",
			templateUrl: "static/components/editor/editor.html",
			controller: ["$scope", "$element", function($scope) {
				$scope.codemirrorConfig = {
					lineNumbers: true,
					indentWithTabs: true,
					theme: "xq-light",
					mode: "etch"
				};

			}],
			controllerAs: "editor"
		};
	});

}());
