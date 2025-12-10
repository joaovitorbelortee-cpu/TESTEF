// Configuração da API - Netlify Functions
// Em desenvolvimento, usa localhost:3001
// Em produção (Netlify), usa a mesma origem com /api

const getApiBaseUrl = () => {
  // Se tiver variável de ambiente definida, usa ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Se estiver em desenvolvimento (Vite dev server)
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }

  // Em produção (Netlify), usa a mesma origem
  // O netlify.toml redireciona /api/* para /.netlify/functions/api
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api';
  }

  // Fallback
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Log para debug
if (typeof window !== 'undefined') {
  console.log('🔧 API Base URL:', API_BASE_URL);
  console.log('🔧 Ambiente:', import.meta.env.DEV ? 'Desenvolvimento' : 'Produção (Netlify)');
}
