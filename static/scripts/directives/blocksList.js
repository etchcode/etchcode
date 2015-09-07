(function(){
    "use strict";

    angular.module("etch")

        .directive("blocksList", function(){
            return {
                restrict: "E",

                templateUrl: "partials/blocksList.html",
                controller: ["$scope", "$http", function($scope, $http){
                    $scope.blocks = {};
                    $scope.scratchParentOrder = [ // the order of the categories in scratch. Goes across row by row
                        "Motion",
                        "Events",
                        "Looks",
                        "Control",
                        "Sound",
                        "Sensing",
                        "Pen",
                        "Operators",
                        "Data"
                    ]

                    $http.get("/api/blocks.json").then(function(response){
                        if(response.status === 200){
                            $scope.blocks = response.data.snapNames;
                        }
                        else{
                            throw new Error("Failed to load blocks.json");
                        }
                    })
                }],
            }
        })
}());