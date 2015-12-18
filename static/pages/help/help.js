(function(){
    angular.module("etch")
    
    .controller("helpController", ["$scope", "$rootScope", "$http", "$sce", function($scope, $rootScope, $http, $sce){
        var _this = this;
        
        $rootScope.pageName = "Help & Feedback";
        
        var contentToGet = {"static/pages/help/fromScratch.md": "fromScratch", "static/pages/help/fromNothing.md": "fromNothing", "static/pages/help/fromWritten.md": "fromWritten"};
        
        for(var page in contentToGet){
            $http.get(page).then(function success(response){
                var content = response.data;
                var name = contentToGet[response.config.url];
            
                _this[name] = $sce.trustAsHtml(marked(content));
            }); // jshint ignore:line
        }
    }]);
}());