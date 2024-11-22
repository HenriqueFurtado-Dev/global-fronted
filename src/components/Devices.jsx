import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import './Devices.css';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [device, setDevice] = useState({
    nomeDispositivo: '',
    tipoDispositivo: '',
    localizacao: '',
    consumoEnergiaKwh: '',
    status: 'DESLIGADO',
    usuarioId: '',
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch devices on load
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dispositivos');
      setDevices(response.data);
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
      setMessage({ type: 'danger', text: 'Erro ao buscar dispositivos.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await api.put(`/dispositivos/${editId}`, device);
        setMessage({ type: 'success', text: 'Dispositivo atualizado com sucesso!' });
      } else {
        await api.post('/dispositivos', device);
        setMessage({ type: 'success', text: 'Dispositivo criado com sucesso!' });
      }
      fetchDevices();
      setShowModal(false);
      setDevice({
        nomeDispositivo: '',
        tipoDispositivo: '',
        localizacao: '',
        consumoEnergiaKwh: '',
        status: 'DESLIGADO',
        usuarioId: '',
      });
      setEditId(null);
    } catch (error) {
      console.error('Erro ao salvar dispositivo:', error);
      setMessage({ type: 'danger', text: 'Erro ao salvar dispositivo.' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/dispositivos/${id}`);
      setMessage({ type: 'success', text: 'Dispositivo excluído com sucesso!' });
      fetchDevices();
    } catch (error) {
      console.error('Erro ao deletar dispositivo:', error);
      setMessage({ type: 'danger', text: 'Erro ao excluir dispositivo.' });
    }
  };

  const openEditModal = (device) => {
    setDevice(device);
    setEditId(device.id);
    setShowModal(true);
  };

  return (
    <Container className="devices-container">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Gerenciamento de Dispositivos</h2>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-3">
        <Col className="text-right">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus-circle"></i> Adicionar Dispositivo
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="devices-table">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Localização</th>
              <th>Consumo (kWh)</th>
              <th>Status</th>
              <th>Usuário ID</th>
              <th className="text-center">Ações</th>
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
                <td>{device.usuarioId}</td>
                <td className="text-center">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => openEditModal(device)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Button>{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(device.id)}
                  >
                    <i className="fas fa-trash-alt"></i> Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para Adicionar/Editar Dispositivo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? 'Editar Dispositivo' : 'Adicionar Dispositivo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome do Dispositivo</Form.Label>
              <Form.Control
                type="text"
                value={device.nomeDispositivo}
                onChange={(e) =>
                  setDevice({ ...device, nomeDispositivo: e.target.value })
                }
                placeholder="Digite o nome do dispositivo"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipo de Dispositivo</Form.Label>
              <Form.Control
                type="text"
                value={device.tipoDispositivo}
                onChange={(e) =>
                  setDevice({ ...device, tipoDispositivo: e.target.value })
                }
                placeholder="Ex: Eletrônico, Eletrodoméstico"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                value={device.localizacao}
                onChange={(e) =>
                  setDevice({ ...device, localizacao: e.target.value })
                }
                placeholder="Ex: Sala, Escritório"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Consumo de Energia (kWh)</Form.Label>
              <Form.Control
                type="number"
                value={device.consumoEnergiaKwh}
                onChange={(e) =>
                  setDevice({ ...device, consumoEnergiaKwh: e.target.value })
                }
                placeholder="Digite o consumo em kWh"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={device.status}
                onChange={(e) => setDevice({ ...device, status: e.target.value })}
              >
                <option value="LIGADO">Ligado</option>
                <option value="DESLIGADO">Desligado</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>ID do Usuário</Form.Label>
              <Form.Control
                type="number"
                value={device.usuarioId}
                onChange={(e) =>
                  setDevice({ ...device, usuarioId: e.target.value })
                }
                placeholder="Associe a um usuário pelo ID"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSave}>
            {editId ? 'Atualizar' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Devices;
