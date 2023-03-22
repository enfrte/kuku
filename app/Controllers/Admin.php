<?php

namespace Controllers;

class Admin
{
	public function __construct(\Base $f3) {
		if (true) { // TODO: Accounts + Check user rights
			$f3->set('admin','true');
		}
		else {
			$f3->error(404);
		}
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
