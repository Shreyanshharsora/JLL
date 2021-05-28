var timeoutID;
var email_pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);

var sumomeInterval = '';
$(window).load(function(){
    sumomeInterval = setInterval( function(){ removeSumomeButton(); }, 10);
    setTimeout(function(){
        myStopFunction();
    }, 6000);


    $(".change_password").fancybox({
        hideOnOverlayClick:false,
        helpers : {overlay: {locked: false}},
        closeBtn : false,
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

    $("#add_new_skuline_head").fancybox({
        hideOnOverlayClick:false,
        helpers : {overlay: {locked: false}},
        closeBtn : false,
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

    function removeSumomeButton(){
         if($('footer').nextAll('a').length > 0 && $('footer').nextAll('.sumome-image-sharer').length > 0) {
              /*To remove sumome sharer from screen*/
              $('footer').nextAll('a').css({'display':'none', 'z-index':'0', 'opacity': '0', 'left': '-100px'}).remove();
              //$('footer').nextAll('.sumome-image-sharer').remove();
         } else {
              myStopFunction();
         }
    };

    function myStopFunction() {
        clearInterval(sumomeInterval);
    };

    setTimeout(function(){$('.loading').fadeOut(1200)},200);
    $('.pick_slider').owlCarousel({
        items:9,
        center: false,
        autoHeight:false,
        nav: true,
        pagination: true,
        slideBy : 'page',
        responsive : {
            // breakpoint from 0 up
            0 : {
                items:1,
                center: true,
            },
            // breakpoint from 480 up
            480 : {
                items:2
            },
            // breakpoint from 768 up
            768 : {
                items:5
            },
            990 : {
                items:7
            },
            1270 : {
                items:8
            }
        }
    });
});

$(document).ready(function(){

    // Find all YouTube videos
    var $allVideos = $("iframe");

    // Figure out and save aspect ratio for each video
    $allVideos.each(function() {
        $(this).data('aspectRatio', this.height / this.width)
            // and remove the hard coded width/height
            .removeAttr('height')
            .removeAttr('width');

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

    function winResize() {
        var newWidth = $("#page_content").width();

        // Resize all videos according to their own aspect ratio
        $allVideos.each(function() {
            var $el = $(this);
            newHeight = $el.data('aspectRatio');
            if(newWidth > 780) {
                newHeight = eval($el.data('aspectRatio') - 0.15 );
            }
            $el.width(newWidth)
               .height(newWidth * newHeight);
        });
    }
    // When the window is resized
    $(window).resize(function() {
        winResize();  // Kick off one resize to fix all videos on page load
    }).resize();

    $('.tab_list').on('click','a',function(){
        $('.tab_list a').removeClass('active');
        $(this).addClass('active');
        //$('.tab_img img').animate({'opacity':'0'},300);
        var img_tab = $(this).data('image');
        $('.tab_img img').attr('src',img_tab);
        /*setTimeout(function(){
            $('.tab_img img').attr('src',img_tab);
            $('.tab_img img').animate({'opacity':'1'},300);
        },500)*/
        return false;
    })
    $('#contact_market').selectric({ maxHeight: 400 });
    $('#contact_industry').selectric({ maxHeight: 400 });
    $('.pc_link').click(function(){
        if($('.mobile_btn').hasClass('active')){
             $('.mobile_btn').removeClass('active');
             $('.nav_container').fadeOut(10).removeClass('open');
        }
        $('.pick_container').toggleClass('open');
    })
    $('.mobile_btn').click(function(){
        if( $('.pick_container').hasClass('open')){
            $('.pick_container').removeClass('open');
        }
        $(this).toggleClass('active');
        $('.nav_container').fadeToggle(10).toggleClass('open');
    })

    $('.close_btn').click(function(){
        $(this).parents('.closer_container').fadeOut();
        $('.overlay').fadeOut();
    })

    /* Go to top*/
    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.go_top_top').addClass('active');
        } else {
            $('.go_top_top').removeClass('active');
           // $('.go_top_top').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.go_top_top').click(function(){
        $('.go_top_top').removeClass('active');
         //$('.go_top_top').animate({'bottom':'-50px'},500);
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    $(".scroll_to_contact_us").click(function() {
        $('html,body').animate({scrollTop: $(".cms-contact-us").offset().top},1000);
        $(".nav_container").removeClass('open').hide();
        $(".nav-container").removeClass('open').hide();
        $(".overlay-full ").removeClass('open');
        $(".mobile_btn").removeClass('active');
        $(".mobile-btn").removeClass('active');
    });

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

    $("#contactUsFrm").submit(function(){
        if($("#contactUsFrm").find('.red_btn').val() == 'Submit') {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(function() {
                var valid_status = form_valid('#contactUsFrm', '');
                if(valid_status){
                    $("#contactUsFrm").find('.red_btn').val('Please Wait..');
                    var form_data = $('#contactUsFrm').serialize();
                    $.post(SITE_URL+"contact", form_data, function(data, status) {
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
        }
        return false;
    })

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
    })

    if($("#page_content").find('.inner_wrapper').length > 0) {
        $("#page_content").css('padding','0');
    }
})

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
                $("#sucess_header_custom_skyline .dropdown-red-header").show();
                $.each(otherSkylineData, function( key, value ) {
                    if(value.i_user_id == responseData.Data.current_user_id) {
                        mySkylineList +='<li><a href="'+SITE_URL+'my-skyline/'+value.v_slug+'">'+value.v_title+'</a></li>';
                    }
                });

                $("#sucess_header_custom_skyline").find('.dropdown-list').find('ul').html(mySkylineList);
                console.log(otherSkylineData.length);
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
    $('#sucess_header_custom_skyline a.red_btn').on('click', function(){
        if($(this).hasClass('isopen')){
            $(this).next('.dropdown-list').slideUp();
            $(this).removeClass('isopen');
        }
        else{
            $(this).next('.dropdown-list').slideDown();
            $(this).addClass('isopen');
        }
    })

    $('.all-skyline.local.header.scrollbar-inner').scrollbar();
});
