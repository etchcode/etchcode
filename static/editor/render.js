(function(){
	nunjucks.configure("/static/editor/templates", { autoescape: true });
	
	angular.module("render", [])
	
	.service("runProjectService", function(){
		var that = this;
		
		that.show = false;
		
		that.init = function(player){
			that.loaded = false;
			
			player.addEventListener("load", function(){
				that.loaded = true;
			});

			that.run = function(project){
				that.show = true;
				
				if(that.loaded){
					player.contentWindow.postMessage({"action": "loadString", string: project}, "http://etchcodeusercontent.appspot.com");
				}
				else{
					player.onload = function(){
						player.contentWindow.postMessage({"action": "loadString", string: project}, "http://etchcodeusercontent.appspot.com"); //intentionally use onload so that asking to load a new project will cancel prev one
					};
				}
			};
		};
	})
			
    .directive("runProject", function(){
        return {
            restrice: "E",
            
            templateUrl: "/static/editor/templates/run.html",
			controller: ["$scope", "$element", "runProjectService", function($scope, $element, runProjectService){
				
				var player = $element.find("iframe.player")[0];
				runProjectService.init(player);
				
				$scope.service = runProjectService;
			}],
			controllerAs: "runController"
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