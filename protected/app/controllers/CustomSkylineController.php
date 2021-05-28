<?php
class CustomSkylineController extends BaseController
{
    public function getData($slug){
        $skyline = Skyline::where('v_slug', $slug)->with(['skyline_buildings' ,'notes'])->first();
        $skyline_buildings = SkylineBuilding::where('i_skyline_id', $skyline->id)->with('building')->whereHas('building', function(){ })->get();

        //$buildingIds =  $skyline->skyline_buildings;
        $buildingIds = array_map(function ($ar) {return $ar['i_building_id'];}, $skyline->skyline_buildings->toArray());
        $city_asset = CityAsset::where('i_city_id', '103')->first(); // for aggregate list height patch
        $highestFloorBuilding = Building::whereIn('buildings.id', $buildingIds)->join('cities',  'buildings.i_city_id', '=','cities.id')->select('buildings.id', 'buildings.i_city_id','cities.d_floor_height', 'cities.v_background_image_url')->orderBy('buildings.i_floor_number','desc')->first();
        /*pr($building->toArray());
        exit;     */
        $unit_assets = UnitStatus::get()->toArray();

        $citiesData=[];
        $citiesData = City::where('id', 103)->where('i_status','1')->with('city_asset')->first();
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
        $no_of_buildings = count($skyline_buildings);
        if($skyline_buildings){
            //$img1Path = WWW_ROOT.BUILDING_PLAIN_IMAGE_PATH;
            //$img2Path = WWW_ROOT.BUILDING_FLOOR_IMAGE_PATH;
            foreach ($skyline_buildings as $key => $value) {
                //list($width1) = getimagesize($img1Path.$value->v_plain_image);
                //list($width2) = getimagesize($img2Path.$value->v_plain_image);
                //$skyline_buildings->building[$key]->v_plain_image_w = $width1;
                //$skyline_buildings->building[$key]->v_global_image_w = $width2;
                $aggregate_statistics[0]['value'] += $value->building->i_rba;
                $average_floor_plate +=  $value->building->i_avg_floor_plate;
                $aggregate_statistics[2]['value'] += $value->building->i_total_vacant_sf;
                $aggregate_statistics[4]['value'] += $value->building->i_direct_vacant_sf;
                $occupied +=  $value->building->i_occupied;
                $aggregate_statistics[9]['value'] += ($value->building->i_leased * $value->building->i_rba) / 100;

                $direct_average_asking_rent += ((int)str_replace("$","",$value->building->d_rent) * $value->building->i_direct_vacant_sf);
                $total_direct_vacancy += $value->building->i_direct_vacant_sf;

                if($value->building->e_class == 'Trophy') {
                        $direct_average_asking_rent_trophy_psf += ((int)str_replace("$","",$value->building->d_rent) * $value->building->i_direct_vacant_sf);

                        $total_trophy_direct_vacancy += $value->building->i_direct_vacant_sf;
                }
            }

            $total_direct_vacancy=($total_direct_vacancy >0)?$total_direct_vacancy:1;
            //$aggregate_statistics[0]['value']=($aggregate_statistics[0]['value'] >= 0)?$aggregate_statistics[0]['value']:1;

            $aggregate_statistics[6]['value'] =  $aggregate_statistics[0]['value'] - $aggregate_statistics[2]['value'] ;
            $aggregate_statistics[10]['value'] = round($direct_average_asking_rent / $total_direct_vacancy, 2);
            $aggregate_statistics[11]['value'] = $direct_average_asking_rent_trophy_psf > 0 && $total_trophy_direct_vacancy >0 ? round(($direct_average_asking_rent_trophy_psf / $total_trophy_direct_vacancy), 2) : 0;

            $aggregate_statistics[1]['value'] =  $average_floor_plate > 0 && $no_of_buildings > 0 ? round($average_floor_plate / $no_of_buildings, 2) : 0;

$aggregate_statistics[3]['value'] = ($aggregate_statistics[0]['value'] > 0 ) ? (number_format(($aggregate_statistics[2]['value'] / $aggregate_statistics[0]['value']) * 100, 1)): '0.0';

            $aggregate_statistics[5]['value'] = ($aggregate_statistics[0]['value'] > 0 ) ? (number_format(($aggregate_statistics[4]['value'] / $aggregate_statistics[0]['value']) * 100, 1)) : '0.0';

            $aggregate_statistics[7]['value'] = ($aggregate_statistics[0]['value'] > 0 ) ? (number_format(($aggregate_statistics[6]['value'] / $aggregate_statistics[0]['value']) * 100, 1)) : '0.0';

            $aggregate_statistics[8]['value'] = ($aggregate_statistics[0]['value'] > 0 ) ? (number_format(($aggregate_statistics[9]['value'] / $aggregate_statistics[0]['value']) * 100, 1)): '0.0';
        }

        foreach($aggregate_statistics as $index => $aggregate_statistic) {
            if($aggregate_statistic['postfix'] != '%'){
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

        if(!empty($skyline)) {
            $results = [
                'highestFloorBuilding' => $highestFloorBuilding,
                'unit_assets'=>$unit_assets,
                'cities'=> $citiesData->toArray(),
                'skyline' => $skyline,
                'skyline_buildings' => $skyline_buildings,
                'aggregate_statistics' => $aggregate_statistics,
                'city_asset' => $city_asset,

        	];
            return json_encode($results);
        } else {
            return Response::make('Unauthorized', 401);
        }
    }

    public function postEditSkylineName() {
        $data = Input::all();
        if(isset($data['id']) && $data['id'] != '') {
            $skyline = [];
            if(Auth::guest()->check()){
                $skyline = Skyline::where('id', $data['id'])->where('i_user_id',  Auth::guest()->get()->id)->first();
            } else if(Auth::user()->check()){
                $skyline = Skyline::where('id', $data['id'])->where('i_user_id',  Auth::user()->get()->id)->first();
            }

            if(count($skyline) > 0) {
                $skyline_name = trim($data['v_title']);
                $check_skyline_title  = Skyline::where('v_title', $skyline_name)->where('id', '!=', $skyline->id)->first();

                if(count($check_skyline_title)) {
                    $skyline_name = $this->set_skyline_title($skyline_name, 1);
                }

                $skyline->v_title = $skyline_name;
                $skyline->save();
                return $skyline;
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }

    public function set_skyline_title($v_title, $no = 1) {
        $check_skyline_title  = Skyline::where('v_title', $v_title.' '.$no)->first();
        if(count($check_skyline_title) > 0) {
            return $this->set_skyline_title($v_title, $no + 1);
        } else {
            return $v_title.' '.$no;
        }
    }

    public function postDeleteBuilding() {
        if(Input::has('id') && Input::get('id') != '' && Input::has('building_id') && Input::get('building_id') != '') {
            $skyline_buildings = [];
            if(Auth::guest()->check() || Auth::user()->check()) {
                $skyline_buildings = SkylineBuilding::where('i_building_id', Input::get('building_id'))->where('i_skyline_id', Input::get('id'))->first();
            }
            if(count($skyline_buildings) > 0) {
                $skyline_buildings->delete();
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }

    public function postDeleteSkyline() {
        if(Input::has('id') && Input::get('id') != '') {
            $skyline = [];
            if(Auth::guest()->check()) {
                $skyline = Skyline::where('id', Input::get('id'))->where('i_user_id',  Auth::guest()->get()->id)->first();
            } else if(Auth::user()->check()) {
                $skyline = Skyline::where('id', Input::get('id'))->where('i_user_id',  Auth::user()->get()->id)->first();
            }

            if(count($skyline) > 0) {
                $skyline->v_slug = time().'-'.$skyline->v_slug;
                $skyline->save();
                $skyline->delete();
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }


    public function postEditSkylineDesc() {
        $data = Input::all();
        if(isset($data['id']) && $data['id'] != '') {
            $skyline = [];
            if(Auth::guest()->check()){
                $skyline = Skyline::where('id', $data['id'])->where('i_user_id',  Auth::guest()->get()->id)->first();
            } else if(Auth::user()->check()){
                $skyline = Skyline::where('id', $data['id'])->where('i_user_id',  Auth::user()->get()->id)->first();
            }
            if(count($skyline) > 0) {
                $skyline->v_abbreviated_name = $data['v_abbreviated_name'];
                $skyline->v_short_desc = $data['v_short_desc'];
                $skyline->save();
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }

    public function postEditSkylineLongDesc() {
        $data = Input::all();
        if(isset($data['id']) && $data['id'] != '') {
            $skyline = [];
            if(Auth::guest()->check()) {
                $skyline = Skyline::where('id', $data['id'])->where('i_user_id',  Auth::guest()->get()->id)->first();
            }
            else if(Auth::user()->check()) {
                $skyline = Skyline::where('id', $data['id'])->where('i_user_id',  Auth::user()->get()->id)->first();
            }

            if(count($skyline) > 0) {
                $skyline->v_long_desc = $data['v_long_desc'];
                $skyline->save();
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }
    public function postAddSkylineNote() {
        $data = Input::all();
        if(isset($data['i_skyline_id']) && $data['i_skyline_id'] != '' &&  isset($data['v_note'])) {
            $skyline = [];
            if(Auth::guest()->check()){
                $skyline = Skyline::where('id', $data['i_skyline_id'])->where('i_user_id',  Auth::guest()->get()->id)->first();
            }
            else if(Auth::user()->check()){
                $skyline = Skyline::where('id', $data['i_skyline_id'])->where('i_user_id',  Auth::user()->get()->id)->first();
            }
            if(count($skyline) > 0) {
                $skylineNote = new SkylineNote;
                $skylineNote->v_note = $data['v_note'];
                $skylineNote->i_skyline_id = $data['i_skyline_id'];
    	        $skylineNote->created_at = date('Y-m-d H:i:s');

                if($skylineNote->save()) {
                    $skylineNote->created_date = date('m-d-Y', strtotime($skylineNote->created_at));
                    $skylineNote->order_by_created_date = date('YmdHis', strtotime($skylineNote->created_at));
                    return $skylineNote;
                } else {
                    return 'FALSE';
                }
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }

    public function postDeleteSkylineNote() {
        $data = Input::all();
        if(isset($data['id']) && $data['id'] != '') {
            if(Auth::guest()->check()){
                $userId = Auth::guest()->get()->id;
            } else if(Auth::user()->check()){
                $userId = Auth::user()->get()->id;
            }
            if($userId){
                $note = SkylineNote::where('id', $data['id'])->whereHas('skyline', function($query) use ($userId) {
                    $query->where('i_user_id', $userId);
                })->first();

                if(count($note) > 0) {
                    if($note->delete()) {
                        return 'TRUE';
                    }
                } else {
                    return 'FALSE';
                }
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }

    public function postShareEmails() {
        if(Auth::guest()->check()){
            $userAuthData = Auth::guest()->get()->fname;
            $userName = $userAuthData ? (Auth::guest()->get()->fname.' '.Auth::guest()->get()->lname):'Test ';
            $data = Input::all();
            $skylineID = $data['id'];
            $emailSubject = 'Share Skyline';
            $emailData = array("subject"=>"this is the test email");
            $shareLink = $data['share_link'];
            $userEmailList = $data['share_skyline']['v_share_skyline'];
            $userEmailList = array_map(function ($a) { return $a['text']; }, $userEmailList);
            //$emails=explode(",",$userEmailList );
            if($userEmailList){
                $skyline = Skyline::find($skylineID);
                $mail_data = EmailTemplate::find(7)->toArray();
                $search_array = array('[SITE_URL]','[SITE_NAME]','[USERNAME]','[SKYLINENAME]','[SKYLINELINK]');
                $replace_array = array(SITE_URL,'JLL', $userName, $skyline->v_title , $shareLink);
                $result = str_replace($search_array, $replace_array, $mail_data['t_email_content']);
    
                foreach($userEmailList as $email){
                    if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                        $checkBuildingShareToUser = SkylineShareTo::where('v_email_id',$email)->where('i_skyline_id',$skylineID)->first();
                        if(!$checkBuildingShareToUser){
                            $users = User::where('email',$email)->first();
                            $userID = $users?($users->id):null;
                            $skylineShare = new SkylineShareTo;
                            $skylineShare->v_email_id = $email;
                            $skylineShare->i_user_id = $userID;
                            $skylineShare->i_skyline_id = $skylineID;
                            $skylineShare->created_at = date("Y-m-d H:i:s");
    
                            if($skylineShare->save()){
                                Mail::send('emails.share', array('strTemplate' => $result, 'userName' => $userName) , function($message) use ($email, $mail_data)
                                {
                                    $message->to($email);
                                    $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                                    $message->subject($mail_data['v_template_subject']);
                                });
                            }
    
                        } else {
                            $last_sent = strtotime($checkBuildingShareToUser->sent_date);
                            if($last_sent < strtotime('-1 days'))
                            {
                                Mail::send('emails.share', array('strTemplate' => $result , 'userName' => $userName) , function($message) use ($email, $mail_data)
                                {
                                    $message->to($email);
                                    $message->replyTo(FROM_EMAIL_ADDRESS, FROM_EMAIL_ADDRESS_NAME);
                                    $message->subject($mail_data['v_template_subject']);
                                });
                                $checkBuildingShareToUser->sent_date = date("Y-m-d H:i:s");
                                $checkBuildingShareToUser->save();
                            }
                        }
                    }
                }
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }

    public function getSkylineList() {
        $userCustomSkylines = [];
        if (Auth::guest()->check()){
            $userData = Auth::guest()->get();
        } else if(Auth::user()->check()){
            $userData = Auth::user()->get();
        } else{
            $userData  = '';
        }

        if(isset($userData) && $userData!="" &&  $userData->id){
            $userShareCustomSkylines = SkylineShareTo::where('v_email_id',$userData->email)->lists('i_skyline_id');

            if($userShareCustomSkylines){
                $userCustomSkylines = Skyline::where(function($query) use ($userShareCustomSkylines,$userData){
                    $query = $query->whereIn('id', $userShareCustomSkylines)
                      ->orWhere('i_user_id', '=', $userData->id);
               })->orderBy('updated_at','DESC')->select('v_title','v_slug','id')->get()->toArray();
            } else {
                $userCustomSkylines = Skyline::where('i_user_id',$userData->id)->orderBy('updated_at','DESC')->select('v_title','v_slug','id')->get()->toArray();
            }
        }

        return $userCustomSkylines;
    }
}
?>
