import React from 'react';
import { Form, Button, Input, message, Select } from 'antd';
import moment from 'moment';
import '../../../src/App.css';

//const { TextArea } = Input;

const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 0 },
};

const validateMessages = {
    required: 'El campo ${name} es requerido',
};
const onFinish = (values) => {
    message.loading("Creando empresa")
    var datos ={
        empresa: values.organizacion,
        lectura: values.lectura,
        escritura: values.escritura,
        admin: localStorage.getItem('id')
    }
   
};
class Mensajes extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {

        return (
            <>
                <Form {...layout} name="nest-messages" onFinish={onFinish} initialValues validateMessages={validateMessages}>
                    <Form.Item name="para" rules={[{ required: true }]}>
                        <Select
                            placeholder="Para"
                            allowClear
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="cc" rules={[{ required: true }]}>
                        <Select
                            placeholder="CC"
                            allowClear
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="Asunto" rules={[{ required: true }]}>
                        <Input placeholder="Asunto" pattern="/^[A-Za-z0-9\s]+$/g" />
                    </Form.Item>
                    <Form.Item name="Mensaje">
                        <Input.TextArea placeholder="Mensaje" rows={4} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Enviar
                        </Button>
                    </Form.Item>
                </Form>
            </>
        );
    }
}

export default Mensajes;