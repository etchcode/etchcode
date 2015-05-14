(function (){
	angular.module("editableImage", [])
	
	.directive("editableImage", function(){
		return {
			restrict: "E",
			
			scope: {
				data: "="
			},
			
			templateUrl: "/static/editor/templates/editableImage.html",
			link: function($scope, $element){
				$scope.upload = function(){
					var fileUploadElem = $element.find(".fileUpload");
					
					fileUploadElem.click(); //trigger file upload
					
					fileUploadElem.on("change", function(){
						var file = fileUploadElem[0].files[0];
						
						var reader = new FileReader();
						
						reader.readAsDataURL(file);
						reader.onloadend = function(){
							$scope.$apply(function(){
								$scope.data = reader.result;
							});
						};
					});
				};
			},
		};
	});
}());