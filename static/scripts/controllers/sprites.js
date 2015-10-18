/*globals angular */
(function () {
	"use strict";
	
	angular.module("etch")
	
	.controller("spritesController", ["spriteData", "toaster", "random", function(spriteData, toaster, random){
		var myself = this; //cache this for the children
        
		this.restrictedStrings = ["mouse-pointer", "edge", "pen trails"];
		this.list = spriteData.sprites.list; // all sprites
		this.background = spriteData.sprites.background;
        this.general = spriteData.sprites.general;
        this.all = this.list.concat(this.background).concat(this.general);
		
		this.current = this.list[0]; // the sprite that we are editing now
		
        this.new = function(){
            
        }
	}]);
}());