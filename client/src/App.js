import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';

/*** Components ***/
import Home from './pages/home';
import ChatPage from './pages/chat-page';
import { SocketProvider } from './context/chat-context';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home socket={socket} />}></Route>
            <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
          </Routes>
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;