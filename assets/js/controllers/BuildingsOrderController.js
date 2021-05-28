'use strict';
app.controller('BuildingsOrderController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    
    /* Begin add form */
    $rootScope.items = {};
    $rootScope.cities = {};
    $rootScope.parent_items = {};
    $rootScope.order_val = '';
    $rootScope.city_status = false;
    //$rootScope.set_orders = {};
    $rootScope.fields = {};
    $rootScope.data_loading = false;
    $scope.save_button = false;
    
    $scope.updateSaveButton = function(status){
        $scope.save_button = status;
    }
    
    $scope.save_all = function(city_id){
        $scope.check_validation();
        $timeout(function(){
            var update_orders = angular.element('#frmOrder').serialize();
            if(form_valid('#frmOrder', '')){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                if($scope.save_button == true && angular.element('.duplicate_value_error').length <= 0 && angular.element('.help-block-error').length <= 0){   
                    $rootScope.success_msg = 'List order updated successfully';
                    // To clear form elements
                    $timeout(function(){
                        angular.element('.alert-success').fadeIn(100);
                        angular.element('.alert-success').fadeOut(3500);
                    },500);
                    $http({
                        method: 'POST',
                        url: GLOBAL.API_URL+"buildings/update-order",
                        data: update_orders,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function(data, status) {
                        /*$rootScope.success_msg = 'List order updated successfully';
                        // To clear form elements
                        $timeout(function(){
                            angular.element('.alert-success').fadeIn(1000);
                            angular.element('.alert-success').fadeOut(3500);
                        },500);*/
                        $rootScope.change_city();
                    });
                } 
            }
        }, 500);
    }
    
    $scope.check_validation = function (){
        var valid = 1; 
        var textValues = [];
        angular.forEach(angular.element('.order_value'), function(value,key){ 
            if (angular.element(value).val() !== "") {
                var doesExisit = ($.inArray(angular.element(value).val(), textValues) === -1) ? false : true;
                if (doesExisit === false) {
                    textValues.push(angular.element(value).val());
                } else {
                    valid = 0;
                    return false;
                }
            }
            
        });
        
        if(valid == 0){
            $scope.save_button = false;
        } else {                            
            $scope.save_button = true;
        }
        
    }
    
    $rootScope.change_city = function(){
        angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
        $timeout(function(){
            if($rootScope.fields.v_city_name != '' && $rootScope.fields.v_city_name != undefined){
                $rootScope.city_status = true;
                $rootScope.data_loading = true;
                $scope.save_button = true;
                var responsePromise = $http.post(GLOBAL.API_URL+"buildings/set-order",{'search_fields':$rootScope.fields});
                responsePromise.success(function(data, status1, headers, config){
                    $rootScope.items = data.items;
                    $rootScope.data_items = data.items;
                    $rootScope.parent_items = data.parent_items;
                    $rootScope.data_loading = false;
                    angular.element('div.loading').addClass('hide');
                });
            } else {
                $scope.save_button = false;
                $rootScope.city_status = false;
                $rootScope.data_loading = false;
                angular.element('div.loading').addClass('hide');
            }
        }, 500);
    }
    
    /*$rootScope.check_similar = function(event){
        var curr_val = angular.element(event.target).val();
        if(curr_val != '' && curr_val > 0){
            
        }
    }*/
    
    
    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        
        var responsePromise = $http.get(GLOBAL.API_URL+"buildings/city-data");
        responsePromise.success(function(data, status1, headers, config){
            $rootScope.cities = data.city;
        });
        //PaginationService.loading(GLOBAL.API_URL+"buildings/set-order","buildings.v_name");
        
    });
    
    
});