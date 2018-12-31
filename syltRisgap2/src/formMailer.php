<?php
$sendLog = array();
s
if($_SERVER["REQUEST_METHOD"] == "POST") {

    if($_POST['inquiryForm'])
    {
        $inquirerFirstName = test_input($_POST["inquirerFirstName"]);
        $inquirerName = test_input($_POST["inquirerName"]);
        $inquirerEmailAddress = test_input($_POST["inquirerEmailAddress"]);
        $inquirerPhone = test_input($_POST["inquirerPhone"]);
        $fromDate = test_input($_POST["fromDate"]);;
        $thruDate = test_input($_POST["thruDate"]);
        $roomNr = test_input($_POST["roomNr"]);
        $personCounter = test_input($_POST["personCounter"]);

          if(empty($inquirerFirstName))
          {
              $sendLog['inquirerEmailAddress'] = "Bitte füllen Sie das Feld aus";
          }
          elseif(empty($inquirerName))
            {
                $sendLog['inquirerName'] = "Bitte füllen Sie das Feld aus";
            }
          elseif(empty($inquirerPhone))
          {
              $sendLog['inquirerPhone'] = "Bitte füllen Sie das Feld aus";
          }
          elseif(empty($inquirerEmailAddress))
          {
              $sendLog['inquirerEmailAddress'] = "Bitte füllen Sie das Feld aus";
          }
          elseif(!empty($inquirerEmailAddress))
          {
              if (filter_var($_POST["$inquirerEmailAddress"], FILTER_VALIDATE_EMAIL))
              {
                  $sendLog['inquirerEmailAddress'] = "Bitte geben Sie eine gültige email ein";
              }
              else
              {
                  $emailFrom = $inquirerEmailAddress;
              }
          }
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
        $mailFrom = $inquirerEmailAddress;
        $mailSubject    = 'Anfrage Ferienwohnung ' . $fromDate . ' bis ' . $thruDate;
        $message = 'Ferienwohnung ' . $roomNr . "<br>"
            . 'Personen ' . $personCounter . "<br>"
            . 'Von ' . $fromDate . "<br>"
            . 'Bis ' . $thruDate . "<br>"
            . 'Name ' . $inquirerName . "<br>"
            . 'Vorname ' . $inquirerFirstName . "<br>"
            . 'Emailadresse ' . $inquirerEmailAddress . "<br>"
            . 'Telefon ' . $inquirerPhone . "<br>";
    }
    elseif ($_POST['commentForm']) {
        $commentatorName = test_input($_POST["commentatorName"]);
        $commentatorPhone = test_input($_POST["commentatorPhone"]);
        $commentatorEmailAddress = test_input($_POST["commentatorEmailAddress"]);
        $commmentatorText = test_input($_POST["commentatorText"]);

        if (empty($commentatorName)) {
            $sendLog['commentatorName'] = "Bitte füllen Sie das Feld aus";
        } elseif (empty($commentatorPhone)) {

            $sendLog['commentatorPhone'] = "Bitte füllen Sie das Feld aus";
        }
        elseif (!empty($commentatorEmailAddress))
        {
            if (filter_var($_POST["$commentatorEmailAddress"], FILTER_VALIDATE_EMAIL))
            {
                $sendLog['commentatorEmailAddress'] = "Bitte geben Sie eine gültige Email ein";
            }
            else
            {
                $emailFrom = $commentatorEmailAddress;
            }
        }
        elseif (empty($commentatorEmailAddress))
        {
            $sendLog['commentatorEmailAddress'] = "Bitte füllen Sie das Feld aus";
        }
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


// ======= HELPERS

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