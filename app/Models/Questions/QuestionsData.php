<?php 

namespace Models\Questions;

//use Classes\FormValidation;
use Base;
use DB;
use Exception;

class QuestionsData 
{
	/**
	 * F3 Mapper object
	 *
	 * @var Mapper
	 */
	private $question;

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
