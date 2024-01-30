import { defineConfig } from "cypress"
import { localHosted, webAppDomainName } from "./src/generalConstants"

export default defineConfig({
  e2e: {
    baseUrl: webAppDomainName,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
