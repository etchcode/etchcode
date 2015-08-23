/* globals angular, nunjucks */
(function(){
	"use strict";
	
	nunjucks.configure("/static/partials", { autoescape: true });
	
	angular.module("etch", ["ngSanitize", "ui.codemirror", "ngRoute", "toaster"])
	
	.config(["$routeProvider", "$locationProvider",
        function($routeProvider, $locationProvider){
            $routeProvider.when("/editor", {
                templateUrl: "pages/editor/index.html"
            })
            .when("/docs", {
                templateUrl: "pages/docs/index.html"
            }).otherwise({
                templateUrl: "pages/home/index.html"
            });

            //$locationProvider.html5Mode(true);
	    }
    ]);
	
}());