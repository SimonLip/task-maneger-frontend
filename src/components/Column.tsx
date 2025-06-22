import { Card } from "./Card";
import CreateCardForm  from "./CreateCardForm";

interface CardData {
  _id: string;
  title: string;
  description: string;
}

interface ColumnProps {
  title: string;
  cards: CardData[];
  boardId: string;
  status: "todo" | "inprogress" | "done";
}

export const Column = ({ title, cards, boardId, status }: ColumnProps) => {
  return (
    <div className="w-1/3 p-4 bg-gray-100 rounded">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {cards.map((card) => (
        <Card key={card._id} title={card.title} description={card.description} />
      ))}
      <CreateCardForm boardId={boardId} status={status} existingCards={cards} />
    </div>
  );
};