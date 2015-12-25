var $e;
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
                        }, $scope.PLAYER_URL); // this postMessage must be done once the iframe is loaded
                    };

                    // the run button itself
                    $scope.toggleStartStop = function(){
                        if($scope.running) {
                            $scope.stop();
                            $scope.running = false;
                        }
                        else {
                            render.project($scope.sprites).then(function (response) {
                                $scope.run(response); // referring to element in runProject directive in file directives/runProject.js
                            });
                            $scope.running = true;
                        }
                    };
                }],
                controllerAs: "runProject"
            };
        });

}());
