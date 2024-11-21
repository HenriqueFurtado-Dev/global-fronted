import React from 'react';
import Users from './components/Users';
import Devices from './components/Devices';

function App() {
  return (
    <div className="container">
      <h1>Gerenciador</h1>
      <Users />
      <hr />
      <Devices />
    </div>
  );
}

export default App;
