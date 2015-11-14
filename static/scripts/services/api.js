// communication with /api/*
(function(){
    angular.module("etch")

    .service("api", ["$http", function($http){
        var rootUrl = "/api/";

        this.login = function(assertion){
            $http.post(rootUrl + "login", assertion)
                .then(function(response){
                    console.log(response.data);
                });
        }
    }]);
}());