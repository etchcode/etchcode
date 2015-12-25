angular.module("etch").controller("projectsController", ["$rootScope", "$scope", "project", function ($rootScope, $scope, project){
    $rootScope.pageName = "Projects";
    _projects = this;

    _projects.list = [];
    project.fetch_all()
    .then(function(response){
        _projects.list = response.data.projects;
    });

    _projects.delete = function(key){
        project.delete(key).then(function(response){
            _projects.list = _projects.list.filter(function(item){
                if(item.key == key){
                    return false;
                }
                else{
                    return true;
                }
            });
        });
    };
}]);
