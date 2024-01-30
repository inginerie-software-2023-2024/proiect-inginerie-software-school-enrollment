describe("User Log In", () => {
  it("User logs in successfully", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("test")
    cy.get("#password").type("test")
    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees success message
    cy.findByText(/autentificare cu succes/i).should("exist")
  })

  it("User logs in with inexistent username", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("prajiturica12345")
    cy.get("#password").type("test")

    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees error message
    cy.findByText(/utilizator inexistent/i).should("exist")
  })

  it("User logs in with wrong password", () => {
    // user visits the login page
    cy.visit("/log-in")
    // user enters login details
    cy.findByRole("textbox", { name: /username/i }).type("test")
    cy.get("#password").type("prajiturica12345")

    //user clicks login buttons
    cy.findByRole("button", { name: /log in/i }).click()

    //user sees error message
    cy.findByText(/parola incorecta/i).should("exist")
  })
})
