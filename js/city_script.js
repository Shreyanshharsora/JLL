$(document).ready(function(){
    $('body').on('click', '.city_right .close_btn', function(){
        $(this).parents('.city_right').addClass('mobile_hide');
        $('.overlay').fadeOut();
    })
    $('body').on('click', '#scrollbar2 ul li', function(){
        $('.city_right').removeClass('mobile_hide');
        $('.overlay').fadeIn();
    });
});
$(window).load(function(){
    setTimeout(function(){
        $('#sb-info').append($('.social_wrap').html());
    }, 1000);
});
$(window).resize(function(){
    $('.city_right').css('min-height',$('.city_left').height());
});