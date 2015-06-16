/* globals angular */

(function(){
	"use strict";
		
	angular.module("etch")
			
    .directive("runProject", function(){
        return {
            restrice: "E",
            
            templateUrl: "partials/runProject.html",
			controller: function($scope, $element){
				$scope.loaded = false;
				$scope.show = false;
				
				var player = $element.find("iframe.player")[0];
				
				player.addEventListener("load", function(){
					//listen for when the player is loaded and update whether or not it is updated
					$scope.$apply(function(){
						$scope.loaded = true;
					});
				});
				
				$scope.run = function(xml){
					function run(toRun){
						$scope.show = true;
						player.contentWindow.postMessage({"action": "loadString", "string": toRun}, "http://etchcodeusercontent.appspot.com/player");
					}
					
					if($scope.loaded){
						run(xml);
					}
					else{
						player.onload = function(){ //with .onload we will only have one run waiting
							$scope.$apply(function(){
								run(xml);
							});
						};
					}
				};
				
			},
			controllerAs: "runProject"
        };
    });
	
}());