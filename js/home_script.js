var resizeTime = 100;     // total duration of the resize effect, 0 is instant
var resizeDelay = 100;    // time to wait before checking the window size again
$(window).load(function(){
    // the shorter the time, the more reactive it will be.
    // short or 0 times could cause problems with old browsers.
    $(window).load(function(){
        setTimeout(function(){$('.loading').fadeOut(1200)},200);
    });

    $(document).ready(function(){
        $(window).resize(function() {
            updateMyFancyBox();
        });
        $("body").on('click','#video-link', function(){
            $(this).hide();
            $("#jll_video").show();
            var vid = document.getElementById("jll_video");
            vid.load();
            vid.play();
            check_video_ended(vid);
        });

        if($("#preview").length > 0) {
            var opts = {
                  lines: 18 // The number of lines to draw
                , length: 30 // The length of each line
                , width: 18 // The line thickness
                , radius: 42 // The radius of the inner circle
                , scale: 1 // Scales overall size of the spinner
                , corners: 1 // Corner roundness (0..1)
                , color: '#BC2622' // #rgb or #rrggbb or array of colors
                , opacity: 0.25 // Opacity of the lines
                , rotate: 0 // The rotation offset
                , direction: 1 // 1: clockwise, -1: counterclockwise
                , speed: 1 // Rounds per second
                , trail: 60 // Afterglow percentage
                , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                , zIndex: 2e9 // The z-index (defaults to 2000000000)
                , className: 'spinner' // The CSS class to assign to the spinner
                , top: '50%' // Top position relative to parent
                , left: '50%' // Left position relative to parent
                , shadow: false // Whether to render a shadow
                , hwaccel: false // Whether to use hardware acceleration
                , position: 'absolute' // Element positioning
                }
            var target = document.getElementById('preview')
            var spinner = new Spinner(opts).spin(target);
        }
        $('.pc_link').click(function(){
            if($('.mobile_btn').hasClass('active')){
                 $('.mobile_btn').removeClass('active');
                 $('.nav_container').fadeOut(10).removeClass('open');
            }
            $('.pick_container').toggleClass('open');
        });

        $('.mobile_btn').click(function(){
            if( $('.pick_container').hasClass('open')){
                $('.pick_container').removeClass('open');
            }
            $(this).toggleClass('active');
            $('.nav_container').fadeToggle(10).toggleClass('open');
        });

        $('.close_btn').click(function(){
            $(this).parents('.closer_container').fadeOut();
            $('.overlay').fadeOut();
        });

        /* Go to top*/
        //Check to see if the window is top if not then display button
        $(window).scroll(function(){
            if ($(this).scrollTop() > 100) {
                $('.go_top_top').addClass('active');
            } else {
                $('.go_top_top').removeClass('active');
            }
        });

        //Click event to scroll to top
        $('.go_top_top').click(function(){
            $('.go_top_top').removeClass('active');
            $('html, body').animate({scrollTop : 0},800);
            return false;
        });

        $(".scroll_to_contact_us").click(function() {
            $('html,body').animate({scrollTop: $("#contact_us").offset().top},1000);
            $(".nav_container").removeClass('open').hide();
            $(".nav-container").removeClass('open').hide();
            $(".overlay-full ").removeClass('open');
            $(".mobile_btn").removeClass('active');
            $(".mobile-btn").removeClass('active');
        });
    });

    $(window).bind('resize',onWindowResize);
    /* Area hovering section of home page mapping */
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
    });
});

function updateMyFancyBox() {
    if($.fancybox.wrap){
        $.fancybox.wrap.height($.fancybox.inner.height() + $('.fancybox-skin').find('#change_password').height());//increase fancybox height by adding your div height.
        $.fancybox.update();//Fancybox will re-size according to new size, if it exceeds size limit, it will show scroll bar.
    }
}

function updateSKylineFancyBox() {
    if($.fancybox.wrap){
        $.fancybox.wrap.height($.fancybox.inner.height() + $('.fancybox-skin').find('#addNewCustomskyline').height());//increase fancybox height by adding your div height.
        $.fancybox.update();//Fancybox will re-size according to new size, if it exceeds size limit, it will show scroll bar.
    }
}
// Resize the map to fit within the boundaries provided
function resize(maxWidth,maxHeight) {
    var image =  $('img'),
        imgWidth = image.width(),
        imgHeight = image.height(),
        newWidth=0,
        newHeight=0;
        if(maxWidth>1200){
            maxWidth=1200
        }
    if (imgWidth/maxWidth>imgHeight/maxHeight) {
        newWidth = maxWidth;
    } else {
        newHeight = maxHeight;
    }
    image.mapster('resize',newWidth,newHeight,resizeTime);
}
// Track window resizing events, but only actually call the map resize when the
// window isn't being resized any more
function onWindowResize() {
    var curWidth = $(window).width(),
        curHeight = $(window).height(),
        checking=false;
    if (checking) {
        return;
    }
    checking = true;
    window.setTimeout(function() {
        var newWidth = $(window).width(),
            newHeight = $(window).height();
        if (newWidth === curWidth &&
            newHeight === curHeight) {
            resize(newWidth,newHeight);
        }
        checking=false;
    },resizeDelay );
}
function check_video_ended(vid) { //console.log(vid.ended);
    if(vid.ended) {
        $("#video-link").show();
        $("#jll_video").hide();
    } else {
        setTimeout(function(){ check_video_ended(vid); },500);
    }
}
function to_home_contact_us(){
    var page_url = window.location.href;
    var element = angular.element('.view_contact_us');
    var rootScope = element.scope();
    //as this happends outside of angular you probably have to notify angular of the change by wrapping your function call in $apply
    rootScope.$apply(function(){
        rootScope.to_home_contact_us(page_url);
    });
}
function submitPassword() {
    var form = $('.fancybox-skin').find('#change_pass');
    var form_data = form.serialize();
    var validate = form_valid(form, '.fancybox-skin #error_content_password');
    //alert(validate+"="+$('.fancybox-skin').find('#change_pass').length+"="+$('.fancybox-skin').length+"="+$('#change_pass').length);
    if(validate){
        form.find('#error_password_required').hide();
        form.find('#error_content_password').hide();
        form.find('#error_new_confirm_not_match').hide();
        $.post( SITE_URL+'submit-change-password', {'data':form_data}, function( data ) {
            if(data == 'NOT_MATCH'){
                form.find('#error_content_not_match').fadeIn(1000);
                setTimeout(function(){
                    form.find('#error_content_not_match').fadeOut(2000);
                    setTimeout(function(){
                        updateMyFancyBox();
                    },2000);
                },4000);
		     } else{
		         form.find('#success_content_password').fadeIn(1000);
                setTimeout(function(){
                    form.find('#success_content_password').fadeOut(2000);
                    $.fancybox.close();
                },4000);
		     }
             updateMyFancyBox();
        });
    } else {
        updateMyFancyBox();
    }
}

function goToUrl(slug){
    window.location.href=SITE_URL+'my-skyline/'+slug;
}
function saveSkyLineHeader() {
    var form = $('.fancybox-skin').find('#add_new_custom_skyline_form');
    var form_data = form.serialize();
    var validate = form_valid(form);
    if(validate){
        form.find('#error_content_required').hide();
        $('.fancybox-skin').find('#add_new_custom_skyline_form').find('.red_btn.create-skyline-btn').val('Please wait');
        $.post( SITE_URL+'cities/custom-skyline-header', {'data':form_data}, function( data ) {
            $('.fancybox-skin').find('#add_new_custom_skyline_form').find('.red_btn.create-skyline-btn').val('Create');
            responseData=JSON.parse(data);
            if(responseData.IsSuccess){
                $.fancybox.close();
                $.fancybox.update();
                var otherSkylineData=responseData.Data.otherSkyline;
                var mySkylineList="";

                $.each( otherSkylineData, function( key, value ) {
                    if(value.i_user_id == responseData.Data.current_user_id) {
                        mySkylineList +='<li><a href="'+SITE_URL+'my-skyline/'+value.v_slug+'">'+value.v_title+'</a></li>';
                    }
                });

                $("#sucess_header_custom_skyline").find('.dropdown-list').find('ul').html(mySkylineList);

                if(otherSkylineData.length <= 0) {
                    $("#sucess_header_custom_skyline .view-your-skyline").css("cssText", "max-width: 98% !important;");
                    $("#sucess_header_custom_skyline .dropdown-red-header").hide();
                }

                $("#sucess_header_custom_skyline").find('.dropdown-list').find('.scrollbar-inner').scrollbar();
                $("#sucess_header_custom_skyline").find('.red_btn.button').attr('href',SITE_URL+'my-skyline/'+responseData.Data.currentSkyline.v_slug);
                $.fancybox.open({'closeBtn' : false, maxWidth : 500, fitToView   : true, autoSize : false, autoHeight : true, helpers : {overlay: {locked: false}},href: "#sucess_header_custom_skyline"});

                if($('#custom_skyline_list').length > 0) {
                    var list_html = '';
                    $('#custom_skyline_list_head').hide();
                    $.each(responseData.Data.userSkyline, function(i, v){
                        $('#custom_skyline_list_head').show();
                        list_html += '<li><a href="'+SITE_URL + 'my-skyline/' + v.v_slug+'">' + v.v_title + '</a></li>';
                    });
                    $('#custom_skyline_list').html(list_html);
                }
            }

             updateSKylineFancyBox();
        });
    } else {
        form.find('#error_content_required').fadeIn(1000);
        updateSKylineFancyBox();
        setTimeout(function(){
            form.find('.required').removeClass('error');
            form.find('#error_content_required').fadeOut();
            setTimeout(function(){updateSKylineFancyBox()},500);
        },5000);

    }
}

$(window).load(function(){

    var headerDropdownSkyline = $('.dropdown-red-header a');
    $('body,html').click(function(e) {
        if ((headerDropdownSkyline[0] != e.target) && (!headerDropdownSkyline.has(e.target).length))
        {
            $('#sucess_header_custom_skyline .dropdown-red-header a').next('.dropdown-list').slideUp();
            $('#sucess_header_custom_skyline .dropdown-red-header a').removeClass('isopen');
    	}
    });

    $('.all-skyline.local.header.scrollbar-inner').scrollbar();
});
