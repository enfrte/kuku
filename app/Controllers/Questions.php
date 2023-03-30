<?php

namespace Controllers;

use DB;
use Template;
use Models\Questions\QuestionsData;
use Exception;
use Base;

class Questions extends BaseController
{
	public function index(Base $f3, $args) {
		$lesson_id = $args['lesson_id'] ?? '';
		if (empty($lesson_id)) {
			throw new Exception("lesson id required");
		}

		$lesson = new DB\SQL\Mapper($f3->DB,'lessons');
		$lesson->load('id', ['id' => $lesson_id]); 
		$f3->set('lesson', ['title' => $lesson->title]);

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
			['lesson_id' => $lesson_id]
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

    public function read(Base $f3, $args)
    {
        // Implement read method
    }

    public function save(Base $f3)
    {
		try {
			$f3->DB->begin();

			$questionsModel = new DB\SQL\Mapper($f3->DB,'questions');
			$questionsModel->copyFrom('POST');
			$questionsModel->save();

			$altNativePhrases = explode(PHP_EOL, $_POST['alternative_native_phrase']);

			foreach ($altNativePhrases as $altNativePhrase) {
				$altNativePhrase = trim($altNativePhrase);
				
				if (empty($altNativePhrase)) continue;

				$mapper = new DB\SQL\Mapper($f3->DB, 'alternative_native_phrase');
				$mapper->question_id = $questionsModel->_id;
				$mapper->phrase = $altNativePhrase;
				$mapper->save();
			}

			$altForeignPhrases = explode(PHP_EOL, $_POST['alternative_foreign_phrase']);

			foreach ($altForeignPhrases as $altForeignPhrase) {
				$altForeignPhrase = trim($altForeignPhrase);
				
				if (empty($altForeignPhrase)) continue;

				$mapper = new DB\SQL\Mapper($f3->DB, 'alternative_foreign_phrase');
				$mapper->question_id = $questionsModel->_id;
				$mapper->phrase = $altForeignPhrase;
				$mapper->save();
			}

			$f3->DB->commit();
		} 
		catch (\Throwable $th) {
			echo '<pre>'.$th->getMessage().'</pre>';
		}
		finally {
			$this->index($f3, ['lesson_id' => $_POST['lesson_id']]);
		}
    }

	public function update(Base $f3)
	{
		echo 'You are here';
	}

    public function delete(Base $f3, $args)
    {
		$course = new QuestionsData;
		$course->load( $f3, $args['question_id'] );
		$course->erase();

		$this->index($f3, $args);
    }
}
