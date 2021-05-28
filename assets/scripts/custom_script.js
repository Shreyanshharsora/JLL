
$(document).ready(function() {
   jQuery("#forget-pass-form").submit(function() 
    {
        alert(API_USER_URL);
        $(".alert").hide();
        if(form_valid("#forget-pass-form")) 
        {
            jQuery.post(API_USER_URL + "forgot-password", { email: jQuery(this).find("#v_email").val() }, function(responce) 
            {
                responce = jQuery.trim(responce);
                if(responce == '0') {
                    jQuery("#forget-pass-form .alert-danger").show();
                } else {
                    jQuery('.login-form').show();
                    jQuery('.forget-form').hide();  
                    jQuery("#forget-pass-form")[0].reset();
                    jQuery('.login-form .alert-danger').before('<div class="alert alert-fp alert-success"><button class="close" data-close="alert"></button><span>New password has been successfully sent to your email id. Please check mailbox.</span></div>');
                    setTimeout(function() { jQuery('.login-form .alert-fp').remove(); }, 5000);
                }
            });
        }
        return false;
    }); 
});
