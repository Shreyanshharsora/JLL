'use strict';
app.controller('SettingsController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter,$cookieStore, anchorSmoothScroll) {
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
    $rootScope.thumbnailEnable1 = false;
    $rootScope.thumbnailEnable2 = false;
    $scope.validImage1 = 0;
    $scope.validImage2 = 0;
    $scope.image_type1 = 'Existing';
    $scope.image_type2 = 'Existing';

    $scope.trigger = function(elem) {
        $(elem).trigger('click');
    };

    //CKEDITOR.instances = { };
    //CKEDITOR.replace('email_template_editor','template[t_email_content]');
    //CKEDITOR.replace('share_email_template_editor','share_email_templates[t_email_content]');
    //CKEDITOR.replace('home_page_content');

    /*CKEDITOR.replace( 'home_page_content', {
     toolbar: [
      { name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ] }, // Defines toolbar group with name (used to create voice label) and items in 3 subgroups.
      [ 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo' ],   // Defines toolbar group without name.
      { name: 'basicstyles', items: [ 'Bold', 'Italic' ] }
      //'/',                     // Line break - next group will be placed in new line.
     ]
    });
    CKEDITOR.replace( 'v_home_page_content', {
     toolbar: [
      { name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ] }, // Defines toolbar group with name (used to create voice label) and items in 3 subgroups.
      [ 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo' ],   // Defines toolbar group without name.
      { name: 'basicstyles', items: [ 'Bold', 'Italic' ] }
      //'/',                     // Line break - next group will be placed in new line.
     ]
    });*/

    $rootScope.load_setting_data = function() {
        var responsePromise = $http.post(GLOBAL.API_URL+"settings");
        responsePromise.success(function(data, status1, headers, config)
        {
            setTimeout(function(){
                //CKEDITOR.replace['email_template_editor'].setData(data.email_templates.t_email_content);
                CKEDITOR.replace('email_template_editor').setData(data.email_templates.t_email_content);
                
                CKEDITOR.replace('share_email_template_editor').setData(data.share_email_templates.t_email_content);
                //CKEDITOR.instances['home_page_content'].setData(data.cms.t_content);
                //CKEDITOR.instances['v_home_page_content'].setData(data.settings.v_home_page_content);
            },1000);
            $rootScope.items = data;

            if(data.countries[0].v_image_name != '' && data.countries[0].v_image_name != undefined){
                $scope.validImage1 = 1;
                $rootScope.thumbnailEnable1 = true;
                $rootScope.thumbnailURI1 = GLOBAL.SITE_URL+GLOBAL.COUNTRY_IMAGE_PATH+data.countries[0].v_image_name;
                $rootScope.edit_fields.v_thumbnail_url1 = GLOBAL.SITE_URL+GLOBAL.COUNTRY_IMAGE_PATH+data.countries[0].v_image_name;
            } else {
                $scope.validImage1 = 0;
                $rootScope.thumbnailEnable1 = false;
                $rootScope.thumbnailURI1 = "";
                $rootScope.edit_fields.v_thumbnail_url1 = '';
            }

            if(data.countries[1].v_image_name != '' && data.countries[1].v_image_name != undefined){
                $scope.validImage2 = 1;
                $rootScope.thumbnailEnable2 = true;
                $rootScope.thumbnailURI2 = GLOBAL.SITE_URL+GLOBAL.COUNTRY_IMAGE_PATH+data.countries[1].v_image_name;
                $rootScope.edit_fields.v_thumbnail_url2 = GLOBAL.SITE_URL+GLOBAL.COUNTRY_IMAGE_PATH+data.countries[1].v_image_name;
            } else {
                $scope.validImage2 = 0;
                $rootScope.thumbnailEnable2 = false;
                $rootScope.thumbnailURI2 = "";
                $rootScope.edit_fields.v_thumbnail_url2 = '';
            }

            /*if(data.settings.v_video_file != '' && data.settings.v_video_file != undefined){
                $scope.validVideo = 1;
                $scope.videoEnable = true;
                $scope.videoURL = GLOBAL.SITE_URL +GLOBAL.FILE_PATH+ data.settings.v_video_file;
                angular.element('#v_video_file').val(data.settings.v_video_file);
                angular.element('#old_video_name').val(data.settings.v_video_file);
                $timeout(function(){
                    var myVideo = document.getElementById('jll_video');
                    myVideo.load();
                    myVideo.pause();
                },1)
            } else {
                $scope.validVideo = 0;
                $rootScope.videoEnable = false;
                $scope.videoURL = "";
                $rootScope.edit_fields.v_video_file = '';
                $scope.buttonDisabled = true;
            }*/
        });
    }

    /* For city image 1*/
    var handleThumbSelect1 = function(evt)
    {

        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
            if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0) {
                var img = new Image();
                var data = evt.target.result;
                img.src = data;
                img.onload = function(){
                    var width = this.width;
                    var height = this.height;
                    $scope.$apply(function($scope) {
                        if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                            if(width == '108' && height == '109'){
                                $scope.image_type1 = "New";
                                $scope.validImage1 = 1;
                                $rootScope.thumbnailEnable1 = true;
                                $rootScope.thumbnailURI1 = evt.target.result;
                                //angular.element('.fileinput-preview').find('img').attr('src',evt.target.result);
                                //angular.element('.fileinput-preview').show();
                                $rootScope.edit_fields.v_thumbnail_url1 = evt.target.result;
                            } else {
                                $scope.validImage1 = 0;
                                bootbox.alert('Please upload image of fix 108 x 109 width and height.');
                            }
                        } else {
                            $scope.validImage1 = 0;
                            //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                        }
                    });
                };
            } else {
                $scope.validImage1 = 0;
                bootbox.alert('Please upload valid image.');
            }
        };
        reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#thumbInput1')).on('change',handleThumbSelect1);

    $rootScope.removeImage1 = function() {
        $rootScope.thumbnailEnable1 = false;
        $rootScope.thumbnailURI1 = "";
        $rootScope.validImage1 = 0;
        angular.element("#thumbInput1").val("");
        angular.element("#full-image-element-edit1").val("");
    }

    /* For city image 2*/
    var handleThumbSelect2 = function(evt)
    {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
            if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0) {
                var img = new Image();
                var data = evt.target.result;
                img.src = data;
                img.onload = function(){
                    var width = this.width;
                    var height = this.height;
                    $scope.$apply(function($scope) {
                        if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                            if(width == '108' && height == '109'){
                                $scope.image_type2 = "New";
                                $scope.validImage2 = 1;
                                $rootScope.thumbnailEnable2 = true;
                                $rootScope.thumbnailURI2 = evt.target.result;
                                //angular.element('.fileinput-preview').find('img').attr('src',evt.target.result);
                                //angular.element('.fileinput-preview').show();
                                $rootScope.edit_fields.v_thumbnail_url2 = evt.target.result;
                            } else {
                                $scope.validImage2 = 0;
                                bootbox.alert('Please upload image of fix 108 x 109 width and height.');
                            }
                        } else {
                            $scope.validImage2 = 0;
                            //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                        }
                    });
                };
            } else {
                $scope.validImage2 = 0;
                bootbox.alert('Please upload valid image.');
            }
        };
        reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#thumbInput2')).on('change',handleThumbSelect2);

    $rootScope.removeImage2 = function() {
        $rootScope.thumbnailEnable2 = false;
        $rootScope.thumbnailURI2 = "";
        $rootScope.validImage2 = 0;
        angular.element("#thumbInput2").val("");
        angular.element("#full-image-element-edit2").val("");
    }

    $rootScope.load_setting_data();

    $rootScope.submit_frm_edit = function(){
        CKEDITOR.instances['email_template_editor'].updateElement();
        CKEDITOR.instances['share_email_template_editor'].updateElement();
        //CKEDITOR.instances['home_page_content'].updateElement();
        //CKEDITOR.instances['v_home_page_content'].updateElement();
        if(form_valid('#frmEdit',"help-block")){
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
            clearTimeout(timeoutID);
    		timeoutID = setTimeout(function() {
    		    anchorSmoothScroll.scrollTo('settings');
    		    var form_data = angular.element('#frmEdit').serialize();
                var v_video_file = angular.element('#v_video_file').val();
                $http({
                    method: 'POST',
                    url: GLOBAL.API_URL+"settings",
                    data: form_data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status) {
                    if(data == 'TRUE'){
                        angular.element('.alert-success').fadeIn(1000);
                        angular.element('.alert-success').fadeOut(3500);
                    } else {
                        angular.element('.alert-danger').fadeIn(1000);
                        angular.element('.alert-danger').fadeOut(3500);
                    }
                    angular.element('div.loading').addClass('hide');
                });
            }, 1000);
        }
    }



    $scope.newVideo = false;

    /*var handleVideoSelect = function(evt){
        angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
            $scope.$apply(function($scope) {
                if (evt.target.result.toLowerCase().indexOf("data:video/mp4;base64") >= 0) {
                    $scope.videoEnable = true;
                    $scope.videoURL1 = evt.target.result;
                    $scope.validImage = 1;
                    $scope.newVideo = true;
                    //angular.element('#jll_video1 source').attr('src',$scope.videoURL1);
                    var myVideo = document.getElementById('jll_video1');
                    myVideo.src = evt.target.result;
                    myVideo.load();
                    //myVideo.play();
               } else {
                    angular.element('div.loading').addClass('hide');
                    bootbox.alert("Please upload mp4 video.")
                    $scope.validImage = 0;
                }
                angular.element('div.loading').addClass('hide');
            });
        };
        reader.readAsDataURL(file);
    } */

    /*$("#file_upload").bind('change', function() {
        $("#file_error").html('File is uploading...');
        $("#submit-btn").prop("disabled",true);
        $("#file_error").show();
        $scope.upload_video("#form_name"); //form ID
        return false;
    });

    $scope.upload_video = function(frmId){
        angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
        var options = {
            iframe: 'iframer_iframe',
    		returnType: 'html',
    		onComplete: function(responseText)
    		{
                if(responseText == 'EXTENSION_ERROR') {
	               bootbox.alert('Please upload mp4 video.');
    			} else if(responseText != 'FALSE') {
                    var myVideo = document.getElementById('jll_video1');
                    angular.element('#v_video_file').val(responseText);
                    angular.element('#old_video_name').val(responseText);
                    myVideo.src = GLOBAL.SITE_URL +  GLOBAL.TEMP_VIDEO_PATH + responseText;
                    myVideo.load();
                    $scope.videoEnable = true;
                    $scope.validImage = 1;
                    $scope.newVideo = true;
                    $scope.buttonDisabled = false;
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
    }*/
});
