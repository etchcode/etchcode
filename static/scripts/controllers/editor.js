/* globals angular */
(function(){	
	"use strict";
	
	angular.module("etch")
	
	.controller("editorsController", ["$scope", "spriteData", function($scope, spriteData){ // a controller of the editors view
		this.view = "code";
	}]);
}());