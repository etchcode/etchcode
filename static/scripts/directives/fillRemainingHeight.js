(function(){
    angular.module("etch")
    
    .directive("fillRemainingHeight", function(){
        // expands an element to fill from it's current top to the bottom of the screen (without scrolling)
        return {
            restrict: "A",
            link: function($scope, $elem){
                var elem = $elem[0]; // get the element outside of it's jqLite container
                
                function size(){
                    var spaceAboveElem = elem.getBoundingClientRect().top;
                    var heightOfPage = window.innerHeight;

                    elem.style.height = heightOfPage - spaceAboveElem + "px";
                    console.log(spaceAboveElem, heightOfPage);
                }
                
                addEventListener("resize", function(){
                    size();
                });
                
                size(); // size it for the first time
            }
        };
    });
}());