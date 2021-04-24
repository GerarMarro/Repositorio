<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Departamentos extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'DEPARTAMENTOS';

    protected $fillable = [
        'nombre', 'tipo', 'propietario'
    ];
    
    /*
    public function empresas(){
        return $this->hasMany(Empresas::class);
    }
    */
}
