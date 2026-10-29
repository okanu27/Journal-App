import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Compose from './components/Compose';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [postEntries, setPostEntries] = useState([]);

  const handleNewEntry = (newEntry) => {
    setPostEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  return (
    <Router>
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home entries={postEntries} />} />
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