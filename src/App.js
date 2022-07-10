import { FormControl, Input  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore"; 
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';


import './App.css';
import db from './db';
import Message from './Message';

function App() {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUserName] = useState('');



  const sendMessage = (event) => {
    event.preventDefault();

    addDoc(collection(db, 'messages'), {username: username, message: input, timestamp: serverTimestamp() })

    setInput('');
  }


  useEffect(() => {
    setUserName(prompt('Please enter your name'))
  }, [])


  useEffect(() => {
    // run once when the app component loads
    
    
    onSnapshot(query(collection(db, 'messages'), orderBy('timestamp', 'desc')), snapshot => {
      setMessages(snapshot.docs.map(doc => ({id: doc.id, message: doc.data()})))
    })
  }, []);


  return (
    <div className="App">
      <img src="icon.png" width="150px" alt="logo" />
      <h1>Chat app</h1>
      <h2>welcome {username}</h2>

      <form className="app__form">
        <FormControl className='app__formControl'>
          <Input className='app__input' placeholder='Enter a message...' value={input} onChange={event => setInput(event.target.value)} />

          <IconButton className='app__iconButton' type="submit" disabled={!input} variant="contained" onClick={sendMessage}>
            <SendIcon />
          </IconButton>

        </FormControl>
      </form>

      <FlipMove>
        {
          messages.map(({id, message}) => (
            <Message username={username} message={message} key={id} />
          ))
        }
      </FlipMove>
    </div>
  );
}

export default App;
