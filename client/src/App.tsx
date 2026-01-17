import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('threads_token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('threads_user_id'));

  useEffect(() => {
    // Check for token in URL (from OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlUserId = params.get('user_id');

    if (urlToken && urlUserId) {
      localStorage.setItem('threads_token', urlToken);
      localStorage.setItem('threads_user_id', urlUserId);
      setToken(urlToken);
      setUserId(urlUserId);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('threads_token');
    localStorage.removeItem('threads_user_id');
    setToken(null);
    setUserId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {token && userId ? (
        <Dashboard token={token} userId={userId} onLogout={handleLogout} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
