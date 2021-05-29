import React from 'react';
import { Collapse, List, Typography, Avatar, Modal, Form, Input, Button, Radio, message } from 'antd';
import '../../../src/App.css';
import { SettingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Organizacion, ModificarOrgDep, EliminarObjeto } from '../../Datos/requests';
import {coloresRandom, notificacion } from '../Funciones';

const { Panel } = Collapse;
const { Text } = Typography;
const { confirm } = Modal;

class VerOrganizacion extends React.Component {

    state ={
        organizacion : [],
        modal: false,
        nombre: "",
        id: "",
        cambio: "",
        departamento: [],
        empresa: {}
    }

    componentDidMount(){
        Organizacion(localStorage.getItem('id'))
        .then(res =>{
            this.setState({
                organizacion: res.data
            }, ()=>{
                //console.log(this.state.organizacion);
            })
        })
        .catch(err =>{
            console.log(err);
        })
    }

    setModalVisible = () =>{
        
        this.setState({
            modal: true
        })
    }

    setModalInvisible = () =>{
        this.setState({
            modal: false
        })
    }

    modificarObj = (values) =>{
        var datos = {
            nombre: values.nombre,
            tipo: values.tipo,
            id: this.state.id
        }
        ModificarOrgDep(datos)
        .then(res =>{
            this.componentDidMount();
            if (this.state.cambio === "o") {
                var titulo = "Se ha modificado la organización " + this.state.nombre;
                var descripcion = "Se ha modificado la organización de "+this.state.nombre+" a "+datos.nombre+"."
                notificacion(titulo, descripcion)
            }else{
                var tituloD = "Se ha modificado el departamento " + this.state.nombre;
                var descripcionD = "Se ha modificado el departamento de "+this.state.nombre+" a "+datos.nombre+"."
                notificacion(tituloD, descripcionD)
            }
            var sesion ={
                header: "Dashboard",
                action: "Dashboard",
                menu: '1'
            }
            localStorage.setItem('state', JSON.stringify(sesion));
            this.props.update();
            this.setModalInvisible();
        }).catch(err =>{
            console.log(err);
        })
    }

    validarTipo0 = () => {
        if ( this.state.cambio === "o") {
            return true;
        }else {
            let tipo0 = this.state.empresa.departamentos.filter(x=>x.tipo === 0);
            if (this.state.departamento.tipo === 0 && tipo0.length > 1) {
                return true;
            }else{
                let tipo1 = this.state.empresa.departamentos.filter(x=>x.tipo === 1);
                if (tipo1.length > 1 && this.state.departamento.tipo === 1) {
                    return true;
                }else{
                    return false;
                }
            }
        }
    }

    eliminarObj = () =>{
        let this2 = this;
        var descripcion = "";let titulo = ""; let descripcionNoti = "";
        if (this.state.cambio === "o") {
            descripcion = "Una vez eliminada la organización no se podrán recuperar los datos pérdidos, recuerda que eliminarás tanto departamentos como usuarios, puedes transferirlos en el área de ver usuarios pero te sugerimos que mejor no elimines esto";
            titulo = "Se ha eliminado la organización " + this.state.nombre;
            descripcionNoti = "Se ha eliminado la organización de "+this.state.nombre+" correctamente.";
        }else{
            descripcion = "Una vez eliminado el departamento se eliminarán también los usuarios contenidos dentro de ellos, puedes transferirlos en el área de ver usuarios pero te sugerimos que mejor no elimines esto";
            titulo = "Se ha eliminado el departamento " + this.state.nombre;
            descripcionNoti = "Se ha eliminado el departamento "+this.state.nombre+" correctamente.";
        }
        confirm({
            title: '¿Estás completamente seguro de que quieres eliminar esto?',
            icon: <CloseCircleOutlined style={{color:"red"}} />,
            content: descripcion,
            okText: 'Sí, estoy seguro',
            okType: 'danger',
            okButtonProps:{
                type:"primary"
            },
            cancelText: 'Cancelar',
            onOk() {
                message.loading("Eliminando dependencias, esto puede durar un poco...")
                if (this2.validarTipo0()) {
                    console.log("Entro")
                    EliminarObjeto(this2.state.cambio, this2.state.id)
                    .then(res=>{
                        localStorage.setItem('state', JSON.stringify(sesion));
                        this2.componentDidMount();
                        this2.props.update();
                        this2.setModalInvisible();
                        notificacion(titulo, descripcionNoti);
                    })
                    .catch(err =>{
                        console.log(err);
                        message.error("Algo salió mal.");
                    })
                    var sesion ={
                        header: "Dashboard",
                        action: "Dashboard",
                        menu: '1'
                    }   
                }else{
                    message.error("Una empresa con menos de 2 departamentos no es posible, eliminala toda o cambiale nombre.")
                }   
            },
            onCancel() {
                this2.setModalInvisible();
            },

          });
    }

    render() {
        return (
            <div className="org">
                <Collapse>
                    {this.state.organizacion.map((e, index)=>
                        <Panel header={e.nombre} key={index} extra={<SettingOutlined onClick={event =>{
                            event.stopPropagation();
                            this.setState({
                                nombre: e.nombre,
                                id: e._id,
                                cambio: "o"
                            });
                            this.setModalVisible();
                        }}/>}>
                            <Collapse>
                                {e.departamentos.map((d, index)=>
                                    <Panel header={d.nombre} key={index} extra={<SettingOutlined onClick={event =>{
                                        event.stopPropagation();
                                        this.setState({
                                            nombre: d.nombre,
                                            id: d._id,
                                            cambio: "d",
                                            departamento: d,
                                            empresa: e
                                        });
                                        this.setModalVisible();
                                    }}/>}>
                                        <List 
                                            itemLayout="horizontal"
                                            dataSource={d.usuarios}
                                            renderItem={item => (
                                                <List.Item>
                                                  <List.Item.Meta
                                                    avatar={ item.foto === 0 ?   <Avatar style={{backgroundColor:coloresRandom()}} >{item.nombre.substr(0,1)+item.apellido.substr(0,1)}</Avatar>: <Avatar src={item.foto.thumbUrl} />}
                                                    title={<Text>{item.nombre} {item.apellido}</Text>}
                                                    description={
                                                        <div>
                                                            <Text><strong>Correo:</strong> {item.email}</Text>
                                                            <br />
                                                            <Text><strong>Usuario:</strong> {item.usuario}</Text>
                                                            <br />
                                                            <Text><strong>Creado en:</strong> {new Date(item.created_at).toLocaleDateString()}</Text>
                                                        </div>
                                                    }
                                                  />
                                                </List.Item>
                                              )}    
                                        />
                                    </Panel>
                                )}
                            </Collapse>
                        </Panel>
                    )}
                </Collapse>
                    <Modal 
                        destroyOnClose
                        title={"Modificar " + this.state.nombre} 
                        visible={this.state.modal} 
                        onCancel={this.setModalInvisible}
                        footer={
                            <></>
                        }
                    >
                        <Form onFinish={this.modificarObj}>
                            <Form.Item 
                                name="nombre" 
                                initialValue={this.state.nombre}
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
                                <Input />
                            </Form.Item>
                            <Form.Item name="tipo" initialValue={this.state.cambio}>
                                <Radio.Group disabled>
                                    <Radio value="o">Organización</Radio>
                                    <Radio value="d">Departamento</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item style={{textAlign:"end"}}>
                                <Button type="primary" htmlType="submit">Guardar</Button>
                                <Button type="primary" danger style={{marginLeft:"4px"}} onClick={this.eliminarObj}>Eliminar</Button>
                                <Button type="primary" style={{backgroundColor:"#ED9703", marginLeft:"4px"}} onClick={this.setModalInvisible}>Cancelar</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        )
    }
}

export default VerOrganizacion;