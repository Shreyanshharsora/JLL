'use strict';
app.controller('EmailTemplatesController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter) {
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
    $rootScope.current_page = 1;
    $rootScope.edit_original_data = {};
    $rootScope.export_to_excel = function(fields){
        if(fields != undefined)
        {
            $rootScope.search_fields = fields;
        }
        $rootScope.search_fields['order_field'] = $rootScope.order_field;
        $rootScope.search_fields['sort_order'] = $rootScope.sort_order;
        if($rootScope.search_fields == undefined){
            $scope.someModelSerialized = ''; 
        } else {
            $scope.someModelSerialized = angular.toJson($rootScope.search_fields); 
        }
        
        window.location.href = GLOBAL.API_URL+'email_templates/export/'+$scope.someModelSerialized;
    }

    $rootScope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                angular.element('#tablerow'+id).fadeOut('2000');
                $rootScope.success_msg = 'Deleted successfully';
                setTimeout(function(){
                    $rootScope.$apply();
                    angular.element('.alert-success').fadeIn(1000);
                    angular.element('.alert-success').fadeOut(2000);
                },500);
                //PaginationService.delete_data(GLOBAL.API_URL+"news/news-delete",id);
            }
        }); 
    }
    
    $rootScope.frm_add_open = function(parent_items){
        angular.element('.alert').hide();

        $("#frmAdd .form-group").removeClass('has-error');
        $("#frmAdd .required").removeAttr('style');
        $("#frmAdd .help-block-error").remove();
        
        CKEDITOR.instances = { };
        if($("#cke_faq_content_editor_add").length > 0)
            $("#cke_faq_content_editor_add").remove();
        CKEDITOR.replace('faq_content_editor_add');
        CKEDITOR.instances['faq_content_editor_add'].setData('');
        
        angular.element(".dropzone .tools .btn-cancel").trigger("click");
    }
    
    $rootScope.submit_frm_add = function(add_fields){
        
        // Update ckeditor value in its instance
        CKEDITOR.instances['faq_content_editor_add'].updateElement();
        add_fields['v_answer'] = angular.element('#faq_content_editor_add').val();
        
        /* For uplod image */
        add_fields['h_v_img'] = angular.element('#h_v_img').val();
        add_fields['v_img_values'] = angular.element('#frmAdd .final').val();
        
        if(form_valid('#frmAdd',"help-block")){
           //Call submit data services
            PaginationService.submit_add_form_data(GLOBAL.API_URL+"email_templates/add", add_fields);
            $rootScope.success_msg = 'Added successfully';
            // To clear form elements
            setTimeout(function(){
                angular.copy({}, add_fields);
                $rootScope.$apply();
                angular.element('.alert-success').fadeIn(1000);
                angular.element('.alert-success').fadeOut(2000);
                angular.element('.select2me').select2('val', '');
                CKEDITOR.instances['faq_content_editor_add'].setData('');
                angular.element(".dropzone .tools .btn-cancel").trigger("click");
                angular.element('.alert').hide();
            },500);
        }                
    }
    /* End add form */
    
    /* Begin edit form */
    $rootScope.frm_edit_open = function(item){
        angular.element('.alert').hide();
        $rootScope.edit_fields = item;
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        $rootScope.edit_original_data = angular.copy($rootScope.edit_fields);
        angular.forEach($rootScope.items, function(value, key) {
            if(value.id == $rootScope.edit_original_data.id)
            {
                $rootScope.items[key] = $rootScope.edit_original_data;
            }
        }); 
        /* Initialize ckeditor and set value in editor */   
        CKEDITOR.instances = { };
        if($("#cke_faq_content_editor_edit").length > 0)
            $("#cke_faq_content_editor_edit").remove();
        CKEDITOR.replace('faq_content_editor_edit');
        CKEDITOR.instances['faq_content_editor_edit'].setData(item.t_template_content);
                
        /* Set dropdown values */
        angular.element('.edit_i_parent_id').select2('val', item.i_parent_id);
        angular.element('.edit_e_status').select2('val', item.e_status);
        angular.element('.edit_e_is_in_quick_link').select2('val', item.e_is_in_quick_link);
        
        /* Init drad and drop image upload and set if image already exist */        
        angular.element(".dropzone .tools .btn-cancel").trigger("click");
    }
    
    $rootScope.submit_frm_edit = function(edit_fields){
        // Update ckeditor value in its instance
        CKEDITOR.instances['faq_content_editor_edit'].updateElement();
        edit_fields['v_answer'] = angular.element('#faq_content_editor_edit').val();
        
        /* For uplod image */
        edit_fields['h_v_img'] = angular.element('#h_v_img').val();
        edit_fields['v_img_values'] = angular.element('#frmEdit .final').val();
        
        if(form_valid('#frmEdit',"help-block")){
            
            //Call submit data services
            PaginationService.submit_edit_form_data(GLOBAL.API_URL+"email_templates/edit", edit_fields);
            $rootScope.success_msg = 'Updated successfully';
            // To clear form elements
            setTimeout(function(){
                angular.copy({}, edit_fields);
                $rootScope.$apply();
                angular.element('.alert-success').fadeIn(1000);
                angular.element('.alert-success').fadeOut(2000);
                angular.element('.select2me').select2('val', '');
                CKEDITOR.instances['faq_content_editor_edit'].setData('');
                angular.element('.alert').hide();
            },500);
        }                
    }
    /* End edit form */
    
    $rootScope.data_active_inactive = function(item){
        clearTimeout($timeout);
        $timeout = setTimeout(function() {
            PaginationService.change_active_inactive(GLOBAL.API_URL+"email_templates/change-status", item.id, item.e_status);
            if(item.e_status == 'Active'){
                item.e_status = 'Inactive';
            } else {
                item.e_status = 'Active';
            }
        }, 200);
    }
    
    $rootScope.bulk_actions_change = function($status) {


       if($status == null ||  $status == '' || $status == undefined) /// if no action is selected then do nothing
       {
            return false;
       }
       var massage = '';
       var status = '';
       $timeout(function () //setting timeout for update of element scope
       {   
           $rootScope.checkAll = false;
           $rootScope.check_count = 0;
           $rootScope.ids = [];
           
           angular.forEach($rootScope.selected_record, function(index,val){ // selected_record is ng-model name of checkbok
                if(index) // counting checked checkbox
                {
                    //$scope.ids[val] = val;
                    $rootScope.ids.push(val);
                    $rootScope.check_count++;
                }
           });  

           if($rootScope.check_count == 0)
           {
                bootbox.alert("Please select checkbox(s).", function() {
                });
                return false;
           }
           else
           {
                
               if($status =='act')
               {
                    massage = 'active';
                    status = '0';
               }
               if($status =='inact')
               {
                    massage = 'inactive';
                    status = '1';
               }
               if($status =='del')
               {
                    status = 'deleted';
                    massage = 'delete';
               }
               
               var row_count = 0;
               bootbox.confirm("Are you sure you want to "+massage+" these record(s)?", function(result) {
                if(result == true)
                {
                  var responsePromise = $http.post(GLOBAL.API_URL+'email_templates/bulk-actions',{'id':$rootScope.ids,'action':status});
                   responsePromise.success(function(data, status1, headers, config) {

                        angular.forEach($rootScope.records, function(val){ // selected_record is ng-model name of checkbok

                                if($rootScope.selected_record[val.id] == true)
                                {
                                    row_count = parseInt(row_count) + 1;
                                    val.i_status = $.trim(data);
                                    if(status =='deleted') // user choose action delete at that time hidding that rows from table
                                    {
                                        $rootScope.ApplicantRow[val.id] = true;
                                    }
                                    $rootScope.selected_record[val.id] = false;
                                }
                        }); 
                        $scope.bulk_actions = '';
                        if($status =='del')
                        {
                            PaginationService.loading(GLOBAL.API_URL+"email_templates","v_template_title"); 
                        }
                        if($status =='act')
                        {
                           // PaginationService.loading(GLOBAL.API_URL+"faqs","v_title"); 
                           $rootScope.success_msg = 'Activated successfully';
                            setTimeout(function(){
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                            },500);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                        if($status =='inact')
                        {
                           // PaginationService.loading(GLOBAL.API_URL+"faqs","v_title"); 
                           $rootScope.success_msg = 'Inactivated successfully';
                            setTimeout(function(){
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                            },500);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                        //$rootScope.check_count = 0;
                        $rootScope.selected_record ='';
                        
                        angular.element('.checker').find('.checked').removeClass('checked');
                        
                   });
               }else
               {
                    $rootScope.check_count = 0;
                    $scope.check_all(false,true);
                    angular.element('.checker').find('.checked').removeClass('checked');
                    $rootScope.bulk_actions = '';
                    $scope.bulk_actions = '';
               }
              
           });
            }
        });
    }
    /* Begin view form */
    $rootScope.frm_view_open = function(items){
        var index = $rootScope.items.indexOf(items);
        $rootScope.view_data = items;
               
        $rootScope.prev_record = false;   
        $rootScope.nexts_record = false;
        /*$rootScope.search_form = true;
        $rootScope.html_entity = '&quot;12.10 On-Going Submission of &quot;&quot;Made Up&quot;&quot; Samples.&quot;';*/

        if($rootScope.items.length == 1) // record per page is 1 then hidding next and previous buttons
        {
            $rootScope.prev_record = true;   
            $rootScope.nexts_record = true;
        }
        if(index ==0) // if user on first record hidding the previous button
        {
            $rootScope.prev_record = true;   
        }
        if((index+1) == $rootScope.items.length) // if user on last record hidding next button
        {
            $rootScope.nexts_record = true;
        }
    }
    
    //function to show previous record on view record detail block
    $rootScope.previous_record = function(view_data) {
        var index = ( parseInt($rootScope.items.indexOf(view_data)) - 1); // getting current index from json array
        
        if(index >= 0)
        {
            angular.forEach($rootScope.items, function(value, key) {
                if(key == index)
                {
                    $rootScope.view_data = value;
                }
            });   
            if(index == 0) // if on first record hidding previous button
            {
                $rootScope.prev_record = true;
                $rootScope.nexts_record = false; 
            }
            else
            {
                $rootScope.prev_record = false;   
                $rootScope.nexts_record = false; 
            }
        }
    }
    //function to show next record on view record detail block
    $rootScope.next_record = function(view_data) {
        var index = ( parseInt($rootScope.items.indexOf(view_data)) + 1); // getting current index from json array
        
        if(index <= ($rootScope.items.length-1))
        {
            angular.forEach($rootScope.items, function(value, key) {
                if(key == index)
                {
                    $rootScope.view_data = value;
                }
            });   
            if(index == ($rootScope.items.length-1)) // if on last record hidding previous button
            {
                $rootScope.nexts_record = true;
                $rootScope.prev_record = false;   
            }
            else
            {
                $rootScope.nexts_record = false;  
                $rootScope.prev_record = false;    
            }
        } 
        
    }
    /* End view form */
    
    /* Clear form data */
    $rootScope.clearFormData = function(){
        angular.forEach($rootScope.items, function(value, key) {
            if(value.id == $rootScope.edit_original_data.id)
            {
                $rootScope.items[key] = $rootScope.edit_original_data;
            }
        }); 
        $rootScope.add_fields = {};
        angular.element('.checkboxes').uniform();
        angular.element('#addModal').modal('hide');
        angular.element('#editModal').modal('hide');
        angular.element('#viewModal').modal('hide');
    };
    
    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"email_templates","v_template_title");        
    });
    
});