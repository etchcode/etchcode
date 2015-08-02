/* globals angular */
(function(){	
	"use strict";
	
	angular.module("etch")
	
	.controller("editorsController", ["$scope", "spriteData", function($scope, spriteData){ // a controller of the editors view
		this.view = "code";
        console.info(this.view);
        $scope.$watch("view", function(newValue, oldValue) {
        console.info(newValue);
    })
	}]);
}());