import axios from 'axios';
import {registrar, getPregunta, 
        updPass, authUser, 
        upduser, getuser, 
        reguser, getuseradmin, 
        deluser, getnotificaciones} from './rutas';

function Registrar(datos) {
    return axios.post(registrar, {
        foto: datos.foto,
        nombre: datos.nombre,
        apellido: datos.apellido,
        usuario: datos.usuario,
        contraseña: datos.contraseña,
        email: datos.email,
        pregunta: datos.pregunta,
        respuesta: datos.respuesta,
        empresa: datos.empresa,
        lectura: datos.lectura,
        escritura: datos.escritura
    } )
}

function GetPregunta(datos) {
    
    return axios.get(getPregunta, {
        params:{
            usuario: datos.usuario,
            email: datos.email,
        }
    })
}

function ActualizarContra(datos, hora) {
    return axios.put(updPass, {
        id: datos.id,
        contraseña: hora
    })
}
function Ingresar(user, contraseña) {
    return axios.get(authUser, {
            params:{
                usuario: user,
                contraseña: contraseña,
            }
        } );
}

function ActualizarUsuario(datos){
    return axios.put(upduser, {
        _id: datos._id,
        foto: datos.foto,
        nombre: datos.nombre,
        apellido: datos.apellido,
        usuario: datos.usuario,
        contraseña: datos.contraseña,
        email: datos.email,
        pregunta: datos.pregunta,
        respuesta: datos.respuesta
    });
}

function GetUser(id, user) {
    return axios.get(getuser, {
        params:{
            id: id,
            usuario: user
        }
    });
}

function RegUser(datos){
    console.log("Reguser", datos)
    
    return axios.post(reguser, {
            foto: datos.foto,
            admin: datos.admin,
            nombre: datos.nombre,
            apellido: datos.apellido,
            usuario: datos.usuario,
            contraseña: datos.contraseña,
            email: datos.email,
            pregunta: datos.pregunta,
            respuesta: datos.respuesta,
            departamento: datos.departamento,
            tipo: datos.tipo
        }
    );
}

function GetUserAdmin(id) {
    return axios.get(getuseradmin, {
        params:{
            id: id
        }
    });
}

function DelUser(id, admin) {
    
    return axios.delete(deluser + id, {
        data:{
            admin: admin
        }
    });
}

function GetNotificaciones(id) {
    return axios.get(getnotificaciones+id);
}

export {
    Registrar, 
    GetPregunta, 
    ActualizarContra, 
    Ingresar, 
    ActualizarUsuario, 
    GetUser, 
    RegUser,
    GetUserAdmin,
    DelUser,
    GetNotificaciones
};