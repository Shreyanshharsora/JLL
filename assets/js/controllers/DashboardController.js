'use strict';

app.controller('DashboardController', function($rootScope, $scope, $http, $timeout,GLOBAL) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax(); 
        var successData = $http.post(GLOBAL.API_URL+'dashboard-record');
        successData.success(function(data, status, headers, config){
            $scope.totalRecord = data;
        });    
    });
    
     
    // set sidebar closed and body solid layout mode
    //$rootScope.settings.layout.pageBodySolid = true;
    //$rootScope.settings.layout.pageSidebarClosed = false;
});