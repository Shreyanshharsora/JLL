<?php
class AdminUsersController extends BaseController 
{
    /* Use for cms listing*/
	public function postIndex()
	{
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }
        $data = Input::get();
        $user = new User;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$user = $user->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $user = $user->orderBy('updated_at','DESC');
		}
        
        if(isset($data['search_fields']['name']) && $data['search_fields']['name']!=""){
			$user = $user->where('fname', 'LIKE',"%".$data['search_fields']['name']."%")->orWhere('lname', 'LIKE',"%".$data['search_fields']['name']."%");
		}
        
		if(isset($data['search_fields']['email']) && $data['search_fields']['email']!=""){
			$user = $user->where('email', 'LIKE',"%".$data['search_fields']['email']."%");
		}
        
        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$user = $user->where('e_status', $data['search_fields']['e_status']);
		}
        if(isset($data['search_fields']['e_type']) && $data['search_fields']['e_type']!=""){
			$user = $user->where('e_type', $data['search_fields']['e_type']);
		}
        
        $userData = Auth::user()->get();
        $userArr = $userData->toArray();       
        $user = $user->where('id', "!=",$userArr['id']);
       
        $user = $user->paginate($data['rec_per_page']);
        $arrUser = $user->toArray();
        
        $results = [
    	    'items' => $arrUser['data'],
            '_meta' => [
    	        'total'        => $user->getTotal(),
    	        'rpp'     => $user->getPerPage(),
    	        'current' => $user->getCurrentPage(),
    	        'last_page'    => $user->getLastPage(),
    	        'from'         => $user->getFrom(),
    	        'to'           => $user->getTo()
    	    ]
    	];
	    return json_encode($results);
	}
    
    public function anyData($id)
    {
        $user = new User;
        $user = $user->where('id','=',$id)->first();
        $arrUser = $user->toArray();
        $results = array('items' => $arrUser);
        return json_encode($results);
    }
    
    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
                $updateAllrecords=DB::update(DB::RAW("UPDATE User SET email = CONCAT(UNIX_TIMESTAMP(),'-', email) where id In(".implode(",",$data['id']).")"));
                User::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }else  if ($action == "act") { //Active Action   
                User::whereIn('id', array_values($data['id']))->update(array("e_status" =>"1"));
                 echo "1";
            } else  if ($action == "inact") { //Inctive Action   
                User::whereIn('id', array_values($data['id']))->update(array("e_status" =>"0"));
                echo "1";
                
            }
        }
    }
    public function anyExport($parameters = null)
    {
        Excel::create('user_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('USER'  , function($sheet) use ($parameters)
            {
                $query = User::query();
                
                if($parameters != null && trim($parameters) != '""'){             
        		    $reqestData = json_decode($parameters, true);
                    if(isset($reqestData)){
                        foreach($reqestData as $key => $val) { if($key != 'search_fields'){ $$key = trim($val); } }   
                    }

                    $sort = 'id';
                    $order = 'ASC';

                    if(isset($order_field) && $order_field!=""){
                        $sort = $order_field;
                    }
                    if(isset($sort_order) && $sort_order!=""){
                        $order = $sort_order;
                    }
                    
                    if(isset($name) && $name!=""){
            			$query = $query->where('fname', 'LIKE',"%".$name."%")->orWhere('lname', 'LIKE',"%".$name."%");
            		}
                    if(isset($email) && $email!=""){
                        $query = $query->where('email', 'LIKE',"%".$email."%");
                    }
            		if(isset($e_status) && $e_status!=""){
            			$query = $query->where('e_status', '=',$e_status);
            		}
                    if(isset($e_type) && $e_type!=""){
            			$query = $query->where('e_type', '=',$e_type);
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');    
                }
                        
                $query->select('id','fname','lname','email', 'e_type', 'v_company_name','v_title','v_industry','v_city','e_status','created_at','updated_at');
        		$records = $query->get()->toArray();
               
                $field['no'] = 'Sr.No';
                $field['v_name'] = 'First Name';
                $field['v_message'] = 'Last Name';
                $field['email'] = 'Email';
                $field['e_type'] = 'User Type';
                $field['v_company_name'] = 'Company Name';
                $field['v_title'] = 'Title';
                $field['v_industry'] = 'Industry';
                $field['v_city'] = 'City';
                $field['e_status'] = 'Status';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';
                                       
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:I1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  40,'C'     =>  40,'D'     =>  40,'E'     =>  40,'F'     =>  30,'G'     =>  30,'H'     =>  30,'I'     =>  30,'J'=>10, 'K'=>20, 'L'=>20));
                
                $sheet->cells('A1:I1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('Users'));
                
                $sheet->cells('A2:I2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(2,$field);
                
                $intCount = 3;
                $srNo=1;
                $city = City::lists('v_name','id');
                foreach($records as $val){
                    $val['id'] = $srNo;
                    if($val['e_status'] == '1'){
                        $val['e_status'] = 'Active';
                    }else{
                        $val['e_status'] = 'Inactive';
                    }
                    $sheet->row($intCount, $val);
                    $intCount++;
                }
            });
        
        })->download('xlsx');
    }
    
    public function postCheckEmailExist(){
        $data = Input::get();
        
        if(!empty($data) && $data['email'] != ''){
            $user_data = new User;
            $user_data = $user_data->where('email','=',$data['email']);
            if(isset($data['id']) && $data['id'] != ''){
                $user_data = $user_data->where('id','!=',$data['id']);
            }                        
            $user_data = $user_data->get()->toArray();
            
            if(!empty($user_data)){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }
    
    public function postAdd()
	{
        $data = Input::get();
        if(!empty($data)){
            
            $user = new User;
            $user->fname = $data['fname'];
            $user->lname = $data['lname'];
            $user->email = $data['email'];
            $user->password = Hash::make($data['password']);
            $user->e_type = $data['e_type'];
            
            if(!isset($data['v_company_name'])) $data['v_company_name'] = '';
            $user->v_company_name = $data['v_company_name'];
            
            if(!isset($data['v_title'])) $data['v_title'] = '';
            $user->v_title = $data['v_title'];
            
            if(!isset($data['v_industry'])) $data['v_industry'] = '';
            $user->v_industry = $data['v_industry'];
            
            if(!isset($data['v_city'])) $data['v_city'] = '';
            $user->v_city = $data['v_city'];
            $user->e_status = $data['e_status'];
            if($user->save())
            {
                $loginLink = '';
                if($user->e_type == 'Admin'){
                  $loginLink = ADMIN_URL;  
                } else {
                  $loginLink = SITE_URL;  
                }
                $objEmailTemplate = EmailTemplate::find(3);
                $emailSubject = $objEmailTemplate['v_template_subject']; 
                $strTemplate = $objEmailTemplate['t_email_content'];
                $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                $strTemplate = str_replace('[SITE_NAME]',SITE_NAME,$strTemplate);
                $strTemplate = str_replace('[LINK]',$loginLink,$strTemplate);
                $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                $strTemplate = str_replace('[USERNAME]',$user->fname." ".$user->lname,$strTemplate);
                $strTemplate = str_replace('[EMAIL_ADDRESS]',$user->email,$strTemplate);
                $strTemplate = str_replace('[PASSWORD]',$data['password'],$strTemplate);

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

                // mail sent to user
                Mail::queue('emails.auth.generate-email-template', array('strTemplate'=>$strTemplate), function($message) use ($user,$emailSubject)
                {
                    $message->to($user->email, $user->fname." ".$user->lname);
                    $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                    $message->subject($emailSubject);                        
                });    
            } else {
                return 'FALSE';
            }             
            
        } else {
            $allCites = City::lists('id', 'v_name');
            $industryDataArray = BaseController::all_industries();
            $results = [
                    'cities' => $allCites,
                    'industries' => $industryDataArray
                ];
    	    return json_encode($results);
        }
    }
    
    public function postEdit()
	{
        $data = Input::get();
        
        if(!empty($data)){
            $user = User::find($data['id']);
            $oldEmail = $user->email;
            $oldPassword = $user->password;
            $user->fname = $data['fname'];
            $user->lname = $data['lname'];
            $user->email = $data['email'];
            if(isset($data['password']) && $data['password'] != '' && $data['password'] == $data['cpassword']){
                $user->password = Hash::make($data['password']);    
            }
            $user->e_type = $data['e_type'];
            
            if(!isset($data['v_company_name'])) $data['v_company_name'] = '';
            $user->v_company_name = $data['v_company_name'];
            
            if(!isset($data['v_title'])) $data['v_title'] = '';
            $user->v_title = $data['v_title'];
            
            if(!isset($data['v_industry'])) $data['v_industry'] = '';
            $user->v_industry = $data['v_industry'];
            
            if(!isset($data['v_city'])) $data['v_city'] = '';
            $user->v_city = $data['v_city'];
            
            $user->e_status = $data['e_status'];            
            if($user->save()){
                if($oldPassword != $user->password )
                {
                    $loginLink = '';
                    if($user->e_type == 'Admin'){
                      $loginLink = ADMIN_URL;  
                    } else {
                      $loginLink = SITE_URL;  
                    }
                    $objEmailTemplate = EmailTemplate::find(4);
                    $emailSubject = $objEmailTemplate['v_template_subject']; 
                    $strTemplate = $objEmailTemplate['t_email_content'];
                    $strTemplate = str_replace('[SITE_URL]',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[SITE_NAME]',SITE_NAME,$strTemplate);
                    $strTemplate = str_replace('[LINK]',$loginLink,$strTemplate);
                    $strTemplate = str_replace('../',SITE_URL,$strTemplate);
                    $strTemplate = str_replace('[USERNAME]',$user->fname." ".$user->lname,$strTemplate);
                    $strTemplate = str_replace('[EMAIL_ADDRESS]',$user->email,$strTemplate);
                    $strTemplate = str_replace('[PASSWORD]',$data['password'],$strTemplate);
    
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
    
                    // mail sent to user when user or Email id is Updated 
                    Mail::queue('emails.auth.generate-email-template', array('strTemplate'=>$strTemplate), function($message) use ($user,$emailSubject)
                    {
                        $message->to($user->email, $user->fname." ".$user->lname);
                        $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                        $message->subject($emailSubject);                        
                    });
                
                } else {
                   return 'TRUE'; 
                }
            } else {
                return 'FALSE';
            }             
        } else {
            $allCites = City::lists('id', 'v_name');
            $industryDataArray = BaseController::all_industries();
            $results = [
                    'cities' => $allCites,
                    'industries' => $industryDataArray
                ];
    	    return json_encode($results);
        }
    }
    
    public function postChangeStatus(){
        $data = Input::get();
        if(!empty($data)){
            
            $user = User::find($data['id']);

            $user->e_status = $data['status'];
            
            if($user->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
            
            
        }
        return "TRUE";
    }
    public function anyUserDelete()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $user = User::find($data['id']);
            $user->email = time().'-'.$user->email;
            $user->save();
            if($user->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
    
    
    public function postUploadForIe(){
        return ((isset($_FILES["v_img"]) and $_FILES["v_img"]["error"] == 0) ? 'data:image/' . pathinfo($_FILES["v_img"]["name"], PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($_FILES["v_img"]["tmp_name"])):"0");
    } 
}
?>