<?php
class AdminDomainsController extends BaseController
{
    /* Use for Domain listing*/
	public function postIndex()
	{
	    if(!$this->checkAuthentication())
        {
            return json_encode(array());
        }

        $data = Input::get();
        $domain = new Domain;
        //pr($data); exit;
        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$domain = $domain->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $domain = $domain->orderBy('updated_at','DESC');
		}
        if(isset($data['search_fields']['name']) && $data['search_fields']['name']!=""){
			$domain = $domain->where('v_domain_name','like', '%'.$data['search_fields']['name'].'%');
		}
        $domain = $domain->paginate($data['rec_per_page']);

        $arrDomain = $domain->toArray();
        $results = [
    	    'items' => $arrDomain['data'],
            '_meta' => [
    	        'total'        => $domain->getTotal(),
    	        'rpp'     => $domain->getPerPage(),
    	        'current' => $domain->getCurrentPage(),
    	        'last_page'    => $domain->getLastPage(),
    	        'from'         => $domain->getFrom(),
    	        'to'           => $domain->getTo()
    	    ]
    	];
        return json_encode($results);
	}

    public function anyData($id)
    {
        $domain = new Domain;
        $domain = $domain->where('id','=',$id)->first();
        $arrDomain = $domain->toArray();
        $results = array('items' => $arrDomain);
        return json_encode($results);
    }

    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
                Domain::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }
        }
    }
    public function anyExport($parameters = null)
    {
        Excel::create('domain_'.time(), function($excel) use ($parameters)
        {
            $excel->sheet('DOMAINS'  , function($sheet) use ($parameters)
            {
                $query = Domain::query();

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

                    if(isset($name) && $name!=""){
            			$query = $query->where('v_domain_name', 'LIKE',"%".$name."%");
            		}
                    $query->orderBy($sort, $order);
                } else {
                    $query->orderBy('id', 'DESC');
                }

                $query->select('id','v_domain_name','created_at','updated_at');
        		$records = $query->get()->toArray();

                $field['no'] = 'Sr.No';
                $field['v_domain_name'] = 'Domain Name';
                $field['created_at'] = 'Created On';
                $field['updated_at'] = 'Last Updated';

                $sheet->setHeight(1, 30);
                $sheet->mergeCells('A1:D1');
                $sheet->setWidth(array('A'     =>  8,'B'     =>  40,'C'     =>  40,'D'     =>  40));

                $sheet->cells('A1:D1', function($cell)
                {
                    $cell->setAlignment('center');
                    $cell->setValignment('middle');
                    $cell->setFontSize('20');
                    $cell->setFontWeight('bold');
                });

                $sheet->row(1,array('Domains'));

                $sheet->cells('A2:D2', function($cell)
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

    public function postCheckEmailExist(){
        $data = Input::get();

        if(!empty($data) && $data['email'] != ''){
            $domain_data = new Domain;
            $domain_data = $domain_data->where('email','=',$data['email']);
            if(isset($data['id']) && $data['id'] != ''){
                $domain_data = $domain_data->where('id','!=',$data['id']);
            }
            $domain_data = $domain_data->get()->toArray();

            if(!empty($domain_data)){
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

            $domain = new Domain;
            $domain_data = Domain::where('v_domain_name', $data['v_domain_name'])->count();
            if($domain_data > 0){
                $messages['error']["v_domain_name"] = "['The domain name has already been taken.']";
                return  $messages;
                exit;
            }
            $domain->v_domain_name = $data['v_domain_name'];
            $domain->created_at  = date("Y-m-d H:i:s");
            $domain->updated_at  = date("Y-m-d H:i:s");
            if($domain->save()){
                return $domain;
            } else {
                return 'FALSE';
            }

        }
    }

    public function postEdit()
	{
        $data = Input::get();

        if(!empty($data)){
            $domain_data = Domain::where('id','!=',$data['id'])->where('v_domain_name', $data['v_domain_name'])->count();
            if($domain_data > 0){
                $messages['error']["v_domain_name"] = "['The domain name has already been taken.']";
                return  $messages;
                exit;
            }
            $domain = Domain::find($data['id']);
            $domain->v_domain_name = $data['v_domain_name'];
            $domain->updated_at  = date("Y-m-d H:i:s");
            if($domain->save()){
                return $domain;
            } else {
                return 'FALSE';
            }

        }
    }

    public function anyDomainDelete()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $domain = Domain::find($data['id']);
            if($domain->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
    }


    public function postUploadForIe(){
        return ((isset($_FILES["v_img"]) and $_FILES["v_img"]["error"] == 0) ? 'data:image/' . pathinfo($_FILES["v_img"]["name"], PATHINFO_EXTENSION) . ';base64,' . base64_encode(file_get_contents($_FILES["v_img"]["tmp_name"])):"0");
    }

    /*to import from csv**************************
    $file = fopen(WWW_ROOT."files/demail.csv","r");
    while(! feof($file))
    {
        $domian = fgetcsv($file);
        $email = strstr(trim($domian[0]), '@');
        $email = ltrim($email,"@");
        if($email != '') {
            $dlist[$email] = $email;
        }
    }
    fclose($file);
    foreach ($dlist as $key => $value) {
        $domain = new Domain;
        $domain_data = Domain::where('v_domain_name', $value)->count();
        if($domain_data > 0){
            echo $value."The domain name has already been taken.<br />";
        } else {
            $domain->v_domain_name = $value;
            $domain->created_at  = date("Y-m-d H:i:s");
            $domain->updated_at  = date("Y-m-d H:i:s");
            $domain->save();
        }
    } exit;*/
}
?>
