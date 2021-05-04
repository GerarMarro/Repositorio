import React from 'react';
import { Descriptions, Avatar, Typography } from 'antd';
import { coloresRandom } from "../Funciones";

const {Text} = Typography;
class UserInfo extends React.Component {
    usuario = this.props.usuario;
    
    render(){
       
        return (
            <>
            
                <div style={{width:"100%", textAlign:"center"}}>
                    { this.usuario.foto === 0 ? 
                        <Avatar style={{ backgroundColor: coloresRandom(), verticalAlign: 'middle' }} size={190}>
                            <Text style={{color:"white", fontSize:100  }} size={200}>{this.usuario.nombre.substr(0, 1) + this.usuario.apellido.substr(0, 1)}</Text> 
                        </Avatar> :
                        <Avatar src={this.usuario.foto.thumbUrl} size={200} />    
                    }
                </div>
                
                <Descriptions bordered title={"Información de "+ this.usuario.nombre} size="small" layout="vertical">
                    <Descriptions.Item label="Nombre" style={{textAlign:"center"}}>{this.usuario.nombre}</Descriptions.Item>
                    <Descriptions.Item label="Apellido" style={{textAlign:"center"}}>{this.usuario.apellido}</Descriptions.Item>
                    <Descriptions.Item label="Usuario" style={{textAlign:"center"}}>{this.usuario.usuario}</Descriptions.Item>
                    <Descriptions.Item label="Departamento" style={{textAlign:"center"}}>{this.usuario.departamento}</Descriptions.Item>
                    <Descriptions.Item label="Email" style={{textAlign:"center"}}>{this.usuario.email}</Descriptions.Item>
                    <Descriptions.Item label="Tipo" style={{textAlign:"center"}}> { this.usuario.tipo === 0 ? <Text>Lectura</Text> : <Text>Escritura</Text>}</Descriptions.Item>
                    <Descriptions.Item label="Pregunta de seguridad" style={{textAlign:"center"}}>
                        { this.usuario.pregunta === null ? <Text>No tiene pregunta configurada</Text> : <Text>El usuario ya tiene un pregunta configurada</Text>}
                    </Descriptions.Item>
                </Descriptions>
            </>
        )
    }
}

export default UserInfo;