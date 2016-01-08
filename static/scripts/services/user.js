(function (){
    angular.module("etch")

    .service("user", ["$rootScope", "$window", "api", "$mdToast", "$cookies",
                      "$location", function($rootScope, $window, api, $mdToast,
                                            $cookies, $location){
        var _user = this;
        var user_currently_signing_up; // this is a global var that is true if a register action is going on becase we can't differentiate otherwise in the persona callback
        var login_config = {siteName: 'Etch Code'}; // config obj to pass to navigator.id.request
        _user.registering = {}; // on partial signup this is set

        // user code
        defaultUserObject = { // the default template user object
            logged_in: false,
            profile: {}
        };
        _user.user = angular.copy(defaultUserObject); // use angular-copy to copy the properties and not a reference
        _user.user.logged_in = $cookies.get("logged_in") == "true" ? true : false;

        _user.login = function(){
            user_currently_signing_up = false;
            if(navigator.id){
                navigator.id.request(login_config);
            }
            else{
                $mdToast.show(
                    $mdToast.simple()
                        .hideDelay(false)
                        .textContent("You must be online to login")
                );
            }
        };

        _user.logout = function(){
            if(navigator.id){
                navigator.id.logout();
            }
            else{
                $mdToast.show(
                    $mdToast.simple()
                        .hideDelay(false)
                        .textContent("You must be online to logout")
                );
            }
        };

        _user.register = function(){
            user_currently_signing_up = true;
            navigator.id.request(login_config);
        };

        function login_user_with_server_response(response){
            _user.user.logged_in = true;

            // make each prop of response a prop of user
            var data = response.data;
            for(var prop in data){
                if (data.hasOwnProperty(prop)){
                    _user.user[prop] = data[prop];
                }
            }
        }

        function complete_registration(email_registering){
            _user.user.registering = {
                email: email_registering
            };

            $location.path("/account/complete_registration");
        }

        if(navigator.id){
            navigator.id.watch({
                loggedInUser: null, // at some time we should have fill this from the cookie
                onlogin: function(assertion){
                    $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                        if(user_currently_signing_up){
                            api.create_user(assertion).then(function success(response){
                                user_currently_signing_up = false;
                                complete_registration(response.data.email);
                            }, function error(response){
                                user_currently_signing_up = false;
                                navigator.id.logout();
                            });
                        }
                        else{
                            api.login(assertion).then(function success(response){
                                login_user_with_server_response(response);
                            }, function error(response){
                                navigator.id.logout();
                            });
                        }
                    });
                },
                onlogout: function(){
                    $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                        // refresh the page to clear any settings that we might have
                        if(_user.user.logged_in){
                            api.logout().then(function success(response){
                                $window.location.reload();
                            });
                        }
                    });
                }
            });
        }
        else{
            console.error("navigator.id is undefined. Check to ensure that mozilla persona is loaded");
        }
    }]);
}());
