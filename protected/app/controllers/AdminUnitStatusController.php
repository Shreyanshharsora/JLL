<?php
class AdminUnitStatusController extends BaseController 
{
    /* Use for cms listing*/
	public function postIndex()
	{
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }
        
        $data = Input::get();
        $unitStatus = new UnitStatus;
        //pr($data); exit;
        
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$unitStatus = $unitStatus->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $unitStatus = $unitStatus->orderBy('updated_at','DESC');
		}
        
        if(isset($data['search_fields']['v_name']) && $data['search_fields']['v_name']!=""){
			$unitStatus = $unitStatus->where('v_name', 'LIKE',"%".$data['search_fields']['v_name']."%");
		}
        
		if(isset($data['search_fields']['v_color']) && $data['search_fields']['v_color']!=""){
			$unitStatus = $unitStatus->where('v_color', 'LIKE',"%".$data['search_fields']['v_color']."%");
		}
        $unitStatus = $unitStatus->paginate($data['rec_per_page']);
        $arrCms = $unitStatus->toArray();
        $results = [
    	    'items' => $arrCms['data'],
            '_meta' => [
    	        'total'        => $unitStatus->getTotal(),
    	        'rpp'     => $unitStatus->getPerPage(),
    	        'current' => $unitStatus->getCurrentPage(),
    	        'last_page'    => $unitStatus->getLastPage(),
    	        'from'         => $unitStatus->getFrom(),
    	        'to'           => $unitStatus->getTo()
    	    ]
    	];
        return json_encode($results);
	}
    
    public function postAdd()
	{
        $data = Input::get();
        
        if(!empty($data)){
            $unit_status = new UnitStatus;
            $unit_status->v_name = $data['v_name'];
            $unit_status->v_short_name = $data['v_short_name'];
            $unit_status->v_color = $data['v_color'];
            if($unit_status->save()){
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
            $unit_status = UnitStatus::find($data['id']);
            
            $unit_status->v_name = $data['v_name'];
            $unit_status->v_short_name = $data['v_short_name'];
            $unit_status->v_color = $data['v_color'];
            if($unit_status->save()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }                
        }
    }
    public function anyDelete()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $city = UnitStatus::find($data['id']);
            if($city->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }
    
    public function anyData($id)
    {
        $unit_status = new UnitStatus;
        $unit_status = $unit_status->where('id','=',$id)->first();
        $arrUnitStatus = $unit_status->toArray();
        $results = array('items' => $arrUnitStatus);
        return json_encode($results);
    }
    
    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
                UnitStatus::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }else  if ($action == "act") { //Active Action   
                UnitStatus::whereIn('id', array_values($data['id']))->update(array("i_status" =>"1"));
                 echo "1";
            } else  if ($action == "inact") { //Inctive Action   
                UnitStatus::whereIn('id', array_values($data['id']))->update(array("i_status" =>"0"));
                echo "1";
            }
        }
    }
    
    
    
    public function anyExport($parameters = null)
    {
        Excel::create('unit_status_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Unit Status'  , function($sheet) use ($parameters)
            {
                $query = UnitStatus::query();
                
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
                    if(isset($v_color) && $v_color!=""){
                        $query = $query->where('v_color', 'LIKE',"%".$v_color."%");
                    }
            		$query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');    
                }
                
                $query->select('id','v_name','v_color','created_at','updated_at');
        		$records = $query->get()->toArray();
             
                $field['no'] = 'Sr.No';
                $field['v_name'] = 'Name';
                $field['v_color'] = 'Color';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';
                                       
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:E1');
                $sheet->setWidth(array('A' => 8,'B' => 20,'C' => 20,'D' => 20,'E' => 20));
                
                $sheet->cells('A1:E1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('Unit Status'));
                
                $sheet->cells('A2:E2', function($cell)
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
                    $sheet->getStyle('C'.$intCount)->applyFromArray(array(
                        'fill' => array(
                            'type'  => PHPExcel_Style_Fill::FILL_SOLID,
                            'color' => array('rgb' => str_replace('#','',$val['v_color']))
                        ),
                        'font' => array(
                            'type'  => PHPExcel_Style_Fill::FILL_SOLID,
                            //'color' => array('rgb' => 'ffffff')
                        )
                    ));

                    $val['id'] = $srNo;
                    $sheet->row($intCount, $val);
                    $intCount++;
                    $srNo++;
                }
            });
        
        })->download('xlsx');
    }
    
    public function postUploadForIe(){
        return ((isset($_FILES["v_img"]) and $_FILES["v_img"]["error"] == 0) ? 'data:image/' . pathinfo($_FILES["v_img"]["name"], PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($_FILES["v_img"]["tmp_name"])):"0");
    } 
}
?>