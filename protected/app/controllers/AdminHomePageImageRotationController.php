<?php
	class AdminHomePageImageRotationController extends BaseController 
	{
		public function anyIndex(){
			$data = Input::get();
			
			$homeImageRotator=new HomePageImageRotation;
			
			if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != '')
			{
				$homeImageRotator = $homeImageRotator->orderBy($data['order_field'],$data['sort_order']);
				}else{
				$homeImageRotator = $homeImageRotator->orderBy('updated_at','DESC');
			}
			
			if(isset($data['search_fields']['v_subtext']) && $data['search_fields']['v_subtext']!=""){
				$homeImageRotator = $homeImageRotator->where('v_subtext', 'LIKE',"%".trim($data['search_fields']['v_subtext'])."%");
			}
			
			if(isset($data['search_fields']['v_image']) && $data['search_fields']['v_image']!=""){
				$homeImageRotator = $homeImageRotator->where('v_image', 'LIKE',"%".trim($data['search_fields']['v_image'])."%");
			}
			
			if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
				$homeImageRotator = $homeImageRotator->where('e_status', '=',trim($data['search_fields']['e_status']));
			}       
			
			$homeImageRotator = $homeImageRotator->paginate($data['rec_per_page']);
			
			$arrBanners = $homeImageRotator->toArray();
			$results = [
    	    'items' => $arrBanners['data'],
            '_meta' => [
			'total'        => $homeImageRotator->getTotal(),
			'rpp'     => $homeImageRotator->getPerPage(),
			'current' => $homeImageRotator->getCurrentPage(),
			'last_page'    => $homeImageRotator->getLastPage(),
			'from'         => $homeImageRotator->getFrom(),
			'to'           => $homeImageRotator->getTo()
    	    ]
			];
			
			return json_encode($results);
		}
		
		public function anyData($id)
		{
			$homeImageRotator = HomePageImageRotation::where('id','=',$id)->first();//new Skyline;
			$homeImageRotator = $homeImageRotator->toArray();
			$results = array('items' => $homeImageRotator);
			return json_encode($results);
		}
		
		public function anyDelete()
		{
			$data = Input::get();
			if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
				$homeImageRotator = HomePageImageRotation::find($data['id']);
                
                $orderData=HomePageImageRotation::where('i_order','>=',$homeImageRotator['i_order'])->lists('id');
            
                if($orderData){
                    DB::table('homepage_image_rotator')->whereIn('id', $orderData)->decrement('i_order');
                    /*$orderData=implode(',',$orderData);
                    DB::update('UPDATE homepage_image_rotator ban SET ban.i_order =  ban.i_order -1 WHERE id IN('.$orderData.')');*/  
                }
                
				if($homeImageRotator->delete()){
					return 'TRUE';
					} else {
					return 'FALSE';
				}
			}
		}
		
		public function postAdd(){
			$data=Input::get();
			
			if(!empty($data)){
				
                $orderData=HomePageImageRotation::where('i_order','>=',$data['i_order'])->lists('id');
                if($orderData){                
                    DB::table('homepage_image_rotator')->whereIn('id', $orderData)->increment('i_order');
                    /*$orderData=implode(',',$orderData);
                    DB::update('UPDATE homepage_image_rotator ban SET ban.i_order =  ban.i_order +1 WHERE id IN('.$orderData.')');*/ 
                } else {
                    $countData = HomePageImageRotation::count();
                    $data['i_order'] = $countData + 1;
                }
                
                
				/* Save Image */
				$v_random_image = time().'-'.str_random(6);
                $base64_backgroundImg = $data['v_image'].'=';
                $path = HOME_PAGE_IMAGE_ROTATOR_PATH;
                $backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path);
                /*if($backgroundImageName){
                    $base64_backgroundImg = $data['transparent_background_image'].'=';
                    $path = HOME_PAGE_BANNER_IMAGE_PATH.'transparent/';
                    $this->saveImage($base64_backgroundImg, $v_random_image, $path);
				}*/
				
				$homeImageRotator = new HomePageImageRotation;
				$homeImageRotator->v_subtext = $data['v_subtext'];
				//$city->v_image_url = $imageName;
				$homeImageRotator->v_image = $backgroundImageName;
                $homeImageRotator->v_image_link = @$data['v_image_link'];
                $homeImageRotator->i_order = $data['i_order'];
				$homeImageRotator->e_status = $data['e_status'];
				
				if($homeImageRotator->save()){
					return 'TRUE';
					} else {
					return 'FALSE';
				}             
				
				}else{
				return 'FALSE';
			}
		}
		
		public function postEdit()
		{
			$data = Input::get();
			if(!empty($data)){
				
				//$cities_data = City::where('v_slug', $data['v_slug'])->where('id', '!=', $data['id'])->count();
				
				$homeImageRotator = HomePageImageRotation::find($data['id']);
                
                $oldOrder = $homeImageRotator->i_order;
                if($oldOrder > $data['i_order']){
                    $orderData=HomePageImageRotation::where('i_order','>=',$data['i_order'])->where('i_order','<',$oldOrder)->lists('id');
                    if($orderData){
                        DB::table('homepage_image_rotator')->whereIn('id', $orderData)->increment('i_order');
                        /*$orderData=implode(',',$orderData);
                        DB::update('UPDATE homepage_image_rotator ban SET ban.i_order =  ban.i_order+1 WHERE id IN('.$orderData.')');*/   
                    }
                } else if($oldOrder < $data['i_order']){
                    $orderData=HomePageImageRotation::where('i_order','<=',$data['i_order'])->where('i_order','>',$oldOrder)->lists('id');
                    if($orderData){
                        DB::table('homepage_image_rotator')->whereIn('id', $orderData)->decrement('i_order');
                        /*$orderData=implode(',',$orderData);
                        DB::update('UPDATE homepage_image_rotator ban SET ban.i_order =  ban.i_order-1 WHERE id IN('.$orderData.')');*/   
                    }
                    $countData = HomePageImageRotation::count();
                    if($data['i_order'] > $countData){
                        $data['i_order'] = $countData;
                    }
                }
                
				$backgroundImageName = '';
				$v_random_image = time().'-'.str_random(6);
				if($data['image_type_grid'] == 'New'){
					@unlink(HOME_PAGE_IMAGE_ROTATOR_PATH.$homeImageRotator->v_image);
				}
				if($data['image_type_grid'] == 'New'){
					$base64_backgroundImg = $data['v_image'].'=';
					$path = HOME_PAGE_IMAGE_ROTATOR_PATH;
 					$backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path);
					$homeImageRotator->v_image = $backgroundImageName;
				}
				$homeImageRotator->v_image_link = @$data['v_image_link'];
                $homeImageRotator->i_order = $data['i_order'];
				$homeImageRotator->v_subtext = $data['v_subtext'];
				$homeImageRotator->e_status = $data['e_status'];
				
				if($homeImageRotator->save()){
					return 'TRUE';
					} else {
					return 'FALSE';
				}                
				}else{
				return 'FALSE';
			}
		}
		
		public function postChangeStatus(){
			$data = Input::get();
			if(!empty($data)){
				
				$homeImageRotator = HomePageImageRotation::find($data['id']);
				$homeImageRotator->e_status = $data['status'];
				
				if($homeImageRotator->save()){
					return 'TRUE';
					} else {
					return 'FALSE';
				}
			}
			return "TRUE";
		}
		
		public function anyBulkActions(){
			$data = Input::all(); //get action ids
			
			$action = $data['action']; // action to perform(delete,active,inactive)
			if(count($data) > 0){
				//Delete Record
				if ($action == "del") { //Delete Action
					HomePageImageRotation::whereIn('id', array_values($data['id']))->delete();
					echo '1';
					}else  if ($action == "act") { //Active Action   
					HomePageImageRotation::whereIn('id', array_values($data['id']))->update(array("e_status" =>"1"));
					echo "1";
					} else  if ($action == "inact") { //Inctive Action   
					HomePageImageRotation::whereIn('id', array_values($data['id']))->update(array("e_status" =>"0"));
					echo "1";
				}
			}
		}
		
		public function anyExport($parameters = null)
		{
			Excel::create('imagerotator_'.time(), function($excel) use ($parameters)
			{
				$excel->sheet('HomePageImageRotator'  , function($sheet) use ($parameters)
				{
					$query = HomePageImageRotation::query();
					
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
						
						if(isset($v_subtext) && $v_subtext!=""){
							$query = $query->where('v_subtext', 'LIKE',"%".$v_subtext."%");
						}
						if(isset($e_status) && $e_status!=""){
							$query = $query->where('e_status', '=',$e_status);
						}
						
						$query->orderBy($sort, $order);
						} else {
						$query->orderBy('id', 'DESC');
					}
					
					$query->select('id','v_subtext','v_image','i_order','e_status','created_at','updated_at');
					$records = $query->get()->toArray();
					
					$field['no'] = 'Sr.No';
					$field['v_subtext'] = 'Tag Line';
					$field['v_image'] = 'Image';
                    $field['i_order'] = 'Order';
					$field['e_status'] = 'Status';
					$field['created_at'] = 'Created On';
					$field['updated_at'] = 'Last Updated';
					
					$sheet->setHeight(1, 30);
					$sheet->mergeCells('A1:F1');
					$sheet->setWidth(array('A' => 8,'B' => 30,'C' => 50,'D' => 10,'E' => 30,'F' => 10,'G' => 30));
					
					$sheet->cells('A1:G1', function($cell)
					{
						$cell->setAlignment('center');
						$cell->setValignment('middle');
						$cell->setFontSize('20');
						$cell->setFontWeight('bold');
					});
					
					$sheet->row(1,array('Home Page Image Rotator'));
					
					$sheet->cells('A2:G2', function($cell)
					{
						$cell->setAlignment('center');
						$cell->setValignment('middle');
						$cell->setFontSize('12');
						$cell->setFontWeight('bold');
					});
					
					$sheet->row(2,$field);
					
					$intCount = 3;
					$srNo=1;
					foreach($records as $val){
						$val['id'] = $srNo;
						if($val['e_status'] == '1'){
							$val['e_status'] = 'Active';
							}else{
							$val['e_status'] = 'Inactive';
						}
						
						$sheet->row($intCount, $val);
						$intCount++;
						$srNo++;
					}
				});
				
			})->download('xlsx');
		}
	}
?>