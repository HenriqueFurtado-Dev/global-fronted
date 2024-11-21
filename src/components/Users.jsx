import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Table, Button, Form, Modal } from 'react-bootstrap';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({ nome: '', email: '', tipoConta: '' });
  const [editId, setEditId] = useState(null);

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

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
      console.log('Salvando usuário:', user); // Verificar o payload do usuário
      if (editId) {
        await api.put(`/usuarios/${editId}`, user);
        console.log('Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', user);
        console.log('Usuário criado com sucesso!');
      }
      fetchUsers();
      setShowModal(false);
      setUser({ nome: '', email: '', tipoConta: '' });
      setEditId(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const openEditModal = (user) => {
    setUser(user);
    setEditId(user.id);
    setShowModal(true);
  };

  return (
    <div>
      <h2>Usuários</h2>
      <Button onClick={() => setShowModal(true)}>Adicionar Usuário</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo de Conta</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.tipoConta}</td>
              <td>
                <Button onClick={() => openEditModal(user)} variant="warning">
                  Editar
                </Button>{' '}
                <Button onClick={() => handleDelete(user.id)} variant="danger">
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
                />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                <option value="RESIDENCIAL">RESIDENCIAL</option>
                <option value="EMPRESARIAL">EMPRESARIAL</option>
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

export default Users;
