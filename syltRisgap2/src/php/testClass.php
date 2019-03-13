<?php

interface Meowing
{
    public function meow();
}

class LolkatMeow implements Meowing
{
    public function meow()
    {
        return 'lolz xD'; 
    }
} 
 
class Cat
{
    protected $_meowing; 
	 
    public function setMeowing(Meowing $meowing)
    {
        $this->_meowing = $meowing;
    }

    public function meow()
    {
        $this->_meowing->meow();
    }
}

?>
