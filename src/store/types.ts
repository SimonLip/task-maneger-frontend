export interface Card {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  boardId: string;
  order: number;
}

export interface Board {
  _id: string;
  name: string;
}

export interface BoardWithCards extends Board {
  cards: Card[];
}
