<?php

namespace Controllers;

use DB;
use Web;
use Models\Courses\CoursesData;
use Template;
use Exception;
use Base;

class Courses extends BaseController
{
	public function index(Base $f3)
	{
		$f3->set('courses',$f3->DB->exec(
			'SELECT * FROM courses WHERE deleted = 0'
		));
		echo Template::instance()->render('views/components/admin/courses/course-list.php');
	}

	public function create()
	{
		echo Template::instance()->render('views/components/admin/courses/course-creator-editor.php');
	}

	public function edit(Base $f3, $args)
	{
		$course = new CoursesData;
		$course->load( $f3, $args['id'] );
		$f3->set('course', $course->cast());
		echo Template::instance()->render('views/components/admin/courses/course-creator-editor.php');
	}

	public function save(Base $f3)
    {
		try {
			$title = $_POST['title'] ?? '';
			
			//$coursesData = new CoursesData();
			//$coursesData->validateForm();

			$course = new DB\SQL\Mapper($f3->DB,'courses');
			$course->copyFrom('POST');
			$course->slug = Web::instance()->slug($title);
			$course->save();
		} 
		catch (\Throwable $th) {
			echo '<pre>'.$th->getMessage().'</pre>';
		}
		finally {
			$this->index($f3);
		}		
    }

    public function read()
    {
        // Implement read method
    }

    public function update(Base $f3)
    {
		$in_production = !empty($args['in_production']) ? $args['in_production'] : 0;

		$f3->DB->exec(
				'UPDATE courses 
				SET title = :title, 
				description = :description,
				slug = :slug,
				version = :version,
				in_production = :in_production
				WHERE id = :id', 
			[
				':id' => $_POST['id'],
				':title' => $_POST['title'], 
				':description' => $_POST['description'],
				':slug' => Web::instance()->slug($_POST['title']),
				':version' => $_POST['version'],
				':in_production' => $in_production,
			]
		);

		$this->index($f3);
	}

    public function delete(Base $f3, $args)
    {
        try {
			/* $course = new CoursesData;
			$course->load( $f3, $args['id'] );
			$course->erase();

			$this->index($f3); */
			
			$f3->DB->exec(
				"UPDATE courses
				SET deleted = 1 
				WHERE id=?", 
				$args['id']
			);

			$this->index($f3);
		} 
		catch (\Throwable $th) {
			echo '<pre>'.$th->getMessage().'</pre>';
		}
    }
}
