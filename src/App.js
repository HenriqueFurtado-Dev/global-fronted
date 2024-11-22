// src/App.jsx

import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Users from './components/Users';
import Devices from './components/Devices';
import Relatorios from './components/Relatorios'; // Import do componente Relatórios
import './App.css'; // CSS personalizado
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos do Bootstrap
import logo from './assets/logo.jpeg'; // Substitua pelo caminho do seu logo

function App() {
  return (
    <div className="container">
      <div className="header text-center">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Gerenciador Inteligente de Energia</h1>
        <p className="lead">
          Nosso aplicativo oferece uma solução inovadora para a gestão de energia, controlando e monitorando dispositivos elétricos de forma eficiente e automatizada.
        </p>
        <p>
          Seja para uso residencial ou empresarial, garantimos economia, eficiência e sustentabilidade.
        </p>
      </div>

      <Tabs defaultActiveKey="users" id="app-tabs" className="mb-3">
        {/* Aba de Usuários */}
        <Tab eventKey="users" title="Usuários">
          <Users />
        </Tab>

        {/* Aba de Dispositivos */}
        <Tab eventKey="devices" title="Dispositivos">
          <Devices />
        </Tab>

        {/* Aba de Relatórios */}
        <Tab eventKey="relatorios" title="Relatórios">
          <Relatorios />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
