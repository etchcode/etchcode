/*globals angular, console, document */
(function () {
	"use strict";
	
	angular.module("etch")
	
	.controller("editorController", ["spriteData", "toaster", "random", "$mdDialog", "$rootScope", function(spriteData, toaster, random, $mdDialog, $rootScope){
        var myself = this; //cache this for the children
        
        $rootScope.pageName = "Editor"
        
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
                templateUrl: "static/pages/editor/spriteSettingsDialog/spriteSettingsDialog.html",
                locals: {
                    sprite: sprite
                },
                
                controller: ["$scope", "$mdDialog", "spriteData", "sprite", function($scope, $mdDialog, spriteData, sprite){
                    $scope.spriteData = spriteData;
                    $scope.sprite = sprite;
                    $scope.show = true; // should we show the sprite
                    
                    $scope.close = function(){
                        $mdDialog.hide();
                        $scope.show = false;
                    };
                    
                    $scope.delete = function(){
                        spriteData.sprites.deleteSprite($scope.sprite);
                        $mdDialog.hide();
                    };
                    
                    // newCostume
                    $scope.newCostume = {
                        image: "",
                        name: "",
                        addFailed: false,
                        costumeCalled: $scope.sprite.id == "background" ? "backdrop" : "costume" // do we call it a backdrop or costume?
                    };
                    
                    $scope.newCostume.reset = function(){
                        $scope.newCostume.image = "";
                        $scope.newCostume.name = "";
                        $scope.newCostume.addFailed = false;
                    };
                    
                    $scope.newCostume.add = function(){
                        if($scope.newCostume.image.length > 0 && $scope.newCostume.name.length > 0){ // they have entered an image and name
                            var costume = new $scope.spriteData.Costume({
                                name: $scope.newCostume.name,
                                data: $scope.newCostume.image
                            });
                            $scope.sprite.costumes.push(costume);
                            
                            $scope.newCostume.reset();
                        }
                        else{ // they are misssing either the image or the name
                            $scope.newCostume.addFailed = true;
                        }
                    };
                }]
            });
        };
	}]);
}());