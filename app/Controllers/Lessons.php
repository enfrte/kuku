<?php

namespace Controllers;

use DB;
use Web;
use Models\Lessons\LessonsData;
use Template;
use Exception;
use Base;

class Lessons 
{
	public function index(Base $f3, $args) {
		$course_id = $args['course_id'] ?? '';
		if (empty($course_id)) {
			throw new Exception("Course id required");
		}

		$course = new DB\SQL\Mapper($f3->DB,'courses');
		$course->load('id', ['id' => $course_id]); 
		$f3->set('course', ['title' => $course->title]);

		$f3->set('lessons',$f3->DB->exec(
			'SELECT *
			FROM lessons 
			WHERE course_id = :course_id
			AND deleted = 0', 
			['course_id' => $course_id]
		));
		
		$f3->set('course_id', $course_id);
		echo Template::instance()->render('views/components/admin/lessons/lesson-list.php');
	}
	
	public function show(Base $f3, $args) {
		/* if (empty($args['lesson_id'])) {
			throw new Exception("Lesson id required");
		}
		$lesson = $f3->DB->exec("SELECT * FROM lessons WHERE id = ?", $args['lesson_id']);
		echo json_encode($lesson); */
	}
	
	public function create(Base $f3, $args)
	{
		if (empty($args['course_id'])) {
			throw new Exception("Course id required");
		}

		$f3->set('course_id', $args['course_id']);
		echo \Template::instance()->render('views/components/admin/lessons/lesson-creator-editor.php');
	}

	public function edit(Base $f3, $args)
	{
		$lesson = new LessonsData;
		$lesson->load( $f3, $args['id'] );
		$f3->set('lesson', $lesson->cast());
		echo \Template::instance()->render('views/components/admin/lessons/lesson-creator-editor.php');
	}

	public function save(Base $f3) {
		try {
			$model = new DB\SQL\Mapper($f3->DB,'lessons');
			$model->copyFrom('POST');
			$model->slug = Web::instance()->slug($model->title);
			$model->save();
		} 
		catch (\Throwable $th) {
			echo '<pre>'.$th->getMessage().'</pre>';
		}
		finally {
			$this->index($f3, ['course_id' => $_POST['course_id']]);
		}	
	}
	
	public function update(Base $f3, $args) {
		$in_production = !empty($args['in_production']) ? $args['in_production'] : 0;

		$f3->DB->exec(
				'UPDATE lessons 
				SET title = :title, 
				slug = :slug,
				tutorial = :tutorial,
				course_id = :course_id,
				level = :level,
				in_production = :in_production
				WHERE id = :id', 
			[
				':id' => $_POST['id'],
				':title' => $_POST['title'], 
				':slug' => Web::instance()->slug($_POST['title']),
				':tutorial' => $_POST['tutorial'],
				':course_id' => $_POST['course_id'],
				':level' => $_POST['level'],
				':in_production' => $in_production,
			]
		);

		$args['course_id'] = $_POST['course_id'];
		$this->index($f3, $args);

		/* $slug = $formData['course_id'] . '-' . strtolower(str_replace(' ', '-', $formData['title']));
		$result = $this->db->exec("UPDATE lessons SET title=?, slug=?, tutorial=?, course_id=?, level=? WHERE id=?", $formData['title'], $slug, $formData['tutorial'], $formData['course_id'], $formData['level'], $id);
		echo json_encode($result); */
	}
	
	public function delete(Base $f3, $args) {
		try {
			if (empty($args['lesson_id']) || empty($_GET['course_id'])) {
				throw new Exception("Missing args");
			}

			//$f3->DB->exec("DELETE FROM lessons WHERE id=?", $args['lesson_id']);
			$f3->DB->exec(
				"UPDATE lessons
				SET deleted = 1 
				WHERE id=?", 
				$args['lesson_id']
			);

			$this->index($f3, ['course_id' => $_GET['course_id']]);
		} 
		catch (\Throwable $th) {
			echo '<pre>'.$th->getMessage().'</pre>';
		}
	}
	  
}
