angular.module("etch").directive("signup", ["$mdDialog", "user", function($mdDialog, user){
    return {
        restrict: "E",
        replace: true,
        templateUrl: "static/components/signup/signup.html",
        controller: ["$scope", function ($scope){
            _signup = this;
            _signup.user_data = {};

            _signup.open = function($event){
                var button = document.getElementsByClassName("signupButton")[0];
                $mdDialog.show({
                    templateUrl: "static/components/signup/signup_dialog.html",
                    targetEvent: $event,
                    openFrom: button,
                    closeTo: button,
                    clickOutsideToClose: true,
                    controller: ["$scope", function($scope){
                        $scope.user_data = _signup.user_data;

                        $scope.close = function(){
                            $mdDialog.hide();
                        };
                        user.close_signup_popup = $scope.close;

                        $scope.complete_signup = function(){
                            user.complete_signup(_signup.user_data.username,
                                                     _signup.user_data.name);
                        };
                    }],
                    controllerAs: "signup_dialog"
                });
            };
        }],
        controllerAs: "signup"
    };
}]);
