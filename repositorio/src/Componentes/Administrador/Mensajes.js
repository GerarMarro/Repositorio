import React from 'react';
import { Form, Button, Input, message, Select } from 'antd';
import { AllUsers, EnviarCorreo } from '../../Datos/requests';
import { SendOutlined } from '@ant-design/icons';
import '../../../src/App.css';
import {notificacion} from '../Funciones';

//const { TextArea } = Input;

const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 0 },
};


class Mensajes extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
        usuarios: []
    };

    componentDidMount(){
        AllUsers(localStorage.getItem('id'))
        .then(res => { 
            this.setState({usuarios:res.data}) 
        })
        .catch(err =>{
            console.log(err)
        })
    };

    onFinish = (values) => {
        message.loading("Enviando mensaje")
        var datos ={
            de: localStorage.getItem('idUser'),
            para: values.para,
            cc: values.cc,
            cco: values.cco,
            asunto: values.asunto,
            mensaje: values.mensaje,
        }
        EnviarCorreo(datos)
        .then(res => {
            var titulo = "El correo ha sido enviado"
            var descripcion = "Su correo ha sido enviado a todos los destinatarios, espera su respuesta!";
            notificacion(titulo, descripcion);
        })
        .catch(err =>{
            console.log(err)
            message.error("Sucedio algo malo, intenta mása tarde")
        })
    };

    render() {

        return (
            <>
                <Form {...layout} name="nest-messages" onFinish={this.onFinish} initialValues>
                    <Form.Item name="para" key="para" rules={[{ required: true }]}>
                        <Select
                            placeholder="Para"
                            onChange={this.handleChange}
                            allowClear
                        >
                            { this.state.usuarios.map((u, index) =>
                                <Option key={index} value={u.correo}>{u.usuario} { u.admin ? "(Administrador)": "" }</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item name="cc" key="cc" rules={[{ required: false }]}>
                        <Select
                            placeholder="CC"
                            allowClear
                            mode="tags"
                            onChange={this.handleChange}
                        >
                            { this.state.usuarios.map((u, index) =>
                                <Option key={index} value={u.correo}>{u.usuario} { u.admin ? "(Administrador)": "" }</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item name="cco" key="cco" rules={[{ required: false }]}>
                        <Select
                            placeholder="CCO"
                            allowClear
                            onChange={this.handleChange}
                            mode="tags"
                        >
                            { this.state.usuarios.map((u, index) =>
                                <Option key={index} value={u.correo}>{u.usuario} { u.admin ? "(Administrador)": "" }</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name="asunto" 
                        ules={[
                            {
                                required: true,
                                message: "Este campo es requerido"
                            },
                            {
                                pattern: "[A-Za-z]{1,}",
                                message: "Este campo solo admite letras"
                            }
                        ]}
                    >
                        <Input placeholder="Asunto" />
                    </Form.Item>
                    <Form.Item 
                        name="mensaje"
                        
                    >
                        <Input.TextArea placeholder="Mensaje" rows={4} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                            Enviar
                        </Button>
                    </Form.Item>
                </Form>
            </>
        );
    }
}

export default Mensajes;