'use strict';
app.controller('CustomSkylineController', function($filter,$rootScope, $scope, $http, $timeout, PaginationService, GLOBAL, mySharedService, $state, $stateParams) {
    
    $rootScope.edit_fields = {};
    $rootScope.success_msg ='';
    $rootScope.selected_record = {};
    
    $scope.$on('$viewContentLoaded', function() {
        $http.defaults.headers.post['Content-Type'] = $headerData;
        $rootScope.fields_reset = 0;
        PaginationService.loading(GLOBAL.API_URL+"custom-skyline","skylines.created_at");
    });
    
    /* For view skyline page*/
    $rootScope.loadEditData = function(item){
        //$rootScope.edit_fields = item;
        /*Don't need to store item in mySharedService, due to notes*/ 
       //mySharedService.edit_fields = $rootScope.edit_fields; 
        $state.go('/custom-skyline-view',{id: item.id});
    }
    
    /*For view skyline page*/
    //if($stateParams.id != "" && $stateParams.id != undefined) {
        var responsePromise = $http.post(GLOBAL.API_URL+"custom-skyline/data/"+$stateParams.id);
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
    //}
    
    $rootScope.frm_edit_open = function(item)
    {
        $rootScope.edit_fields = item;
        //angular.element('.share-email-list').css('height',angular.element('.custom-skyline-details').height());
        setTimeout(function(){angular.element('.share-email-list .scrollable-table').css('height',(angular.element('.custom-skyline-details').height()-40))},200);
    }
    
    /* Delete Note */
    $scope.delete_btn_note = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                $rootScope.DeleteID=id;
                $http.post(GLOBAL.API_URL+"custom-skyline/delete", {id:id}).success(function(data, status, headers, config) {
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $rootScope.success_msg = data.Message;                    
                    if(data.IsSuccess){
                        $scope.noteObj = $filter('filter')($rootScope.items.notes, function (d) {return d.id === id;})[0];
                        var index = $rootScope.items.notes.indexOf($scope.noteObj);
                        $rootScope.items.notes.splice(index,1);

                        angular.element('#tableRow_'+$rootScope.DeleteID).remove();
                        angular.element('.alert-success').fadeIn(30);
                        angular.element('.alert-success').fadeOut(5000);
                    } else {
                        angular.element('.alert-danger').show();
                    }
                });
            }
        }); 
    }
    
    /*Delete Skyline */
    $scope.delete_btn = function(id)
    {
        bootbox.confirm("Are you sure you want to delete this record?", function(result) {
            if(result == true)
            {
                $rootScope.success_msg = 'Record delete successfully.';
                angular.element('.alert-success').fadeIn(500);
                PaginationService.delete_data(GLOBAL.API_URL+"custom-skyline/delete-skyline",id);
                setTimeout(function(){
                    $rootScope.$apply();
                    setTimeout(function(){
                        angular.element('.alert-success').fadeOut(2000);
                    },1000);
                },500);
            }
        }); 
    }
    
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
               if($status =='del')
               {
                    //status = 'deleted';
                    massage = 'delete';
               }
               var row_count = 0;
               bootbox.confirm("Are you sure you want to "+ massage+" selected record?", function(result) {
                if(result == true)
                {
                    var responsePromise = $http.post(GLOBAL.API_URL+'custom-skyline/bulk-actions',{'id':$rootScope.ids,'action':$status});
                    responsePromise.success(function(data, status1, headers, config) {
                        if(data == "1"){
                            angular.forEach($rootScope.ids, function(val){
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
                                    PaginationService.loading(GLOBAL.API_URL+"custom-skyline","skylines.created_at");
                                    $rootScope.$apply();
                                    angular.element('.alert-success').fadeIn(1000);
                                    angular.element('.alert-success').fadeOut(2000);
                                },500);
                                $("html, body").animate({ scrollTop: 0 }, "slow");                            
                            }
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
});

