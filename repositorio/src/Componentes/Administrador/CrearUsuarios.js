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
    Avatar, Breadcrumb, Modal
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
            this.setState({ foto: file });
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
    
    showConfirm = (event) => {
        var Usuario = {};
        this.setState({
            admin: this.usuario._id,
            usuario: this.state.usuario +"@"+ this.state.empresas.nombre.trim(),
            foto: 0,
            tipo: this.state.departamentos.find(x=>x._id === this.state.departamento).tipo}, ()=>{
                Usuario = {
                    foto: this.state.foto,
                    admin: this.state.admin,
                    nombre: this.state.nombre,
                    apellido: this.state.apellido,
                    usuario: this.state.usuario,
                    contraseña: this.state.contraseña,
                    email: this.state.email,
                    pregunta: this.state.pregunta,
                    respuesta: this.state.respuesta,
                    departamento: this.state.departamento,
                    tipo: this.state.tipo
                }
            }
        )
        confirm({
          title: '¿Está seguro que desea crear a '+this.state.nombre+'?',
          content: '',
          onOk() {
            message.loading({ content: 'Agregando un nuevo miembro al equipo...', key });
            
            RegUser(Usuario).then(res =>{
                message.success({ content: 'Tu usuario ha sido creado exitosamente', key });
                console.log("res", res.data);
            }).catch(err =>{
                message.error({ content: 'Algo salió mal', key });
                console.error("Error: ", err)
            });
          }
        });
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
                
                <Card title={this.bread} bordered={true} style={{ width: 900, height:"100%", }}
                    actions={[
                    <Button type="primary" shape="round" icon={<UserAddOutlined />} size='large' onClick={this.showConfirm}>
                        Guardar
                    </Button>
                ]}>

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
                        <Input required allowClear name="nombre" placeholder="Nombre" size="large" onChange={this.handleChangeText}  prefix={<UserOutlined />} />
                        <Input required allowClear name="apellido" placeholder="Apellido" size="large" onChange={this.handleChangeText}  prefix={<UserOutlined />} />
                        <Input.Group compact>
                            <Input required allowClear name="usuario" placeholder="Usuario" size="large" style={{width:"70%"}} onChange={this.handleChangeText}  prefix={<UserOutlined />} />
                            <Select 
                                defaultValue="[Empresas]"
                                size="large"
                                style={{ width: "30%" }} 
                                onChange={this.handleChangeSelectEmpresa}
                                >

                                {this.usuario.empresas.map((e, index)=>
                                    <Option key={index} value={e._id}>@{e.nombre.trim()}</Option>
                                )}
                            </Select>
                        </Input.Group>
                        
                        <Input required allowClear name="email" placeholder="Correo electrónico" size="large" onChange={this.handleChangeText} prefix={<this.email />} />
                        <Select required 
                            disabled={this.activarDep}
                            size="large"
                            name="departamento"
                            key="Departamentos" 
                            defaultValue="[Escoge departamento]" 
                            style={{ width: "100%" }} 
                            onChange={this.handleChangeSelectDepartamentos}
                            >
                            {this.state.departamentos.map((d, index) =>{
                                return <Option key={index} value={d._id}>{d.nombre}</Option>
                            })}
                            
                        </Select>
                        <Select 
                            name="pregunta"
                            key="Preguntas"
                            size="large"
                            defaultValue="[Puedes dejar que el usuario cambie su pregunta despues]"
                            style={{ width: "100%" }} 
                            onChange={this.handleChangeSelect}>
                            <Option value="¿Cuál es tu superheroe favorito?">¿Cuál es tu superheroe favorito?</Option>
                                <Option value="¿Por quien te dejó tu ex?">¿Por quien te dejó tu ex?</Option>
                                <Option value="¿Por qué ella no te ama?">¿Por qué ella no te ama?</Option>
                                <Option value="¿Por qué eres un fracasado?">¿Por qué eres un fracasado?</Option>
                        </Select>
                        <Input allowClear name="respuesta" placeholder="Respuesta" size="large" onChange={this.handleChangeText} prefix={<UnlockOutlined />} />
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
                </Card>
            </>
        );
    }
}

export default CrearUsuarios;