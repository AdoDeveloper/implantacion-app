// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents() {
      // Implementar cualquier evento o plugin si es necesario
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/integration/**/*.spec.js',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
  },
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  downloadsFolder: "cypress/downloads",
  fixturesFolder: "cypress/fixtures"
});
