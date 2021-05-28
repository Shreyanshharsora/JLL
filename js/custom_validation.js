var err_element = 'div';
var err_class = 'error';
    
$(document).ready(function() 
{
    $(document).on('blur','#email.unique', function(){
        var curr_obj = $(this);
        var email_id = curr_obj.val();
        var rel_id = curr_obj.attr('rel');
        var url = API_URL+'users/check-email-exist';
        $.post( url, { email: email_id, id: rel_id }).done(function( data ) {
            if($.trim(data) == 'TRUE'){
                curr_obj.addClass('duplicate-email-error');
            } else {
                curr_obj.removeClass('duplicate-email-error');
            }
        });
    });       
});

function loadSingleDatePicker(frmID)
{
    $("#"+frmID+" .single_date").datepicker(
    {
        format: 'dd-mm-yyyy'
    })
}

function loadDatePicker(frmID)
{
    $("#"+frmID+" .d_from_date").datepicker(
    {
        startDate: '+0d',
        format: 'dd-mm-yyyy'
    })
    .on('change', function(e)
    { 
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); 
        var yyyy = today.getFullYear();

        var firstDate = new Date(yyyy,mm,dd); // Todays date
        var from = $("#"+frmID+" .d_from_date").val().split("-");
        var secondDate = new Date(from[2], from[1] - 1, from[0]);
        var diffDays = (secondDate.getTime() - firstDate.getTime());
        $('#'+frmID+' .d_to_date').datepicker('remove');
        var date_diff = diffDays / (1000 * 60 * 60 * 24);
        if(date_diff < 0)
        {
            date_diff = 0;
        }
        var from = $("#"+frmID+" .d_to_date").val().split("-");
        if(from.length > 0)
        {
            var thirdDate = new Date(from[2], from[1] - 1, from[0]);
            if(thirdDate < secondDate)
            {
                $("#"+frmID+" .d_to_date").val($(".d_from_date").val());
            }
        }
        $("#"+frmID+" .d_to_date").datepicker({ startDate: "+"+date_diff+"d", format: 'dd-mm-yyyy' }); 
    });

    $("#"+frmID+" .d_to_date").datepicker(
    {
        startDate: '+0d',
        format: 'dd-mm-yyyy'
    }).on('change', function(e)
    { 
        $('#'+frmID+' .d_from_date').datepicker('remove');
        $("#"+frmID+" .d_from_date").datepicker({ startDate: '+0d', format: 'dd-mm-yyyy' }); 
    });
    $("#"+frmID+" .select_insta_date").datepicker(
    {
        endDate: '+0d',
        format: 'dd-mm-yyyy'
    });
}

//this function will automaticall append the error msg to next to field
//err_container: If err_container is set, than append all messages to the error container(err_container) element
function form_valid(form, err_container) {
    var flag = true;  
        var el = form[0];
        var formId = $(el).attr('id');
        
    //setTimeout(function(){
        err_container = typeof err_container !== 'undefined' ? err_container : '';
        if(err_container != '') { $(err_container).html(''); }
        
        /*$("."+err_class).removeClass('error');
        $("."+err_class).remove();*/
        var required = 'false';
        $(form).find('input,select,textarea').each(function() {  
            
            if($(this).attr('id') == 'contact_market'){
                $(this).parent().next().removeClass('error');
            } else {
                $(this).removeClass('error');
            }
            
            if($(this).attr('id') == 'contact_industry'){
                $(this).parent().next().removeClass('error');
            } else {
                $(this).removeClass('error');
            }
            
            if($(this).attr('id') == 'register_industry'){
                $(this).parent().next().removeClass('error');
            } else {
                $(this).removeClass('error');
            }
            var field_value = $.trim($(this).val());
            var placeholder = '';
            
            if(err_container != '' && !$(".user-package").is(":visible"))
            {
                $(this).css('border','1px solid #000');
            }
            
            if($(this).attr('data-error-message') !== undefined) {
                placeholder = $(this).attr('data-error-message');    
            } 
            
            
            var err_element_start = '<'+err_element+' id="'+this.id+'_error" class="help-block '+err_class+'">';
            var err_element_end = '.</'+err_element+'>';
            var error_msg = '';
           
            if($(this).hasClass('email') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
                if(! pattern.test(field_value)) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();
                    flag = false;
                }
            } 
            
            if($(this).hasClass('url') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
                if(! pattern.test(field_value)) {
                    error_msg = 'Please enter valid URL';
                    flag = false;
                }
            } 
            
            if($(this).hasClass('digits') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (!(field_value.match(/^\d+$/))) {
                    error_msg = 'Please enter valid digits';                
                    flag = false;
                }
            }
            
            if($(this).hasClass('only_digit_number') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (!(field_value.match(/^\d+$/))) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();                
                    flag = false;
                }
            }
            
            if($(this).hasClass('seo_url') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (!(field_value.match( /^[A-Za-z0-9_-]+$/))) {
                    error_msg = 'Please enter valid seo url';                
                    flag = false;
                }
            }
            
            if($(this).hasClass('number') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (!(field_value.match(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/))) {
                    error_msg = 'Please enter valid number';                
                    flag = false;
                }
            }
            if($(this).hasClass('check-youtube-vimeo-url') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (!(field_value.match(/^https:\/\/(?:.*?)\.?(youtube|vimeo)\.com\/(watch\?[^#]*v=(\w+)|(\d+)).+$/)) && !(field_value.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/))) {
                    error_msg = 'Please enter only youtube or vimeo url';                
                    flag = false;
                }
            }
            if($(this).hasClass('validate_zip') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (!(field_value.match(/^[a-z][0-9][a-z]\-s*?[0-9][a-z][0-9]$/i) || field_value.match(/^[a-z][0-9][a-z]\s*?[0-9][a-z][0-9]$/i))) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();                
                    flag = false;
                }
            }    
           
            if($(this).hasClass('validate_creditcard') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = new RegExp(/^\d{15,16}$/);
                if(!pattern.test(field_value)) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();
                    flag = false;
                }
           }    
           
            if($(this).hasClass('validate_month') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var re = /^[0-9]{1,2}$/;             
                if(!re.test(field_value)) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();
                    flag = false;
                }
            }
            if($(this).hasClass('validate_current_year') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var re = /^[0-9]{4}$/;   
                var currentYear = (new Date).getFullYear(); 
                   
                if(!re.test(field_value) || parseInt(field_value) < parseInt(currentYear)) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();
                    flag = false;                
                }
            }
            if($(this).hasClass('validate_year') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var re = /^[0-9]{4}$/;   
                   
                if(!re.test(field_value)) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();
                    flag = false;                
                }
            }
            if($(this).hasClass('validate_cvccode') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var re = /^[0-9]{3}$/;
                if(!re.test(field_value)) {
                    error_msg = 'Please enter valid '+placeholder.toLowerCase();
                    flag = false;                
                }
            }  
                  
            if($(this).attr('equalTo') !== undefined)  {
                if(field_value != 'Confirm Password' && $.trim($($(this).attr('equalTo')).val()) != field_value) {
                    error_msg = 'Password does not match';                
                    flag = false;                
                }
            }
           
            if($(this).hasClass('validate_password') && $(this).val() !='' && field_value !== undefined && field_value != placeholder ) { 
                var re = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\\ \+]{6,}/;             
                if(!re.test(field_value)){
                    error_msg = 'Password minimum 6 characters required';                
                    flag = false;
                }
            }
    
            if($(this).hasClass('validate_zero') && !$(this).is(":disabled") && $(this).val() !='' && field_value !== undefined && field_value != placeholder ) { 
                if(field_value < 1){
                    error_msg = 'Must be greater than 0';                
                    flag = false;
                }
            }
            
            if($(this).hasClass('validate_social_secutiry') && field_value != "" && field_value !== undefined && field_value != placeholder ) { 
                var re = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\+]{9,}/;             
                if(!re.test(field_value)){
                    error_msg = 'Invalid social security number';                
                    flag = false;
                }
            }
            
            if(this.id == 'email' && $('#email').attr('class').indexOf("duplicate-email-error") >= 0) {
                flag = false;
                error_msg = 'Email address already exist';
            }
            
            if($(this).hasClass('unique') && $(this).attr('class').indexOf("duplicate-error") >= 0 && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                error_msg = ucfirst(placeholder)+ ' already exist';
                flag = false;
            }
            
            if($(this).hasClass('check-url-char') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = new RegExp(/[a-zA-Z0-9-]/g);
                if(!pattern.test(field_value)) {
                    error_msg = 'Please enter valid text';
                    flag = false;
                }
            } 
            if($(this).hasClass('phone') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = /^[0-9()\s]+$/; //space and 0-9 number allow
                if(!pattern.test(field_value)) {
                    error_msg = 'Please enter valid phone';
                    flag = false;
                }
            }
            
            if($(this).hasClass('color-hex') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
                if(!pattern.test(field_value)) {
                    error_msg = 'Please enter valid color';
                    flag = false;
                }
            }
            
             
            if($(this).hasClass('ckeditor')) {
                if(this.id == 'CkEditor') {                
                    $(this).val(CKEDITOR.instances.CkEditor.getData());
                    field_value = $(this).val();
                }
            }
            
            if($(this).attr('id') == 'accept_terms' && !$('input#accept_terms').is(':checked')) {
                error_msg = 'Please accept terms & conditions';
                flag = false;
            }
            
            if($(this).hasClass('required') && (field_value == "" || field_value == undefined || field_value == placeholder )) { 
                if(formId == 'user_registration') {
                    required = 'true';
                    $('#error_content_required').show();
                    error_msg = 'All fields are required';
                }else if(formId == 'change_pass') {
                    required = 'true';
                    $('.fancybox-skin #error_password_required').show();
                    error_msg = 'All fields are required';
                } else if($(this)['0'].tagName !== undefined && $(this)['0'].tagName == 'SELECT')  {
                    error_msg = 'Please select '+placeholder.toLowerCase();
                } else if($(this).attr('type') !== undefined && $(this).attr('type') == 'file')  {
                    error_msg = 'Please upload file';
                } else if($(this).attr('type') !== undefined && $(this).attr('type') == 'hidden') {
                    if($(this).hasClass('dropdown_date_validation'))
                    {
                        error_msg = 'Please select hour, minute and AM/PM';
                    }
                    else if($(this).hasClass('dropdown_date_msg'))
                    {
                        error_msg = 'Start time should be less than end time';
                    }
                    else
                    {
                        error_msg = 'Please select '+placeholder.toLowerCase();
                    }
                } else if($(this).hasClass('select_msg')) {
                    error_msg = 'Please select '+placeholder.toLowerCase();
                } else {
                    error_msg = 'Please enter '+placeholder.toLowerCase();
                }  
                     
                flag = false;
            }
            if($(this).hasClass('required-least-one') && $(this).attr('groupid') != "" && $(this).attr('groupid') != undefined ){
                if($('input[groupid="'+$(this).attr('groupid')+'"]:checked').length < 1)
                {
                    error_msg = 'Please select any option.';
                    flag = false;
                }
            }
             
            
            if(!flag && error_msg != '') {
                error_msg = err_element_start + error_msg + err_element_end;
                if(err_container != '') {
                    if(formId == 'user_registration') {
                        if(required == 'false' || required === undefined) {
                            $(err_container).append(error_msg).show();
                            $('#error_content_required').hide();
                        } else {
                            $(err_container).html('').hide();
                            $('#error_content_required').show();
                        }
                    }else if(formId == 'change_pass') {
                        if(required == 'false' || required === undefined) {
                            $(err_container).append(error_msg).show();
                            $('.fancybox-skin #error_password_required').hide();
                        } else {
                            $(err_container).html('').hide();
                            $('.fancybox-skin #error_password_required').show();
                        }
                    } else {
                        $(err_container).append(error_msg).show();
                    }
                    
                    $(this).closest('div.form-group').addClass('error');
                    /*if($(this).hasClass('ckeditor')) {
                        $(this).next('div').after(error_msg );
                    }  else {
                        $(this).after( error_msg );    
                    }*/
                    if(!$(".user-package").is(":visible"))
                    {
                        $(this).css('border','1px solid rgb(207, 32, 38)');
                    }
                    
                    if($(this).attr('id') == 'register_industry'){
                        $(this).parent().next().addClass('error');
                    } 
                } else {
                    if($(this).attr('id') == 'contact_market'){
                        $(this).parent().next().addClass('error');
                    } else {
                        $(this).addClass('error');
                    }
                    
                    if($(this).attr('id') == 'contact_industry'){
                        $(this).parent().next().addClass('error');
                    } else {
                        $(this).addClass('error');
                    }
                }            
            }
          
        });
        
        return flag;
    //}, 500);
    
    
}

function ucfirst(str) {
    str += '';
    var f = str.charAt(0)
    .toUpperCase();
    return f + str.substr(1);
}




