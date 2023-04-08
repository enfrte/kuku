<?php 

namespace Models;

class BaseModel
{
	protected $isAdmin; 

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
