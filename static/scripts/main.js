/* globals nunjucks, heap */
(function () {
	"use strict";

	angular.module("etch", ["ngSanitize", "ngMaterial", "ui.codemirror", "ngRoute", "toaster", "source-map-exception-handler"])

		.config(["$routeProvider", "$locationProvider", "$mdThemingProvider",
			function ($routeProvider, $locationProvider, $mdThemingProvider) {

				$routeProvider
                .when("/", {
                    templateUrl: "static/pages/home/index.html"
                })
                .when("/projects", {
                    templateUrl: "static/pages/projects/index.html"
                })
                .when("/project/:project_id/:project_name?/edit", {
                    templateUrl: "static/pages/editor/index.html"
                })
                .when("/project/:project_id/:project_name?/view", {
                    templateUrl: "static/pages/viewer/index.html"
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
                    templateUrl: "static/pages/404/index.html"
                });
                $locationProvider.html5Mode(true);

                $mdThemingProvider.theme("default") // these colors should also been included in static/styles/color.sass in the form of the variables $md-accent and $md-default
                    .primaryPalette("blue", {
                        "default": "500"
                    })
                    .accentPalette("orange", {
                        "default": "700"
                    });

                nunjucks.configure("/templates/project", {autoescape: true});
			}
		])

        .run(function($rootScope, $location){
            // heap analytics tracking code
            // jshint ignore:start
            (function(){
                window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var n=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(n?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(a,o);for(var r=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["clearEventProperties","identify","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=r(p[c])};
            }());
            // jshint ignore:end
            var HEAP_ID = PRODUCTION ? "2529494419" : "67792227";
            heap.load(HEAP_ID);

            $rootScope.$on("$routeChangeStart", function(event, next, current){
                if($location.path() == "/"){
                    $rootScope.page_name = undefined;
                }
                else{
                    $rootScope.page_name = $location.path().split("/")
                    .map(function(word){
                        return word === "" ? "" :
                        word[0].toUpperCase() + word.substr(1);
                    })
                    .join(" ");
                }
            });
        });

}());
