<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class Floor extends Eloquent{
	protected $table = 'floors';
    protected $fillable = array('i_building_id', 'i_floor_number', 't_config', 'i_user_id');
	
    protected $dates = ['deleted_at'];
}