(function(){	
	"use strict";
	
	angular.module("etch")
	
	.controller("editorController", ["$scope", "spriteData", "$rootScope", function($scope, spriteData, $rootScope){ // a controller of the editor view
        $rootScope.pageName = "Editor";
	}]);
}());