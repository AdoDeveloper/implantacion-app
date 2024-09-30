import nodemailer from 'nodemailer';
import { Octokit } from '@octokit/rest';

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Configurar Octokit para acceder a la API de GitHub
const octokit = new Octokit({
  auth: process.env.TOKEN_REPO, // Usar TOKEN_REPO desde las variables de entorno
});

const repoOwner = "AdoDeveloper";
const repoName = "implantacion-app";

async function sendFailureEmail() {
  try {
    // Obtener información del último commit (push o merge que desencadenó el fallo)
    const commits = await octokit.repos.listCommits({
      owner: repoOwner,
      repo: repoName,
      per_page: 5,
    });

    const lastCommit = commits.data[0];
    const commitAuthor = lastCommit.commit.author.name;
    const commitEmail = lastCommit.commit.author.email;
    const commitMessage = lastCommit.commit.message;
    const commitDate = new Date(lastCommit.commit.author.date).toLocaleString();
    const commitUrl = lastCommit.html_url;

    // Obtener la lista completa de colaboradores
    const collaborators = await octokit.repos.listCollaborators({
      owner: repoOwner,
      repo: repoName,
    });

    const collaboratorList = collaborators.data
      .map(collaborator => `${collaborator.login} (${collaborator.html_url})`)
      .join(', ');

    // Obtener la URL del pipeline fallido
    const workflowRuns = await octokit.actions.listWorkflowRunsForRepo({
      owner: repoOwner,
      repo: repoName,
      per_page: 1,
      branch: "main",
      status: "failure",
    });

    const failedRun = workflowRuns.data.workflow_runs[0];
    const pipelineUrl = failedRun ? failedRun.html_url : 'No se encontró la URL del pipeline fallido';
    const failedRunId = failedRun ? failedRun.id : 'Desconocido';

    // Crear la lista de commits recientes para más contexto
    const commitHistory = commits.data.map(commit => `
      <li>
        <strong>Mensaje:</strong> ${commit.commit.message}<br>
        <strong>Autor:</strong> ${commit.commit.author.name} (${commit.commit.author.email})<br>
        <strong>Fecha:</strong> ${new Date(commit.commit.author.date).toLocaleString()}<br>
        <strong>Enlace al commit:</strong> <a href="${commit.html_url}" style="color: #1e88e5;">${commit.sha.substring(0, 7)}</a>
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
          <p><strong>Último Commit que provocó el fallo:</strong></p>
          <ul>
            <li><strong>Autor:</strong> ${commitAuthor} (${commitEmail})</li>
            <li><strong>Mensaje del Commit:</strong> ${commitMessage}</li>
            <li><strong>Fecha:</strong> ${commitDate}</li>
            <li><strong>Enlace al Commit:</strong> <a href="${commitUrl}" style="color: #1e88e5; text-decoration: none;">Ver Commit</a></li>
          </ul>
          <p><strong>Colaboradores recientes:</strong></p>
          <ul>${collaboratorList}</ul>
          <br>
          <p><strong>Historial de commits recientes:</strong></p>
          <ul>${commitHistory}</ul>
          <br>
          <p>Puedes revisar los detalles del pipeline fallido en el siguiente enlace:</p>
          <a href="${pipelineUrl}" style="color: #1e88e5; text-decoration: none; font-weight: bold;">🔗 Ver detalles del pipeline fallido</a>
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
    console.error('Error al obtener información del repositorio o enviar correo:', error);
  }
}

// Ejecutar la función para enviar el correo
sendFailureEmail();
