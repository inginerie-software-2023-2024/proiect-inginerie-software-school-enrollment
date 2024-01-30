import { domainName } from "../../src/generalConstants"

describe("Parent confirms enrollment", () => {
  // after(() => {
  //   cy.wait(2000)

  //   cy.request({
  //     method: "DELETE",
  //     url: `${domainName}/students/deleteByCNP/${5179845612478}`,
  //   }).then((response) => {
  //     expect(response.status).to.eq(200)
  //   })
  // })
  it("Parent confirms enrollment successfully", () => {
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

    // Open child details
    const rowCNPCell = cy.findByRole("cell", { name: /5179845612478/i })
    rowCNPCell.scrollIntoView()
    rowCNPCell.click()

    // Find the "Scoala nr 1" entry in the table
    const rowHeader = cy.findByRole("rowheader", { name: /scoala nr 1\./i })
    rowHeader
      .nextAll()
      .eq(2)
      .findByRole("button", { name: /confirma/i })
      .click()

    // user sees success message
    cy.findByText(/statusul cererii a fost modificat cu succes/i)
  })
})
