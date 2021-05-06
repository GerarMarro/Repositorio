import React from 'react';
import { Typography, Table, Input, Button, Tabs, Popover } from 'antd';
import { SearchOutlined, TableOutlined, CodeOutlined, CopyOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import '../../../src/App.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const {Text} = Typography;
const { TabPane } = Tabs;
class TablaDatos extends React.Component{

    state = {
        searchText: '',
        searchedColumn: '',
        copied: false
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
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
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
    
    getColumnas = (datos) =>{
        var columnasNombre = Object.keys(datos[0]);
        let columnas = [];
        
        for (let index = 0; index < columnasNombre.length; index++) {
            //const element = columnasNombre[index];
            
            let col = {
                title: columnasNombre[index],
                dataIndex: columnasNombre[index],
                key: columnasNombre[index].toLocaleLowerCase(),
                width: '30%',
                ...this.getColumnSearchProps(columnasNombre[index]),
            }
            columnas.push(col);
        }
        return columnas;
    }

    render(){
        return(
            <>
                <Tabs defaultActiveKey="1">
                    <TabPane
                      
                        tab={
                            <span>
                            <TableOutlined />
                            Ver tabla
                            </span>
                        }
                        key="1"
                    >
                        <Table pagination={{ pageSize:3 }} columns={this.getColumnas(this.props.datos)} dataSource={this.props.datos} />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                            <CodeOutlined />
                                Ver datos sin formato
                            </span>
                        }
                        key="2"
                        >
                            <div style={{width:"100%", padding:"0, 1rem", marginLeft:"25%"}}>
                              <div style={{textAlign:"center", marginRight:"30px"}}>
                                <Popover content={<Text style={{color:"green"}}>Copiado!</Text>} visible={this.state.copied}>
                                  <CopyToClipboard text={JSON.stringify(this.props.datos, null, 2)}
                                    onCopy={() =>{ 
                                        this.setState({copied: true})
                                        setTimeout( ()=>{this.setState({copied:false})}, 2000)
                                      }
                                    }>
                                    <Button icon={<CopyOutlined />} />
                                  </CopyToClipboard>
                                </Popover>
                                
                              </div>
                                <pre className="json"> 
                                    { JSON.stringify(this.props.datos, null, 2) } 
                                </pre>
                                
                            </div>
                    </TabPane>
                    
                </Tabs>
                
            </>
        )
    }
}

export default TablaDatos;