<?php

class Setting extends Eloquent {
    protected $table = 'settings';
    protected $fillable = array('admin_email');
	public $timestamps = false;
}
