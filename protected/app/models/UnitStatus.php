<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class UnitStatus extends Eloquent {
    use SoftDeletingTrait;
    
    protected $table = 'unit_status';
    protected $fillable = array('v_name, v_color');
    protected $dates = ['deleted_at'];
}
