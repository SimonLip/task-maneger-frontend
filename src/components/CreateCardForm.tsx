import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createCard } from '../store/boardThunks';
import './BoardsList.css';

interface CreateCardFormProps {
  boardId: string;
  status: 'todo' | 'inprogress' | 'done';
  existingCards: any[];
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({ boardId, status, existingCards }) => {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const maxOrder = existingCards.length > 0 ? Math.max(...existingCards.map(card => card.order)) : 0;

    dispatch(createCard({
      boardId,
      title,
      description,
      status,
      order: maxOrder + 1
    }));

    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <>
      {showForm ? (
        <form onSubmit={handleSubmit} className="boards-add-card-form">
          <input
            type="text"
            placeholder="Card title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="boards-add-card-input"
          />
          <input
            type="text"
            placeholder="Card description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="boards-add-card-input"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit" className="boards-add-card-button">Add Card</button>
            <button type="button" className="boards-add-card-button" onClick={() => setShowForm(false)}>Close</button>
          </div>
        </form>
      ) : (
        <button className="add-card-button" onClick={() => setShowForm(true)}>+</button>
      )}
    </>
  );
};

export default CreateCardForm;
