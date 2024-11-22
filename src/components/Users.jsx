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
import './Users.css'; // Importar estilos personalizados

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({ nome: '', email: '', tipoConta: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setMessage({ type: 'danger', text: 'Erro ao buscar usuários.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await api.put(`/usuarios/${editId}`, user);
        setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' });
      } else {
        await api.post('/usuarios', user);
        setMessage({ type: 'success', text: 'Usuário criado com sucesso!' });
      }
      fetchUsers();
      setShowModal(false);
      setUser({ nome: '', email: '', tipoConta: '' });
      setEditId(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setMessage({ type: 'danger', text: 'Erro ao salvar usuário.' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      setMessage({ type: 'success', text: 'Usuário excluído com sucesso!' });
      fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      setMessage({ type: 'danger', text: 'Erro ao excluir usuário.' });
    }
  };

  const openEditModal = (user) => {
    setUser(user);
    setEditId(user.id);
    setShowModal(true);
  };

  return (
    <Container className="users-container">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Gerenciamento de Usuários</h2>
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
          <i className="fas fa-user-plus"></i> Adicionar Usuário
        </Button>

        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="users-table">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo de Conta</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.tipoConta}</td>
                <td className="text-center">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => openEditModal(user)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </Button>{' '}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <i className="fas fa-trash-alt"></i> Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para Adicionar/Editar Usuário */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Usuário' : 'Adicionar Usuário'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={user.nome}
                onChange={(e) => setUser({ ...user, nome: e.target.value })}
                placeholder="Digite o nome"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Digite o email"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipo de Conta</Form.Label>
              <Form.Control
                as="select"
                value={user.tipoConta}
                onChange={(e) => setUser({ ...user, tipoConta: e.target.value })}
              >
                <option value="">Selecione</option>
                <option value="RESIDENCIAL">Residencial</option>
                <option value="EMPRESARIAL">Empresarial</option>
              </Form.Control>
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

export default Users;
