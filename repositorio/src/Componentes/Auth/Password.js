import React from 'react';
import '../Styles/Auth.css';
import 'material-icons';
import {GetPregunta, ActualizarContra} from '../../Datos/requests';
import { Input, Space, Card, Button, message, Result } from 'antd';
import { UnlockOutlined, QuestionOutlined, RightCircleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

const { Search } = Input;
const key = 'updatable';

class Password extends React.Component {
    
    state = {
        usuario: "",
        email: "",
        respuesta: "",
        pregunta: "",
        respuestaInput:"",
        id: "",
        estado: 0
    }

    handleInput = (event) =>{
        this.setState({ 
            [event.target.name]: event.target.value
        });
    }  

    handleRequest = () =>{

        if (this.state.usuario === "" && this.state.email === "") {
            message.error("Se necesita del correo y del usuario para buscar su usuario");
        }else{
            message.loading({ content: 'Estamos buscando tu información', key });
            GetPregunta(this.state)
            .then(res => {

                if (res.data === 1003) {

                    message.warning({ content: 'Usuario o correo no encontrado', key });
                    
                }else{

                    var dataUser = res.data;
                    this.setState({ 
                        pregunta: dataUser.pregunta,
                        respuesta: dataUser.respuesta,
                        id: dataUser._id,
                        usuario: dataUser.usuario
                    });
                    message.success({ content: 'Contesta la pregunta de seguridad', key });
                }
            
            })
            .catch(err => {
                console.log("err", err);

                message.error({ content: 'Algo salió mal', key });
            });
        }
    }
    
    changePassword = () =>{
        
        if (this.state.respuestaInput === "") {
            message.error("Por favor responder a la pregunta de seguridad");
            //console.log(this.state);
        }else{
            if(this.state.respuestaInput === this.state.respuesta){
                message.loading({ content: 'Tu contraseña estará lista en breve', key });
                var hoy = new Date();
                var hora = String(hoy.getHours()) + String(hoy.getMinutes()) + String(hoy.getSeconds());
                ActualizarContra(this.state, hora)
                .then(res => {
                    this.setState({ 
                        estado: 1
                    });
                    message.success({ content: 'Contraseña enviada a: ' + res.data.email, key, duration: 2 });
                })
                .catch(err => {
                    console.log("err", err);
                    message.error({ content: 'Algo salió mal ', key, duration: 2 });
                });
    
            }else{
                message.error("Su respuesta no coincide con la archivada");
            }
        }
    }

    email = () =>{
        return (
            <span className="material-icons-outlined">
                alternate_email
            </span>
        )
    }

    recargar = () =>{
        window.location.reload();
    }

    View = () =>{
        return (
            <>
                <Result
                    status="success"
                    title="Se ha restaurado su contraseña exitosamente"
                    subTitle="Ve a tu bandeja de entrada y revisa tu nueva contraseña"
                    extra={[
                        <Button type="primary" key="console" onClick={this.recargar}>
                            Ingresar
                        </Button>
                    ]}
                />
            </>
        );
    }

    MainView = () =>{
        return (
            <div className="site-card-border-less-wrapper" >
                <Card title="Recuperar contraseña" bordered={true} style={{ width: 600 }}>
                    <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                        { this.state.respuesta && this.state.respuesta === this.state.respuestaInput ? <UnlockOutlined style={{fontSize: 150, color:"#049C18"}}/> : <LockOutlined style={{fontSize: 150, color:"#900C3F"}}/>}
                        <Input required allowClear name="usuario" placeholder="Usuario" size="large" onChange={this.handleInput} prefix={<UserOutlined />} />
                        <Search required allowClear name="email" onChange={this.handleInput} placeholder="Correo electrónico" onSearch={this.handleRequest} enterButton size="large" prefix={<this.email />} />
                        <Input 
                            readOnly 
                            allowClear 
                            disabled={ this.state.pregunta ? false : true }
                            value={this.state.pregunta} 
                            placeholder="Pregunta de seguridad" 
                            size="large" 
                            prefix={<QuestionOutlined />} 
                        />
                        <Input 
                            allowClear 
                            name="respuestaInput" 
                            disabled={ this.state.pregunta ? false : true }
                            onChange={this.handleInput} 
                            placeholder="Respuesta" 
                            size="large" 
                            prefix={ this.state.respuesta && this.state.respuesta === this.state.respuestaInput ? <UnlockOutlined style={{color:"#049C18"}}/> : <LockOutlined style={{color:"#900C3F"}}/>}
                        />
                        <Button type="primary" onClick={this.changePassword} shape="round" icon={<RightCircleOutlined />} size='large'>
                            Cambiar contraseña
                        </Button>
                    </Space>
                </Card>
            </div>
        );
    }

    controller = () =>{
        if (this.state.estado === 0) {
            return (
                <>
                    <this.MainView />
                </>
            )
        }else{
            return (
                <>
                    <this.View />
                </>
            )
        }
    }

    render(){
        return (
            <>
                <this.controller />
            </>
        );
    }
}

export default Password;