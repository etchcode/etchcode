/* globals angular */
(function() {
	angular.module("etch")
	
	.controller("docsController", ["$scope", "$http", "$window", function($scope, $http, $window){
		$http.get("pages/docs/data/docs.json").then(function(data){
			var docsData = data.data;

			for(var item in docsData){
				$scope[item] = docsData[item];
			}
		});

		$scope.describe = "general";
		$scope.setDescribe = function(newDescribe) {
			$scope.describe = newDescribe;
            $window.scrollTo(0, 0)
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
}());