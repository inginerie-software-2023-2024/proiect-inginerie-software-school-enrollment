import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import { TextField } from "@mui/material"

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
  const [open, setOpen] = React.useState(false)
  const [isApllied, setIsApplied] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClick = () => {
    console.log("aplicare")
    setIsApplied(true);
  }

  React.useEffect(() => {
    if (isApllied) {
      handleClose()
    }
  });

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
            <TextField id="outlined-basic" label="Nume elev" variant="outlined" />
            <TextField id="outlined-basic" label="Clasa" variant="outlined" />
          </Typography>
          <Button onClick={handleClick}>Aplica</Button>
        </Box>
      </Modal>
    </div>
  )
}
