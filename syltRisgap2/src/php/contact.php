<?php

 // if you are not debugging and don't need error reporting, turn this off by error_reporting(0);
error_reporting(E_ALL & ~E_NOTICE);

/*
 *  CONFIGURE EVERYTHING HERE
 */
require 'formValidator.php';
require 'PHPMailer-master/PHPMailerAutoload.php';
 
// an email address that will receive the email with the output of the form
$sendTo = 'margot-krause@web.de';

// subject of the email
$subject = 'Anfrage Ferienwohnung'; 

// form field names and their translations.
// array variable name => Text to appear in the email
$fields = array(
	'from-date' => 'Anreise', 
	'thru-date' => 'Abreise', 
	'person-counter' => 'Anzahl Person', 
	'room-nr' => 'Wohnung Nr', 
	'last-name' => 'Nachname', 
	'need' => 'Need', 
	'phone' => 'Telefonnr.', 
	'email' => 'Email', 
	'message' => 'Nachricht'); 

// message that will be displayed when everything is OK :)
$okMessage = 'Danke, Ihre Anfrage ist erfolgreich gesendet, Sie erhalten schnellsten eine Antwort.';

// If something goes wrong, we will display this message.
$errorMessage = 'Es ist ein Fehler aufgetreten. Bitte rufen Sie an oder schreiben Sie mir eine Email.';

if($_SERVER["REQUEST_METHOD"] == "POST") {

/*
* Validate
*/

$validator = new Validator;

	// validating...
	if (!$validator->validate($_POST)) {
		// looks like there are errors in input
		//{"type":"success","message":"Danke, Ihre Anfrage ist erfolgreich gesendet, Sie erhalten schnellsten eine Antwort."}
		
		$numItems = count($validator->errors());
		$i = 0;
		$msg = "";
		foreach ($validator->errors() as $field => $errors) {
			foreach($errors as $error)	{
				$msg .= $error;
			}
		}
		$responseArray = array('type' => 'error', 'message' => $msg);

		$utf8responseArray = utf8ize($responseArray);
		$encoded = json_encode($utf8responseArray);
		
		echo $encoded;
	} 
	else {
	
	$from = $_POST['email'];
	/*
	*  Sending
	*/
		try
		{
			if(count($_POST) == 0) throw new \Exception('Form is empty');
            
			$emailText = "Anfrage Ferienwohnung\n=============================\n";

			foreach ($_POST as $key => $value) {
				// If the field exists in the $fields array, include it in the email 
					if (isset($fields[$key])) {
					$emailText .= "$fields[$key]: $value\n";		
					//var_dump($key + ": " $value)			
				}
			}  
			 
			// All the neccessary headers for the email.
			$headers = array('Content-Type: text/plain; charset="UTF-8";',
				'From: ' . $from,
				'Reply-To: ' . $from,
				'Return-Path: ' . $from,
			);
    
			// Send email
			mail($sendTo, $subject, $emailText, implode("\n", $headers));

			$responseArray = array('type' => 'success', 'message' => $okMessage);
		}
		catch (\Exception $e)
		{
			$responseArray = array('type' => 'danger', 'message' => $errorMessage);
		}


		// if requested by AJAX request return JSON response
		if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
			
			$utf8esponseArray = utf8ize($responseArray);
			$encoded = json_encode($utf8esponseArray);
			echo $encoded;
		}
		// else just display the message
		else {
			echo $responseArray['message'];
		}

	}
}

function utf8ize($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = utf8ize($value);
        }
    } else if (is_string ($mixed)) {
        return utf8_encode($mixed);
    }
    return $mixed;
}
?>