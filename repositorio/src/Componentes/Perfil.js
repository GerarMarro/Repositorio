import React from 'react';
import { 
    UserOutlined, EyeInvisibleOutlined, 
    EyeTwoTone,UploadOutlined,
    SaveOutlined, 
    UnlockOutlined  } from '@ant-design/icons';
import { 
    Input, Space, Card, 
    Button, Upload, Select, 
    message, Typography,
    Avatar, Modal,
    Form
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
                //console.log()
        });    
    }

    handleChangeSelect = value => {
        this.setState({ pregunta: value });
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

    sendUserChange = (values) =>{
        if (values.confirmacion !== values.contraseña) {
            message.error("Las contraseñas no coinciden")
        }else{
            message.loading({ content: 'Estamos actualizando tu usuario', key });
        
            var upd = {
                _id: this.state.id,
                foto: this.state.foto,
                nombre: values.nombre,
                apellido: values.apellido,
                email: values.email,
                usuario: values.usuario,
                pregunta: values.pregunta,
                respuesta: values.respuesta,
                contraseña: values.contraseña,
                confirmacion: values.confirmacion,
            };
            
            ActualizarUsuario(upd).then(res =>{
                this.foto = this.state.foto;
                message.success({ content: 'Tu información ha sido actualizada, en la base de datos!', key, duration: 2 });
                this.actualizarMain();
            }).catch(err =>{
                message.error({ content: 'Algo salió mal', key, duration: 2 });
                console.error(err);
            })
        }
        
    }

    actualizarMain = () =>{
        GetUser(this.state.id, this.state.usuario)
        .then(res => {
            this.props.actualizarUsuario(res.data);
            this.foto = this.state.foto;

        }).catch(err =>{
            message.error({ content: 'Algo salió mal, intenta reiniciar la sesión', key, duration: 2 });
        });
        
    }

    render(){
        return(
            <>
                <Card title="Perfil" bordered={true} style={{ width: 900, height:"100%", }}>
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
                        <Form onFinish={this.sendUserChange}>
                            <Form.Item name="nombre" initialValue={this.usuario.nombre}> 
                                <Input required allowClear placeholder="Nombre" size="large" prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item name="apellido" initialValue={this.usuario.apellido}>
                                <Input required allowClear  placeholder="Apellido" size="large" prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item name="usuario"  initialValue={this.usuario.usuario}>
                                <Input required allowClear placeholder="Usuario" size="large" prefix={<UserOutlined />}
                                readOnly={this.props.sesion===2 ? true : false} />
                            </Form.Item>
                            <Form.Item name="email" initialValue={this.usuario.email}>
                                <Input required allowClear placeholder="Correo electrónico" size="large" prefix={<this.email />} />
                            </Form.Item>
                            <Form.Item name="pregunta" initialValue={this.usuario.pregunta}>
                                <Select required>
                                    <Option value="¿Cuál es tu superheroe favorito?">¿Cuál es tu superheroe favorito?</Option>
                                    <Option value="¿Cuál es tu trabajo soñado?">¿Cuál es tu trabajo soñado?</Option>
                                    <Option value="¿Cuál es tu personaje favorito?">¿Cuál es tu personaje favorito?</Option>
                                    <Option value="¿Quién es tu actor favorito?">¿Quién es tu actor favorito?</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="respuesta" initialValue={this.usuario.respuesta}>
                                <Input allowClear placeholder="Respuesta" size="large" prefix={<UnlockOutlined />} />
                            </Form.Item>
                            <Form.Item name="contraseña">
                                <Input.Password
                                    size="large"
                                    name="contraseña"
                                    placeholder="Ingrese su nueva contraseña"
                                    onChange={this.handleChangeText}
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<this.checkPwd />}
                                />
                            </Form.Item>
                            <Form.Item name="confirmacion">
                                <Input.Password
                                    size="large"
                                    onChange={this.handleChangeText}
                                    name="confirmacion"
                                    placeholder="Repita su contraseña"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<this.checkPwd />}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                    Guardar
                                </Button>
                            </Form.Item>
                            
                        </Form>
                    </Space>
                </Card>
            </>
        );
    }
}

export default Perfil;