<?php

namespace Controllers;

use DB;
use Template;
use Models\Questions\QuestionsData;
use Exception;
use Base;

class Questions 
{
	public function index(Base $f3, $args) {
		$lesson_id = $args['lesson_id'] ?? '';
		if (empty($lesson_id)) {
			throw new Exception("lesson id required");
		}

		$lesson = new DB\SQL\Mapper($f3->DB,'lessons');
		$lesson->load(['id=?', $lesson_id]); 
		$f3->set('lesson', ['title' => $lesson->title, 'course_id' => $lesson->course_id]);

		$questions_query = $f3->DB->exec(
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
			[':lesson_id' => $lesson_id]
		);

		$questions = [];

		foreach ($questions_query as $question) {
			if ( empty($questions[$question['id']]) ) {
				$questions[$question['id']] = [
					'id' => $question['id'],
					'native_phrase' => $question['native_phrase'],
					'foreign_phrase' => $question['foreign_phrase'],
				];
			}

			$questions[$question['id']]['alternative_native_phrase'][$question['alternative_native_phrase_id']] = $question['alternative_native_phrase'];

			$questions[$question['id']]['alternative_foreign_phrase'][$question['alternative_foreign_phrase_id']] = $question['alternative_foreign_phrase'];
		}

		foreach ($questions as $question_id => $question) {
			$questions[$question_id]['alternative_native_phrase_text'] = implode("<br>", $question['alternative_native_phrase']);
			$questions[$question_id]['alternative_foreign_phrase_text'] = implode("<br>", $question['alternative_foreign_phrase']);
			$questions[$question_id]['alternative_native_phrase_textarea'] = implode("\n", $question['alternative_native_phrase']);
			$questions[$question_id]['alternative_foreign_phrase_textarea'] = implode("\n", $question['alternative_foreign_phrase']);
		}

		$f3->set('questions', $questions);
		
		$f3->set('lesson_id', $lesson_id);
		echo Template::instance()->render('views/components/admin/questions/question-list-editor.php');
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
