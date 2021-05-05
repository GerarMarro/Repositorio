<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Departamentos;
use App\Models\Empresas;
use App\Models\Administradores;
use App\Models\Usuarios;

class Datos extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'DATOS';

    protected $fillable = [
        'titulo', 'descripcion', 'usuario', 'departamento', 'empresa', 'admin', 'datos', 'tipo'
    ];

    public function dptoProp(){
        return $this->hasOne(Departamentos::class, '_id', 'departamento');
    }

    public function empresaprop(){
        return $this->hasOne(Empresas::class, '_id', 'empresa');
    }

    public function administrador(){
        return $this->hasOne(Administradores::class, '_id', 'admin');
    }

    public function usuarioprop(){
        return $this->hasOne(Administradores::class, '_id', 'usuario');
    }
}
