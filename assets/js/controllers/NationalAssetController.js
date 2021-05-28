'use strict';
app.controller('NationalAssetController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
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
    $rootScope.items = {};
    
    $scope.$on('$viewContentLoaded', function() {
        $('.fancybox-thumbs').fancybox({
                closeBtn  : true,
                arrows    : true,
                nextClick : true,

                helpers : {
                    thumbs : {
                        width  : 50,
                        height : 50
                    }
                }
        });
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"national-asset","updated_at");
    });
        
    if($stateParams.id != "" && $stateParams.id != undefined)
    {
        if(mySharedService.edit_fields != undefined) {
            $rootScope.frm_edit_open(mySharedService.edit_fields);
        } else {
            var responsePromise = $http.post(GLOBAL.API_URL+"national-asset/get-edit-record/"+$stateParams.id);
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
        
        window.location.href = GLOBAL.API_URL+'national-asset/export/'+$scope.someModelSerialized;
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
        $state.go('/national-asset-edit',{id: item.id});
    }
    
    /* Begin edit form */
    $rootScope.frm_edit_open = function(item)
    {
        var successData = $http.post(GLOBAL.API_URL+'national-asset/edit');
        successData.success(function(data, status, headers, config){
            $rootScope.country = data;
        });
        
        angular.element('.alert').hide();
        $rootScope.edit_fields = item;
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        $('.dropzone').show();
         /* Set dropdown values */
        $scope.edit_fields.e_status = item.e_status;
        
         $timeout(function()
        {
            if( $scope.edit_fields.v_thumbnail_url != '')
            {
                $rootScope.enableCrop = true;
                $scope.$parent.$apply();
                $rootScope.imageDataURI = GLOBAL.SITE_URL+GLOBAL.NATIONAL_ASSET_IMAGE_PATH+ $scope.edit_fields.v_thumbnail_url;
                $rootScope.imageName =  $scope.edit_fields.v_thumbnail_url;    
            }else
            {
                $rootScope.enableCrop = false;
                $scope.$parent.$apply();
                $rootScope.imageDataURI = '';
                $rootScope.imageName = '';
            }
            
        },100);
        var handleFileSelect = function(evt) 
        {     
            $scope.image_type = "New";
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
                
                $scope.$apply(function($scope) {
                    if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0) {
                        if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                            $rootScope.validImage = 1;
                            $rootScope.enableCrop = true;
                            angular.element('.fileinput-preview').find('img').attr('src',evt.target.result);
                            angular.element('.fileinput-preview').show();
                            $rootScope.imageDataURI = evt.target.result;  
                            $rootScope.edit_fields.v_thumbnail_url = evt.target.result;   
                        } else {
                            $scope.validImage = 0;
                            //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                        }
                    } else {
                        $scope.validImage = 0;  
                        //$scope.error_message = GLOBAL.INVALID_IMAGE_EXTENSION;                                               
                    }
                });
            };
            reader.readAsDataURL(file); 
        };
        
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        
        
        $rootScope.trigger = function(elem) {
            $(elem).trigger('click');
        };
        
        /* Initialize ckeditor and set value in editor */   
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        
        CKEDITOR.instances = { };
        CKEDITOR.replace( 'national_asset_content_editor', {
        	toolbar: [
        		['Source','-','Bold','Italic','Underline','-','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','-','Link','Unlink','-', 'Image', 'Flash', 'Iframe' ],
                   '/',
        	]
        });
        CKEDITOR.instances['national_asset_content_editor'].setData(item.t_skyline_body);
        
    }
    
    $rootScope.submit_frm_edit = function(edit_fields){
        setTimeout(function(){
            if(form_valid('#frmEdit',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services     
                edit_fields['t_content'] = angular.element('#national_asset_content_editor').val();       
                PaginationService.submit_edit_form_data(GLOBAL.API_URL+"national-asset/edit", edit_fields, '/national-asset');
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
    
    $scope.enable_button = function(){
        $timeout(function () //setting timeout for update of element scope
       {   
           $scope.checkAll = false;
           $scope.check_count = 0;
           $scope.ids = [];
           
           angular.forEach($rootScope.selected_record, function(index,val){ // selected_record is ng-model name of checkbok

                if(index){
                    if(val == '0' )
                    {
                        $rootScope.selected_record[0] = false;
                    }
                    else // counting checked checkbox
                    {
                        $scope.ids.push(val);
                        $scope.check_count++;
                    }
                }
           });

           if($scope.check_count == $scope.items.length)
           {
                $rootScope.selected_record[0] = true;
           }  
           if($scope.check_count == 0)
           {
                $scope.button_show = false;
           }
           else
           {
                $scope.button_show = true;
            }
        }); 
    }
    
    $scope.enable_button = function(){
        $timeout(function () //setting timeout for update of element scope
       {   
           $scope.checkAll = false;
           $scope.check_count = 0;
           $scope.ids = [];
           
           angular.forEach($scope.selected_record, function(index,val){ // selected_record is ng-model name of checkbok
                if(index){
                    if(val == '0' )
                    {
                        $scope.selected_record[0] = false;
                    }
                    else // counting checked checkbox
                    {
                        $scope.ids.push(val);
                        $scope.check_count++;
                    }
                }
           });
           if($scope.check_count == $rootScope.items.length)
           {
                angular.element(".group-checkable").parent("span").addClass("checked");
                $scope.selected_record[0] = true;
           }
           else
           {
                angular.element(".group-checkable").parent("span").removeClass("checked");
                $scope.selected_record[0] = false;
           }  
           
        }); 
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
                $scope.bulk_actions = '';
                return false;
           }
           else
           {
                
               if($status =='act')
               {
                    massage = 'active';
                    //status = '0';
               }
               if($status =='inact')
               {
                    massage = 'inactive';
                    //status = '1';
               }
               if($status =='del')
               {
                    //status = 'deleted';
                    massage = 'delete';
               }
               
               var row_count = 0;
               bootbox.confirm("Are you sure you want to "+ massage+" selected record?", function(result) {
                if(result == true)
                {
                    angular.forEach($rootScope.ids, function(val){
                        if(massage == 'inactive')
                        {
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').removeClass('bootstrap-switch-on');
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').addClass('bootstrap-switch-off');
                        }
                         if(massage == 'active')
                        {
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').removeClass('bootstrap-switch-off');
                            angular.element('#tablerow'+val).find('.bootstrap-switch-wrapper').addClass('bootstrap-switch-on');
                        }
                        
                        if(massage == 'delete')
                        {

                            angular.element('#tablerow'+val).fadeOut('2000');
                            
                        }
                    });
                  var responsePromise = $http.post(GLOBAL.API_URL+'national-asset/bulk-actions',{'id':$rootScope.ids,'action':$status});
                   responsePromise.success(function(data, status1, headers, config) {
                        /*angular.forEach($rootScope.items, function(val){ // selected_record is ng-model name of checkbok

                                if($rootScope.selected_record[val.id] == true)
                                {
                                    row_count = parseInt(row_count) + 1;
                                    val.i_status = $.trim(data);
                                    if(status =='deleted') // user choose action delete at that time hidding that rows from table
                                    {
                                       // $rootScope.ApplicantRow[val.id] = true;
                                    }
                                    $rootScope.selected_record[val.id] = false;
                                }
                        }); */
                        $scope.bulk_actions = '';
                        if($status =='del')
                        {
                            $rootScope.success_msg = 'Record(s) delete successfully.';
                            setTimeout(function(){
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                            },500);
                            $("html, body").animate({ scrollTop: 0 }, "slow");                            
                        }
                        if($status =='act')
                        { 
                            $rootScope.success_msg = 'Record(s) active successfully.';
                            setTimeout(function(){
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                            },500);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                        if($status =='inact')
                        { 
                            $rootScope.success_msg = 'Record(s) inactive successfully.';
                            setTimeout(function(){
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                            },500);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                        $rootScope.check_count = 0;
                        $scope.check_all(false,true);
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
    
    /* Delete National Asset */
    $scope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                $rootScope.success_msg = 'Record delete successfully.';
                angular.element('.alert-success').fadeIn(500);
                PaginationService.delete_data(GLOBAL.API_URL+"national-asset/delete",id);
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
                    $state.go('/national-asset');
            });
        }else{
            $state.go('/national-asset');
                    
        }        
    };
});
app.controller('NationalAssetEditController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    /* Get order and is_default from city */
    $rootScope.get_order = function(column_id){
        if(column_id != '' && column_id != undefined){
            clearTimeout(timeoutID);
      		timeoutID = setTimeout(function() {
                $http({
                    method: 'GET',
                    url: GLOBAL.API_URL+"national-asset/national-asset-order/"+column_id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status) {
                    var order_no = data.trim();
                    if(order_no != '' && order_no > 0){
                        $rootScope.edit_fields.i_display_order = order_no;
                    }
                });
            }, 200);    
        }
    }
});
/* National Asset Add */
'use strict';
app.controller('NationalAssetAddController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    $rootScope.add_fields = {};
    
    $scope.$on('$viewContentLoaded', function() {
        CKEDITOR.instances = { };
        CKEDITOR.replace( 'national_asset_content_editor', {
        	toolbar: [
        		['Source','-','Bold','Italic','Underline','-','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','-','Link','Unlink','-', 'Image', 'Flash', 'Iframe' ],
                   '/',
        	]
        });
        CKEDITOR.instances['national_asset_content_editor'].setData('');
        
        //For Image
        $rootScope.enableCrop = false;
        $rootScope.add_fields.v_image_url = '';
        $scope.validImage = 1;
        
        var handleFileSelect = function(evt) 
        {     
            $scope.image_type = "New";
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
                
                $scope.$apply(function($scope) {
                    if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0) {
                        if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                            $scope.validImage = 1;
                            $rootScope.enableCrop = true;
                            angular.element('.fileinput-preview').find('img').attr('src',evt.target.result);
                            angular.element('.fileinput-preview').show();
                            //$scope.imageDataURI = evt.target.result;  
                            $rootScope.add_fields.v_image_url = evt.target.result;   
                        } else {
                            $scope.validImage = 0;
                            //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                        }
                    } else {
                        $scope.validImage = 0;  
                        bootbox.alert('Please upload valid image.'); 
                    }
                });
            };
            reader.readAsDataURL(file); 
        };
        
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        
        $scope.trigger = function(elem) {
            $(elem).trigger('click');
        };
        
        $rootScope.removeImage = function() {
            angular.element('.cropArea').remove();
            $rootScope.enableCrop = false;
            $scope.validImage = 1;
            $rootScope.add_fields.v_image_url = '';
            angular.element("#fileInput").val(""); 
        }
        
    }); 
    
    /* Get order and is_default from city */
    $rootScope.get_order = function(column_id){
        if(column_id != '' && column_id != undefined){
            clearTimeout(timeoutID);
      		timeoutID = setTimeout(function() {
                $http({
                    method: 'GET',
                    url: GLOBAL.API_URL+"national-asset/national-asset-order/"+column_id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status) {
                    var order_no = data.trim();
                    if(order_no != '' && order_no > 0){
                        $rootScope.add_fields.i_display_order = order_no;
                    }
                });
            }, 200);    
        }
    }
    
     /* Clear form data */
    $scope.clearFormData = function($page){
        $state.go('/national-asset');
    };
    
    $scope.submit_frm_add = function(add_fields,button_pressed){
        CKEDITOR.instances['national_asset_content_editor'].updateElement();
        add_fields['t_content'] = angular.element('#national_asset_content_editor').val();
        
        setTimeout(function(){
            if(form_valid('#frmAdd',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services
                if(button_pressed == 'New'){
                        PaginationService.submit_add_form_data(GLOBAL.API_URL+"national-asset/add", add_fields);
                        CKEDITOR.instances['national_asset_content_editor'].setData('');
                        angular.element('.cropArea').remove();
                        $rootScope.enableCrop = false;
                        $rootScope.validImage = 1;
                        angular.element("#fileInput").val(""); 
                } else {
                    PaginationService.submit_add_form_data(GLOBAL.API_URL+"national-asset/add", add_fields, '/national-asset');
                }
                
                $rootScope.success_msg = 'Record add successfully';
                // To clear form elements
                setTimeout(function(){
                     /*angular.copy({}, $rootScope.add_fields);
                     $rootScope.$apply();*/
                     angular.element('.alert-success').fadeIn(1000);
                     angular.element('.alert-success').fadeOut(2000);
                     angular.element('.select2me').select2('val', '');
                     angular.element('.alert').hide();
                     angular.element('div.loading').addClass('hide');
                },1000);
            } else {           
                $rootScope.valid_img =  1;
                return false;
            }
        },500);                
    }
    /* End add form */
});