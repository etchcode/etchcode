angular.module("etch").config(["$httpProvider", function($httpProvider){
    $httpProvider.interceptors.push(["$q", "$injector", function($q, $injector, $mdToast){
        return {
            responseError: function(response){
                // this shows toasts for server errors and lets users retry
                // requests if they time out/have no internet connections

                // involve on $http which becomes circular so inject manually
                $mdToast = $injector.get("$mdToast");
                $http = $injector.get("$http");

                if(response.status <= 0){
                    // we are offline
                    var deferred = $q.defer();

                    $mdToast.show(
                        $mdToast.simple()
                            .hideDelay(false)
                            .textContent("Server is temporarily unavailable")
                            .action("Retry")
                    ).then(function (should_retry){
                        if(should_retry == "ok"){ // they clicked Retry
                            deferred.resolve($http(response.config));
                        }
                        else{
                            deffered.resolve($q.reject(response));
                        }
                    });

                    return deferred.promise;
                }
                else{
                    var message = response.data ? "Error: " + response.data.message || "Error" : "Error";
                    $mdToast.show(
                        $mdToast.simple()
                            .hideDelay(6 * 1000) // 6 secs in millisecs
                            .textContent(message)
                    );

                    return $q.reject(response);
                }
            }
        };
    }]);
}]);
