angular.module("etch").controller("projectsController", ["$rootScope", "$scope", "project", function ($rootScope, $scope, project){
    $rootScope.pageName = "Projects";
    _projects = this;
    _projects.search_text = "";

    function fetch_all(){
        project.fetch_all()
        .then(function(response){
            _projects.all = response.data.projects;
        });
    }
    _projects.all = [];
    fetch_all();

    _projects.list = function(){
        return _projects.all.filter(function(project){
            if(project.name.indexOf(_projects.search_text) !== -1){
                return true;
            }
            else{
                return false;
            }
        });
    };

    _projects.delete = function(key){
        project.delete(key).then(function(response){
            _projects.all = _projects.all.filter(function(item){
                if(item.key == key){
                    return false;
                }
                else{
                    return true;
                }
            });
        });
    };

    _projects.create = function(name){
        project.create(name).then(function(){
            fetch_all();
        });
    };
}]);
