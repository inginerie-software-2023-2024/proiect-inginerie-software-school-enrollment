import { Box, Button, Modal } from "@mui/material"
import React, { useState } from "react"
import AddSchoolForm from "./AddSchoolForm"

export default function NoSchoolComponent({
  reRenderRoot,
}: {
  reRenderRoot: () => void
}) {
  const [modalState, setModalState] = useState(false)

  const closeModal = () => setModalState(false)

  return (
    <div className="centering-wrapper">
      <h1 style={{ fontWeight: "bold", color: "red" }}>
        Nu aveti nici o scoala inregistrata
      </h1>
      <h2>Apasati butonul de mai jos pentru a inregistra o scoala</h2>
      <Button
        variant="contained"
        style={{
          backgroundColor: "var(--main-background-color)",
          color: "black",
          marginTop: "1em",
        }}
        onClick={() => {
          setModalState(true)
        }}
      >
        Adaugati Scoala
      </Button>
      <Modal
        open={modalState}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
          className="centering-wrapper"
        >
          <AddSchoolForm reRenderRoot={reRenderRoot} />
        </Box>
      </Modal>
    </div>
  )
}
