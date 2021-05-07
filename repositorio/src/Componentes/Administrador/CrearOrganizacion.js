import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { crearEmpresa } from '../../Datos/requests';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 0 },
};

const validateMessages = {
    required: 'El campo ${name} es requerido',
};

const Formulario = ()=>{
    const [form] = Form.useForm();
    
    const onFinish = (values) => {
        message.loading("Creando empresa")
        var datos ={
            empresa: values.organizacion,
            lectura: values.lectura,
            escritura: values.escritura,
            admin: localStorage.getItem('id')
        }
        crearEmpresa(datos)
        .then(res =>{
            message.success("Empresa creada");
            form.resetFields();
            var sesion ={
                header: "Dashboard",
                action: "Dashboard",
                menu: '1'
            }
            localStorage.setItem('state', JSON.stringify(sesion));
            window.location.reload();
        }).catch(err =>{
            message.error("Algo salió mal!")
            console.log(err);
        })
        
    };

    
    return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} initialValues validateMessages={validateMessages}>
        <Form.Item name={'organizacion'} rules={[{ required: true }]}>
            <Input placeholder="Nombre de organización" />
        </Form.Item>
        <Form.Item name={'lectura'} rules={[{ required: true }]}>
            <Input placeholder="Departamento de lectura" />
        </Form.Item>
        <Form.Item name={'escritura'} rules={[{ required: true }]}>
            <Input placeholder="Departamento de escritura" />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
                Crear
            </Button>
        </Form.Item>
    </Form>
    );
} 

class CrearOrganizacion extends React.Component{
    
    render(){
       return <Formulario />
    }

}

export default CrearOrganizacion;