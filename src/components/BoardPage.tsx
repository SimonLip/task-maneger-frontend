import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBoardWithCards } from '../store/boardThunks';
import { Card } from '../store/types';

const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.board.activeBoard);

  useEffect(() => {
    if (id) {
      dispatch(fetchBoardWithCards(id));
    }
  }, [dispatch, id]);

  if (!board) return <div>Loading...</div>;

return (
  <div>
    <h1>{board.name}</h1>
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <h2>To Do</h2>
        {board.cards.filter((card: Card) => card.status === 'todo').map((card: Card) => (
          <div key={card._id}>{card.title}</div>
        ))}
      </div>
      <div>
        <h2>In Progress</h2>
        {board.cards.filter((card: Card) => card.status === 'inprogress').map((card: Card) => (
          <div key={card._id}>{card.title}</div>
        ))}
      </div>
      <div>
        <h2>Done</h2>
        {board.cards.filter((card: Card) => card.status === 'done').map((card: Card) => (
          <div key={card._id}>{card.title}</div>
        ))}
      </div>
    </div>
  </div>
);

};

export default BoardPage;
