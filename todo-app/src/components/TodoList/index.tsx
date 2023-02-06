import { useState, useEffect, ChangeEvent } from 'react';
import { Api } from '../../api';
import { TodoItem } from '../../types';


export const TodoList = () => {
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
    <div>
      <h1>Todo List</h1>
      <input type="text" onChange={ handleInputChange } value={ message }/>
      <button onClick={ handleAdd }>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={ todo.id }>
            <span>{todo.message}</span>
            <button onClick={ () => handleDelete(todo.id) }>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
