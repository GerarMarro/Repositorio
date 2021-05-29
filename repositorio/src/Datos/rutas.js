var ApiRoot = "http://localhost:4343/ProyectoEmergentes/api/public/api/";
var registrar = ApiRoot + "registrar";
var getPregunta = ApiRoot + "getpwd";
var updPass = ApiRoot + "updpwd";
var authUser = ApiRoot + "authuser";
var upduser = ApiRoot + "upduser";
var getuser = ApiRoot + "getuser";
var reguser = ApiRoot + "reguser";
var getuseradmin = ApiRoot + "getuseradmin";
var deluser = ApiRoot + "deluser/";
var getnotificaciones = ApiRoot + "getnotificaciones/";
var subirarchivo = ApiRoot + "subirarchivo";
var leerarchivo = ApiRoot + "leerarchivo/";
var todosdepartamentos = ApiRoot + "todosdepartamentos/";
var crearempresa = ApiRoot + "crearempresa";
var empresasxadmin = ApiRoot + "empresasxadmin/";
var creardepartamento = ApiRoot + "creardepartamento";
var organizacion = ApiRoot + "organizacion/";
var allusers = ApiRoot + "allusers/";
var datos = ApiRoot + "datos/";
var actualizardatos = ApiRoot + "actualizardatos";
var correo = ApiRoot + "correo";
var modificarnom = ApiRoot + "modificarnom";
var moddependencies = ApiRoot + "moddependencies";
var eliminarobj = ApiRoot + "eliminarobj/";

export default ApiRoot;
export {
    registrar, 
    getPregunta,
    updPass,
    authUser,
    upduser,
    getuser,
    reguser,
    getuseradmin,
    deluser,
    getnotificaciones,
    subirarchivo,
    leerarchivo,
    todosdepartamentos,
    crearempresa,
    empresasxadmin,
    creardepartamento,
    organizacion,
    allusers,
    datos,
    actualizardatos,
    correo,
    modificarnom,
    moddependencies,
    eliminarobj
};