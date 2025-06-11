<?php

namespace Controllers;

use DB;
use Base;
use Template;
use Exception;
use Classes\ToastException;
use Classes\LanguageAudio;
use Models\Lessons\LessonsData;
use Models\Questions\QuestionsData;

class Questions extends BaseController
{
	protected $isAdmin;

	public function __construct(Base $f3) {
		$this->isAdmin = $f3->get('SESSION.user.admin');
	}

	public function index(Base $f3, $args) 
	{
		try {
			$lesson_id = $args['lesson_id'] ?? '';
			
			if (empty($lesson_id)) {
				throw new Exception("lesson id required");
			}

			$f3->set('lesson_id', $lesson_id);

			$lesson = new LessonsData;
			$lesson->load( $f3, $lesson_id );
			$f3->set('lesson', $lesson->cast());

			$questionData = new QuestionsData($f3);
			$questions = $questionData->getQuestions($f3, $lesson_id);
			$courseData = $questionData->getCourseByLessonId($f3, $lesson_id);
			$f3->set('course', $courseData[0]);
			
			if ( $this->isAdmin ) {
				$f3->set('questions', $questions);
				echo Template::instance()->render('views/components/admin/questions/question-list-editor.php');
			}
			else {
				// Include json_encode flags to escape characters alpine js has problems with
				$f3->set('questions', json_encode($questions, JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT));
				echo Template::instance()->render('views/components/student/questions/question-list.php');
			}
		} 
		catch (\Throwable $th) {
			$this->errorHandler($th);
		}
	}

	public function batchQuestions(Base $f3, $args) 
	{
		try {
			$lesson_id = $args['lesson_id'] ?? '';
			
			if (empty($lesson_id)) {
				throw new Exception("lesson id required");
			}

			$f3->set('lesson_id', $lesson_id);

			$lesson = new LessonsData;
			$lesson->load( $f3, $lesson_id );
			$f3->set('lesson', $lesson->cast());

			$questionData = new QuestionsData($f3);
			$questions = $questionData->getQuestions($f3, $lesson_id);
			
			$courseData = $questionData->getCourseByLessonId($f3, $lesson_id);
			$f3->set('course', $courseData[0]);

			if ( $this->isAdmin ) {
				$f3->set('questions', $questions);
				echo Template::instance()->render('views/components/admin/questions/batch-question-creator.php');
			}
		} 
		catch (\Throwable $th) {
			$this->errorHandler($th);
		}
	}

    public function saveBatchQuestions(Base $f3)
    {
		try {
			$f3->DB->begin();

			$questionData = new QuestionsData($f3);
			$questionData->validateBatchForm();
			$questionData->saveBatchQuestion($f3);

			$f3->DB->commit();

			$languageAudio = new LanguageAudio($_POST['language_locale'], $f3->ABSOLUTE_PRIVATE_APP_PATH, $f3->AUDIO_PATH, $f3->APPNAME);
			$languageAudio->updateAudio();

			$this->index($f3, ['lesson_id' => $_POST['lesson_id']]);
		} 
		catch (Exception $e) {
			new ToastException($e);
		}
    }

    public function create(Base $f3, $args)
    {
		$f3->set('lesson_id', $args['lesson_id']);
		echo Template::instance()->render('views/components/admin/questions/question-creator-editor.php');
    }

	public function save(Base $f3)
	{
		try {
			$f3->DB->begin();
			
			$question = new QuestionsData($f3);
			$question->validateNewForm();
			$question->saveNewQuestionAndAltPhrases($f3);

			$f3->DB->commit();
			$this->index($f3, ['lesson_id' => $_POST['lesson_id']]);
		} 
		catch (Exception $e) {
			new ToastException($e);
		}
    }

	public function update(Base $f3, $args)
	{
		try {
			$f3->DB->begin();
			
			// It's quite a complicated process to update questions and its linking tables, so lets just delete the old values.
			$question = new QuestionsData($f3);
			$question->load( $f3, $_POST['question_id'] );
			$question->erase();

			// Update = create a new entry with the current (old) form data.
			$questionData = new QuestionsData($f3);
			$questionData->validateUpdateForm();
			$questionData->saveNewQuestionAndAltPhrases($f3);

			$f3->DB->commit();

			$languageAudio = new LanguageAudio($_POST['language_locale'], $f3->ABSOLUTE_PRIVATE_APP_PATH, $f3->AUDIO_PATH, $f3->APPNAME);
			$languageAudio->updateAudio();

			$this->index($f3, ['lesson_id' => $_POST['lesson_id']]);
		} 
		catch (\Exception $e) {
			new ToastException($e);
		}
	}

    public function delete(Base $f3, $args)
    {
		try {
			$question = new QuestionsData($f3);
			$question->load( $f3, $args['question_id'] );
			$question->erase();

			// What about the alt stuff? Does the delete cascade work?

			$this->index($f3, $args);
		} 
		catch (\Throwable $th) {
			//throw $th;
		}
    }
}
