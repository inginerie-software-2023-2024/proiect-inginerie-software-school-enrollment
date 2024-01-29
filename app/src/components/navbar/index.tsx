import "bootstrap/dist/css/bootstrap.min.css"
import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import "../../style.css"
import { getCurrentUserRole } from "../../tokenUtils"
import { login } from "../../app/reducers"
import {ReactReduxContext} from 'react-redux'

export const NavBar = () => {
  const guestPagesLeft = [
    {
      name: "Home",
      path: "/acasa",
      access: true,
    },
    {
      name: "Scoli",
      path: "/scoli",
      access: true,
    },
    {
      name: "Admin",
      path: "/admin",
      access:
        localStorage.getItem("token") !== null &&
        getCurrentUserRole() === "admin",
    },
    {
      name: "Scoala mea",
      path: "/my-school",
      access:
        localStorage.getItem("token") !== null &&
        getCurrentUserRole() === "principal",
    },
    {
      name: "Clasa mea",
      path: "/my-class",
      access:
        localStorage.getItem("token") !== null &&
        getCurrentUserRole() === "teacher",
    },
    {
      name: "Copiii mei",
      path: "/my-children",
      access:
        localStorage.getItem("token") !== null &&
        getCurrentUserRole() === "parent",
    },
  ]

  const {store} = useContext(ReactReduxContext)
  if(localStorage.getItem("username")) {
    store.dispatch(login(localStorage.getItem("username")))
  }

  const guestPagesRightNotLoggedIn = [
    {
      name: "Sign Up",
      path: "/sign-up",
      access: true,
    },
    {
      name: "Log In",
      path: "/log-in",
      access: true,
    },
  ]

  const guestPagesRightLoggedIn = [
    {
      name: "username",
      path: "/profile",
      access: true,
    },
    {
      name: "Log Out",
      path: "/log-out",
      access: true,
    },
  ]

  const navigate = useNavigate()

  const handleClick = (pagePath: string) => {
    navigate(pagePath)
  }

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "var(--main-background-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
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
              return page.access ? (
                <button
                  key={index}
                  className="navbar-button"
                  onClick={() => handleClick(page.path)}
                >
                  {page.name}
                </button>
              ) : null
            })}
          </div>
          <div className="nav navbar-nav navbar-right">
            {localStorage.getItem("token")
              ? guestPagesRightLoggedIn.map((page, index) => {
                  if (localStorage.getItem("token") !== null)
                    return page.access ? (
                      <button
                        key={index}
                        className="navbar-button"
                        onClick={() => handleClick(page.path)}
                      >
                        {page.name === "username"
                          ? localStorage.getItem("username")
                          : page.name}
                      </button>
                    ) : null
                })
              : guestPagesRightNotLoggedIn.map((page, index) => {
                  if (localStorage.getItem("token") === null)
                    return page.access ? (
                      <button
                        key={index}
                        className="navbar-button"
                        onClick={() => handleClick(page.path)}
                      >
                        {page.name}
                      </button>
                    ) : null
                })}
          </div>
        </div>
      </div>
    </nav>
  )
}
