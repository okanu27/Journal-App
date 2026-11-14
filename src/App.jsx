import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient.js';

import Navbar from './components/Navbar';
import Compose from './components/Compose';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [postEntries, setPostEntries] = useState([]);
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingAuth(false);
    });

   const {
    data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => 
      subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  const handleNewEntry = (newEntry) => {
    setPostEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  return (
    <Router>
      <main>
        <Navbar />

        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/auth/google" element={<Login />} />

          <Route path="/" 
            element={
              checkingAuth ? (
               <p>Checking authentication...</p>
              ) : (
                <Navigate to={session ? "/home" : "/login"} replace />
              )}
            />

          <Route path="/home" element={<Home entries={postEntries} />} />


          <Route path="/Compose" element={<Compose onNewEntry={handleNewEntry} />} />

          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}

export default App;