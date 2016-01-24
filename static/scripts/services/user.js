(function (){
    angular.module("etch")

    .service("user", ["$rootScope", "$window", "api", "$mdToast", "$cookies",
                      "$location", "$route", "$mdDialog", "google_platform",
                      function($rootScope, $window, api, $mdToast, $cookies,
                               $location, $route, $mdDialog, google_platform){
        var _default_user = { // the default template user object
            logged_in: false,
            profile: {}
        };

        var _user = this;
        _user.current_user = _default_user;

        function _update_user_data(new_data){
            // update the user data object by merging with the current user obj
            for(var prop in new_data){
                _user.current_user[prop] = new_data[prop];
            }
        }

        function _clear_user_data(){
            // set user data to it's default properties
            // to keep watchers _user.current_user must stay the same object
            for(var current_prop in _user.current_user){
                delete _user.current_user[current_prop];
            }
            // now set the contents of _user.current_user to the default vals
            // remember, _user.current_user must remain the same object
            for(var default_prop in _default_user){
                var default_val = _default_user[default_prop];
                _user.current_user[default_prop] = default_val;
            }
        }

        _clear_user_data(); // set them to their defaults
        _user.current_user.logged_in = $cookies.get("logged_in") == "true" ? true : false;


        // if the user is listed by us as signed out, tell google too
        google_platform.after(function(auth2){
            if(!_user.current_user.logged_in){
                if(auth2){ // they are signed in with google
                    google_platform.sign_out();
                }
            }
        });

        _user.login_failure = function(){
            throw Error("Login failure");
        };

        _user.login = function(google_user, registering){
            // passed as callback to google lib or called by register
            // if called by google registering will be undefined
            var google_id_token = google_user.getAuthResponse().id_token;
            api.login({
                google_id_token: google_id_token,
                registering: !!registering // cast to bool
            })
                .then(
                    function success(response){
                        _user.current_user.logged_in = true;
                        _update_user_data(response.data);
                        $route.reload(); // reload template/controller
                    }, function error(){
                        // don't have the butten say that they are logged in
                        gapi.auth2.getAuthInstance().signOut();
                    }
                );
        };

        _user.logout = function(){
            // called by us not google when logout button clicked
            //log them out of us first
            api.logout().then(function(){
                // then log them out of google
                google_platform.sign_out().then(function(){
                    _clear_user_data();
                    _user.current_user.logged_in = false;
                    $route.reload(); // reload template/controller
                });
            });
        };

        _user.register = function(google_user){
            // passed as callbar to google lib
            // do the same thing as login but tell the backend to create them
            _user.login(google_user, true); // do a login, but register
        };
    }]);
}());
