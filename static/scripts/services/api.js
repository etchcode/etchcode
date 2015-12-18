// communication with /api/*
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
}());