import axios from 'axios';


const api = axios.create({
  baseURL: '191.234.211.44:8080', // Substitua pela URL correta
});

export default api;
