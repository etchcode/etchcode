(function(){
    angular.module("etch")
    
    .controller("helpController", ["$scope", "$rootScope", function($scope, $rootScope){
        $rootScope.pageName = "Help & Feedback";
    }]);
}());