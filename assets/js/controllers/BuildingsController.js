'use strict';
/*app.filter('datetime', function($filter)
{
     return function(input)
     {
          if(input == null){ return ""; } 
          var newTime = new Date( $scope.date + ' ,' + $scope.time).getTime()
         
          var _date = $filter('date')(new Date(newTime),
                                      'MMM dd yyyy - HH:mm:ss');
         
          return _date.toUpperCase();
    
     };
});*/

app.controller('BuildingsController', function($rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $filter, $state, $stateParams) {
    
    /*$scope.totime = function(){
        
    }*/
       
    /* Begin add form */
    $rootScope.filename = '';
    $rootScope.parent_items = {};
    $rootScope.add_fields = {};
    $rootScope.edit_fields = {};
    $rootScope.view_data = {};
    $rootScope.selected_record = {};
    $rootScope.prev_record = false;   
    $rootScope.nexts_record = false;
    $rootScope.valid_img = 0;
    $rootScope.current_page = 1;
    $rootScope.page = 1;
    $rootScope.edit_original_data = {};
    
    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"buildings","buildings.updated_at");
        var handleImportFile = function(evt) 
        {    
            angular.element('div.loading').css('background','rgba(0,0,0,0.6)').removeClass('hide');
            $scope.image_type = "New";
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                var w = this.width, h = this.height, t = file.type, n = file.name, file_size = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
                
                $scope.$apply(function($scope) {
                    if (evt.target.result.toLowerCase().indexOf("data:application/octet-stream;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:application/vnd.ms-excel;base64") >= 0 || 
 evt.target.result.toLowerCase().indexOf("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:application/download;base64") >= 0) {
                    
                        if(evt.target.result.toLowerCase().indexOf("data:application/vnd.ms-excel;base64") >= 0){
                            var ext = 'xls';
                        } else if(evt.target.result.toLowerCase().indexOf("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64") >= 0){
                            var ext = 'xlsx';
                        } else {
                            var ext = 'csv';
                        }
                        var responsePromise = $http.post(GLOBAL.API_URL+'buildings/import-to-excel',{'data':evt.target.result, 'ext': ext});
                        responsePromise.success(function(data, status1, headers, config) 
                        {
                            if(data == 'TRUE'){
                                PaginationService.loading(GLOBAL.API_URL+"buildings","buildings.v_name");
                            }
                            angular.element('div.loading').addClass('hide');
                        });
                    } else {
                        angular.element('div.loading').addClass('hide');
                        bootbox.alert("Please select excel file.") 
                        $scope.validImage = 0;  
                    }                                                             
                });
            };
            reader.readAsDataURL(file); 
        };
        angular.element(document.querySelector('#import_excel')).on('change',handleImportFile);
    });
    
    $scope.import_to_excel = function(elem) { 
        $(elem).trigger('click');
    };
    
    if($stateParams.id != "" && $stateParams.id != undefined)
    {
        if(mySharedService.edit_fields != undefined) {
            $rootScope.frm_edit_open(mySharedService.edit_fields);
        } else {
            var responsePromise = $http.post(GLOBAL.API_URL+"users/data/"+$stateParams.id);
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
        
        window.location.href = GLOBAL.API_URL+'buildings/export/'+$scope.someModelSerialized;
    }
    
    
    /* Begin edit form */
    $rootScope.loadEditData = function(item){
        $rootScope.edit_fields = item;
        mySharedService.edit_fields = $rootScope.edit_fields; 
        //$rootScope.$broadcast($rootScope.edit_fields1);
        $state.go('/buildings-edit',{id: item.id});
    }
    
    /* Begin edit form */
    $rootScope.frm_edit_open = function(item)
    {
        angular.element('.alert').hide();
        $rootScope.edit_fields = item;
        $("#frmEdit .form-group").removeClass('has-error');
        $("#frmEdit .required").removeAttr('style');
        $("#frmEdit .help-block-error").remove();
        $('.dropzone').show();

        /* Set dropdown values */
        $scope.edit_fields.e_status = item.e_status;
        $scope.edit_fields.e_title = item.e_title;
        
        if(item.v_image != '' && $(".ie9").length == 0){

            angular.element('.dropzone').html5imageupload( { image: GLOBAL.SITE_URL+'images/default_avatar.jpg', height: '200px', width: '300px', editstart: true } );
            angular.element("#h_v_img").val($rootScope.items.v_image); 
        }

        angular.element("#frm_v_img").prependTo("#upload_background_image"); 

        angular.element(".dropzone .tools .btn-cancel").trigger("click");
    }
    
    $rootScope.submit_frm_edit = function(edit_fields){
        
        if(form_valid('#frmEdit',"help-block")){
            
            //Call submit data services            
            PaginationService.submit_edit_form_data(GLOBAL.API_URL+"users/edit", edit_fields, '/users');
            $rootScope.success_msg = 'Record update successfully.';
            // To clear form elements
            setTimeout(function(){
                angular.copy({}, edit_fields);
                $rootScope.$apply();
                angular.element('.alert-success').fadeIn(1000);
                angular.element('.alert-success').fadeOut(2000);
                angular.element('.alert').hide();
            },1000);
        }                
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
    $scope.check_all = function(checkAll,parent) { 
      
        $timeout(function(){ 
            angular.forEach($scope.items , function(data){
                $scope.selected_record[data.id] = checkAll; 
            }); 
            if(parent){
                $scope.selected_record[0] = false;
            }
        }, 1000);
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
                  var responsePromise = $http.post(GLOBAL.API_URL+'buildings/bulk-actions',{'id':$rootScope.ids,'action':$status});
                   responsePromise.success(function(data, status1, headers, config) {
                        angular.forEach($rootScope.items, function(val){ // selected_record is ng-model name of checkbok

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
    
    /* Delete Building */
    $rootScope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                PaginationService.delete_data(GLOBAL.API_URL+"buildings/delete",id);
                
                $rootScope.success_msg = 'Record deleted successfully.';
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
        $state.go('/users');
    };
});

/*myApp.directive("addDiv", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			scope.count++;
			angular.element(document.getElementById('space-for-buttons')).append($compile("<div><button class='btn btn-default' data-alert="+scope.count+">Show alert #"+scope.count+"</button></div>")(scope));
		});
	};
});*/

