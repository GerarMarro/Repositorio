import axios from 'axios';
import {
    registrar, getPregunta, 
    updPass, authUser, 
    upduser, getuser, 
    reguser, getuseradmin, 
    deluser, getnotificaciones,
    subirarchivo, leerarchivo,
    todosdepartamentos, crearempresa,
    empresasxadmin, creardepartamento,
    organizacion, allusers,
    datos, actualizardatos,
    correo, modificarnom,
    moddependencies, eliminarobj,
    createdb,restoredb, getdb
} from './rutas';

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
        escritura: datos.escritura,
    })
}

function GetPregunta(datos) {

    return axios.get(getPregunta, {
        params: {
            usuario: datos.usuario,
            email: datos.email,
        }
    })
}

function ActualizarContra(datos, hora) {
    return axios.put(updPass, {
        id: datos.id,
        contraseña: hora,
        usuario: datos.usuario
    })
}

function Ingresar(user, contraseña) {
    return axios.get(authUser, {
        params: {
            usuario: user,
            contraseña: contraseña,
        }
    });
}

function ActualizarUsuario(datos) {
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
        params: {
            id: id,
            usuario: user
        }
    });
}

function RegUser(datos) {

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
    });
}

function GetUserAdmin(id) {
    return axios.get(getuseradmin, {
        params: {
            id: id
        }
    });
}

function DelUser(id, admin) {

    return axios.delete(deluser + id, {
        data: {
            admin: admin
        }
    });
}

function GetNotificaciones(id) {
    return axios.get(getnotificaciones + id);
}

function GuardarDatos(datos) {
    return axios.post(subirarchivo, {
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        empresa: datos.empresa,
        departamento: datos.departamento,
        admin: datos.admin,
        usuario: datos.usuario,
        datos: datos.datos,

    })
}

function leerArchivo(departamento) {
    return axios.get(leerarchivo + departamento);
}

function todosDepartamentos(empresa) {
    return axios.get(todosdepartamentos + empresa);
}

function crearEmpresa(datos) {
    return axios.post(crearempresa, {
        empresa: datos.empresa,
        lectura: datos.lectura,
        escritura: datos.escritura,
        admin: datos.admin
    });
}

function empresasxAdmin(id) {
    return axios.get(empresasxadmin + id);
}

function crearDepartamento(datos) {
    return axios.post(creardepartamento, {
        nombre: datos.nombre,
        empresa: datos.empresa,
        admin: datos.admin

    });
}

function Organizacion(id) {
    return axios.get(organizacion + id);
}

function AllUsers(id) {
    return axios.get(allusers + id);
}

function TodosDatos(id, departamento) {
    return axios.get(datos+id+"/"+departamento);
}

function sobreDatos(datos) {
    return axios.get(actualizardatos, {
        params:{
            id: datos.id,
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            datos: datos.datos,
            tipo: datos.tipo,
            usuario: datos.usuario,
            admin: datos.admin
        }
    });
}

function EnviarCorreo(datos) {
    return axios.get(correo, {
        params:{
            de: datos.de,
            para: datos.para,
            cc: datos.cc,
            cco: datos.cco,
            asunto: datos.asunto,
            mensaje: datos.mensaje
        }
    });
}

function ModificarOrgDep(datos) {
    return axios.put(modificarnom, {
        nombre: datos.nombre,
        tipo: datos.tipo,
        id: datos.id,
        usuario: datos.usuario
    });
}

function ModDependencias(datos) {
    return axios.put(moddependencies, {
        nombreuser: datos.nombre,
        idnewdep: datos.departamento,
        empresa: datos.isempresa,
        id: datos.id,
        admin: localStorage.getItem("id"),
        oldemp: datos.oldemp,
        olddep: datos.olddep,
        newemp: datos.newemp,
        newdep: datos.newdep
    });
}

function EliminarObjeto(tipo, id) {
    return axios.put(eliminarobj+ id, {
        tipo: tipo,
        usuario: localStorage.getItem("id")
    });
}

function crearBackup(nombre) {
    return axios.get(createdb+nombre);
}

function restaurarBK(ruta) {
    return axios.get(restoredb + ruta);
}

function getDbs() {
    return axios.get(getdb);
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
    GetNotificaciones,
    GuardarDatos,
    leerArchivo,
    todosDepartamentos,
    crearEmpresa,
    empresasxAdmin,
    crearDepartamento,
    Organizacion,
    AllUsers,
    TodosDatos,
    sobreDatos,
    EnviarCorreo,
    ModificarOrgDep,
    ModDependencias,
    EliminarObjeto,
    crearBackup,
    restaurarBK,
    getDbs
};