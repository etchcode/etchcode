angular.module("etch").directive("markdown", function() {
    return {
        restrict: "A",
        link: function($scope, $element){
            var elem = $element[0];

            elem.className.replace(/ markdown\-body/g, "");
            elem.className += " markdown-body";

            elem.innerHTML = marked(elem.textContent);
        }
    };
});
