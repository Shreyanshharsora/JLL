function form_valid(e, t) {
    var n = true;
    t = typeof t !== "undefined" ? t : "";
    if (t != "") {
        jQuery(t).html("")
    }
    jQuery("." + err_class).remove();
    jQuery(e).find("input,select,textarea").each(function() {
        
        var e = jQuery.trim(jQuery(this).val());
        if(e == '--Select--') e = '';
        var r = "";
        if (t != "") {
            jQuery(this).css("border", "1px solid #838383")
        }
        if (jQuery(this).attr("placeholder") !== undefined) {
            r = jQuery(this).attr("placeholder")
        }
        var i = "<" + err_element + ' class="' + err_class + '" id="' + this.id + '_error">';
        var s = ".</" + err_element + ">";
        var o = "";
        if (jQuery(this).hasClass("email") && e != "" && e !== undefined && e != r) {
            var u = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
            if (!u.test(e)) {
                o = "Please enter valid " + r.toLowerCase();
                n = false
            }
        }
        if (jQuery(this).hasClass("url") && e != "" && e !== undefined && e != r) {
            var u = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
            if (!u.test(e)) {
                o = "Please enter valid URL";
                n = false
            }
        }
        if (jQuery(this).hasClass("digits") && e != "" && e !== undefined && e != r) {
            if (!e.match(/^\d+$/)) {
                o = "Please enter valid digits";
                n = false
            }
        }
        if (jQuery(this).hasClass("number") && e != "" && e !== undefined && e != r) {
            if (!e.match(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/)) {
                o = "Please enter valid number";
                n = false
            }
        }
        if (jQuery(this).hasClass("validate_zip") && e != "" && e !== undefined && e != r) {
            if (!(e.match(/^[a-z][0-9][a-z]\-s*?[0-9][a-z][0-9]$/i) || e.match(/^[a-z][0-9][a-z]\s*?[0-9][a-z][0-9]$/i))) {
                o = "Please enter valid " + r.toLowerCase();
                n = false
            }
        }
        if (jQuery(this).hasClass("validate_creditcard") && e != "" && e !== undefined && e != r) {
            var u = new RegExp(/^\d{15,16}$/);
            if (!u.test(e)) {
                o = "Please enter valid " + r.toLowerCase();
                n = false
            }
        }
        if (jQuery(this).hasClass("validate_month") && e != "" && e !== undefined && e != r) {
            var a = /^[0-9]{1,2}$/;
            if (!a.test(e)) {
                o = "Please enter valid " + r.toLowerCase();
                n = false
            }
        }
        if (jQuery(this).hasClass("validate_year") && e != "" && e !== undefined && e != r) {
            var a = /^[0-9]{4}$/;
            var f = (new Date).getFullYear();
            if (!a.test(e) || parseInt(e) < parseInt(f)) {
                o = "Please enter valid " + r.toLowerCase();
                n = false
            }
        }
        if (jQuery(this).hasClass("validate_cvccode") && e != "" && e !== undefined && e != r) {
            var a = /^[0-9]{3}$/;
            if (!a.test(e)) {
                o = "Please enter valid " + r.toLowerCase();
                n = false
            }
        }
        if (jQuery(this).attr("equalTo") !== undefined) {
            if (e != "Confirm Password" && jQuery.trim(jQuery(jQuery(this).attr("equalTo")).val()) != e) {
                o = "Password does not match";
                n = false
            }
        }
        if (jQuery(this).hasClass("validate_password") && jQuery(this).val() != "" && e !== undefined && e != r) {
            var a = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\\ \+]{6,}/;
            if (!a.test(e)) {
                o = "Minimum 6 characters required";
                n = false
            }
        }
        if (jQuery(this).hasClass("validate_social_secutiry") && e != "" && e !== undefined && e != r) {
            var a = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\+]{9,}/;
            if (!a.test(e)) {
                o = "Invalid social security number";
                n = false
            }
        }
        if (this.id == "email" && jQuery("#email").attr("class").indexOf("duplicate-email-error") >= 0) {
            n = false;
            o = "Email address already exist"
        }
        if (jQuery(this).hasClass("check-url-char") && e != "" && e !== undefined && e != r) {
            var u = new RegExp(/[a-zA-Z0-9-]/g);
            if (!u.test(e)) {
                o = "Please enter valid text";
                n = false
            }
        }
        if (jQuery(this).hasClass("phone") && e != "" && e !== undefined && e != r) {
            var u = /^[0-9()\s]+$/;
            if (!u.test(e)) {
                o = "Please enter valid phone";
                n = false
            }
        }
        if (jQuery(this).hasClass("ckeditor")) {
            if (this.id == "CkEditor") {
                jQuery(this).val(CKEDITOR.instances.CkEditor.getData());
                e = jQuery(this).val()
            }
        }
        if (jQuery(this).hasClass("required") && (e == "" || e == undefined || e == r)) {
            if (jQuery(this).attr("type") !== undefined && jQuery(this).attr("type") == "file") {
                o = "Please upload file"
            } else if (jQuery(this).attr("type") !== undefined && jQuery(this).attr("type") == "hidden") {
                if (jQuery(this).hasClass("dropdown_date_validation")) {
                    o = "Please select hour, minute and AM/PM"
                } else if (jQuery(this).hasClass("dropdown_date_msg")) {
                    o = "Start time should be less than end time"
                } else {
                    o = "Please select  any one"
                }
            } else if (jQuery(this).is("select")) {
                o = "Please select " + r.toLowerCase()
            } else if (jQuery(this).hasClass("select_msg")) {
                o = "Please select " + r.toLowerCase()
            } else {
                o = "Please enter " + r.toLowerCase()
            }
            n = false
        }
        if (jQuery(this).hasClass("required-least-one") && jQuery(this).attr("groupid") != "" && jQuery(this).attr("groupid") != undefined) {
            if (jQuery('input[groupid="' + jQuery(this).attr("groupid") + '"]:checked').length < 1) {
                o = "Please select any option.";
                n = false
            }
        }
        if (!n && o != "") {
            o = i + o + s;
            if (t != "") {
                jQuery(t).append(o);
                jQuery(this).css("border", "1px solid red")
            } else {
                if (jQuery(this).hasClass("ckeditor")) {
                    jQuery(this).next("div").after(o)
                } else {
                    if (this.id == "month") {
                        jQuery(this).next().after(o)
                    } else if (this.id == "date") {
                        jQuery(this).next().after(o)
                    } else if (this.id == "year") {
                        jQuery(this).next().after(o)
                    } else if (this.id == "v_social_secutiry_number") {
                        jQuery(this).next().after(o)
                    } else {
                        jQuery(this).after(o)
                    }
                }
            }
        }
    });
    return n
}
var err_element = "div";
var err_class = "error-inner";
jQuery(document).ready(function() {
    if (jQuery("#CkEditor").length > 0) {
        var e = CKEDITOR.replace("CkEditor");
        e.on("blur", function(t) {
            jQuery("#CkEditor").val(e.getData());
            if (jQuery("#CkEditor").val() != "") {
                jQuery("#CkEditor_error").remove()
            }
        });
        e.on("focus", function(t) {
            jQuery("#CkEditor").val(e.getData());
            if (jQuery("#CkEditor").val() != "") {
                jQuery("#CkEditor_error").remove()
            }
        })
    }
    if (jQuery("#CkEditor2").length > 0) {
        var e = CKEDITOR.replace("CkEditor2");
        e.on("blur", function(t) {
            jQuery("#CkEditor2").val(e.getData());
            if (jQuery("#CkEditor2").val() != "") {
                jQuery("#CkEditor2_error").remove()
            }
        });
        e.on("focus", function(t) {
            jQuery("#CkEditor2").val(e.getData());
            if (jQuery("#CkEditor2").val() != "") {
                jQuery("#CkEditor2_error").remove()
            }
        })
    }
    if (jQuery("#vCkEditor").length > 0) {
        var e = CKEDITOR.replace("vCkEditor", {
            toolbar: [{
                name: "basicstyles",
                items: ["Bold", "Italic", "Underline", "Link"]
            }]
        });
        e.on("blur", function(t) {
            jQuery("#vCkEditor").val(e.getData());
            if (jQuery("#vCkEditor").val() != "") {
                jQuery("#vCkEditor_error").remove()
            }
        });
        e.on("focus", function(t) {
            jQuery("#vCkEditor").val(e.getData());
            if (jQuery("#vCkEditor").val() != "") {
                jQuery("#vCkEditor_error").remove()
            }
        })
    }
    jQuery("input,select,textarea").on("blur", function(e) {
        var t = this.id;
        var n = jQuery.trim(jQuery(this).val());
        var r = "";
        if (jQuery(this).attr("placeholder") !== undefined) {
            r = jQuery(this).attr("placeholder")
        }
        var i = "<" + err_element + ' class="' + err_class + '" id="' + this.id + '_error">';
        var s = ".</" + err_element + ">";
        var o = "";
        flag = true;
        if (jQuery(this).hasClass("email") && n != "" && n !== undefined && n != r) {
            var u = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
            if (!u.test(n)) {
                o = "Please enter valid " + r.toLowerCase();
                flag = false
            }
        }
        if (jQuery(this).hasClass("url") && n != "" && n !== undefined && n != r) {
            var u = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
            if (!u.test(n)) {
                o = "Please enter valid URL";
                flag = false
            }
        }
        if (jQuery(this).hasClass("digits") && n != "" && n !== undefined && n != r) {
            if (!n.match(/^[0-9]$/)) {
                o = "Please enter valid digits";
                flag = false
            }
        }
        if (jQuery(this).hasClass("number") && n != "" && n !== undefined && n != r) {
            if (!n.match(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/)) {
                o = "Please enter valid number";
                flag = false
            }
        }
        if (jQuery(this).hasClass("validate_zip") && n != "" && n !== undefined && n != r) {
            if (!(n.match(/^[a-z][0-9][a-z]\-s*?[0-9][a-z][0-9]$/i) || n.match(/^[a-z][0-9][a-z]\s*?[0-9][a-z][0-9]$/i))) {
                o = "Please enter valid " + r.toLowerCase();
                flag = false
            }
        }
        if (jQuery(this).hasClass("validate_creditcard") && n != "" && n !== undefined && n != r) {
            var u = new RegExp(/^\d{15,16}$/);
            if (!u.test(n)) {
                o = "Please enter valid " + r.toLowerCase();
                flag = false
            }
        }
        if (jQuery(this).hasClass("validate_month") && n != "" && n !== undefined && n != r) {
            var a = /^[0-9]{1,2}$/;
            if (!a.test(n)) {
                o = "Please enter valid " + r.toLowerCase();
                flag = false
            }
        }
        if (jQuery(this).hasClass("validate_year") && n != "" && n !== undefined && n != r) {
            var a = /^[0-9]{4}$/;
            var f = (new Date).getFullYear();
            if (!a.test(n) || parseInt(n) < parseInt(f)) {
                o = "Please enter valid " + r.toLowerCase();
                flag = false
            }
        }
        if (jQuery(this).hasClass("validate_cvccode") && n != "" && n !== undefined && n != r) {
            var a = /^[0-9]{3}$/;
            if (!a.test(n)) {
                o = "Please enter valid " + r.toLowerCase();
                flag = false
            }
        }
        if (jQuery(this).attr("equalTo") !== undefined) {
            if (n != "Confirm Password" && jQuery.trim(jQuery(jQuery(this).attr("equalTo")).val()) != n) {
                o = "Password does not match";
                flag = false
            }
        }
        if (jQuery(this).hasClass("validate_password") && jQuery(this).val() != "" && n !== undefined && n != r) {
            var a = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\\ \+]{6,}/;
            if (!a.test(n)) {
                o = "Minimum 6 characters required";
                flag = false
            }
        }
        if (jQuery(this).hasClass("validate_social_secutiry") && n != "" && n !== undefined && n != r) {
            var a = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\+]{9,}/;
            if (!a.test(n)) {
                o = "Invalid social security number";
                flag = false
            }
        }
        if (this.id == "email" && jQuery("#email").attr("class").indexOf("duplicate-email-error") >= 0) {
            flag = false;
            o = "Email address already exist"
        }
        if (jQuery(this).hasClass("phone") && n != "" && n !== undefined && n != r) {
            var u = /^[0-9()\s]+$/;
            if (!u.test(n)) {
                o = "Please enter valid phone";
                flag = false
            }
        }
        if (jQuery(this).hasClass("check-url-char") && n != "" && n !== undefined && n != r) {
            var u = new RegExp(/[a-zA-Z0-9-]/g);
            if (!u.test(n)) {
                o = "Please enter valid text";
                flag = false
            }
        }
        if (jQuery(this).hasClass("required") && (n == "" || n == undefined || n == r)) {
            if (jQuery(this).attr("type") !== undefined && jQuery(this).attr("type") == "file") {
                o = "Please upload file"
            } else if (jQuery(this).attr("type") !== undefined && jQuery(this).attr("type") == "hidden") {
                o = "Please select any one."
            } else if (jQuery(this).is("select")) {
                o = "Please select " + r.toLowerCase()
            } else {
                o = "Please enter " + r.toLowerCase()
            }
            flag = false
        }
        if (jQuery(this).hasClass("required-least-one") && jQuery(this).attr("groupid") != "" && jQuery(this).attr("groupid") != undefined) {
            if (jQuery('input[groupid="' + jQuery(this).attr("groupid") + '"]:checked').length < 1) {
                o = "Please select any option";
                flag = false
            }
        }
        if (!flag && o != "") {} else {
            jQuery("#" + t + "_error").remove();
            jQuery(this).css("border", "");
            if (jQuery("#div_validation_msg").is(":empty")) {
                jQuery("#div_validation_msg").hide()
            }
        }
        return flag;
    })

    jQuery("#freequote_form").submit(function () 
    {
        jQuery("#freequote_form .error-exist").css('display','none');
        if(form_valid("#freequote_form")) 
        {
            jQuery("#freequote_msg").html('<span class="redMsgLarge">Please Wait....</span>');   
            jQuery.post(jQuery("#freequote_form").attr("action"), jQuery("#freequote_form").serialize(), function(data) {
                if(jQuery.trim(data) == '') {
                        jQuery("#freequote_form .error-exist").css('display','none');
                        jQuery("#freequote_form").find("input[type=text], input[type=hidden], select, textarea").val("");
                        jQuery("#captcha1").attr('src',jQuery("#captcha1").attr('src')+'1');
                        window.location.href = SITE_URL+"thank-you-for-inquiry/";
                }
                else if(jQuery.trim(data) == 'Error::Exits'){
                    jQuery("#freequote_msg").html(''); 
                    jQuery("#captcha1").attr('src',jQuery("#captcha1").attr('src')+'1');
                    jQuery("#freequote_form .error-exist").css('display','block');
                }
                else{
                    jQuery("#freequote_form .error-exist").css('display','none');
                    jQuery("#freequote_msg").html(''); 
                    jQuery("#captcha1").attr('src',jQuery("#captcha1").attr('src')+'1');
                }
            });            
        }
        return false;
    });
    jQuery("#getQuote_reset").click(function(){
        var form_id = "#freequote_form";
        reset_form(form_id); //Reset Form 
    });

    jQuery("#feedback_form").submit(function () 
    {
        jQuery("#feedback_form .error-exist").css('display','none');
        if(form_valid("#feedback_form")) 
        {
            jQuery("#feddback_msg").html('<span class="redMsgLarge">Please Wait....</span>');   

            jQuery.post(jQuery("#feedback_form").attr("action"), jQuery("#feedback_form").serialize(), function(data) {
                if(jQuery.trim(data) == '') {
                        jQuery("#feedback_form .error-exist").css('display','none');
                        jQuery("#feedback_form").find("input[type=text], input[type=hidden], select, textarea").val("");
                        jQuery("#captcha5").attr('src',jQuery("#captcha5").attr('src')+'1');
                        jQuery("#feddback_msg").html('<span class="greenMsgLarge">Your feedback has been successfully sent.</span><br /><br>');
                        setTimeout(function(){
                            parent.jQuery.fancybox.close();                                        
                            jQuery("#feddback_msg").html('');                                        
                        }, 2000);
                }
                else if(jQuery.trim(data) == 'Error::Exits'){
                    jQuery("#captcha5").attr('src',jQuery("#captcha5").attr('src')+'1');
                    jQuery("#feddback_msg").html(''); 
                    jQuery("#feedback_form .error-exist").css('display','block');
                }
                else{
                    jQuery("#feedback_form .error-exist").css('display','none');
                    jQuery("#feddback_msg").html(''); 
                    jQuery("#captcha5").attr('src',jQuery("#captcha5").attr('src')+'1');
                }
            });            
        }
        return false;
    });

    jQuery("#feedback_form_reset").click(function(){
        var form_id = "#feedback_form";
        reset_form(form_id);
    });
})