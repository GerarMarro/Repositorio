import React from 'react';
import '../Styles/Auth.css';
import { Input, Space, Card, Button, message, Skeleton, Form } from 'antd';
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

    onFinishFailed = (errorInfo) => {
        message.error("Error: ", errorInfo);
    };

    ingresar = (values) =>{

        this.setState({ isloading: true });
        message.loading({ content: 'Cargando...', key });
        Ingresar(values.usuario, values.contraseña)
        .then(res => {
            if (res.data === 1003) {

                message.warning({ content: 'Usuario Incorrecto', key, duration: 2 });

            }else if (res.data === 1004) {
                
                message.error({ content: 'Contraseña incorrecta', key, duration: 2 });

            }else{

                var dataUser = res.data;
                message.success({ content: 'Bienvenido ' + dataUser.nombre + '!', key, duration: 2 });
                
                this.props.Logueado(dataUser);
                return ;
            }
            
        })
        .catch(err => {
            console.log("err", err);
            this.setState({ isloading: false });
            message.error({ content: 'Algo salió mal', key, duration: 2 });
        });
        this.setState({ isloading: false });
    }

    render(){
        return (
            <>
                { this.state.isloading ? <Skeleton active /> : 
                    <div className="site-card-border-less-wrapper" >
                        <Card title="Ingresar" bordered={true} style={{ width: 600 }}>
                            <Space direction="vertical" style={{width:"100%", textAlign:"center"}}>
                                <UserOutlined style={{fontSize: 150}}/>
                                <Form
                                    initialValues={{
                                        remember: true
                                    }}
                                    onFinish={this.ingresar}
                                    onFinishFailed={this.onFinishFailed}
                                >
                                    <Form.Item 
                                        name="usuario"
                                        rules={[
                                            {
                                                required:true,
                                                message:"El campo usuario no puede ir vacío"
                                            }
                                        ]}    
                                    >
                                        <Input 
                                            allowClear 
                                            placeholder="Usuario" 
                                            size="large"
                                            prefix={<UserOutlined />} 
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        name="contraseña" 
                                        rules={[{
                                            required:true,
                                            message: "El campo contraseña no puede ir vacío"
                                        }]}
                                    >
                                        <Input.Password
                                            allowClear
                                            size="large"
                                            placeholder="Contraseña"
                                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        />
                                    </Form.Item>   
                                    <Form.Item >
                                        <Button 
                                            type="primary" 
                                            shape="round" 
                                            htmlType="submit"
                                            icon={<LoginOutlined />} size='large'
                                        >
                                            Ingresar
                                        </Button>
                                    </Form.Item>
                                    
                                   
                                </Form>
                            </Space>
                        </Card>
                    </div>
                }
            </>
        );
    }
}

export default Login;