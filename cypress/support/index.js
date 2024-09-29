// cypress/support/index.js
// Importar comandos personalizados, si es necesario
// Puedes agregar comandos personalizados aquí
Cypress.on('uncaught:exception', () => {
    // Retornar false para evitar que las excepciones no capturadas
    // interrumpan las pruebas
    return false
  })
  