<?php
$sendLog = array();

if($_SERVER["REQUEST_METHOD"] == "POST") {

        $firstName = test_input($_POST["inquirerFirstName"]);
        $name = test_input($_POST["inquirerName"]);
        $fromEmail = test_input($_POST["inquirerEmailAddress"]);
        $phone = test_input($_POST["inquirerPhone"]);
    
          if(empty($firstName))
          {
              $sendLog['inquirerEmailAddress'] = "Bitte füllen Sie das Feld aus";
          }
          elseif(empty($name))
          {
                $sendLog['inquirerName'] = "Bitte füllen Sie das Feld aus";
          }
          elseif(empty($phone))
          {
              $sendLog['inquirerPhone'] = "Bitte füllen Sie das Feld aus";
          }
          elseif(empty($fromEmail))
          {
              $sendLog['inquirerEmailAddress'] = "Bitte füllen Sie das Feld aus";
          }
          elseif(!empty($fromEmail))
          {
              if (filter_var($_POST["$fromEmail"], FILTER_VALIDATE_EMAIL))
              {
                  $sendLog['inquirerEmailAddress'] = "Bitte geben Sie eine gültige email ein";
              }
              else
              {
                  $emailFrom = $fromEmail;
              }
          }

	if($_POST['form'] == "inquiry")
    {
        $fromDate = test_input($_POST["fromDate"]);;
        $thruDate = test_input($_POST["thruDate"]);
        $roomNr = test_input($_POST["roomNr"]);
        $personCounter = test_input($_POST["personCounter"]);

          /*
          elseif(empty($_POST["fromDate"]))
          {
              $sendLog['fromDate'] = "Bitte geben Sie ein Datum an";
              $fromDate = "Nicht angegeben";


          }
          elseif(empty($_POST["thruDate"]))
          {
              $sendLog['thruDate'] = "Bitte geben Sie ein Datum an";
              $thruDate = "Nicht angegeben";
          }
          */

        // Email configuration
        $mailTo = 'margot-krause@web.de';
        $mailFrom = $fromEmail;
        $mailSubject    = 'Anfrage Ferienwohnung ' . $fromDate . ' bis ' . $thruDate;
        $message = 'Ferienwohnung ' . $roomNr . "<br>"
            . 'Personen ' . $personCounter . "<br>"
            . 'Von ' . $fromDate . "<br>"
            . 'Bis ' . $thruDate . "<br>"
            . 'Name ' . $name . "<br>"
            . 'Vorname ' . $firstName . "<br>"
            . 'Emailadresse ' . $mailFrom . "<br>"
            . 'Telefon ' . $phone . "<br>";
    }
    elseif ($_POST["form"] == "contact") {

        elseif (empty($commmentatorText)) {

            $sendLog['commmentatorText'] = "Bitte schreiben Sie eine Nachricht";
        }

        // Email configuration
        $mailTo = 'margot-krause@web.de';
        $mailFrom = $commentatorEmailAddress;
        $mailSubject = 'Nachricht von ' . $commentatorEmailAddress;
        $message = $commmentatorText;

    }
}

$headers = "Content-Type: text/html; charset=UTF-8";

// EMAIL SEND TO INQUERER

$message2 = "Vielen Dank für Ihre Anfrage, in den nächsten Stunden werde ich Ihnen Antworten.";
$mailSubject2 = 'Frage zur Ferienwohnung';

// SEND EMAIL
$mailSent = @mail($mailTo, $mailSubject, $message,$headers);
//$mailSent  = @mail($mailFrom,$mailSubject2,$message2,$headers); // sends a copy of the message to the sender
echo($mailTo);

// ======= RETURN RESPONSE

// EMAIL IS SUCCESSFUL
if($mailSent == TRUE) {
    // Seite "Formular verarbeitet" senden:
    $sendLog['success'] =  'Vielen Dank für Ihre Anfrage';
}
// EMAIL IS NOT SUCCESSFULLY
else {
    // Seite "Fehler aufgetreten" senden:
    $sendLog['failed'] =  'Ihre Anfrage konnte nicht versendet werden';
}
echo json_encode($sendLog);


// ======= HELPERS ===========

// Function for filtering input values.
function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}


//exit();
?>