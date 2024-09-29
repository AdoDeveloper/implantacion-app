// scripts/send-success-email.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurar el transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Leer los logs de las pruebas
const logsDir = path.join(__dirname, '../../logs');
const logFiles = fs.readdirSync(logsDir);

let attachments = [];

logFiles.forEach((file) => {
  const filePath = path.join(logsDir, file);
  attachments.push({
    filename: file,
    path: filePath,
  });
});

// Configurar las opciones del correo
const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'ernestogiron503@gmail.com, gabrielarivas232323@gmail.com, kevinmiguelapariciohernandez@gmail.com',
  subject: '✅ Éxito en CI/CD Pipeline - Pruebas Pasaron Correctamente ✅',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;">
      <h2 style="color: #4CAF50;">✅ Las pruebas han pasado exitosamente en el CI/CD Pipeline ✅</h2>
      <p>🎉 Todas las pruebas automatizadas han pasado sin errores. El despliegue puede proceder con confianza.</p>
      <p>Puedes revisar los detalles de la ejecución en los archivos adjuntos.</p>
      <p>También puedes revisar los detalles de la ejecución en el siguiente enlace:</p>
      <a href="https://github.com/AdoDeveloper/implantacion-app/actions/workflows/ci-cd.yml" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
      <br><br>
      <p style="color: #4CAF50; font-weight: bold;">¡Buen trabajo! 👍</p>
    </div>
  `,
  attachments: attachments,
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo de éxito:', error);
    process.exit(1);
  } else {
    console.log('Correo de éxito enviado:', info.response);
  }
});
