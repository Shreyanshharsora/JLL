<?php
class AdminCmsController extends BaseController
{
    /* Use for cms listing*/
	public function postIndex()
	{
        if(!$this->checkAuthentication()) {
            return json_encode(array());
        }

        $data = Input::get();
        $cms = new Cms;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$cms = $cms->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $cms = $cms->orderBy('updated_at','DESC');
		}

        if(isset($data['search_fields']['v_title']) && $data['search_fields']['v_title']!=""){
			$cms = $cms->where('v_title', 'LIKE',"%".$data['search_fields']['v_title']."%");
		}

		if(isset($data['search_fields']['v_slug']) && $data['search_fields']['v_slug']!=""){
			$cms = $cms->where('v_slug', 'LIKE',"%".$data['search_fields']['v_slug']."%");
		}

        if(isset($data['search_fields']['i_order']) && $data['search_fields']['i_order']!=""){
			$cms = $cms->where('i_order', '=',$data['search_fields']['i_order']);
		}

        if(isset($data['search_fields']['e_show_in_footer']) && $data['search_fields']['e_show_in_footer']!=""){
			$cms = $cms->where('e_show_in_footer', '=',$data['search_fields']['e_show_in_footer']);
		}

        if(isset($data['search_fields']['e_show_in_menu']) && $data['search_fields']['e_show_in_menu']!=""){
			$cms = $cms->where('e_show_in_menu', '=',$data['search_fields']['e_show_in_menu']);
		}

        if(isset($data['search_fields']['status']) && $data['search_fields']['status']!=""){
			$cms = $cms->where('status', '=',$data['search_fields']['status']);
		}
        /* Do not display home content */
		$cms = $cms->where('v_slug', '!=','home');
        $cms = $cms->paginate($data['rec_per_page']);
        $arrCms = $cms->toArray();

        $results = [
    	    'items' => $arrCms['data'],
            '_meta' => [
    	        'total'        => $cms->getTotal(),
    	        'rpp'     => $cms->getPerPage(),
    	        'current' => $cms->getCurrentPage(),
    	        'last_page'    => $cms->getLastPage(),
    	        'from'         => $cms->getFrom(),
    	        'to'           => $cms->getTo()
    	    ]
    	];
        return json_encode($results);
	}

    public function anyData($id)
    {
        $cms = new Cms;
        $cms = $cms->where('id','=',$id)->first();
        $arrCms = $cms->toArray();
        $results = array('items' => $arrCms);
        return json_encode($results);
    }

    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
                Cms::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }else  if ($action == "act") { //Active Action
                Cms::whereIn('id', array_values($data['id']))->update(array("status" =>"1"));
                 echo "1";
            } else  if ($action == "inact") { //Inctive Action
                Cms::whereIn('id', array_values($data['id']))->update(array("status" =>"0"));
                echo "1";
            }
        }
    }

    public function anyExport($parameters = null)
    {
        Excel::create('cms_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('CMS'  , function($sheet) use ($parameters)
            {
                $query = Cms::query();

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
                    if(isset($v_slug) && $v_slug!=""){
                        $query = $query->where('v_slug', 'LIKE',"%".$v_slug."%");
                    }
            		if(isset($status) && $status!=""){
            			$query = $query->where('status', '=',$status);
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');
                }

                $query->select('id','v_title','v_slug','t_content','status','v_meta_title','v_meta_keywords','v_meta_description','created_at','updated_at');
        		$records = $query->get()->toArray();

                $field['no'] = 'Sr.No';
                $field['v_title'] = 'Title';
                $field['v_slug'] = 'Page Url';
                $field['t_content'] = 'content';
                $field['status'] = 'Status';
                $field['v_meta_title'] = 'Meta Title';
                $field['v_meta_keywords'] = 'Meta Keywords';
                $field['v_meta_description'] = 'Meta Description';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';

                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:j1');
                $sheet->setWidth(array('A' => 8,'B' => 20,'C' => 20,'D' => 70,'E' => 10,'F' => 20,'G' => 20,'H' => 30,'I' => 20, 'J' => 20));

                $sheet->cells('A1:G1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });

                $sheet->row(1,array('Cms Pages'));

                $sheet->cells('A2:J2', function($cell)
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
                    if($val['status'] == '1'){
                        $val['status'] = 'Active';
                    }else{
                        $val['status'] = 'Inactive';
                    }
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
            $cms_data = new Cms;
            $cms_data = $cms_data->where('v_slug','=',$data['v_slug']);
            if(isset($data['id']) && $data['id'] != ''){
                $cms_data = $cms_data->where('id','!=',$data['id']);
            }
            $cms_data = $cms_data->get()->toArray();

            if(!empty($cms_data)){
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
            /*$validator = Validator::make(Input::all(), array("v_slug" =>'unique:pages,v_slug'));
            if ($validator->fails()) {
                $messages['error'] = $validator->messages()->toArray();
                return  $messages;
                exit;
            }*/

            $cms_data = Cms::where('v_slug', $data['v_slug'])->count();
            if($cms_data > 0){
                $messages['error']["v_slug"] = "['The v slug has already been taken.']";
                return  $messages;
                exit;
            }

            /* For cms images */
            if(!empty($data['images'])){
                $image_array = array();
                $i = 0;
                foreach($data['images'] as $k=>$v){
                    $v_random_image = time().'-'.str_random(6);
                    $path = CMS_IMAGE_PATH;
                    $image_name = $this->saveImage($v['image_data'], $v_random_image, $path);
                    if($image_name){
                        $image_array[$i]['title'] = $v['image_title'];
                        $image_array[$i]['image'] = $image_name;
                        $i++;
                    }
                }

                $jsonData = json_encode($image_array);
            } else {
                $jsonData = '';
            }
            
            // To set order before enter new data
            $orderData=Cms::where('i_order','>=',$data['i_order'])->lists('id');
            if($orderData){                
                DB::table('pages')->whereIn('id', $orderData)->increment('i_order');
                /*$orderData=implode(',',$orderData);
                DB::update('UPDATE pages ban SET ban.i_order =  ban.i_order +1 WHERE id IN('.$orderData.')');*/   
            } else {
                $countData = Cms::count();
                $data['i_order'] = $countData + 1;
            }
            
            
            // To set order before enter new data
            /*if($data['i_order'] != ''){
                $cms_data = Cms::where('i_order','=',$data['i_order'])->first();
                if(!empty($cms_data)){
                    Cms::where('i_order','>=',$data['i_order'])->increment('i_order', 1);
                }
            }*/

            $cms = new Cms;
            $cms->v_title = $data['v_title'];
            $cms->v_page_title = $data['v_page_title'];
            $cms->v_slug = $data['v_slug'];
            $cms->v_external_link = @$data['v_external_link'];
            $cms->v_images = $jsonData;
            $cms->v_meta_title = $data['v_meta_title'];
            $cms->v_meta_keywords = @$data['v_meta_keywords'];
            $cms->v_meta_description = @$data['v_meta_description'];
            $cms->t_content = $data['t_content'];
            $cms->i_order = $data['i_order'];
            $cms->e_page_type = $data['e_page_type'];
            $cms->e_show_in_menu = $data['e_show_in_menu'];
            $cms->e_show_in_footer = $data['e_show_in_footer'];
            $cms->status = $data['status'];
            if($cms->save()){

                /*$LastInsertId = $cms->id;
                 $bannerOrder = Cms::where('i_order','=',Input::get('i_order'))->where('id','!=',$LastInsertId)->get()->toArray();
                 if(isset($bannerOrder) && count($bannerOrder)> 0 ){
                    $returnVal=$this->banner_reorder($bannerOrder);
                } else {
                    $bannerOrder = Cms::count();
                    $cms->i_order = $bannerOrder;
                    $cms->id = $LastInsertId;
                    $cms->save();
                }*/


                return 'TRUE';
                exit;
            } else {
                return 'FALSE';
                exit;
            }
        }
        exit;
    }

     public function banner_reorder($bannerOrder){
        $resetOrder = new Cms;

        $resetOrder = Cms::find($bannerOrder[0]['id']);
        $resetOrder->i_order = $bannerOrder[0]['i_order'] + 1;

        $resetOrder->save();
        $bannerOrder = Cms::where('i_order','=',$resetOrder['i_order'])->where('id','!=',$resetOrder['id'])->get()->toArray();
        if(count($bannerOrder) > 0 ){
            $this->banner_reorder($bannerOrder);
        }else{
            return true;
        }
    }

    public function postEdit()
	{
	    $data = Input::get();
        if(!empty($data)){
             $id=$data['id'];
            $banner = Cms::find($data['id']);
            // To set order before edit data
            $oldOrder = $banner->i_order;
            if($oldOrder > $data['i_order']){
                $orderData=Cms::where('i_order','>=',$data['i_order'])->where('i_order','<',$oldOrder)->lists('id');
                if($orderData){
                    //$orderData=implode(',',$orderData);
                    DB::table('pages')->whereIn('id', $orderData)->increment('i_order');                    
                    //DB::update('UPDATE pages ban SET ban.i_order =  ban.i_order+1 WHERE id IN('.$orderData.')');   
                }
            } else if($oldOrder < $data['i_order']){
                $orderData=Cms::where('i_order','<=',$data['i_order'])->where('i_order','>',$oldOrder)->lists('id');
                if($orderData){
                    //$orderData=implode(',',$orderData);
                    DB::table('pages')->whereIn('id', $orderData)->decrement('i_order');                    
                    //DB::update('UPDATE pages ban SET ban.i_order =  ban.i_order-1 WHERE id IN('.$orderData.')');   
                }
                $countData = Cms::count();
                if($data['i_order'] > $countData){
                    $data['i_order'] = $countData;
                }
            }
            
            
            /* For cms images */
            if(!empty($data['images'])){
                $image_array = array();
                $i = 0;
                foreach($data['images'] as $k=>$v){
                    if($v['image_type'] == 'Existing'){
                        $image_array[$i]['title'] = $v['image_title'];
                        $image_array[$i]['image'] = $v['image_data'];
                        $i++;
                    } else if($v['image_type'] == 'New') {
                        $v_random_image = time().'-'.str_random(6);
                        $path = CMS_IMAGE_PATH;
                        $image_name = $this->saveImage($v['image_data'], $v_random_image, $path);
                        if($image_name){
                            $image_array[$i]['title'] = $v['image_title'];
                            $image_array[$i]['image'] = $image_name;
                            $i++;
                        }
                    } else if($v['image_type'] == 'Delete'){
                        @unlink(SITE_URL.CMS_IMAGE_PATH.$v['image_data']);
                    }
                }
                $jsonData = json_encode($image_array);
            } else {
                $jsonData = '';
            }

            /*$validator = Validator::make(Input::all(), array("v_slug" => 'unique:pages,v_slug,' . $data['id']. ''));
            if ($validator->fails()) {
                $messages['error'] = $validator->messages()->toArray();
                return  $messages;
                exit;
            }*/

            $cms_data = Cms::where('v_slug', $data['v_slug'])->where('id','!=',$data['id'])->count();
            if($cms_data > 0){
                $messages['error']["v_slug"] = "['The v slug has already been taken.']";
                return  $messages;
                exit;
            }

            $cms = Cms::find($data['id']);

            // To set order before edit data
            /*if($cms->i_order > $data['i_order']){
                Cms::where('i_order','>=',$data['i_order'])->where('i_order','<',$cms->i_order)->increment('i_order', 1);
            } else if($cms->i_order < $data['i_order']){
                Cms::where('i_order','<=',$data['i_order'])->where('i_order','>',$cms->i_order)->decrement('i_order', 1);
            }*/

            $cms->v_title = $data['v_title'];
            $cms->v_page_title = $data['v_page_title'];
            $cms->v_slug = $data['v_slug'];
            $cms->v_external_link = @$data['v_external_link'];
            $cms->v_images = $jsonData;
            $cms->v_meta_title = @$data['v_meta_title'];
            $cms->v_meta_keywords =@ $data['v_meta_keywords'];
            $cms->v_meta_description = @$data['v_meta_description'];
            $cms->t_content = $data['t_content'];
            $cms->v_meta_keywords = @$data['v_meta_keywords'];
            $cms->i_order = $data['i_order'];
            $cms->e_page_type = $data['e_page_type'];
            $cms->e_show_in_menu = $data['e_show_in_menu'];
            $cms->e_show_in_footer = $data['e_show_in_footer'];
            $cms->status = $data['status'];
            if($cms->save()){

               /*if($oldOrder != $banner->i_order){
                    $bannerOrder = Cms::where('i_order','=',$banner->i_order)->where('id','!=', $id)->get()->toArray();
                    // select duplicate order
                    if(count($bannerOrder) > 0){
                        if($oldOrder > $cms->i_order){ // High to low order
                            $highToLowBanner = Cms::where('i_order','>=',$cms->i_order)
                                                ->where('i_order','<',$oldOrder)
                                                ->where('id','!=',$id)->orderBy('i_order','asc')
                                                ->get()->toArray();
                            $highToLowBanner1=array();
                            foreach($highToLowBanner as $val){
                                $highToLowBanner1[$val['id']]=$val['i_order'];
                            }
                            $order = $cms->i_order;
                            foreach($highToLowBanner1 as $key=>$val){
                                $reSetOrder = Cms::find($key);
                                $order = $order + 1;
                                $reSetOrder->i_order = $order;
                                $reSetOrder->save();
                            }
                        }else{
                            // Low to high order
                            $lowTohighBanner = Cms::where('i_order','<=',$cms->i_order)
                                                    ->where('i_order','>',$oldOrder)
                                                    ->where('id','!=',$id)
                                                    ->orderBy('i_order','asc')
                                                ->get()->toArray();
                            $lowTohighBanner1=array();
                            foreach($lowTohighBanner as $val){
                                $lowTohighBanner1[$val['id']]=$val['i_order'];
                            }

                            foreach($lowTohighBanner1 as $key => $val){
                                $reSetOrder = Cms::find($key);
                                $reSetOrder->i_order =  $reSetOrder->i_order-1;
                                $reSetOrder->save();
                            }
                        }
                    }else{
                        // High Order
                        $highBanner = Cms::where('i_order','>=',$oldOrder)
                                            ->where('id','!=',$id)
                                            ->orderBy('i_order','asc')
                                            ->get()->toArray();
                                $highBanner1=array();
                                foreach($highBanner as $val){
                                    $highBanner1[$val['id']]=$val['i_order'];
                                }
                                foreach($highBanner1 as $key=>$val){
                                    $reSetOrder = Cms::find($key);
                                    $order = $reSetOrder->i_order - 1;
                                    $reSetOrder->i_order =  $order;
                                    $reSetOrder->save();
                                }
                                $order = Cms::count();
                                $reSetOrder = Cms::find($id);
                                $reSetOrder->i_order = $order;
                                $reSetOrder->save();
                    }
                }*/

                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }

    public function postChangeStatus(){
        $data = Input::get();
        if(!empty($data)){

            $cms = Cms::find($data['id']);
            $cms->status = $data['status'];

            if($cms->save()){
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
            $cms = Cms::find($data['id']);
            
            $orderData=Cms::where('i_order','>=',$cms['i_order'])->lists('id');
            
            if($orderData){
                DB::table('pages')->whereIn('id', $orderData)->decrement('i_order');
                /*$orderData=implode(',',$orderData);
                DB::update('UPDATE pages ban SET ban.i_order =  ban.i_order -1 WHERE id IN('.$orderData.')');*/   
            }
            
            if($cms->delete()){
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
