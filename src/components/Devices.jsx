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
import { extractEmbeddedData } from '../utils/apiHelper'; // Import do helper

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
      console.log('Resposta da API (Dispositivos):', response.data); // Log para depuração
      const devicesArray = extractEmbeddedData(response.data, 'dispositivoConsumoList'); // Ajuste a chave conforme necessário
      setDevices(devicesArray);
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error.response || error);
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Erro ao buscar dispositivos.',
      });
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validação dos campos obrigatórios
    if (
      !device.nomeDispositivo ||
      !device.tipoDispositivo ||
      !device.localizacao ||
      !device.consumoEnergiaKwh ||
      !device.usuarioId
    ) {
      setMessage({ type: 'danger', text: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await api.put(`/dispositivos/${editId}`, device);
        setMessage({ type: 'success', text: 'Dispositivo atualizado com sucesso!' });
      } else {
        await api.post('/dispositivos', device);
        setMessage({ type: 'success', text: 'Dispositivo criado com sucesso!' });
      }
      await fetchDevices();
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
      console.error('Erro ao salvar dispositivo:', error.response || error);
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Erro ao salvar dispositivo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/dispositivos/${id}`);
      setMessage({ type: 'success', text: 'Dispositivo excluído com sucesso!' });
      await fetchDevices();
    } catch (error) {
      console.error('Erro ao deletar dispositivo:', error.response || error);
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Erro ao excluir dispositivo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (device) => {
    setDevice(device);
    setEditId(device.id);
    setShowModal(true);
  };

  const openAddModal = () => {
    setDevice({
      nomeDispositivo: '',
      tipoDispositivo: '',
      localizacao: '',
      consumoEnergiaKwh: '',
      status: 'DESLIGADO',
      usuarioId: '',
    });
    setEditId(null);
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
          <Button variant="primary" onClick={openAddModal}>
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
            {Array.isArray(devices) && devices.length > 0 ? (
              devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.id}</td>
                  <td>{device.nomeDispositivo}</td>
                  <td>{device.tipoDispositivo}</td>
                  <td>{device.localizacao}</td>
                  <td>{device.consumoEnergiaKwh}</td>
                  <td>{device.status}</td>
                  <td>{device.usuarioId}</td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" onClick={() => openEditModal(device)}>
                      <i className="fas fa-edit"></i> Editar
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(device.id)}>
                      <i className="fas fa-trash-alt"></i> Excluir
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Nenhum dispositivo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal para Adicionar/Editar Dispositivo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Dispositivo' : 'Adicionar Dispositivo'}</Modal.Title>
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
          <Button variant="success" onClick={handleSave} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : editId ? 'Atualizar' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Devices;
