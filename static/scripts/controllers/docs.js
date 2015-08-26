/* globals angular */
(function() {
	angular.module("etch")
	
	.controller("docsController", ["$scope", "$http", "$window", "$location", function($scope, $http, $window, $location){

        $http.get("pages/docs/data/docs.json").then(function(data){
			var docsData = data.data;

			for(var item in docsData){
                if(docsData.hasOwnProperty(item)) {
                    $scope[item] = docsData[item];
                }
			}

		});

		$scope.describe = "general";
		$scope.setDescribe = function(newDescribe) {
			$scope.describe = newDescribe;
            //$location.hash(newDescribe); // this would enable easy sharing of docs pages. Unfortunatly, it makes the page reload when you changes the has because we have hash based navigation. To think about. TODO: Store current describe in page hash

            $window.scrollTo(0, 0);
		};

        if($location.hash()){
            $scope.describe = $location.hash();
        }

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
}());