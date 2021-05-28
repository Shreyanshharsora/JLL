<?php
return array(

    'multi' => array(
        'user' => array(
            'driver' => 'eloquent',
            'model' => 'User'
        ),
        'guest' => array(
            'driver' => 'eloquent',
            'model' => 'User'
        )
    ),

    'reminder' => array(

        'email' => 'emails.auth.reminder',

        'table' => 'password_reminders',

        'expire' => 60,

    ),

);
