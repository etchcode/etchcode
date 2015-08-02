/* globals angular */

// take project and render it

(function(){
	angular.module("etch")
	
	.controller("buildButtonController", ["$scope", "renderService", "spriteData", function($scope, render, spriteData){
		this.dropdown = false;
		
		this.render = function(){
			render.project(spriteData.list).then(function(response){
				$scope.$apply(function(){
                    
					angular.element("run-project").scope().run(response); // refering to runProject directive in file directives/render.js
					angular.element("run-project").scope().show = true;
				});
			});
		};
	}]);
}());