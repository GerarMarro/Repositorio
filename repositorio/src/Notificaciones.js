import React from 'react';
import { List, Avatar, Empty, Typography, Spin } from 'antd';
import {coloresRandom} from './Componentes/Funciones';

const { Text } = Typography;

class Notificaciones extends React.Component {

    state = {
        data: [],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        this.setState({
            data: this.props.notificaciones.reverse()
        }, ()=>{
            //console.log(this.state.data)
        });
    }

    controllerAvatar = (item, nombre, apellido) =>{
        if (item.foto !== undefined && item.foto !== 0) {
            return <Avatar src={item.foto.thumbUrl} />;
        }else{
            var letras = nombre.substr(0, 1) + apellido.substr(0, 1);
            return <Avatar style={{backgroundColor:coloresRandom()}}>{letras}</Avatar>;
        }
    }

    componentRender = () =>{
        if (this.state.data !== null && this.state.data !== undefined) {
            return(
                <>
                    <div className="demo-infinite-container" style={{width:"100%", height:"350px"}}>
                    
                        <List
                            dataSource={this.state.data}
                            size="small"
                            pagination={{
                                onChange: page => {
                                  console.log(page);
                                },
                                pageSize: 3,
                            }}
                            renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                avatar={
                                    item.usuario_registrado !== null ? this.controllerAvatar(item.usuario_registrado, item.usuario_registrado.nombre, item.usuario_registrado.apellido) : this.controllerAvatar(item.administrador, item.administrador.nombre, item.administrador.apellido)
                                }
                                title={<Text style={{cursor:"default"}}>{item.titulo}</Text>}
                                description={item.descripcion}
                                />
                                
                                <Text level={'6'} style={{marginLeft:"20px"}}>{ new Date(item.created_at).toLocaleDateString()+ " " + new Date(item.created_at).getHours()+":"+new Date(item.created_at).getMinutes()}</Text>
                            </List.Item>
                            )}
                        >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                <Spin />
                                </div>
                            )}
                        </List>
                    </div>
                </>
            );
        }else{
            return (
                <Empty description={"No hay notificaciones que mostrar"} />
            )
        }
    }


    render(){
        return(
            <this.componentRender />
        )
    }
}

export default Notificaciones;