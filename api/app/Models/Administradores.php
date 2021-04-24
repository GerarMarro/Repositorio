<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Empresas;

class Administradores extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'ADMINISTRADORES';

    protected $fillable = [
        'nombre', 'apellido','usuario','foto', 'email', 'contraseña', 'pregunta', 'respuesta'
    ];

    public function empresas(){
        return $this->hasMany(Empresas::class, 'propietario', '_id');
    }

    public function usuarios(){
        return $this->hasMany(Usuarios::class, 'admin', '_id');
    }
}
