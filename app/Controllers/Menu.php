<?php

namespace Controllers;

class Menu
{
	public function index(\Base $fw, array $args = [])
	{
		echo 'Hello, this is a '. $fw->VERB;
	}
}
