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
    deluser
};