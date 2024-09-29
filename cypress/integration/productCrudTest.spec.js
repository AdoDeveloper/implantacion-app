// cypress/integration/productCrudTest.spec.js
describe('CRUD de Productos', () => {
    it('Debería cargar la lista de productos', () => {
        cy.visit('/products')
        cy.contains('Product List', { timeout: 10000 }).should('be.visible') // Verificar que la lista de productos se cargue completamente
    })

    it('Debería crear un nuevo producto', () => {
        cy.visit('/products/new')
        cy.get('input[name="name"]').should('be.visible').type('Producto de Prueba', { delay: 100 })
        cy.get('textarea[name="description"]').should('be.visible').type('Descripción del producto de prueba', { delay: 100 })
        cy.get('input[name="price"]').should('be.visible').type('99.99', { delay: 100 })
        cy.get('form').submit()

        // Verificar la redirección y que el producto esté presente
        cy.url().should('include', '/products', { timeout: 10000 })
        cy.contains('Producto de Prueba', { timeout: 10000 }).should('be.visible')
    })

    it('Debería editar un producto existente', () => {
        cy.visit('/products')
    
        // Buscar el producto y hacer clic
        cy.contains('Producto de Prueba', { timeout: 10000 })
            .should('be.visible')
            .then(($product) => {
                cy.wrap($product).click()
            })
    
        cy.url().should('include', '/products/')
    
        // Hacer clic en el botón de edición
        cy.contains('Edit', { timeout: 10000 })
            .should('be.visible')
            .then(($el) => {
                cy.wrap($el).click()
            })
    
        cy.url().should('include', '/edit')
        cy.contains('Edit Product', { timeout: 10000 }).should('be.visible')

        // **Ajuste realizado aquí**
        cy.get('input[name="name"]').clear()
        cy.get('input[name="name"]').type('Producto Editado', { delay: 100 })

        cy.get('form').submit()
    
        cy.url().should('include', '/products', { timeout: 10000 })
        cy.contains('Producto Editado', { timeout: 10000 }).should('be.visible')
    })
    

    it('Debería mostrar los detalles de un producto y regresar a la lista', () => {
        cy.visit('/products')
        cy.contains('Producto Editado', { timeout: 10000 })
          .should('be.visible')
          .then(() => {
            cy.contains('Producto Editado').click()
          })

        // Verificar que estamos en la página de detalles del producto
        cy.url().should('include', '/products/')
        cy.contains('Product Details', { timeout: 10000 }).should('be.visible')
        cy.contains('Name: Producto Editado').should('be.visible')
        cy.contains('Description: Descripción del producto de prueba').should('be.visible')
        cy.contains('Price: $99.99').should('be.visible')

        // Verificar que el botón está visible
        cy.contains('Back to Product List', { timeout: 10000 }).should('be.visible')

        // Iniciar una nueva cadena para hacer clic
        cy.contains('Back to Product List').click()

        // Verificar la URL en una nueva cadena
        cy.url({ timeout: 10000 }).should('include', '/products')

        cy.contains('Product List', { timeout: 10000 }).should('be.visible')
    })

    it('Debería eliminar un producto existente', () => {
        cy.visit('/products')

        // Buscar y hacer clic en el botón de eliminar para el producto editado
        cy.contains('Producto Editado', { timeout: 10000 })
          .should('be.visible')
          .then(() => {
            cy.contains('Producto Editado').click()
          })

        cy.url().should('include', '/products/')
        cy.contains('Delete', { timeout: 10000 })
          .should('be.visible')
          .then((deleteButton) => {
            cy.wrap(deleteButton).click()
          })

        // Confirmar que el producto fue eliminado y ya no existe en la lista
        cy.url().should('include', '/products', { timeout: 10000 })
        cy.contains('Producto Editado').should('not.exist')
    })
})
