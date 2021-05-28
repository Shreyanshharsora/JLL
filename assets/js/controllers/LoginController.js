'use strict';

app.controller('LoginController',['$rootScope', '$scope', '$http', '$timeout','GLOBAL','$state','$cookieStore','$location','GlobalVariables', function($rootScope, $scope, $http, $timeout,GLOBAL,$state,$cookieStore,$location, GlobalVariables) 
{
	//$scope.v_username = "";
	$scope.v_password = "";
	//$scope.remember = "";
	$scope.email = "";
	$scope.currentYear = new Date().getFullYear();

    $scope.$on('$viewContentLoaded', function() {
        $scope.v_username = $cookieStore.get('email');
        if($scope.v_username != '' && $scope.v_username != undefined){
            $scope.remember = 1;
            angular.element('#remember').attr('checked', 'checked').parent('span').addClass('checked');
        }  
        // initialize core components
        Metronic.initAjax();
        angular.element('.remember').uniform();         
        angular.element('.login-form').show();
    	angular.element('.forget-form').hide(); 

    	if($location.absUrl().indexOf('reset-password') != -1)
    	{
    		var responsePromise = $http.post(GLOBAL.API_URL+'reset-password-status/'+$state.params.access_code);
			responsePromise.success(function(data, status1, headers, config) 
			{
				data = $.trim(data);
				if(data == 0 || data == '0')
				{
					$state.go('/'); // go to login
				}
			});
    	}   
        
         
    });    

    $rootScope.loadForgotPassword = function()
    {
    	angular.element('.login-form').hide();
    	angular.element('.forget-form').show();
    }

    $rootScope.loadLogin = function()
    {
    	angular.element('.login-form').show();
    	angular.element('.forget-form').hide();
    }

    $rootScope.submitLogin = function()
    {
		$(".alert").hide();
        if(form_valid("#login-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_URL+'check-login-status',{'v_username':$scope.v_username,'v_password':$scope.v_password,'remember':angular.element('.remember').attr('checked')});
			responsePromise.success(function(data, status1, headers, config) 
			{
					if(data == "0" || data == 0) {
						angular.element("#login-form .alert-danger").show();
					} else {
					    $cookieStore.put('user_name',$.trim(data.name));
                        if($.trim(data.email) != '' && $.trim(data.email) != undefined){
                            $cookieStore.put('email',$.trim(data.email));
                        } else {
                            $cookieStore.put('email','');
                        }
                        $cookieStore.put('isLogged',$.trim(data.login_status));                        
                        GLOBAL.checkId = true;
                                                
                        var user_name = $cookieStore.get('user_name');
                        $rootScope.user_name = user_name;
                        
                        if(GlobalVariables.intended_url != ''){
                            if(GlobalVariables.intended_url == '/'){
                                $state.go('/dashboard');
                            } else {
                                $location.path(GlobalVariables.intended_url);
                            }
                            GlobalVariables.intended_url = '';
                        } else {
						    $state.go('/dashboard'); // go to login
                        }
					}
			});
        }
        return false;
    }

    $rootScope.submitForgotPassword = function()
    {
		$(".alert").hide();
        if(form_valid("#forget-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_URL+'send-forgot-password',{'email':$scope.email});
			responsePromise.success(function(data, status1, headers, config) 
			{
					if(data == "0" || data == 0)
					{
						angular.element("#forget-form .alert-danger").show();
					}
					else
					{
						angular.element('.login-form').show();
    					angular.element('.forget-form').hide();
						angular.element("#login-form .alert-success").show();
					}
			});
        }
        return false;
    }

    $rootScope.submitResetPassword = function()
    {
		$(".alert").hide();
        if(form_valid("#reset-form")) 
        {
			var responsePromise = $http.post(GLOBAL.API_URL+'reset-password/'+$state.params.access_code,{'password':$scope.v_password});
			responsePromise.success(function(data, status1, headers, config) 
			{
					if(data == "0" || data == 0)
					{
						angular.element("#login-form .alert-danger").show();
					}
					else
					{
						$timeout(function()
						{
							$state.go('/'); // go to login
						},2000);
						angular.element("#reset-form .alert-success").show();
					}
			});
        }
        return false;
    }
}]);