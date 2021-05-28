<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class HomePageImageRotation extends Eloquent{
    use SoftDeletingTrait;
	
	protected $table = 'homepage_image_rotator';
	protected $dates = ['deleted_at'];
}