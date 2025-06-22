import { createSlice } from '@reduxjs/toolkit';
import { fetchBoards, createBoard, fetchCardsByBoardId, createCard, updateCard, deleteCard, fetchBoardWithCards } from './boardThunks';
import { Board, Card, BoardWithCards } from './types';

interface BoardState {
  boards: Board[];
  cards: Card[];
  activeBoard: BoardWithCards | null;
  activeBoardCards: Card[];
  loading: boolean;
  error: string | null;
}


const initialState: BoardState = {
  boards: [],
  cards: [],
  activeBoard: null,
  activeBoardCards: [],
  loading: false,
  error: null,
};

const boardsSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching boards';
      })

      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })


      .addCase(fetchCardsByBoardId.fulfilled, (state, action) => {
        state.cards = action.payload;
      })


      .addCase(createCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
        state.activeBoardCards.push(action.payload);
      })

      .addCase(updateCard.fulfilled, (state, action) => {
        state.cards = state.cards.map((card) =>
          card._id === action.payload._id ? action.payload : card
        );
        state.activeBoardCards = state.activeBoardCards.map((card) =>
          card._id === action.payload._id ? action.payload : card
        );
      })


      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter((card) => card._id !== action.payload);
      })

      .addCase(fetchBoardWithCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardWithCards.fulfilled, (state, action) => {
        state.loading = false;

        state.activeBoard = {
          _id: action.payload._id,
          name: action.payload.name,
          cards: []
        };

        state.activeBoardCards = action.payload.cards;
      })
      .addCase(fetchBoardWithCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching board';
      });
  },
});

export default boardsSlice.reducer;

