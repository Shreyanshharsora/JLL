$(document).ready(function(){
    /* Script will detact the word "Neutral and Tenant" and add class according to that */
    $('.table td').each(function(){
        if($(this).html()=='Neutral'){
            $(this).addClass('org')
        }else if($(this).html()=='Tenant'){
            $(this).addClass('red');

        }
    })
})
