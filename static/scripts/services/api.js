// communication with /api/*
(function(){
    angular.module("etch")

    .service("api", ["$http", function($http){
        var rootUrl = "/api/";

        this.login = function(assertion){
            return $http.post(rootUrl + "login", assertion)
        };
    }]);
}());