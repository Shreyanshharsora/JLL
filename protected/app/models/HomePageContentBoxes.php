<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class HomePageContentBoxes extends Eloquent{
    use SoftDeletingTrait;
	
	protected $table = 'homepage_content_boxes';
	protected $dates = ['deleted_at'];
}