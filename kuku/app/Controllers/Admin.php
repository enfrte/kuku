<?php

namespace Controllers;

use Base; 

class Admin
{
	private $adminStore = []; 

	public function __construct(\Base $f3) 
	{
		$installPath = $f3->ABSOLUTE_PRIVATE_APP_PATH;
		$envFileContents = file_get_contents($installPath.'.env', true);
		$this->adminStore = json_decode($envFileContents);
	}

	public function index(Base $f3)
	{
		if ( empty($f3->get('SESSION.user.admin')) ) { 
			$this->login($f3);
			//echo \Template::instance()->render('views/index.php');
			//$f3->set('SESSION.user.admin',1);
		}
		else {
			echo \Template::instance()->render('views/index.php');
		}
	}

	public function welcome(Base $f3)
	{
		if ( empty($f3->get('SESSION.user.admin')) ) {
			$this->login($f3);
		}
		else {
			echo \Template::instance()->render('views/components/welcome.php');	
		}
	}

	public function login(Base $f3)
	{
		if ( empty($f3->get('SESSION.user.admin')) ) {
			$username = $_POST['username'] ?? ''; 
			$password = $_POST['password'] ?? '';
			$adminStore = $this->adminStore;

			if (empty($_POST)) {
				echo \Template::instance()->render('views/components/admin/login.php');
				return;
			}

			if (empty($username) || empty($password)) {
				echo \Template::instance()->render('views/components/admin/login.php');
				return;
			}

			foreach ($adminStore->admin as $admin) {
				if ($admin->username === $username && $admin->password === $password) {
					$f3->set('SESSION.user.admin',1);
					echo \Template::instance()->render('views/index.php');
					return;
				}
			}

			echo \Template::instance()->render('views/components/admin/login.php');
		}
	}

	public function backup(Base $f3)
	{
		if ( empty($f3->get('SESSION.user.admin')) ) { 
			$this->login($f3);
		}

		if (empty($_POST['backup'])) {
			echo \Template::instance()->render('views/components/admin/backup.php');
			return;
		}

		$date = date('Y-m-d-H:i');
		
		$path = $f3->ABSOLUTE_PRIVATE_APP_PATH.'data/';
		$extension = '.sqlite';
		$original_file = $path . $f3->APPNAME.'_db'.$extension;
		$copy_file = $path . $original_file . $date . $extension;

		// make a copy of the original file
		if (!copy($original_file, $copy_file)) {
			echo "Failed to copy $original_file...\n";
			exit;
		}
		
		echo 'Copied: '.$copy_file;
	}

}
