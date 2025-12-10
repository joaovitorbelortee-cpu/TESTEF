
import serverless from 'serverless-http';
import app from '../../api/index.js'; // Importa o app Express existente

export const handler = serverless(app);
