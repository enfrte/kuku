<?php

require 'vendor/autoload.php';

$f3 = \Base::instance();
$f3->set('DEBUG',3);
$f3->set('AUTOLOAD','app/');
$f3->set('INSTALL_FOLDER', 'kuku');
$f3->set('APPNAME', 'kuku');
$f3->set('DB', new DB\SQL('sqlite:'.__DIR__.'/data/'.$f3->APPNAME.'_db.sqlite'));
$f3->set('APP_PATH', $f3->ROOT . DIRECTORY_SEPARATOR . $f3->INSTALL_FOLDER );
$f3->set('SCHEMA_FILE', $f3->APP_PATH . DIRECTORY_SEPARATOR . 'data'. DIRECTORY_SEPARATOR . 'table-schema.sql');

$f3->route('GET /lang','Classes\Language\Language->index');
$f3->route('GET /menu','Controllers\Menu->index'); 
$f3->route('GET /welcome','Controllers\Admin->welcome'); 

// Admin

$f3->route('GET /admin','Controllers\Admin->index'); 

/* $f3->route(
	['GET /create-course', 'GET /edit-course/{@id}'],
	'Controllers\Admin->course'
);  */

// Courses

$f3->route('GET /courses','Controllers\Courses->index');
$f3->route('GET /createCourse','Controllers\Courses->create'); 
$f3->route('POST /saveCourse','Controllers\Courses->save'); 
$f3->route('GET /editCourse/@id','Controllers\Courses->edit'); 
$f3->route('GET /deleteCourse/@id','Controllers\Courses->delete'); 
$f3->route('POST /updateCourse','Controllers\Courses->update'); 

// Lessons

$f3->route('GET /lessons/@course_id','Controllers\Lessons->index');
$f3->route('GET /createLesson/@course_id','Controllers\Lessons->create'); 
$f3->route('POST /saveLesson','Controllers\Lessons->save'); 
$f3->route('GET /deleteLesson/@lesson_id','Controllers\Lessons->delete'); 
$f3->route('GET /updateLesson/@id','Controllers\Lessons->update'); 

// Questions

$f3->route('GET /questions/@lesson_id','Controllers\Questions->index');
$f3->route('GET /createQuestion/@lesson_id','Controllers\Questions->create'); 
$f3->route('POST /saveQuestion','Controllers\Questions->save'); 
$f3->route('GET /deleteQuestion/@question_id','Controllers\Questions->delete'); 
$f3->route('GET /updateQuestion/@id','Controllers\Questions->update'); 

// Home

$f3->route('GET /',
    function($f3) {
		$f3->reroute('/admin'); // temp
    }
);

// Dev

$f3->route('GET /hive',
    function($f3) {	
		echo '<pre>';
    	print_r($f3->hive());
    }
);

$f3->route('GET /view',
    function($f3) {
		$f3->set('name','Template!');
		echo \Template::instance()->render('views/template.htm');
    }
);

// Install 

$f3->route(['GET /install', 'POST /install'],
	function($f3) {
		$result = "Success!";

		if ($f3->VERB == 'GET' || $f3->REQUEST['uniqid'] != $f3->REQUEST['confirm_uniqid']) {
			$f3->set('uniqid', uniqid());
			echo \Template::instance()->render('views/install-confirm.htm');
			die();
		}
		
		try {
			$schema = file_get_contents($f3->SCHEMA_FILE); 
			
			if ( empty($schema) ) {
				throw new Exception("Could not get contents of schema file");
			}

			// Run multiple commands from the schema script
			$db = new PDO('sqlite:'.__DIR__.'/data/'.$f3->APPNAME.'_db.sqlite');			
		 	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, 0);
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
);

$f3->run();