<?php
class AdminCustomSkylineController extends BaseController
{
   public function anyIndex(){
        $data = Input::get();

        //$skyline=Skyline::with('user');

        $skyline= new Skyline;

        /*if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] == "fname"){
			$skyline = $skyline->orderBy($data['order_field'],$data['sort_order']);
		}
        else if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] == "totalBuildings"){
			$skyline = $skyline->orderBy($data['order_field'],$data['sort_order']);
		}else if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] == "totalBuildings"){
			$skyline = $skyline->orderBy($data['order_field'],$data['sort_order']);
		}else if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != '' ){
		    $skyline = $skyline->orderBy("skylines.".$data['order_field'],$data['sort_order']);
        }
        else{
		    $skyline = $skyline->orderBy('skylines.updated_at','DESC');
		}*/

        if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != ''){
			$skyline = $skyline->orderBy($data['order_field'],$data['sort_order']);
		} else {
		    $skyline = $skyline->orderBy('skylines.updated_at','DESC');
		}



        if(isset($data['search_fields']['v_title']) && $data['search_fields']['v_title']!=""){
			$skyline = $skyline->where('skylines.v_title', 'LIKE',"%".trim($data['search_fields']['v_title'])."%");
		}
        if(isset($data['search_fields']['v_company_name']) && $data['search_fields']['v_company_name']!=""){
			$skyline = $skyline->where('users.v_company_name', 'LIKE',"%".trim($data['search_fields']['v_company_name'])."%");
		}

        if(isset($data['search_fields']['totalBuildings']) && $data['search_fields']['totalBuildings']!=""){
			$skyline = $skyline->having('totalBuildings',"=", trim($data['search_fields']['totalBuildings']));
		}
        if(isset($data['search_fields']['totalShared']) && $data['search_fields']['totalShared']!=""){
			$skyline = $skyline->having('totalShared',"=", trim($data['search_fields']['totalShared']));
		}
        if(isset($data['search_fields']['i_user_id']) && $data['search_fields']['i_user_id']!=""){
			$skyline = $skyline->where('users.fname', 'LIKE',"%".trim($data['search_fields']['i_user_id'])."%")->orWhere('users.lname', 'LIKE',"%".trim($data['search_fields']['i_user_id'])."%");
		}

        /*if(isset($data['search_fields']['updated_at']) && $data['search_fields']['updated_at']!=""){
            $date=date_create(trim($data['search_fields']['updated_at']));
            $udpateDate=date_format($date,'Y-m-d');
            $skyline = $skyline->where('skylines.updated_at', 'LIKE',"%".$udpateDate."%");
		}

        if(isset($data['search_fields']['created_at']) && $data['search_fields']['created_at']!=""){
            $date=date_create(trim($data['search_fields']['created_at']));
            $udpateDate=date_format($date,'Y-m-d');
            $skyline = $skyline->where('skylines.created_at', 'LIKE',"%".$udpateDate."%");
		}*/

        $skyline=$skyline->leftjoin('users', 'users.id', '=', 'skylines.i_user_id');
        $skyline=$skyline->leftjoin('skyline_buildings', 'skyline_buildings.i_skyline_id', '=', 'skylines.id')->groupBy('skylines.id');
        $skyline=$skyline->leftjoin('skyline_shared_to', 'skyline_shared_to.i_skyline_id', '=', 'skylines.id');

        $skyline = $skyline->select(DB::raw(' COUNT(  DISTINCT skyline_shared_to.id  ) as totalShared'),DB::raw(' COUNT( DISTINCT skyline_buildings.id  ) as totalBuildings'),'skylines.id','skylines.i_user_id','skylines.v_title','skylines.v_slug',DB::raw("CONCAT(users.fname,' ',users.lname) as fname"),'users.v_company_name', DB::raw('DATE_FORMAT(skylines.updated_at, \'%m/%d/%Y %h:%i %p\') AS formatted_updated_at'),DB::raw('DATE_FORMAT(skylines.created_at, \'%m/%d/%Y %h:%i %p\') AS formatted_created_at'),'skyline_buildings.i_skyline_id');



        $skyline = $skyline->paginate($data['rec_per_page']);

        //$skylineBuildingCount = SkylineBuilding::where('i_skyline_id',$id)->count();
        //$skyline['skylineBuildingCount']=$skylineBuildingCount;

        $arrSkyline = $skyline->toArray();

         $results = [
    	    'items' => $arrSkyline['data'],
            '_meta' => [
    	        'total'        => $skyline->getTotal(),
    	        'rpp'     => $skyline->getPerPage(),
    	        'current' => $skyline->getCurrentPage(),
    	        'last_page'    => $skyline->getLastPage(),
    	        'from'         => $skyline->getFrom(),
    	        'to'           => $skyline->getTo()
    	    ]
    	];

        return json_encode($results);
    }

    public function anyData($id)
    {

        $skyline = Skyline::where('id','=',$id)->with('user')->with('notes')->first();//new Skyline;
        //$skyline =$skyline->leftJoin('skyline_notes','skyline_notes.i_skyline_id','=','skylines.id');
        //$skyline =$skyline->where('skyline_notes.id','=',$id);
        //$skyline =$skyline->orderBy('skyline_notes.created_at','Desc')->first();

        $skylineBuildingCount = SkylineBuilding::where('i_skyline_id',$id)->count();
        $skylineBuildings = [];
        if($skylineBuildingCount > 0) {
            $skylineBuilding = SkylineBuilding::where('i_skyline_id',$id)->lists('i_building_id');
            //pr($skylineBuilding); exit;
            $building = Building::whereIn('buildings.id',$skylineBuilding);
            //$building->whereIn('buildings.id',$skylineBuilding);
            $building->join('cities', 'cities.id', '=', 'buildings.i_city_id');
            $building->select('buildings.v_name as building_name','cities.v_name as city_name');
            $skylineBuildings = $building->get()->toArray();            
        }
        $skylineBuildingShare = SkylineShareTo::where('i_skyline_id',$id)->get();
        $skyline['skylineBuildingCount']=$skylineBuildingCount;
        $skyline['skylineBuildingShare']=$skylineBuildingShare;
        $skyline['skylineBuildings']=$skylineBuildings;
        //$skyline = $skyline->toArray();
        $results = array('items' => $skyline);
        return json_encode($results);
    }

    public function postDelete()
    {
        $data=Input::get();
        $id=$data['id'];
        $response = new stdClass();
        $skyline = DB::table('skyline_notes')->where('id',$id)->update(array('deleted_at' => DB::raw('NOW()')));
        $skylineCount = SkylineNote::count();
        if($skyline){
            $response->Data=array('skyLineCount'=>$skylineCount);
            $response->IsSuccess=true;
            $response->Message="Note delete successfully";
        } else {
            $response->IsSuccess=false;
            $response->Message="Try after some time";
        }
        return json_encode($response);
    }

    public function postDeleteSkyline()
    {
        $data = Input::get();
        if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
            $skyline = Skyline::find($data['id']);
            $skyline->v_slug = time().'-'.$skyline->v_slug;
            $skyline->save();
            if($skyline->delete()){
                return 'TRUE';
            } else {
                return 'FALSE';
            }
        }
        return json_encode($response);
    }

    public function anyBulkActions(){
        $data = Input::all(); //get action ids

        $action = $data['action']; // action to perform(delete,active,inactive)
        if(count($data) > 0){
            //Delete Record
            if ($action == "del") { //Delete Action
            //print_r(implode(",",$data['id']));exit;

                $updateAllrecords=DB::update(DB::RAW("UPDATE skylines SET v_slug = CONCAT(UNIX_TIMESTAMP(),'-', v_slug) where id In(".implode(",",$data['id']).")"));
                Skyline::whereIn('id', array_values($data['id']))->delete();
                echo '1';
            }
        }
    }
}
?>
