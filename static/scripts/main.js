/* globals angular, nunjucks */
(function () {
	"use strict";

	nunjucks.configure("/static/partials", {autoescape: true});

	angular.module("etch", ["ngSanitize", "ngMaterial", "ui.codemirror", "ngRoute", "toaster"])

		.config(["$routeProvider", "$locationProvider", "$mdThemingProvider",
			function ($routeProvider, $locationProvider, $mdThemingProvider) {
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

				//$locationProvider.html5Mode(true);

                $mdThemingProvider.theme("default")
                    .primaryPalette("blue", {
                        "default": "500"
                    })
                    .accentPalette("orange", {
                        "default": "700"
                    })
			}
		]);

}());