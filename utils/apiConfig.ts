// Configuração da API - Compatível com Vercel e desenvolvimento local
// Em desenvolvimento, sempre usa localhost:3001
// Em produção (Vercel), usa a mesma origem
const getApiBaseUrl = () => {
  // Se tiver variável de ambiente definida, usa ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Se estiver em desenvolvimento (Vite)
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }
  
  // Em produção, usa a mesma origem
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api';
  }
  
  // Fallback
  return 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Log para debug (apenas em desenvolvimento)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  console.log('🔧 API Base URL:', API_BASE_URL);
}

