<!-- Side Navigation -->
<div class="nav_container tra">
    <ul>
        <li class="no_bg current_heading" style="cursor: default;"><a href="javascript: void(0);">National Insights</a></li>
        <?php foreach($footer_link as $key => $val) {
			
            if(isset($val['e_show_in_footer']) && $val['e_show_in_footer'] != '1')  { ?>
            <li <?php if(basename(Request::url()) == $val['v_slug']){ ?>class="current" <?php } ?>><a <?php if(basename(Request::url()) == $val['v_slug']){ ?> href="javascript: void(0);" <?php } else if($cms == 'true'){ echo 'href="'.SITE_URL.$val['v_slug'].'"'; } else { ?> href="javascript: window.location.href='{{ SITE_URL.$val['v_slug'] }}'" <?php } ?>>{{ $val['v_title'] }}</a></li>
            <?php } 
        } ?>
        <li><a target="_blank" href="http://jll.com/">JLL.com</a></li>
        <?php if(isset($userData) && $userData != '' &&  isset($userData->e_type) && $userData->e_type == 'Guest') { ?>
            <li><a fancybox-change-password href="javascript:void(0);" class="change_password">Change password</a></li>
            <li><a href="javascript: window.location.href = '{{ SITE_URL }}logout';">Log out</a></li>
        <?php } ?>        
    </ul>
    <div class="bottom_links">
        <a href="javascript:void(0);" class="red_btn view_contact_us <?php if($cms == 'true'){ ?> scroll_to_contact_us <?php } ?>" <?php if($cms != 'true'){ ?> onclick="to_home_contact_us()" <?php } ?> >Contact us</a>
        @if($content)
        <a class="st_sharethis_custom red_btn" st_title="{{ $content->v_title }} | {{ SITE_NAME }}" st_url="{{ Request::url() }}" href="javascript:void(0);" ><i class="share_icon"></i>Share</a>
        @else
        <a id="menu_share" class="st_sharethis_custom red_btn" st_title="" st_url="{{ Request::url() }}" st_summary="" href="javascript:void(0);" ><i class="share_icon"></i>Share</a>
        @endif
        
        <a fancybox-change-password  href="javascript:;" class="red_btn change_password">Change password</a>
        <a href="javascript: window.location.href = '{{ SITE_URL }}logout';" class="red_btn user-login">Log out</a>
    </div>
</div>

<header>
    <a <?php if($cms == 'true'){ ?> href="{{ SITE_URL }}" <?php } else { echo 'ui-sref="/"'; }?> class="brand"><img src="{{ SITE_URL }}images/logo_head.png" alt="" /></a>
    <?php if($userData != '' &&  isset($userData->id)) { ?>
        <a href="javascript:void(0);" class="mobile_btn"><span></span></a>
        <a href="javascript:void(0);" class="pc_link">Pick your Skyline </a>
        <!-- Pick city container -->
        <div class="pick_container">
            <div class="city_listing_wrapper">
                <ul class="city_listing first">
                <?php 
                $i = 1; 
                $city_count = count($headerCountryData);
                $per_column = ceil($city_count / 4) + 1;
                foreach($headerCountryData as $key => $val) {
                    if($i%$per_column == 0){
                        $i = 1; 
                        ?>
                        </ul>
                        <ul class="city_listing">
                        <?php
                    }
                    ?>
                    <li>
                        <a <?php if($cms == 'true'){ ?> href="{{ SITE_URL.'city/'.$val['v_slug'] }}" <?php } else { ?> href="javascript: void(0);" ng-click="get_city_detail('{{ $val['v_slug'] }}')" <?php }?>><span>{{ $val['v_name'] }}</span></a>
                    </li>
                    <?php
                    $i++;
                } 
                ?>
                </ul>
            </div>
        </div>
    <?php }  ?>
</header>
<section id="change_password_template" style="display: none;">
    <section id="change_password" class="change_password_template">
        <div class="title change_password_title" > Change password</div>
        <div class="contact_form">
            <form id="change_pass" class="change_pass" method="post" action="javascript:void(0);" onsubmit="return false" >
                <div class="success_content" id="success_content_password" style="display: none;"> Password change successful. </div>
                <div class="error_content" id="error_password_required" style="display: none;"> All fields are required. </div>
                <div class="error_content" id="error_content_password" style="display: none;"> All fields are required. </div>
                <div class="error_content" id="error_content_not_match" style="display: none;"> Current password not match. </div>
            
                <input type="password" name="oldPassword" placeholder="Current password" id="old_password" class="required" />
                <input type="password" name="newPassword" placeholder="New password" id="new_password" class="required validate_password" />
                <input type="password" name="confirmPassword" placeholder="Confirm new password" id="confirm_password" class="required" equalto=".fancybox-skin #new_password"/>
                <input type="submit" class="red_btn" value="Submit" onclick="submitPassword()" />
                <div class="clear"><!----></div>
            </form>
        </div>
    </section>
</section>