import { NavBar } from "./components/navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./views/home"
import { SignUp } from "./views/signUp"
import { LogIn } from "./views/logIn"
import { Schools } from "./views/schools"
import React from "react"
import LogOut from "./views/logOut/LogOut"
import Profile from "./views/profile/Profile"
import NotFoundPage from "./views/errors/NotFoundPage"
import AdminDashBoard from "./views/admin/AdminDashboard"
import { Toaster } from "sonner"
import ChildrenManagement from "./views/childrenManagement/ChildrenManagement"
import MySchool from "./views/mySchool/MySchool"

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
          <Route path={"/admin"} element={<AdminDashBoard />} />
          <Route path={"/my-school"} element={<MySchool />} />
          <Route path={"/my-children"} element={<ChildrenManagement />} />
          {/* <Route path={"/clasa-mea"} element={<AdminDashBoard />} /> */}
          <Route path={"*"} element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </div>
  )
}

export default App
