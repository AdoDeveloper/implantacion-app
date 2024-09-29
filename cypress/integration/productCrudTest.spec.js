describe('CRUD de Productos', () => {
    it('Debería cargar la lista de productos', () => {
        cy.visit('/products')
        cy.contains('Product List')
    })

    it('Debería crear un nuevo producto', () => {
        cy.visit('/products/new')
        cy.get('input[name="name"]').type('Producto de Prueba')
        cy.get('textarea[name="description"]').type('Descripción del producto de prueba')
        cy.get('input[name="price"]').type('99.99')
        cy.get('form').submit()
        
        // Esperar a que la redirección ocurra y verificar que el nuevo producto esté presente
        cy.url().should('include', '/products')
        cy.contains('Producto de Prueba', { timeout: 10000 }) // Aumentar el timeout para dar tiempo a la carga
    })

    it('Debería editar un producto existente', () => {
        cy.visit('/products')
        cy.contains('Producto de Prueba').click()
        cy.url().should('include', '/products/')
        
        // Hacer clic en el botón de edición para ir a la página de edición
        cy.contains('Edit').click()
        cy.url().should('include', '/edit')

        // Verificar que la página de edición se cargue correctamente
        cy.contains('Edit Product', { timeout: 10000 }) // Asegurarse de que la página esté cargada
        cy.get('input[name="name"]').clear().type('Producto Editado')
        cy.get('form').submit()
        
        // Confirmar que el producto fue editado y redirigido a la lista
        cy.url().should('include', '/products')
        cy.contains('Producto Editado', { timeout: 10000 })
    })

    it('Debería mostrar los detalles de un producto y regresar a la lista', () => {
        cy.visit('/products')
        cy.contains('Producto Editado').click() // Hacer clic en el producto para ver detalles
        
        // Verificar que estamos en la página de detalles del producto
        cy.url().should('include', '/products/')
        cy.contains('Product Details')
        cy.contains('Name: Producto Editado')
        cy.contains('Description: Descripción del producto de prueba')
        cy.contains('Price: $99.99')
        
        // Verificar el enlace de regreso a la lista
        cy.contains('Back to Product List').click()
        
        // Asegurarnos de que regresamos a la lista de productos
        cy.url().should('include', '/products')
        cy.contains('Product List'),{ timeout: 3000 }
    })
    

    it('Debería eliminar un producto existente', () => {
        cy.visit('/products')
        
        // Buscar y hacer clic en el botón de eliminar para el producto editado
        cy.contains('Producto Editado').click()
        cy.url().should('include', '/products/')
        cy.contains('Delete').click()
        
        // Confirmar que el producto fue eliminado y ya no existe en la lista
        cy.url().should('include', '/products')
        cy.contains('Producto Editado').should('not.exist'),{ timeout: 3000 }
    })
})
