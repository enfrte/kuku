<?php

namespace Controllers;

use Base;
use Template;

class Student
{
	public function __construct() {
	}

	public function index(Base $f3)
	{
		echo Template::instance()->render('views/index.php');
	}

	public function welcome()
	{
		echo \Template::instance()->render('views/components/welcome.php');		
	}
}
