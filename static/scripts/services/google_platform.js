var _loaded = false; // bool if loaded
var _on_load = null; // function that if defined will be called when loaded
window.google_platform_load_callback = function(){
    // called by google when their stuff loads. Must be defined out of angular-land
    // as it could be called before angular bootstapps
    _loaded = true;

    if(_on_load){
        _on_load();
    }
};

angular.module("etch").service("google_platform", ["$rootScope", "$q",
                               function($rootScope, $q){
    debug.$q = $q;
    // alerts angular stuff when the google library has been loaded
    var _gp = this;
    var _stack = [];
    get_auth_instance = function(){
        if(gapi.auth2){
            return gapi.auth2.getAuthInstance();
        }
        else{
            return undefined;
        }
    };

    // handle registering callbacks after load
    _gp.after = function(callback){
        if(_loaded){ // callback called after this and google load
            callback(get_auth_instance());
        }
        _stack.push(callback);
    };
    // after run the user will be logged out, regardless of state before
    _gp.sign_out = function(){
        return $q(function(resolve, reject){
            _gp.after(function(auth_instance){
                if(auth_instance){ // they are logged in
                    auth_instance.signOut();
                }
                resolve();
            });
        });
    };

    // handle what happens when we are done loading before this runs
    if(_loaded){
        // google loaded before angular bootstrapped
        _load_complete();
    }
    // handle what happens when this runs before we are done loading
    else{
        _on_load = _load_complete;
    }

    function _load_complete(){
        $rootScope.$apply(function(){
            _stack.forEach(function(callback){
                callback(get_auth_instance());
            });
        });
    }
}]);
