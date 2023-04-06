<?php

namespace Controllers;

class Admin
{
	public function __construct(\Base $f3) {
		
		if ( empty($f3->get('SESSION.user.admin')) ) { // TODO: Accounts + Check user rights
			$f3->set('SESSION.user.admin',1);
			//$_SESSION['user']['admin'] = 1;
		}
		else {
			//$f3->error(404);
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
