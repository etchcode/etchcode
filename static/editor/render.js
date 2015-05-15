(function(){
	nunjucks.configure("/static/editor/templates", { autoescape: true });
	
	angular.module("render", [])
	
    .directive("runProject", function(){
        return {
            restrice: "E",
            
            templateUrl: "/static/editor/templates/run.html"
        }
    })
    
	.service("renderService", ["$http", function($http){
		var that = this;
		
		that.project = function(project){
			console.log(project);
            
            var scripts = {};
            for(var i = 0; i < project.length; i++){
                var sprite = project[i];
                
                if(sprite.script !== undefined){ 
                    scripts[sprite.id] = sprite.script; 
                };
            }
                        
            $http.post("/api/parse.json", {scripts: JSON.stringify(scripts)}).success(function(data){
                console.log(data);
                
                var globals = project[project.length-1]; //that is the last item
                var background = project[project.length-2]; //and the background is the next to last
                var sprites = project.slice(0, project.length-2); //and all but the last 2 are sprites
                
                window.open("data:text/xml," + nunjucks.render("template.snap.xml", { //render jinja template
                    project: {
                        globals: globals,
                        background: background,
                        sprites: sprites,
                        
                        scripts: data
                    }
			     }))
                
            });
			            
		};
	}]);
	
}());