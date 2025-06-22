import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBoards, fetchBoardWithCards, updateCard, createBoard, deleteAllBoards } from '../store/boardThunks';
import CreateCardForm from './CreateCardForm';
import DeleteCardButton from './DeleteCardButton';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import './BoardsList.css';
import toast from 'react-hot-toast';

const BoardsList = () => {
  const dispatch = useAppDispatch();
  const boards = useAppSelector((state) => state.board?.boards) ?? [];

  const activeBoard = useAppSelector((state) => state.board?.activeBoard);
  const activeBoardCards = useAppSelector((state) => state.board?.activeBoardCards || []);

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [inputBoardId, setInputBoardId] = useState<string>('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const statuses = ['todo', 'inprogress', 'done'] as const;
  type StatusType = (typeof statuses)[number];

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleLoadBoard = async () => {
    if (inputBoardId.trim() === '') return;

    const boardId = inputBoardId.trim();
    const board = boards.find((b) => b._id === boardId);

    if (board) {
      setSelectedBoardId(boardId);
      dispatch(fetchBoardWithCards(boardId));
    } else {
      const result = await dispatch(createBoard({ _id: boardId, name: `Board ${boardId}` })).unwrap();
      setSelectedBoardId(result._id);
      await dispatch(fetchBoards());
      await dispatch(fetchBoardWithCards(result._id));
    }

    setInputBoardId('');
  };

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    dispatch(fetchBoardWithCards(boardId));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    const cardId = draggableId;
    const newStatus = destination.droppableId as StatusType;

    if (!statuses.includes(newStatus)) return;

    dispatch(updateCard({ id: cardId, data: { status: newStatus } }));
  };

  const startEditing = (cardId: string, currentTitle: string, currentDescription: string) => {
    setEditingCardId(cardId);
    setEditTitle(currentTitle);
    setEditDescription(currentDescription);
  };

  const saveCard = (cardId: string) => {
    dispatch(updateCard({ id: cardId, data: { title: editTitle, description: editDescription } }));
    setEditingCardId(null);
  };

  const handleDeleteAll = async () => {
    await dispatch(deleteAllBoards());
    setSelectedBoardId(null);
    toast.success('All boards and cards deleted');
    dispatch(fetchBoards());
  };

  return (
    <div className="boards-container">
      <h1 className="boards-title">Boards</h1>

      {/* Введення нового борду */}
      <div className="boards-load">
        <input
          type="text"
          placeholder="Enter a board ID here..."
          value={inputBoardId}
          onChange={(e) => setInputBoardId(e.target.value)}
          className="boards-input"
        />
        <button onClick={handleLoadBoard} className="boards-load-button">Load</button>
        <button onClick={handleDeleteAll} className="boards-delete-all-button">Delete All</button>
      </div>

      {/* Список збережених бордів */}
      <div className="boards-list">
        <h3>Saved Boards:</h3>
        <div className="boards-buttons">
          {boards.map((board) => (
            <button
              key={board._id}
              onClick={() => handleSelectBoard(board._id)}
              className={`boards-select-button ${selectedBoardId === board._id ? 'selected' : ''}`}
            >
              {board.name}
            </button>
          ))}
        </div>
      </div>

      {selectedBoardId && activeBoard && (
        <DragDropContext onDragEnd={onDragEnd}>
          <h2 className="boards-subtitle">Cards in {activeBoard.name}</h2>

          <div className="boards-columns">
            {statuses.map((status) => (
              <Droppable
                droppableId={status}
                key={status}
                isDropDisabled={!selectedBoardId || !activeBoard}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="boards-column"
                  >
                    <h3 className="boards-column-title">
                      {status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done'}
                    </h3>

                    {activeBoardCards
                      .filter((card) => card.status === status)
                      .map((card, index) => (
                        <Draggable draggableId={card._id} index={index} key={card._id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`boards-card ${editingCardId === card._id ? 'editing' : ''}`}
                            >
                              {editingCardId === card._id ? (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    saveCard(card._id);
                                  }}
                                  className="boards-add-card-form"
                                >
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Card title"
                                    required
                                    className="boards-add-card-input"
                                  />
                                  <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Card description"
                                    required
                                    className="boards-add-card-input"
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button type="submit" className="boards-add-card-button">Save</button>
                                    <button
                                      type="button"
                                      className="boards-add-card-button"
                                      onClick={() => setEditingCardId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <h4 className="boards-card-title">{card.title}</h4>
                                  <p className="boards-card-description">{card.description}</p>
                                  <div className="boards-card-actions">
                                    <button
                                      onClick={() => startEditing(card._id, card.title, card.description)}
                                      className="boards-card-edit"
                                    >
                                      ✏️
                                    </button>
                                    <DeleteCardButton cardId={card._id} boardId={selectedBoardId} />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}

                    <div className="board-add-card">
                      <CreateCardForm
                        boardId={selectedBoardId}
                        status={status}
                        existingCards={activeBoardCards.filter(card => card.status === status)}
                      />
                    </div>

                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default BoardsList;
