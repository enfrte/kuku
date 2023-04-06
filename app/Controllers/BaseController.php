<?php 

namespace Controllers;

class BaseController
{
	public function __construct(\Base $f3) {
		if (true) { // TODO: Accounts + Check user rights
			//$_SESSION['user']['admin'];
		}
		else {
			//$f3->set('admin', false);
		}
	}

    // Common methods can be defined here
}
