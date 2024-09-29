const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'ernestogiron503@example.com',
  subject: 'Error en CI/CD Pipeline',
  text: 'Las pruebas han fallado. Por favor, revisa el pipeline.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo:', error);
  } else {
    console.log('Correo enviado:', info.response);
  }
});
