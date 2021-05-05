import React from 'react';

class VerDatos extends React.Component {

    state ={
        info: [],
        datos: [],
    }

    componentDidMount(){
        this.setState({
            datos: this.props.data

        }, () =>{ 
            this.crearTabla(this.state.datos);
        })
        //const vartoString = varObj => Object.keys(varObj)[0];
        //console.info(Object.keys(this.state.datos));
    }

    crearTabla = (arreglo) =>{
        //console.log(arreglo[0].hoja)
        if (arreglo[0].hoja === undefined) {
            console.log("Es csv")
        }else{
            for (let index = 0; index < arreglo.length; index++) {
                const element = arreglo[index];
                console.log(element)
            }
        }
        
        /*console.log(typeof this.props.data[0])
        console.log(this.state.datos[0].datos)*/
    }

    render(){
        return (
            <>
                
            </>
        )
    }

}

export default VerDatos;