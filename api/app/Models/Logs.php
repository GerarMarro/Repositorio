<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Empresas;
use App\Models\Usuarios;

class Logs extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'LOGS';

    protected $fillable = [
        'usuario', 'titulo', 'descripcion', 'admin'
    ];

    public function usuarioRegistrado(){
        return $this->hasOne(Usuarios::class, '_id', 'usuario');
    }
}
