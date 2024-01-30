import { domainName } from "../../src/generalConstants"

describe("Add Child", () => {
  // before(() => {
  //   cy.request({
  //     method: "DELETE",
  //     url: `${domainName}/students/deleteByCNP/${5179845612478}`,
  //   }).then((response) => {
  //     expect(response.status).to.eq(200)
  //   })

  //   cy.wait(2000)
  // })
  it("User adds child in the app", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("test")
    cy.get("#password").type("test")
    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees success message
    cy.findByText(/autentificare cu succes/i).should("exist")

    // clicks on "Copiii mei" button
    cy.findByRole("button", { name: /copiii mei/i }).click()

    // clicks on "Adaugati copil" button
    cy.findByRole("button", { name: /adaugati copil/i }).click()

    // user types in the child info
    cy.get("#child-last-name").type("Popescu")
    cy.findByRole("textbox", { name: /prenume copil/i }).type("Ion")
    cy.findByRole("textbox", { name: /cnp copil/i }).type("5179845612478")
    cy.findByRole("spinbutton", { name: /varsta copil/i }).type("10")

    // user clicks on "Adauga copil" button
    cy.findByRole("button", { name: /adauga copil/i }).click()

    // user sees success message
    cy.findByText(/copilul a fost adaugat cu succes/i).should("exist")
  })

  it("User adds child with invalid CNP", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("test")
    cy.get("#password").type("test")
    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees success message
    cy.findByText(/autentificare cu succes/i).should("exist")

    // clicks on "Copiii mei" button
    cy.findByRole("button", { name: /copiii mei/i }).click()

    // clicks on "Adaugati copil" button
    cy.findByRole("button", { name: /adaugati copil/i }).click()

    // user types in the child info
    cy.get("#child-last-name").type("Popescu")
    cy.findByRole("textbox", { name: /prenume copil/i }).type("Ionica")
    cy.findByRole("textbox", { name: /cnp copil/i }).type("7179845612478")
    cy.findByRole("spinbutton", { name: /varsta copil/i }).type("10")

    // user clicks on "Adauga copil" button
    cy.findByRole("button", { name: /adauga copil/i }).click()

    // user sees success message
    cy.findByText(/cnp\-ul introdus nu este valid/i).should("exist")
  })
})
