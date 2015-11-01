(function (){
    angular.module("etch")

        .directive("mainHeader", function(){
            return {
                restrict: "E",

                templateUrl: "components/navigation/mainHeader.html",
                controller: ["$scope", "$location", "$rootScope", function($scope, $location){
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