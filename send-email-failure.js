// send-email-failure.js
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
  subject: '🚨 Error en CI/CD Pipeline 🚨',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #f44336; border-radius: 10px;">
      <h2 style="color: #f44336;">🚨 Las pruebas han fallado en el CI/CD Pipeline 🚨</h2>
      <p>⚠️ Las pruebas automatizadas no han pasado. Por favor, revisa los detalles y soluciona los problemas antes del próximo despliegue.</p>
      <h3>Detalles de las pruebas:</h3>
      ${logsContent}
      <p>Puedes revisar los detalles de la ejecución en el siguiente enlace:</p>
      <a href="https://github.com/AdoDeveloper/implantacion-app/actions/workflows/ci-cd.yml" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
      <br><br>
      <p style="color: #f44336; font-weight: bold;">¡Revisar y corregir los errores lo antes posible! ⏰</p>
    </div>
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo de fallo:', error);
  } else {
    console.log('Correo de fallo enviado:', info.response);
  }
});
