<?php
class Country extends Eloquent{
    protected $table = 'countries';
    
    public function cities(){
        return $this->hasMany('City', 'i_country_id')->where('i_status','1')->With('buildings')->orderBy('v_name');
    }
}