<?php
$errorMsg = array();
$error = false;

if($_SERVER["REQUEST_METHOD"] == "POST") {

	$firstName = test_input($_POST["firstName"]);
	$name = test_input($_POST["name"]);
	$emailFrom = test_input($_POST["email"]);
	$phone = test_input($_POST["phone"]);
	$mailTo = "margot-krause@web.de";
	$to = "margot-krause@web.de";
	$subject = 'Frage zur Ferienwohnung';
	$headers = "From:" . $emailFrom . "\r\n"; 
	$headers .= "X-Priority: 1\r\n";
	$headers .= "Content-Type: text/html; charset=UTF-8"; 
	 
	ValidateForm($firstName, $name, $emailFrom, $mailTo, $errorMsg, $error); 
	  
	if($error == false)
{
		$msg = SetInquiryForm($_POST, $firstName, $name,$emailFrom, $phone);
		$subject = 'Anfrage Ferienwohnung';
		
		// SEND EMAIL
		$mailSent = mail($to,$subject, $msg, $headers);
	
		// EMAIL IS SUCCESSFUL
		if($mailSent == TRUE) {
			// Seite "Formular verarbeitet" senden:
			$errorMsg['success'] =  'Vielen Dank für Ihre Anfrage';
		} 
		// EMAIL IS NOT SUCCESSFULLY
		elseif($mailSent == FALSE) {
			// Seite "Fehler aufgetreten" senden:
			$errorMsg['failed'] =  'Ihre Anfrage konnte nicht versendet werden';
		}
	}

	// msg als json zurück geben.
	echo json_encode($errorMsg);
}
 
 
function SetInquiryForm(&$request, &$firstName, &$name, &$emailFrom, &$phone){

		$fromDate = test_input($_POST["fromDate"]);;
        $thruDate = test_input($_POST["thruDate"]);
        $roomNr = test_input($_POST["roomNr"]);
        $personCounter = test_input($_POST["personCounter"]);
		$msg = test_input($_POST["message"]);

		$message = 'Ferienwohnung ' . $roomNr . "<br>"
        . 'Personen ' . $personCounter . "<br>"
        . 'Von ' . $fromDate . "<br>"
        . 'Bis ' . $thruDate . "<br>"
        . 'Name ' . $name . "<br>"
        . 'Vorname ' . $firstName . "<br>"
        . 'Emailadresse ' . $emailFrom . "<br>"
        . 'Telefon ' . $phone . "<br>"
		. $msg;

		return $message;
}

 
function ValidateForm(&$firstName, &$name, &$phone, &$emailFrom, &$errorMsg,&$error){

	if(empty($firstName))
	{
		$errorMsg['inquirerFirstname'] = "Bitte füllen Sie das Feld aus";
	}
	elseif(empty($name))
	{
		$errorMsg['inquirerName'] = "Bitte füllen Sie das Feld aus"; 
	}
	elseif(empty($phone))
	{
		$errorMsg['inquirerPhone'] = "Bitte füllen Sie das Feld aus";
	}
	elseif(empty($emailFrom))
	{
		$errorMsg['inquirerEmailAddress'] = "Bitte füllen Sie das Feld aus";
	}	
	elseif(!empty($emailFrom))
	{
		if (!filter_var($emailFrom, FILTER_VALIDATE_EMAIL))
		{
			$errorMsg['inquirerEmailAddress'] = "Bitte geben Sie eine gültige email ein";
		}
	}
	
	if(isset($errorMsg) && count($errorMsg) > 0)
	{
		$error = true;
	}
}

// ======= HELPERS ===========

// Function for filtering input values.
function test_input($data){
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

//exit();
?>