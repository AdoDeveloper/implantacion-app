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

// Función para formatear la fecha y hora en el formato de El Salvador
function formatDateToElSalvador(dateString) {
  return new Intl.DateTimeFormat('es-SV', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/El_Salvador',
  }).format(new Date(dateString));
}

async function sendFailureEmail() {
  try {
    // Configuración de la cabecera de autenticación
    const headers = {
      Authorization: `Bearer ${process.env.TOKEN_REPO}`, // Usar el token de acceso personal para autenticación
      'Accept': 'application/vnd.github.v3+json',
    };

    // Obtener información del repositorio
    const repoResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}`, { headers });
    const repoDetails = repoResponse.data;
    const repoDescription = repoDetails.description || 'Sin descripción';
    const repoStars = repoDetails.stargazers_count;
    const repoForks = repoDetails.forks_count;
    const repoWatchers = repoDetails.watchers_count;
    const repoUrl = repoDetails.html_url;
    const repoCreatedAt = formatDateToElSalvador(repoDetails.created_at);
    const repoUpdatedAt = formatDateToElSalvador(repoDetails.updated_at);

    // Obtener los últimos 5 commits
    const commitResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=5`, { headers });
    const commits = commitResponse.data;

    const lastCommit = commits[0];
    const commitAuthor = lastCommit.commit.author.name;
    const commitEmail = lastCommit.commit.author.email;
    const commitMessage = lastCommit.commit.message;
    const commitDate = formatDateToElSalvador(lastCommit.commit.author.date);
    const commitUrl = lastCommit.html_url;

    // Obtener la URL del pipeline más reciente con status failure
    const workflowResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?per_page=1&branch=main&status=failure`, { headers });
    const failedRun = workflowResponse.data.workflow_runs[0];
    const failedRunId = failedRun ? failedRun.id : 'Desconocido';
    const pipelineUrl = failedRun ? failedRun.html_url : 'No se encontró la URL del pipeline fallido';
    const pipelineStartTime = failedRun ? formatDateToElSalvador(failedRun.created_at) : 'Desconocido';
    const pipelineEndTime = failedRun ? formatDateToElSalvador(failedRun.updated_at) : 'Desconocido';
    const pipelineDuration = failedRun ? ((new Date(failedRun.updated_at) - new Date(failedRun.created_at)) / 1000).toFixed(2) : 'Desconocido';

    // Obtener los resultados de las pruebas
    const testSummaryResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs/${failedRunId}/jobs`, { headers });
    const tests = testSummaryResponse.data.jobs.reduce((acc, job) => {
      acc.total += job.steps.length;
      acc.passed += job.steps.filter(step => step.conclusion === 'success').length;
      acc.failed += job.steps.filter(step => step.conclusion === 'failure').length;
      return acc;
    }, { total: 0, passed: 0, failed: 0 });

    // Obtener la lista de colaboradores
    const collaboratorsResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/collaborators`, { headers });
    const collaborators = collaboratorsResponse.data;
    const collaboratorList = collaborators
      .map(collaborator => `<li>${collaborator.login} - <a href="${collaborator.html_url}" style="color: #1e88e5;">Perfil de GitHub</a></li>`)
      .join('');

    // Crear la lista de los últimos commits para el historial
    const commitHistory = commits.map(commit => `
      <li>
        <strong>Mensaje:</strong> ${commit.commit.message}<br>
        <strong>Autor:</strong> ${commit.commit.author.name} (${commit.commit.author.email})<br>
        <strong>Fecha:</strong> ${formatDateToElSalvador(commit.commit.author.date)}<br>
        <strong>Enlace al commit:</strong> <a href="${commit.html_url}" style="color: #1e88e5;">${commit.sha}</a>
      </li>
    `).join('');

    // Opciones del correo electrónico
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'ernestogiron503@gmail.com, gabrielarivas232323@gmail.com, kevinmiguelapariciohernandez@gmail.com',
      subject: `🚨 Error en CI/CD Pipeline (ID: ${failedRunId}) 🚨`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #f44336; border-radius: 10px;">
          <h2 style="color: #f44336;">🚨 Las pruebas han fallado en el CI/CD Pipeline 🚨</h2>
          <p>⚠️ Las pruebas automatizadas no han pasado. Por favor, revisa los detalles y soluciona los problemas antes del próximo despliegue.</p>

          <h3>🔍 Información del Repositorio</h3>
          <ul>
            <li><strong>Nombre del Repositorio:</strong> ${repoName}</li>
            <li><strong>Descripción:</strong> ${repoDescription}</li>
            <li><strong>Estrellas:</strong> ⭐ ${repoStars}</li>
            <li><strong>Bifurcaciones:</strong> 🍴 ${repoForks}</li>
            <li><strong>Vigilantes:</strong> 👀 ${repoWatchers}</li>
            <li><strong>Creado en:</strong> ${repoCreatedAt}</li>
            <li><strong>Última actualización:</strong> ${repoUpdatedAt}</li>
            <li><strong>Enlace al repositorio:</strong> <a href="${repoUrl}" style="color: #1e88e5; text-decoration: none;">Ver Repositorio</a></li>
          </ul>

          <h3>📝 Último Commit que provocó el fallo</h3>
          <ul>
            <li><strong>Autor:</strong> ${commitAuthor} (${commitEmail})</li>
            <li><strong>Mensaje del Commit:</strong> ${commitMessage}</li>
            <li><strong>Fecha:</strong> ${commitDate}</li>
            <li><strong>Enlace al Commit:</strong> <a href="${commitUrl}" style="color: #1e88e5; text-decoration: none;">Ver Commit</a></li>
          </ul>

          <h3>🔍 Detalles del Pipeline Fallido:</h3>
          <ul>
            <li><strong>Inicio:</strong> ${pipelineStartTime}</li>
            <li><strong>Fin:</strong> ${pipelineEndTime}</li>
            <li><strong>Duración:</strong> ${pipelineDuration} segundos</li>
            <li><strong>Ver Pipeline:</strong> <a href="${pipelineUrl}" style="color: #1e88e5; text-decoration: none;">Ver Detalles</a></li>
          </ul>

          <h3>🔍 Resultados de las Pruebas:</h3>
          <ul>
            <li>Total Pruebas: ${tests.total}</li>
            <li>Aprobadas: ${tests.passed}</li>
            <li>Fallidas: ${tests.failed}</li>
          </ul>

          <h3>👥 Colaboradores del Repositorio</h3>
          <ul>${collaboratorList}</ul>

          <h3>📜 Historial de Commits Recientes</h3>
          <ul>${commitHistory}</ul>

          <h3>🌐 Enlaces Importantes</h3>
          <p>Puedes revisar los detalles del pipeline fallido en el siguiente enlace:</p>
          <a href="${pipelineUrl}" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline</a>
          <br><br>
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
  } catch (error) {
    console.error('Error al obtener información del repositorio o enviar correo:', error.response?.data || error.message);
  }
}

// Ejecutar la función para enviar el correo
sendFailureEmail();
