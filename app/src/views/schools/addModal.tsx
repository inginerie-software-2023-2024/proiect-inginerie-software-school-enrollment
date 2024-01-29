import * as React from "react"
import { useState, useEffect, useContext } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { TextField } from "@mui/material"
import axios from "axios"
import { domainName } from "../../generalConstants"
import { ReactReduxContext } from "react-redux"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export const AddModal = () => {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  const { school, user } = state
  const schoolDetails = school?.value
  const [open, setOpen] = React.useState(false)
  const [isApllied, setIsApplied] = React.useState(false)
  const [data, setData] = useState({
    child: "",
    class: "",
  })
  const [children, setChildren] = useState([])
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClick = () => {
    console.log("aplicare")
    setIsApplied(true)
  }

  useEffect(() => {
    if (isApllied) {
      setIsApplied(false)
      handleClose()
      try {
        const postData = {
          studentId: parseInt(data.child),
          schoolId: schoolDetails.id,
          grade: parseInt(data.class),
        }
        console.log("postData: ", postData)
        axios.post(`${domainName}/requests/add`, postData, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
      } catch (error) {
        console.log("error in applying: ", error)
      }
      setData({
        child: "",
        class: "",
      })
    }
  })

  useEffect(() => {
    axios
      .get(`${domainName}/students/ofMyself`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setChildren(response.data)
      })
  }, [children.length])

  console.log("children in addModal: ", children)

  const handleChildChange = (event: SelectChangeEvent) => {
    const newData = { ...data }
    newData.child = event.target.value as string
    setData(newData)
  }

  const handleClassChange = (event: any) => {
    const newData = { ...data }
    newData.class = event.target.value as string
    setData(newData)
  }

  return (
    <div>
      <Button onClick={handleOpen}>Aplicare</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Aplicare la scoala
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Nume Copil</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.child}
                label="Nume Copil"
                onChange={handleChildChange}
                style={{ marginBottom: "20px" }}
              >
                {children.map((child: any) => {
                  console.log("child in mapping: ", child)
                  return (
                    <MenuItem value={child.id}>
                      {child.lastName} {child.firstName}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <TextField
              id="outlined-basic"
              label="Clasa"
              variant="outlined"
              style={{ marginBottom: "20px" }}
              onChange={handleClassChange}
            />
          </Typography>
          <Button onClick={handleClick}>Aplica</Button>
        </Box>
      </Modal>
    </div>
  )
}
