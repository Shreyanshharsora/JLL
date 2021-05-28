<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class Building extends Eloquent{
      use SoftDeletingTrait;
	protected $table = 'buildings';
    protected $fillable = array('i_city_id', 'i_city_order', 'v_name', 'v_image_url', 'b_status', 'i_year_built', 'v_submarket', 'v_class', 'i_rba', 'i_avg_floor_plate', 'i_total_vacant_sf', 'i_occupied', 'i_direct_vacant_sf', 'i_leased', 'd_rent', 'v_owner', 'i_leed', 'v_leed_cert', 'v_address1', 'v_address2', 'v_city', 'v_state', 'v_zip', 'd_lat', 'd_long', 'is_default');
	
    protected $dates = ['deleted_at'];
    
    public function city()
	{
		return $this->belongsTo('City','i_city_id')->select('id', 'v_name', 'd_floor_height', 'v_image_url', 'v_background_image_url');
	}
    
}