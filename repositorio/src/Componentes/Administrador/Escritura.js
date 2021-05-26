import React from 'react';
import { Card, Input, Space, message, Button, Form, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons'
import { GuardarDatos, sobreDatos } from '../../Datos/requests';
import * as XLSX from 'xlsx';
import {notificacion} from '../Funciones';

const { TextArea } = Input;

class Escritura extends React.Component {
  
  state ={
    data: null,
    tipo: "",
    fileLoaded: "",
    fileName: "",
    operationInProgress: false,
    titulo: "",
    descripcion: ""
  }
  
  componentDidMount(){
    if (this.props.datos) {
      this.setState({
        data: this.props.datos.datos,
        descripcion: this.props.datos.descripcion,
        titulo: this.props.datos.titulo,
        tipo: this.props.datos.tipo
      })
    }
  }

  normFile = (file) => {
    try {

      const reader = new FileReader();
      let this2 = this;
      let nombre = file.name.split('.');
      this.setState({operationInProgress: true, fileLoadProgress: 0, fileLoaded:true, fileName:file.name, tipo:nombre[1]}, ()=>{});

      reader.onload = e => {
        const { result } = e.target;
        let json = "";
        if (file.name.endsWith('.xlsx')){
          let dataset = [];
          const workbook = XLSX.read(result, { type: "binary" });
          
          for (let index = 0; index < workbook.SheetNames.length; index++) {
            const element = workbook.SheetNames[index];
            let worksheet = workbook.Sheets[workbook.SheetNames[index]];
            let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
            
            let hoja = {
              hoja: element,
              datos: sheet
            }
            dataset.push(hoja);
          }
          json = JSON.stringify(dataset);

        }else  if (file.name.endsWith('.csv')) {
          let texto = result;
          let lines = texto.split('\n');
          let lineaH = lines[0].split("\n");
          let headers = lineaH[0].split(",")
          json = "["
          for (let index = 1; index < lines.length; index++) {
            const element = lines[index];
            json += "{";
            let objeto = element.split(',');
            
            for (let j = 0; j < objeto.length; j++) {
              if (j < objeto.length-1) {
                json += `"${headers[j].trim()}" : "${objeto[j].trim()}",`;  
              }else{
                json += `"${headers[j].trim()}" : "${objeto[j].trim()}"`;   
              }
            }
            if (index < lines.length-1) {
              json += "},";
            }else{
              json += "}";  
            }
            
          }
          json += "]";
        }
        this2.setState({
          data: json
        });
      };
      reader.readAsBinaryString(file);
      return false;
      
    } catch (exception) {
       console.log(exception);
    }
  };

  handleInputs = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    }, () =>{
      //console.log(this.state.descripcion)
    })
  }

  guardarDatos = (values) =>{
    if (this.props.datos) {
      let data = {
        id: this.props.datos._id,
        titulo: values.titulo,
        descripcion: values.descripcion,
        tipo: this.state.tipo,
        datos: this.state.data,
        usuario: localStorage.getItem("idUser"),
        admin: localStorage.getItem("id")
      }
      //console.log(data)
      sobreDatos(data)
      .then(res =>{
        var titulo = "Sobreescritura de datos realizada!";
        var descripcion = "Se han sobreescrito los datos pertenecientes a "+this.props.datos.titulo;
        notificacion(titulo, descripcion);
        
        this.props.cancel();
        //window.location.reload()
      })
      .catch(err =>{
        message.error("Algo salió mal");
        console.log(err)
      })
      this.props.reloadar();
    }else{
      let data = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        tipo: this.state.tipo,
        datos: this.state.data,
        departamento: this.props.departamento._id,
        empresa: this.props.departamento.propietario,
        admin: this.esAdmin(this.props.usuario),
        usuario: this.props.usuario._id
      }
      GuardarDatos(data)
      .then(res => {
        var titulo = "Se ha subido un archivo!";
        var descripcion = "Buenas noticias! se ha subido el archivo "+data.titulo+" ya puedes revisarlo."
        notificacion(titulo, descripcion);
        this.props.reloadar();
        this.onReset();
      }).catch(err =>{
        message.error("Algo salió mal");
        console.error(err);
      })
    }
  }

  
  formRef = React.createRef();

  onReset = () => {
    this.formRef.current.resetFields();
  };

  esAdmin = (usuario) =>{
    if (usuario.admin ===  undefined) {
      return usuario._id;
    }else{
      return usuario.admin;
    }
  }

  sendFile = (e) => {
  
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render(){
      return(
        <Form onFinish={this.guardarDatos} ref={this.formRef}>
          <Card title="Subir Archivos" style={{ width: "100%" }} actions={[
            <Space direction="horizontal">
              <Form.Item>
                <Button type="primary" htmlType="submit">{ this.props.datos ? "Editar" : "Guardar"}</Button>
                { this.props.datos ?  <Button type="danger" onClick={this.props.cancel}>Cancelar</Button>: ""}
              </Form.Item>
              
            </Space>
          ]}>
            <Space direction="vertical" style={{width:"100%"}}>
              <Form.Item name="titulo" initialValue={ this.props.datos ? this.props.datos.titulo : "" }
                rules={[
                  { 
                    required: true, 
                    message: "Este campo es requerido" 
                  },
                  {
                    pattern:"[A-Za-z0-9]{1,}",
                    message:"Este campo solo admite letras y números"
                  }
                ]}
              >
                <Input 
                  size="large" 
                  placeholder="Título" 
                  id="titulo"
                  allowClear
                />
              </Form.Item>
              <Form.Item 
                name="descripcion" 
                rules={[
                  { 
                    required: true, 
                    message: "Este campo es requerido" 
                  }
                ]}
                initialValue={ this.props.datos ? this.props.datos.descripcion : ""}
              >
                <TextArea
                  id="descripcion"
                  placeholder="Descripción"
                />
              </Form.Item>
              <Form.Item
                name="datos"
                getValueFromEvent={this.sendFile}
                rules={[{
                  required:true,
                  message:"Campo requerido"
                }]}
              >
                <Upload.Dragger 
                  beforeUpload={this.normFile}
                  maxCount={1}
                  accept=".xlsx, .csv"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Haga click o arrastre para subir un archivo</p>
                  <p className="ant-upload-hint">Solo puede subir archivos tipo excel o csv</p>
                </Upload.Dragger>
                
              </Form.Item>
            </Space>
        </Card>
      </Form>
      );
  }
}

export default Escritura;