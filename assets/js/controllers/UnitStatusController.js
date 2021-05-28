'use strict';
app.controller('UnitStatusController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    /* Begin add form */
    $rootScope.filename = '';
    $rootScope.parent_items = {};
    $rootScope.edit_fields = {};
    $rootScope.view_data = {};
    $rootScope.selected_record = {};
    $rootScope.prev_record = false;   
    $rootScope.nexts_record = false;
    $rootScope.valid_img = 0;
    $rootScope.current_page = 1;
    $rootScope.page = 1;
    $rootScope.edit_original_data = {};
    $rootScope.country = {};
    $rootScope.SITE_URL = GLOBAL.SITE_URL;
    
    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"unit-status","updated_at");
    });
        
    if($stateParams.id != "" && $stateParams.id != undefined)
    {
        if(mySharedService.edit_fields != undefined) {
            $rootScope.frm_edit_open(mySharedService.edit_fields);
        } else {
            var responsePromise = $http.post(GLOBAL.API_URL+"unit-status/data/"+$stateParams.id);
            responsePromise.success(function(data, status1, headers, config) 
            {
                if(data.items != "" && data.items != undefined)
                {
                    $timeout(function()
                    {
                        $rootScope.items = data.items;
                        $rootScope.edit_fields = angular.fromJson($rootScope.items);
                        $rootScope.frm_edit_open(data.items);
                    });
                }
            });
        }
    }
    
    
    $rootScope.export_to_excel = function(fields){
        if(fields != undefined)
        {
            $rootScope.search_fields = fields;
            if($rootScope.search_fields['order_field'] != undefined){            
                $rootScope.search_fields['order_field'] = $rootScope.order_field;
            }
            if($rootScope.search_fields['sort_order'] != undefined){                        
                $rootScope.search_fields['sort_order'] = $rootScope.sort_order;
            } 
        }
        
        if($rootScope.search_fields == undefined){
            $scope.someModelSerialized = '[]'; 
        } else {
            $scope.someModelSerialized = angular.toJson($rootScope.search_fields); 
        }
        
        window.location.href = GLOBAL.API_URL+'unit-status/export/'+$scope.someModelSerialized;
    }
    
    $scope.frm_add_open = function(parent_items){
        angular.element('.alert').hide();
        $("#frmAdd .form-group").removeClass('has-error');
        $("#frmAdd .required").removeAttr('style');
        $("#frmAdd .help-block-error").remove();
        angular.element('.add_e_status').select2('val', 'Active');
        $('.dropzone').show();
    }
    
    /* Begin edit form */
    $rootScope.loadEditData = function(item){
        $rootScope.edit_fields = item;
        mySharedService.edit_fields = $rootScope.edit_fields; 
        //$rootScope.$broadcast($rootScope.edit_fields1);
        $state.go('/unit-status-edit',{id: item.id});
    }
    
    /* Begin edit form */
    $rootScope.frm_edit_open = function(item)
    {
        setTimeout(function(){
            $('.colorpicker-default').colorpicker();
        },500);
        angular.element('.alert').hide();
        $rootScope.edit_fields = item;
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        
        /* Initialize ckeditor and set value in editor */   
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
    }
    
    $rootScope.submit_frm_edit = function(edit_fields){
        setTimeout(function(){
            if(form_valid('#frmEdit',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services            
                edit_fields.v_color = angular.element('#v_color').val();
                PaginationService.submit_edit_form_data(GLOBAL.API_URL+"unit-status/edit", edit_fields, '/unit-status');
                $rootScope.success_msg = 'Record update successfully.';
                // To clear form elements
                setTimeout(function(){
                    /*angular.copy({}, edit_fields);
                    $rootScope.$apply();*/
                    angular.element('.alert-success').fadeIn(1000);
                    angular.element('.alert-success').fadeOut(2000);
                    angular.element('.alert').hide();
                    angular.element('div.loading').addClass('hide');
                },1000);
            }    
        },500);            
    }
    /* End edit form */
    
    /* Delete unit status*/
    $scope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                $rootScope.success_msg = 'Record delete successfully.';
                angular.element('.alert-success').fadeIn(500);
                PaginationService.delete_data(GLOBAL.API_URL+"unit-status/delete",id);
                setTimeout(function(){
                    $rootScope.$apply();
                    setTimeout(function(){
                        angular.element('.alert-success').fadeOut(2000);
                    },1000);
                },500);
            }
        }); 
    }
   
    /* Clear form data */
    $scope.clearFormData = function($page){
               
        if($page == 'edit'){        
            bootbox.confirm("Updated information will discard. Are you sure you want to continue?", function(result) {
                if(result == true)
                
                    $state.go('/unit-status');
            });
        }else{
            $state.go('/unit-status');
                    
        }        
    };
});


/* City Add */
'use strict';
app.controller('UnitStatusAddController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    $rootScope.add_fields = {};
    $scope.$on('$viewContentLoaded', function() {
        if (!jQuery().colorpicker) {
            return;
        }
        $('.colorpicker-default').colorpicker({
        });
        
    }); 
    
     /* Clear form data */
    $scope.clearFormData = function($page){
        $state.go('/unit-status');
    };
    
    $scope.submit_frm_add = function(add_fields,button_pressed){
        setTimeout(function(){
            if(form_valid('#frmAdd',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services
                add_fields.v_color = angular.element('#v_color').val();
                if(button_pressed == 'New'){
                    PaginationService.submit_add_form_data(GLOBAL.API_URL+"unit-status/add", add_fields);
                } else {
                    PaginationService.submit_add_form_data(GLOBAL.API_URL+"unit-status/add", add_fields, '/unit-status');
                }
                
                $rootScope.success_msg = 'Record add successfully';
                angular.element('.alert-success').fadeIn(1000);
                setTimeout(function(){
                     angular.element('.alert-success').fadeOut(2000);
                     angular.element('.select2me').select2('val', '');
                     angular.element('.alert').hide();
                     angular.element('div.loading').addClass('hide');
                },500);
            } else {           
                $rootScope.valid_img =  1;
                return false;
            }
        },500);                
    }
    /* End add form */
    
});
