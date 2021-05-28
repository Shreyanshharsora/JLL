<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js" data-ng-app="app"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js" data-ng-app="app"> <![endif]-->
<html lang="en" data-ng-app="app">
    <head>
        <meta id="og_title" property="og:title" content="" />
        <meta id="og_url" property="og:url" content=""/>
        <meta id="og_image" property="og:image" content="{{SITE_URL}}images/buildings-structure.jpg" />
        <meta id="og_desc" property="og:description" content="" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
        <meta name="viewport" content="width=1000"/>
        <meta name="description" content="404" />
        <meta name="keywords" content="404" />
        <title>404 | {{ SITE_NAME }}</title>

        <link rel="icon" type="image/ico" href="{{ SITE_URL }}images/favicon.ico" />
        <!--link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700,800' rel='stylesheet' type='text/css'-->
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Titillium+Web:400,400italic,600,600italic,700,700italic,300italic,300' rel='stylesheet' type='text/css'>
        <link href="{{ SITE_URL }}fonts/styles.css" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        <!-- C S S -->
        <link href="{{ SITE_URL }}css/selectric.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/animations.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/owl.autoheight.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/owl.carousel.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/screen.css{{ CSS_VERSION }}" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/custom_style.css{{ CSS_VERSION }}" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/style.css{{ CSS_VERSION }}" rel="stylesheet" />

        <script type="text/javascript">var SITE_URL = '{{ SITE_URL }}';</script>
        <!-- S C R I P T -->
        <script src="{{ SITE_URL }}js/jquery-2.1.3.min.js"></script>
        <!--[if IE]><script src="js/html5shiv.js"></script><![endif]-->
        <script src="{{ SITE_URL }}js/placeholder.js"></script>
        <script src="{{ SITE_URL }}js/jquery.imagemapster.js"></script>
        <script src="{{ SITE_URL }}js/owl.carousel.js"></script>
        <script src="{{ SITE_URL }}js/owl.navigation.js"></script>
        <script src="{{ SITE_URL }}js/owl.autoheight.js"></script>
        <script src="{{ SITE_URL }}js/jquery.selectric.js"></script>
        <script src="{{ SITE_URL }}js/spin.min.js"></script>
        <script src="{{ SITE_URL }}js/generic.js"></script>
        <script src="{{ SITE_URL }}js/page_script.js{{ JS_VERSION }}"></script>
        <script src="{{ SITE_URL }}js/custom_validation.js{{ JS_VERSION }}"></script>
        <script src="{{ SITE_URL }}js/script.js{{ JS_VERSION }}"></script>

        <link data-require="fancybox@2.1.5" data-semver="2.1.5" rel="stylesheet" href="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.css" />
        <script data-require="fancybox@2.1.5" data-semver="2.1.5" src="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.js"></script>


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
        objConstant["isUserLogged"] = 0;
        <?php if(Auth::user()->check()) { ?>
        objConstant["isUserLogged"] = 1;
        <?php } ?>
        var IS_MOBILE = "{{ IS_MOBILE }}";
        </script>
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
    <body>
        <div id="full_wrapper">
        @include('partials.header')

        <div class="generic_page">
            <div class="inner_wrapper">
                <h1>404 ERROR</h1>
                <h2>Page not found</h2>
                <br>
                <div class="red_block half_col">
                    <p>The page you requested cannot be found. The page you are looking for
                        might have been removed, had its name changed, or is temporarily unavailable.</p>
                </div>

                <div class="clear"><!----></div>
                <div class="pt20 gen">
                    <h4>PLEASE TRY THE FOLLOWING:</h4>
                    <ul>
                        <li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
                        <li>Open the home page and look for links to the information you want.</li>
                        <li>Use the navigation bar on the left or top to find the link you are looking for.</li>
                        <li>click the back button to try another link.</li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        @include('partials.footer')
    </body>
    <script>
        /*$(document).ready(function(){
            $('.generic_page').css('min-height',$(window).height()-150);
        });*/
    </script>
</html>
