<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Administradores;

class RestauracionContraseña extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    
    /**
     * Create a new message instance.
     * @return void
     */

    public function __construct(Administradores $admin)
    {
        $this->user = $admin;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mails.respass');
    }
}
