<?php

namespace Controllers;

class Student
{
	public function __construct(\Base $f3) {
	}

	public function index()
	{
		echo \Template::instance()->render('views/index.php');
	}

	public function welcome()
	{
		echo \Template::instance()->render('views/components/welcome.php');		
	}
}
