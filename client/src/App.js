import './App.css';
import React, { useState } from 'react';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserProfile from './components/UserProfile';
import MainPage from './components/MainPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
  }

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setUserId(null);
  }

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  }

  return (
    <div>
      <h1>WELCOME! </h1>
      <h1>Dear movie fanatics!</h1>
      {!isLoggedIn && (
        <>
          {showSignUp ?
            <UserSignUp onSignUpComplete={toggleSignUp} /> :
            <UserSignIn onLogin={handleLogin} onSignUp={toggleSignUp} />
          }
        </>
      )}
      {isLoggedIn && (
        <>
          <UserProfile userId={userId} onLogout={handleLogOut} />
          <MainPage userId={userId} />
        </>
      )}
    </div>
  );
}

export default App;

