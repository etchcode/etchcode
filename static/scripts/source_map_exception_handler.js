angular.module('source-map-exception-handler', [])

.config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
        return function(exception, cause) {
            $delegate(exception, cause);
            throw exception;
        };
    }]);
}]);
