<?php
	use Illuminate\Database\Eloquent\SoftDeletingTrait;

	class Skyline extends Eloquent{
		use SoftDeletingTrait;
		protected $table = 'skylines';
		protected $primary = 'id';
		protected $dates = ['deleted_at'];

		public function user()
		{
			return $this->belongsTo('User','i_user_id');
		}

        public function notes(){
            return $this->hasMany('SkylineNote','i_skyline_id')->select('*', DB::raw('DATE_FORMAT(created_at, \'%m/%d/%Y\') AS created_date'),  DB::raw('DATE_FORMAT(created_at, \'%Y%m%d%H%i%S\') AS order_by_created_date'))->orderBy('created_at','Desc');
        }

		public function skyline_buildings() {
			return $this->hasMany('SkylineBuilding', 'i_skyline_id');
		}
	}
