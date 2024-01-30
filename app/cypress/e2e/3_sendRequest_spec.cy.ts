describe("User sends requests", () => {
  it("User sends request to school successfully", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("test")
    cy.get("#password").type("test")
    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees success message
    cy.findByText(/autentificare cu succes/i).should("exist")

    // clicks on "Scoli" button
    cy.findByRole("button", { name: /scoli/i }).click()

    // Clicks on Scoala nr 1
    cy.findByRole("button", { name: /scoala nr 1\./i }).click()

    // clicks on the "Aplicare" button
    cy.findByRole("button", { name: /aplicare/i }).click()

    // clicks on dropdown
    cy.findByRole("combobox", { name: /nume copil/i }).click()

    // selects child
    cy.findByRole("option", { name: /popescu ion/i }).click()

    // types the required grade
    cy.findByRole("spinbutton", { name: /clasa/i }).type("4")

    // clicks on the "Aplica" button
    cy.findByRole("button", { name: /aplica/i }).click()

    // user sees success message
    cy.findByText(/cererea a fost trimisa cu succes/i).should("exist")
  })

  it("User sends request to school with another request already sent", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("test")
    cy.get("#password").type("test")
    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees success message
    cy.findByText(/autentificare cu succes/i).should("exist")

    // clicks on "Scoli" button
    cy.findByRole("button", { name: /scoli/i }).click()

    // Clicks on Scoala nr 1
    cy.findByRole("button", { name: /scoala nr 1\./i }).click()

    // clicks on the "Aplicare" button
    cy.findByRole("button", { name: /aplicare/i }).click()

    // clicks on dropdown
    cy.findByRole("combobox", { name: /nume copil/i }).click()

    // selects child
    cy.findByRole("option", { name: /popescu ion/i }).click()

    // types the required grade
    cy.findByRole("spinbutton", { name: /clasa/i }).type("4")

    // clicks on the "Aplica" button
    cy.findByRole("button", { name: /aplica/i }).click()

    // user sees success message
    cy.findByText(
      /deja exista o cerere pentru acest copil la aceasta scoala/i,
    ).should("exist")
  })
})
