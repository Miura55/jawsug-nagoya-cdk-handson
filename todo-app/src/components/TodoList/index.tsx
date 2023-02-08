import { Fab, List } from '@mui/material';
import { ListItem, ListItemText } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TodoListProps } from '../../types';


export const TodoList = ({ todos, onClick }: TodoListProps) => {
  return (
      // <ul>
      //   {todos.map((todo) => (
      //     <li key={ todo.id }>
      //       <span>{todo.message}</span>
      //       <button onClick={ () => onClick(todo.id) }>Delete</button>
      //     </li>
      //   ))}
      // </ul>
      <List sx={{ width: '100%', maxWidth: 360, marginInline: "auto" }}>
        {todos.map((todo) => (
          <ListItem key={ todo.id }>
            <ListItemText primary={ todo.message } />
            <Fab size='small' color='error' onClick={ () => onClick(todo.id) }>
              <Delete />
            </Fab>
          </ListItem>
        ))}
      </List>
  );
};
