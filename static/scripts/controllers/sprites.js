/*globals angular, console, document */
(function () {
	"use strict";
	
	angular.module("etch")
	
	.controller("spritesController", ["spriteData", "toaster", "random", "$mdDialog", function(spriteData, toaster, random, $mdDialog){
        var myself = this; //cache this for the children
        
		this.list = spriteData.sprites.list; // all sprites
		this.background = spriteData.sprites.background;
        this.general = spriteData.sprites.general;
        this.current = this.list[0]; // the sprite that we are editing now
        
        this.all = function(){
            return myself.list.concat(myself.background).concat(myself.general);
        };
				
        this.new = function(){
            this.list.push(new spriteData.Sprite());
        };
        
        this.settings = function(sprite){ // open a settings dialog to change the settings of a sprite            
            $mdDialog.show({
                clickOutsideToClose: true,
                focusOnOpen: false,
                templateUrl: "partials/settingsDialog.html",
                locals: {
                    sprite: sprite
                },
                
                controller: ["$scope", "$mdDialog", "spriteData", "sprite", function($scope, $mdDialog, spriteData, sprite){
                    $scope.spriteData = spriteData;
                    $scope.sprite = sprite;
                    
                    $scope.close = function(){
                        $mdDialog.hide();
                    };
                }]
            });
        };
	}]);
}());