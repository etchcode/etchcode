(function(){
    "use strict";

    angular.module("etch")

        .directive("blocksList", function(){
            return {
                restrict: "E",

                templateUrl: "static/pages/editor/blocksList/blocksList.html",
                controller: ["$scope", "$http", "blocksData", function($scope, $http, blocksData){
                    $scope.blocksListParent = "motion"; // the parent currently clicked on
                    $scope.blocks = blocksData.etchNames;
                    
                    $scope.setBlocksListParent = function(newParent){
                        $scope.blocksListParent = newParent;
                    };
                }]
            }
        })
}());