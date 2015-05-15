(function(){
	angular.module("buildButton", ["sprites", "render"])
	
	.service("built", function(){
		this.xml = "";
	})
	
	.controller("buildButtonController", ["renderService", "spriteData", "runProjectService", function(render, spriteData, runProjectService){
		this.dropdown = false;
		
		this.render = function(){
			render.project(spriteData.list).then(function(response){
				console.log(response);
				a = response;
				
				runProjectService.run(response);
			});
		};
	}]);
}());