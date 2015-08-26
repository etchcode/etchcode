/* globals angular */
(function() {
    angular.module("etch")

        .directive("etchCode", function() {
            return {
                restrict: "E",
                template: "",
                link: function($scope, $element){
                    var elem = $element[0]; // the raw DOM node instead of an angular wrapper

                    $scope.config = {
                        lineNumbers: true,
                        indentWithTabs: true,
                        theme: "ambiance",
                        mode: "python",
                        readOnly: true
                    };

                    var codemirrorElem = document.createElement("div")
                    codemirrorElem.setAttribute("ui-codemirror", "config");
                    codemirrorElem.innerHTML = elem.innerHTML;

                    elem.parentNode.replaceChild(codemirrorElem, elem);
                }
            };
        });
}());