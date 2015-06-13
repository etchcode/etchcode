/* globals angular, window */
(function() {
	angular.module("colorInput", ["toaster"])
	
	.controller("colorInputController", ["$scope", "toaster", function($scope, toaster) {
		$scope.expanded = false;
		$scope.color = "0, 0, 0, 1";
		
		function hexToRgb(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", 1"
			: "0, 0, 0, 1";
		}
		
		// set up farbtastic
		angular.element(".colorpickerContainer").farbtastic(function(color) {
			$scope.$apply(function() {
				$scope.color = hexToRgb(color);
			});
		});
		
		$scope.select = function() {
			var elem = angular.element(".colorpickerValue")[0];
			elem.select();
		};
		
	}]);
}());