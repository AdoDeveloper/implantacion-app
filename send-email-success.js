// send-email-success.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Leer los informes de las pruebas
const cypressReportPath = path.join(__dirname, 'cypress', 'reports', 'mochawesome.json');
let cypressReport = '';
try {
  cypressReport = fs.readFileSync(cypressReportPath, 'utf8');
} catch (err) {
  console.error('No se pudo leer el informe de Cypress:', err);
}

// Opciones del correo electrónico
const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'ernestogiron503@gmail.com, gabrielarivas232323@gmail.com, kevinmiguelapariciohernandez@gmail.com',
  subject: '✅ CI/CD Pipeline Exitoso ✅',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;">
      <h2 style="color: #4CAF50;">✅ Las pruebas han pasado exitosamente en el CI/CD Pipeline ✅</h2>
      <p>🎉 Todas las pruebas automatizadas han pasado sin errores. ¡Buen trabajo!</p>
      <p>Puedes revisar los detalles de la ejecución en el siguiente enlace:</p>
      <a href="https://github.com/AdoDeveloper/implantacion-app/actions/workflows/ci-cd.yml" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
      <br><br>
      <h3 style="color: #4CAF50;">📄 Resumen de Pruebas:</h3>
      <pre>${cypressReport}</pre>
      <p style="color: #4CAF50; font-weight: bold;">¡Continúa con el excelente trabajo! 🚀</p>
    </div>
  `,
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo de éxito:', error);
  } else {
    console.log('Correo de éxito enviado:', info.response);
  }
});
