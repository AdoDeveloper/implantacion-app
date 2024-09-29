// send-email-failure.js
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

// Leer los logs de JMeter
const jmeterLogPath = path.join(__dirname, 'testResults.jtl');
let jmeterLog = '';
try {
  jmeterLog = fs.readFileSync(jmeterLogPath, 'utf8');
} catch (err) {
  console.error('No se pudo leer el log de JMeter:', err);
}

// Opciones del correo electrónico
const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'ernestogiron503@gmail.com, gabrielarivas232323@gmail.com, kevinmiguelapariciohernandez@gmail.com',
  subject: '🚨 Error en CI/CD Pipeline 🚨',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #f44336; border-radius: 10px;">
      <h2 style="color: #f44336;">🚨 Las pruebas han fallado en el CI/CD Pipeline 🚨</h2>
      <p>⚠️ Las pruebas automatizadas no han pasado. Por favor, revisa los detalles y soluciona los problemas antes del próximo despliegue.</p>
      <p>Puedes revisar los detalles de la ejecución en el siguiente enlace:</p>
      <a href="https://github.com/AdoDeveloper/implantacion-app/actions/workflows/ci-cd.yml" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
      <br><br>
      <h3 style="color: #f44336;">📄 Resumen de Pruebas de Cypress:</h3>
      <pre>${cypressReport}</pre>
      <h3 style="color: #f44336;">📄 Resumen de Logs de JMeter:</h3>
      <pre>${jmeterLog}</pre>
      <p style="color: #f44336; font-weight: bold;">¡Revisar y corregir los errores lo antes posible! ⏰</p>
    </div>
  `,
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo de fallo:', error);
  } else {
    console.log('Correo de fallo enviado:', info.response);
  }
});
