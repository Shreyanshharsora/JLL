'use strict';
app.controller('HomePageContentController', function($filter,$rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $state, $stateParams) {
    $rootScope.checkValueExist = ['1','2','3','4'];
    $rootScope.edit_fields = {};
    $rootScope.success_msg ='';
    $rootScope.image_type = 'Existing';
    $rootScope.image_type_grid = 'Existing';
    $rootScope.selected_record = {};
	$rootScope.image_remove=0;
    $rootScope.basicCheckValue=0;
    $rootScope.selectedType = '';
    $rootScope.videoThumbnail='';
    $rootScope.items={};
    
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
        PaginationService.loading(GLOBAL.API_URL+"home-page-content","v_box_no",'asc');
    });
    
    
    /*Export to  excel*/
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

        window.location.href = GLOBAL.API_URL+'home-page-content/export/'+$scope.someModelSerialized;
    }
    
    if($stateParams.id != "" && $stateParams.id != undefined) {
        if(mySharedService.edit_fields != undefined) {
            $rootScope.frm_edit_open(mySharedService.edit_fields);
        } else {
            var responsePromise = $http.post(GLOBAL.API_URL+"home-page-content/data/"+$stateParams.id);
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
    
    /* Begin edit form */
    $rootScope.frm_edit_open = function(item)
    {
        $rootScope.selectedType= item.v_video != "" ?'Video':'Image';
        $rootScope.videoThumbnail = item.v_video !="" ? GLOBAL.SITE_URL+GLOBAL.HOME_PAGE_CONTENT_VIDEO+ item.v_video_thumbnail:'';
        if(item.e_status == true)
        {
            item.e_status = '1';
        }
        if(item.e_status == false)
        {
            item.e_status = '0';
        }
        
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
            if( $scope.edit_fields.v_image != '')
            {
                $rootScope.enableCrop = true;
                $scope.$parent.$apply();
                $rootScope.imageDataURI = GLOBAL.SITE_URL+GLOBAL.HOME_PAGE_CONTENT_IMAGE+ $scope.edit_fields.v_image;
                $rootScope.imageName =  $scope.edit_fields.v_image;    
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
            $rootScope.image_type = "New";
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
                            $rootScope.edit_fields.v_image = evt.target.result;   
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
        $rootScope.removeImage = function() {
            $rootScope.enableCrop = false;
            $scope.validImage = 1;
            $rootScope.imageDataURI='';
            $rootScope.edit_fields.v_image = '';
            angular.element("#fileInput").val(""); 
        }
        
        
        /* For background grid image */
        $timeout(function()
        {
            if( $scope.edit_fields.v_image != '') {
                $rootScope.enableCropGrid = true;
                $scope.$parent.$apply();
                $rootScope.imageDataURIGrid = GLOBAL.SITE_URL+GLOBAL.HOME_PAGE_CONTENT_IMAGE+ $scope.edit_fields.v_image;
                $rootScope.imageNameGrid =  $scope.edit_fields.v_image;    
            } else {
                $rootScope.enableCropGrid = false;
                $scope.$parent.$apply();
                $rootScope.imageDataURIGrid = '';
                $rootScope.imageNameGrid = '';
            }
            
        },100);
        
        var handleFileSelectGrid = function(evt) 
        {     

            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
                var img = new Image(); 
                var data = evt.target.result;
                img.src = data; 
                img.onload = function(){
                    var width = this.width;
                    var height = this.height;
                    $scope.$apply(function($scope) {
                        if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0) {
                            if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                                //if(width > 40){
                                    $rootScope.validImageGrid = 1;
                                    $rootScope.image_type_grid = "New";
                                    $rootScope.enableCropGrid = true;
                                    angular.element('#img_preview_edit_grid').attr('src',evt.target.result);
                                    angular.element('#img_preview_edit_grid').show();
                                    $rootScope.imageDataURIGrid = evt.target.result;  
                                    $rootScope.edit_fields.v_image = evt.target.result;  
                                    var ctx ="";
                                    /* To convert transperent image */
                                    setTimeout(function(){
                                        $('#canvas1').show();
                                        document.getElementById("canvas1").height = document.getElementById("img_preview_edit_grid").height;
                                        document.getElementById("canvas1").width = document.getElementById("img_preview_edit_grid").width;
                                        
                                        var canvas1 = document.getElementById("canvas1");
                                        var img = document.getElementById("img_preview_edit_grid");
                                        var ctx = canvas1.getContext("2d");
                                        ctx.drawImage(img,0,0);            
                                        var imgData = ctx.getImageData(0, 0, canvas1.width, canvas1.height);            
                                        ctx.putImageData(adjustImage(imgData), 0, 0);
                                        
                                        $('#transparent_background_image').val(canvas1.toDataURL("image/png"));   
                                        $('#canvas1').hide();             
                                 },200);
//                                } else {
//                                    $scope.validImage = 0;
//                                    bootbox.alert('Image width must be greater than 400px');
//                                }
                            } else {
                                $rootScope.validImageGrid = 0;
                                //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                            }
                        } else {
                            $rootScope.validImageGrid = 0;  
                            bootbox.alert('Please upload valid image.');                                              
                        }
                    });
                };
            };
            reader.readAsDataURL(file); 
        };
        
        angular.element("#fileInputGrid").on('change',handleFileSelectGrid);
        
        $rootScope.removeImageGrid = function() {
            $rootScope.image_type_grid = 'Existing';
			$rootScope.image_remove=1;
            var canvas1 = document.getElementById("canvas1");
            var ctx = canvas1.getContext("2d");
            ctx.clearRect (0,0,canvas1.width,canvas1.height );
            angular.element('#transparent_background_image').val('');
            $rootScope.enableCropGrid = false;
            $rootScope.validImageGrid = 1;
            $rootScope.imageDataURIGrid='';
            $rootScope.edit_fields.v_image = '';
            angular.element("#fileInputGrid").val(""); 
        }
        /* End for background grid image */
        
        /* Initialize ckeditor and set value in editor */   
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
    }
    
    /* For view skyline page*/
    $rootScope.loadEditData = function(item){
        $rootScope.edit_fields = item;
        mySharedService.edit_fields = $rootScope.edit_fields; 
        $state.go('/home-content-edit',{id: item.id});
    }
    
    $rootScope.submit_frm_edit = function(edit_fields){
        edit_fields['image_type_grid'] = $rootScope.image_type_grid;
        edit_fields['image_remove'] = $rootScope.image_remove;
        edit_fileds['selectedType']=$rootScope.selectedType;
        if(angular.element('#transparent_background_image').val() != ''){
            edit_fields['transparent_background_image'] = angular.element('#transparent_background_image').val();            
        } else {
            edit_fields['transparent_background_image'] = '';
        }
        
        setTimeout(function(){
            if(form_valid('#frmEdit',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services            
                PaginationService.submit_edit_form_data(GLOBAL.API_URL+"home-page-content/edit", edit_fields, '/home-content');
                // To clear form elements
                setTimeout(function(){
                    /*angular.copy({}, edit_fields);
                    $rootScope.$apply();*/
                    $rootScope.success_msg = 'Record update successfully.';
                    angular.element('.alert').hide();
                    angular.element('.alert-success').fadeIn(1000);
                    angular.element('.alert-success').fadeOut(2000);
                    angular.element('div.loading').addClass('hide');
                },1000);
            }    
        },500);            
    }
    /* End edit form */
    
    /*Enable checkbox button*/
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
    
     /* Delete City */
    $scope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                $rootScope.success_msg = 'Record delete successfully.';
                angular.element('.alert-success').fadeIn(500);
                PaginationService.delete_data(GLOBAL.API_URL+"home-page-content/delete",id);
                setTimeout(function(){
                    $rootScope.$apply();
                    setTimeout(function(){
                        angular.element('.alert-success').fadeOut(2000);
                    },1000);
                },500);
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
                    var responsePromise = $http.post(GLOBAL.API_URL+'home-page-content/bulk-actions',{'id':$rootScope.ids,'action':$status});
                    responsePromise.success(function(data, status1, headers, config) {
                        if(data == "1"){
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
                        }
						PaginationService.loading(GLOBAL.API_URL+"home-page-content","updated_at");
						
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
	
	/* Clear form data */
    $scope.clearFormData = function($page){

        if($page == 'edit'){
            bootbox.confirm("Updated information will discard. Are you sure you want to continue?", function(result) {
                if(result == true)

                    $state.go('/home-content');
            });
        }else{
            $state.go('/home-content');

        }
    };
    
});

app.controller('HomePageAddContentController', function($filter,$rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $state, $stateParams) {
    
    $rootScope.add_fields = {};
    $scope.$on('$viewContentLoaded', function() {
      
        //For Image
        $rootScope.enableCrop = false;
        $rootScope.add_fields.v_image= '';
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
                            $rootScope.add_fields.v_image = evt.target.result;   
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
            $rootScope.enableCrop = false;
            $scope.validImage = 1;
            $rootScope.add_fields.v_image = '';
            angular.element("#fileInput").val(""); 
        }
        
        $rootScope.enableCropGrid = false;
        $rootScope.add_fields.v_image = '';
        $scope.validImageGrid = 1;
        
        var handleFileSelectGrid = function(evt) 
        {     
            $scope.image_type = "New";
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
                var img = new Image(); 
                var data = evt.target.result;
                img.src = data; 
                img.onload = function(){
                    var width = this.width;
                    var height = this.height;
                    $scope.$apply(function($scope) {
                        if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0) {
                            if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                                //if(width > 40){
                                    $scope.validImageGrid = 1;
                                    $rootScope.enableCropGrid = true;
                                    angular.element('.fileinput-preview-gird').find('img').attr('src',evt.target.result);
                                    angular.element('.fileinput-preview-gird').show();
                                    //$scope.imageDataURI = evt.target.result;  
                                    $rootScope.add_fields.v_image = evt.target.result;  
                                    var ctx ="";
                                    /* To convert transperent image */
                                    setTimeout(function(){
                                        $('#canvas1').show();
                                        document.getElementById("canvas1").height = document.getElementById("img2").height;
                                        document.getElementById("canvas1").width = document.getElementById("img2").width;
                                        
                                        var canvas1 = document.getElementById("canvas1");
                                        var img = document.getElementById("img2");
                                        var ctx = canvas1.getContext("2d");
                                        ctx.drawImage(img,0,0);            
                                        var imgData = ctx.getImageData(0, 0, canvas1.width, canvas1.height);            
                                        ctx.putImageData(adjustImage(imgData), 0, 0);
                                        
                                        $('#transparent_background_image').val(canvas1.toDataURL("image/png"));   
                                        $('#canvas1').hide();             
                                    },100);
                              //  } else {
//                                    $scope.validImage = 0;
//                                    bootbox.alert('Image Width must be greater than 400px');
//                                }
                            } else {
                                $scope.validImageGrid = 0;
                                //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                            }
                        } else {
                            $scope.validImageGrid = 0;  
                            bootbox.alert('Please upload valid image.');                                              
                        }
                    });
                };
            };
            reader.readAsDataURL(file); 
        };
        
        angular.element(document.querySelector('#fileInputGrid')).on('change',handleFileSelectGrid);
               
        $rootScope.removeImageGrid = function() {

            $('#transparent_background_image').val(''); 
            $rootScope.enableCropGrid = false;
            $scope.validImageGrid = 1;
            $rootScope.add_fields.v_image = '';
            angular.element("#fileInputGrid").val(""); 
        }
        
    }); 
    
     /* Clear form data */
    $scope.clearFormData = function($page){
        $state.go('/home-content');
    };
    
    $scope.submit_frm_add = function(add_fields,button_pressed){
        add_fields['transparent_background_image'] = angular.element('#transparent_background_image').val();
        setTimeout(function(){
            if(form_valid('#frmAdd',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services
                if(button_pressed == 'New'){
                    PaginationService.submit_add_form_data(GLOBAL.API_URL+"home-page-content/add", add_fields);
                } else {
                    PaginationService.submit_add_form_data(GLOBAL.API_URL+"home-page-content/add", add_fields, '/home-content');
                }
                
                $rootScope.success_msg = 'Record add successfully';
                // To clear form elements
                setTimeout(function(){
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