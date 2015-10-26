(function(){ /* globals document, console, FileReader, angular */
    "use strict";
    
    angular.module("etch")
    .directive("fileUpload", function(){
        // an attribute to turn a button into a file upload button. Simply add the attribute file-upload="variableToLinkResultTo" the optional attribute file-upload-restrict-type is documented below.
        
        return {
            restrict: "A",
            scope: {
                fileUpload: "=", // a variable to link the results of the file upload to ng-model style
                fileUploadRestrictType: "=" // a list of types to restrict to (ussing accept attribute on input). See http://stackoverflow.com/q/4328947/3164117
            },
            link: function($scope, $elem, attrs, controller){
                var elem = $elem[0];
                
                var inputElem = document.createElement("input");
                inputElem.setAttribute("type", "file");
                inputElem.setAttribute("accept", $scope.fileUploadRestrictType);
                inputElem.style.display = "none";
                elem.appendChild(inputElem);
                
                elem.addEventListener("click", function(){
                    inputElem.click();
                });
                
                inputElem.addEventListener("change", function(event){
                    var file = event.target.files[0];
                    var reader = new FileReader();
                    
                    reader.onloadend = function(){                        
                        $scope.$apply(function(){ // we need to get back into ng-land
                            $scope.fileUpload = reader.result;
                        }); 
                    };
                    
                    reader.readAsDataURL(file); //when this is done reader.onloadend will be called
                });
            }
        };
    });
}());