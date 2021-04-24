<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuarios;

class UsuariosController extends Controller
{
    public function Registrar(Request $request){
        
        $usuario = Usuarios::where('usuario', '=', $request->usuario)->first();
        if ($usuario == null) {
            $contraseña = md5($request->contraseña);
            //return ($request);
            return Usuarios::create([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'usuario' => $request->usuario,
                'email' => $request->email,
                'contraseña' => $contraseña,
                'pregunta' => $request->pregunta,
                'respuesta' => $request->respuesta,
                'departamento' => $request->departamento,
                'tipo' => $request->tipo,
                'admin' => $request->admin
            ]);

        }else{
            return "No hay";
        }

    }

}
