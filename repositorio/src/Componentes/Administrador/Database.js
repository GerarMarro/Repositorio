import React from 'react';
import { Card, Row, Button, message, Upload, Typography } from 'antd';
import { FolderAddOutlined, UndoOutlined } from '@ant-design/icons';
import { crearBackup, restaurarBK } from '../../Datos/requests';

const { Text } = Typography;

class Database extends React.Component{

    state={
        files: [],
    }
    generarBk = () =>{
        message.loading("Generando...");
        var hoy = new Date();
        var hora = String(hoy.getHours()) + String(hoy.getMinutes()) + String(hoy.getSeconds());
        crearBackup(hora)
        .then(res =>{
            message.success("Backup generado: C:/mongodump/hora", );
        })
        .catch(err =>{
            message.error("Algo salió mal");
            console.error(err);
        })
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
                            <Card title="Crear Backup">
                                <Upload 
                                    directory
                                    maxCount={1}
                                    showUploadList={false}
                                    onPreview={()=>{
                                        return false;
                                    }}
                                    
                                   //customRequest={  }
                                    beforeUpload={(directory) =>{
                                        this.setState({
                                            files: this.state.files.push(directory)
                                        });
                                        if (this.state.files.length === 1) {
                                            var ruta = String(this.state.files[0].webkitRelativePath).split("/");
                                            if (ruta.length !== 3 && ruta[1] !== "emergentes") {
                                                alert("Se tiene que escoger una ruta válida")
                                                message.error("Se tiene que ecoger una ruta válida")
                                                return false;
                                            }else{
                                                restaurarBK(ruta[0])
                                                .then(res=>{
                                                    message.success("BD restaurada");
                                                    window.location.reload();
                                                })
                                                .catch(err =>{
                                                    message.error("Algo salió mal")
                                                })
                                                return false;
                                            }
                                        }
                                       //restaurarBK(directory.webkitRelativePath);
                                        return false;
                                    }}
                                >
                                    <Button type="primary" icon={<UndoOutlined />}>Restaurar BD</Button>
                                </Upload>
                                <br />
                                { this.state.files.length ? 
                            <Text>{this.state.files[0].webkitRelativePath}</Text>: 
                            <Text>Seleccione carpeta</Text>}
                            </Card>
                        </Card.Grid>
                    </Row>
                </Card>
            </>
        )
    }
}

export default Database;