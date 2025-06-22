import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { deleteCard, fetchBoardWithCards } from '../store/boardThunks';
import toast from 'react-hot-toast';

interface DeleteCardButtonProps {
  cardId: string;
  boardId: string;
}

const DeleteCardButton: React.FC<DeleteCardButtonProps> = ({ cardId, boardId }) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
  try {
    await dispatch(deleteCard(cardId)).unwrap();
    await dispatch(fetchBoardWithCards(boardId));
    toast.success('Card deleted successfully');
  } catch (error) {
    toast.error('Error deleting card');
  }
};

  return (
    <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded-xl text-sm">
      Delete
    </button>
  );
};

export default DeleteCardButton;
