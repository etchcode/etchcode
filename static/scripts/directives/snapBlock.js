(function(){
    "use strict";

    angular.module("etch")

        .directive("snapBlock", function(){
            return {
                restrict: "E",
                scope: {block: "="},
                replace: true,

                templateUrl: "partials/snapBlock.html",
                controller: ["$scope", function($scope){
                }]
            }
        })
}());