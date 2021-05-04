<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuarios;
use App\Models\Departamentos;
use App\Models\Logs;

class UsuariosController extends Controller
{
    public function Registrar(Request $request){
        request()->validate([
            'admin' => 'required',
            'tipo' => 'required'
        ]);
        $usuario = Usuarios::where('usuario', '=', $request->usuario)->first();
        
        if ($usuario == null) {
            $contraseña = md5($request->contraseña);
            //return ($request);
            
            
           $usuario = Usuarios::create([
                'foto' => $request->foto,
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
            Logs::create([
                'usuario' => $usuario->_id,
                'admin' => $request->admin,
                'titulo' => "Registro de usuario nuevo",
                'descripcion' => "Se ha registrado a ".$request->nombre." como nuevo usuario en la base de datos."
            ]);
            return json_encode($usuario);

        }else{
            return "No hay";
        }

    }

    public function EliminarUser(Request $request, $id){
        $usuario = Usuarios::where('_id', '=', $id)->first();
        Logs::create([
            'usuario' => $usuario->_id,
            'admin' => $request->admin,
            'titulo' => "Eliminación de usuario.",
            'descripcion' => "Se ha eliminado a ".$usuario->nombre."."
        ]);
        $usuario->delete();
        return json_encode($usuario);
    }

}
