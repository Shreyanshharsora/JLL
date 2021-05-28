<?php
class LoginController extends BaseController {
    public function user_login_status()
    {
        $arrData = Input::all();
        if ($arrData) {
            $remember = (Input::has('remember')) ? true : false;
            // method for checking authentication
            $guestUserData = Auth::guest()->attempt(array( 
                    'email'=>e(trim(Input::get('v_username'))),
                    'e_status'=>'1',
                    'e_type'=>'Guest',
                    'password'=>e(trim(Input::get('v_password'))),
            ),$remember);
            if($guestUserData) {
                Session::forget('last_page_url');
                $arrUser = Auth::guest()->get();
                //$arrUser->id= ($arrUser->id * CIPHER_KEY) + CIPHER_KEY;
                if($remember){
                    return Response::json(array('user'=> $arrUser,'email'=>$arrUser->email));
                } else {
                    return Response::json(array('user'=> $arrUser));    
                }
            } 
        }
        return '0';
        exit;
    }
    
    public function postUserRegister()
	{
        $RestrictDomainList = Domain::lists('v_domain_name');
        $data = Input::get();
        
        if(!empty($data) && isset($data['email'])){
            $checkArr = array();
            $user = new User;
            $domain_name = substr(strrchr($data['email'], "@"), 1);
            $userCheck = User::where('email',$data['email'])->where('e_type', 'Guest')->first();
            
            $checkArr = preg_grep("/".$domain_name."/i" , $RestrictDomainList);
            $restrictFlag = 0;
            if(empty($checkArr)){
                $restrictFlag = 1;
            }
            
            if (count($userCheck) > 0) {
                return 'EMAIL_EXISTS';exit;
            } else if($restrictFlag == 0) {
                return 'RESTRICTED';
            }
            
            $user->fname = $data['fname'];
            $user->lname = $data['lname'];
            $user->email = $data['email'];
            $user->password = Hash::make($data['password']);
            $user->e_type = 'Guest';
            $user->v_industry = $data['v_industry'];
            $user->v_city = $data['v_city'];
            $user->v_title = $data['v_title'];
            $user->v_company_name = $data['v_company_name'];
            $user->e_status = 1;
            
            if($user->save())
            {     
                
                /*Update skyline bulidings share data*/
                $skylineBuilding = SkylineShareTo::where('v_email_id', $user->email)->update(array('i_user_id' => $user->id));
                
                $guestUserData = Auth::guest()->attempt(array( 
                    'email'=>e(trim($data['email'])),
                    'e_status'=>'1',
                    'e_type'=>'Guest',
                    'password'=>e(trim($data['password'])),
                ),true);
                Session::forget('last_page_url');
                
                $objEmailTemplate = EmailTemplate::find(5);
                $emailSubject = $objEmailTemplate['v_template_subject']; 
                $strTemplate = $objEmailTemplate['t_email_content'];
                $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                $strTemplate = str_replace('[SITE_NAME]',SITE_NAME,$strTemplate);
                $strTemplate = str_replace('[LINK]',SITE_URL,$strTemplate);
                $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                $strTemplate = str_replace('[USERNAME]',$user->fname." ".$user->lname,$strTemplate);
                $strTemplate = str_replace('[EMAIL_ADDRESS]',$user->email,$strTemplate);
                $strTemplate = str_replace('[PASSWORD]',$data['password'],$strTemplate); 
                /*ob_end_clean();
                header("Connection: close");
                ignore_user_abort(); 
                ob_start();
                header('HTTP/1.1 200 OK', true, 200);
                echo "TRUE";
                $size = ob_get_length();
                header("Content-Length: $size");
                ob_end_flush();
                flush();
                session_write_close();*/

                // mail sent to user
                Mail::queue('emails.auth.generate-email-template', array('strTemplate'=>$strTemplate), function($message) use ($user,$emailSubject)
                {
                    $message->to($user->email, $user->fname." ".$user->lname);
                    $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                    $message->subject($emailSubject);                        
                });
                if(Auth::guest()->check()){
                    $arrUser = Auth::guest()->get();
                    echo json_encode(array('user'=> $arrUser,'email'=>$arrUser->email));    
                }    
            } else {
                return 'FALSE';
            }  
        } else {
            return 'FALSE';
        }
    }
    
    public function change_password()
    {
        $data = Input::All();
        $params = array();
        if(isset($data['data'])){
            parse_str($data['data'], $params);
            if(count($params) > 0) {
                $userguest = User::find(Auth::guest()->get()->id);
                
                if (!Hash::check($params['oldPassword'], $userguest->password)) {
                    return 'NOT_MATCH';
                } else {
                    $userguest->password = hash::make($params['newPassword']);
                    if($userguest->save()){
                        return 'TRUE';
                    } else {
                        return 'TRUE';
                    }
                }
            }
        }
    }
    
    
    public function forgot_password()
    {
        if (Input::all() and Input::has('email')) {
            $adminData = User::where('email', '=', e(trim(Input::get('email'))))->where('e_type','Guest')->first();
            if(empty($adminData)) 
            {
                echo "FALSE";
            } 
            else 
            {
                $new_password = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 8);
                $adminData->password = Hash::make($new_password); // random access_code 
                if ($adminData->save())
                {
                    $objEmailTemplate = EmailTemplate::find(6);
                    $strTemplate = $objEmailTemplate['t_email_content'];
                    $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[SITE_NAME]',SITE_NAME,$strTemplate);
                    $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[NEW_PASSWORD]',$new_password,$strTemplate);
                    $strTemplate = str_replace('[USERNAME]',$adminData->fname." ".$adminData->lname,$strTemplate);

                    ob_end_clean();
                    header("Connection: close");
                    ignore_user_abort(); 
                    ob_start();
                    header('HTTP/1.1 200 OK', true, 200);
                    echo "TRUE";
                    $size = ob_get_length();
                    header("Content-Length: $size");
                    ob_end_flush();
                    flush();
                    session_write_close();

                    // mail sent to user with new link
                    Mail::queue('emails.auth.generate-email-template', array('strTemplate'=>$strTemplate), function($message) use ($adminData)
                    {
                        $message->to($adminData->email, $adminData->fname." ".$adminData->lname);
                        $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                        $message->subject('Forgot Password');                        
                    });    
                } 
            }
        }
        exit;
    }
    
    public function login_setting() {
        $setting_data['setting'] = Setting::select('v_login_form_content','v_home_page_content','v_video_title','v_video_link','v_reset_pass_form_content','v_video_file')->first();
        if(strpos($setting_data['setting']['v_video_link'],'vimeo') === false and preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $setting_data['setting']['v_video_link'], $matches)) {
            
            $setting_data['setting']['v_video_type'] = 'youtube';
            $setting_data['setting']['v_video_link'] = $matches[1];
            //preg_match("#(?<=v=)[a-zA-Z0-9-]+(?=&)|(?<=v\/)[^&\n]+(?=\?)|(?<=v=)[^&\n]+|(?<=youtu.be/)[^&\n]+#", $setting_data['setting']['v_video_link'], $matches);
        } else if(preg_match("/https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/", $setting_data['setting']['v_video_link'], $matches)) {
            $setting_data['setting']['v_video_type'] = 'vimeo';
            $setting_data['setting']['v_video_link'] = $matches[3];
        } else {
            $setting_data['setting']['v_video_type'] = 'other';
            $setting_data['setting']['v_video_link'] = $setting_data['setting']['v_video_link'];
        }        
        
        $setting_data['industries'] = BaseController::all_industries();
        return $setting_data;
    }
    
    public function checkLogin() {
        if(Auth::guest()->check()){
            return Auth::guest()->get();
        } else if(Auth::user()->check()){
            return Auth::user()->get();
        } else {
            $last_page_url = Session::get('last_page_url');
            //Session::forget('last_page_url');
            return 'FALSE|||'.$last_page_url;
        }
    }
    
    public function logout() {
        if (Auth::guest()->check()){
            Auth::guest()->logout();
        } else if(Auth::user()->check()){
            Auth::user()->logout();
        }
        return Redirect::to(SITE_URL); 
    }
}
