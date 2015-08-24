/* globals angular, nunjucks */
(function () {
	"use strict";

	nunjucks.configure("/static/partials", {autoescape: true});

	angular.module("etch", ["ngSanitize", "ui.codemirror", "ngRoute", "toaster"])

		.config(["$routeProvider", "$locationProvider",
			function ($routeProvider, $locationProvider) {
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
			}
		]);

}());