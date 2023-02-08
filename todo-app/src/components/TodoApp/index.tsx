import { useState, useEffect, ChangeEvent } from 'react';
import { Api } from '../../api';
import { TodoItem } from '../../types';
import { InputForm } from '../InputForm';
import { TodoList } from '../TodoList';


export const TodoApp = () => {
  const api = new Api();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    api.getMessages().then((data) => {
      setTodos(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleAdd = async () => {
    api.postMessage(message).then((data) => {
      setTodos([...todos, data]);
    });
    setMessage('');
  }

  const handleDelete = async (id: string) => {
    api.deleteMessage(id).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Todo List</h1>
      <InputForm message={ message } onChange={ handleInputChange } onClick={ handleAdd } />
      <TodoList todos={ todos } onClick={ handleDelete } /> 
    </div>
  );
};
