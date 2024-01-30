import React, { useContext } from "react"

import { ReactReduxContext } from "react-redux"

export const Home = () => {
  const { store } = useContext(ReactReduxContext)
  console.log("store in home: ", store.getState())
  return (
    <div className="centering-wrapper">
      <h1
        style={{
          display: "block",
          fontWeight: "bold",
          width: "100vw",
          margin: "0.5em 0 0.5em 0",
          textAlign: "center",
        }}
      >
        Acasa
      </h1>
      <div className="padded-fit-wrapper centering-wrapper">
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          <span
            style={{ fontWeight: "bold", color: "darkGreen", fontSize: 30 }}
          >
            Bine ati venit
          </span>{" "}
          in aplicatia noastra destinata{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>
            inscrierii la scoala
          </span>
          !
        </p>
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          Daca nu aveti un cont, va puteti creea unul apasand pe butonul{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>
            Inregistrare
          </span>
        </p>
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          Puteti apasa pe butonul{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>
            Autentificare
          </span>{" "}
          pentru a intra in contul dvs.
        </p>
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          Dupa ce v-ati autentificat, aveti acces la mai multe pagini, cum ar
          fi:{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>
            Copiii mei
          </span>
          {" si "}{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>Profil</span>
        </p>
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          Pagina{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>
            Copiii mei
          </span>{" "}
          este destinata gestionarii copiilor dvs. (adaugare, editare,
          vizualizare si gestionare cereri copil)
        </p>
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          In pagina{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>Profil</span>{" "}
          puteti vizualiza si modifica informatiile contului dvs. Totodata de
          aici va puteti schimba rolul (daca aveti altul decat parinte), dar si
          sterge contul.
        </p>
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          In sectiunea{" "}
          <span style={{ fontWeight: "bold", color: "darkblue" }}>Scoli</span>{" "}
          puteti vedea toate scolile inregistrate de catre directori in
          aplicatie. Facand <span style={{ fontWeight: "bold" }}>click</span> pe
          numele uneia puteti trimite cereri de inscriere pentru copiii
          dumneavoastra la aceasta.
        </p>
        <p
          style={{
            fontSize: 25,
            maxWidth: "70vw",
            overflowX: "clip",
            textAlign: "center",
          }}
        >
          Pe langa toate acestea, fiecare{" "}
          <span style={{ fontWeight: "bold" }}>rol de utilizator</span> are
          acces la{" "}
          <span style={{ fontWeight: "bold" }}>functionalitati diferite</span>{" "}
          si intuitive pe care fiecare le poate descoperi pe parcurs.
        </p>
      </div>
    </div>
  )
}
