import React from 'react';
import { 
    UserOutlined, EyeInvisibleOutlined, 
    EyeTwoTone,UploadOutlined,
    UserAddOutlined, LockOutlined, 
    UnlockOutlined  } from '@ant-design/icons';
import { 
    Input, Space, Card, 
    Button, Upload, Select, 
    message, Typography,
    Avatar, Modal
} from 'antd';
import 'material-icons';
import {ActualizarUsuario, GetUser} from '../Datos/requests';

const {Text} = Typography;
const { Option } = Select;
const key = 'updatable';

class Perfil extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            previewImage: "",
            previewVisible: true,
            opciones: [],
            id: this.usuario._id,
            foto: this.usuario.foto,
            nombre: this.usuario.nombre,
            apellido: this.usuario.apellido,
            email: this.usuario.email,
            usuario: this.usuario.usuario,
            contraseña: "",
            confirmacion: "",
            pregunta: this.usuario.pregunta,
            respuesta: this.usuario.respuesta,
        }
        this.handleChangeText = this.handleChangeText.bind(this);
        
    }


    checkPwd = () =>{
        if(this.state.contraseña === this.state.confirmacion){
            return(
                <span className="material-icons-outlined" style={{color:"green"}}>
                    check_circle_outline
                </span>
            );
        }else{
            return(
                <span className="material-icons-outlined" style={{color:"red"}}>
                    cancel
                </span>
            );
        }
    }

    //Lee las entradas
    handleChangeText(event) {
        this.setState({
            [event.target.name] : event.target.value}, () =>{
                console.log(this.state, "callback")
        });    
    }

    handleChangeSelect = value => {
        this.setState({ pregunta: value });
    }
    
    componentDidUpdate(){
        //console.log(this.state);
        console.clear();
    }

    //Retorna el email de material-icons
    email = () =>{
        return (
            <span className="material-icons-outlined">
                alternate_email
            </span>
        )
    }

    //Guardo los datos enviados desde el main
    usuario = this.props.usuario;
    foto = this.usuario.foto;

    VerificateImg = (file) => {

        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('Solo puedes subir imagenes formato jpg o png!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('La imagen debe ser menor a 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    //Almaceno la  foto
    handleUpload = ( info ) => {
        var file = info.fileList[0];
        if(this.VerificateImg(file)){
            this.setState({ 
                foto: file,
            });
        }
    };

    //Controlo los avatares que se mostrarán
    avatarController = () =>{
        if (this.usuario.foto === 0) {
            var letras = this.usuario.nombre.substr(0, 1) + this.usuario.apellido.substr(0,1);
            return(
                <Avatar style={{ backgroundColor: this.props.color, verticalAlign: 'middle' }} size={190}>
                    <Text style={{color:"white", fontSize:100  }}>{letras}</Text>
                </Avatar>
            )
        }else{
            var url =this.foto.thumbUrl;
            //console.log(url)
            return(
                <Avatar src={url} size={190} />
            )
        }
    }

    //Muestro el modal
    showModal = () => {
        this.setState({
          visible: true,
        });
    };

    //En caso de darle ok
    handleOk = () => {
        this.sendUserChange();
        this.setState({
          visible: false,
        });
    };

    //En caso de cancelar
    handleCancel = () => {
        this.setState({
          visible: false,
        });
    };

    Camposvacios = () =>{
        if(this.state.nombre === "" || this.state.apellido === "" ||
            this.state.usuario === "" || this.state.email === "" || this.state.pregunta === "" || this.state.respuesta === "" || 
            this.state.empresa === "" || this.state.escritura === "" || this.state.lectura === ""){

            return true;

        }else{
            return false;   
        }
    };

    sendUserChange = () =>{
        if (this.Camposvacios()) {
            
            message.error('Asegurate de que no hayan campos vacíos');

        }else if (this.state.confirmacion !== this.state.contraseña) {
            
            message.error('Asegurate de que ambas contraseñas coincidan');
            
        }else if(this.state.usuario.includes("@") && this.state.usuario.includes("/") && this.state.usuario.includes("\\")){
            
            message.error('Asegurate de que no hayan caracteres especiales como @, / o \\');
        
        }else{
            
            message.loading({ content: 'Estamos actualizando tu usuario', key });

            var upd = {
                _id: this.state.id,
                foto: this.state.foto,
                nombre: this.state.nombre,
                apellido: this.state.apellido,
                email: this.state.email,
                usuario: this.state.usuario,
                contraseña: this.state.contraseña,
                confirmacion: this.state.confirmacion,
                pregunta: this.state.pregunta,
                respuesta: this.state.respuesta,
            };

            ActualizarUsuario(upd).then(res =>{
                this.foto = this.state.foto;
                message.success({ content: 'Tu información ha sido actualizada, en la base de datos!', key, duration: 2 });
                this.actualizarMain();
            }).catch(err =>{
                message.error({ content: 'Algo salió mal', key, duration: 2 });
            })
        }
        
    }

    actualizarMain = () =>{
        message.loading({ content: 'Estamos trabajando para que veas los cambios en la página', key });
        console.log(this.state)
        GetUser(this.state.id, this.state.usuario)
        .then(res => {
            this.props.actualizarUsuario(res.data);
            this.foto = this.state.foto;
            message.success({ content: 'Tu información ha sido actualizada!', key, duration: 2 });

        }).catch(err =>{
            message.error({ content: 'Algo salió mal, intenta reiniciar la sesión', key, duration: 2 });
        });
        
    }

    render(){
        return(
            <>
                <Card title="Perfil" bordered={true} style={{ width: 900, height:"70%", }}
                    actions={[
                    <Button type="primary" shape="round" icon={<UserAddOutlined />} size='large' onClick={this.sendUserChange}>
                        Guardar
                    </Button>
                ]}>
                    <Space direction="vertical" style={{width:"25%", textAlign:"left"}}>
                        <this.avatarController />
                        <Upload
                            listType="picture"
                            onChange={this.handleUpload}
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Subir imagen (Max: 1)</Button>
                        </Upload>
                    </Space>
                    <Space direction="vertical" style={{width:"70%", textAlign:"left"}}>
                        <Input required allowClear name="nombre" placeholder="Nombre" size="large" defaultValue={this.usuario.nombre} onChange={this.handleChangeText}  prefix={<UserOutlined />} />
                        <Input required allowClear name="apellido" placeholder="Apellido" size="large" defaultValue={this.usuario.apellido} onChange={this.handleChangeText}  prefix={<UserOutlined />} />
                        <Input required allowClear name="usuario" placeholder="Usuario" size="large" defaultValue={this.usuario.usuario} onChange={this.handleChangeText} prefix={<UserOutlined />} />
                        <Input required allowClear name="email" placeholder="Correo electrónico" defaultValue={this.usuario.email} size="large" onChange={this.handleChangeText} prefix={<this.email />} />
                        <Button type="primary" icon={<LockOutlined />} onClick={this.showModal} block>
                            Cambiar aspectos de seguridad
                        </Button>
                        <Modal
                            title="Actualizar parámetros de seguridad"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                                <Select required defaultValue={this.usuario.pregunta} style={{ width: "100%" }} onChange={this.handleChangeSelect}>
                                <Option value="¿Cuál es tu superheroe favorito?">¿Cuál es tu superheroe favorito?</Option>
                                    <Option value="¿Por quien te dejó tu ex?">¿Por quien te dejó tu ex?</Option>
                                    <Option value="¿Por qué ella no te ama?">¿Por qué ella no te ama?</Option>
                                    <Option value="¿Por qué eres un fracasado?">¿Por qué eres un fracasado?</Option>
                                </Select>
                                <Input allowClear name="respuesta" defaultValue={this.usuario.respuesta} placeholder="Respuesta" size="large" onChange={this.handleChangeText} prefix={<UnlockOutlined />} />
                                <Input.Password
                                    size="large"
                                    placeholder="Ingrese su nueva contraseña"
                                    name="contraseña"
                                    onChange={this.handleChangeText}
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<this.checkPwd />}
                                />
                                <Input.Password
                                    size="large"
                                    onChange={this.handleChangeText}
                                    name="confirmacion"
                                    placeholder="Repita su contraseña"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<this.checkPwd />}
                                />
                            </Space>
                        </Modal>
                    </Space>
                </Card>
            </>
        );
    }
}

export default Perfil;