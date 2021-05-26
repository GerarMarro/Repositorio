import React from 'react';
import { Table, Input, Button, Space, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import Escritura from './Escritura';

class TablaEscritura extends React.Component {
    
    constructor(props){
        super(props);
        this.handleShow = this.handleShow.bind(this);
    }

    state = {
        departamento: '',
        searchText: '',
        searchedColumn: '',
        dataSource: [],
        visible: false,
        dato: {}
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reiniciar
                </Button>

                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
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

    showModal = () => {
        this.setState({
            visible: true
        })
    };
    
    handleOk = () => {
        this.setState({
            visible: false
        })
    };
    
    handleCancel = () => {
        this.setState({
            visible: false
        })
    };

    handleShow(e) {
        this.setState({
            visible: true,
            dato: JSON.parse(e.target.name)

        }, () => {/*console.log(this.state.dato) */} 
    )}

    render() {
        const columns = [
            {
                title: 'Título',
                dataIndex: 'titulo',
                key: 'titulo',
                ...this.getColumnSearchProps('titulo'),
            },
            {
                title: 'Descripción',
                dataIndex: 'descripcion',
                key: 'descripcion',
                ...this.getColumnSearchProps('descripcion'),
            },
            {
                title: 'Tipo',
                dataIndex: 'tipoA',
                key: 'tipoA',
                ...this.getColumnSearchProps('tipoA'),
            },
            {
                title: 'Creado',
                dataIndex: 'creado',
                key: 'creado',
                ...this.getColumnSearchProps('creado'),
            },
            {
                title: 'Actualizado',
                dataIndex: 'actualizado',
                key: 'actualizado',
                ...this.getColumnSearchProps('actualizado'),
            },
            {
                key: 'action',
                render: (text) => (
                    <Space size="middle">
                        <EditOutlined 
                        style={{color:"#045D9C"}}
                        onClick={() =>{
                            this.setState({
                                visible: true,
                                dato: text
                    
                            }, () => {/*console.log(this.state.dato) */} )
                        }}
                         />
                    </Space>
                ),
            },
        ];
        
        return (
            <>
                <Table
                    columns={columns}
                    dataSource={this.props.dataSource}
                    pagination={{ position: ["bottomCenter"], pageSize: 3 }}
                />
                <Modal 
                    title={"Editar " + this.state.dato.titulo }
                    visible={this.state.visible} 
                    onOk={this.handleOk} 
                    onCancel={this.handleCancel} 
                    width={850}
                    destroyOnClose={true}
                    footer={[]} 
                >
                    < Escritura 
                        departamento={this.props.departamento} 
                        usuario={this.props.usuario} 
                        tituloempresa={this.props.tituloempresa} 
                        datos={this.state.dato}
                        cancel={this.handleCancel}
                        reloadar={this.props.reloadar}
                    />
                </Modal>
            </>
        )
    }
}

export default TablaEscritura;