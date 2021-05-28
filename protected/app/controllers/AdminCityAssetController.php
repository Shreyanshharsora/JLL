<?php
class AdminCityAssetController extends BaseController 
{
    /* Use for cms listing*/
	public function postIndex()
	{
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }
        
        $data = Input::get();
        $city_asset = new CityAsset;
        
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$city_asset = $city_asset->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $city_asset = $city_asset->orderBy('updated_at','DESC');
		}
        
        if(isset($data['search_fields']['i_asset_order']) && $data['search_fields']['i_asset_order']!=""){
			$city_asset = $city_asset->where('i_asset_order',$data['search_fields']['i_asset_order']);
		}
        
        if(isset($data['search_fields']['i_city_id']) && $data['search_fields']['i_city_id']!=""){
			$city_asset = $city_asset->where('i_city_id', '=',$data['search_fields']['i_city_id']);
		}
        
        $city_asset->join('cities', 'cities.id', '=', 'city_assets.i_city_id');
        $city_asset->select('cities.id as city_id','cities.v_name as city_name','city_assets.*');
        
        $city_asset = $city_asset->paginate($data['rec_per_page']);
        $arrCityAsset = $city_asset->toArray();
        $city = City::where('i_status','1')->orderBy('v_name')->lists('id', 'v_name');
        $results = [
    	    'items' => $arrCityAsset['data'],
            'city' => $city,
            '_meta' => [
    	        'total'        => $city_asset->getTotal(),
    	        'rpp'     => $city_asset->getPerPage(),
    	        'current' => $city_asset->getCurrentPage(),
    	        'last_page'    => $city_asset->getLastPage(),
    	        'from'         => $city_asset->getFrom(),
    	        'to'           => $city_asset->getTo()
    	    ]
    	];
        return json_encode($results);
	}
    
    public function postAdd()
	{
        $data = Input::get();
        if(!empty($data)){
            /* Save Image */
            /* Thumbnail Image */
            $base64_thumbnail = $data['v_thumbnail_url'].'=';
            $v_random_thumbnail = time().'-'.str_random(6);
            $path = CITY_ASSET_THUMB_IMAGE_PATH;
            $thumbnailImage = $this->saveImage($base64_thumbnail, $v_random_thumbnail, $path);
            
            /* Large Image */
            if($data['v_large_image'] != '') {
                $base64_large = $data['v_large_image'].'=';
                $v_random_large= time().'-'.str_random(6);
                $path = CITY_ASSET_IMAGE_PATH;
                $largeImage = $this->saveImage($base64_large, $v_random_large, $path);
            } else {
                $largeImage = '';
            }
            
            $city_asset = new CityAsset;
            $city_asset->i_city_id = $data['i_city_id'];
            $city_asset->i_asset_order = $data['i_asset_order'];
            $city_asset->v_thumbnail_url = $thumbnailImage;
            $city_asset->v_large_image = $largeImage;
            $city_asset->t_content = $data['t_content'];
            
             // To set order before enter new data
            if($data['i_city_id'] != '' && $data['i_asset_order'] != ''){
                $city_asset_data = CityAsset::where('i_city_id','=',$data['i_city_id'])->where('i_asset_order','=',$data['i_asset_order'])->first();
                if(!empty($city_asset_data)){
                    CityAsset::where('i_city_id','=',$data['i_city_id'])->where('i_asset_order','>=',$data['i_asset_order'])->increment('i_asset_order', 1);
                }
            }
            
            if($city_asset->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }             
        }else{
            return City::where('i_status','1')->lists('id', 'v_name');
        }
    }
    
    public function postEdit()
	{
	   $data = Input::get();
        if(!empty($data)){
            $city_asset = CityAsset::find($data['id']);
            
            if($data['v_thumbnail_url'] !='' && $city_asset->v_thumbnail_url != $data['v_thumbnail_url']){
                $base64_thumbnail = $data['v_thumbnail_url'].'=';
                $v_random_thumbnail = time().'-'.str_random(6);
                $path = CITY_ASSET_THUMB_IMAGE_PATH;
                @unlink(CITY_ASSET_THUMB_IMAGE_PATH.$city_asset->v_thumbnail_url);
                $city_asset->v_thumbnail_url = $this->saveImage($base64_thumbnail, $v_random_thumbnail, $path);
            }
            
            if($data['v_large_image'] != '' && $city_asset->v_large_image != $data['v_large_image']){
                $base64_large = $data['v_large_image'].'=';
                $v_random_large = time().'-'.str_random(6);
                $path = CITY_ASSET_IMAGE_PATH;
                @unlink(CITY_ASSET_IMAGE_PATH.$city_asset->v_large_image);
                $city_asset->v_large_image = $this->saveImage($base64_large, $v_random_large, $path);
            }
            if(trim($data['v_large_image']) == ''){
                $city_asset->v_large_image = '';
            }
            
            // To set order before edit data
            if($city_asset->i_asset_order > $data['i_asset_order']){
                CityAsset::where('i_city_id','=',$data['i_city_id'])->where('i_asset_order','>=',$data['i_asset_order'])->where('i_asset_order','<',$city_asset->i_asset_order)->increment('i_asset_order', 1);
            } else if($city_asset->i_asset_order < $data['i_asset_order']){
                CityAsset::where('i_city_id','=',$data['i_city_id'])->where('i_asset_order','<=',$data['i_asset_order'])->where('i_asset_order','>',$city_asset->i_asset_order)->decrement('i_asset_order', 1);
            }
            
            $city_asset->i_city_id = $data['i_city_id'];
            $city_asset->i_asset_order = $data['i_asset_order'];
            $city_asset->t_content = $data['t_content'];
            if($city_asset->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }                
        }else{
             return City::where('i_status','1')->lists('id', 'v_name');
        }
    }
    
    public function anyDelete()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $city_asset = CityAsset::find($data['id']);
            if($city_asset->delete()){
                $cityAssetReorder = CityAsset::where('i_asset_order','>',$city_asset->i_asset_order)->where('i_city_id',$city_asset->i_city_id)->get();
                if(count($cityAssetReorder) > 0){
                    foreach ($cityAssetReorder as $value) {
                        $value->i_asset_order = $city_asset->i_asset_order;
                        $value->save();
                        $city_asset->i_asset_order++;
                    }
                }
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
    
    public function postGetEditRecord($id)
    {
        $national_asset = new CityAsset;
        $national_asset = $national_asset->where('id','=',$id)->first();
        $arrNationalAsset= $national_asset->toArray();
        $results = array('items' => $arrNationalAsset);
        return json_encode($results);
    }
    
    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
                CityAsset::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }else  if ($action == "act") { //Active Action   
                CityAsset::whereIn('id', array_values($data['id']))->update(array("i_status" =>"1"));
                 echo "1";
            } else  if ($action == "inact") { //Inctive Action   
                CityAsset::whereIn('id', array_values($data['id']))->update(array("i_status" =>"0"));
                echo "1";
            }
        }
    }
      
    
    public function anyExport($parameters = null)
    {
        
        Excel::create('city_asset_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('City Asset'  , function($sheet) use ($parameters)
            {
                $query = CityAsset::query();
                
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
                    
                    if(isset($i_city_id) && $i_city_id!=""){
            			$query = $query->where('i_city_id',$i_city_id);
            		}
                    if(isset($i_asset_order) && $i_asset_order !=""){
                        $query = $query->where('i_asset_order', $i_asset_order);
                    }
            		$query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'ASC');    
                }
                
                $query->select('id','i_city_id','i_asset_order','v_thumbnail_url','created_at','updated_at');
        		$records = $query->get()->toArray();
             
                $field['no'] = 'Sr.No';
                $field['i_city_id'] = 'City';
                $field['i_display_order'] = 'Asset Order';
                $field['v_thumbnail_url'] = 'Image';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';
                                       
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:F1');
                $sheet->setWidth(array('A' => 8,'B' => 20,'C' => 20,'D' => 30,'E' => 30,'F' => 30 ));
                
                $sheet->cells('A1:F1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('City Asset'));
                
                $sheet->cells('A2:F2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(2,$field);
                $intCount = 3;
                $city = City::lists('v_name','id');
                foreach($records as $val){
                    $val['i_city_id'] = $city[$val['i_city_id']];
                    $sheet->row($intCount, $val);
                    $intCount++;
                }
            });
        
        })->download('xlsx');
    }
    
    public function postUploadForIe(){
        return ((isset($_FILES["v_img"]) and $_FILES["v_img"]["error"] == 0) ? 'data:image/' . pathinfo($_FILES["v_img"]["name"], PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($_FILES["v_img"]["tmp_name"])):"0");
    } 
}
?>