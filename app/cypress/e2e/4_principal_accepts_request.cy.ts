describe("Principal accepts request", () => {
  it("Principal accepts request successfully", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("admin")
    cy.get("#password").type("admin")
    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees success message
    cy.findByText(/autentificare cu succes/i).should("exist")

    // goes to profile
    cy.findByRole("button", { name: /admin/i }).click()

    // clicks on dropdown
    cy.findByRole("combobox", { name: /without label/i }).click()

    // selects Director role
    cy.findByRole("option", { name: /director/i }).click()

    // clicks on "Schimba rol" button
    cy.findByRole("button", { name: /schimba rol/i }).click()

    // clicks on "Scoala mea" button
    cy.findByRole("button", { name: /scoala mea/i }).click()

    cy.findByRole("heading", { name: /cereri de inscriere/i }).scrollIntoView()

    // scroll into view and get rowHeader
    const rowHeader = cy.findByRole("rowheader", { name: /popescu ion/i })
    rowHeader.scrollIntoView()

    // Within the row, get the "Accept" button and click it
    rowHeader
      .nextAll()
      .eq(2)
      .findByRole("button", { name: /accepta/i })
      .click()

    // user sees success message
    cy.findByText(/statusul cererii a fost modificat cu succes/i).should(
      "exist",
    )
  })
})
