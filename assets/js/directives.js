/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
app.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        Metronic.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
app.directive('a',function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if(event.which === 13) {
                if(angular.element('#login-form').is(":visible"))
                {
                    angular.element('#login-form').submit();
                }
                if(angular.element('#forget-form').is(":visible"))
                {
                    angular.element('#forget-form').submit();
                }
                if(angular.element('#reset-form').is(":visible"))
                {
                    angular.element('#reset-form').submit();
                }
                if(angular.element('#frmAdd').is(":visible"))
                {
                   angular.element('#frmAdd').submit();
                   angular.element('#frmAdd').find('button[type="submit"]').trigger('click');
                   if($("#procees_to_payment").is(":visible") && !angular.element('#frmPayment').is(":visible"))
                   {
                        $("#procees_to_payment").trigger('click');
                   }
                }
                if(angular.element('#frmEdit').is(":visible"))
                {
                    angular.element('#frmEdit').submit();
                    angular.element('#frmEdit').find('button[type="submit"]').trigger('click');
                }
                if(angular.element('#myDropzone').is(":visible"))
                {
                    angular.element('#myDropzone').submit();
                   angular.element('#myDropzone').find('button[type="submit"]').trigger('click');
                }
                if(angular.element('#frmPayment').is(":visible"))
                {
                   angular.element('#frmPayment').find('input[type="submit"]').trigger('click');
                }

                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
})
// For pagination of listing page
app.directive('paging', function ($rootScope) {
    // Assign null-able scope values from settings
    
    function setScopeValues(scope, attrs) {

        scope.List = [];
        scope.Hide = false;
        scope.page = parseInt(scope.page) || 1;
        scope.total = parseInt(scope.total) || 0; //scope.$root.total;
        /*scope.total = (scope.total > 0 ? scope.total : (scope.$root.total > 0 ? scope.$root.total : 0));
        if (scope.$root.fields.dtFilter > 0) {
            scope.total = scope.$root.total;
        }*/
        scope.dots = scope.dots || '...';
        scope.ulClass = scope.ulClass || 'pagination';
        scope.adjacent = scope.total / 2; //parseInt(scope.adjacent) || 2;
        scope.activeClass = scope.activeClass || 'active';
        scope.disabledClass = scope.disabledClass || 'disabled';
        scope.next = {};
        scope.prev = {};
        scope.goto = {};
        scope.cpage1 = parseInt(scope.page) || 1;
        scope.scrollTop = scope.$eval(attrs.scrollTop);
        scope.hideIfEmpty = scope.$eval(attrs.hideIfEmpty);
        scope.showPrevNext = scope.$eval(attrs.showPrevNext);
    }
    // Validate and clean up any scope values
    // This happens after we have set the
    // scope values
    function validateScopeValues(scope, pageCount) {
        // Block where the page is larger than the pageCount
        if (scope.page > pageCount) {
            scope.page = pageCount;
        }
        // Block where the page is less than 0
        if (scope.page <= 0) {
            scope.page = 1;
        }
        // Block where adjacent value is 0 or below
        if (scope.adjacent <= 0) {
            scope.adjacent = 2;
        }
        // Hide from page if we have 1 or less pages
        // if directed to hide empty
        if (pageCount <= 1) {
            scope.Hide = scope.hideIfEmpty;
        }
    }

    // Internal Paging Click Action
    function internalAction(scope, page) {

        // Block clicks we try to load the active page
        if (scope.page == page) {
            return;
        }

        // Update the page in scope and fire any paging actions
        scope.page = page;
        scope.pagingAction({
            page: page
        });
        // If allowed scroll up to the top of the page
        if (scope.scrollTop) {
            scrollTo(0, 0);
        }
    }


    // Add Range of Numbers
    function addRange(start, finish, scope) {
    
        var i = 0;
       
        for (i = start; i <= finish; i++) {
            var item = {
                value: i,
                title: 'Page ' + i,
                liClass: scope.page == i ? scope.activeClass : '',
                action: function () {
                    internalAction(scope, this.value);
                    // console.log("FDSF");
                    //scope.setPage(2);
                }
            };
           // console.log(item);
           scope.List.push(item);
           
            
        }
    }

    // Add Dots ie: 1 2 [...] 10 11 12 [...] 56 57
    function addDots(scope) {
        scope.List.push({
            value: scope.dots
        });
    }

    // Add First Pages
    function addFirst(scope) {
        addRange(1, 2, scope);
        addDots(scope);
    }

    // Add Last Pages
    function addLast(pageCount, scope) {
        addDots(scope);
        addRange(pageCount - 1, pageCount, scope);
    }

    // Adds the first, previous text if desired   
    function addPrev(scope, pageCount) {
        // Ignore if we are not showing
        // or there are no pages to display
        if (!scope.showPrevNext || pageCount < 1) {
            return;
        }
        // Calculate the previous page and if the click actions are allowed
        // blocking and disabling where page <= 0
        var disabled = scope.page - 1 <= 0;
        var prevPage = scope.page - 1 <= 0 ? 1 : scope.page - 1;
       
        var prev = {
            value: '<i class="fa fa-angle-left"></i>',
            title: 'Previous Page',
            liClass: disabled ? 'btn btn-sm default prev ' + scope.disabledClass : 'btn btn-sm default prev',
            action: function () {
                if (!disabled) {
                    internalAction(scope, prevPage);
                }
            }
        };
        scope.prev = prev;
        //scope.List.push(first);
        scope.List.push(prev);
    }
    // Adds the next, last text if desired
    function addNext(scope, pageCount) {
        // Ignore if we are not showing 
        // or there are no pages to display
        if (!scope.showPrevNext || pageCount < 1) {
            return;
        }
        // Calculate the next page number and if the click actions are allowed
        // blocking where page is >= pageCount
        var disabled = scope.page + 1 > pageCount;
        var nextPage = scope.page + 1 >= pageCount ? pageCount : scope.page + 1;
        //var last = {
        //    value: '<i class="fa fa-angle-right"></i>',
        //    title: 'Last Page',
        //    liClass: disabled ? scope.disabledClass : '',
        //    action: function () {
        //        if (!disabled) {
        //            internalAction(scope, pageCount);
        //        }
        //    }
        //};
        var next = {
            value: '<i class="fa fa-angle-right"></i>',
            title: 'Next Page',
            liClass: disabled ? 'btn btn-sm default next ' + scope.disabledClass : 'btn btn-sm default next ',
            action: function () {
                if (!disabled) {
                    internalAction(scope, nextPage);
                }
            }
        };
        var goto = {
            action: function () {
                if (!disabled) {
                    internalAction(scope, scope.cpage1);
                }
            }
        };
        scope.goto = goto;
        scope.next = next;
        scope.List.push(next);
        // scope.List.push(last);
    }


    // Main build function
    function build(scope, attrs) {
        
        
        // Block divide by 0 and empty page size
        if (!scope.pageSize || scope.pageSize < 0) {
            return;
        }
        // Assign scope values
        setScopeValues(scope, attrs);

        // local variables
        var start,
            size = scope.adjacent * 2,
            pageCount = scope.pageSize <= 0 ? scope.total : Math.ceil(scope.total / scope.pageSize);

        // Validate Scope
        validateScopeValues(scope, pageCount);

        // Calculate Counts and display
        addPrev(scope, pageCount);
        if (pageCount != scope.total) {
            if (pageCount < (5 + size)) {

                start = 1;
                addRange(start, pageCount, scope);

            } else {

                var finish;

                if (scope.page <= (1 + size)) {

                    start = 1;
                    finish = 0 + size + (scope.adjacent - 1);

                    addRange(start, finish, scope);
                    //addLast(pageCount, scope);

                } else if (pageCount - size > scope.page && scope.page > size) {

                    start = scope.page - scope.adjacent;
                    finish = scope.page + scope.adjacent;

                    // addFirst(scope);
                    addRange(start, finish, scope);
                    // addLast(pageCount, scope);

                } else {

                    start = pageCount - (0 + size + (scope.adjacent - 1));
                    finish = pageCount;

                    // addFirst(scope);
                    addRange(start, finish, scope);

                }
            }
        }
        addNext(scope, pageCount);

    }
    // The actual angular directive return
    return {
        restrict: 'EA',
        scope: {
            page: '=',
            pageSize: '=',
            total: '=',
            dots: '@',
            hideIfEmpty: '@',
            ulClass: '@',
            activeClass: '@ active',
            disabledClass: '@ disabled',
            adjacent: '@',
            scrollTop: '@',
            showPrevNext: '@',
            pagingAction: '&',
            filterrecord: "="
        },
        controller: function ($scope, $http, $timeout) {
            

           // addRange(1, finish, scope);
        },
        template:
             ' Page ' +
				'<a ng-bind-html="prev.value"' +
				'title="{{prev.title}}" ' +
				'ng-class="prev.liClass" ' +
				'ng-click="prev.action()" > ' +
				'</a> <input type="text" class="pagination-panel-input form-control input-mini input-inline input-sm" maxlenght="5" ng-model="cpage1" ng-change="goto.action()" style="text-align:center; margin: 0 5px;"> ' +
                '<a ng-bind-html="next.value"' +
				'title="{{next.title}}" ' +
				'ng-class="next.liClass" ' +
				'ng-click="next.action()" > ' +
				'</a> of ' +
                '<span class="pagination-panel-total">{{(List.length > 2)?List.length - 2: 1}}</span>' +
            '',
        link: function (scope, element, attrs) {

            scope.$watch('page', function ($data) {
                setTimeout(function(){
                     $rootScope.$apply(); 
                },1500);
                 build(scope, attrs);
            });
            
            scope.$watch('pageSize', function () {
                scope.page = 1;
                setTimeout(function(){
                     $rootScope.$apply(); 
                    build(scope, attrs);
                },1500);
            });
        }
    };
});