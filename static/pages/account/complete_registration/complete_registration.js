angular.module("etch").controller("completeRegistrationController",
                                 ["$scope", "user", "api", "$mdToast",
                                 "$location", function($scope, user, api,
                                                       $mdToast, $location){
    _account = this;
    _account.registering = user.user.registering;

    _account.finish = function(){
        api.check_username({"username": _account.registering.username}).then(function(response){
            // if it isn't unique the standard error callback will be called
            api.complete_registration({
                username: _account.registering.username,
                name: _account.registering.username
            }).then(function(){
                user.user.logged_in = true;
                $location.path("/");
            });
        });
    };
}]);
