(function () {
    "use strict";

    angular.module("etch")

    .service("spriteData", ["random", "default", function(random, Default){
        var myself = this; // cache this for use inside functions
        this.default = Default.sprite;
        this.forbidden_variable_names = ["mouse-pointer", "edge", "pen trails"];

        // define the needed objects

        // sprite components
        this.Costume = function(inputs){
            if(!inputs){
                inputs = {};
            }

            this.name = inputs.name || random.word();
            this.data = inputs.data || myself.default.costumes[0].data;
        };

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

            this.deleteCostume = function(costume){
                var index = this.costumes.indexOf(costume);
                this.costumes.splice(index, 1);
            };
        };

        this.Background = function(inputs){ // background object. every input Sprite takes by position
            if(!inputs){
                inputs = {}; // if they don't specify an inputs object use an empty one
            }

            this.id = "background";
            this.costumes = inputs.costumes || [new myself.Costume({data: myself.default.backdrops[0].data})]; // the specified list or a list with a single costume. list items should be Costume() objects
            this.variables = inputs.variables || []; // the specified list or an empty list. List items should be Variable() objects
            this.script = inputs.script || ""; // the specified script or an empty string

            this.deleteCostume = function(costume){
                var index = this.costumes.indexOf(costume);
                this.costumes.splice(index, 1);
            };
        };

        this.General = function(inputs){ // general object. takes object with project name, notes, thumbnail, variables
            if(!inputs){
                inputs = {};
            }

            this.id = "general";
            this.variables = inputs.variables || [];
        };

        this.Sprites = function(inputs){// object to container the background, general, and sprites
            if(!inputs){
                inputs = {};
            }

            this.background = inputs.background || new myself.Background();
            this.general = inputs.general || new myself.General();
            this.list = inputs.list || [new myself.Sprite()];

            this.deleteSprite = function(sprite){
                var index = this.list.indexOf(sprite);
                this.list.splice(index, 1);
            };
        };

        // data-checking functions
        this.isValidVariable = function(variable, other_names){ // variable object. takes name of variable, list of potential conflicts. has properties name, valid, and (if valid == false) invalid_reason. if valid is false the variable created should not be recorded and the user should be notified
            var message = {
                error: false
            };

            // check if the name is undefined
            if(this.name === undefined || this.name === ""){
                message.error = false;
                message.message = "undefined";
            }
            // check if the variable is restricted
            if(this.forbidden_variable_names.indexOf(this.name) != -1){
                message.error = true;
                message.message = "forbidden name";
            }
            // check if there is a variable of the same name
            for(var i = 0; i < other_names.length; i++){
                var other_name = other_names[i];

                if(other_name == this.name){
                    message.error = true;
                    message.message = "conflict";
                }
            }

            return message;
        };

        // create the object where all the spriteData is stored
        this.sprites = new this.Sprites();
    }]);
}());
