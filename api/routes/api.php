<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//use App\Http\Controllers\AdministradoresController;
use App\Models\Administradores;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

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