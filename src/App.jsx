import { useEffect, useState } from 'react';
import Login from './components/Login';
import ChatBot from './components/ChatBot';
import { parseTokenFromUrl, getStoredIdToken, getUserInfo, logout } from './utils/auth';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { idToken: parsedToken } = parseTokenFromUrl();
    const idToken = parsedToken || getStoredIdToken();

    if (idToken) {
      const info = getUserInfo(idToken);
      setUser({ ...info, idToken });
    }
  }, []);

  return (
    <div className="app-container">
      {user ? (
        <ChatBot user={user} onLogout={logout} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
