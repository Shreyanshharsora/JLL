<?php

	class SkylineBuilding extends Eloquent{
		protected $table = 'skyline_buildings';
		protected $primary = 'id';
        public $timestamps = false;

		public function building() {
			return $this->belongsTo('Building', 'i_building_id', 'id')->with('city');
		}
        
	}
