(function(){
	angular.module("buildButton", ["sprites", "render"])
	
	.service("built", function(){
		this.xml = "";
	})
	
	.controller("buildButtonController", ["renderService", function(render){
		this.dropdown = false;
		
		this.render = function(project){
			return render.project(project);
		};
	}]);
}());