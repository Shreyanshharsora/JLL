<?php
class AdminNationalAssetController extends BaseController 
{
    /* Use for cms listing*/
	public function postIndex()
	{
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }
        
        $data = Input::get();
        $national_asset = new NationalAsset;
        
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$national_asset = $national_asset->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $national_asset = $national_asset->orderBy('updated_at','DESC');
		}
        
        if(isset($data['search_fields']['i_column']) && $data['search_fields']['i_column']!=""){
			$national_asset = $national_asset->where('i_column', $data['search_fields']['i_column']);
		}
        
	   if(isset($data['search_fields']['i_display_order']) && $data['search_fields']['i_display_order']!=""){
			$national_asset = $national_asset->where('i_display_order',$data['search_fields']['i_display_order']);
		}
        
        $national_asset = $national_asset->paginate($data['rec_per_page']);
        $arrNationalAsset = $national_asset->toArray();
        $results = [
    	    'items' => $arrNationalAsset['data'],
            '_meta' => [
    	        'total'        => $national_asset->getTotal(),
    	        'rpp'     => $national_asset->getPerPage(),
    	        'current' => $national_asset->getCurrentPage(),
    	        'last_page'    => $national_asset->getLastPage(),
    	        'from'         => $national_asset->getFrom(),
    	        'to'           => $national_asset->getTo()
    	    ]
    	];
        return json_encode($results);
	}
    
    public function getNationalAssetOrder($column_id){
        if($column_id != '' && $column_id > 0){
            $order_no = NationalAsset::where('i_column','=',$column_id)->max('i_display_order');
            return $order_no+1;
        }        
    }
    
    public function postAdd()
	{
        $data = Input::get();
        if(!empty($data)){
            /* Save Image */
            $base64_fullImg = $data['v_image_url'].'=';
            $v_random_image = time().'-'.str_random(6);
            $path = NATIONAL_ASSET_IMAGE_PATH;
            $imageName = $this->saveImage($base64_fullImg, $v_random_image, $path);
            
            // To set order before enter new data 
            if($data['i_column'] != '' && $data['i_display_order'] != ''){
                $national_asset_data = NationalAsset::where('i_column',$data['i_column'])->where('i_display_order',$data['i_display_order'])->first();
                if(!empty($national_asset_data)){
                    NationalAsset::where('i_column','=',$data['i_column'])->where('i_display_order','>=',$data['i_display_order'])->increment('i_display_order', 1);
                }
            }            
            
            $national_asset = new NationalAsset;
            $national_asset->i_column = $data['i_column'];
            $national_asset->i_display_order = $data['i_display_order'];
            $national_asset->v_thumbnail_url = $imageName;
            $national_asset->t_content = $data['t_content'];
            
            if($national_asset->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }             
        }
    }
    
    public function postEdit()
	{
	   $data = Input::get();
        if(!empty($data)){
            $national_asset = NationalAsset::find($data['id']);
            $oldOrder = $national_asset->i_display_order;
            if($national_asset->v_thumbnail_url != $data['v_thumbnail_url']){
                $base64_fullImg = $data['v_thumbnail_url'].'=';
                $v_random_image = time().'-'.str_random(6);
                $path = NATIONAL_ASSET_IMAGE_PATH;
                @unlink(NATIONAL_ASSET_IMAGE_PATH.$national_asset->v_thumbnail_url);
                $national_asset->v_thumbnail_url = $this->saveImage($base64_fullImg, $v_random_image,$path);
            }
            // To set order before edit data
            if($national_asset->i_column == $data['i_column']){
                if($national_asset->i_display_order > $data['i_display_order']){
                    NationalAsset::where('i_column','=',$data['i_column'])->where('i_display_order','>=',$data['i_display_order'])->where('i_display_order','<',$national_asset->i_display_order)->increment('i_display_order', 1);
                } else if($national_asset->i_display_order < $data['i_display_order']){
                    NationalAsset::where('i_column','=',$data['i_column'])->where('i_display_order','<=',$data['i_display_order'])->where('i_display_order','>',$national_asset->i_display_order)->decrement('i_display_order', 1);
                }
            } else {
                // To set order before enter new data 
                if($data['i_column'] != '' && $data['i_display_order'] != ''){
                    $national_asset_data = NationalAsset::where('i_column',$data['i_column'])->where('i_display_order',$data['i_display_order'])->first();
                    if(!empty($national_asset_data)){
                        NationalAsset::where('i_column','=',$data['i_column'])->where('i_display_order','>=',$data['i_display_order'])->increment('i_display_order', 1);
                    }
                } 
                NationalAsset::where('i_column','=',$national_asset->i_column)->where('i_display_order','>=',$national_asset->i_display_order)->decrement('i_display_order', 1); 
            }
            
            $national_asset->i_column = $data['i_column'];
            $national_asset->i_display_order = $data['i_display_order'];
            $national_asset->t_content = $data['t_content'];
           
            if($national_asset->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }                
        }
    }
    
    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
                NationalAsset::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }else  if ($action == "act") { //Active Action   
                NationalAsset::whereIn('id', array_values($data['id']))->update(array("i_status" =>"1"));
                 echo "1";
            } else  if ($action == "inact") { //Inctive Action   
                NationalAsset::whereIn('id', array_values($data['id']))->update(array("i_status" =>"0"));
                echo "1";
            }
        }
    }
    
    public function anyDelete()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $national_asset = NationalAsset::find($data['id']);
            if($national_asset->delete()){
                $nationalAssetReorder = NationalAsset::where('i_display_order','>',$national_asset->i_display_order)->where('i_column',$national_asset->i_column)->get();
                if(count($nationalAssetReorder) > 0){
                    foreach ($nationalAssetReorder as $value) {
                        $value->i_display_order = $national_asset->i_display_order;
                        $value->save();
                        $national_asset->i_display_order++;
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
        $national_asset = new NationalAsset;
        $national_asset = $national_asset->where('id','=',$id)->first();
        $arrNationalAsset= $national_asset->toArray();
        $results = array('items' => $arrNationalAsset);
        return json_encode($results);
    }
      
    
    public function anyExport($parameters = null)
    {
        Excel::create('national_asset_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('National Asset'  , function($sheet) use ($parameters)
            {
                $query = NationalAsset::query();
                
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
                    
                    if(isset($i_column) && $i_column!=""){
            			$query = $query->where('i_column',$i_column);
            		}
                    if(isset($i_display_order) && $i_display_order !=""){
                        $query = $query->where('i_display_order', $i_display_order);
                    }
            		$query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'ASC');    
                }
                
                $query->select('id','i_column','i_display_order','v_thumbnail_url','created_at','updated_at');
        		$records = $query->get()->toArray();
             
                $field['no'] = 'Sr.No';
                $field['i_column'] = 'Column';
                $field['i_display_order'] = 'Display Order';
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
                
                $sheet->row(1,array('National Asset'));
                
                $sheet->cells('A2:F2', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('12');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(2,$field);
                $intCount = 3;
                foreach($records as $val){
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