import { ChangeEvent } from "react";

export interface TodoItem {
  id: string;
  message: string;
};

export interface InputFormProps {
  message: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => Promise<void>;
}

export interface TodoListProps {
  todos: TodoItem[];
  onClick: (id: string) => Promise<void>;
}
