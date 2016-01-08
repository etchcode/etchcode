angular.module("etch").controller("docsController", ["$scope", "$http",
                                                     "$window", "$location",
                                                     "blocksData",
                                  function($scope, $http, $window, $location,
                                           blocksData){
    $scope.abbreviations = blocksData.abbreviations;
    $scope.etchNames = blocksData.etchNames;
    $scope.describe = "general";

    $scope.setDescribe = function(newDescribe) {
        $scope.describe = newDescribe;
        //$location.hash(newDescribe); // this would enable easy sharing of docs pages. Unfortunatly, it makes the page reload when you changes the has because we have hash based navigation. To think about. TODO: Store current describe in page hash

        $window.scrollTo(0, 0);
    };

    $scope.inputType = function(type, item){
        // check if an item takes an input type
        if(item.inputTypes){
            return item.inputTypes.indexOf(type) !== -1;
        }
        else{
            return false;
        }
    };
}]);
