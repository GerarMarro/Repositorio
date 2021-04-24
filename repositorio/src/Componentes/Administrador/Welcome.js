import React from 'react';
import { Result } from 'antd';
import 'material-icons';

class Welcome extends React.Component {
    

    consejos = [
        "Puedes revisar los reportes en los departamentos de lectura",
        "Puedes subir archivos de tipo csv, txt y excel en los departamentos de escritura",
        "Recuerda que solo existe un departamento de escritura pero pueden existir muchos de lectura",
        "Puedes crear usuarios nuevos con permisos para subir y leer archivos pero no aambos",
        "Para que no te confundas, los usuarios de tu empresa tendran un @ seguido por el nombre de la empresa a la que pertenezcan",
        "Recuerda que si tus usuarios olvidan su contraseña tu puedes restaurarla pero lo mejor es que estes seguro de todos sus datos",
        "Como administrador puedes crear, editar y eliminar usuarios, recuera un gran poder conlleva una gran responsabilidad",
        "Para nosotros es importante que todo este muy bien organizado por eso creamos todas las unidades organizativas de acuerdo a tu empresa",
        "Puedes tener hasta 5 empresas máximo"
    ]

    aleatorio = () =>{
        var numero = Math.floor(Math.random() * ((this.consejos.length)-0)+0);
        var consejo = this.consejos[numero];
        return consejo;
    }
    render(){
        return(
            <>
                <Result
                    icon={<span className="material-icons-outlined" style={{color:"#010a3d", fontSize:200}}>
                        hail
                    </span>}
                    title={"Bienvenido " + this.props.usuarioNombre }
                    subTitle={"Consejos random: " + this.aleatorio()}
                    
                />
            </>
        );
    }
}

export default Welcome;