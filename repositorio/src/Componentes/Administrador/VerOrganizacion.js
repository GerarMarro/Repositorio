import React from 'react';
import { Collapse, List, Typography, Avatar } from 'antd';
import '../../../src/App.css';
import { Organizacion } from '../../Datos/requests';
import {coloresRandom} from '../Funciones';

const { Panel } = Collapse;
const { Text } = Typography;

class VerOrganizacion extends React.Component {

    state ={
        organizacion : []
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

    render() {
        return (
            <div className="org">
                <Collapse>
                    {this.state.organizacion.map((e, index)=>
                        <Panel header={e.nombre} key={index}>
                            <Collapse>
                                {e.departamentos.map((d, index)=>
                                    <Panel header={d.nombre} key={index}>
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
            </div>
        )
    }
}

export default VerOrganizacion;