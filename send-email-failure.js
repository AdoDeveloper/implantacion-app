// send-email-failure.js

const nodemailer = require('nodemailer');
const fs = require('fs');

// Leer los logs de errores (asegúrate de generar este archivo durante las pruebas)
const errorLog = fs.existsSync('error.log') ? fs.readFileSync('error.log', 'utf-8') : 'No se encontraron logs de errores.';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'ernestogiron503@gmail.com, gabrielarivas232323@gmail.com, kevinmiguelapariciohernandez@gmail.com',
  subject: '🚨 Error en CI/CD Pipeline 🚨',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #f44336; border-radius: 10px;">
      <h2 style="color: #f44336;">🚨 Las pruebas han fallado en el CI/CD Pipeline 🚨</h2>
      <p>⚠️ Las pruebas automatizadas no han pasado. Por favor, revisa los detalles y soluciona los problemas antes del próximo despliegue.</p>
      <p>A continuación se muestra el log de errores:</p>
      <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${errorLog}</pre>
      <p>Puedes revisar los detalles de la ejecución en el siguiente enlace:</p>
      <a href="${process.env.GITHUB_RUN_URL}" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
      <br><br>
      <p style="color: #f44336; font-weight: bold;">¡Revisar y corregir los errores lo antes posible! ⏰</p>
    </div>
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo de falla:', error);
  } else {
    console.log('Correo de falla enviado:', info.response);
  }
});
