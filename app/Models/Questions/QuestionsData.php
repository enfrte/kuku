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

    public function __construct(/* $db */)
    {
        /* $table = 'questions';
        $columns = ['id', 'title', 'description', 'language', 'instruction_language', 'slug', 'version', 'in_production'];
        $primaryKeys = ['id'];
        parent::__construct($db, $table, $columns, $primaryKeys); */
    }

	/**
	 * Validates a form based on custom attribute configuration.
	 *
	 * @return bool
	 */
	public function validateForm()
	{
		/* $formValidation = new FormValidation();
		$formValidation->setFilterNotMatching(['id', 'title', 'description', 'language', 'instruction_language', 'slug', 'version', 'in_production']);
		$formValidation->setRequired(['title', 'language', 'instruction_language', 'in_production']);
		$formValidation->setTextLengthLessThan([
			'title' => 255, 
			'description' => 255, 
			'language' => 4, 
			'instruction_language' => 4,
		]);
		$formValidation->validate(); */
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
