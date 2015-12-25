// communication with /api/*
(function(){
    angular.module("etch")

    .service("api", ["$http", function($http){
        var rootUrl = "/api/";

        api_request = function(url, base, data_for_all){
            // factory for creating requests
            if(!(this instanceof api_request)){ // if we weren't created with new keyword
                return new api_request(url, base, data_for_all);
            }

            base = base || rootUrl; // use rootUrl by default if none is provided
            data_for_all = data_for_all || {};
            var raw_url = base + url;

            this.get = function(data){
                angular.merge(data, data_for_all);
                return $http.get(raw_url, {params: data});
            };
            this.post = function(data, params){
                angular.merge(data, data_for_all);
                var config = params ? {params: params} : undefined;
                return $http.post(raw_url, data, config);
            };
        };

        this.login = api_request("login").post;
        this.logout = api_request("logout").post;

        this.fetch_project = api_request("project", undefined, {format: "JSON"}).get;
        this.change_project = api_request("project").post;
    }]);
}());
