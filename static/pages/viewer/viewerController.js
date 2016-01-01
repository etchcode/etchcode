angular.module("etch")
.controller("viewerController", ["$scope", "project", "$rootScope",
        "$routeParams", function($scope, project, $rootScope, $routeParams){
    $rootScope.page_name = "Viewer";
    _viewer = this;

    _viewer.project = {};
    _viewer.project.key = $routeParams.project_id;
    _viewer.project.snap_xml = null;

    project.fetch(_viewer.project.key).then(function(project){
        _viewer.project.snap_xml = project.snap_xml;
    });
}]);
