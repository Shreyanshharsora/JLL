<?php
    use Illuminate\Database\Eloquent\SoftDeletingTrait;
	
    class SkylineShareTo extends Eloquent{
		use SoftDeletingTrait;
		
        protected $table = 'skyline_shared_to';
		protected $primary = 'id';
        protected $dates = ['deleted_at'];
        
        public $timestamps = false;
        
	}
