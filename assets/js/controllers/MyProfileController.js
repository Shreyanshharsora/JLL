'use strict';
app.controller('MyProfileController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter,$cookieStore) {
    /* Begin add form */
    $rootScope.filename = '';
    $rootScope.parent_items = {};
    $rootScope.add_fields = {};
    $rootScope.edit_fields = {};
    $rootScope.view_data = {};
    $rootScope.search_fields = {};
    $rootScope.selected_record = {};
    $rootScope.prev_record = false;   
    $rootScope.nexts_record = false;
    $rootScope.items = {};

    $scope.$on('$viewContentLoaded', function() 
    {
        var responsePromise = $http.post(GLOBAL.API_URL+"my_profile");
            responsePromise.success(function(data, status1, headers, config) 
            {
                $rootScope.items = data.items;
            });
            
        /*$http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"my_profile","fname");*/
    });
    
    $rootScope.submit_frm_edit = function(items){
        /*if(form_valid('#frmEdit',"help-block"))
        {
            //Call submit data services
            PaginationService.submit_edit_form_data(GLOBAL.API_URL+"edit_profile", edit_fields);
            // To clear form elements
            $timeout(function()
            {
                angular.element('.alert-success').show();
            },500);
        }   
        */
        if(form_valid('#frmEdit',"help-block")){
             angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
             $http.post(GLOBAL.API_URL+"users/edit", items).success(function(data, status, headers, config) {

                if(angular.element.trim(data) == 'TRUE'){
                    setTimeout(function(){
                       angular.element('.alert-success').fadeIn(500);
                       setTimeout(function(){
                            angular.element('.alert-success').fadeOut(3000);
                            angular.element('div.loading').addClass('hide');
                        },1000);
                    },500);
                    $cookieStore.put('user_name',items.fname +' ' +items.lname);
                    $rootScope.user_name =  $cookieStore.get('user_name');
                }else{
                    if(data.error != undefined) {
                        angular.forEach(data.error, function(value,key){
                            $("#"+key+'_error').css('display','block');
                        });
                        
                        //$("#validation_error").html('Duplicate '+angular.element.trim(data));
                    }
                    else
                    {
                        $("#validation_error").html('You have some form errors. Please check below.');   
                    }
                    if($("#submit_loader").length > 0)
                    {
                        $("#submit_loader").hide();
                    }
                    angular.element('div.loading').addClass('hide');
                }
             });
        }               
    }
});