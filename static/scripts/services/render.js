/* globals angular, nunjucks, Promise */

(function(){
	"use strict";
		
	angular.module("etch")
			
	.service("renderService", ["$http", function($http){
		var that = this;
		
		that.project = function(project){
			return new Promise(function(resolve){

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
					 }));

				});

			});
		};
							   
	}]);
	
}());