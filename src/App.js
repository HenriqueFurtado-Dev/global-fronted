import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Users from './components/Users';
import Devices from './components/Devices';

function App() {
  return (
    <div className="container">
      <h1>Gerenciador</h1>
      <Tabs defaultActiveKey="users" id="app-tabs" className="mb-3">
        {/* Aba de Usuários */}
        <Tab eventKey="users" title="Usuários">
          <Users />
        </Tab>

        {/* Aba de Dispositivos */}
        <Tab eventKey="devices" title="Dispositivos">
          <Devices />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
