export interface Todo {
  description: any;
  id: number;
  title: string;
  completed: boolean;
}

export let todos: Todo[] = [
  { id: 1, title: "Learn Node.js", completed: false },
  { id: 2, title: "Learn Express.js", completed: true },
];
