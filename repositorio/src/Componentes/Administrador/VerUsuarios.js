import React from 'react';
import { Table, Input, Button, message, Breadcrumb, Card } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { GetUserAdmin } from '../../Datos/requests';


const key = 'updatable';

class VerUsuarios extends React.Component {
    
    state = {
        searchText: '',
        searchedColumn: '',
        usuarios: [],
    };
    
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
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Buscar
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
      bread = 
      ( 
          <Breadcrumb>
              <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
              <Breadcrumb.Item>Crear Usuario</Breadcrumb.Item>
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
            title: 'Action',
            key: 'action',
            render: () => (
              <span>
                <Button.Group>
                  <Button type="danger" icon={<DeleteOutlined />} />
                  <Button type="primary" icon={<EyeOutlined />} />
                </Button.Group>
              </span>
            )
          },
        ];
        return (
          <Card title={this.bread}  style={{ width: "90%" }}>
            <Table columns={columns} dataSource={this.state.usuarios} pagination={{ pageSize: 10 }} style={{width:"100%"}} />;
          </Card>
        )    
      }
}

export default VerUsuarios;