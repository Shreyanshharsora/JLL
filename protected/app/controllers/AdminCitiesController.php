<?php
class AdminCitiesController extends BaseController
{
    /* Use for cms listing*/
	public function postIndex()
	{
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }

        $data = Input::get();
        $city = new City;
        //pr($data); exit;

        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$city = $city->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $city = $city->orderBy('updated_at','DESC');
		}

        if(isset($data['search_fields']['v_name']) && $data['search_fields']['v_name']!=""){
			$city = $city->where('v_name', 'LIKE',"%".$data['search_fields']['v_name']."%");
		}

		if(isset($data['search_fields']['v_slug']) && $data['search_fields']['v_slug']!=""){
			$city = $city->where('v_slug', 'LIKE',"%".$data['search_fields']['v_slug']."%");
		}
        if(isset($data['search_fields']['d_floor_height']) && $data['search_fields']['d_floor_height']!=""){
			$city = $city->where('d_floor_height', '=',$data['search_fields']['d_floor_height']);
		}
        if(isset($data['search_fields']['status']) && $data['search_fields']['status']!=""){
			$city = $city->where('i_status','=',$data['search_fields']['status']);
		}
        if(isset($data['search_fields']['i_country_id']) && $data['search_fields']['i_country_id']!=""){
			$city = $city->where('i_country_id', '=',$data['search_fields']['i_country_id']);
		}
        if(isset($data['search_fields']['v_email']) && $data['search_fields']['v_email']!=""){
			$city = $city->where('v_email', '=',$data['search_fields']['v_email']);
		}

        $city->join('countries', 'countries.id', '=', 'cities.i_country_id');
        $city->select('countries.id as country_id','countries.name as country_name','countries.abbreviation','cities.*');


        $city = $city->paginate($data['rec_per_page']);
        $arrCms = $city->toArray();
        $arrCms['country'] = Country::All()->toArray();
        $results = [
    	    'items' => $arrCms['data'],
            'country' => $arrCms['country'],
            '_meta' => [
    	        'total'        => $city->getTotal(),
    	        'rpp'     => $city->getPerPage(),
    	        'current' => $city->getCurrentPage(),
    	        'last_page'    => $city->getLastPage(),
    	        'from'         => $city->getFrom(),
    	        'to'           => $city->getTo()
    	    ]
    	];
        return json_encode($results);
	}

    public function postAdd()
	{
        $data = Input::get();

        if(!empty($data)){
            /*$validator = Validator::make(Input::all(), array("v_slug" =>'unique:cities,v_slug,deleted_at'));
            if ($validator->fails()) {
                $messages['error'] = $validator->messages()->toArray();
                return  $messages;
                exit;
            }*/

            $cities_data = City::where('v_slug', $data['v_slug'])->count();
            if($cities_data > 0){
                $messages['error']["v_slug"] = "['The v slug has already been taken.']";
                return  $messages;
                exit;
            }

            /* Save Image */
            $v_random_image = time().'-'.str_random(6);
            /*$base64_fullImg = $data['v_image_url'].'=';
            $path = CITIES_IMAGE_PATH;
            $imageName = $this->saveImage($base64_fullImg, $v_random_image, $path);
            if($imageName){*/
                $base64_backgroundImg = $data['v_background_image_url'].'=';
                $path = CITY_BACKGROUND_IMAGE_PATH;
                $backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path);
                if($backgroundImageName){
                    $base64_backgroundImg = $data['transparent_background_image'].'=';
                    $path = TRANSPARENT_CITY_BACKGROUND_IMAGE_PATH;
                    $this->saveImage($base64_backgroundImg, $v_random_image, $path);
                }
            //}

            $city = new City;
            $city->i_country_id = $data['i_country_id'];
            $city->v_name = $data['v_name'];
            $city->v_slug = $data['v_slug'];
            //$city->v_image_url = $imageName;
            $city->v_background_image_url = $backgroundImageName;
            $city->v_skyline_title = $data['v_skyline_title'];
            if(!isset($data['v_skyline_tagline'])) $data['v_skyline_tagline'] = '';
            $city->v_skyline_tagline = $data['v_skyline_tagline'];
            $city->t_skyline_body = $data['t_skyline_body'];
            $city->d_floor_height = $data['d_floor_height'];
            $city->v_email = $data['v_email'];
            $city->v_download_button_text = $data['v_download_button_text'];
            $city->v_download_pdf = '';
            if(isset($data['v_upload_file']) && $data['v_upload_file'] != '') {
                rename(TEMP_CITY_PDF_PATH.$data['v_upload_file'], CITY_PDF_FILE_PATH.$data['v_upload_file']);
                glob(TEMP_CITY_PDF_PATH.'{,.}*', GLOB_BRACE);
                $city->v_download_pdf = $data['v_upload_file'];
            }
            $city->i_status = $data['i_status'];
            if($city->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }

        }else{
            $country = Country::all();
            return $country;
        }
    }

    public function anyUploadPdf(){
        $data = Input::all();
        $files = glob( TEMP_CITY_PDF_PATH . '*', GLOB_MARK ); //GLOB_MARK adds a slash to directories returned
        foreach($files as $file_remove) {
            unlink($file_remove);
        }
        if(count($data) > 0) {
            $file = $data['file_upload'];
            $fileType = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
            if($fileType == 'PDF' || $fileType == 'pdf') {
                $file_name = $file->getClientOriginalName();
    			$image_name =  time()."_".$file_name;
    			$success =  $file->move(TEMP_CITY_PDF_PATH,$image_name);
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

    public function postEdit()
	{
	    $data = Input::get();
        if(!empty($data)){
            $cities_data = City::where('v_slug', $data['v_slug'])->where('id', '!=', $data['id'])->count();
            if($cities_data > 0){
                $messages['error']["v_slug"] = "['The v slug has already been taken.']";
                return  $messages;
                exit;
            }

            $city = City::find($data['id']);
            $backgroundImageName = '';
            $v_random_image = time().'-'.str_random(6);
            if($data['image_type_grid'] == 'New'){
                @unlink(CITY_BACKGROUND_IMAGE_PATH.$city->v_background_image_url);
                @unlink(TRANSPARENT_CITY_BACKGROUND_IMAGE_PATH.$city->v_background_image_url);
            }
            if($data['image_type_grid'] == 'New'){
                $base64_backgroundImg = $data['v_background_image_url'].'=';
                $path = CITY_BACKGROUND_IMAGE_PATH;
                $backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path);
                if($backgroundImageName){
                    $base64_backgroundTransParentImg = $data['transparent_background_image'].'=';
                    $path = TRANSPARENT_CITY_BACKGROUND_IMAGE_PATH;
                    $this->saveImage($base64_backgroundTransParentImg, $v_random_image, $path);
                }
                $city->v_background_image_url = $backgroundImageName;
            }
            /*if($city->v_image_url != $data['v_image_url']){
                $base64_fullImg = $data['v_image_url'].'=';
                $path = CITIES_IMAGE_PATH;
                $city->v_image_url = $this->saveImage($base64_fullImg, $v_random_image, $path);
            }*/
            
            if(isset($data['v_upload_file']) && $data['v_upload_file'] != '' && $data['v_upload_file'] != $city->v_download_pdf) {
                rename(TEMP_CITY_PDF_PATH.$data['v_upload_file'], CITY_PDF_FILE_PATH.$data['v_upload_file']);
                @unlink(CITY_PDF_FILE_PATH.$city->v_download_pdf);
                glob(TEMP_CITY_PDF_PATH.'{,.}*', GLOB_BRACE);
                $city->v_download_pdf = $data['v_upload_file'];
            }

            $city->i_country_id = $data['i_country_id'];
            $city->v_name = $data['v_name'];
            $city->v_slug = $data['v_slug'];
            $city->v_skyline_title = $data['v_skyline_title'];
            if(!isset($data['v_skyline_tagline'])) $data['v_skyline_tagline'] = '';
            $city->v_skyline_tagline = $data['v_skyline_tagline'];
            $city->t_skyline_body = $data['t_skyline_body'];
            $city->d_floor_height = $data['d_floor_height'];
            $city->v_email = $data['v_email'];
            $city->v_download_button_text = $data['v_download_button_text'];
            $city->i_status = $data['i_status'];
            if($city->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }else{
            $country = Country::all();
            return $country;
        }
    }

    public function postChangeStatus(){
        $data = Input::get();
        if(!empty($data)){

            $city = City::find($data['id']);
            $city->i_status = $data['status'];

            if($city->save()){
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
            $city = City::find($data['id']);
            if($city->delete()){
                CityAsset::where('i_city_id', $data['id'])->delete();
                Building::where('i_city_id', $data['id'])->delete();
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }

    public function anyData($id)
    {
        $city = new City;
        $city = $city->where('id','=',$id)->first();
        $arrCity = $city->toArray();
        $arrCity['v_download_pdf'] = substr($arrCity['v_download_pdf'], (1+strpos($arrCity['v_download_pdf'], '_')) );
        $results = array('items' => $arrCity);
        return json_encode($results);
    }

    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
                City::whereIn('id', array_values($data['id']))->delete();
                CityAsset::whereIn('i_city_id', array_values($data['id']))->delete();
                Building::whereIn('i_city_id', array_values($data['id']))->delete();
                echo '1';
            }else  if ($action == "act") { //Active Action
                City::whereIn('id', array_values($data['id']))->update(array("i_status" =>"1"));
                 echo "1";
            } else  if ($action == "inact") { //Inctive Action
                City::whereIn('id', array_values($data['id']))->update(array("i_status" =>"0"));
                echo "1";
            }
        }
    }



    public function anyExport($parameters = null)
    {
        Excel::create('city_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('City'  , function($sheet) use ($parameters)
            {
                $query = City::query();

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

                    if(isset($v_name) && $v_name!=""){
            			$query = $query->where('v_name', 'LIKE',"%".$v_name."%");
            		}
                    if(isset($v_slug) && $v_slug!=""){
                        $query = $query->where('v_slug', 'LIKE',"%".$v_slug."%");
                    }
            		if(isset($i_status) && $i_status!=""){
            			$query = $query->where('i_status', '=',$i_status);
            		}
                    if(isset($d_floor_height) && $d_floor_height!=""){
            			$query = $query->where('d_floor_height', '=',$d_floor_height);
            		}
                    if(isset($i_country_id) && $i_country_id!=""){
            			$query = $query->where('i_country_id', '=',$i_country_id);
            		}
                    if(isset($v_email) && $v_email!=""){
            			$query = $query->where('v_email', '=',$v_email);
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');
                }

                $query->select('id','i_country_id','v_name','v_slug','v_image_url','v_skyline_title','v_skyline_tagline','t_skyline_body','d_floor_height','v_email','i_status','created_at','updated_at');
        		$records = $query->get()->toArray();

                $field['no'] = 'Sr.No';
                $field['i_country_id'] = 'Country';
                $field['v_name'] = 'Name';
                $field['v_slug'] = 'Url';
                $field['v_image_url'] = 'Image';
                $field['v_skyline_title'] = 'Skyline Title';
                $field['v_skyline_tagline']= 'Tag Line';
                $field['t_skyline_body'] = 'Skyline Body';
                $field['d_floor_height'] = 'Floor Height';
                $field['v_email'] = 'Email';
                $field['i_status'] = 'Status';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';

                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:M1');
                $sheet->setWidth(array('A' => 8,'B' => 20,'C' => 20,'D' => 20,'E' => 20,'F' => 30,'G' => 20,'H' => 60,'I' => 10, 'J' => 20, 'K' => 10, 'L' => 20, 'M' => 20 ));

                $sheet->cells('A1:M1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });

                $sheet->row(1,array('Cities'));

                $sheet->cells('A2:M2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });

                $sheet->row(2,$field);

                $country = Country::lists('name','id');
                $intCount = 3;
                $srNo=1;
                foreach($records as $val){
                    $val['id'] = $srNo;
                    if($val['i_status'] == '1'){
                        $val['i_status'] = 'Active';
                    }else{
                        $val['i_status'] = 'Inactive';
                    }
                    $val['i_country_id'] = $country[$val['i_country_id']];
                    $sheet->row($intCount, $val);
                    $intCount++;
                    $srNo++;
                }
            });

        })->download('xlsx');
    }

    public function postCheckUrlExist(){
        $data = Input::get();

        if(!empty($data) && $data['v_slug'] != ''){
            $city_data = new City;
            $city_data = $city_data->where('v_slug','=',$data['v_slug']);
            if(isset($data['id']) && $data['id'] != ''){
                $city_data = $city_data->where('id','!=',$data['id']);
            }
            $city_data = $city_data->get()->toArray();

            if(!empty($city_data)){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        } else {
            return 'FALSE';
        }
    }


    public function postUploadForIe(){
        return ((isset($_FILES["v_img"]) and $_FILES["v_img"]["error"] == 0) ? 'data:image/' . pathinfo($_FILES["v_img"]["name"], PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($_FILES["v_img"]["tmp_name"])):"0");
    }
}
?>
