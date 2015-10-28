(function(){
    angular.module("etch")
    
    .filter('html', ['$sce', function($sce){
      return function(val) {
        return $sce.trustAsHtml(val);
      };
    }]);    
    
}());