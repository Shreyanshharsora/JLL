<div class="go_top_top">
    <img src="{{SITE_URL}}images/go_top.png" alt="" />
</div>

<footer class="main-footer">
    <ul>
        <?php
        $more_info =(isset($_SERVER['REDIRECT_URL']) && $_SERVER['REDIRECT_URL']!="")?explode('/', $_SERVER['REDIRECT_URL']):'';
        $url=(isset($more_info) && $more_info!="") ? array_reverse($more_info)[0]:'';

       //echo str_replace(SITE_URL,'',);
        $totallinks = count($footer_link);
        if(isset($footer_link) and $totallinks > 0) {
            $fArr = array();
            foreach($footer_link as $index => $value){
                if(is_array($value)){
                    foreach($value as $subMenuKey => $subMenuValue){
                       if($subMenuValue->e_show_in_footer == '1') { $fArr[] = $subMenuValue; }
                    }
                } else{
                    if($value->e_show_in_footer == '1') { $fArr[] = $value; }
                }
            }

            $totalFLinks = count($fArr);
            if(count($fArr) > 0) {
                $j = 1;
                foreach($fArr as $v) { ?>
                    <li class="<?php echo (str_replace(SITE_URL,'',$v->v_slug) == $url) ?'active':''; ?>" <?php if($j == $totalFLinks) echo 'class="last"'; ?>><a <?php
                        if($cms == 'true'){
                            if($v->v_external_link !=""){
                            ?>
                                    href="{{ $v->v_external_link }}" target="_blank"
                                    <?php }else{ ?>
                                    href="{{ SITE_URL.$v->v_slug }}"
                                    <?php }} else {
                        if($v->v_external_link !=""){
                        ?>
                        href="{{ $v->v_external_link }}" target="_blank"
                         <?php }else{ ?>
                        href="javascript: window.location.href='{{$v->v_slug }}'" <?php }} ?> ><?php echo $v->v_title; ?></a></li>
                <?php $j++;
                }
            }
        }
        //if(Auth::user()->check() == false && Auth::guest()->check() == false) {
        //echo '<li><a href="'.SITE_URL.'contact-us">Contact Us</a></li>';
        //}
        ?>
        <li><a href="{{SITE_URL}}contact-us" ng-class="{active:isActive('/contact-us')}" >Contact Us</a></li>
        <li><a target="_blank" href="http://jll.com/">JLL.com</a></li>
    </ul>
    <p>&copy; <?php echo date('Y'); ?>  Jones Lang LaSalle, IP, Inc. All rights reserved.</p>
</footer>
