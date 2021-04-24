import React from 'react';
import Lectura from './Lectura';
import Escritura from './Escritura';

class Controller extends React.Component {
   

    components = () =>{
        console.clear();
        if (this.props.departamento.tipo === 0) {
            return <Lectura />
        }else {
            return < Escritura />
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