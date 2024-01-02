import { NavBar } from "./components/navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./views/home"
import { SignUp } from "./views/signUp"
import { LogIn } from "./views/logIn"
import { Schools } from "./views/schools"
import React from "react"
import LogOut from "./views/logOut/LogOut"
import Profile from "./views/profile/Profile"

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/acasa"} element={<Home />} />
          <Route path={"/scoli"} element={<Schools />} />
          <Route path={"/sign-up"} element={<SignUp />} />
          <Route path={"/log-in"} element={<LogIn />} />
          <Route path={"/log-out"} element={<LogOut />} />
          <Route path={"/profile"} element={<Profile />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
