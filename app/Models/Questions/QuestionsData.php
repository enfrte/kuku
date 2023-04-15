<?php 

namespace Models\Questions;

//use Classes\FormValidation;
use Base;
use Models\BaseModel;
use DB;
use Exception;

class QuestionsData extends BaseModel
{
	/**
	 * F3 Mapper object
	 *
	 * @var Mapper
	 */
	private $question;

	private $questions;

    public function __construct()
    {
    }

	/**
	 * Validates a form based on custom attribute configuration.
	 *
	 * @return bool
	 */
	public function validateForm()
	{
	}


	public function load(Base $f3, int $id)
	{
		try {
			$question = new DB\SQL\Mapper($f3->DB,'questions');
			$question->load( ['id=?', $id] );

			if ($question->dry()) {
				throw new Exception("No record matching criteria.");	
			}

			$this->setQuestion($question);
		} 
		catch (\Throwable $th) {
			throw $th;
		}
	}


	public function erase()
	{
		$this->getQuestion()->erase();
	}


	public function cast()
	{
		return $this->getQuestion()->cast();
	}


	public function saveNewQuestionAndAltPhrases(Base $f3)
	{
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
	}


	public function getQuestions(Base $f3, int $lesson_id)
	{
		
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

		if ( $this->isAdmin ) {
			$questions = $this->processQuestionDataForAdmin($questions_query);
		}
		else {
			$questions = $this->processQuestionDataForStudentQuiz($questions_query);
		}

		return $questions;
	}

	private function processQuestionDataForAdmin($questions_query)
	{
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

		return $questions;
	}

	private function processQuestionDataForStudentQuiz($questions_query)
	{
		$questions = [];
		
		foreach ($questions_query as $question) {
			if ( empty($questions[$question['id']]) ) {
				$questions[$question['id']] = [
					'id' => $question['id'],
					'native_phrase_array' => explode(' ', $question['native_phrase']),
					'foreign_phrase_array' => explode(' ', $question['foreign_phrase']),
					'native_phrase' => $question['native_phrase'],
					'foreign_phrase' => $question['foreign_phrase'],
				];
			}

			if (!empty($question['alternative_native_phrase'])) {
				$questions[$question['id']]['alternative_native_phrase'][$question['alternative_native_phrase_id']] = $question['alternative_native_phrase'];
			}

			if (!empty($question['alternative_foreign_phrase'])) {
				$questions[$question['id']]['alternative_foreign_phrase'][$question['alternative_foreign_phrase_id']] = $question['alternative_foreign_phrase'];
			}
		}

		return array_values($questions);
	}


	/**
	 * Get the value of question
	 */ 
	public function getQuestion()
	{
		return $this->question;
	}


	/**
	 * Set the value of question
	 *
	 * @return  self
	 */ 
	public function setQuestion($question)
	{
		$this->question = $question;
		return $this;
	}


}
