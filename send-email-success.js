const nodemailer = require('nodemailer');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const repoOwner = "AdoDeveloper";
const repoName = "implantacion-app";

async function sendSuccessEmail() {
  try {
    // Configuración de la cabecera de autenticación
    const headers = {
      Authorization: `Bearer ${process.env.TOKEN_REPO}`, // Usar el token de acceso personal para autenticación
      'Accept': 'application/vnd.github.v3+json',
    };

    // Obtener los últimos 5 commits
    const commitResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=5`, { headers });
    const commits = commitResponse.data;
    
    const lastCommit = commits[0];
    const commitAuthor = lastCommit.commit.author.name;
    const commitEmail = lastCommit.commit.author.email;
    const commitMessage = lastCommit.commit.message;
    const commitDate = new Date(lastCommit.commit.author.date).toLocaleString();
    const commitUrl = lastCommit.html_url;

    // Obtener la URL del pipeline más reciente
    const workflowResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?per_page=1&branch=main&status=completed`, { headers });
    const lastRun = workflowResponse.data.workflow_runs[0];
    const pipelineUrl = lastRun.html_url;
    const pipelineStatus = lastRun.conclusion;
    const pipelineDuration = (new Date(lastRun.updated_at) - new Date(lastRun.created_at)) / 1000;

    // Obtener la lista de colaboradores
    const collaboratorsResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/collaborators`, { headers });
    const collaborators = collaboratorsResponse.data;
    const collaboratorList = collaborators
      .map(collaborator => `${collaborator.login} (${collaborator.html_url})`)
      .join(', ');

    // Crear la lista de los últimos commits para el historial
    const commitHistory = commits.map(commit => `
      <li>
        <strong>Mensaje:</strong> ${commit.commit.message}<br>
        <strong>Autor:</strong> ${commit.commit.author.name} (${commit.commit.author.email})<br>
        <strong>Fecha:</strong> ${new Date(commit.commit.author.date).toLocaleString()}<br>
        <strong>Enlace al commit:</strong> <a href="${commit.html_url}" style="color: #1e88e5;">${commit.sha.substring(0, 7)}</a>
      </li>
    `).join('');

    // Opciones del correo electrónico con toda la información
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'ernestogiron503@gmail.com, gabrielarivas232323@gmail.com, kevinmiguelapariciohernandez@gmail.com',
      subject: '✅ CI/CD Pipeline Exitoso - Información Completa ✅',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;">
          <h2 style="color: #4CAF50;">✅ Las pruebas han pasado exitosamente en el CI/CD Pipeline ✅</h2>
          <p>🎉 Todas las pruebas automatizadas han pasado sin errores. ¡Buen trabajo!</p>
          <p><strong>Último Commit:</strong></p>
          <ul>
            <li><strong>Autor:</strong> ${commitAuthor} (${commitEmail})</li>
            <li><strong>Mensaje del Commit:</strong> ${commitMessage}</li>
            <li><strong>Fecha:</strong> ${commitDate}</li>
            <li><strong>Enlace al Commit:</strong> <a href="${commitUrl}" style="color: #1e88e5; text-decoration: none;">Ver Commit</a></li>
          </ul>
          <p><strong>Estado del último pipeline:</strong></p>
          <ul>
            <li><strong>Estado:</strong> ${pipelineStatus}</li>
            <li><strong>Duración:</strong> ${pipelineDuration} segundos</li>
            <li><strong>Ver Pipeline:</strong> <a href="${pipelineUrl}" style="color: #1e88e5; text-decoration: none;">Ver Detalles</a></li>
          </ul>
          <p><strong>Colaboradores del repositorio:</strong></p>
          <ul>${collaboratorList}</ul>
          <br>
          <p><strong>Historial de commits recientes:</strong></p>
          <ul>${commitHistory}</ul>
          <br>
          <p>Puedes revisar los detalles del pipeline en el siguiente enlace:</p>
          <a href="${pipelineUrl}" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
          <br><br>
          <p>Accede a la aplicación desplegada:</p>
          <a href="https://implantacion-app.onrender.com/products" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Página desplegada</a>
          <br><br>
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
  } catch (error) {
    console.error('Error al obtener información del repositorio o enviar correo:', error.response?.data || error.message);
  }
}

// Ejecutar la función para enviar el correo
sendSuccessEmail();
