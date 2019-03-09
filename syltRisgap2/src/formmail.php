<?php
$errorMsg = array();
$error = false;

if($_SERVER["REQUEST_METHOD"] == "POST") {

	$firstName = test_input($_POST["firstName"]);
	$name = test_input($_POST["name"]);
	$emailFrom = test_input($_POST["email"]);
	$phone = test_input($_POST["phone"]);
	$mailTo = "margot-krause@web.de";
	$msg = "";
	$to = "margot-krause@web.de";
	$subject = 'Frage zur Ferienwohnung';
	$headers = "From:" . $emailFrom . "\r\n"; 
	$headers .= "X-Priority: 1\r\n";
	$headers .= "Content-Type: text/html; charset=UTF-8"; 
	  
	ValidateForm($firstName, $name, $emailFrom, $mailTo); 
	  
	if($error == false)
	{
		if($_POST['form'] == "Inquiry")
		{
			$msg = SetInquiryForm($_POST);
			$subject = 'Frage zur Ferienwohnung';

		}
		elseif($_POST["form"] == "contact") {
			$tmpMsg  =	test_input($_POST["message"]);
			ValidateContactForm($tmpMsg);
			if($error == FALSE)
			{
				$msg = $_POST["message"];
				$subject = 'Frage zur Ferienwohnung';

			}
		}
	}

	if($error == false)
	{  
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
 
function SetInquiryForm(array $request){
		$fromDate = test_input($_POST["fromDate"]);;
        $thruDate = test_input($_POST["thruDate"]);
        $roomNr = test_input($_POST["roomNr"]);
        $personCounter = test_input($_POST["personCounter"]);

		 $message = 'Ferienwohnung ' . $roomNr . "<br>"
            . 'Personen ' . $personCounter . "<br>"
            . 'Von ' . $fromDate . "<br>"
            . 'Bis ' . $thruDate . "<br>"
            . 'Name ' . $inquirerName . "<br>"
            . 'Vorname ' . $inquirerFirstName . "<br>"
            . 'Emailadresse ' . $inquirerEmailAddress . "<br>"
            . 'Telefon ' . $inquirerPhone . "<br>";

		return $message;
}

function ValidateForm(string $firstName, string $name, string $phone, string $emailFrom){

	if(empty($firstName))
	{
		$errorMsg['inquirerEmailAddress'] = "Bitte füllen Sie das Feld aus";
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
	
	if(isset($errMsg) && count($errorMsg) > 0)
	{
		$error = true;
	}
}

function ValidateContactForm(string $msg){
	$words = explode(" ", $msg);

	if(Count($words) < 2 || strlen($words[0]) < 6 || strlen($words[1]) < 2)
	{
		$errorMsg['MessageIncorrect'] =  'Die Nachricht muss aus mehreren Wörter bestehen.';
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