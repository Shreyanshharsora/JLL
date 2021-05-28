var timeOut;

/* Admin App */
var app = angular.module("app", [
    "ui.router",
    'ngResource',
    "ui.bootstrap",
    "ngSanitize",
    'ngImgCrop',
    "ngCookies",
    'ngTouch'
]);

app.constant("GLOBAL", objConstant);

/*app.config(function ($provide, $httpProvider, GLOBAL) {
    if(GLOBAL.JS_DEBUG == 1){
        // Intercept http calls.
        $provide.factory('MyHttpInterceptor', function ($q) {
            return {
                // On request success
                request: function (config) {
                    //console.log(config); // Contains the data about the request before it is sent.
                    // Return the config or wrap it in a promise if blank.
                    return config || $q.when(config);
                },
                
                // On request failure
                requestError: function (rejection) {
                    //console.log(rejection);
                    alert("On Response Failture "+rejection.status+": "+rejection.statusText+", URL: "+rejection.config.url+",  Method: "+rejection.config.method);
                    //console.log(rejection); // Contains the data about the error on the request.
                    
                    // Return the promise rejection.
                    return $q.reject(rejection);
                },
                
                // On response success
                response: function (response) {
                    //console.log(response); // Contains the data from the response.
                    
                    // Return the response or promise.
                    return response || $q.when(response);
                },
                
                // On response failture
                responseError: function (rejection) {
                    //GLOBAL.ERROR_STRING = GLOBAL.ERROR_STRING+"On Response Failture "+rejection.status+": "+rejection.statusText+", URL: "+rejection.config.url+",  Method: "+rejection.config.method+"\n";
                    alert("On Response Failture "+rejection.status+": "+rejection.statusText+", URL: "+rejection.config.url+",  Method: "+rejection.config.method+"\n");
                    //console.log(rejection); // Contains the data about the error.
                    
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        });
        
        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('MyHttpInterceptor');
    }
});*/

app.filter('nl2br', function($sce){
    return function(msg,is_xhtml) {
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
});

app.filter('dateFormatCustom', function($filter)
{
    return function(input,FormatType)
    {
        if(input == null){ return ""; }
        input = moment(input);
        var _date = $filter('date')(new Date(input), FormatType);

        return _date.toUpperCase();

    };
});

app.filter('dateFormat', function($filter)
{
    return function(input)
    {
        if(input == null){ return ""; }
          input = moment(input);
        var _date = $filter('date')(new Date(input), 'MM/dd/yyyy hh:mm a');

        return _date.toUpperCase();

    };
});

app.factory('GlobalVariables', function() {
    return {
        intended_url:'',
    }
});

/* Start Additional Filters */
app.filter('reverse', function () {
    return function (items) {
        if (!angular.isArray(items)) {
            return false;
        }

        return items.slice().reverse();
    };
});
/*End Additional Filters */

app.directive('customDatepicker',function($compile)
{
    return {
        replace:true,
        link: function($scope, $element, $attrs, $controller)
        {
            default_value = $element.val();
            $element.on('focus', function()
            {
                default_value = $element.val();
            });
            $element.on('blur', function()
            {
                $element.val(default_value);
            });
        }
    };
});

/* For share variables between controllers */
app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    sharedService.message = '';
    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };
    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    return sharedService;
});

app.directive('fancybox',function($compile, $timeout){
    return {
        link: function($scope, element, attrs) {
            element.fancybox({
                hideOnOverlayClick:false,
                hideOnContentClick:false,
                enableEscapeButton:false,
                showNavArrows:false,
                onComplete: function(){
                    $timeout(function(){
                        $compile($("#fancybox-content"))($scope);
                        $scope.$apply();
                        $.fancybox.resize();
                    })
                }
            });
        }
    }
});



/* Setup global settings */
app.factory('settings', ['$rootScope','GLOBAL', '$cookieStore', function($rootScope, GLOBAL, $cookieStore) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'img/',
        layoutCssPath: Metronic.getAssetsPath() + 'css/',
    };
    if(GLOBAL.checkId == "" || GLOBAL.checkId == undefined)
    {
        GLOBAL.checkId = false;
    }
    tmpCheck = $cookieStore.get('isLogged');
    if(tmpCheck != undefined && tmpCheck != "")
    {
        generatedCode = (tmpCheck - GLOBAL.CIPHER_KEY) / GLOBAL.CIPHER_KEY;
        roundFigure = Math.ceil(generatedCode);
        if(roundFigure == generatedCode)
        {
            GLOBAL.checkId = true;
        }
    }

    $rootScope.settings = settings;
    $rootScope.GLOBAL = GLOBAL;
    return settings;
}]);

/* For share variables between controllers */
app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    sharedService.message = '';
    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };
    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    return sharedService;
});

/* Setup App Main Controller */
app.controller('AppController', ['$scope', '$rootScope', '$http','GLOBAL','$timeout','$state','$cookieStore', function($scope, $rootScope, $http, GLOBAL, $timeout, $state, $cookieStore) {
    $headerData = $http.defaults.headers.post['Content-Type'];

    $scope.logout = function(flag)
    {
        var tmpCheck = $cookieStore.get('isLogged');
        $cookieStore.remove('isLogged');
        GLOBAL.checkId = false;

        if(flag == '1') {
            bootbox.confirm("Are you sure that you want to logout?", function(result) {
                if(result == true) {
                    window.location.href= GLOBAL.ADMIN_URL+"logout";
                } else {
                    $cookieStore.put('isLogged',tmpCheck);
                    GLOBAL.checkId = true;
                }
            });
        } else {
            window.location.href= GLOBAL.ADMIN_URL+"logout";
        }
    };

    $scope.$on('$viewContentLoaded', function() {

        setTimeout(function()
        {
             /*if(!$('.sub-menu').parent().hasClass('open'))
                {
                    $(this).removeClass('open');
                    $(this).find('.arrow').removeClass('open');
                    $(this).find('.sub-menu').slideUp();
                }else
                {
                    $('.has-submenu').find('.arrow').addClass('open');
                }*/
            Metronic.init(); // Run metronic theme
            //Layout.init(); // init current layout
            QuickSidebar.init(); // init quick sidebar
            Demo.init(); // init demo features
            FormValidation.init();
            Metronic.initComponents(); // init core components
            Custom.init(); // for Custome script fumction
            ComponentsPickers.init();
            Index.initDashboardDaterange();

        },1000);
        $rootScope.rec_per_page = GLOBAL.REC_PER_PAGE;

        //function to check all checkbox
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

        /* Dashboard count box ng-click url on div */
        $rootScope.got_to_url = function(url){
            $state.go(url);
        }

        $rootScope.strip_tags = function(input, allowed) {
            allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
            if (typeof input == "string") return input.replace(commentsAndPhpTags, '')
            .replace(tags, function($0, $1) {
              return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });

            if (input instanceof Array) {
                for (var i=0; i<input.length; i++) {
                   input[i] = maskData(input[i]);
                }
                return input;
            }

            return input;
        }

    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
app.controller('HeaderController', ['$scope', '$rootScope', '$cookieStore','GLOBAL', function($scope, $rootScope, $cookieStore,GLOBAL) {

    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
        if($rootScope.user_name == '' || $rootScope.user_name === undefined) {
            var user_name = $cookieStore.get('user_name');
            $rootScope.user_name = user_name;
        }
    });
}]);

/* Setup Layout Part - Sidebar */
app.controller('SidebarController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
             Layout.initSidebar(); // init sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Quick Sidebar */
app.controller('QuickSidebarController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar
        }, 2000)
    });
}]);

/* Setup Layout Part - Page Head (Breadcrumbs) */
app.controller('PageHeadController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {

    });
}]);

/* Setup Layout Part - Footer */
app.controller('FooterController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$interpolateProvider','GLOBAL', function($stateProvider, $urlRouterProvider, $locationProvider,$interpolateProvider, GLOBAL) {
    $urlRouterProvider.when('', '/');

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/");

    if (!jQuery.browser.msie || jQuery.browser.version != '9.0') {
        $locationProvider.html5Mode(true);
    }

    $stateProvider
        //Dashboard
        .state('/', {
            url: "/",
            templateUrl: ADMIN_ASSET_URL+"templates/login.html" + GLOBAL.HTML_VERSION,
            data: {setLoginClass: true, pageTitle: 'Login', pageHead: 'Login', currTab: 'login'},
            controller: "LoginController",
            onEnter: function($state, GlobalVariables, $location)
            {

                if(GLOBAL.checkId.toString() == 'true') {
                    $state.go('/dashboard');
                } else {
                    GlobalVariables.intended_url = $location.path();
                }
            }
        })
        .state('/reset-password', {
            url: "/reset-password/:access_code",
            templateUrl: ADMIN_ASSET_URL+"templates/reset_password.html" + GLOBAL.HTML_VERSION,
            data: {setLoginClass: true, pageTitle: 'Reset Password', pageHead: 'Reset Password', currTab: 'reset-password'},
            controller: "LoginController",
            onEnter: function($state, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'true') {
                    $state.go('/dashboard');
                } else {
                    GlobalVariables.intended_url = $location.path();
                }
            }
        })
        .state('/dashboard', {
            url: "/dashboard",
            templateUrl: ADMIN_ASSET_URL+"templates/dashboard.html" + GLOBAL.HTML_VERSION,
            data: {pageTitle: 'Dashboard', pageHead: 'Dashboard Section', currTab: 'dashboard'},
            controller: "DashboardController",
            onEnter: function($state, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/users', {
            url: "/users",
            templateUrl: ADMIN_ASSET_URL+"templates/users.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Users', pageHead: 'Users', currTab: 'users'},
            controller: "UsersController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {

                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/users-add', {
            url: "/users/add",
            templateUrl: ADMIN_ASSET_URL+"templates/users-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add User', pageHead: 'Add User', currTab: 'users'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/users-edit', {
            url: "/users/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/users-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit User', pageHead: 'Edit User', currTab: 'users'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/users-view', {
            url: "/users/view/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/users-view.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit User', pageHead: 'Edit User', currTab: 'users'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/my_profile', {
            url: "/my_profile",
            templateUrl: ADMIN_ASSET_URL+"templates/my_profile.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'My Profile', pageHead: 'My Profile', currTab: 'my_profile'},
            controller: "MyProfileController",
            onEnter: function($state, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false')
                {
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/buildings', {
            url: "/buildings",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsController",
            data: { pageTitle: 'Building', pageHead: 'Building', currTab: 'buildings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/buildings-add', {
            url: "/buildings/add",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings-add.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsAddController",
            data: { pageTitle: 'Add Building', pageHead: 'Add Building', currTab: 'buildings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })

        .state('/buildings-edit', {
            url: "/buildings/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings-edit.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsEditController",
            data: { pageTitle: 'Edit Building', pageHead: 'Edit Building', currTab: 'buildings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })

        .state('/buildings-add1', {
            url: "/buildings/add1",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings-add1.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsAdd1Controller",
            data: { pageTitle: 'Add Building', pageHead: 'Add Building', currTab: 'buildings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })

        .state('/buildings-edit1', {
            url: "/buildings/edit1/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings-edit1.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsEdit1Controller",
            data: { pageTitle: 'Edit Building', pageHead: 'Edit Building', currTab: 'buildings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/buildings-add2', {
            url: "/buildings/add2",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings-add2.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsAdd1Controller",
            data: { pageTitle: 'Add Building', pageHead: 'Add Building', currTab: 'buildings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })

        .state('/buildings-edit2', {
            url: "/buildings/edit2/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings-edit2.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsEdit1Controller",
            data: { pageTitle: 'Edit Building', pageHead: 'Edit Building', currTab: 'buildings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/buildings/set-order', {
            url: "/buildings/set-order",
            templateUrl: ADMIN_ASSET_URL+"templates/buildings-order.html" + GLOBAL.HTML_VERSION,
            controller: "BuildingsOrderController",
            data: { pageTitle: 'Building Order', pageHead: 'Building Order', currTab: 'buildings_order'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/cms', {
            url: "/cms",
            templateUrl: ADMIN_ASSET_URL+"templates/cms.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Cms', pageHead: 'Cms', currTab: 'cms'},
            controller: "CmsController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/cms-add', {
            url: "/cms/add",
            templateUrl: ADMIN_ASSET_URL+"templates/cms-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add Pages', pageHead: 'Cms', currTab: 'cms'},
            controller: "CmsAddController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/cms-edit', {
            url: "/cms/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/cms-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit Cms Page', pageHead: 'Edit Cms Page', currTab: 'cms'},
            //controller: "CmsController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/cities', {
            url: "/cities",
            templateUrl: ADMIN_ASSET_URL+"templates/cities.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'City', pageHead: 'City', currTab: 'cities'},
            controller: "CitiesController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/cities-add', {
            url: "/cities/add",
            templateUrl: ADMIN_ASSET_URL+"templates/cities-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add City', pageHead: 'City', currTab: 'cities'},
            controller: "CitiesAddController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/cities-edit', {
            url: "/cities/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/cities-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit City', pageHead: 'Edit City', currTab: 'cities'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/unit-status', {
            url: "/unit-status",
            templateUrl: ADMIN_ASSET_URL+"templates/unit_status.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Unit Status', pageHead: 'Unit Status', currTab: 'unit_status'},
            controller: "UnitStatusController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/unit-status-add', {
            url: "/unit-status/add",
            templateUrl: ADMIN_ASSET_URL+"templates//unit-status-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add Unit Status', pageHead: 'Unit Status', currTab: 'unit_status'},
            controller: "UnitStatusAddController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/unit-status-edit', {
            url: "/unit-status/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/unit-status-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit Unit Status', pageHead: 'Edit Unit Status', currTab: 'unit_status'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/national-asset', {
            url: "/national-asset",
            templateUrl: ADMIN_ASSET_URL+"templates/national-asset.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'National Asset', pageHead: 'Aational Asset', currTab: 'national_asset'},
            controller: "NationalAssetController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/national-asset-add', {
            url: "/national-asset/add",
            templateUrl: ADMIN_ASSET_URL+"templates/national-asset-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add National Asset', pageHead: 'National Asset', currTab: 'national_asset'},
            controller: "NationalAssetAddController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/national-asset-edit', {
            url: "/national-asset/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/national-asset-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit National Asset', pageHead: 'Edit National Asset', currTab: 'national_asset'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/city-asset', {
            url: "/city-asset",
            templateUrl: ADMIN_ASSET_URL+"templates/city-asset.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'City Asset', pageHead: 'City Asset', currTab: 'city_asset'},
            controller: "CityAssetController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/city-asset-add', {
            url: "/city-asset/add",
            templateUrl: ADMIN_ASSET_URL+"templates/city-asset-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add City Asset', pageHead: 'City Asset', currTab: 'city_asset'},
            controller: "CityAssetAddController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/city-asset-edit', {
            url: "/city-asset/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/city-asset-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit City Asset', pageHead: 'Edit City Asset', currTab: 'city_asset'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/settings', {
            url: "/settings",
            templateUrl: ADMIN_ASSET_URL+"templates/settings.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Settings', pageHead: 'Settings', currTab: 'settings'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/domains', {
            url: "/domains",
            templateUrl: ADMIN_ASSET_URL+"templates/domains.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Restricted Domains', pageHead: 'Restricted Domains', currTab: 'domains'},
            controller: "DomainsController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {

                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/domains-add', {
            url: "/domains/add",
            templateUrl: ADMIN_ASSET_URL+"templates/domains-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add Domain', pageHead: 'Add Domain', currTab: 'domains'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/domains-edit', {
            url: "/domains/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/domains-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit Domain', pageHead: 'Edit Domains', currTab: 'domains'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/custom-skyline', {
            url: "/custom-skyline",
            templateUrl: ADMIN_ASSET_URL+"templates/custom-skyline.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Custom Skyline', pageHead: 'Custom Skyline', currTab: 'custom_skyline'},
            controller:'CustomSkylineController',
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/custom-skyline-view', {
            url: "/custom-skyline/view/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/custom-skyline-view.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'View Custom Skyline', pageHead: 'View Custom Skyline', currTab: 'custom_skyline'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/home-banner', {
            url: "/home-banner",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-banners.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Home Page Banners', pageHead: 'Home Page Banners', currTab: 'home_banner'},
            controller:'HomePageBannerController',
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
         .state('/home-banner-add', {
            url: "/home-banner/add",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-banners-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add Home Page Banner', pageHead: 'Add Home Page Banner', currTab: 'home_banner'},
            controller: "HomePageBannerAddController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/home-banner-edit', {
            url: "/home-banner/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-banners-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit Home Page Banner', pageHead: 'Edit Home Page Banner', currTab: 'home_banner'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/home-image-rotator', {
            url: "/home-image-rotator",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-image-rotation.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Home Page Image Rotator', pageHead: 'Home Page Image Rotator', currTab: 'home_image_rotator'},
            controller:'HomePageImageRotationController',
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
         .state('/home-image-rotator-add', {
            url: "/home-image-rotator/add",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-image-rotation-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add Home Page Image Rotator', pageHead: 'Add Home Page Image Rotator', currTab: 'home_image_rotator'},
            controller: "HomePageImageRotationAddController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/home-image-rotator-edit', {
            url: "/home-image-rotator/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-image-rotation-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit Home Page Image Rotator', pageHead: 'Edit Home Page Image Rotator', currTab: 'home_image_rotator'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/home-content', {
            url: "/home-content",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-content.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Home Page Content Box', pageHead: 'Home Page Content Box', currTab: 'home_page_content'},
            controller:'HomePageContentController',
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
         .state('/home-content-add', {
            url: "/home-content/add",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-content-add.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Add Home Page Content Box', pageHead: 'Add Home Page Content Box', currTab: 'home_page_content'},
            controller: "HomePageAddContentController",
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
        .state('/home-content-edit', {
            url: "/home-content/edit/:id",
            templateUrl: ADMIN_ASSET_URL+"templates/home-page-content-edit.html" + GLOBAL.HTML_VERSION,
            data: { pageTitle: 'Edit Home Page Content Box', pageHead: 'Edit Home Page Content Box', currTab: 'home_page_content'},
            onEnter: function($state, $stateParams, GlobalVariables, $location)
            {
                if(GLOBAL.checkId.toString() == 'false'){
                    GlobalVariables.intended_url = $location.path();
                    $state.go('/');
                }
            }
        })
}]);
/* Init global settings and run the app */

app.run(["$rootScope", "settings", "$state",'GLOBAL','$stateParams','mySharedService','$location', function($rootScope, settings, $state,GLOBAL,$stateParams, mySharedService, $location) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams)
    {

    });

}]);


app.directive('bootstrapSwitch', ['PaginationService','$timeout','$rootScope' ,function(PaginationService,$timeout,$rootScope)
{
    return{
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel)
        {
            element.bootstrapSwitch();
            element.on('switchChange.bootstrapSwitch', function(event, state)
            {
                if(state)
                {
                    PaginationService.change_active_inactive(attrs.url, attrs.rowkey, '1');
                }
                else
                {
                    PaginationService.change_active_inactive(attrs.url, attrs.rowkey, '0');
                }

                if (ngModel)
                {
                    scope.$apply(function()
                    {
                        ngModel.$setViewValue(state);
                    });
                }
            });

            scope.$watch(attrs.ngModel, function(newValue, oldValue)
            {


                if (newValue)
                {
                    angular.forEach($rootScope.items, function(val,index){ // selected_record is ng-model name of checkbok
                            if(val.id == attrs.rowkey)
                            {
                               if(newValue == '0'){
                                element.bootstrapSwitch('state', false, true);
                                val.e_status = '0';
                            }
                            if(newValue == '1') {
                                element.bootstrapSwitch('state', true, true);
                                val.e_status = '1';
                            }
                            if(newValue == 'LoggedIn'){
                                element.bootstrapSwitch('state', true, true);
                                val.e_status = '1';
                            }
                            if(newValue == 'LoggedOut'){
                                element.bootstrapSwitch('state', false, true);
                                val.e_status = '1';
                            }
                            }
                    });

                }
                else
                {

                    //element.bootstrapSwitch('state', false, true);
                }
            });
        }
    };
}]);
