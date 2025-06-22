import { Column } from "./Column";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Card } from "../store/types";

export const Board = () => {
  const board = useSelector((state: RootState) => state.board.activeBoard);

  if (!board) return <div className="text-red-500">Board not found</div>;

  const todoCards = board.cards.filter((card: Card) => card.status === "todo");
  const inProgressCards = board.cards.filter((card: Card) => card.status === "inprogress");
  const doneCards = board.cards.filter((card: Card) => card.status === "done");

  return (
    <div className="flex gap-4">
      <Column title="To Do" cards={todoCards} boardId={board._id} status="todo" />
      <Column title="In Progress" cards={inProgressCards} boardId={board._id} status="inprogress" />
      <Column title="Done" cards={doneCards} boardId={board._id} status="done" />
    </div>
  );
};
