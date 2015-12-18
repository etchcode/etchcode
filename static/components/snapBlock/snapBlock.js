(function(){
    "use strict";

    angular.module("etch")

        .directive("snapBlock", function(){
            return {
                restrict: "E",
                scope: {block: "="},
                replace: true,

                templateUrl: "static/components/snapBlock/snapBlock.html",
                link: function($scope, $elem){
                    var elem = $elem[0];
                                        
                    // drag-and-drop code
                    elem.addEventListener("dragstart", function(event){
                        var block = $scope.block;
                        var text = block.name;

                        if(block.type == 'function'){
                            text += "(";
                            text += block.example.join(", ");
                            text += ")\n";
                        }
                        else if(block.type == 'reporter'){
                            text += "\n";
                        }
                        else if(block.type == 'block'){
                            if(block.example){
                                text += "(";
                                text += block.example.join(", ");
                                text += ")";
                            }

                            text += ":\n\t";
                        }

                        event.dataTransfer.setData("text", text);
                        elem.className += " md-accent";
                    });

                    elem.addEventListener("dragend", function(event){
                        elem.className = $elem[0].className.replace(/ md-accent/g, "");
                    });
                }
            };
        });
}());