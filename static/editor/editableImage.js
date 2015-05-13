(function (){
	angular.module("editableImage", [])
	
	.directive("editableImage", function(){
		return {
			restrict: "E",
			require: "ngModel",
			
			templateUrl: "/static/editor/templates/editableImage.html",
			link: function($scope, $elem, $attrs, ngModel){
				
			},
		};
	});
}());