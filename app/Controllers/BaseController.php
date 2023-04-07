<?php 

namespace Controllers;

class BaseController
{
	private $isAdmin; 

	public function __construct(\Base $f3) {
		$this->isAdmin = $f3->get('SESSION.user.admin');
	}

	public function errorHandler(\Throwable $error)
	{
		if ( $this->isAdmin || $error instanceof \Exception ) {
			return $error->getMessage();
		} 
		else {
			return 'There was an error';
		}
	}
	
}
