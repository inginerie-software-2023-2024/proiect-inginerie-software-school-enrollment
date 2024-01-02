import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { useNavigate } from "react-router-dom"
import "../../style.css"

export const NavBar = () => {
  const guestPagesLeft = [
    {
      name: "Home",
      path: "/acasa",
    },
    {
      name: "Scoli",
      path: "/scoli",
    },
  ]
  const guestPagesRightNotLoggedIn = [
    {
      name: "Sign Up",
      path: "/sign-up",
    },
    {
      name: "Log In",
      path: "/log-in",
    },
  ]

  const guestPagesRightLoggedIn = [
    {
      name: "username",
      path: "/profile"
    },
    {
      name: "Log Out",
      path: "/log-out",
    },
  ]

  const navigate = useNavigate()

  const handleClick = (pagePath: string) => {
    navigate(pagePath)
  }

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#c3f2cd" }}
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            {guestPagesLeft.map((page, index) => {
              return (
                <button
                  key={index}
                  className="navbar-button"
                  onClick={() => handleClick(page.path)}
                >
                  {page.name}
                </button>
              )
            })}
          </div>
          <div className="nav navbar-nav navbar-right">
            {localStorage.getItem("token") ? (
              guestPagesRightLoggedIn.map((page, index) => {
                if (localStorage.getItem("token") !== null)
                  return (
                    <button
                      key={index}
                      className="navbar-button"
                      onClick={() => handleClick(page.path)}
                    >
                      {page.name === "username"? localStorage.getItem("username") : page.name}
                    </button>
                  )
              })
            ) : (
              guestPagesRightNotLoggedIn.map((page, index) => {
                if (localStorage.getItem("token") === null)
                  return (
                    <button
                      key={index}
                      className="navbar-button"
                      onClick={() => handleClick(page.path)}
                    >
                      {page.name}
                    </button>
                  )
              })
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
