(function () { /* globals nunjucks */
    "use strict";

    angular.module("etch")

    .service("renderService", ["$http", "toaster", function ($http, toaster) {
        var that = this;

        that.project = function (project) {
            // function accepts string project and returns a Promise that resolves to a string of the built project
            return new Promise(function (resolve) {
                var all_sprites = project.list.concat(project.background);

                var global_variables = project.general.variables;
                var scripts = {};
                var variables = {};
                var sprites = [];

                all_sprites.forEach(function(sprite){
                    var id = sprite.id;

                    sprites.push(id);
                    scripts[id] = sprite.script;
                    variables[id] = sprite.variables;
                });

                $http.post("/api/parse", {
                    scripts: scripts,
                    sprites: sprites,
                    variables: variables,
                    global_variables: global_variables
                }).success(function (data) {
                    console.log(data);
                    for (var sprite in data) {
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

                    resolve(nunjucks.render("snap_template.xml", { //render jinja template
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
