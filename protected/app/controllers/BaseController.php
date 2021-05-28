<?php

class BaseController extends Controller {

	/**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	protected function setupLayout()
	{
		if ( ! is_null($this->layout))
		{
			$this->layout = View::make($this->layout);
		}
	}
    
    public function checkAuthentication()
    {
        if(!Auth::user()->check())
        {
            return false;
        }
        return true;
    }
    
        
    protected function saveImage($base64img, $v_random_image, $path, $format = '.png') {
    //protected function saveImage($base64img, $v_random_image, $path, $format = '.png') {    
        $tmpFile = $v_random_image.$format;
        if (strpos($base64img,'data:image/jpeg;base64,') !== false) {
            $base64img = str_replace('data:image/jpeg;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.jpeg';
        }
        if (strpos($base64img,'data:image/png;base64,') !== false) {
            $base64img = str_replace('data:image/png;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.png';
        }
        if (strpos($base64img,'data:image/webp;base64,') !== false) {
            
            $base64img = str_replace('data:image/webp;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.png';
        }
        
        if (strpos($base64img,'data:image/jpg;base64,') !== false) {
            $base64img = str_replace('data:image/jpg;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.jpg';
        }
        if (strpos($base64img,'data:image/gif;base64,') !== false) {
            $base64img = str_replace('data:image/gif;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.gif';
        }
        if (strpos($base64img,'data:image/svg+xml;base64,') !== false) {
            $base64img = str_replace('data:image/svg+xml;base64,', '', $base64img);
            //$tmpFile = $v_random_image.'.gif';
        }
        $tmpFile = $v_random_image.$format;
        $data = base64_decode($base64img);
            
        $file = $path.$tmpFile;
        
        file_put_contents($file, $data);
        
        return $tmpFile;
    }
    
    public static function all_industries()
    {
      $industryDataArray = array('0' => 'Banking/financial','1' => 'Cleantech','2' => 'Data centers','3' => 'Education','4' => 'Government','5' => 'Healthcare','6' => 'Hotels/hospitality','7' => 'Industrial/logistics','8' => 'Law','9' => 'Life sciences','10' => 'Non-profit', '11'=>'Real estate consulting', '12' => 'Real estate investment', '13'=>'Retail', '14' => 'Supply chain', '15' => 'Technology', '16' => 'Other');
       return  $industryDataArray;
    }
    
    public static function aggregateCal($data){
        $budildingCount = count($data);
        $aggregate = [];
        if($budildingCount>0){
            // print_r($city['building']);
            //$test = array_column($city['building'], 'i_rba');
            /*Aggregate function*/
            
            /*1.Total RBA (s.f.) Rentable building area */
            $iRba= array_map(function ($ar) {return $ar['i_rba'];}, $data);
            $sumIRba= number_format(array_sum($iRba));
            $aggregate[11] = ['value' => $sumIRba, 'title' => 'RBA', 'sub_title' => '(s.f.)', 'prefix' => '$', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];            
            
            /*2.Average floor plate (s.f.) */
            $iFloorPlate= array_map(function ($ar) {return $ar['i_avg_floor_plate'];}, $data);
            $sumIFloorPlate= round((array_sum($iFloorPlate))/$budildingCount,2);
            
            $aggregate[10] = ['value' => $sumIFloorPlate, 'title' => 'AVERAGE FLOOR PLATE', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
            
            /*3.Total vacant s.f. */
            $iTotalVacant= array_map(function ($ar) {return $ar['i_total_vacant_sf'];}, $data);
            $sumITotalVacant= number_format(array_sum($iTotalVacant));
            
            $aggregate[5] = ['value' => $sumITotalVacant, 'title' => 'OCCUPANCY', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
            
            /*4.Total vacant %*/
            $sumITotalVacantPer= round(($sumITotalVacant/$sumIRba),2);
            
            $aggregate[4] = ['value' => $sumITotalVacantPer, 'title' => 'OCCUPANCY RATE', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
            
            /*5.Direct vacant s.f. */
            $iDirectVacant= array_map(function ($ar) {return $ar['i_direct_vacant_sf'];}, $data);
            $sumIDirectVacant=number_format(array_sum($iDirectVacant));
            
            $aggregate[7] = ['value' => $sumIDirectVacant, 'title' => 'DIRECT VACANCY', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
            
            /*6.Direct vacant %*/
            $sumIDirectVacantPer= round(($sumIDirectVacant/$sumIRba),2);
            
            $aggregate[6] = ['value' => $sumIDirectVacantPer, 'title' => 'DIRECT VACANCY', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
            
            /*7. Total occupied s.f.*/
            $iTotalOccupied= array_map(function ($ar) {return $ar['i_total_vacant_sf'];}, $data);
            $sumITotalOccupied= number_format(array_sum($iTotalOccupied));
            
            $aggregate[9] = ['value' => $sumITotalOccupied, 'title' => 'TOTAL VACANCY', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
            
            /*8. Total occupied %*/
            $sumITotalOccupiedPer= round(($sumITotalOccupied/$sumIRba),2);
            
            $aggregate[8] = ['value' => $sumITotalOccupiedPer, 'title' => 'TOTAL VACANCY', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
            
            /*9. Total leased s.f. */
            $iLeased= array_map(function ($ar) {return $ar['i_leased'];}, $data);
            $sumILeased= round(array_sum($iLeased),2);
            
            $aggregate[2] = ['value' => $sumILeased, 'title' => 'TOTAL LEASED', 'sub_title' => '(s.f.)', 'prefix' => '', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
            
            /*10. Total leased % */
            $sumILeasedPer= round(($sumILeased/$sumIRba),2);
            
            $aggregate[3] = ['value' => $sumILeasedPer, 'title' => 'TOTAL LEASED', 'sub_title' => '', 'prefix' => '', 'postfix' => '%', 'class' => 'h2-big', 'font_size' => ''];
            
            /*11.DIRECT AVERAGE ASKING RENT (p.s.f.) */
            $iDirectAverageRent=array_map(function ($ar) {return ($ar['d_rent']+$ar['i_direct_vacant_sf']);}, $data);
            $sumIDirectAverageRent= number_format(round(array_sum($iDirectAverageRent),2));
            
            $aggregate[1] = ['value' => $sumIDirectAverageRent, 'title' => 'DIRECT AVERAGE ASKING RENT', 'sub_title' => '(p.s.f.)', 'prefix' => '$', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
            
            /*12. Direct average asking rent for TROPHY BUILDINGS ONLY (p.s.f.)*/
            $iDirectAverageTrophyRent=array_map(function ($ar) {return $ar['e_class']=='Trophy'?($ar['d_rent']+$ar['i_direct_vacant_sf']):0;}, $data);
            $sumIDirectAverageTrophyRent=  number_format(round(array_sum($iDirectAverageTrophyRent),2));
            
            $aggregate[0] = ['value' => $sumIDirectAverageTrophyRent, 'title' => 'TROPHY RENTS', 'sub_title' => 'DIRECT AVERAGE ASKING RENT (p.s.f.)', 'prefix' => '$', 'postfix' => '', 'class' => 'h2-small', 'font_size' => ''];
           
            
        }
        
        array_values($aggregate);
        return $aggregate;
    }
}
