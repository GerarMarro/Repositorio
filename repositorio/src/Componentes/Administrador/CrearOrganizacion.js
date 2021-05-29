import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { crearEmpresa } from '../../Datos/requests';
import {notificacion} from '../Funciones';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 0 },
};


const Formulario = ({update}) =>{
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
            var titulo = "Creación de nueva organización completada!";
            var descripcion = "Se ha creado la organización "+datos.empresa+"."
            notificacion(titulo, descripcion);
            form.resetFields();
            var sesion ={
                header: "Dashboard",
                action: "Dashboard",
                menu: '1'
            }
            localStorage.setItem('state', JSON.stringify(sesion));
            update();
            window.location.reload();
        }).catch(err =>{
            message.error("Algo salió mal!")
            console.log(err);
        })
        
    };

    
    return (
    <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} initialValues>
        <Form.Item 
            name={'organizacion'} 
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
            <Input placeholder="Nombre de organización" />
        </Form.Item>
        <Form.Item 
            name={'lectura'} 
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
            <Input placeholder="Departamento de lectura" />
        </Form.Item>
        <Form.Item 
            name={'escritura'} 
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
       return <Formulario update={this.props.update}/>
    }

}

export default CrearOrganizacion;