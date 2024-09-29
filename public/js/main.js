// Confirmar antes de eliminar un producto
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('button[name="delete"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const confirmed = confirm('¿Estás seguro de que deseas eliminar este producto?');
            if (!confirmed) {
                event.preventDefault();
            }
        });
    });
    
    // Validación simple para el formulario
    const productForm = document.querySelector('form');
    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            const nameInput = document.querySelector('input[name="name"]');
            const priceInput = document.querySelector('input[name="price"]');

            if (nameInput.value.trim() === '' || priceInput.value.trim() === '') {
                alert('Por favor, completa todos los campos.');
                event.preventDefault();
            }
        });
    }
});
