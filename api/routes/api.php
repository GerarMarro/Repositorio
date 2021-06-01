<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//use App\Http\Controllers\AdministradoresController;
use App\Models\Administradores;


Route::post('registrar', 'App\Http\Controllers\AdministradoresController@Registrar');
Route::get('getpwd', 'App\Http\Controllers\AdministradoresController@GetxUser');
Route::put('updpwd', 'App\Http\Controllers\AdministradoresController@updatePassword');
Route::get('authuser', 'App\Http\Controllers\AdministradoresController@Login');
Route::get('empuser', 'App\Http\Controllers\AdministradoresController@EmpresasUsuario');
Route::put('upduser', 'App\Http\Controllers\AdministradoresController@updateUsuario');
Route::get('getuser', 'App\Http\Controllers\AdministradoresController@GetUserxID');
Route::post('reguser', 'App\Http\Controllers\UsuariosController@Registrar');
Route::get('getuseradmin', 'App\Http\Controllers\AdministradoresController@GetUsersxAdmin');
Route::delete('deluser/{id}', 'App\Http\Controllers\UsuariosController@EliminarUser');
Route::get('getnotificaciones/{id}', 'App\Http\Controllers\AdministradoresController@GetNotificaciones');
Route::post('subirarchivo', 'App\Http\Controllers\AdministradoresController@SubirArchivo');
Route::get('leerarchivo/{id}', 'App\Http\Controllers\AdministradoresController@LeerArchivo');
Route::get('todosdepartamentos/{id}', 'App\Http\Controllers\AdministradoresController@todosDepartamentos');
Route::post('crearempresa', 'App\Http\Controllers\AdministradoresController@CrearEmpresa');
Route::get('empresasxadmin/{id}', 'App\Http\Controllers\AdministradoresController@EmpresasxAdmin');
Route::post('creardepartamento', 'App\Http\Controllers\AdministradoresController@CrearDepartamentos');
Route::get('organizacion/{id}', 'App\Http\Controllers\UsuariosController@TodaOrganizacion');
Route::get('allusers/{id}', 'App\Http\Controllers\AdministradoresController@AllUsers');
Route::get('allempresas', 'App\Http\Controllers\AdministradoresController@AllEmpresas');
Route::get('datos/{id}/{departamento}', 'App\Http\Controllers\UsuariosController@ObtenerDatos');
Route::get('actualizardatos', 'App\Http\Controllers\UsuariosController@ActualizarDatos');
Route::get('correo', 'App\Http\Controllers\AdministradoresController@EnviarCorreo');
Route::put('modificarnom', 'App\Http\Controllers\AdministradoresController@ModificarObj');
Route::put('moddependencies', 'App\Http\Controllers\UsuariosController@ActualizarDependencias');
Route::put('eliminarobj/{id}', 'App\Http\Controllers\AdministradoresController@EliminarObj');
Route::get('createdb/{id}', 'App\Http\Controllers\AdministradoresController@createDB');
Route::get('getdb', 'App\Http\Controllers\AdministradoresController@getDb');
Route::get('restoredb/{ruta}', 'App\Http\Controllers\AdministradoresController@restoreDB');