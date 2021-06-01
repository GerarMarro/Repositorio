<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Administradores;
use App\Models\Empresas;
use App\Models\Usuarios;
use App\Models\Departamentos;
use App\Mail\RestauracionContraseña; 
use App\Mail\RestauracionContraseñaUser; 
use App\Mail\Correo; 
use App\Models\Logs; 
use App\Models\Datos;
use App\Models\CorreoMail;  
use App\Models\Database;  

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
            
            $usuario = Usuarios::where('usuario', '=', $usuario)->where('email', '=', $email)->first();

            if ($usuario == null) {
                return json_encode(1003);
            }else{
                return json_encode($usuario) ;
            }

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
            'contraseña' => 'required',
            'usuario' =>'required',
        ]);
        
        if (str_contains($request->usuario, "@")) {
            $usuario = Usuarios::where('_id', '=', $request->id)->first();

            $usuario->contraseña = $request->contraseña;
            
            Mail::to([$usuario->email])->send(new RestauracionContraseñaUser($usuario));

            $password = md5($usuario->contraseña);

            Usuarios::where('_id', '=', $request->id)
            ->first()
            ->update(['contraseña' => $password]);

            return json_encode($usuario);   
        }

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
            
            $usuario = Usuarios::where('usuario', '=', $usuario)->first();
            if ($usuario == null) {
                
                return json_encode(1003);

            }else{
                $contraseña = md5($contraseña);
                
                //Si es igual procedo a añadir campos extras
                if ($contraseña == $usuario->contraseña) {

                    //Extraigo las empresas que pertenecen al usuario
                    $empresas = $usuario->departamentos->empresa;
                    $departamento = $usuario->departamentos;
                    //A cada empresa le añado sus departamentos
                    $empresas->departamentos = $empresas->departamentos;
                    /*foreach ($empresas as $e) {
                        $e->departamentos = $e->departamentos;
                    }*/

                    //Le añado las empresas con sus dptos al usuario 
                    $usuario->empresas = $empresas;
                    //Lo retorno
                    return json_encode($usuario);

                }else{

                    return json_encode(1004);
                }
            }

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
            
            $usuario = Usuarios::where('_id', '=', $request->_id)->first();
            
            $this->ActualizoSeguridad($usuario, $request);

            $usuario->update([
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
                'admin' => $request->admin,
                'titulo' => "Modificar usuario",
                'descripcion' => "Se ha modificado a ".$usuario->nombre."."
            ]);
            return json_encode($usuario); 

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
                'titulo' => "Usuario Modificado",
                'descripcion' => "Se ha modificado a ".$admin->nombre."."
            ]);
            return json_encode($admin); 
        }   
    }

    public function ActualizoSeguridad($user, $nuevo){
        if ($nuevo->contraseña != "") {
            $newpass = md5($nuevo->contraseña);

            if ($newpass != null) {
                $user->update([
                    'contraseña' => $newpass,
                ]);
            }
        }
        
    }

    public function GetUserxID(Request $request){
        request()->validate([
            'id' => 'required',
            'usuario' => 'required'
        ]);
        
        if (str_contains($request->usuario, "@")) {
            
            $usuario = Usuarios::where('usuario', '=', $request->usuario)->first();
            $empresas = $usuario->departamentos->empresa;
            $departamento = $usuario->departamentos;
            //A cada empresa le añado sus departamentos
            $empresas->departamentos = $empresas->departamentos;
            /*foreach ($empresas as $e) {
                $e->departamentos = $e->departamentos;
            }*/

            //Le añado las empresas con sus dptos al usuario 
            $usuario->empresas = $empresas;
            //Lo retorno
            return json_encode($usuario);

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
            $departamentoI = Departamentos::where('_id', '=', $u->departamento)->first();
            $u->empresa = Empresas::where('_id', '=', $departamentoI->propietario)->first();
            $u->empresa->departamentos;
            $u->idDep = $departamentoI->_id;
            $u->departamento = Departamentos::where('_id', '=', $u->departamento)->first()->nombre;
        }

        return json_encode($usuarios);
    }

    public function GetNotificaciones($id){
        $logs = Logs::where('usuario', '=', $id)->get();
        
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

    public function SubirArchivo(Request $request){
        $datos = Datos::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion, 
            'usuario' => $request->usuario, 
            'departamento' => $request->departamento, 
            'empresa' => $request->empresa, 
            'admin' => $request->admin,
            'datos' => $request->datos,
            'tipo' => $request->tipo
        ]);

        Logs::create([
            'usuario' => $request->usuario,
            'admin' => $request->admin,
            'titulo' => "Se ha subido un archivo!",
            'descripcion' => "Buenas noticias! se ha subido el archivo ". $request->titulo." ya puedes revisarlo."
        ]);

        return json_encode($datos);
    }

    public function todosDepartamentos($id){
        $departamentos = Departamentos::where([
            'propietario' => $id,
            'tipo' => 1
        ])->get();
        
        return json_encode($departamentos);
    }

    public function LeerArchivo($id){
        $datos = Datos::where('departamento', '=', $id)->get();
        
        foreach ($datos as $d) {
            $d->dptoProp;
            $d->empresaprop;
            $d->administrador;
            $d->usuarioprop;
        }
        return json_encode($datos);
    }

    public function CrearEmpresa(Request $request){

        $empresa = Empresas::create([
            'nombre' => $request->empresa,
            'propietario' => $request->admin,
        ]);
        
        $depLect = Departamentos::create([
            'nombre' => $request->lectura, 
            'tipo' => 0, 
            'propietario' => $empresa->_id
        ]);

        $depEsc = Departamentos::create([
            'nombre' => $request->escritura, 
            'tipo' => 1,
            'propietario' => $empresa->_id
        ]);

        Logs::create([
            'usuario' => $request->admin,
            'admin' => $request->admin,
            'titulo' => "Creación de nueva organización completada sin errores",
            'descripcion' => "Se ha creado la organización ".$empresa->nombre."."
        ]);

        return response("La empresa ".$empresa->nombre." fue creada con los departamentos ".$depLect->nombre." y ".$depEsc->nombre, 200);
    }

    public function EmpresasxAdmin($id){
        $empresas = Empresas::where('propietario', '=', $id)->get();
        foreach ($empresas as $e) {
            $e->departamentos = $e->departamentos;
        }
        return response(json_encode($empresas), 200);
    }

    public function CrearDepartamentos(Request $request){
        $depEsc = Departamentos::create([
            'nombre' => $request->nombre, 
            'tipo' => 1,
            'propietario' => $request->empresa
        ]);

        $empresa = Empresas::where('_id', '=', $request->empresa)->first()->nombre;
        
        Logs::create([
            'usuario' => $request->admin,
            'admin' => $request->admin,
            'titulo' => "Creación de nuevo departamento",
            'descripcion' => "Se ha creado el nuevo departamento ".$depEsc->nombre." para la empresa ".$empresa
        ]);
        return response($depEsc, 200);
    }

    public function AllUsers($id){
        $admin = Administradores::where('_id', '=', $id)->first();
        if ($admin == null) {
            return response("No hay usuarios", 404);
        }else{
            $usuarios = $admin->usuarios;
            $respuesta = [];
            $adminis = [
                'id' => $admin->_id,
                'usuario' => $admin->usuario,
                'correo' => $admin->email,
                'admin' => true
            ];
            array_push($respuesta, $adminis);
            foreach ($usuarios as $u) {
                $usuario = [
                    'id' => $u->_id,
                    'usuario' => $u->usuario,
                    'correo' => $u->email,
                    'admin' => false
                ];
                array_push($respuesta, $usuario);
            }
            return response($respuesta, 200);
        }
    }
    
    public function EnviarCorreo(Request $request){
        $usuario = Administradores::where('_id', '=', $request->de)->first();
        if ($usuario == null) {
            $usuario = Usuarios::where('_id', '=', $request->de)->first();
        }
        //return $request;
        if ($request->cc == null && $request->cco == null) {
            Mail::to([$request->para])
                ->send(new Correo($request->mensaje, $usuario->usuario, $request->asunto));
        }else if ($request->cc != null && $request->cco == null) {
            Mail::to([$request->para])
              ->cc($request->cc)
              ->send(new Correo($request->mensaje, $usuario->usuario, $request->asunto));
        }else if ($request->cc == null && $request->cco != null) {
            Mail::to([$request->para])
              ->bcc($request->cco)
              ->send(new Correo($request->mensaje, $usuario->usuario, $request->asunto));
        }else{
            Mail::to([$request->para])
                  ->cc($request->cc)
                  ->bcc($request->cco)
                  ->send(new Correo($request->mensaje, $usuario->usuario, $request->asunto));
        }
        
        return $request;
    }
    
    public function ModificarObj(Request $request){
        $tipo = $request->tipo;
        $nombre = "";
        if ($tipo=="o") {
            $empresa = Empresas::where('_id', '=', $request->id)->first();
            $nombre =  $empresa->nombre;
            $empresa->nombre = $request->nombre;
            $empresa->save();
            Logs::create([
                'usuario' => $request->usuario,
                'admin' => $request->usuario,
                'titulo' => "Se ha modificado la organización " . $nombre,
                'descripcion' => "Se ha modificado la organización de ".$nombre." a ".$empresa->nombre."."
            ]);
        }else{
            $departamento = Departamentos::where('_id', '=', $request->id)->first();
            $nombre = $departamento->nombre;
            $departamento->nombre = $request->nombre;
            $departamento->save();
            Logs::create([
                'usuario' => $request->usuario,
                'admin' => $request->usuario,
                'titulo' => "Se ha modificado el departamento " . $nombre,
                'descripcion' => "Se ha modificado el departamento de ".$nombre." a ".$request->nombre."."
            ]);
        }
    }

    public function EliminarObj(Request $request, $id){
        $tipo = $request->tipo;
        if ($tipo=="o") {
            $organizacion = Empresas::where('_id', '=', $id)->first();
            $nombre = $organizacion->nombre;
            $departamentos = $organizacion->departamentos;
            foreach ($departamentos as $d) {
                $usuarios = $d->usuarios;
                foreach ($usuarios as $u) {
                    $u->delete();
                }
                $d->delete();
            }
            $organizacion->delete();
            Logs::create([
                'usuario' => $request->usuario,
                'admin' => $request->usuario,
                'titulo' => "Se ha eliminado la organización " . $nombre,
                'descripcion' => "Se ha eliminado la organización ".$nombre." Correctamente."
            ]);
            return response("Eliminado", 200);
        }else{
            $departamento = Departamentos::where('_id', '=', $id)->first();
            $nombre = $departamento->nombre;
            $usuarios = $departamento->usuarios;
            foreach ($usuarios as $u) {
                $u->delete();
            }
            $departamento->delete();
            Logs::create([
                'usuario' => $request->usuario,
                'admin' => $request->usuario,
                'titulo' => "Se ha eliminado el departamento " . $nombre,
                'descripcion' => "Se ha eliminado el departamento ".$nombre." Correctamente."
            ]);
            return response("Eliminado", 200);
        }
            
    }

    public function createDB($id){
        //return $request->nombre;
        $comando = "mongodump --db emergentes --out C:/mongodump/".$id;
        shell_exec($comando);
        Database::create([
            'nombre' => $id
        ]);
        return response($id, 200);
    }

    public function getDb(){
        $retauracion = Database::get();
        return response($retauracion, 200);
    }

    public function restoreDB($ruta){
        $comando =  "mongorestore --drop -d emergentes C:/mongodump/".$ruta."/emergentes";
        //$comando = "mongorestore --db emergentes C:/mongodump/".$ruta."/emergentes";
        shell_exec($comando);
        return response("Hecho", 200);
    }
}

