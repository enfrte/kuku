<?php 

namespace Models\Lessons;

/**
 * Process data from queries
 */
class LesssonsData
{
	protected $model;

	public function __construct() {
		$this->model = new LesssonsModel();
	}

	public function getLessonData()
	{
		$lessons = $this->model->doGetLessonData();
	}
}
