<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorreoMail extends Model
{
    private $de;
    private $para;
    private $cc;
    private $cco;
    private $asunto;
    private $mensaje;
    
    public function __construct($de, $para, $cc, $cco, $asunto, $mensaje)
    {
      $this->de = $de;
      $this->para = $para;
      $this->cc = $cc;
      $this->cco = $cco;
      $this->asunto = $asunto;
      $this->mensaje = $mensaje;
    }

    public function getDe()
    {
      return $this->de;
    }
   
    public function getPara()
    {
      return $this->para;
    }
   
    public function getCC()
    {
      return $this->cc;
    }
    public function getCCO()
    {
      return $this->cco;
    }
   
    public function getAsunto()
    {
      return $this->asunto;
    }
   
    public function getMensaje()
    {
      return $this->mensaje;
    }
}
