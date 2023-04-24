<?php 

namespace Models\AltPhraseData;

use DB;
use Base;
use Exception;
use Models\BaseModel;
use Classes\FormValidation;

class AltPhraseData extends BaseModel
{
	protected $isAdmin;

	public function __construct(Base $f3) {
		$this->isAdmin = $f3->get('SESSION.user.admin');
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
			$validate->setFieldsToProcess(['question_id', 'phrase']); 
			$validate->setRequired(['question_id', 'phrase']);
			$validate->setIsText(['phrase']);
			$validate->setIsNumeric(['question_id']);
			$validate->doValidate();
		} 
		catch (Exception $e) {
			throw new Exception('Form validation failed: ' . $e->getMessage());
		}	
	}


}
