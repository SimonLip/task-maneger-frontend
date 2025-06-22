import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getBoards = () => API.get('/boards');
export const createBoard = (name: string) => API.post('/boards', { name });
