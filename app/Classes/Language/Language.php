<?php

namespace Classes\Language;

class Language
{
	public function index(\Base $fw, array $args = [])
	{
		echo '<pre>Language->index: ' . $fw->VERB;
	}
}

