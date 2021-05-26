import React from 'react';
import { Tabs, Card } from 'antd';
import { TableOutlined, UploadOutlined } from '@ant-design/icons';
import Escritura from './Escritura';
import TablaEscritura from './TablaEscritura';
import { TodosDatos } from '../../Datos/requests';

const { TabPane } = Tabs;
class MostrarEscritura extends React.Component{
    state ={
        dataSource: [],

    }
    
    componentDidMount(){
        TodosDatos(this.props.usuario._id)
        .then(res => {
            this.setState({
                dataSource: res.data
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    Recargar = () =>{
        this.componentDidMount();
    }

    render(){
        return(
            <>
                <Card style={{width:"90%"}}>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab={
                            <span>
                                <UploadOutlined />
                                Subir archivos
                            </span>
                        } key="1">
                            < Escritura departamento={this.props.departamento} usuario={this.props.usuario} tituloempresa={this.props.tituloempresa} reloadar={this.Recargar} />
                        </TabPane>
                        <TabPane tab={
                            <span>
                                <TableOutlined />
                                Registros
                            </span>
                        } key="2">
                            <TablaEscritura reloadar={this.Recargar} dataSource={this.state.dataSource.filter(x => x.departamento === this.props.departamento._id)} tituloempresa={this.props.tituloempresa} usuario={this.props.usuario} departamento={this.props.departamento} />
                        </TabPane>
                    </Tabs>
                </Card>
            </>
        )
    }
}

export default MostrarEscritura;