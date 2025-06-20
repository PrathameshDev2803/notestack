import React from 'react'
import { Routes,Route } from 'react-router-dom'
import AddNewNote from './AddNewNote'
import Home from './Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SavedNotes from './pages/SavedNotes';
function App() {
  return (
    <>
    <Routes>
     <Route path='/' element={<Home/>}/>
     <Route path='/AddNewNote' element={<AddNewNote/>}/>
     <Route path="/saved-notes" element={<SavedNotes />} />
    </Routes>
    <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />

   
    </>
  )
}

export default App
