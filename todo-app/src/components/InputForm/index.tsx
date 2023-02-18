import { InputFormProps } from '../../types';
import { Fab, TextField } from '@mui/material';
import { Send } from '@mui/icons-material';


export const InputForm = ({message, onChange, onClick}: InputFormProps) => {
  return (
    <>
      <TextField
        sx={{ width: "100%", maxWidth: 270, marginRight: 2, marginBottom: 2 }}
        label="Message"
        size='small'
        variant='outlined'
        onChange={ onChange }
        value={ message }
      />
      <Fab size='small' color='primary' onClick={ onClick } disabled={message === ''}>
        <Send />
      </Fab>
    </>
  )
}
