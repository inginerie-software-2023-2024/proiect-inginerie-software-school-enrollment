import { NavBar } from "./components/navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./views/home"
import { SignUp } from "./views/signUp"
import { LogIn } from "./views/logIn"

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/acasa"} element={<Home />} />
          <Route path={"/sign-up"} element={<SignUp />} />
          <Route path={"/log-in"} element={<LogIn />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
