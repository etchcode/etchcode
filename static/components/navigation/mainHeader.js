(function (){
    angular.module("etch")

    .directive("mainHeader", function(){
        return {
            restrict: "E",

            templateUrl: "static/components/navigation/mainHeader.html",
            controller: ["$scope", "$location", "$rootScope", "$mdMenu", "user",
                         "project", "random", function($scope, $location,
                                                       $rootScope, $mdMenu,
                                                       user, project, random){
                $scope.$mdMenu = $mdMenu;
                $scope.user = user.user;
                $scope.sideNavOpen = false;

                $scope.toggleSideNav = function(){
                    $scope.sideNavOpen = !$scope.sideNavOpen;
                };

                $scope.create_project = function(){
                    var name = random.phrase();
                    project.create(name).then(function(response){
                        var new_url = "/project/" + response.data.key + "/edit";
                        $location.path(new_url);
                    });
                };
            }]
        };
    });
}());
