<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Administradores;
use App\Models\Empresas;

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
    
    /*
    public function empresas(){
        return $this->hasMany(Empresas::class);
    }
    */
}
