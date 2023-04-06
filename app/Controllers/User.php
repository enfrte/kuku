<?php

namespace Controllers;

class Admin
{
	public function __construct(\Base $f3) {

	}

	public function logout(\Base $f3)
	{
		if (!empty($f3->get('SESSION.user.admin'))) {
			unset($_SESSION['user']['admin']);
			$f3->SESSION->clear(); // Or this?
		}
	}
}
