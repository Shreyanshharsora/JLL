<!DOCTYPE HTML>
<html>
<?php $page_content = trim(strip_tags($content)); if($page_content == '') {  $page_content = $page_title;  } ?>
<head>
	<meta http-equiv="content-type" content="text/html" />
	<title><?php echo strip_tags($page_title); ?></title>
    
    <meta name="description" content="<?php echo strip_tags($page_content); ?>" />
    <meta name="keywords" content="<?php echo strip_tags($page_content); ?>" />
    <meta name="author" content="<?php echo SITE_NAME; ?>" />
    
    <!-- for Facebook -->          
    <meta property="og:title" content="<?php echo strip_tags($page_title); ?>" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="<?php echo $image_url; ?>" />
    <meta property="og:description" content="<?php echo strip_tags($page_content); ?>" />
    
    <!-- for Twitter -->           
    <meta name="twitter:card" content="<?php echo SITE_NAME; ?>" />
    <meta name="twitter:title" content="<?php echo strip_tags($page_title); ?>" />
    <meta name="twitter:description" content="<?php echo strip_tags($page_content); ?>" />
    <meta name="twitter:image" content="<?php echo $image_url; ?>" />
</head>
<body itemscope itemtype="http://schema.org/ImageObject">
  <h1 itemprop="name"><?php echo ((strlen($page_content) < 255)?trim($page_content):trim(substr($page_content,0,255)).".."); ?></h1>
  <img itemprop="image" src="<?php echo $image_url; ?>" />
  <p itemprop="description"><?php echo $page_content; ?></p>
</body>
</html>