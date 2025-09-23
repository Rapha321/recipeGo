import React from 'react'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import './styles/Form.css'
import Navbar from './components/Navbar'
import CreateRecipe from './components/CreateRecipe'
import MyRecipes from './components/MyRecipes'
import MyFavorites from './components/MyFavorites'
import AllRecipes from './components/AllRecipes'
import Profile from './components/Profile'
import { AuthProvider } from './AuthContext';

// Logout component to clear local storage and redirect to login
function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

const Favorites = ()  => {
  return <MyFavorites />
}

const Recipes = () => {
  return <AllRecipes />
}


// Register component to clear local storage and redirect to register
function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="/recipes/all-recipes" element={<AllRecipes />} />
            <Route path="/recipes/create" element={<CreateRecipe />} />
            <Route path="/recipes/update/:id" element={<CreateRecipe />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
