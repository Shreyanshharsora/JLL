<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class HomePageBanner extends Eloquent{
    use SoftDeletingTrait;
	
	protected $table = 'homepage_banners';
	protected $dates = ['deleted_at'];
}