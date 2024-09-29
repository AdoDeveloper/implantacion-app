// send-email-success.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const logDir = path.join(__dirname, 'logs');

let logsContent = '';

try {
  const files = fs.readdirSync(logDir);
  files.forEach(file => {
    const filePath = path.join(logDir, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile()) {
      const data = fs.readFileSync(filePath, 'utf8');
      logsContent += `<h3>${file}</h3><pre>${data}</pre>`;
    }
  });
} catch (error) {
  logsContent = '<p>No se pudieron cargar los logs.</p>';
}

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'ernestogiron503@gmail.com, gabrielarivas232323@gmail.com, kevinmiguelapariciohernandez@gmail.com',
  subject: '✅ Pruebas Pasaron en CI/CD Pipeline ✅',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;">
      <h2 style="color: #4CAF50;">✅ Las pruebas han pasado exitosamente en el CI/CD Pipeline ✅</h2>
      <p>🎉 Todas las pruebas automatizadas han pasado sin errores. El despliegue puede proceder.</p>
      <h3>Detalles de las pruebas:</h3>
      ${logsContent}
      <p>Puedes revisar los detalles de la ejecución en el siguiente enlace:</p>
      <a href="https://github.com/AdoDeveloper/implantacion-app/actions/workflows/ci-cd.yml" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
      <br><br>
      <p style="color: #4CAF50; font-weight: bold;">¡Buen trabajo! 🚀</p>
    </div>
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo de éxito:', error);
  } else {
    console.log('Correo de éxito enviado:', info.response);
  }
});
