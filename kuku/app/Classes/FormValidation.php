<?php

namespace Classes;

use Exception;

/*
// Tutorial
use FormValidation;

class SomeModelClass { 
	public function __construct() {
		// In the construct of some model which should relate to some table, you can do the following
		$validate = new FormValidation();
		$validate->setFieldsToProcess(['email', 'name', 'phone']); // Throw exception, if POST has fields not in this list
		$validate->setRequired(['email', 'name']);
		$validate->setIsText(['name']);
		$validate->setIsNumeric(['phone']);
		$validate->setEmail(['email']);
		$validate->doValidate();
	}
}
*/

class FormValidation
{
	/**
	 * @var array - Fields that must not be empty or missing from the request.
	 */
	private $required = [];

	/**
	 * Stops many fields being added to the POST request by removing items from POST not found in the provided list.
	 * @var array - Fields to include.
	 */
	private $fieldsToProcess = [];

	/**
	 * @var array - One or more email fields.
	 */
	private $email = []; 

	/**
	 * @var array - One or more phone number fields.
	 */
	private $phone = [];

	/**
	 * @var array - Fields that must be numeric.
	 */
	private $isNumeric = [];

	/**
	 * @var array - Fields that must be text.
	 */
	private $isText = [];

	/**
	 * @var array - Fields that must be numeric and greater than the given number ['field_name' => 0].
	 */
	private $numericGreaterThan = [];
	
	/**
	 * @var array - Fields that must be numeric and less than the given number ['field_name' => 0].
	 */
	private $numericLessThan = [];
	
	/**
	 * @var array - Fields that must be text and greater than the given number ['field_name' => 0].
	 */
	private $textLengthGreaterThan = [];
	
	/**
	 * @var array - Fields that must be text and greater than the given number ['field_name' => 0].
	 */
	private $textLengthLessThan = [];
	
	/**
	 * @var array - Fields that must be equal to some value ['field_name' => 0].
	 */
	private $equalTo = [];

	
	// Run the validation rules here
	public function doValidate()
	{
		// Required
		$missingFields = array_diff($this->getRequired(), array_keys($_POST));
		
		if ( $missingFields ) {
			throw new Exception("There are fields missing from the form altogether!");
		}

		foreach ($_POST as $field => $value) {
			// Required
			if (in_array($field, $this->getRequired()) && $value == '') {
				throw new Exception("Missing value: ".$field);
			}

			// Email
			if (in_array($field, $this->getEmail()) && filter_var($value, FILTER_VALIDATE_EMAIL) == false) {
				throw new Exception("Invalid email: ".$field);
			}

			// Filter unexpected fields, if not empty
			if (!empty($this->fieldsToProcess) && !in_array($field, $this->fieldsToProcess)) {
				throw new Exception("Unexpected fields: ".$field);
			}
		}
	}

	/**
	 * Get the value of required
	 */ 
	public function getRequired()
	{
		return $this->required;
	}

	/**
	 * Set the value of required
	 *
	 * @return  self
	 */ 
	public function setRequired(array $required)
	{
		$this->required = $required;

		return $this;
	}

	/**
	 * Get the value of email
	 */ 
	public function getEmail()
	{
		return $this->email;
	}

	/**
	 * Set the value of email
	 *
	 * @return  self
	 */ 
	public function setEmail(array $email)
	{
		$this->email = $email;

		return $this;
	}

	/**
	 * Get the value of is_numeric
	 */ 
	public function getIsNumeric()
	{
		return $this->isNumeric;
	}

	/**
	 * Set the value of is_numeric
	 *
	 * @return  self
	 */ 
	public function setIsNumeric(array $isNumeric)
	{
		$this->isNumeric = $isNumeric;

		return $this;
	}

	/**
	 * Get the value of is_text
	 */ 
	public function getIsText()
	{
		return $this->isText;
	}

	/**
	 * Set the value of is_text
	 *
	 * @return  self
	 */ 
	public function setIsText(array $isText)
	{
		$this->isText = $isText;

		return $this;
	}

	/**
	 * Get the value of phone
	 */ 
	public function getPhone()
	{
		return $this->phone;
	}

	/**
	 * Set the value of phone
	 *
	 * @return  self
	 */ 
	public function setPhone($phone)
	{
		$this->phone = $phone;

		return $this;
	}

	/**
	 * Get the value of numericGreaterThan
	 */ 
	public function getNumericGreaterThan()
	{
		return $this->numericGreaterThan;
	}

	/**
	 * Set the value of numericGreaterThan
	 *
	 * @return  self
	 */ 
	public function setNumericGreaterThan($numericGreaterThan)
	{
		$this->numericGreaterThan = $numericGreaterThan;

		return $this;
	}

	/**
	 * Get the value of numericLessThan
	 */ 
	public function getNumericLessThan()
	{
		return $this->numericLessThan;
	}

	/**
	 * Set the value of numericLessThan
	 *
	 * @return  self
	 */ 
	public function setNumericLessThan($numericLessThan)
	{
		$this->numericLessThan = $numericLessThan;

		return $this;
	}

	/**
	 * Get the value of textLengthGreaterThan
	 */ 
	public function getTextLengthGreaterThan()
	{
		return $this->textLengthGreaterThan;
	}

	/**
	 * Set the value of textLengthGreaterThan
	 *
	 * @return  self
	 */ 
	public function setTextLengthGreaterThan($textLengthGreaterThan)
	{
		$this->textLengthGreaterThan = $textLengthGreaterThan;

		return $this;
	}

	/**
	 * Get the value of textLengthLessThan
	 */ 
	public function getTextLengthLessThan()
	{
		return $this->textLengthLessThan;
	}

	/**
	 * Set the value of textLengthLessThan
	 *
	 * @return  self
	 */ 
	public function setTextLengthLessThan($textLengthLessThan)
	{
		$this->textLengthLessThan = $textLengthLessThan;

		return $this;
	}

	/**
	 * Get the value of fieldsToProcess
	 */ 
	public function getFieldsToProcess()
	{
		return $this->fieldsToProcess;
	}

	/**
	 * Set the value of fieldsToProcess
	 *
	 * @return  self
	 */ 
	public function setFieldsToProcess($fieldsToProcess)
	{
		$this->fieldsToProcess = $fieldsToProcess;

		return $this;
	}

	/**
	 * Get the value of equalTo
	 */ 
	public function getEqualTo()
	{
		return $this->equalTo;
	}

	/**
	 * Set the value of equalTo
	 *
	 * @return  self
	 */ 
	public function setEqualTo($equalTo)
	{
		$this->equalTo = $equalTo;

		return $this;
	}
}
