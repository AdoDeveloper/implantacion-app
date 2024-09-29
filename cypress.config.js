// cypress.config.js
module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // Implementar cualquier evento o plugin si es necesario
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/integration/**/*.spec.js',
  },
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  downloadsFolder: "cypress/downloads",
  fixturesFolder: "cypress/fixtures"
}
