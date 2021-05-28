'use strict';
app.controller('CmsController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    
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
    $rootScope.SITE_URL = GLOBAL.SITE_URL;
    
    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"cms","updated_at");
        
        
    });
    
    /* For cms images */
    $rootScope.trigger = function(elem) {
        $(elem).trigger('click');
    };
    
    var handleFileSelect = function(evt) 
    {  
        $rootScope.image_type = "New";
        var files = evt.currentTarget.files;
        for (var i = 0; i < files.length; i++) {
            var file = evt.currentTarget.files[i];
            var file_name = evt.currentTarget.files[i].name;
            var reader = new FileReader();
            reader.onload = function (event) {
                $('#uploaded_images').append('<div class="cms_images"><img class="images_name" src="'+event.target.result+'" width="100px" ><div class="col-md-2 images_text"><input type="hidden" class="form-control images_text image_data" name="images[]" value="'+event.target.result+'" /><input type="hidden" class="image_type" name="image_type[]" value="New" /><input type="text" class="form-control images_text image_title required" data-error-message="image title" placeholder="Title of Image" maxlength="20" name="images_text[]" value="" /></div><a href="javascript:;" class="images_delete">Remove</a></div><div class="clear"></div>');
                file_name = '';
            };
            reader.readAsDataURL(file);
        }
    };
    
    
    if($(".ie9").length == 1) 
    {
        angular.element(document.querySelector('#fileInput')).on('change',function() 
        { 
            options = {iframe: 'iframer_iframe', returnType: 'html',
    			onComplete: function(responseText) {
    			    alert(responseText);
		            responseText = $.trim(responseText);
                    if (responseText != '0') {
                        $timeout(function()
                        {
        					$scope.$apply(function($scope)
                            {
                                if (responseText.toLowerCase().indexOf("data:image/png;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/gif;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/jpeg;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/tmp;base64") >= 0)
                                {
                                    $('#uploaded_images').append('<div class="cms_images"><img class="images_name" src="'+responseText+'" width="100px" ><div class="col-md-2 images_text"><input type="hidden" class="form-control images_text image_data" name="images[]" value="'+responseText+'" /><input type="hidden" class="image_type" name="image_type[]" value="New" /><input type="text" class="form-control images_text image_title required" data-error-message="image title" placeholder="Title of Image" maxlength="20" name="images_text[]" value="" /></div><a href="javascript:;" class="images_delete">Remove</a></div><div class="clear"></div>');
                                }
                                else
                                {
                                    //$scope.error_message = GlobalVariables.INVALID_IMAGE_EXTENSION;                                        
                                }                                                 
                            });
                            $('form')[0].reset();
                        },500);
    				} else {
    				   alert(responseText); //error messages will displayed here
                       return false;
    				}
    			}
    		};
    		$scope.iframer(options, '#form_name'); //submitting file                
        });
    } else {
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    }
    
    // For ie9 upload and crop functionality
    $scope.iframer = function (options, formID){
        options = $.extend({
    	},{
    		iframe: 'iframer_iframe',
    		returnType: 'html',
    		onSubmit: function()
    		{
    			return false;
    		},
    		onComplete: function()
    		{
    		}
    	}, options);
        
    	var $theframe = $('<iframe name=' + options.iframe + ' id="' + options.iframe + '" width="0" height="0" frameborder="0" style="border: none; display: none; visibility: hidden;"></iframe>');
    	angular.element(formID).append($theframe).attr('target', options.iframe);
    	angular.element(formID).submit();
    	angular.element('#' + options.iframe).load(function()
    	{
    		var data = $('#' + options.iframe).contents().find('body').html();
    		if (options.returnType.toLowerCase() == 'json') eval('data=' + data);
    		options.onComplete(data);
    		angular.element('#' + options.iframe).contents().find('body').html('').empty();
    		angular.element('#' + options.iframe).unbind('load');
    	});
    	return true;
    }
    /* End for cms images */
    
    if($stateParams.id != "" && $stateParams.id != undefined)
    {
        if(mySharedService.edit_fields != undefined) {
            $rootScope.frm_edit_open(mySharedService.edit_fields);
        } else {
            var responsePromise = $http.post(GLOBAL.API_URL+"cms/data/"+$stateParams.id);
            responsePromise.success(function(data, status1, headers, config) 
            {
                if(data.items != "" && data.items != undefined)
                {
                    $timeout(function()
                    {
                        $rootScope.items = data.items;
                        $rootScope.edit_fields = angular.fromJson($rootScope.items);
                        
                        if($rootScope.edit_fields.v_images != ''){
                            $rootScope.edit_fields.v_images = $.parseJSON($rootScope.edit_fields.v_images);
                        }
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
        
        window.location.href = GLOBAL.API_URL+'cms/export/'+$scope.someModelSerialized;
    }
    
    $scope.frm_add_open = function(parent_items){
        angular.element('.alert').hide();
        $("#frmAdd .form-group").removeClass('has-error');
        $("#frmAdd .required").removeAttr('style');
        $("#frmAdd .help-block-error").remove();
        angular.element('.add_e_status').select2('val', 'Active');
    }
    
    /* Begin edit form */
    $rootScope.loadEditData = function(item){
        $rootScope.edit_fields = item;
        mySharedService.edit_fields = $rootScope.edit_fields; 
        //$rootScope.$broadcast($rootScope.edit_fields1);
        $state.go('/cms-edit',{id: item.id});
    }
    
    /* Begin edit form */
    $rootScope.frm_edit_open = function(item)
    {
        if(item.status == true)
        {
            item.status = '1';
        }
        if(item.status == false)
        {
            item.status = '0';
        }
        angular.element('.alert').hide();
        $rootScope.edit_fields = item;
        
        if(typeof($rootScope.edit_fields.v_images) != 'object'){
            if($rootScope.edit_fields.v_images != ''){
                $rootScope.edit_fields.v_images = $.parseJSON($rootScope.edit_fields.v_images);
            }
        }
        
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        
        /* Set dropdown values */
        $scope.edit_fields.e_status = item.e_status;
        $scope.edit_fields.e_title = item.e_title;
        
        /* Initialize ckeditor and set value in editor */   
        CKEDITOR.instances = { };
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        CKEDITOR.replace('cms_content_editor_edit');
        CKEDITOR.instances['cms_content_editor_edit'].setData(item.v_answer);
    }
    
    $rootScope.submit_frm_edit = function(edit_fields){
        setTimeout(function(){
            if(form_valid('#frmEdit',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                edit_fields['images'] = [];
                var i = 0;
                angular.forEach(angular.element('.cms_images'), function(val, key){
                    edit_fields['images'][i] = {};
                    edit_fields['images'][i]['image_title'] = angular.element(val).find('.image_title').val();
                    edit_fields['images'][i]['image_data'] = angular.element(val).find('.image_data').val();
                    edit_fields['images'][i]['image_type'] = angular.element(val).find('.image_type').val();
                    i++
                });
                
                //Call submit data services
                $scope.files = [];
                angular.forEach(angular.element('.dz-preview img'), function(value, key){
                    $scope.files.push(angular.element(value).attr('src'));
                });
                
                edit_fields['files'] = $scope.files;           
                edit_fields['t_content'] = angular.element('#cms_content_editor_edit').val();
                PaginationService.submit_edit_form_data(GLOBAL.API_URL+"cms/edit", edit_fields, '/cms');
                $rootScope.success_msg = 'Record update successfully.';
                // To clear form elements
                setTimeout(function(){
                    angular.element('.alert-success').fadeIn(1000);
                    angular.element('.alert-success').fadeOut(2000);
                    angular.element('.alert').hide();
                    angular.element('div.loading').addClass('hide');
                },1000);
            }    
        },500);            
    }
    /* End edit form */
    
    $rootScope.data_active_inactive = function(item){
        
        $timeout(function() {
            PaginationService.change_active_inactive(GLOBAL.API_URL+"users/change-status", item.id, item.e_status);
            if(item.e_status == 'Active'){
                item.e_status = 'Inactive';
            } else {
                item.e_status = 'Active';
            }
        }, 500);
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

           if($scope.check_count == $scope.items.length)
           {
                $scope.selected_record[0] = true;
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
                  var responsePromise = $http.post(GLOBAL.API_URL+'cms/bulk-actions',{'id':$rootScope.ids,'action':$status});
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
    
    /* Delete Page */
    $rootScope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                $rootScope.success_msg = 'Record delete successfully.';
                PaginationService.delete_data(GLOBAL.API_URL+"cms/delete",id);
                setTimeout(function(){
                    $rootScope.$apply();
                    angular.element('.alert-success').fadeIn(500);
                    setTimeout(function(){
                        angular.element('.alert-success').fadeOut(3000);
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
                
                    $state.go('/cms');
            });
        }else{
            $state.go('/cms');
        }
    };
    $scope.urlGenerate = function($event){
        $rootScope.edit_fields.v_slug = $($event.target).val().toLowerCase().replace(/[^a-zA-Z0-9-]/g,"-");
        $("#SlugUrlLink").html(SITE_URL+$rootScope.edit_fields.v_slug+"/");
    }
});


//Cms Add Controller
'use strict';
app.controller('CmsAddController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    $rootScope.SITE_URL = GLOBAL.SITE_URL;
    $rootScope.add_fields = {};
    $rootScope.add_fields.e_page_type='Parent';
            
    $scope.$on('$viewContentLoaded', function() {
        CKEDITOR.instances = { };
        CKEDITOR.replace('cms_content_editor');
        CKEDITOR.instances['cms_content_editor'].setData('');
        /* For image upload */
        var handleFileSelect = function(evt) 
        {  
            $rootScope.image_type = "New";
            var files = evt.currentTarget.files;
            for (var i = 0; i < files.length; i++) {
                var file = evt.currentTarget.files[i];
                var file_name = evt.currentTarget.files[i].name;
                var reader = new FileReader();
                reader.onload = function (event) {
                    $('#uploaded_images').append('<div class="cms_images"><img class="images_name" src="'+event.target.result+'" width="100px" ><div class="col-md-2 images_text"><input type="hidden" class="form-control images_text image_data" name="images[]" value="'+event.target.result+'" /><input type="text" class="form-control images_text image_title required" data-error-message="image title" placeholder="Title of Image" name="images_text[]" value="" /></div><a href="javascript:;" class="images_delete">Remove</a></div><div class="clear"></div>');
                    file_name = '';
                };
                reader.readAsDataURL(file);
            }
            
            /*var file=evt.currentTarget.files[0];
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
                            $rootScope.edit_fields.v_image_url = evt.target.result;   
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
            reader.readAsDataURL(file); */
        };
        
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    });
    
    
    $rootScope.trigger = function(elem) {
        $(elem).trigger('click');
    };
    /*$rootScope.removeImage = function() {
        $rootScope.enableCrop = false;
        $scope.validImage = 1;
        $rootScope.imageDataURI='';
        $rootScope.edit_fields.v_image_url = '';
        angular.element("#fileInput").val(""); 
    }*/
    
    /* For image upload */
    
    $scope.submit_frm_add = function(add_fields,button_pressed){
        CKEDITOR.instances['cms_content_editor'].updateElement();
        add_fields['t_content'] = angular.element('#cms_content_editor').val();
        
        add_fields['images'] = [];
        var i = 0;
        angular.forEach(angular.element('.cms_images'), function(val, key){
            add_fields['images'][i] = {};
            add_fields['images'][i]['image_title'] = angular.element(val).find('.image_title').val();
            add_fields['images'][i]['image_data'] = angular.element(val).find('.image_data').val();
            i++
        });
        
        setTimeout(function(){
            if(form_valid('#frmAdd',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services
                if(button_pressed == 'New'){
                        PaginationService.submit_add_form_data(GLOBAL.API_URL+"cms/add", add_fields);
                        CKEDITOR.instances['cms_content_editor'].setData('');
                } else {
                    PaginationService.submit_add_form_data(GLOBAL.API_URL+"cms/add", add_fields, '/cms');
                }
                
                $rootScope.success_msg = 'Record add successfully.';
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
    
    /* Clear form data */
    $scope.clearFormData = function(){
        $state.go('/cms');
    };
    
    $scope.urlGenerate = function($event){
        $rootScope.add_fields.v_slug = $($event.target).val().toLowerCase().replace(/[^a-zA-Z0-9-]/g,"-");
        $("#SlugUrlLink").html(SITE_URL+$rootScope.add_fields.v_slug+"/");
    }
});


$('#city').on('blur','#v_slug', function(){
    var curr_obj = $(this);
    var v_slug = curr_obj.val();
    var rel_id = curr_obj.attr('rel');
    var url = API_URL+'city/check-url-exist';
    $.post( url, { v_slug: v_slug, id: rel_id }).done(function( data ) {
        if($.trim(data) == 'TRUE'){
            curr_obj.addClass('duplicate-error');
        } else {
            curr_obj.removeClass('duplicate-error');
            $('.alert-danger').hide();
        }
    });
});
       