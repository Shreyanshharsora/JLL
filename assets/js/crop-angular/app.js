var app = angular.module('app', ['ngImgCrop']);

app.controller('Ctrl', function($scope, $timeout, $http) 
{
    $scope.site_url = SITE_URL;
    $scope.asset_url = ASSET_URL;
    $scope.temp_image_thumb_path = TEMP_IMAGE_THUMB_PATH;
    $scope.size='medium';
    $scope.type='circle';
    $scope.imageDataURI='';
    $scope.resImageDataURI='';
    $scope.resImgFormat='image/jpg';
    $scope.resImgQuality=1;
    $scope.selMinSize=140;
    $scope.resImgSize=140;
    $scope.validImage = 0;
    $scope.invalid_extension = INVALID_IMAGE_EXTENSION;
    $scope.small_size = INVALID_IMAGE_SIZE;
    $scope.error_message = "";
    //$scope.aspectRatio=1.2;
    $scope.onChange=function($dataURI){
      
    };
    $scope.onLoadBegin=function() {
      
    };
    $scope.onLoadDone=function() {
      
    };
    $scope.onLoadError=function() {
      
    };
    
    var handleFileSelect = function(evt) 
    {
        $("#load_fancybox").trigger('click');
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        flag = 0;
        reader.onload = function (evt) 
        {
            var w = this.width, h = this.height, t = file.type, n = file.name, s = ~~(file.size/1024); // ext only: // file.type.split('/')[1],
            $scope.$apply(function($scope)
            {
                $scope.validImage = 0;
                if (evt.target.result.toLowerCase().indexOf("data:image/png;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/gif;base64") >= 0 || evt.target.result.toLowerCase().indexOf("data:image/jpeg;base64") >= 0)
                {
                    if(s < 8000)
                    {
                        $scope.imageDataURI = evt.target.result;
                        $scope.validImage = 1;
                        $scope.error_message= "";
                    }
                    else
                    {
                        $scope.error_message = $scope.small_size;
                    }
                }
                else
                {
                    $scope.error_message = $scope.invalid_extension;                                                   
                }
                //if(data:image/png;base64)
            });
        };
        $timeout(function()
        {
            reader.readAsDataURL(file);
            $(".cropArea").show();
        },500);
    };
    
    if($(".ie9").length > 0) 
    {
        angular.element(document.querySelector('#fileInput')).on('change',function() 
        {
            options = {iframe: 'iframer_iframe', returnType: 'html',
    			onComplete: function(responseText) 
                {
    				responseText = $.trim(responseText);
                    if (responseText != '0') {
                        $("#load_fancybox").trigger('click');
                        $timeout(function()
                        {
                            $scope.validImage = 0;
        					$scope.$apply(function($scope)
                            {
                                if (responseText.toLowerCase().indexOf("data:image/png;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/jpg;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/gif;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/jpeg;base64") >= 0 || responseText.toLowerCase().indexOf("data:image/tmp;base64") >= 0)
                                {
                                    $scope.imageDataURI = responseText;
                                    $scope.validImage = 1;
                                    $scope.error_message= "";
                                }
                                else
                                {
                                    $scope.error_message = $scope.invalid_extension;                                                   
                                }                                                 
                            });
                            $('form')[0].reset();
                        },500);
    				} else {
    				   alert(responseText); //error messages will displayed here
                       return false;
    				}
    			}
    		};
    		iframer(options, '#form_name'); //submitting file                
        });
    } else {
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    }
    
    $scope.$watch('resImageDataURI',function(){
        //console.log('Res image', $scope.resImageDataURI);
    });
    
    $scope.cancelImage = function()
    {
        $.fancybox.close();
    }
    
    $scope.cropImage = function()
    {
        $http.post($scope.site_url+'generate-crop-image', {image_data:$scope.resImageDataURI}).success(function(data, status, headers, config) 
        {
            $("#v_image").val($scope.resImageDataURI);
            $(".image_table").attr('src',$scope.resImageDataURI);
            $.fancybox.close();
        }).
        error(function(data, status, headers, config) 
        {
        
        });
    }
  });
  
app.directive('fancybox', function ($compile, $http) {
    return {
        restrict: 'A',
        controller: function($scope, $timeout) 
        {
            $scope.openFancybox = function (url) 
            {
                url = $scope.site_url+"public/assets/js/angular/image-cropping/template.html";
                $http.get(url).then(function(response)
                {
                    if (response.status == 200) 
                    {
                        var template = angular.element(response.data);
                        var compiledTemplate = $compile(template);
                        compiledTemplate($scope);
                        $.fancybox.open(
                        { 
                            content: template, 
                            type: 'html', 
                            closeBtn: false,
                            helpers   : { 
                               overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox 
                            },
                            beforeClose: function()
                            {
                                if($(".cropArea").is(":visible"))
                                {
                                    $scope.resImageDataURI = "";
                                    $scope.imageDataURI = "";
                                    $(".cropArea").hide();
                                }
                            }
                        });
                    }
                });
            };
        }
    };
});