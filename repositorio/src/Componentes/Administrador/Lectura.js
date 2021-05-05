import React from 'react';
import { leerArchivo, todosDepartamentos } from '../../Datos/requests';
import { Card, Select, Space, Button, Breadcrumb, List, Descriptions, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import VerDatos from './verDatos';

const { Option } = Select;

class Lectura extends React.Component {
    
  state = {
    departamentos: [],
    departamentoesc: "",
    datos: [],
    archivo: [],
    visible: false,
    verdata: "",
    titulo: ""
  };

  componentDidMount(){ 
    todosDepartamentos(this.props.empresa._id)
    .then(res =>{
      this.setState({
        departamentos: res.data
      }, ()=>{
        //console.log(this.state.departamentos);
      })
    })    
  }
  
  onChange = (value) => {
    this.setState({departamentoesc: value}, ()=>{});
  }

  buscarDatos = () =>{
    leerArchivo(this.state.departamentoesc)
    .then(res =>{
      this.setState({
        datos: res.data.reverse()
      }, ()=>{
        //console.log(this.state.datos)
      })
    })
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  
  showModal = (e) => {
    
    this.setState({
      verdata: JSON.parse(e.target.name),
      visible: true,
      titulo: e.target.id
    }, ()=>{/*console.log(this.state.verdata)*/});
  };



  bread = 
  ( 
      <Breadcrumb>
          <Breadcrumb.Item>{this.props.empresa.nombre}</Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.departamento.nombre}</Breadcrumb.Item>
      </Breadcrumb>
  )
  render(){
    return (
      <>
        <Card title={this.bread} style={{ width: "90%" }}>
          <Space direction="vertical" style={{width:"100%"}}>
            <div style={{display:"flex"}}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Sleccione un departamento"
                optionFilterProp="children"
                onChange={this.onChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.departamentos.map((d, index)=>
                    <Option key={index} value={d._id}>{d.nombre}</Option>
                  )
                }
              </Select>
              <Button type="primary" onClick={this.buscarDatos} icon={<SearchOutlined />} />
            </div>
            <Card style={{ width: "100%" }}>
              <List
                size="large"          
                bordered
                pagination={{
                  onChange: page => {
                    console.log(page);
                  },
                  pageSize: 1,
                }}
                dataSource={this.state.datos}
                renderItem={item => 
                  <List.Item>
                  <List.Item.Meta
                    title={<a href={'#'} onClick={this.showModal} style={{color:"#0049B6"}} id={item.titulo} name={item.datos}>{item.titulo}</a>}
                    description={
                    <>
                      <Space direction="vertical" style={{width:"100%"}}>
                        <Descriptions bordered>
                          <Descriptions.Item label="Tipo">{ item.tipo === "csv" ? "CSV" : "Excel"}</Descriptions.Item>
                          <Descriptions.Item label="Creado por">{ item.usuarioprop ? item.administrador.nombre : item.usuarioprop.nombre }</Descriptions.Item>
                          <Descriptions.Item label="Subido en">{new Date(item.created_at).toLocaleDateString()}</Descriptions.Item>
                          <Descriptions.Item label="En">{ new Date(item.created_at).getHours()+":"+new Date(item.created_at).getMinutes()}</Descriptions.Item>
                          <Descriptions.Item label="Descripción">{ item.descripcion}</Descriptions.Item>
                        </Descriptions>
                      </Space>
                    </>}
                  />
                </List.Item>
            }
              />
            </Card>

          </Space>
        </Card>
        <Modal
          title={this.state.titulo}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={"90%"}
        >
          <VerDatos data={this.state.verdata} />
        </Modal>
      </>
    )
  }
}

export default Lectura;