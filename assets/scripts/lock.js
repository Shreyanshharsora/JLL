var Lock = function () {

    return {
        //main function to initiate the module
        init: function () {

             $.backstretch([
		        "img/media/bg/1.jpg",
    		    "img/media/bg/2.jpg",
    		    "img/media/bg/3.jpg",
    		    "img/media/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		      });
        }

    };

}();