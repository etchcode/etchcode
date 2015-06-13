/* globals angular */
(function(){
	"use strict";
	
	angular.module("docs", [])
	
	.filter("title", function() {
		return function(input) {
			return input[0].toUpperCase() + input.substr(1, input.length);
		};
	})
	
	.directive("generalDocumentation", function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "templates/general_documentation.html"
		};
	})
			
	.controller("docsController", ["$scope", "$http", function($scope, $http) {
		$http.get("docs.json").then(function(data){
			var docsData = data.data;
			
			for(var item in docsData){
				$scope[item] = docsData[item];
			}
		});
		
		$scope.serveProperty = function(property) {
			// properties can be objects or strings, this return what to use either way
			if(typeof(property) == "string") {
				return {"name": property, value: ""};
			}
			else {
				var name = Object.keys(property)[0];
				
				return {"name": name, "property": property[name]};
			}
		};
		
		$scope.describe = "general"; // this is what is shown in the main view
	}]);
}());