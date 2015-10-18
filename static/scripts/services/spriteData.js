(function () {
	"use strict";
	
	/*globals angular */
	angular.module("etch")
	
	.service("spriteData", ["random", "default", function(random, Default){
        var myself = this; // cache this for use inside functions
		this.default = Default.sprite;
        var forbidden_variable_names = ["mouse-pointer", "edge", "pen trails"];
		
        // define the needed objects
        
        // sprite components
        this.Costume = function(inputs){
            if(!inputs){
                inputs = {};
            }
            
            this.name = inputs.name || random.word();
            this.data = inputs.data || myself.default.costumes[0].data
        }
        
        this.Variable = function(variable, other_names){ // variable object. takes name of variable, list of potential conflicts. has properties name, valid, and (if valid == false) invalid_reason. if valid is false the variable created should not be recorded and the user should be notified
            this.name = variable;
            this.valid = true;
            
            // check if the name is undefined
            if(this.name === undefined || this.name === ""){
                this.valid = false;
                this.invalid_reason = "undefined"
            }
            // check if the variable is restricted
            if(forbidden_variable_names.indexOf(this.name) != -1){
                this.valid = false;
                this.invalid_reason = "forbidden name";
            }
            // check if there is a variable of the same name
            if(other_names.indexOf(this.name) != -1){
                this.valid = false;
                this.invalid_reason = "conflict";
            }
        }
        
        // types of sprite
        this.Sprite = function(inputs){ // sprite object. takes object with properties id, costumes, variables, script, position. Nonexistant properties will take default values
            if(!inputs){
                inputs = {}; // if they don't specify an inputs object use an empty one
            }
            
            this.id = inputs.id || random.word(); // the specified input or a random word. TODO: make sure the id is unique
            this.costumes = inputs.costumes || [new myself.Costume()]; // the specified list or a list with a single costume. list items should be Costume() objects
            this.variables = inputs.variables || []; // the specified list or an empty list. List items should be Variable() objects
            this.script = inputs.script || ""; // the specified script or an empty string
            this.position = {
                x: inputs.x || 0, // the specified x pos or 0
                y: inputs.y || 0 // the specified y pos or 0
            };
        }
        
        this.Background = function(inputs){ // background object. every input Sprite takes by position            
            if(!inputs){
                inputs = {}; // if they don't specify an inputs object use an empty one
            }
            
            this.id = "background"
            this.costumes = inputs.costumes || [new myself.Costume({data: myself.default.backdrops[0].data})]; // the specified list or a list with a single costume. list items should be Costume() objects
            this.variables = inputs.variables || []; // the specified list or an empty list. List items should be Variable() objects
            this.script = inputs.script || ""; // the specified script or an empty string
        }
        
        this.General = function(inputs){ // general object. takes object with project name, notes, thumbnail, variables
            if(!inputs){
                inputs = {};
            }
            
            this.id = "general"
            this.name = inputs.name || "";
            this.notes = inputs.notes || "";
            this.thumbnail = inputs.thumbnail || myself.default.backdrops[0].data;
            this.variables = inputs.variables || [];
        }
        
        // create the object where all the spriteData is stored
        this.sprites = {
            background: new this.Background(),
            general: new this.General(),
            list: [
                new this.Sprite()
            ]
        }
		
	}]);
}());