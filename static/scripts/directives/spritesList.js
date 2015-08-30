(function(){
    "use strict";

    angular.module("etch")
        .directive("spritesList", function(){
           return {
                restrict: "E",

                templateUrl: "partials/spritesList.html"
            };
        });
}());