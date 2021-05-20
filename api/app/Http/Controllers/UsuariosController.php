<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuarios;
use App\Models\Departamentos;
use App\Models\Logs;
use App\Models\Empresas;
use App\Models\Datos;
use App\Models\Administradores;

class UsuariosController extends Controller
{

    public function Registrar(Request $request){
        request()->validate([
            'admin' => 'required',
            'tipo' => 'required'
        ]);
        $usuario = Usuarios::where('usuario', '=', $request->usuario)->first();
        
        if ($usuario == null) {
            $usuario = Usuarios::where('email', '=', $request->email)->first();
            if ($usuario == null) {
                $usuario = Administradores::where('email', '=', $request->email)->first();
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
                    return 2;
                }
            }else{
                return 2;
            }
        }else{
            return 1;
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

    public function TodaOrganizacion($id){
        $empresas = Empresas::where('propietario', '=', $id)->get();

        foreach ($empresas as $e) {
            $departamentos = $e->departamentos;
            
            foreach ($departamentos as $d) {
                $d->usuarios;
            }
        }
        return response(json_encode($empresas), 200);
    }   

    public function ObtenerDatos($id){
        if ($this->IsAdmin($id)) {
            $datos = Datos::where('admin', '=', $id)->get();  
        }else{
            $datos = Datos::where('usuario', '=', $id)->get();
        }
        foreach ($datos as $d) {

            $d->creado = date_format($d->created_at, "d/m/Y");
            $d->actualizado = date_format($d->updated_at, "d/m/Y");

            if ($d->tipo == "csv") {
                $d->tipoA = "CSV";
            }else if ($d->tipo == "xlsx") {
                $d->tipoA = "Excel";
            }
        }
        return response( $datos, 200);
    }

    public function IsAdmin($id){
        $usuario = Usuarios::where('_id', '=', $id)->first();
        if ($usuario == null) {
            return true;
        }else{
            return false;
        }
    }

    public function ActualizarDatos(Request $request){
        $datosA = Datos::where('_id', '=', $request->id)->first();
        $datosA->update([
            "titulo" => $request->titulo,
            "descripcion" => $request->descripcion,
            "datos" => $request->datos,
            "tipo" => $request->tipo,
        ]);
        return response($datosA, 200);
    }
    
}
