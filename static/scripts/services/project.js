angular.module("etch").service("project", ["api", "random", function(api, random){
    var _project = this; // project scope

    _project.create = function(name){
        // create a new project and get an id
        name = name || random.phrase();
        return api.create_project(undefined, {name: name});
    };
    _project.fetch = function(key){
        // fetch the project w/ this id from the server
        return new Promise(function(resolve, reject){
            api.fetch_project({key: key})
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
    _project.change = function(key, project){
        return api.change_project(project, {key: key});
    };
    _project.delete = function(key){
        // delete the project w/ this id
        return api.delete_project({key: key});
    };
    _project.fetch_all = api.fetch_projects;
}]);
