import React from 'react';
import { Collapse } from 'antd';
import '../../../src/App.css';

const { Panel } = Collapse;

class VerOrganizacion extends React.Component {
    render() {
        return (
            <div className="org">
                <Collapse>
                    <Panel header="Organización 1" key="1">
                        <Collapse>
                            <Panel header="Departamento 1" key="1">
                                Usuarios
                            </Panel>
                            <Panel header="Departamento 2" key="2">
                                Usuarios
                            </Panel>
                            <Panel header="Departamento 4" key="3">
                                Usuarios
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="Organización 2" key="2">
                        <Collapse>
                            <Panel header="Departamento 1" key="1">
                                Usuarios
                            </Panel>
                            <Panel header="Departamento 2" key="2">
                                Usuarios
                            </Panel>
                            <Panel header="Departamento 4" key="3">
                                Usuarios
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="Organización 4" key="3">
                        <Collapse >
                            <Panel header="Departamento 1" key="1">
                                Usuarios
                            </Panel>
                            <Panel header="Departamento 2" key="2">
                                Usuarios
                            </Panel>
                            <Panel header="Departamento 4" key="3">
                                Usuarios
                            </Panel>
                        </Collapse>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default VerOrganizacion;