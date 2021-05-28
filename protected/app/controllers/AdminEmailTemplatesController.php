<?php
class AdminEmailTemplatesController extends BaseController 
{
    /* Use for cms listing*/
    public function postIndex()
    {
        if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }
        $data = Input::get();
        $email_template = new EmailTemplate;
        //pr($data); exit;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
            $email_template = $email_template->orderBy($data['order_field'],$data['sort_order']);
        } else {
            $email_template = $email_template->orderBy('v_template_title','ASC');
        }
        
        if(isset($data['search_fields']['v_template_title']) && $data['search_fields']['v_template_title']!=""){
			$email_template = $email_template->where('v_template_title', 'LIKE',"%".$data['search_fields']['v_template_title']."%");
		}

        //$faq->where('i_parent_id', '=',0);
        $email_template = $email_template->paginate($data['rec_per_page']);
        $arrEmailTemplate = $email_template->toArray();
        //echo get_last_query();
        $results = [
            'items' => $arrEmailTemplate['data'],
            '_meta' => [
                'total'        => $email_template->getTotal(),
                'rpp'     => $email_template->getPerPage(),
                'current' => $email_template->getCurrentPage(),
                'last_page'    => $email_template->getLastPage(),
                'from'         => $email_template->getFrom(),
                'to'           => $email_template->getTo()
            ]
        ];
        return json_encode($results);
    }

    public function anyAdvertisementDelete()
    {
        return "TRUE"; 
    }
    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Faq
            if ($action == "del") {
                //delete Faq  loop
                echo "Delete";
                die;
            }else  if ($action == "0") { //Active Faq   
                //User::whereIn('id', array_values($data['id']))->update(array("i_status" =>"1"));
                 echo "1";
            } else  if ($action == "1") { //Inctive Faq   
                //User::whereIn('id', array_values($data['id']))->update(array("i_status" =>"0"));
                echo "0";
                
            }
        }
    }
    public function anyExport($parameters = null)
    {
        Excel::create('email_template_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('Email Template'  , function($sheet) use ($parameters)
            {
                $query = Faq::query();
                if($parameters != ''){             
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
                    
                    if(isset($v_question) && $v_question!=""){
                        $query = $query->where('v_question', 'LIKE',"%".$v_question."%");
                    }
                    if(isset($v_answer) && $v_answer!=""){
                        $query = $query->where('v_answer', 'LIKE',"%".$v_answer."%");
                    }
                    if(isset($e_status) && $e_status!=""){
                        $query = $query->where('e_status', '=',$e_status);
                    }
                }
                
                $query->orderBy($sort, $order);
                $query->orderBy('id', 'DESC');        
                $query->select('id','v_question','v_answer','i_order','e_status','created_at','updated_at');
                $records = $query->get()->toArray();
               
                $field['no'] = 'Sr.No';
                $field['v_question'] = 'Question';
                $field['v_answer'] = 'Answer';
                $field['i_order'] = 'Order No.';
                $field['e_status'] = 'Status';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';
                                       
                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:J1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  50,'C'     =>  70,'D'     =>  15,'E'     =>  10,'F'     =>  10,'G'     =>  10,'H'     =>  10,'I'     =>  10,'J'     =>  10,));
                
                $sheet->cells('A1:J1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });
                
                $sheet->row(1,array('CMS'));
                
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
                    $sheet->row($intCount, $val);
                    $intCount++;
                    $srNo++;
                }
            });
        
        })->download('xlsx');
    }
    
    public function postAdd()
    {
        return "TRUE";  
    }
    
    public function postEdit()
    {
        return "TRUE";  
        $data = Input::all();
        if(!empty($data))
        {
            $faq = Faq::find($data['id']);
            $oldOrder = $faq->i_order;
            foreach($data as $k => $v){
                if($k != "created_at" && $k != "updated_at")
                {
                    $faq->$k = $v;
                }   
            } 
            if($faq->save())
            {
                if($oldOrder != $faq->i_order)
                {
                    $id = $data['id'];
                    // Faq reorder 
                    $faqOrder = Faq::where('i_order','=',$faq->i_order)->where('id','<>', $id)->get()->toArray(); // select duplicate order
                    if(count($faqOrder) > 0)
                    {
                        if($oldOrder > $faq->i_order){ // High to low order
                            $highToLowFaq = Faq::where('i_order','>=',$faq->i_order)
                                                ->where('i_order','<',$oldOrder)
                                                ->where('id','<>',$id)->orderBy('i_order','asc')
                                                ->get()->toArray();
                            $highToLowFaq1=array();
                            foreach($highToLowFaq as $val){
                                $highToLowFaq1[$val['id']]=$val['i_order'];    
                            }
                            $order = $faq->i_order;
                            foreach($highToLowFaq1 as $key=>$val){
                                $reSetOrder = Faq::find($key);
                                $order = $order + 1;
                                $reSetOrder->i_order = $order;
                                $reSetOrder->save();   
                            } 
                        }else{  // Low to high order
                            $lowTohighFaq = Faq::where('i_order','<=',$faq->i_order)
                                                    ->where('i_order','>',$oldOrder)
                                                    ->where('id','<>',$id)
                                                    ->orderBy('i_order','asc')
                                                ->get()->toArray();
                            
                            $lowTohighFaq1 = array();
                            foreach($lowTohighFaq as $val){
                                $lowTohighFaq1[$val['id']] = $val['i_order'];    
                            }
                            
                            foreach($lowTohighFaq1 as $key => $val){
                                $reSetOrder = Faq::find($key);
                                $reSetOrder->i_order = $reSetOrder->i_order - 1;
                                $reSetOrder->save();   
                            } 
                        }
                    }else{
                        // High Order
                        $highFaq = Faq::where('i_order','>=',$oldOrder)
                                            ->where('id','<>',$id)
                                            ->orderBy('i_order','asc')
                                            ->get()->toArray();
                                $highFaq1 = array();
                                foreach($highFaq as $val){
                                    $highFaq1[$val['id']]=$val['i_order'];    
                                }
                                foreach($highFaq1 as $key=>$val){
                                    $reSetOrder = Faq::find($key);
                                    $order = $reSetOrder->i_order - 1;
                                    $reSetOrder->i_order =  $order;
                                    $reSetOrder->save();   
                                }
                                $order = Faq::count();
                                $reSetOrder = Faq::find($id);
                                $reSetOrder->i_order = $order;
                                $reSetOrder->save();
                    }
                }
                return "TRUE";  
            } else {
                return "FALSE";
            }
        }
    }
    
    public function postChangeStatus()
    {
        return "TRUE"; 
        $data = Input::all();
        if(!empty($data)){
            $faq = Faq::find($data['id']);
            $faq->e_status = $data['status'];
            if($faq->save()){
                return "TRUE";  
            } else {
                return "FALSE";
            }  
        }
    }
    
    public function postExport(){
        $flag = 0;
        $data = Input::get();
        $cms = new Cms;
        
        if($data['sort_order'] != '' && $data['order_field'] != ''){
            $cms = $cms->orderBy($data['order_field'],$data['sort_order']);
        }
        
        if(isset($data['search_fields']['v_cms_title']) && $data['search_fields']['v_cms_title']!=""){
            $flag = 1;
            $cms = $cms->where('v_cms_title', 'LIKE',"%".$data['search_fields']['v_cms_title']."%");
        }
        
        if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
            $flag = 1;
            $cms = $cms->where('e_status', '=',$data['search_fields']['e_status']);
        }
        
        $cms->where('i_parent_id', '=',0);
        $cms = $cms->with('subcms')->paginate($data['rec_per_page']);
        $cms_array = $cms->toArray();
        
        if($flag == 0){
            $new_array = array();
            foreach($cms_array['data'] as $data){
                $new_array[] = $data;
                if(!empty($data['subcms'])){
                    foreach($data['subcms'] as $val){
                        $new_array[] = $val;
                    }
                }
            }
            $cms_array['data'] = $new_array;
        }
        
        $cms_parent = Cms::where('i_parent_id', '=', 0)->get(array('v_cms_title','id'));
        
        //echo get_last_query();
        $results = [
            'items' => $cms_array['data'],
            'parent_items' => $cms_parent,
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
    
    public function postUploadForIe(){
        return ((isset($_FILES["v_img"]) and $_FILES["v_img"]["error"] == 0) ? 'data:image/' . pathinfo($_FILES["v_img"]["name"], PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($_FILES["v_img"]["tmp_name"])):"0");
    } 
}
?>