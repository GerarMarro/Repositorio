import React from 'react';
import { Card, Col, Row, Select } from 'antd';
import CrearOrganizacion from './CrearOrganizacion'
import CrearDepartamentos from './CrearDepartamentos'
import Notificaciones from '../../Notificaciones';
import VerOrganizacion from './VerOrganizacion'
import Mensajes from './Mensajes';
import { AllUsers } from '../../Datos/requests';

const { Option } = Select;

class Dashboard extends React.Component {
    state = {
        usuarios: []
    }
    /** Sacar usuarios de la api */
    componentDidMount(){       
        AllUsers(this.props.admin._id)
        .then(res =>{
            this.setState({
                usuarios: res.data
            }, () =>{
                console.log(this.state);
            })
        })
        .catch(err =>{
            console.log(err);
        })
    }

    /**Eventos de controles */
    
    onChange = (value) =>{
        console.log(value);
    }

    render(){
        return(
            <>
                <div style={{  width:"100%", marginRight:"15px" }}>
                    <Row gutter={16}>
                        <Col span={12} style={{height:"100%"}}>
                            <Card title="Crear Organización" style={{height:"100%"}} bordered={true}>
                                <CrearOrganizacion />
                            </Card>
                        </Col>
                        <Col span={12} style={{height:"100%"}}>
                            <Card title="Crear Departamentos" style={{height:"100%"}} bordered={true}>
                                <CrearDepartamentos admin={this.props.admin} />
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                        <Col span={12} style={{height:"460px"}}>
                            <Card title="Tus Organizaciones" style={{height:"100%"}} bordered={true}>
                                <VerOrganizacion />
                            </Card>
                        </Col>
                        <Col span={12} >
                            <Card title="Últimos Movimientos" style={{height:"100%"}} bordered={true}>
                                { this.props.notificaciones.length === 0 ? "En caso de no cargar, recargue la pagina": <Notificaciones notificaciones={this.props.notificaciones} />}
                                
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                        <Col span={24} style={{height:"530px"}}>
                            <Card 
                                title="Mensajes" 
                                style={{height:"100%"}} 
                                bordered={true}
                                extra={
                                    <Select
                                        showSearch
                                        style={{ width: 300 }}
                                        placeholder="Selecciona el usuario para chatear"
                                        optionFilterProp="children"
                                        onChange={this.onChange}
                                        //onChange={onChange}
                                        //onFocus={onFocus}
                                        //onBlur={onBlur}
                                        //onSearch={onSearch}
                                        filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        { this.state.usuarios.map((u, index) =>
                                            <Option value={u.id} key={index}>{u.username}</Option>
                                        ) }
                                    </Select>
                                }
                                >
                                <Mensajes />
                            </Card>
                        </Col>
                       
                    </Row>
                </div>
            </>
        );
    }
}


export default Dashboard;