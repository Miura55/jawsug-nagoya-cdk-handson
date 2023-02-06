import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});


export class Api {
  async getMessages() {
    try{
      const { data } = await api.get('/messages');
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async postMessage(message: string) {
    try{
      const { data } = await api.post('/message', {
        "message": message
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMessage(id: string) {
    try{
      const { data } = await api.delete(`/message/${id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
