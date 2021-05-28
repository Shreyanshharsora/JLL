<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js" data-ng-app="app"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js" data-ng-app="app"> <![endif]-->
<html lang="en" data-ng-app="app">
    <head>
        <base href="{{ BASE_HREF_FRONT }}" />
        <meta id="og_title" property="og:title" content="" />
        <meta id="og_url" property="og:url" content=""/>
        <meta id="og_image" property="og:image" content="{{SITE_URL}}images/buildings-structure.jpg" />
        <meta id="og_desc" property="og:description" content="" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
        <meta name="viewport" content="width=1000"/>
        <meta name="description" content="{{ @strip_tags($content->v_meta_description) }}" />
        <meta name="keywords" content="{{ @strip_tags($content->v_meta_keywords) }}" />

        @if(isset($content) && $content->v_meta_title != '')

        <title>{{ @$content->v_meta_title }} | {{ SITE_NAME }}</title>
        @else
        <title data-ng-bind="$state.current.data.pageTitle + ' | {{ SITE_NAME }}'"></title>
        @endif
        <script>loc = window.location.href; index = loc.indexOf('#sthash');
        if(index != -1) {
            document.location.hash="#"; //window.location.href = window.location.href.replace(/#.*/,'');
        }  </script>
        <link rel="icon" type="image/ico" href="{{ SITE_URL }}images/favicon.ico" />
        <!--link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700,800' rel='stylesheet' type='text/css'-->
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Titillium+Web:400,400italic,600,600italic,700,700italic,300italic,300' rel='stylesheet' type='text/css'>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        <!-- C S S -->
        <link href="{{ SITE_URL }}fonts/styles.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/selectric.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/animations.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/owl.autoheight.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/owl.carousel.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/screen.css{{ CSS_VERSION }}" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/tipr.css" rel="stylesheet" />
        <link href='{{ SITE_URL }}css/jquery.scrollbar.css' rel='stylesheet' />
        <link href="{{ SITE_URL }}css/ng-tags-input.min.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/custom_style.css{{ CSS_VERSION }}" rel="stylesheet" />

        <link href="{{ SITE_URL }}css/jquery.bxslider.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/style.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/bootstrap.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/bootstrap-tagsinput.css" rel="stylesheet" />


        <!-- S C R I P T -->
        <script src="{{ SITE_URL }}js/jquery.min.js"></script>
        <!--<script language="javascript" src='http://maps.google.com/maps/api/js?sensor=false'></script>-->

        <!--[if IE]><script src="js/html5shiv.js"></script><![endif]-->
        <script src="{{ SITE_URL }}js/placeholder.js"></script>
        <script src="{{ SITE_URL }}js/jquery.scrollbar.js"></script>
        <script src="{{ SITE_URL }}js/jquery.imagemapster.js"></script>
        <script src="{{ SITE_URL }}js/owl.carousel.js"></script>
        <script src="{{ SITE_URL }}js/owl.navigation.js"></script>
        <script src="{{ SITE_URL }}js/owl.autoheight.js"></script>
        <script src="{{ SITE_URL }}js/jquery.selectric.js"></script>
        <script src="{{ SITE_URL }}js/tipr.min.js"></script>
        <script src="{{ SITE_URL }}js/spin.min.js"></script>
        <script src="{{ SITE_URL }}js/city_script.js{{ JS_VERSION }}"></script>
        <script src="{{ SITE_URL }}js/home_script.js{{ JS_VERSION }}"></script>
        <script src="{{ SITE_URL }}js/custom_validation.js{{ JS_VERSION }}"></script>
        <script src="{{ SITE_URL }}js/jquery.bxslider.js{{ JS_VERSION }}"></script>
        <script src="{{ SITE_URL }}js/script.js{{ JS_VERSION }}"></script>
        <script src="{{ SITE_URL }}js/bootstrap-tagsinput.min.js{{ JS_VERSION }}"></script>
        <script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/bootstrap-daterangepicker/moment.min.js"></script>


        <link data-require="fancybox@2.1.5" data-semver="2.1.5" rel="stylesheet" href="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.css" />
        <script data-require="fancybox@2.1.5" data-semver="2.1.5" src="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.js"></script>
        <script src="{{ SITE_URL }}js/jquery.fancybox-media.js"></script>
        <script type="text/javascript">
        var SITE_URL = '{{ SITE_URL }}';
        /* Pass constant variables for angularjs */
    	var objConstant = {};
        objConstant['IS_MOBILE'] = "{{ IS_MOBILE }}";
        objConstant["SITE_URL"] = "{{ SITE_URL }}";
        objConstant["SITE_NAME"] = "{{ SITE_NAME }}";
        objConstant["BUILDING_IMAGE_PATH"] = "{{ BUILDING_IMAGE_PATH }}";
        objConstant["BUILDING_PLAIN_IMAGE_PATH"] = "{{ BUILDING_PLAIN_IMAGE_PATH }}";
        objConstant["COUNTRY_IMAGE_PATH"] = "{{ COUNTRY_IMAGE_PATH }}";
        objConstant["CITIES_IMAGE_PATH"] = "{{ CITIES_IMAGE_PATH }}";
        objConstant["NATIONAL_ASSET_IMAGE_PATH"] = "{{ NATIONAL_ASSET_IMAGE_PATH }}";
        objConstant["CITY_ASSET_IMAGE_PATH"] = "{{ CITY_ASSET_IMAGE_PATH }}";
        objConstant["CITY_ASSET_THUMB_IMAGE_PATH"] = "{{ CITY_ASSET_THUMB_IMAGE_PATH }}";
        objConstant["CITY_BACKGROUND_IMAGE_PATH"] = "{{ CITY_BACKGROUND_IMAGE_PATH }}";
        objConstant["CIPHER_KEY"] = "{{ CIPHER_KEY }}";
        objConstant["HTML_VERSION"] = "{{ HTML_VERSION }}";
        objConstant["RESTRICT_EMAIL_MSG"] = "{{ RESTRICT_EMAIL_MSG }}";
        objConstant["FILE_PATH"] = "{{ FILE_PATH }}";
        objConstant["HOME_PAGE_BANNER_IMAGE_PATH"] ="{{HOME_PAGE_BANNER_IMAGE_PATH}}";
        objConstant["HOME_PAGE_IMAGE_ROTATOR_PATH"]= "{{HOME_PAGE_IMAGE_ROTATOR_PATH}}";
        objConstant["HOME_PAGE_CONTENT_IMAGE"] = "{{HOME_PAGE_CONTENT_IMAGE}}";
        objConstant["HOME_PAGE_CONTENT_VIDEO"]= "{{HOME_PAGE_CONTENT_VIDEO}}";
        objConstant["BUILDING_FLOOR_IMAGE_PATH"]= "{{BUILDING_FLOOR_IMAGE_PATH}}";
        objConstant["GLOBAL_BACKGROUND_IMAGE"]= "{{GLOBAL_BACKGROUND_IMAGE}}";
        objConstant["DEFAULT_FLOOR_HEIGHT"]= "{{DEFAULT_FLOOR_HEIGHT}}";
        objConstant["CITY_PDF_FILE_PATH"]= "{{CITY_PDF_FILE_PATH}}";
        objConstant["isUserLogged"] = 0;
        <?php if(Auth::user()->check()) { ?>
        objConstant["isUserLogged"] = 1;
        <?php } ?>
        <?php if(Auth::guest()->check() || Auth::user()->check()){ ?> objConstant["checkId"] = "true"; <?php }else{ ?> objConstant["checkId"] = "false"; <?php } ?>
        var IS_MOBILE = "{{ IS_MOBILE }}";
        </script>
        <script type="text/javascript">var switchTo5x=true;</script>
        <script type="text/javascript" src="{{ SITE_URL }}js/buttons.js"></script>
        <script type="text/javascript">stLight.options({publisher: "51efe40a-f273-4311-8a1f-c6c246c37319", doNotHash: false, doNotCopy: true, hashAddressBar: false, onhover: false});</script>
        <?php if(IS_LIVE == 'Yes') { ?>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-61962560-3', 'auto');
          ga('send', 'pageview');

        </script>
        <?php } ?>
    </head>

    <body ng-controller="AppController" class="" ng-class="$state.current.name =='/' ? 'body-home' : ''">
        <div class="loading">
            <?php if(preg_match('/(?i)msie [1-9]/',$_SERVER['HTTP_USER_AGENT'])) { ?>
            <div id="preview" style="background: #111111 none repeat scroll 0 0; border-radius: 10px; float: left; height: 100%; margin: 0 20px 20px 0; position: relative; width: 100%;"></div>
            <?php } else { ?>
            <div class="spinner windcatcher" id="windcatcher">
                <div class="blade"></div>
                <div class="blade"></div>
                <div class="blade"></div>
                <div class="blade"></div>
                <div class="blade"></div>
                <div class="blade"></div>
                <div class="blade"></div>
                <div class="blade"></div>
            </div>
            <?php } ?>
        </div>
        <div id="full_wrapper">
        @include('partials.header')

        @yield('content')
        </div>
        @include('partials.footer')
        <!-- BEGIN CORE ANGULARJS PLUGINS -->
        <script language="javascript" src='http://maps.google.com/maps/api/js?sensor=false'></script>
        <script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular.min.js" type="text/javascript"></script>
        <script src="{{ SITE_URL }}js/ng-tags-input.js" type="text/javascript"></script>
        <script src="{{ SITE_URL }}js/jquery.fittext.js{{ JS_VERSION }}" type="text/javascript"></script>
        <script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-sanitize.min.js" type="text/javascript"></script>
    	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-touch.min.js" type="text/javascript"></script>
    	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-route.min.js" type="text/javascript"></script>
    	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-resource.min.js" type="text/javascript"></script>
    	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/angular-cookies.min.js" type="text/javascript"></script>
    	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>
    	<script src="{{ ADMIN_ASSET_URL }}plugins/angularjs/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
        <script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="{{ SITE_URL }}js/app.js{{ JS_VERSION }}" type="text/javascript"></script>

        <!-- Twitter universal website tag code -->
        <script>
        !function(e,n,u,a){e.twq||(a=e.twq=function(){a.exe?a.exe.apply(a,arguments):
        a.queue.push(arguments);},a.version='1',a.queue=[],t=n.createElement(u),
        t.async=!0,t.src='//static.ads-twitter.com/uwt.js',s=n.getElementsByTagName(u)[0],
        s.parentNode.insertBefore(t,s))}(window,document,'script');
        // Insert Twitter Pixel ID and Standard Event data below
        twq('init','nv2yr');
        twq('track','PageView');
        </script>
        <!-- End Twitter universal website tag code -->
    </body>
</html>
