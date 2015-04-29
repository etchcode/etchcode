(function(){
	var app = angular.module("sprites", [])
	
	.directive("sprite", function(){
		return {
			restrict: "E",
			templateUrl: "templates/sprite.html",
		}
	})
	
	.service("spriteData", [function(){
		this.list = [ // this will be dynamicly generated and saved in the future
			{
				"id": "spriteID1", 
				"current": true,
				
				config: {
					
				}
			},
			{
				"id": "spriteID2",
				"current": false,
				
				config: {
					
				}
			},
			{
				id: "background",
				current: false,
				
				config: {
					
				}
			}
		];
	}])
	
	.controller("spritesController", ["spriteData", function(spriteData){
		this.list = spriteData.list; // all sprites
		
		this.current = this.list[0].id; // the sprite that we are editing now
	}]);
}());