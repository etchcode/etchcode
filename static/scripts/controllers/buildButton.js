/* globals angular */

// take project and render it

(function(){
	angular.module("etch")
	
	.controller("buildButtonController", ["$scope", "renderService", "spriteData", function($scope, render, spriteData){
		this.dropdown = false;
		
		this.render = function(){
			render.project(spriteData.list).then(function(response){
				$scope.$apply(function(){
                    console.error(angular.element("runProject"));
					angular.element("runProject").scope().run(response); // refering to runProject directive in file directives/render.js
					angular.element("runProject").scope().show = true;
				});
			});
		};
	}]);
}());