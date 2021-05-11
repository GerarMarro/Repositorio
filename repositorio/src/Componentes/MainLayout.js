import '../App.css';
import '.././Componentes/Styles/Auth.css';
import { Layout, Menu, Typography, Avatar, Popover, Badge, message } from 'antd';
import { ContactsOutlined, TeamOutlined, BankOutlined,
  ReadOutlined, UploadOutlined, UserOutlined, UserAddOutlined, 
  UnlockOutlined, LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import React from 'react';
import 'material-icons';
import descarga from '../descarga.png';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Password from './Auth/Password';
import Dashboard from './Administrador/Dashboard';
import Welcome from './Administrador/Welcome';
import VerUsuarios from './Administrador/VerUsuarios';
import CrearUsuarios from './Administrador/CrearUsuarios';
import Controller from './Administrador/ControllerDepartments';
import Perfil from './Perfil';
import Notificaciones from '../Notificaciones';
import {GetUser, GetNotificaciones} from '../Datos/requests';
import {coloresRandom} from './Funciones';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { SubMenu } = Menu;
const key = 'updatable';

class MainLayout extends React.Component {
  
  constructor(props){
    super(props);
    message.loading({ content: 'Estamos verificando si hay sesiones activas', key });
  }

  componentDidMount(){
    var old = localStorage.getItem("usuario");
    if (old !== null) {
      message.success({ content: 'Hay una sesión encontrada', key });
      var oldId = localStorage.getItem("id");
      GetUser(oldId, old).then(res =>{
        console.log(res.data)
        this.Logueado(res.data);
      }).catch(err =>{
        console.log(err);
      });
      
    }else{
      message.success({ content: 'Ninguna sesión encontrada', key });
    }
  }

  state = {
    collapsed: false,
    action: "Ingresar",
    header: "Ingresar",
    session: 0,
    usuario: null,
    departamento: null,
    color: "",
    menu: '1',
    empresa: "",
    notificaciones: []
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  Logueado = (usuarioL) =>{
    var oldSession = JSON.parse(localStorage.getItem('state'));
    if (String(usuarioL.usuario).indexOf("@") <= 0) {
      if (oldSession === null) {
        this.setState({
          session : 1,
          usuario: usuarioL,
          header: "Bienvenido", 
          action: "Bienvenido", 
          menu: ''
        }, ()=>{
          localStorage.setItem("usuario", this.state.usuario.usuario);
          localStorage.setItem("id", this.state.usuario._id);
        });  
      }else{
        this.setState({
          session : 1,
          usuario: usuarioL,
          header: oldSession.header, 
          action: oldSession.action, 
          menu: oldSession.menu
        }, ()=>{
          localStorage.setItem("usuario", this.state.usuario.usuario);
          localStorage.setItem("id", this.state.usuario._id);
        });  
      }
      GetNotificaciones(this.state.usuario._id).then(res =>{
        this.setState({notificaciones:res.data});
      }).catch(err=>{
        console.error(err);
      })
      
    }else{
      if (oldSession === null) {
        this.setState({
          session : 2,
          usuario: usuarioL,
          header: "Bienvenido", 
          action: "Bienvenido", 
          menu: ''
        }, ()=>{
          localStorage.setItem("usuario", this.state.usuario.usuario);
          localStorage.setItem("id", this.state.usuario._id);
        });
      }else{
        this.setState({
          session : 2,
          usuario: usuarioL,
          header: oldSession.header, 
          action: oldSession.action, 
          menu: oldSession.menu
        }, ()=>{
          localStorage.setItem("usuario", this.state.usuario.usuario);
          localStorage.setItem("id", this.state.usuario._id);
        });
      }  
      GetNotificaciones(this.state.usuario._id).then(res =>{
        this.setState({notificaciones:res.data}, () => console.log(res.data))
        
      }).catch(err=>{
        console.error(err);
      })
    }
    
    return ;
  }

  actualizarUsuario = (usuario) =>{
    this.setState({
      usuario : usuario
    });
  }

  controllerContentInicio =()=>{

    if (this.state.session === 0) {
      if (this.state.action === "Ingresar") {
        return(
        <>
          <Content
              className="App"
            >
              <Login Logueado={this.Logueado} />
  
            </Content>
        </>
        );
      }else if (this.state.action === "Registrar") {
        return(
        <>
          <Content
              className="App"
            >
              <Register />
  
            </Content>
        </>
        );
      }else if (this.state.action === "Recuperar contraseña") {
        return(
        <>
          <Content
               className="App"
            >
              <Password />
              
            </Content>
        </>
        );
      }
    }else if (this.state.session > 0) {
      
      if (this.state.action === "Bienvenido") {
        return(
          <>
            <Content
                 className="App"
              >
                <Welcome usuarioNombre={this.state.usuario.nombre} />
                
              </Content>
          </>
        );
      }else if (this.state.action === "Dashboard") {

        return(
          <>
            <Content
                className="App"
                style={this.state.session === 2 ? {height:"100%"} : {height:"1460px"}}
              >
                <Dashboard notificaciones={this.state.notificaciones} admin={this.state.usuario} sesion={this.state.session} />
                
              </Content>
          </>
        );
      }else if (this.state.action === "Departamento") {
        
        return(
          <>
            <Content
                className="site-card-border-less-wrapper"
              >
                <Controller departamento={this.state.departamento} usuario={this.state.usuario} empresa={this.state.empresa} />
                
              </Content>
          </>
        );
      }else if (this.state.action === "Perfil") {
        
        return(
          <>
            <Content
                className="site-card-border-less-wrapper"
              >
                <Perfil usuario={this.state.usuario} color={coloresRandom()} sesion={this.state.session} actualizarUsuario={this.actualizarUsuario} />
                
              </Content>
          </>
        );
      }else if (this.state.action === "VerUsuarios") {
        
        return(
          <>
            <Content
                className="site-card-border-less-wrapper"
              >
                <VerUsuarios id={this.state.usuario._id} />
                
              </Content>
          </>
        );
      }else if (this.state.action === "CrearUsuarios") {
        
        return(
          <>
            <Content
                className="site-card-border-less-wrapper"
              >
                <CrearUsuarios color={coloresRandom()} info={this.state.usuario} />
                
              </Content>
          </>
        );
      }

    }

    
  }


  MenusDispo = () =>{
    if (this.state.session === 0) {
      
      return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.menu]}>
          <Menu.Item key="1" icon={<UserOutlined />} onClick={() => this.setState({ action: "Ingresar", header: "Ingresar" })}>
            Ingresar
          </Menu.Item>
          <Menu.Item key="2" icon={<UserAddOutlined />} onClick={() => this.setState({ action: "Registrar", header: "Registrar" })}>
            Registrar
          </Menu.Item>
          <Menu.Item key="3" icon={<UnlockOutlined />} onClick={() => this.setState({ action: "Recuperar contraseña", header: "Recuperar contraseña" })}>
            ¿Olvido su contraseña?
          </Menu.Item>
        </Menu>
      )
    }else if (this.state.session === 1) {
     
      return (
        <Menu theme="dark" mode="inline" selectedKeys={[this.state.menu]}>
          
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => this.setState({ action: "Dashboard", header: "Dashboard", menu:'1' })}>Dashboard</Menu.Item>
          
          {this.state.usuario.empresas.map((e, index) =>
              <SubMenu
                key={"2." + index}
                title={
                  <>
                    <BankOutlined />
                    <span>
                      <span>{e.nombre}</span>
                    </span>
                  </>
                }
                onTitleClick={() => this.setState({ empresa: e})}
              >
                {e.departamentos.map((d, indexD)=>
                  <Menu.Item key={"2." + index +"."+ indexD} 
                  icon={d.tipo === 0 ?  <ReadOutlined /> : <UploadOutlined />}
                  onClick={() => this.setState({ action: "Departamento", header: "Departamentos", departamento: d, menu: '2.'+index+"."+indexD})}
                  >
                    {d.nombre}
                  
                  </Menu.Item>
                )}
                
              </SubMenu>
          )}
          <SubMenu
              key="3"
              
              title={
                <>
                  <TeamOutlined />
                  <span>
                    
                    <span>Usuarios</span>
                    
                  </span>
                </>
              }
            >
              <Menu.Item key="3.1" 
              icon={
                <ContactsOutlined />}
                onClick={() => this.setState({ action: "VerUsuarios", header: "Ver usuarios", menu:'3.1' })}
              >
                  Ver usuarios
                </Menu.Item>

              <Menu.Item key="3.2"
                icon={
                  <UserAddOutlined />
                }
                onClick={() => this.setState({ action: "CrearUsuarios", header: "Crear usuarios", menu:'3.2' })}  
              >
                  Crear usuario
                </Menu.Item>

            </SubMenu>
          <Menu.Item key="4" icon={<UserOutlined />} onClick={() => this.setState({ action: "Perfil", header: "Perfil", menu:'4'})}>
            Perfil
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />} onClick={() =>{ 
            this.setState({ action: "Ingresar", header: "Ingresar", session:0, usuario: null, menu:'1' });
            localStorage.clear();
            }}>
            Cerrar sesión
          </Menu.Item>
        </Menu>

      )
    }else if (this.state.session === 2) {
      console.log(this.state)
      return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.menu]}>
          
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => this.setState({ action: "Dashboard", header: "Dashboard", menu:'1' })}>Dashboard</Menu.Item>
      
          <SubMenu
            key={"2"}
            title={
              <>
                <BankOutlined />
                <span>
                  <span>{this.state.usuario.empresas.nombre}</span>
                </span>
              </>
            }
            onTitleClick={() => this.setState({ empresa: this.state.usuario.empresas})}
          >
            
            <Menu.Item key={"2.1"} 
              icon={this.state.usuario.departamentos.tipo === 0 ?  <ReadOutlined /> : <UploadOutlined />}
              onClick={() => this.setState({ action: "Departamento", header: "Departamentos", departamento: this.state.usuario.departamentos, menu: '2.1'})}
              >
                {this.state.usuario.departamentos.nombre}
              
            </Menu.Item>
          </SubMenu>
    
          <Menu.Item key="4" icon={<UserOutlined />} onClick={() => this.setState({ action: "Perfil", header: "Perfil", menu:'4'})}>
            Perfil
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />} onClick={() =>{ 
            this.setState({ action: "Ingresar", header: "Ingresar", session:0, usuario: null, menu:'1' });
            localStorage.clear();
            }}>
            Cerrar sesión
          </Menu.Item>
        </Menu>
      )
    }
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };


  popoverAvatar = () =>{
    
    if (this.state.usuario.foto === 0) {
      var letras = this.state.usuario.nombre.substr(0, 1) + this.state.usuario.apellido.substr(0,1);
      return(
        <Avatar style={{ backgroundColor: coloresRandom(), verticalAlign: 'middle',  cursor:"pointer"}} size="large">
          {letras}
        </Avatar>
      );
    }else{
      var foto = this.state.usuario.foto;
      var url = foto.thumbUrl;
      return(  
        <Avatar src={url}  />
      )
    }
  }

  HeaderPage = () =>{

    if (this.state.usuario === null) {
      return (
        <>
          <Header className="site-layout-background"  style={{ padding: 0, color:"white", height:"65px", display:"inline"}}>
            
            <Text style={{color:"white", fontSize:22}}>{this.state.header}</Text>
        
          </Header>
        </>
      );
    }else{
      
      return (
        <>
          <Header className="site-layout-background"  style={{ padding: 0, color:"white", height:"65px", display:"inline"}}>
            <div style={{textAlign:"right", marginRight:20}}>
              <Popover key="pop2" overlayStyle={{width:"500px"}} placement="bottomRight" title={"Ver Notificaciones"} content={<Notificaciones notificaciones={this.state.notificaciones} />} trigger="click">
                <Badge count={this.state.notificaciones.length} overflowCount={99}>
                  <Text style={{color:"white", fontSize:15, marginRight:10, cursor:"pointer" }}>{this.state.usuario.usuario}</Text><this.popoverAvatar />
                </Badge>
              </Popover> 
            </div>
          </Header>
        </>
      )
    
    }
    
  }

  render() {
    return (
      <Layout>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          
          <div className="logo">
            <img src={descarga} alt="Logo" width="75%" />
          </div>
        
          <this.MenusDispo />

        </Sider>
        <Layout className="main">
          <this.HeaderPage />
          <this.controllerContentInicio />
        </Layout>
      </Layout>
    );
  }
}
export default MainLayout;