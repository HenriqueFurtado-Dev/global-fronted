import axios from 'axios';


const api = axios.create({
  baseURL: 'http://191.234.211.44:8080', // Incluindo o protocolo
});

export default api;
