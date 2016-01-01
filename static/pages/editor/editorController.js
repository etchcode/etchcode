/*globals angular, console, document */
(function () {
	"use strict";

	angular.module("etch")

	.controller("editorController", ["spriteData", "toaster", "random",
                "$mdDialog", "$rootScope", "$scope", "user", "$routeParams",
                "project", function(spriteData, toaster, random, $mdDialog,
                                    $rootScope, $scope, user, $routeParams,
                                    project){
        $rootScope.pageName = "Editor";
        debug.spriteData = spriteData;

        var _this = this; //cache _this for the children

        $scope.sprites = {};
        $scope.sprites.list = []; // all sprites except background, general
        $scope.sprites.background = {};
        $scope.sprites.general = {};
        $scope.sprites.current = {};

        project.fetch($routeParams.project_id)
        .then(function(project){
            $scope.project = project;
            $scope.project.key = $routeParams.project_id;

            // is this a brand new project that needs a sprite object
            if(angular.equals(project.sprites, {})){
                $scope.project.sprites = spriteData.sprites;
            }
            $scope.sprites = project.sprites;

            $scope.sprites.current = $scope.sprites.list[0];
        });

        $scope.save_project = function(){
            project.change($scope.project.key, $scope.project);
        };
        $scope.all_sprites = function(){
            return $scope.sprites.list.concat($scope.sprites.background).concat($scope.sprites.general);
        };
        $scope.new_sprite = function(){
            $scope.sprites.list.push(new spriteData.Sprite());
        };
        $scope.delete_sprite = function(sprite){
            var index = $scope.sprites.list.indexOf(sprite);
            if(index > -1){
                $scope.sprites.list.splice(index, 1);
            }
            else{
                throw new Error("sprite does not exist, so it can't be deleted");
            }
        };

        var sprites = $scope;
        $scope.sprite_settings = function(sprite){ // open a settings dialog to change the settings of a sprite
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
                        sprites.delete_sprite($scope.sprite);
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

                    $scope.variables_type = function(id){
                        // Takes: Id of Sprite
                        // Returns: "+Variable for all sprites" || "+Variable"
                        switch (id) {
                            case 'general':
                                return '+Variable for all sprites';
                            default:
                                return '+Variable';
                        }
                    };
                }]
            });
        };
	}]);
}());
