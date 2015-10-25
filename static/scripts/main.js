/* globals angular, nunjucks */
(function () {
	"use strict";

	nunjucks.configure("/static/partials", {autoescape: true});

	angular.module("etch", ["ngSanitize", "ngMaterial", "ngAnimate", "ui.codemirror", "ngRoute", "toaster"])

		.config(["$routeProvider", "$locationProvider", "$mdThemingProvider",
			function ($routeProvider, $locationProvider, $mdThemingProvider) {
//                $locationProvider.html5Mode(true);

				$routeProvider
					.when("/", {
                        templateUrl: "pages/home/index.html"
                    })
					.when("/editor", {
						templateUrl: "pages/editor/index.html"
					})
					.when("/docs", {
						templateUrl: "pages/docs/index.html"
					}).otherwise({
						redirectTo: "/"
					});

                $mdThemingProvider.theme("default")
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
            window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var n=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(n?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(a,o);for(var r=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["clearEventProperties","identify","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=r(p[c])};
            heap.load("67792227");
        
            $rootScope.$on("$routeChangeStart", function(event, next, current){
                heap.track("location", {path: $location.path()});
                console.info("tracking change");
            });
        });

}());