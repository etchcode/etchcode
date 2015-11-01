(function(){
    "use strict";

    angular.module("etch")
        .directive("spritesList", function(){
           return {
                restrict: "E",

                templateUrl: "pages/editor/spritesList/spritesList.html"
            };
        });
}());