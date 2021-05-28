<div class="go_top_top">
    <img src="{{SITE_URL}}images/go_top.png" alt="" />
</div>
<footer>
    <ul>
        <?php
        $totallinks = count($footer_link);
        if(isset($footer_link) and $totallinks > 0) {
            $fArr = array();
            foreach($footer_link as $k => $v) {
                if(isset($v['e_show_in_footer']) && $v['e_show_in_footer'] == '1') { $fArr[] = $v; }
            } 
            $totalFLinks = count($fArr);            
            if(count($fArr) > 0) {       
                $j = 1;
                foreach($fArr as $v) { ?>
                    <li <?php if($j == $totalFLinks) echo 'class="last"'; ?>><a href="<?php if($cms == 'true'){ echo SITE_URL.$v['v_slug']; } else { ?>javascript: window.location.href='<?php echo SITE_URL.$v['v_slug']; ?>' <?php } ?>"><?php echo $v['v_title']; ?></a></li>
                <?php $j++;
                }
            } 
        } ?>
    </ul>
    <p>© <?php echo date('Y'); ?> Jones Lang LaSalle, IP, Inc. All rights reserved.</p>
</footer>