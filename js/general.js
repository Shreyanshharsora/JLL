var timeoutID; 
var user_id;
var email_flag = true; // for email unique validation 

$(document).ready(function()
{
    $("#getQuoteSubmit").submit(function () 
    {
        $("#getQuoteSubmit .error-exist").css('display','none');
        if(form_valid("#getQuoteSubmit")) 
        {
            $.post($("#getQuoteSubmit").attr("action"), $("#getQuoteSubmit").serialize(), function(data) {
                if($.trim(data) == '') {
                        $("#getQuoteSubmit .error-exist").css('display','none');
                        $("#getQuoteSubmit").find("input[type=text], input[type=hidden], select, textarea").val("");
                        $("#captcha1").attr('src',$("#captcha1").attr('src')+'1');
                        window.location.href = SITE_URL+"thank-you-for-inquiry/";
                }
                else if($.trim(data) == 'Error::Exits'){
                    $("#captcha1").attr('src',$("#captcha1").attr('src')+'1');
                    $("#getQuoteSubmit .error-exist").css('display','block');
                }
                else{
                    $("#captcha1").attr('src',$("#captcha1").attr('src')+'1');
                }
            });            
        }
        return false;
    });
    $("#getQuote_reset").click(function(){
        var form_id = "#getQuoteSubmit";
        reset_form(form_id); //Reset Form 
    });
    
    $("#feedback_form").submit(function () 
    {
        $("#feedback_form .error-exist").css('display','none');
        if(form_valid("#feedback_form")) 
        {
            $("#feddback_msg").html('<span class="redMsgLarge">Please Wait....</span>');    
            $.post($("#feedback_form").attr("action"), $("#feedback_form").serialize(), function(data) {
                if($.trim(data) == '') {
                        $("#feedback_form .error-exist").css('display','none');
                        $("#feedback_form").find("input[type=text], input[type=hidden], select, textarea").val("");
                        $("#captcha5").attr('src',$("#captcha5").attr('src')+'1');
                        $("#feddback_msg").html('<span class="greenMsgLarge">Your feedback has been successfully sent.</span><br /><br>');
                        setTimeout(function(){
                            parent.jQuery.fancybox.close();                                        
                            $("#feddback_msg").html('');                                        
                        }, 2000);
                }
                else if($.trim(data) == 'Error::Exits'){
                    $("#captcha5").attr('src',$("#captcha5").attr('src')+'1');
                    $("#feddback_msg").html(''); 
                    $("#feedback_form .error-exist").css('display','block');
                }
                else{
                    $("#feedback_form .error-exist").css('display','none');
                    $("#feddback_msg").html(''); 
                    $("#captcha5").attr('src',$("#captcha5").attr('src')+'1');
                }
            });            
        }
        return false;
    });
    
    $("#feedback_form_reset").click(function(){
        var form_id = "#feedback_form";
        reset_form(form_id);
    });
    
    $("#support_form").submit(function () 
    {
        $("#support_form .error-exist").css('display','none');
        if(form_valid("#support_form")) 
        {
            $("#support_msg").html('Please Wait....'); 
            $.post($("#support_form").attr("action"), $("#support_form").serialize(), function(data) {
                if($.trim(data) == '') {
                        $("#support_form .error-exist").css('display','none');
                        $("#support_form").find("input[type=text], input[type=hidden], select, textarea").val("");
                        $("#captcha6").attr('src',$("#captcha6").attr('src')+'1');
                        window.location.href = window.location.href;
                }
                 else if($.trim(data) == 'Error::Exits'){
                    $("#captcha6").attr('src',$("#captcha6").attr('src')+'1');
                    $("#support_msg").html(''); 
                    $("#support_form .error-exist").css('display','block');
                }
                else{
                    $("#support_form .error-exist").css('display','none');
                    $("#support_form").find("input[type=text], input[type=hidden], select, textarea").val("");
                    $("#captcha6").attr('src',$("#captcha6").attr('src')+'1');
                }
            });            
        }
        return false;
    });
    $("#support_form_reset").click(function(){
        var form_id = "#support_form";
        reset_form(form_id);
    });
    
    
    
    
    $("#subscription_msg").hide();
    $(".newsletter-button").click(function(){
        $("#subscription_msg").hide();
        if($.trim($("#email_address").val()) != '' && $.trim($("#email_address").val()) != 'enter your email address') {            
            if(validateEmail($.trim($("#email_address").val()))) {        
                var smail = $("#email_address").val();
                $.ajax({
                    type: "POST",
                    url: SITE_URL+"subscribes/index",
                    data: 'email='+smail,
                    success: function(data) {           
                        data = $.trim(data); 
                        if(data == 'yes') {
                            $("#subscription_msg").removeClass('subscription_error_msg').html('Thank you for your subscription.').show();
                            setTimeout(function(){ $("#subscription_msg").html('').hide(); },3000); 
                            window.location.href = SITE_URL+"thank-you-subscribed/";
                            return false;
                        } else if(data == 'reject') {
                            $("#subscription_msg").addClass('subscription_error_msg').html('You are already subscribed for newsletter.').show();
                            return false;
                        } else {
                            $("#subscription_msg").addClass('subscription_error_msg').html('Please enter valid email id.').show();
                            return false;
                        }                    
                    }
                });
                return false;
            }
            else {
                $("#subscription_msg").addClass('subscription_error_msg').html('Please enter valid email id.').show();
                return false;
            }    
        } else {
            //$("#email_address").focus();
            $("#subscription_msg").addClass('subscription_error_msg').html('Please enter email id.').show();            
            return false;
        }      
    });
});
function validateEmail(email) {    
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(email);
}
function reset_form(formID){
    $(formID)[0].reset();
    $(formID +" input").css('border','');
    $(formID).find("input[type=text],select, textarea").val("");
    $("div.error-inner").each(function(){
            $(this).html('');
    });
    $("div.error-exist").each(function(){
            $(this).html('');
    });
}

function resizewindow(){
	var width = $(window).width();
	$(".mobile_menu_outer").css("right",-width);
	var height = $("html,body").height();
	$(".mobile_menu_outer").css("height",height);
	
	var width = $(".portfolio_box .box .box_inner .box_popup").width();
	var height = $(".portfolio_box .box .box_inner .box_popup").height();
	$(".portfolio_box .box .box_inner .box_popup > div").css("width",width);
	$(".portfolio_box .box .box_inner .box_popup > div").css("height",height);
	
	$(".top_block").each(function(){
		var max = 1; 
		$(this).find(".top_box").css("height","auto"); 
		$(this).find(".top_box").each(function() {
			var height1 = $(this).height(); 
			max = (height1 > max) ? height1 : max;
		});
		//jQuery(this).find(".equal-height").css("height",max); 
		$(this).find(".top_box").css("height",max); 
	}) 
	
}
$(window).load(resizewindow);
$(window).resize(resizewindow);

$(document).ready(function(e) {
    
    /* 10X SEO
	--------------------------------------*/
	$(".comparison_tab_inner .tab .title").click(function() {
        if($(this).parent(".tab").hasClass("active")){
			$(this).parent(".tab").removeClass("active");
			$(".comparison_tab_inner .container").animate({"padding-bottom":"0"},500);
			$(this).next(".tab_desc").slideUp(500);
		}else{
			$(".comparison_tab_inner .tab").removeClass("active");
			$(this).parent(".tab").addClass("active");
			var tab_height = $(this).next(".tab_desc").height();
			$(".comparison_tab_inner .container").css("padding-bottom","0");
			$(this).parents(".container").animate({"padding-bottom":tab_height+24},500);
			$(".comparison_tab_inner .tab .tab_desc").slideUp(10);
			$(this).next(".tab_desc").slideDown(500);
		}
    });
	if($('#datepicker').length > 0){
		$('#datepicker').datepicker({
			inline: true,
            dateFormat: 'dd-mm-yy'
		});
	}
	
	/* SELECTBOX
	--------------------------------------*/
	/*if($('.selectbox').length > 0){
		$('.selectbox').sSelect();
	}*/
	
	if($('#gallery-1').length > 0){
		var si = $('#gallery-1').royalSlider({
			addActiveClass: true,
			arrowsNav: false,
			controlNavigation: 'none',
			autoScaleSlider: true, 
			autoScaleSliderWidth: 960,     
			autoScaleSliderHeight: 340,
			loop: true,
			fadeinLoadedSlide: false,
			globalCaption: true,
			keyboardNavEnabled: true,
			globalCaptionInside: false,
			
			visibleNearby: {
			  enabled: true,
			  centerArea: 0.5,
			  center: true,
			  breakpoint: 650,
			  breakpointCenterArea: 0.64,
			  navigateByCenterClick: true
			}
		}).data('royalSlider');
		
		// link to fifth slide from slider description.
		$('.slide4link').click(function(e) {
			si.goTo(4);
			return false;
		});
	}
				
    $(".footer_center ul li:nth-child(2n+1)").addClass("first");
	
	if($(".fancybox").length > 0){
		$(".fancybox").fancybox();
	}
	
	$(".our_approach .row .arrow").click(function() {
		//event.stopPropagation()
        var h = $(this).attr('href');
		$('html, body').animate({
			'scrollTop': $(h).offset().top
		},900);
		return false;
    });
	
	/*$(".main_navigation li").mouseenter(function(){
		$(this).find(".submenu").slideDown();
	})
	
	$(".main_navigation li").mouseleave(function(){
		$(this).find(".submenu").slideUp();
	})*/
	
	$(".main_navigation > li").each(function() {
		var h = $(this);
        var g = h.children(".subcategories");
        var f = h.children("a");
        var j = g.height();
        g.css("height", 0 + "px");
        f.bind("mouseenter", function(k) {
            k.stopPropagation();
            h.addClass("grey80");
            g.css({
                visibility: "visible"
            });
            g.stop().animate({
                height: j
            }, {
                duration: 400,
                easing: "swing"
            })
        });
        h.bind("mouseleave", function(k) {
            k.stopPropagation();
            h.removeClass("grey80");
            g.stop().animate({
                height: 0,
                complete: function(l) {
                    g.css({
                        visibility: "visible"
                    })
                }
            }, {
                duration: 200,
                easing: "swing"
            })
        })
    });
	
	if($("#footer_blog_post").length > 0){
	$("#footer_blog_post").owlCarousel({
		autoPlay : 3000,
		stopOnHover : true,
		navigation:true,
		paginationSpeed : 1000,
		goToFirstSpeed : 2000,
		singleItem : true,
		autoHeight : true,
		//transitionStyle:"fade"
	});
	}
	
	if($("#services_block").length > 0){
	$("#services_block").owlCarousel({
		navigation : true, // Show next and prev buttons
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:false,
		itemsTabletSmall : [767, 1],
        itemsMobile : [479, 1],
		items : 3
	});
	}
	
	if($('#slides').length > 0){
		$('#slides').slidesjs({
			width: 940,
			height: 430,
			navigation:false,
			play: {
			auto: true,
				effect: "slide",
				interval: 3000
			},
			effect: {
				slide: {
					speed: 2000
				}
			}
		});
	}
	
	$(".tabs-nav a").hover(function(){
		var id = $(this).attr('id1');
		$(".tabs-nav a").removeClass("active");
		$(this).addClass("active");
		//alert(id)	 
		$(".tab_content .tab-content").hide();
		$("#" + id ).show();
	});
	
	if($('#our_work').length > 0){
		$('#our_work').camera({
			thumbnails: true,
			autoAdvance: true
		});
	}
	
	$(".our_work_slider .next").click(function(e) {
    	$(".camera_next").trigger("click");    
    });
	$(".our_work_slider .prev").click(function(e) {
    	$(".camera_prev").trigger("click");    
    });
	
	var nav_clone = $(".header_bottom .main_navigation").clone().addClass("mobile_menu cf");
	$("body").append(nav_clone);
	$(".mobile_menu").wrap("<nav class='mobile_menu_outer'>");
	//$("<span class='menu_title'></span>").insertBefore(".mobile_menu");
	$("<span class='menu_title'>Navigation</span>").insertBefore(".mobile_menu");
	$("<a href='javascript:;' class='icon icon-close'></a>").insertBefore(".mobile_menu");
	
	/*$(".menu_icon").click(function(e) {
        if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#main_wrapper").animate({"left":"0"})
		}else{
			$(this).addClass("active");
			$("#main_wrapper").animate({"left":"-60%"});	
		}
    });*/
	
	$(".hire_professional_tab a").click(function() {
        var i = $(this).index(i);
		$(".hire_professional_tab a").removeClass("active");
		$(this).addClass("active");
		$(".hire_professional_tab_inner .hire_professional_tabbing").hide();
		$(".hire_professional_tab_inner .hire_professional_tabbing").eq(i).show();	
    });
	
	$(".tabbing_title").click(function(e) {
        if($(this).hasClass("active")){
			$(this).removeClass("active");
			$(this).next(".tabbing").slideUp();
		}else{
			$(".tabbing_title").removeClass("active");
			$(this).addClass("active");
			$(".hire_professional_tabbing .tabbing").slideUp();
			$(this).next(".tabbing").slideDown();	
		}
    });
	
	$(".menu_icon").click(function() {
		var width = $(window).width();
		$(".mobile_menu_outer .main_navigation li .submenu").css("left",width);
		$(".mobile_menu_outer").animate({"right":"0"},1000).show();
		
	});
	
	$(".mobile_menu_outer .submenu").each(function() {
        $(this).parent("li").append("<a href='javascript:;' class='submenu_arrow icon icon-right-arrow-1'></a>");
    });
	$(".mobile_menu_outer .main_navigation li .submenu").append("<a href='javascript:;' class='back_btn'>back</a>");
	
	$(".submenu_arrow").click(function() {
        var width = $(window).width();
		$(".mobile_menu_outer .main_navigation li .submenu").hide();
		$(this).prev("div.submenu").show();
		$(this).parents("ul.main_navigation").animate({"left":-width});
    });
	
	$(".back_btn").click(function() {
        $("ul.main_navigation").animate({"left":"0"});
    });
	
	$(".mobile_menu_outer .icon-close").click(function() {
		var width = $(window).width();
		$(".mobile_menu_outer").animate({"right":-width},1000);
		$("ul.main_navigation").css("left","0");
		setTimeout(function(){
			$(".mobile_menu_outer").hide();
		},1000)
	});
	
	/*var text = $(".header_bottom .main_navigation").clone();
	alert(text)
	$(".header_bottom .main_navigation").clone().append("#main_wrapper");*/
});

$(window).resize(function(e) {
	$(".menu_icon").removeClass("active");
    $("#main_wrapper").animate({"left":"0"});	
});

$(window).load(function(e) {
	/*setTimeout(function(){
    var pagi = $(".camera_pag").clone().addClass("test");
	//alert(pagi)
	$(".our_work_slider_inner").append(pagi);
	},500)*/
});

$(document).ready(function(){
	if($(".plain-horizon").length > 0){
		$(".plain-horizon").plain_horizon({
			autostart: false
		});
		
		var randomNo = parseInt(randomToN($("div.plain-horizon div.horizon div.wrapper > ul > li").length-1,0));
		
		if(randomNo > 1)
		{
			$("div.plain-horizon div.horizon div.wrapper > ul > li:eq(1)").before($("div.plain-horizon div.horizon div.wrapper > ul > li:eq("+randomNo+")"));
		}
		else if(randomNo < 1)
		{
			$("div.plain-horizon div.horizon div.wrapper > ul > li:eq(1)").after($("div.plain-horizon div.horizon div.wrapper > ul > li:eq(0)"))	
		}
		else
		{
			//jp("div.plain-horizon div.horizon div.wrapper > ul > li:eq(1)").after(jp("div.plain-horizon div.horizon div.wrapper > ul > li:eq(0)"))	
		}
	}
});

function randomToN(maxVal,floatVal)
{
   var randVal = Math.random()*maxVal;
   return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

//-----styles select----- //
var config = {
	'.chosen-select'           : {},
	'.chosen-select-deselect'  : {allow_single_deselect:true},
	'.chosen-select-no-single' : {disable_search_threshold:10},
	'.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
	'.chosen-select-width'     : {width:"95%"}
}
for (var selector in config) {
	$(selector).chosen(config[selector]);
}

/*
;window.Modernizr=function(a,b,c){function x(){e.input=function(a){for(var b=0,c=a.length;b<c;b++)o[a[b]]=a[b]in k;return o}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "))}function w(a,b){return!!~(""+a).indexOf(b)}function v(a,b){return typeof a===b}function u(a,b){return t(prefixes.join(a+";")+(b||""))}function t(a){j.cssText=a}var d="2.0.6",e={},f=b.documentElement,g=b.head||b.getElementsByTagName("head")[0],h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=Object.prototype.toString,m={},n={},o={},p=[],q,r={}.hasOwnProperty,s;!v(r,c)&&!v(r.call,c)?s=function(a,b){return r.call(a,b)}:s=function(a,b){return b in a&&v(a.constructor.prototype[b],c)};for(var y in m)s(m,y)&&(q=y.toLowerCase(),e[q]=m[y](),p.push((e[q]?"":"no-")+q));e.input||x(),t(""),i=k=null,e._version=d;return e}(this,this.document);
// Utilizing the Modernizr object created above to implement placeholder functionality where it is not supported
$(document).ready(function(){
	if(typeof(Modernizr) != 'undefined' && !Modernizr.input.placeholder){
		$('input,textarea').each(function(){
			var phAttr = $(this).attr('placeholder');
			if(typeof(phAttr) != 'undefined' && phAttr != false){
				if(phAttr != null && phAttr != ''){
				  $(this).addClass('default_title_text');
				  $(this).val(phAttr);
				  $(this).focus(function(){
					$(this).removeClass('default_title_text');
					if($(this).val() == $(this).attr('placeholder')){
					  $(this).val('');
					}
				  });
				  $(this).blur(function(){
					if($(this).val() == ''){
					  $(this).val($(this).attr('placeholder'));
					  $(this).addClass('default_title_text');
					}
				  });
				}
			}    
		});
	}
});*/