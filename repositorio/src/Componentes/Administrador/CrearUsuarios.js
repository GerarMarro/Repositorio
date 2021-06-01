import React from 'react';
import { 
    UserOutlined, EyeInvisibleOutlined, 
    EyeTwoTone,UploadOutlined,
    UserAddOutlined,  
    UnlockOutlined  } from '@ant-design/icons';
import { 
    Input, Space, Card, 
    Button, Upload, Select, 
    message, Typography,
    Avatar, Breadcrumb, Modal, Form
} from 'antd';
import {notificacion} from '../Funciones';
import { RegUser } from '../../Datos/requests';
import 'material-icons';

const {Text} = Typography;
const { Option } = Select;
const key = 'updatable';
const { confirm } = Modal;

class CrearUsuarios extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            foto: 0,
            nombre: "",
            apellido: "",
            email: "",
            usuario: "",
            departamento: "",
            admin: "",
            contraseña: "",
            confirmacion: "",
            pregunta: "",
            respuesta: "",
            tipo: "",
            empresas: {},
            departamentos: []
        };
        this.handleChangeText = this.handleChangeText.bind(this);
    }

    foto = 0;
    usuario = this.props.info;
    empresa = "";
    activarDep = true;

    /**Lectura de datos */
    handleChangeText(event) {
        this.setState({
            [event.target.name] : event.target.value},
            () =>{
               
                //console.clear();
        });    
    }

    handleChangeSelectEmpresa = (value) => {
        this.setState({
            empresas: this.usuario.empresas.find(e => e._id === value),
            departamentos: this.usuario.empresas.find(e => e._id === value).departamentos}, ()=>{
            //console.clear();
        });
        this.activarDep = false;
    }

    handleChangeSelectDepartamentos = (value) => {
        this.setState({
            departamento: value,
            
            }, ()=>{
            /*console.log(this.state);
            console.clear();*/
        });
        this.activarDep = false;
    }

    componentDidUpdate(){
        console.clear();
    }
    /**Guardar */

    handleUpload = ( info ) => {

        var file = info.fileList[0];
        this.foto = file;
        this.setState({ foto : file }, ()=>{ });
    };

    sendFile = (e) => {
  
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    };
    
    handleChangeSelect = value => {
        this.setState({ pregunta: value });
    }   
    
    validarCampos = ()=>{
        if (this.state.nombre === "" || this.state.apellido === "" ||
        this.state.usuario === "" || this.state.email === "" || this.state.pregunta === "" ||
        this.state.contraseña === "" || this.state.respuesta === "") {
            
            return false;
        }else{
            return true;
        }
    }

    showConfirm = (values) => {  
        var Usuario = {};
        
        if (values.contraseña !== values.confirmacion) {
            message.error("Las contraseñas no coinciden")
        }else{
            let this2 = this;
            Usuario = {
                foto: this.foto,
                admin: this.usuario._id,
                nombre: values.nombre,
                apellido: values.apellido,
                usuario: values.usuario + "@" +  this.state.empresas.nombre.replace(" ", "_"),
                contraseña: values.contraseña,
                email: values.email,
                pregunta: values.pregunta,
                respuesta: values.respuesta,
                departamento: values.departamento,
                tipo: this.state.departamentos.find(x=>x._id === this.state.departamento).tipo
            }
            confirm({
                title: '¿Está seguro que desea crear a '+ values.nombre +'?',
                content: '',
                onOk() {
                  message.loading({ content: 'Agregando un nuevo miembro al equipo...', key });
                  //console.log(this1.state);
                  
                  RegUser(Usuario).then(res =>{
                      
                      //console.log("res", res.data);
                      if (res.data === 1) {
                        message.error({ content: 'El usuario ya esta en uso', key });
                      }else if (res.data === 2) {
                        message.error({ content: 'El correo ya esta en uso', key });
                      }else{
                        var titulo = "Registro de usuario nuevo";
                        var descripcion = "Se ha registrado a "+Usuario.nombre+" como nuevo usuario en la base de datos.";
                        notificacion(titulo, descripcion);
                        var sesion ={
                            header: "Crear usuarios",
                            action: "CrearUsuarios",
                            menu: '3.2'
                        }
                        localStorage.setItem('state', JSON.stringify(sesion));
                        this2.props.update();
                        window.location.reload();
                      }
                  }).catch(err =>{
                      message.error({ content: 'Algo salió mal', key });
                      console.error("Error: ", err)
                  });
                }
              });
        }
    }
    /** Iconos */
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

    email = () =>{
        return (
            <span className="material-icons-outlined">
                alternate_email
            </span>
        )
    }

    bread = 
    ( 
        <Breadcrumb>
            <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
            <Breadcrumb.Item>Crear Usuario</Breadcrumb.Item>
        </Breadcrumb>
    )

    render(){
        var letras = "NU";
        return(
            <>
                
                <Card title={this.bread} bordered={true} style={{ width: 900, height:"100%", }}>

                    <Space direction="vertical" style={{width:"25%", textAlign:"left"}}>
                        <Avatar style={{ backgroundColor: this.props.color, verticalAlign: 'middle' }} size={190}>
                            <Text style={{color:"white", fontSize:100  }}>{letras}</Text>
                        </Avatar>
                        <Upload
                            listType="picture"
                            accept=".jpg, .png, .JPEG"
                            onChange={this.handleUpload}
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Subir imagen (Max: 1)</Button>
                        </Upload>
                    </Space>
                    <Space direction="vertical" style={{width:"70%", textAlign:"left"}}>
                        <Form onFinish={this.showConfirm}>
                            <Form.Item 
                                name="nombre" 
                                rules={[
                                    {
                                        required: true,
                                        message: "Este campo es requerido"
                                    },
                                    {
                                        pattern: "[A-Za-z]{1}",
                                        message: "Escriba un nombre válido"
                                    }
                                ]}
                            >
                                <Input allowClear placeholder="Nombre" size="large"  prefix={<UserOutlined />} />    
                            </Form.Item> 
                            <Form.Item 
                                name="apellido"
                                rules={[
                                    {
                                        required: true,
                                        message: "Este campo es requerido"
                                    },
                                    {
                                        pattern: "[A-Za-z]{1}",
                                        message: "Escriba un apellido válido"
                                    }
                                ]}
                            >
                                <Input required allowClear placeholder="Apellido" size="large" prefix={<UserOutlined />} />   
                            </Form.Item> 
                            <Input.Group compact style={{width:"100%"}}>
                                <Form.Item 
                                    name="usuario" 
                                    style={{width:"70%"}} 
                                    rules={[
                                        {
                                            required:true,
                                            message: 'Este campo no puede ir vacío'
                                        },
                                        {
                                            pattern: "[A-Za-z0-9]{5,40}",
                                            message: "El nombre de usuario debe de llevar al menos 5 letras"
                                        }
                                    ]}
                                >
                                    <Input required allowClear placeholder="Usuario" size="large" prefix={<UserOutlined />} />
                                </Form.Item>
                                <Form.Item 
                                    style={{width:"30%"}}
                                    rules={[
                                        { 
                                          required: true, 
                                          message: "Este campo es requerido" 
                                        }
                                      ]}
                                >
                                    <Select 
                                        defaultValue="[Empresas]"
                                        size="large"
                                        onChange={this.handleChangeSelectEmpresa}
                                    >

                                        {this.usuario.empresas.map((e, index)=>
                                            <Option key={index} value={e._id}>@{e.nombre.replace(" ", "_")}</Option>
                                        )}
                                    </Select>
                                </Form.Item>
                                
                            </Input.Group>
                            <Form.Item 
                                name="email" 
                                rules={[
                                    {
                                        required: true,
                                        message: "Este campo es requerido"
                                    },
                                    {
                                        pattern: "[A-Za-z0-9_&-*+$%]{1,}[@]{1}[a-z]{1,}[.]{1}[a-z]{3}",
                                        message: "El formato de correo no es correcto"
                                    }
                                ]}
                            >
                                <Input allowClear placeholder="Correo electrónico" size="large" prefix={<this.email />} />
                            </Form.Item>
                            <Form.Item 
                                name="departamento" 
                                initialValue="[Escoge departamento]"
                                rules={[
                                    {
                                        required: true,
                                        message: "Este campo es requerido"
                                    }
                                ]}
                            >
                                <Select  
                                    disabled={this.activarDep}
                                    size="large"
                                    key="Departamentos" 
                                    style={{ width: "100%" }} 
                                    onChange={this.handleChangeSelectDepartamentos}
                                >
                                {this.state.departamentos.map((d, index) =>{
                                    return <Option key={index} value={d._id}>{d.nombre}</Option>
                                })}
                                
                                </Select>
                            </Form.Item>
                            <Form.Item name="pregunta" initialValue={null} >
                                <Select 
                                    key="Preguntas"
                                    size="large"
                                    style={{ width: "100%" }}
                                    rules={[
                                        {
                                            required: false
                                        }
                                    ]}
                                >
                                    <Option value={null}>[Puedes dejar que el usuario cambie su pregunta despues]</Option>
                                    <Option value="¿Cuál es tu superheroe favorito?">¿Cuál es tu superheroe favorito?</Option>
                                    <Option value="¿Cuál es tu trabajo soñado?">¿Cuál es tu trabajo soñado?</Option>
                                    <Option value="¿Cuál es tu personaje favorito?">¿Cuál es tu personaje favorito?</Option>
                                    <Option value="¿Quién es tu actor favorito?">¿Quién es tu actor favorito?</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item 
                                name="respuesta"
                                rules={[
                                    {
                                        required: false
                                    }
                                ]}
                            >
                               <Input allowClear placeholder="Respuesta" size="large" prefix={<UnlockOutlined />} />
                            </Form.Item>
                            <Form.Item 
                                name="contraseña"
                                rules={[
                                    {
                                        required: true,
                                        message: "Este campo es requerido"
                                    },
                                    {
                                        pattern:"[A-Za-z0-9]{1,}",
                                        message:"Este campo solo admite letras y números"
                                    }
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    name="contraseña"
                                    placeholder="Ingrese su nueva contraseña"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<this.checkPwd />}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="confirmacion"
                                rules={[
                                    {
                                        required: true,
                                        message: "Este campo es requerido"
                                    },
                                    {
                                        pattern:"[A-Za-z0-9]{1,}",
                                        message:"Este campo solo admite letras y números"
                                    }
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    name="confirmacion"
                                    placeholder="Repita su contraseña"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<this.checkPwd />}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" icon={<UserAddOutlined />}>
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

export default CrearUsuarios;