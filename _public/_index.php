<?php

require '../vendor/autoload.php';

$f3 = \Base::instance();

$f3->route('GET /',
    function() {
        echo 'Hello, public world!';
    }
);

$f3->route('GET /foo',
    function() {
        echo 'Hello, foo world!';
    }
);

$f3->run();