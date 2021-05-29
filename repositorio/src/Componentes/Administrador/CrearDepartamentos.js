import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { empresasxAdmin, crearDepartamento } from '../../Datos/requests';
import {notificacion} from '../Funciones';

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
            var titulo = "Creación de nuevo departamento";
            var descripcion = "Se ha creado el nuevo departamento "+datos.nombre+" para la empresa "+this.state.empresas.filter(x => x._id===values.empresa)[0].nombre;
            notificacion(titulo, descripcion);
            var sesion ={
                header: "Dashboard",
                action: "Dashboard",
                menu: '1'
            }
            localStorage.setItem('state', JSON.stringify(sesion));
            this.onReset();
            this.props.update();
            window.location.reload();
        })
        .catch(err =>{
            console.log(err);
        })
    };

    onReset = () => {
        this.formRef.current.resetFields();
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
                        {
                            pattern:"[A-Za-z0-9]{1,}",
                            message:"Este campo solo admite letras y números"
                        }
                    ]}
                >
                    <Input placeholder="Nombre de departamento" />
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