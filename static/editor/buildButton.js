(function(){
	angular.module("buildButton", ["sprites", "render"])
	
	.service("built", function(){
		this.xml = "";
	})
	
	.controller("buildButtonController", ["$rootScope", "renderService", "spriteData", function($rootScope, render, spriteData, runProjectService){
		this.dropdown = false;
		
		this.render = function(){
			render.project(spriteData.list).then(function(response){
				console.log(response);
                
                $rootScope.$broadcast("runProject", {"hello": "world"});
			});
		};
	}]);
}());