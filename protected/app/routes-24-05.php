<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
Route::any('/user-login-status',array('uses' => 'LoginController@user_login_status'));
Route::any('/login-setting',array('uses' => 'LoginController@login_setting'));
Route::any('/user-registration',array('uses' => 'LoginController@postUserRegister'));
Route::any('/forgot-password',array('uses' => 'LoginController@forgot_password'));
Route::any('/logout',array('uses' => 'LoginController@logout'));
Route::any('/check-login',array('uses' => 'LoginController@checkLogin'));
Route::any('/submit-change-password',array('uses' => 'LoginController@change_password'));

Route::post('/contact',array('uses' => 'HomeController@contact'));
Route::get('/contact-us/data',array('uses' => 'HomeController@data'));

Route::get('/api-home-page',array('uses' => 'HomeController@home_page_data'));
Route::get('/',array('uses' => 'HomeController@index'));
Route::get('/national-asset/{id}',array('uses' => 'HomeController@share1'));
Route::get('/city-asset/{id}',array('uses' => 'HomeController@share2'));
Route::get('/downloads/{filename}',array('uses' => 'HomeController@downloads'));
Route::controller('cities', 'CitiesController');

//Route::get('/skyline-data/edit-skyline-name',array('uses' => 'CustomSkylineController@anyEditSkyLineName'));
Route::controller('skyline-data', 'CustomSkylineController');

//After Login
Route::group(array('prefix' => ADMIN_NAME,'before' => 'auth'), function() {
	Route::any('/logout',array('uses' => 'AdminAuthenticateController@logout'));
	Route::any('/{url}',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/{url}/{param1}',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/{url}/{param1}/{param2}',array('uses' => 'AdminAuthenticateController@dashboard'));
});

Route::group(array('prefix' => API_ADMIN_NAME, 'before' => 'auth'), function(){
    /* Login required and with api prefix */
    Route::any('/check-auth-status',array('uses' => 'AdminAuthenticateController@check_auth_status'));
    Route::any('/check-login-status',array('uses' => 'AdminAuthenticateController@check_login_status'));
    Route::any('/send-forgot-password',array('uses' => 'AdminAuthenticateController@forgot_password'));
    Route::any('/reset-password/{access_code}',array('uses' => 'AdminAuthenticateController@reset_password'));
    Route::any('/reset-password-status/{access_code}',array('uses' => 'AdminAuthenticateController@reset_password_status'));

    Route::any('/my_profile',array('uses' => 'AdminAuthenticateController@my_profile'));
    Route::any('/edit_profile',array('uses' => 'AdminAuthenticateController@edit_profile'));
    Route::any('/dashboard-record',array('uses' => 'AdminAuthenticateController@postDashboardRecord'));

    Route::controller('users', 'AdminUsersController');
    Route::controller('cms', 'AdminCmsController');
    Route::controller('buildings', 'AdminBuildingsController');
    Route::controller('cities', 'AdminCitiesController');
    Route::controller('unit-status', 'AdminUnitStatusController');
    Route::controller('national-asset', 'AdminNationalAssetController');
    Route::controller('city-asset', 'AdminCityAssetController');
    Route::controller('settings', 'AdminSettingsController');
    Route::controller('domains', 'AdminDomainsController');
    Route::controller('custom-skyline', 'AdminCustomSkylineController');
    Route::controller('home-page-banners', 'AdminHomePageBannerController');
    Route::controller('home-image-rotation', 'AdminHomePageImageRotationController');
    Route::controller('home-page-content', 'AdminHomePageContentController');
});
//Before Login Admin
Route::group(array('prefix' => ADMIN_NAME,'before' => 'guest'),function(){
    $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
    $pageData = $pageData->groupBy('e_page_type');



	Route::any('/',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/dashboard',array('uses' => 'AdminAuthenticateController@dashboard'));
});

Route::group(array('before' => 'guest'),function(){
    Route::get('/login', function() {
        $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
    $pageData = $pageData->groupBy('e_page_type');
        $countriesData = City::where('i_status','1')->select('id', 'v_name', 'v_slug')->orderBy('v_name')->get()->toArray();
        return View::make('index')->with(array('footer_link'=>$pageData, 'cms'=>'false','headerCountryData' => $countriesData ));
    });
    Route::get('/register', function() {
        $countriesData = City::where('i_status','1')->select('id', 'v_name', 'v_slug')->orderBy('v_name')->get()->toArray();
        $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
    $pageData = $pageData->groupBy('e_page_type');
        return View::make('index')->with(array('footer_link'=>$pageData, 'cms'=>'false' ,'headerCountryData' => $countriesData ));
    });
});

Route::get('/contact-us', function() {
    $countriesData = City::where('i_status','1')->select('id', 'v_name', 'v_slug')->orderBy('v_name')->get()->toArray();
    $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
$pageData = $pageData->groupBy('e_page_type');
    return View::make('index')->with(array('footer_link'=>$pageData, 'cms'=>'false','headerCountryData' => $countriesData));
});

Route::get('/{slug}', function($slug) {
    // if there is matching slug, attempt to render page
    if (Auth::guest()->check()){
        $userData = Auth::guest()->get();
	} else if (Auth::user()->check()){
		$userData = Auth::user()->get();
    }

	// query DB to see if slug is in pages table
    $page = DB::table('pages')->where('v_slug', $slug)->first();
    //$countriesData = Country::With('cities')->get()->toArray();
    $countriesData = City::where('i_status','1')->select('id', 'v_name', 'v_slug')->orderBy('v_name')->get()->toArray();

    if((count($page) > 0)) {
        if (!Auth::guest()->check() && !Auth::user()->check() && $page->e_show_in_footer != '1') {
            if(isset($_SERVER['REDIRECT_QUERY_STRING'])) {
                Session::put('last_page_url', Request::url()."?".$_SERVER['REDIRECT_QUERY_STRING']);
                return Redirect::to(SITE_URL."?".$_SERVER['REDIRECT_QUERY_STRING']); exit;
            }
            else {
                Session::put('last_page_url', Request::url());
                return Redirect::to(SITE_URL); exit;
            }
        }
        if($page->e_show_in_footer == '1' && !isset($userData)) {
            $userData = (object) array();
        }
        if($page) {
            $industryDataArray = array('0'=>'Banking/financial','1'=>'Cleantech','2'=>'Data centers','3'=>'Education','4'=>'Government','5'=>'Healthcare','6'=>'Hotels/hospitality','7'=>'Industrial/logistics','8'=>'Law','9'=>'Life sciences','10'=>'Non-profit', '11'=>'Real estate consulting', '12'=>'Real estate investment', '13'=>'Retail', '14'=>'Supply chain', '15'=>'Technology', '16'=>'Other');
            $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
    $pageData = $pageData->groupBy('e_page_type');

            $citiesData = City::where('i_status','1')->orderBy('v_name')->get()->toArray();

    		return View::make('page')->with(array('content'=>$page,'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cities'=>$citiesData, 'industryDataArray'=>$industryDataArray, 'cms'=>'true','userData'=>$userData));
        } else {
           $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
    $pageData = $pageData->groupBy('e_page_type');
            return View::make('index')->with(array('content'=>$page, 'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'false','userData'=>$userData));
        }
    } else {
        $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
        $pageData = $pageData->groupBy('e_page_type');

        if(!isset($userData)) { $userData = ''; }
        return Response::view('404', array('content'=>false,'userData'=>'','footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'true','userData'=>$userData), 404); //return Redirect::to(SITE_URL.'404');
    }
});

Route::get('/city/{code}', function($code) {
    //$countriesData = Country::With('cities')->get()->toArray();
    if (Auth::guest()->check()){
        $userData = Auth::guest()->get();
    } else if (Auth::user()->check()){
        $userData = Auth::user()->get();
    }
    $userCustomSkylines=[];
    if(isset($userData) && $userData!="" &&  $userData->id){
        $userCustomSkylines=Skyline::where('i_user_id',$userData->id)->select('v_title','v_slug')->get()->toArray();
    }

    $city = City::select('id', 'v_name', 'v_slug')->where('v_slug', $code)->first();

    if((count($city)) > 0) {
        $countriesData = City::select('id', 'v_name', 'v_slug')->where('i_status', '1')->orderBy('v_name')->get()->toArray();
        if(!empty($countriesData)) {

            if (!Auth::guest()->check() && !Auth::user()->check()) {
                if(isset($_SERVER['REDIRECT_QUERY_STRING'])) {
                    Session::put('last_page_url', Request::url()."?".$_SERVER['REDIRECT_QUERY_STRING']);
                    return Redirect::to(SITE_URL."?".$_SERVER['REDIRECT_QUERY_STRING']); exit;
                }
                else {
                    Session::put('last_page_url', Request::url());
                    return Redirect::to(SITE_URL); exit;
                }
            }
            $page = (object) array('v_title'=>$city['v_skyline_title'], 'v_meta_title'=>$city['v_skyline_title']);
            $pageData = Cms::where('status','=','1')->select('v_title','v_external_link','v_slug','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
            $pageData = $pageData->groupBy('e_page_type');

            return View::make('index')->with(array('content'=>$page,'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'false','userData'=>$userData,'userCustomSkylines'=>$userCustomSkylines));
        } else {
            return Response::make('Unauthorized', 401);
        }
    } else {
		if(@$slug == '404') {
            $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
            $pageData = $pageData->groupBy('e_page_type');

            $countriesData = City::select('id', 'v_name', 'v_slug')->where('i_status', '1')->orderBy('v_name')->get()->toArray();
            return Response::view('404', array('content'=>false,'userData'=>'','footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'true','userData'=>$userData,'userCustomSkylines'=>$userCustomSkylines), 404); //return Redirect::to(SITE_URL.'404');
        } else {
			return Redirect::to(SITE_URL);
        }
    }
});

Route::get('/my-skyline/{code}', function($code) {
    //$countriesData = Country::With('cities')->get()->toArray();
    if (Auth::guest()->check()){
        $userData = Auth::guest()->get();
    } else if (Auth::user()->check()){
        $userData = Auth::user()->get();
    }else{
        $userData ="";
    }
    
    $userCustomSkylines=[];
    if(isset($userData) && $userData!="" &&  $userData->id){
        $userCustomSkylines=Skyline::where('i_user_id',$userData->id)->select('v_title','v_slug')->get()->toArray();
    }
    
    $skyline = Skyline::where('v_slug', $code)->first();
    if((count($skyline)) > 0) {
		$skyline = $skyline->toArray();
		$countriesData = City::select('id', 'v_name', 'v_slug')->where('i_status','1')->orderBy('v_name')->get()->toArray();

        if(!empty($countriesData)) {
            if (!Auth::guest()->check() && !Auth::user()->check()) {
                if(isset($_SERVER['REDIRECT_QUERY_STRING'])) {
                    Session::put('last_page_url', Request::url()."?".$_SERVER['REDIRECT_QUERY_STRING']);
                    return Redirect::to(SITE_URL."?".$_SERVER['REDIRECT_QUERY_STRING']); exit;
                }
                else {
                    Session::put('last_page_url', Request::url());
                    return Redirect::to(SITE_URL); exit;
                }
            }
            $page = (object) array('v_title' => $skyline['v_title'], 'v_meta_title' => $skyline['v_title']);
            $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
            $pageData = $pageData->groupBy('e_page_type');

            return View::make('index')->with(array('content' => $page,'footer_link' => $pageData, 'headerCountryData' => $countriesData, 'cms' => 'false','userData' => $userData,'userCustomSkylines'=>$userCustomSkylines));
        } else {
            return Response::make('Unauthorized', 401);
        }
    } else {
		if(@$slug == '404') {
            $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
            $pageData = $pageData->groupBy('e_page_type');

            $countriesData = City::select('id', 'v_name', 'v_slug')->where('i_status', '1')->orderBy('v_name')->get()->toArray();
            return Response::view('404', array('content'=>false,'userData'=>'','footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'true','userData'=>$userData,'userCustomSkylines'=>$userCustomSkylines), 404); //return Redirect::to(SITE_URL.'404');
        } else {
			return Redirect::to(SITE_URL);
        }
    }
});


App::missing(function($exception) {
    // if there is matching slug, attempt to render page
	$userData = [];
    if (Auth::guest()->check()){
        $userData = Auth::guest()->get();
    } else if (Auth::user()->check()){
        $userData = Auth::user()->get();
    }else{
        $userData ="";
    }
    
    $userCustomSkylines=[];
    
    if(isset($userData) && $userData!="" &&  $userData->id){
        $userCustomSkylines=Skyline::where('i_user_id',$userData->id)->select('v_title','v_slug')->get()->toArray();
    }
    $countriesData = City::select('id', 'v_name', 'v_slug')->where('i_status', '1')->orderBy('v_name')->get()->toArray();
    $pageData = Cms::where('status','=','1')->select('v_title','v_slug','v_external_link','e_show_in_footer','i_order','id', 'e_page_type')->orderBy('i_order','ASC')->get();
    $pageData = $pageData->groupBy('e_page_type');

	return Response::view('404', array('content'=>false,'userData'=>'','footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'true', 'userData'=>$userData,'userCustomSkylines'=>$userCustomSkylines), 404); //return Redirect::to(SITE_URL.'404');
});
