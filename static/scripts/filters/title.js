(function() {
	angular.module("etch")
	
	.filter("title", function() {
		return function(input) {
			var asList = input.split(" ");

			var result = "";
			asList.forEach(function(item) {				
				result += " " + item[0].toUpperCase() + item.substr(1, item.length);
			});

			return result;
		};
	});
}());