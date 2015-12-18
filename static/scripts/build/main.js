(function(){/* globals nunjucks, heap */
(function () {
	"use strict";

	nunjucks.configure("/static/pages/editor", {autoescape: true});

	angular.module("etch", ["ngSanitize", "ngMaterial", "ui.codemirror", "ngRoute", "toaster"])

		.config(["$routeProvider", "$locationProvider", "$mdThemingProvider",
			function ($routeProvider, $locationProvider, $mdThemingProvider) {

				$routeProvider
                .when("/", {
                    templateUrl: "static/pages/home/index.html"
                })
                .when("/editor", {
                    templateUrl: "static/pages/editor/index.html"
                })
                .when("/docs", {
                    templateUrl: "static/pages/docs/index.html"
                })
                .when("/help", {
                    templateUrl: "static/pages/help/index.html"
                })
                .when("/account", {
                    templateUrl: "static/pages/account/index.html"
                })
                .otherwise({
                    redirectTo: "/"
                });
                
                $mdThemingProvider.theme("default") // these colors should also been included in static/styles/color.sass in the form of the variables $md-accent and $md-default
                    .primaryPalette("blue", {
                        "default": "500"
                    })
                    .accentPalette("orange", {
                        "default": "700"
                    });
			}
		])
    
        .run(function($rootScope, $location){
            // heap analytics tracking code
            window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var n=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(n?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(a,o);for(var r=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["clearEventProperties","identify","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=r(p[c])}; //jshint ignore:line
            heap.load("67792227");
        
            $rootScope.$on("$routeChangeStart", function(event, next, current){
                heap.track("location", {path: $location.path()});
                
                $rootScope.pageName = undefined; // reset pageName
            });
        });

}());}());
(function(){angular.module("etch")
.controller("accountController", ["$rootScope", "$scope", "user", function($rootScope, $scope, user){
    $rootScope.pageName = "Account"; // set page name for use in title, etc
    $scope.modifying = {}; // the objects we want to temporarily clone so we can move them back when they are saved
    $scope.modifying.user = angular.copy(user.user); // lets copy the user object so if we don't save it won't be modified
    
    $scope.$on("$destroy", function(){
        // we are leaving this page, clean up
        alert(1);
    });
}]);}());
(function(){(function() {
	angular.module("etch")
	
	.controller("docsController", ["$scope", "$http", "$window", "$location", "blocksData", function($scope, $http, $window, $location, blocksData){
        $scope.abbreviations = blocksData.abbreviations;
        $scope.etchNames = blocksData.etchNames;
		$scope.describe = "general";
        
		$scope.setDescribe = function(newDescribe) {
			$scope.describe = newDescribe;
            //$location.hash(newDescribe); // this would enable easy sharing of docs pages. Unfortunatly, it makes the page reload when you changes the has because we have hash based navigation. To think about. TODO: Store current describe in page hash

            $window.scrollTo(0, 0);
		};

		$scope.inputType = function(type, item){
			// check if an item takes an input type
			if(item.inputTypes){
				return item.inputTypes.indexOf(type) !== -1;
			}
			else{
				return false;
			}
		};
	}]);
}());}());
(function(){(function(){
    "use strict";

    angular.module("etch")

        .directive("blocksList", function(){
            return {
                restrict: "E",

                templateUrl: "static/pages/editor/blocksList/blocksList.html",
                controller: ["$scope", "$http", "blocksData", function($scope, $http, blocksData){
                    $scope.blocksListParent = "motion"; // the parent currently clicked on
                    $scope.blocks = blocksData.etchNames;
                    
                    $scope.setBlocksListParent = function(newParent){
                        $scope.blocksListParent = newParent;
                    };
                }]
            };
        });
}());}());
(function(){/*globals angular, console, document */
(function () {
	"use strict";
	
	angular.module("etch")
	
	.controller("editorController", ["spriteData", "toaster", "random", "$mdDialog", "$rootScope", "$scope", function(spriteData, toaster, random, $mdDialog, $rootScope, $scope){
        var _this = this; //cache _this for the children
        
        $rootScope.pageName = "Editor";
        
        $scope.sprites = {};
            $scope.sprites.list = spriteData.sprites.list; // all sprites
            $scope.sprites.background = spriteData.sprites.background;
            $scope.sprites.general = spriteData.sprites.general;
            $scope.sprites.current = $scope.sprites.list[0]; // the sprite that we are editing now
            
            $scope.sprites.all = function(){
                return $scope.sprites.list.concat($scope.sprites.background).concat($scope.sprites.general);
            };
            $scope.sprites.new = function(){
                $scope.sprites.list.push(new spriteData.Sprite());
            };
            $scope.sprites.settings = function(sprite){ // open a settings dialog to change the settings of a sprite            
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
}());}());
(function(){(function(){
    "use strict";

    angular.module("etch")
        .directive("spritesList", function(){
           return {
                restrict: "E",
                templateUrl: "static/pages/editor/spritesList/spritesList.html"
            };
        });
}());}());
(function(){(function(){
    angular.module("etch")
    
    .controller("helpController", ["$scope", "$rootScope", "$http", "$sce", function($scope, $rootScope, $http, $sce){
        var _this = this;
        
        $rootScope.pageName = "Help & Feedback";
        
        var contentToGet = {"static/pages/help/fromScratch.md": "fromScratch", "static/pages/help/fromNothing.md": "fromNothing", "static/pages/help/fromWritten.md": "fromWritten"};
        
        for(var page in contentToGet){
            $http.get(page).then(function success(response){
                var content = response.data;
                var name = contentToGet[response.config.url];
            
                _this[name] = $sce.trustAsHtml(marked(content));
            }); // jshint ignore:line
        }
    }]);
}());}());
(function(){(function(){	
	"use strict";
	
	angular.module("etch")
	
	.directive("editor", function(){ // a directive for inserting editor elements
		return {
			restrict: "E",
			templateUrl: "static/components/editor/editor.html",
			controller: ["$scope", "$element", function($scope) { // this controller is for individual editor elements
				$scope.codemirrorConfig = {
					lineNumbers: true,
					indentWithTabs: true,
					theme: "xq-light",
					mode: "etch"
				};

			}],
			controllerAs: "editor"
		};
	});
	
}());}());
(function(){(function(){
    "use strict";
    
    angular.module("etch")
    .directive("fileUpload", function(){
        // an attribute to turn a button into a file upload button. Simply add the attribute file-upload="variableToLinkResultTo" the optional attribute file-upload-restrict-type is documented below.
        
        return {
            restrict: "A",
            scope: {
                fileUpload: "=", // a variable to link the results of the file upload to ng-model style
                fileUploadRestrictType: "=" // a list of types to restrict to (ussing accept attribute on input). See http://stackoverflow.com/q/4328947/3164117
            },
            link: function($scope, $elem, attrs, controller){
                var elem = $elem[0];
                
                var inputElem = document.createElement("input");
                inputElem.setAttribute("type", "file");
                inputElem.setAttribute("accept", $scope.fileUploadRestrictType);
                inputElem.style.display = "none";
                elem.appendChild(inputElem);
                
                elem.addEventListener("click", function(){
                    inputElem.click();
                });
                
                inputElem.addEventListener("change", function(event){
                    var file = event.target.files[0];
                    var reader = new FileReader();
                    
                    reader.onloadend = function(){                        
                        $scope.$apply(function(){ // we need to get back into ng-land
                            $scope.fileUpload = reader.result;
                        }); 
                    };
                    
                    reader.readAsDataURL(file); //when this is done reader.onloadend will be called
                });
            }
        };
    });
}());}());
(function(){/* globals marked */
(function() {
	angular.module("etch")
	
	.directive("markdown", function() {
		return {
			restrict: "A",
			link: function($scope, $element){
				var elem = $element[0];
				
				elem.className.replace(/ markdown\-body/g, "");
				elem.className += " markdown-body";
				
				elem.innerHTML = marked(elem.textContent);
			}
		};
	});
}());}());
(function(){(function (){
    angular.module("etch")

    .directive("mainHeader", function(){
        return {
            restrict: "E",

            templateUrl: "static/components/navigation/mainHeader.html",
            controller: ["$scope", "$location", "$rootScope", "$mdMenu", "user", function($scope, $location, $rootScope, $mdMenu, user){
                $scope.$mdMenu = $mdMenu;
                $scope.user = user.user;
                
                $scope.sideNavOpen = false;

                $scope.pageType = function(){
                   switch ($location.path()) {
                        case "/":
                            return "home";
                        default:
                            return "subpage";
                    }
                };

                $scope.toggleSideNav = function(){
                    $scope.sideNavOpen = !$scope.sideNavOpen;
                };
            }]
        };
    });
}());}());
(function(){var $e;
(function () {
    "use strict";

    angular.module("etch")

        .directive("runProject", function () {
            return {
                restrict: "E",
                replace: true,

                templateUrl: "static/components/runProject/runProject.html",
                controller: ["$scope", "$element", "spriteData", "renderService", "$sce", function($scope, $element, spriteData, render, $sce){
                    // running a project
                    $scope.loaded = false;
                    $scope.show = true;
                    $scope.large = false; // default view is inline but if this is true the editor will be fullscreen
                    $scope.running = false;
                    
                    $scope.PLAYER_URL = $sce.trustAsResourceUrl(PRODUCTION ? "https://etchcodeusercontent.appspot.com/play/" : "http://localhost:9000/play/");

                    $e = $element;
                    var player = $element[0].getElementsByClassName("player")[0];
                    
                    player.addEventListener("load", function(){
                        //listen for when the player is loaded and update whether or not it is updated
                        $scope.$apply(function(){
                            $scope.loaded = true;
                        });
                    });

                    $scope.run = function(xml){
                        function run(toRun){
                            $scope.show = true;

                            player.contentWindow.postMessage({
                                "action": "loadString",
                                "string": toRun
                            }, $scope.PLAYER_URL); // this postMessage must be done once the iframe is loaded
                            
                        }

                        if($scope.loaded){ // if the iframe is loaded
                            run(xml); // run it
                        }
                        else{ // otherwise
                            player.onload = function(){ //with .onload we will only have one run waiting
                                $scope.$apply(function(){
                                    run(xml); // run it when loaded                                    
                                });
                            };
                        }
                    };

                    $scope.stop = function(){
                        player.contentWindow.postMessage({
                            "action": "stop"
                        }, "http://etchcodeusercontent.appspot.com/player"); // this postMessage must be done once the iframe is loaded
                    };

                    // the run button itself
                    $scope.toggleStartStop = function(){                        
                        if($scope.running) {
                            $scope.stop();
                            $scope.running = false;
                        }
                        else {
                            render.project(spriteData.sprites).then(function (response) {
                                $scope.run(response); // referring to element in runProject directive in file directives/runProject.js
                            });
                            $scope.running = true;
                        }
                    };
                }],
                controllerAs: "runProject"
            };
        });

}());}());
(function(){(function(){
    "use strict";

    angular.module("etch")

        .directive("snapBlock", function(){
            return {
                restrict: "E",
                scope: {block: "="},
                replace: true,

                templateUrl: "static/components/snapBlock/snapBlock.html",
                link: function($scope, $elem){
                    var elem = $elem[0];
                                        
                    // drag-and-drop code
                    elem.addEventListener("dragstart", function(event){
                        var block = $scope.block;
                        var text = block.name;

                        if(block.type == 'function'){
                            text += "(";
                            text += block.example.join(", ");
                            text += ")\n";
                        }
                        else if(block.type == 'reporter'){
                            text += "\n";
                        }
                        else if(block.type == 'block'){
                            if(block.example){
                                text += "(";
                                text += block.example.join(", ");
                                text += ")";
                            }

                            text += ":\n\t";
                        }

                        event.dataTransfer.setData("text", text);
                        elem.className += " md-accent";
                    });

                    elem.addEventListener("dragend", function(event){
                        elem.className = $elem[0].className.replace(/ md-accent/g, "");
                    });
                }
            };
        });
}());}());
(function(){(function(){
    angular.module("etch")
    
    .filter('html', ['$sce', function($sce){
      return function(val) {
        return $sce.trustAsHtml(val);
      };
    }]);    
    
}());}());
(function(){/* globals marked */
(function() {
	angular.module("etch")
	
	.filter("markdown", ["$sce", function($sce) {
		// set up markdown support
		marked.setOptions({
			smartypants: true
		});
	
		return function(input){
			return $sce.trustAsHtml(
				"<div class=\"markdown-body\">" + marked(input) + "</div>"
			);
		};
	}]);
	
}());}());
(function(){(function() {
	angular.module("etch")
	
	.filter("title", function() {
		return function(input) {
			var asList = input.split(" ");

			var result = "";
			asList.forEach(function(item) {				
				result += " " + item[0].toUpperCase() + item.substr(1, item.length);
			});

			return result;
		};
	});
}());}());
(function(){// communication with /api/*
(function(){
    angular.module("etch")

    .service("api", ["$http", function($http){
        var rootUrl = "/api/";

        api_request = function(url){
            // factory for creating requests
            if(!(this instanceof api_request)){ // if we weren't created with new keyword
                return new api_request(url);
            }
                        
            this.get = function(data){
                return $http.get(url, {data: data});
            };
            this.post = function(data){
                return $http.post(url, data);
            };
        };
        
        login = api_request(rootUrl + "login", ["get"]);
        this.login = login.post;
    }]);
}());}());
(function(){(function (){
	angular.module("etch")
	
	.factory("default", function() {
		return {
			sprite: {
				script: 'flag Clicked:\n    think("Hello, World") # It does not need to be capitalized\n    Move(30+21*21) # But it can if you want\n    waIt(3)\n    think("Etch is cool")\n    go to xy(12, 21) # Press Run to see what this program does',
				costumes: [
					{
						name: "chicken",
						data: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI1OCIgaGVpZ2h0PSIyMzYiIHZpZXdCb3g9IjAgMCA1MTYgNDcyIiBvdmVyZmxvdz0idmlzaWJsZSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTE2IDQ3MiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00ODMuOSA0MC4yYzAuNSAwLjUgMSAxIDEuNSAxLjQgMC4xLTEuNSAwLjktMy4zLTAuOC00LjMgLTEtMC41LTIuMi0wLjItMy4xIDAuNEM0ODIuMyAzOC42IDQ4My4xIDM5LjQgNDgzLjkgNDAuMk01MDYuNSA4Ni4yYy0wLjMtMy45LTAuNi03LjMtMi44LTEwLjYgLTItMy00LjUtNS42LTcuNy03LjMgLTMuMi0xLjgtNi4yLTItNy44LTUuNCAtMC4zLTAuNy0xLTAuOC0wLjgtMS43IDAuMi0wLjggMS40LTAuNyAyLTAuMyAwLTEuMSAwLjMtNC42LTAuNi01IDAuNy0xLjUtMC40LTQuOC0wLjQtNi42IC0wLjcgMC40LTEuNSAwLjktMi4yIDEuNCAwLjctMS4xIDEuMy0yLjEgMi0zLjIgLTEuMi0wLjMtMS45LTEuNC0xLjYtMi42IC0zLjUtMC4xLTcuNS02LjEtOS41LTguNSAtMC4xIDIuMS0yLjMgMC4xLTIuOC0wLjYgLTAuOC0xLTEuMy0yLjQtMi4xLTMuMiAtMS4yLTEuMi0yLjctMi4yLTQuMS0zLjIgLTIuNy0xLjktNS42LTMuNy04LjYtNS4xIC0yLjQtMS4xLTQuNy0yLjgtNy4xLTQuMSAwLjUgMS4xIDAuOSAyLjEgMS41IDMuMiAtMC44LTAuNi00LjYtNC4zLTUuNS00IC0yIDAuNiAwLjQgMi43IDEgMy4zIC0wLjgtMC40LTcuNS0zLjEtMy45LTAuNyAtMS4xLTAuNC0zLjQtMi4xLTMuNSAwIC0yLTAuNi01LTAuNy02LjUtMS43IC0xLjEtMC43LTIuOC0yLjUtNC4xLTIuNCAwLjIgMC42IDAuOCAxLjQgMS4xIDIgLTMuNi0xLjQtNy4zLTAuNy0xMS0wLjUgLTEuMyAwLTIuNy0wLjItNC4xLTAuMSAtMS4xIDAuMS0xLjcgMS0yLjcgMSAtOC42LTAuMi0xNi4xIDEuOS0yNC40IDMuNiAtMTYuMyAzLjMtMjkuNiAxMi4zLTQwLjMgMjQuOSAtNS42IDYuNi0xMC4zIDEzLjktMTUuNSAyMC44IC00LjIgNS43LTcuNCAxMi4xLTEyLjggMTYuNyAtNS44IDUtMTMuNiA4LjctMjAuNSAxMS45IC0zLjQgMS41LTYuOCAzLjQtMTAuNCA0IC0zLjggMC43LTcuNy0wLjEtMTEuNSAwLjMgLTMuOSAwLjQtOC42LTEuOS0xMi4zLTMgLTQuMi0xLjMtOC40LTIuMy0xMi43LTMuNCAtOC0yLjEtMTYuMi0zLjYtMjQuNC00LjggLTktMS4zLTE4LjEtMi42LTI3LjEtMy45IC04LjYtMS4yLTE3LjMtMS45LTI1LjctNC4xIC0xNS45LTQuMS0yMy4yLTIwLjYtMzUuNy0yOS43IC02LjktNS4xLTE0LjUtOC40LTIzLjEtOS4yIC0yLTAuMi00LjEtMC4yLTYuMS0wLjEgLTEuNiAwLjEtMy0yLjctNC4zLTMuOSAtMy0zLTYuMi01LjUtOS44LTcuNyAtMS40LTAuOS0yLjYtMi00LjItMi40IC0yLjMtMC42LTMuNSAwLjItNS4zLTEuNSAtMy4xLTMtNi4yLTUuOS05LjQtOC44QzcyLjggMTQuMiA2Ni43IDkuMyA1OC4zIDcuNWMtMi0wLjQtNC4xLTAuOC02LjItMC44IC0xLjggMC0zLjItMC43LTUtMC44IC0xLjktMC4xLTIuNyAxLjMtNC4yIDEuNiAtMi40IDAuNC00LjggMC45LTcuMiAxLjQgLTguMiAxLjctMTEuNSA5LjMtMTEuOCAxNy4yIC0wLjMgNi40LTEuMSAxMi40LTEgMTguOSAwLjEgNi45IDEuNSAxMy43IDMuMyAyMC4zIC03LjEgMC44LTcuOCAxMS42LTUuMiAxNi41IC0zLjUgMS4yLTUuNiA0LjgtNS45IDguMyAtMC4xIDEuNSAwIDMgMC42IDQuNCAwLjcgMS41IDIuMSAyLjQgMiAzLjYgLTAuMSAxLjMtMS4xIDMtMS4yIDQuNiAtMC4xIDItMC4xIDQgMC4yIDUuOSAwLjUgMy41IDEuOCA2LjkgMy41IDEwIC0zIDAuNS03LjEgMC45LTcuNiA0LjYgLTAuNCAzLjMgMSA3IDAuNyAxMC41IC0wLjUgNy4xIDMuOSAxNC42IDkuOSAxOC4yIDAuNSAwLjMgMi4yIDAuOCAyLjQgMS4yIDAuMiAwLjQgMCAyLjIgMCAyLjcgMC4xIDEuOCAwLjMgMy43IDAuNiA1LjUgMC43IDMuNCAxLjggNi43IDMuNSA5LjcgMy41IDYuNCA5IDExLjEgMTUuMyAxNC42IDAuMiAwLjEgMC40IDAuMiAwLjYgMC40IC0yLjEgMi41LTIuNyA1LjktMy4xIDkgLTAuNSA0LjEtMS4xIDguMi0wLjUgMTIuMyAxLjMgOC4xIDYuNiAxMy4zIDEzLjQgMTcuMiAtMC43IDAuOC0xLjUgMS40LTIuMiAyLjIgLTAuNSAwLjctMS45IDEuMy0yLjIgMS45IC0wLjEgMC4zIDAuNiAwLjcgMC40IDEuMSAtMC45IDIuNy0wLjIgMy4zIDEuNiA1LjMgLTEuNyAwLjktNC40IDQuNS0wLjUgNC4yIC0wLjQgMS43LTQuMSAxLjUtMy43IDMuOSAwLjQgMi40IDMuNCAwLjggNC44IDAuMiAtMS4yIDEuNy01LjQgMS44LTYuMSAzLjcgLTEgMi43IDIuMSAyLjMgMy42IDEuOCAwLjYgMS42LTQuMyAyLjMtNSAzLjkgLTAuNCAwLjkgMCAxLjcgMC43IDIuMSAxLjEgMC42IDEuOC0wLjIgMi45LTAuNyAtMC45IDEuMy0yLjMgMi43LTIuNyA0LjIgLTAuMSAwLjQgMCAwLjcgMCAxLjEgLTAuMSAwLjgtMC4yIDEuNS0wLjUgMi42IDAuOS0wLjggMS44LTEuMiAyLjUgMCAtMS4zIDAuOC00LjYgNS4zLTAuOSA0LjQgLTEuMyAyLTEgMy43IDEuNCA0IDEgMC4xIDEuOS0wLjUgMi43LTAuMSAwLjkgMC40IDEuMiAxLjcgMS42IDIuNSAxLjMgMi40IDIuNyA0LjYgNC41IDYuNyAwLjkgMSAyIDIgMyAyLjggMS41IDEuMyAxLjEgMS4zIDAuNyAzLjIgLTAuNCAyLTAuNyA1LjMgMC40IDcuMSAwLjUgMC45IDEuNiAxLjQgMi41IDEuNiAxLjMgMC40IDEuNSAwLjUgMi40IDEuNyAwLjcgMC45LTAuMSAyLjMgMC44IDMuMyAwLjggMC45IDEuOCAwLjcgMi44IDAuOSAxLjggMC4yIDMuOSAwLjUgNS43LTAuMiAtMS45IDEuNS01LjQgMy43LTUuMiA2LjYgMC4xIDIuNCAzLjYgMi41IDUuNiAxLjggMCAyLjMgMC45IDMuMyAzLjQgMi45IDEuMi0wLjIgMS42LTEuMSAyLjYtMS41IDEuMy0wLjYgMC41LTAuMiAyIDAgMi43IDAuMyA0LjEgMC45IDUuMSAzLjkgMC45IDIuNyAwLjMgNS4zIDAuNCA4LjIgMC4xIDEuOS0xLjMgMTAuOCAyLjQgOS43IDEuMi0wLjQgMi40LTEuNCAzLjYtMS40IDEuNSAwIDIuOS0wLjcgNC4yLTEuMyAtMi4xIDEuNy0xLjUgOS4yIDEuOSA4LjYgMC40LTAuMSAxLjctMS4yIDItMSAwLjUgMC40IDEgMC42IDEuNiAwLjYgMS4xLTAuMSAyLTEgMy4yLTEuMiAtMC4yIDEuNSAwLjcgMi4xIDIgMi4xIDEuOCAwLjEgMy4zIDAuOSA0LjMgMi4zIDAuOSAxLjMgMS4yIDIuOSAyLjEgNC4yIDEuNCAxLjkgMy4zIDMuNSA1LjIgNC44IDIgMS40IDQgMi41IDYuMSAzLjUgMS40IDAuNiAwLjQgMy43IDEuMyA1LjIgMi4xIDMuNSA2LjEgMS41IDcuMy0xLjMgMi40IDMuNyA0LjEgNi43IDkgNC4xIDEuMyAzLjkgNS44IDUuOSA4LjMgOS4xIDEuMyAxLjcgMi44IDMgNC45IDMuNyAxLjcgMC41IDQuNC0wLjUgNS4zIDAuNyAyLjIgMi45IDQuNSA2LjkgOC42IDYuOCAzLjItMC4xIDMuOS0yLjggMy45LTUuNyAxLjcgMS43IDIuNyAyLjUgMy4yIDQuOCAwLjUgMi4xIDEuMiA0LjIgMS42IDYuMyAwLjkgNC4xIDEuNCA4LjEgMS42IDEyLjMgMC4zIDcuOSAwLjUgMTUuNS0xLjMgMjMuMiAtMC41IDIuMS0wLjEgOC0xLjYgOS40IC0wLjcgMC43LTQuMiAwLjgtNS4zIDEuMiAtMi4xIDAuNy00LjEgMS42LTYgMi42IC0xLjggMC45LTYuMiA0LjQtMy44IDYuOSAxLjkgMiA1LjItMC40IDctMC45IDEuNS0wLjQgMyAwLjIgNC42IDAuMiAxLjcgMCAzLjItMC44IDQuMSAwLjcgMS45IDMuMiA1LjYgMy41IDkgMy44IDIuOCAwLjMgNiAyLjMgOC40IDMuOSAzLjIgMiA3LjggMS44IDExLjQgMiA0LjMgMC4zIDguNyAwLjQgMTMgMC40IDEuOSAwIDMuOSAwIDUuOC0wLjEgMS45IDAgMi43IDEuMyA0LjQgMi4yIDEuNCAwLjcgMi45IDEgNC40IDEuMSAxLjQgMC4xIDMuNCAxLjYgNC43IDIuMiAxLjcgMC44IDMuMyAxLjkgNC41IDMuMyAxIDEuMiAxLjMgMi45IDIuNCAzLjkgMy45IDMuNyA0LjktMS45IDUuNS00LjcgMC44LTQtMy4xLTcuMS02LTkuNCA0LjcgMC4yIDkuNy0xLjUgMTQuMy0wLjYgMi45IDAuNiA1LjIgMS44IDcuNSAzLjcgMC43IDAuNSAxLjcgMSAyLjMgMS42IDAuNyAwLjggMC40IDIgMS4xIDIuNyAyLjcgMy4zIDQuMS0yLjYgNC00LjMgLTAuNC00LjMtNS42LTcuNy05LjItOS42IDQuNyAxLjEgMTAuMyAyLjMgMTQuNCA1IDMuMyAyLjIgNC45IDUuOSA3LjIgOC42IDIuNyAzLjIgNC40IDAgNC43LTMuMiAwLjUtNS0xLjUtOS4xLTUuNS0xMS45IDIuNC0wLjcgMC44LTQuNy0wLjEtNiAtMi0yLjktNS43LTQuOC05LjEtNS40IDIuOS0xLjEgNi4xLTAuNiA4LjYgMS4xIDEuNCAwLjkgMS42IDEuNiAyIDMuMSAwLjMgMSAxIDIuNyAyLjEgMy4xIDEuNiAwLjcgMy43LTAuOCA0LjQtMi4zIDAuOS0yLjItMC40LTQuOS0xLjUtNi44IC04LjItMTMuMi0yOC45LTUtNDAuOC00LjEgLTMuNiAwLjMtNy4xIDAuNC0xMC43IDAuNCAtMy40LTAuMS01LjEgMC4xLTUuMS0zLjYgMC0yLjkgMC41LTUuOCAwLjMtOC42IC0wLjMtMy4zLTEuMy02LjgtMi4zLTEwIC0yLTYuNy0zLjMtMTMuNS00LjEtMjAuNCAtMC4yLTEuNS0wLjMtMy0wLjQtNC41IDAtMC41LTAuNC0yLjMtMC4xLTIuNyAwLjMtMC41IDEuNSAwLjMgMS44LTAuNSAwLjQtMS4yLTAuNi0yLjQtMS4xLTMuNCAtMC44LTEuNi0wLjYtMy4xLTAuNC00LjkgMS4xIDEuNCAyLjYgMS43IDMuNCAzLjIgMC42IDAuOSAxLjEgMi45IDIuMyAyLjMgLTEuOS0zLjEtMi4zLTUuMy0zLjctOC41IDAuNiAwLjYgMC45IDEuMyAxLjcgMS44IC0xLjEtMS42LTEuNC0zLjQtMi42LTUuMiAtMC42LTEtMS44LTMuOS0xLjMtNSAyIDMuOCA0LjUgNy4zIDYuMyAxMS4yIDAuNyAxLjUgMS41IDIuNCAyLjkgMy4zIDAuOCAwLjYgMS43IDEuNCAyLjYgMS44IC0wLjUtMS0xLTEuNy0wLjYtMi45IDAuNSAwLjMgMS42IDAuMyAyIDAuNyAwLjQgMC40IDEuMyAyIDEuOCAyLjEgMS40IDAuMi0wLjctMi0wLjgtMi4yIC0xLjktMi42LTMuMi02LjgtNC44LTkuOCAwLjYgMC44IDEuNCAxLjQgMi4yIDIuMSAwLTAuMiAwLjEtMC4zIDAuMi0wLjQgLTMtMy00LjUtOC43LTUuNy0xMi42IDMuMSA0LjQgNi41IDkuMyAxMC4zIDEzIDEuMyAxLjIgNS4xIDIuNiAzLjEtMC40IC0yLTIuOS0zLjctNS45LTUuMy05LjEgMi40IDMuNCA0LjkgOS4yIDkuNiA4LjYgLTAuOC0wLjYtMS4yLTEuNi0wLjctMi41IDAuNSAwLjQgNS4yIDMuNCA0LjUgMS45IC0wLjMtMC42IDAuMi0wLjktMC4zLTEuNiAtMC44LTEuMi0xLjUtMi40LTIuNC0zLjUgMi4xIDEuNyA0LjQgMy4xIDYuMyA0LjkgMC43IDAuNiAxLjMgMS42IDIgMC43IDAuNC0wLjUtMS4zLTIuMS0xLjctMi41IDAuMyAwLjIgMC42IDAuNCAwLjkgMC42IC0xLTEuNy0yLjUtMy0zLjYtNC42IC0wLjktMS40LTEuNS0yLjktMi42LTQuMiAtMS0xLjItMC4xLTIuMSAwLjYtMy4xIDAuNS0wLjYgMy42IDAuNCA0LjQgMC41IDQuMSAwLjMgNy4zLTEuOSAxMS0zLjEgMy45LTEuMyA3LjktMi41IDExLjgtMy45IDcuOS0yLjkgMTYtNiAyMy42LTkuNiAzLTEuNCA1LjQtMy41IDguMy01LjEgMy0xLjcgNC42LTUgOC4yLTUuMyAxNC45LTEuMiAzMS03IDQzLTE2LjEgMTItOS4zIDIwLjYtMjIuMSAyNi4xLTM2LjMgNi4xLTE1LjYgMTAuOS0zMS44IDE4LjUtNDYuNyAzLjctNy4zIDcuNi0xNC4xIDEyLjgtMjAuNSA0LjktNiA5LjEtMTEuMSAxMS45LTE4LjQgMi42LTcgMi0xNC4xIDIuNi0yMS40IDAuNi04LjEtMC4yLTE2LjMgMC45LTI0LjMgMC41LTQuMSAxLjEtOC40IDIuNC0xMi40IDEuNC00LjIgMy4zLTguMSA0LjctMTIuMiAxLjEtMy4xIDEuMi02IDAuNi05LjIgLTAuMS0wLjUgMi40LTMuNCAyLjktMy44IDEuMS0wLjcgMi41LTAuMyAzLjktMC40IDMuOS0wLjMgNi4zLTQgOC44LTYuNSAwLjktMC45IDEuNi0yLjIgMi4zLTMuNCAwLjgtMS4zIDIuMy0yIDMuNS0yLjggMi40LTEuNiA1LTMgNy41LTQuMyAzLjYtMS44IDMuOC0xLjUgNy4xIDAuMSAyLjYgMS4zIDUuNCAyLjIgOC4zIDIuOCA0LjQgMC45IDkuMS0wLjYgMTEuMSA0LjFDNTA2LjcgODguNSA1MDYuNSA4Ny40IDUwNi41IDg2LjJNMTk1LjUgMzUyLjZDMTk1LjYgMzUyLjMgMTk1LjYgMzUyLjMgMTk1LjUgMzUyLjZNMTk5LjcgMzY5Yy0wLjItMS4zLTAuNC0yLjctMC41LTRDMTk5LjMgMzY1LjkgMjAwLjIgMzY4LjcgMTk5LjcgMzY5TTIxNSAzNjcuM2MwLjUgMiAzLjQgNC4zIDIuNyA2LjIgLTAuNi0xLjktMi40LTIuMy0yLjYtNCAtMC41LTIuOS0yLjEtNS45LTIuMS04LjhDMjEzLjcgMzYyLjkgMjE0LjQgMzY1LjEgMjE1IDM2Ny4zTTIxNC45IDM3MC43Yy0xLjIgMC4zLTEuNC0wLjYtMS41LTEuN0MyMTMuOSAzNjkuNiAyMTQuNCAzNzAuMSAyMTQuOSAzNzAuN00yMTguNSA0MTcuN2MtMC4zIDMuNy0xIDcuMy0xLjkgMTEgLTguMi0xMy4xLTEzLTI3LjgtMTIuMS00My40IDEuNiAwLjggMS44IDIuMiAyLjYgMy43IDAuMy0wLjMgMC40LTAuMyAwLjItMC45IC0wLjctMS42LTAuNC0yLTAuNS0zLjMgLTAuMi0yLjUtMS4yLTUtMS44LTcuNSAxLjkgMS43IDIuNCA0LjIgMy40IDYuNSAxLjQgMy4yIDIuMSAyLjQgMS4xLTAuNSAwLjggMC41IDEuMSAxLjggMS44IDIuNiAtMC4xLTAuNi0xLjItMi40LTEtMyAwLjQtMC45IDAuMi0xLjItMC4xLTIuMiAtMC45LTIuNS0zLjItNi4yLTIuOC04LjkgMi4xIDQuMSAyLjUgOS4xIDUuNCAxMi43IC0xLjYtNy41LTMuMy0xNS40LTQuNC0yMy4zIDAuMyAyLjMgMS42IDQuMyAyLjIgNi41IDAuNSAxLjggMSAzIDEuMSA0LjYgMC40IDUuMiAyLjIgMTAuMSAzLjQgMTUuMkMyMTcuMyAzOTcuMyAyMTguOSA0MDcuNyAyMTguNSA0MTcuN00yMTkuMSAzNjlDMjE5IDM2OC40IDIxOS4xIDM2OC45IDIxOS4xIDM2OU0yMjIgNDMxLjRDMjIxLjggNDMxLjQgMjIyLjEgNDMxLjQgMjIyIDQzMS40TTI4NS4yIDQ0MS4zYzAuMiAwLjEgMC40IDAuMSAwLjcgMC4yIC0wLjQtMC4xLTAuOS0wLjItMS4zLTAuNEMyODQuOCA0NDEuMiAyODUgNDQxLjMgMjg1LjIgNDQxLjNNNDI2LjIgMjYuOGMwLjUgMC4yIDAuNyAwIDAuOSAwLjVDNDI2LjggMjcuMSA0MjYuNSAyNyA0MjYuMiAyNi44TTQ4MSA2NmMtMC4zLTAuMS0wLjYgMC40LTAuNC0wLjIgMC4zIDAgMC42IDAuMSAwLjkgMC4xQzQ4MS40IDY2IDQ4MS4yIDY2IDQ4MSA2Nk00NzUuMyAzMi40QzQ3NS4xIDMyLjUgNDc1LjEgMzIuNSA0NzUuMyAzMi40Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNBNTFDMjEiIGQ9Ik00ODQuOSAzNy4yYzAuNS0xLjgtMS41LTQuOC0yLjctMi4yIC0wLjgtMC42LTAuMy0xLjgtMS4yLTIuNCAtMS41LTEuMS0yLjYgMC44LTIuNSAyLjIgLTMuNy0yLjgtNC41LTMuMS01LjUgMS40IC0wLjMgMS40IDAuOCAxLjkgMC44IDMgMCAyLjMgMS4yIDQuMyAyLjIgNi4zIDEuNiAzLjQgNC4yIDcuNiAyLjMgMTEuMSAtMC44IDEuNS0xLjggMi40LTMuMiAzLjQgLTEgMC43LTMgMS43LTIuMSAzLjEgLTUuNCAwLjYtOC44LTguNy0xMi4xLTExLjcgLTIuNy0yLjQtNS41LTIuOS04LjktMy44IC0wLjIgMC0wLjItMC42LTAuNi0wLjcgLTAuOC0wLjEtMS41IDAuMi0yLjMgMC40IC0xLjIgMC4zLTIuMiAwLjgtMy41IDAuOCAtMy44LTAuMS02LjggMS40LTEwLjUgMS45IC0yLjMgMC4zLTMuMyAxLTEuNyAyLjYgMS4zIDEuMiAyLjMgMiAzLjEgMy43IDAuNyAxLjYgMC42IDMuOSAxLjMgNS4zIDAuNCAwLjcgMC41IDEuMSAxLjUgMSAxLTAuMSAxLjIgMyAwLjggMy4yIC0wLjEgMC0wLjEgMC4xLTAuMiAwLjEgLTAuNC0wLjYtMi4yLTEuNC0yLjctMC41IC0wLjQgMC43IDAuNiAwLjggMC42IDEuMSAwLjEgMC43IDAgMS45IDAgMi45IC0yLjEtMC41LTQuMS0wLjgtNi4yLTEgLTIuMS0wLjItMi43LTAuNy00LjUtMS4yIC0wLjMtMC4xLTEuNyAwLjEtMS43IDAuMSAtMC43LTAuNS0xLjItMi4yLTEuNi0yLjkgLTAuOC0xLjItMS42LTItMS44LTMuNSAwLjkgMC44IDIuMiAxLjUgMy40IDEgLTAuNi0wLjUtMS43LTEuNS0yLjItMi4yIC0wLjQtMC42LTAuMi0xLjgtMS0yLjIgLTMuNC0xLjUtMS45IDcuNi0yLjIgOC41IC0wLjMgMC44LTEuOSAxLjItMi40IDIuMiAtMC4zIDAuNS0wLjMgMS40LTAuNSAyIC0wLjIgMC43LTAuNCAyLjIgMC4zIDIuNCAwLjIgMCAwLjgtMS4xIDEuMy0xLjIgLTEuMSAxLjUtMC42IDcuMS0wLjEgOSAwLjggMyAyLjMgNS4xIDMuNyA3LjggMC42IDEuMiAyLjEgMi4xIDIuOSAzLjMgMC45IDEuNCAxLjUgMyAxLjkgNC43IDAuNyAzLjEgMS4yIDcgMyA5LjYgMSAxLjUgMi44IDAuMSAzLjctMC43IDItMS45IDEuNS00LjIgMi43LTYuMiA0LTYuNiAxMy0xMS4xIDE5LjctMTQuMSAxLjctMC44IDMuOC0xLjggNS43LTEuOCAtNy44IDQuNi0xNi41IDcuNy0yMi45IDE0LjYgLTMgMy4yIDEgMy4zIDMuNyA0LjEgMS4zIDAuNCAxLjcgMC4zIDIuMyAxLjQgMC43IDEuNCAzLjgtMC43IDQuNi0xLjMgLTAuMyAwLjktMiAzLjYtMS42IDQuMSAxIDEuMiA1LTUuMiA1LjQtNS43IDIuMy0yLjIgNi4xLTEuNiA4LjgtMy4yIDItMS4yIDMuNy0zLjQgNC44LTUuNCAwLjYtMS4xIDAuOS0yLjMgMS4yLTMuNCAwLjItMC44IDIuOS0xLjUgMy41LTEuOCAyLjgtMS4yLTAuNi0yLjQtMS41LTMuMyAtMi4xLTIuMSA1LjQtNC45IDYuOC01LjEgMy40LTAuNCA3LjEgMC41IDEwLjYgMC4zIDAuNCAwIDAuOCAwLjYgMS4zIDAuMiAwLjctMC41IDAtMC44IDAuMS0wLjkgLTAuMiAwLjItMC42LTAuMy0wLjQtMC43IDAuMS0wLjIgMC45IDAuMyAxLjEgMCAwLjUtMC44IDEuNS0wLjUtMC4zLTEuMyAtMS44LTAuOS00LjggMC4yLTYuOCAwLjIgLTMuNiAwLTYuOC0xLTEwLjQtMC44IC00LjMgMC4yLTguMiAwLjEtMTIuNCAwLjcgLTAuMS0wLjItMC4zLTEuMS0wLjMtMS4zIDIuNS0xIDQuNy0yLjYgNy4yLTIuNiAxIDAgMS41LTAuNCAyLjMtMC43IDEuMi0wLjMgMi40LTAuNCAzLjctMC4zIDEuOSAwLjEgNiA0LjEgOCAxLjkgMS0xLjEgMS4yLTIuMiAwLjgtMy42IDEuNyAxLjIgMC45LTAuNCAxLjEtMS4xIDAuNC0xLTAuMS0xLjEgMC44LTEuOSAwLjctMC43IDIuNC0wLjUgMy4zLTAuMyAxIDAuMiAzLjYgMi40IDQuMyAwLjcgMC4yLTAuNi0wLjUtMS40LTAuOS0yIDMuNC0wLjIgMy42LTAuNyAxLjEtMy4xIC0wLjEtMC4xLTEuNi0wLjItMS0wLjYgMC41LTAuMyAwLjctMC42IDAuNi0xLjIgLTAuMy0xLjktMi41LTEuNC0wLjktMy42IDEuOS0yLjYgMi4zLTIuOSAxLjEtNS45IC0wLjQtMS4xIDEuNS01LTEuNC00LjYgMC40LTEuMyAxLjgtMy44IDEuMS01LjIgLTAuOS0xLjgtMi4xLTAuOC0zLjEgMC40IC0xLjggMi4zLTEuNyAxLjQtMS40LTEuM0M0ODYuNiAzOC41IDQ4Ni4zIDM3LjQgNDg0LjkgMzcuMk00NTEuMyA0OC44YzQuNSAwLjUgOC4xIDIuNiAxMC45IDYuMyAtMC4yIDAuNy0wLjggMC4zLTEuMiAwLjggLTAuNSAwLjUtMS4xLTAuMS0xLjIgMC44IC0wLjEgMC43IDAgMS44LTAuNCAyLjQgLTEuNiAyLjItMy45IDMuMy02LjggMy4xIC0yLjUtMC4yLTQuNy0xLjgtNi4yLTMuNyAtMS4zLTEuNy0xLjItNC4zLTMtNS43IDEtMC42IDEuOC0xLjMgMi44LTEuOSAxLjgtMSAzLjktMS4xIDYtMC43IDEuNiAwLjQgMy4zIDEuMyA0LjYgMi40IDEgMC44IDEuNCAxLjggMi44IDEuOUM0NTkuNSA1MS43IDQ1My42IDQ5LjEgNDUxLjMgNDguOE00NDMgNTUuNWMxLjQgNS4xIDYuMiA5LjIgMTEuNyA4LjQgMi40LTAuNCA1LjYtMS4yIDcuMi0zLjEgLTIuNiAzLTYgNC41LTkuOSA0LjMgLTMtMC4xLTQuOS0xLTYuOC0zLjMgLTEuMi0xLjQtMy43LTUuNy0yLjQtNy40QzQ0Mi45IDU0LjcgNDQzIDU1LjEgNDQzIDU1LjVNNDgxLjYgNTUuOUM0ODEuNSA1Ni4xIDQ4MS41IDU2LjEgNDgxLjYgNTUuOU00NzIuNCA3N2MtMy43IDAuMi03LjggMC45LTExLjcgMS44IC0xLjggMC40LTUuNCAxLjgtNy4xIDAuOSAxLjktMC42IDMuMi0xLjYgNC43LTIuNyAtMC4yIDEuNyA0LjEgMC4xIDUuMSAwQzQ2Ni40IDc2LjYgNDY5LjQgNzYuNyA0NzIuNCA3N000MzEuNiA5M2MwLTAuMiAwLTAuNS0wLjEtMC43IDAuMSAwIDAuMiAwLjEgMC40IDAuMUM0MzEuNyA5Mi41IDQzMS43IDkyLjcgNDMxLjYgOTNNNDMzLjIgMTAwLjlDNDMzIDEwMS4yIDQzMi45IDEwMS4zIDQzMy4yIDEwMC45Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkNDMzMiIGQ9Ik00NTAuNCA1MC45Yy01LjcgMi0zLjIgMTEuNCAyLjggMTFDNDYwLjMgNjEuNSA0NTcuMyA0OS41IDQ1MC40IDUwLjlNNDUxLjkgNTkuNmMtNC4xLTEuNi0xLjctOC40IDEuOS01LjlDNDU2LjEgNTUuMyA0NTUgNjAuNCA0NTEuOSA1OS42Ii8+PC9zdmc+"
					}
				],

				backdrops: [
					{
						name: "farm",
						data: "data:image/png;base64,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"
					}
				]
			},

			blocks: {
				"closeSelf": [
					"receiveGo",
					 "xPosition",
					 "yPosition",
					 "direction"
				],
				"startChunkBlocks": [
					"receiveGo"
				],
				"snapNames": {
					"operators": {
					  "join": "reportJoinWords",
					   "round": "reportRound",
					   "pickrandombetween": "reportRandom",
					   "operationofnumber": "reportMonadic",
					   "%": "reportModulus",
					   "*": "reportProduct",
					   "+": "reportSum",
					   "letternumber": "reportLetter",
					   "/": "reportQuotient",
					   "lengthof": "reportStringSize",
					   "-": "reportDifference",
					   "not": "reportNot",
					   "or": "reportOr",
					   ">": "reportGreaterThan",
					   "&": "reportAnd",
					   "=": "reportEquals",
					   "<": "reportLessThan"
					},
					 "data": {
					  "changeby": "doChangeVar",
					   "set": "doSetVar",
					   "hidevariable": "doHideVar",
					   "showvariable": "doShowVar"
					},
					 "sensing": {
					  "iskeypressed": "reportKeyPressed",
					   "mousey": "reportMouseY",
					   "touchingitem": "reportTouchingObject",
					   "askandwait": "doAsk",
					   "resettimer": "doResetTimer",
					   "ismousedown": "reportMouseDown",
					   "distanceto": "reportDistanceTo",
					   "mousex": "reportMouseX",
					   "answer": "getLastAnswer",
					   "timer": "getTimer",
					   "touchingcolor": "reportTouchingColor",
					   "current": "reportDate",
					   "colorstouching": "reportColorIsTouchingColor"
					},
					 "events": {
					  "keypressed": "receiveKey",
					   "flagclicked": "receiveGo",
						"whenflagclicked": "receiveGo",
					   "ireceivemessage": "receiveMessage",
					   "thisspriteclicked": "receiveInteraction",
					   "broadcast": "doBroadcast",
					   "broadcastandwait": "doBroadcastAndWait"
					},
					 "control": {
					  "forever": "doForever",
					   "createcloneof": "createClone",
					   "whenistartasaclone": "receiveOnClone",
					   "if": "doIf",
					   "waituntil": "doWaitUntil",
					   "wait": "doWait",
					   "repeatuntil": "doUntil",
					   "deletethisclone": "removeClone",
					   "stopOthers": "doStopOthers",
					   "stopThis": "doStopThis",
					   "repeat": "doRepeat"
					},
					 "pen": {
					  "changepencolorby": "changeHue",
					   "changepenshadeby": "changeBrightness",
					   "setpensizeto": "changeSize",
					   "penup": "up",
					   "clear": "clear",
					   "pendown": "down",
					   "changepensizeby": "setSize",
					   "setpencolorto": "setColor",
					   "setpencolortonumber": "setHue",
					   "stamp": "doStamp"
					},
					 "motion": {
					  "ypos": "yPosition",
					   "turnleft": "turnLeft",
					   "move": "forward",
					   "turnright": "turn",
					   "direction": "direction",
					   "pointtowards": "doFaceTowards",
					   "changex": "changeXPosition",
					   "changey": "changeYPosition",
					   "xpos": "xPosition",
					   "gotoxy": "gotoXY",
					   "glide": "doGlide",
					   "ifedgebounce": "bounceOffEdge",
					   "sety": "setYPosition",
					   "setx": "setXPosition",
					   "pointdirection": "setHeading",
					   "gotoobject": "doGotoObject"
					},
					 "looks": {
					  "cleargraphiceffects": "clearEffects",
					   "changeeffect": "changeEffect",
					   "gobacklayers": "goBack",
					   "seteffect": "setEffect",
					   "show": "show",
					   "timedsay": "doSayFor",
					   "changesizeby": "changeScale",
					   "think": "doThink",
					   "timedthink": "doThinkFor",
					   "hide": "hide",
					   "size": "getScale",
					   "costumenumber": "getCostumeIdx",
					   "setsizeto": "setScale",
					   "nextcostume": "doWearNextCostume",
					   "gotofront": "comeToFront",
					   "say": "bubble",
					   "switchcostumeto": "doSwitchToCostume"
					},
					 "sound": {
					  "playsound": "playSound",
					   "playsounduntildone": "doPlaySoundUntilDone",
					   "tempo": "getTempo",
					   "restfor": "doRest",
					   "stopallsounds": "doStopAllSounds",
					   "changetempoby": "doChangeTempo",
					   "playnote": "doPlayNote",
					   "settempoto": "doSetTempo"
					}
				},
				"abbreviations": {
					"l": "looks",
					 "m": "motion",
					 "c": "control",
					 "d": "data",
					 "e": "events",
					 "o": "operators",
					 "gox": "changex",
					 "goy": "changey",
					 "s": "sensing",
					 "p": "pen",
					 "whenflagclicked": "flaglicked",
					 "clearEffects": "cleargraphiceffects"
				}
			}
		};
	});
}());}());
(function(){(function(){
	angular.module("etch")
	
	.factory("random", function randomFactory(){
		var words = {
			adjectives: ["quizzical", "highfalutin", "dynamic", "wakeful", "cheerful", "thoughtful", "cooperative", "questionable", "abundant", "uneven", "yummy", "juicy", "vacuous", "concerned", "young", "sparkling", "abhorrent", "sweltering", "late", "scrawny", "friendly", "kaput", "divergent", "busy", "charming", "protective", "premium", "puzzled", "waggish", "rambunctious", "puffy", "hard", "fat", "sedate", "resonant", "dapper", "courageous", "vast", "cool", "elated", "wary", "bewildered", "level", "wooden", "ceaseless", "tearful", "cloudy", "gullible", "flashy", "trite", "quick", "nondescript", "round", "slow", "spiritual", "brave", "tenuous", "abstracted", "colossal", "sloppy", "obsolete", "elegant", "fabulous", "vivacious", "exuberant", "faithful", "helpless", "odd", "sordid", "blue", "imported", "ugly", "ruthless", "deeply", "eminent", "reminiscent", "rotten", "sour", "volatile", "succinct", "judicious", "abrupt", "learned", "stereotyped", "evanescent", "efficacious", "festive", "loose", "torpid", "condemned", "selective", "strong", "momentous", "ordinary", "dry", "great", "ultra", "ahead", "broken", "dusty", "piquant", "creepy", "miniature", "periodic", "equable", "unsightly", "narrow", "grieving", "whimsical", "fantastic", "kindhearted", "miscreant", "cowardly", "cloistered", "marked", "bloody", "chunky", "undesirable", "oval", "nauseating", "aberrant", "stingy", "standing", "distinct", "illegal", "angry", "faint", "rustic", "few", "calm", "gorgeous", "mysterious", "tacky", "unadvised", "greasy", "minor", "loving", "melodic", "flat", "wretched", "clever", "barbarous", "pretty", "endurable", "handsomely", "unequaled", "acceptable", "symptomatic", "hurt", "tested", "long", "warm", "ignorant", "ashamed", "excellent", "known", "adamant", "eatable", "verdant", "meek", "unbiased", "rampant", "somber", "cuddly", "harmonious", "salty", "overwrought", "stimulating", "beautiful", "crazy", "grouchy", "thirsty", "joyous", "confused", "terrible", "high", "unarmed", "gabby", "wet", "sharp", "wonderful", "magenta", "tan", "huge", "productive", "defective", "chilly", "needy", "imminent", "flaky", "fortunate", "neighborly", "hot", "husky", "optimal", "gaping", "faulty", "guttural", "massive", "watery", "abrasive", "ubiquitous", "aspiring", "impartial", "annoyed", "billowy", "lucky", "panoramic", "heartbreaking", "fragile", "purring", "wistful", "burly", "filthy", "psychedelic", "harsh", "disagreeable", "ambiguous", "short", "splendid", "crowded", "light", "yielding", "hypnotic", "dispensable", "deserted", "nonchalant", "green", "puny", "deafening", "classy", "tall", "typical", "exclusive", "materialistic", "mute", "shaky", "inconclusive", "rebellious", "doubtful", "telling", "unsuitable", "woebegone", "cold", "sassy", "arrogant", "perfect", "adhesive", "industrious", "crabby", "curly", "voiceless", "nostalgic", "better", "slippery", "willing", "nifty", "orange", "victorious", "ritzy", "wacky", "vigorous", "spotless", "good", "powerful", "bashful", "soggy", "grubby", "moaning", "placid", "permissible", "half", "towering", "bawdy", "measly", "abaft", "delightful", "goofy", "capricious", "nonstop", "addicted", "acoustic", "furtive", "erratic", "heavy", "square", "delicious", "needless", "resolute", "innocent", "abnormal", "hurried", "awful", "impossible", "aloof", "giddy", "large", "pointless", "petite", "jolly", "boundless", "abounding", "hilarious", "heavenly", "honorable", "squeamish", "red", "phobic", "trashy", "pathetic", "parched", "godly", "greedy", "pleasant", "small", "aboriginal", "dashing", "icky", "bumpy", "laughable", "hapless", "silent", "scary", "shaggy", "organic", "unbecoming", "inexpensive", "wrong", "repulsive", "flawless", "labored", "disturbed", "aboard", "gusty", "loud", "jumbled", "exotic", "threatening", "belligerent", "synonymous", "encouraging", "fancy", "embarrassed", "clumsy", "fast", "ethereal", "chubby", "high-pitched", "plastic", "open", "straight", "little", "ancient", "fair", "psychotic", "murky", "earthy", "callous", "heady", "lamentable", "hallowed", "obtainable", "toothsome", "oafish", "gainful", "flippant", "tangy", "tightfisted", "damaging", "utopian", "gaudy", "brainy", "imperfect", "shiny", "fanatical", "snotty", "relieved", "shallow", "foamy", "parsimonious", "gruesome", "elite", "wide", "kind", "bored", "tangible", "depressed", "boring", "screeching", "outrageous", "determined", "picayune", "glossy", "historical", "staking", "curious", "gigantic", "wandering", "profuse", "vengeful", "glib", "unaccountable", "frightened", "outstanding", "chivalrous", "workable", "modern", "swanky", "comfortable", "gentle", "substantial", "brawny", "curved", "nebulous", "boorish", "afraid", "fierce", "efficient", "lackadaisical", "recondite", "internal", "absorbed", "squealing", "frail", "thundering", "wanting", "cooing", "axiomatic", "debonair", "boiling", "tired", "numberless", "flowery", "mushy", "enthusiastic", "proud", "upset", "hungry", "astonishing", "deadpan", "prickly", "mammoth", "absurd", "clean", "jittery", "wry", "entertaining", "literate", "lying", "uninterested", "aquatic", "super", "languid", "cute", "absorbing", "scattered", "brief", "halting", "bright", "fuzzy", "lethal", "scarce", "aggressive", "obsequious", "fine", "giant", "holistic", "pastoral", "stormy", "quaint", "nervous", "wasteful", "grotesque", "loutish", "abiding", "unable", "dysfunctional", "knowledgeable", "truculent", "various", "luxuriant", "shrill", "spiffy", "guarded", "colorful", "misty", "spurious", "freezing", "glamorous", "famous", "new", "instinctive", "nasty", "exultant", "seemly", "tawdry", "maniacal", "wrathful", "shy", "nutritious", "idiotic", "worried", "bad", "stupid", "ruddy", "wholesale", "naughty", "thoughtless", "futuristic", "available", "slimy", "cynical", "fluffy", "plausible", "nasty", "tender", "changeable", "smiling", "oceanic", "satisfying", "steadfast", "ugliest", "crooked", "subsequent", "fascinated", "woozy", "teeny", "quickest", "moldy", "uppity", "sable", "horrible", "silly", "ad hoc", "numerous", "berserk", "wiry", "knowing", "lazy", "childlike", "zippy", "fearless", "pumped", "weak", "tacit", "weary", "rapid", "precious", "smoggy", "swift", "lyrical", "steep", "quack", "direful", "talented", "hesitant", "fallacious", "ill", "quarrelsome", "quiet", "flipped-out", "didactic", "fluttering", "glorious", "tough", "sulky", "elfin", "abortive", "sweet", "habitual", "supreme", "hollow", "possessive", "inquisitive", "adjoining", "incandescent", "lowly", "majestic", "bizarre", "acrid", "expensive", "aback", "unusual", "foolish", "jobless", "capable", "damp", "political", "dazzling", "erect", "Early", "immense", "hellish", "omniscient", "reflective", "lovely", "incompetent", "empty", "breakable", "educated", "easy", "devilish", "assorted", "decorous", "jaded", "homely", "dangerous", "adaptable", "coherent", "dramatic", "tense", "abject", "fretful", "troubled", "diligent", "solid", "plain", "raspy", "irate", "offbeat", "healthy", "melted", "cagey", "many", "wild", "venomous", "animated", "alike", "youthful", "ripe", "sincere", "teeny-tiny", "lush", "defeated", "zonked", "foregoing", "dizzy", "frantic", "obnoxious", "funny", "damaged", "grandiose", "spectacular", "maddening", "defiant", "makeshift", "strange", "painstaking", "merciful", "madly", "clammy", "itchy", "difficult", "clear", "used", "temporary", "abandoned", "null", "rainy", "evil", "alert", "domineering", "amuck", "rabid", "jealous", "robust", "obeisant", "overt", "enchanting", "longing", "cautious", "motionless", "bitter", "anxious", "craven", "breezy", "ragged", "skillful", "quixotic", "knotty", "grumpy", "dark", "draconian", "alluring", "magical", "versed", "humdrum", "accurate", "ludicrous", "sleepy", "envious", "lavish", "roasted", "thinkable", "overconfident", "roomy", "painful", "wee", "observant", "old-fashioned", "royal", "likeable", "adventurous", "eager", "obedient", "spooky", "poised", "righteous", "excited", "real", "abashed", "womanly", "ambitious", "lacking", "testy", "big", "gamy", "early", "auspicious", "blue-eyed ", "discreet", "nappy", "vague", "helpful", "nosy", "perpetual", "disillusioned", "overrated", "gleaming", "tart", "soft", "agreeable", "therapeutic", "accessible", "poor", "gifted", "old", "humorous", "flagrant", "magnificent", "alive", "understood", "economic", "mighty", "ablaze", "racial", "tasteful", "purple", "broad", "lean", "legal", "witty", "nutty", "icy", "feigned", "redundant", "adorable", "apathetic", "jumpy", "scientific", "combative", "worthless", "tasteless", "voracious", "jazzy", "uptight", "utter", "hospitable", "imaginary", "finicky", "shocking", "dead", "noisy", "shivering", "subdued", "rare", "zealous", "demonic", "ratty", "snobbish", "deranged", "muddy", "whispering", "credible", "hulking", "tight", "abusive", "functional", "obscene", "thankful", "daffy", "smelly", "lively", "secretive", "amused", "mere", "agonizing", "sad", "innate", "sneaky", "noxious", "illustrious", "alleged", "cultured", "tame", "macabre", "lonely", "mindless", "low", "scintillating", "statuesque", "decisive", "rhetorical", "hysterical", "happy", "earsplitting", "mundane", "spicy", "overjoyed", "taboo", "peaceful", "forgetful", "elderly", "upbeat", "squalid", "warlike", "dull", "plucky", "handsome", "groovy", "absent", "wise", "romantic", "invincible", "receptive", "smooth", "different", "tiny", "cruel", "dirty", "faded", "tiresome", "wicked", "average", "panicky", "detailed", "juvenile", "scandalous", "steady", "wealthy", "deep", "sticky", "jagged", "wide-eyed", "tasty", "disgusted", "garrulous", "graceful", "tranquil", "annoying", "hissing", "noiseless", "selfish", "onerous", "lopsided", "ossified", "penitent", "malicious", "aromatic", "successful", "zany", "evasive", "wet", "naive", "nice", "uttermost", "brash", "muddled", "energetic", "accidental", "silky", "guiltless", "important", "drab", "aware", "skinny", "careful", "rightful", "tricky", "sore", "rich", "blushing", "stale", "daily", "watchful", "uncovered", "rough", "fresh", "hushed", "rural"],
			nouns: ["ball", "bat", "bun", "can", "cake", "cap", "car", "cat", "cow", "cub", "cup", "day", "dog", "doll", "dust", "fan", "feet", "hall", "hat", "hen", "jar", "kite", "map", "pan", "pet", "pie", "pig", "pot", "rat", "sun", "toe", "tub", "van", "apple", "arm", "banana", "bike", "bird", "chin", "clam", "class", "clover", "club", "corn", "crayon", "crow", "crown", "crowd", "crib", "desk", "dime", "dirt", "dress", "fang", "field", "flag", "flower", "fog", "game", "heat", "hill", "home", "horn", "hose", "joke", "juice", "kite", "lake", "maid", "mask", "mice", "milk", "mint", "meal", "meat", "moon", "morning", "name", "nest", "nose", "pear", "pen", "pencil", "plant", "rain", "river", "road", "rock", "room", "rose", "seed", "shape", "shoe", "shop", "show", "sink", "snail", "snake", "snow", "soda", "sofa", "star", "step", "stew", "stove", "straw", "string", "summer", "swing", "table", "tank", "team", "tent", "test", "toes", "tree", "vest", "water", "wing", "winter", "alarm", "animal", "aunt", "bait", "balloon", "bath", "bead", "beam", "bean", "bedroom", "boot", "bread", "brick", "camp", "chicken", "crook", "deer", "dock", "doctor", "downtown", "drum", "dust", "eye", "fight", "flesh", "food", "frog", "goose", "grade", "grape", "grass", "hook", "horse", "jam", "kitten", "light", "loaf", "lock", "lunch", "lunchroom", "meal", "notebook", "owl", "pail", "parent", "park", "plot", "rabbit", "rake", "robin", "sack", "sail", "scale", "sea", "soap", "song", "spark", "space", "spoon", "spot", "spy", "summer", "tiger", "toad", "town", "trail", "tramp", "tray", "trick", "trip", "vase", "winter", "water", "week", "wheel", "wish", "wool", "yard", "zebra", "actor", "airplane", "airport", "army", "baseball", "beef", "birthday", "brush", "bushes", "butter", "cast", "cave", "cent", "cherries", "cherry", "cobweb", "coil", "cracker", "dinner", "eggnog", "elbow", "face", "flavor", "gate", "glove", "glue", "goldfish", "goose", "grain", "hair", "haircut", "hobbies", "holiday", "hot", "jellyfish", "ladybug", "mailbox", "number", "oatmeal", "pail", "pancake", "pear", "pest", "popcorn", "queen", "quicksand", "quiet", "quilt", "rainstorm", "scarecrow", "scarf", "stream", "street", "sugar", "throne", "toothpaste", "twig", "volleyball", "wood", "wrench", "advice", "anger", "answer", "apple", "arithmetic", "badge", "basket", "basketball", "battle", "beast", "beetle", "beggar", "brain", "branch", "bubble", "bucket", "cactus", "cannon", "cattle", "celery", "cellar", "cloth", "coach", "coast", "crate", "cream", "donkey", "drug", "earthquake", "feast", "fifth", "finger", "flock", "frame", "furniture", "geese", "ghost", "giraffe", "governor", "honey", "hope", "hydrant", "icicle", "income", "island", "jeans", "judge", "lace", "lamp", "lettuce", "marble", "month", "north", "ocean", "patch", "plane", "playground", "poison", "riddle", "rifle", "scale", "seashore", "sheet", "sidewalk", "skate", "slave", "sleet", "smoke", "stage", "station", "thrill", "throat", "throne", "title", "toothbrush", "turkey", "underwear", "vacation", "vegetable", "visitor", "voyage", "year", "able", "achieve", "acoustics", "action", "activity", "aftermath", "afternoon", "afterthought", "apparel", "appliance", "beginner", "believe", "bomb", "border", "boundary", "breakfast", "cabbage", "cable", "calculator", "calendar", "caption", "carpenter", "cemetery", "channel", "circle", "creator", "creature", "education", "faucet", "feather", "friction", "fruit", "fuel", "galley", "guide", "guitar", "health", "heart", "idea", "kitten", "laborer", "language", "lawyer", "linen", "locket", "lumber", "magic", "minister", "mitten", "money", "mountain", "music", "pickle", "picture", "plastic", "pleasure", "pocket", "pollution", "railway", "recess", "reward", "route", "scene", "scent", "squirrel", "stranger", "suit", "sweater", "temper", "territory", "texture", "thread", "treatment", "veil", "vein", "volcano", "wealth", "weather", "wilderness", "wren", "wrist", "writer", "account", "achiever", "acoustics", "act", "action", "activity", "actor", "addition", "adjustment", "advertisement", "advice", "aftermath", "afternoon", "afterthought", "agreement", "air", "airplane", "airport", "alarm", "amount", "amusement", "anger", "angle", "animal", "answer", "ant", "ants", "apparatus", "apparel", "apple", "apples", "appliance", "approval", "arch", "argument", "arithmetic", "arm", "army", "art", "attack", "attempt", "attention", "attraction", "aunt", "authority", "babies", "baby", "back", "badge", "bag", "bait", "balance", "ball", "balloon", "balls", "banana", "band", "base", "baseball", "basin", "basket", "basketball", "bat", "bath", "battle", "bead", "beam", "bean", "bear", "bears", "beast", "bed", "bedroom", "beds", "bee", "beef", "beetle", "beggar", "behavior", "belief", "believe", "bell", "bells", "berry", "bike", "bikes", "bird", "birds", "birth", "birthday", "bit", "bite", "blade", "blood", "blow", "board", "boat", "boats", "body", "bomb", "bone", "books", "boot", "border", "bottle", "boundary", "box", "brain", "brake", "branch", "brass", "bread", "breakfast", "breath", "brick", "bridge", "brush", "bubble", "bucket", "building", "bulb", "bun", "burn", "burst", "bushes", "business", "butter", "button", "cabbage", "cable", "cactus", "cake", "cakes", "calculator", "calendar", "camera", "camp", "can", "cannon", "canvas", "cap", "caption", "car", "card", "care", "carpenter", "carriage", "cars", "cart", "cast", "cat", "cats", "cattle", "cause", "cave", "celery", "cellar", "cemetery", "cent", "chain", "chair", "chairs", "chalk", "chance", "change", "channel", "cheese", "cherries", "cherry", "chess", "chicken", "chickens", "chin", "church", "circle", "clam", "class", "clock", "clocks", "cloth", "cloud", "clouds", "clover", "club", "coach", "coal", "coast", "coat", "cobweb", "coil", "collar", "color", "comb", "comfort", "committee", "company", "comparison", "competition", "condition", "connection", "control", "cook", "copper", "copy", "cord", "cork", "corn", "cough", "country", "cover", "cow", "cows", "crack", "cracker", "crate", "crayon", "cream", "creator", "creature", "credit", "crib", "crime", "crook", "crow", "crowd", "crown", "crush", "cry", "cub", "cup", "current", "curtain", "curve", "cushion", "day", "death", "debt", "decision", "deer", "degree", "design", "desire", "desk", "destruction", "detail", "development", "digestion", "dime", "dinner", "dinosaurs", "direction", "dirt", "discovery", "discussion", "disease", "disgust", "distance", "distribution", "division", "dock", "doctor", "dog", "dogs", "doll", "dolls", "donkey", "door", "downtown", "drain", "drawer", "driving", "drop", "drug", "drum", "duck", "ducks", "dust", "ear", "earth", "earthquake", "edge", "education", "effect", "egg", "eggnog", "eggs", "elbow", "end", "engine", "error", "event", "example", "exchange", "existence", "expansion", "experience", "expert", "eye", "eyes", "face", "fact", "fairies", "fall", "family", "fan", "fang", "farm", "faucet", "fear", "feast", "feather", "feeling", "feet", "fiction", "field", "fifth", "fight", "finger", "finger", "fire", "fish", "flag", "flame", "flavor", "flesh", "flight", "flock", "floor", "flower", "flowers", "fly", "fog", "fold", "food", "foot", "force", "fork", "form", "fowl", "frame", "friction", "friend", "friends", "frog", "frogs", "front", "fruit", "fuel", "furniture", "alley", "game", "garden", "gate", "geese", "ghost", "giants", "giraffe", "girl", "girls", "glass", "glove", "glue", "goat", "gold", "goldfish", "good-bye", "goose", "government", "governor", "grade", "grain", "grape", "grass", "grip", "ground", "group", "growth", "guide", "guitar", "hair", "haircut", "hall", "hammer", "hand", "hands", "harbor", "harmony", "hat", "hate", "head", "health", "hearing", "heart", "heat", "help", "hen", "hill", "history", "hobbies", "hole", "holiday", "home", "honey", "hook", "hope", "horn", "horse", "horses", "hose", "hospital", "hot", "hour", "house", "houses", "humor", "hydrant", "ice", "icicle", "idea", "impulse", "income", "increase", "industry", "ink", "insect", "instrument", "insurance", "interest", "invention", "iron", "island", "jail", "jam", "jar", "jeans", "jelly", "jellyfish", "jewel", "join", "joke", "journey", "judge", "juice", "jump", "kettle", "key", "kick", "kiss", "kite", "kitten", "kittens", "kitty", "knee", "knife", "knot", "knowledge", "laborer", "lace", "ladybug", "lake", "lamp", "land", "language", "laugh", "lawyer", "lead", "leaf", "learning", "leather", "leg", "legs", "letter", "letters", "lettuce", "level", "library", "lift", "light", "limit", "line", "linen", "lip", "liquid", "list", "lizards", "loaf", "lock", "locket", "look", "loss", "love", "low", "lumber", "lunch", "lunchroom", "machine", "magic", "maid", "mailbox", "man", "map", "marble", "mark", "market", "mask", "mass", "match", "meal", "measure", "meat", "meeting", "memory", "metal", "mice", "middle", "milk", "mind", "mine", "minister", "mint", "minute", "mist", "mitten", "money", "monkey", "month", "moon", "morning", "motion", "mountain", "mouth", "move", "muscle", "music", "nail", "name", "nation", "neck", "need", "needle", "nerve", "nest", "net", "news", "night", "noise", "north", "nose", "note", "notebook", "number", "nut", "oatmeal", "observation", "ocean", "offer", "office", "oil", "operation", "opinion", "orange", "oranges", "order", "organization", "ornament", "oven", "owl", "owner", "page", "pail", "pain", "paint", "pan", "pancake", "paper", "parcel", "parent", "park", "part", "party", "paste", "patch", "payment", "peace", "pear", "pen", "pencil", "pest", "pet", "pets", "pickle", "picture", "pie", "pies", "pig", "pigs", "pin", "pipe", "pizzas", "place", "plane", "planes", "plant", "plantation", "plants", "plastic", "plate", "play", "playground", "pleasure", "plot", "plough", "pocket", "point", "poison", "polish", "pollution", "popcorn", "porter", "position", "pot", "potato", "powder", "power", "price", "print", "prison", "process", "produce", "profit", "property", "prose", "protest", "pull", "pump", "punishment", "purpose", "push", "quarter", "quartz", "queen", "question", "quicksand", "quiet", "quill", "quilt", "quince", "quiver", "rabbit", "rabbits", "rail", "railway", "rain", "rainstorm", "rake", "range", "rat", "rate", "ray", "reaction", "reading", "reason", "receipt", "recess", "record", "regret", "relation", "religion", "representative", "request", "respect", "rest", "reward", "rhythm", "rice", "riddle", "rifle", "ring", "rings", "river", "road", "robin", "rock", "rod", "roll", "roof", "room", "root", "rose", "route", "rub", "rule", "run", "sack", "sail", "salt", "sand", "scale", "scarecrow", "scarf", "scene", "scent", "school", "science", "scissors", "screw", "sea", "seashore", "seat", "secretary", "seed", "selection", "self", "sense", "servant", "shade", "shake", "shame", "shape", "sheep", "sheet", "shelf", "ship", "shirt", "shock", "shoe", "shoes", "shop", "show", "side", "sidewalk", "sign", "silk", "silver", "sink", "size", "skate", "skin", "sky", "sleep", "sleet", "slip", "slope", "smash", "smell", "smile", "smoke", "snail", "snails", "snake", "snakes", "sneeze", "snow", "soap", "society", "sock", "soda", "sofa", "song", "songs", "sort", "sound", "soup", "space", "spade", "spark", "spiders", "sponge", "spoon", "spot", "spring", "spy", "square", "squirrel", "stage", "stamp", "star", "start", "statement", "station", "steam", "steel", "stem", "step", "stew", "stick", "sticks", "stitch", "stocking", "stomach", "stone", "stop", "store", "story", "stove", "stranger", "straw", "stream", "street", "stretch", "string", "structure", "substance", "sugar", "suggestion", "suit", "summer", "sun", "support", "surprise", "sweater", "swim", "swing", "system", "table", "tail", "talk", "tank", "taste", "tax", "teaching", "team", "teeth", "temper", "tendency", "tent", "territory", "test", "texture", "theory", "thing", "things", "thought", "thread", "thrill", "throat", "throne", "thumb", "thunder", "ticket", "tiger", "time", "tin", "title", "toad", "toe", "toes", "tomatoes", "tongue", "tooth", "toothbrush", "toothpaste", "top", "touch", "town", "toy", "toys", "trade", "trail", "train", "trains", "tramp", "transport", "tray", "treatment", "tree", "trees", "trick", "trip", "trouble", "trousers", "truck", "trucks", "tub", "turkey", "turn", "twig", "twist", "umbrella", "underwear", "unit", "use", "vacation", "value", "van", "vase", "vegetable", "veil", "vein", "verse", "vessel", "vest", "view", "visitor", "voice", "volcano", "volleyball", "voyage", "walk", "wall", "war", "wash", "waste", "watch", "water", "wave", "waves", "wax", "way", "wealth", "weather", "week", "weight", "wheel", "whip", "whistle", "wilderness", "wind", "window", "wing", "winter", "wire", "wish", "wood", "wool", "word", "work", "worm", "wound", "wren", "wrench", "wrist", "writer", "writing", "yak", "yam", "yard", "yarn", "year", "yoke", "zebra", "zephyr", "zinc", "zipper", "zoo"],
			verbs: ["abide", "accelerate", "accept", "accomplish", "achieve", "acquire", "acted", "activate", "adapt", "add", "address", "administer", "admire", "admit", "adopt", "advise", "afford", "agree", "alert", "alight", "allow", "altered", "amuse", "analyze", "announce", "annoy", "answer", "anticipate", "apologize", "appear", "applaud", "applied", "appoint", "appraise", "appreciate", "approve", "arbitrate", "argue", "arise", "arrange", "arrest", "arrive", "ascertain", "ask", "assemble", "assess", "assist", "assure", "attach", "attack", "attain", "attempt", "attend", "attract", "audited", "avoid", "awake", "back", "bake", "balance", "ban", "bang", "bare", "bat", "bathe", "battle", "be", "beam", "bear", "beat", "become", "beg", "begin", "behave", "behold", "belong", "bend", "beset", "bet", "bid", "bind", "bite", "bleach", "bleed", "bless", "blind", "blink", "blot", "blow", "blush", "boast", "boil", "bolt", "bomb", "bore", "borrow", "bounce", "bow", "box", "brake", "branch", "break", "breathe", "breed", "brief", "bring", "broadcast", "bruise", "brush", "bubble", "budget", "build", "bump", "burn", "burst", "bury", "bust", "buy", "buze", "calculate", "call", "camp", "care", "carry", "carve", "cast", "catalog", "catch", "cause", "challenge", "change", "charge", "chart", "chase", "cheat", "check", "cheer", "chew", "choke", "choose", "chop", "claim", "clap", "clarify", "classify", "clean", "clear", "cling", "clip", "close", "clothe", "coach", "coil", "collect", "color", "comb", "come", "command", "communicate", "compare", "compete", "compile", "complain", "complete", "compose", "compute", "conceive", "concentrate", "conceptualize", "concern", "conclude", "conduct", "confess", "confront", "confuse", "connect", "conserve", "consider", "consist", "consolidate", "construct", "consult", "contain", "continue", "contract", "control", "convert", "coordinate", "copy", "correct", "correlate", "cost", "cough", "counsel", "count", "cover", "crack", "crash", "crawl", "create", "creep", "critique", "cross", "crush", "cry", "cure", "curl", "curve", "cut", "cycle", "dam", "damage", "dance", "dare", "deal", "decay", "deceive", "decide", "decorate", "define", "delay", "delegate", "delight", "deliver", "demonstrate", "depend", "describe", "desert", "deserve", "design", "destroy", "detail", "detect", "determine", "develop", "devise", "diagnose", "dig", "direct", "disagree", "disappear", "disapprove", "disarm", "discover", "dislike", "dispense", "display", "disprove", "dissect", "distribute", "dive", "divert", "divide", "do", "double", "doubt", "draft", "drag", "drain", "dramatize", "draw", "dream", "dress", "drink", "drip", "drive", "drop", "drown", "drum", "dry", "dust", "dwell", "earn", "eat", "edited", "educate", "eliminate", "embarrass", "employ", "empty", "enacted", "encourage", "end", "endure", "enforce", "engineer", "enhance", "enjoy", "enlist", "ensure", "enter", "entertain", "escape", "establish", "estimate", "evaluate", "examine", "exceed", "excite", "excuse", "execute", "exercise", "exhibit", "exist", "expand", "expect", "expedite", "experiment", "explain", "explode", "express", "extend", "extract", "face", "facilitate", "fade", "fail", "fancy", "fasten", "fax", "fear", "feed", "feel", "fence", "fetch", "fight", "file", "fill", "film", "finalize", "finance", "find", "fire", "fit", "fix", "flap", "flash", "flee", "fling", "float", "flood", "flow", "flower", "fly", "fold", "follow", "fool", "forbid", "force", "forecast", "forego", "foresee", "foretell", "forget", "forgive", "form", "formulate", "forsake", "frame", "freeze", "frighten", "fry", "gather", "gaze", "generate", "get", "give", "glow", "glue", "go", "govern", "grab", "graduate", "grate", "grease", "greet", "grin", "grind", "grip", "groan", "grow", "guarantee", "guard", "guess", "guide", "hammer", "hand", "handle", "handwrite", "hang", "happen", "harass", "harm", "hate", "haunt", "head", "heal", "heap", "hear", "heat", "help", "hide", "hit", "hold", "hook", "hop", "hope", "hover", "hug", "hum", "hunt", "hurry", "hurt", "hypothesize", "identify", "ignore", "illustrate", "imagine", "implement", "impress", "improve", "improvise", "include", "increase", "induce", "influence", "inform", "initiate", "inject", "injure", "inlay", "innovate", "input", "inspect", "inspire", "install", "institute", "instruct", "insure", "integrate", "intend", "intensify", "interest", "interfere", "interlay", "interpret", "interrupt", "interview", "introduce", "invent", "inventory", "investigate", "invite", "irritate", "itch", "jail", "jam", "jog", "join", "joke", "judge", "juggle", "jump", "justify", "keep", "kept", "kick", "kill", "kiss", "kneel", "knit", "knock", "knot", "know", "label", "land", "last", "laugh", "launch", "lay", "lead", "lean", "leap", "learn", "leave", "lecture", "led", "lend", "let", "level", "license", "lick", "lie", "lifted", "light", "lighten", "like", "list", "listen", "live", "load", "locate", "lock", "log", "long", "look", "lose", "love", "maintain", "make", "man", "manage", "manipulate", "manufacture", "map", "march", "mark", "market", "marry", "match", "mate", "matter", "mean", "measure", "meddle", "mediate", "meet", "melt", "melt", "memorize", "mend", "mentor", "milk", "mine", "mislead", "miss", "misspell", "mistake", "misunderstand", "mix", "moan", "model", "modify", "monitor", "moor", "motivate", "mourn", "move", "mow", "muddle", "mug", "multiply", "murder", "nail", "name", "navigate", "need", "negotiate", "nest", "nod", "nominate", "normalize", "note", "notice", "number", "obey", "object", "observe", "obtain", "occur", "offend", "offer", "officiate", "open", "operate", "order", "organize", "oriented", "originate", "overcome", "overdo", "overdraw", "overflow", "overhear", "overtake", "overthrow", "owe", "own", "pack", "paddle", "paint", "park", "part", "participate", "pass", "paste", "pat", "pause", "pay", "peck", "pedal", "peel", "peep", "perceive", "perfect", "perform", "permit", "persuade", "phone", "photograph", "pick", "pilot", "pinch", "pine", "pinpoint", "pioneer", "place", "plan", "plant", "play", "plead", "please", "plug", "point", "poke", "polish", "pop", "possess", "post", "pour", "practice", "praised", "pray", "preach", "precede", "predict", "prefer", "prepare", "prescribe", "present", "preserve", "preset", "preside", "press", "pretend", "prevent", "prick", "print", "process", "procure", "produce", "profess", "program", "progress", "project", "promise", "promote", "proofread", "propose", "protect", "prove", "provide", "publicize", "pull", "pump", "punch", "puncture", "punish", "purchase", "push", "put", "qualify", "question", "queue", "quit", "race", "radiate", "rain", "raise", "rank", "rate", "reach", "read", "realign", "realize", "reason", "receive", "recognize", "recommend", "reconcile", "record", "recruit", "reduce", "refer", "reflect", "refuse", "regret", "regulate", "rehabilitate", "reign", "reinforce", "reject", "rejoice", "relate", "relax", "release", "rely", "remain", "remember", "remind", "remove", "render", "reorganize", "repair", "repeat", "replace", "reply", "report", "represent", "reproduce", "request", "rescue", "research", "resolve", "respond", "restored", "restructure", "retire", "retrieve", "return", "review", "revise", "rhyme", "rid", "ride", "ring", "rinse", "rise", "risk", "rob", "rock", "roll", "rot", "rub", "ruin", "rule", "run", "rush", "sack", "sail", "satisfy", "save", "saw", "say", "scare", "scatter", "schedule", "scold", "scorch", "scrape", "scratch", "scream", "screw", "scribble", "scrub", "seal", "search", "secure", "see", "seek", "select", "sell", "send", "sense", "separate", "serve", "service", "set", "settle", "sew", "shade", "shake", "shape", "share", "shave", "shear", "shed", "shelter", "shine", "shiver", "shock", "shoe", "shoot", "shop", "show", "shrink", "shrug", "shut", "sigh", "sign", "signal", "simplify", "sin", "sing", "sink", "sip", "sit", "sketch", "ski", "skip", "slap", "slay", "sleep", "slide", "sling", "slink", "slip", "slit", "slow", "smash", "smell", "smile", "smite", "smoke", "snatch", "sneak", "sneeze", "sniff", "snore", "snow", "soak", "solve", "soothe", "soothsay", "sort", "sound", "sow", "spare", "spark", "sparkle", "speak", "specify", "speed", "spell", "spend", "spill", "spin", "spit", "split", "spoil", "spot", "spray", "spread", "spring", "sprout", "squash", "squeak", "squeal", "squeeze", "stain", "stamp", "stand", "stare", "start", "stay", "steal", "steer", "step", "stick", "stimulate", "sting", "stink", "stir", "stitch", "stop", "store", "strap", "streamline", "strengthen", "stretch", "stride", "strike", "string", "strip", "strive", "stroke", "structure", "study", "stuff", "sublet", "subtract", "succeed", "suck", "suffer", "suggest", "suit", "summarize", "supervise", "supply", "support", "suppose", "surprise", "surround", "suspect", "suspend", "swear", "sweat", "sweep", "swell", "swim", "swing", "switch", "symbolize", "synthesize", "systemize", "tabulate", "take", "talk", "tame", "tap", "target", "taste", "teach", "tear", "tease", "telephone", "tell", "tempt", "terrify", "test", "thank", "thaw", "think", "thrive", "throw", "thrust", "tick", "tickle", "tie", "time", "tip", "tire", "touch", "tour", "tow", "trace", "trade", "train", "transcribe", "transfer", "transform", "translate", "transport", "trap", "travel", "tread", "treat", "tremble", "trick", "trip", "trot", "trouble", "troubleshoot", "trust", "try", "tug", "tumble", "turn", "tutor", "twist", "type", "undergo", "understand", "undertake", "undress", "unfasten", "unify", "unite", "unlock", "unpack", "untidy", "update", "upgrade", "uphold", "upset", "use", "utilize", "vanish", "verbalize", "verify", "vex", "visit", "wail", "wait", "wake", "walk", "wander", "want", "warm", "warn", "wash", "waste", "watch", "water", "wave", "wear", "weave", "wed", "weep", "weigh", "welcome", "wend", "wet", "whine", "whip", "whirl", "whisper", "whistle", "win", "wind", "wink", "wipe", "wish", "withdraw", "withhold", "withstand", "wobble", "wonder", "work", "worry", "wrap", "wreck", "wrestle", "wriggle", "wring", "write", "x-ray", "yawn", "yell", "zip", "zoom"]
		};
						 
		 return {
			phrase: function(){
				var phrase = "";

				phrase += words.adjectives[Math.floor(Math.random()*words.adjectives.length)]+"-";
				phrase += words.nouns[Math.floor(Math.random()*words.nouns.length)]+"-";
				phrase += words.verbs[Math.floor(Math.random()*words.verbs.length)];

				return phrase;
			},
             word: function(){
                 var type = Math.floor(Math.random()*3);
                 var list;

                 if(type === 0){
                     list = words.adjectives;
                 }
                 else if(type == 1){
                     list = words.nouns;
                 }
                 else if(type == 2){
                     list = words.verbs;
                 }

                 return list[Math.floor(Math.random()*list.length)];
             }
		 };
	});
}());}());
(function(){(function () { /* globals nunjucks */
    "use strict";

    angular.module("etch")

    .service("renderService", ["$http", "toaster", function ($http, toaster) {
        var that = this;

        that.project = function (project) {
            // function accepts string project and returns a Promise that resolves to a string of the built project
            return new Promise(function (resolve) {

                var all = project.list.concat(project.background).concat(project.general);
                
                var scripts = {};
                var sprites = [];
                for (var i = 0; i < all.length; i++) {
                    // for every script in the project build a dictionary with scipts labled by their sprite name
                    var sprite = all[i];
                        
                    sprites.push(sprite.id);
                    scripts[sprite.id] = sprite.script;
                }

                $http.post("/api/parse.json", {
                    scripts: JSON.stringify(scripts),
                    sprites: JSON.stringify(sprites)
                }).success(function (data) {
                    for (var sprite in data) {
                        if (data[sprite].message) {
                            toaster.pop({
                                type: "error",
                                title: ("Error on sprite " + sprite),
                                body: (data[sprite].message + "\n On line " + data[sprite].lineNumber)
                            });
                        }
                    }
                    var globals = project.general; 
                    var background = project.background;
                    var sprites = project.list;

                    resolve(nunjucks.render("template.snap.xml", { //render jinja template
                        project: {
                            globals: globals,
                            background: background,
                            sprites: sprites,

                            scripts: data
                        }
                    }));

                });

            });
        };

	}]);

}());}());
(function(){(function () {
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
            this.name = inputs.name || "";
            this.notes = inputs.notes || "";
            this.thumbnail = inputs.thumbnail || myself.default.backdrops[0].data;
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
}());}());
(function(){(function (){
    angular.module("etch")
        
    .service("user", ["$rootScope", "api", function($rootScope, api){
        var _this = this;
        
        // user code
        defaultUserObject = { // the default template user object
            loggedIn: false,
            profile: {}
        };
        _this.user = angular.copy(defaultUserObject); // use angular-copy to copy the properties and not a reference
        
        // logout/logout code: We can't just use ng-click because of popup blockers, so they are as onclick handlers. <https://developer.mozilla.org/en-US/Persona/Quick_Setup#Step_2_Add_login_and_logout_buttons>
        
        navigator.id.watch({
            loggedInUser: null, // at some time we should have session management and remember people
            onlogin: function(assertion){
                $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                    api.login(assertion).then(function success(response){
                        _this.user.loggedIn = true;
                        _this.user.profile = response.data;
                        
                    },function error(response){
                        navigator.id.logout(); 
                    });
                });
            },
            onlogout: function(){
                $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                    _this.user = angular.copy(defaultUserObject); // use ng-copy to copy props and not a ref
                    console.info("logout");
                });
            }
        });
    }]);
}());}());
(function(){(function () {
    angular.module("etch")

    .constant("blocksData", {
        "abbreviations": {
            "m": "motion",
            "s": "sound",
            "d": "data",
            "l": "looks",
            "p": "pen",
            "e": "events",
            "c": "control",
            "o": "operators"
        },
        "etchNames": [
            {
                "name": "motion",
                "explanation": "Blocks related to moving",
                "unsupported": ["set rotation style"],
                "items": [
                    {
                        "name": "move",
                        "type": "function",
                        "inputs": ["amount to move forwards by"],
                        "inputTypes": ["number"],
                        "explanation": "Move forwards by the specified amount.",
                        "example": ["10"]
                    },
                    {
                        "name": "turn right",
                        "type": "function",
                        "inputs": ["degrees to turn right"],
                        "inputTypes": ["number"],
                        "explanation": "Turn right by the specified number of degrees",
                        "example": [90]
                    },
                    {
                        "name": "turn left",
                        "type": "function",
                        "inputs": ["amount to turn left by"],
                        "inputTypes": ["number"],
                        "explanation": "Turn left by the specified number of degrees",
                        "example": [90]
                    },
                    {
                        "name": "point direction",
                        "type": "function",
                        "inputs": ["direction to point in"],
                        "inputTypes": ["number"],
                        "explanation": "Point this sprite in a direction. The direction to point in is in degrees with 0 directly down and 360 directly up. The direction wraps, so 400 is the same as 140 (400 - 360).",
                        "example": [0]
                    },
                    {
                        "name": "point towards",
                        "type": "function",
                        "inputs": ["what to point towards"],
                        "inputTypes": ["string", "option"],
                        "explanation": "This can point towards another sprite or the mouse pointer. If you are pointing towards another sprite, use `Motion.point towards(\"name-of-other-sprite\")`. To point towards the mouse pointer, use `Motion.point towards(mouse pointer)`.",
                        "example": ["mouse pointer"]
                    },
                    {
                        "name": "go to x y",
                        "type": "function",
                        "inputs": ["x coordinate to go to", "y coordinate to go to"],
                        "inputTypes": ["number"],
                        "explanation": "Go to the specified x and y coordinates.",
                        "example": [30, 30]
                    },
                    {
                        "name": "go to object",
                        "type": "function",
                        "inputs": ["object to go to"],
                        "inputTypes": ["string", "option"],
                        "explanation": "Use this to go to the coordinates sprite or the mouse pointer. If you want to go to another sprite, use `Motion.go to object(\"name-of-other-sprite\")`. To go to the mouse pointer, use `Motion.go to object(mouse pointer)`.",
                        "example": ["mouse-pointer"]
                    },
                    {
                        "name": "glide",
                        "type": "function",
                        "inputs": ["seconds to gilde for", "x coordinate to go to", "y coordinate to go to"],
                        "inputTypes": ["number"],
                        "explanation": "Have this sprite to the specified x and y coordinates for the specified amount of time.",
                        "example": [5, 30, 30]
                    },
                    {
                        "name": "change x",
                        "type": "function",
                        "inputs": ["amount to change to current x coordinate"],
                        "inputTypes": ["number"],
                        "explanation": "Change the current x coordinate of this sprite by the specified amount.",
                        "example": [10]
                    },
                    {
                        "name": "set x",
                        "type": "function",
                        "inputTypes": ["number"],
                        "inputs": ["amount to set the current x coordinate to"],
                        "explanation": "Set the x coordinate of this sprite to the specified amount.",
                        "example": [30]
                    },
                    {
                        "name": "change y",
                        "type": "function",
                        "inputTypes": ["number"],
                        "inputs": ["amount to change the current y coordinate by"],
                        "explanation": "Change the current y coordinate of this sprite by the specified amount.",
                        "example": [10]
                    },
                    {
                        "name": "set y",
                        "type": "function",
                        "inputTypes": ["number"],
                        "inputs": ["amount to set the current y coordinate to"],
                        "explanation": "Set the y coordinate of this sprite by the specified amount.",
                        "example": [30]
                    },
                    {
                        "name": "if edge bounce",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "If this sprite is on an edge, have the sprite bounce.",
                        "example": []
                    },
                    {
                        "name": "x pos",
                        "type": "reporter",
                        "explanation": "This is the current x position of this sprite."
                    },
                    {
                        "name": "y pos",
                        "type": "reporter",
                        "explanation": "This is the current y position of this sprite."
                    },
                    {
                        "name": "direction",
                        "type": "reporter",
                        "explanation": "This is the current direction that this sprite is pointing. 0 is directly up, 180 is directly down, 90 right, -90 left.",
                        "image": "static/images/direction-degrees-explanation.png"
                    }
                ]
            },
            {
                "name": "events",
                "explanation": "Blocks related to events such as flag clicked or key pressed.",
                "unsupported": ["backdrop switches to", "greater than"],
                "items": [
                    {
                        "name": "flag clicked",
                        "type": "block",
                        "explanation": "Anything grouped under this is run when the flag is clicked."
                    },
                    {
                        "name": "key pressed",
                        "type": "block",
                        "inputs": ["key to watch for"],
                        "inputTypes": ["string"],
                        "explanation": "Anything grouped under this is run when a specified key is pressed.",
                        "example": ["w"]
                    },
                    {
                        "name": "this sprite clicked",
                        "type": "block",
                        "explanation": "Anything grouped under this is run when this sprite is clicked."
                    },
                    {
                        "name": "I receive message",
                        "type": "block",
                        "inputs": ["message to watch for"],
                        "inputTypes": ["option"],
                        "explanation": "Anything grouped under this is run when the specified message is received. To match any message, use `I receive message(any message)`.",
                        "example": ["user likes chickens"]
                    },
                    {
                        "name": "broadcast",
                        "type": "function",
                        "inputs": ["message to broadcast"],
                        "inputTypes": ["option"],
                        "explanation": "Broadcast any message to all other sprites.",
                        "example": ["user likes chickens"]
                    },
                    {
                        "name": "broadcast and wait",
                        "type": "function",
                        "inputs": ["message to broadcast"],
                        "inputTypes": ["string"],
                        "explanation": "Broadcast any message to all other sprites and then wait until the other sprites are done with whatever the other sprites do when the receive the message.",
                        "example": ["user likes chickens"]
                    }
                ]
            },
            {
                "name": "looks",
                "explanation": "Blocks related to looks",
                "unsupported": ["backdrop name", "switch backdrop to"],
                "items": [
                    {
                        "name": "timed say",
                        "type": "function",
                        "inputs": ["text to say", "number of seconds to say text for"],
                        "inputTypes": ["string", "number"],
                        "explanation": "Say something for a specified amount of time.",
                        "example": ["\"Hi World\"", 10]
                    },
                    {
                        "name": "say",
                        "type": "function",
                        "inputs": ["text to say"],
                        "inputTypes": ["string"],
                        "explanation": "Say something.",
                        "example": ["\"Hi World\""]
                    },
                    {
                        "name": "timed think",
                        "type": "function",
                        "inputs": ["text to think", "number of seconds to think text for"],
                        "inputTypes": ["string", "number"],
                        "explanation": "Think something for a specified amount of time.",
                        "example": ["\"Hi World\"", 10]
                    },
                    {
                        "name": "think",
                        "type": "function",
                        "inputs": ["text to think"],
                        "inputTypes": ["string"],
                        "explanation": "Think something",
                        "example": ["\"Hi World\""]
                    },
                    {
                        "name": "show",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "Show the current sprite",
                        "example": []
                    },
                    {
                        "name": "hide",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "Hide the current sprite",
                        "example": []
                    },
                    {
                        "name": "switch costume to",
                        "type": "function",
                        "inputs": ["name of costume to switch to"],
                        "inputTypes": ["string"],
                        "explanation": "Switch the costume of this sprite to another costume.",
                        "example": ["chicken costume"]
                    },
                    {
                        "name": "next costume",
                        "type": "function",
                        "inputs": [],
                        "explanation": "Switch to the next costume",
                        "example": []
                    },
                    {
                        "name": "change effect",
                        "type": "function",
                        "inputs": ["effect to change", "amount to change effect by"],
                        "inputTypes": ["option", "number"],
                        "explanation": "Change an effect by a specified amount. Possible effects are `brightness`, `ghost`, `negative`, `comic`, `duplicate`, and `confetti`.",
                        "example": ["comic", 10]
                    },
                    {
                        "name": "set effect",
                        "type": "function",
                        "inputTypes": ["option", "number"],
                        "inputs": ["effect to change", "amount to set effect to"],
                        "explanation": "Set an effect to an amount. Possible effects are `brightness`, `ghost`, `negative`, `comic`, `duplicate`, and `confetti`.",
                        "example": ["comic", 20]
                    },
                    {
                        "name": "clear graphic effects",
                        "type": "function",
                        "inputs": [],
                        "explanation": "Clear all graphic effects.",
                        "example": []
                    },
                    {
                        "name": "change size by",
                        "type": "function",
                        "inputs": ["amount to change size by"],
                        "inputTypes": ["number"],
                        "explanation": "Change the size of this sprite by an amount.",
                        "example": [20]
                    },
                    {
                        "name": "set size to",
                        "type": "function",
                        "inputs": ["amount to set size to"],
                        "inputTypes": ["number"],
                        "explanation": "Set the size of this sprite to an amount.",
                        "example": [30]
                    },
                    {
                        "name": "go to front",
                        "type": "function",
                        "inputs": [],
                        "explanation": "Put this sprite in front of all other sprites.",
                        "example": []
                    },
                    {
                        "name": "go back layers",
                        "type": "function",
                        "inputs": ["number of layers to send this sprite back"],
                        "inputTypes": ["number"],
                        "explanation": "Send this sprite backwards a number of layers.",
                        "example": [2]
                    },
                    {
                        "name": "costume number",
                        "type": "reporter",
                        "explanation": "This is the number of the current costume. This is a zero based count so the first costume is zero, the second one, and so on."
                    },
                    {
                        "name": "size",
                        "type": "reporter",
                        "explanation": "This is the current size of this sprite."
                    }
                ]
            },
            {
                "name": "control",
                "explanation": "Blocks in the control category",
                "unsupported": ["if then else", "if", "repeat", "forever", "repeat until", "when i start as a clone"],
                "items": [
                    {
                        "name": "wait seconds",
                        "type": "function",
                        "inputs": ["number of seconds to wait"],
                        "inputTypes": ["number"],
                        "explanation": "Wait for any number of seconds",
                        "example": [10]
                    },
                    {
                        "name": "wait until",
                        "type": "function",
                        "inputs": ["statement to check"],
                        "inputTypes": ["statement"],
                        "explanation": "Wait until a statement is true. For instance, `Control.wait until(mouse x > 10)`.",
                        "example": ["mouse x > 10"]
                    },
                    {
                        "name": "stop",
                        "type": "function",
                        "inputs": ["what to stop"],
                        "inputTypes": ["option"],
                        "explanation": "Stop whatever you specify. The options are `all`, `this script`, or `this block`.",
                        "example": ["this script"]
                    },
                    {
                        "name": "create clone of",
                        "type": "function",
                        "inputs": ["sprite to create a clone of"],
                        "inputTypes": ["option"],
                        "explanation": "Create a clone of any sprite. You can use the name of a sprite to create a clone of, for example `Control.create clone of(\"name of other sprite\"), or `myself` to clone the current sprite, for example `Control.create clone of(myself)`.",
                        "example": ["myself"]
                    },
                    {
                        "name": "delete this clone",
                        "type": "function",
                        "inputs": [],
                        "explanation": "Delete this clone of a sprite.",
                        "example": []
                    }
                ]
            },
            {
                "name": "sound",
                "explanation": "Blocks related to sound. Many of these blocks are unsupported because Etch does not yet support uploading sounds, which it will do before it's beta release at the end of the summer.",
                "unsupported": ["play drum", "change volume by", "set volume to", "volume", "set instrument to", "play sound", "play sound until done", "rest for"],
                "items": [
                    {
                        "name": "stop all sounds",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "Stop playing every sound.",
                        "example": []
                    },
                    {
                        "name": "play note",
                        "type": "function",
                        "inputs": ["note to play"],
                        "inputTypes": ["number"],
                        "explanation": "Play a specific note. 48 is low C and 72 high C. See the image for details on the numbering system.",
                        "image": "static/images/note-chart.png",
                        "example": [50]
                    },
                    {
                        "name": "change tempo by",
                        "type": "function",
                        "inputs": ["amount to change temp by"],
                        "inputTypes": ["number"],
                        "explanation": "Set the tempo that the music is played at. The number is in BPM (beats per minute).",
                        "example": [10]
                    },
                    {
                        "name": "set tempo to",
                        "type": "function",
                        "inputs": ["amount to set tempo to"],
                        "inputTypes": ["number"],
                        "explanation": "Set the tempo that the music is plated at. The number is in BPC (beats per minute).",
                        "example": [20]
                    },
                    {
                        "name": "tempo",
                        "type": "reporter",
                        "explanation": "This is the current tempo that the music is plated at. The number is in BPC (beats per minute)."
                    }
                ]
            },
            {
                "name": "sensing",
                "explanation": "Blocks related to sensing",
                "unsupported": ["loudness", "turn video", "set video transparency to", "x position of", "days since 2000", "username", "vide on", "touching", "touching color", "distance to", "current"],
                "items": [
                    {
                        "name": "ask and wait",
                        "type": "function",
                        "inputs": ["what to ask"],
                        "inputTypes": ["string"],
                        "explanation": "Ask the user something and then wait for their response. After they response, their answer will be available as if it were a reporter. For example, `Looks.say(answer)`.",
                        "example": ["Do you like chickens?"]
                    },
                    {
                        "name": "answer",
                        "type": "reporter",
                        "explanation": "This is the answer to what was asked using `Sensing.ask and wait(\"question\")`. Access the answer with `Sensing.answer`. For example, `Looks.say(Sensing.answer)`."
                    },
                    {
                        "name": "is key pressed",
                        "type": "reporter",
                        "inputs": ["key"],
                        "inputTypes": ["option"],
                        "explanation": "Check if a specified key is pressed.",
                        "example": ["w"]
                    },
                    {
                        "name": "is mouse down",
                        "type": "reporter",
                        "explanation": "Get if the mouse is down"
                    },
                    {
                        "name": "mouse x",
                        "type": "reporter",
                        "inputs": [],
                        "explanation": "Get the current x coordinate of the mouse."
                    },
                    {
                        "name": "mouse y",
                        "type": "reporter",
                        "inputs": [],
                        "explanation": "Get the current y coordinate of the mouse."
                    },
                    {
                        "name": "timer",
                        "type": "reporter",
                        "inputs": [],
                        "explanation": "Get the number of seconds that the program has been running."
                    },
                    {
                        "name": "reset timer",
                        "type": "function",
                        "inputs": [],
                        "explanation": "Reset the timer of the number of seconds that the program has been running.",
                        "example": []
                    }
                ]
            },
            {
                "name": "pen",
                "explanation": "Blocks related to pen drawing. Etch does not save drawings you create while making your program. These should be costumes or backgrounds. As your program executes it will draw, but those drawing will not be saved for users of your program.",
                "unsupported": ["set pen color to"],
                "items": [
                    {
                        "name": "clear",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "Clear any marks made by the pen.",
                        "example": []
                    },
                    {
                        "name": "stamp",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "Make a stamp, or copy of what the sprite currently looks like, at the sprite's current position.",
                        "example": []
                    },
                    {
                        "name": "pen down",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "Put the pen down to start drawing.",
                        "example": []
                    },
                    {
                        "name": "pen up",
                        "type": "function",
                        "inputs": [],
                        "inputTypes": [],
                        "explanation": "Lift up the pen so that you can move the pen to a new position without making marks.",
                        "example": []
                    },
                    {
                        "name": "change pen color by",
                        "type": "function",
                        "inputs": ["amount to change pen color by"],
                        "inputTypes": ["number"],
                        "explanation": "Change the pen color by an amount.",
                        "example": [10]
                    },
                    {
                        "name": "set pen color to number",
                        "type": "function",
                        "inputs": ["amount to set the pen color to"],
                        "inputTypes": ["number"],
                        "explanation": "Set the pen color to an amount.",
                        "example": [20]
                    },
                    {
                        "name": "change pen shade by",
                        "type": "function",
                        "inputs": ["amount to change pen shade by"],
                        "inputTypes": ["number"],
                        "explanation": "Change the shade of the pen by a specified amount.",
                        "example": [10]
                    },
                    {
                        "name": "change pen size by",
                        "type": "function",
                        "inputs": ["amount to change pen size by"],
                        "inputTypes": ["number"],
                        "explanation": "Change the size of the pen by a specified amount.",
                        "example": [10]
                    },
                    {
                        "name": "set pen size to",
                        "type": "function",
                        "inputs": ["amount to set pen size to"],
                        "inputTypes": ["number"],
                        "explanation": "Set the pen size to a specified amount.",
                        "example": [20]
                    }
                ]
            },
            {
                "name": "operators",
                "explanation": "Operator blocks. Many of these blocks can be used without writing `operators.`. For instance, you have to write `Looks.say` but not `Operators.+`, which is just `+`.",
                "unsupported": ["abs", "floor", "sqrt", "sin", "cos", "tan", "asic", "acos", "atan", "in", "e^", "pick random between", "and", "or", "not", "join", "letter number", "length of", "round"],
                "items": [
                    {
                        "name": "+",
                        "type": "inline-math",
                        "explanation": "Add two items. For example, `Looks.say(5 + 4)`"
                    },
                    {
                        "name": "-",
                        "type": "inline-math",
                        "explanation": "Subtract two items. For example, `Looks.say(5 - 4)`"
                    },
                    {
                        "name": "*",
                        "type": "inline-math",
                        "explanation": "Multiply two items. For example, `Looks.say(5 * 4)`"
                    },
                    {
                        "name": "/",
                        "type": "inline-math",
                        "explanation": "Divide two items. For example, `Looks.say(5 / 4)`"
                    },
                    {
                        "name": "<",
                        "type": "inline-math",
                        "explanation": "See if something is greater than something else. For example, `Control.if(count > 100):`"
                    },
                    {
                        "name": "=",
                        "type": "inline-math",
                        "explanation": "Check if two items are equal. For example, `Control.if(count = 100):`"
                    },
                    {
                        "name": ">",
                        "type": "inline-math",
                        "explanation": "See if something is less than something else. For example, `Control.if(count < 100):`"
                    },
                    {
                        "name": "%",
                        "type": "inline-math",
                        "explanation": "Mod two numbers. For example, `Looks.say(5 % 4)` is 1."
                    }
                ]
            },
            {
                "name": "data",
                "explanation": "The `Data` blocks allow you to create and store variables. Create a variable using the variables section of the \"Settings\" tab of the Etch editor. Then, use `Data.set` to set the value of a variable. You can access this variable by simply writing it's name anywhere in your program. For example, `motion.move(stored value)` if `stored value` is a variable.",
                "items": [
                    {
                        "name": "set",
                        "type": "function",
                        "inputs": ["variable name", "what to set variable to"],
                        "inputTypes": ["option", "number"],
                        "explanation": "Set a variable to a value. For instance, to set the variable `foo` to 100 use `Data.set(\"foo\", 100).",
                        "example": ["score", 20]
                    },
                    {
                        "name": "change by",
                        "type": "function",
                        "inputs": ["variable name", "amount to change variable by"],
                        "inputTypes": ["option", "number"],
                        "explanation": "Change the value of a variable by a number. For instance, use `Data.change by(\"foo\", 10)` to increase the variable `foo` by 10. If you try to use this on a variable that isn't a number, the variable will be set to the number you try to change it by.",
                        "example": ["score", 10]
                    },
                    {
                        "name": "show variable",
                        "type": "function",
                        "inputs": ["name of variable to show"],
                        "inputTypes": ["option"],
                        "explanation": "Show a variable so that it's value appears in a box on the stage.",
                        "example": ["score"]
                    },
                    {
                        "name": "hide variable",
                        "type": "function",
                        "inputs": ["name of variable to hide"],
                        "inputTypes": ["option"],
                        "explanation": "Hide a variable so that it's name doesn't show up in a box on the stage.",
                        "example": ["score"]
                    }
                ]
            }
        ]
    });
}());}());
(function(){var d;

(function (mod) {
    if (typeof exports == "object" && typeof module == "object") {// CommonJS
        mod(require("../../lib/codemirror"));
    }
    else if (typeof define == "function" && define.amd) {// AMD
        define(["../../lib/codemirror"], mod);
    }
    else { // Plain browser env
        mod(CodeMirror);
    }
})(function (CodeMirror) {
    "use strict";

    var currentKeyword = "SAd";
    var parentBol = false;

    var dictionary = {};
    var parent_abbreviation = [];
    var parents = [];
    var listOfChildren = [];
    fetch("/api/blocks.json").then(function(response) { // this uses the super-modern fetch api to get data on the blocks from the server
        return response.json(); // returns a promise that resolves to the json sent

    }).then(function(blocksData) {
        for (var parent in blocksData.snapNames) {
            if (blocksData.snapNames.hasOwnProperty(parent)) {
                var pAbbriv = parent[0];

                 // currently the children are listed as properties of the parent object. This will hold a list converted from the parent object
                for(var child in blocksData.snapNames[parent]) {
                    if(blocksData.snapNames[parent].hasOwnProperty(child)) {
                        listOfChildren.push(child);
                    }
                }

                dictionary[pAbbriv] = listOfChildren; // turn the dictionary of snapNames by parent into a dict by first letter of parent name
                parent_abbreviation.push(pAbbriv);
                parents.push(parent);
            }
        }

        // now we have to reset all the modes so that the changes will be updated
        var allTextAreas = document.getElementsByTagName("textarea");

        for(var i = 0; i < allTextAreas.length; i++){
            var textarea = allTextAreas[i];

            if(textarea.hasAttribute("ui-codemirror")){ // if the textarea is a codemirror
                var scope = angular.element(textarea).scope(); // get the scope of this textarea

                scope.$apply(function() {
                    scope.codemirrorConfig.mode = "tempDummyFakeMode"; // this is needed so that when the scope is set to etch below it will be a change
                }); // jshint ignore:line
                scope.$apply(function(){
                    scope.codemirrorConfig.mode = "etch"; // set the scope to etch again so that the mode will be reloaded
                }); // jshint ignore:line
            }
        }

        d = dictionary;
    });


    function top(state) {
        return state.scopes[state.scopes.length - 1];
    }

    CodeMirror.defineMode("etch", function (conf, parserConf) {

        var ERRORCLASS = "error";

        var singleDelimiters = parserConf.singleDelimiters || new RegExp("^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]");
        var singleOperators = parserConf.singleOperators || new RegExp("^[\\+\\-\\*/%&|\\^~<>!@]");
        var identifiers;
        if (parserConf.version && parseInt(parserConf.version, 10) == 3) {
            identifiers = parserConf.identifiers || new RegExp("^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*");
        } else {
            identifiers = parserConf.identifiers || new RegExp("^[_A-Za-z][_A-Za-z0-9]*");
        }

        var hangingIndent = parserConf.hangingIndent || conf.indentUnit;

        var myKeywords = parents;
        var stringPrefixes;
        if (parserConf.extra_keywords !== undefined) {
            myKeywords = myKeywords.concat(parserConf.extra_keywords);
        }
        if (parserConf.version && parseInt(parserConf.version, 10) == 3) {
            stringPrefixes = new RegExp("^(([rb]|(br))?('{3}|\"{3}|['\"]))", "i");
        } else {
            stringPrefixes = new RegExp("^(([rub]|(ur)|(br))?('{3}|\"{3}|['\"]))", "i");
        }
        var keywords = new RegExp(parents.join("|"), "i");
        var builtins = new RegExp(parent_abbreviation.join("|"), "i");

        // tokenizers
        function tokenBase(stream, state) {
            // Handle scope changes

            //        console.info("state: " + state);
            if (stream.sol() && top(state).type == "py") {
                var scopeOffset = top(state).offset;
                if (stream.eatSpace()) {
                    var lineOffset = stream.indentation();
                    if (lineOffset > scopeOffset)
                        pushScope(stream, state, "py");
                    else if (lineOffset < scopeOffset && dedent(stream, state))
                        state.errorToken = true;
                    return null;
                } else {
                    var style = tokenBaseInner(stream, state);
                    if (scopeOffset > 0 && dedent(stream, state))
                        style += " " + ERRORCLASS;
                    return style;
                }
            }
            return tokenBaseInner(stream, state);
        }

        function tokenBaseInner(stream, state) {

            //        var stream = streams.toLowerCase();
            if (stream.eatSpace()) return null;

            var ch = stream.peek();
            //        console.info("current: "+ stream);
            // Handle Comments
            if (ch == "#") {
                stream.skipToEnd();
                return "comment";
            }

            // Handle Number Literals
            if (stream.match(/^[0-9\.]/, false)) {
                var floatLiteral = false;
                // Floats
                if (stream.match(/^\d*\.\d+(e[\+\-]?\d+)?/i)) {
                    floatLiteral = true;
                }
                if (stream.match(/^\d+\.\d*/)) {
                    floatLiteral = true;
                }
                if (stream.match(/^\.\d+/)) {
                    floatLiteral = true;
                }
                if (floatLiteral) {
                    // Float literals may be "imaginary"
                    stream.eat(/J/i);
                    return "number";
                }
                // Integers
                var intLiteral = false;
                // Hex
                if (stream.match(/^0x[0-9a-f]+/i)) intLiteral = true;
                // Binary
                if (stream.match(/^0b[01]+/i)) intLiteral = true;
                // Octal
                if (stream.match(/^0o[0-7]+/i)) intLiteral = true;
                // Decimal
                if (stream.match(/^[1-9]\d*(e[\+\-]?\d+)?/)) {
                    // Decimal literals may be "imaginary"
                    stream.eat(/J/i);
                    // TODO - Can you have imaginary longs?
                    intLiteral = true;
                }
                // Zero by itself with no other piece of number.
                if (stream.match(/^0(?![\dx])/i)) intLiteral = true;
                if (intLiteral) {
                    // Integer literals may be "long"
                    stream.eat(/L/i);
                    return "number";
                }
            }

            // Handle Strings
            if (stream.match(stringPrefixes)) {
                state.tokenize = tokenStringFactory(stream.current());
                return state.tokenize(stream, state);
            }

            // Handle operators and Delimiters
            //      if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters))
            //        return null;
            //
            //      if (stream.match(doubleOperators) || stream.match(singleOperators))
            //        return "operator";

            if (stream.match(singleDelimiters))
                return null;
            if (stream.match(singleOperators))
                return null;
//            console.info("peek" +stream.peek());
            if (true) {

                
                var x = true;
                var j = 0;
                var strings = "";
//                console.info("peek" +stream.peek());

//                if(currentKeyword == "motion"){
//                strings = "m";
//                }
                while (x) {
                    if (stream.peek() === "(" || stream.peek() === undefined || stream.peek() === ":" || j > 30) {
                        x = false;
                    }
                    else {
                        //                console.info(stream.peek());
                        var g = stream.eat(new RegExp(".")).toLowerCase();
                        if (g != " ") {
                            strings = strings.concat(g);
//                            console.info(strings);
                        }//this combine the entire child
                    }
                    j++;
                }//while statement
                //
                //            console.info(currentKeyword);
                //            console.info(strings);
                //            console.info(dictionary[currentKeyword[0]]);

                    if (listOfChildren.indexOf(strings) != -1) {
                        return "builtin";
                    }
                }//end of child area
            if (stream.match(/^(self|cls)\b/))
                return "variable-2";

            if (stream.match(identifiers)) {
                if (state.lastToken == "def" || state.lastToken == "class")
                    return "def";
                return "variable";
            }

            // Handle non-detected items
            stream.next();
            return ERRORCLASS;
        }

        function tokenStringFactory(delimiter) {
            while ("rub".indexOf(delimiter.charAt(0).toLowerCase()) >= 0)
                delimiter = delimiter.substr(1);

            var singleline = delimiter.length == 1;
            var OUTCLASS = "string";

            function tokenString(stream, state) {
                while (!stream.eol()) {
                    stream.eatWhile(/[^'"\\]/);
                    if (stream.eat("\\")) {
                        stream.next();
                        if (singleline && stream.eol())
                            return OUTCLASS;
                    } else if (stream.match(delimiter)) {
                        state.tokenize = tokenBase;
                        return OUTCLASS;
                    } else {
                        stream.eat(/['"]/);
                    }
                }
                if (singleline) {
                    if (parserConf.singleLineStringErrors)
                        return ERRORCLASS;
                    else
                        state.tokenize = tokenBase;
                }
                return OUTCLASS;
            }

            tokenString.isString = true;
            return tokenString;
        }

        function pushScope(stream, state, type) {
            var offset = 0, align = null;
            if (type == "py") {
                while (top(state).type != "py")
                    state.scopes.pop();
            }
            offset = top(state).offset + (type == "py" ? conf.indentUnit : hangingIndent);
            if (type != "py" && !stream.match(/^(\s|#.*)*$/, false))
                align = stream.column() + 1;
            state.scopes.push({offset: offset, type: type, align: align});
        }

        function dedent(stream, state) {
            var indented = stream.indentation();
            while (top(state).offset > indented) {
                if (top(state).type != "py") return true;
                state.scopes.pop();
            }
            return top(state).offset != indented;
        }

        function tokenLexer(stream, state) {
            var style = state.tokenize(stream, state);
            var current = stream.current();

            // Handle '.' connected identifiers
            if (current == ".") {
                style = stream.match(identifiers, false) ? null : ERRORCLASS;
                if (style === null && state.lastStyle == "meta") {
                    // Apply 'meta' style to '.' connected identifiers when
                    // appropriate.
                    style = "meta";
                }
                return style;
            }

            // Handle decorators
            if (current == "@") {
                if (parserConf.version && parseInt(parserConf.version, 10) == 3) {
                    return stream.match(identifiers, false) ? "meta" : "operator";
                } else {
                    return stream.match(identifiers, false) ? "meta" : ERRORCLASS;
                }
            }

            if ((style == "variable" || style == "builtin") && state.lastStyle == "meta")
                style = "meta";

            // Handle scope changes.
            if (current == "pass" || current == "return")
                state.dedent += 1;

            if (current == "lambda") state.lambda = true;
            if (current == ":" && !state.lambda && top(state).type == "py")
                pushScope(stream, state, "py");

            var delimiter_index = current.length == 1 ? "[({".indexOf(current) : -1;
            if (delimiter_index != -1)
                pushScope(stream, state, "])}".slice(delimiter_index, delimiter_index + 1));

            delimiter_index = "])}".indexOf(current);
            if (delimiter_index != -1) {
                if (top(state).type == current) state.scopes.pop();
                else return ERRORCLASS;
            }
            if (state.dedent > 0 && stream.eol() && top(state).type == "py") {
                if (state.scopes.length > 1) state.scopes.pop();
                state.dedent -= 1;
            }

            return style;
        }

        var external = {
            startState: function (basecolumn) {
                return {
                    tokenize: tokenBase,
                    scopes: [{offset: basecolumn || 0, type: "py", align: null}],
                    lastStyle: null,
                    lastToken: null,
                    lambda: false,
                    dedent: 0
                };
            },

            token: function (stream, state) {
                var addErr = state.errorToken;
                if (addErr) state.errorToken = false;
                var style = tokenLexer(stream, state);

                state.lastStyle = style;

                var current = stream.current();
                if (current && style)
                    state.lastToken = current;

                if (stream.eol() && state.lambda)
                    state.lambda = false;
                return addErr ? style + " " + ERRORCLASS : style;
            },

            indent: function (state, textAfter) {
                if (state.tokenize != tokenBase)
                    return state.tokenize.isString ? CodeMirror.Pass : 0;

                var scope = top(state);
                var closing = textAfter && textAfter.charAt(0) == scope.type;
                if (scope.align !== null)
                    return scope.align - (closing ? 1 : 0);
                else if (closing && state.scopes.length > 1)
                    return state.scopes[state.scopes.length - 2].offset;
                else
                    return scope.offset;
            },

            closeBrackets: {triples: "'\""},
            lineComment: "#",
            fold: "indent"
        };
        return external;
    });
});

}());
//# sourceMappingURL=main.js.map