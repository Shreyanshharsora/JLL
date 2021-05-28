<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class NationalAsset extends Eloquent {
    use SoftDeletingTrait;
    
    protected $table = 'national_assets';
    protected $dates = ['deleted_at'];
}
