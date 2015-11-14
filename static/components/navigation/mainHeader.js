(function (){
    angular.module("etch")

        .directive("mainHeader", function(){
            return {
                restrict: "E",

                templateUrl: "static/components/navigation/mainHeader.html",
                controller: ["$scope", "$location", "$rootScope", "account", function($scope, $location, $rootScope, account){
                    $scope.sideNavOpen = false;
                    
                    $scope.pageType = function(){
                       switch ($location.path()) {
                            case "/":
                                return "home";
                            default:
                                return "subpage";
                        }
                    };
                    
                    $scope.toggleSideNav = function(){
                        $scope.sideNavOpen = !$scope.sideNavOpen;
                    };
                }]
            };
        });
}());