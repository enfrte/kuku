<?php

namespace Controllers;

class User
{
	public function __construct(\Base $f3) {

	}

	public function logout(\Base $f3)
	{
		if ( !empty($f3->get('SESSION.user.admin')) ) {
			$f3->clear('SESSION');
		}

		$f3->reroute('/');
	}
}
