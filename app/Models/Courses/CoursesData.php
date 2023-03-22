<?php 

namespace Models\Courses;

//use Classes\FormValidation;
use Base;
use DB;
use Exception;

class CoursesData 
{
	/**
	 * F3 Mapper object
	 *
	 * @var Mapper
	 */
	private $course;

    public function __construct(/* $db */)
    {
        /* $table = 'courses';
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
			$course = new DB\SQL\Mapper($f3->DB,'courses');
			$course->load( ['id=?', $id] );

			if ($course->dry()) {
				throw new Exception("No record matching criteria.");	
			}

			$this->setCourse($course);
		} 
		catch (\Throwable $th) {
			throw $th;
		}
	}


	public function erase()
	{
		$this->getCourse()->erase();
	}


	public function cast()
	{
		return $this->getCourse()->cast();
	}

	/**
	 * Get the value of course
	 */ 
	public function getCourse()
	{
		return $this->course;
	}


	/**
	 * Set the value of course
	 *
	 * @return  self
	 */ 
	public function setCourse($course)
	{
		$this->course = $course;
		return $this;
	}



}
