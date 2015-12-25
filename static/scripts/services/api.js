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
                if(data){
                    angular.merge(data, data_for_all);
                }
                return $http.get(raw_url, {params: data});
            };
            this.delete = function(data){
                if(data){
                    angular.merge(data, data_for_all);
                }
                return $http.delete(raw_url, {params: data});
            };
            this.post = function(data, params){
                if(data){
                    angular.merge(data, data_for_all);
                }
                var config = params ? {params: params} : undefined;
                return $http.post(raw_url, data, config);
            };
            this.put = function(data, params){
                if(data){
                    angular.merge(data, data_for_all);
                }
                var config = params ? {params: params} : undefined;
                return $http.put(raw_url, data, config);
            };
        };

        this.login = api_request("login").post;
        this.logout = api_request("logout").post;

        this.fetch_projects = api_request("projects").get;

        this.fetch_project = api_request("project").get;
        this.change_project = api_request("project").post;
        this.create_project = api_request("project/create").post;
        this.delete_project = api_request("project").delete;

        this.create_user = api_request("user").post;
        this.change_profile = api_request("user/profile").put;
    }]);
}());
