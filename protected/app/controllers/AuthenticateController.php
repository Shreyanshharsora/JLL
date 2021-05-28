<?php 
class AuthenticateController extends BaseController 
{
    public function check_auth_status()
    {
        if(Auth::user()->check() == true)
        {
            echo '1';
            exit;
        }
        echo '0';
        exit;
    }

    public function reset_password_status($access_code = "")
    {
        $objUser = User::where('v_access_code','=',$access_code)->count();
        if($objUser > 0)
        {
            echo '1';
            exit;
        }
        echo '0';
        exit;
    }

    public function check_login_status()
    {
        $arrData = Input::all();
        if ($arrData) {
            $remember = (Input::has('remember')) ? true : false;
            $adminData = Auth::user()->attempt(array( // method for checking authentication
                    'email'=>e(trim(Input::get('v_username'))),
                    'e_status'=>'1',
                    'e_type'=>'Admin',
                    'password'=>e(trim(Input::get('v_password'))),
            ),$remember);
            
            if($adminData) {   
                $arrUser = Auth::user()->get();
                $loginStatus = ($arrUser->id * CIPHER_KEY) + CIPHER_KEY;
                if($remember){
                    return Response::json(array('login_status'=> $loginStatus,'name'=>$arrUser->fname.' '.$arrUser->lname,'email'=>$arrUser->email));
                } else {
                    return Response::json(array('login_status'=> $loginStatus,'name'=>$arrUser->fname.' '.$arrUser->lname));    
                }
                
            } 
        }
        echo '0';
        exit;
    }
    
    public function dashboard()
    {   
        return View::make('admin.dashboard', array('title' => 'Dashboard')); 
    }

    public function forgot_password()
    {
        if (Input::all() and Input::has('email')) {
            $adminData = User::where('email', '=', e(trim(Input::get('email'))))->first();
            if(empty($adminData)) 
            {
                echo "0";
            } 
            else 
            {
                $v_access_code= str_random(10);
                $adminData->v_access_code = $v_access_code; // random access_code 
                if ($adminData->save())
                {
                    $objEmailTemplate = EmailTemplate::find(1);
                    $strTemplate = $objEmailTemplate['t_email_content'];
                    $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[LINK]',ADMIN_URL.'reset-password/'.$v_access_code,$strTemplate);
                    $strTemplate = str_replace('[USERNAME]',$adminData->fname." ".$adminData->lname,$strTemplate);

                    ob_end_clean();
                    header("Connection: close");
                    ignore_user_abort(); 
                    ob_start();
                    header('HTTP/1.1 200 OK', true, 200);
                    echo "1";
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

    public function reset_password($access_code = "")
    {
        if (Input::all())
        {
            $strPassword= e(trim(Input::get('password'))); // getting password value
            $objUser = User::where('v_access_code','=',$access_code);
            $objUser  = $objUser->first();
            $objUser->password = Hash::make($strPassword); // convert password into hash formate
            $objUser->v_access_code = '';
            if($objUser->save()) // save new password
            {
                echo "1";
            }
        }
        echo "0";
        exit;
    }

    public function my_profile()
    {
        if(Auth::user()->check() == true)
        {
            $arrData = Auth::user()->get();
            $results = [
                'items' => $arrData,
                'access_page' => 'my_profile'
            ];
            return json_encode($results);
        } else {
            Auth::user()->logout();
            Session::remove('SessionUser');
            Session::flash('message', "You have successfully logout.");
            return Redirect::to(ADMIN_URL);   
        }
    }

    public function logout()
    {   
        Auth::user()->logout();
        Session::remove('SessionUser');
        Session::flash('message', "You have successfully logout.");
        return Redirect::to(ADMIN_URL);                 
    }
    
    public function postDashboardRecord()
    {  
        $record = array();
        $record['User'] = User::count();
        $record['Cms'] = Cms::where('v_slug', '!=','home')->count();
        $record['City'] = City::count();
        $record['Building'] = Building::count();
        $record['UnitStatus'] = UnitStatus::count();
        $record['NationalAsset'] = NationalAsset::count();
        $record['CityAsset'] = CityAsset::count();
        return $record;
        
    }
    
    
}