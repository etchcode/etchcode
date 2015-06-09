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
				function getMaxScrollPos(elem){
					var currentPos = elem.scrollTop;
					elem.scrollTop = Math.pow(10, 14); // if > the max height, scrollTop is max possible
					var maxPos = elem.scrollTop;
					elem.scrollTop = currentPos; // go back to where we were before
					
					return maxPos;
				}
				
				function scrollSyntaxHighlight(){
					var textareaElem = $element.find(".textarea")[0];
					var syntaxHighlightElem = $element.find(".syntaxHighlightContainer")[0];
					
					syntaxHighlightElem.scrollTop = textareaElem.scrollTop;
				}
				
				function updateScrollBarSize(){
					var elem = $element.find(".textarea");
					
					var visableHeight = elem.height();
					var totalHeight = elem[0].scrollHeight;
										
					visableHeight = visableHeight ? visableHeight : 0; // if no visable height, is 0
					totalHeight = totalHeight ? totalHeight : 0; // if no totalHeight, is 0
					
					var scrollBarHeight = visableHeight / totalHeight * 100 + "%";
					$element.find(".scrollBar .thumb").height(scrollBarHeight);
					
					return scrollBarHeight;
				}
				
				$scope.scroll = function(percent) {
					var elem = $element.find(".textarea")[0];
					
					var amountToScrollBy = percent / 100 * getMaxScrollPos(elem);
					elem.scrollTop = amountToScrollBy;
					scrollSyntaxHighlight();
					
					return amountToScrollBy;
				};
				
				$scope.scrollBarWatcher = function() {
					// on every key press, update everything that needs to be update
					updateScrollBarSize();
					scrollSyntaxHighlight();
				};
				
			}],
			controllerAs: "editor"
		};
	});
	
}());