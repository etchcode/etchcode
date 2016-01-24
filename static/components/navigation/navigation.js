(function (){
    angular.module("etch")

    .directive("mainHeader", function(){
        return {
            restrict: "E",

            templateUrl: "static/components/navigation/navigation.html",
            controller: ["$scope", "$location", "$rootScope", "$mdMenu", "user",
                         "project", "google_platform",
                         function($scope, $location, $rootScope, $mdMenu, user,
                                  project, google_platform){
                $scope.$mdMenu = $mdMenu;
                $scope.sideNavOpen = false;

                $scope.toggleSideNav = function(){
                    $scope.sideNavOpen = !$scope.sideNavOpen;
                };

                $scope.create_project = function(){
                    project.create().then(function(response){
                        var new_url = "/project/" + response.data.key + "/edit";
                        $location.path(new_url);
                    });
                };

                $scope.logout = function(){
                    user.logout();
                };

                // login related code
                google_platform.after(function() {
                    gapi.signin2.render('login-button', {
                        'scope': 'email profile',
                        'width': 100,
                        'onsuccess': user.login,
                        'onfailure': user.login_failure
                    });
                });
            }]
        };
    });
}());
