<?php

namespace Controllers;

class Install
{
	public function index()
	{
		$f3 = \Base::instance();
		$f3->set('SCHEMA_FILE', $f3->ABSOLUTE_PRIVATE_APP_PATH . DIRECTORY_SEPARATOR . 'data'. DIRECTORY_SEPARATOR . 'table-schema.sql');

		$result = "Success!";

		if ($f3->VERB == 'GET' || $f3->REQUEST['uniqid'] != $f3->REQUEST['confirm_uniqid']) {
			$f3->set('uniqid', uniqid());
			echo \Template::instance()->render('views/install-confirm.htm');
			die();
		}
		
		try {
			$schema = file_get_contents($f3->SCHEMA_FILE); 
			
			if ( empty($schema) ) {
				throw new \Exception("Could not get contents of schema file");
			}

			// Run multiple commands from the schema script
			$db = new \PDO('sqlite:'.$f3->ABSOLUTE_PRIVATE_APP_PATH.'data/'.$f3->APPNAME.'_db.sqlite');			
		 	$db->setAttribute(\PDO::ATTR_EMULATE_PREPARES, 0);
			$db->exec($schema); 
		}
		catch (\Throwable $th) {
			$result = 'Failed to create schema: '.$th->getMessage();
		}
		finally {
			$f3->set('setup_results',$result);
			echo \Template::instance()->render('views/install.htm');	
		}
	}

}
