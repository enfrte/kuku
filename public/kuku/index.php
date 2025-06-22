<?php

// Show all errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../../kuku/vendor/autoload.php';

$dev = false; // Set to false in production

$f3 = \Base::instance();
$f3->mset([
	'DEBUG' => 3,
	'CACHE' => '../../kuku/var/tmp/',
	'AUTOLOAD' => '../../kuku/app/',
	'INSTALL_FOLDER' => 'kuku',
	'APPNAME' => 'kuku',
	//'ABSOLUTE_PRIVATE_APP_PATH' => '/home/codinginthecold/kuku/',
	//'UI' => '/home/codinginthecold/kuku/',
	'ABSOLUTE_PRIVATE_APP_PATH' => dirname(__DIR__, 2) . '/kuku/', // Dev path
	'UI' => dirname(__DIR__, 2) . '/kuku/',
	'AUDIO_PATH' => __DIR__ . '/assets/audio/',
	'VERSION' => !empty($dev) ? time() : '0.4.1', // (major version . feature update . bugfix)
	'UPDATE_COMMIT_MSG' => 'Alternative phrase bugfix.',
]);

$f3->set('DB', new DB\SQL('sqlite:'.$f3->ABSOLUTE_PRIVATE_APP_PATH.'data/'.$f3->APPNAME.'_db.sqlite'));

$f3->DB->exec([
	// SQLite config needs to be run on each connection
	"PRAGMA STRICT = ON;",
	"PRAGMA foreign_keys = ON;",
	"PRAGMA auto_vacuum = FULL;",
	"PRAGMA ignore_check_constraints = FALSE;",
]);


$f3->route('GET /lang','Classes\Language\Language->index');
$f3->route('GET /welcome','Controllers\Admin->welcome'); 

// User 

$f3->route('GET /logout','Controllers\User->logout'); 

// Admin

$f3->route('GET /admin','Controllers\Admin->index'); 
$f3->route('POST /login','Controllers\Admin->login'); 

// Student 

$f3->route('GET /','Controllers\Student->index'); // (also default/home)

/* $f3->route('GET /', function($f3) {	
	echo '<pre>Hello: '.__DIR__. ' - ';
	echo $f3->ABSOLUTE_PRIVATE_APP_PATH.'views/index.php';
	//print_r($f3->hive());
});   */

// Components 

$f3->route('POST /languageSearch/@type','Controllers\Components\LanguageSelect->languageSearch'); 

// Courses

$f3->route('GET /courses','Controllers\Courses->index');
$f3->route('GET /createCourse','Controllers\Courses->create'); 
$f3->route('POST /saveCourse','Controllers\Courses->save'); 
$f3->route('GET /editCourse/@id','Controllers\Courses->edit'); 
$f3->route('POST /updateCourse','Controllers\Courses->update'); 
$f3->route('GET /deleteCourse/@id','Controllers\Courses->delete'); 

// Lessons

$f3->route('GET /lessons/@course_id','Controllers\Lessons->index');
$f3->route('GET /createLesson/@course_id','Controllers\Lessons->create'); 
$f3->route('POST /saveLesson','Controllers\Lessons->save'); 
$f3->route('GET /editLesson/@id','Controllers\Lessons->edit'); 
$f3->route('POST /updateLesson','Controllers\Lessons->update'); 
$f3->route('GET /deleteLesson/@lesson_id','Controllers\Lessons->delete'); 
$f3->route('GET /quiz/@id','Controllers\Lessons->quiz');

// Questions

$f3->route('GET /questions/@lesson_id','Controllers\Questions->index');
$f3->route('GET /batchQuestions/@lesson_id','Controllers\Questions->batchQuestions');
$f3->route('GET /createQuestion/@lesson_id','Controllers\Questions->create'); 
$f3->route('POST /saveQuestion','Controllers\Questions->save'); 
$f3->route('POST /saveBatchQuestions','Controllers\Questions->saveBatchQuestions'); 
$f3->route('GET /editQuestion/@id','Controllers\Questions->edit'); 
$f3->route('POST /updateQuestion','Controllers\Questions->update'); 
$f3->route('DELETE /deleteQuestion/@question_id/@lesson_id','Controllers\Questions->delete'); 

// Dev

/* $f3->route('GET /hive',
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
); */

// Install 

$f3->route(['GET /install', 'POST /install'], 'Controllers\Install->index');

// Finally

$f3->run();
