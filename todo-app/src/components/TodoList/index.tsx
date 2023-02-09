import { Fab, List } from '@mui/material';
import { ListItem, ListItemText } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TodoListProps } from '../../types';


export const TodoList = ({ todos, onClick }: TodoListProps) => {
  return (
    <List sx={{ width: '100%', maxWidth: 360, marginInline: "auto" }}>
      {todos.map((todo) => (
        <ListItem key={todo.id}>
          <ListItemText primary={todo.message} />
          <Fab size='small' color='error' onClick={() => onClick(todo.id)}>
            <Delete />
          </Fab>
        </ListItem>
      ))}
    </List>
  );
};
