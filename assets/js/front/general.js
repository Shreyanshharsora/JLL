function work_inner(){
	/* WORK NEXT PREV ARROW
	------------------------------------*/
	$("#myCarousel .right, #myCarousel .left").click(function(e) {
		setTimeout(function(){
		var work_height = $("#works .item.active .works_top").height();
		$("#myCarousel .carousel-control").css("top",work_height/2);
		},800)
	});
	var work_height = $("#works .item.active .works_top").height();
	$("#myCarousel .carousel-control").css("top",work_height/2);
	
	var max = 1;
	$("#what_is .what_is_link div").css("height","auto"); 
	$("#what_is .what_is_link div").each(function(){
		//var i = jQuery(this).index(i);
		var height1 = jQuery(this).height(); 
		max = height1 > max ? height1 : max;
		var max1 = max+12;
	})
	$("#what_is .what_is_link div").css("height",max);
}
$(window).load(work_inner);
$(window).resize(work_inner);

$(document).ready(function(e) {
	/* WORK NEXT PREV ARROW
	------------------------------------*/
	var work_height = $("#works .item.active .works_top").height();
	$("#myCarousel .carousel-control").css("top",work_height/2);
			
	/* STYLISH SELCT BOX
	------------------------------------*/
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

	$('label.checkbox input').click(function(){
		$(this).parent().toggleClass('checked');
	})
	
   	/*if ( ! window.console ) console = { log: function(){} };*/

	// The actual plugin
	/*$('.single-page-nav').singlePageNav({
		offset: $('.single-page-nav').outerHeight(),
		filter: ':not(.external)',
		updateHash: true,
		beforeStart: function() {
			console.log('begin scrolling');
		},
		onComplete: function() {
			console.log('done scrolling');
		}
	}); */
	
	/*$('.sign_register a').bind('click', function(e) {
        e.preventDefault();
		$('#popup').bPopup({
			easing: 'easeOutBack', //uses jQuery easing plugin
			speed: 450,
			transition: 'slideDown',
			onOpen: function() { $('#da-slider').cslider();  }
		});
	});*/
	
	/* MOBILE NAVIGATION
	------------------------------------*/
	var mobile_menu = $("header nav").clone().addClass("mobile_menu_block");
	$("body").append(mobile_menu);
	$("<span class='menu_title'>Navigation</span>").insertBefore(".mobile_menu_block ul");
	
	$(".mobile_menu").click(function() {
        if($(this).hasClass("active")){
			$(this).removeClass("active");
			$(".main_wrapper").animate({"left":"0"});
		}else{
			$(this).addClass("active");	
			$(".main_wrapper").animate({"left":"-60%"});
		}
    });
	
	$(".mobile_menu_block .navigation li a").click(function(e) {
        $(".main_wrapper").animate({"left":"0"});
		$(".mobile_menu").removeClass("active");
    });
	
	/* SIGN IN AND REGISTER POPUP
	------------------------------------*/
	$(".sign_in").click(function(e) {
		$(".login_box .popup_tab li").removeClass("active");
		$(".popup_tab li").eq(0).addClass("active");
		$(".popup_desc .popup_desc_inner").hide();
		$(".popup_desc .popup_desc_inner").eq(0).show();
		var height = $("#popup_inner").height();
		//alert(height)
		$("#popup_inner").addClass("active");
		$("#popup_inner").slideDown();
		$("header").animate({"top":height+41});
    });
	$(".register").click(function(e) {
		$(".login_box .popup_tab li").removeClass("active");
		$(".popup_tab li").eq(1).addClass("active");
		$(".popup_desc .popup_desc_inner").hide();
		$(".popup_desc .popup_desc_inner").eq(1).show();
		var height = $("#popup_inner").height();
		//alert(height)
		$("#popup_inner").slideDown();
		$("#popup_inner").addClass("active");
		$("header").animate({"top":height+41});
    });
	
	$("#popup .b-close").click(function(e) {
        $("#popup_inner").slideUp();
		$("header").animate({"top":"0"});
		$("#popup_inner").removeClass("active");
    });
	
	$(".popup_tab li a").click(function() {
        var i = $(this).parents("li").index(i);
		$(".login_box .popup_tab li").removeClass("active");
		$(this).parents("li").addClass("active");	
		$(".popup_desc .popup_desc_inner").hide();
		$(".popup_desc .popup_desc_inner").eq(i).show();
		var height = $("#popup_inner").height();
		//alert(height)
		$("#popup_inner").slideDown();
		$("header").animate({"top":height+41});
    });
	
	$(".forgot_pwd_link").click(function(e) {
        $(".login_box").hide();
		$(".forgot_pwd").show();
		var height = $("#popup_inner").height();
		//alert(height)
		$("#popup_inner").slideDown();
		$("header").animate({"top":height+41});
    });
	
	$(".back_signin").click(function(e) {
		$(".forgot_pwd").hide();
		$(".login_box").show();
		var height = $("#popup_inner").height();
		//alert(height)
		$("#popup_inner").slideDown();
		$("header").animate({"top":height+41});
    });

	$(".register_box_tab a").click(function() {
        var i = $(this).index(i);
		$(".register_box_tab a").removeClass("active");
		$(this).addClass("active");	
		$(".register_box_desc .register_box_desc_inner").hide();
		$(".register_box_desc .register_box_desc_inner").eq(i).show();
		var height = $("#popup_inner").height();
		//alert(height)
		$("#popup_inner").slideDown();
		$("header").animate({"top":height+41});
    });
	
	$(".header_bottom ul.navigation li a").click(function(e) {
        $("header").css("top","0");
		$("#popup_inner").hide();
    });
	
	/* TESTIMONIAL SLIDER
	------------------------------------*/
	$('#testimonial_slider').royalSlider({
		autoHeight: true,
		arrowsNav: false,
		fadeinLoadedSlide: false,
		controlNavigationSpacing: 0,
		controlNavigation: 'tabs',
		imageScaleMode: 'none',
		imageAlignCenter:false,
		loop: true,
		loopRewind: true,
		numImagesToPreload: 6,
		keyboardNavEnabled: true,
		usePreloader: false,
		autoScaleSlider: true,
		autoPlay: {
    		// autoplay options go gere
    		enabled: true,
    		pauseOnHover: false
    	}
	});
	
	/* ARCHIVE SLIDER
	------------------------------------*/
	$('#archive_slider').royalSlider({
		slidesSpacing: 0,
		autoHeight: true,
		arrowsNav: true,
		loop: true,
		loopRewind: false,
		keyboardNavEnabled: true,
		controlsInside: false,
		imageScaleMode: 'fill',
		arrowsNavAutoHide: false,
		autoScaleSlider: true, 
		controlNavigation: 'bullets',
		thumbsFitInViewport: false,
		navigateByClick: false,
		sliderDrag: false,
		startSlideId: 0,
		autoPlay: {
    		// autoplay options go gere
    		enabled: false,
    		pauseOnHover: false
    	},
		transitionType:'move',
		globalCaption: false
	});
	
	/* CAMPAIGNS SLIDER
	------------------------------------*/
	$('#campaigns_slider').royalSlider({
		slidesSpacing: 0,
		autoHeight: true,
		arrowsNav: true,
		loop: true,
		keyboardNavEnabled: true,
		controlsInside: false,
		imageScaleMode: 'fit',
		arrowsNavAutoHide: false,
		autoScaleSlider: true, 
		autoScaleSliderWidth: 1065,     
		autoScaleSliderHeight: 700,
		controlNavigation: 'bullets',
		thumbsFitInViewport: false,
		navigateByClick: false,
		startSlideId: 0,
		autoPlay: {
    		// autoplay options go gere
    		enabled: true,
    		pauseOnHover: false
    	},
		fullscreen: {
    		// fullscreen options go gere
			buttonFS: true,
    		enabled: true,
    		nativeFS: true
    	},
		transitionType:'fade',
		globalCaption: false,
		deeplinking: {
		  enabled: true,
		  change: false
		}
		
	});
	
	$('#campaigns_slider').royalSlider('updateSliderSize', true);
	
	$('.rsFullscreenBtn').appendTo( '.slider_command .slider_command_left' );
	var full = $('.slider_command .slider_command_left .rsFullscreenBtn').clone();
	$(full).appendTo( '#campaigns_slider .rsOverflow' );
	var autoStart = true;
	$(".play").click(function() {
		if(autoStart) {
			$(this).removeClass("pause");
            //$(this).html('play');
        } else {
			$(this).addClass("pause");
            //$(this).html('pause');
        }
        autoStart = !autoStart;

        $('#campaigns_slider').royalSlider('toggleAutoPlay');
		//autoStart = autoStart;
		//$('#campaigns_slider').royalSlider('toggleAutoPlay');
    });
	
	
	$(".stop").click(function() {
		$(".play").removeClass("pause");
		autoStart = !autoStart;
		$('#campaigns_slider').royalSlider('toggleAutoPlay');
    });
	
	$(".rsFullscreenBtn").click(function(e) {
        $("body").toggleClass("rsFullscreen1")
    });

	
	
	/* WORK CAROUSEL
	------------------------------------*/
	$('.carousel').carousel({
        interval: 200000
    })
	
	/* WORK ANIMATION
	------------------------------------*/
	$("#myCarousel .right, #myCarousel .left").click(function(e) {
        if($(".item").hasClass("active")){
			$(".item .image_animation span").removeClass("active");
			setTimeout(function(){
				var delay = 0;
				$(".item.active .image_animation span").each(function() {
					var $li = $(this);
					setTimeout(function() {
					  $li.addClass('active');
					}, delay+=200); // delay 100 ms
				});
			},800)
		}else{
			
		}
    });
	
	$(".campaigns_list li:nth-child(3n+3)").addClass("last")
	
	/* FAQ
	------------------------------------*/
	$(".faq_question li h3").click(function(e) {
        if($(this).parents("li").hasClass("active")){
			$(this).parents("li").removeClass("active")
			$(this).next(".faq_desc").slideUp();
		}else{
			$(".faq_question li").removeClass("active");
			$(this).parents("li").addClass("active");	
			$(".faq_question li .faq_desc").slideUp();
			$(this).next(".faq_desc").slideDown();
		}
    });
	
	$(".continue_btn a").click(function() {
		var id = $(this).attr("href");
		var targetOffset = $(this).offset().top+50;
		$('html, body').animate({scrollTop: targetOffset}, 1000);
		$(id).slideDown();
		return false;
    });
	
	$(".payment_right .title a").click(function() {
		var targetOffset = $("#selected_package").offset().top-100;
		$('html, body').animate({scrollTop: targetOffset}, 1000);
		$("#payment").slideUp();
		return false;
    });
	
	
	$(".selected a").click(function() {
		var targetOffset1 = $(".select_packages").offset().top-100;
		$('html, body').animate({scrollTop: targetOffset1}, 1000);
		$("#selected_package").slideUp();
		return false;
    });
	
});


$(window).scroll(function(e) {
	/* STICKY NAVIGATION
	------------------------------------*/
    var textopacity1 = $('body').offset().top;
	if ($(this).scrollTop() > textopacity1 ) {
		$(".sticky_nav_inner nav ul li a:first, header nav ul li a:first, .mobile_menu_block .navigation li a:first").removeClass("nav-active1");
	}
	else{
		$(".sticky_nav_inner nav ul li a:first, header nav ul li a:first, .mobile_menu_block .navigation li a:first").addClass("nav-active1");
	}
	
	/* HEADER TOP
	------------------------------------*/
	var textopacity = $('body').offset().top+100;
	if ($(this).scrollTop() > textopacity ) {
		$(".header_top").slideUp()
		$("nav ul li a:first").addClass("nav-active");
	}
	else{
		$(".header_top").slideDown()
	}
	
	if($("#works .works_p").length > 0)
	{
		var work = $("#works .works_p").offset().top;
		if($('body').hasClass('loaded_graph')){
			return false;	
		}
		else{
			if ($(this).scrollTop() > work ) {
			$('body').addClass('loaded_graph');
			$(".item .image_animation span").removeClass("active");
			setTimeout(function(){
				var delay = 0;
				$(".item.active .image_animation span").each(function() {
					var $li = $(this);
					setTimeout(function() {
					  $li.addClass('active');
					}, delay+=200); // delay 100 ms
				});
			},800)
			}
		}
	}
	
	var work = $("html,body").offset().top;
	if($('#popup_inner').hasClass('active')){
		$("header").css("top","0");
		$("#popup_inner").hide();	
		$('#popup_inner').removeClass("active")
	}
	else{
		if ($(this).scrollTop() > work ) {
			//$('#popup_inner').addClass('active1');
		}
	}
	
});

/* STICKY NAVIGATION
------------------------------------*/
$(document).ready(function(){
	$("nav a").click(function(evn){
		evn.preventDefault();
		$('html,body').scrollTo(this.hash, this.hash); 
	});
	
	var aChildren = $("nav li").children(); // find the a children of the list items
	var aArray = []; // create the empty aArray
	for (var i=0; i < aChildren.length; i++) {    
		var aChild = aChildren[i];
		var ahref = $(aChild).attr('href');
		aArray.push(ahref);
	} // this for loop fills the aArray with attribute href values
	
	$(window).scroll(function(){
		var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
		var windowHeight = $(window).height(); // get the height of the window
		var docHeight = $(document).height();
		
		for (var i=0; i < aArray.length; i++) {
			var theID = aArray[i];
			var divPos = $(theID).offset().top; // get the offset of the div from the top of page
			var divHeight = $(theID).height(); // get the height of the div in question
			if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
				$("a[href='" + theID + "']").addClass("nav-active");
			} else {
				$("a[href='" + theID + "']").removeClass("nav-active");
			}
		}
		
		if(windowPos + windowHeight == docHeight) {
			if (!$("nav li:last-child a").hasClass("nav-active")) {
				var navActiveCurrent = $(".nav-active").attr("href");
				$("a[href='" + navActiveCurrent + "']").removeClass("nav-active");
				$("nav li:last-child a").addClass("nav-active");
			}
		}
	});
});