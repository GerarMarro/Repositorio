<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Empresas;

class Logs extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'LOGS';

    protected $fillable = [
        'usuario', 'titulo', 'descripcion'
    ];
}
