// communication with /api/*
(function(){
    angular.module("etch")

    .service("api", ["$http", function($http){
        var rootUrl = "/api/";

        api_request = function(url, base){
            // factory for creating requests
            if(!(this instanceof api_request)){ // if we weren't created with new keyword
                return new api_request(url);
            }
            base = base || rootUrl; // use rootUrl by default if none is provided
            var raw_url = base + url;

            this.get = function(data){
                return $http.get(raw_url, {data: data});
            };
            this.post = function(data){
                return $http.post(raw_url, data);
            };
        };

        this.login = api_request("login").post;
        this.logout = api_request("logout").post;

        var project_req = api_request("project");
        this.fetch_project = project_req.get;
        this.change_project = project_req.post;
    }]);
}());
