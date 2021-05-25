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
        if(this.VerificateImg(file)){
            this.foto = file;
            this.setState({ foto : file }, ()=>{ });
        }
    };

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
            Usuario = {
                foto: this.foto,
                admin: this.usuario._id,
                nombre: values.nombre,
                apellido: values.apellido,
                usuario: values.usuario + "@" +  this.state.empresas.nombre.trim(),
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
                      message.success({ content: 'Tu usuario ha sido creado exitosamente', key });
                      //console.log("res", res.data);
                      if (res.data === 1) {
                        message.error({ content: 'El usuario ya esta en uso', key });
                      }else if (res.data === 2) {
                        message.error({ content: 'El correo ya esta en uso', key });
                      }else{
                        var sesion ={
                            header: "Crear usuarios",
                            action: "CrearUsuarios",
                            menu: '3.2'
                        }
                        localStorage.setItem('state', JSON.stringify(sesion));
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
                            onChange={this.handleUpload}
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Subir imagen (Max: 1)</Button>
                        </Upload>
                    </Space>
                    <Space direction="vertical" style={{width:"70%", textAlign:"left"}}>
                        <Form onFinish={this.showConfirm}>
                            <Form.Item name="nombre" >
                                <Input required allowClear placeholder="Nombre" size="large"  prefix={<UserOutlined />} />    
                            </Form.Item> 
                            <Form.Item name="apellido" >
                                <Input required allowClear placeholder="Apellido" size="large" prefix={<UserOutlined />} />   
                            </Form.Item> 
                            <Input.Group compact style={{width:"100%"}}>
                                <Form.Item name="usuario" style={{width:"70%"}} >
                                    <Input required allowClear placeholder="Usuario" size="large" prefix={<UserOutlined />} />
                                </Form.Item>
                                <Form.Item style={{width:"30%"}}>
                                    <Select 
                                        defaultValue="[Empresas]"
                                        size="large"
                                        onChange={this.handleChangeSelectEmpresa}
                                    >

                                        {this.usuario.empresas.map((e, index)=>
                                            <Option key={index} value={e._id}>@{e.nombre.trim()}</Option>
                                        )}
                                    </Select>
                                </Form.Item>
                                
                            </Input.Group>
                            <Form.Item name="email" >
                                <Input required allowClear placeholder="Correo electrónico" size="large" prefix={<this.email />} />
                            </Form.Item>
                            <Form.Item name="departamento" initialValue="[Escoge departamento]">
                                <Select required 
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
                            <Form.Item name="pregunta" initialValue="[Puedes dejar que el usuario cambie su pregunta despues]" >
                                <Select 
                                    key="Preguntas"
                                    size="large"
                                    style={{ width: "100%" }} 
                                    onChange={this.handleChangeSelect}
                                >
                                    <Option value="¿Cuál es tu superheroe favorito?">¿Cuál es tu superheroe favorito?</Option>
                                    <Option value="¿Cuál es tu trabajo soñado?">¿Cuál es tu trabajo soñado?</Option>
                                    <Option value="¿Cuál es tu personaje favorito?">¿Cuál es tu personaje favorito?</Option>
                                    <Option value="¿Quién es tu actor favorito?">¿Quién es tu actor favorito?</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="respuesta">
                               <Input allowClear placeholder="Respuesta" size="large" prefix={<UnlockOutlined />} />
                            </Form.Item>
                            <Form.Item name="contraseña">
                                <Input.Password
                                    size="large"
                                    placeholder="Ingrese su nueva contraseña"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    prefix={<this.checkPwd />}
                                />
                            </Form.Item>
                            <Form.Item name="confirmacion">
                                <Input.Password
                                    size="large"
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