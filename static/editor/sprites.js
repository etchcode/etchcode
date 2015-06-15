(function () {
	"use strict";
	
	/*globals angular, Random, Default */
	angular.module("sprites", ["toaster"])
	
	.directive("integer", function(){
		return {
			restrict: "E",
			templateUrl: "/static/editor/templates/sprite.html",
		};
	})
	
	.service("spriteData", [function(){
		this.default = Default.sprite;
		
		this.list = [ // this will be dynamicly generated and saved in the future
			{
				id: Random.phrase(), 
				
                x: 0,
                y: 0,
                
				costumes: [
					{
						name: Random.phrase(),
						data: this.default.costumes[0].data
					}
				],
				
				variables: [
					
				],
				
				script: this.default.script
			},
			{
				id: Random.phrase(),
				
                x: 0,
                y: 0,
                
				costumes: [
					{
						name: Random.phrase(),
						data: this.default.costumes[0].data
					}
				],
				
				variables: [
					
				],
				
				script: ""
			},
			{
				id: "background",
				
				costumes: [
					{
						name: Random.phrase(),
						data: this.default.backdrops[0].data
					}
				],

				variables: [

				],
				
				script: ""
			},
			{
				id: "general",
				
				name: Random.phrase(),
				notes: "Notes about this project",
				
				thumbnail: this.default.backdrops[0].data,

				variables: [

				]
			}
		];
		
	}])
	
	.controller("spritesController", ["spriteData", "toaster", "editorsService", function(spriteData, toaster, editors){
		var that = this; //cache this for the children
		
		that.list = spriteData.list; // all sprites
		this.background = spriteData.background;
		that.globals = spriteData.globals;
		
		that.current = that.list[0].id; // the sprite that we are editing now
		
		that.add = function(){
			var newItem = {
				id: Random.phrase(),

				costumes: [
					{
						name: Random.phrase(),
						data: spriteData.default.costumes[0].data
					}
				],

				variables: [

				],
				
				script: ""
			};
			
			that.list.splice(that.list.length-2, 0, newItem);
			that.current = that.list[that.list.length-3].id;
		};
		that.remove = function(sprite){
			var spriteNum = that.list.indexOf(sprite);
			
			that.list.splice(spriteNum, 1);
		};
		
		that.costume = new function(){
			this.remove = function(sprite, costume){
				var spriteNum = that.list.indexOf(sprite);
				var costumeNum = that.list[spriteNum].costumes.indexOf(costume);

				that.list[spriteNum].costumes.splice(costumeNum, 1); //remove the element
			};
			
			this.create= function(sprite){
				var spriteNum = that.list.indexOf(sprite);
				
				var modifying = (sprite.id ==="background") ? "backdrops" : "costumes"; //we are modifying the backdrops list if this is the background, else it is a sprite so the costumes list
								
				that.list[spriteNum].costumes.push({
					name: Random.phrase(),
					//use the backdrop if this is the background, otherwise the costume
					data: spriteData.default[modifying][0].data
				});
			};
		};
	
		that.variable = new function(){
			this.creating = ""; //the content of the add variable text box
			
			this.create = function(sprite, text){
				if(sprite == "global"){//this is telling us it wants to be the globals sprite
					sprite = that.globals; //so do what it wants
				}
				
				if(text === ""){
					//the variable is empty
					toaster.pop({
						type: "error",
						title: "Error",
						body: "Variables cannot be blank"
					});
				}
				else if(sprite.variables.indexOf(text) == -1 && that.list[that.list.length-1].variables.indexOf(text) == -1){
					//it is not a duplicate
					
					if(sprite === that.globals){
						that.globals.variables.push(text);
					}
					else{
						var spriteNum = that.list.indexOf(sprite);

						that.list[spriteNum].variables.push(text);
					}
					
					this.creating = "";
				}
				else{
					toaster.pop({
						type: "error",
						title: "Error",
						body: "The variable \""+text+"\" already exists"
					});
				}
			};
			
			this.remove = function(sprite, text){
				var variableNum;
				
				if(sprite === "globals"){//this is telling us it is the globals sprite
					variableNum = that.globals.variables.indexOf(text);
					
					that.globals.variables.splice(variableNum, 1); //remove the element
				}
				else{ //this is a normal sprite, get rid of the variable
					var spriteNum = that.list.indexOf(sprite);
					variableNum = that.list[spriteNum].variables.indexOf(text);

					that.list[spriteNum].variables.splice(variableNum, 1); //remove the element
				}
			};
		};
		
	}]);
}());