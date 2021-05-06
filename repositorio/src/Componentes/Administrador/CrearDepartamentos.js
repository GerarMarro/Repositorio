import React from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 0 },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const validateMessages = {
    required: 'El campo ${name} es requerido',
};

class CrearDepartamentos extends React.Component {
    formRef = React.createRef();
    onGenderChange = (value) => {
        switch (value) {
            case 'male':
                this.formRef.current.setFieldsValue({
                    note: 'Hi, man!',
                });
                return;

            case 'female':
                this.formRef.current.setFieldsValue({
                    note: 'Hi, lady!',
                });
                return;

            case 'other':
                this.formRef.current.setFieldsValue({
                    note: 'Hi there!',
                });
        }
    };
    onFinish = (values) => {
        console.log(values);
    };
    onReset = () => {
        this.formRef.current.resetFields();
    };
    onFill = () => {
        this.formRef.current.setFieldsValue({
            note: 'Hello world!',
            gender: 'male',
        });
    };
    

    render() {
        return (
            <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name="departamento"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        placeholder="Selecciona una organización"
                        onChange={this.onGenderChange}
                        allowClear
                    >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="tipo"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        disabled
                        placeholder="Selecciona tipo de departamento"
                        onChange={this.onGenderChange}
                        allowClear
                        defaultValue="1"
                    >
                        <Option value="1" >Escritura</Option>
                    </Select>
                </Form.Item>
                
                <Form.Item
                    name="nombre"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder="Nombre de departamento" />
                </Form.Item>
                
                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                >
                    {({ getFieldValue }) =>
                        getFieldValue('departamento') === 'other' ? (
                            <Form.Item
                                name="customizeGender"
                                label="Customize Gender"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Crear
                    </Button>
                </Form.Item>
            </Form>
        );
    }

}

export default CrearDepartamentos;