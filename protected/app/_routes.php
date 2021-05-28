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
Route::get('/api-home-page',array('uses' => 'HomeController@home_page_data'));
Route::get('/',array('uses' => 'HomeController@index'));
Route::get('/national-asset/{id}',array('uses' => 'HomeController@share1'));
Route::get('/city-asset/{id}',array('uses' => 'HomeController@share2'));
Route::get('/downloads/{filename}',array('uses' => 'HomeController@downloads'));
Route::controller('cities', 'CitiesController');

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
});
//Before Login Admin
Route::group(array('prefix' => ADMIN_NAME,'before' => 'guest'),function(){
	Route::any('/',array('uses' => 'AdminAuthenticateController@dashboard'));
    Route::any('/dashboard',array('uses' => 'AdminAuthenticateController@dashboard'));
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
            $pageData = Cms::where('status','=','1')->orderBy('i_order','ASC')->get();
            
            $citiesData = City::where('i_status','1')->orderBy('v_name')->get()->toArray();
            if($pageData) { $pageData = $pageData->toArray(); }        
    		return View::make('page')->with(array('content'=>$page,'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cities'=>$citiesData, 'industryDataArray'=>$industryDataArray, 'cms'=>'true','userData'=>$userData));
        } else {
            $pageData = Cms::where('status','=','1')->orderBy('i_order','ASC')->get();
            return View::make('index')->with(array('content'=>$page,'footer_link'=>$pageData, 'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'false','userData'=>$userData));
        }
    } else {
        if($slug == '404'){
            return Redirect::to(SITE_URL.'404');
        } else {                        
            return Redirect::to(SITE_URL); 
        }
        
    }
});

Route::get('/{slug}/{code}', function($slug, $code) {
    //$countriesData = Country::With('cities')->get()->toArray();
    if (Auth::guest()->check()){
        $userData = Auth::guest()->get();        
    } else if (Auth::user()->check()){
        $userData = Auth::user()->get();        
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
            $pageData = Cms::where('status','=','1')->orderBy('i_order','ASC')->get();
            return View::make('index')->with(array('content'=>$page,'footer_link'=>$pageData, 'headerCountryData'=>$countriesData, 'cms'=>'false','userData'=>$userData));
        } else {
            return Response::make('Unauthorized', 401);
        }
    } else {
        if($slug == '404'){
            return Redirect::to(SITE_URL.'404');
        } else {                        
            return Redirect::to(SITE_URL); 
        } 
    }
});

App::missing(function($exception) {
    return Redirect::to(SITE_URL.'404');
});