<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\CorreoMail as Mail;

class Correo extends Mailable
{
    use Queueable, SerializesModels;

    public $mensaje;
    public $de;
    public $asunto;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($mensaje, $de, $asunto)
    {
        $this->mensaje = $mensaje;
        $this->de = $de;
        $this->asunto = $asunto;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mails.correo');
    }
}
