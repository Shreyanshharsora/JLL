<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class CityAsset extends Eloquent {
    use SoftDeletingTrait;
    
    protected $table = 'city_assets';
    protected $dates = ['deleted_at'];
    
    public function city()
	{
		return $this->belongsTo('City','i_city_id');
	}
}
