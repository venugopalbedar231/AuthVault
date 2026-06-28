import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Createnote from './pages/Createnote'
import Login from './pages/Login'
import { useAuth } from "./context/AuthContext";
import Register from './pages/Regsiter'

// Simple guard — redirects to /login if no token
function PrivateRoute({ children }) {
    const { accessToken } = useAuth();  // use context, not localStorage
    console.log("PrivateRoute accessToken:", accessToken);  // add this
    return accessToken ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-white'>
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <main className='flex-1 container mx-auto p-4'>
        <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<PrivateRoute><Createnote /></PrivateRoute>} />
      </Routes>
      </main>


      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default App