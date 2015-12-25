angular.module("etch").directive("validUsername", function(){
    return {
        restrict: "A",
        require: "ngModel", // elem must have ng-model on it already
        link: ["$scope", "$elem", "$attrs", "ngModel", function($scope, $elem, $attrs, $ngModel){
            ngModel.$parsers.unshift(function(value){

            });
        }]
    };
});
