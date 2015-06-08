/* globals angular */
(function(){	
	"use strict";
	
	angular.module("editor", ["sprites"])
	
	.directive('allowTab', function () {
		// enables tab key
		return function ($scope, element) {
			element.bind('keydown', function (event) {
				if (event.which == 9) { // if tab key was pressed
					event.preventDefault(); // don't do the normal tab stuff
					var start = this.selectionStart;
					var end = this.selectionEnd;
					element.val(element.val().substring(0, start) + '\t' + element.val().substring(end)); // insert a tab character at the cursor position
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
	
	.directive("editor", function(){ // a directive for inserting editor elements
		return {
			restrict: "E",
			templateUrl: "/static/editor/templates/editor.html",
			controller: ["$scope", "$element", "syntaxHighlighterService", function($scope, $element, syntaxHighlighter) { // this controller is for individual editor elements
				$scope.$watch("sprite.script", function(value){
					$scope.syntaxHighlightedText = syntaxHighlighter.highlight(value);
				});
				
				// scrollbar section
				$scope.scroll = function(percent) {
					var elem = $element.find(".textarea")[0];
					var currentPos = elem.scrollTop;
					
					elem.scrollTop = Math.pow(10, 14); // if we go beyond the max height, scrollTop is set to the max height
					var maxPos = elem.scrollTop;
					
					elem.scrollTop = currentPos; //reset the height changes we made to get the maxPos
					
					var amountToScrollBy = percent / 100 * maxPos;
					elem.scrollTop = amountToScrollBy;
					return amountToScrollBy;
				};
				
			}],
			controllerAs: "editor"
		};
	});
	
}());