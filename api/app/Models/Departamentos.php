<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Administradores;
use App\Models\Empresas;
use App\Models\Usuarios;

class Departamentos extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'DEPARTAMENTOS';
    
    protected $fillable = [
        'nombre', 'tipo', 'propietario'
    ];
    
    public function empresa(){
        return $this->hasOne(Empresas::class, '_id', 'propietario');
    }
    
    public function usuarios(){
        return $this->hasMany(Usuarios::class, 'departamento', '_id');
    }
}
