<?php
class AdminHomePageBannerController extends BaseController 
{
   public function anyIndex(){
        $data = Input::get();
        
        $banners=new HomePageBanner;
        
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != '')
        {
			$banners = $banners->orderBy($data['order_field'],$data['sort_order']);
		}else{
		    $banners = $banners->orderBy('updated_at','DESC');
		}
        
        if(isset($data['search_fields']['v_title']) && $data['search_fields']['v_title']!=""){
			$banners = $banners->where('v_title', 'LIKE',"%".trim($data['search_fields']['v_title'])."%");
		}
        
        if(isset($data['search_fields']['v_subtext']) && $data['search_fields']['v_subtext']!=""){
			$banners = $banners->where('v_subtext', 'LIKE',"%".trim($data['search_fields']['v_subtext'])."%");
		}
        
        if(isset($data['search_fields']['v_image']) && $data['search_fields']['v_image']!=""){
			$banners = $banners->where('v_image', 'LIKE',"%".trim($data['search_fields']['v_image'])."%");
		}
        
        if(isset($data['search_fields']['e_dropdown_button']) && $data['search_fields']['e_dropdown_button']!=""){
			$banners = $banners->where('e_dropdown_button', '=',trim($data['search_fields']['e_dropdown_button']));
		}


        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
			$banners = $banners->where('e_status', '=',trim($data['search_fields']['e_status']));
		}       
        
        $banners = $banners->paginate($data['rec_per_page']);
       
        $arrBanners = $banners->toArray();
         $results = [
    	    'items' => $arrBanners['data'],
            '_meta' => [
    	        'total'        => $banners->getTotal(),
    	        'rpp'     => $banners->getPerPage(),
    	        'current' => $banners->getCurrentPage(),
    	        'last_page'    => $banners->getLastPage(),
    	        'from'         => $banners->getFrom(),
    	        'to'           => $banners->getTo()
    	    ]
    	];
        
        return json_encode($results);
    }
    
    public function anyData($id)
    {
        
        $homgPageBanner = HomePageBanner::where('id','=',$id)->first();//new Skyline;
        $homgPageBanner = $homgPageBanner->toArray();
        $results = array('items' => $homgPageBanner);
        return json_encode($results);
    }
    
    public function anyDelete()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $homgPageBanner = HomePageBanner::find($data['id']);
            if($homgPageBanner->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
    
    public function postAdd(){
        $data=Input::get();
        
        if(!empty($data)){
            
            $orderExists = HomePageBanner::where('i_order', $data['i_order'])->first();            
           // if($orderExists){
//                $messages['error']["i_order"] = "['This Order has already been taken.Please changes it.']";
//                return  $messages;
//                exit;
//            }
            
            $orderData=HomePageBanner::where('i_order','>=',$data['i_order'])->lists('id');
            
            if($orderData){
                $orderData=implode(',',$orderData);
                DB::update('UPDATE homepage_banners ban SET ban.i_order =  ban.i_order +1 WHERE id IN('.$orderData.')');   
            }
            
            /* Save Image */
            $v_random_image = time().'-'.str_random(6);
                $base64_backgroundImg = $data['v_image'].'=';
                $path = HOME_PAGE_BANNER_IMAGE_PATH;
                $backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path);
                /*if($backgroundImageName){
                    $base64_backgroundImg = $data['transparent_background_image'].'=';
                    $path = HOME_PAGE_BANNER_IMAGE_PATH.'transparent/';
                    $this->saveImage($base64_backgroundImg, $v_random_image, $path);
                }*/
            
            $homgPageBanner = new HomePageBanner;
            $homgPageBanner->v_title = $data['v_title'];
            $homgPageBanner->v_subtext = $data['v_subtext'];
            $homgPageBanner->i_order = $data['i_order'];
            //$city->v_image_url = $imageName;
            $homgPageBanner->v_image = $backgroundImageName;
            $homgPageBanner->e_dropdown_button = $data['e_dropdown_button'];
            $homgPageBanner->e_status = $data['e_status'];
            $homgPageBanner->v_button_text =isset($data['v_button_text'])?$data['v_button_text']:null;
            $homgPageBanner->v_button_link =isset($data['v_button_link'])?$data['v_button_link']:null;
                        
            if($homgPageBanner->save()){
                DB::statement( DB::raw( 'SET @x := 0'));
                DB::update('UPDATE homepage_banners SET i_order = (@x:=@x+1) ORDER BY i_order');
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
            $orderExists = HomePageBanner::where('i_order', $data['i_order'])->where('id', '!=', $data['id'])->first();          
            /*if($orderExists){
                $messages['error']["i_order"] = "['This Order has already been taken.Please changes it.']";
                return  $messages;
                exit;
            }*/
            //SELECT id FROM homepage_banners WHERE i_order > 1
            $orderData=HomePageBanner::where('i_order','>=',$data['i_order'])->lists('id');
            if($orderData){
                $orderData=implode(',',$orderData);
                DB::update('UPDATE homepage_banners ban SET ban.i_order =  ban.i_order +1 WHERE id IN('.$orderData.')');   
            }
            
            $homgPageBanner = HomePageBanner::find($data['id']);
            $backgroundImageName = '';
            $v_random_image = time().'-'.str_random(6);
            if($data['image_type_grid'] == 'New'){
                @unlink(HOME_PAGE_BANNER_IMAGE_PATH.$homgPageBanner->v_image);
            }
            if($data['image_type_grid'] == 'New'){
                $base64_backgroundImg = $data['v_image'].'=';
                $path = HOME_PAGE_BANNER_IMAGE_PATH;
                $backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path);
                $homgPageBanner->v_image = $backgroundImageName;
            }
            
            $homgPageBanner->v_title = $data['v_title'];
            $homgPageBanner->v_subtext = $data['v_subtext'];
            $homgPageBanner->i_order = $data['i_order'];

            $homgPageBanner->e_dropdown_button = $data['e_dropdown_button'];
            $homgPageBanner->e_status = $data['e_status'];
            $homgPageBanner->v_button_text =isset($data['v_button_text'])?$data['v_button_text']:null;
            $homgPageBanner->v_button_link =isset($data['v_button_link'])?$data['v_button_link']:null;
            
            if($homgPageBanner->save()){
                DB::statement( DB::raw( 'SET @x := 0'));
                DB::update(('UPDATE homepage_banners SET i_order = (@x:=@x+1) ORDER BY i_order'));
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
           
            $homgPageBanner = HomePageBanner::find($data['id']);
            $homgPageBanner->e_status = $data['status'];
            
            if($homgPageBanner->save()){
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
                HomePageBanner::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }else  if ($action == "act") { //Active Action   
                HomePageBanner::whereIn('id', array_values($data['id']))->update(array("e_status" =>"1"));
                 echo "1";
            } else  if ($action == "inact") { //Inctive Action   
                HomePageBanner::whereIn('id', array_values($data['id']))->update(array("e_status" =>"0"));
                echo "1";
            }
        }
    }
    public function anyExport($parameters = null)
    {
        Excel::create('banner_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Banner'  , function($sheet) use ($parameters)
            {
                $query = HomePageBanner::query();

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

                    if(isset($v_title) && $v_title!=""){
            			$query = $query->where('v_title', 'LIKE',"%".$v_title."%");
            		}
                    if(isset($v_subtext) && $v_subtext!=""){
                        $query = $query->where('v_subtext', 'LIKE',"%".$v_subtext."%");
                    }
            		if(isset($e_dropdown_button) && $e_dropdown_button!=""){
            			$query = $query->where('e_dropdown_button', '=',$e_dropdown_button);
            		}
                    if(isset($e_status) && $e_status!=""){
            			$query = $query->where('e_status', '=',$e_status);
            		}
                    
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');
                }

                $query->select('id','v_title','v_subtext','v_image','i_order','e_dropdown_button','v_button_text','v_button_link','e_status','created_at','updated_at');
        		$records = $query->get()->toArray();

                $field['no'] = 'Sr.No';
                $field['v_title'] = 'Title';
                $field['v_subtext'] = 'Tag Line';
                $field['v_image'] = 'Image';
                $field['i_order'] = 'Order';
                $field['e_dropdown_button'] = 'Options';
                $field['v_button_text'] = 'Button Text';
                $field['v_button_link'] = 'Button Link';
                $field['e_status'] = 'Status';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';

                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:K1');
                $sheet->setWidth(array('A' => 8,'B' => 30,'C' => 50,'D' => 30,'E' => 10,'F' => 30,'G' => 20,'H' => 60,'I' => 10, 'J' => 20, 'K' => 20));

                $sheet->cells('A1:K1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });

                $sheet->row(1,array('Banners'));

                $sheet->cells('A2:K2', function($cell)
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