import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]); // Para associar dispositivos aos usuários
  const [showModal, setShowModal] = useState(false);
  const [device, setDevice] = useState({
    nomeDispositivo: '',
    tipoDispositivo: '',
    localizacao: '',
    consumoEnergiaKwh: '',
    status: '',
    usuarioId: '',
  });
  const [editId, setEditId] = useState(null);

  // Fetch devices and users on load
  useEffect(() => {
    fetchDevices();
    fetchUsers();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await api.get('/dispositivos');
      setDevices(response.data);
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await api.put(`/dispositivos/${editId}`, device);
      } else {
        await api.post('/dispositivos', device);
      }
      fetchDevices();
      setShowModal(false);
      setDevice({
        nomeDispositivo: '',
        tipoDispositivo: '',
        localizacao: '',
        consumoEnergiaKwh: '',
        status: '',
        usuarioId: '',
      });
      setEditId(null);
    } catch (error) {
      console.error('Erro ao salvar dispositivo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/dispositivos/${id}`);
      fetchDevices();
    } catch (error) {
      console.error('Erro ao deletar dispositivo:', error);
    }
  };

  const openEditModal = (device) => {
    setDevice(device);
    setEditId(device.id);
    setShowModal(true);
  };

  return (
    <div>
      <h2>Dispositivos</h2>
      <Button onClick={() => setShowModal(true)}>Adicionar Dispositivo</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Localização</th>
            <th>Consumo (kWh)</th>
            <th>Status</th>
            <th>Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>{device.id}</td>
              <td>{device.nomeDispositivo}</td>
              <td>{device.tipoDispositivo}</td>
              <td>{device.localizacao}</td>
              <td>{device.consumoEnergiaKwh}</td>
              <td>{device.status}</td>
              <td>{device.usuario?.nome}</td>
              <td>
                <Button onClick={() => openEditModal(device)} variant="warning">
                  Editar
                </Button>{' '}
                <Button onClick={() => handleDelete(device.id)} variant="danger">
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Dispositivo' : 'Adicionar Dispositivo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={device.nomeDispositivo}
                onChange={(e) => setDevice({ ...device, nomeDispositivo: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                value={device.tipoDispositivo}
                onChange={(e) => setDevice({ ...device, tipoDispositivo: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                value={device.localizacao}
                onChange={(e) => setDevice({ ...device, localizacao: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Consumo (kWh)</Form.Label>
              <Form.Control
                type="number"
                value={device.consumoEnergiaKwh}
                onChange={(e) => setDevice({ ...device, consumoEnergiaKwh: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={device.status}
                onChange={(e) => setDevice({ ...device, status: e.target.value })}
              >
                <option value="">Selecione</option>
                <option value="Ligado">Ligado</option>
                <option value="Desligado">Desligado</option>
                <option value="Standby">Standby</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Usuário</Form.Label>
              <Form.Control
                as="select"
                value={device.usuarioId}
                onChange={(e) => setDevice({ ...device, usuarioId: e.target.value })}
              >
                <option value="">Selecione</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nome}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Devices;
