(function(){
	var app = angular.module("sprites", [])
	
	.directive("sprite", function(){
		return {
			restrict: "E",
			templateUrl: "templates/sprite.html"
		}
	})
	
	.service("spriteData", [function(){
		this.list = [ // this will be dynamicly generated and saved in the future
			{
				"id": "spriteID1", 
				"current": true
			},
			{
				"id": "spriteID2",
				"current": false
			}
		];
		
		this.setCurrent = function(id){
			// set the id as the current sprite
			
			for(var i = 0; i < this.list.length; i++){
				this.list[i].current = false; // reset every item

				if(this.list[i].id == id){
					this.list[i].current = true; // and then enable it for the correct item
				}
			}
		}
		this.getCurrent = function(){
			// get the current sprite
			
			for(var i = 0; i < this.list.length; i++){
					if(this.list[i].current = true){
						return this.list[i];
					}
			}
			return false;
		}
	}])
	
	.controller("spritesController", ["spriteData", function(spriteData){
		this.getSprites = function(){
			return spriteData.list;
		}
		
		this.setCurrent = function(id){
			return spriteData.setCurrent(id);
		}
		this.getCurrent = function(){
			return spriteData.getCurrent();
		}
	}]);
}());