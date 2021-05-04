import React from 'react';
import { Table, Input, Button, message, Breadcrumb, Card, Modal, Divider } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetUserAdmin, DelUser } from '../../Datos/requests';
import UserInfo from './InformacionUser';

const key = 'updatable';
const { confirm } = Modal;

class VerUsuarios extends React.Component {
    constructor(props){
      super(props);
      this.handleModal = this.handleModal.bind(this);
    }
    state = {
        searchText: '',
        searchedColumn: '',
        usuarios: [],
        visible:false,
        verUser: {},
        eliminados: []
    };
    accion = "";
    componentDidMount(){
      message.loading({ content: 'Obteniendo la información...', key });
      GetUserAdmin(this.props.id)
      .then(res=>{
        this.setState({
          usuarios: res.data
        })
        message.success({ content: 'Usuarios cargados', key });
      })
      .catch(error =>{
        console.error(error);
      })
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              key="s"
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined /> }
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Buscar
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} icon={<ReloadOutlined /> } size="small" style={{ width: 90 }}>
              Reiniciar
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          ),
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };
      
      handleModal = (event) =>{
        
        this.setState({
          visible:true,
          verUser: JSON.parse(event.target.name)
        }, () =>{})
        
      }
  
      handleOk = () => {
        
        this.setState({
          visible: false,
        });
      };
    
      showConfirm = (event) => {
        var usuario = JSON.parse(event.target.name), nombre = usuario.nombre, id = usuario._id, admin=this.props.id;
        console.log(admin);
        //  var elim = false;
        confirm({
          title: '¿Está seguro que desea eliminar a '+nombre+'?',
          content: 'Si elimina este usuario no podrá recuperarse ya que se eliminará completamente de la base de datos',
          onOk() {
            message.loading({ content: 'Esperamos que sepas lo que haces...', key });
            DelUser(id, admin)
            .then(res => { 
              setTimeout( message.success({ content: 'Usuarios eliminado correctamente!', key }), 2000000);
              var sesion ={
                header: "Ver usuarios",
                action: "VerUsuarios",
                menu: '3.1'
            }
            localStorage.setItem('state', JSON.stringify(sesion));
              window.location.reload();
            })
            .catch(error =>{
              message.error({ content: 'Algo salió mal', key });
              console.error(error);
            })
          }
        });
      }
      bread = 
      ( 
          <Breadcrumb>
              <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
              <Breadcrumb.Item>Ver Usuarios</Breadcrumb.Item>
          </Breadcrumb>
      )
      render() {
        const columns = [
          {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            
            ...this.getColumnSearchProps('nombre'),
          },
          {
            title: 'Usuario',
            dataIndex: 'usuario',
            key: 'usuario',
            ...this.getColumnSearchProps('usuario'),
          },
          {
            title: 'Departamento',
            dataIndex: 'departamento',
            key: 'departamento',
            ...this.getColumnSearchProps('departamento'),
          },
          {
            title: 'Acción',
            key: '_id',
            ...this.getColumnSearchProps('_id'),
            render: (record) => (
              <span>
                <span>
                  <a href={'#'}  onClick={this.handleModal} style={{color:"#07C5FF"}} name={JSON.stringify(record)}>Ver a {record.nombre}</a>
                  <Divider type="vertical" />
                  <a href={'#'} onClick={this.showConfirm} style={{color:"#DF2605"}} name={JSON.stringify(record)}>Eliminar</a>
                </span>
              </span>
            )
          },
        ];
        return (
          <>
            <Card title={this.bread}  style={{ width: "90%" }}>
              <Table columns={columns} dataSource={this.state.usuarios} pagination={{ pageSize: 5 }} style={{width:"100%"}} />;
            </Card>
            <Modal
              title="Ver usuario"
              visible={this.state.visible}
              onOk={this.handleOk}
              width="65%"
              footer={
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  Ok
                </Button>
              }
              destroyOnClose
            >
              <UserInfo usuario={this.state.verUser} />
            </Modal>
          </>
        )    
      }
}

export default VerUsuarios;