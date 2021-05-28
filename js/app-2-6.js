/*** For bootstrap model
    http://weblogs.asp.net/dwahlin/building-an-angularjs-modal-service -- use in this site
    https://github.com/angular-ui/bootstrap/tree/gh-pages
    https://angular-ui.github.io/bootstrap/
*/
var timeOut;
var hoverFlag = 1;

/* Admin App */
var app = angular.module("app", [
    "ui.router",
    'ngResource',
    "ui.bootstrap",
    "ngSanitize",
    "ngCookies",
    "ngTagsInput"
]);

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
        var _date = $filter('date')(new Date(input), 'MM/dd/yyyy');
        
        return _date.toUpperCase();
    
    };
});


app.directive('fancyboxMedia',function($compile)
{
    return {
        replace:true,
        link: function($scope, element)
        {
            setTimeout(function(){
                element.fancybox({
                    openEffect : 'none',
                    closeEffect : 'none',
                    prevEffect : 'none',
                    nextEffect : 'none',
                    autoSize : true,
                    autoScale : false,
                    fitToView : true,
                    arrows : false,
                    padding: [0,0,0,0],
                    margin: [20,20,20,20],
                    helpers : {
                        media : {},
                        buttons : {},
						 overlay: {
							locked: false
						},
                    },
                    onUpdate: function(){
                        $.fancybox.update();
                    }
                });
            },1000);
        }
    };
}); 
    
app.directive('scrollbarSkyline',function($compile)
{
    return {
        replace:true,
        link: function($scope, element)
        {
            setTimeout(function(){
                element.scrollbar();
            },1000);
        }
    };
});

app.directive('bannerSkylineDropdown', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {
        setTimeout(function(){
            element.bind('click', function() {
               if(angular.element(this).hasClass('isopen')){
                    angular.element(this).next('.dropdown-list').slideUp();
                    angular.element(this).removeClass('isopen');
                    angular.element('.extra-timeline').fadeIn();
                    angular.element('.banner .bx-pager-item').fadeIn();
                }
                else{
                    angular.element(this).next('.dropdown-list').slideDown();
                    angular.element(this).addClass('isopen');
                    angular.element('.extra-timeline').fadeOut();
                    angular.element('.banner .bx-pager-item').fadeOut();
                }
            });
        },3000);
      }
    };
});

app.directive('cityCustomSkylineDropdown', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {
        setTimeout(function(){
            element.bind('click', function() {
               if(angular.element(this).hasClass('isopen')){
                    angular.element(this).next('.dropdown-list').slideUp();
                    angular.element(this).removeClass('isopen');
                }
                else{
                    angular.element(this).next('.dropdown-list').slideDown();
                    angular.element(this).addClass('isopen');
                }
            });
        },3000);
      }
    };
});

app.constant("GLOBAL", objConstant);
/* Setup global settings */
app.factory('settings', ['$rootScope','GLOBAL','$cookieStore', function($rootScope,GLOBAL,$cookieStore) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        }
    };
    
    if(GLOBAL.checkId == "" || GLOBAL.checkId == undefined)
    {
        GLOBAL.checkId = false;
    }

    tmpCheck = $cookieStore.get('isGuestLogged');
    if(tmpCheck != undefined && tmpCheck != "")
    {
        tmpCheck = $cookieStore.get('isGuestLogged');
    }

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
app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    };
});

app.filter("customNumber", function (numberFilter) {
    function isNumeric(value)
    {
      return (!isNaN(parseFloat(value)) && isFinite(value));
    }

    return function (inputNumber, currencySymbol, decimalSeparator, thousandsSeparator, decimalDigits) {
      if (isNumeric(inputNumber))
      {
        // Default values for the optional arguments
        currencySymbol = (typeof currencySymbol === "undefined") ? "" : currencySymbol;
        decimalSeparator = (typeof decimalSeparator === "undefined") ? "." : decimalSeparator;
        thousandsSeparator = (typeof thousandsSeparator === "undefined") ? "," : thousandsSeparator;
        decimalDigits = (typeof decimalDigits === "undefined" || !isNumeric(decimalDigits)) ? 0 : decimalDigits;

        if (decimalDigits < 0) decimalDigits = 0;

        // Format the input number through the number filter
        // The resulting number will have "," as a thousands separator
        // and "." as a decimal separator.
        var formattedNumber = numberFilter(inputNumber, decimalDigits);

        // Extract the integral and the decimal parts
        var numberParts = formattedNumber.split(".");

        // Replace the "," symbol in the integral part
        // with the specified thousands separator.
        numberParts[0] = numberParts[0].split(",").join(thousandsSeparator);

        // Compose the final result
        var result = currencySymbol + numberParts[0];

        if (numberParts.length == 2)
        {
          result += decimalSeparator + numberParts[1];
        }

        return result;
      }
      else
      {
        return inputNumber;
      }
    };
});

/* Start directives */
app.directive('imgMapster', function (GLOBAL) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function(){
                $(element).mapster({
                    mapKey: 'state',
                    fillColor: 'a52424',
                    fillOpacity: 0
                });
                $('area').hover(function(){
                    $('#hover_txt').removeClass('opa_hide');
                    var position = $(this).attr('coords').split(',');
                    var position_mid = position[2]-40;
                    var position_top = position[1]-50;
                    setTimeout(function(){
                        $('#hover_txt').css({'left':position[0]+'px','top':position[1]+'px','opacity':'1'});
                        $('#hover_txt').css('margin-left',-($('#hover_txt').width()+20)/2);
                    },10)
                    $('#hover_txt').html($(this).attr('state'))
                    $('#home_top h1').html('View more on <span>'+$(this).attr('state')+'</span>')
                },function(){
                    $('#hover_txt').html('').removeClass()
                    $('#hover_txt').addClass('opa_hide');
                    $('#home_top h1').html('Pick your Skyline')
                })
            }, 1000);
        }
    };
});

/*
app.directive('fancyBox',function(){
    return {
        link: function($scope, element, attrs) {
            $('.' + attrs['fancyboxclass']).fancybox({
                prevEffect	: 'none',
        		nextEffect	: 'none',
        		helpers	: {
        			title	: {
        				type: 'outside'
        			},
        			thumbs	: {
        				width	: 50,
        				height	: 50
        			}
        		}
            });
        }
    }
});*/

/* Home page first selectric */
app.directive('selectricFirst', function (GLOBAL) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hide();
            setTimeout(function(){
                var options = scope.$eval(angular.element(element).attr('data-options'));
                if(GLOBAL.IS_MOBILE == 0){
                    angular.element(element).val(angular.element(element).attr('data-value'));
                }
                //angular.element(element).val(angular.element(element).attr('data-value'));
                $(element).selectric(options).on('selectric-change', function(e){
                    hoverFlag = 0;

                    if(angular.element('#city_main').length > 0){
                        var id = $(this).val();
                        $(".scroll-wrapper .scrollbar-inner").scrollLeft($('.building_'+id).attr('scrollleft'));
                        angular.forEach(angular.element('#city_main .city_left .city_lists ul li'), function(v,k){
                            angular.element(v).css('opacity','1').removeClass('on');
                        });
                        angular.element('.building_'+id).css('opacity','1').addClass('on').trigger("click");
                    }
                    setTimeout(function(){
                        hoverFlag = 1;
                    }, 2000);
                });
                $(element).show();
                /* For mobile only*/

                //if(IS_MOBILE == 1){
                    $(document).on('change', element, function(){
                        hoverFlag = 0;

                        var selected_val = $(element).val();
                        if(selected_val != '' && selected_val > 0){
                            $('#city_main .city_left .city_lists ul li').each(function(){
                                $(this).css('opacity','1').removeClass('on');
                            });
                            $('.building_'+selected_val).css('opacity','1').addClass('on').trigger("click");
                        } else {
                            $('#city_main .city_left .city_lists ul li').each(function(){
                                $(this).css('opacity','1').removeClass('on');
                            });
                        }
                        $(".scroll-wrapper .scrollbar-inner").scrollLeft($('.building_'+selected_val).attr('scrollleft'));

                        setTimeout(function(){
                            hoverFlag = 1;
                        }, 2000);

                    });
                //}
            }, 2000);
        }
    };
});

/* Home page second selectric */
app.directive('selectric', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function(){
                var options = scope.$eval($(element).attr('data-options'));
                $(element).selectric(options).on('selectric-change', function(e){
                    if($(this).val() != ''){
                        $('#contactFrm .selectric:first').removeClass('error');
                    } else {
                        $('#contactFrm .selectric:first').addClass('error');
                    }
                });
            }, 3000);
        }
    };
});

app.directive('selectricLast', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function(){
                var options = scope.$eval($(element).attr('data-options'));
                $(element).selectric(options).on('selectric-change', function(e){
                    if($(this).val() != ''){
                        $('#contactFrm .selectric:last').removeClass('error');
                    } else {
                        $('#contactFrm .selectric:last').addClass('error');
                    }
                });
            }, 3000);
        }
    };
});

app.directive('imageonload', function(GLOBAL) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {

                //scope.generateMap();
            });
        }
    };
});


/* For owlCarousel slider */
app.directive('owlCarousel', function (GLOBAL) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var unwatch = scope.$watch('items.cities.city_asset', function(newVal, oldVal){
                // or $watchCollection if students is an array
                if (newVal) {
                  init();
                  // remove the watcher
                  if(GLOBAL.IS_MOBILE != 1){
                      //angular.element('.city_right').css('min-height',angular.element('.city_left').height());
                      //angular.element('#city_right_inner_div').css('min-height',angular.element('.city_left').height() - 30);
                      setTimeout(function(){
                          var remaining_space = eval(angular.element('footer').offset().top - angular.element('#building_map').offset().top - angular.element('#building_map').height() - 15);
                          angular.element('#building_map').css('height', eval(angular.element('#building_map').height()+remaining_space));
                      }, 1000);
                  }
                  unwatch();

                }
            });

            function init(){
                var owl = $(element);
                if(typeof owl.data('owlCarousel') != 'undefined'){
                     owl.data('owlCarousel').destroy();
                     owl.removeClass('owl-carousel');
                }
                //var options = scope.$eval($(element).attr('data-options'));
                $(element).owlCarousel({ lazyLoad : true, loop: false, rewind: false, items:4, margin:15, center: false, autoHeight:false, nav: false, slideBy : 'page', dots: true,  responsive : { 0 : { items:1, center: true, nav: true }, 640 : { items:2, nav: true }, 768 : { items:2 }, 1100 : { items:3 }, 1200 : { items:5 } } });

            }
            setTimeout(function(){
                owlCarouselSetHeight();
            }, 1500);
        }
    };
});

function owlCarouselSetHeight() {
    var maxHeight = 0;
    setTimeout(function(){
        if($('#city_car .fact-carousel .item').find('a > img').length > 0){
            $('#city_car .fact-carousel .item').each(function() {
                maxHeight = maxHeight > $(this).find('a > img').height() ? maxHeight : $(this).find('a > img').height();
            });
        }else{
            $('#city_car .fact-carousel .item').each(function() {
                maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
            });  
        }
        console.log(maxHeight);
        $('#city_car .fact-carousel .item').css('height', maxHeight+'px');
    },1000);
}

app.directive('factCarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var unwatcha = scope.$watch('item.v_thumbnail_url', function(newVal, oldVal){
                // or $watchCollection if students is an array
                if (newVal) {
                  inita();
                  unwatcha();
                }
            });

            function inita(){

                var owl = $(element);
                if(typeof owl.data('owlCarousel') != 'undefined'){
                     owl.data('owlCarousel').destroy();
                     owl.removeClass('owl-carousel');
                }
                //var options = scope.$eval($(element).attr('data-options'));
                $(element).owlCarousel({
                    lazyLoad: true,
                    loop: false,
                    center: false,
                    rewind: false,
                    rewindNav:false,
                    items:4,
                    margin:15,
                    autoHeight:true,
                    nav: false,
                    navigation: false,                    
                    slideBy : 'page',
                    responsive : {
                        0 : {
                            items:1,
                            center: true,
                        },
                        440 : {
                            items:2
                        },
                        768 : {
                            items:2
                        },
                        1100 : {
                            items:3
                        }
                    }
                });
            }
            setTimeout(function(){
                $(element).owlCarousel({
                    loop: false,
                    center: false,
                    rewind: false,
                    rewindNav:false,
                    items:4,
                    margin:15,
                    autoHeight:true,
                    slideBy : 'page',
                    responsive : {
                        0 : {
                            items:1,
                            center: true,
                        },
                        440 : {
                            items:2
                        },
                        768 : {
                            items:2
                        },
                        1100 : {
                            items:3
                        }
                    }
                });
            }, 100);
        }
    };
});
app.directive('cityAssetFactCarousel', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function(){
                $(element).owlCarousel({
                    items:4,
                    margin:15,
                    center: false,
                    autoHeight:false,
                    nav: true,
                    slideBy : 'page',
                    responsive : {
                        // breakpoint from 0 up
                        0 : {
                            items:1,
                            center: true,
                        },
                        // breakpoint from 640 up
                        640 : {
                            items:2
                        },
                        // breakpoint from 768 up
                        768 : {
                            items:3
                        },
                        1100 : {
                            items:5
                        }
                    }
                });
            }, 1000);
        }
    };
});

/* For execute tooltip on city detail page*/
app.directive('tip', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            setTimeout(function(){
                $(element).tipr();
                $('.tip').each(function(){
                    $(this).css('background-color', $(this).attr('my-data-color'));
                });
            }, 1500);
        }
    };
});
/* For init scrollbar */
app.directive('scrollbarInner', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            $(element).scrollbar({autoScrollSize: true });
        }
    };
});
/* For init fancybox */
app.directive('fancybox',function($compile, $timeout){
    return {
        link: function($scope, element, attrs) {
            $timeout(function(){
                var content = '';
                content = element[0].innerHTML;
                var st_title = attrs.title;
                var st_url = attrs.url;
                var st_imageurl = attrs.imageurl;
                var st_displaytext = attrs.displaytext;

                $('#og_title').attr('content',st_title);
                $('#og_url').attr('content',st_url);
                $('#og_image').attr('content',st_imageurl);
                $('#og_desc').attr('content',st_displaytext);

                stButtons.locateElements();

                st_desc = (attrs.template).replace(/<[^>]+>/gm, '');

                st_str = " st_summary='"+st_desc+"' st_title='Home Page | JLL' st_image='"+attrs.href+"' st_url='"+SITE_URL+'national-asset/'+$(element).attr('db_id')+"' ";

                var social_content = "<div class='social_bar'><span class='st_facebook_large' "+st_str+"  displayText='Facebook'></span><span class='st_twitter_large' "+st_str+" displayText='Tweet'></span><span  "+st_str+" class='st_googleplus_large' displayText='Google +'></span><span  "+st_str+" class='st_linkedin_large' displayText='LinkedIn'></span><span  "+st_str+" class='st_pinterest_large' displayText='Pinterest'></span></div>";

                //var social_content = '<div class="social_bar"><a onClick=\'window.open("https://www.facebook.com/sharer/sharer.php?u='+SITE_URL+'share/'+$(element).attr('db_id')+'", "Share Facebook", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/fb.png"></a><a onClick=\'window.open("http://twitter.com/share?url='+SITE_URL+'share/'+$(element).attr('db_id')+'", "Share Twitter", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/tw.png"></a><a onClick=\'window.open("https://plus.google.com/share?url='+SITE_URL+'share/'+$(element).attr('db_id')+'", "Share Google +", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/gp.png"></a><a onClick=\'window.open("http://www.pinterest.com/pin/create/button/?url='+SITE_URL+'share/'+$(element).attr('db_id')+'&media='+attrs.href+'&description=JLL", "Share Pinterest +", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/pin.png"></a></div>';
                element.fancybox({
                    hideOnOverlayClick:false,
                    hideOnContentClick:true,
                    enableEscapeButton:true,
                    scrolling : 'auto',
                    showNavArrows:true,
                    type: 'html',
                    content: content,
                    closeBtn: false,
                    arrows: true,
                    beforeShow: function(){

                        $(".fancybox-skin").after(social_content);
                        if (stButtons){stButtons.locateElements();}
                    },
                    afterLoad: function() {
                        this.title = $.trim(attrs.template);
                    },
                    helpers : {
                        title: {
                            type: 'inside'
                        }
                    },
                    onComplete: function(){
                        $timeout(function(){
                            $compile($("#fancybox-content"))($scope);
                            $scope.$apply();
                            //$.fancybox.resize();
                        })
                    }
                });
            }, 1000);
        }
    }
});




app.directive('fancyboxChangePassword',function($compile, $timeout){
    return {
            link: function($scope, element, attrs) {
                 setTimeout(function(){
                    element.fancybox({
                        hideOnOverlayClick:false,
                        /*minWidth	: 500,
                        minHeight	: 250,*/
                        helpers : {overlay: {locked: false}},
                        'closeBtn' : false,
                        maxWidth : 500, 
                        fitToView   : true, 
                        autoSize : false, 
                        autoHeight : true,
                        hideOnContentClick:true,
                        enableEscapeButton:false,
                        type: 'html',
                        content: $('#change_password_template').html(),
                        afterLoad: function() {
                            setTimeout(function(){
                                if($('.ie9').length > 0){
                        			$('input[type="text"], input[type="email"], input[type="password"], textarea').each(function() {
                        				if ($(this).attr('type') == 'password') {
                        					$(this).attr('type', 'text').addClass('passwordField');
                        				}
                        				var phAttr = $(this).attr('placeholder');
                        				if (typeof(phAttr) != 'undefined' && phAttr != false) {
                        					if (phAttr != null && phAttr != '') {
                        						$(this).addClass('default_title_text');
                        						$(this).val(phAttr);
                        						$(this).focus(function() {
                        							if ($(this).hasClass('passwordField')) {
                        								$(this).attr('type', 'password');
                        							}
                        							$(this).removeClass('default_title_text');
                        							if ($(this).val() == $(this).attr('placeholder')) {
                        								$(this).val('');
                        							}
                        						});
                        						$(this).blur(function() {
                        							if ($(this).attr('type') == 'password' && $(this).val() == '') {
                        								$(this).attr('type', 'text').addClass('passwordField');
                        							}
                        							if ($(this).val() == '') {
                        								$(this).val($(this).attr('placeholder'));
                        								$(this).addClass('default_title_text');
                        							}
                        						});
                        					}
                        				}
                        			});
                                }
                            }, 500);
        
                        }
                    });
                }, 500);
            }
        }
});

app.directive('fancyboxCity',function($compile, $timeout){
    return {
        link: function($scope, element, attrs) {
            //$timeout(function(){
            var content = '';
            content = '<img src="'+attrs.imageurl+'" style="width: 100%; height: 100%;" />';

            var st_title = attrs.title;
            var st_url = attrs.url;
            var st_imageurl = attrs.imageurl;
            var st_displaytext = attrs.displaytext;

            $('#og_title').attr('content',st_title);
            $('#og_url').attr('content',st_url);
            $('#og_image').attr('content',st_imageurl);
            $('#og_desc').attr('content',st_displaytext);

            stButtons.locateElements();
            st_desc = (attrs.template).replace(/<[^>]+>/gm, '');
            st_str = " st_summary='"+st_desc+"' st_title='"+angular.element('title').html()+"' st_image='"+attrs.href+"' st_url='"+SITE_URL+'city-asset/'+attrs.dbid+"' ";
            var social_content = "<div class='social_bar'><span class='st_facebook_large' "+st_str+"  displayText='Facebook'></span><span class='st_twitter_large' "+st_str+" displayText='Tweet'></span><span  "+st_str+" class='st_googleplus_large' displayText='Google +'></span><span  "+st_str+" class='st_linkedin_large' displayText='LinkedIn'></span><span  "+st_str+" class='st_pinterest_large' displayText='Pinterest'></span></div>";

            //var social_content = '<div class="social_bar"><a onClick=\'window.open("https://www.facebook.com/sharer/sharer.php?u='+attrs.href+'", "Share Facebook", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/fb.png"></a><a onClick=\'window.open("http://twitter.com/home?status=JLL '+attrs.href+'", "Share Twitter", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/tw.png"></a><a onClick=\'window.open("https://plus.google.com/share?url='+attrs.href+'", "Share Google +", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/gp.png"></a><a onClick=\'window.open("http://www.pinterest.com/pin/create/button/?url='+attrs.href+'&media='+attrs.href+'&description=Currently%20Inspired%20By", "Share Pinterest +", config="height=300, width=500");\' target="_parent" href="javascript: void(0)"><img alt="" src="'+SITE_URL+'images/pin.png"></a></div>';
            //setTimeout(function(){
            element.fancybox({
                minWidth	: 250,
                minHeight	: 150,
                hideOnOverlayClick:false,
                hideOnContentClick:true,
                enableEscapeButton:false,
                scrolling : 'visible',
                showNavArrows:true,
                arrows: true,
                type: 'html',
                content: content,
                beforeShow: function(){
                    this.width = $('.fancybox-iframe').contents().find('#preview_wrapper').width();
                    this.height = $('.fancybox-iframe').contents().find('#preview_wrapper').height();
                    $(".fancybox-skin").after(social_content);
                    if (stButtons){
                         stButtons.locateElements();
                    }
                },
                afterLoad: function() {
                    this.title = $.trim(attrs.template);
                },
                helpers : {
                    title: {
                        type: 'inside'
                    }
                },
                onComplete: function(){
                    this.width = $('.fancybox-iframe').contents().find('#preview_wrapper').width();
                    this.height = $('.fancybox-iframe').contents().find('#preview_wrapper').height();
                    //$timeout(function(){
                    $.fancybox.resize();
                    $compile($("#fancybox-content"))($scope);
                    $scope.$apply();
                    //}, 1500)
                }
            });
        }
    }
});
/* End directives */

/* Start services */
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

/* End services */

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


var timeoutID;
var load_data = false;

app.controller('HomeController', ['$scope', '$rootScope', '$http','$timeout','$state','$cookieStore','anchorSmoothScroll','GLOBAL',function($scope, $rootScope
	, $http, $timeout, $state, $cookieStore,anchorSmoothScroll,GLOBAL) {
	
	setTimeout(function(){$('html body').animate({scrollTop:0},800)},2000);
    $scope.items = {};
    $scope.left_column_data = [];
    $scope.middle_column_data = [];
    $scope.right_column_data = [];
    $rootScope.city_array = [];
    
    $scope.get_city_detail_home = function(slug){
        if(GLOBAL.checkId == false) {
            var url = GLOBAL.SITE_URL + 'city/' + slug;
            $cookieStore.put('intended_url', url);  
            $state.go('/login');
        } else {
            $state.go('/city', {slug: slug});
        }
    }
        
    $scope.setPageNumber = function(index) {
        $scope.pageNumber = index;
    }

    $scope.$on('$viewContentLoaded', function() {
        angular.element.mapster.impl.init();
        /* Blur validation */
        $("#contactFrm input, #contactFrm select").blur(function(){
            var email_pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
            if($.trim($(this).val()) != '' && $(this).hasClass('error')) {
                $(this).removeClass('error');
            }
            if($(this).hasClass('email') && !email_pattern.test($.trim($("#contact_email").val()))) {
                $(this).addClass('error');
            }
        });
        
        var responsePromise = $http.get(SITE_URL+"api-home-page");
        responsePromise.success(function(data, status, headers, config) {
            if(status == 200){
                $scope.items = data.national_assets;
                $scope.homePageBanners=data.home_page_banners;
                $scope.homePageContentBoxes=data.home_page_content_boxes;
                $scope.homePageImageRotator=data.home_page_image_rotator;
                $scope.cities = data.cities;
                $scope.instagramImages=data.instagramImages;
                $scope.obj2 = [];
                $scope.settingData=data.settingsData[0];
                while ($scope.homePageContentBoxes.length) {
                    $scope.obj2.push($scope.homePageContentBoxes.splice(0, 2));
                }
                $timeout(function(){
                    angular.element('#pick_your_city').selectric('refresh');
                },1000);
                $scope.formattedCityArray = data.formattedCityArray;
                $scope.cms = data.cms;
                $scope.industryDataArray = data.industryDataArray;
                $rootScope.home_page_learn_more_link = data.settingsData[0]['home_page_learn_more_link'];

                $state.current.data.pageTitle = $scope.cms.v_meta_title;
                angular.element('title').html($state.current.data.pageTitle+" | "+GLOBAL.SITE_NAME);

                angular.forEach(data.national_assets, function(value, key) {
                    if(value.i_column == 1){
                        $scope.left_column_data = $scope.left_column_data.concat(value);
                    } else if(value.i_column == 2){
                        $scope.middle_column_data = $scope.middle_column_data.concat(value);
                    } else if(value.i_column == 3){
                        $scope.right_column_data = $scope.right_column_data.concat(value);
                    }
                });

                $scope.left_column_data.sort(function(a,b) { return parseFloat(a.i_display_order) - parseFloat(b.i_display_order) } );
                $scope.middle_column_data.sort(function(a,b) { return parseFloat(a.i_display_order) - parseFloat(b.i_display_order) } );
                $scope.right_column_data.sort(function(a,b) { return parseFloat(a.i_display_order) - parseFloat(b.i_display_order) } );
                setTimeout(function(){
                    if(angular.element('.bxslider').length){
                        angular.element('.bxslider').bxSlider({
                            infiniteLoop: true,
                            mode: 'horizontal',
                            speed: 400,
                            adaptiveHeight: false,
                            pager: false,
                            controls: true,
                            auto: true,
                            autoHover: true,
                        });
                    }
                }, 1);
            }
        });

        $scope.submit_contact_form = function(contacts){
            var email_pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
            clearTimeout(timeoutID);
            timeoutID = setTimeout(function(){

                var valid_status = form_valid('#contactFrm', '');
                if(valid_status){
                    angular.element("#contactFrm").find('.red_btn').val('Please Wait..');
                    var form_data = angular.element('#contactFrm').serialize();
                    $http({
                        method: 'POST',
                        url: SITE_URL+"contact",
                        data: form_data,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function(data, status) {
                        if(data == 'TRUE'){
                            anchorSmoothScroll.scrollTo('contact_us');
                            angular.element('#success_content').fadeIn(1000);
                            angular.element('#success_content').fadeOut(5000);
                            document.getElementById("contactFrm").reset();
                            angular.element('#contact_market').selectric('refresh');
                            angular.element('#contact_industry').selectric('refresh');
                        } else if(data == 'BOT') {
                            anchorSmoothScroll.scrollTo('contact_us');
                            angular.element('#bot_content').fadeIn(1000);
                            angular.element('#bot_content').fadeOut(5000);
                        } else {
                            anchorSmoothScroll.scrollTo('contact_us');
                            angular.element('#error_content').fadeIn(1000);
                            angular.element('#error_content').fadeOut(5000);
                        }
                        angular.element("#contactFrm").find('.red_btn').val('Submit');
                    });
                } else {
                    anchorSmoothScroll.scrollTo('contact_us');
                    angular.element('#error_content').fadeIn(1000);
                    angular.element('#error_content').fadeOut(5000);

                    if(angular.element(".error").length == 1 && angular.element(".error").hasClass('email') && !email_pattern.test(angular.element.trim($("#contact_email").val()))) {
                        angular.element('#error_content').hide();
                        angular.element('#error_content_email').fadeIn(1000);
                        angular.element('#error_content_email').fadeOut(5000);
                    }
                }
            }, 200);
        }
        $scope.scrollTo = function(elem){
            anchorSmoothScroll.scrollTo(elem);
        }
        setTimeout(function(){
            if($('.ie9').length > 0){
    			$('input[type="text"], input[type="email"], input[type="password"], textarea').each(function() {
    				if ($(this).attr('type') == 'password') {
    					$(this).attr('type', 'text').addClass('passwordField');
    				}
    				var phAttr = $(this).attr('placeholder');
    				if (typeof(phAttr) != 'undefined' && phAttr != false) {
    					if (phAttr != null && phAttr != '') {
    						$(this).addClass('default_title_text');
    						$(this).val(phAttr);
    						$(this).focus(function() {
    							if ($(this).hasClass('passwordField')) {
    								$(this).attr('type', 'password');
    							}
    							$(this).removeClass('default_title_text');
    							if ($(this).val() == $(this).attr('placeholder')) {
    								$(this).val('');
    							}
    						});
    						$(this).blur(function() {
    							if ($(this).attr('type') == 'password' && $(this).val() == '') {
    								$(this).attr('type', 'text').addClass('passwordField');
    							}
    							if ($(this).val() == '') {
    								$(this).val($(this).attr('placeholder'));
    								$(this).addClass('default_title_text');
    							}
    						});
    					}
    				}
    			});
            }
        }, 1000);
        
        setTimeout(function(){
            $rootScope.wrapper =angular.element('.bxslider .dropdown-red');
            angular.element('body,html').click(function(e) {
                if (($rootScope.wrapper[0] != e.target) && (!$rootScope.wrapper.has(e.target).length))
                {
            		angular.element('.bxslider  .dropdown-red a').next('.dropdown-list').slideUp();
                    angular.element('.bxslider  .dropdown-red a').removeClass('isopen');
                    angular.element('.extra-timeline').fadeIn();
                    angular.element('.banner .bx-pager-item').fadeIn();
            	}
            });

            angular.element(window).resize(function() {
                angular.element('.bxslider  .dropdown-red a').next('.dropdown-list').slideUp();
                angular.element('.bxslider  .dropdown-red a').removeClass('isopen');
                angular.element('.extra-timeline').fadeIn();
                angular.element('.banner .bx-pager-item').fadeIn();
            });

            angular.element('.all-skyline.scrollbar-inner').scrollbar();
         },3000);
     
         angular.element('.insta-images-inner a').fancybox({
            closeBtn  : true,
            arrows    : true,
            nextClick : true,
            helpers : {
                thumbs : {
                    width  : 50,
                    height : 50
                },
                overlay: {
                    locked: false
                }
            }
        });

    });
}]);

app.controller('ViewAllController', ['$scope', '$rootScope', '$http','$timeout','$state','$cookieStore','anchorSmoothScroll','$location', function($scope, $rootScope, $http, $timeout, $state, $cookieStore,anchorSmoothScroll, $location) {
    if(load_data == false){
        load_data = true;
        $scope.items = {};
        $scope.view_left_column_data = [];
        $scope.view_middle_column_data = [];
        $scope.view_right_column_data = [];

        //$scope.$on('$viewContentLoaded', function() {

        var responsePromise = $http.get(SITE_URL+"api-home-page");
        responsePromise.success(function(data, status, headers, config) {

            if(status == 200){
                $scope.items = data.national_assets;
                angular.forEach(data.national_assets, function(value, key) {
                    if(value.i_column == 1){
                        $scope.view_left_column_data = $scope.view_left_column_data.concat(value);
                    } else if(value.i_column == 2){
                        $scope.view_middle_column_data = $scope.view_middle_column_data.concat(value);
                    } else if(value.i_column == 3){
                        $scope.view_right_column_data = $scope.view_right_column_data.concat(value);
                    }
                });

                $scope.view_left_column_data.sort(function(a,b) { return parseFloat(a.i_display_order) - parseFloat(b.i_display_order) } );
                $scope.view_middle_column_data.sort(function(a,b) { return parseFloat(a.i_display_order) - parseFloat(b.i_display_order) } );
                $scope.view_right_column_data.sort(function(a,b) { return parseFloat(a.i_display_order) - parseFloat(b.i_display_order) } );


            }
        });
    }
    //});
}]);
/*
app.service('modalService', ['$modal',
    function ($modal) {
        

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'myModalContent.html',
            controller: 'CityDetailController'
        };
    
        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
    
        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };
    
        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};
    
            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
    
            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);
    
            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };
    
    }
]);
*/

/*For Add  New skyline */
app.directive('fancyboxSkyline',function($compile, $timeout){
    return {
            link: function($scope, element, attrs) {
                 setTimeout(function(){
                    element.fancybox({
                        hideOnOverlayClick:false,
                        helpers : {overlay: {locked: false}},
                        'closeBtn' : false,
                        maxWidth : 500, 
                        fitToView   : true, 
                        autoSize : false, 
                        autoHeight : true,
                        hideOnContentClick:true,
                        enableEscapeButton:false,
                        type: 'html',
                        content: $('#add_new_customskyline_html').html(),
                        afterLoad: function() {
                            setTimeout(function(){
                                if($('.ie9').length > 0){
                        			$('input[type="text"], input[type="email"], input[type="password"], textarea').each(function() {
                        				if ($(this).attr('type') == 'password') {
                        					$(this).attr('type', 'text').addClass('passwordField');
                        				}
                        				var phAttr = $(this).attr('placeholder');
                        				if (typeof(phAttr) != 'undefined' && phAttr != false) {
                        					if (phAttr != null && phAttr != '') {
                        						$(this).addClass('default_title_text');
                        						$(this).val(phAttr);
                        						$(this).focus(function() {
                        							if ($(this).hasClass('passwordField')) {
                        								$(this).attr('type', 'password');
                        							}
                        							$(this).removeClass('default_title_text');
                        							if ($(this).val() == $(this).attr('placeholder')) {
                        								$(this).val('');
                        							}
                        						});
                        						$(this).blur(function() {
                        							if ($(this).attr('type') == 'password' && $(this).val() == '') {
                        								$(this).attr('type', 'text').addClass('passwordField');
                        							}
                        							if ($(this).val() == '') {
                        								$(this).val($(this).attr('placeholder'));
                        								$(this).addClass('default_title_text');
                        							}
                        						});
                        					}
                        				}
                        			});
                                }
                            }, 500);
        
                        }
                    });
                }, 500);
            }
        }
});
 
app.controller('CityDetailController', ['$scope', '$rootScope', '$http','$timeout','$state','$stateParams','anchorSmoothScroll','$sce','$filter', '$location','GLOBAL','$window', function($scope, $rootScope, $http, $timeout, $state, $stateParams, anchorSmoothScroll, $sce, $filter, $location, GLOBAL, $window) {
    $scope.$on('$viewContentLoaded', function() {
        /*$scope.load_script = function() {
            var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.src = 'http://maps.google.com/maps/api/js?sensor=false';
            document.body.appendChild(s);
        }
        if ($window.attachEvent) {  
            $window.attachEvent('onload', $scope.load_script); 
        } else {
            $window.addEventListener('load', $scope.load_script, false);
        }*/
        $scope.load_script
        load_data = true;
        $rootScope.items = {};
        $scope.selected_items = {};
        $scope.building_list = '';
        $scope.addCustomSkyline = {};
        $scope.newSkylineLink={link:''};
        $scope.addBuildingItem='';
        $scope.responseError={message:''};
        $scope.responseSuccess={message:''};
        
        /*For Add building to skyline event*/
        $scope.addSkyLine=function(addSkyLine){
            $scope.addBuildingItem=addSkyLine;
            setTimeout(function(){$.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth: 500,href: "#addBuildingToSkyline"})},200);
        }
        
        $scope.openAddNewSkyline=function(){
            setTimeout(function(){ $.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, href: "#addNewCustomskyline"})},500);
        }
        
        /*For Add building to skyline cancel button event*/
        $scope.cancelConfirm=function(){
            $scope.addCustomSkyline = {};
            $scope.addCustomSkyline = {};
            $.fancybox.close();
            $.fancybox.update();
            angular.element('.error_content').hide();
            angular.element('input[name="v_title"]').removeClass('error');
        }
        
        /*setTimeout(function(){
            angular.element('.all-skyline.local').scrollbar();
        },500);*/
        
        /*Just for teting purpose*/
       /* $scope.thisCOnfirm=function(){
            $.fancybox.update();
            $rootScope.items.otherSkyline=$rootScope.items.userCustomSkylines;
            $scope.responseSuccess.message='Your new skyline has been created.';
            $.fancybox.open({'closeBtn' : false, maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, helpers : {overlay: {locked: false}},href: "#viewcustomskyline", wrapCSS: 'view_fancybox'});
        }*/
        
        angular.element('.all-skyline.local').scrollbar();
        
        /*Open close Custom skyline list */
        angular.element('#viewcustomskyline a.red_btn').on('click', function(){
            if($(this).hasClass('isopen')){
                $(this).next('.dropdown-list').slideUp();
                $(this).removeClass('isopen');
            }
            else{
                $(this).next('.dropdown-list').slideDown();
                $(this).addClass('isopen');
            }
        })
        
        /*For Add building to skyline confirm button event*/
        $scope.Confirm=function(skyline){
            angular.element('.red_btn.button.confirm').html("Please wait");
			angular.element('.red_btn.button.confirm').attr("disabled","disabled");
            $scope.sendData={'skylineID':skyline.id,'addBuildingID':$scope.selected_items.id}
            var responsePromise = $http.post(GLOBAL.SITE_URL+'cities/add-user-skyline',($scope.sendData));
			responsePromise.success(function(data, status1, headers, config)
			{
				
			     if(data.IsSuccess){
			         $.fancybox.close();
					 $scope.responseSuccess.message=data.Message;
					 $scope.newSkylineLink.link=skyline.v_slug;
                     $rootScope.items.otherSkyline=data.Data.otherSkyline;
                     setTimeout(function(){ $.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, href: "#viewcustomskyline"})},200);
                 }else{
                    $scope.responseError.message=data.Message;
                    setTimeout(function(){ $.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, href: "#errroFancyBox"})},200);
                 }
				
				setTimeout(function(){
					angular.element('.red_btn.button.confirm').html("Yes");
					angular.element('.red_btn.button.confirm').removeAttr("disabled");
				},1000);
			});
        }
        
        $scope.gotoUrl = function(slug){
            $.fancybox.close();
            $.fancybox.update();
            $state.go('my-skyline',{slug:slug});
        }
        
        $rootScope.saveSkyLine2 = function(addCustomSkyline){
            console.log('click event');
        }
        /*Save New skyline event */
        $rootScope.saveSkyLine = function(addCustomSkyline){
            var form = angular.element('#addNewCustomskyline');
            var valid_status = form_valid(form);
            if(valid_status) {
                angular.element('.red_btn.create-skyline-btn').val("Please wait");
				angular.element('.red_btn.create-skyline-btn').attr("disabled","disabled");
                var responsePromise = $http.post(GLOBAL.SITE_URL+'cities/user-custom-skyline',addCustomSkyline);
    			responsePromise.success(function(data, status1, headers, config)
    			{
    			     angular.element('.red_btn.create-skyline-btn').val("Create");
                     angular.element("header .city-listing-wrapper .right-city-listing ul").load(window.location.href + 'header .city-listing-wrapper .right-city-listing ul');
    			     if(data.IsSuccess){
    			         $scope.addCustomSkyline = {};
                         $scope.responseSuccess.message=data.Message;
        			     $rootScope.items.userCustomSkylines=data.Data.userSkyline;
                         $rootScope.items.otherSkyline=data.Data.otherSkyline;
        			     $scope.newSkylineLink.link=data.Data.currentSkyline.v_slug;
        			     $.fancybox.open({'closeBtn' : false, maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, helpers : {overlay: {locked: false}},href: "#viewcustomskyline", wrapCSS: 'view_fancybox'});
						 setTimeout(function(){
							angular.element('.red_btn.create-skyline-btn').html("Yes");
							angular.element('.red_btn.create-skyline-btn').removeAttr("disabled");
						},1000);
                     }
    			});
            }
            else {
                $.fancybox.update();
                form.find('#error_content_required').show();
                //anchorSmoothScroll.scrollTo('addNewCustomskyline');
            }
        };
        
        /*Download PDF File*/
        $scope.downloadPdf=function(items){
            console.log(items);
            window.location.href = GLOBAL.SITE_URL+'local-market-pdf/' + items.v_download_pdf;
        }     
        
        /*Close tooltip button*/
        $scope.aboutIconTooltip=function(){
            angular.element('.tooltip-section').css({"visibility": "visible", "opacity": "1"});
        }
        
        $scope.closeBtn=function(){
            angular.element('.tooltip-section').css({"visibility": "hidden", "opacity": "0"});
        }
        $scope.getType = function(input) {
            var m = (/[\d]+(\.[\d]+)?/).exec(input);
            if (m) {
               // Check if there is a decimal place
               if (m[1]) { return 'float'; }
               else { return 'int'; }
            }
            return 'string';
        }

        $scope.loadData = function(slug){
            var responsePromise = $http.get(SITE_URL+"cities/data/"+slug);
            responsePromise.success(function(data, status, headers, config) {
                if(status == 200){
                    $rootScope.items = data;
                    $scope.backgroundImage=GLOBAL.SITE_URL+GLOBAL.CITY_BACKGROUND_IMAGE_PATH+data.cities.v_background_image_url;
                    /* To share on menu share button */
                    $state.current.data.pageTitle = $rootScope.items.cities.v_skyline_title;
                    angular.element('title').html($rootScope.items.cities.v_skyline_title+" | "+GLOBAL.SITE_NAME);
                    var flag_default = 0;
                    angular.forEach($rootScope.items.cities.building, function(value, key) {
                        angular.forEach(value, function(v, k) {
                            if(v == '' && k != 'v_address1' && k != 'v_address2' && k != 'v_state' && k != 'i_city_id') { v = 'N/A'; }
                            if(k == 'i_occupied' || k == 'i_leased') {
                                if(parseInt(v) == 0){
                                    v = '0%';
                                }
                                if(isNaN(v) || v === undefined) { } else {
                                    if($scope.getType(v) == 'float') {
                                        v = parseFloat(v).toFixed(1)+'%';
                                    }
                                }
                            }
                            value[k] = v;
                        })
                       // console.log(value);
                        if(value.is_default == 1){
                            flag_default = 1;
                            $scope.selected_items = value;
                            $scope.selected_items.address = '';
                            if(value.v_address1 != ''){
                                $scope.selected_items.address = $scope.selected_items.address + value.v_address1;
                            }
                            if(value.v_address2 != '' && $rootScope.items.cities.v_name.indexOf(value.v_address2) < 0 ){
                                $scope.selected_items.address = $scope.selected_items.address + ", " + value.v_address2;
                            }
                            $scope.selected_items.address = $scope.selected_items.address + ", " + $rootScope.items.cities.v_name;
                            if(value.v_state != '' && value.v_state != $rootScope.items.cities.v_name && (value.v_state).indexOf($rootScope.items.cities.v_name) == -1 && ($rootScope.items.cities.v_name).indexOf(value.v_state) == -1){
                                $scope.selected_items.address = $scope.selected_items.address + ", " + value.v_state;
                            }

                            if(GLOBAL.IS_MOBILE == 0){
                                $scope.building_list = $scope.selected_items.id;
                                $timeout(function(){
                                    var element_id = '.building_'+$scope.selected_items.id;
                                    angular.element(element_id).addClass('on').css('opacity','1');
                                }, 1000);
                            }

                        }
                    });

                    $timeout(function(){
                        if(flag_default == 0){
                            if(angular.element(window).width() > 767){
                                angular.element('.building_list:first').addClass('on').css('opacity','1');
                                angular.element('.building_list:first').trigger('click');
                                //angular.element('#building_map').css('position', 'absolute');
                            } else {
                                //angular.element('#building_map').css('position', 'relative');
                            }
                        }
                        var city_image_height = '';
                        var buildingImg = new Image();
                        buildingImg.onload = function() {
                            city_image_height = buildingImg.height;
                        }
                        buildingImg.src = angular.element('#city_main .city_left .city_lists ul li').find('img').attr('src');

                        $scope.generateMap();
                        owlCarouselSetHeight();
                    }, 1);
                }
            }).error(function(e){
                $state.go('/404');
            });
        }

        $scope.generateMap = function(){

            if(angular.element('#city_car').height() < 100){
                angular.element('#building_map').css('height','200');
            } else {
                angular.element('#building_map').css('height',angular.element('#city_car').height());
            }

            if($scope.selected_items.d_lat > 0 || $scope.selected_items.d_long > 0){
                var myLatlng = new google.maps.LatLng($scope.selected_items.d_lat,$scope.selected_items.d_long);
                var myOptions = {
                    zoom: 14,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    width: '100%',
                }
                map = new google.maps.Map(document.getElementById("building_map"), myOptions);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable: false,
                    raiseOnDrag: true,
                    map: map,
                    labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels", // the CSS class for the label
                    labelStyle: {opacity: 0.75}
                });

                var iw1 = new google.maps.InfoWindow({
                    content: "<strong>"+$scope.selected_items.v_name+"</strong> <br>"+$scope.selected_items.address
                });
                google.maps.event.addListener(marker, 'click', function() {
                   iw1.open(map,marker);
                });
                iw1.open(map,marker);
            }

            //angular.element('#building_map').css('opacity', '1');
            angular.element('#sb-info').append(angular.element('.social_wrap').html());

        }

        $scope.city_detail_contact_us = function(city_name){
            if($location.path() == '/') {
                city_detail_url = SITE_URL;
            } else {
                city_detail_url = SITE_URL+$location.path();
            }
            
            //$state.go('/');
            $timeout(function(){
                anchorSmoothScroll.scrollTo('contact_us');
            }, 1500);
            $timeout(function(){
                $rootScope.current_url = city_detail_url;
            }, 3000);
        }

        $scope.displayCityData = function(id){

            angular.element('#building_select').val(id);
            angular.element('#building_select').selectric('refresh');
            angular.element('.building_'+id).addClass('on').css('opacity','1');
            var building_data = $filter('filter')($scope.items.cities.building, function (d) {return d.id === id;})[0];
            angular.element('.st_sharethis_custom').attr('st_image', GLOBAL.SITE_URL+GLOBAL.BUILDING_PLAIN_IMAGE_PATH+building_data.v_plain_image);

            angular.forEach(building_data, function(v, k) {
                if(v == '' && k != 'v_address1' && k != 'v_address2' && k != 'v_state' && k != 'i_city_id') { v = 'N/A'; }
                if(k == 'i_occupied' || k == 'i_leased') {
                    if(parseInt(v) == 0){
                        v = '0%';
                    }
                    if(isNaN(v) || v === undefined) { } else {
                        if($scope.getType(v) == 'float') {
                            v = parseFloat(v).toFixed(1)+'%';
                        }
                    }
                }
                building_data[k] = v;
            })
            $scope.selected_items = building_data;
            $scope.selected_items.address = '';
            if($scope.selected_items.v_address1 != ''){
                $scope.selected_items.address = $scope.selected_items.address + $scope.selected_items.v_address1;
            }
            if($scope.selected_items.v_address2 != '' && $scope.items.cities.v_name.indexOf($scope.selected_items.v_address2) < 0){
                $scope.selected_items.address = $scope.selected_items.address + ", " + $scope.selected_items.v_address2;
            }
            $scope.selected_items.address = $scope.selected_items.address + ", " + $scope.items.cities.v_name;

            if($scope.selected_items.v_state != '' && $scope.items.cities.v_name != $scope.selected_items.v_state && ($scope.selected_items.v_state).indexOf($scope.items.cities.v_name) == -1 && ($scope.items.cities.v_name).indexOf($scope.selected_items.v_state) == -1) {
                $scope.selected_items.address = $scope.selected_items.address + ", " + $scope.selected_items.v_state;
            }

            if($scope.selected_items.d_lat > 0 || $scope.selected_items.d_long > 0){
                var myLatlng = new google.maps.LatLng($scope.selected_items.d_lat,$scope.selected_items.d_long);
                var myOptions = {
                    zoom: 14,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    width: '100%',
                }
                map = new google.maps.Map(document.getElementById("building_map"), myOptions);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable: false,
                    raiseOnDrag: true,
                    map: map,
                    labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels", // the CSS class for the label
                    labelStyle: {opacity: 0.75}
                });

                var iw1 = new google.maps.InfoWindow({
                    content: "<strong>"+$scope.selected_items.v_name+"</strong> <br>"+$scope.selected_items.address
                });

                google.maps.event.addListener(marker, "click", function (e) { iw1.open(map, this); });
                iw1.open(map,marker);
            }
            angular.element('#sb-info').append(angular.element('.social_wrap').html());

        }

        $timeout(function(){
            $scope.$apply();
            angular.element('#city_main .city_right .city_detail ul li:even').addClass('even');
        }, 1500);

        $timeout(function(){
            posOfBuildingList = 0;
            angular.element('.building_list').removeClass('w110');
            angular.element('.building_list').removeClass('w120');
            angular.element('.building_list').removeClass('w180');
            angular.element('.building_list').removeAttr('scrollleft');

            angular.forEach(angular.element('.building_list'), function(v,k){
                angular.element(v).removeClass('w110');
                angular.element(v).removeClass('w120');
                angular.element(v).removeClass('w180');
                angular.element(v).removeAttr('scrollleft');
                angular.element(v).attr('scrollleft',posOfBuildingList);
                widthTemp = angular.element(v).width();
                //console.log(angular.element(v).attr('id')+"="+widthTemp);
                if(widthTemp >= 120) { angular.element(v).addClass('w110'); }
                else if(widthTemp >= 100) { angular.element(v).addClass('w120'); }
                else if(widthTemp <= 50 && widthTemp >= 10) { angular.element(v).addClass('w180'); }
                //console.log(angular.element(v).attr('class'));
                posOfBuildingList = posOfBuildingList + widthTemp;
            });
            $(".scroll-wrapper .scrollbar-inner").scrollLeft(angular.element(".on").attr('scrollleft'));
        }, 3000);

        $scope.hoverGrid = function(id){
            if(hoverFlag == 1){
                angular.forEach(angular.element('#city_main .city_left .city_lists ul li'), function(v,k){
                    angular.element(v).css('opacity','0.3').removeClass('on');
                });
                angular.element('.building_'+id).css('opacity','1').addClass('on');
                angular.element('.viewport').addClass('on');
            }
        }

        $scope.looseHoverFullGrid = function(){
            /*angular.forEach(angular.element('#city_main .city_left .city_lists ul li'), function(v,k){
                angular.element(v).removeClass('on');
                if(angular.element(v).attr('id') != 'building_'+id){
                    angular.element(v).css('opacity','1');
                }
            });*/
            if(!angular.element('.viewport').hasClass('on')){

                angular.forEach(angular.element('#city_main .city_left .city_lists ul li'), function(v,k){
                    angular.element(v).removeClass('on').css('opacity','1');
                });
                angular.element('.building_'+$scope.selected_items.id).addClass('on').css('opacity','1');
            } else {
                angular.element('.viewport').removeClass('on');
            }
        }

        $scope.loadData($stateParams.slug);
        
        
        $scope.promptSomething = function() {
            var promise = modals.open(
                "prompt",
                {
                    message: "Who rocks the party the rocks the body?",
                    placeholder: "MC Lyte."
                }
            );
            promise.then(
                function handleResolve( response ) {
                    console.log( "Prompt resolved with [ %s ].", response );
                },
                function handleReject( error ) {
                    console.warn( "Prompt rejected!" );
                }
            );
        };
        
        setTimeout(function(){
            $rootScope.wrapperSkyline =angular.element('.drop-down-skyline');
            $rootScope.wrapperFacnyBoxSkyline =angular.element('#viewcustomskyline .dropdown-red.local');
            $rootScope.HeaderFacnyBoxSkyline =angular.element('#sucess_header_custom_skyline .dropdown-red-header');
            angular.element('html,body').click(function(e) {
                if (($rootScope.wrapperSkyline[0] != e.target) && (!$rootScope.wrapperSkyline.has(e.target).length))
                {
            		angular.element('.drop-down-skyline a').next('.dropdown-list').slideUp();
                    angular.element('.drop-down-skyline a').removeClass('isopen');
            	}
                
                if (($rootScope.wrapperFacnyBoxSkyline[0] != e.target) && (!$rootScope.wrapperFacnyBoxSkyline.has(e.target).length))
                {
            		angular.element('#viewcustomskyline .dropdown-red.local a').next('.dropdown-list').slideUp();
                    angular.element('#viewcustomskyline .dropdown-red.local a').removeClass('isopen');
            	}
                
                if (($rootScope.HeaderFacnyBoxSkyline [0] != e.target) && (!$rootScope.HeaderFacnyBoxSkyline .has(e.target).length))
                {
                    $('#sucess_header_custom_skyline .dropdown-red-header a').next('.dropdown-list').slideUp();
                    $('#sucess_header_custom_skyline .dropdown-red-header a').removeClass('isopen');
            	}
                
                angular.element('.drop-down-skyline .dropdown-list').on('click','a',function(){
                    angular.element('.drop-down-skyline a').next('.dropdown-list').slideUp();
                    angular.element('.drop-down-skyline a').removeClass('isopen');
                });                
            });

            angular.element(window).resize(function() {
                angular.element('.drop-down-skyline a').next('.dropdown-list').slideUp();
                angular.element('.drop-down-skyline a').removeClass('isopen');
            });
            
         },3000);
                
                
    });
}]);
app.controller('CustomSkylineController', ['$scope', '$rootScope', '$http','$timeout','$state','$stateParams','anchorSmoothScroll','$sce','$filter', '$location','GLOBAL', '$cookieStore',function($scope, $rootScope, $http, $timeout, $state, $stateParams, anchorSmoothScroll, $sce, $filter, $location, GLOBAL, $cookieStore) {
    $scope.$on('$viewContentLoaded', function() {
        load_data = true;
        $rootScope.items = {};
        $scope.selected_items = {};
        $scope.building_list = '';
        $scope.edit_skyline_name = false;
        $scope.skyline_title = '';
        $scope.edit_skyline_desc = {};
        $scope.edit_skyline_long_desc = {};
        $scope.addNote = {};
        $scope.confirm_note = {};
        $scope.share_skyline = {};
        $rootScope.current_login_id = $cookieStore.get('isGuestLogged');

        $scope.skyline_name_edit = function() {
            $scope.skyline_title = $rootScope.items.skyline.v_title;
            $scope.edit_skyline_name = true;
        };

        $scope.cancel_edit_skyline_name = function(skyline_title) {
            if(skyline_title == $rootScope.items.skyline.v_title) {
                $scope.edit_skyline_name = false;
            } else {
                var result = confirm('Your changes have not been saved. Discard changes?')
                if(result) {
                    $scope.skyline_title = $rootScope.items.skyline.v_title;
                    $scope.edit_skyline_name = false;
                }
            }
        }
        
        $scope.open_skyline_desc_edit_frm = function() {
            $scope.edit_skyline_desc.v_abbreviated_name = $rootScope.items.skyline.v_abbreviated_name;
            $scope.edit_skyline_desc.v_short_desc = $rootScope.items.skyline.v_short_desc;
            
            setTimeout(function(){ $.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, href: "#edit_short_desc"})},500);
        }
        
        $scope.post_edit_skyline_desc = function(edit_skyline_desc) {
            var form = angular.element('#edit_short_desc_frm');
            var valid_status = form_valid(form);
            
            if(valid_status) {
                form.find('input[type="submit"].v').val("Please wait");
				form.find('input[type="submit"].edit-skyline-desc-btn').attr("disabled","disabled");
                edit_skyline_desc.id = $rootScope.items.skyline.id;
                
                var responsePromise = $http.post(SITE_URL+"skyline-data/edit-skyline-desc", edit_skyline_desc);
                responsePromise.success(function(data, status, headers, config) {
                    form.find('input[type="submit"].edit-skyline-desc-btn').removeAttr("disabled");
    			     form.find('input[type="submit"].edit-skyline-desc-btn').val("Edit");
                     
                     if(data == 'TRUE') {
                        $rootScope.items.skyline.v_abbreviated_name = $scope.edit_skyline_desc.v_abbreviated_name;
                        $rootScope.items.skyline.v_short_desc = $scope.edit_skyline_desc.v_short_desc;
                        $scope.cancel_edit_skyline_desc();
                    } else {
                        alert('Error');
                    }
                });
            }
            else {
                form.find('.error_content').show();
                $.fancybox.update();
            }
        };
        
        $scope.cancel_edit_skyline_desc = function() {
            $scope.edit_skyline_desc = {};
            $('#edit_short_desc_frm').find('.error_content').hide();
            
            angular.forEach(angular.element("#edit_short_desc_frm .error"), function(value, key){
                angular.element(value).removeClass('error');
            });

            $.fancybox.close();
            $.fancybox.update();
        }
        
        //Open long desc edit form popup
        $scope.open_skyline_long_desc_edit_frm = function() {
             $scope.edit_skyline_long_desc.v_long_desc = $rootScope.items.skyline.v_long_desc;
            
            setTimeout(function(){ $.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, href: "#edit_long_desc"})},100);
        }
        
        //Cancel long desc edit form popup
        $scope.cancel_edit_long_desc = function() {
            $scope.edit_skyline_long_desc = {};
            $('#edit_long_desc_frm').find('.error_content').hide();
            
            angular.forEach(angular.element("#edit_long_desc_frm .error"), function(value, key){
                angular.element(value).removeClass('error');
            });

            $.fancybox.close();
            $.fancybox.update();
        }
        
        //Post the skyline long description
        $scope.post_edit_skyline_long_desc = function(edit_skyline_long_desc) {
            var form = angular.element('#edit_long_desc_frm');
            var valid_status = form_valid(form);
            
            if(valid_status) {
                form.find('input[type="submit"].edit-skyline-desc-btn').val("Please wait");
				form.find('input[type="submit"].edit-skyline-desc-btn').attr("disabled","disabled");
                edit_skyline_long_desc.id = $rootScope.items.skyline.id;
                
                var responsePromise = $http.post(SITE_URL+"skyline-data/edit-skyline-long-desc", edit_skyline_long_desc);
                responsePromise.success(function(data, status, headers, config) {
                    form.find('input[type="submit"].edit-skyline-desc-btn').removeAttr("disabled");
    			     form.find('input[type="submit"].edit-skyline-desc-btn').val("Edit");
                     if(data == 'TRUE') {
                        $rootScope.items.skyline.v_long_desc = edit_skyline_long_desc.v_long_desc;
                        $scope.cancel_edit_long_desc();
                    } else {
                        alert('Error');
                    }
                });
            } else {
                form.find('.error_content').show();
                $.fancybox.update();
            }
        };
        
        $scope.post_skyline_name_edit = function(v_title) {
            if(v_title != $rootScope.items.skyline.v_title) {
                var data = {};
                data['id'] = $rootScope.items.skyline.id;
                data['v_title'] = v_title
                var responsePromise = $http.post(SITE_URL+"skyline-data/edit-skyline-name", data);
                responsePromise.success(function(data, status, headers, config) {
                    if(data == 'TRUE') {
                        $scope.edit_skyline_name = false;
                        $rootScope.items.skyline.v_title = v_title;
                    } else {
                        alert('Error');
                    }
                });
            } else {
                $scope.edit_skyline_name = false;
            }
        };
        
        /*For open delete skyline confirm box*/
        $scope.delete_skyline = function(){
            setTimeout(function(){
                $.fancybox.open({
                        'closeBtn' : false, 
                        helpers : {
                            overlay: {
                                closeClick: false,
                                locked: false
                            }
                        },
                        minWidth: 530,
                        maxWidth: 530,
                        href: "#delete_skyline_confirm"
                })
            },200);
        }
        
        //Delete skyline confirm: press 'Yes' button
        $scope.delete_skyline_confirm = function() {
            $('#delete_skyline_confirm button.confirm').text("Please wait...");
            $('#delete_skyline_confirm button').attr("disabled","disabled");
               
            var responsePromise = $http.post(SITE_URL+"skyline-data/delete-skyline",{ id: $rootScope.items.skyline.id });
            responsePromise.success(function(data, status, headers, config) {
                if(data == 'TRUE') {
                    $.fancybox.close();
                    $.fancybox.update();
                    
                    window.location.href = GLOBAL.SITE_URL;
                    //$state.go('/');
                } else {
                    $.fancybox.close();
                    $.fancybox.update();
            
                    setTimeout(function(){$.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}}, minWidth: 530, maxWidth: 530,href: "#delete_skyline_error"})},500);
                }
                
                $('#delete_skyline_confirm button.confirm').text("Yes");
                $('#delete_skyline_confirm button').removeAttr("disabled");            
            });
        };
        
        $scope.note_error_msg = 'Please enter note.';
        $scope.add_note = function(v_note) {
            $scope.note_error_msg = 'Please enter note.';
            var form = $('#add_new_note_frm');
            form.find('#v_note').removeClass('error');
            if(form_valid(form)) {
                var send_data = {};
                 send_data['v_note'] = v_note;
                 send_data['i_skyline_id'] = $rootScope.items.skyline.id;

                var responsePromise = $http.post(SITE_URL+"skyline-data/add-skyline-note", send_data);
                responsePromise.success(function(data, status, headers, config) {
                    if(data != 'FALSE') {
                        $scope.addNote.v_note = '';
                        if (!$scope.$$phase) $scope.$apply();
                        $rootScope.items.skyline.notes.unshift(data);
                    } else {
                       $scope.note_error_msg = 'You cannot add the note.'; 
                       form.find('.error_content').show();
                       form.find('#v_note').addClass('error');
                    }
                });
            } else {
                form.find('.error_content').show();
            }
        }        
        
        /*For open delete note confirm box*/
        $scope.delete_note = function(note){
            $scope.confirm_note = note;
            setTimeout(function(){$.fancybox.open({'closeBtn' : false ,helpers : {overlay: {closeClick: false, locked: false}},maxWidth: 500,href: "#delete_note_confirm"})},200);
        }
        
        //Delete note confirm: press 'Yes' button
        $scope.delete_note_confirm = function() {
            $('#delete_note_confirm button.confirm').text("Please wait...");
            $('#delete_note_confirm button').attr("disabled","disabled");
                
            var responsePromise = $http.post(SITE_URL+"skyline-data/delete-skyline-note", $scope.confirm_note);
            responsePromise.success(function(data, status, headers, config) {
                if(data == 'TRUE') {
                    index = $rootScope.items.skyline.notes.indexOf($scope.confirm_note);
                    $rootScope.items.skyline.notes.splice(index,1);
                    
                    $scope.confirm_note = {};
                    $.fancybox.close();
                    $.fancybox.update();
                } else {
                    $scope.confirm_note = {};
                    $.fancybox.close();
                    $.fancybox.update();
            
                    setTimeout(function(){$.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth: 500,href: "#delete_note_error"})},500);
                }
                $('#delete_note_confirm button.confirm').text("Yes");
                $('#delete_note_confirm button').removeAttr("disabled");            
            });
        };
        
        $scope.delete_note_error = function() {
            $.fancybox.close();
            $.fancybox.update();
        }
        
        // Delete note confirm: press 'No' button
        $scope.cancel_delete_note_confirm = function() {
            $scope.confirm_note = {};
            $.fancybox.close();
            $.fancybox.update();
        };

        //For open share popup
        $scope.open_share_frm = function() {
            setTimeout(function(){$.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}}, maxWidth: 600, minWidth: 600, href: "#share_skyline"})}, 100);
        }
        
        //For cancel share popup
        $scope.cancel_share_skyline = function() {
            var form = angular.element('#share_skyline_frm');
            form.find('#error_content').hide();
            angular.element('.tags').removeClass('error');
            $scope.share_skyline = {};
            $.fancybox.close();
            $.fancybox.update();
        };
        
        $scope.share_required_msg = 'Field is required.';
        
        //For share skyline
        $scope.shareSkyline = function(share_skyline) {
            angular.element('.tags').removeClass('error');
            var form = angular.element('#share_skyline_frm');
            //form.find('input').removeClass('comma-separate-emails');
            var valid_status = form_valid(form);
            
            if(valid_status) {
                form.find('#error_content').hide();
                form.find('input[type=submit]').val('Please wait..');
                
                var sendData= {};
                sendData['id'] = $rootScope.items.skyline.id;
                sendData['share_skyline'] = share_skyline;
                sendData['share_link'] = window.location.href;
                var responsePromise = $http.post(GLOBAL.SITE_URL+'skyline-data/share-emails',sendData);
    			responsePromise.success(function(data, status1, headers, config)
    			{
    			    form.find('input[type=submit]').val('Share');
                    if(data == 'TRUE') {
                        $scope.share_skyline = {};
                        $.fancybox.close();
                        $.fancybox.update();
                        setTimeout(function(){$.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}}, maxWidth: 500,  href: "#sucessCustomSkyline"})}, 100);
                    }else{
                         form.find('#error_content').show();
                    }
                    
    			});
            } else {
                angular.element('.tags').addClass('error');
                form.find('#error_content').show();
            }
        };
        
        $scope.getType = function(input) {
            var m = (/[\d]+(\.[\d]+)?/).exec(input);
            if (m) {
               // Check if there is a decimal place
               if (m[1]) { return 'float'; }
               else { return 'int'; }
            }
            return 'string';
        }
        
        
        

        $scope.loadData = function(slug){
            var responsePromise = $http.get(SITE_URL+"skyline-data/data/"+slug);
            responsePromise.success(function(data, status, headers, config) {
                if(status == 200){
                    $rootScope.items = data;
                    
                    $scope.image_height = $rootScope.items.highestFloorBuilding ? (((3500 * $rootScope.items.highestFloorBuilding.d_floor_height) / GLOBAL.DEFAULT_FLOOR_HEIGHT) / 10 ) : 0 ;
                    
                    $scope.image_margin_top = 350 - $scope.image_height;
                    
                    /* To share on menu share button */
                    //$state.current.data.pageTitle = $rootScope.items.cities.v_skyline_title;
                    //angular.element('title').html($rootScope.items.cities.v_skyline_title+" | "+GLOBAL.SITE_NAME);
                    var flag_default = 0;
                    angular.forEach($rootScope.items.skyline_buildings, function(value, key) {
                        angular.forEach(value.building, function(v, k) {
                            if(v == '' && k != 'v_address1' && k != 'v_address2' && k != 'v_state' && k != 'i_city_id') { v = 'N/A'; }
                            if(k == 'i_occupied' || k == 'i_leased') {
                                if(parseInt(v) == 0){
                                    v = '0%';
                                }
                                if(isNaN(v) || v === undefined) { } else {
                                    if($scope.getType(v) == 'float') {
                                        v = parseFloat(v).toFixed(1)+'%';
                                    }
                                }
                            }
                            value[k] = v;
                        });
                        
                        if(value.building.is_default == 1){
                            flag_default = 1;
                            $scope.selected_items = value.building;
                            
                            $scope.selected_items.address = '';
                            if(value.building.v_address1 != ''){
                                $scope.selected_items.address = $scope.selected_items.address + value.v_address1;
                            }
                            if(value.building.v_address2 != '' && $rootScope.items.cities.v_name.indexOf(value.v_address2) < 0 ){
                                $scope.selected_items.address = $scope.selected_items.address + ", " + value.v_address2;
                            }
                            $scope.selected_items.address = $scope.selected_items.address + ", " + $rootScope.items.cities.v_name;
                            if(value.building.v_state != '' && value.building.v_state != $rootScope.items.cities.v_name && (value.building.v_state).indexOf($rootScope.items.cities.v_name) == -1 && ($rootScope.items.cities.v_name).indexOf(value.building.v_state) == -1){
                                $scope.selected_items.address = $scope.selected_items.address + ", " + value.v_state;
                            }

                            if(GLOBAL.IS_MOBILE == 0){
                                $scope.building_list = $scope.selected_items.id;
                                $timeout(function(){
                                    var element_id = '.building_'+$scope.selected_items.id;
                                    angular.element(element_id).addClass('on').css('opacity','1');
                                }, 1000);
                            }

                        }
                    });
  
                    $timeout(function(){
                        if(flag_default == 0){
                            if(angular.element(window).width() > 767){
                                angular.element('.building_list:first').addClass('on').css('opacity','1');
                                angular.element('.building_list:first').trigger('click');
                                //angular.element('#building_map').css('position', 'absolute');
                            } else {
                                //angular.element('#building_map').css('position', 'relative');
                            }
                        }
                        var city_image_height = '';
                        var buildingImg = new Image();
                        buildingImg.onload = function() {
                            city_image_height = buildingImg.height;
                        }
                        buildingImg.src = angular.element('#city_main .city_left .city_lists ul li').find('img').attr('src');

                        $scope.generateMap();
                    }, 1);
                }
            }).error(function(e){
                $state.go('/404');
            });
        }

        $scope.generateMap = function(){

            if(angular.element('#city_car').height() < 100){
                angular.element('#building_map').css('height','200');
            } else {
                angular.element('#building_map').css('height',angular.element('#city_car').height());
            }

            if($scope.selected_items.d_lat > 0 || $scope.selected_items.d_long > 0){
                var myLatlng = new google.maps.LatLng($scope.selected_items.d_lat,$scope.selected_items.d_long);
                var myOptions = {
                    zoom: 14,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    width: '100%',
                }
                map = new google.maps.Map(document.getElementById("building_map"), myOptions);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable: false,
                    raiseOnDrag: true,
                    map: map,
                    labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels", // the CSS class for the label
                    labelStyle: {opacity: 0.75}
                });

                var iw1 = new google.maps.InfoWindow({
                    content: "<strong>"+$scope.selected_items.v_name+"</strong> <br>"+$scope.selected_items.address
                });
                google.maps.event.addListener(marker, 'click', function() {
                   iw1.open(map,marker);
                });
                iw1.open(map,marker);
            }

            //angular.element('#building_map').css('opacity', '1');
            angular.element('#sb-info').append(angular.element('.social_wrap').html());

        }

        $scope.city_detail_contact_us = function(city_name){
            if($location.path() == '/') {
                city_detail_url = SITE_URL;
            } else {
                city_detail_url = SITE_URL+$location.path();
            }

            $state.go('/');
            $timeout(function(){
                anchorSmoothScroll.scrollTo('contact_us');
            }, 1500);
            $timeout(function(){
                $rootScope.current_url = city_detail_url;
            }, 3000);
        }

        $scope.displayCityData = function(id){

            angular.element('#building_select').val(id);
            angular.element('#building_select').selectric('refresh');
            angular.element('.building_'+id).addClass('on').css('opacity','1');
            var building_data = $filter('filter')($scope.items.skyline_buildings, function (d) {return d.building.id === id;})[0];
            angular.element('.st_sharethis_custom').attr('st_image', GLOBAL.SITE_URL+GLOBAL.BUILDING_PLAIN_IMAGE_PATH+building_data.building.v_plain_image);

            angular.forEach(building_data, function(building) {
                angular.forEach(building, function(v, k) {
                    if(v == '' && k != 'v_address1' && k != 'v_address2' && k != 'v_state' && k != 'i_city_id') { v = 'N/A'; }
                    if(k == 'i_occupied' || k == 'i_leased') {
                        if(parseInt(v) == 0){
                            v = '0%';
                        }
                        if(isNaN(v) || v === undefined) { } else {
                            if($scope.getType(v) == 'float') {
                                v = parseFloat(v).toFixed(1)+'%';
                            }
                        }
                    }
                    building_data[k] = v;
                });
            });


            $scope.selected_items = building_data.building;
            $scope.selected_items.address = '';
            
            if($scope.selected_items.v_address1 != ''){
                $scope.selected_items.address = $scope.selected_items.address + $scope.selected_items.v_address1;
            }
            
            if($scope.selected_items.city.v_name != '' ){
                $scope.selected_items.address = $scope.selected_items.address + ", " + $scope.selected_items.city.v_name ;
            }
            //$scope.selected_items.address = $scope.selected_items.address + ", " + $scope.selected_items.city.v_name;
            
            if($scope.selected_items.v_state != '' && $scope.items.cities.v_name != $scope.selected_items.v_state && ($scope.selected_items.v_state).indexOf($scope.items.cities.v_name) == -1 && ($scope.items.cities.v_name).indexOf($scope.selected_items.v_state) == -1) {
                $scope.selected_items.address = $scope.selected_items.address + ", " + $scope.selected_items.v_state;
            }

            if($scope.selected_items.d_lat > 0 || $scope.selected_items.d_long > 0){
                var myLatlng = new google.maps.LatLng($scope.selected_items.d_lat,$scope.selected_items.d_long);
                var myOptions = {
                    zoom: 14,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    width: '100%',
                }
                map = new google.maps.Map(document.getElementById("building_map"), myOptions);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable: false,
                    raiseOnDrag: true,
                    map: map,
                    labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels", // the CSS class for the label
                    labelStyle: {opacity: 0.75}
                });

                var iw1 = new google.maps.InfoWindow({
                    content: "<strong>"+$scope.selected_items.v_name+"</strong> <br>"+$scope.selected_items.address
                });

                google.maps.event.addListener(marker, "click", function (e) { iw1.open(map, this); });
                iw1.open(map,marker);
            }
            angular.element('#sb-info').append(angular.element('.social_wrap').html());

        }

        $timeout(function(){
            $scope.$apply();
            angular.element('#city_main .city_right .city_detail ul li:even').addClass('even');
        }, 1500);

        $timeout(function(){
            posOfBuildingList = 0;
            angular.element('.building_list').removeClass('w110');
            angular.element('.building_list').removeClass('w120');
            angular.element('.building_list').removeClass('w180');
            angular.element('.building_list').removeAttr('scrollleft');

            angular.forEach(angular.element('.building_list'), function(v,k){
                angular.element(v).removeClass('w110');
                angular.element(v).removeClass('w120');
                angular.element(v).removeClass('w180');
                angular.element(v).removeAttr('scrollleft');
                angular.element(v).attr('scrollleft',posOfBuildingList);
                widthTemp = angular.element(v).width();
                //console.log(angular.element(v).attr('id')+"="+widthTemp);
                if(widthTemp >= 120) { angular.element(v).addClass('w110'); }
                else if(widthTemp >= 100) { angular.element(v).addClass('w120'); }
                else if(widthTemp <= 50 && widthTemp >= 10) { angular.element(v).addClass('w180'); }
                //console.log(angular.element(v).attr('class'));
                posOfBuildingList = posOfBuildingList + widthTemp;
            });
            $(".scroll-wrapper .scrollbar-inner").scrollLeft(angular.element(".on").attr('scrollleft'));
        }, 3000);

        $scope.hoverGrid = function(id){
            if(hoverFlag == 1){
                angular.forEach(angular.element('#city_main .city_left .city_lists ul li'), function(v,k){
                    angular.element(v).css('opacity','0.3').removeClass('on');
                });
                angular.element('.building_'+id).css('opacity','1').addClass('on');
                angular.element('.viewport').addClass('on');
            }
        }

        $scope.looseHoverFullGrid = function(){
            if(!angular.element('.viewport').hasClass('on')){

                angular.forEach(angular.element('#city_main .city_left .city_lists ul li'), function(v,k){
                    angular.element(v).removeClass('on').css('opacity','1');
                });
                angular.element('.building_'+$scope.selected_items.id).addClass('on').css('opacity','1');
            } else {
                angular.element('.viewport').removeClass('on');
            }
        }

        $scope.loadData($stateParams.slug);
    });
}]);

app.controller('ChangePasswordController', ['$scope', '$rootScope', '$http','$timeout','$state','$cookieStore','anchorSmoothScroll','GLOBAL','$sce',function($scope, $rootScope, $http, $timeout, $state, $cookieStore,anchorSmoothScroll,GLOBAL,$sce) {


}]);
app.controller('RegisterController', ['$scope', '$rootScope', '$http','$timeout','$state','$cookieStore','anchorSmoothScroll','GLOBAL','$sce',function($scope, $rootScope, $http, $timeout, $state, $cookieStore,anchorSmoothScroll,GLOBAL,$sce) {
   setTimeout(function(){$('html body').animate({scrollTop:0},800)},2000);
  
   $scope.$on('$viewContentLoaded', function() {
        $('#register_industry').selectric().on('selectric-change', function(e){
            if($(this).val() != ''){
                $('#user_registration .selectric:last').removeClass('error');
            } else {
                $('#user_registration .selectric:last').addClass('error');
            }
        });   
        
        var responsePromise = $http.get(GLOBAL.SITE_URL+'contact-us/data');
		responsePromise.success(function(data, status1, headers, config)
		{
		    $scope.cities = data.cities;
            $scope.industries = data.industryDataArray;
        });
    });
    
    $scope.submitRegistration = function(registration) {
        var form = angular.element('#user_registration');
        var valid_status = form_valid(form,'#error_content_registration');
        if(valid_status) {
            form.find('#error_content').hide();
            form.find('#error_content_registration').hide();
            form.find('input[type=submit]').val('Please wait..');

            var responsePromise = $http.post(GLOBAL.SITE_URL+'user-registration',registration);
			responsePromise.success(function(data, status1, headers, config)
			{
			    if(data == 'EMAIL_EXISTS') {
                    form.find('#error_content_restricted').hide();
                    form.find('#error_content_required').hide();
                    form.find('#error_content_registration').hide();
                    form.find('#error_content_email').fadeIn(1000);
                    setTimeout(function(){
                        form.find('#error_content_email').fadeOut(5000);
                    },4000);

                    anchorSmoothScroll.scrollTo('register_section');
			    }
                else if(data == 'RESTRICTED') {
                    form.find('#error_content_registration').hide();
                    form.find('#error_content_required').hide();
                    form.find('#error_content_email').hide();
                    form.find('#error_content_restricted').fadeIn(1000);
                    setTimeout(function(){
                        form.find('#error_content_restricted').fadeOut(5000);
                    },4000);

                    anchorSmoothScroll.scrollTo('register_section');
			    } else {
			        $cookieStore.put('isGuestLogged',$.trim(data.user.id));
                    $cookieStore.put('user_name',$.trim(data.user.fname+' '+ data.user.lname));
					GLOBAL.checkId = true;
                    if($cookieStore.get('intended_url') != undefined && $cookieStore.get('intended_url') != '' && $cookieStore.get('intended_url') != '/'){
                        window.location.href =  $cookieStore.get('intended_url');
                    } else {
                        window.location.href = GLOBAL.SITE_URL;
                    }
                    return false;
                }
                form.find('input[type=submit]').val('Create Account');
			});
        } else {
            form.find('#error_content').show();
            form.find('#error_content_restricted').hide();
            form.find('#error_content_email').hide();
            anchorSmoothScroll.scrollTo('register_section');
        }
    }
}]);

app.directive('contentBoxTest',function($rootScope){
    return {
        restrict: 'A',
        link: function(scope, element,attrs)
        {
            setTimeout(function(){
                if(($rootScope.checkValueExist).indexOf(element.attr('data-value')) !== -1) {
                    element.attr('id', 'test');
                    return true
                }else{
                    element.attr('id', 'invalid test');
                    return false;
                }
            },1000);
        }
    };
});


app.controller('LoginController', ['$scope', '$rootScope', '$http','$timeout','$state','$cookieStore','anchorSmoothScroll','GLOBAL','$sce',function($scope, $rootScope, $http, $timeout, $state, $cookieStore,anchorSmoothScroll,GLOBAL,$sce) {
    setTimeout(function(){$('html body').animate({scrollTop:0},800)},2000);
    $scope.register_link = function(login_data)
    {
        anchorSmoothScroll.scrollTo('register_section');
    }
    $scope.register_success = false;

    $rootScope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    }

    $scope.winResize = function() {
        var newWidth = $("#video_title").width();
        var $allVideos = angular.element("iframe");
        // Resize all videos according to their own aspect ratio
        $allVideos.each(function() {
            var $el = $(this);
            newHeight = $el.attr('aspectRatio');

            if(newWidth > 780) {
                newHeight = eval($el.attr('aspectRatio') - 0.15 );
            }

            angular.element($el).attr('width',newWidth).attr('height',newWidth * newHeight);
            //$el.width(newWidth).height(newWidth * newHeight);
        });
    }




    $scope.forgot_password = false;
    $scope.change_reset_page = function(status)
    {
        angular.element('.loading').fadeIn(10);
        angular.element('.loading').fadeOut(1000);
        $scope.forgot_password = status;
    }

    $scope.submitLogin = function(login_data) {
        var form = angular.element('#login_form');
        var valid_status = form_valid(form);
        if(valid_status) {
            form.find('#error_content_login').hide();
            form.find('input[type=submit]').val('Wait..');
            setTimeout(function(){
                var responsePromise = $http.post(GLOBAL.SITE_URL+'user-login-status',login_data);
    			responsePromise.success(function(data, status1, headers, config) {

    			    if(data == "0" || data == 0) {
    					form.find('#error_content_invalid').fadeIn(1000);
                        setTimeout(function(){
                            form.find('#error_content_invalid').fadeOut(2000)
                        },4000);
    				} else {
    				    angular.element('.loading').show();
    				    form.find('input[type=submit]').val('Login');
                        $cookieStore.put('isGuestLogged',$.trim(data.user.id));
                        $cookieStore.put('user_name',$.trim(data.user.fname+' '+ data.user.lname));
    					GLOBAL.checkId = true;
                        
                        
                        if($cookieStore.get('intended_url') != undefined && $cookieStore.get('intended_url') != '' && $cookieStore.get('intended_url') != '/'){
                            var intended_url = $cookieStore.get('intended_url')
                            $cookieStore.remove('intended_url')
                            window.location.href =  intended_url;
                        } else {
                            window.location.href = GLOBAL.SITE_URL;
                        }
    				}

                    form.find('input[type=submit]').val('Login');
    			});
            }, 100);
        } else {
            form.find('#error_content_invalid').hide
            form.find('#error_content_login').fadeIn(1000);
            setTimeout(function(){
                form.find('#error_content_login').fadeOut(2000);
            },4000);
        }
        return false;
        
    }

    $scope.submit_reset_password = function(reset_password) {
        var form = angular.element('#reset_password');
        var valid_status = form_valid(form,'#error_content_resetpass');
        if(valid_status) {
            form.find('#error_content_resetpass').hide();
            form.find('input[type=submit]').val('Please wait..');

            var responsePromise = $http.post(GLOBAL.SITE_URL+'forgot-password',reset_password);
			responsePromise.success(function(data, status1, headers, config)
			{
                if(data == 'TRUE') {
                    $scope.forgot_password = false;
                    angular.element('#password_reset_success').fadeIn(1000);
                    setTimeout(function(){
                        angular.element('#password_reset_success').fadeOut(5000);
                    },4000);
                    $scope.reset_password = {};
                } else {
                    form.find('#error_email_invalid').fadeIn(1000);
                    setTimeout(function(){
                        form.find('#error_email_invalid').fadeOut(5000);
                    },4000);
                }
                form.find('input[type=submit]').val('Request Password');
            });
        } else {
            form.find('#error_content_resetpass').fadeIn(1000);
            setTimeout(function(){
                form.find('#error_content_resetpass').fadeOut(5000);
            },4000);
        }
    }
}]);
/* Contact Us Controller */
var timeoutID;
app.controller('ContactUsController', ['$scope', '$rootScope', '$http','$timeout','$state','$cookieStore', '$location','mySharedService','anchorSmoothScroll','GLOBAL', function($scope, $rootScope, $http, $timeout, $state, $cookieStore, $location, mySharedService, anchorSmoothScroll, GLOBAL) {
   setTimeout(function(){$('html body').animate({scrollTop:0},800)},2000);
   var email_pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);      
    
   $scope.$on('$viewContentLoaded', function() {
        $('#contact_market').selectric().on('selectric-change', function(e){
            if($(this).val() != ''){
                $('#contactUsFrm .selectric:first').removeClass('error');
            } else {
                $('#contactUsFrm .selectric:first').addClass('error');
            }
        });
        
        $('#contact_industry').selectric().on('selectric-change', function(e){
            if($(this).val() != ''){
                $('#contactUsFrm .selectric:last').removeClass('error');
            } else {
                $('#contactUsFrm .selectric:last').addClass('error');
            }
        });   
        
        $("#contactUsFrm input, #contactUsFrm select").blur(function(){
            if($.trim($(this).val()) != '' && $(this).hasClass('error')) {
                $(this).removeClass('error');
            }                              
            if($(this).hasClass('email') && !email_pattern.test($.trim($("#contact_email").val()))) {
                $(this).addClass('error');
            }
        });  
        
        $("#contact_print_version_check").removeClass('chk');
        $("#contact_print_version").removeAttr('checked');
                
        $("#contact_print_version_check").click(function(){
            if($(this).hasClass('chk')){
                $(this).removeClass('chk');
                $("#contact_print_version").prop('checked',false);
            } else {
                $(this).addClass('chk');
                $("#contact_print_version").prop('checked',true);
            }
        }); 
        
        var responsePromise = $http.get(GLOBAL.SITE_URL+'contact-us/data');
		responsePromise.success(function(data, status1, headers, config)
		{
            $scope.cities = data.cities;
            $scope.industries = data.industryDataArray;
        });
    });   
    
    $scope.submit_contact_us = function(contact_us){
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() { 
            var valid_status = form_valid('#contactUsFrm', '');
            if(valid_status){
                $("#contactUsFrm").find('.red_btn').val('Please Wait..');
                var form_data = $('#contactUsFrm').serialize();
                if(contact_us.fname === undefined) {
                    contact_us.contact.fname = '';
                }
                contact_us.contact.page_url = GLOBAL.SITE_URL + $state.current.url.slice(1);
                
                var responsePromise = $http.post(SITE_URL+"contact", contact_us);
          		responsePromise.success(function(data, status1, headers, config)
          		{		  
                    if(data == 'TRUE'){
                        $('html,body').animate({scrollTop: $("#contact_us").offset().top},800);
                        $('#success_content').fadeIn(1000);
                        $('#success_content').fadeOut(5000);
                        document.getElementById("contactUsFrm").reset();
                        $('#contact_market').selectric('refresh');
                        $('#contact_industry').selectric('refresh');
                        $("#contact_print_version_check").removeClass('chk');
                        $("#contact_print_version").removeAttr('checked');
                    } else if(data == 'BOT'){
                        $('html,body').animate({scrollTop: $("#contact_us").offset().top},800);
                        $('#bot_content').fadeIn(1000);
                        $('#bot_content').fadeOut(5000);
                    } else {
                        $('html,body').animate({scrollTop: $("#contact_us").offset().top},800);
                        $('#error_content').fadeIn(1000);
                        $('#error_content').fadeOut(5000);
                    }
                    $("#contactUsFrm").find('.red_btn').val('Submit');
                });
            } else {
                $('html,body').animate({scrollTop: $("#contact_us").offset().top},800);
                $('#error_content').fadeIn(1000);
                $('#error_content').fadeOut(5000); 
                
                if($(".error").length == 1 && $(".error").hasClass('email') && !email_pattern.test($.trim($("#contact_email").val()))) {
                    $('#error_content').hide();
                    $('#error_content_email').fadeIn(1000);
                    $('#error_content_email').fadeOut(5000);
                }  
                $("#contactUsFrm").find('.red_btn').val('Submit');            
            }     
        },200);         
        return false;      
    }; 
}]);


/* Setup App Main Controller */
app.controller('AppController', ['$scope', '$rootScope', '$http','$timeout','$state','$cookieStore', '$location','mySharedService','anchorSmoothScroll','GLOBAL', function($scope, $rootScope, $http, $timeout, $state, $cookieStore, $location, mySharedService, anchorSmoothScroll, GLOBAL) {
    if($location.path() == '/') {
        $rootScope.current_url = SITE_URL;
    } else {
        $rootScope.current_url = SITE_URL+$location.path();
    }
    $headerData = $http.defaults.headers.post['Content-Type'];
    $scope.$on('$viewContentLoaded', function() {
        /* Dashboard count box ng-click url on div */
        $rootScope.got_to_url = function(url){
            $state.go(url);
        }
    });
    
    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
    
    $scope.addCustomSkyline = {};
    $scope.responseSuccess ={'message':''};
    $rootScope.items={};
    $scope.newSkylineLink={'link':''};
    
    /*Open close Custom skyline list */
    angular.element('.viewcustomskyline a.red_btn').on('click', function(){
        if($(this).hasClass('isopen')){
            $(this).next('.dropdown-list').slideUp();
            $(this).removeClass('isopen');
        }
        else{
            $(this).next('.dropdown-list').slideDown();
            $(this).addClass('isopen');
        }
    });
    
    $scope.gotoUrl = function(slug){
        $.fancybox.close();
        $.fancybox.update();
        $state.go('my-skyline',{slug:slug});
    }
    
    $rootScope.saveSkyLineHeader = function(addCustomSkyline){
        var form = angular.element('#addNewCustomskyline2');
        var valid_status = form_valid(form);
        if(valid_status) {
            angular.element('.red_btn.create-skyline-btn').val("Please wait");
			angular.element('.red_btn.create-skyline-btn').attr("disabled","disabled");
            var responsePromise = $http.post(GLOBAL.SITE_URL+'cities/user-custom-skyline',addCustomSkyline);
			responsePromise.success(function(data, status1, headers, config)
			{
			     angular.element('.red_btn.create-skyline-btn').val("Create");
                 //angular.element("header .city-listing-wrapper .right-city-listing ul").load(window.location.href + 'header .city-listing-wrapper .right-city-listing ul');
			     if(data.IsSuccess){
			         $scope.addCustomSkyline = {};
                     $scope.responseSuccess.message=data.Message;
    			     $rootScope.items.userCustomSkylines=data.Data.userSkyline;
                     $rootScope.items.otherSkyline=data.Data.otherSkyline;
    			     $scope.newSkylineLink.link=data.Data.currentSkyline.v_slug;
    			     $.fancybox.open({'closeBtn' : false, maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, helpers : {overlay: {locked: false}},href: "#viewcustomskyline2", wrapCSS: 'view_fancybox'});
					 setTimeout(function(){
						angular.element('.red_btn.create-skyline-btn').html("Yes");
						angular.element('.red_btn.create-skyline-btn').removeAttr("disabled");
					},1000);
                 }
			});
        }
        else {
            $.fancybox.update();
            form.find('#error_content_required2').show();
        }
    };
    
    
    $scope.openAddNewSkyline=function(){
        setTimeout(function(){ $.fancybox.open({'closeBtn' : false ,helpers : {overlay: {locked: false}},maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, href: "#addNewCustomskyline"})},200);
    }
    
    $scope.isActive = function(route) {
        //console.log(route + ' is ' + ( route === $location.path()));
        return route === $location.path();
    }

    $scope.get_city_detail = function(slug){
        angular.element('.pick_container').removeClass('open');
        $state.go('/city',{slug: slug});
    }

    $scope.get_city_detail_by_id = function(id){
        angular.element('.pick_container').removeClass('open');
        if(id != '' && id >= 0){
            var responsePromise = $http.get(SITE_URL+"cities/city-slug/"+id);
            responsePromise.success(function(data, status, headers, config) {
                if(data){
                    $state.go('/city',{slug: data});
                }
            });
        }
    }
    $rootScope.logout = function(){
        var responsePromise = $http.get(GLOBAL.SITE_URL+'logout');
        responsePromise.success(function(data, status1, headers, config)
        {
            $cookieStore.remove('isGuestLogged');
            $cookieStore.remove('user_name');
            window.location.href = GLOBAL.SITE_URL;
        });
    }
    $rootScope.to_home_contact_us = function(url){
        angular.element('.nav_container').removeClass('open').hide();
        angular.element('.mobile_btn').removeClass('active');
        $state.go('/');
        $timeout(function(){
            anchorSmoothScroll.scrollTo('contact_us');
            $timeout(function(){
                $rootScope.current_url = url;
            }, 1500);
        }, 1500);
    }

    $scope.redirect_clicked_location = function(url){
        window.location.href = url;
    }

}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
app.controller('HeaderController', ['$scope', '$rootScope', '$cookieStore', function($scope, $rootScope, $cookieStore) {
    $scope.$on('$includeContentLoaded', function() {

    });
}]);

/* Setup Layout Part - Sidebar */
app.controller('SidebarController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {

    });
}]);

/* Setup Layout Part - Quick Sidebar */
app.controller('QuickSidebarController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$includeContentLoaded', function() {

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

    });
}]);

/* Setup Rounting For All Pages */
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$interpolateProvider','GLOBAL',function($stateProvider, $urlRouterProvider, $locationProvider,$interpolateProvider,GLOBAL,$location) {

    $urlRouterProvider.when('', '/');
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/404");
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "templates/index.html" + GLOBAL.HTML_VERSION,
            data: {pageTitle: 'JLL Home Page', pageHead: 'JLL Home Page Section', currTab: 'home_page', isLogin :true},
            controller: "HomeController",
            onEnter: function($state, GLOBAL, $location)
            {
                if(GLOBAL.checkId.toString() != 'true')
                {
                    GLOBAL.intended_url = $location.path();
                }
            }
        })
        .state('/login', {
            url: "/login",
            templateUrl: "templates/login.html",
            data: {pageTitle: 'Login', pageHead: 'Login', currTab: 'login', isLogin :false},
            controller: "LoginController",
			onEnter: function($state, GLOBAL, $location)
            {               
                if(GLOBAL.checkId.toString() == 'true') {
                    GLOBAL.intended_url = $location.path();
                }
            }
        })
        .state('/register', {
            url: "/register",
            templateUrl: "templates/register.html",
            data: {pageTitle: 'Register', pageHead: 'Register', currTab: 'register', isLogin :false},
            controller: "RegisterController",
			onEnter: function($state, GLOBAL, $location)
            {
                if(GLOBAL.checkId.toString() == 'true')
                {
                   GLOBAL.intended_url = $location.path();
                }
            }
        })
        .state('/view-all', {
            url: "/view-all",
            templateUrl: "templates/view-all.html",
            data: {pageTitle: 'Share All JLL Page', pageHead: 'Share All JLL Section', currTab: 'view_all', isLogin :true},
            controller: "ViewAllController",
            onEnter: function($state, GLOBAL, $location)
            {
                if(GLOBAL.checkId.toString() != 'true')
                {
                    GLOBAL.intended_url = $location.path();
                }
            }
        })
        .state('/contact-us', {
            url: "/contact-us",
            templateUrl: "templates/contact-us.html",
            data: {pageTitle: 'Contact Us', pageHead: 'Contact Us', currTab: 'contact-us'},
            controller: "ContactUsController",
            onEnter: function($state, GLOBAL, $location)
            {
                if(GLOBAL.checkId.toString() != 'true')
                {
                    GLOBAL.intended_url = $location.path();
                }
            }
        })
        .state('/city', {
            url: '/city/:slug',
            templateUrl: SITE_URL+"templates/city-detail.html",
            data: {pageTitle: 'City Detail', pageHead: 'City Detail', currTab: 'city_detail', isLogin :true},
            controller: "CityDetailController",
            onEnter: function($state, GLOBAL, $location)
            {
                
                if(GLOBAL.checkId.toString() != 'true')
                {
                    GLOBAL.intended_url = $location.path();
                }
            }
        })
        .state('my-skyline', {
            url: '/my-skyline/:slug',
            templateUrl: SITE_URL+"templates/custom-skyline.html",
            data: {pageTitle: 'Custom Skyline', pageHead: 'Custom Skyline', currTab: 'city_detail', isLogin :true},
            controller: "CustomSkylineController",
            onEnter: function($state, GLOBAL, $location)
            {
                if(GLOBAL.checkId.toString() != 'true')
                {
                    
                    GLOBAL.intended_url = $location.path();
                }
            }
        })
        .state('/404', {
            url: "/404",
            templateUrl: "templates/404.html",
            data: {pageTitle: '404', pageHead: '404', currTab: '404'}
        })

}]);
/* Init global settings and run the app */
app.run(["$http","$rootScope", "settings", "$state",'$stateParams','mySharedService','$location','GLOBAL','$cookieStore', function($http,$rootScope, settings, $state, $stateParams, mySharedService, $location, GLOBAL,$cookieStore) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        $.fancybox.close();
        $rootScope.$state = $state;
        $.fancybox.close();
        angular.element(".mobile-btn").removeClass('active');
        if(GLOBAL.IS_MOBILE == 1){
            angular.element('#full_wrapper').css('min-height','878px');
        }
        angular.element('.loading').removeClass('hide').css({'display':'block'});
        
        if(GLOBAL.checkId == undefined || GLOBAL.checkId == "") {
            GLOBAL.checkId = false;
        }
                    
        if (toState.data.isLogin == true){
            // User isn’t authenticated
            var responsePromise = $http.get(GLOBAL.SITE_URL+'check-login');
            responsePromise.success(function(data, status1, headers, config)
            {
                if($.type(data) == 'string' && data.indexOf("FALSE") >= 0){
                    var intended_url = data.split("|||");
                    $cookieStore.remove('isGuestLogged');
                    $cookieStore.remove('user_name');
                    GLOBAL.checkId = false;
                    
                    if($state.current.name != '/'){
                       $state.go('/login');
                    }
                } else {
                    $cookieStore.put('isGuestLogged',$.trim(data.id));
                    $cookieStore.put('user_name',$.trim(data.fname+' '+ data.lname));
                    GLOBAL.checkId = true;
                    GLOBAL.isUser = data.e_type;
                }
            });
        }
        else if (toState.data.isLogin == false){
            if(GLOBAL.checkId == 'true') {
                console.log(GLOBAL.SITE_URL);
                window.location.href = GLOBAL.SITE_URL;
            }
        }
        load_data = false;
    });

    $rootScope.$on("$stateChangeSuccess", function(ev, to, event, from, toState, toParams, fromState, fromParams) {
        hide_pick_container();
        if(toState.name == '/view-all'){
            angular.element('#full_wrapper').css('min-height', angular.element(window).height());
        }

        setTimeout(function(){
            angular.element('.loading').fadeOut(500);
            if($rootScope.items != undefined && $rootScope.items.cities != undefined && $rootScope.items.cities.city_asset.length > 0){
                angular.element('.city_right').css('min-height',angular.element('.city_left').height());
            }
            setTimeout(function(){
                if($rootScope.items != undefined && $rootScope.items.cities != undefined && $rootScope.items.cities.city_asset.length == 0){
                    angular.element('.city_right').css('min-height',parseInt(angular.element('.city_right').css('min-height').match(/\d+/)[0])+parseInt(angular.element('#building_map').css('min-height').match(/\d+/)[0]) );
                }
            }, 1000);
        }, 3000);
    });
    $rootScope.$on('$stateChangeError', function(event) {
        setTimeout(function(){
            angular.element('.loading').addClass('hide').css({'display':'none'});
        }, 1000);
        $state.go('404');
    });
}]);

app.filter('nl2br', ['$sce', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
    };
}]);
