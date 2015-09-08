(function(){
    "use strict";

    angular.module("etch")

        .directive("blocksList", function(){
            return {
                restrict: "E",

                templateUrl: "partials/blocksList.html",
                controller: ["$scope", "$http", function($scope, $http){
                    $scope.blocks = {};
                    $scope.blocksListParent = "Motion"; // the parent currently clicked on

                    $scope.setBlocksListParent = function(newParent){
                        $scope.blocksListParent = newParent;
                    };

                    $http.get("pages/docs/data/docs.json").then(function(response){
                        if(response.status === 200){
                            $scope.blocks = response.data.etchNames;
                        }
                        else{
                            throw new Error("Failed to load blocks.json");
                        }
                    })
                }]
            }
        })
}());