(function(){
    "use strict";

    angular.module("etch")

        .directive("snapBlock", function(){
            return {
                restrict: "E",
                scope: {block: "="},
                replace: true,

                templateUrl: "partials/snapBlock.html",
                link: function($scope, $elem){
                    $elem[0].addEventListener("dragstart", function(event){
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
                        $elem[0].className += " md-accent";
                    });

                    $elem[0].addEventListener("dragend", function(event){
                        $elem[0].className = $elem[0].className.replace(/ md-accent/g, "");
                    })
                }
            }
        })
}());