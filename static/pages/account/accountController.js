angular.module("etch")
.controller("accountController", ["$rootScope", "$scope", "user", function($rootScope, $scope, user){
    $rootScope.pageName = "Account"; // set page name for use in title, etc
    $scope.modifying = {}; // the objects we want to temporarily clone so we can move them back when they are saved
    $scope.modifying.user = angular.copy(user.user); // lets copy the user object so if we don't save it won't be modified
    
    $scope.$on("$destroy", function(){
        // we are leaving this page, clean up
        alert(1);
    });
}]);