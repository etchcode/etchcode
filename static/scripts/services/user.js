(function (){
    angular.module("etch")

    .service("user", ["$rootScope", "$window", "api", function($rootScope, $window, api){
        var _user = this;
        var user_currently_signing_up, signup_onlogin;

        // user code
        defaultUserObject = { // the default template user object
            loggedIn: false,
            profile: {}
        };
        _user.user = angular.copy(defaultUserObject); // use angular-copy to copy the properties and not a reference

        _user.login = function(){
            user_currently_signing_up = false;
            navigator.id.request({siteName: 'Etch Code'});
        };

        function login_user_with_server_response(response){
            _user.user.loggedIn = true;

            // make each prop of response a prop of user
            var data = response.data;
            for(var prop in data){
                if (data.hasOwnProperty(prop)){
                    _user.user[prop] = data[prop];
                }
            }

            console.log(_user.user);
        }

        if(navigator.id){
            navigator.id.watch({
                loggedInUser: null, // at some time we should have session management and remember people
                onlogin: function(assertion){
                    $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                        if(user_currently_signing_up){
                            signup_onlogin(assertion);
                        }
                        else{
                            api.login(assertion).then(function success(response){
                                login_user_with_server_response(response);
                            },function error(response){
                                navigator.id.logout();
                            });
                        }
                    });
                },
                onlogout: function(){
                    $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                        // refresh the page to clear any settings that we might have
                        api.logout().then(function success(response){
                            $window.location.reload();
                        });
                    });
                }
            });
        }
        else{
            console.error("navigator.id is undefined. Check to ensure that mozilla persona is loaded");
        }

        _user.complete_signup = function(username, name){
            user_currently_signing_up = true;
            navigator.id.request({siteName: 'Etch Code'});

            signup_onlogin = function(assertion){
                _user.close_signup_popup(); // signup.js gives us this function
                api.create_user({
                    username: username,
                    name: name,
                    assertion: assertion
                }).then(function success(response){
                    login_user_with_server_response(response);
                    user_currently_signing_up = false;
                }, function error(response){
                    navigator.id.logout();
                    $window.location.reload();
                });
            };
        };
    }]);
}());
