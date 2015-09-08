(function () {
	"use strict";
		
	angular.module("etch")
			
    .directive("runProject", function () {
        return {
            restrict: "E",
            replace: true,
            
            templateUrl: "partials/runProject.html",
			controller: function($scope, $element){
				$scope.loaded = false;
				$scope.show = true;
                $scope.large = false; // default view is inline but if this is true the editor will be fullscreen
                $scope.running = false;

				var player = $element[0].getElementsByClassName("player")[0];

				player.addEventListener("load", function(){
					//listen for when the player is loaded and update whether or not it is updated
					$scope.$apply(function(){
						$scope.loaded = true;
					});
				});
				
				$scope.run = function(xml){
					function run(toRun){
                        $scope.$apply(function() {
                            $scope.show = true;
                            $scope.running = true;

                            player.contentWindow.postMessage({
                                "action": "loadString",
                                "string": toRun
                            }, "http://etchcodeusercontent.appspot.com/player"); // this postMessage must be done once the iframe is loaded
                        });
					}
					
					if($scope.loaded){ // if the iframe is loaded
						run(xml); // run it 
					}
					else{ // otherwise
						player.onload = function(){ //with .onload we will only have one run waiting
                            run(xml); // run it later
						};
					}
				};
				
			},
			controllerAs: "runProject"
        };
    });
	
}());