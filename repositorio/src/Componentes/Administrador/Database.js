import React from 'react';
import { Card, Row, Button, message, Table, Typography, Modal, Tooltip } from 'antd';
import { FolderAddOutlined, UndoOutlined, RetweetOutlined } from '@ant-design/icons';
import { crearBackup, restaurarBK, getDbs } from '../../Datos/requests';

const {Text} = Typography;

class Database extends React.Component{

    state={
        files: [],
        modal: false,
        data: []
    }

    componentDidMount(){
        getDbs()
        .then(res =>{
            this.setState({ data: res.data })
        })
        .catch(err =>{
            console.log(err);
        })
    }

    generarBk = () =>{
        message.loading("Generando...");
        var hoy = new Date();
        var hora = String(hoy.getHours()) + String(hoy.getMinutes()) + String(hoy.getSeconds());
        crearBackup(hora)
        .then(res =>{
            message.success("Backup generado: C:/mongodump/" + hora, );
        })
        .catch(err =>{
            message.error("Algo salió mal");
            console.error(err);
        })
        this.componentDidMount();
    }

    restaurarBaKp = (ruta)=>{
        message.loading("Restaurando...");
        restaurarBK(ruta)
        .then(res =>{
            message.success("Base de datos recuperada");
        })
        .catch(err =>{
            message.error("Algo salió mal.")
        })
    }

    closeModa = () =>{
        this.setState({
            modal: false
        })
    }

    columns = [
        {
          title: 'Id',
          dataIndex: '_id',
          key: "id"
        },
        {
          title: 'Fecha',
          dataIndex: 'created_at',
          key: "fecha",
          defaultSortOrder: 'ascend',
          sorter: (a, b) => {
              return new Date(a.created_at) - new Date(b.created_at)
            },
          render: (record) => {
              return <Text>{new Date(record).toLocaleDateString()}</Text>
          }
        },
        {
          title: 'Nombre',
          dataIndex: 'nombre',
          key: "nombre",
          onFilter: (value, record) => record.address.indexOf(value) === 0,
        },
        {
            title: 'Acciones',
            render: (record) =>{
                return (
                    <Tooltip title="Restaurar Base de datos" color={'green'} key={1}>
                        <RetweetOutlined style={{color:"green", cursor:"pointer"}} onClick={ () =>{
                            message.loading("Restaurando...");
                            console.log(record)
                            restaurarBK(record.nombre)
                            .then(res =>{
                                message.success("Base de datos recuperada");
                                window.location.reload();
                                this.props.cerrarSesion();
                            })
                            .catch(err =>{
                                message.error("Algo salió mal.")
                            })
                        }} />
                    </Tooltip>
                )
            }
        }
    ];
    render() {
        return (
            <>
                <Card title="Base de datos" style={{width:"80%"}}>
                    <Row>
                        <Card.Grid 
                            style={{textAlign:"center", width:"50%"}} 
                            key="1"
                        >
                            <Card title="Crear Backup">
                                <Button type="primary" onClick={this.generarBk} icon={<FolderAddOutlined />}>Generar</Button>
                            </Card>
                        </Card.Grid>
                        <Card.Grid 
                            style={{textAlign:"center", width:"50%"}} 
                            key="2  "
                        >
                            <Card title="Restaurar Backup">
                                <Button type="primary" onClick={ () => {this.setState({modal:true})}} icon={<UndoOutlined />}>Restaurar BD</Button>
                            </Card>
                        </Card.Grid>
                    </Row>
                </Card>
                <Modal 
                    visible={this.state.modal}
                    onCancel={this.closeModa}
                    width={1000}
                    footer={
                        <>
                            <Button onClick={this.closeModa}>Cancelar</Button>
                        </>
                    }
                >
                    <Table columns={this.columns} dataSource={this.state.data} pagination={{pageSize: 5}} />
                </Modal>
            </>
        )
    }
}

export default Database;