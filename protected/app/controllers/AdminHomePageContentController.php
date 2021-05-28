<?php
	class AdminHomePageContentController extends BaseController
	{

        public function anyIndex(){
			$data = Input::get();

			$homePageContent=new HomePageContentBoxes;

			if(isset($data['sort_order']) && isset($data['order_field']) && $data['sort_order'] != '' && $data['order_field'] != '')
			{
				$homePageContent = $homePageContent->orderBy('e_type','ASC');
                $homePageContent = $homePageContent->orderBy($data['order_field'],$data['sort_order']);

			}else{
				$homePageContent = $homePageContent->orderBy('updated_at','DESC');
			}

			if(isset($data['search_fields']['v_title']) && $data['search_fields']['v_title']!=""){
				$homePageContent = $homePageContent->where('v_title', 'LIKE',"%".trim($data['search_fields']['v_title'])."%");
			}

			if(isset($data['search_fields']['v_desc']) && $data['search_fields']['v_desc']!=""){
				$homePageContent = $homePageContent->where('v_desc', 'LIKE',"%".trim($data['search_fields']['v_desc'])."%");
			}

			if(isset($data['search_fields']['e_type']) && $data['search_fields']['e_type']!=""){
				$homePageContent = $homePageContent->where('e_type', '=',trim($data['search_fields']['e_type']));
			}
			if(isset($data['search_fields']['e_status']) && $data['search_fields']['e_status']!=""){
				$homePageContent = $homePageContent->where('e_status', '=',trim($data['search_fields']['e_status']));
			}
            if(isset($data['search_fields']['v_box_asc_no']) && $data['search_fields']['v_box_asc_no']!=""){
				$homePageContent = $homePageContent->where('v_box_asc_no', '=',trim($data['search_fields']['v_box_asc_no']));
			}

			$homePageContent = $homePageContent->paginate($data['rec_per_page']);

			$arrBanners = $homePageContent->toArray();
			$results = [
	    	    'items' => $arrBanners['data'],
	            '_meta' => [
					'total'        => $homePageContent->getTotal(),
					'rpp'     => $homePageContent->getPerPage(),
					'current' => $homePageContent->getCurrentPage(),
					'last_page'    => $homePageContent->getLastPage(),
					'from'         => $homePageContent->getFrom(),
					'to'           => $homePageContent->getTo()
	    	    ]
			];

			return json_encode($results);
		}

		public function anyData($id)
		{
			$homePageContent = HomePageContentBoxes::where('id','=',$id)->first();//new Skyline;
			$homePageContent = $homePageContent->toArray();
			$results = array('items' => $homePageContent);
			return json_encode($results);
		}

		public function anyDelete()
		{
			$data = Input::get();
			if(!empty($data) && $data['id'] != '' && $data['id'] != 0){
				$homePageContent = HomePageContentBoxes::find($data['id']);
				if($homePageContent->delete()){
					return 'TRUE';
					} else {
					return 'FALSE';
				}
			}
		}

		public function postAdd(){
			$data=Input::get();

		  	if(!empty($data)){

                $homePageContent = new HomePageContentBoxes;

                if(isset($data['v_image']) &&  array_key_exists('v_image',$data) && $data['v_image'] != ""){
                    $v_random_image = time().'-'.str_random(6);
                    $base64_backgroundImg = $data['v_image'].'=';
                    $path_image = HOME_PAGE_CONTENT_IMAGE;
                    $backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path_image);
                    $homePageContent->v_image= $backgroundImageName;

                }

				if((array_key_exists('v_video',$data) && isset($data['v_video']) && $data['v_video']!="")){
                    $queryString = parse_url($data['v_video'], PHP_URL_QUERY);
                    parse_str($queryString, $params);
                    $vidID=$params['v'];
                    $thumb_default = file_get_contents("http://img.youtube.com/vi/".$vidID."/default.jpg");
                    $v_random_image = time().'-'.str_random(6).'.jpg';

                    $path = HOME_PAGE_CONTENT_VIDEO;

                    $file_loc=$path.$v_random_image;
                    $file_handler=fopen($file_loc,'w');
                    fwrite($file_handler,$thumb_default);
                	fclose($file_handler);
                    @unlink($thumb_default);
                    $homePageContent->v_video = $data['v_video'];
                    $homePageContent->v_video_thumbnail = $v_random_image;
                }

                $homePageContent->v_title = $data['v_title'];
                $homePageContent->e_type = $data['e_type'];
				$homePageContent->e_status = $data['e_status'];
				$homePageContent->v_desc =  $data['v_desc'];
                $homePageContent->v_button_text = (array_key_exists('v_button_text',$data) && isset($data['v_button_text']))? $data['v_button_text']:'';
				$homePageContent->v_link = (array_key_exists('v_link',$data) && isset($data['v_link']))?$data['v_link']:'';
                $homePageContent->e_type = $data['e_type'];

				if($homePageContent->save()){
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
                $homePageContent = HomePageContentBoxes::find($data['id']);

				if(isset($data['v_image']) &&  array_key_exists('v_image',$data) && $data['image_type_grid'] == "New" && $data['selectedType'] == "Image"){

                    if($homePageContent->v_video_thumbnail){
                        @unlink(HOME_PAGE_CONTENT_VIDEO.$homePageContent->v_video_thumbnail);
                    }

                    $backgroundImageName = '';
    				$v_random_image = time().'-'.str_random(6);
    				if($data['image_type_grid'] == 'New'){
    					@unlink(HOME_PAGE_CONTENT_IMAGE.$homePageContent->v_image);
    				}
    				if($data['image_type_grid'] == 'New'){
    					$base64_backgroundImg = $data['v_image'].'=';
    					$path = HOME_PAGE_CONTENT_IMAGE;
    					$backgroundImageName = $this->saveImage($base64_backgroundImg, $v_random_image, $path);
    					$homePageContent->v_image = $backgroundImageName;
    				}

                    $homePageContent->v_video='';
                    $homePageContent->v_video_thumbnail = '';
				}

                if((array_key_exists('v_video',$data) && isset($data['v_video']) && $data['v_video']!="") && $data['selectedType'] == "Video"){
                    $output_array=$match=[];
                    $videoUrl=$data['v_video'];

                    if(preg_match("/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/", $videoUrl, $match)){
                        $queryString = parse_url($data['v_video'], PHP_URL_QUERY);
                        parse_str($queryString, $params);
                        $vidID=$params['v'];
                        $videoThumbUrl="http://img.youtube.com/vi/".$vidID."/maxresdefault.jpg";
                    }else{
                        if(preg_match("/(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/", $videoUrl, $output_array)) {
                		  $vimeoUrlID=$output_array[5];
                          $videoThumbUrl=@unserialize(file_get_contents("http://vimeo.com/api/v2/video/$vimeoUrlID.php"));
                            if ($videoThumbUrl === FALSE) {
                                return 'FALSE';
                            } else {
                                $videoThumbUrl=$videoThumbUrl[0]['thumbnail_large'];
                            }

                        }
                    }

                    $thumb_default = file_get_contents($videoThumbUrl);
                    $v_random_image = time().'-'.str_random(6).'.jpg';

                    $path = HOME_PAGE_CONTENT_VIDEO;

                    $file_loc=$path.$v_random_image;
                    $file_handler=fopen($file_loc,'w');
                    fwrite($file_handler,$thumb_default);
                	fclose($file_handler);
                    @unlink($thumb_default);

                    if($homePageContent->v_video_thumbnail){
                        @unlink(HOME_PAGE_CONTENT_VIDEO.$homePageContent->v_video_thumbnail);
                    }

                    if($homePageContent->v_image){
                        @unlink(HOME_PAGE_CONTENT_IMAGE.$homePageContent->v_image);
                    }
                    //}

                    $homePageContent->v_video = $data['v_video'];
                    $homePageContent->v_video_thumbnail = $v_random_image;
                    $homePageContent->v_image = '';
                }

                $homePageContent->v_title = $data['v_title'];
                $homePageContent->v_desc =  $data['v_desc'];
				$homePageContent->e_status = $data['e_status'];
                $homePageContent->v_button_text = (array_key_exists('v_button_text',$data) && isset($data['v_button_text']))? $data['v_button_text']:'';
				$homePageContent->v_link = (array_key_exists('v_link',$data) && isset($data['v_link']))?$data['v_link']:'';
                $homePageContent->e_type = $data['e_type'];
                $homePageContent->e_link_open = $data['linkType'];

				if($homePageContent->save()){
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

                $homePageContent = HomePageContentBoxes::find($data['id']);
				$homePageContent->e_type = $data['status']?'LoggedIn':'LoggedOut';

				if($homePageContent->save()){
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
					HomePageContentBoxes::whereIn('id', array_values($data['id']))->delete();
					echo '1';
					}else  if ($action == "act") { //Active Action
					HomePageContentBoxes::whereIn('id', array_values($data['id']))->update(array("e_status" =>"1"));
					echo "1";
					} else  if ($action == "inact") { //Inctive Action
					HomePageContentBoxes::whereIn('id', array_values($data['id']))->update(array("e_status" =>"0"));
					echo "1";
				}
			}
		}

		public function anyExport($parameters = null)
		{
			Excel::create('homepagecontent_'.time(), function($excel) use ($parameters)
			{
				$excel->sheet('HomePgaeContent'  , function($sheet) use ($parameters)
				{
					$query = HomePageContentBoxes::query();

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

                        if(isset($e_type) && $e_type!=""){
							$query = $query->where('e_type', '=',$e_type);
						}

                        if(isset($v_box_no) && $v_box_no!=""){
							$query = $query->where('v_box_no', '=',$v_box_no);
						}

						$query->orderBy($sort, $order);
						} else {
						$query->orderBy('id', 'DESC');
					}

					$query->select('id','v_title','v_image','v_video','v_desc','v_button_text','v_link','e_type','e_status','v_box_no','created_at','updated_at');
					$records = $query->get()->toArray();

					$field['no'] = 'Sr.No';
					$field['v_title'] = 'Title';
					$field['v_image'] = 'Image';
					$field['v_video'] = 'Video';
                    $field['v_desc'] = 'Description';
                    $field['v_button_text'] = 'Button Text';
                    $field['v_link'] = 'Button Link';
                    $field['e_type'] = 'Content will display';
					$field['e_status'] = 'Status';
                    $field['v_box_no'] = 'Content Box';
					$field['created_at'] = 'Created On';
					$field['updated_at'] = 'Last Updated';

					$sheet->setHeight(1, 30);
					$sheet->mergeCells('A1:k1');
					$sheet->setWidth(array('A' => 8,'B' => 30,'C' => 30,'D' => 30,'E' => 50,'F' => 30,'G' => 30,'H' => 30,'I' => 15,'J' => 30,'K' => 30));

					$sheet->cells('A1:k1', function($cell)
					{
						$cell->setAlignment('center');
						$cell->setValignment('middle');
						$cell->setFontSize('20');
						$cell->setFontWeight('bold');
					});

					$sheet->row(1,array('Home Page Content Box'));

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
						if($val['e_type'] == 'LoggedOut'){
                            $val['e_type'] = 'Before Login';
                        }else{
                            $val['e_type'] = 'After Login';
                        }
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
