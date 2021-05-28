<!-- Side Navigation -->
<?php if (Auth::guest()->check() || Auth::user()->check()){ ?>


    <!-- Side Navigation -->
    <div class="overlay-full"></div>
    <div class="nav-container tra">
        <h3>National insights</h3>
        <ul>

            @foreach($footer_link as $mainMenuKey => $mainMenuValue)
                @if($mainMenuKey != 'Parent')
                    <li>
                        <a href="javascript:;"><?php echo (($mainMenuKey == 'U.S. Key Themes')?'U.S. key trends':$mainMenuKey); ?></a>
                        @if(count($mainMenuValue) > 0)
                            <ul>
                                @foreach($mainMenuValue as $subMenuKey => $subMenuValue)
                                    @if($subMenuValue->e_show_in_menu == '1')
                                    <li>
                                    <a
                                    <?php if($cms == 'true'){
                                        if(isset($subMenuValue) && $subMenuValue != "" && $subMenuValue->v_external_link !=""){
                                    ?>
                                    href="javascript: void(0)" target="_blank"
                                    <?php }else{ ?>
                                    href="javascript: window.location.href='{{ SITE_URL.$subMenuValue->v_slug }}'"
                                    <?php }}
                                     else {
                                        if(isset($subMenuValue) && $subMenuValue != "" && $subMenuValue->v_external_link !=""){
                                    ?>
                                    href="javascript: window.location.href='{{ $subMenuValue->v_external_link }}'" target="_blank"
                                    <?php }else{ ?>
                                    href="javascript: window.location.href='{{ SITE_URL.$subMenuValue->v_slug }}'" <?php }} ?>
                                    >{{ $subMenuValue->v_title }}</a>
                                    </li>
                                    @endif
                                @endforeach
                            </ul>
                        @endif
                    </li>
                @endif
            @endforeach

            @foreach($footer_link as $index => $value)
                @if($index == 'Parent')
                    @foreach($value as $subMenuKey => $subMenuValue)
                        @if($subMenuValue->e_show_in_menu == '1')
                        <li>
                            <a <?php if($cms == 'true'){ echo 'href="'.SITE_URL.$subMenuValue->v_slug.'"'; } else {
                                if($subMenuValue->v_external_link !=""){
                                ?>
                                 href="javascript: window.location.href='{{ $subMenuValue->v_external_link }}'" target="_blank"
                                    <?php }else{ ?>
                                 href="javascript: window.location.href='{{ SITE_URL.$subMenuValue->v_slug }}'"<?php }} ?> >{{ $subMenuValue->v_title }}</a>
                        </li>
                        @endif
                    @endforeach
               @endif
            @endforeach

            <!-- li><a href="{{ SITE_URL.'contact-us' }}">Contact Us</a></li -->
            <li><a fancybox-change-password href="javascript:void(0);" class="change_password">Change password</a></li>
            <li><a href="javascript: window.location.href = '{{ SITE_URL }}logout';">Log out</a></li>
        </ul>

        <div class="mobile-contact-share">
            <a href="javascript:void(0);" class="red_btn view_contact_us <?php if($cms == 'true'){ ?> scroll_to_contact_us <?php } ?>" <?php if($cms != 'true'){ ?> onclick="javascript: window.location.href='{{ SITE_URL.'contact-us' }}'" <?php } ?> >Contact us</a>
			<!--a href="{{ SITE_URL.'contact-us' }}" class="red_btn view_contact_us">Contact us</a -->
            @if(isset($content)  && $content)
                <a class="st_sharethis_custom red_btn" st_title="{{ $content->v_title }} | {{ SITE_NAME }}" st_url="{{ Request::url() }}" href="javascript:void(0);" ><i class="share_icon"></i>Share</a>
            @else
                <a id="menu_share" class="st_sharethis_custom red_btn" st_title="" st_url="{{ Request::url() }}" st_summary="" href="javascript:void(0);" ><i class="share_icon"></i>Share this</a>
            @endif

            <a fancybox-change-password href="javascript:void(0);" class="red_btn change_password">Change password</a>
            <a href="javascript: window.location.href = '{{ SITE_URL }}logout';" class="red_btn">Log out</a>
        </div>
    </div>

    <header>
        <a class="brand" href="{{ SITE_URL }}"><img src="{{ SITE_URL }}images/logo_head.png" alt="" /></a>
        <a class="mobile-btn" href="javascript:void(0);"><span></span></a>
        <a class="pick-link" href="javascript:;">Pick a SKYLIN<span>E</span></a>
        <div class="pick-container">
            <div class="city-listing-wrapper cf">
                <div class="right-city-listing">
                        <ul id="custom_skyline_list_head" style="display:<?php echo ((!isset($userCustomSkylines) || $userCustomSkylines =="" || count($userCustomSkylines) == 0)?'none':"block"); ?>;"><li><a href="javascript:;">mySKYLINES</a></li></ul>
                        <ul id="custom_skyline_list">
                        <?php if(isset($userCustomSkylines) && $userCustomSkylines !="" && count($userCustomSkylines) > 0) { ?>
                            <?php foreach($userCustomSkylines as $index=>$value) { ?>
                            <li><a href="{{ SITE_URL.'my-skyline/'.$value['v_slug'] }}" > asd {{ $value['v_title'] }} </a></li>
                            <?php } ?>
                        <?php } ?>
                        </ul>
                        <!--<a href="javascript:;" >+ Add a new mySKYLIN<span style="color: #d22723;">E</span></a>-->
                        <a href="javascript:;" fancybox-skyline id="add_new_skuline_head">+ Add a new mySKYLIN<span style="color: #d22723;">E</span></a>
                </div>
                <div class="left-city-listing">
                    <ul>
                        <?php
                            $i = 1;
                            $city_count = count($headerCountryData);
                            $per_column = ceil($city_count / 3) + 1;
                            foreach($headerCountryData as $key => $val) {
                                if($i%$per_column == 0){
                                    $i = 1;
                                    ?>
                                    </ul>
                                    <ul class="">
                                    <?php
                                }
                                ?>
                                <li>
                                    <a href="{{ SITE_URL.'city/'.$val['v_slug'] }}">{{ $val['v_name'] }}</a>
                                </li>
                                <?php
                                $i++;
                            }
                        ?>
                    </ul>
                </div>
            </div>
        </div>
    </header>

<?php } else{ ?>
    <header>
        <a class="brand" href="{{ SITE_URL }}"><img src="{{ SITE_URL }}images/logo_head.png" alt="" /></a>
        <div class="login-register">
            <a  ng-class="getClass('/register')" href="{{ SITE_URL }}register">Register</a>
            <a  ng-class="getClass('/login')" href="{{ SITE_URL }}login"><img src="{{ SITE_URL }}images/lock.png" alt="">Login</a>
        </div>
    </header>
<?php } ?>

<section id="change_password_template" style="display: none;">
    <section id="change_password" class="change_password_template skylineBuilding">
        <h3>Change password</h3>
        <a class="skylineCloseButton" href="javascript:$.fancybox.close();"></a>
        <div class="contact_form">
            <form id="change_pass" class="change_pass" method="post" action="javascript:void(0);" onsubmit="return false" >
                <div class="success_content" id="success_content_password" style="display: none;"> Password change successful. </div>
                <div class="error_content" id="error_password_required" style="display: none;"> All fields are required. </div>
                <div class="error_content" id="error_content_password" style="display: none;"> All fields are required. </div>
                <div class="error_content" id="error_content_not_match" style="display: none;"> Current password not match. </div>

                <div class="full_content">
                    <input type="password" name="oldPassword" placeholder="Current password" id="old_password" class="required" />
                </div>
                <div class="full_content">
                    <input type="password" name="newPassword" placeholder="New password" id="new_password" class="required validate_password" />
                </div>
                <div class="full_content">
                    <input type="password" name="confirmPassword" placeholder="Confirm new password" id="confirm_password" class="required" equalto=".fancybox-skin #new_password"/>
                </div>
                <input type="submit" class="red_btn" value="Submit" onclick="submitPassword()" />
                <div class="clear"><!----></div>
            </form>
        </div>
    </section>
</section>

<?php if (Auth::guest()->check() || Auth::user()->check()){ ?>
<section id="add_new_customskyline_html" style="display: none;">
    <section id="add_new_customskyline_html_header" class="add_new_customskyline_html_header skylineBuilding register ng-scope" >
        <section id="contact_us" class="change_password_template">
            <a class="skylineCloseButton" ng-click="cancel_share_skyline()"></a>
            <div class="contact_form">
                <form action="javascript:void(0);" id="add_new_custom_skyline_form">
                    <h3> Create a new MySkyline</h3><a class="skylineCloseButton" href="javascript:$.fancybox.close();"></a>
                    <div class="error_content" id="error_content_required" style="display: none;"> Please enter skyline name. </div>

                    <div class="full_content">
                        <input type="text" name="v_title" placeholder="Enter Skyline name*" class="required" maxlength="50"/>
                    </div>
                    <div class="full_content">
                        <textarea rows="4" name="v_long_desc" placeholder="Enter Skyline description(optional)" maxlength="200"></textarea>
                    </div>
                    <p class="required-field">*Required fields</p>
                    <input type="submit" class="red_btn create-skyline-btn" value="Create"  onclick="saveSkyLineHeader()" " />
                </form>
            </div>
        </section>
    </section>
</section>
<?php } ?>

<section id="sucess_header_custom_skyline" style="display: none;">
<section  class="viewcustomskyline skylineBuilding" >
    <section id="change_password" class="change_password_template">
        <h3>Your new skyline has been created.</h3>
        <a class="skylineCloseButton" href="javascript:$.fancybox.close();"></a>
        <a class="red_btn button link view-your-skyline" href="javascript:;">View your skyline</a>
        <div class="dropdown-red dropdown-red-header">
            <a class="red_btn" href="javascript:;" style=" letter-spacing: 0; text-transform: none;">View my other Skylines</a>
            <div class="dropdown-list">
                <div class="all-skyline local header scrollbar-inner">
                    <ul class=""></ul>
				</div>
			</div>
		</div>
	</section>
</section>
</section>
