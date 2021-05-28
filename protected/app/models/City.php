<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class City extends Eloquent{
    use SoftDeletingTrait;
	protected $table = 'cities';
    protected $fillable = array('i_country_id', 'v_name', 'v_slug', 'v_image_url', 'v_skyline_title', 't_skyline_body', 'floor_height', 'v_email', 'i_status');
	
    protected $dates = ['deleted_at'];
    
    public function country()
	{
		return $this->belongsTo('Country','i_country_id');
	}
    
    public function building()
    {
        return $this->hasMany('Building','i_city_id')->where('e_status',1)->orderBy('i_order','Asc')->select('buildings.*', DB::raw('DATE_FORMAT(buildings.updated_at, \'%m/%d/%Y %l:%i %p\') AS formatted_updated_at'));
    }
    
    public function buildings()
    {
        return $this->hasMany('Building','i_city_id')->where('e_status',1)->select('i_city_id')->groupBy('i_city_id');// orderBy('i_order','Asc');
    }
                
    public function city_asset()
    {
        return $this->hasMany('CityAsset','i_city_id')->orderBy('i_asset_order');
    }

    // this is a recommended way to declare event handlers
    protected static function boot() {
        parent::boot();

        static::deleting(function($building) { // before delete() method call this
             $building->building()->delete();
             // do the rest of the cleanup...
        });
        static::deleting(function($city_asset) { // before delete() method call this
             $city_asset->city_asset()->delete();
             // do the rest of the cleanup...
        });
    }
}