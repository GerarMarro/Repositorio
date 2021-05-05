import React from 'react';
import Lectura from './Lectura';
import Escritura from './Escritura';

class Controller extends React.Component {
   

    components = () =>{
        console.clear();
        if (this.props.departamento.tipo === 0) {
            return <Lectura departamento={this.props.departamento} empresa={this.props.empresa} />
        }else {
            return < Escritura departamento={this.props.departamento} usuario={this.props.usuario} tituloempresa={this.props.empresa.nombre} />
        }
    } 

    render(){
        return(
            <>
                <this.components />
            </>
        );
    }
}

export default Controller;