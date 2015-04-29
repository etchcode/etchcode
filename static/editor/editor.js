(function(){	
	var app = angular.module("editor", ["sprites"])
	
	.directive('allowTab', function () {
		// enables tab key
		return function (scope, element, attrs) {
			element.bind('keydown', function (event) {
				if (event.which == 9) { // if tab key was pressed
					event.preventDefault(); // don't do the normal tab stuff
					var start = this.selectionStart;
					var end = this.selectionEnd;
					element.val(element.val().substring(0, start) 
						+ '\t' + element.val().substring(end)); // insert a tab character at the cursor position
					this.selectionStart = this.selectionEnd = start + 1;
					element.triggerHandler('change'); // tell others that this elment just changed
				}
			});
		};
	})
	
	.service("editorsService", function(){
		this.view = "code"; // code || settings, what view the user is in
	})
	.controller("editorsController", ["editorsService", function(editorsService){ // a controller of the editors view
		this.service = editorsService;
	}])
	
	.directive("editor", ["spriteData", function(spriteData){ // a directive for inserting editor elements
		return {
			restrict: "E",
			templateUrl: "/static/editor/templates/editor.html",
			controller: function($scope, $element){	// this controller is for individual editor elements
				$scope.value = "";
			},
			controllerAs: "editor"
		}
	}]);
	
}());