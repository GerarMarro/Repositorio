import React from 'react';
import '../Styles/Auth.css';
import { Input, Space, Card, Button, message, Skeleton } from 'antd';
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from '@ant-design/icons';
import {Ingresar} from '../../Datos/requests';

const key = 'updatable';

class Login extends React.Component {
    
    constructor(props){
        super(props);
        this.changeInput = this.changeInput.bind(this);
    }
    state={
        isloading: false
    }
    user = "";
    contraseña = "";
    /*
    state = {
        usuario: "",
        constraseña: "",
    }
    */
    changeInput = (event) =>{
        if (event.target.name === "usuario") {
         
            this.user = event.target.value;
        
        }else{

            this.contraseña = event.target.value;
        
        }
    }

    ingresar = (event) =>{

        this.setState({ isloading: true });
        message.loading({ content: 'Cargando...', key });
        Ingresar(this.user, this.contraseña)
        .then(res => {
            if (res.data === 1003) {

                message.warning({ content: 'Usuario Incorrecto', key, duration: 2 });

            }else if (res.data === 1004) {
                
                message.error({ content: 'Contraseña incorrecta', key, duration: 2 });

            }else{

                var dataUser = res.data;
                message.success({ content: 'Bienvenido ' + dataUser.nombre + '!', key, duration: 2 });
                
                this.props.Logueado(dataUser);
                this.setState({ isloading: false });
                return ;
            }
            
        })
        .catch(err => {
            console.log("err", err);
            message.error({ content: 'Algo salió mal', key, duration: 2 });
        });

    }

    render(){
        return (
            <>
                { this.state.isloading ? <Skeleton active /> : 
                    <div className="site-card-border-less-wrapper" >
                        <Card title="Ingresar" bordered={true} style={{ width: 600 }}>
                            <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                                <UserOutlined style={{fontSize: 150}}/>
                                <Input allowClear name="usuario" placeholder="Usuario" size="large" onChange={this.changeInput} prefix={<UserOutlined />} />
                                <Input.Password
                                    size="large"
                                    name="contraseña"
                                    placeholder="Contraseña"
                                    onChange={this.changeInput}
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                                <Button type="primary" onClick={this.ingresar} shape="round" icon={<LoginOutlined />} size='large'>
                                    Ingresar
                                </Button>
                            </Space>
                        </Card>
                    </div>
                }
            </>
        );
    }
}

export default Login;