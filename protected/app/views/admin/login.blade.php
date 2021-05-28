<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<title>Login | Admin Panel</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="robots" content="noindex, nofollow" />
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description"/>
<meta content="" name="author"/>

<script type="text/javascript">
    <?php 
    $constant_data = get_defined_constants(true);

    foreach($constant_data['user'] as $constant_key => $constant_value){ 
        $constant_value = str_replace('"', "'", $constant_value);
    ?>
    {{ $constant_key }} = "{{ $constant_value }}";
    <?php  } ?>    
</script>

<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN PAGE LEVEL STYLES -->
<link href="{{ ADMIN_ASSET_URL }}plugins/select2/select2.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/login3.css" rel="stylesheet" type="text/css"/>
<!-- END PAGE LEVEL SCRIPTS -->
<!-- BEGIN THEME STYLES -->
<link href="{{ ADMIN_ASSET_URL }}css/components.css" id="style_components" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/plugins.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/layout.css" rel="stylesheet" type="text/css"/>
<link href="{{ ADMIN_ASSET_URL }}css/themes/default.css" rel="stylesheet" type="text/css" id="style_color"/>
<link href="{{ ADMIN_ASSET_URL }}css/custom.css" rel="stylesheet" type="text/css"/>
<!-- END THEME STYLES -->
<link rel="shortcut icon" href="{{ SITE_URL }}images/favicon.ico"/>
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="login">
<!-- BEGIN LOGO -->
<div class="logo">
    <a href="index.html">
    <img src="{{ SITE_URL }}images/logo.png" alt=""/>
    </a>
</div>
<!-- END LOGO -->
<!-- BEGIN SIDEBAR TOGGLER BUTTON -->
<div class="menu-toggler sidebar-toggler">
</div>
<!-- END SIDEBAR TOGGLER BUTTON -->
<!-- BEGIN LOGIN -->
<div class="content">
    <!-- BEGIN LOGIN FORM -->
    <form class="login-form" id="login-form" name="login-form" action="" method="post">
        <h3 class="form-title">Login to your account</h3>
        <?php if(Session::has('message')) { 
            if(Session::get('message') == 'Incorrect username/password.') { ?>
                <div class="alert alert-log alert-danger">
            <?php } else { ?>
                <div class="alert alert-log alert-success">
            <?php } ?>
                    <button class="close" data-close="alert"></button>
                    <span>{{ Session::get('message') }}</span>
                </div>        
        <?php } ?>
        <div class="alert alert-danger display-hide">
            <button class="close" data-close="alert"></button>
            <span>Invalid username and password. </span>
        </div>
        <div class="form-group">
            <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
            <label class="control-label visible-ie8 visible-ie9">Username</label>
            <div class="input-icon">
                <i class="fa fa-user"></i>
                <input class="form-control placeholder-no-fix required" type="text" data-error-message="Username" autocomplete="off" placeholder="Username" name="v_username"/>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Password</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix required" type="password" data-error-message="Password" autocomplete="off" placeholder="Password" name="v_password"/>
            </div>
        </div>
        <div class="form-actions">
            <label class="checkbox">
            <input type="checkbox" name="remember" value="1"/> Remember me </label>
            <button ngEnter type="submit" class="btn green-haze pull-right">
            Login <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div>       
        <div class="forget-password">
            <h4>Forgot your password ?</h4>
            <p>no worries, click <a href="javascript:;" id="forget-password">here </a>to reset your password.</p>
        </div>        
    </form>
    <!-- END LOGIN FORM -->
    <!-- BEGIN FORGOT PASSWORD FORM -->
    <form class="forget-form" name="forget-pass-form" id="forget-pass-form" action="" method="post">
        <h3>Forget Password ?</h3>
        <p>Enter your e-mail address below to reset your password.</p>        
        <div class="alert alert-danger display-hide">
            <button class="close" data-close="alert"></button>
            <span>Please enter registered email.</span>
        </div>
        <div class="form-group">
            <div class="input-icon">
                <i class="fa fa-envelope"></i>
                <input class="form-control email required placeholder-no-fix" id="v_email" type="text" autocomplete="off" data-error-message="Email" placeholder="Email" name="v_email"/>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" id="back-btn" class="btn">
            <i class="m-icon-swapleft"></i> Back </button>
            <button type="submit" class="btn green-haze pull-right">
            Submit <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div>
    </form>
    <!-- END FORGOT PASSWORD FORM -->    
</div>
<!-- END LOGIN -->
<!-- BEGIN COPYRIGHT -->
<div class="copyright">
     {{ date('Y') }} &copy; {{ SITE_NAME }}. Admin Panel.
</div>
<!-- END COPYRIGHT -->
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src="plugins/respond.min.js"></script>
<script src="plugins/excanvas.min.js"></script> 
<![endif]-->
<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}plugins/jquery-migrate.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}plugins/jquery.cokie.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="{{ ADMIN_ASSET_URL }}plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<script type="text/javascript" src="{{ ADMIN_ASSET_URL }}plugins/select2/select2.min.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="{{ ADMIN_ASSET_URL }}scripts/metronic.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}scripts/layout.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}scripts/demo.js" type="text/javascript"></script>
<script src="{{ ADMIN_ASSET_URL }}js/custom_validation.js"></script>   
<!-- script src="{{ ADMIN_ASSET_URL }}scripts/login.js" type="text/javascript"></script -->
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {     
    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    //Login.init();  

    setTimeout(function() { $(".alert-log").remove(); $(".alert-fp").remove(); }, 4000);

    $("#login-form").submit(function() 
    {
        $(".alert").hide();
        if(form_valid("#login-form")) {
            return true;
        }
        return false;
    });
 
    jQuery("#forget-pass-form").submit(function() 
    {
        $(".alert").hide();
        if(form_valid("#forget-pass-form")) 
        {
            jQuery.post('{{API_URL}}' + "forgot-password", { email: jQuery(this).find("#v_email").val() }, function(responce) 
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

    jQuery('#forget-password').click(function() {
        jQuery('.login-form').hide();
        jQuery('.forget-form').show();
    });

    jQuery('#back-btn').click(function() {
        jQuery('.login-form').show();
        jQuery('.forget-form').hide();
    });
    
});
</script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>