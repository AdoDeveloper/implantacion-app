const fs = require('fs');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function seleniumTest() {
  // Configurar las opciones de Chrome
  let options = new chrome.Options();
  options.addArguments('--headless'); // Ejecutar en modo headless
  options.addArguments('--no-sandbox'); // Bypass OS security model
  options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
  options.addArguments('--disable-gpu'); // Deshabilitar GPU
  options.addArguments('--window-size=1920,1080'); // Definir tamaño de ventana

  // Crear una instancia del WebDriver
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    // Navegar a la página de productos
    await driver.get('http://localhost:3000/products'); // Asegúrate de que el puerto sea 3001

    let title = await driver.getTitle();
    console.log(`Título de la página: ${title}`);

    // Verificar si estamos en la página correcta
    if (title !== 'Product List') {
      console.error('La página de productos no se cargó correctamente');
      return;
    }

    // Listar todos los enlaces en la página para depuración
    let links = await driver.findElements(By.tagName('a'));
    console.log('Enlaces encontrados en la página:');
    for (let link of links) {
      let text = await link.getText();
      console.log(`- ${text}`);
    }

    // Intentar encontrar el enlace "Add Product" con diferentes selectores
    let addLink;
    try {
      addLink = await driver.findElement(By.linkText('Add Product'));
      await addLink.click();
    } catch (err) {
      console.warn('No se encontró el enlace "Add Product" por texto completo, intentando con texto parcial...');
      try {
        addLink = await driver.findElement(By.partialLinkText('Add'));
        await addLink.click();
      } catch (err2) {
        console.warn('No se encontró el enlace con texto parcial, intentando con selector CSS basado en href...');
        try {
          addLink = await driver.findElement(By.css('a[href="/products/new"]'));
          await addLink.click();
        } catch (err3) {
          console.error('No se pudo encontrar el enlace "Add Product" con los selectores disponibles.');
          throw err3;
        }
      }
    }

    // Esperar a que el formulario de creación esté disponible
    await driver.wait(until.elementLocated(By.name('name')), 10000);

    // Completar el formulario de creación
    await driver.findElement(By.name('name')).sendKeys('Producto de Selenium');
    await driver.findElement(By.name('description')).sendKeys('Descripción de prueba con Selenium');
    await driver.findElement(By.name('price')).sendKeys('29.99');

    // Enviar el formulario
    await driver.findElement(By.css('form')).submit();

    // Esperar a que el producto aparezca en la lista
    await driver.wait(until.elementLocated(By.xpath(`//a[text()='Producto de Selenium']`)), 10000);
    console.log('Producto creado con éxito.');

    // **Editar el producto**
    console.log('Editando el producto...');
    let editButton = await driver.findElement(By.xpath(`//a[text()='Producto de Selenium']/ancestor::li//a[text()='Edit']`));
    await editButton.click();
    await driver.wait(until.elementLocated(By.name('name')), 10000);

    // Actualizar el nombre del producto
    let nameField = await driver.findElement(By.name('name'));
    await nameField.clear();
    await nameField.sendKeys('Producto de Selenium Editado');
    await driver.findElement(By.css('form')).submit();

    // Verificar si el nombre se ha actualizado
    await driver.wait(until.elementLocated(By.xpath(`//a[text()='Producto de Selenium Editado']`)), 10000);
    console.log('Producto editado con éxito.');

    // **Visualizar los detalles del producto**
    console.log('Visualizando los detalles del producto...');
    let viewLink = await driver.findElement(By.xpath(`//a[text()='Producto de Selenium Editado']`));
    await viewLink.click();
    await driver.wait(until.elementLocated(By.xpath(`//h1[text()='Product Details']`)), 10000);

    console.log('Verificando los detalles del producto...');
    // Verificar los detalles del producto
    const productNameElement = await driver.findElement(By.xpath(`//strong[text()='Name:']/parent::p`));
    const productDescriptionElement = await driver.findElement(By.xpath(`//strong[text()='Description:']/parent::p`));
    const productPriceElement = await driver.findElement(By.xpath(`//strong[text()='Price:']/parent::p`));

    const productNameText = await productNameElement.getText(); // "Name: Producto de Selenium Editado"
    const productDescriptionText = await productDescriptionElement.getText(); // "Description: Descripción de prueba con Selenium"
    const productPriceText = await productPriceElement.getText(); // "Price: $29.99"

    // Extraer los valores después de los dos puntos
    const productName = productNameText.split(': ')[1];
    const productDescription = productDescriptionText.split(': ')[1];
    const productPrice = productPriceText.split(': ')[1];

    if (
      productName === 'Producto de Selenium Editado' &&
      productDescription === 'Descripción de prueba con Selenium' &&
      productPrice === '$29.99'
    ) {
      console.log('Detalles del producto mostrados correctamente.');
    } else {
      console.error('Los detalles del producto no coinciden con los esperados.');
      throw new Error('Detalles del producto incorrectos.');
    }

    // **Volver a la lista de productos**
    let backButton = await driver.findElement(By.linkText('Back to Product List'));
    await backButton.click();
    await driver.wait(until.elementLocated(By.xpath(`//a[text()='Producto de Selenium Editado']`)), 10000);

    // **Eliminar el producto**
    console.log('Eliminando el producto...');
    let deleteButton = await driver.findElement(By.xpath(`//a[text()='Producto de Selenium Editado']/ancestor::li//button[@name='delete']`));
    await deleteButton.click();

    // Confirmar que el producto ha sido eliminado
    await driver.wait(async () => {
      let elements = await driver.findElements(By.xpath(`//a[text()='Producto de Selenium Editado']`));
      return elements.length === 0;
    }, 10000, 'El producto no fue eliminado a tiempo');
    console.log('Producto eliminado con éxito.');

  } catch (error) {
    console.error('Error durante la ejecución de la prueba:', error);
    // Capturar pantalla en caso de error
    try {
      let screenshot = await driver.takeScreenshot();
      fs.writeFileSync('error_screenshot.png', screenshot, 'base64');
      console.log('Captura de pantalla guardada como error_screenshot.png');
    } catch (screenshotError) {
      console.error('Error al capturar la pantalla:', screenshotError);
    }
    process.exit(1); // Finalizar con un código de error
  } finally {
    await driver.quit();
  }
})();
