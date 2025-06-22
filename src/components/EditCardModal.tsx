import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateCard, fetchBoardWithCards } from '../store/boardThunks';
import './EditCardModal.css';

interface EditCardModalProps {
  card: any;
  boardId: string;
  onClose: () => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, boardId, onClose }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleSave = async () => {
    await dispatch(updateCard({ ...card, title, description }));
    await dispatch(fetchBoardWithCards(boardId));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Edit Card</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="modal-input"
          placeholder="Card title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="modal-input"
          placeholder="Card description"
        />
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-button">
            Cancel
          </button>
          <button onClick={handleSave} className="modal-button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;
