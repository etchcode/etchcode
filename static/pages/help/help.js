(function(){
    angular.module("etch")
    
    .controller("helpController", ["$scope", "$rootScope", "$http", function($scope, $rootScope, $http){
        var _this = this;
        
        $rootScope.pageName = "Help & Feedback";
        
        var contentToGet = {"pages/help/fromScratch.md": "fromScratch", "pages/help/fromNothing.md": "fromNothing", "pages/help/fromWritten.md": "fromWritten"};
        
        for(var page in contentToGet){
            $http.get(page).then(function success(response){
                var content = response.data;
                var name = contentToGet[response.config.url];
            
                _this[name] = marked(content);
            });
        }
    }]);
}());