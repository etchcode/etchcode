(function (){
    angular.module("etch")

    .service("user", ["$rootScope", "$window", "api", function($rootScope, $window, api){
        var _this = this;

        // user code
        defaultUserObject = { // the default template user object
            loggedIn: false,
            profile: {}
        };
        _this.user = angular.copy(defaultUserObject); // use angular-copy to copy the properties and not a reference

        // logout/logout code: We can't just use ng-click because of popup blockers,
		//so they are as onclick handlers. <https://developer.mozilla.org/en-US/Persona/Quick_Setup#Step_2_Add_login_and_logout_buttons>

		if(navigator.id){
	        navigator.id.watch({
	            loggedInUser: null, // at some time we should have session management and remember people
	            onlogin: function(assertion){
	                $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
	                    api.login(assertion).then(function success(response){
	                        _this.user.loggedIn = true;
	                        _this.user.profile = response.data;

	                    },function error(response){
	                        navigator.id.logout();
	                    });
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
    }]);
}());
