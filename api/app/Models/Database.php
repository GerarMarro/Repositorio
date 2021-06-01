<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Database extends Eloquent
{
    protected $connection = 'mongodb';
	protected $collection = 'DATABASE';

    protected $fillable = [
        'nombre'
    ];

}
