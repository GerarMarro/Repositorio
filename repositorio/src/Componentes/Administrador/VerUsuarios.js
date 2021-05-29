import React from 'react';
import { Table, Input, Button, message, Breadcrumb, Card, Modal, Divider } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, ReloadOutlined, DeleteOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { GetUserAdmin, DelUser } from '../../Datos/requests';
import UserInfo from './InformacionUser';
import CambiarOrg from './CambiarOrgUSer';
import {notificacion} from '../Funciones';

const key = 'updatable';
const { confirm } = Modal;

class VerUsuarios extends React.Component {

  state = {
      searchText: '',
      searchedColumn: '',
      usuarios: [],
      visible:false,
      verUser: {},
      eliminados: [],
      cambiar: false
  };
  
  accion = "";

  componentDidMount(){
    GetUserAdmin(this.props.id)
    .then(res=>{
      this.setState({
        usuarios: res.data
      })
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

  handleOk = () => {
    
    this.setState({
      visible: false,
    });
    this.componentDidMount();
  };

  deleteUser = (usuario) =>{
    var admin = this.props.id;
    let this2 = this;
    confirm({
      title: '¿Está seguro que desea eliminar a '+usuario.nombre+'?',
      content: 'Si elimina este usuario no podrá recuperarse ya que se eliminará completamente de la base de datos',
      onOk() {
        message.loading({ content: 'Esperamos que sepas lo que haces...', key });
        DelUser(usuario._id, admin)
        .then(res => { 
        var titulo ="Eliminación de usuario.";
        var descripcion ="Se ha eliminado a " + usuario.nombre
        notificacion(titulo, descripcion);
          
        this2.componentDidMount();
        })
        .catch(error =>{
          message.error({ content: 'Algo salió mal', key });
          console.error(error);
        })
      }
    });
    this.handleOk();
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
        title: 'Apellido',
        dataIndex: 'apellido',
        key: 'apellido',
        ...this.getColumnSearchProps('apelldio'),
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
              <EyeOutlined onClick={() =>{
                this.setState({
                  visible:true,
                  cambiar: false,
                  verUser: record
                }, () =>{})
              }} 
              style={{color:"#07C5FF"}} />
              <Divider type="vertical" />
                <SyncOutlined style={{color:"#ED9703", cursor:"pointer"}} onClick={() =>{
                  this.setState({
                    visible:true,
                    cambiar: true,
                    verUser: record
                  }, () =>{})
                }} />
              <Divider type="vertical" />
              <DeleteOutlined onClick={() =>{
                this.deleteUser(record)
              }} style={{color:"#DF2605"}} />
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
          title={ this.state.verUser.nombre + " " + this.state.verUser.apellido }
          visible={this.state.visible}
          width="65%"
          onCancel={this.handleOk}
          footer={
            <></>
          }
          destroyOnClose
        >
          { this.state.cambiar ? <CambiarOrg cerrarmodal={this.handleOk} eliminar={this.deleteUser} usuario={this.state.verUser} /> : <UserInfo usuario={this.state.verUser} />}
        </Modal>
      </>
    )    
  }
}

export default VerUsuarios;