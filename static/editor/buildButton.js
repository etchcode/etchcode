(function(){
	angular.module("buildButton", ["sprites", "render"])
	
	.controller("buildButtonController", ["$scope", "renderService", "spriteData", function($scope, render, spriteData){
		this.dropdown = false;
		
		this.render = function(){
			render.project(spriteData.list).then(function(response){
				$scope.$apply(function(){
					angular.element("run-project").scope().run(response);
					angular.element("run-project").scope().show = true;
				});
			});
		};
	}]);
}());