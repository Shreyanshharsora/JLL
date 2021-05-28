var timeoutID;
app.factory('sessionService',['$http',function($http){
    return{
        set:function(key,value){
            return sessionStorage.setItem(key,value)
        },
        get:function(key){
            return sessionStorage.getItem(key)
        },
        destroy:function(key){
            return sessionStorage.removeItem(key);
        }
    }
}]);
/* End login services */

/* ScrollTo function  Service */
app.service('anchorSmoothScroll', function () { 
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 10);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            
            var elm = document.getElementById(eID);
            if(elm != null){
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                } return y;
            }
        }

    };
});

/* Begin pagination services */
app.service('PaginationService', function ($http, $rootScope, $location, $timeout, GLOBAL, mySharedService,$state, $cookieStore,$filter) {     
    $rootScope.url = '';
    $rootScope._meta = [];
    $rootScope.records = {};
    $rootScope.current_page = 1;
    $rootScope.rec_per_page = GLOBAL.REC_PER_PAGE;
    $rootScope.last_page = '';
    $rootScope.order_field = '';
    $rootScope.sort_order = 'desc';
    $rootScope.search_fields = {};  
    $rootScope.data_loading = true;
    $rootScope.parent_items = {};
    $rootScope.updated_status = '';
    $rootScope.fields_reset = 0;
    $rootScope.reset_btn = false;
    //$rootScope.pageRefreshFlag = 1;

    this.loading = function(url, order_field) { 
        $rootScope.url = url;
        $rootScope.order_field = order_field;
        $rootScope.fields = ''; // reset search field
        load_data();        
    };   
       
    var load_data = function() {
        $rootScope.data_loading = true; 
        clearTimeout(timeOut);
        timeOut = setTimeout(function() {
            var responsePromise = $http.post($rootScope.url,{'page':$rootScope.current_page,'rec_per_page':$rootScope.rec_per_page,'order_field':$rootScope.order_field,'sort_order':$rootScope.sort_order,'search_fields':$rootScope.fields});
            responsePromise.then(function(results){
                if(results.data == "" || results.data == undefined)
                {
                    GLOBAL.checkId = false;
                    GLOBAL.checkUserId = false;
                    $cookieStore.remove('isLogged');
                    $cookieStore.remove('isUserLogged');
                    $state.go('/');
                }
                $rootScope.items = results.data.items;
                if(results.data.country !== undefined){
                    $rootScope.filter_country = results.data.country;
                }
                if(results.data.city !== undefined){
                    $rootScope.filter_city = results.data.city;
                }
                
                $rootScope.data_items = results.data.items;
                $rootScope.parent_items = results.data.parent_items; 
                if($state.current.data.currTab == 'information_boxes')
                {
                    $('#img_preview').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image1);
                    $('#img_preview1').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image2);
                    $('#img_preview2').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image3);
                }
                if($state.current.data.currTab == 'banner_settings')
                {
                    $('#img_preview').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_b_image);
                    $('#img_preview1').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_p_image);
                }
                if($state.current.data.currTab == 'general_settings')
                {
                    $('#img_preview').attr('src',GLOBAL.SITE_URL+'images/'+$rootScope.items.v_logo);
                   
                }
                if(results.data.access_page != undefined)
                {
                    angular.element(".dropzone .tools .btn-cancel").trigger("click");
                    angular.element('.dropzone').html5imageupload( { image: GLOBAL.SITE_URL+'images/'+$rootScope.items.v_image, height: '272px', width: '300px', editstart: true } );
                    angular.element("#h_v_img").val($rootScope.items.v_image); 
                    angular.element("#frm_v_img").prependTo("#upload_background_image_edit"); 
                }   
               
                if(results.data._meta != undefined)
                {
                    $rootScope._meta = results.data._meta;
                    $rootScope.total = $rootScope._meta.total;
                    $rootScope.last_page = $rootScope._meta.last_page;
                    $rootScope.current_page = $rootScope._meta.current;
                    $rootScope.rpp = $rootScope._meta.rpp;         
                    $rootScope.count_from = parseInt($rootScope.rpp*($rootScope.current_page-1))+1;
                    $rootScope.count_to = (parseInt($rootScope.count_from)+$rootScope.rpp)-1;
                    //$rootScope.rec_per_page = 10;   
                    if(!$rootScope.$$phase) {
                      $rootScope.$apply(); 
                    }

                }
                $rootScope.data_loading = false;
                
                if($rootScope.count_to > $rootScope.total){
                    $rootScope.count_to = $rootScope.total;
                }  
                if( $rootScope.pageRefreshFlag == 1) {                    
                    $timeout(function() { angular.element('#reset-paging').trigger('click'); $rootScope.pageRefreshFlag = 0; }, 1);
                }
                if($state.current.controller == 'UsersVideoController' || $state.current.controller == 'VideoHelpController')
                {

                    var img_url = '';
                    angular.forEach($rootScope.items, function(value,key){
                      // img_url =  getVideoThumbnail(value.v_link);
                        var url = value.v_link; 
                        var videoObj = parseVideo(value.v_link);

                          if (videoObj.type == 'youtube') {
                                $timeout(function(){
                               $rootScope.items[key]['video_data'] =  '//img.youtube.com/vi/' + videoObj.id + '/default.jpg';
                               $rootScope.items[key]['video_id'] = videoObj.id;
                               $rootScope.items[key]['video_type'] = 'youtube';
                               $rootScope.$apply(); 
                               },1000); 
                            } else if (videoObj.type == 'vimeo') {
                            $.getJSON('http://vimeo.com/api/v2/video/' + videoObj.id + '.json/recent?callback=?', function(data) {
                            $timeout(function(){
                               $rootScope.items[key]['video_data'] = 'http://i.vimeocdn.com/video/'+data[0]["thumbnail_small"];
                               $rootScope.items[key]['video_id'] = videoObj.id;
                               $rootScope.items[key]['video_type'] = 'vimeo';
                               $rootScope.$apply();
                            },1000);

                            });

                        }  
                    });
                }
                
                if($state.current.controller == 'UnitStatusController')
                {
                    $timeout(function(){
                        $(".colorbut").each(function(i,v){
                            $(v).css('background-color',$(v).attr('rel'));
                        })
                    },1000);
                }
                
                //angular.element("a#reset-paging").click();
                setTimeout(function(){
                Metronic.init(); // Run metronic theme
                //Layout.init(); // init current layout
                QuickSidebar.init(); // init quick sidebar
                Demo.init(); // init demo features      
                FormValidation.init(); 
                Metronic.initComponents(); // init core components      
                Custom.init(); // for Custome script fumction
                ComponentsPickers.init();
                },100);
                                                                                     
            }, function(results){
                console.log("Error: " + results.data + "; " + results.status);                      
            });
        },500);
    }

    $rootScope.DoCtrlPagingAct = function(text, page){
        $rootScope.set_current_page(page);
        $rootScope.pageRefreshFlag = 0;
    };
    $rootScope.set_current_page = function($page) {
        $rootScope.current_page = $page;
        load_data();
    }
    $rootScope.order_by_name = function($order_field) {
        $rootScope.sort_order = $rootScope.sort_order === 'asc' ? 'desc' : 'asc';
        $rootScope.order_field = $order_field;        
        load_data();        
    }
    $rootScope.filter_data = function(fields) {
        
        if(fields != undefined )
        {
            
             angular.forEach(fields, function(value,key){
                if (value === "" || value === null){
                    delete fields[key];
                }
            });
             
             if( $.isEmptyObject(fields) != true || $rootScope.reset_btn == true)
            {
                $rootScope.current_page = 1;
                $rootScope.fields = fields;
                $rootScope.pageRefreshFlag = 1;
                $rootScope.fields_reset = 1; 
                $rootScope.reset_btn = false;
                load_data();
            }
        }
         
    } 
    $rootScope.change_record_size = function($page_size) {
        $rootScope.rec_per_page = $page_size;
        $rootScope.page = 1;
        $rootScope.current_page = 1;
        //$rootScope.check_all(false,false);
        load_data();
    }
    
    $rootScope.filterClear = function() {

        if($rootScope.fields_reset == 1 )
        {
            $rootScope.reset_btn = true;
            angular.copy({},$rootScope.fields);
            $rootScope.filter_data($rootScope.fields);
            $rootScope.fields_reset = 0;
           
        }
    }     
    
    this.submit_add_form_data = function(url, data, redirect_state,domain_page) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
    		$http.post(url, data).success(function(data, status, headers, config) {
    		  if(domain_page == 'domain_page') {
    		      if(data.id !== undefined && data.id !== '') {
                        $('.domain_add').find('.has-error').removeClass('has-error');
                        $('.domain_add').find('.help-block-error').remove();
                        $('.domain_add').find('').removeClass('has-error');
                        $rootScope.items.unshift(data);
                        $rootScope.add_fields = {};
                        $rootScope.success_msg = 'Record add successfully.';
                        angular.element('.alert-success').fadeIn(1000);
                        angular.element('.alert-danger').hide();
                        setTimeout(function(){ $('.selected_checkbox').uniform() },100);
                        setTimeout(function(){
                            angular.element('.alert-success').fadeOut(3000);
                            angular.element('.select2me').select2('val', '');
                            angular.element('div.loading').addClass('hide');
                        },2000);
		          } else {
                      if(data.error != undefined) {
		                  angular.forEach(data.error, function(value,key){
                            $("#"+key+'_error').css('display','block');
                        });
                        $('#add_domain_name').css('border','1px solid rgb(235, 204, 209)');
                    }
		          }
                  angular.element('div.loading').addClass('hide');
    		  } else {
                  if($.trim(data) == 'TRUE'){
        		        if(redirect_state != "" && redirect_state != undefined){
                            $state.go(redirect_state);
                        } else {
                            $state.go($state.$current, null, { reload: true }); // reload page
                            $rootScope.success_msg = 'Record add successfully';
                            // To clear form elements
                            angular.element('.alert-success').fadeIn(1000);
                            setTimeout(function(){
                                angular.element('.alert-success').fadeOut(2000);
                            },2000);
                        }
                        angular.element('div.loading').addClass('hide');
                    } 
                    else 
                    {
                        if(data.error != undefined) {
                            angular.forEach(data.error, function(value,key){
                                $("#"+key+'_error').css('display','block');
                            });
                        } else {
                            $("#validation_error").html('You have some form errors. Please check below.');   
                        }
                        if($("#submit_loader").length > 0) {
                            $("#submit_loader").hide();
                        }
                        angular.element('.alert-danger').show();
                        angular.element('.alert-success').hide();
                    }
                }
            });
        }, 500);
    }
    
    this.submit_edit_form_data = function(url, serial_data, redirect_state,domain_page) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            $http.post(url, serial_data).success(function(data, status, headers, config) {
                if(domain_page == 'domain_page') {
        		  if(data.id !== undefined && data.id !== '') { 
		              var fileObj = $filter('filter')($rootScope.items, function (d) {return d.id == data.id;})[0];
                        var index = $rootScope.items.indexOf(fileObj);
                        $rootScope.items.splice(index,1,data); 
                        
                        $rootScope.recordEditForm = {};
                        $rootScope.success_msg = 'Record update successfully.';
                        setTimeout(function(){ $('.selected_checkbox').uniform() },100);
                        angular.element('.alert-success').fadeIn(1000);
                        setTimeout(function(){
                            angular.element('.alert-success').fadeOut(2000);
                            angular.element('div.loading').addClass('hide');
                        },2000);
                  } else {
		              if(data.error != undefined) {
                        angular.forEach(data.error, function(value,key){
                            $("#"+key+'_error_edit').css('display','block');
                        });
                    }
		          }
                  angular.element('div.loading').addClass('hide');
    		  } else if(angular.element.trim(data) == 'TRUE'){
                    angular.element('div.loading').addClass('hide');
                    //angular.element('.alert-success').show();
                    if(redirect_state != "" && redirect_state != undefined)
                    {
                        $state.go(redirect_state);
                    }
                    else
                    {
                        load_data(); 
                    }
                    angular.element('#editModal').modal('hide');       
                } else 
                {
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
                    
                    angular.element('.alert-danger').show();
                    angular.element('.alert-success').hide();
                }
            });
        }, 500);
    } 
    this.delete_data = function(url, id)
    {
        clearTimeout(timeoutID);
        angular.element("tr#tablerow" + id).effect("highlight", {color: '#FFE0E0'}, 2000);
        angular.element('#tablerow'+id).fadeOut('1000');
        timeoutID = setTimeout(function() {
            $http.post(url, {id:id}).success(function(data, status, headers, config) {
                if(angular.element.trim(data) == 'TRUE'){
                   
                    if($("#datatable_ajax:last tr:visible").length == 3) {
                        load_data();
                    }
                    
                } else {
                    angular.element('.alert-success').hide();
                }
            });
        }, 500);

    }
    
    this.change_active_inactive = function(url, id, status) {
        clearTimeout(timeoutID);
        //timeoutID = setTimeout(function() {
            if(status == '0'){
                $rootScope.updated_status = '0';
                $rootScope.success_msg = 'Record inactive successfully.';
            } else {
                $rootScope.updated_status = '1';
                $rootScope.success_msg = 'Record active successfully.'; 
            } 
            $rootScope.$apply();
            angular.element('.alert-success').fadeIn(500);
            
            $http.post(url, { 'id': id, 'status': $rootScope.updated_status }).success(function(data, status, headers, config) {
                if(angular.element.trim(data) == 'TRUE'){
                    if($rootScope.updated_status == '1'){
                        angular.element("tr#tablerow" + id).effect("highlight", {
        					color: '#E5FFCE'
        				}, 2000);
                        setTimeout(function(){
                            angular.element('.alert-success').fadeOut(3000);
                        },500);
                    } else {
                        angular.element("tr#tablerow" + id).effect("highlight", {
        					color: '#FFE0E0'
        				}, 2000);
                        setTimeout(function(){
                            angular.element('.alert-success').fadeOut(3000);
                        },500);
                    }
                }
            });
        //}, 1000);
    }
    
    this.change_yes_no = function(url, id, status) {
        if(status == 'Yes'){
            $rootScope.updated_status = 'No';
        } else {
            $rootScope.updated_status = 'Yes';
        }
        $http.post(url, { 'id': id, 'status': $rootScope.updated_status }).success(function(data, status, headers, config) {
            if(angular.element.trim(data) == 'TRUE'){
                if($rootScope.updated_status == 'Yes'){
                    angular.element("tr#tablerow" + id).effect("highlight", {
    					color: '#E5FFCE'
    				}, 2000);
                } else {
                    angular.element("tr#tablerow" + id).effect("highlight", {
    					color: '#FFE0E0'
    				}, 2000);
                }
            }
        });
    }
    
});
 
function parseVideo(url) {
    // - Supported YouTube URL formats:
    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
    //   - http://youtu.be/My2FRPA3Gf8
    //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
    // - Supported Vimeo URL formats:
    //   - http://vimeo.com/25451551
    //   - http://player.vimeo.com/video/25451551
    // - Also supports relative URLs:
    //   - //player.vimeo.com/video/25451551

    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
        var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        var type = 'vimeo';
    }
    
    if(type == 'youtube')
    {
        return {
            type: type,
            id: RegExp.$6
        };
    }
    else
    {
        url.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);

        return {
            type: type,
            id: RegExp.$3
        };
    }
}