/* globals angular, nunjucks, Promise */

var p;

(function(){
	"use strict";
		
	angular.module("etch")
			
	.service("renderService", ["$http", "toaster", function($http, toaster){
		var that = this;
		
		that.project = function(project){
			// function accepts string project and returns a Promise that resolves to a string of the built project
			return new Promise(function(resolve){

				var scripts = {};
                var sprites = [];
				for(var i = 0; i < project.length; i++){
					// for every script in the project build a dictionary with scipts labled by their sprite name
					var sprite = project[i];
                    if (i < project.length-2){
                        
                        sprites.push(project[i].id);}
//                    console.info(project[i]);
//                    console.info("id"+project[i].id);
//                    console.log(sprites);
					if(sprite.script !== undefined){ 
						scripts[sprite.id] = sprite.script; 
					}
				}
                
                
                
				$http.post("/api/parse.json", {scripts: JSON.stringify(scripts),sprites: JSON.stringify(sprites)}).success(function(data){
                    for(sprite in data){
                        
                       
                            
//                            console.info(project[i])
//                            console.info("sprite"+sprite);
//                    console.info();
                        if(data[sprite].message){
                    toaster.pop({
						type: "error",
						title: ("Error on sprite " + sprite),
						body: (data[sprite].message + "\n On line " + data[sprite].lineNumber)
					});}}
					var globals = project[project.length-1]; //that is the last item
					var background = project[project.length-2]; //and the background is the next to last
                    var sprites = project.slice(0, project.length-2);//and all but the last 2 are sprites
//                    console.info("data: " +data);
//                    data = '<scripts><script x="116" y="14"><block s="receiveGo"/><block s="doThink"><l>Hello, World</l></block><block s="forward"><block s="reportSum"><l>30</l><l>5</l></block></block><block s="doWait"><l>3</l></block><block s="doThink"><l>Etch is cool</l></block><block s="gotoXY"><l>12</l><l>21</l></block></script></scripts>';
//                    console.info("data: " +data);
                    console.log(data)
                    p =	{
                        globals: globals,
                        background: background,
                        sprites: sprites,

                        scripts: data.code
                    }

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