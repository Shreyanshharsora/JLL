<?php
$SITE_URL = URL::to('/')."/";

define('IS_LIVE','No');
define('JS_DEBUG','1');

define('SITE_NAME','JLL');
define('SITE_URL',$SITE_URL);
define('ASSET_URL',$SITE_URL.'assets/');

define('ADMIN_NAME','admin');
define('ADMIN_URL',$SITE_URL.ADMIN_NAME."/");
define('ADMIN_ASSET_URL',$SITE_URL."assets/");
$BASE_URL = str_replace('index.php','',$_SERVER['SCRIPT_NAME']);

define('BASE_HREF_FRONT',$BASE_URL);
define('BASE_HREF_ADMIN',BASE_HREF_FRONT.ADMIN_NAME.'/');

define('FRONT_ASSET_URL',$SITE_URL);

define('API_ADMIN_NAME','api-admin');
define('API_URL',$SITE_URL.API_ADMIN_NAME."/");

define('FROM_EMAIL_ADDRESS','testing.demo@gmail.com');
define('FROM_EMAIL_ADDRESS_NAME','JLL');

/*Database Credentials*/
define('DB_HOST','localhost');
define('DB_NAME','db_jll');
define('DB_USER','chaka');
define('DB_PASS','this.admin');
define('DB_PREFIX','');
define('CIPHER_KEY',159753852456);

define('JS_VERSION','?ver=v.1.0.4');
define('CSS_VERSION','?ver=v.1.0.4');
define('HTML_VERSION','?ver=v.1.0.4');

define('ADMIN_JS_VERSION','?ver=v.1.1.4');
define('ADMIN_CSS_VERSION','?ver=v.1.1.4');

/*Admin side constants*/
define('REC_PER_PAGE', 20);
define('MAX_UPLOAD_SIZE', '8');
define('DEFAULT_FLOOR_HEIGHT', 0.205);

define('GLOBAL_BACKGROUND_IMAGE', 'global_background_image.png');

/*Building image path*/
define('BUILDING_IMPORT_PATH','files/');
define('FILE_PATH','files/');
define('CITY_PDF_FILE_PATH','files/city-pdf/');
define('TEMP_CITY_PDF_PATH','files/temp-pdf/');
define('TEMP_VIDEO_PATH','files/temp-video/');
define('BUILDING_IMAGE_PATH','files/building_images/');
define('BUILDING_PLAIN_IMAGE_PATH','files/building_images/generated-images/');
define('BUILDING_FLOOR_IMAGE_PATH','files/building_images/global_building_images/');

define('TEMP_IMAGE_PATH','files/temp-images/');
define('CMS_IMAGE_PATH','files/cms-images/');
define('CITY_BACKGROUND_IMAGE_PATH','files/city_background_images/');
define('HOME_PAGE_BANNER_IMAGE_PATH','files/home-page-banner/');
define('HOME_PAGE_IMAGE_ROTATOR_PATH','files/home-page-image-rotator/');
define('HOME_PAGE_CONTENT_IMAGE','files/home-page-content/images/');
define('HOME_PAGE_CONTENT_VIDEO','files/home-page-content/videos/');
define('TRANSPARENT_CITY_BACKGROUND_IMAGE_PATH','files/city_background_images/transparent/');

define('COUNTRY_IMAGE_PATH','files/countries/');
define('CITIES_IMAGE_PATH','files/cities/'); /* City image path */
define('NATIONAL_ASSET_IMAGE_PATH','files/national-asset/'); /* National asset image path */
define('CITY_ASSET_IMAGE_PATH','files/city-asset/'); /* City asset large image path */
define('CITY_ASSET_THUMB_IMAGE_PATH','files/city-asset/thumb'); /* City asset thumb image path */
define('WWW_ROOT',$_SERVER['DOCUMENT_ROOT'].$BASE_URL);

define('RESTRICT_EMAIL_MSG','Please try again with another email id.');

if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$_SERVER['HTTP_USER_AGENT'])||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($_SERVER['HTTP_USER_AGENT'],0,4))) {
    define('IS_MOBILE','1');
} else {
    define('IS_MOBILE','0');
}

function get_last_query() {
    $queries = DB::getQueryLog();
    $sql = end($queries);

    if( ! empty($sql['bindings'])) {
        $pdo = DB::getPdo();
        foreach($sql['bindings'] as $binding) {
            $sql['query'] = preg_replace('/\?/', $pdo->quote($binding), $sql['query'], 1);
        }
    }
    return pr($sql['query']);
}

function pr($arr) {
    echo "<pre>";
    print_r($arr);
    echo "</pre>";
}
