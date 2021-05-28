/**
Custom module for you to write your own javascript functions
**/
var Custom = function () {
    var tableOptions;
    var tableWrapper; // actual table wrapper jquery object
    // private functions & variables

    var myFunc = function(text) {
        alert(text);
    }
    
    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        });
        if ($('.group-checkable').length > 0) {
            $('.group-checkable').attr("checked", false);
            $.uniform.update($('.group-checkable'));
        }
        // handle group checkboxes check/uncheck
            $('.group-checkable').change(function() {
                var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]');
                var checked = $(this).is(":checked");
                $(set).each(function() {
                    $(this).attr("checked", checked);
                    $.uniform.update(this);
                });
                
                countSelectedRecords();
            });

    }
    var countSelectedRecords = function() {
        var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked').size();
        var text = '_TOTAL_ records selected';
        if (selected > 0) {
            $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
        } else {
            $('.table-group-actions > span', tableWrapper).text("");
        }
    };

    // public functions
    return {

        //main function
        init: function () {
            Metronic.initUniform($('input[type="checkbox"]')); // reinitialize uniform checkboxes on each table reload
            countSelectedRecords(); // reset selected records indicator
            initPickers();
            //initialize here something.            
        },

        //some helper function
        doSomeStuff: function () {
            myFunc();
        }

    };

}();

function callback(stackframes) {
    var stringifiedStack = stackframes.map(function(sf) {
        return sf.toString();
    }).join('\n');
    
    $.post(API_URL+'buildings/add-log',{error_text: stringifiedStack},function(response) {
        if(response == 'TRUE'){
            return true;
        } else {
            return false;
        }
    });
    
};

function errback(err) { 
    console.log(err.message); 
};
window.onerror = function(msg, file, line, col, error) {
    // callback is called with an Array[StackFrame]
    StackTrace.fromError(error).then(callback).catch(errback);
};
/***
Usage
***/
//Custom.init();
//Custom.doSomeStuff();