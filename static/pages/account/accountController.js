angular.module("etch")
.controller("accountController", ["$rootScope", "$scope", "user", "api", function($rootScope, $scope, user, api){
    $rootScope.pageName = "Account"; // set page name for use in title, etc

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
