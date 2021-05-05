import React from 'react';
import { Collapse, Card } from 'antd';
import { FileOutlined } from '@ant-design/icons'
import TablaDatos from './TablaDatos';

const { Panel } = Collapse;

class VerDatos extends React.Component {

    state ={
        info: [],
        datos: [],
        existe: false,
        headers: []
    }

    callback = (key) => {
        console.log(key);
    }


    crearTabla = () =>{
        //console.log(arreglo[0].hoja)
        if (this.props.data[0].hoja === undefined) {
            console.log(this.props.data);
            return (
                <>
                    <Card>
                        <TablaDatos datos={this.props.data} />
                    </Card>
                </>
                
            )
        }else{
            return (
                <>
                    <Card style={{height:"100%"}}>
                        <Collapse style={{height:"100%", width:"100%"}} defaultActiveKey="0" expandIconPosition="right" onChange={this.callback}>
                            {this.props.data.map((h, index)=>
                                <Panel key={index} header={h.hoja} extra={<FileOutlined />}>
                                    <TablaDatos datos={h.datos} />
                                </Panel>
                            )}
                        </Collapse>
                    </Card>
                </>
                
            )
            
        }
        
        
        /*console.log(typeof this.props.data[0])
        console.log(this.state.datos[0].datos)*/
    }

    render(){
        return (
            <>
                { this.props.data !== undefined ? <this.crearTabla /> : "No hay" }
            </>
        )
    }

}

export default VerDatos;