<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8"/>
<title>Reset Password | Admin Panel</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta content="" name="description"/>
<meta content="" name="author"/>

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
    <form class="login-form" id="reset-form" name="reset-form" action="" method="post">
        <h3 class="form-title">Reset your password.</h3>
        <?php if(Session::has('message')) { 
            if(Session::get('message') == 'Incorrect password.') { ?>
                <div class="alert alert-log alert-danger">
            <?php } else { ?>
                <div class="alert alert-log alert-success">
            <?php } ?>
                    <button class="close" data-close="alert"></button>
                    <span>{{ Session::get('message') }}</span>
                </div>        
        <?php } ?>
        <div class="alert display-hide">
            <button class="close" data-close="alert"></button>
            <span>Invalid username and password. </span>
        </div>
        <div class="form-group">
            <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
            <label class="control-label visible-ie8 visible-ie9">Password</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix required" type="password" id="v_password" data-error-message="Password" autocomplete="off" placeholder="Password" name="password"/>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">Confirm Password</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix required" equalTo="#v_password" type="password" data-error-message="Confirm Password" autocomplete="off" placeholder="Confirm Password" name="confirm_password"/>
            </div>
        </div>   
        <div class="form-actions">
            <span>&nbsp;</span>
            <button type="submit" class="btn green-haze pull-right">
            Submit <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div> 
        <div class="forget-password">
            <p>Click <a href="{{ ADMIN_URL }}" id="forget-password">here </a>to login.</p>
        </div>        
    </form>
    <!-- END LOGIN FORM -->
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

    jQuery("#reset-form").submit(function() 
    {
        $(".alert").hide();
        if(form_valid("#reset-form")) {
            return true;
        }
        return false;
    });
});
</script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>