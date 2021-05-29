import React from 'react';
import { Typography, Card, Radio, Space, Row, Button} from 'antd';
import { empresasxAdmin, ModDependencias } from '../../Datos/requests';
import { SaveOutlined, UserDeleteOutlined } from '@ant-design/icons';
import {notificacion} from '../Funciones';

const { Title } = Typography;

class CambiarOrg extends React.Component{
    
    state = {
        empresas : [],
        emp: {},
        usuario: {},
        departamentos: [],
        newDep: "0",
        newEmp: false,
        nameU: "",
        nameDep: "",
        nameEmp: ""
    }

    componentDidMount(){
        empresasxAdmin(localStorage.getItem('id'))
        .then(res =>{
            this.setState({
                empresas: res.data,
                usuario: this.props.usuario,
                emp: this.props.usuario.empresa,
                departamentos: this.props.usuario.empresa.departamentos,
                newDep: this.props.usuario.idDep,
                nameU: this.props.usuario.usuario
            })
        })
        .catch(err => console.error(err))
    }

    cambiarRad = (e) =>{
        this.setState({
            newDep: e.target.value,
            newEmp: false
        });
    }

    cambiarDependencias = () =>{
        let this2 = this;
        var datos ={
            nombre: this.state.nameU,
            departamento: this.state.newDep,
            isempresa: this.state.newEmp,
            id: this.props.usuario._id,
            oldemp: this2.state.emp.nombre,
            newemp: this2.state.nameEmp,
            olddep: this2.props.usuario.departamento,
            newdep: this2.state.nameDep
        }
        console.log(datos);
        ModDependencias(datos)
        .then(res =>{
            var titulo ="Transferencia de usuario";
            var descripcion = "";
            if (datos.isempresa) {
                descripcion ="Se ha transferido a " + this.props.usuario.nombre + " " + this.props.usuario.apellido +" de la empresa "+
                this2.state.emp.nombre + " a " + this2.state.nameEmp + " en el departamento de " + this2.state.nameDep;    
            }else{
                descripcion ="Se ha transferido a " + this.props.usuario.nombre + " " + this.props.usuario.apellido + " del departamento "+
                this2.props.usuario.departamento + " a " + this2.state.nameDep;
            }
            this2.props.cerrarmodal();
            notificacion(titulo, descripcion);
        })
        .catch()
    }

    render(){
        return (
            <> 
                <Row>
                    <div style={{width:"50%"}}>
                        <Card  
                            className="org"
                            style={{height:"100%"}}
                            title={this.state.nameU}
                            actions={[
                                <SaveOutlined />, 
                                <UserDeleteOutlined onClick={() =>{
                                    this.props.eliminar(this.state.usuario)
                                }} 
                        />]}>
                            <Card.Grid 
                                style={{textAlign:"center", width:"100%", height:"100%"}} 
                                key={"1"}
                            >
                                <Title level={4}>Empresa Actual: {this.state.emp.nombre} </Title>
                                <Radio.Group style={{textAlign:"left"}} onChange={this.cambiarRad} value={this.state.newDep}>
                                    <Space direction="vertical">
                                    {  this.state.departamentos.map((dep, index) =>
                                        <Radio value={dep._id} key={index} onChange={() =>{
                                            this.setState({nameDep:dep.nombre})
                                        }}>{dep.nombre}</Radio>
                                    ) }
                                    </Space>
                                </Radio.Group>
                            </Card.Grid>
                        </Card>
                    </div>
                    <div className="json">
                        <Card>
                            { this.state.empresas.filter(x => x._id !== this.state.emp._id).map((empresa, index) =>
                                <Card.Grid 
                                    style={{textAlign:"center", width:"100%"}} 
                                    key={index}
                                >
                                    <Title level={4}> {empresa.nombre} </Title>
                                    <Radio.Group style={{textAlign:"left"}} value={this.state.newDep} onChange={ (e) =>{
                                        var username = this.state.usuario.usuario.split("@");
                                        var user = username[0];
                                        this.setState({
                                            valorDep: "0",
                                            newDep: e.target.value,
                                            newEmp: true,
                                            nameU: user + "@" + empresa.nombre.replace(" ", "_"),
                                            nameEmp: empresa.nombre
                                        });
                                    }}>
                                        <Space direction="vertical">
                                        { empresa.departamentos.map((dep, index) =>
                                            <Radio value={dep._id} key={index} onChange={() =>{
                                                this.setState({nameDep:dep.nombre})
                                            }}>{dep.nombre}</Radio>
                                        ) }
                                        </Space>
                                    </Radio.Group>
                                    
                                </Card.Grid>
                            ) }
                        </Card>
                    </div>
                </Row>
                <br />
                <div style={{textAlign:"right", width:"100%"}}>
                    <Button type="primary" icon={<SaveOutlined />} onClick={this.cambiarDependencias}>Cambiar</Button>
                </div>
            </>
        )
    }
}

export default CambiarOrg;