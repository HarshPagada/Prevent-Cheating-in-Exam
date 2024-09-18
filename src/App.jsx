import './App.css'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Exam from './components/Exam.jsx'
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import { useState } from 'react'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <>
      <BrowserRouter>
        <Navbar loggedInUser={loggedInUser} />
        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/exam" element={<Exam loggedInUser={loggedInUser}/>} />
            <Route exact path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
            <Route exact path="/signUp" element={<SignUp setLoggedInUser={setLoggedInUser} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
