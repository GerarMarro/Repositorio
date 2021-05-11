import React from 'react';
import '../Styles/Auth.css';
import 'material-icons';
import { Input, Space, Card, Button, Upload, Select, message, Typography, Tree, Result } from 'antd';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone,UploadOutlined,UserAddOutlined, LockOutlined, DownOutlined  } from '@ant-design/icons';
import {Registrar} from '../../Datos/requests';

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
                console.log(this.state.foto);
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

    handleSubmit = event => {
        event.preventDefault();

        if (this.Camposvacios()) {
            
            message.error('Asegurate de que no hayan campos vacíos');

        }else if (this.state.confirmacion !== this.state.contraseña) {
            
            message.error('Asegurate de que ambas contraseñas coincidan');
            
        }else if(this.state.usuario.includes("@") && this.state.usuario.includes("/") && this.state.usuario.includes("\\")){
            message.error('Asegurate de que no hayan caracteres especiales como @, / o \\');
        }else{

            message.loading({ content: 'Estamos creando tu usuario', key });

            if (this.state.foto !== null) {
                
                
                Registrar(this.state)
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

            }else{

                Registrar(this.state)
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
            
        }
        
    };

    handleChangeSelect = value => {
        this.setState({ pregunta: value });
    }

    handleChangeText(event) {
        this.setState({ 
            [event.target.name]: event.target.value
        }, ()=>{console.log(this.state)});
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
                <Card title="Registrar" bordered={true} style={{ width: 1000 }}
                actions={[
                    <Button type="primary" shape="round" icon={<UserAddOutlined />} size='large' onClick={this.handleSubmit}>
                        Registrar
                    </Button>
                    ]}>
                    <Card.Grid style={{width:"50%", height:"100%"}}>
                        <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                            <Upload
                                listType="picture"
                                onPreview={this.handlePreview}
                                onChange={this.handleUpload}
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Subir imagen (Max: 1)</Button>
                            </Upload>
                            <Input required allowClear name="nombre" placeholder="Nombre" size="large" onChange={this.handleChangeText}  prefix={<UserOutlined />} />
                            <Input required allowClear name="apellido" placeholder="Apellido" size="large" onChange={this.handleChangeText} prefix={<UserOutlined />} />
                            <Input required allowClear name="usuario" placeholder="Usuario" size="large" onChange={this.handleChangeText} prefix={<UserOutlined />} />
                            <Input required allowClear name="email" placeholder="Correo electrónico" size="large" onChange={this.handleChangeText} prefix={<this.email />} />
                            <Select required defaultValue="[Seleccione pregunta]" style={{ width: "100%" }} onChange={this.handleChangeSelect}>
                            <Option value="¿Cuál es tu superheroe favorito?">¿Cuál es tu superheroe favorito?</Option>
                                <Option value="¿Por quien te dejó tu ex?">¿Por quien te dejó tu ex?</Option>
                                <Option value="¿Por qué ella no te ama?">¿Por qué ella no te ama?</Option>
                                <Option value="¿Por qué eres un fracasado?">¿Por qué eres un fracasado?</Option>
                            </Select>
                            <Input allowClear name="respuesta" placeholder="Respuesta" size="large" onChange={this.handleChangeText} prefix={<LockOutlined />} />
                            <Input.Password
                                size="large"
                                placeholder="Ingrese contraseña"
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
                    </Card.Grid>
                    <Card.Grid style={{width:"50%", height:"100%"}}>
                        <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                            
                            <Input required allowClear name="empresa" placeholder="Nombre de Empresa" size="large" onChange={this.handleChangeText}  prefix={<this.empresa />} />
                            <Input required allowClear name="lectura" placeholder="Nombre de departamento de lectura" size="large" onChange={this.handleChangeText} prefix={<this.lectura />} />
                            <Input required allowClear name="escritura" placeholder="Nombre de departamento de escritura" size="large" onChange={this.handleChangeText} prefix={<this.escritura />} />
                            
                        </Space>
                    </Card.Grid>
                    <Card.Grid style={{width:"50%", height:"100%"}}>
                        <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                            
                            <Paragraph strong style={{fontSize:29.5}}> 
                                Vista previa
                            </Paragraph>

                            <Tree
                                showLine
                                switcherIcon={<DownOutlined />}
                                defaultExpandedKeys={['0-0-0']}
                                
                            >
                                <TreeNode title={this.state.empresa !== "" ? this.state.empresa : '<Tu empresa aquí>'} key="0-0">
                                <TreeNode title={this.state.lectura !== "" ? this.state.lectura : '<Departamento de lectura>'} key="0-0-0">
                                    <TreeNode title={this.state.empresa !== "" && this.state.lectura !== "" ? "<nombre>@" + this.state.empresa   : '<Nombre de usuario>@<empresa>'} key="0-0-0-0" />
                                </TreeNode>
                                <TreeNode title={this.state.escritura !== "" ? this.state.escritura : '<Departamento de escritura>'} key="0-0-1">
                                    <TreeNode title={this.state.empresa !== "" && this.state.lectura !== "" ? "<nombre>@" + this.state.empresa : '<Nombre de usuario>@<empresa>'} key="0-0-1-0" /></TreeNode>
                                </TreeNode> 
                            </Tree>
                        </Space> 
                    </Card.Grid>
                </Card>
                
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