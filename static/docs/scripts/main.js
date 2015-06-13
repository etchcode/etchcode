/* globals angular, location, marked */
(function(){
	"use strict";
	
	angular.module("docs", ["ngSanitize"])
	
	.filter("title", function() {
		return function(input) {
			var asList = input.split(" ");
			
			var result = "";
			asList.forEach(function(item) {				
				result += " " + item[0].toUpperCase() + item.substr(1, item.length);
			});
			
			return result;
		};
	})
	
	.filter("markdown", ["$sce", function($sce) {
		// set up markdown support
		marked.setOptions({
			smartypants: true
		});
	
		return function(input){
			return $sce.trustAsHtml(
				"<div class=\"markdown-body\">" + marked(input) + "</div>"
			);
		};
	}])
	.directive("markdown", function() {
		return {
			restrict: "A",
			link: function($scope, $element){
				var elem = $element[0];
				
				elem.className.replace(/ markdown\-body/g, "");
				elem.className += " markdown-body";
				
				elem.innerHTML = marked(elem.textContent);
			}
		};
	})
	
	.directive("generalDocumentation", function() {
		return {
			restrict: "E",
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
		
		$scope.describe = location.hash ? location.hash.substr(1, location.hash.length) : "general";

		$scope.setDescribe = function(newDescribe) {
			$scope.describe = newDescribe;
		};
		
		$scope.$watch("describe", function() {
			location.hash = "#" + $scope.describe;
		});
		
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