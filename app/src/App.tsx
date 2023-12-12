import { NavBar } from "./components/navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./views/home"
import { SignUp } from "./views/signUp"
import { LogIn } from "./views/logIn"
import { Schools } from "./views/schools"

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
        </Routes>
      </Router>
    </div>
  )
}

export default App
