app.controller('BuildingsAddController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams, anchorSmoothScroll) {
    $rootScope.cities = {};
    $rootScope.unit_assets = {};
    $rootScope.list_unit_assets = {};
    $rootScope.add_fields = {};
    $rootScope.floor_height = '';
    $rootScope.all_cities_data = {};
    $rootScope.tab_number = 1;  
    $rootScope.old_left_value = '';
    $rootScope.old_right_value = ''; 
    
    $timeout(function(){   
        $(".colorbut").each(function(i,v){
            $(v).css('background-color',$(v).attr('rel'));
        })
    },1000);
    
    var year = new Date().getFullYear();
    var range = [];    
    for (i = eval(new Date().getFullYear() + 5); i > 1900; i--) {
        range.push(i);
    }     
    $rootScope.years = range;
    
    $rootScope.change_tab_number = function(data){
        $rootScope.tab_number = data;
    } 
    
    /* To remove unit cell */
    $rootScope.remove_unit_cell = function(event){
        var currObj = angular.element(event.target);
        bootbox.confirm("Are you sure you want to remove?", function(result) {
            if(result == true){
                currObj.parent().parent('div.unit_box').remove();
            }
        });
    }
    
    $rootScope.back_to_building_information = function(){
        angular.element('#building_tab').trigger('click');
        anchorSmoothScroll.scrollTo('form_wizard_1');
    }; 
    
    /* Change drop down color */
    $rootScope.setDropDownColor = function(){
        angular.forEach(angular.element('.change_color'), function(v, k){
            var color = angular.element(v).find(':selected').attr('rel');
            var fontColor = "#FFFFFF";
            if(color != "#FFFFFF"){
                fontColor = "#FFFFFF";
            } else {
                fontColor = "#000000";
            }
            if(angular.element(v).val() != '' && angular.element(v).val() != undefined){
                if(color == '#000000'){
                    angular.element(v).parent('div').next('div').find('input').css('background-color','');
                    angular.element(v).parent('div').next('div').find('input').css('color',fontColor);
                } else {
                    angular.element(v).parent('div').next('div').find('input').css('background-color',color);
                    angular.element(v).parent('div').next('div').find('input').css('color',fontColor);
                }
            } else {
                angular.element(v).parent('div').next('div').find('input').css('background-color','');
                angular.element(v).parent('div').next('div').find('input').css('color',fontColor);
            }
        });
    }
    
    /* Get order and is_default from city */
    $rootScope.get_order = function(city_id){
        if(city_id != '' && city_id != undefined){
            clearTimeout(timeoutID);
      		timeoutID = setTimeout(function() {
                $http({
                    method: 'GET',
                    url: GLOBAL.API_URL+"buildings/city-order/"+city_id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status) {
                    var order_no = data.trim();
                    if(order_no != '' && order_no > 0){
                        $rootScope.add_fields.i_order = order_no;
                    }
                });
            }, 200);    
        }
    }
    
    $rootScope.check_value = function(event){
        $rootScope.old_left_value = '';
        $rootScope.old_right_value = '';
        var unit_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('select').val();
        var input_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('input').val();
        if(unit_val == 'L') { 
            $rootScope.old_left_value = input_val; 
        } else if(unit_val == 'R') { 
            $rootScope.old_right_value = input_val; 
        }
        
    }
    
    /* Apply left and right margin to all floors */
    $rootScope.apply_to_all_floors = function(event, floor_no){
        /* Apply left and right margin to all floors */
        if(floor_no == 1){
            var unit_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('select').val();
            var input_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('input').val();
            if(unit_val == 'L' || unit_val == 'R' && input_val != ''){
                if(unit_val == 'L') { 
                    var unit_name = 'left'; 
                    var old_value = $rootScope.old_left_value;
                } else if(unit_val == 'R') { 
                    var unit_name = 'right'; 
                    var old_value = $rootScope.old_right_value;
                }
                if(old_value != input_val){
                    bootbox.confirm("Would you like to apply "+unit_name+" margin to all floors?", function(result) {
                        if(result == true){
                            for(var i = 2; i<=$rootScope.add_fields.i_floor_number; i += 1){
                                if(unit_val == 'L'){
                                    angular.element('#floor_'+i+' .left_margin_value').val(input_val);
                                } else {
                                    angular.element('#floor_'+i+' .right_margin_value').val(input_val);
                                }
                            }
                            $scope.apply_result();
                        }
                    });
                }
            }
        }            
    }
    
    /* Apply changes on building */
    $scope.apply_result = function(floor_num){
        var l_array = r_array = [];

        if(floor_num == undefined || floor_num == ''){
            var e = 1;
            angular.forEach(angular.element('.main_unit_box'), function(value, key)
            {
                var floor_num = e;
                angular.element('#floor-'+floor_num).html('');
                angular.forEach(angular.element(value).find('.unit_box'), function(vl, ky){
                    var select_val = angular.element(vl).find('select').val();
                    var color = angular.element(vl).find('select').find(':selected').attr('rel');
                    var percent_val = angular.element(vl).find('input').val();
                    if(select_val != '' && percent_val != ''){
                        
                        if(select_val == 'L' || select_val == 'R'){
                            var style_attr = '';
                            if(select_val == 'L'){
                                style_attr = 'margin-left';
                                l_array.push(percent_val);
                            } else if(select_val == 'R'){
                                style_attr = 'margin-right';
                                r_array.push(percent_val);
                            } 
                            angular.element('#floor-'+floor_num).css(style_attr,percent_val+'%').removeClass('clearfix');
                            
                        } else {
                            angular.element('#floor-'+floor_num).append('<div style="height:'+$rootScope.floor_height+'em;width:'+percent_val+'%; background-color:'+color+'" class="unit">&nbsp;</div>').removeClass('clearfix');        
                        }
                    } else if(select_val == 'L' || select_val == 'R' && percent_val == ''){
                        var style_attr = '';
                        if(select_val == 'L'){
                            style_attr = 'margin-left';
                        } else if(select_val == 'R'){
                            style_attr = 'margin-right';
                        } 
                        angular.element('#floor-'+floor_num).css(style_attr,'');
                    }
                });
                e += 1;
            });
        } else {
            angular.element('#floor-'+floor_num).html('');
            angular.forEach(angular.element('#floor_'+floor_num).find('.unit_box'), function(vl, ky){
                var select_val = angular.element(vl).find('select').val();
                var color = angular.element(vl).find('select').find(':selected').attr('rel');
                var percent_val = angular.element(vl).find('input').val();
                if(select_val != '' && percent_val != ''){
                    
                    if(select_val == 'L' || select_val == 'R'){
                        var style_attr = '';
                        if(select_val == 'L'){
                            style_attr = 'margin-left';
                            l_array.push(percent_val);
                        } else if(select_val == 'R'){
                            style_attr = 'margin-right';
                            r_array.push(percent_val);
                        } 
                        angular.element('#floor-'+floor_num).css(style_attr,percent_val+'%').removeClass('clearfix');
                        
                    } else {
                        angular.element('#floor-'+floor_num).append('<div style="height:'+$rootScope.floor_height+'em;width:'+percent_val+'%; background-color:'+color+'" class="unit">&nbsp;</div>').removeClass('clearfix');        
                    }
                } else if(select_val == 'L' || select_val == 'R' && percent_val == ''){
                    var style_attr = '';
                    if(select_val == 'L'){
                        style_attr = 'margin-left';
                    } else if(select_val == 'R'){
                        style_attr = 'margin-right';
                    } 
                    angular.element('#floor-'+floor_num).css(style_attr,'');
                }
            });
        }
        
    };
    
    $scope.$on('$viewContentLoaded', function() {
        
        FormWizard.init();
        $http.defaults.headers.post['Content-Type'] = $headerData;
        //PaginationService.loading(GLOBAL.API_URL+"buildings","fname");
        var responsePromise = $http.get(GLOBAL.API_URL+"buildings/add");
        responsePromise.success(function(data, status, headers, config) {
            if(data.cities != "" && data.cities != undefined) {
                $rootScope.cities = data.cities;
                $rootScope.all_cities_data = data.all_cities_data;
                $rootScope.unit_assets = data.unit_assets;
            }
            
            if(data.list_unit_assets != "" && data.list_unit_assets != undefined) {
                $rootScope.list_unit_assets = data.list_unit_assets;
                $rootScope.list_unit_assets.M = {color:"#FFFFFF",name:"Middle"};
            }
        });
        
        
        //For Image
        $scope.enableCrop = false;
        $scope.resImageDataURI='';
        $scope.validImage = 1;
        
        var handleFileSelect = function(evt) 
        {   
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
            $scope.image_type = "New";
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
                
                $scope.$apply(function($scope) {
                    if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/svg+xml;base64") >= 0) {
                        if(file_size < GLOBAL.MAX_UPLOAD_SIZE*1000) {
                            $scope.validImage = 1;
                            $scope.enableCrop = true;
                            angular.element('#image_name').text(file.name);
                            angular.element('#original_image_name').val(file.name);
                            $scope.imageDataURI = evt.target.result;   
                        } else {
                            $scope.validImage = 0;
                            //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                        }
                    } else {
                        $scope.validImage = 0;
                        $scope.error_message = GLOBAL.INVALID_IMAGE_EXTENSION;
                        alert('You have uploaded an invalid image file type.');                                                             }
                });
            };
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').addClass('hide');
            reader.readAsDataURL(file); 
        };
        
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        
        $scope.trigger = function(elem) {
            $(elem).trigger('click');
        }; 
    });
    
    $rootScope.get_floor_height = function(city_id){
        if(city_id != undefined && city_id != ''){
            $rootScope.floor_height = $rootScope.all_cities_data[city_id].d_floor_height;
        } else {
            $rootScope.floor_height = '';
        }
        $scope.new_floor_height = $rootScope.floor_height;
        angular.element('#city_name').val($rootScope.all_cities_data[city_id].v_name);
    }
    
    $rootScope.check_sum = function(parent_id, event){
        clearTimeout(timeoutID);
  		timeoutID = setTimeout(function() {
  		    var floor_no = parent_id.replace("floor_", ""); 
            var target = angular.element(event.target);
            var total_value = 0;
            angular.forEach(angular.element('#'+parent_id+' div.unit_box'), function(value, key){
                if(angular.element(value).find('select').val() != undefined && angular.element(value).find('select').val() != '' && angular.element(value).find('select').val() != 'L' && angular.element(value).find('select').val() != 'R' && angular.element(value).find('input').val() != ''){
                    total_value = total_value + parseInt(angular.element(value).find('input').val());
                }
            });
            
            if(total_value > 100){
                target.val('');
                target.css({border: '1px solid red'});
                $scope.apply_result(floor_no);
                $timeout(function(){
                    target.css({border: '1px solid #e5e5e5'});
                }, 2000);
            } else {
                $scope.apply_result(floor_no);
            }
        }, 200);
    }
    
    /* Add new unit cell */
    $scope.addInput = function(index){
        $rootScope.inputs[index].push({field:''});
        $timeout(function(){
            $rootScope.setDropDownColor();
        }, 50);
    }
    
    /* Remove existing unit cell */
    $scope.removeInput = function(parent_index, index){
        var curr_index = index+1;
        if(angular.element('.unit_value_'+parent_index+'_'+curr_index).val() != ''){
            bootbox.confirm("Are you sure you want to remove?", function(result) {
                if(result == true){
                    $rootScope.inputs[parent_index].splice(index,1);
                    $timeout(function(){
                        $rootScope.$apply();
                        $scope.apply_result(parent_index);
                    }, 500);   
                }
            });
        } else {
            $rootScope.inputs[parent_index].splice(index,1);
            $timeout(function(){
                $rootScope.$apply();
                $scope.apply_result(parent_index);
            }, 500);
        }
    }
    
    
    $rootScope.html_to_canvas = function(){
        /* For min margin of left and right */
        var l_array = []; 
        var r_array = [];
        var e = 1;
        var zoom = 10;
        angular.forEach(angular.element('.main_unit_box'), function(value, key) {
            var floor_num = e;
            angular.forEach(angular.element(value).find('.margin_group'), function(vl, ky){
                var select_val = angular.element(vl).find('select').val();
                var percent_val = angular.element(vl).find('input').val();
                if(percent_val != ''){
                    if(select_val == 'L'){
                        l_array.push(percent_val);
                    } else {
                        r_array.push(percent_val);
                    }
                } 
            });
            e += 1;
        });
        
        
        var imageH, imageW, buildingH;        
        var newImg = new Image();   
        newImg.onload = function() {
            angular.element('#original_image_width').val(newImg.width);
            imageH = newImg.height * zoom;
            imageW = newImg.width * zoom;
            buildingH = angular.element('#floors').height() *  zoom;
            
            var min_left = 0;
            if (l_array.length !== 0) {
                var min_left = Math.min.apply(Math,l_array);
                var left_pixel = Math.floor((min_left*zoom)*imageW/100)-5*zoom;
            }
            
            if(left_pixel < 0 || left_pixel == '' || left_pixel == undefined){
                left_pixel = 0;
            }
            
            var min_right = 0;
            if(r_array.length !== 0){
                var min_right = Math.min.apply(Math,r_array);
                var right_pixel = Math.floor((min_right*zoom)*imageW/100)-5*zoom;
            }
                        
            if(right_pixel < 0 || right_pixel == '' || right_pixel == undefined){
                right_pixel = 0;
            }
            //angular.element('#city_grid_image').css('opacity', 1);
            //angular.element('#city_grid_image').css('opacity', 1);
            var transparent_image_url = GLOBAL.SITE_URL+GLOBAL.TRANSPARENT_CITY_BACKGROUND_IMAGE_PATH+$rootScope.all_cities_data[$rootScope.add_fields.i_city_id].v_background_image_url;
                       
            /* For plain image */
            angular.element('#generate_building_image2').css({'width':imageW,'height':imageH, 'background-color':$rootScope.list_unit_assets[1].color}).html('<div style="width:'+imageW+'; position: relative;"><div class="form-title"><div id="building_image2"></div></div></div>').show();
            angular.element('#building_image2').html(angular.element('#building').html()).css('width',imageW).css('height',imageH);
            angular.element('#building_image2 img').css({ 'width':imageW, 'height':imageH, 'top':'0px', 'left':'0px', 'z-index':'999' });
            angular.element('#generate_building_image2 .floors').css({'padding-top': eval(imageH - buildingH)+"px", 'z-index':'99'});
            angular.element('#generate_building_image2 .floor_div:last').css('border-bottom','0.01px solid #C7C9CC');
            angular.element('#generate_building_image2 .floor_div:last .unit').css('border-bottom','0.01px solid #C7C9CC');
            //angular.element('#generate_building_image2 .img2').attr('src', transparent_image_url).css('opacity', 1).css('position','absolute');
            angular.element('#generate_building_image2 .img2').remove();            
            angular.forEach(angular.element('#generate_building_image2 div'), function(v,k){
                angular.element(v).css({'height':$rootScope.floor_height*zoom+'em'});
            });
            angular.forEach(angular.element('#generate_building_image2 .floors').find('.floor_div'), function(v,k){
                angular.element(v).css('border-top', zoom+'px solid #CACACC');
            });
            
            //angular.element('#generate_building_image2').css('background','url("1-trans-bg.png") no-repeat scroll 0 0 / 100% 100% rgba(0, 0, 0, 0)');                                    
            setTimeout(function(){
                return generate_image(imageW, imageH, left_pixel, right_pixel, zoom);
            }, 1000);
        }
        newImg.src = angular.element('#building').find('img').attr('src');
        /* For graph image */
    }
    
    /* To edit floor height on the fly but it can not affect original floor height of city */
    $rootScope.edit_floor_height = function(){
        $('#floorHeightForm').show();
        bootbox.dialog({
            title: 'Edit floor height.',
            message: $('#floorHeightForm'),
            show: false // We will show it manually later
        })
        .on('shown.bs.modal', function() {
            $('#floorHeightForm').show();
            angular.element('.error_required').hide();
            angular.element('.error_exceeded').hide();
            setTimeout(function(){
                $('#floorHeightForm').validate('resetForm', true);
                angular.element('#floor_height').val($rootScope.floor_height);    
            }, 100);
        })
        .on('hide.bs.modal', function(e) {
            $('#floorHeightForm').hide().appendTo('body');
        }).modal('show');
    }
    
    $scope.change_floor_height =  function(new_floor_height){
        
        if(new_floor_height == '' || new_floor_height == undefined){
            setTimeout(function(){
                angular.element('.error_required').css('display', 'block');
                angular.element('#floor_height').show();
            }, 200);
        } else {
            angular.element('.error_required').hide();
            $rootScope.floor_height = new_floor_height;
            var imageH;        
            var newImg = new Image();   
            newImg.onload = function() {
                var imageH = newImg.height;
                var imageW = newImg.width;
                angular.element('#city_grid_image').attr('height',imageH).attr('width',imageW);
                var buildingH = angular.element('#floors').height();
                if(buildingH <= 350){
                    angular.element('.error_exceeded').hide();
                    if(imageH > buildingH) {
                        angular.element('#floors').attr('style', 'padding-top: '+(eval(imageH - buildingH))+"px");
                    } else {
                        angular.element('#floors').attr('style', 'padding-top: 0px');
                    }
                    setTimeout(function(){
                        $scope.apply_result();
                        $scope.apply_only_floor_height();
                        bootbox.hideAll();    
                    }, 500);   
                    angular.element('#building').css('width',imageW+"px");             
                } else {
                    $rootScope.get_floor_height($rootScope.add_fields.i_city_id);
                    setTimeout(function(){
                        angular.element('.error_exceeded').show();
                        angular.element('#floor_height').css('border', '1px solid red');
                    }, 200);
                    setTimeout(function(){
                        $scope.apply_result();
                        $scope.apply_only_floor_height();
                        $scope.new_floor_height = $rootScope.floor_height;
                        angular.element('#floor_height').val($rootScope.floor_height);
                    }, 500);      
                }
            }
            newImg.src = angular.element('#building').find('img').attr('src');            
        }
        
    }
    
    /* Apply on floor height to buildings floor */
    $scope.apply_only_floor_height = function(){
        angular.forEach(angular.element('#floors').find('div'), function(v, k){
            angular.element(v).css('height', $rootScope.floor_height+"em");
        });
    };
    
    $rootScope.submit_floor_frm_add = function(){
        var canvas_status = $rootScope.html_to_canvas();
        if(form_valid('#frmAdd',"help-block")){
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
            clearTimeout(timeoutID);
    		timeoutID = setTimeout(function() {
                    angular.forEach(angular.element('.floor'), function(v, k){
                        if(angular.element(v).find('input').val() <= 0 || angular.element(v).find('input').val() == ''){
                            angular.element(v).remove();
                        }        		      
                    }); 
    		    var form_data = $('#frmAdd').serialize(); 
                $http({
                    method: 'POST',
                    url: GLOBAL.API_URL+"buildings/add",
                    data: form_data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status) {
                    if(data == 'TRUE'){
                        $timeout(function(){
                            angular.copy({}, $rootScope.add_fields);
                            document.getElementById("frmAdd").reset();
                            angular.element('.change_color').css('background-color','');
                            angular.element('#image_name').text('');
                            angular.element('#original_image_name').val('');
                            angular.element('#image_1').attr('src','');
                            $rootScope.inputs = [];
                            $rootScope.data_rows = [];
                            $scope.enableCrop = false;
                            $scope.resImageDataURI='';
                            $scope.validImage = 1;
                            $rootScope.$apply();
                            angular.element('.alert-success').fadeIn(1000);
                            angular.element('.alert-success').fadeOut(2000);
                            angular.element('.alert').hide();
                            angular.element('#floor_tab').removeAttr('data-target').removeAttr('data-toggle');
                            //angular.element('#building_tab').trigger('click');
                            angular.element('div.loading').addClass('hide');
                            $state.go('/buildings');
                        },100);
                    }
                });
            }, 8000); 
            $rootScope.tab_number = 1;   
        }
    }
    
    $rootScope.submit_building_frm_add = function(add_fields, click_from){
        angular.element('#tab2').hide();
        if(form_valid('#frmAdd',"help-block")){
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
            /* Apply floors(data_rows) and unit cells(inputs) */
            angular.element('#image_1').attr('src',$scope.imageDataURI);
            var row_count = add_fields.i_floor_number;
            $rootScope.inputs = [];
            $rootScope.data_rows = [];
            for (var i = 1; i <= row_count; i += 1) {
                $rootScope.data_rows.push({'id': 'row_' + parseInt(i)});
                $rootScope.inputs[i] = [{value:''}];
            } 
            
            /* Add address to tab 2 */
            var building_address_added = '';
            if(add_fields.v_address1 != '' && add_fields.v_address1 != undefined){
                building_address_added = building_address_added + add_fields.v_address1; 
            }
            if(add_fields.v_address2 != '' && add_fields.v_address2 != undefined){
                building_address_added = building_address_added + ", " + add_fields.v_address2; 
            }
            if(add_fields.i_city_id != '' && add_fields.i_city_id != undefined){
                building_address_added = building_address_added + ", " + $rootScope.all_cities_data[add_fields.i_city_id].v_name; 
            }
            if(add_fields.v_state != '' && add_fields.v_state != undefined){
                building_address_added = building_address_added + ", " + add_fields.v_state; 
            }
            if(add_fields.v_zip != '' && add_fields.v_zip != undefined){
                building_address_added = building_address_added + ", " + add_fields.v_zip; 
            }            
            $rootScope.tab1_building_address = building_address_added;
            
            $timeout(function(){ 
                angular.forEach(angular.element('#floors div'), function(v, k){
                    angular.element(v).css('height', $rootScope.floor_height+'em');
                });
                /* Setup to display mask image on floors div */
                var imageH, imageW;
                var newImg = new Image();   
                newImg.onload = function() {
                    imageH = newImg.height;
                    imageW = newImg.width;
                    angular.element('#city_grid_image').attr('height',imageH).attr('width',imageW);
                    var buildingH = angular.element('#floors').height();
                    if(imageH > buildingH && buildingH > 0) {
                        angular.element('#floors').attr('style', 'padding-top: '+(eval(imageH - buildingH))+"px");
                    } else {
                        angular.element('#floors').attr('style', 'padding-top: 0px');
                    }
                    angular.element('#building').css('width',imageW+"px"); 
                }
                newImg.src = angular.element('#building').find('img').attr('src');
                
                //Call submit data services
                if(click_from == 'continue'){
                    angular.element('#floor_tab').attr('data-target', '#tab2').attr('data-toggle', 'tab').trigger('click');    
                } 
                angular.element('.progress-bar-success').css('width', '100%');
                $rootScope.tab_number = 2;            
                anchorSmoothScroll.scrollTo('form_wizard_1');
                $rootScope.setDropDownColor();
                angular.element('div.loading').addClass('hide');
                angular.element('#tab2').show();
                angular.element('#building').css('background-color', 'lightblue');
                /*$timeout(function(){        
                    angular.element('#canvas1').attr('width',imageW);
                    angular.element('#canvas1').attr('height',imageH);
                    var canvas1 = document.getElementById("canvas1");
                    var img = document.getElementById("city_grid_image");
                    var ctx = canvas1.getContext("2d");
                    ctx.drawImage(img,0,0);            
                    var imgData = ctx.getImageData(0, 0, canvas1.width, canvas1.height);            
                    ctx.putImageData(adjustImage(imgData), 0, 0);
                    angular.element('#city_grid_image').attr("src",canvas1.toDataURL("image/png"));  
                    angular.element('#canvas1').remove(); 
                }, 200);*/
            }, 1000);
        } else {           
            $rootScope.valid_img =  1;
            return false;
        }         
    }
});

app.controller('BuildingsEditController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams, anchorSmoothScroll) {
    $rootScope.cities = {};
    $rootScope.floors = {};
    $rootScope.unit_assets = {};
    $rootScope.list_unit_assets = {};
    $rootScope.edit_fields = {};
    $rootScope.floor_height = '';
    $rootScope.all_cities_data = {};
    $rootScope.inputs = [];
    $rootScope.data_rows = [];
    $rootScope.tab_number = 1; 
    $rootScope.old_left_value = '';
    $rootScope.old_right_value = '';
    $rootScope.floor_save_status = 0;
    $rootScope.floor_unit_value_exceeded_status = 0;
    
    $timeout(function(){   
        $(".colorbut").each(function(i,v){
            $(v).css('background-color',$(v).attr('rel'));
        })
    },1000);
    
    var year = new Date().getFullYear();
    var range = [];    
    for (i = eval(new Date().getFullYear() + 5); i > 1900; i--) {
        range.push(i);
    }     
    $rootScope.years = range;
    
    /* Change tab number*/
    $rootScope.change_tab_number = function(data){
        $rootScope.tab_number = data;
    }
    
    /* Add new unit cell */
    $scope.addInput = function(index){
        $rootScope.inputs[index].push({field:''});
        $timeout(function(){
            $rootScope.setDropDownColor();
        }, 50);
    }
    
    /* Remove existing unit cell */
    $scope.removeInput = function(parent_index, index){
        //console.log(parent_index + " == " + index);
        var curr_index = index+1;
        if(angular.element('.unit_value_'+parent_index+'_'+curr_index).val() != ''){
            bootbox.confirm("Are you sure you want to remove?", function(result) {
                if(result == true){
                    $rootScope.inputs[parent_index].splice(index,1);
                    $timeout(function(){
                        $rootScope.$apply();
                        $scope.apply_result(parent_index);
                        $rootScope.check_sum("floor_"+parent_index,(index+1), "removeInput");
                    }, 500);   
                    
                }
            });
        } else {
            $rootScope.inputs[parent_index].splice(index,1);
            $timeout(function(){
                $rootScope.$apply();
                $scope.apply_result(parent_index);
            }, 500);
        }
    }
    
    $rootScope.check_sum = function(parent_id, id, from){
        clearTimeout(timeoutID);
  		timeoutID = setTimeout(function() {
  		    var floor_no = parent_id.replace("floor_", ""); 
            var target = angular.element('.unit_value_'+floor_no+'_'+id);
            var total_value = '';
            angular.forEach(angular.element('#'+parent_id+' div.unit_box'), function(value, key){
                if(angular.element(value).find('select').val() != undefined && angular.element(value).find('select').val() != '' && angular.element(value).find('select').val() != 'L' && angular.element(value).find('select').val() != 'R' && angular.element(value).find('input').val() != ''){
                    total_value = eval(total_value + parseInt(angular.element(value).find('input').val()));
                }
            });
            
            if(total_value > 100){
                if(from != 'removeInput'){
                    target.val('');
                }
                target.css({border: '1px solid red'});
                $scope.apply_result(floor_no);
                $timeout(function(){
                    target.css({border: '1px solid #e5e5e5'});
                }, 2000);
            } else {
                angular.element('#'+parent_id).removeClass('unit_value_error');
                $scope.apply_result(floor_no);
            }
            
        }, 200);
    }
    
    /* Get order and is_default from city */
    $rootScope.get_order = function(city_id){
        if(city_id != '' && city_id != undefined){
            clearTimeout(timeoutID);
      		timeoutID = setTimeout(function() {
                $http({
                    method: 'GET',
                    url: GLOBAL.API_URL+"buildings/city-order/"+city_id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status) {
                    var order_no = data.trim();
                    if(order_no != '' && order_no > 0){
                        $rootScope.edit_fields.i_order = order_no;
                    }
                });
            }, 200);    
        }
    }
    
    /* Change drop down color */
    $rootScope.setDropDownColor = function(){
        angular.forEach(angular.element('.change_color'), function(v, k){
            var color = angular.element(v).find(':selected').attr('rel');
            var fontColor = "#FFFFFF";
            if(color != "#FFFFFF"){
                fontColor = "#FFFFFF";
            } else {
                fontColor = "#000000";
            }
            if(angular.element(v).val() != '' && angular.element(v).val() != undefined){
                if(color == '#000000'){
                    angular.element(v).parent('div').next('div').find('input').css('background-color','');
                    angular.element(v).parent('div').next('div').find('input').css('color',fontColor);
                } else {
                    angular.element(v).parent('div').next('div').find('input').css('background-color',color);
                    angular.element(v).parent('div').next('div').find('input').css('color',fontColor);
                }
            } else {
                angular.element(v).parent('div').next('div').find('input').css('background-color','');
                angular.element(v).parent('div').next('div').find('input').css('color',fontColor);
            }
        });
    }
    
    $rootScope.check_value = function(event){
        $rootScope.old_left_value = '';
        $rootScope.old_right_value = '';
        var unit_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('select').val();
        var input_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('input').val();
        if(unit_val == 'L') { 
            $rootScope.old_left_value = input_val; 
        } else if(unit_val == 'R') { 
            $rootScope.old_right_value = input_val; 
        }
        
    }
    
    /* Apply left and right margin to all floors */
    $rootScope.apply_to_all_floors = function(event, floor_no){
        /* Apply left and right margin to all floors */
        if(floor_no == 1){
            var unit_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('select').val();
            var input_val = angular.element(event.target).parent().parent('div.floor.unit_box').find('input').val();
            if(unit_val == 'L' || unit_val == 'R' && input_val != ''){
                if(unit_val == 'L') { 
                    var unit_name = 'left'; 
                    var old_value = $rootScope.old_left_value;
                } else if(unit_val == 'R') { 
                    var unit_name = 'right'; 
                    var old_value = $rootScope.old_right_value;
                }
                if(old_value != input_val){
                    bootbox.confirm("Would you like to apply "+unit_name+" margin to all floors?", function(result) {
                        if(result == true){
                            for(var i = 2; i<=$rootScope.edit_fields.i_floor_number; i += 1){
                                if(unit_val == 'L'){
                                    angular.element('#floor_'+i+' .left_margin_value').val(input_val);
                                } else {
                                    angular.element('#floor_'+i+' .right_margin_value').val(input_val);
                                }
                            }
                            $scope.apply_result();
                        }
                    });
                }
            }
        }            
    }
    
    /* Apply changes on building (if floor_num not passed then it reset all floors of building) */
    $scope.apply_result = function(floor_num){
        var l_array = []; 
        var r_array = [];
        if(floor_num == undefined || floor_num == ''){
            var e = 1;
            angular.forEach(angular.element('.main_unit_box'), function(value, key)
            {
                var floor_num = e;
                angular.element('#floor-'+floor_num).html('');
                angular.forEach(angular.element(value).find('.unit_box'), function(vl, ky){
                    var select_val = angular.element(vl).find('select').val();
                    var color = angular.element(vl).find('select').find(':selected').attr('rel');
                    var percent_val = angular.element(vl).find('input').val();
                    if(select_val != '' && percent_val != ''){
                        
                        if(select_val == 'L' || select_val == 'R'){
                            var style_attr = '';
                            if(select_val == 'L'){
                                style_attr = 'margin-left';
                                l_array.push(percent_val);
                            } else if(select_val == 'R'){
                                style_attr = 'margin-right';
                                r_array.push(percent_val);
                            } 
                            angular.element('#floor-'+floor_num).css(style_attr,percent_val+'%').removeClass('clearfix');
                            
                        } else {
                            angular.element('#floor-'+floor_num).append('<div style="height:'+$rootScope.floor_height+'em;width:'+percent_val+'%; background-color:'+color+'" class="unit">&nbsp;</div>').removeClass('clearfix');        
                        }
                    } else if(select_val == 'L' || select_val == 'R' && percent_val == ''){
                        var style_attr = '';
                        if(select_val == 'L'){
                            style_attr = 'margin-left';
                        } else if(select_val == 'R'){
                            style_attr = 'margin-right';
                        } 
                        angular.element('#floor-'+floor_num).css(style_attr,'');
                    }
                });
                e += 1;
            });
            
        } else {
            angular.element('#floor-'+floor_num).html('');
            angular.forEach(angular.element('#floor_'+floor_num).find('.unit_box'), function(vl, ky){
                var select_val = angular.element(vl).find('select').val();
                var color = angular.element(vl).find('select').find(':selected').attr('rel');
                var percent_val = angular.element(vl).find('input').val();
                if(select_val != '' && percent_val != ''){
                    
                    if(select_val == 'L' || select_val == 'R'){
                        var style_attr = '';
                        if(select_val == 'L'){
                            style_attr = 'margin-left';
                        } else if(select_val == 'R'){
                            style_attr = 'margin-right';
                        } 
                        angular.element('#floor-'+floor_num).css(style_attr,percent_val+'%').removeClass('clearfix');
                        
                    } else {
                        angular.element('#floor-'+floor_num).append('<div style="height:'+$rootScope.floor_height+'em;width:'+percent_val+'%; background-color:'+color+'" class="unit">&nbsp;</div>').removeClass('clearfix');        
                    }
                } else if(select_val == 'L' || select_val == 'R' && percent_val == ''){
                    var style_attr = '';
                    if(select_val == 'L'){
                        style_attr = 'margin-left';
                    } else if(select_val == 'R'){
                        style_attr = 'margin-right';
                    } 
                    angular.element('#floor-'+floor_num).css(style_attr,'');
                }
            });
        }
        
    };
    
    /* Back to building information tab */    
    $rootScope.back_to_building_information = function(){
        angular.element('#building_tab').trigger('click');
        anchorSmoothScroll.scrollTo('form_wizard_1'); 
    };
    
    /* After html content loaded, Execute all data and plugin initialization */            
    $scope.$on('$viewContentLoaded', function() {
        FormWizard.init();
        $http.defaults.headers.post['Content-Type'] = $headerData;
        
        var responsePromise = $http.get(GLOBAL.API_URL+"buildings/edit/"+$stateParams.id);
        responsePromise.success(function(data, status, headers, config) {
            if(data.cities != "" && data.cities != undefined) {
                
                $rootScope.edit_fields = data.buildings;
                $rootScope.cities = data.cities;
                
                $rootScope.all_cities_data = data.all_cities_data;
                $rootScope.floors = data.floors;
                $rootScope.unit_assets = data.unit_assets;
                
                $scope.edit_count = $rootScope.edit_fields.i_floor_number;
                for (var i = 1; i <= $scope.edit_count; i += 1) {
                    $rootScope.inputs[i] = [{value:''}];
                } 
                
                $timeout(function(){
                    var i = 1;
                    angular.forEach($rootScope.floors, function(value, key) {
                        if(i<=$scope.edit_count){
                            $rootScope.data_rows.push({'id': parseInt(i),'val': value.t_config});
                            if(value.t_config != '' && value.t_config != undefined &&value.t_config != '{"":""}'){
                                var j = 1;
                                var value_config = value.t_config.replace(/\{/g, '[{');
                                value_config = value_config.replace(/}/g, '}]');
                                value_config = value_config.replace(/,/g, '},{');
                                
                                if (/^[\],:{}\s]*$/.test(value_config.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                                    var obj_count = JSON.parse(value_config).length;
                                
                                    angular.forEach(JSON.parse(value_config), function(v1, k1)
                                    {
                                        angular.forEach(v1, function(v, k)
                                        {
                                            if(j <= obj_count && k != 'L' && k != 'R'){
                                                $rootScope.inputs[i].push({value:''});
                                                j += 1;
                                            }
                                        });                                
                                        
                                    });    
                                } else {
                                    console.log("Not Valid");
                                }
                            }
                            i += 1;
                        }
                    });
                    if(data.buildings.i_floor_number != data.floors.length){
                        /* If floor count wrong when load edit data do something for generate floors on tab2 as per "No of Floors" count */
                        if(data.buildings.i_floor_number > data.floors.length){
                            var start_with = data.floors.length+1;
                            var addition_count = eval(data.floors.length+(data.buildings.i_floor_number-data.floors.length));
                            for(i = start_with; i <= addition_count; i++){    
                                $rootScope.data_rows.push({'id': parseInt(i),'val': '{"":""}'});
                            }
                        } 
                    }
                    $timeout(function(){
                        var e = 1;
                        angular.forEach($rootScope.floors, function(value, key)
                        {
                            //angular.element('.select_'+e+'_1').val(angular.element('.select_'+e+'_1 option:first').val());
                            if(value.t_config != '' && value.t_config != undefined && value.t_config != '{"":""}'){
                                var value_config = value.t_config.replace(/\{/g, '[{');
                                value_config = value_config.replace(/}/g, '}]');
                                value_config = value_config.replace(/,/g, '},{');
                                var y = 1;
                                
                                if(/^[\],:{}\s]*$/.test(value_config.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))) {
                                    var floor_inc_no = 0;
                                    var total_floor_count = 0;
                                    angular.forEach(JSON.parse(value_config), function(v1, k1){
                                        angular.forEach(v1, function(v, k){   
                                            if(k == 'L'){
                                                angular.element('#floor_'+e+' .left_margin_value').val(v);
                                                //angular.element('.unit_value_'+e+'_1').val(v);
                                            } else if(k == 'R') {
                                                angular.element('#floor_'+e+' .right_margin_value').val(v);
                                                //angular.element('.unit_value_'+e+'_2').val(v);
                                            } else {
                                                angular.element('.select_'+e+'_'+y).val(k);
                                                angular.element('.unit_value_'+e+'_'+y).val(v);
                                                total_floor_count = total_floor_count + parseInt(v);
                                                y += 1;  
                                            }
                                            
                                            if(k!='' && v != ''){
                                                var color = angular.element('.select_'+e+'_'+y).find(':selected').attr('rel');
                                                var percent_val = v;
                                                if(k == 'L' || k == 'R'){
                                                    var style_attr = '';
                                                    if(k == 'L'){
                                                        style_attr = 'margin-left';
                                                    } else if(k == 'R'){
                                                        style_attr = 'margin-right';
                                                    } 
                                                    angular.element('#floor-'+e).css({style_attr:v+'%'}).removeClass('clearfix');
                                                    
                                                } else {
                                                    angular.element('#floor-'+e).append('<div style="height:'+$rootScope.floor_height+'em; width:'+v+'%; background-color:'+color+'" class="unit">&nbsp;</div>').removeClass('clearfix');        
                                                }
                                            }
                                        });
                                        floor_inc_no++;
                                    });
                                    if(total_floor_count > 100){
                                        $rootScope.floor_unit_value_exceeded_status++;                                        
                                        angular.element('#floor_'+e).addClass('unit_value_error');
                                    }
                                } else {
                                    console.log("Not Valid");
                                }
                            } else {
                               angular.element('.select_'+e+'_'+y).val("1");
                               angular.element('.unit_value_'+e+'_'+y).val('');  
                            }
                            e += 1;
                        });
                        $timeout(function(){                                                
                            $rootScope.setDropDownColor();
                        }, 1500);                                                
                    }, 1000);
                }, 500);
                  
                //For Image
                $scope.validImage = 1;
                if($rootScope.edit_fields.v_image_url != ''){
                    $scope.imageDataURI = GLOBAL.SITE_URL + GLOBAL.BUILDING_IMAGE_PATH + $rootScope.edit_fields.v_image_url;
                    $scope.enableCrop = true;
                    $scope.image_type = "Existing";
                } else {
                    $scope.imageDataURI='';
                    $scope.enableCrop = false;
                    $scope.image_type = "New";
                }
            }
            
            if(data.list_unit_assets != "" && data.list_unit_assets != undefined) {
                $rootScope.list_unit_assets = data.list_unit_assets;
                $rootScope.list_unit_assets.M = {color:"#FFFFFF",name:"Middle"};
            }
            $rootScope.get_floor_height($rootScope.edit_fields.i_city_id);
            
        });
        
        var handleFileSelect = function(evt) 
        {     
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
            $scope.image_type = "New";
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
                
                $scope.$apply(function($scope) {
                    if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/svg+xml;base64") >= 0) {
                        if(file_size < GLOBAL.MAX_UPLOAD_SIZE * 1000) {
                            $scope.validImage = 1;
                            $scope.enableCrop = true;
                            angular.element('#image_name').text(file.name);
                            angular.element('#original_image_name').val(file.name);
                            $scope.imageDataURI = evt.target.result;   
                        } else {
                            $scope.validImage = 0;
                            //$scope.error_message = GLOBAL.INVALID_IMAGE_SIZE;
                        }
                    } else {
                        $scope.validImage = 0;
                        $scope.error_message = GLOBAL.INVALID_IMAGE_EXTENSION;
                        alert('You have uploaded an invalid image file type.');                                                            }
                });
            };
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').addClass('hide'); 
            reader.readAsDataURL(file); 
        };
        
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        
        $scope.trigger = function(elem) {
            $(elem).trigger('click');
        };
    });
    
    /* To get floor height */
    $rootScope.get_floor_height = function(city_id){
        if(city_id != undefined && city_id != ''){
            $rootScope.floor_height = $rootScope.all_cities_data[city_id].d_floor_height;
        } else {
            $rootScope.floor_height = '';
        }
        $scope.new_floor_height = $rootScope.floor_height;
        angular.element('#city_name').val($rootScope.all_cities_data[city_id].v_name);
    }
    
    /* Check sum of unit value floor wise */
    /*$rootScope.check_sum = function(parent_id, event){
        clearTimeout(timeoutID);
  		timeoutID = setTimeout(function() {
  		    var floor_no = parent_id.replace("floor_", ""); 
            var target = angular.element(event.target);
            var total_value = '';
            angular.forEach(angular.element('#'+parent_id+' div.unit_box'), function(value, key){
                if(angular.element(value).find('select').val() != undefined && angular.element(value).find('select').val() != '' && angular.element(value).find('select').val() != 'L' && angular.element(value).find('select').val() != 'R' && angular.element(value).find('input').val() != ''){
                    total_value = eval(total_value + parseInt(angular.element(value).find('input').val()));
                }
            });
            
            if(total_value > 100){
                target.val('');
                target.css({border: '1px solid red'});
                $scope.apply_result(floor_no);
                $timeout(function(){
                    target.css({border: '1px solid #e5e5e5'});
                }, 2000);
            } else {
                angular.element('#'+parent_id).removeClass('unit_value_error');
                $scope.apply_result(floor_no);
            }
            
        }, 200);
    }*/
    
    
    
    $rootScope.html_to_canvas = function(){
        /* For min margin of left and right */
        var l_array = []; 
        var r_array = [];
        var e = 1;
        var building_mask_width = angular.element('#city_grid_image').width();
        if(building_mask_width >= 300){
            var zoom = 5;
        } else {
            var zoom = 10;
        }
        
        angular.forEach(angular.element('.main_unit_box'), function(value, key) {
            var floor_num = e;
            angular.forEach(angular.element(value).find('.margin_group'), function(vl, ky){
                var select_val = angular.element(vl).find('select').val();
                var percent_val = angular.element(vl).find('input').val();
                if(percent_val != ''){
                    if(select_val == 'L'){
                        l_array.push(percent_val);
                    } else {
                        r_array.push(percent_val);
                    }
                } 
            });
            e += 1;
        });
                
        var imageH, imageW, buildingH;        
        var newImg = new Image();   
        newImg.onload = function() {
            angular.element('#original_image_width').val(newImg.width);
            imageH = newImg.height * zoom;
            imageW = newImg.width * zoom;
            buildingH = angular.element('#floors').height() *  zoom;
            
            var min_left = 0;
            if (l_array.length !== 0) {
                var min_left = Math.min.apply(Math,l_array);
                var left_pixel = Math.floor((min_left*zoom)*imageW/100)-5*zoom;
            }
            
            if(left_pixel < 0 || left_pixel == '' || left_pixel == undefined){
                left_pixel = 0;
            }
            
            var min_right = 0;
            if(r_array.length !== 0){
                var min_right = Math.min.apply(Math,r_array);
                var right_pixel = Math.floor((min_right*zoom)*imageW/100)-5*zoom;
            }
                        
            if(right_pixel < 0 || right_pixel == '' || right_pixel == undefined){
                right_pixel = 0;
            }
            //angular.element('#city_grid_image').css('opacity', 1);
            var transparent_image_url = GLOBAL.SITE_URL+GLOBAL.TRANSPARENT_CITY_BACKGROUND_IMAGE_PATH+$rootScope.edit_fields.city.v_background_image_url;            
                        
            /* For plain image */
            angular.element('#generate_building_image2').css({'width':imageW,'height':imageH, 'background-color':$rootScope.list_unit_assets[1].color}).html('<div style="width:'+imageW+'; position: relative;"><div class="form-title"><div id="building_image2"></div></div></div>').show();
            angular.element('#building_image2').html(angular.element('#building').html()).css('width',imageW).css('height',imageH);
            angular.element('#building_image2 img').css({ 'width':imageW, 'height':imageH, 'top':'0px', 'left':'0px', 'z-index':'999' });
            angular.element('#generate_building_image2 .floors').css({'padding-top': eval(imageH - buildingH)+"px", 'z-index':'99'});
            angular.element('#generate_building_image2 .floor_div:last').css('border-bottom','0.01px solid #C7C9CC');
            angular.element('#generate_building_image2 .floor_div:last .unit').css('border-bottom','0.01px solid #C7C9CC');
            //angular.element('#generate_building_image2 .img2').attr('src', transparent_image_url).css('opacity', 1).css('position','absolute');
            angular.element('#generate_building_image2 .img2').remove();            
            angular.forEach(angular.element('#generate_building_image2 div'), function(v,k){
                angular.element(v).css({'height':$rootScope.floor_height*zoom+'em'});
            });
            angular.forEach(angular.element('#generate_building_image2 .floors').find('.floor_div'), function(v,k){
                angular.element(v).css('border-top', zoom+'px solid #EBEBF4');
            });
            angular.forEach(angular.element('#generate_building_image2 .floors').find('.unit'), function(v,k){
                angular.element(v).css('border-bottom', zoom+'px solid #EBEBF4');
            });
            //angular.element('#generate_building_image2 .additional_background_color').css({'height': angular.element('#generate_building_image2 .floors').css('padding-top')});
            //angular.element('#generate_building_image2 .floors').css({'padding-top': ''});
            
            //angular.element('#generate_building_image2').css('background','url("1-trans-bg.png") no-repeat scroll 0 0 / 100% 100% rgba(0, 0, 0, 0)');                                    
            setTimeout(function(){
                return generate_image(imageW, imageH, left_pixel, right_pixel, zoom);
            }, 1500);
        }
        newImg.src = angular.element('#building').find('img').attr('src');
        /* For graph image */
    }
    
    /* To edit floor height on the fly but it can not affect original floor height of city */
    $rootScope.edit_floor_height = function(){
        $('#floorHeightForm').show();
        bootbox.dialog({
            title: 'Edit floor height.',
            message: $('#floorHeightForm'),
            show: true // We will show it manually later
        })
        .on('shown.bs.modal', function() {
            $('#floorHeightForm').show();
            angular.element('.error_required').hide();
            angular.element('.error_exceeded').hide();
            setTimeout(function(){
                $('#floorHeightForm').validate('resetForm', true);
                angular.element('#floor_height').val($rootScope.floor_height);    
            }, 500);
        })
        .on('hide.bs.modal', function(e) {
            $('#floorHeightForm').hide().appendTo('body');
            angular.element('.error_required').hide();
            angular.element('.error_exceeded').hide();
        }).modal('show');
    }
    
    $scope.change_floor_height =  function(new_floor_height){
        
        if(new_floor_height == '' || new_floor_height == undefined){
            setTimeout(function(){
                angular.element('.error_required').css('display', 'block');
                angular.element('#floor_height').show();
            }, 200);
        } else {
            angular.element('.error_required').hide();
            $rootScope.floor_height = new_floor_height;
            var imageH;        
            var newImg = new Image();   
            newImg.onload = function() {
                var imageH = newImg.height;
                var imageW = newImg.width;
                angular.element('#city_grid_image').attr('height',imageH).attr('width',imageW);
                var buildingH = angular.element('#floors').height();
                if(buildingH <= 350){
                    angular.element('.error_exceeded').hide();
                    if(imageH > buildingH) {
                        angular.element('#floors').attr('style', 'padding-top: '+(eval(imageH - buildingH))+"px");
                    } else {
                        angular.element('#floors').attr('style', 'padding-top: 0px');
                    }
                    setTimeout(function(){
                        $scope.apply_result();
                        $scope.apply_only_floor_height();
                        bootbox.hideAll();    
                        angular.element('.error_required').hide();
                        angular.element('.error_exceeded').hide();
                    }, 500);   
                    angular.element('#building').css('width',imageW+"px");             
                } else {
                    $rootScope.get_floor_height($rootScope.edit_fields.i_city_id);
                    setTimeout(function(){
                        angular.element('.error_exceeded').show();
                        angular.element('#floor_height').css('border', '1px solid red');
                    }, 200);
                    setTimeout(function(){
                        $scope.apply_result();
                        $scope.apply_only_floor_height();
                        $scope.new_floor_height = $rootScope.floor_height;
                        angular.element('#floor_height').val($rootScope.floor_height);
                    }, 500);      
                }
            }
            newImg.src = angular.element('#building').find('img').attr('src');            
        }
    }
    
    /* Apply on floor height to buildings floor */
    $scope.apply_only_floor_height = function(){
        angular.forEach(angular.element('#floors').find('div'), function(v, k){
            angular.element(v).css('height', $rootScope.floor_height+"em");
        });
    };
    
    /* Submit form wizard ( Building and Floor information )*/
    $rootScope.submit_floor_frm_edit = function(){
        if(angular.element('.unit_value_error').length <= 0){
            $rootScope.floor_save_status = 1;
            //$rootScope.submit_building_frm_edit($rootScope.edit_fields,'tab');
            anchorSmoothScroll.scrollTo('form_wizard_1');        
            var canvas_status = $rootScope.html_to_canvas();
            if(form_valid('#frmEdit',"help-block")){
                angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
                clearTimeout(timeoutID);
        		timeoutID = setTimeout(function() {                            
                            angular.forEach(angular.element('.floor'), function(v, k){
        		        if(angular.element(v).find('input').val() <= 0 || angular.element(v).find('input').val() == ''){
        		            angular.element(v).remove(); 
        		        }        		      
        		    }); 
        		    var form_data = $('#frmEdit').serialize();
                    $http({
                        method: 'POST',
                        url: GLOBAL.API_URL+"buildings/edit",
                        data: form_data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function(data, status) {
                        if(data == 'TRUE'){
                            $timeout(function(){
                                angular.copy({}, $rootScope.edit_fields);
                                document.getElementById("frmEdit").reset();
                                //angular.element('.change_color').css('background-color','');
                                angular.element('#image_name').text('');
                                angular.element('#original_image_name').val('');
                                angular.element('#image_1').attr('src','');
                                $rootScope.inputs = [];
                                $rootScope.data_rows = [];
                                $scope.enableCrop = false;
                                $scope.resImageDataURI='';
                                $scope.validImage = 1;
                                $rootScope.$apply();
                                angular.element('.alert-success').fadeIn(1000);
                                angular.element('.alert-success').fadeOut(2000);
                                angular.element('.alert').hide();
                                angular.element('#floor_tab').removeAttr('data-target').removeAttr('data-toggle');
                                //angular.element('#building_tab').trigger('click');
                                angular.element('div.loading').addClass('hide');
                                $state.go('/buildings');
                            },100);
                        }
                        $rootScope.floor_save_status = 0;
                    });
                }, 9000); 
                $rootScope.tab_number = 1;     
            }
        } else {
            bootbox.alert("Please check floor data. Sum of unit values must be less or equal to 100.", function() {
                angular.element('html, body').animate({
                    scrollTop: angular.element(".unit_value_error").offset().top - 100
                }, 500);
            });
        }
    }
    
    /* Validate building information and go to floor information tab */
    $rootScope.submit_building_frm_edit = function(edit_fields, click_from){
        angular.element('#tab2').hide();
        if(form_valid('#frmEdit',"help-block")){
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
            
            if(click_from == 'save_and_exit'){
                var timeout1 = 0;
                var timeout2 = 0;
            } else {
                var timeout1 = 1000;
                var timeout2 = 2000;
            }
            
            if(click_from != 'save_and_exit'){
                /* Apply floors(data_rows) and unit cells(inputs) */
                angular.element('#image_1').attr('src',$scope.imageDataURI);
                var new_row_count = edit_fields.i_floor_number - $scope.edit_count;
                if(new_row_count > 0){
                    for (var i = parseInt($scope.edit_count)+1; i <= parseInt(edit_fields.i_floor_number); i += 1) {
                        $rootScope.data_rows.push({'id': parseInt(i),'val': 'row_' + parseInt(i)});
                        $rootScope.inputs[i] = [{value:''}];
                    }
                } else if(new_row_count < 0){
                    var remove_items = angular.element('#remove_items').val();
                    for (var i = parseInt($scope.edit_count); i >= parseInt(edit_fields.i_floor_number)+1; i -= 1) {
                        $rootScope.data_rows.splice(parseInt(i)-1, 1);
                        if(remove_items != ''){
                            remove_items = remove_items+','+i;
                        } else {
                            remove_items = i;
                        }
                    }
                    angular.element('#remove_items').val(remove_items);
                }
                $scope.edit_count = $rootScope.edit_fields.i_floor_number;
                angular.forEach(angular.element('#floors div'), function(v, k){
                    angular.element(v).css('height', $rootScope.floor_height+'em');
                });
                
                /* Add address to tab 2 */
                var building_address_added = '';
                if(edit_fields.v_address1 != '' && edit_fields.v_address1 != undefined){
                    building_address_added = building_address_added + edit_fields.v_address1; 
                }
                if(edit_fields.v_address2 != '' && edit_fields.v_address2 != undefined){
                    building_address_added = building_address_added + ", " +edit_fields.v_address2; 
                }
                if(edit_fields.i_city_id != '' && edit_fields.i_city_id != undefined){
                    building_address_added = building_address_added +  ", " +$rootScope.all_cities_data[edit_fields.i_city_id].v_name; 
                }
                if(edit_fields.v_state != '' && edit_fields.v_state != undefined){
                    building_address_added = building_address_added +  ", " +edit_fields.v_state; 
                }
                if(edit_fields.v_zip != '' && edit_fields.v_zip != undefined){
                    building_address_added = building_address_added +  ", " +edit_fields.v_zip; 
                }
                
                $rootScope.tab1_building_address = building_address_added;
            }
            $timeout(function(){
                if(click_from != 'save_and_exit'){
                    /* Setup to display mask image on floors div */
                    var imageH;        
                    var newImg = new Image();   
                    newImg.onload = function() {
                        var imageH = newImg.height;
                        var imageW = newImg.width;
                        angular.element('#city_grid_image').attr('height',imageH).attr('width',imageW);
                        var buildingH = angular.element('#floors').height();
                        if(imageH > buildingH) {
                            angular.element('#floors').attr('style', 'padding-top: '+(eval(imageH - buildingH))+"px");
                        } else {
                            angular.element('#floors').attr('style', 'padding-top: 0px');
                        }
                        angular.element('#building').css('width',imageW+"px");
                    }
                    newImg.src = angular.element('#building').find('img').attr('src');
                }
                //Call submit data services
                
                if(click_from == 'continue'){
                    angular.element('#floor_tab').attr('data-target', '#tab2').attr('data-toggle', 'tab').trigger('click');
                }               
                angular.element('.progress-bar-success').css('width', '100%');  
                if(click_from != 'save_and_exit'){
                    $rootScope.tab_number = 2;            
                    anchorSmoothScroll.scrollTo('form_wizard_1');
                    $rootScope.setDropDownColor();
                    $scope.apply_result();
                    angular.element('#tab2').show();
                    angular.element('#building').css('background-color', 'lightblue');
                }
                setTimeout(function(){
                    if(click_from == 'save_and_exit'){
                        if($rootScope.floor_save_status == 1){
                            $rootScope.submit_floor_frm_edit();
                        } else {
                            if(form_valid('#frmEdit',"help-block")){
                                clearTimeout(timeoutID);
                        		timeoutID = setTimeout(function() {
                        		    var form_data = $('#frmEdit').serialize();
                                    $http({
                                        method: 'POST',
                                        url: GLOBAL.API_URL+"buildings/edit",
                                        data: form_data,
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                    }).success(function(data, status) {
                                        if(data == 'TRUE'){
                                            $timeout(function(){
                                                angular.copy({}, $rootScope.edit_fields);
                                                document.getElementById("frmEdit").reset();
                                                //angular.element('.change_color').css('background-color','');
                                                angular.element('#image_name').text('');
                                                angular.element('#original_image_name').val('');
                                                angular.element('#image_1').attr('src','');
                                                $rootScope.inputs = [];
                                                $rootScope.data_rows = [];
                                                $scope.enableCrop = false;
                                                $scope.resImageDataURI='';
                                                $scope.validImage = 1;
                                                $rootScope.$apply();
                                                angular.element('.alert-success').fadeIn(1000);
                                                angular.element('.alert-success').fadeOut(2000);
                                                angular.element('.alert').hide();
                                                angular.element('div.loading').addClass('hide');
                                                $state.go('/buildings');
                                            },100);
                                        }
                                        $rootScope.floor_save_status = 0;
                                    });
                                }, 500); 
                                $rootScope.tab_number = 1;     
                            }
                        }
                    } else {
                        $rootScope.floor_save_status = 1;
                        angular.element('div.loading').addClass('hide');
                    }
                }, timeout1);
            }, timeout2);
            
        } else {
            $rootScope.valid_img =  1;
            return false;
        }                
    }
});