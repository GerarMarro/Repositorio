import React from 'react';
import { Card, Input, Space, message, Button, Breadcrumb } from 'antd';
import { FileInput } from '@blueprintjs/core';
import { GuardarDatos } from '../../Datos/requests';
import * as XLSX from 'xlsx';

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
  
  handleFileLoad = (e) => {
    if (e.target.files.length > 0) {
        try {
          let file = e.target.files[0];
          let reader = new FileReader();
          let this2 = this;
          let nombre = file.name.split('.');
          this.setState({operationInProgress: true, fileLoadProgress: 0, fileLoaded:true, fileName:file.name, tipo:nombre[1]}, ()=>{});
          
          reader.onload = function (e) {
            let data = new Uint8Array(e.target.result);
            let json = "";
            
            if (file.name.endsWith('.csv')) {
              
              let decoder = new TextDecoder();
              let texto = decoder.decode(data);
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
              
            }else if (file.name.endsWith('.xlsx')) {
              let dataset = [];
              let workbook = XLSX.read(data, { type: "array" });
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
            }
            this2.setState({
              data: json
            });
          }
          
          reader.readAsArrayBuffer(file);

        } catch (exception) {
            this.setState({
                fileLoaded: false,
                fileName: "",
                operationInProgress: false
            });
            console.log(exception)
        }
    } else {
        message.error("No se encontraron archivos");
    }
  };

  handleInputs = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    }, () =>{
      //console.log(this.state.descripcion)
    })
  }

  guardarDatos = () =>{
    message.loading("Sus datos se estan subiendo espere un poco...");
    let data = {
      titulo: this.state.titulo,
      descripcion: this.state.descripcion,
      tipo: this.state.tipo,
      datos: this.state.data,
      departamento: this.props.departamento._id,
      empresa: this.props.departamento.propietario,
      admin: this.esAdmin(this.props.usuario),
      usuario: this.props.usuario._id
    }
    GuardarDatos(data)
    .then(res => {
      message.success("Sus datos ya estan en nuestra base de datos.");
      var sesion ={
        header: "Crear usuarios",
        action: "CrearUsuarios",
        menu: '2.',
        departamento: this.props.departamento
    }
    localStorage.removeItem('state');
    window.location.reload();
    }).catch(err =>{
      message.error("Algo salió mal");
      console.error(err);
    })
  }

  esAdmin = (usuario) =>{
    if (usuario.admin ===  undefined) {
      return usuario._id;
    }else{
      return usuario.admin;
    }
  }

  bread = 
  ( 
      <Breadcrumb>
          <Breadcrumb.Item>{this.props.tituloempresa}</Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.departamento.nombre}</Breadcrumb.Item>
      </Breadcrumb>
  )

  render(){
      return(
        <Card title={this.bread} style={{ width: "90%" }} actions={[
          <Button type="primary" onClick={this.guardarDatos}>Guardar</Button>
        ]}>
          <Space direction="vertical" style={{width:"100%"}}>
            <Input size="large" name="titulo" placeholder="Título" onChange={this.handleInputs} allowClear />
            <TextArea
              name="descripcion"
              onChange={this.handleInputs}
              placeholder="Controlled autosize"
            />
            <FileInput 
              style={{width:"100%"}}
              hasSelection={this.state.fileLoaded}
              onInputChange={this.handleFileLoad}
              buttonText="Buscar"
              typeof="application/msexcel"
              text={this.state.fileLoaded ? this.state.fileName : "Escoger Archivo..."} />
          </Space>
      </Card>
      );
  }
}

export default Escritura;