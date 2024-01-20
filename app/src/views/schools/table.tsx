import React, {useContext} from "react"

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

import { chooseSchool } from "../../app/reducers/schools"
import {ReactReduxContext} from 'react-redux'


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

const schools = [
  {
    name: "Scoala 1",
    director: "Director 1",
    points: 100,
  },
  {
    name: "Scoala 2",
    director: "Director 2",
    points: 200,
  },
  {
    name: "Scoala 3",
    director: "Director 3",
    points: 100,
  },
  {
    name: "Scoala 4",
    director: "Director 4",
    points: 150,
  },
  {
    name: "Scoala 5",
    director: "Director 5",
    points: 50,
  },
  {
    name: "Scoala 6",
    director: "Director 6",
    points: 250,
  },
  {
    name: "Scoala 7",
    director: "Director 7",
    points: 300,
  },
  {
    name: "Scoala 8",
    director: "Director 8",
    points: 100,
  },
  {
    name: "Scoala 9",
    director: "Director 9",
    points: 200,
  },
  {
    name: "Scoala 10",
    director: "Director 10",
    points: 100,
  },
  {
    name: "Scoala 11",
    director: "Director 11",
    points: 150,
  },
  {
    name: "Scoala 12",
    director: "Director 12",
    points: 50,
  },
  {
    name: "Scoala 13",
    director: "Director 13",
    points: 250,
  },
  {
    name: "Scoala 14",
    director: "Director 14",
    points: 300,
  },
  {
    name: "Scoala 15",
    director: "Director 15",
    points: 100,
  },
  {
    name: "Scoala 16",
    director: "Director 16",
    points: 200,
  },
  {
    name: "Scoala 17",
    director: "Director 17",
    points: 100,
  },
  {
    name: "Scoala 18",
    director: "Director 18",
    points: 150,
  },
  {
    name: "Scoala 19",
    director: "Director 19",
    points: 50,
  },
  {
    name: "Scoala 20",
    director: "Director 20",
    points: 250,
  },
  {
    name: "Scoala 21",
    director: "Director 21",
    points: 300,
  },
  {
    name: "Scoala 22",
    director: "Director 22",
    points: 100,
  },
  {
    name: "Scoala 23",
    director: "Director 23",
    points: 200,
  },
].sort((a, b) => (a.points > b.points ? -1 : 1))

export const SchoolsTable = () => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const [isSchoolClicked, setIsSchoolClicked] = React.useState(false)

  const {store} = useContext(ReactReduxContext)
  const state = store.getState()

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - schools.length) : 0

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

  const handleSchoolClick = (school: any) => {
    console.log("school: ", school)
    setIsSchoolClicked(true)
    store.dispatch(chooseSchool(school))
  }

  return (
    <TableContainer component={Paper} style={{ padding: "50px" }}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>School</StyledTableCell>
            <StyledTableCell align="right">Director</StyledTableCell>
            <StyledTableCell align="right">Points</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? schools.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
              )
            : schools
          ).map((school) => {
            const { name, director, points } = school
            return (
              <StyledTableRow key={name}>
                <TableCell component="th" scope="row">
                  <Button onClick={() => handleSchoolClick(name)}>
                    {name}
                  </Button>
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {director}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {points}
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
              count={schools.length}
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
