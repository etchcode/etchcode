/* globals angular */
(function(){	
	"use strict";
	
	angular.module("editor", ["sprites"])
	
	.service("editorsService", function(){
		this.view = "code"; // code || settings, what view the user is in
	})
	
	.controller("editorsController", ["editorsService", function(editorsService){ // a controller of the editors view
		this.service = editorsService;

	}])
	
	.directive("editor", function(){ // a directive for inserting editor elements
		return {
			restrict: "E",
			templateUrl: "/static/editor/templates/editor.html",
			controller: ["$scope", "$element", function($scope) { // this controller is for individual editor elements
				$scope.codemirrorConfig = {
					lineNumbers: true,
					indentWithTabs: true,
					theme: "ambiance",
					mode: "etch"
				};
				
			}],
			controllerAs: "editor"
		};
	});
	
}());