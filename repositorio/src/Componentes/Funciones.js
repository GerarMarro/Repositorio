import { notification, Avatar } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

function coloresRandom() {
  var letras = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
  var letra = "";
  var contador = 1;
  var color = "#";
  do {
    var numero = Math.floor(Math.random() * ((letras.length)-0)+0);
    letra = letras[numero];
    color = color + letra;
    contador++;

  } while ( contador <= 6);
  return color;
}

function notificacion(titulo, descripcion) {
  var foto = JSON.parse(localStorage.getItem("foto"))
  notification.open({
    message: titulo,
    description: descripcion,
    placement: "bottomRight",
    icon: foto!== 0 ? <Avatar src={foto.thumbUrl} /> : <SmileOutlined />,
  });
}

export {coloresRandom, notificacion};