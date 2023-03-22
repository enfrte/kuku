<?php

namespace Controllers;

use DB;
use Template;
use Exception;
use Base;

class Questions extends BaseController
{
	public function index(Base $f3, $args) {
		$lesson_id = $args['lesson_id'] ?? '';
		if (empty($lesson_id)) {
			throw new Exception("Course id required");
		}

		$lesson = new DB\SQL\Mapper($f3->DB,'lessons');
		$lesson->load('id', ['id' => $lesson_id]); 
		$f3->set('lesson', ['title' => $lesson->title]);

		$questions = $f3->DB->exec(
			'SELECT q.*
			, anp.id AS alternative_native_phrase_id, anp.phrase AS alternative_native_phrase
			, afp.id AS alternative_foreign_phrase_id, afp.phrase AS alternative_foreign_phrase
			FROM questions q 
			LEFT JOIN alternative_native_phrase anp 
			ON q.id = anp.question_id 
			LEFT JOIN alternative_foreign_phrase afp 
			ON q.id = afp.question_id 
			WHERE q.lesson_id = :lesson_id
			ORDER BY q.id DESC', 
			['lesson_id' => $lesson_id]
		);

		$f3->set('questions', $questions);
		
		$f3->set('lesson_id', $lesson_id);
		echo Template::instance()->render('views/components/admin/main/questions/question-list-editor.php');
	}

    public function create(Base $f3, $args)
    {
		$f3->set('lesson_id', $args['lesson_id']);
		echo Template::instance()->render('views/components/admin/main/questions/question-creator-editor.php');
    }

    public function read(Base $f3, $args)
    {
        // Implement read method
    }

    public function save(Base $f3)
    {
		$this->index($f3, ['lesson_id' => $_POST['lesson_id']]);
    }

    public function delete(Base $f3, $args)
    {
        // Implement delete method
    }
}
