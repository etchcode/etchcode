(function () {
	"use strict";
	
	/*globals angular */
	angular.module("etch")
	
	.service("spriteData", ["random", "default", function(random, Default){
		this.default = Default.sprite;
		
		this.list = [ // this will be dynamicly generated and saved in the future
			{
				id: random.word(),
				
                x: 0,
                y: 0,
                
				costumes: [
					{
						name: random.word(),
						data: this.default.costumes[0].data
					}
				],
				
				variables: [
					
				],
				
				script: this.default.script
			},
			{
				id: random.word(),
				
                x: 0,
                y: 0,
                
				costumes: [
					{
						name: random.word(),
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
						name: random.word(),
						data: this.default.backdrops[0].data
					}
				],

				variables: [

				],
				
				script: ""
			},
			{
				id: "general",
				
				name: random.word(),
				notes: "Notes about this project",
				
				thumbnail: this.default.backdrops[0].data,

				variables: [

				]
			}
		];
		
	}]);

}());