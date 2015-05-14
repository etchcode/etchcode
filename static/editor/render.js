(function(){
	nunjucks.configure("/static/editor/templates", { autoescape: true });
	
	angular.module("render", [])
	
	.service("renderService", ["$http", function($http){
		var that = this;
		
		that.project = function(project){

			var globals = project[project.length-1]; //that is the last item
			var background = project[project.length-2]; //and the background is the next to last
			var sprites = project.slice(0, project.length-2); //and all but the last 2 are sprites
			
            var scripts = {};
            for(var i = 0; i < project.length; i++){
                var sprite = project[i];
                
                if(sprite.script){ 
                    scripts[sprite.id] = sprite.script; 
                };
            }
            
            console.log(scripts);
            
            $http.post("/api/parse.json", {scripts: scripts}).success(function(data){
                console.log(data);
                
            });
            
			var globals = project[project.length-1]; //that is the last item
			var background = project[project.length-2]; //and the background is the next to last
			var sprites = project.slice(0, project.length-2); //and all but the last 2 are sprites
			
            return;
            
			return nunjucks.render("template.snap.xml", { //render jinja template
				project: {
					globals: globals,
					background: background,
					sprites: sprites
				}
			});
		};
	}]);
	
}());