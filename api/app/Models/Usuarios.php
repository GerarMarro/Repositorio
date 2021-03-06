<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Administradores;
use App\Models\Departamentos;

class Usuarios extends Eloquent
{

    protected $connection = 'mongodb';
	protected $collection = 'USUARIOS';

    protected $fillable = [
        'nombre', 
        'apellido',
        'usuario',
        'foto', 
        'email', 
        'contraseña', 
        'pregunta',
        'respuesta', 
        'admin', 
        'departamento',
        'tipo',
        'logins'
    ];

    public function administrador(){
        return $this->hasOne(Administradores::class, 'admin', '_id');
    }

    public function departamentos(){
        return $this->hasOne(Departamentos::class, '_id', 'departamento');
    }
}
