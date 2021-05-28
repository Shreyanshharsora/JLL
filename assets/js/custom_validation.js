var err_element = 'span';
var err_class = 'help-block-error';
    
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
    
    if($("#cms_content_editor_add").length > 0) {
        if(CKEDITOR.instances['cms_content_editor_add']){
            CKEDITOR.instances['cms_content_editor_add'].on('change', function() { CKEDITOR.instances['cms_content_editor_add'].updateElement() });
        }
    }
    
    if($("#CkEditor").length > 0) {
        var CkEditor = CKEDITOR.replace('CkEditor');
        CkEditor.on('blur', function(evt){ $("#CkEditor").val(CkEditor.getData()); if( $("#CkEditor").val() != '') { $("#CkEditor_error").remove(); } });
        CkEditor.on('focus', function(evt){ $("#CkEditor").val(CkEditor.getData()); if( $("#CkEditor").val() != '') { $("#CkEditor_error").remove(); } });
    }
    
    if($("#cke_cms_content_editor_add").length > 0) {
        var CkEditor = CKEDITOR.replace('cke_cms_content_editor_add');
        CkEditor.on('blur', function(evt){ $("#cke_cms_content_editor_add").val(CkEditor.getData()); if( $("#cke_cms_content_editor_add").val() != '') { $("#cke_cms_content_editor_add").closest('div.form-group').removeClass('has-error'); } });
        CkEditor.on('focus', function(evt){ $("#cke_cms_content_editor_add").val(CkEditor.getData()); if( $("#cke_cms_content_editor_add").val() != '') { $("#cke_cms_content_editor_add").closest('div.form-group').removeClass('has-error'); } });
    }
    
    if($("#cke_cms_content_editor_edit").length > 0) {
        var CkEditor = CKEDITOR.replace('cke_cms_content_editor_edit');
        CkEditor.on('blur', function(evt){ $("#cke_cms_content_editor_edit").val(CkEditor.getData()); if( $("#cke_cms_content_editor_edit").val() != '') { $("#CkEditor2_error").remove(); } });
        CkEditor.on('focus', function(evt){ $("#cke_cms_content_editor_edit").val(CkEditor.getData()); if( $("#cke_cms_content_editor_edit").val() != '') { $("#CkEditor2_error").remove(); } });
    }
    
    if($("#vCkEditor").length > 0) {
        var CkEditor = CKEDITOR.replace( 'vCkEditor', {
        	toolbar: [
        		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline','Link' ] }
        	]
        });
        CkEditor.on('blur', function(evt){ $("#vCkEditor").val(CkEditor.getData()); if( $("#vCkEditor").val() != '') { $("#vCkEditor_error").remove(); } });
        CkEditor.on('focus', function(evt){ $("#vCkEditor").val(CkEditor.getData()); if( $("#vCkEditor").val() != '') { $("#vCkEditor_error").remove(); } });
    }
    
    $('input,select,textarea').live("blur", function(event) {
        $('#v_domain_name_error_edit').hide();
        $('#v_domain_name_error').hide();
        var id = this.id;
        var current_obj = $(this);
        var field_value = $.trim(current_obj.val());
        var placeholder = '';
        if($(this).hasClass('ignore_required_onfocus'))
        {
            return true;
        }
        setTimeout(function(){
        current_obj.closest('div.form-group').removeClass('has-error');
        current_obj.next('.'+err_class).remove();
        
        if(current_obj.attr('data-error-message') !== undefined) {
            placeholder = current_obj.attr('data-error-message');    
        } 
        
        var err_element_start = '<'+err_element+' id="'+this.id+'_error" class="help-block '+err_class+'">';
        var err_element_end = '.</'+err_element+'>';
        var error_msg = '';
        flag = true;
       
        if(current_obj.hasClass('email') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
            if(! pattern.test(field_value)) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();
                flag = false;
            }
        }
        if(current_obj.hasClass('domain') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var pattern = new RegExp(/^((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
            if(! pattern.test(field_value)) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();
                flag = false;
            }
        } 
        
        if(current_obj.hasClass('url') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
            if(! pattern.test(field_value)) {
                error_msg = 'Please enter valid URL';
                flag = false;
            }
        } 
        
        if(current_obj.hasClass('digits') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            if (!(field_value.match(/^\d+$/))) {
                error_msg = 'Please enter valid digits';                
                flag = false;
            }
        }
        
        if(current_obj.hasClass('only_digit_number') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            if (!(field_value.match(/^\d+$/))) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();                
                flag = false;
            }
        }
        
        if(current_obj.hasClass('number') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            if (!(field_value.match(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/))) {
                error_msg = 'Please enter valid number';                
                flag = false;
            }
        }
        if(current_obj.hasClass('max') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            if (parseFloat(field_value) > current_obj.attr('max')) {
                error_msg = 'Please enter valid value';                
                flag = false;
            }
        }
        
        if(current_obj.hasClass('validate_zip') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            if (!(field_value.match(/^[a-z][0-9][a-z]\-s*?[0-9][a-z][0-9]$/i) || field_value.match(/^[a-z][0-9][a-z]\s*?[0-9][a-z][0-9]$/i))) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();                
                flag = false;
            }
        }    
       
        if(current_obj.hasClass('validate_creditcard') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var pattern = new RegExp(/^\d{15,16}$/);
            if(!pattern.test(field_value)) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();
                flag = false;
            }
       }    
       
        if(current_obj.hasClass('validate_month') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var re = /^[0-9]{1,2}$/;             
            if(!re.test(field_value)) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();
                flag = false;
            }
        }
        if(current_obj.hasClass('validate_current_year') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var re = /^[0-9]{4}$/;   
            var currentYear = (new Date).getFullYear(); 
               
            if(!re.test(field_value) || parseInt(field_value) < parseInt(currentYear)) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();
                flag = false;                
            }
        }
        if(current_obj.hasClass('validate_year') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var re = /^[0-9]{4}$/;   
               
            if(!re.test(field_value)) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();
                flag = false;                
            }
        }
        if(current_obj.hasClass('validate_cvccode') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var re = /^[0-9]{3}$/;
            if(!re.test(field_value)) {
                error_msg = 'Please enter valid '+placeholder.toLowerCase();
                flag = false;                
            }
        }  
              
        if(current_obj.attr('equalTo') !== undefined)  {
            if(field_value != 'Confirm Password' && $.trim($(current_obj.attr('equalTo')).val()) != field_value) {
                error_msg = 'Password does not match';                
                flag = false;                
            }
        }
        
        if(current_obj.hasClass('color-hex') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
                if(!pattern.test(field_value)) {
                    error_msg = 'Please enter valid color';
                    flag = false;
                }
            }
       
        if(current_obj.hasClass('validate_password') && current_obj.val() !='' && field_value !== undefined && field_value != placeholder ) { 
            var re = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\\ \+]{6,}/;             
            if(!re.test(field_value)){
                error_msg = 'Minimum 6 characters required';                
                flag = false;
            }
        }

        if(current_obj.hasClass('validate_zero') && current_obj.val() !='' && field_value !== undefined && field_value != placeholder ) { 
            if(field_value < 1){
                error_msg = 'Must be greater than 0';                
                flag = false;
            }
        }
        
        if(current_obj.hasClass('validate_social_secutiry') && field_value != "" && field_value !== undefined && field_value != placeholder ) { 
            var re = /[a-zA-Z0-9\!\@\#\$\.\%\^\&\*\(\)\_\+]{9,}/;             
            if(!re.test(field_value)){
                error_msg = 'Invalid social security number';                
                flag = false;
            }
        }
        
        if(id == 'email' && $('#email').attr('class').indexOf("duplicate-email-error") >= 0) {
            flag = false;
            error_msg = 'Email address already exist';
        }
        
        if(current_obj.hasClass('unique') && current_obj.attr('class').indexOf("duplicate-error") >= 0 && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            flag = false;
            error_msg = ucfirst(placeholder)+ ' already exist';
        }
        
        if(current_obj.hasClass('phone') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
              var pattern = /^[0-9()\s]+$/; //space and 0-9 number allow
            if(!pattern.test(field_value)) {
                error_msg = 'Please enter valid phone';
                flag = false;
            }
        }
        
        if(current_obj.hasClass('check-url-char') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var pattern = new RegExp(/[a-zA-Z0-9-]/g);
            if(! pattern.test(field_value)) {
                error_msg = 'Please enter valid text';
                flag = false;
            }
        }
        
        if(current_obj.hasClass('page_url') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var pattern = new RegExp( /^[A-Za-z0-9_-]+$/);
            if(! pattern.test(field_value)) {
                error_msg = 'Please enter valid '+placeholder.toLocaleLowerCase();
                flag = false;
            }
        }
        
        if(current_obj.hasClass('check-youtube-vimeo-url') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
            var pattern = new RegExp(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
            var pattern_2 = new RegExp(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
            
            if(pattern.test(field_value) == false && pattern_2.test(field_value) == false) {
                error_msg = 'Please enter only youtube or vimeo url';
                flag = false;
            }
        } 
        
        if(current_obj.hasClass('required') && (field_value == "" || field_value == undefined || field_value == placeholder )) 
        {     
            if(current_obj['0'].tagName !== undefined && current_obj['0'].tagName == 'SELECT')  {
                error_msg = 'Please select '+placeholder.toLowerCase();
            }else if(current_obj.attr('type') !== undefined && current_obj.attr('type') == 'file')  {
                error_msg = 'Please upload file';
            }else if(current_obj.attr('type') !== undefined && current_obj.attr('type') == 'hidden'){
                error_msg = 'Please select '+placeholder.toLowerCase();
            } 
            else if(current_obj.attr('type') !== undefined && current_obj.attr('type') == 'select')  {
                error_msg = 'Please upload file';
            }else {
                error_msg = 'Please enter '+placeholder.toLowerCase();
            }
            flag = false;
        }
        if(current_obj.hasClass('required-least-one') && current_obj.attr('groupid') != "" && current_obj.attr('groupid') != undefined ){
            if($('input[groupid="'+current_obj.attr('groupid')+'"]:checked').length < 1)
            {
                error_msg = 'Please select any option';
                flag = false;
            }
        }  
        console.log($('#domainAdd').length);  
        if($('#domainAdd').length <= 0){        
            if(!flag && error_msg != '') {
                error_msg = err_element_start + error_msg + err_element_end;
                //$("#"+id+"_error").html(error_msg);
                current_obj.closest('div.form-group').addClass('has-error');
                /* For building section in admin */
                if(angular.element('#floor_tab').length > 0){
                    angular.element('#floor_tab').removeAttr('data-target').removeAttr('data-toggle');      
                } 
                if(current_obj.hasClass('ckeditor')) {
                    current_obj.next('div').after(error_msg );
                } else {
                    current_obj.after( error_msg );    
                }
                if(!$(".user-package").is(":visible"))
                {
                    current_obj.css('border','1px solid #ebccd1');
                }
                $('.alert-success').hide();
                $('.alert-danger').show();
            } else {
                var this_error_obj = current_obj.next("."+err_class);
                this_error_obj.closest('div.form-group').removeClass('has-error');
                this_error_obj.remove();
                if(!$(".user-package").is(":visible"))
                {
                    current_obj.css('border','1px solid #e5e5e5');
                }
                
                if($("#div_validation_msg").is(':empty'))
                {
                    $("#div_validation_msg").hide();
                }
            }
        }
        
       
        return flag;     
        },200);   
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
    //setTimeout(function(){
        err_container = typeof err_container !== 'undefined' ? err_container : '';
        if(err_container != '') { $(err_container).html(''); }
        
        $("."+err_class).closest('div.form-group').removeClass('has-error');
        $("."+err_class).remove();
    
    
        $(form).find('input,select,textarea').each(function() {
            var field_value = $.trim($(this).val());
            var placeholder = '';
            
            if(err_container != '' && !$(".user-package").is(":visible"))
            {
                $(this).css('border','1px solid #e5e5e5');
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
            
            if($(this).hasClass('domain') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                var pattern = new RegExp(/^((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm);
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
            if($(this).hasClass('max') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (parseFloat(field_value) > $(this).attr('max')) {
                    error_msg = 'Please enter valid value';                
                    flag = false;
                }
            }
            if($(this).hasClass('check-youtube-vimeo-url') && field_value != "" && field_value !== undefined && field_value != placeholder ) {
                if (!(field_value.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/)) == true && !(field_value.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)) == true) {
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
                    error_msg = 'Minimum 6 characters required';                
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
            
            if($(this).hasClass('required') && (field_value == "" || field_value == undefined || field_value == placeholder )) {  
                
                if($(this)['0'].tagName !== undefined && $(this)['0'].tagName == 'SELECT')  {
                    error_msg = 'Please select '+placeholder.toLowerCase();
                }else if($(this).attr('type') !== undefined && $(this).attr('type') == 'file')  {
                    error_msg = 'Please upload file';
                }
                else if($(this).attr('type') !== undefined && $(this).attr('type') == 'hidden')
                {
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
                } 
                else if($(this).hasClass('select_msg'))
                {
                    error_msg = 'Please select '+placeholder.toLowerCase();
                } 
                else 
                {
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
                    //$(err_container).append( error_msg );
                    $(this).closest('div.form-group').addClass('has-error');
                    if($(this).hasClass('ckeditor')) {
                        $(this).next('div').after(error_msg );
                    }  else {
                        $(this).after( error_msg );    
                    }
                    if(!$(".user-package").is(":visible"))
                    {
                        $(this).css('border','1px solid #ebccd1');
                    }
                } else {
                    if($(this).hasClass('ckeditor')) {
                        $(this).next('div').after(error_msg );
                    } else {
                        
                        if(this.id == "month")
                        {
                            $(this).next().after( error_msg );
                        }
                        else if(this.id == "date")
                        {
                            $(this).next().after( error_msg );
                        }
                        else if(this.id == "year")
                        {
                            $(this).next().after( error_msg );
                        }
                        else if(this.id == "v_social_secutiry_number")
                        {
                            $(this).next().after( error_msg );
                        }
                        else
                        {
                            $(this).closest('div.form-group').addClass('has-error');
                            $(this).after( error_msg );
                        }
                    }    
                }            
            }
          
        });
        if(flag){
            $('.alert-danger').hide();
            //$('.alert-success').show();
            /* For building section in admin */
            if(angular.element('#floor_tab').length > 0){
                angular.element('#floor_tab').attr('data-target', '#tab2').attr('data-toggle', 'tab');      
            } 
        } else {
            $('.alert-danger').show();
            //$('.alert-success').hide();
        }
        
        return flag;
    //}, 500);
    
    
}

function ucfirst(str) {
    str += '';
    var f = str.charAt(0)
    .toUpperCase();
    return f + str.substr(1);
}




