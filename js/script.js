
/* Script on scroll
------------------------------------------------------------------------------*/
$(window).scroll(function() {
	//---- main banner script ----- //
	
	//----- news banner script----- //
});

/* Script on resiz
------------------------------------------------------------------------------*/
$(window).resize(function() {
    
});

/* Script on load
------------------------------------------------------------------------------*/
$(window).load(function() {
	
	
});

/* Script on ready
------------------------------------------------------------------------------*/	
$(document).ready(function(){
    
    //---- banner slider ----- //
    /*if($('.banner .bxslider').length){
        $('.banner .bxslider').bxSlider({
            infiniteLoop: true,
            mode: 'horizontal',
            speed: 400,
            adaptiveHeight: true,
            pager: true,
            controls: true,
            auto: true,
            autoHover: true,
        });
    }*/
    
    //---- key slider ----- //
    
    /*if($('.key-slider .bxslider').length){
        $('.key-slider .bxslider').bxSlider({
            infiniteLoop: true,
            mode: 'horizontal',
            speed: 400,
            adaptiveHeight: true,
            pager: false,
            controls: true,
            auto: true,
        });
    }*/
    
    //---- dropdown on slider ----- //
    /*$('.dropdown-red a').on('click', function(){
        if($('.dropdown-red a').hasClass('isopen')){
            $('.dropdown-red a').next('.dropdown-list').slideUp();
            $('.dropdown-red a').removeClass('isopen');
            $('.extra-timeline').fadeIn();
            $('.banner .bx-pager-item').fadeIn();
            
        }
        else{
            $('.dropdown-red a').next('.dropdown-list').slideDown();
            $('.dropdown-red a').addClass('isopen');
            $('.extra-timeline').fadeOut();
            $('.banner .bx-pager-item').fadeOut();
        }
    });
    
    var wrapper = $('.dropdown-red');
	$('body,html').click(function(e) { 
		if (
			(wrapper[0] != e.target) && 
			(!wrapper.has(e.target).length)
		){
			$('.dropdown-red a').next('.dropdown-list').slideUp();
            $('.dropdown-red a').removeClass('isopen');
            $('.extra-timeline').fadeIn();
            $('.banner .bx-pager-item').fadeIn();
		}
	});
    
    $(window).resize(function() {
        $('.dropdown-red a').next('.dropdown-list').slideUp();
        $('.dropdown-red a').removeClass('isopen');
        $('.extra-timeline').fadeIn();
        $('.banner .bx-pager-item').fadeIn();
    });*/
    
    
    
    
    //---- scrollbar ----- //
    /*$('.all-skyline.scrollbar-inner').scrollbar();*/
    
    //---- pick-link dropdown ----- //
    $('.pick-link').click(function(){
        if($(this).hasClass('clicked')){
            $('.pick-container').removeClass('open');
            $(this).removeClass('clicked');
            $(".nav-container ul li").removeClass("open");
            $(".nav-container ul li ul").slideUp();
            $(".overlay-full").removeClass('open');
        }else{
            $('.nav-container').fadeOut(10).removeClass('open');
            $('.mobile-btn').removeClass('active')
            $('.pick-container').addClass('open');
            $(this).addClass('clicked');
            $(".nav-container ul li").removeClass("open");
            $(".nav-container ul li ul").slideUp();
            $(".overlay-full").removeClass('open');
        } 
    });
    
    $('.pick-container a').click(function(){
        $('.nav-container').fadeOut(10).removeClass('open');
            $('.pick-container').removeClass('open');
            $('.pick-link').removeClass('clicked');
            $(".nav-container ul li").removeClass("open");
            $(".nav-container ul li ul").slideUp();
            $(".overlay-full").removeClass('open');
    });
    
    //---- Hamburger dropdown ----- //
    $('.mobile-btn').click(function(){
        if($(this).hasClass('active')){
            $('.nav-container').fadeOut(10).removeClass('open');
            $(this).removeClass('active');
            $(".nav-container ul li").removeClass("open");
            $(".nav-container ul li ul").slideUp();
            $(".overlay-full").removeClass('open');
        }
        else{
            $('.pick-container').removeClass('open');
            $('.pick-link').removeClass('clicked');
            $('.nav-container').fadeIn(10).addClass('open');
            $(this).addClass('active')
            $(".overlay-full").addClass('open');
        }
    });
    
    /*$('.nav-container a').click(function() {
        $('.nav-container').fadeOut(10).removeClass('open');
        $('.mobile-btn').removeClass('active');
        $(".nav-container ul li").removeClass("open");
        $(".nav-container ul li ul").slideUp();
        $(".overlay-full").removeClass('open');
    });*/
    
    
    //---- nav-container submenu ----- //
    $('.nav-container ul li').find('ul').parent('li').addClass('has-submenu');
    $('.has-submenu').append('<span class="arrow"></span>')
    nav_height();
   /* $(".nav-container ul li span.arrow, .nav-container ul li.has-submenu").click(function(e) {
        if($(window).width() < 641){
            debugger;
            if($(this).hasClass("has-submenu")) {
                if($(this).hasClass("open")){
                    $(this).removeClass("open");
                    $(this).find("ul").slideUp();
                } else {
                    $(".nav-container ul li").removeClass("open");
                    $(this).addClass("open");
                    $(".nav-container ul li ul").slideUp();	
                    $(this).find("ul").slideDown();
                }
            } else {
               if($(this).parent("li").hasClass("open")){
                    $(this).parent("li").removeClass("open");
                    $(this).prev("ul").slideUp();
                } else {
                    $(".nav-container ul li").removeClass("open");
                    $(this).parent("li").addClass("open");
                    $(".nav-container ul li ul").slideUp();	
                    $(this).prev("ul").slideDown();
                }  
            }
        }
    });*/
    
   /* $(".nav-container ul li span.arrow ").click(function(e) {
        if($(window).width() < 768){
            if($(this).parent("li").hasClass("open")){
                $(this).parent("li").removeClass("open");
                $(this).prev("ul").slideUp();
            }else{
                $(".nav-container ul li").removeClass("open");
                $(this).parent("li").addClass("open");
                $(".nav-container ul li ul").slideUp();	
                $(this).prev("ul").slideDown();
            }
        }
    });*/
    
    $(".nav-container ul li.has-submenu").click(function(e) {
        if($(window).width() < 768){
            if($(this).hasClass("open")){
                $(this).removeClass("open");
                $(this).find('ul').slideUp();
            }else{
                $(".nav-container ul li").removeClass("open");
                $(this).addClass("open");
                $(".nav-container ul li ul").slideUp();	
                $(this).find('ul').slideDown();
            }
        }
    });
    
    
    //----- Fancybox about Video Script----- //
    /*if($('.fancybox-media').length > 0) {
        $('.fancybox-media')
        .attr('rel', 'media-gallery')
        .fancybox({
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
                buttons : {}
            },
            onUpdate: function(){
                $.fancybox.update();
            }
        });
    }*/
    
    /*setTimeout(function(){
        $('.drop-down-skyline .red_btn').on('click', function(){
            if($(this).hasClass('isopen')){
                $(this).next('.dropdown-list').slideUp();
                $(this).removeClass('isopen');
            }
            else{
                $(this).next('.dropdown-list').slideDown();
                $(this).addClass('isopen');
            }
        });
    },1500) */
    
    /*setTimeout(function(){
        var maxHeight = 0;
        $("#city_car .owl-item .item").each(function(){
           if ($(this).height() > maxHeight) { 
               maxHeight = $(this).height(); 
           }
        });
        $("#city_car .owl-item .item").height(maxHeight);
    },5000)
    */
    
     
    
});


$(window).on( ' load resize ready ' , function(){
    /*setTimeout(function(){
        var maxHeight = 0;
        $("#city_car .owl-item .item").each(function(){
           if ($(this).innerHeight() > maxHeight) { 
               maxHeight = $(this).innerHeight(); 
           }
        });
        $("#city_car .owl-item .item").height(maxHeight);
    },2000)*/
});

/* Script all functions
------------------------------------------------------------------------------*/	
function nav_height(){
    var height = $(window).height();
    var height1 = height/10;
    var totalheight = $(".nav-container, .pick-container").css("max-height",height1*8);	
}

// Hide Pick your SKYLINE
function hide_pick_container() {
    $('.pick-container').removeClass('open');
    $('.pick-link').removeClass('clicked');
    $(".nav-container ul li").removeClass("open");
    $(".nav-container ul li ul").slideUp();
    $(".overlay-full").removeClass('open');
        
    $('.nav-container').fadeOut(10).removeClass('open');
    $('.pick-container').removeClass('open');
    $('.pick-link').removeClass('clicked');
    $(".nav-container ul li").removeClass("open");
    $(".nav-container ul li ul").slideUp();
    $(".overlay-full").removeClass('open');
}

$(window).resize(function() {
    nav_height();
});
