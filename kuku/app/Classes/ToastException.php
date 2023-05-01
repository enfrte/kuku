<?php

namespace Classes;

use Exception;

/**
 * Returns the response in the format that can be picked up by the toast listener.
 */
class ToastException extends Exception
{
	public function __construct(Exception $exception) {
		http_response_code(500);
		echo $exception->getMessage();
		exit;
	}
}
