<?php 

namespace Models\Courses;

use DB;
use Base;
use Exception;
use Classes\FormValidation;


class CoursesData 
{
	/**
	 * F3 Mapper object
	 *
	 * @var Mapper
	 */
	private $course;


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

	/**
	 * Validates a form based on custom attribute configuration.
	 *
	 * @return void
	 * @throws Exception
	 */
	public function validateNewForm()
	{
		try {
			$validate = new FormValidation();
			$validate->setFieldsToProcess(['title', 'description', 'language', 'instruction_language', 'in_production', 'version']); 
			$validate->setRequired(['title', 'language',  'instruction_language', 'version']);
			$validate->setIsText(['title', 'description', 'language', 'instruction_language']);
			$validate->setIsNumeric(['version', 'in_production']);
			$validate->doValidate();
		} 
		catch (Exception $e) {
			throw new Exception('Form validation failed. ' . $e->getMessage());
		}	
	}

	/**
	 * Validates a form based on custom attribute configuration.
	 *
	 * @return void
	 * @throws Exception
	 */
	public function validateUpdateForm()
	{
		try {
			$validate = new FormValidation();
			$validate->setFieldsToProcess(['id', 'title', 'description', 'in_production', 'version']); 
			$validate->setRequired(['title', 'version']);
			$validate->setIsText(['title', 'description']);
			$validate->setIsNumeric(['version', 'in_production']);
			$validate->doValidate();
		} 
		catch (Exception $e) {
			throw new Exception('Form validation failed. ' . $e->getMessage());
		}	
	}


}
