<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Administradores;
use App\Models\Empresas;
use App\Models\Usuaios;
use App\Models\Departamentos;
use App\Mail\RestauracionContraseña; 
use App\Models\Logs; 

class AdministradoresController extends Controller
{
    public function Registrar(Request $request){

        //Primero valido que el nombre de usuario no exista
        $admin = Administradores::where('usuario', '=', $request->usuario)->first();
        
        // Si no existe procedo a validar la empresa
        if($admin == null){

            //Valido que la empresa exista
            $empresaExis = Empresas::where('nombre', '=', $request->empresa)->first();

            //Sino procedo a registrar los datos
            /** En este caso como es la primera vez que se registrará un usuario
             * no hay necesidad de validar que los departamentos existan porque son
             * los primeros 2 que existirán en el repositorio.
             */

            if ($empresaExis == null) {
                
                request()->validate([
                    'nombre' => 'required',
                    'apellido' => 'required',
                    'usuario' => 'required',
                    'email' => 'required',
                    'contraseña' => 'required',
                    'pregunta' => 'required',
                    'respuesta' => 'required',
                    'empresa' => 'required',
                    'lectura' => 'required',
                    'escritura' => 'required',
                ]);
        
                $password = md5($request->contraseña);
                $request->contraseña = $password;
                if($request->foto == null){

                    Administradores::create([
                        'foto'=> 0,
                        'nombre' => $request->nombre,
                        'apellido' => $request->apellido,
                        'usuario' => $request->usuario,
                        'email' => $request->email,
                        'contraseña' => $password,
                        'pregunta' => $request->pregunta,
                        'respuesta' => $request->respuesta,
                        'tipoUsuario' => 1
                    ]);
                }else{
                    Administradores::create([
                        'foto' => $request->foto,
                        'nombre' => $request->nombre,
                        'apellido' => $request->apellido,
                        'usuario' => $request->usuario,
                        'email' => $request->email,
                        'contraseña' => $password,
                        'pregunta' => $request->pregunta,
                        'respuesta' => $request->respuesta,
                        'tipoUsuario' => 1
                    ]);
                }

                $usuario = Administradores::all()->last();
                Logs::create([
                    'usuario' => $usuario->_id,
                    'admin' => $usuario->_id,
                    'titulo' => "Registro de administrador nuevo",
                    'descripcion' => "Se ha registrado a ".$request->nombre." como nuevo adminsitrador en la base de datos."
                ]);
                
                Empresas::create([
                    'nombre' => $request->empresa,
                    'propietario' => $usuario->_id,
                ]);
                
                $empresa = Empresas::all()->last();
        
                Departamentos::create([
                    'nombre' => $request->lectura, 
                    'tipo' => 0, 
                    'propietario' => $empresa->_id
                ]);
        
                return Departamentos::create([
                    'nombre' => $request->escritura, 
                    'tipo' => 1,
                    'propietario' => $empresa->_id
                ]);

            }else{
                return json_encode(1002);
            }
            
        }else{
            return json_encode(1001);
        }
        
    }
    
    public function GetxUser(Request $request){

        request()->validate([
            'usuario' => 'required',
            'email' => 'required'
        ]);

        $usuario = $request->usuario;
        $email = $request->email;
        
        //Valida si el usuario pertenece a una empresa o es administrador

        if(str_contains($usuario, "@")){
            return json_encode("Esta @");
        }else{
            //Si es administrador retorna el administrador encontrado

            $admin = Administradores::where('usuario', '=', $usuario)->where('email', '=', $email)->first();

            if ($admin == null) {
                return json_encode(1003);
            }else{
                return json_encode($admin) ;
            }
            
        }
    }

    public function updatePassword(Request $request){
        
        request()->validate([
            'id' => 'required',
            'contraseña' => 'required'
        ]);
        
        //Busca el usuario que posee el id enviado

        $usuario = Administradores::where('_id', '=', $request->id)->first();
        
        //Cambia la contraseña para poder enviar el correo
        $usuario->contraseña = $request->contraseña;
        
        //Envío el correo con la nueva contraseña
        Mail::to([$usuario->email])->send(new RestauracionContraseña($usuario));
        
        //Codifico la contraseña a nivel md5
        $password = md5($usuario->contraseña);
        
        //Guardo la contraseña codificada
        Administradores::where('_id', '=', $request->id)
        ->first()
        ->update(['contraseña' => $password]);
        
        //Extraigo el nuevo usuario con la contraseña modificada
        $usuario = Administradores::where('_id', '=', $request->id)->first();
        Logs::create([
            'usuario' => $usuario->_id,
            'admin' => $usuario->_id,
            'titulo' => "Modificación de contraseña",
            'descripcion' => "Se ha modificado la contraseña de ".$usuario->nombre."."
        ]);
        //Lo retorno
        return json_encode($usuario);
    }
    
    public function Login(Request $request){

        request()->validate([
            'usuario' => 'required',
            'contraseña' => 'required'
        ]);

        $usuario = $request->usuario;
        $contraseña = $request->contraseña;
        
        //Valido si pertenece a una empresa o es admin
        if (str_contains($usuario, "@")) {
            
            return json_encode("Esta @");

        }else{

            //Estraigo el admin seleccionado
            $admin = Administradores::where('usuario', '=', $usuario)->first();
            
            //Verifico si el nombre de usuario existe
            if ($admin == null) {
                
                return json_encode(1003);

            }else{
                
                //Codifico la contraseña para compararla con la base de datos
                $contraseña = md5($contraseña);
                
                //Si es igual procedo a añadir campos extras
                if ($contraseña == $admin->contraseña) {

                    //Extraigo las empresas que pertenecen al usuario
                    $empresas = $admin->empresas;

                    //A cada empresa le añado sus departamentos
                    foreach ($empresas as $e) {
                        $e->departamentos = $e->departamentos;
                    }

                    //Le añado las empresas con sus dptos al usuario 
                    $admin->empresas = $empresas;
                    //Lo retorno
                    return json_encode($admin);

                }else{

                    return json_encode(1004);
                }

            }
        }

    }

    public function updateUsuario(Request $request){
        
        //Valido los campos
        request()->validate([
            '_id' => 'required',
        ]);

        if (str_contains($request->usuario, "@")) {
            
            return json_encode("Tiene @");

        }else{
            $admin = Administradores::where('_id', '=', $request->_id)->first();
            
            $this->ActualizoSeguridad($admin, $request);

            $admin->update([
                'foto' => $request->foto,
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'usuario' => $request->usuario,
                'email' => $request->email,
                'pregunta' => $request->pregunta,
                'respuesta' => $request->respuesta,
            ]);    
            Logs::create([
                'usuario' => $request->_id,
                'admin' => $request->_id,
                'titulo' => "Modificar usuario",
                'descripcion' => "Se ha modificado a ".$admin->nombre."."
            ]);
            return json_encode($admin); 
        }   
    }

    public function ActualizoSeguridad($user, $nuevo){
        
        $newpass = md5($nuevo->contraseña);

        if ($newpass != null) {
            $user->update([
                'contraseña' => $newpass,
            ]);
        }
    }

    public function GetUserxID(Request $request){
        request()->validate([
            'id' => 'required',
            'usuario' => 'required'
        ]);
        
        if (str_contains($request->usuario, "@")) {
            //$admin = Administradores::whre('_id', '=', $request->id)->first();
        }else{
            $admin = Administradores::where('_id', '=', $request->id)->first();
            $empresas = $admin->empresas;
            foreach ($empresas as $e) {
                $e->departamentos = $e->departamentos;
            }
            $admin->empresas = $empresas;
            return json_encode($admin);
        }
        
    }

    public function GetUsersxAdmin(Request $request){
        $admin = Administradores::where('_id', '=', $request->id)->first();
        $usuarios = $admin->usuarios;

        foreach ($usuarios as $u) {
            $u->departamento = Departamentos::where('_id', '=', $u->departamento)->first()->nombre;
        }

        return json_encode($usuarios);
    }

    public function GetNotificaciones($id){
        $logs = Logs::where('admin', '=', $id)->get();
        
        foreach ($logs as $l) {
            if ($l->usuarioRegistrado != null) {
                $l->esusuario = true;
            }else{
                $l->esusuario = false;
                $l->administrador = Administradores::where('_id', '=', $id)->first();
            }
        }
        
        return json_encode($logs);
    }
}

