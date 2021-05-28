<?php
class Domain extends Eloquent {
    protected $table = 'domains';
    protected $fillable = array('id','v_domain_name');
	public $timestamps = false;
}
