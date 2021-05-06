import React from 'react';
import { Form, Input, Button } from 'antd';

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
        console.log(values);
        form.resetFields();
    };

    
    return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} initialValues validateMessages={validateMessages}>
        <Form.Item name={'organizacion'} rules={[{ required: true }]}>
            <Input placeholder="Nombre de organización" />
        </Form.Item>
        <Form.Item name={'escritura'} rules={[{ required: true }]}>
            <Input placeholder="Departamento de lectura" />
        </Form.Item>
        <Form.Item name={'lectura'} rules={[{ required: true }]}>
            <Input placeholder="Departamento de lectura" />
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