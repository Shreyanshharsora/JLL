<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class UnitAsset extends Eloquent{
	protected $table = 'unit_status';
    protected $fillable = array('v_name, v_color');
	
    protected $dates = ['deleted_at'];
}