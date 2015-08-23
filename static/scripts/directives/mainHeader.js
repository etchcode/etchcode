(function (){
    angular.module("etch")

        .directive("mainHeader", function(){
            return {
                restrict: "E",


                templateUrl: "partials/mainHeader.html",
                controller: ["$scope", "$location", function($scope, $location){
                    $scope.pageType = function(){
                        switch ($location.path()) {
                            case "":
                                return "home";
                            default:
                                return "subpage";
                        }
                    }
                }]
            };
        });
}());