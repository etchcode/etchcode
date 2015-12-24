/* globals nunjucks, heap */
(function () {
	"use strict";

	nunjucks.configure("/static/pages/editor", {autoescape: true});

	angular.module("etch", ["ngSanitize", "ngMaterial", "ui.codemirror", "ngRoute", "toaster", "source-map-exception-handler"])

		.config(["$routeProvider", "$locationProvider", "$mdThemingProvider",
			function ($routeProvider, $locationProvider, $mdThemingProvider) {

				$routeProvider
                .when("/", {
                    templateUrl: "static/pages/home/index.html"
                })
                .when("/project/:projectId/:projectName?/edit", {
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

}());
