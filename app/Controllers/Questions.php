<?php

namespace Controllers;

use DB;
use Template;
use Models\Questions\QuestionsData;
use Models\Lessons\LessonsData;
use Exception;
use Base;

class Questions extends BaseController
{
	public function index(Base $f3, $args) 
	{
		try {
			$lesson_id = $args['lesson_id'] ?? '';
			if (empty($lesson_id)) {
				throw new Exception("lesson id required");
			}
			$f3->set('lesson_id', $lesson_id);

			$lesson = new LessonsData;
			$lesson->load( $f3, $lesson_id );
			$f3->set('lesson', $lesson->cast());

			$questionData = new QuestionsData();
			$questions = $questionData->getQuestions($f3, $lesson_id);
			
			if ( $this->isAdmin ) {
				$f3->set('questions', $questions);
				echo Template::instance()->render('views/components/admin/questions/question-list-editor.php');
			}
			else {
				// Include json_encode flags to escape characters alpine js has problems with
				$f3->set('questions', json_encode($questions, JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT));
				echo Template::instance()->render('views/components/student/questions/question-list.php');
			}
		} 
		catch (\Throwable $th) {
			$this->errorHandler($th);
		}
	}

    public function create(Base $f3, $args)
    {
		$f3->set('lesson_id', $args['lesson_id']);
		echo Template::instance()->render('views/components/admin/questions/question-creator-editor.php');
    }

    public function save(Base $f3)
    {
		try {
			$f3->DB->begin();

			$questionData = new QuestionsData();
			$questionData->saveNewQuestionAndAltPhrases($f3);

			$f3->DB->commit();
		} 
		catch (\Throwable $th) {
			echo '<pre>'.$th->getMessage().'</pre>';
		}
		finally {
			$this->index($f3, ['lesson_id' => $_POST['lesson_id']]);
		}
    }

	public function update(Base $f3, $args)
	{
		try {
			$f3->DB->begin();
			
			// It's quite a complicated process to update questions and its linking tables, so lets just delete the old values.
			$question = new QuestionsData;
			$question->load( $f3, $_POST['question_id'] );
			$question->erase();

			// Update = create a new entry with the current (old) form data.
			$questionData = new QuestionsData();
			$questionData->saveNewQuestionAndAltPhrases($f3);

			$f3->DB->commit();
		} 
		catch (\Throwable $th) {
			echo '<pre>'.$th->getMessage().'</pre>';
		}
		finally {
			$this->index($f3, ['lesson_id' => $_POST['lesson_id']]);
		}

	}

    public function delete(Base $f3, $args)
    {
		try {
			$question = new QuestionsData;
			$question->load( $f3, $args['question_id'] );
			$question->erase();

			// What about the alt stuff? Does the delete cascade work?

			$this->index($f3, $args);
		} 
		catch (\Throwable $th) {
			//throw $th;
		}
    }
}
