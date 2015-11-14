(function (){
    angular.module("etch")
        
    .service("account", ["$rootScope", "api", function($rootScope, api){
        var _this = this;
        
        // user code
        defaultUserObject = { // the default template user object
            loggedIn: false
        };
        $rootScope.user = angular.copy(defaultUserObject); // use angular-copy to copy the properties and not a reference
        
        // logout/logout code. We can't just use ng-click because of popup blockers. <https://developer.mozilla.org/en-US/Persona/Quick_Setup#Step_2_Add_login_and_logout_buttons>
        document.getElementById("signoutButton")
            .addEventListener("click", function(){
                navigator.id.logout();
            });
        
        document.getElementById("loginButton")
            .addEventListener("click", function(){
                navigator.id.request();
            });
        
        document.getElementById("signupButton")
            .addEventListener("click", function(){
                navigator.id.request();
            });
        
        navigator.id.watch({
            loggedInUser: null, // at some time we should have session management and remember people
            onlogin: function(assertion){
                $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                    $rootScope.user.loggedIn = true;
                    
                    console.log(assertion);
                });
            },
            onlogout: function(){
                $rootScope.$apply(function(){ // this is async so we need to get back into angular-land
                    $rootScope.user = angular.copy(defaultUserObject); // use ng-copy to copy props and not a ref
                });
            }
        });
    }]);
}());