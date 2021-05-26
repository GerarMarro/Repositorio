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
    Avatar, Form
} from 'antd';
import 'material-icons';
import {ActualizarUsuario, GetUser} from '../Datos/requests';
import {notificacion} from './Funciones';

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

    formRef = React.createRef();

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

    //Controlo los avatares que se mostrarán
    avatarController = () =>{
        if (this.state.foto === 0) {
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
        console.log(values)
        if (values.confirmacion !== values.contraseña) {
            message.error("Las contraseñas no coinciden")
        }else{
            message.loading({ content: 'Estamos actualizando tu usuario', key });
        
            var upd = {
                _id: this.state.id,
                foto: values.fotico[0],
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
                var titulo = "Usuario Modificado";
                var descripcion = "Se ha modificado a " + this.usuario.nombre +"."
                notificacion(titulo, descripcion);
                this.setState({
                    foto: values.fotico[0]
                })
                this.onReset();
                this.actualizarMain()
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

    onReset = () => {
        this.formRef.current.resetFields();
    };

    sendFile = (e) => {
  
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    };

    render(){
        return(
            <>
                <Form onFinish={this.sendUserChange} ref={this.formRef}>
                    <Card title="Perfil" bordered={true} style={{ width: 900, height:"100%", }}
                    actions={[
                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                Guardar
                            </Button>
                        </Form.Item>
                    ]}>
                        <Space direction="vertical" style={{width:"25%", textAlign:"left"}}>
                            {console.log(this.state.foto)}
                            {this.state.foto === 0 ? <this.avatarController />: <Avatar src={this.state.foto.thumbUrl} size={190} />}
                            <Form.Item 
                                name="fotico"
                                getValueFromEvent={this.sendFile}
                            >
                                <Upload
                                    listType="picture"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    
                                >
                                    <Button icon={<UploadOutlined />}>Subir imagen (Max: 1)</Button>
                                </Upload>
                            </Form.Item>
                        </Space>
                        <Space direction="vertical" style={{width:"70%", textAlign:"left"}}>
                            
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
                        </Space>
                    </Card>
                </Form>
            </>
        );
    }
}

export default Perfil;