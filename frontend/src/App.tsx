import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return isLoggedIn
    ? <BooksPage onLogout={handleLogout} />
    : <LoginPage onLogin={handleLogin} />;
}

export default App;
