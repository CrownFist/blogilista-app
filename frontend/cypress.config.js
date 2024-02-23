import { defineConfig } from 'cypress'
import 'dotenv/config'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3003',
  },
  env: {
    BACKEND: 'http://localhost:3003/api',
    CYPRESS_USER: `${process.env.CYPRESS_USER}`,
    CYPRESS_PASSWORD: `${process.env.CYPRESS_PASSWORD}`,
  },
})
