<?php
class HomeController extends BaseController {
    
    public function data(){
        $citiesData = City::where('i_status','1')->orderBy('v_name')->lists('v_name', 'id');
           
        $industryDataArray = BaseController::all_industries();
        
        return ['industryDataArray' => $industryDataArray, 'cities' => $citiesData];
    }
    
    public function index() {
        $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
    $pageData = $pageData->groupBy('e_page_type');
        if($pageData) { $pageData = $pageData->toArray(); }
                
        $countriesData = City::select('id', 'v_name', 'v_slug')->where('i_status', '1')->orderBy('v_name')->get()->toArray();                
        $page = DB::table('pages')->where('id', '70')->first();
        if (Auth::guest()->check()){
            $userData = Auth::guest()->get();
        } else if(Auth::user()->check()){
            $userData = Auth::user()->get();
        } else{
            $userData  = '';
        }
        
        return View::make('index')->with(array('content'=>$page, 'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'false','userData'=> $userData));
	}
    
    public function home_page_data(){
        if(Auth::guest()->check() || Auth::user()->check() ){
            $homePageContentBoxes=HomePageContentBoxes::where('e_type','LoggedIn')->orderBy('v_box_no','asc')->get();
        }
        else{
            $homePageContentBoxes=HomePageContentBoxes::where('e_type','LoggedOut')->orderBy('v_box_no','asc')->get();   
        }
        
        $formattedCityArray = array();
        $industryDataArray = BaseController::all_industries();
        $national_assets = DB::select( DB::raw("SELECT * FROM `national_assets` where deleted_at = '0000-00-00 00:00:00' order by i_display_order,  i_column ASC ") ); //NationalAsset::orderBy(DB::raw('i_display_order, i_column','ASC'))->get()->toArray();
        $homePageBanners=HomePageBanner::where('e_status','1')->orderBy('i_order','ASC')->get();
        
        $homePageImageRotator=HomePageImageRotation::where('e_status','1')->get();
        $citiesData = City::where('i_status','1')->orderBy('v_name')->get()->toArray();
        foreach($citiesData as $key => $val){
            $formattedCityArray[$val['id']] = $val['v_name']; 
        }
        $settingsData = Setting::get()->toArray();
        $page =DB::table('pages')->where('id', '70')->first();
        $national_assets_arr = array(); 
        foreach($national_assets as $key => $val) {
            $val = (array) $val;
            $val['db_id'] = $val['id'];
            $national_assets_arr[] = $val;
        }
        $results = [
            'home_page_banners'=>$homePageBanners,
            'home_page_content_boxes'=>$homePageContentBoxes,
            'home_page_image_rotator'=>$homePageImageRotator,
            'national_assets'=>$national_assets_arr,
            'cities'=>$citiesData,
            'formattedCityArray'=>$formattedCityArray,
            'cms'=>$page,
            'industryDataArray'=>$industryDataArray,
            'settingsData'=>$settingsData
    	];
        return json_encode($results);
    }
    
    public function downloads($filename) {
        //Read the png image
        $path = WWW_ROOT.BUILDING_PLAIN_IMAGE_PATH.$filename;
        //$image = file_get_contents($path);         
        //$image = substr_replace($image, pack("cnn", 1, 300, 300), 13, 5);    
        
        $input = imagecreatefrompng($path);
        $width=imagesx($input);
        $height=imagesy($input);
        $output = imagecreatetruecolor($width, $height);
        $white = imagecolorallocate($output,  255, 255, 255);
        imagefilledrectangle($output, 0, 0, $width, $height, $white);
        imagecopy($output, $input, 0, 0, 0, 0, $width, $height);                  

        ob_start();
        imagejpeg($output);
        $image =  ob_get_contents();
        //Converting Image DPI to 300DPI                
        $image = substr_replace($image, pack("cnn", 1, 300, 300), 13, 5);             
        ob_end_clean();     
        //echo "<img height='350px' src='data:image/jpeg;base64,".base64_encode($image)."' />"; exit; 
        header("Content-type: image/jpeg");    header('Content-Disposition: attachment; filename="'.str_replace(".png",".jpg",basename($path)).'"');
        //header("Content-type: image/png");    header('Content-Disposition: attachment; filename="'.basename($path).'"');         
        echo $image;exit;
    }
    
    //national asseets    
    public function share1($id) { 
        if(strpos(URL::previous(), rtrim(SITE_URL,"/")) === false) {
            echo '<META http-equiv="refresh" content="0;URL='.SITE_URL.'">'; exit;
        } else {            
   	        $national_asset = NationalAsset::find($id)->toArray();
            return View::make('share')->with(array('content'=>$national_asset['t_content'], 'page_title'=>"Home Page - ".SITE_NAME, 'image_url'=>SITE_URL.NATIONAL_ASSET_IMAGE_PATH.$national_asset['v_thumbnail_url']));
        }
    }
    
    //city asseets    
    public function share2($id) { 
   	    if(strpos(URL::previous(), rtrim(SITE_URL,"/")) === false) {
            $city_asset = CityAsset::find($id)->toArray();
            $city = City::find($city_asset['i_city_id'])->toArray(); 
            echo '<META http-equiv="refresh" content="0;URL='.SITE_URL.'city/'.$city['v_slug'].'">'; exit;
        } else { 
            $city_asset = CityAsset::find($id)->toArray();
            $city = City::find($city_asset['i_city_id'])->toArray(); 
            if($city_asset['v_large_image'] != '') {
                $image_url = SITE_URL.CITY_ASSET_IMAGE_PATH.$city_asset['v_large_image'];
            } else {
                $image_url = SITE_URL.CITY_ASSET_THUMB_IMAGE_PATH.$city_asset['v_thumbnail_url'];
            }                
            return View::make('share')->with(array('content'=>$city_asset['t_content'],'page_title'=>$city['v_skyline_title']." | ".SITE_NAME,'image_url'=>$image_url));
        }
    }
    
    public function contact(){
        $data = Input::get();
        if($data['contact']['fname'] != ''){
            return 'BOT';
        } else {
            if(isset($data['contact'])){
                $setting_data = Setting::find(1)->toArray();                
                $mail_data = EmailTemplate::find(2)->toArray();
                
                if($mail_data != ''){
                    /*$print_version = 'No';
                    if(isset($data['contact']['print_version'])){
                        $print_version = 'Yes';
                    }*/
                    $search_array = array('[SITE_NAME]','[PAGE_URL]','[MARKET]','[NAME]','[TITLE]','[EMAIL]','[PHONE]','[COMPANY]','[INDUSTRY]','[TEMPLATE_TITLE]');
                    $replace_array = array('JLL',$data['contact']['page_url'],$data['contact']['market'],$data['contact']['contact_name'],$data['contact']['title'],$data['contact']['email'],$data['contact']['phone'],$data['contact']['company'],$data['contact']['industry'], $mail_data['v_template_title']);
                    
                    $result = str_replace($search_array, $replace_array, $mail_data['t_email_content']);
                    
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
                    
                    Mail::queue('emails.template', array('result' => $result), function ($message) use ($mail_data, $setting_data) {
                        $message->to($setting_data['admin_email']);
                        $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                        $message->subject($mail_data['v_template_subject']); 
                    });                    
                }
            }
        }
    }
}
