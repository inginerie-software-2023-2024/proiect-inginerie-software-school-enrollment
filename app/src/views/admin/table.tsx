import React, { useContext, useEffect, useState } from "react"

import { useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableFooter from "@mui/material/TableFooter"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import LastPageIcon from "@mui/icons-material/LastPage"

import { styled } from "@mui/material/styles"
import { tableCellClasses } from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import { Button } from "@mui/material"

import { setAllUsers, setDirector } from "../../app/reducers/allUsers"
import { ReactReduxContext } from "react-redux"
import axios from "axios"
import { domainName } from "../../generalConstants"
import { useNavigate } from "react-router-dom"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#a3a2c4",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

const getRole = (isPrincipal: boolean, isTeacher: boolean) => {
  if (isPrincipal) return "Director"
  if (isTeacher) return "Profesor"
  return "Parinte"
}

export const AllUsersTable = () => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const [isPromoted, setIsPromoted] = useState(false)

  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  const { allUsers } = state

  const navigate = useNavigate()

  console.log("allUsers in AdminTable: ", allUsers)
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allUsers.length) : 0

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handlePromote = (e: any, id: number, username: string) => {
    console.log("promote: ", id, username)
    setIsPromoted(true)
    axios
      .post(
        `${domainName}/admin/setRoles`,
        { id, username, principal: true, teacher: false },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      )
      .then((response) => {
        console.log("response: ", response.data)
        const newAllUsers = allUsers.map((user: any) => {
          if (user.id === id) {
            return { ...user, principal: true }
          }
          return user
        })
        console.log("newAllUsers: ", newAllUsers)
        store.dispatch(setAllUsers(newAllUsers))
        window.location.reload()
      })
      .catch((error) => {
        console.log("error: ", error)
      })
  }

  useEffect(() => {
    if (isPromoted) {
      setIsPromoted(false)
    }
  }, [isPromoted])

  return (
    <TableContainer component={Paper} style={{ padding: "50px" }}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Username</StyledTableCell>
            <StyledTableCell align="right">Rol</StyledTableCell>
            <StyledTableCell align="right">Promovare</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? allUsers.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
              )
            : allUsers
          ).map((user: any) => {
            const {
              id,
              username,
              principal: isPrincipal,
              teacher: isTeacher,
            } = user
            return (
              <StyledTableRow key={username}>
                <TableCell component="th" scope="row">
                  {username}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {getRole(isPrincipal, isTeacher)}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  <Button onClick={(e) => handlePromote(e, id, username)}>
                    Promoveaza director
                  </Button>
                </TableCell>
              </StyledTableRow>
            )
          })}
          {emptyRows > 0 && (
            <StyledTableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={allUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
