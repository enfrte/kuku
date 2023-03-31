<?php 

namespace Models\Lessons;

//use Classes\FormValidation;
use Base;
use DB;
use Exception;

class LessonsData 
{
	/**
	 * F3 Mapper object
	 *
	 * @var Mapper
	 */
	private $lesson;

    public function __construct(/* $db */)
    {
        /* $table = 'lessons';
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
			$lesson = new DB\SQL\Mapper($f3->DB,'lessons');
			$lesson->load( ['id=?', $id] );

			if ($lesson->dry()) {
				throw new Exception("No record matching criteria.");	
			}

			$this->setLesson($lesson);
		} 
		catch (\Throwable $th) {
			throw $th;
		}
	}


	public function erase()
	{
		$this->getLesson()->erase();
	}


	public function cast()
	{
		return $this->getLesson()->cast();
	}

	/**
	 * Get the value of lesson
	 */ 
	public function getLesson()
	{
		return $this->lesson;
	}


	/**
	 * Set the value of lesson
	 *
	 * @return  self
	 */ 
	public function setLesson($lesson)
	{
		$this->lesson = $lesson;
		return $this;
	}



}
