import React from 'react';
import '../Styles/Auth.css';
import 'material-icons';
import { Input, Space, Card, Button, Upload, Select, message, Typography, Tree, Result, Form, Tooltip } from 'antd';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone,UploadOutlined,UserAddOutlined, LockOutlined, DownOutlined  } from '@ant-design/icons';
import {Registrar} from '../../Datos/requests';
//import { datos } from '../../Datos/rutas';

const { Option } = Select;
const { TreeNode } = Tree;
const { Paragraph } = Typography;
const key = 'updatable';

class Register extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            previewImage: "",
            previewVisible: true,
            opciones: [],
            foto: 0,
            nombre: "",
            apellido: "",
            email: "",
            usuario: "",
            contraseña: "",
            confirmacion: "",
            pregunta: "",
            respuesta: "",
            empresa: "",
            lectura: "",
            escritura: "",
            estado: 0
        }
        this.handleChangeText = this.handleChangeText.bind(this);
    }

    handlePreview = file => {
        this.setState({
          previewImage: file.thumbUrl,
          previewVisible: true
        });
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

    handleUpload = ( info ) => {

        var file = info.fileList[0];
        if(this.VerificateImg(file)){
            this.setState({ foto: file }, ()=>{
                //console.log(this.state.foto);
            });
        }
    };

    Camposvacios = () =>{
        if(this.state.nombre === "" || this.state.apellido === "" ||
            this.state.usuario === "" || this.state.email === "" || this.state.pregunta === "" ||
            this.state.contraseña === "" || this.state.respuesta === "" || this.state.confirmacion === ""||
            this.state.empresa === "" || this.state.escritura === "" || this.state.lectura === ""){

            return true;

        }else{
            return false;   
        }
    };
    datos = {};
    handleSubmit = values => {
        if (values.confirmacion !== values.contraseña) {
            
            message.error('Asegurate de que ambas contraseñas coincidan');
            
        }else{

            message.loading({ content: 'Estamos creando tu usuario', key });
            if (this.state.foto !== null) {
                this.datos={
                    foto: this.state.foto,
                    nombre: values.nombre,
                    apellido: values.apellido,
                    usuario: values.usuario,
                    contraseña: values.contraseña,
                    email: values.email,
                    pregunta: values.pregunta,
                    respuesta: values.respuesta,
                    empresa: values.empresa,
                    lectura: values.lectura,
                    escritura: values.escritura
                }

            }else{
                this.datos={
                    foto: 0,
                    nombre: values.nombre,
                    apellido: values.apellido,
                    usuario: values.usuario,
                    contraseña: values.contraseña,
                    email: values.email,
                    pregunta: values.pregunta,
                    respuesta: values.respuesta,
                    empresa: values.empresa,
                    lectura: values.lectura,
                    escritura: values.escritura
                }
                
            }
            Registrar(this.datos)
            .then(res => {
                if (res.data === 1001) {

                    message.warning({ content: 'El nombre de usuario ya esta en uso.!', key, duration: 2 });
                    
                }else if(res.data === 1002){

                    message.warning({ content: 'El nombre de la empresa ya esta en uso.!', key, duration: 2 });

                }else{
                    
                    message.success({ content: 'El usuario fue creado exitosamente!', key, duration: 2 });
                    this.setState({
                        estado: 1
                    });
                }

            })
            .catch(err => {

                console.log("err", err);
                message.error({ content: 'Algo salió mal', key, duration: 2 });

            });
        
        }
        
    };

    handleChangeText(event) {
        this.setState({ 
            [event.target.name]: event.target.value
        }, ()=>{});
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

    email = () =>{
        return (
            <span className="material-icons-outlined">
                alternate_email
            </span>
        )
    }

    empresa = () =>{
        return(
            <span className="material-icons-outlined">
                business
            </span>
        )
    }

    lectura = () =>{
        return (
            <span className="material-icons-outlined">
                auto_stories
            </span>
        )
    }

    escritura = () =>{
        return (
            <span className="material-icons-outlined">
                history_edu
            </span>
        )
    }

    recargar = () =>{
        window.location.reload();
    }

    view = () =>{
        return (
            <>
                <Result
                    status="success"
                    title={"Felicidades " + this.state.nombre}
                    subTitle={"Tu empresa " + this.state.empresa + " ha sido creada exitosamente, ya puedes entrar con tu usuario " + this.state.usuario}
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
                <Form onFinish={this.handleSubmit}>
                    <Card title="Registrar" bordered={true} style={{ width: 1000 }}
                    actions={[
                        <Form.Item>
                            <Button type="primary" shape="round" icon={<UserAddOutlined />} size='large' htmlType="submit">
                                Registrar
                            </Button>
                        </Form.Item>
                        ]}>
                        
                        <Card.Grid style={{width:"50%", height:"100%"}}>
                            <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                                <Upload
                                    listType="picture"
                                    onPreview={this.handlePreview}
                                    onChange={this.handleUpload}
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    accept=".jpg, .PNG, .JPEG"
                                >
                                    <Button icon={<UploadOutlined />}>Subir imagen (Max: 1)</Button>
                                </Upload>
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
                                <Form.Item 
                                    name="usuario"
                                    rules={[
                                        {
                                            required:true,
                                            message: 'Este campo no puede ir vacío'
                                        },
                                        {
                                            pattern: "[A-Za-z0-9]{5,40}",
                                            message: "El nombre de usuario debe de llevar al menos 5 letras, números y/o una @"
                                        }
                                    ]}
                                >
                                    <Input required allowClear placeholder="Usuario" size="large" prefix={<UserOutlined />} />
                                </Form.Item>
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
                                    <Input required allowClear placeholder="Correo electrónico" size="large" prefix={<this.email />} />
                                </Form.Item>
                                <Form.Item 
                                    name="pregunta"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Este campo es requerido"
                                        },
                                    ]}
                                >
                                    <Tooltip title={
                                        <>
                                            <p><strong>¿Porqué establecer una pregunta?</strong></p>
                                            <p>En caso de pérdida te ayudará a recuperar tus credenciales, así que no la olvides</p>
                                        </>
                                    } color={'red'} key={"1"}>
                                        <Select required defaultValue="[Seleccione pregunta]" style={{ width: "100%" }}>
                                            <Option value="¿Cuál es tu superheroe favorito?" key="1">¿Cuál es tu superheroe favorito?</Option>
                                            <Option value="¿Cuál es tu trabajo soñado?" key="2">¿Cuál es tu trabajo soñado?</Option>
                                            <Option value="¿Cuál es tu personaje favorito?" key="3">¿Cuál es tu personaje favorito?</Option>
                                            <Option value="¿Quién es tu actor favorito?" key="4">¿Quién es tu actor favorito?</Option>
                                        </Select>
                                    </Tooltip>
                                </Form.Item>
                                <Form.Item 
                                    name="respuesta"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Este campo es requerido"
                                        },
                                        {
                                            pattern: "[A-Za-z]{1,}",
                                            message: "Este campo solo admite letras para ayudarte a recordar"
                                        }
                                    ]}
                                >
                                    <Input allowClear placeholder="Respuesta" size="large" prefix={<LockOutlined />} />
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
                                        placeholder="Ingrese contraseña"
                                        onChange={this.handleChangeText}
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
                                        onChange={this.handleChangeText}
                                        placeholder="Repita su contraseña"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        prefix={<this.checkPwd />}
                                    />
                                </Form.Item>
                            </Space>
                        </Card.Grid>
                        <Card.Grid style={{width:"50%", height:"100%"}}>
                            <Tooltip 
                                title={
                                    <>
                                        <p><strong>¿Porqué hago esto?</strong></p>
                                        <p>Para el funcionamiento correcto de la aplicación se tiene que crear una organización inicial así tampoco pierdes tiempo</p>
                                    </>
                                } 
                                color={'blue'} 
                                key={"2"}
                                overlayStyle={{width:"700px"}}
                            >
                                <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                                    <Form.Item 
                                        name="empresa"
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
                                        <Input allowClear name="empresa" onChange={this.handleChangeText} placeholder="Nombre de Empresa" size="large" prefix={<this.empresa />} />
                                    </Form.Item>
                                    <Form.Item 
                                        name="lectura"
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
                                        <Input allowClear name="lectura" onChange={this.handleChangeText} placeholder="Nombre de departamento de lectura" size="large" prefix={<this.lectura />} />
                                    </Form.Item>
                                    <Form.Item 
                                        name="escritura"
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
                                        <Input allowClear name="escritura" placeholder="Nombre de departamento de escritura" onChange={this.handleChangeText} size="large" prefix={<this.escritura />} />
                                    </Form.Item>
                                </Space>
                            </Tooltip>
                        </Card.Grid>
                        <Card.Grid style={{width:"50%", height:"100%"}}>
                            <Tooltip 
                                title={
                                    <>
                                        <p><strong>¿Qué es esto?</strong></p>
                                        <p>Puedes ver una pequeña vista previa de lo que sería tu organización</p>
                                    </>
                                } 
                                color={'gold'} 
                                key={"2"}
                                overlayStyle={{width:"700px"}}
                            >
                                <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                                    
                                    <Paragraph strong style={{fontSize:29.5}}> 
                                        Vista previa
                                    </Paragraph>

                                    <Tree
                                        showLine
                                        switcherIcon={<DownOutlined />}
                                        defaultExpandedKeys={['0-0-0', '0-0-1']}
                                        
                                    >
                                        <TreeNode title={this.state.empresa !== "" ? this.state.empresa : '[Tu empresa aquí]'} key="0-0">
                                        <TreeNode title={this.state.lectura !== "" ? this.state.lectura : '[Departamento de lectura]'} key="0-0-0">
                                            <TreeNode title={this.state.empresa !== "" && this.state.lectura !== "" ? "[nombre]@" + this.state.empresa   : '<Nombre de usuario>@<empresa>'} key="0-0-0-0" />
                                        </TreeNode>
                                        <TreeNode title={this.state.escritura !== "" ? this.state.escritura : '<Departamento de escritura>'} key="0-0-1">
                                            <TreeNode title={this.state.empresa !== "" && this.state.lectura !== "" ? "[nombre]@" + this.state.empresa : '<Nombre de usuario>@<empresa>'} key="0-0-1-0" /></TreeNode>
                                        </TreeNode> 
                                    </Tree>
                                </Space> 
                            </Tooltip>
                        </Card.Grid>
                    </Card>
                </Form>
            </div>
        );
    }

    controllerViews = () =>{

        if (this.state.estado === 0) {
            return(
                <this.MainView />
            )
        }else{
            return(
                <this.view />
            )
        }

    }

    render(){
        
        return (
            <>
                <this.controllerViews />
            </>
        );
    }
}

export default Register;