<?php
	use Illuminate\Database\Eloquent\SoftDeletingTrait;

	class SkylineNote extends Eloquent{
		use SoftDeletingTrait;
		protected $table = 'skyline_notes';

		protected $dates = ['deleted_at'];
		 public $timestamps = false;

		public function user()
		{
			return $this->belongsTo('User','id');
		}

		public function skyline()
		{
			return $this->belongsTo('Skyline', 'i_skyline_id');
		}

	}
