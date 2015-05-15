(function(){
	angular.module("buildButton", ["sprites", "render"])
	
	.service("built", function(){
		this.xml = "";
	})
	
	.controller("buildButtonController", ["renderService", "spriteData", function(render, spriteData){
		this.dropdown = false;
		
		this.render = function(){
			return render.project(spriteData.list);
		};
	}]);
}());