<?php
class AdminSettingsController extends BaseController
{
    public function anyIndex(){
        $data = Input::get();
        if(empty($data)){
            $email_templates = EmailTemplate::find(2);
            $email_templates->t_email_content = str_replace("[SITE_URL]",SITE_URL,$email_templates->t_email_content);
            $share_email_templates = EmailTemplate::find(7);
            $share_email_templates->t_email_content = str_replace("[SITE_URL]",SITE_URL,$share_email_templates->t_email_content);
            $countries = Country::get()->toArray();
            $cms = Cms::where('id','=','70')->first();
            $settings = Setting::find(1);
            $results = [
                'settings'=>$settings,
        	    'email_templates' => $email_templates,
                'share_email_templates' => $share_email_templates,
                'countries' => $countries,
                'cms' => $cms
        	];
            return json_encode($results);
        } else {
            $settings_data = Setting::find(1);
            $settings_data->admin_email = $data['setting']['admin_email'];
            //$settings_data->home_page_learn_more_link = $data['setting']['home_page_learn_more_link'];
            //if(!isset($data['setting']['v_login_form_content'])) $data['setting']['v_login_form_content'] = '';
            //$settings_data->v_login_form_content = trim($data['setting']['v_login_form_content']);
            //if(!isset($data['setting']['v_reset_pass_form_content'])) $data['setting']['v_reset_pass_form_content'] = '';
            //$settings_data->v_reset_pass_form_content = trim($data['setting']['v_reset_pass_form_content']);
            //$settings_data->v_home_page_content = $data['setting']['v_home_page_content'];
            //$settings_data->v_video_title = $data['setting']['v_video_title'];
            //$settings_data->v_video_link = $data['setting']['v_video_link'];
            $settings_data->v_skyline_what_is_this_help_text = trim($data['setting']['v_skyline_what_is_this_help_text']);
            $settings_data->v_homepage_img_rotator_text = trim($data['setting']['v_homepage_img_rotator_text']);
            $settings_data->v_instagram_hashtag = trim($data['setting']['v_instagram_hashtag']);
            $settings_data->v_instagram_client_id = trim($data['setting']['v_instagram_client_id']);
            $settings_data->v_instagram_access_token = trim($data['setting']['v_instagram_access_token']);
            $settings_data->v_instagram_widget_text = trim($data['setting']['v_instagram_widget_text']);
            $settings_data->v_instagram_widget_button1_text = trim($data['setting']['v_instagram_widget_button1_text']);
            $settings_data->v_instagram_widget_button1_link = trim($data['setting']['v_instagram_widget_button1_link']);
            $settings_data->v_instagram_widget_button2_text = trim($data['setting']['v_instagram_widget_button2_text']);
            $settings_data->v_instagram_widget_button2_link = trim($data['setting']['v_instagram_widget_button2_link']);

            /*if(isset($data['setting']['v_video_file']) && $data['setting']['v_video_file'] != '') {
                rename(TEMP_VIDEO_PATH.$data['setting']['v_video_file'], FILE_PATH.$data['setting']['v_video_file']);
                @unlink(FILE_PATH.$settings_data->v_video_file);
                glob(TEMP_VIDEO_PATH.'{,.}*', GLOB_BRACE);
                $settings_data->v_video_file = $data['setting']['v_video_file'];
            }*/

            if($settings_data->save()){
                $cms_data = Cms::find(70);
                $cms_data->v_meta_title = $data['cms']['v_meta_title'];
                $cms_data->v_meta_keywords = $data['cms']['v_meta_keywords'];
                $cms_data->v_meta_description = $data['cms']['v_meta_description'];
                //$cms_data->t_content = $data['cms']['t_content'];

                if($cms_data->save()){
                    $share_templates_data = EmailTemplate::find(7);
                    if(isset($data['share_email_templates']['v_share_template_subject'])){
                        $share_templates_data->v_template_subject = $data['share_email_templates']['v_share_template_subject'];
                    }
                    $share_templates_data->t_email_content = str_replace(SITE_URL,"[SITE_URL]",$data['share_email_templates']['t_email_content']);
                    $share_templates_data->save();

                    $templates_data = EmailTemplate::find(2);
                    if(!isset($data['template']['v_template_title'])) $data['template']['v_template_title'] =  $data['template']['v_template_subject'];
                    $templates_data->v_template_title = $data['template']['v_template_title'];
                    $templates_data->v_template_subject = $data['template']['v_template_subject'];
                    $templates_data->t_email_content = str_replace(SITE_URL,"[SITE_URL]",$data['template']['t_email_content']);

                    if($templates_data->save() && !empty($data['country']['name'])){
                        $i = 1;

                        foreach($data['country']['name'] as $key=>$val){
                            $field_name = 'countries_data'.$key;
                            $$field_name = Country::find($key+1);
                            /*if($data['country']['image'][$key] != '' && $data['country']['image_type'][$key] == 'New') {
                                @unlink(COUNTRY_IMAGE_PATH.$$field_name->v_image_name);
                                $base64_thumbnail = $data['country']['image'][$key].'=';
                                $v_random_thumbnail = time().'-'.str_random(6);
                                $path = COUNTRY_IMAGE_PATH;
                                $thumbnailImage = $this->saveImage($base64_thumbnail, $v_random_thumbnail, $path);
                                $$field_name->v_image_name = $thumbnailImage;
                            }*/
                            $$field_name->name = $val;
                            $$field_name->abbreviation = $data['country']['abbr'][$key];
                            $$field_name->save();

                            $i++;
                        }
                        return 'TRUE';
                    } else {
                        return 'FALSE';
                    }
                }
            } else {
                return 'FALSE';
            }
        }
    }
    /*Function for Save File in folder */
    protected function saveFile($base64img,$path) {
        $base64img = substr(strstr($base64img,','), 1);

        $data = base64_decode($base64img);
        if(file_put_contents($path, $data)){
            return 'TRUE';
        }
    }

    public function anyUploadVideo(){
        $data = Input::all();
        $files = glob( TEMP_VIDEO_PATH . '*', GLOB_MARK ); //GLOB_MARK adds a slash to directories returned
        foreach($files as $file_remove) {
            unlink($file_remove);
        }
        if(count($data) > 0) {
            $file = $data['video_upload'];
            $fileType = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
            if($fileType == 'mp4') {
                $file_name = $file->getClientOriginalName();
    			$image_name =  time()."_".$file_name;
    			$success =  $file->move(TEMP_VIDEO_PATH,$image_name);
                if($success) {
                    return $image_name;
                } else {
                    return 'FALSE';
                }
            } else {
                return 'EXTENSION_ERROR';
            }
        }
    }
}
?>
