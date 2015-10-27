/* globals marked */
(function() {
	angular.module("etch")
	
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
	}]);
	
}());