<?php

namespace Controllers\Components;

use Models\Courses\CoursesData;
use Classes\ToastException;
use Classes\Languages;
use Exception;
use Template;
use Base;
use Web;
use DB;

class LanguageSelect  
{
	public function languageSearch(Base $f3, array $args)
	{
		$search = '';
		$searchType = $args['type'] ?? '';

		if ($searchType == 'instruction_language') {
			$search = $_POST['instruction_language'];
		}
		elseif ($searchType == 'language') {
			$search = $_POST['language'];
		}
		
		$languages = (new Languages)->getIsoLanguages();
		
        $search_result = array_filter($languages, function ($language) use ($search) {
			return stripos($language, $search) !== false;
        });
		
		$f3->set('languages', $search_result);
		$f3->set('type', $searchType);

		echo Template::instance()->render('views/components/languageSelect.php');
	}
	
}