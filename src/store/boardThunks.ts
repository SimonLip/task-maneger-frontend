import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Board, Card } from './types';

export const fetchBoards = createAsyncThunk<Board[]>('boards/fetchBoards', async () => {
  const response = await axios.get('http://localhost:5000/api/boards');
  return response.data;
});

export const createBoard = createAsyncThunk<Board, { _id: string; name: string }>(
  'boards/createBoard',
  async (data) => {
    const response = await axios.post('http://localhost:5000/api/boards', data);
    return response.data;
  }
);


export const fetchCardsByBoardId = createAsyncThunk<Card[], string>('cards/fetchCardsByBoardId', async (boardId) => {
  const response = await axios.get(`http://localhost:5000/api/boards/${boardId}/cards`);
  return response.data;
});

export const createCard = createAsyncThunk<Card, Partial<Card>>('cards/createCard', async (data) => {
  const response = await axios.post('http://localhost:5000/api/cards', data); 
  return response.data;
});

export const updateCard = createAsyncThunk<Card, { id: string; data: Partial<Card> }>('cards/updateCard', async ({ id, data }) => {
  const response = await axios.put(`http://localhost:5000/api/cards/${id}`, data); 
  return response.data;
});

export const deleteCard = createAsyncThunk<string, string>('cards/deleteCard', async (id) => {
  await axios.delete(`http://localhost:5000/api/cards/${id}`); 
  return id;
});

export const fetchBoardWithCards = createAsyncThunk(
  'board/fetchBoardWithCards',
  async (boardId: string) => {
    const response = await fetch(`http://localhost:5000/api/boards/${boardId}`);
    const data = await response.json();
    return data;
  }
);

export const deleteAllBoards = createAsyncThunk(
  'boards/deleteAllBoards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('http://localhost:5000/api/boards');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error deleting all boards');
    }
  }
);
