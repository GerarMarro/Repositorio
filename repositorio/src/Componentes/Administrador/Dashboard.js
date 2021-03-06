import React from 'react';
import { Card, Col, Row, Result } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import CrearOrganizacion from './CrearOrganizacion'
import CrearDepartamentos from './CrearDepartamentos'
import Notificaciones from '../../Notificaciones';
import VerOrganizacion from './VerOrganizacion'
import Mensajes from './Mensajes';
//import { AllUsers } from '../../Datos/requests';


class Dashboard extends React.Component {
    state = {
        usuarios: []
    }

    /**Eventos de controles */
    

    render(){
        return(
            <>
                <div style={{  width:"100%", marginRight:"15px" }} >
                    <Row gutter={16} hidden={this.props.sesion === 2 ? true : false}>
                        <Col span={12} style={{height:"100%"}}>
                            <Card title="Crear Organización" style={{height:"100%"}} bordered={true}>
                                <CrearOrganizacion update={this.props.update} />
                            </Card>
                        </Col>
                        <Col span={12} style={{height:"100%"}}>
                            <Card title="Crear Departamentos" style={{height:"100%"}} bordered={true}>
                                <CrearDepartamentos update={this.props.update} admin={this.props.admin} />
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                        <Col span={12} style={{height:"460px"}} hidden={this.props.sesion === 2 ? true : false}>
                            <Card title="Tus Organizaciones" style={{height:"100%"}} bordered={true}>
                                <VerOrganizacion update={this.props.update} />
                            </Card>
                        </Col>
                        <Col span={this.props.sesion === 2 ? 24 : 12} >
                            <Card title="Últimos Movimientos" style={ {height:"100%"}} bordered={true}>
                                { this.props.notificaciones.length === 0 ? 
                                <Result 
                                    title={"No hay notificaciones"} 
                                    subTitle={"Las notificaciones se eliminan autoáticamente cada 5 días o puedes probar recargargando la página"} 
                                    icon={<NotificationOutlined style={{color:"green"}} />}
                                />
                                : <Notificaciones notificaciones={this.props.notificaciones} />}
                                
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