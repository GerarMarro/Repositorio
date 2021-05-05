<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Departamentos;
use App\Models\Usuarios;
use App\Models\Administradores;

class Empresas extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'EMPRESA';

    protected $fillable = [
        'nombre', 'propietario'
    ];

    
    public function departamentos(){
        return $this->hasMany(Departamentos::class, 'propietario', '_id');
    }

    public function administrador(){
        return $this->hasOne(Administradores::class, '_id', 'propietario');
    }
}
