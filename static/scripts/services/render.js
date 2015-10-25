/* globals angular, nunjucks, Promise */

var p;

(function () {
    "use strict";

    angular.module("etch")

    .service("renderService", ["$http", "toaster", function ($http, toaster) {
        var that = this;

        that.project = function (project) {
            // function accepts string project and returns a Promise that resolves to a string of the built project
            return new Promise(function (resolve) {

                var all = project.list.concat(project.background).concat(project.general);
                
                var scripts = {};
                var sprites = [];
                for (var i = 0; i < all.length; i++) {
                    // for every script in the project build a dictionary with scipts labled by their sprite name
                    var sprite = all[i];
                        
                    sprites.push(sprite.id);
                    scripts[sprite.id] = sprite.script;
                }

                $http.post("/api/parse.json", {
                    scripts: JSON.stringify(scripts),
                    sprites: JSON.stringify(sprites)
                }).success(function (data) {
                    for (sprite in data) {
                        if (data[sprite].message) {
                            toaster.pop({
                                type: "error",
                                title: ("Error on sprite " + sprite),
                                body: (data[sprite].message + "\n On line " + data[sprite].lineNumber)
                            });
                        }
                    }
                    var globals = project.general; 
                    var background = project.background;
                    var sprites = project.list;

                    p = {
                        globals: globals,
                        background: background,
                        sprites: sprites,

                        scripts: data.code
                    }
                    
                    console.info(p);

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