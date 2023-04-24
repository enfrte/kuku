<?php 

namespace Models\Lessons;

use DB;
use Base;
use Exception;
use Classes\FormValidation;

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
	 * Validates a form based on custom attribute configuration.
	 *
	 * @return void
	 * @throws Exception
	 */
	public function validateForm()
	{
		try {
			$validate = new FormValidation();
			$validate->setFieldsToProcess(['title', 'description', 'tutorial', 'course_id', 'level', 'in_production']); 
			$validate->setRequired(['title', 'course_id']);
			$validate->setIsText(['title', 'description', 'tutorial']);
			$validate->setIsNumeric(['version', 'in_production', 'course_id', 'level', 'in_production']);
			$validate->doValidate();
		} 
		catch (Exception $e) {
			throw new Exception('Form validation failed: ' . $e->getMessage());
		}	
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
