var runProjectScope;

(function(){
	"use strict";
	
	nunjucks.configure("/static/editor/templates", { autoescape: true });
	
	angular.module("render", [])
			
    .directive("runProject", function(){
        return {
            restrice: "E",
            
            templateUrl: "/static/editor/templates/run.html",
			controller: function($scope, $element){
				runProjectScope = $scope;
				
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
								run(xml)
							});
						};
					}
				};
				
			},
			controllerAs: "runProject"
        };
    })
    
	.service("renderService", ["$http", function($http){
		var that = this;
		
		that.project = function(project){
			return new Promise(function(resolve, reject){

				var scripts = {};
				for(var i = 0; i < project.length; i++){
					var sprite = project[i];

					if(sprite.script !== undefined){ 
						scripts[sprite.id] = sprite.script; 
					}
				}

				$http.post("/api/parse.json", {scripts: JSON.stringify(scripts)}).success(function(data){

					var globals = project[project.length-1]; //that is the last item
					var background = project[project.length-2]; //and the background is the next to last
					var sprites = project.slice(0, project.length-2); //and all but the last 2 are sprites

					resolve(nunjucks.render("template.snap.xml", { //render jinja template
						project: {
							globals: globals,
							background: background,
							sprites: sprites,

							scripts: data
						}
					 }))

				});

			});
		}
							   
	}]);
	
}());