(function(){
    "use strict";

    angular.module("etch")
        .directive("spritesList", function(){
           return {
                restrict: "E",
                templateUrl: "static/pages/editor/spritesList/spritesList.html"
            };
        });
}());