<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Datos extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'DATOS';

    protected $fillable = [
        'titulo', 'descripcion', 'usuario', 'departamento', 'empresa', 'admin', 'datos', 'tipo'
    ];

}
