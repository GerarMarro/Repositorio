import React from 'react';
import Lectura from './Lectura';

import MostrarEscritura from './MostrarEscritura';

class Controller extends React.Component {
   

    components = () =>{
        if (this.props.departamento.tipo === 0) {
            return <Lectura departamento={this.props.departamento} empresa={this.props.empresa} />
        }else {
            
            return < MostrarEscritura departamento={this.props.departamento} usuario={this.props.usuario} tituloempresa={this.props.empresa.nombre} />
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