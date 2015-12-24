angular.module("etch").service("project", ["api", function(api){
    var _project = this; // project scope

    _project.create = function(){
        // create a new project and get an id
        console.log("pretend creating project");
    };
    _project.fetch = function(id){
        // fetch the project w/ this id from the server
        return new Promise(function(resolve, reject){
            api.fetch_project(id)
            .then(function success(response){
                resolve(response.data);
            });
        });
    };
    _project.change = function(json){
        // modify the project w/ this id
        console.info("pretend updating", _project.id, "with", json);
    };
    _project.delete = function(){
        // delete the project w/ this id
        console.info("pretend deleting", _project.id);
    };
}]);
