<?php
class CitiesController extends BaseController {

    public function getData($slug){
        $unit_assets = UnitStatus::get()->toArray();
        $citiesData = City::where('v_slug',$slug)->where('i_status', '1')->with('building')->with('city_asset')->first();
        // print_r($citiesData->toArray());
        //$buildingData = $skyline_buildings = $citiesData->toArray();
        $buildingData = $skyline_buildings = $citiesData;

        /*New Aggegate function start*/

        $aggregate_statistics[0] = ['value' => 0, 'title' => 'RBA', 'sub_title' => '(s.f.)', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
        $aggregate_statistics[1] = ['value' => 0, 'title' => 'AVERAGE FLOOR PLATE', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
        $aggregate_statistics[2] = ['value' => 0, 'title' => 'TOTAL VACANCY', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
        $aggregate_statistics[3] = ['value' => 0.0, 'title' => 'TOTAL VACANCY', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
        $aggregate_statistics[4] = ['value' => 0, 'title' => 'DIRECT VACANCY', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
        $aggregate_statistics[5] = ['value' => 0.0, 'title' => 'DIRECT VACANCY', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
        $aggregate_statistics[6] = ['value' => 0, 'title' => 'OCCUPANCY', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
        $aggregate_statistics[7] = ['value' => 0.0, 'title' => 'OCCUPANCY RATE', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
        $aggregate_statistics[8] = ['value' => 0.0, 'title' => 'TOTAL LEASED', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
        $aggregate_statistics[9] = ['value' => 0, 'title' => 'TOTAL LEASED', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
        $aggregate_statistics[10] = ['value' => 0, 'title' => 'DIRECT AVERAGE ASKING RENT', 'sub_title' => '(p.s.f.)', 'prefix' => '$', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
        $aggregate_statistics[11] = ['value' => 0, 'title' => 'TROPHY RENTS', 'sub_title' => 'DIRECT AVERAGE ASKING RENT (p.s.f.)', 'prefix' => '$', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];

        $average_floor_plate = $direct_average_asking_rent = $direct_average_asking_rent_trophy_psf = $total_direct_vacancy = $total_trophy_direct_vacancy = $occupied = 0;
        $no_of_buildings = count($skyline_buildings->building);

        if($skyline_buildings){
            //print_r($skyline_buildings['building']);exit;
            $img1Path = WWW_ROOT.BUILDING_PLAIN_IMAGE_PATH;
            //$img2Path = WWW_ROOT.BUILDING_FLOOR_IMAGE_PATH;
            foreach ($skyline_buildings->building as $key => $value) {
                list($width1) = @getimagesize($img1Path.$value->v_plain_image);
                //list($width2, $height2) = getimagesize($img2Path.$value->v_plain_image);
                $skyline_buildings->building[$key]->v_plain_image_w = $width1;
                //$skyline_buildings->building[$key]->v_plain_image_h = $height1;
                //$skyline_buildings->building[$key]->v_global_image_w = $width2;
                //$skyline_buildings->building[$key]->v_global_image_h = $height2;
                $aggregate_statistics[0]['value'] += $value->i_rba;
                $average_floor_plate +=  $value->i_avg_floor_plate;
                $aggregate_statistics[2]['value'] +=  $value->i_total_vacant_sf;
                $aggregate_statistics[4]['value'] +=  $value->i_direct_vacant_sf;
                $occupied +=  $value->i_occupied;
                //echo $value->i_leased.' * '.$value->i_rba .'/ 100 ==='.($value->i_leased * $value->i_rba) / 100 .'<br>';

                $aggregate_statistics[9]['value'] +=  ($value->i_leased * $value->i_rba) / 100;
                $direct_average_asking_rent += ((int)str_replace("$","",$value->d_rent)* $value->i_direct_vacant_sf);
                $total_direct_vacancy += $value->i_direct_vacant_sf;

                if($value->e_class == 'Trophy') {
                        $direct_average_asking_rent_trophy_psf += ((int)str_replace("$","",$value->d_rent )* $value->i_direct_vacant_sf);

                        $total_trophy_direct_vacancy += $value->i_direct_vacant_sf;
                }
            }

            $total_direct_vacancy=($total_direct_vacancy >0)?$total_direct_vacancy:1;
            $aggregate_statistics[0]['value']=($aggregate_statistics[0]['value'] > 0)?$aggregate_statistics[0]['value']:1;

            $aggregate_statistics[6]['value'] =  $aggregate_statistics[0]['value'] - $aggregate_statistics[2]['value'] ;
            $aggregate_statistics[10]['value'] = round($direct_average_asking_rent / $total_direct_vacancy, 2);
            $aggregate_statistics[11]['value'] = $direct_average_asking_rent_trophy_psf > 0 && $total_trophy_direct_vacancy > 0 ? round(($direct_average_asking_rent_trophy_psf / $total_trophy_direct_vacancy), 2) : 0;
            $aggregate_statistics[1]['value'] =  $average_floor_plate > 0 && $no_of_buildings > 0 ? round($average_floor_plate / $no_of_buildings, 2) : 0;

            $aggregate_statistics[3]['value'] = number_format(($aggregate_statistics[2]['value'] / $aggregate_statistics[0]['value']) * 100, 1);
            $aggregate_statistics[5]['value'] = number_format(($aggregate_statistics[4]['value'] / $aggregate_statistics[0]['value']) * 100, 1);

            $aggregate_statistics[7]['value'] = number_format(($aggregate_statistics[6]['value'] / $aggregate_statistics[0]['value']) * 100, 1);

            $aggregate_statistics[8]['value'] = number_format(($aggregate_statistics[9]['value'] / $aggregate_statistics[0]['value']) * 100, 1);
            $aggregate_statistics[9]['value'] = round($aggregate_statistics[9]['value']);
        }

        foreach($aggregate_statistics as $index => $aggregate_statistic) {

            if(trim($aggregate_statistic['postfix']) != '%'){
                if($index == 11 || $index == 10) {
                    $aggregate_statistics[$index]['value'] = number_format($aggregate_statistic['value'], 2);
                } else {
                    $aggregate_statistics[$index]['value'] = number_format($aggregate_statistic['value']);
                }
            }

            if(strlen((string)str_replace(',', '', str_replace('.', '',$aggregate_statistic['value']))) > 5) {
                $aggregate_statistics[$index]['class'] = 'h2-small';
            } else {
                $aggregate_statistics[$index]['class'] = 'h2-big';
            }

            if($aggregate_statistics[$index]['class'] == 'h2-small') {
                $strLength = strlen((string)str_replace(',', '', str_replace('.', '',$aggregate_statistic['value'])));
                if($strLength >= 6) {
                    $aggregate_statistics[$index]['font_size'] = round((6 * 32) / $strLength);
                }
            }
        }


        //pr($aggregate_statistics);exit;
        /*New Aggegate function finish*/


        //$aggregate_statistics = BaseController::aggregateCal($buildingData['building']);

        if (Auth::guest()->check()){
            $userData = Auth::guest()->get();
        } else if(Auth::user()->check()){
            $userData = Auth::user()->get();
        } else{
            $userData  = '';
        }

        $userCustomSkylines=[];

        if(isset($userData) && $userData!="" &&  $userData->id){
            $userCustomSkylines=Skyline::where('i_user_id',$userData->id)->orderBy('updated_at','DESC')->select('i_user_id','v_title','v_slug','id')->get()->toArray();
        }

        $citiesData = $citiesData->toArray();
        //$citiesData['v_name'] = htmlentities($citiesData['v_name']);
        if(!empty($citiesData)){
            $results = [
                'unit_assets' => $unit_assets,
                'cities' => $citiesData,
                'userCustomSkylines' => $userCustomSkylines,
                'aggregate' => $aggregate_statistics
        	];
            return json_encode($results);
        } else {
            return Response::make('Unauthorized', 401);
        }
    }

    public function getCitySlug($id){
        if($id >= 0){
            $city_Slug = City::where('id',$id)->where('i_status','1')->select('v_slug')->first()->toArray();
            return $city_Slug['v_slug'];
        } else {
            return "error";
        }
    }

    /*For Add new building to skyline*/
    public function postAddUserSkyline(){
        $data=Input::all();
        $response= new stdClass();
        if($data){
           $checkSkylineExists=SkylineBuilding::where('i_skyline_id',$data['skylineID'])->where('i_building_id',$data['addBuildingID'])->first();

           if(!$checkSkylineExists){
                if (Auth::guest()->check()){
                    $userID=Auth::guest()->get()->id;
                } else if(Auth::user()->check()){
                    $userID=Auth::user()->get()->id;
                }
                $skylineData=new SkylineBuilding;
                $skylineData->i_skyline_id=$data['skylineID'];
                $skylineData->i_building_id=$data['addBuildingID'];
                if($skylineData->save()){
                    $userSkyline = Skyline::where('i_user_id', $userID)->orderBy('updated_at','DESC')->get();
                    $userSkyline = $userSkyline->toarray();
                    $skyline=Skyline::where('id',$data['skylineID'])->first();
                    $currentSkyline = self::in_array_r($skyline->v_slug, $userSkyline);
                    $allSkylineExcludeCurrent=self::in_array_r($skyline->v_slug, $userSkyline,false,true);

                    $response->Data= [
                        'userSkyline'=>$userSkyline,
                        'currentSkyline'=>$currentSkyline,
                        'otherSkyline'=>$allSkylineExcludeCurrent,
                    ];

                    $response->IsSuccess=true;
                    $response->Message="Building added into your selected skyline.";
                }
           }
           else{
                $response->IsSuccess=false;
                $response->Message="This Building already exists in your selected skyline.";
           }

        }
        else{
            $response->IsSuccess=false;
        }
        return json_encode($response);
    }

    public function checkCustomSkylineSlugExists($slug, $i=1){
        $slugreturn = new stdclass();
        $new_v_slug = $slug.'-'.$i;
        $slugExists = Skyline::where('v_slug', $new_v_slug)->first();
        if(!$slugExists){
            $slugreturn->slug = $new_v_slug;
            $slugreturn->i_value = $i;
        }
        else{
            $i++;
            $slugreturn = self::checkCustomSkylineSlugExists($slug,$i);
        }

        return $slugreturn;
    }

    /*Search inside array*/
    public function in_array_r($needle, $haystack, $strict = false,$removeCurEle=false) {
        if(!$removeCurEle){
            foreach ($haystack as $item) {
                if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && self::in_array_r($needle, $item, $strict))) {
                    return $item;
                }
            }
            return false;
        }else{
            foreach ($haystack as $key=>$item) {
                if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && self::in_array_r($needle, $item, $strict))) {
                    unset( $haystack[ $key ] );
                }
            }
            return array_values($haystack);
        }
    }

    /*For New custon skyline*/
    public function postUserCustomSkyline() {
        $response= new stdclass();

        $data = Input::all();
        $v_slug = strtolower(str_replace(array(':', '\'', '\\','`', ' ', '.','#','@','$','%','^','&','*','(',')','+','|',"[",']','{','}',',','?','!','~',),"-",trim($data['v_title'])));
        $v_slug = preg_replace('/-{2,}/','-', trim($v_slug));
        $v_slug = rtrim($v_slug, '-');

        if (Auth::guest()->check()){
            $userID=Auth::guest()->get()->id;
        } else if(Auth::user()->check()){
            $userID=Auth::user()->get()->id;
        }
        $slugExists = Skyline::where('v_slug', $v_slug)->first();
        $skyline=new Skyline;

        if($slugExists){
            $result=self::checkCustomSkylineSlugExists($v_slug);
            $skyline->v_slug=$result->slug;
            $skyline->v_title=$data['v_title'].' '.$result->i_value;
        }else{
            $skyline->v_slug = $v_slug;
            $skyline->v_title=$data['v_title'];
        }

        $skyline->v_long_desc = array_key_exists ('v_short_desc',$data)?$data['v_short_desc']:null;
        $skyline->i_user_id=$userID;

        if($skyline->save()){
            if(isset($data['building_id']) && $data['building_id'] !='') {
                $skylineData = new SkylineBuilding;
                $skylineData->i_skyline_id = $skyline->id;
                $skylineData->i_building_id = $data['building_id'];
                $skylineData->save();
            }

            if (Auth::guest()->check()){
                $userData = Auth::guest()->get();
            } else if(Auth::user()->check()){
                $userData = Auth::user()->get();
            }
            $userCustomSkylines=[];
            $userShareCustomSkylines = SkylineShareTo::where('v_email_id',$userData->email)->lists('i_skyline_id');
            if($userShareCustomSkylines){
                $userCustomSkylines = Skyline::where(function($query) use ($userShareCustomSkylines,$userData){
                    $query = $query->whereIn('id', $userShareCustomSkylines)
                      ->orWhere('i_user_id', '=', $userData->id);
               })->orderBy('updated_at','DESC')->select('i_user_id','v_title','v_slug','id')->get();
            }else{
                $userCustomSkylines = Skyline::where('i_user_id',$userData->id)->orderBy('updated_at','DESC')->select('i_user_id','v_title','v_slug','id')->get();
            }
            //$userSkyline = Skyline::where('i_user_id', $userID)->orderBy('updated_at','DESC')->get();
            $userSkyline = $userCustomSkylines->toarray();
            $currentSkyline = self::in_array_r($skyline->v_slug, $userSkyline);
            $allSkylineExcludeCurrent=self::in_array_r($skyline->v_slug, $userSkyline,false,true);
            //$currentSkyline = Skyline::where('v_slug',$v_slug)->first();
        }

        if(!empty($userSkyline)) {
            $response->Message="Your new skyline has been created.";
            $response->IsSuccess=true;
            $response->Data= [
                'userSkyline'=>$userSkyline,
                'currentSkyline'=>$currentSkyline,
                'otherSkyline'=>$allSkylineExcludeCurrent,
            ];
        }else{
            $response->Message="Try after some time.";
            $response->IsSuccess=false;
        }

        return json_encode($response);
    }

    /*For download pdf*/
    public function downloadPdf($file=""){

        if($file != ""){
            $fileName = WWW_ROOT.CITY_PDF_FILE_PATH.$file;
            if(file_exists($fileName)){
                $ctype = "application/pdf";
                header("Pragma: public");
                header("Expires: 0");
                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                header("Cache-Control: private",false);
                header("Content-Type: $ctype");
                header("Content-Disposition: attachment; filename=\"".basename($fileName)."\";");
                header("Content-Transfer-Encoding: binary");
                header("Content-Length: ".@filesize($fileName));
                @readfile("$fileName") or die("File not found.");
                exit;
            }
        }
    }

    public function postCustomSkylineHeader(){
        $response= new stdclass();

        $params = Input::All();
        $data = array();
        parse_str($params['data'], $data);

        if(Auth::guest()->check()){
            $userData = Auth::guest()->get();
        } else if(Auth::user()->check()){
            $userData = Auth::user()->get();
        }

        if(isset($userData) && count($params) > 0) {
            $v_slug = strtolower(str_replace(array(':', '\'', '\\','`', ' ', '.','#','@','$','%','^','&','*','(',')','+','|',"[",']','{','}',',','?','!','~',),"-",trim($data['v_title'])));
            $v_slug = preg_replace('/-{2,}/','-', trim($v_slug));
            $v_slug = rtrim($v_slug, '-');

            $slugExists = Skyline::where('v_slug', $v_slug)->first();
            $skyline=new Skyline;

            if($slugExists){
                $result=self::checkCustomSkylineSlugExists($v_slug);
                $skyline->v_slug=$result->slug;
                $skyline->v_title=$data['v_title'].' '.$result->i_value;
            } else {
                $skyline->v_slug=$v_slug;
                $skyline->v_title=$data['v_title'];
            }
            $skyline->v_long_desc = array_key_exists ('v_long_desc',$data)?$data['v_long_desc']:null;
            $skyline->i_user_id = $userData->id;

            if($skyline->save()){
                $userCustomSkylines=[];
                $userShareCustomSkylines = SkylineShareTo::where('v_email_id',$userData->email)->lists('i_skyline_id');
                if($userShareCustomSkylines){
                    $userCustomSkylines = Skyline::where(function($query) use ($userShareCustomSkylines,$userData){
                        $query = $query->whereIn('id', $userShareCustomSkylines)
                             ->orWhere('i_user_id', '=', $userData->id);
                   })->orderBy('updated_at','DESC')->select('i_user_id','v_title','v_slug','id')->get();
                } else {
                    $userCustomSkylines = Skyline::where('i_user_id',$userData->id)->orderBy('updated_at','DESC')->select('i_user_id','v_title','v_slug','id')->get();
                }
                $userSkyline = $userCustomSkylines->toarray();
                $currentSkyline = self::in_array_r($skyline->v_slug, $userSkyline);
                $allSkylineExcludeCurrent=self::in_array_r($skyline->v_slug, $userSkyline,false,true);
            }

            if(!empty($userSkyline)) {
                $response->Message = "Your new skyline has been created";
                $response->IsSuccess=true;
                $response->Data= [
                    'userSkyline'=>$userSkyline,
                    'currentSkyline'=>$currentSkyline,
                    'otherSkyline'=>$allSkylineExcludeCurrent,
                    'current_user_id' => $userData->id
                ];
            } else {
                $response->Message = "Try after some time";
                $response->IsSuccess=false;
            }

            return json_encode($response);
        }
    }
}
