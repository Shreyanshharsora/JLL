<?php
class AdminBuildingsController extends BaseController
{
    /* Use for cms listing*/
	public function postIndex()
	{
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }

        $data = Input::get();
        $building = new Building;

        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$building = $building->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $building = $building->orderBy('updated_at','DESC');
		}

        if(isset($data['search_fields']['v_name']) && $data['search_fields']['v_name']!=""){
			$building = $building->where('buildings.v_name', 'LIKE',"%".$data['search_fields']['v_name']."%");
		}

		if(isset($data['search_fields']['v_city_name']) && $data['search_fields']['v_city_name']!=""){
			$building = $building->where('i_city_id',$data['search_fields']['v_city_name']);
		}
        if(isset($data['search_fields']['i_floor_number']) && $data['search_fields']['i_floor_number']!=""){
			$building = $building->where('i_floor_number', '=',$data['search_fields']['i_floor_number']);
		}
        if(isset($data['search_fields']['e_source']) && $data['search_fields']['e_source']!=""){
			$building = $building->where('e_source', $data['search_fields']['e_source']);
		}
        if(isset($data['search_fields']['i_order']) && $data['search_fields']['i_order']!=""){
			$building = $building->where('i_order', $data['search_fields']['i_order']);
		}
        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$building = $building->where('e_status', $data['search_fields']['e_status']);
		}
        if(isset($data['search_fields']['totalCustomSkyline']) && $data['search_fields']['totalCustomSkyline']!=""){
			$building = $building->having('totalCustomSkyline',"=",trim($data['search_fields']['totalCustomSkyline']));
		}

        $building->join('cities', 'cities.id', '=', 'buildings.i_city_id');
        $building->leftjoin('skyline_buildings', 'skyline_buildings.i_building_id', '=', 'buildings.id')->groupBy('buildings.id');
        $building->select(DB::RAW('count(skyline_buildings.i_building_id) as totalCustomSkyline'),'cities.id as cities_id','cities.v_name as v_city_name','buildings.*', DB::raw('DATE_FORMAT(buildings.updated_at, \'%m/%d/%Y %h:%i %p\') AS formatted_updated_at'));

        $building = $building->paginate($data['rec_per_page']);
        $arrCms = $building->toArray();
        $arrCms['city'] = City::where('i_status', '1')->orderBy('v_name')->get()->toArray();
        $results = [
    	    'items' => $arrCms['data'],
            'city' => $arrCms['city'],
            '_meta' => [
    	        'total'        => $building->getTotal(),
    	        'rpp'     => $building->getPerPage(),
    	        'current' => $building->getCurrentPage(),
    	        'last_page'    => $building->getLastPage(),
    	        'from'         => $building->getFrom(),
    	        'to'           => $building->getTo()
    	    ]
    	];
        return json_encode($results);
	}


    /* Use for cms listing*/
	public function postSetOrder()
	{
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }

        $data = Input::get();
        $building = new Building;

        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$building = $building->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $building = $building->orderBy('i_order','ASC');
		}

        if(isset($data['search_fields']['v_name']) && $data['search_fields']['v_name']!=""){
			$building = $building->where('buildings.v_name', 'LIKE',"%".$data['search_fields']['v_name']."%");
		}

		if(isset($data['search_fields']['v_city_name']) && $data['search_fields']['v_city_name']!=""){
			$building = $building->where('i_city_id',$data['search_fields']['v_city_name']);
		}
        if(isset($data['search_fields']['i_floor_number']) && $data['search_fields']['i_floor_number']!=""){
			$building = $building->where('i_floor_number', '=',$data['search_fields']['i_floor_number']);
		}
        if(isset($data['search_fields']['e_source']) && $data['search_fields']['e_source']!=""){
			$building = $building->where('e_source', $data['search_fields']['e_source']);
		}
        if(isset($data['search_fields']['i_order']) && $data['search_fields']['i_order']!=""){
			$building = $building->where('i_order', $data['search_fields']['i_order']);
		}

        $building->join('cities', 'cities.id', '=', 'buildings.i_city_id');
        $building->select('cities.id as cities_id','cities.v_name as v_city_name','buildings.*');

        $building = $building->get();
        $arrCms = $building->toArray();
        $results = [
    	    'items' => $arrCms
    	];
        return json_encode($results);
	}

    public function postUpdateOrder(){
        $data = Input::all();
        if(isset($data['data']['i_order']) && !empty($data['data']['i_order'])){
            foreach($data['data']['i_order'] as $key => $val){
                $building = Building::find($key);
                $building->i_order = $val;
                $building->save();
            }
        }
    }

    public function getCityData(){
        $arrCms['city'] = City::where('i_status', '1')->orderBy('v_name')->get()->toArray();
        $results = [
    	    'city' => $arrCms['city']
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
                Building::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }
        }
    }

    public function anyExport($parameters = null)
    {
        Excel::create('buildings_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('BUILDINGS'  , function($sheet) use ($parameters)
            {
                $query = Building::query();

                if($parameters != null && trim($parameters) != '""'){
        		    $reqestData = json_decode($parameters, true);
                    if(isset($reqestData)){
                        foreach($reqestData as $key => $val) { if($key != 'search_fields'){ $$key = trim($val); } }
                    }

                    $sort = 'buildings_id';
                    $order = 'asc';

                    if(isset($order_field) && $order_field!=""){
                        $sort = $order_field;
                    }
                    if(isset($sort_order) && $sort_order!=""){
                        $order = $sort_order;
                    }

                    if(isset($v_name) && $v_name!=""){
            			$query = $query->where('buildings.v_name', 'LIKE',"%".$v_name."%");
            		}
                   	if(isset($i_floor_number) && $i_floor_number!=""){
            			$query = $query->where('i_floor_number', '=',$i_floor_number);
            		}
                    if(isset($v_city_name) && $v_city_name!=""){
            			$query = $query->where('i_city_id', '=',$v_city_name);
            		}
                    if(isset($e_source) && $e_source!=""){
            			$query = $query->where('e_source', '=',$e_source);
            		}
                    if(isset($e_status) && $e_status!=""){
            			$query = $query->where('e_status', '=',$e_status);
            		}

                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('buildings_id', 'asc');
                }

                $cities = City::withTrashed()->lists('v_name', 'id');
                //$query->join('cities', 'cities.id', '=', 'buildings.i_city_id');

                $query->select('buildings.id as buildings_id','buildings.v_name as buildings_v_name','buildings.i_city_id','i_order','buildings.v_image_url as buildings_v_image_url','b_status','i_year_built','v_submarket','e_class','i_rba','i_avg_floor_plate','i_total_vacant_sf','i_occupied','i_direct_vacant_sf','i_leased','d_rent','v_owner','i_leed','e_leed_cert','v_address1','v_address2','v_state','v_zip','d_lat','d_long','i_floor_number','is_default','e_source','e_status','buildings.created_at as buildings_created_at','buildings.updated_at as buildings_updated_at');

                //$query->select('id','fname','lname','email','e_status','created_at','updated_at');
        		$records = $query->get()->toArray();

                $buildIds = array();
                foreach($records as $val){
                    $buildIds[$val['buildings_id']] = $val['buildings_id'];
                }

                $floor_data =  Floor::select('i_building_id','i_floor_number','t_config')->whereIn('i_building_id',$buildIds)->orderBy('i_floor_number')->get()->toArray();
                $buildFloorArr = array();
                foreach($floor_data as $val){
                    $buildFloorArr[$val['i_building_id']][$val['i_floor_number']] = $val['t_config'];
                }
                //pr($buildFloorArr); exit;

                $field['no'] = 'Sr.No';
                $field['buildings_v_name'] = 'Building Name';
                $field['i_city_id'] = 'City';
                $field['i_order'] = 'Order';
                $field['buildings_v_image_url'] = 'Image';
                $field['b_status'] = 'Status';
                $field['i_year_built'] = 'Year Built';
                $field['v_submarket'] = 'Submarket';
                $field['e_class'] = 'Class';
                $field['i_rba'] = 'RBA';
                $field['i_avg_floor_plate'] = 'Avg Floor Plate';
                $field['i_total_vacant_sf'] = 'Total Vacant Sf';
                $field['i_occupied'] = 'Occupied';
                $field['i_direct_vacant_sf'] = 'Direct Vacant Sf';
                $field['i_leased'] = 'Leased';
                $field['d_rent'] = 'Rent';
                $field['v_owner'] = 'Owner';
                $field['i_leed'] = 'Leed';
                $field['e_leed_cert'] = 'Leed Cert';
                $field['v_address1'] = 'Address1';
                $field['v_address2'] = 'Address2';
                $field['v_state'] = 'State';
                $field['v_zip'] = 'Zip';
                $field['d_lat'] = 'Lat';
                $field['d_long'] = 'Long';
                $field['i_floor_number'] = 'Number of Floor';
                $field['is_default'] = 'Is Default';
                $field['e_source'] = 'Source';
                $field['e_status'] = 'Status';
                $field['buildings_created_at'] = 'Created On';
                $field['buildings_updated_at'] = 'Last Updated';


                for($i=1; $i <= 110; $i++){
                     $field['floor_' . $i] = 'Floor '.$i;
                }

                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:EK1');
                /*$sheet->setWidth(array('A' =>  8,'B'     =>  20,'C'     => 10,'D'     =>  8,'E'     =>  10,'F'     =>  10,'G'     =>  10,));*/

                $sheet->cells('A1:EK1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });

                $sheet->row(1,array('Buildings'));
                $sheet->cells('A2:EK2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });

                $sheet->row(2,$field);

                $intCount = 3;
                $srNo=1;
                $unit_status = UnitStatus::lists('v_name','id');
                //pr($buildIds); pr($buildFloorArr); exit;
                foreach($records as $val){
                    $val['i_city_id'] = $cities[$val['i_city_id']];
                    if($val['e_status'] == '1') {
                        $val['e_status'] = 'Active';
                    } else {
                        $val['e_status'] = 'Inactive';
                    }

                    //$floor_data = Floor::where('i_building_id',$val['buildings_id'])->orderBy('i_floor_number')->get()->toArray();
                    if(isset($buildFloorArr[$val['buildings_id']])) {
                        foreach($buildFloorArr[$val['buildings_id']] as $key => $floor){
                            foreach($unit_status as $index => $status) {
                                $floor = str_replace('{"'.$index.'"','{"'.$status.'"',$floor);
                                $floor = str_replace(',"'.$index.'"',',"'.$status.'"',$floor);
                            }
                            $val['floor_'.$key] = $floor;
                        }
                    }
                    //$val['buildings_id'] = $srNo;
                    $sheet->row($intCount, $val);
                    $intCount++;
                    $srNo++;
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
    
    public function postAddLog(){
        $data = Input::get();
        if(!empty($data) && $this->checkAuthentication()){
            $txt = ''; 
            $date = date("d-M-Y H:i:s");
            $txt .= "==============================================================================================\r\n";
            $txt .= "Dated: ".$date."\r\n";
            $txt .= "Login ID: ".Auth::user()->get()->id."\r\n";
            $txt .= "Browser Details: ".$_SERVER['HTTP_USER_AGENT'] . "\r\n";
            $txt .= "Error: ".$data['error_text']; //." in ".$data['error_url']." at line no ".$data['error_line']."/n";
            $myfile = file_put_contents(WWW_ROOT.'files/angular-http-log.txt', $txt.PHP_EOL , FILE_APPEND);
            if($myfile){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }   
    }

    public function getAdd() {
        $cities = City::where('i_status', '1')->orderBy('v_name')->get()->toArray();
        $newCityArray = $allCityArray = array();
        foreach($cities as $data){
            $allCityArray[$data['id']] = $data;
            $newCityArray[$data['v_name']] = $data['id'];
        }

        $unitAssets = UnitStatus::get()->toArray();

        $listUnitAssets = array();
        foreach($unitAssets as $data){
            $listUnitAssets[$data['id']]['color'] = $data['v_color'];
            $listUnitAssets[$data['id']]['name'] = $data['v_name'];
        }

        $results = [
            'all_cities_data' => $allCityArray,
    	    'cities' => $newCityArray,
            'list_unit_assets' => $listUnitAssets,
            'unit_assets' => $unitAssets
    	];
	    return json_encode($results);
    }

    public function postAdd() {
        $data = Input::get();

        $arrUser = Auth::user()->get();

        if(!empty($data['building']) && $arrUser->id != '' && $arrUser->id > 0) {
            $base64_fullImg = $data['building']['v_image_url'].'=';
            $image_name = $data['building']['original_image_name'];
            $v_random_image = time().'-'.str_random(6);
            $path = BUILDING_IMAGE_PATH;
            $strImage = $this->saveImage($base64_fullImg, $image_name, $path, '.svg');

            if(!isset($data['building']['v_address2'])) $data['building']['v_address2'] = '';

            /* For lat and long */
            if(!isset($data['building']['v_zip'])) $data['building']['v_zip'] = '';

            $building_address = $data['building']['v_address1'].", ";

            if(isset($data['building']['v_address2']) && $data['building']['v_address2'] != '' && isset($data['building']['v_city']) && $data['building']['v_city'] != ''){
                if (strpos($data['building']['v_city'],$data['building']['v_address2']) !== false) {
                    $building_address .= $data['building']['v_address2'].", ";
                } else {
                    $building_address .= $data['building']['v_address2'].", ".$data['building']['v_city'].", ";
                }
            } else {
                if(isset($data['building']['v_address2']) && $data['building']['v_address2'] != ''){
                    $building_address .= $data['building']['v_address2'].", ";
                }
                if(isset($data['building']['v_city']) && $data['building']['v_city'] != ''){
                    $building_address .= $data['building']['v_city'].", ";
                }
            }

            if(isset($data['building']['v_state']) && $data['building']['v_state'] != ''){
                $building_address .= $data['building']['v_state'].", ";
            }

            if(isset($data['building']['v_zip']) && $data['building']['v_zip'] != ''){
                $building_address .= $data['building']['v_zip'];
            }
            $building_address = rtrim($building_address, ",");

            $address = urlencode($building_address);

            if(isset($data['building']['v_zip']) && $data['building']['v_zip'] != ''){
                $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&components=postal_code:'.urlencode($data['building']['v_zip']).'&sensor=false';
            } else {
                $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&sensor=false';
            }
            $geocode=file_get_contents($google_api_address);

            $output= json_decode($geocode); //Store values in variable

            if($output->status == 'OK'){ // Check if address is available or not
                $lat = $output->results[0]->geometry->location->lat; //Returns Latitude
                $long = $output->results[0]->geometry->location->lng; // Returns Longitude
            }

            // To set order before enter new data
            if($data['building']['i_city_id'] != '' && $data['building']['i_order'] != ''){
                $buildings_data = Building::where('i_city_id','=',$data['building']['i_city_id'])->where('i_order','=',$data['building']['i_order'])->first();
                if(!empty($buildings_data)){
                    Building::where('i_city_id','=',$data['building']['i_city_id'])->where('i_order','>=',$data['building']['i_order'])->increment('i_order', 1);
                }
            }

            /* Remove default from other */
            if($data['building']['is_default'] == 1){
                $default_data = Building::where('i_city_id','=',$data['building']['i_city_id'])->where('is_default','=',1)->first();
                if(!empty($default_data)){
                    $default_data->is_default = 0;
                    $default_data->save();
                }
            }

            $building = new Building;
            $building->i_city_id = $data['building']['i_city_id'];
            $building->i_order = $data['building']['i_order'];
            $building->v_name = $data['building']['v_name'];
            $building->v_image_url = $strImage;
            /* For generate building images */
            $graphImage = $plainImage = '';
            $generated_image_name = time().'-'.str_random(6).".png";
            if($data['plain_image'] != ''){
                $plainImage = $this->saveBuildingImageTransparent($data['plain_image'], $generated_image_name, TEMP_IMAGE_PATH, $data['original_image_width'], BUILDING_PLAIN_IMAGE_PATH, 'TRUE');
                if($plainImage != ''){
                    @unlink(TEMP_IMAGE_PATH.$plainImage);

                    //generate global image
                    if(file_exists(BUILDING_PLAIN_IMAGE_PATH.$plainImage)){
                        $floor_height = $building->city->d_floor_height;
                        $this->generateCopyImg($plainImage, $floor_height, BUILDING_PLAIN_IMAGE_PATH, BUILDING_FLOOR_IMAGE_PATH);
                    }
                }
            }

            $building->v_plain_image = $plainImage;
            $building->v_plain_image_2 = $plainImage;

            if(!isset($data['building']['b_status'])) $data['building']['b_status'] = '';
            $building->b_status = $data['building']['b_status'];
            $building->i_year_built = $data['building']['i_year_built'];
            $building->v_submarket = $data['building']['v_submarket'];
            $building->e_class = $data['building']['e_class'];
            $building->i_rba = $data['building']['i_rba'];
            $building->i_avg_floor_plate = $data['building']['i_avg_floor_plate'];
            $building->i_total_vacant_sf = $data['building']['i_total_vacant_sf'];
            $building->i_occupied = $data['building']['i_occupied'];
            $building->i_direct_vacant_sf = $data['building']['i_direct_vacant_sf'];
            $building->i_leased = $data['building']['i_leased'];
            $building->d_rent = $data['building']['d_rent'];
            $building->v_owner = $data['building']['v_owner'];
            $building->i_leed = $data['building']['i_leed'];
            $building->e_status = $data['building']['status'];
            if(!isset($data['building']['e_leed_cert'])) $data['building']['e_leed_cert'] = '';
            $building->e_leed_cert = $data['building']['e_leed_cert'];
            $building->v_address1 = $data['building']['v_address1'];
            $building->v_address2 = $data['building']['v_address2'];

            $building->v_state = $data['building']['v_state'];
            $building->v_zip = $data['building']['v_zip'];
            $building->i_floor_number = $data['building']['i_floor_number'];
            $building->i_display_no_of_floors = $data['building']['i_display_no_of_floors'];
            $building->is_default = $data['building']['is_default'];
            $building->e_source = 'System';

            if(isset($lat) && isset($long)){
                $building->d_lat = $lat;
                $building->d_long = $long;
            }

            $building->i_user_id = $arrUser->id;

            if($building->save()){

                //$formatedArr = array();
                if(!empty($data['unit'])){
                    foreach($data['unit'] as $key => $value){
                        $config_string = '';
                        $floor = new Floor;
                        $floor_no = $key;
                        foreach($value['unit_'.$key] as $k=>$v){
                            if(isset($v) && $v != '' && isset($value['unit_amount_'.$key][$k]) && $value['unit_amount_'.$key][$k] != ''){
                                //$formatedArr[$key][$v] = $value['unit_amount_'.$key][$k];
                                $config_string .= '"'.$v.'":"'.$value['unit_amount_'.$key][$k].'",';
                            }
                        }

                        if($config_string == ""){
                            $config_string .= '"":""';
                        } else {
                            $config_string = rtrim($config_string, ',');
                        }

                        $floor->i_building_id = $building->id;
                        $floor->i_floor_number = $floor_no;
                        $floor->t_config = "{".$config_string."}";
                        $floor->i_user_id = $arrUser->id;
                        $floor->save();
                    }
                }
                return 'TRUE';
            } else {
                return 'FALSE';
            }

        }
    }

    protected function generateCopyImg($src_file, $floor_height, $src_file_path, $file_path) {
        $org_floor_height = $floor_height;
        $to_floor_height = DEFAULT_FLOOR_HEIGHT;

        $file = $src_file_path.$src_file;
        list($width, $height) = getimagesize($file);

        $new_width = ($width * $to_floor_height) / $org_floor_height;
        $new_height = ($height * $to_floor_height) / $org_floor_height;
        $new_width_10_perc = $new_width * 0.1;

        $src = imagecreatefrompng($file);
        $dest = imagecreatetruecolor(($new_width + (2 * $new_width_10_perc)), $height);
        imagesavealpha($dest, true);
        $trans_colour = imagecolorallocatealpha($dest, 0, 0, 0, 127);
        imagefill($dest, 0, 0, $trans_colour);

        imagecolortransparent($dest, $trans_colour);
        imagealphablending($dest, false);

        imagecopyresized($dest, $src, $new_width_10_perc, ($height - $new_height), 0, 0, $new_width, $new_height, $width, $height);

        if(imagepng($dest, $file_path.$src_file)) {
            return true;
        }
    }

    protected function saveBuildingImage($base64img, $image_name, $path, $newWidth, $target_thumb_path, $thumb_status) {
        $tmpFile = '';
        $filename = preg_replace('/\\.[^.\\s]{3,4}$/', '', $image_name);
        if($filename){
            $tmpFile = $filename.'.png';
        }

        if (strpos($base64img,'data:image/jpeg;base64,') !== false) {
            $base64img = str_replace('data:image/jpeg;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/png;base64,') !== false) {
            $base64img = str_replace('data:image/png;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/webp;base64,') !== false) {
            $base64img = str_replace('data:image/webp;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/jpg;base64,') !== false) {
            $base64img = str_replace('data:image/jpg;base64,', '', $base64img);
        }
        if (strpos($base64img,'data:image/gif;base64,') !== false) {
            $base64img = str_replace('data:image/gif;base64,', '', $base64img);
        }

        $data = base64_decode($base64img);
        $file = $path.$tmpFile;
        file_put_contents($file, $data);

        if(isset($thumb_status) && $thumb_status == 'TRUE'){
            $response = $this->resize($newWidth, $target_thumb_path.$tmpFile, $file);
            if($response == 'TRUE'){
                return $tmpFile;
            }
        } else {
            return $tmpFile;
        }
    }

    protected function saveBuildingImageTransparent($base64img, $image_name, $path, $newWidth, $target_thumb_path, $thumb_status) {
        $tmpFile = '';
        $filename = preg_replace('/\\.[^.\\s]{3,4}$/', '', $image_name);
        if($filename){
            $tmpFile = $filename.'.png';
        }

        if (strpos($base64img,'data:image/jpeg;base64,') !== false) {
            $base64img = str_replace('data:image/jpeg;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/png;base64,') !== false) {
            $base64img = str_replace('data:image/png;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/webp;base64,') !== false) {
            $base64img = str_replace('data:image/webp;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/jpg;base64,') !== false) {
            $base64img = str_replace('data:image/jpg;base64,', '', $base64img);
        }
        if (strpos($base64img,'data:image/gif;base64,') !== false) {
            $base64img = str_replace('data:image/gif;base64,', '', $base64img);
        }

        $data = base64_decode($base64img);
        $file = $path.$tmpFile;
        file_put_contents($file, $data);

        if(isset($thumb_status) && $thumb_status == 'TRUE'){
            //$transparent_image_name = time().'-'.str_random(6).".png";
            $response = $this->transparent_background($target_thumb_path.$tmpFile, $file, '255,255,255');
            if($response == 'TRUE'){
                /*$resize_response = $this->resize($newWidth, $target_thumb_path.$tmpFile, $path.$transparent_image_name);
                if($response == 'TRUE'){*/
                    return $tmpFile;
                //}
            }
        } else {
            return $tmpFile;
        }
    }

    function resize($newWidth, $targetFile, $originalFile) {

        $img = imagecreatefrompng($originalFile);
        imagealphablending($img, false);
        imagesavealpha($img,true);

        list($width, $height) = getimagesize($originalFile);

        $newHeight = ($height / $width) * $newWidth;
        $tmp = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($tmp, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        if (file_exists($targetFile)) {
            unlink($targetFile);
        }
        imagepng($tmp, "$targetFile");
        return 'TRUE';
    }

    function transparent_background($targetFile, $originalFile, $color)
    {

        $tmp = $img = imagecreatefrompng($originalFile);
        imagealphablending($tmp, false);

        $colors = explode(',', $color);
        $remove = imagecolorallocatealpha($tmp, $colors[0], $colors[1], $colors[2], 127);
        imagecolortransparent($tmp, $remove);
        //$remove = imagecolorallocatealpha($tmp, 253, 253, 254, 127);
        //$remove = imagecolorallocatealpha($tmp, 253, 253, 254, 127);
        imagecolortransparent($tmp, $remove);

        //imageAlphaBlending($tmp, true);

        header('Content-Type: image/png');
        imagepng($tmp, "$targetFile");
        imagedestroy($tmp);
        return 'TRUE';
    }


    public function getCityOrder($city_id){
        if($city_id != '' && $city_id > 0){
            $order_no = Building::where('i_city_id','=',$city_id)->max('i_order');
            return $order_no+1;
        }
    }

    public function getEdit($id) {
        if($id != '' && $id > 0){
            $buildings = Building::with('city')->find($id);
            $floors = Floor::where('i_building_id','=',$id)->orderBy('i_floor_number', 'ASC')->get();
            $cities = City::select('id', 'v_name', 'd_floor_height', 'v_image_url', 'v_background_image_url')->where('i_status', '1')->orderBy('v_name')->get()->toArray();
            $newCityArray = $allCityArray = array();
            foreach($cities as $data){
                $allCityArray[$data['id']] = $data;
                $newCityArray[$data['id']] = $data['v_name'];
            }
            $unitAssets = UnitStatus::get()->toArray();

            $listUnitAssets = array();
            foreach($unitAssets as $data){
                $listUnitAssets[$data['id']]['color'] = $data['v_color'];
                $listUnitAssets[$data['id']]['name'] = $data['v_name'];
            }

            $results = [
                'buildings' => $buildings,
                'floors' => $floors,
                'all_cities_data' => $allCityArray,
        	    'cities' => $newCityArray,
                'list_unit_assets' => $listUnitAssets,
                'unit_assets' => $unitAssets
        	];
            echo json_encode($results);
            exit;
        }

    }

    public function postEdit()
	{
        $data = Input::get();

        $arrUser = Auth::user()->get();
        if(!empty($data['building']) && $data['building']['id'] != '' && $data['building']['id'] > 0 && $arrUser->id != '' && $arrUser->id > 0){

            if(!isset($data['building']['v_address2'])) $data['building']['v_address2'] = '';

            /* For lat and long */
            if(trim($data['building']['d_lat']) == '' || trim($data['building']['d_long'] == '') ) {
                $building_address = $data['building']['v_address1'].", ";
                if(isset($data['building']['v_address2']) && $data['building']['v_address2'] != '' && isset($data['building']['v_city']) && $data['building']['v_city'] != ''){
                    if (strpos($data['building']['v_city'],$data['building']['v_address2']) !== false) {
                        $building_address .= $data['building']['v_address2'].", ";
                    } else {
                        $building_address .= $data['building']['v_address2'].", ".$data['building']['v_city'].", ";
                    }
                } else {
                    if(isset($data['building']['v_address2']) && $data['building']['v_address2'] != ''){
                        $building_address .= $data['building']['v_address2'].", ";
                    }
                    if(isset($data['building']['v_city']) && $data['building']['v_city'] != ''){
                        $building_address .= $data['building']['v_city'].", ";
                    }
                }

                if(isset($data['building']['v_state']) && $data['building']['v_state'] != ''){
                    $building_address .= $data['building']['v_state'].", ";
                }

                if(isset($data['building']['v_zip']) && $data['building']['v_zip'] != ''){
                    $building_address .= $data['building']['v_zip'];
                }
                $building_address = rtrim($building_address, ",");

                $address = urlencode($building_address);

                if(isset($data['building']['v_zip']) && $data['building']['v_zip'] != ''){
                    $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&components=postal_code:'.urlencode($data['building']['v_zip']).'&sensor=false';
                } else {
                    $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&sensor=false';
                }
                //'http://maps.google.com/maps/api/geocode/json?address='.$address.'&sensor=false'
                $geocode=file_get_contents($google_api_address);

                $output= json_decode($geocode); //Store values in variable

                if($output->status == 'OK'){ // Check if address is available or not
                    $lat = $output->results[0]->geometry->location->lat; //Returns Latitude
                    $long = $output->results[0]->geometry->location->lng; // Returns Longitude
                }
            }

            /* Remove default from other */
            if($data['building']['is_default'] == 1){
                $default_data = Building::where('i_city_id','=',$data['building']['i_city_id'])->where('is_default','=',1)->first();
                if(!empty($default_data)){
                    $default_data->is_default = 0;
                    $default_data->save();
                }
            }

            $building = Building::find($data['building']['id']);
            /* Remove old images */

            if(isset($data['floor_save_status']) && $data['floor_save_status'] == '1' && isset($data['plain_image']) && $data['plain_image'] != ''){
                @unlink(BUILDING_PLAIN_IMAGE_PATH.$building->v_plain_image);
            }

            if(isset($data['floor_save_status']) && $data['floor_save_status'] == '1' && isset($data['building_image_2']) && $data['building_image_2'] != ''){
                @unlink(BUILDING_FLOOR_IMAGE_PATH.$building->v_plain_image);
            }

            // To set order before edit data
            if($building->i_order > $data['building']['i_order']){
                Building::where('i_city_id','=',$data['building']['i_city_id'])->where('i_order','>=',$data['building']['i_order'])->where('i_order','<',$building->i_order)->increment('i_order', 1);
            } else if($building->i_order < $data['building']['i_order']){
                Building::where('i_city_id','=',$data['building']['i_city_id'])->where('i_order','<=',$data['building']['i_order'])->where('i_order','>',$building->i_order)->decrement('i_order', 1);
            }

            $building->i_city_id = $data['building']['i_city_id'];
            $building->i_order = $data['building']['i_order'];
            $building->v_name = $data['building']['v_name'];

            if($data['building']['image_type'] == 'New'){
                $base64_fullImg = $data['building']['v_image_url'].'=';
                $image_name = $data['building']['original_image_name'];
                $v_random_image = time().'-'.str_random(6);
                $path = BUILDING_IMAGE_PATH;
                $strImage = $this->saveImage($base64_fullImg, $image_name, $path, '', '', 'FALSE', '.svg');
                $building->v_image_url = $strImage;
            }

            /* For generate building images */
            $generated_image_name = time().'-'.str_random(6).".png";
            $graphImage = $plainImage = '';
            if(isset($data['floor_save_status']) && $data['floor_save_status'] == '1' && isset($data['plain_image']) && $data['plain_image'] != ''){
                $plainImage = $this->saveBuildingImageTransparent($data['plain_image'], $building->v_plain_image, TEMP_IMAGE_PATH, $data['original_image_width'], BUILDING_PLAIN_IMAGE_PATH, 'TRUE');
                if($plainImage != ''){
                    @unlink(TEMP_IMAGE_PATH.$plainImage);
                    if(file_exists(BUILDING_PLAIN_IMAGE_PATH.$plainImage)){
                        $floor_height = $building->city->d_floor_height;
                        $this->generateCopyImg($plainImage, $floor_height, BUILDING_PLAIN_IMAGE_PATH, BUILDING_FLOOR_IMAGE_PATH);
                    }
                }

                $building->v_plain_image = $plainImage;
                $building->v_plain_image_2 = $plainImage;
            }

            $building->i_year_built = $data['building']['i_year_built'];
            $building->v_submarket = $data['building']['v_submarket'];
            $building->e_class = $data['building']['e_class'];
            $building->i_rba = $data['building']['i_rba'];
            $building->i_avg_floor_plate = $data['building']['i_avg_floor_plate'];
            $building->i_total_vacant_sf = $data['building']['i_total_vacant_sf'];
            $building->i_occupied = $data['building']['i_occupied'];
            $building->i_direct_vacant_sf = $data['building']['i_direct_vacant_sf'];
            $building->i_leased = $data['building']['i_leased'];
            $building->d_rent = $data['building']['d_rent'];
            $building->v_owner = $data['building']['v_owner'];
            $building->i_leed = $data['building']['i_leed'];
            if(isset($data['building']['status'])) $building->e_status = $data['building']['status'];
            if(!isset($data['building']['e_leed_cert'])) $data['building']['e_leed_cert'] = '';
            $building->e_leed_cert = $data['building']['e_leed_cert'];
            $building->v_address1 = $data['building']['v_address1'];
            $building->v_address2 = $data['building']['v_address2'];
            $building->v_state = $data['building']['v_state'];
            $building->v_zip = $data['building']['v_zip'];
            $building->i_floor_number = $data['building']['i_floor_number'];
            $building->i_display_no_of_floors = $data['building']['i_display_no_of_floors'];
            $building->is_default = $data['building']['is_default'];
            $building->e_source = 'System';

            if(trim($data['building']['d_lat']) != '' && trim($data['building']['d_long'] != '') ) {
                $building->d_lat = $data['building']['d_lat'];
                $building->d_long = $data['building']['d_long'];
            } else if(isset($lat) && isset($long)) {
                $building->d_lat = $lat;
                $building->d_long = $long;
            }

            if(!isset($data['building']['b_status'])) $data['building']['b_status'] = '';
            $building->b_status = $data['building']['b_status'];
            $building->i_user_id = $arrUser->id;

            if($building->save()){

                if(isset($data['floor_save_status']) && $data['floor_save_status'] == '1') {
                    //$formatedArr = array();

                    $delete_floor = Floor::where('i_building_id',$data['building']['id'])->where('i_floor_number','>',$data['building']['i_floor_number']);
                    if(count($delete_floor) > 0){
                        $delete_floor->delete();
                    }
                    if(!empty($data['unit'])){
                        //$min_l = $min_r = array();
                        foreach($data['unit'] as $key => $value){
                            $config_string = '';
                            $floor_no = $key;
                            $floor_data = Floor::where('i_building_id','=',$data['building']['id'])->where('i_floor_number','=',$floor_no)->first();
                            if(empty($floor_data) || $floor_data == '' || is_null($floor_data)){
                                $floor = new Floor;
                                foreach($value['unit_'.$key] as $k=>$v){
                                    if(isset($v) && $v != '' && $v != '0' && isset($value['unit_amount_'.$key][$k]) && $value['unit_amount_'.$key][$k] != '' && $value['unit_amount_'.$key][$k] != '0'){
                                        $config_string .= '"'.$v.'":"'.$value['unit_amount_'.$key][$k].'",';
                                    }
                                }
                                if($config_string == ""){
                                    $config_string .= '"":""';
                                } else {
                                    $config_string = rtrim($config_string, ',');
                                }
                                $floor->i_building_id = $data['building']['id'];
                                $floor->i_floor_number = $floor_no;
                                $floor->t_config = "{".$config_string."}";
                                $floor->i_user_id = $arrUser->id;
                                $floor->save();
                            } else {
                                foreach($value['unit_'.$key] as $k1=>$v1){
                                    if(isset($v1) && $v1 != '' && $v1 != '0' && isset($value['unit_amount_'.$key][$k1]) && $value['unit_amount_'.$key][$k1] != '' && $value['unit_amount_'.$key][$k1] != '0'){
                                        $config_string .= '"'.$v1.'":"'.$value['unit_amount_'.$key][$k1].'",';
                                    }
                                }
                                if($config_string == ""){
                                    $config_string .= '"":""';
                                } else {
                                    $config_string = rtrim($config_string, ',');
                                }

                                $floor_data->i_building_id = $data['building']['id'];
                                $floor_data->i_floor_number = $floor_no;
                                $floor_data->t_config = "{".$config_string."}";
                                $floor_data->i_user_id = $arrUser->id;
                                $floor_data->save();
                            }
                        }
                    }
                }
                return 'TRUE';
            } else {
                return 'FALSE';
            }

        }
    }

    protected function saveImage($base64img, $image_name, $path, $format = '.png') {
        $tmpFile = '';
        $filename = preg_replace('/\\.[^.\\s]{3,4}$/', '', $image_name);
        if($filename){
            $tmpFile = $filename.$format;
        }

        if (strpos($base64img,'data:image/jpeg;base64,') !== false) {
            $base64img = str_replace('data:image/jpeg;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/png;base64,') !== false) {
            $base64img = str_replace('data:image/png;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/webp;base64,') !== false) {
            $base64img = str_replace('data:image/webp;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/jpg;base64,') !== false) {
            $base64img = str_replace('data:image/jpg;base64,', '', $base64img);
        }
        if (strpos($base64img,'data:image/gif;base64,') !== false) {
            $base64img = str_replace('data:image/gif;base64,', '', $base64img);
        }

        if (strpos($base64img,'data:image/svg+xml;base64,') !== false) {
            $base64img = str_replace('data:image/svg+xml;base64,', '', $base64img);
        }
        $data = base64_decode($base64img);
        $file = $path.$tmpFile;
        file_put_contents($file, $data);
        return $tmpFile;
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
    public function anyDelete()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $building = Building::find($data['id']);
            if($building->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }

    public function postImportToExcel_temp(){
        $data = Input::get(); //fetch the posted data
        $base64_string = $data['data']; //store actual data in to an string
        $file_name = time().".".$data['ext']; //fetch the extantion and create a unique file name to store
        $file = BUILDING_IMPORT_PATH.$file_name; //store path of file

        //write posted data into a file on server
        $ifp = fopen($file, "wb");
        $data = explode(',', $base64_string);
        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        $objPHPExcel = PHPExcel_IOFactory::load($file); //load file object

        //convert file object data into array
        foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
            $building_dataArr[] = $worksheet->toArray();
        }

        $arrUser = Auth::user()->get(); //get id of current user, who modify the records
        $cityId = array();
        $unit_status = UnitStatus::lists('v_short_name','id'); //fetch the unit assets from database to an array

        $count_buildings = count($building_dataArr[0]); // count no of building records
        $building_data = $building_dataArr[0];

        //start processing on building records
        for($i=3; $i < $count_buildings ; $i++) {

            //if any filed have NULL value, than convert it into '' (blank) value.
            foreach($building_data[$i] as $key=>$val){
               if(is_null($building_data[$i][$key])) {
                    $building_data[$i][$key] = '';
               }
            }

            //city name and mask image name fields ahould not blank.
            if(trim($building_data[$i][0]) !='' &&  trim($building_data[$i][3]) !='') {

                if($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach'){
                    $city = City::where('v_name','LIKE',"%Orange County%")->select('id')->first()->toArray();
                } else if($building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham'){
                    $city = City::where('v_name','LIKE',"%Raleigh%")->select('id')->first()->toArray();
                } else {
                    echo $building_data[$i][0]."<br>";
                    $city = City::where('v_name','LIKE',"%".$building_data[$i][0]."%")->select('id')->first()->toArray();
                }

                array_push($cityId,$city['id']); //fetch the city id and store into array '$cityId'

                //check the name of building in db, if name is exists than system will update it, otherwise system will add new record into db
                $checkRecord = Building::where('v_name',$building_data[$i][1])->where('i_city_id',$city['id'])->first();
                $isEditrec = 0; //flag variable
                if(count($checkRecord) > 0){
                    $building = Building::find($checkRecord->id);
                    $isEditrec = 1;

                    /* fetch lat and long of address to show it on google map */
                    $building_address = $building_data[$i][18].", ".$building_data[$i][19].", ".$building_data[$i][20].", ".$building_data[$i][21]." - ".$building_data[$i][22];
                    $address = urlencode($building_address);

                    if(isset($building_data[$i][22]) && $building_data[$i][22] != ''){
                        $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&components=postal_code:'.urlencode($building_data[$i][22]).'&sensor=false';
                    } else {
                        $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&sensor=false';
                    }
                    //'http://maps.google.com/maps/api/geocode/json?address='.$address.'&sensor=false'
                    $geocode=file_get_contents($google_api_address);

                    $output= json_decode($geocode); //Store values in variable
                    if($output->status == 'OK'){ // Check if address is available or not
                        $lat = $output->results[0]->geometry->location->lat; //Returns Latitude
                        $long = $output->results[0]->geometry->location->lng; // Returns Longitude
                        $building->d_lat = $lat;
                        $building->d_long = $long;
                    }

                    //if building name is not exists, than save address 1 line as building name
                    if(isset($building_data[$i][1]) && trim($building_data[$i][1]) == ''){
                        $building->v_name = $building_data[$i][18];
                    } else {
                        $building->v_name = $building_data[$i][1];
                    }
                    $building->i_city_id = $city['id'];

                    $building->i_order = $building_data[$i][3]; //building order

                    $building->v_address1 = $building_data[$i][18]; //Address 1

                    if($building_data[$i][19] == '' && ($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach' || $building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham')){
                        $building_data[$i][19] = $building_data[$i][0]; //add city name into address 2 field
                    } else if ($building_data[$i][19] != '' && ($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach' || $building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham')) {
                        $building_data[$i][19] = $building_data[$i][19]." - ".$building_data[$i][0]; //append city name into address 2 field
                    }

                    $building->v_address2 = $building_data[$i][19]; //Address 2
                    //$building_data[$i][20] :  City Name
                    $building->v_state = $building_data[$i][21];  //State
                    $building->v_zip = $building_data[$i][22];    //Zipcode

                    if($isEditrec == '0') { //if this is a new record to enter in db
                        $building->i_floor_number = $building_data[$i][23]; //No. of Floors
                        $building->i_display_no_of_floors = $building_data[$i][23]; //display floors
                    } else {
                        $building->i_display_no_of_floors = $building_data[$i][23]; //No. of Floors
                        if(isset($building->i_floor_number) and $building->i_floor_number <= 0) {
                            $building->i_floor_number = $building_data[$i][23]; //No. of Floors
                        }
                    }

                    $building->i_user_id = $arrUser->id; //Logged in user's id
                    $building->e_source = 'Excel';  //source is from excel, so admin have to regenerate image in admin panel.
                    $building->save(); //save records in buildings table
                }
            }
        }

        $cityId = array_unique($cityId); // get unique city id, if data is imported from more than one city from excel sheet

        //set the city specific building orders using sql quesry
        foreach($cityId as $val){
            $results = DB::select('SELECT @i:=0');
            $results = DB::update('UPDATE buildings SET `i_order` = @i:=@i+1 where `i_city_id`='.$val.' order by `i_order` asc, `updated_at` desc');
        }

        @unlink(BUILDING_IMPORT_PATH.$file_name); //remove uploaded file from server folder
        return "TRUE";
    }

    public function postImportToExcel(){
        $data = Input::get(); //fetch the posted data
        $base64_string = $data['data']; //store actual data in to an string
        $file_name = time().".".$data['ext']; //fetch the extantion and create a unique file name to store
        $file = BUILDING_IMPORT_PATH.$file_name; //store path of file

        //write posted data into a file on server
        $ifp = fopen($file, "wb");
        $data = explode(',', $base64_string);
        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        $objPHPExcel = PHPExcel_IOFactory::load($file); //load file object

        //convert file object data into array
        foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
            $building_dataArr[] = $worksheet->toArray();
        }

        $arrUser = Auth::user()->get(); //get id of current user, who modify the records
        $cityId = array();
        $unit_status = UnitStatus::lists('v_short_name','id'); //fetch the unit assets from database to an array

        $count_buildings = count($building_dataArr[0]); // count no of building records
        $building_data = $building_dataArr[0];

        //start processing on building records
        for($i=3; $i < $count_buildings ; $i++) {

            //if any filed have NULL value, than convert it into '' (blank) value.
            foreach($building_data[$i] as $key=>$val){
               if(is_null($building_data[$i][$key])) {
                    $building_data[$i][$key] = '';
               }
            }

            //city name and mask image name fields ahould not blank.
            if(trim($building_data[$i][0]) !='' &&  trim($building_data[$i][3]) !='') {

                if($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach'){
                    $city = City::where('v_name','LIKE',"%Orange County%")->select('id')->first()->toArray();
                } else if($building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham'){
                    $city = City::where('v_name','LIKE',"%Raleigh%")->select('id')->first()->toArray();
                } else {
                    $city = City::where('v_name','LIKE',"%".$building_data[$i][0]."%")->select('id')->first()->toArray();
                }

                array_push($cityId,$city['id']); //fetch the city id and store into array '$cityId'

                //check the name of building in db, if name is exists than system will update it, otherwise system will add new record into db
                $checkRecord = Building::where('v_name',$building_data[$i][1])->where('i_city_id',$city['id'])->first();
                $isEditrec = 0; //flag variable
                if(count($checkRecord) > 0){
                    $building = Building::find($checkRecord->id);
                    $isEditrec = 1;
                } else {
                    $building = new Building;
                    $isEditrec = 0;
                }

                if($isEditrec == 0) {
                    /* fetch lat and long of address to show it on google map */
                    $building_address = $building_data[$i][18].", ".$building_data[$i][19].", ".$building_data[$i][20].", ".$building_data[$i][21]." - ".$building_data[$i][22];
                    $address = urlencode($building_address);

                    if(isset($building_data[$i][22]) && $building_data[$i][22] != ''){
                        $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&components=postal_code:'.urlencode($building_data[$i][22]).'&sensor=false';
                    } else {
                        $google_api_address = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&sensor=false';
                    }
                    //'http://maps.google.com/maps/api/geocode/json?address='.$address.'&sensor=false'
                    $geocode=file_get_contents($google_api_address);

                    $output= json_decode($geocode); //Store values in variable
                    if($output->status == 'OK'){ // Check if address is available or not
                        $lat = $output->results[0]->geometry->location->lat; //Returns Latitude
                        $long = $output->results[0]->geometry->location->lng; // Returns Longitude
                        $building->d_lat = $lat;
                        $building->d_long = $long;
                    }
                }

                //if building name is not exists, than save address 1 line as building name
                if(isset($building_data[$i][1]) && trim($building_data[$i][1]) == ''){
                    $building->v_name = $building_data[$i][18];
                } else {
                    $building->v_name = $building_data[$i][1];
                }
                $building->i_city_id = $city['id'];

                if(isset($building_data[$i][2]) && $building_data[$i][2] != ''){
                    $nomfichierinitial=iconv("UTF-8", "CP1252", $building_data[$i][2]);
                    $accent   = 'ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŔŕƒ';
                    $noaccent = 'SOZsozYYuaaaaaaaceeeeiiiidnoooooouuuuybsaaaaaaaceeeeiiiidnoooooouuuyybyRra';
                    $string = strtr(utf8_decode($building_data[$i][2]),utf8_decode($accent),$noaccent);
                    $image_converted_name = strtr($string, $accent, $noaccent);
                    //check, if image name have special characters in it, than replace it with ASCII charcters and rename the image file on server
                    if($building_data[$i][2] != $image_converted_name) {
                        if(file_exists(BASE_HREF_FRONT.BUILDING_IMAGE_PATH.$nomfichierinitial)){
                            rename(WWW_ROOT.BUILDING_IMAGE_PATH.$nomfichierinitial, WWW_ROOT.BUILDING_IMAGE_PATH.$image_converted_name);
                        }
                        $building->v_image_url = $image_converted_name;
                    } else {
                        $building->v_image_url = $building_data[$i][2];
                    }
                }
                $building->i_order = $building_data[$i][3]; //building order
                $building->b_status = $building_data[$i][4]; //Status
                $building->i_year_built = $building_data[$i][5]; //Year Built/Renovated
                $building->v_submarket = $building_data[$i][6]; //Submarket

                //Class
                $building->e_class = $building_data[$i][7];
                if($building->e_class == 'A') $building->e_class = 'Class A'; //If value is 'A', than convert value to 'Class A'
                else if($building->e_class == 'B') $building->e_class = 'Class B'; //If value is 'B', than convert value to 'Class B'

                $building->i_rba =  $building_data[$i][8]; //RBA(s.f.)
                $building->i_rba = str_replace(',','',$building->i_rba); //remove comma from numberic string, save it as number value

                $building->i_avg_floor_plate = $building_data[$i][9]; //Avg. Floor Plate
                $building->i_avg_floor_plate = str_replace(',','',$building->i_avg_floor_plate); //remove comma from numberic string, save it as number value

                $building->i_total_vacant_sf = $building_data[$i][10]; //Total Vacant Surface
                $building->i_total_vacant_sf = str_replace(',','',$building->i_total_vacant_sf); //remove comma from numberic string, save it as number value

                $building->i_occupied = $building_data[$i][11]; //Occupied
                $building->i_occupied = str_replace(',','',$building->i_occupied); //remove comma from numberic string, save it as number value

                $building->i_direct_vacant_sf = $building_data[$i][12]; //Direct Vacant Surface
                $building->i_direct_vacant_sf = str_replace(',','',$building->i_direct_vacant_sf); //remove comma from numberic string, save it as number value

                $building->i_leased = $building_data[$i][13]; //Percent Leased(%)
                $building->d_rent = $building_data[$i][14]; //Direct Rent(FS)
                $building->v_owner = $building_data[$i][15]; //Owner

                //if leed = 'Yes', than save it as 1 value. If leed = 'No', than save it as 0 value
                if(ucfirst($building_data[$i][16]) == 'Yes'){
                    $building->i_leed = '1';
                } else {
                    $building->i_leed = '0';
                }

                $building->e_leed_cert = $building_data[$i][17]; //Leed Certificate
                //if($building->e_leed_cert != '' && $building->e_leed_cert != 'No'){ $building->i_leed = '1'; } else { $building->e_leed_cert = ''; }

                $building->v_address1 = $building_data[$i][18]; //Address 1

                if($building_data[$i][19] == '' && ($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach' || $building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham')){
                    $building_data[$i][19] = $building_data[$i][0]; //add city name into address 2 field
                } else if ($building_data[$i][19] != '' && ($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach' || $building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham')) {
                    $building_data[$i][19] = $building_data[$i][19]." - ".$building_data[$i][0]; //append city name into address 2 field
                }

                $building->v_address2 = $building_data[$i][19]; //Address 2
                //$building_data[$i][20] :  City Name
                $building->v_state = $building_data[$i][21];  //State
                $building->v_zip = $building_data[$i][22];    //Zipcode

                if($isEditrec == '0') { //if this is a new record to enter in db
                    $building->i_floor_number = $building_data[$i][23]; //No. of Floors
                    $building->i_display_no_of_floors = $building_data[$i][23]; //display floors
                } else {
                    $building->i_display_no_of_floors = $building_data[$i][23]; //No. of Floors
                    if(isset($building->i_floor_number) and $building->i_floor_number <= 0) {
                        $building->i_floor_number = $building_data[$i][23]; //No. of Floors
                    }
                }

                //$building_data[$i][24] : Floor Height
                $building->is_default = '0';  //Is Default Selected on City Detail Page?
                $building->i_user_id = $arrUser->id; //Logged in user's id
                $building->e_source = 'Excel';  //source is from excel, so admin have to regenerate image in admin panel.
                $building->save(); //save records in buildings table


                $validateFlag = 0;
                $floorNo = 1; //initialise floor number
                $endColumnNo = (25 + $building->i_floor_number);
                for($j=25; $j < $endColumnNo; $j++) {
                    $jsonArray = $jsonCheckArray = array();
                    $additional_margin_string = ''; //if this is an edit record and left/right margin is already set than save it in this string

                    if(count($checkRecord) > 0) {
                        //if this is edit record, get the information of current floor ($floorNo)
                        $floor = Floor::where('i_building_id',$building->id)->where('i_floor_number',$floorNo)->first();
                        if(count($floor) <= 0){
                            $floor = new Floor; //if record not exists in db, than create new record for current floor number
                        } else {
                            /* To append Left and Right values */
                            $newArr = $floor->toArray();
                            if(isset($newArr['t_config']) && $newArr['t_config'] != '{"":""}' && $newArr['t_config'] != '' ){
                                $newArr['t_config'] = str_replace('{{','{',$newArr['t_config']); //correct the record, if there is additional { (breacket) (we found it in excel)
                                $newArr['t_config'] = str_replace('}}','}',$newArr['t_config']); //correct the record, if there is additional } (breacket) (we found it in excel)
                                $jsonArray = json_decode($newArr['t_config'], true);
                                if(!empty($jsonArray)){
                                    foreach($jsonArray as $key=>$val){
                                        if($key == 'L' || $key == 'R'){
                                            $additional_margin_string .= '"'.$key.'":"'.$val.'",'; //if this is an edit record and left/right margin is already set than save it in this string
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        $floor = new Floor;
                    }

                    $building_data[$i][$j] = str_replace('(','{',$building_data[$i][$j]);
                    $building_data[$i][$j] = str_replace(')','}',$building_data[$i][$j]);
                    $building_data[$i][$j] = str_replace('{{','{',$building_data[$i][$j]); //correct the record, if there is additional { (breacket) (we found it in excel)
                    $building_data[$i][$j] = str_replace('}}','}',$building_data[$i][$j]); //correct the record, if there is additional } (breacket) (we found it in excel)
                    if($building_data[$i][$j] == 'N/A') {
                        $floor->t_config = '';  //correct the record, if value is 'N/A'
                    } else {
                        $floor->t_config = $building_data[$i][$j];
                    }

                    $floor->i_floor_number = $floorNo; // floor number
                    $floor->i_building_id = $building->id; // building id
                    $floor->i_user_id = $arrUser->id; //user id, who edits the record

                    if($floor->t_config != '') {
                        //corrections on wrongly formated json string, if there is " (double quote) on json sting and but brackets '{' '}' are not available
                        if(strpos($floor->t_config,'"') >= 0 && (strpos($floor->t_config, '{') === false && strpos($floor->t_config,'}')=== false) ) {
                            $floor->t_config = '{'.$floor->t_config.'}';
                        }
                        //corrections on wrongly formated json data, if there is no " (double quote) and no brackets '{' '}' are available on json string
                        else if(strpos($floor->t_config,'"') === false && strpos($floor->t_config, '{') === false && strpos($floor->t_config,'}')=== false)  {
                            $explode_by_comma = explode(",", $floor->t_config);
                            $updated_string = '';
                            foreach($explode_by_comma as $key=>$val){
                                $explode_by_colon = explode(":", $val);
                                $updated_string .= '"'.trim($explode_by_colon[0]).'":"'.trim($explode_by_colon[1]).'",';
                            }
                            $updated_string = rtrim($updated_string, ',');
                            $floor->t_config = '{'.$updated_string.'}';
                        }

                        //correct json string and convert unit status string into db id to store unit status value in dynamic format
                        foreach($unit_status as $index => $status){
                            $floor->t_config = str_ireplace('{"'.$status.'":','{"'.$index.'":',$floor->t_config); //modify starting values
                            $floor->t_config = str_ireplace(',"'.$status.'":',',"'.$index.'":',$floor->t_config); //modify all values, except start one
                        }

                        if($additional_margin_string != ''){ //if there left/right margin is already exists
                            //remove last } (bracket) from json string and append left/right margin
                            $floor->t_config = str_ireplace('}',",".rtrim($additional_margin_string,",")."}",$floor->t_config);
                        }
                    } else {
                        if($additional_margin_string != ''){
                            $floor->t_config = "{".rtrim($additional_margin_string,",")."}"; //append left/margin values
                        } else {
                            $floor->t_config = '{"":""}'; //save black json string
                        }
                    }

                    $jsonCheckArray = json_decode($floor->t_config, true);
                    if(empty($jsonCheckArray) || count($jsonCheckArray) == 0){
                        $validateFlag = 1;
                    }

                    $floor->save(); //save record in floor table
                    $floorNo++; //increment floor number value to 1
                }

                if(isset($validateFlag) && $validateFlag != ''){
                    $building->is_error = $validateFlag;
                    $building->save(); //if there is any error, while reading the json string, set 'is_error' flag to 1 (it is just for confirmation purpose)
                }

                //delete the extra floor records, whose records are greather then no. of floors (if it is by mistakely added)
                $delete_floor = Floor::where('i_building_id',$building->id)->where('i_floor_number','>',$building->i_floor_number);
                if(count($delete_floor) > 0){
                    $delete_floor->delete();
                }
            }
        }

        $cityId = array_unique($cityId); // get unique city id, if data is imported from more than one city from excel sheet

        //set the city specific building orders using sql quesry
        foreach($cityId as $val){
            $results = DB::select('SELECT @i:=0');
            $results = DB::update('UPDATE buildings SET `i_order` = @i:=@i+1 where `i_city_id`='.$val.' order by `i_order` asc, `updated_at` desc');
        }

        @unlink(BUILDING_IMPORT_PATH.$file_name); //remove uploaded file from server folder
        return "TRUE";
    }


    public function postImportToExcel_15_may(){
        $data = Input::get();
        $base64_string = $data['data'];
        $file_name = time().".".$data['ext'];
        $file = BUILDING_IMPORT_PATH.$file_name;

        $ifp = fopen($file, "wb");
        $data = explode(',', $base64_string);
        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        $objPHPExcel = PHPExcel_IOFactory::load($file);

        foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
            $building_dataArr[] = $worksheet->toArray();
        }

        $arrUser = Auth::user()->get(); $cityId = array();
        $unit_status = UnitStatus::lists('v_short_name','id');

        $count_buildings = count($building_dataArr[0]);
        $building_data = $building_dataArr[0];

        for($i=3; $i < $count_buildings ; $i++){

            foreach($building_data[$i] as $key=>$val){
               if(is_null($building_data[$i][$key])) {
                    $building_data[$i][$key] = '';
               }
            }
            if(trim($building_data[$i][0]) !='' &&  trim($building_data[$i][3]) !='') {//trim($building_data[$i][2]) !='' &&

                if($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach'){
                    $city = City::where('v_name','LIKE',"%Orange County%")->select('id')->first()->toArray();
                } else if($building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham'){
                    $city = City::where('v_name','LIKE',"%Raleigh%")->select('id')->first()->toArray();
                } else {
                    $city = City::where('v_name','LIKE',"%".$building_data[$i][0]."%")->select('id')->first()->toArray();
                }

                array_push($cityId,$city['id']);

                $checkRecord = Building::where('v_name',$building_data[$i][1])->where('i_city_id',$city['id'])->first();
                if(count($checkRecord) > 0){
                    $building = Building::find($checkRecord->id);
                } else {
                    $building = new Building;
                }
                /* For lat and long */
                $building_address = $building_data[$i][18].", ".$building_data[$i][19].", ".$building_data[$i][20]."-".$building_data[$i][21];
                $address = urlencode($building_address);

                $geocode=file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$address.'&sensor=false');

                $output= json_decode($geocode); //Store values in variable

                if($output->status == 'OK'){ // Check if address is available or not
                    $lat = $output->results[0]->geometry->location->lat; //Returns Latitude
                    $long = $output->results[0]->geometry->location->lng; // Returns Longitude
                    $building->d_lat = $lat;
                    $building->d_long = $long;
                }

                if(isset($building_data[$i][1]) && trim($building_data[$i][1]) == ''){
                    $building->v_name = $building_data[$i][18];
                } else {
                    $building->v_name = $building_data[$i][1];
                }
                $building->i_city_id = $city['id'];
                if(isset($building_data[$i][2]) && $building_data[$i][2] != ''){
                    $nomfichierinitial=iconv("UTF-8", "CP1252", $building_data[$i][2]);
                    $accent   = 'ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŔŕƒ';
                    $noaccent = 'SOZsozYYuaaaaaaaceeeeiiiidnoooooouuuuybsaaaaaaaceeeeiiiidnoooooouuuyybyRra';
                    $string = strtr(utf8_decode($building_data[$i][2]),utf8_decode($accent),$noaccent);
                    $image_converted_name = strtr($string, $accent, $noaccent);
                    if(file_exists(BASE_HREF_FRONT.BUILDING_IMAGE_PATH.$nomfichierinitial)){
                        rename(WWW_ROOT.BUILDING_IMAGE_PATH.$nomfichierinitial, WWW_ROOT.BUILDING_IMAGE_PATH.$image_converted_name);
                    }
                    $building->v_image_url = $image_converted_name;
                } else {
                    $building->v_image_url = '';
                }
                //$building->v_image_url = $building_data[$i][2];
                $building->i_order = $building_data[$i][3];
                $building->b_status = $building_data[$i][4];
                $building->i_year_built = $building_data[$i][5];
                $building->v_submarket = $building_data[$i][6];
                $building->e_class = $building_data[$i][7];
                if($building->e_class == 'A') $building->e_class = 'Class A';
                else if($building->e_class == 'B') $building->e_class = 'Class B';
                $building->i_rba =  $building_data[$i][8];
                $building->i_rba = str_replace(',','',$building->i_rba);

                $building->i_avg_floor_plate = $building_data[$i][9];
                $building->i_avg_floor_plate = str_replace(',','',$building->i_avg_floor_plate);

                $building->i_total_vacant_sf = $building_data[$i][10];
                $building->i_total_vacant_sf = str_replace(',','',$building->i_total_vacant_sf);

                $building->i_occupied = $building_data[$i][11];
                $building->i_occupied = str_replace(',','',$building->i_occupied);
                $building->i_direct_vacant_sf = $building_data[$i][12];
                $building->i_direct_vacant_sf = str_replace(',','',$building->i_direct_vacant_sf);

                $building->i_leased = $building_data[$i][13];
                $building->d_rent = $building_data[$i][14];
                $building->v_owner = $building_data[$i][15];
                if(ucfirst($building_data[$i][16]) == 'Yes'){ $building->i_leed = '1'; }
                else { $building->i_leed = '0'; }
                $building->e_leed_cert = $building_data[$i][17];
                if($building->e_leed_cert != '' && $building->e_leed_cert != 'No'){
                    $building->i_leed = '1';
                } else {
                    $building->e_leed_cert = '';
                }
                $building->v_address1 = $building_data[$i][18];

                if($building_data[$i][19] == '' && ($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach' || $building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham')){
                    $building_data[$i][19] = $building_data[$i][0];
                } else if ($building_data[$i][19] != '' && ($building_data[$i][0] == 'Irvine' || $building_data[$i][0] == 'Costa Mesa' || $building_data[$i][0] == 'Newport Beach' || $building_data[$i][0] == 'Raleigh' || $building_data[$i][0] == 'Durham')) {
                    $building_data[$i][19] = $building_data[$i][19]." - ".$building_data[$i][0];
                }

                $building->v_address2 = $building_data[$i][19];
                //$building_data[$i][20] :  City Name
                $building->v_state = $building_data[$i][21];
                $building->v_zip = $building_data[$i][22];
                $building->i_floor_number = $building_data[$i][23];
                //$building_data[$i][24] : Floor Height
                $building->is_default = '0';
                $building->i_user_id = $arrUser->id;
                $building->e_source = 'Excel';
                $building->save();
                $validateFlag = 0;
                $floorNo = 1;
                for($j=25; $j < 25 + $building->i_floor_number; $j++){
                    $jsonArray = $jsonCheckArray = array();
                    $additional_margin_string = '';
                    if(count($checkRecord) > 0){
                        $floor = Floor::where('i_building_id',$building->id)->where('i_floor_number',$floorNo)->first();
                        if(count($floor) <= 0){
                            $floor = new Floor;
                        } else {
                            /* To append Left and Right values */
                            $newArr = $floor->toArray();
                            if(isset($newArr['t_config']) && $newArr['t_config'] != '{"":""}' && $newArr['t_config'] != '' ){
                                /*if($building_data[$i][0] == 'Stamford'){
                                    $newArr['t_config'] = '{'.$newArr['t_config'].'}';
                                }*/
                                /*if($building_data[$i][0] == 'Chicago'){
                                    $explode_by_comma = explode(",", $floor->t_config);
                                    $updated_string = '';
                                    foreach($explode_by_comma as $key=>$val){
                                        $explode_by_colon = explode(":", $val);
                                        $updated_string .= '"'.trim($explode_by_colon[0]).'":"'.trim($explode_by_colon[1]).'",';
                                    }
                                    $updated_string = rtrim($updated_string, ',');
                                    $newArr['t_config'] = '{'.$updated_string.'}';
                                }*/
                                $newArr['t_config'] = str_replace('{{','{',$newArr['t_config']);
                                $newArr['t_config'] = str_replace('}}','}',$newArr['t_config']);
                                $jsonArray = json_decode($newArr['t_config'], true);
                                /*if(empty($jsonArray) || count($jsonArray) == 0){
                                    echo $building_data[$i][1];
                                    echo $newArr['t_config']; exit;
                                }*/

                                if(!empty($jsonArray)){
                                    foreach($jsonArray as $key=>$val){
                                        if($key == 'L' || $key == 'R'){
                                            $additional_margin_string .= '"'.$key.'":"'.$val.'",';
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        $floor = new Floor;
                    }
                    $building_data[$i][$j] = str_replace('{{','{',$building_data[$i][$j]);
                    $building_data[$i][$j] = str_replace('}}','}',$building_data[$i][$j]);
                    if($building_data[$i][$j] == 'N/A'){
                        $floor->t_config = '';
                    } else {
                        $floor->t_config = $building_data[$i][$j];
                    }
                    if($building_data[$i][$j] != '' && $building_data[$i][$j] != 'N/A' && $building_data[$i][0] != 'Stamford' && $building_data[$i][0] != 'Charlotte' && $building_data[$i][0] != 'Houston' && $building_data[$i][0] != 'Chicago' && $building_data[$i][0] != 'Cincinnati' && $building_data[$i][0] != 'Columbus'){
                        $jsonCheckArray = json_decode($building_data[$i][$j], true);
                        if(empty($jsonCheckArray) || count($jsonCheckArray) == 0){
                            $validateFlag = 1;
                        }
                    }
                    $floor->i_floor_number = $floorNo;
                    $floor->i_building_id = $building->id;
                    $floor->i_user_id = $arrUser->id;
                    if($floor->t_config != ''){
                        if($building_data[$i][0] == 'Stamford' || $building_data[$i][0] == 'Charlotte' || $building_data[$i][0] == 'Houston'){
                            $floor->t_config = '{'.$floor->t_config.'}';
                        }
                        if($building_data[$i][0] == 'Chicago' || $building_data[$i][0] == 'Cincinnati' || $building_data[$i][0] == 'Columbus'){
                            $explode_by_comma = explode(",", $floor->t_config);
                            $updated_string = '';
                            foreach($explode_by_comma as $key=>$val){
                                $explode_by_colon = explode(":", $val);
                                $updated_string .= '"'.trim($explode_by_colon[0]).'":"'.trim($explode_by_colon[1]).'",';
                            }
                            $updated_string = rtrim($updated_string, ',');
                            $floor->t_config = '{'.$updated_string.'}';
                        }
                        foreach($unit_status as $index => $status){
                            $floor->t_config = str_ireplace('{"'.$status.'":','{"'.$index.'":',$floor->t_config);
                            $floor->t_config = str_ireplace(',"'.$status.'":',',"'.$index.'":',$floor->t_config);
                            $floor->t_config = str_ireplace('{":"}','{"":""}',$floor->t_config);
                            $floor->t_config = str_ireplace(':"}',':""}',$floor->t_config);
                            $floor->t_config = str_ireplace(':",',':"",',$floor->t_config);
                        }
                        if($additional_margin_string != ''){
                            $floor->t_config = str_ireplace('}',",".rtrim($additional_margin_string,",")."}",$floor->t_config);
                        }
                    } else {
                        if($additional_margin_string != ''){
                            $floor->t_config = "{".rtrim($additional_margin_string,",")."}";
                        } else {
                            $floor->t_config = '{"":""}';
                        }
                    }
                    $floor->save();
                    $floorNo++;
                }

                if(isset($validateFlag) && $validateFlag != ''){
                    $building->is_error = $validateFlag;
                    $building->save();
                }

                $delete_floor = Floor::where('i_building_id',$building->id)->where('i_floor_number','>',$building->i_floor_number);
                if(count($delete_floor) > 0){
                    $delete_floor->delete();
                }
            }
        }
        $cityId = array_unique($cityId);
        foreach($cityId as $val){
            $results = DB::select('SELECT @i:=0');
            $results = DB::update('UPDATE buildings SET `i_order` = @i:=@i+1 where `i_city_id`='.$val.' order by `i_order` asc, `updated_at` desc');
        }

        @unlink(BUILDING_IMAGE_PATH.'import_file.xls');
        return "TRUE";
    }
    public function postImportToExcel_old(){
        $data = Input::get();
        $base64_string = $data['data'];
        $output_file = BUILDING_IMAGE_PATH.'import_file.xls';
        $ifp = fopen($output_file, "wb");
        $data = explode(',', $base64_string);
        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        $objPHPExcel = PHPExcel_IOFactory::load(BUILDING_IMAGE_PATH.'import_file.xls');
        foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
            $building_data =  $worksheet->toArray();
        }

        $arrUser = Auth::user()->get(); $cityId = array();
        $unit_status = UnitStatus::lists('v_name','id');
        for($i=1; $i < count($building_data); $i++){

            if(trim($building_data[$i][0]) !='' && trim($building_data[$i][1]) !='' && trim($building_data[$i][2]) !='' && trim($building_data[$i][3]) !='') {

                $city = City::where('v_name','LIKE',"%".$building_data[$i][1]."%")->select('id')->first()->toArray();
                array_push($cityId,$city['id']);

                $checkRecord = Building::where('v_name',$building_data[$i][0])->where('i_city_id',$city['id'])->first();
                if(count($checkRecord) > 0){
                    $building = Building::find($checkRecord->id);
                } else {
                    $building = new Building;
                }
                /* For lat and long */
                $building_address = $building_data[$i][18].", ".$building_data[$i][19].", ".$building_data[$i][20]."-".$building_data[$i][21];
                $address = urlencode($building_address);

                $geocode=file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$address.'&sensor=false');

                $output= json_decode($geocode); //Store values in variable

                if($output->status == 'OK'){ // Check if address is available or not
                    $lat = $output->results[0]->geometry->location->lat; //Returns Latitude
                    $long = $output->results[0]->geometry->location->lng; // Returns Longitude
                    $building->d_lat = $lat;
                    $building->d_long = $long;
                }

                $building->v_name = $building_data[$i][0];
                $building->i_city_id = $city['id'];
                $building->i_order = $building_data[$i][2];
                $building->v_image_url = $building_data[$i][3];
                $building->b_status = $building_data[$i][4];
                $building->i_year_built = $building_data[$i][5];
                $building->v_submarket = $building_data[$i][6];
                $building->e_class = $building_data[$i][7];
                $building->i_rba =  $building_data[$i][8];
                $building->i_avg_floor_plate = $building_data[$i][9];
                $building->i_total_vacant_sf = $building_data[$i][10];
                $building->i_occupied = $building_data[$i][11];
                $building->i_direct_vacant_sf = $building_data[$i][12];
                $building->i_leased = $building_data[$i][13];
                $building->d_rent = $building_data[$i][14];
                $building->v_owner = $building_data[$i][15];
                $building->i_leed = $building_data[$i][16];
                $building->e_leed_cert = $building_data[$i][17];
                $building->v_address1 = $building_data[$i][18];
                $building->v_address2 = $building_data[$i][19];
                $building->v_state = $building_data[$i][20];
                $building->v_zip = $building_data[1][21];
                $building->i_floor_number = $building_data[$i][22];
                $building->is_default = $building_data[$i][23];
                $building->i_user_id = $arrUser->id;
                $building->e_source = 'Excel';
                $building->save();
                $floorNo = 1;

                for($j=24; $j < 24 + $building->i_floor_number; $j++){
                    if(count($checkRecord) > 0){
                        $floor = Floor::where('i_building_id',$building->id)->where('i_floor_number',$floorNo)->first();
                        if(count($floor) <= 0){
                            $floor = new Floor;
                        }
                     }else{
                        $floor = new Floor;
                     }
                    $floor->t_config = $building_data[$i][$j];
                    $floor->i_floor_number = $floorNo;
                    $floor->i_building_id = $building->id;
                    $floor->i_user_id = $arrUser->id;
                    if($floor->t_config != ''){
                        foreach($unit_status as $index => $status){
                            $floor->t_config = str_ireplace('{"'.$status.'":','{"'.$index.'":',$floor->t_config);
                            $floor->t_config = str_ireplace(',"'.$status.'":',',"'.$index.'":',$floor->t_config);
                            $floor->t_config = str_ireplace('{":"}','{"":""}',$floor->t_config);
                            $floor->t_config = str_ireplace(':"}',':""}',$floor->t_config);
                            $floor->t_config = str_ireplace(':",',':"",',$floor->t_config);
                        }
                    }else{
                        $floor->t_config = '{"":""}';
                    }

                    $floorNo++;
                    $floor->save();
                }
                $delete_floor = Floor::where('i_building_id',$building->id)->where('i_floor_number','>',$building->i_floor_number);
                if(count($delete_floor) > 0){
                    $delete_floor->delete();
                }

            }
        }
        $cityId = array_unique($cityId);
        foreach($cityId as $val){
            $results = DB::select('SELECT @i:=0');
            $results = DB::update('UPDATE buildings SET `i_order` = @i:=@i+1 where `i_city_id`='.$val.' order by `i_order` asc, `updated_at` desc');
        }

        @unlink(BUILDING_IMAGE_PATH.'import_file.xls');
        return "TRUE";
    }


    public function postUploadForIe(){
        return ((isset($_FILES["v_img"]) and $_FILES["v_img"]["error"] == 0) ? 'data:image/' . pathinfo($_FILES["v_img"]["name"], PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($_FILES["v_img"]["tmp_name"])):"0");
    }
}
?>
