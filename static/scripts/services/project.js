angular.module("etch").service("project", ["api", function(api){
    var _project = this; // project scope

    _project.create = function(){
        // create a new project and get an id
        console.log("pretend creating project");
    };
    _project.fetch = function(id){
        // fetch the project w/ this id from the server
        return new Promise(function(resolve, reject){
            api.fetch_project({id: id})
            .then(function success(response){
                if(response.data.error){
                    reject(response.data.error);
                }
                else{
                    resolve(response.data);
                }
            });
        });
    };
    _project.change = function(id, JSON){
        return api.change_project(JSON, {id: id});
    };
    _project.delete = function(){
        // delete the project w/ this id
        console.info("pretend deleting", _project.id);
    };
}]);
