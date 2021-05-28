var timeoutID; 
var user_id;
var email_flag = true; // for email unique validation 
$(document).ready(function()
{
    
    $(document).on('click', '#building_tab', function(){
        angular.element('#floor_tab').removeAttr('data-target').removeAttr('data-toggle');    
    });
    
    $(document).on('change', '.change_color', function(){
        var color = $(this).find(':selected').attr('rel');
        var fontColor = "#FFFFFF";
        if(color != "#FFFFFF"){
            fontColor = "#FFFFFF";
        } else {
            fontColor = "#000000";
        }
        
        if($(this).val() != ''){
            //$(this).css('background-color',color);
            
            if(color == '#000000'){
                $(this).parent('div').next('div').find('input').css('background-color','');
                $(this).parent('div').next('div').find('input').css('color',fontColor);
            } else {
                $(this).parent('div').next('div').find('input').css('background-color',color);
                $(this).parent('div').next('div').find('input').css('color',fontColor);
            }
            //$(this).next('div').find('button.selectpicker').css('background-color',color);
        } else {
            //$(this).css('background-color','');
            $(this).parent('div').next('div').find('input').css('background-color','');
            $(this).parent('div').next('div').find('input').css('color',fontColor);
            //$(this).next('div').find('button.selectpicker').css('background-color','');
        }
    });
    
    $("#getQuoteSubmit").submit(function() 
    {
        if(form_valid("#getQuoteSubmit")) 
        {
            $.post($("#getQuoteSubmit").attr("action"), $("#getQuoteSubmit").serialize(), function(data) {
                if($.trim(data) == '') {
                        $(".error-exist").css('display','none');
                        $("#getQuoteSubmit").find("input[type=text], input[type=hidden], select, textarea").val("");
                        $("#captcha1").attr('src',$("#captcha1").attr('src')+'1');
                        window.location.href = SITE_URL+"thank-you-for-inquiry/";
                }
                else if($.trim(data) == 'Error::Exits'){
                    $("#captcha1").attr('src',$("#captcha1").attr('src')+'1');
                    $(".error-exist").css('display','block');
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
        if(form_valid("#feedback_form")) 
        {
            $("#feddback_msg").html('<span class="redMsgLarge">Please Wait....</span>');    
            $.post($("#feedback_form").attr("action"), $("#feedback_form").serialize(), function(data) {
                if($.trim(data) == '') {
                        $(".error-exist").css('display','none');
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
                    $(".error-exist").css('display','block');
                }
                else{
                     $("#feddback_msg").html(''); 
                    $("#captcha5").attr('src',$("#captcha5").attr('src')+'1');
                }
                return false;                
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
        if(form_valid("#support_form")) 
        {
            $("#support_msg").html('Please Wait....'); 
            $.post($("#support_form").attr("action"), $("#support_form").serialize(), function(data) {
                if($.trim(data) == '') {
                        $(".error-exist").css('display','none');
                        $("#support_form").find("input[type=text], input[type=hidden], select, textarea").val("");
                        $("#captcha6").attr('src',$("#captcha6").attr('src')+'1');
                        window.location.href = window.location.href;
                }
                 else if($.trim(data) == 'Error::Exits'){
                    $("#captcha6").attr('src',$("#captcha6").attr('src')+'1');
                    $("#support_msg").html(''); 
                    $(".error-exist").css('display','block');
                }
                else{
                    $(".error-exist").css('display','none');
                    $("#support_msg").html('');                     
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
                            $("#subscription_msg").show();
                            setTimeout(function(){ $("#subscription_msg").html('').hide(); },3000); 
                            window.location.href = SITE_URL+"thank-you-subscribed/";
                            return false;
                        } else if(data == 'reject') {
                            $("#subscription_msg").html('You are already subscribed for newsletter.').show();
                            return false;
                        } else {
                            $("#subscription_msg").html('Please enter valid email id.').show();
                            return false;
                        }                    
                    }
                });
                return false;
            }
            else {
                $("#subscription_msg").html('Please enter valid email id.').show();
                return false;
            }    
        } else {
            $("#email_address").focus();            
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
    $(".error-exist").css('display','none');
}