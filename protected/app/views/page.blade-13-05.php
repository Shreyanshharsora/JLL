<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />
        <meta name="viewport" content="width=1000"/>
        <meta name="description" content="{{ strip_tags($content->v_meta_description) }}" /> 
        <meta name="keywords" content="{{ strip_tags($content->v_meta_keywords) }}" /> 
        
        <meta id="og_title" property="og:title" content="{{ strip_tags($content->v_title) }}" />
        <meta id="og_url" property="og:url" content="{{Request::url()}}"/>
        <meta id="og_image" property="og:image" content="{{SITE_URL}}images/jll400X400.png" />
        <meta id="og_desc" property="og:description" content="{{ strip_tags($content->v_meta_description) }}" />
        
        <title>{{$content->v_meta_title}} | {{ SITE_NAME }}</title>
        <link rel="icon" type="image/ico" href="{{ SITE_URL }}images/favicon.ico" /> 
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700,800' rel='stylesheet' type='text/css'>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        <!-- C S S -->
        <link href="{{ SITE_URL }}css/selectric.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/animations.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/owl.autoheight.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/owl.carousel.css" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/screen.css{{ CSS_VERSION }}" rel="stylesheet" />
        <link href="{{ SITE_URL }}css/custom_style.css{{ CSS_VERSION }}" rel="stylesheet" />
        
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
        <link data-require="fancybox@2.1.5" data-semver="2.1.5" rel="stylesheet" href="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.css" />
        <script data-require="fancybox@2.1.5" data-semver="2.1.5" src="{{ ADMIN_ASSET_URL }}plugins/fancybox/source/jquery.fancybox.js"></script>        
        <script src="//load.sumome.com/" data-sumo-site-id="671c0ba72c0c38ed5186afc8b7b2b924b0e992ececa76b3c8a6d0e7d89f17dc3" async="async"></script>
        <script type="text/javascript">var switchTo5x=true;</script>
        <script type="text/javascript" src="http://w.sharethis.com/button/buttons.js"></script>
        <script type="text/javascript">stLight.options({publisher: "51efe40a-f273-4311-8a1f-c6c246c37319", doNotHash: true, doNotCopy: false, hashAddressBar: false, onhover: false});</script>
        
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
         
          ga('create', 'UA-61962560-3', 'auto');
          ga('send', 'pageview');
         
        </script>
    </head>
    <?php
    function closetags($html) {
        preg_match_all('#<(?!meta|img|br|hr|input\b)\b([a-z]+)(?: .*)?(?<![/|/ ])>#iU', $html, $result);
        $openedtags = $result[1];
        preg_match_all('#</([a-z]+)>#iU', $html, $result);
        $closedtags = $result[1];
        $len_opened = count($openedtags);
        if (count($closedtags) == $len_opened) {
            return $html;
        }
        $openedtags = array_reverse($openedtags);
        for ($i=0; $i < $len_opened; $i++) {
            if (!in_array($openedtags[$i], $closedtags)) {
                $html .= '</'.$openedtags[$i].'>';
            } else {
                unset($closedtags[array_search($openedtags[$i], $closedtags)]);
            }
        }
        return $html;
    } ?>
    <body>
        <div class="loading">
            <?php if(preg_match('/(?i)msie [1-9]/',$_SERVER['HTTP_USER_AGENT'])) { ?>
            <div id="preview" style="background: #333 none repeat scroll 0 0; border-radius: 10px; float: left; height: 100%; margin: 0 20px 20px 0; position: relative; width: 100%;"></div>
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
            
            <div class="generic_page">
                <div class="right_lnks">
                    <a class="red_btn scroll_to_contact_us" href="javascript:void(0)">Contact us</a>
                    <a class="st_sharethis_custom grey_btn" st_title="{{ strip_tags($content->v_title) }} | {{ SITE_NAME }}" st_url="{{ Request::url() }}" href="javascript:void(0)"><i class="share_icon"></i></a>
                </div>
                <div class="inner_wrapper">
                    <h1>{{ $content->v_page_title }}</h1>                
                    <?php 
                    $imageWidget = '';
                    if($content->v_images != '') { 
                        $imgArray = json_decode($content->v_images, true); 
                        $imageWidget.= '<div id="tab_banner"> <div class="tab_img"> <img src="'.SITE_URL.'files/cms-images/'.$imgArray[0]['image'].'" alt="image" /></div><div class="tab_list"><ul>';
                        $imgC = count($imgArray); $i = 1;
                        foreach($imgArray as $img) {
                            if($i == 1) {
                                $imageWidget.= '<li><a href="javscript:void(0);" class="active" data-image="'.SITE_URL."files/cms-images/".$img['image'].'">'.$img['title'].'<img src="'.SITE_URL."files/cms-images/".$img['image'].'" style="display:none;"></a></li>';
                            } else if($imgC == $i){
                                $imageWidget.= '<li class="last"><a href="javscript:void(0);" data-image="'.SITE_URL."files/cms-images/".$img['image'].'">'.$img['title'].'<img src="'.SITE_URL."files/cms-images/".$img['image'].'" style="display:none;"></a></li>';
                            } else {
                                $imageWidget.= '<li><a href="javscript:void(0);" data-image="'.SITE_URL."files/cms-images/".$img['image'].'">'.$img['title'].'<img src="'.SITE_URL."files/cms-images/".$img['image'].'" style="display:none;"></a></li>';
                            }
                            $i++;
                        } 
                        $imageWidget.= '</ul></div></div>';                    
                    } 
                    $content->t_content = closetags($content->t_content);
                    if(strpos($content->t_content, '[IMAGE-WIDGET]') === false ) {
                        echo $imageWidget;
                    } else {
                        $content->t_content = str_replace('[IMAGE-WIDGET]', $imageWidget, $content->t_content);
                    }
                    ?>
                </div>
                <div id="page_content" class="inner_wrapper"><?php echo $content->t_content; ?></div>
            </div>            
            <section id="contact_us">
                <div class="title">
                    Want to know how these insights impact your business? Ask a JLL expert.
                </div>
                <div class="contact_form">
                    
                    <div class="success_content" id="success_content" style="display: none;">Your contact detail submitted successfully.</div>
                    <div class="error_content" id="error_content" style="display: none;">All fields are required.</div>   
                    <div class="error_content" id="error_content_email" style="display: none;">Please enter valid email id.</div>    
                    <div class="error_content" id="bot_content" style="display: none;">You are a bot!</div>            
                       
                    <form id="contactUsFrm" name="contactUsFrm" method="post">
                        <select selectric data-options="{ maxHeight: 400 }" id="contact_market" name="contact[market]" class="option_txt required">
                            <option class="option_txt" value="">-- Select your market --</option>
                            
                            @foreach($cities as $key => $val)
                            <option class="option_txt" value="{{ $val['v_name'] }}">{{ $val['v_name'] }}</option>
                            @endforeach
                        </select>
                        <input type="text" name="contact[contact_name]" placeholder="Name" id="contact_name" class="required" />
                        <input type="text" name="contact[title]" placeholder="Title" id="contact_title" class="required" />
                        <div class="half_content">
                            <input type="text" name="contact[email]" placeholder="Email" id="contact_email" class="required email" />
                            <input type="text" name="contact[phone]" placeholder="Phone" id="contact_phone" class="required" />
                        </div>
                        <input type="text" name="contact[company]" placeholder="Company" id="contact_company" class="required" />
                        <select selectric data-options="{ maxHeight: 400 }" id="contact_industry" name="contact[industry]" class="option_txt required">
                            <option class="option_txt" value="">-- Industry --</option>
                            
                            @foreach($industryDataArray as $key => $val)
                            <option class="option_txt" value="{{ $val }}">{{ $val }}</option>
                            @endforeach
                        </select>
                        <!--input type="text" name="contact[industry]" placeholder="Industry" id="contact_industry" class="required" /-->
                        <div> <!-- class="align-left content">
                            <input type="checkbox" name="contact[print_version]" class="css-checkbox" id="contact_print_version" value="Yes" />
                            <label for="contacts_print_version" id="contact_print_version_check" class="css-label">&nbsp;Send me a print version</label -->
                        </div>
                        <input type="hidden" name="contact[page_url]" id="page_url" value="<?php echo Request::url(); ?>" />
                        <input type="text" name="contact[fname]" class="fname" id="fname" />
                        <input type="submit" class="red_btn" value="Submit" />
                        <div class="clear"><!----></div>
                    </form>
                </div>
            </section>
        </div>        
        @include('partials.footer')
    </body>    
</html>   