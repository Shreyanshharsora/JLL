'use strict';
app.controller('CitiesController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
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
    $rootScope.CITIES_IMAGE_PATH = GLOBAL.CITIES_IMAGE_PATH;
    $rootScope.SITE_URL = GLOBAL.SITE_URL;
    $rootScope.image_type = 'Existing';
    $rootScope.image_type_grid = 'Existing';

    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"cities","updated_at");
    });

    if($stateParams.id != "" && $stateParams.id != undefined) {
        if(mySharedService.edit_fields != undefined) {
            $rootScope.frm_edit_open(mySharedService.edit_fields);
        } else {
            var responsePromise = $http.post(GLOBAL.API_URL+"cities/data/"+$stateParams.id);
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

        window.location.href = GLOBAL.API_URL+'cities/export/'+$scope.someModelSerialized;
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
        $state.go('/cities-edit',{id: item.id});
    }

    /* Begin edit form */
    $rootScope.frm_edit_open = function(item)
    {
        var successData = $http.post(GLOBAL.API_URL+'cities/edit');
        successData.success(function(data, status, headers, config){
            $rootScope.country = data;
        });

        if(item.i_status == true)
        {
            item.i_status = '1';
        }
        if(item.i_status == false)
        {
            item.i_status = '0';
        }
        angular.element('.alert').hide();
        $rootScope.edit_fields = item;
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        $('.dropzone').show();

        if($rootScope.edit_fields.v_download_pdf != '' && $rootScope.edit_fields.v_download_pdf != undefined){
            $rootScope.fileEnable = true;
            $rootScope.fileURL = ($rootScope.edit_fields.v_download_pdf).substring( eval(($rootScope.edit_fields.v_download_pdf).indexOf('_')+1) );
            angular.element('#v_upload_file').val($rootScope.edit_fields.v_download_pdf);
            angular.element('#old_file_name').val($rootScope.edit_fields.v_download_pdf);
        } else {
            $rootScope.fileEnable = false;
            $rootScope.fileURL = "";
            $rootScope.edit_fields.v_upload_file = '';
        }


         /* Set dropdown values */
        $scope.edit_fields.e_status = item.e_status;

        $timeout(function()
        {
            if( $scope.edit_fields.v_image_url != '')
            {
                $rootScope.enableCrop = true;
                $scope.$parent.$apply();
                $rootScope.imageDataURI = GLOBAL.SITE_URL+GLOBAL.CITIES_IMAGE_PATH+ $scope.edit_fields.v_image_url;
                $rootScope.imageName =  $scope.edit_fields.v_image_url;
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
            $rootScope.edit_fields.v_image_url = '';
            angular.element("#fileInput").val("");
        }


        /* For background grid image */
        $timeout(function()
        {
            if( $scope.edit_fields.v_background_image_url != '') {
                $rootScope.enableCropGrid = true;
                $scope.$parent.$apply();
                $rootScope.imageDataURIGrid = GLOBAL.SITE_URL+GLOBAL.CITY_BACKGROUND_IMAGE_PATH+ $scope.edit_fields.v_background_image_url;
                $rootScope.imageNameGrid =  $scope.edit_fields.v_background_image_url;
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
                                if(width == 500 && height == 350){
                                    $rootScope.validImageGrid = 1;
                                    $rootScope.image_type_grid = "New";
                                    $rootScope.enableCropGrid = true;
                                    angular.element('#img_preview_edit_grid').attr('src',evt.target.result);
                                    angular.element('#img_preview_edit_grid').show();
                                    $rootScope.imageDataURIGrid = evt.target.result;
                                    $rootScope.edit_fields.v_background_image_url = evt.target.result;
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
                                } else {
                                    $scope.validImage = 0;
                                    bootbox.alert('Please upload image of 500px X 350px.');
                                }
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

        angular.element(document.querySelector('#fileInputGrid')).on('change',handleFileSelectGrid);

        $rootScope.removeImageGrid = function() {
            $rootScope.image_type_grid = 'Existing';
            var canvas1 = document.getElementById("canvas1");
            var ctx = canvas1.getContext("2d");
            ctx.clearRect (0,0,canvas1.width,canvas1.height );
            angular.element('#transparent_background_image').val('');
            $rootScope.enableCropGrid = false;
            $rootScope.validImageGrid = 1;
            $rootScope.imageDataURIGrid='';
            $rootScope.edit_fields.v_background_image_url = '';
            angular.element("#fileInputGrid").val("");
        }
        /* End for background grid image */

        /* Initialize ckeditor and set value in editor */
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();

        //CKEDITOR.instances = { };
        /*CKEDITOR.config.toolbar = [
           ['Source','-','Bold','Italic','Underline','-','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','-','Link'],
           '/',

        ] ;
        CKEDITOR.replace('skyline_body_editor');*/
        /*CKEDITOR.replace( 'skyline_body_editor', {
        	toolbar: [
        		['Source','-','Bold','Italic','Underline','-','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','-','Link'],
                   '/',
        	]
        });
        CKEDITOR.instances['skyline_body_editor'].setData(item.t_skyline_body);*/
    }

    $rootScope.submit_frm_edit = function(edit_fields){
        edit_fields['image_type_grid'] = $rootScope.image_type_grid;
        if(angular.element('#transparent_background_image').val() != ''){
            edit_fields['transparent_background_image'] = angular.element('#transparent_background_image').val();
        } else {
            edit_fields['transparent_background_image'] = '';
        }

        setTimeout(function(){
            if(form_valid('#frmEdit',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services
                edit_fields['t_skyline_body'] = angular.element('#skyline_body_editor').val();
                edit_fields['v_upload_file'] = angular.element('#v_upload_file').val();
                edit_fields['v_download_pdf'] = edit_fields['v_upload_file'];
                PaginationService.submit_edit_form_data(GLOBAL.API_URL+"cities/edit", edit_fields, '/cities');
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

                    var responsePromise = $http.post(GLOBAL.API_URL+'cities/bulk-actions',{'id':$rootScope.ids,'action':$status});
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

    /* Delete City */
    $scope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                $rootScope.success_msg = 'Record delete successfully.';
                angular.element('.alert-success').fadeIn(500);
                PaginationService.delete_data(GLOBAL.API_URL+"cities/delete",id);
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

                    $state.go('/cities');
            });
        }else{
            $state.go('/cities');

        }
    };
    $scope.urlGenerate = function($event){
        $rootScope.edit_fields.v_slug = $($event.target).val().toLowerCase().replace(/[^a-zA-Z0-9-]/g,"-");
        $("#SlugUrlLink").html(SITE_URL+'city/'+$rootScope.edit_fields.v_slug+"/");
    }

    $("#file_upload").bind('change', function() {
        $("#file_error").html('File is uploading...');
        $("#submit-btn").prop("disabled",true);
        $("#file_error").show();
        $scope.upload_file("#form_name"); //form ID
        return false;
    });

    $scope.upload_file = function(frmId){
        angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
        var options = {
            iframe: 'iframer_iframe',
    		returnType: 'html',
    		onComplete: function(responseText)
    		{
                console.log(responseText);
                if(responseText == 'EXTENSION_ERROR') {
	               bootbox.alert('Please upload PDF file.');
    			} else if(responseText != 'FALSE') {
                    $scope.fileEnable = true;
                    $scope.fileURL = responseText.substring( eval(responseText.indexOf('_')+1) );
                    angular.element('#v_upload_file').val(responseText);
                    angular.element('#old_file_name').val(responseText);
                    angular.element("#v_upload_file_error").remove();
                    angular.element(".city-pdf-file").removeClass('has-error');
    			}
                angular.element('div.loading').addClass('hide');
                $scope.$apply();
    		}
    	};
    	$scope.iframer(options, frmId); //submitting file
    	return false;
    }

    $scope.iframer =  function(options, formID)
    {
    	var options = $.extend({
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
    	$(formID).append($theframe).attr('target', options.iframe);
    	$(formID).submit();
    	$('#' + options.iframe).load(function()
    	{
    		var data = $('#' + options.iframe).contents().find('body').html();
    		if (options.returnType.toLowerCase() == 'json') eval('data=' + data);
    		options.onComplete(data);
    		$('#' + options.iframe).contents().find('body').html('').empty();
    		$('#' + options.iframe).unbind('load');
    	});
    	return true;
    }
});

function adjustImage(iArray) {
    var imageData = iArray.data;

    for (var i = 0; i < imageData.length; i+= 4) {
        if(imageData[i] > 201 && imageData[i+1] >= 202 && imageData[i+2] >= 204){
            imageData[i+3] = 0;
        }
    }
    return iArray;
}
/* City Add */
'use strict';
app.controller('CitiesAddController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    $rootScope.add_fields = {};
    $scope.$on('$viewContentLoaded', function() {
        //CKEDITOR.instances = { };
        /*CKEDITOR.config.toolbar = [
           ['Source','-','Bold','Italic','Underline','-','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','-','Link'],
           '/',

        ] ;*/
        /*CKEDITOR.replace( 'skyline_body_editor', {
        	toolbar: [
        		['Source','-','Bold','Italic','Underline','-','NumberedList','BulletedList','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','-','Link'],
                   '/',
        	]
        });*/

        //CKEDITOR.replace('skyline_body_editor');
        //CKEDITOR.instances['skyline_body_editor'].setData('');

        $rootScope.fileEnable = false;
        $rootScope.fileURL = "";
        $rootScope.add_fields.v_upload_file = '';
        console.log($rootScope.fileEnable);

        var successData = $http.post(GLOBAL.API_URL+'cities/add');
        successData.success(function(data, status, headers, config){
            $scope.country = data;
        });

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
            $rootScope.enableCrop = false;
            $scope.validImage = 1;
            $rootScope.add_fields.v_image_url = '';
            angular.element("#fileInput").val("");
        }

        $rootScope.enableCropGrid = false;
        $rootScope.add_fields.v_background_image_url = '';
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
                                if(width == 500 && height == 350){
                                    $scope.validImageGrid = 1;
                                    $rootScope.enableCropGrid = true;
                                    angular.element('.fileinput-preview-gird').find('img').attr('src',evt.target.result);
                                    angular.element('.fileinput-preview-gird').show();
                                    //$scope.imageDataURI = evt.target.result;
                                    $rootScope.add_fields.v_background_image_url = evt.target.result;
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
                                } else {
                                    $scope.validImage = 0;
                                    bootbox.alert('Please upload image of 500px X 350px.');
                                }
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
            $rootScope.add_fields.v_background_image_url = '';
            angular.element("#fileInputGrid").val("");
        }

    });

     /* Clear form data */
    $scope.clearFormData = function($page){
        $state.go('/cities');
    };

    $scope.submit_frm_add = function(add_fields,button_pressed){
        //CKEDITOR.instances['skyline_body_editor'].updateElement();
        //add_fields['t_skyline_body'] = angular.element('#skyline_body_editor').val();
        add_fields['transparent_background_image'] = angular.element('#transparent_background_image').val();
        add_fields['v_upload_file'] = angular.element('#v_upload_file').val();
        add_fields['v_download_pdf'] = add_fields['v_upload_file'];
        setTimeout(function(){
            if(form_valid('#frmAdd',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                //Call submit data services
                if(button_pressed == 'New'){
                        PaginationService.submit_add_form_data(GLOBAL.API_URL+"cities/add", add_fields);
                        //CKEDITOR.instances['skyline_body_editor'].setData('');
                        //angular.element('.cropArea').remove();
                        //$rootScope.enableCropGrid = false;
                        //$rootScope.validImage = 1;
                        //angular.element("#fileInput").val("");
                } else {
                    PaginationService.submit_add_form_data(GLOBAL.API_URL+"cities/add", add_fields, '/cities');
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

    $scope.urlGenerate = function($event){
        $rootScope.add_fields.v_slug = $($event.target).val().toLowerCase().replace(/[^a-zA-Z0-9-]/g,"-");
        $("#SlugUrlLink").html(SITE_URL+'city/'+$rootScope.add_fields.v_slug+"/");
    }
    $("#file_upload").attr('flag','0');
    $("#file_upload").bind('change', function() {
        if($(this).attr('flag') == '0'){
            $(this).attr('flag','1');
            $("#file_error").html('File is uploading...');
            $("#submit-btn").prop("disabled",true);
            $("#file_error").show();
            $scope.upload_file("#form_name"); //form ID
        }
        return false;
    });

    $scope.upload_file = function(frmId){
        angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
        var options = {
            iframe: 'iframer_iframe',
    		returnType: 'html',
    		onComplete: function(responseText)
    		{
                $("#file_upload").attr('flag','0');
                if(responseText == 'EXTENSION_ERROR') {
	               bootbox.alert('Please upload PDF file.');
    			} else if(responseText != 'FALSE') {
                    $scope.fileEnable = true;
                    $scope.fileURL = responseText.substring( eval(responseText.indexOf('_')+1) );
                    angular.element('#v_upload_file').val(responseText);
                    angular.element('#old_file_name').val(responseText);
                    angular.element("#v_upload_file_error").remove();
                    angular.element(".city-pdf-file").removeClass('has-error');
    			}
                angular.element('div.loading').addClass('hide');
                $scope.$apply();
    		}
    	};
        $scope.iframer(options, frmId); //submitting file
    	return false;
    }

    $scope.iframer =  function(options, formID)
    {
    	var options = $.extend({
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
    	$(formID).append($theframe).attr('target', options.iframe);
    	$(formID).submit();
    	$('#' + options.iframe).load(function()
    	{
    		var data = $('#' + options.iframe).contents().find('body').html();
    		if (options.returnType.toLowerCase() == 'json') eval('data=' + data);
    		options.onComplete(data);
    		$('#' + options.iframe).contents().find('body').html('').empty();
    		$('#' + options.iframe).unbind('load');
    	});
    	return true;
    }

});

$('#cities').on('blur','#v_slug', function(){
    var curr_obj = $(this);
    var v_slug = curr_obj.val();
    var rel_id = curr_obj.attr('rel');
    var url = API_URL+'cms/check-url-exist';
    $.post( url, { v_slug: v_slug, id: rel_id }).done(function( data ) {
        if($.trim(data) == 'TRUE'){
            curr_obj.addClass('duplicate-error');
        } else {
            curr_obj.removeClass('duplicate-error');
            $('.alert-danger').hide();
        }
    });
});
