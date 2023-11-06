// src/App.js
import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import SignUp from './components/SignUp';
import CodingChallenge from './components/CodingChallenge';

function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  const disHandleSignUp = () => {
    // Handle signup logic (e.g., save to database)
    setIsSignedUp(false);
  };

  const handleSignUp = (firstName, lastName, email) => {
    // Handle signup logic (e.g., save to database)
    setIsSignedUp(true);
  };

  return (
    <div className="App">
      {isSignedUp ? <CodingChallenge onSignDown={disHandleSignUp}/> : <SignUp onSignUp={handleSignUp} />}
    </div>
  );
}

export default App;
