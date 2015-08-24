/*globals angular */
(function () {
	"use strict";
	
	angular.module("etch")
	
	.directive("sprite", function(){
		return {
			restrict: "E",
			replace: true,
			templateUrl: "partials/sprite.html",
            controller: function($scope){
                $scope.removeIconColor = function(){
                    switch($scope.sprites.current === $scope.sprite.id){
                        case true:
                            return "white";
                        case false:
                            return "black";
                    }
                };
            }
		};
	});
	
}());