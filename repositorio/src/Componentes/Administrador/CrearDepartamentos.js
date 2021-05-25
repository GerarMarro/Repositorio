import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { empresasxAdmin, crearDepartamento } from '../../Datos/requests';

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

class CrearDepartamentos extends React.Component {
    
    state={
        empresas:[]
    }

    componentDidMount(){
        empresasxAdmin(this.props.admin._id)
        .then(res =>{
            this.setState({
                empresas: res.data
            }, ()=>{
                //console.log(this.state);
            });
        })
        .catch(err =>{
            console.log(err);
        })
    }

    formRef = React.createRef();
   
    onFinish = (values) => {
        message.loading("Creando departamento");
        var datos ={
            nombre: values.nombre,
            empresa: values.empresa,
            admin: localStorage.getItem('id')
        }
        crearDepartamento(datos)
        .then(res =>{
            message.success("Departamento creado");
            var sesion ={
                header: "Dashboard",
                action: "Dashboard",
                menu: '1'
            }
            localStorage.setItem('state', JSON.stringify(sesion));
            window.location.reload();
        })
        .catch(err =>{
            console.log(err);
        })
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
            <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                <Form.Item
                    name="empresa"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido"
                        },
                    ]}
                >
                    <Select
                    
                        placeholder="Selecciona una organización"
                        onChange={this.onGenderChange}
                        allowClear
                    >
                        { this.state.empresas.map((e, index)=>
                            <Option key={index} value={e._id}>{e.nombre}</Option>

                        )}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="tipo"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                    initialValue="1"
                >
                    <Select
                        disabled
                        placeholder="Selecciona tipo de departamento"
                        
                        allowClear
                    >
                        <Option value="1" >Escritura</Option>
                    </Select>
                </Form.Item>
                
                <Form.Item
                    name="nombre"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido"
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
                                        message: "Este campo es requerido"
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