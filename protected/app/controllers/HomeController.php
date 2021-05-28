<?php
class HomeController extends BaseController {

    public function data(){
        $citiesData = City::where('i_status','1')->orderBy('v_name','asc')->lists('v_name', 'v_name');
        $industryDataArray = BaseController::all_industries();
        return ['industryDataArray' => $industryDataArray, 'cities' => $citiesData];
    }

    public function index() {
        $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_menu','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
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
        
        $userCustomSkylines = [];

        if(isset($userData) && $userData!="" && $userData->id){
            $userShareCustomSkylines = SkylineShareTo::where('v_email_id',$userData->email)->lists('i_skyline_id');
            if($userShareCustomSkylines){
                $userCustomSkylines = Skyline::where(function($query) use ($userShareCustomSkylines,$userData){
                    $query = $query->whereIn('id', $userShareCustomSkylines)
                      ->orWhere('i_user_id', '=', $userData->id);
               })->orderBy('updated_at','DESC')->select('i_user_id','v_title','v_slug','id')->get()->toArray();
            } else {
                $userCustomSkylines = Skyline::where('i_user_id',$userData->id)->orderBy('updated_at','DESC')->select('v_title','v_slug')->get()->toArray();
            }
        }        
        return View::make('index')->with(array('content'=>$page, 'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'false','userData'=> $userData,'userCustomSkylines'=>$userCustomSkylines));
	}

    public function home_page_data(){
        if(Auth::guest()->check() || Auth::user()->check() ){
            $homePageContentBoxes=HomePageContentBoxes::where('e_type','LoggedIn')->where('e_status','1')->orderBy('v_box_no','asc')->get();
        }
        else{
            $homePageContentBoxes=HomePageContentBoxes::where('e_type','LoggedOut')->where('e_status','1')->orderBy('v_box_no','asc')->get();
        }

        $formattedCityArray = array();
        $industryDataArray = BaseController::all_industries();
        $national_assets = DB::select( DB::raw("SELECT * FROM `national_assets` where deleted_at = '0000-00-00 00:00:00' order by i_display_order,  i_column ASC ") ); //NationalAsset::orderBy(DB::raw('i_display_order, i_column','ASC'))->get()->toArray();
        $homePageBanners=HomePageBanner::where('e_status','1')->orderBy('i_order','ASC')->get();

        $homePageImageRotator=HomePageImageRotation::where('e_status','1')->orderBy('i_order','ASC')->get();
        $citiesData = City::where('i_status','1')->orderBy('v_name')->get()->toArray();
        foreach($citiesData as $key => $val){
            $formattedCityArray[$val['id']] = $val['v_name'];
        }

        $page =DB::table('pages')->where('id', '70')->first();
        $national_assets_arr = array();
        foreach($national_assets as $key => $val) {
            $val = (array) $val;
            $val['db_id'] = $val['id'];
            $national_assets_arr[] = $val;
        }

        /** Instagram Photos*/
        $settingsData = Setting::first();
        $tag = str_replace("#","",$settingsData->v_instagram_hashtag);
        $client_id = $settingsData->v_instagram_client_id;
        $access_token = $settingsData->v_instagram_access_token;
        $url = 'https://api.instagram.com/v1/tags/'.$tag.'/media/recent?count=6&client_id='.$client_id.'&access_token='.$access_token;
        $instagramImages=[];
        $hashTag=str_replace("#","",$settingsData->v_instagram_hashtag);
        if(isset($settingsData->d_instagram_last_request)){
            $lastRequestTime = $settingsData->d_instagram_last_request;    
        }                
        $timestamp1 = strtotime($lastRequestTime);
        $timestamp2 = time();
        $diff =  abs($timestamp1 - $timestamp2) / 60;
        if($diff > 1){
            $inst_stream = $this->callInstagram($url);
            $results = json_decode($inst_stream, true);
            if(isset($results['data'])){
                foreach($results['data'] as $item){
                    $image_link = '';
                    if(isset($item['images']['standard_resolution']['url']) && $item['images']['standard_resolution']['url'] != '')
                    {
                        $image_link = $item['images']['standard_resolution']['url'];
                        $instagramImages[] = $image_link;
                    }
                }
            }
            if(count($instagramImages) > 0){
                $instagramImages = array_reverse($instagramImages);
                $settingsData->d_instagram_last_request = date('Y-m-d H:i:s');
                $settingsData->v_instagram_api_responce = implode('||',$instagramImages);
                $settingsData->save();
            }
        } else {
            $instagramImages = explode('||',$settingsData->v_instagram_api_responce);
        }
        /*User custom skylines*/
        if (Auth::guest()->check()){
            $userData = Auth::guest()->get();
        } else if(Auth::user()->check()){
            $userData = Auth::user()->get();

        } else{
            $userData  = '';
        }
        $userCustomSkylines=[];

        if(isset($userData) && $userData!="" &&  $userData->id){
            $userCustomSkylines=Skyline::where('i_user_id',$userData->id)->orderBy('updated_at','DESC')->select('v_title','v_slug')->get()->toArray();
        }
        $settings[0] = $settingsData->toArray();
        $results = [
            'home_page_banners'=>$homePageBanners,
            'home_page_content_boxes'=>$homePageContentBoxes,
            'home_page_image_rotator'=>$homePageImageRotator,
            'national_assets'=>$national_assets_arr,
            'cities'=>$citiesData,
            'formattedCityArray'=>$formattedCityArray,
            'cms'=>$page,
            'industryDataArray'=>$industryDataArray,
            'settingsData'=>$settings,
            'instagramImages'=>$instagramImages,
            'userCustomSkylines'=>$userCustomSkylines
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
                    $search_array = array('[SITE_URL]','[SITE_NAME]','[PAGE_URL]','[MARKET]','[NAME]','[TITLE]','[EMAIL]','[PHONE]','[COMPANY]','[INDUSTRY]','[TEMPLATE_TITLE]');
                    $replace_array = array(SITE_URL,'JLL',$data['contact']['page_url'],$data['contact']['market'],$data['contact']['contact_name'],$data['contact']['title'],$data['contact']['email'],$data['contact']['phone'],$data['contact']['company'],$data['contact']['industry'], $mail_data['v_template_title']);

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

    public function callInstagram($url)
    {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 2
        ));

        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}
