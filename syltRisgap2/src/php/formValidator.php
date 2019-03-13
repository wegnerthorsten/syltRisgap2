<?php

class Validator {

    // set of rules for validator
    // syntax: <field-name> => '<list-of-rules, joined-with-pipe>',
    protected $rules = [
        'first-name' => 'required',
        'last-name' => 'required',
        'email' => 'required|email',
		'phone' => 'required|numeric'
    ];

    // message to show if concrete field-rule failed
    // ":field" will be replaced with field actual name
    protected $messages = [
        'required' => 'Das Feld darf nicht leer sein.',
        'nonzero' => 'Feld darf nicht 0 sein.',
        'email' => 'Es ist keine ungültige Email Adresse.',
        'phone' => 'Keine gültige Telefonnr.',
    ]; 

    protected $errors;

    // call this to validate provided $input
    function validate($input) {
	
        $errors = [];

        // for each defined field-ruleset
        foreach ($this->rules as $field => $rules) {
            $rules = explode('|', $rules);
            // for each rule
            foreach ($rules as $rule)
			{
                // call function with name "checkNameofrule". Example: checkMail or checkRequired
                if (!$this->{"check" . ucfirst($rule)}($input, $field))
				{
					if(!array_key_exists($field ,$errors))
					{
						// memorize error, if any
						$errors[$field][] = $this->error($field, $field);
					}
				}
			}
        }

        // validation passed if there are no errors
        return !($this->errors = $errors);
    }

    function errors() {
        return $this->errors;
    }

    function error($field, $error) {
        return str_replace(':field', $field, $this->messages[$field]);
    }

    // check for required fields
    function checkRequired($input, $field) {
        if (!isset($input[$field]))
            return false;

        return trim(htmlspecialchars(stripslashes($input[$field]))) != '';
    }

    // check for valid email
    function checkEmail($input, $field) {
        return !!preg_match('#.+@[^.]+\..+#', @$input[$field]);
    }

    // other custom checks
    function checkNonzero($input, $field) {
        return intval(@$input[$field]) != 0;
    }

	function checkNumeric($input, $field){
		if(is_numeric($input[$field]))
			return true;

		return false;
	}
}

?>