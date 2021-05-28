<?php
class EmailTemplate extends Eloquent{
	protected $fillable = array('t_email_content', 'v_template_title', 'v_template_subject');
	protected $table = 'email_templates';
    public $timestamps = false; 
}
?>