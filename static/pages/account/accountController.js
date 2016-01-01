angular.module("etch")
.controller("accountController", ["$rootScope", "$scope", "user", "api", function($rootScope, $scope, user, api){
    $rootScope.page_name = "Account"; // set page name for use in title, etc
    $scope.user = user.user; // lets copy the user object so if we don't save it won't be modified

    $scope.save = function(){
        var potential_changes = ["username", "name"];

        var to_change = {};
        potential_changes.forEach(function(change){
            if($scope.account_form[change].$dirty){ // it has been changed
                to_change[change] = $scope.account_form[change].$modelValue;
            }
        });

        api.change_profile(to_change);
        $scope.account_form.$setPristine(); // make the form clean for the next update
    };
}]);
