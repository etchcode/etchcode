(function(){	
	var app = angular.module("editor", ["sprites"])
	
	.directive('allowTab', function () {
		return function (scope, element, attrs) {
			element.bind('keydown', function (event) {
				if (event.which == 9) {
					event.preventDefault();
					var start = this.selectionStart;
					var end = this.selectionEnd;
					element.val(element.val().substring(0, start) 
						+ '\t' + element.val().substring(end));
					this.selectionStart = this.selectionEnd = start + 1;
					element.triggerHandler('change');
				}
			});
		};
	})
	
	.service("editors", function(){
		this.view = "code"; // code || 
	})
	
	.directive("editor", ["spriteData", function(spriteData){
		return {
			restrict: "E",
			templateUrl: "templates/editor.html",
			controller: function($scope, $element){	
				$scope.value = "";
				
				$scope.$watch("value", function(){ // this changes when the value of the textarea changes
					//console.log(getCurrentSprite());
				});
			},
			controllerAs: "editor"
		}
	}]);
}());