import React from 'react';
import { Card, Col, Row } from 'antd';
import CrearOrganizacion from './CrearOrganizacion'
import CrearDepartamentos from './CrearDepartamentos'
import Notificaciones from '../../Notificaciones';
import VerOrganizacion from './VerOrganizacion'

class Dashboard extends React.Component {
    
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
                                <CrearDepartamentos />
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                        <Col span={12} style={{height:"100%"}}>
                            <Card title="Tus Organizaciones" style={{height:"100%"}} bordered={true}>
                                <VerOrganizacion />
                            </Card>
                        </Col>
                        <Col span={12} style={{height:"100%"}}>
                            <Card title="Mensajes" style={{height:"100%"}} bordered={true}>
                                Card content
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                        <Col span={24} >
                            <Card title="Últimos Movimientos" style={{height:"80%"}} bordered={true}>
                                <Notificaciones notificaciones={this.props.notificaciones} />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}


export default Dashboard;