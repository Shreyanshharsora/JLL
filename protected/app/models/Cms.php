<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;
class Cms extends Eloquent {
    use SoftDeletingTrait;
    
    protected $table = 'pages';
    protected $dates = ['deleted_at'];
}
