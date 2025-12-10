// Configuração da API - Netlify Functions
// Em desenvolvimento, usa localhost:3001
// Em produção (Netlify), usa a mesma origem com /api

const normalizeApiUrl = (url: string) => {
  if (!url) return '';

  // Remove barras duplas no final para evitar //dashboard
  const trimmed = url.replace(/\/+$/, '');

  // Garante que sempre tenha o sufixo /api (muitas implantações do Vercel usam a raiz do projeto)
  if (trimmed.endsWith('/api') || trimmed.includes('/.netlify/functions/api')) {
    return trimmed;
  }

  return `${trimmed}/api`;
};

const getApiBaseUrl = () => {
  // Se tiver variável de ambiente definida, normaliza e usa ela
  if (import.meta.env.VITE_API_URL) {
    return normalizeApiUrl(import.meta.env.VITE_API_URL);
  }

  // Se estiver em desenvolvimento (Vite dev server)
  if (import.meta.env.DEV) {
    return normalizeApiUrl('http://localhost:3001/api');
  }

  // Em produção (Netlify), usa a mesma origem
  // O netlify.toml redireciona /api/* para /.netlify/functions/api
  if (typeof window !== 'undefined') {
    return normalizeApiUrl(window.location.origin);
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
